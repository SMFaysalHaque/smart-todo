"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { ApiError } from "@/lib/api-client";
import { getTodos, updateTodo, deleteTodo } from "../api/todos-api";
import { checkAllTaskItems } from "../utils/task-content";
import {
  type Todo,
  type TodoFilter,
  type Pagination,
} from "../types";
import { TodoForm } from "./todo-form";
import { TodoList } from "./todo-list";
import { TodoFilterBar } from "./todo-filter";
import { PaginationControls } from "./pagination-controls";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

type ListStatus = "loading" | "ready" | "error";

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
  const [pendingDelete, setPendingDelete] = useState<Todo | null>(null);

  function handleUnauthorized() {
    logout();
    router.replace("/login");
  }

  function reload() {
    setReloadKey((key) => key + 1);
  }

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
      setPage(1);
      reload();
    }
  }

  async function handleToggle(todo: Todo) {
    setActionError(null);
    setBusyId(todo.id);
    try {
      if (todo.completed) {
        await updateTodo(todo.id, { completed: false });
      } else {
        await updateTodo(todo.id, {
          completed: true,
          content: checkAllTaskItems(todo.content),
        });
      }
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

  async function confirmDelete() {
    const todo = pendingDelete;
    if (!todo) return;

    setActionError(null);
    setBusyId(todo.id);
    try {
      await deleteTodo(todo.id);
      if (todos.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        reload();
      }
      if (editingTodo?.id === todo.id) setEditingTodo(null);
      setPendingDelete(null);
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
            onDelete={setPendingDelete}
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

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete todo"
        message="Are you sure you want to delete this todo? This can't be undone."
        confirmLabel="Delete"
        busyLabel="Deleting…"
        busy={pendingDelete !== null && busyId === pendingDelete.id}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
