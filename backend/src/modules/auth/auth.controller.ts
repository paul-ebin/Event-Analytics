
import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { registerUser, loginUser } from "./auth.service.js";
import { boolean } from "zod";

export async function register(
  req: Request,
  res: Response
) {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid registration data",
      details: parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  try {
    const user = await registerUser(parsed.data);

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "EMAIL_ALREADY_EXISTS"
    ) {
      return res.status(409).json({
        error: "An account with this email already exists",
      });
    }

    console.error("Registration failed:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}



export async function login(
  req: Request,
  res: Response
) {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid login data",
    });
  }

  try {
    const result = await loginUser(parsed.data);

    return res.status(200).json({
      message: "Login successful",
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVALID_CREDENTIALS"
    ) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    console.error("Login failed:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
