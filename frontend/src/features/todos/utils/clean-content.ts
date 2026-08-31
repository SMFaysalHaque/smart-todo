import { type JSONContent } from "@tiptap/react";


export function cleanContent(node: JSONContent): JSONContent {
  const result: JSONContent = { ...node };

  if (result.attrs) {
    const kept = Object.entries(result.attrs).filter(
      ([, value]) => value !== null && value !== undefined,
    );
    if (kept.length > 0) result.attrs = Object.fromEntries(kept);
    else delete result.attrs;
  }

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
