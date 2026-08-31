import { type JSONContent } from "@tiptap/react";

// A Tiptap document is a recursive tree. Rather than re-declare that tree, we
// reuse Tiptap's own `JSONContent` type for a todo's rich-text content.

export interface Todo {
  id: string;
  userId: string;
  title: string;
  content: JSONContent;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// POST /todos body
export interface CreateTodoInput {
  title: string;
  content: JSONContent;
}

// PATCH /todos/:id body — only the fields being changed are sent.
export interface UpdateTodoInput {
  title?: string;
  content?: JSONContent;
  completed?: boolean;
}

// Backend response for a single todo (POST, GET :id, PATCH).
export interface TodoResponse {
  todo: Todo;
}

// Pagination metadata returned by GET /todos.
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Backend response for the list endpoint.
export interface ListTodosResponse {
  data: Todo[];
  pagination: Pagination;
}

// UI filter for completion status.
export type TodoFilter = "all" | "active" | "completed";
