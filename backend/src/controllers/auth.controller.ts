import { type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcryptjs";
import { type ZodError } from "zod";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { UserModel } from "../models/user.model.js";
import { signAccessToken } from "../utils/jwt.js";

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

    const accessToken = signAccessToken(String(user._id));
    res.status(200).json({
      accessToken,
      user: { id: String(user._id), email: user.email },
    });
  } catch (err) {
    next(err);
  }
}
