
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/app-error.js";
import type { CreateProjectInput } from "./projects.validation.js";

export async function createProject(
  studentId: string,
  input: CreateProjectInput,
) {
  const existing = await prisma.project.findFirst({
    where: { studentId },
    select: { id: true },
  });

  if (existing) {
    throw new AppError(
      409,
      "You have already submitted a project.",
    );
  }

  return prisma.project.create({
    data: {
      title: input.title,
      description: input.description,
      repositoryUrl: input.repositoryUrl,
      liveDemoUrl: input.liveDemoUrl || null,
      studentId,
      status: "PENDING",
    },
    select: {
      id: true,
      title: true,
      description: true,
      repositoryUrl: true,
      liveDemoUrl: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getMyProject(studentId: string) {
  const project = await prisma.project.findFirst({
    where: { studentId },
    include: {
      reviews: true,
    },
  });

  if (!project) {
    throw new AppError(
      404,
      "You have not submitted a project yet.",
    );
  }

  return project;
}
