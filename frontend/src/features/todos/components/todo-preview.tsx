"use client";

import { useEffect } from "react";
import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import { getTodoEditorExtensions } from "../editor-config";

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
