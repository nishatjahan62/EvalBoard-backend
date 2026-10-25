
import type {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

export function asyncHandler(
  handler: AsyncController,
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(
      handler(req, res, next),
    ).catch(next);
  };
}
