import { Schema, model } from "mongoose";

const authSessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenHash: { type: String, required: true, unique: true },
    previousTokenHash: { type: String },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

authSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const AuthSessionModel = model("AuthSession", authSessionSchema);
