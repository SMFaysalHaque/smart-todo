import { type Response } from "express";
import { type ZodError } from "zod";

export function sendValidationError(res: Response, error: ZodError): void {
  res.status(400).json({
    error: "Validation failed",
    details: error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    })),
  });
}
