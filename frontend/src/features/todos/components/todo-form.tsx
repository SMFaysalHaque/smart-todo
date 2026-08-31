"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { getTodoEditorExtensions, EMPTY_DOC } from "../editor-config";
import { cleanContent } from "../utils/clean-content";
import { createTodo, updateTodo } from "../api/todos-api";
import { ApiError } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { EditorToolbar } from "./editor-toolbar";
import { type Todo } from "../types";


interface TodoFormProps {
  todo?: Todo | null;
  onSaved: () => void;
  onCancelEdit?: () => void;
  onUnauthorized: () => void;
}

export function TodoForm({
  todo,
  onSaved,
  onCancelEdit,
  onUnauthorized,
}: TodoFormProps) {
  const isEditing = Boolean(todo);
  const isLocked = Boolean(todo?.completed);

  const [title, setTitle] = useState(todo?.title ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    editable: !isLocked,
    extensions: getTodoEditorExtensions(),
    content: todo?.content ?? EMPTY_DOC,
    editorProps: {
      attributes: { class: "min-h-40 px-3 py-2 focus:outline-none" },
    },
  });

  async function handleSave() {
    if (isLocked) return;
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
      const content = cleanContent(editor.getJSON());

      if (todo) {
        await updateTodo(todo.id, { title: trimmedTitle, content });
      } else {
        await createTodo({ title: trimmedTitle, content });
        setTitle("");
        editor.commands.setContent(EMPTY_DOC);
        setSuccess("Todo created.");
      }

      onSaved();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onUnauthorized();
        return;
      }
      setError(
        err instanceof ApiError ? err.message : "Failed to save todo.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <h2 className="mb-4 text-lg font-semibold">
        {isEditing ? "Edit Todo" : "Create Todo"}
      </h2>

      <label htmlFor="title" className="mb-1 block text-sm font-medium">
        Title
      </label>
      <input
        id="title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="What needs doing?"
        disabled={isLocked}
        className="mb-4 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900"
      />

      {isLocked && (
        <p className="mb-3 rounded-md bg-zinc-100 px-3 py-2 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          This todo is completed. Mark it active to edit it.
        </p>
      )}

      <div className="mb-1 block text-sm font-medium">Notes</div>
      <div
        className={`rounded-md border border-zinc-300 dark:border-zinc-700 ${
          isLocked ? "opacity-60" : ""
        }`}
      >
        {editor && !isLocked && <EditorToolbar editor={editor} />}
        <EditorContent editor={editor} />
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {success && (
        <p className="mt-3 text-sm text-green-600 dark:text-green-400">
          {success}
        </p>
      )}

      <div className="mt-4 flex gap-2">
        <Button onClick={handleSave} disabled={isSaving || isLocked}>
          {isSaving
            ? "Saving…"
            : isEditing
              ? "Save changes"
              : "Create todo"}
        </Button>
        {isEditing && onCancelEdit && (
          <Button variant="secondary" onClick={onCancelEdit} disabled={isSaving}>
            Cancel
          </Button>
        )}
      </div>
    </section>
  );
}
