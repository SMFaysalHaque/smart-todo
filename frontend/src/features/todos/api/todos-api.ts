import { api } from "@/lib/api-client";
import {
  type CreateTodoInput,
  type UpdateTodoInput,
  type TodoResponse,
  type ListTodosResponse,
  type TodoFilter,
} from "../types";

// All todo HTTP calls live here as small named functions on top of the shared
// api client. UI components call these — never `fetch` directly.

export function createTodo(input: CreateTodoInput) {
  return api.post<TodoResponse>("/todos", input);
}

// Builds the query string from the current page + filter and lets the backend
// do the pagination/filtering (never in the browser).
export function getTodos(page: number, filter: TodoFilter) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (filter === "active") params.set("completed", "false");
  if (filter === "completed") params.set("completed", "true");
  return api.get<ListTodosResponse>(`/todos?${params.toString()}`);
}

export function getTodo(id: string) {
  return api.get<TodoResponse>(`/todos/${id}`);
}

export function updateTodo(id: string, input: UpdateTodoInput) {
  return api.patch<TodoResponse>(`/todos/${id}`, input);
}

export function deleteTodo(id: string) {
  return api.delete<void>(`/todos/${id}`);
}
