import type {
  ErrorRequestHandler,
} from "express";

import { ApiError } from "@/utils/ApiError.js";
import { env } from "@/config/env.js";

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(error.details !== undefined
        ? { details: error.details }
        : {}),
    });

    return;
  }

  console.error(error);

  res.status(500).json({
    success: false,
    message:
      env.NODE_ENV === "production"
        ? "Internal server error"
        : error instanceof Error
          ? error.message
          : "Unknown error",
  });
};