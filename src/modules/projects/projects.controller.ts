
import type { Request, Response } from "express";
import * as projectsService from "./projects.services.js";

export async function createProject(
  req: Request,
  res: Response,
) {
  const project = await projectsService.createProject(
    req.user!.id,
    req.body,
  );

  res.status(201).json({
    success: true,
    message: "Project submitted successfully.",
    data: project,
  });
}

export async function getMyProject(
  req: Request,
  res: Response,
) {
  const project = await projectsService.getMyProject(
    req.user!.id,
  );

  res.status(200).json({
    success: true,
    data: project,
  });
}
