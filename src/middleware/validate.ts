
import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { AppError } from "@/utils/app-error.js";
type RequestPart = "body" | "query" | "params";

export function validate(
  schema: ZodType,
  part: RequestPart = "body",
): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req[part]);

    if (!result.success) {
      next(
        new AppError(
          400,
          result.error.issues
            .map((issue) => {
              const path = issue.path.join(".");
              return path
                ? `${path}: ${issue.message}`
                : issue.message;
            })
            .join("; "),
        ),
      );
      return;
    }

    if (part === "body") {
      req.body = result.data;
    } else {
      Object.defineProperty(req, part, {
        configurable: true,
        value: result.data,
      });
    }

    next();
  };
}
