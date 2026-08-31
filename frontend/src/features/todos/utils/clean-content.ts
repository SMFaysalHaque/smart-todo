import { type JSONContent } from "@tiptap/react";

// Tiptap sometimes emits attributes whose value is `null` (for example an unset
// `color` on a textStyle mark, or an unset `type` on an ordered list). The
// backend's Zod schema is strict and rejects `null` / unknown attributes, so we
// remove empty attribute values before saving.
//
// This does NOT change the document structure — it only drops null/undefined
// attribute values, and removes an attribute object entirely once it is empty.

export function cleanContent(node: JSONContent): JSONContent {
  const result: JSONContent = { ...node };

  // Node-level attributes: drop null/undefined; drop the whole `attrs` key if
  // nothing is left (nodes like paragraph/bulletList take no attributes).
  if (result.attrs) {
    const kept = Object.entries(result.attrs).filter(
      ([, value]) => value !== null && value !== undefined,
    );
    if (kept.length > 0) result.attrs = Object.fromEntries(kept);
    else delete result.attrs;
  }

  // Mark-level attributes: drop null/undefined values (keep the mark itself;
  // a real textStyle mark always keeps at least a color or fontWeight).
  if (result.marks) {
    result.marks = result.marks.map((mark) => {
      if (!mark.attrs) return mark;
      const kept = Object.entries(mark.attrs).filter(
        ([, value]) => value !== null && value !== undefined,
      );
      return { ...mark, attrs: Object.fromEntries(kept) };
    });
  }

  if (result.content) {
    result.content = result.content.map(cleanContent);
  }

  return result;
}
