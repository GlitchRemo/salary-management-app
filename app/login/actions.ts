"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { login } from "@/server/modules/auth/auth.service";
import { UnauthorizedError } from "@/server/errors";
import { logger } from "@/server/logger";

const SESSION_COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginActionState = { error: string } | null;

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Email and password are required." };
  }

  const { email } = parsed.data;
  logger.info("loginAction", "Login attempt", { email });

  try {
    const token = await login(parsed.data);
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      path: "/",
      maxAge: SESSION_COOKIE_MAX_AGE,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    logger.info("loginAction", "Login successful", { email });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      logger.warn("loginAction", "Login failed — invalid credentials", { email });
      return { error: "Invalid email or password." };
    }
    throw error;
  }

  redirect("/dashboard");
}
