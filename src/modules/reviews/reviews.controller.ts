
import type { Request, Response } from "express";
import * as reviewsService from "./reviews.services.js";
import type {
  ListReviewsInput,
  ReviewDecisionInput,
} from "./reviews.validation.js";

export async function listReviews(
  req: Request,
  res: Response,
) {
  const result = await reviewsService.listReviews(
    req.query as unknown as ListReviewsInput,
  );

  res.status(200).json({
    success: true,
    ...result,
  });
}

export async function getStats(
  _req: Request,
  res: Response,
) {
  const data = await reviewsService.getStats();

  res.status(200).json({
    success: true,
    data,
  });
}

export async function decideProject(
  req: Request,
  res: Response,
) {
  const result = await reviewsService.decideProject(
    req.params.projectId as string,
    req.user!.id,
    req.body as ReviewDecisionInput,
  );

  res.status(200).json({
    success: true,
    message: "Project review saved successfully.",
    data: result,
  });
}
