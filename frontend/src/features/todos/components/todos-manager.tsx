"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { ApiError } from "@/lib/api-client";
import { getTodos, updateTodo, deleteTodo } from "../api/todos-api";
import {
  type Todo,
  type TodoFilter,
  type Pagination,
} from "../types";
import { TodoForm } from "./todo-form";
import { TodoList } from "./todo-list";
import { TodoFilterBar } from "./todo-filter";
import { PaginationControls } from "./pagination-controls";

type ListStatus = "loading" | "ready" | "error";

// The stateful hub for the whole Todo page. It holds the list, the current
// filter/page, and which todo (if any) is being edited. After every mutation it
// simply re-fetches the current page from the backend, so the UI always matches
// MongoDB without a data-fetching library.
export function TodosManager() {
  const router = useRouter();
  const { logout } = useAuth();

  const [filter, setFilter] = useState<TodoFilter>("all");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);

  const [status, setStatus] = useState<ListStatus>("loading");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  // If a request comes back 401, the token is invalid/expired: log out and send
  // the user to sign in (the existing auth-provider behavior — no new auth here).
  function handleUnauthorized() {
    logout();
    router.replace("/login");
  }

  function reload() {
    setReloadKey((key) => key + 1);
  }

  // Load the current page + filter whenever they change (or when we ask for a
  // reload after a mutation).
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus("loading");
      setListError(null);
      try {
        const response = await getTodos(page, filter);
        if (cancelled) return;
        setTodos(response.data);
        setPagination(response.pagination);
        setStatus("ready");
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          handleUnauthorized();
          return;
        }
        setListError(
          err instanceof ApiError ? err.message : "Failed to load todos.",
        );
        setStatus("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // We intentionally reload only when the filter, page, or reload counter
    // change. logout/router are stable enough for this simple page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, page, reloadKey]);

  function handleFilterChange(next: TodoFilter) {
    setEditingTodo(null);
    setActionError(null);
    setPage(1);
    setFilter(next);
  }

  function handleSaved() {
    const wasEditing = editingTodo !== null;
    setEditingTodo(null);
    if (wasEditing) {
      reload();
    } else {
      // A newly created todo is newest-first, so jump to page 1 to see it.
      setPage(1);
      reload();
    }
  }

  async function handleToggle(todo: Todo) {
    setActionError(null);
    setBusyId(todo.id);
    try {
      await updateTodo(todo.id, { completed: !todo.completed });
      reload();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleUnauthorized();
        return;
      }
      setActionError(
        err instanceof ApiError ? err.message : "Failed to update todo.",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(todo: Todo) {
    if (!window.confirm("Are you sure you want to delete this todo?")) return;

    setActionError(null);
    setBusyId(todo.id);
    try {
      await deleteTodo(todo.id);
      // If we just removed the last item on a later page, step back a page.
      if (todos.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        reload();
      }
      if (editingTodo?.id === todo.id) setEditingTodo(null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleUnauthorized();
        return;
      }
      setActionError(
        err instanceof ApiError ? err.message : "Failed to delete todo.",
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
      <TodoForm
        key={editingTodo ? editingTodo.id : "create"}
        todo={editingTodo}
        onSaved={handleSaved}
        onCancelEdit={() => setEditingTodo(null)}
        onUnauthorized={handleUnauthorized}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Your todos</h2>
        <TodoFilterBar value={filter} onChange={handleFilterChange} />
      </div>

      {actionError && <p className="text-sm text-red-600">{actionError}</p>}

      {status === "loading" && todos.length === 0 ? (
        <p className="text-sm text-zinc-500">Loading todos…</p>
      ) : status === "error" ? (
        <div className="text-sm">
          <p className="text-red-600">{listError}</p>
          <button
            type="button"
            onClick={reload}
            className="mt-2 text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <TodoList
            todos={todos}
            filter={filter}
            busyId={busyId}
            onToggle={handleToggle}
            onEdit={setEditingTodo}
            onDelete={handleDelete}
          />
          {pagination && pagination.total > 0 && (
            <PaginationControls
              pagination={pagination}
              onPrevious={() => setPage((current) => Math.max(current - 1, 1))}
              onNext={() => setPage((current) => current + 1)}
            />
          )}
        </>
      )}
    </div>
  );
}
