import { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/AppError";

export const globalErrorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: "failed",
      message: error.message,
      data: null,
    });
    return;
  }

  console.error("Unhandled error:", error);

  res.status(500).json({
    status: "failed",
    message: "Something went wrong",
    data: null,
  });
};
