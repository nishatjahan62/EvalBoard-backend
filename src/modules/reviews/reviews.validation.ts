
import { z } from "zod";

export const listReviewsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z
    .enum(["PENDING", "APPROVED", "REJECTED"])
    .optional(),
});

export const reviewDecisionSchema = z.object({
  decision: z.enum(["APPROVED", "REJECTED"]),
  comment: z.string().trim().max(2000).optional(),
});

export const reviewParamsSchema = z.object({
  projectId: z.string().min(1),
});

export type ListReviewsInput =
  z.infer<typeof listReviewsSchema>;

export type ReviewDecisionInput =
  z.infer<typeof reviewDecisionSchema>;
