
import type {
  ErrorRequestHandler,
  RequestHandler,
} from "express";
import { Prisma } from "@prisma/client";
import { env } from "../config/env.js";
import { AppError } from "../utils/app-error.js";

export const notFoundHandler: RequestHandler = (
  req,
  _res,
  next,
) => {
  next(
    new AppError(
      404,
      `Route not found: ${req.method} ${req.path}`,
    ),
  );
};

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError
  ) {
    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        message: "A record with this information already exists.",
      });
      return;
    }

    if (error.code === "P2025") {
      res.status(404).json({
        success: false,
        message: "The requested record was not found.",
      });
      return;
    }
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  }

  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
};
