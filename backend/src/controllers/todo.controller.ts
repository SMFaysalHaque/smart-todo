import { type Request, type Response, type NextFunction } from "express";
import mongoose from "mongoose";
import { TodoModel } from "../models/todo.model.js";
import {
  createTodoSchema,
  updateTodoSchema,
  listTodosQuerySchema,
} from "../schemas/todo.schema.js";
import { sendValidationError } from "../utils/validation.js";

type TodoDoc = InstanceType<typeof TodoModel>;

function toTodoResponse(todo: TodoDoc) {
  return {
    id: String(todo._id),
    userId: String(todo.userId),
    title: todo.title,
    content: todo.content,
    completed: todo.completed,
    createdAt: todo.createdAt,
    updatedAt: todo.updatedAt,
  };
}

export async function createTodo(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const parsed = createTodoSchema.safeParse(req.body);
  if (!parsed.success) {
    sendValidationError(res, parsed.error);
    return;
  }

  try {
    const todo = await TodoModel.create({ ...parsed.data, userId });
    res.status(201).json({ todo: toTodoResponse(todo) });
  } catch (err) {
    next(err);
  }
}

export async function getTodos(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const parsed = listTodosQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    sendValidationError(res, parsed.error);
    return;
  }

  const { page, limit, completed, sort } = parsed.data;
  const filter =
    completed === undefined ? { userId } : { userId, completed };

  try {
    const skip = (page - 1) * limit;
    const [todos, total] = await Promise.all([
      TodoModel.find(filter).sort(sort).skip(skip).limit(limit),
      TodoModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);
    res.status(200).json({
      data: todos.map(toTodoResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getTodo(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const { id } = req.params;
  if (!id || !mongoose.isValidObjectId(id)) {
    res.status(400).json({ error: "Invalid todo id" });
    return;
  }

  try {
    const todo = await TodoModel.findOne({ _id: id, userId });
    if (!todo) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }
    res.status(200).json({ todo: toTodoResponse(todo) });
  } catch (err) {
    next(err);
  }
}

export async function updateTodo(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const { id } = req.params;
  if (!id || !mongoose.isValidObjectId(id)) {
    res.status(400).json({ error: "Invalid todo id" });
    return;
  }

  const parsed = updateTodoSchema.safeParse(req.body);
  if (!parsed.success) {
    sendValidationError(res, parsed.error);
    return;
  }

  try {
    const todo = await TodoModel.findOneAndUpdate(
      { _id: id, userId },
      { $set: parsed.data },
      { new: true, runValidators: true },
    );
    if (!todo) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }
    res.status(200).json({ todo: toTodoResponse(todo) });
  } catch (err) {
    next(err);
  }
}

export async function deleteTodo(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const { id } = req.params;
  if (!id || !mongoose.isValidObjectId(id)) {
    res.status(400).json({ error: "Invalid todo id" });
    return;
  }

  try {
    const result = await TodoModel.deleteOne({ _id: id, userId });
    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
