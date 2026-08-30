import { type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcryptjs";
import { registerSchema } from "../schemas/auth.schema.js";
import { UserModel } from "../models/user.model.js";

function isDuplicateKeyError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: number }).code === 11000
  );
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Validation failed",
      details: parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
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
