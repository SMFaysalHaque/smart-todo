"use client";

import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import { getTodoEditorExtensions } from "../editor-config";

// A read-only Tiptap renderer. We reuse the same extensions as the editor so the
// stored JSON renders with the exact features it was written with (headings,
// lists, task lists, bold/italic, color, font weight). `editable: false` makes
// it a preview, not an editor. We never show raw JSON or convert to HTML.
export function TodoPreview({ content }: { content: JSONContent }) {
  const editor = useEditor({
    editable: false,
    immediatelyRender: false,
    extensions: getTodoEditorExtensions(),
    content,
  });

  return (
    <div className="max-h-48 overflow-auto text-sm">
      <EditorContent editor={editor} />
    </div>
  );
}
