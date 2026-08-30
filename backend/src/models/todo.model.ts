import { Schema, model } from "mongoose";
import { emptyRichTextDoc } from "../schemas/richText.schema.js";

const todoSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    content: { type: Schema.Types.Mixed, default: emptyRichTextDoc },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const TodoModel = model("Todo", todoSchema);
