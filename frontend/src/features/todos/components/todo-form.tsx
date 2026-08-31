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

// One reusable form for both creating and editing a todo. The only difference
// is whether a `todo` is passed in (edit) or not (create). The parent remounts
// this component (via a React key) when switching todos, so the editor always
// initializes from the correct content.

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

  const [title, setTitle] = useState(todo?.title ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Tiptap can accept the stored JSON directly as its initial content — we do
  // not rebuild the document by hand.
  const editor = useEditor({
    immediatelyRender: false, // required for Next.js server rendering
    extensions: getTodoEditorExtensions(),
    content: todo?.content ?? EMPTY_DOC,
    editorProps: {
      attributes: { class: "min-h-40 px-3 py-2 focus:outline-none" },
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
      // Content comes straight from the editor, then null attributes are dropped
      // so the backend's strict schema accepts it.
      const content = cleanContent(editor.getJSON());

      if (todo) {
        await updateTodo(todo.id, { title: trimmedTitle, content });
      } else {
        await createTodo({ title: trimmedTitle, content });
        // Reset the create form for the next todo.
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

      <div className="mt-4 flex gap-2">
        <Button onClick={handleSave} disabled={isSaving}>
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
