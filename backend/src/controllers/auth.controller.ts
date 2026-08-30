import { type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcryptjs";
import { type ZodError } from "zod";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { UserModel } from "../models/user.model.js";
import { AuthSessionModel } from "../models/authSession.model.js";
import { signAccessToken } from "../utils/jwt.js";
import { generateRefreshToken, hashRefreshToken } from "../utils/refreshToken.js";
import {
  REFRESH_COOKIE_NAME,
  REFRESH_TOKEN_TTL_MS,
  refreshCookieOptions,
  clearRefreshCookieOptions,
} from "../config/cookie.js";

function isDuplicateKeyError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: number }).code === 11000
  );
}

function sendValidationError(res: Response, error: ZodError): void {
  res.status(400).json({
    error: "Validation failed",
    details: error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    })),
  });
}

function refreshExpiryDate(): Date {
  return new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    sendValidationError(res, parsed.error);
    return;
  }

  const { email, password } = parsed.data;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ email, passwordHash });
    res.status(201).json({ id: String(user._id), email: user.email });
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      res.status(409).json({ error: "Email is already registered" });
      return;
    }
    next(err);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    sendValidationError(res, parsed.error);
    return;
  }

  const { email, password } = parsed.data;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const rawRefreshToken = generateRefreshToken();
    await AuthSessionModel.create({
      userId: user._id,
      tokenHash: hashRefreshToken(rawRefreshToken),
      expiresAt: refreshExpiryDate(),
    });
    res.cookie(REFRESH_COOKIE_NAME, rawRefreshToken, refreshCookieOptions);

    const accessToken = signAccessToken(String(user._id));
    res.status(200).json({
      accessToken,
      user: { id: String(user._id), email: user.email },
    });
  } catch (err) {
    next(err);
  }
}

export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const rawToken: unknown = req.cookies?.[REFRESH_COOKIE_NAME];
  if (typeof rawToken !== "string") {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const tokenHash = hashRefreshToken(rawToken);

  try {
    const session = await AuthSessionModel.findOne({ tokenHash });

    if (!session) {
      // The token matches no active session. If it was the immediately
      // previous (already-rotated) token, this is a reuse attempt: destroy
      // that session so a stolen token cannot be leveraged further.
      const reused = await AuthSessionModel.findOne({
        previousTokenHash: tokenHash,
      });
      if (reused) {
        await reused.deleteOne();
      }
      res.clearCookie(REFRESH_COOKIE_NAME, clearRefreshCookieOptions);
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    if (session.expiresAt.getTime() <= Date.now()) {
      await session.deleteOne();
      res.clearCookie(REFRESH_COOKIE_NAME, clearRefreshCookieOptions);
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const user = await UserModel.findById(session.userId);
    if (!user) {
      await session.deleteOne();
      res.clearCookie(REFRESH_COOKIE_NAME, clearRefreshCookieOptions);
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const newRawToken = generateRefreshToken();
    session.previousTokenHash = session.tokenHash;
    session.tokenHash = hashRefreshToken(newRawToken);
    session.expiresAt = refreshExpiryDate();
    await session.save();

    res.cookie(REFRESH_COOKIE_NAME, newRawToken, refreshCookieOptions);

    const accessToken = signAccessToken(String(user._id));
    res.status(200).json({
      accessToken,
      user: { id: String(user._id), email: user.email },
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const rawToken: unknown = req.cookies?.[REFRESH_COOKIE_NAME];

  try {
    if (typeof rawToken === "string") {
      await AuthSessionModel.deleteOne({ tokenHash: hashRefreshToken(rawToken) });
    }
    res.clearCookie(REFRESH_COOKIE_NAME, clearRefreshCookieOptions);
    res.status(200).json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
}
