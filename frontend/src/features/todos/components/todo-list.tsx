"use client";

import { TodoItem } from "./todo-item";
import { type Todo, type TodoFilter } from "../types";

// Renders the list, or a friendly empty message that depends on the active
// filter. Loading and error states are handled by the parent (todos-manager).

const EMPTY_MESSAGE: Record<TodoFilter, string> = {
  all: "No todos yet. Create your first todo above.",
  active: "You're all caught up.",
  completed: "No completed todos yet.",
};

interface TodoListProps {
  todos: Todo[];
  filter: TodoFilter;
  busyId: string | null;
  onToggle: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

export function TodoList({
  todos,
  filter,
  busyId,
  onToggle,
  onEdit,
  onDelete,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
        {EMPTY_MESSAGE[filter]}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {todos.map((todo) => (
        // Key by the stable id so toggling/refetching does NOT remount the card
        // (remounting the Tiptap preview causes a flash/jump). The preview keeps
        // itself in sync with content changes internally.
        <TodoItem
          key={todo.id}
          todo={todo}
          busy={busyId === todo.id}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
