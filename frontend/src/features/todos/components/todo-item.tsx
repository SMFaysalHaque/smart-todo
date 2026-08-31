"use client";

import { Button } from "@/components/ui/button";
import { TodoPreview } from "./todo-preview";
import { type Todo } from "../types";

// A single todo card: title, completed badge, a read-only rich-text preview,
// last-updated time, and the three actions (toggle complete, edit, delete).
// All actions are disabled while this card has a request in flight (`busy`).

interface TodoItemProps {
  todo: Todo;
  busy: boolean;
  onToggle: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

export function TodoItem({
  todo,
  busy,
  onToggle,
  onEdit,
  onDelete,
}: TodoItemProps) {
  const updated = new Date(todo.updatedAt).toLocaleString();

  return (
    <li className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex items-start justify-between gap-3">
        <h3
          className={`font-medium ${
            todo.completed ? "text-zinc-400 line-through" : ""
          }`}
        >
          {todo.title}
        </h3>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
            todo.completed
              ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
        >
          {todo.completed ? "Completed" : "Active"}
        </span>
      </div>

      <div className="mt-2 border-t border-zinc-100 pt-2 dark:border-zinc-800">
        <TodoPreview content={todo.content} completed={todo.completed} />
      </div>

      <p className="mt-2 text-xs text-zinc-400">Updated {updated}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          variant="secondary"
          onClick={() => onToggle(todo)}
          disabled={busy}
        >
          {todo.completed ? "Mark active" : "Mark complete"}
        </Button>
        <Button
          variant="ghost"
          onClick={() => onEdit(todo)}
          disabled={busy || todo.completed}
          title={
            todo.completed ? "Mark this todo active to edit it" : undefined
          }
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          onClick={() => onDelete(todo)}
          disabled={busy}
          className="text-red-600"
        >
          {busy ? "Working…" : "Delete"}
        </Button>
      </div>
    </li>
  );
}
