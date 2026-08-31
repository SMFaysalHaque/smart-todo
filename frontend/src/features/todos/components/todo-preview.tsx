"use client";

import { useEffect } from "react";
import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import { getTodoEditorExtensions } from "../editor-config";

// A read-only Tiptap renderer. We reuse the same extensions as the editor so the
// stored JSON renders with the exact features it was written with (headings,
// lists, task lists, bold/italic, color, font weight). `editable: false` makes
// it a preview, not an editor. We never show raw JSON or convert to HTML.
export function TodoPreview({
  content,
  completed = false,
}: {
  content: JSONContent;
  completed?: boolean;
}) {
  const editor = useEditor({
    editable: false,
    immediatelyRender: false,
    extensions: getTodoEditorExtensions(),
    content,
  });

  // Keep the preview in sync when the content actually changes (e.g. after an
  // edit) by updating it in place — instead of remounting the editor, which
  // would make the card flash/jump. Toggling complete doesn't change the
  // content, so this does nothing then.
  const serialized = JSON.stringify(content);
  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(content, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialized, editor]);

  return (
    <div
      className={`max-h-48 overflow-auto text-sm ${
        completed ? "preview-completed" : ""
      }`}
    >
      <EditorContent editor={editor} />
    </div>
  );
}
