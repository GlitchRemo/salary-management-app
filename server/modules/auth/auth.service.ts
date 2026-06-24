import { createHash } from "crypto";
import { findHrUserByEmail, findHrUserById } from "@/server/modules/hr-user/hr-user.repository";
import { UnauthorizedError } from "@/server/errors";
import { createSessionToken, getSessionUserId } from "./session";
import type { LoginInput } from "./auth.types";

export type { LoginInput } from "./auth.types";

export type SessionUser = {
  id: string;
  email: string;
};

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export async function login(input: LoginInput): Promise<string> {
  const user = await findHrUserByEmail(input.email);

  if (!user || user.passwordHash !== hashPassword(input.password)) {
    throw new UnauthorizedError("Invalid credentials");
  }

  return createSessionToken(user.id);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const userId = await getSessionUserId();
  if (!userId) return null;
  const user = await findHrUserById(userId);
  if (!user) return null;
  return { id: user.id, email: user.email };
}
