import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import { errorHandler } from "./middleware/errorHandler.js";

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req: Request, res: Response) => {
    const databaseConnected = mongoose.connection.readyState === 1;
    res.json({
      status: "ok",
      database: databaseConnected ? "connected" : "disconnected",
    });
  });

  app.use(errorHandler);

  return app;
}
