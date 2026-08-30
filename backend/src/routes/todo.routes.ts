import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todo.controller.js";

export const todoRouter = Router();

todoRouter.use(requireAuth);

todoRouter.post("/", createTodo);
todoRouter.get("/", getTodos);
todoRouter.get("/:id", getTodo);
todoRouter.patch("/:id", updateTodo);
todoRouter.delete("/:id", deleteTodo);
