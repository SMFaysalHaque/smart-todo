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

export interface CreateTodoInput {
  title: string;
  content: JSONContent;
}

// POST /todos
export interface CreateTodoResponse {
  todo: Todo;
}
