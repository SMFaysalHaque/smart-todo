import express, { type Express, type Request, type Response } from "express";
import cors from "cors";

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", service: "smart-todo-backend" });
  });

  return app;
}
