
import type { Request, Response } from "express";
import * as authService from "./auth.services.js";

export async function signup(req: Request, res: Response) {
  const user = await authService.signup(req.body);

  res.status(201).json({
    success: true,
    message: "Account created successfully.",
    data: user,
  });
}

export async function login(req: Request, res: Response) {
  const result = await authService.login(req.body);

  res.status(200).json({
    success: true,
    message: "Login successful.",
    data: result,
  });
}

export async function me(req: Request, res: Response) {
  const user = await authService.getMe(req.user!.id);

  res.status(200).json({
    success: true,
    data: user,
  });
}
