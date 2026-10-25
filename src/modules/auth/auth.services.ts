
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma.js";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/app-error.js";
import type { LoginInput, SignupInput } from "./auth.validation.js";

function createToken(user: { id: string; role: string }) {
  return jwt.sign(
    { role: user.role },
    env.JWT_SECRET,
    {
      subject: user.id,
      expiresIn:
        env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    },
  );
}

export async function signup(input: SignupInput) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existing) {
    throw new AppError(
      409,
      "An account with this email already exists.",
    );
  }

  const password = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash: password,
      role: "STUDENT",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new AppError(401, "Invalid email or password.");
  }

  const validPassword = await bcrypt.compare(
    input.password,
    user.passwordHash,
  );

  if (!validPassword) {
    throw new AppError(401, "Invalid email or password.");
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return {
    user: safeUser,
    token: createToken(safeUser),
  };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  return user;
}
