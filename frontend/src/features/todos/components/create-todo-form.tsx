"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { FontWeight } from "../extensions/font-weight";
import { cleanContent } from "../utils/clean-content";
import { createTodo } from "../api/todos-api";
import { ApiError } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { EditorToolbar } from "./editor-toolbar";

// The one canonical empty document (matches the backend's default).
const EMPTY_DOC = { type: "doc", content: [{ type: "paragraph" }] };

export function CreateTodoForm() {
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // The editor is the single source of truth for the rich-text content. We only
  // enable the features our backend supports; unsupported StarterKit features
  // (strike, code, code block, blockquote, horizontal rule) are turned off so
  // the saved JSON always matches the backend contract.
  const editor = useEditor({
    immediatelyRender: false, // required for Next.js server rendering
    extensions: [
      StarterKit.configure({
        strike: false,
        code: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
      FontWeight,
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: EMPTY_DOC,
    editorProps: {
      attributes: {
        class: "min-h-40 px-3 py-2 focus:outline-none",
      },
    },
  });

  async function handleSave() {
    setError(null);
    setSuccess(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }
    if (trimmedTitle.length > 200) {
      setError("Title must be at most 200 characters.");
      return;
    }
    if (!editor) return;

    setIsSaving(true);
    try {
      // The content comes straight from the editor, then we drop empty
      // attributes so the backend's strict schema accepts it.
      const content = cleanContent(editor.getJSON());
      await createTodo({ title: trimmedTitle, content });

      setSuccess("Todo created.");
      setTitle("");
      editor.commands.setContent(EMPTY_DOC);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create todo.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">New todo</h1>

      <label htmlFor="title" className="mb-1 block text-sm font-medium">
        Title
      </label>
      <input
        id="title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="What needs doing?"
        className="mb-4 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />

      <div className="mb-1 block text-sm font-medium">Notes</div>
      <div className="rounded-md border border-zinc-300 dark:border-zinc-700">
        {editor && <EditorToolbar editor={editor} />}
        <EditorContent editor={editor} />
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {success && (
        <p className="mt-3 text-sm text-green-600 dark:text-green-400">
          {success}
        </p>
      )}

      <div className="mt-4">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving…" : "Create todo"}
        </Button>
      </div>
    </div>
  );
}
