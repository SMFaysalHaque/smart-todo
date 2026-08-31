import { z } from "zod";

// Rich-text content is stored as a Tiptap (ProseMirror) JSON document.
// We validate a controlled subset of nodes and marks — only the features this
// project actually supports — instead of trusting arbitrary editor JSON.

const boldMark = z.object({ type: z.literal("bold") }).strict();
const italicMark = z.object({ type: z.literal("italic") }).strict();
const textStyleMark = z
  .object({
    type: z.literal("textStyle"),
    attrs: z
      .object({
        color: z.string().optional(),
        fontWeight: z.union([z.string(), z.number()]).optional(),
      })
      .strict(),
  })
  .strict();

const mark = z.discriminatedUnion("type", [boldMark, italicMark, textStyleMark]);

const textNode = z
  .object({
    type: z.literal("text"),
    text: z.string().min(1),
    marks: z.array(mark).optional(),
  })
  .strict();

const hardBreakNode = z.object({ type: z.literal("hardBreak") }).strict();

const inlineNode = z.union([textNode, hardBreakNode]);

// blockNode is recursive (lists contain items that contain blocks), so it is
// defined lazily.
const blockNode: z.ZodType = z.lazy(() =>
  z.discriminatedUnion("type", [
    paragraphNode,
    headingNode,
    bulletListNode,
    orderedListNode,
    taskListNode,
  ]),
);

const paragraphNode = z
  .object({
    type: z.literal("paragraph"),
    content: z.array(inlineNode).optional(),
  })
  .strict();

const headingNode = z
  .object({
    type: z.literal("heading"),
    attrs: z.object({ level: z.number().int().min(1).max(6) }).strict(),
    content: z.array(inlineNode).optional(),
  })
  .strict();

const listItemNode = z
  .object({
    type: z.literal("listItem"),
    content: z.array(blockNode),
  })
  .strict();

const bulletListNode = z
  .object({
    type: z.literal("bulletList"),
    content: z.array(listItemNode),
  })
  .strict();

const orderedListNode = z
  .object({
    type: z.literal("orderedList"),
    attrs: z.object({ start: z.number().int() }).strict().optional(),
    content: z.array(listItemNode),
  })
  .strict();

const taskItemNode = z
  .object({
    type: z.literal("taskItem"),
    attrs: z.object({ checked: z.boolean() }).strict(),
    content: z.array(blockNode),
  })
  .strict();

const taskListNode = z
  .object({
    type: z.literal("taskList"),
    content: z.array(taskItemNode),
  })
  .strict();

export const richTextDocSchema = z
  .object({
    type: z.literal("doc"),
    content: z.array(blockNode).min(1),
  })
  .strict();

export function emptyRichTextDoc(): z.infer<typeof richTextDocSchema> {
  return { type: "doc", content: [{ type: "paragraph" }] };
}
