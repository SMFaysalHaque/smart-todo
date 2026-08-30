import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { errorHandler } from "./middleware/errorHandler.js";
import { authRouter } from "./routes/auth.routes.js";

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  app.get("/health", (_req: Request, res: Response) => {
    const databaseConnected = mongoose.connection.readyState === 1;
    res.json({
      status: "ok",
      database: databaseConnected ? "connected" : "disconnected",
    });
  });

  app.use("/auth", authRouter);

  app.use(errorHandler);

  return app;
}
