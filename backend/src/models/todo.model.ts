import { Schema, model } from "mongoose";

const todoSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    content: { type: String, default: "" },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const TodoModel = model("Todo", todoSchema);
