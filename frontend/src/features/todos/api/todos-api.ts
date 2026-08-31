import { api } from "@/lib/api-client";
import { type CreateTodoInput, type CreateTodoResponse } from "../types";

export function createTodo(input: CreateTodoInput) {
  return api.post<CreateTodoResponse>("/todos", input);
}
