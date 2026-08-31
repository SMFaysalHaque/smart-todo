import { type JSONContent } from "@tiptap/react";


export interface Todo {
  id: string;
  userId: string;
  title: string;
  content: JSONContent;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoInput {
  title: string;
  content: JSONContent;
}

export interface UpdateTodoInput {
  title?: string;
  content?: JSONContent;
  completed?: boolean;
}

export interface TodoResponse {
  todo: Todo;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ListTodosResponse {
  data: Todo[];
  pagination: Pagination;
}

export type TodoFilter = "all" | "active" | "completed";
