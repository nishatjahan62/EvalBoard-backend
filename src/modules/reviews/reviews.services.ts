
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/app-error.js";
import type {
  ListReviewsInput,
  ReviewDecisionInput,
} from "./reviews.validation.js";

export async function listReviews(input: ListReviewsInput) {
  const where = input.status
    ? { status: input.status }
    : {};

  const skip = (input.page - 1) * input.limit;

  const [projects, total] = await prisma.$transaction([
    prisma.project.findMany({
      where,
      skip,
      take: input.limit,
      orderBy: { createdAt: "desc" },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    }),
    prisma.project.count({ where }),
  ]);

  return {
    projects,
    pagination: {
      page: input.page,
      limit: input.limit,
      total,
      totalPages: Math.ceil(total / input.limit),
    },
  };
}

export async function getStats() {
  const [total, pending, approved, rejected] =
    await prisma.$transaction([
      prisma.project.count(),
      prisma.project.count({
        where: { status: "PENDING" },
      }),
      prisma.project.count({
        where: { status: "APPROVED" },
      }),
      prisma.project.count({
        where: { status: "REJECTED" },
      }),
    ]);

  return { total, pending, approved, rejected };
}

export async function decideProject(
  projectId: string,
  reviewerId: string,
  input: ReviewDecisionInput,
) {
  return prisma.$transaction(async (tx) => {
    const project = await tx.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        status: true,
      },
    });

    if (!project) {
      throw new AppError(404, "Project not found.");
    }

    if (project.status !== "PENDING") {
      throw new AppError(
        409,
        "Only pending projects can be reviewed.",
      );
    }

    const updatedProject = await tx.project.update({
      where: { id: projectId },
      data: { status: input.decision },
    });

    const review = await tx.review.create({
      data: {
        projectId,
        reviewerId,
        decision: input.decision,
        comment: input.comment || null,
      },
    });

    return {
      project: updatedProject,
      review,
    };
  });
}
