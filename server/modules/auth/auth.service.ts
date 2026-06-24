import { createHash } from "crypto";
import { findHrUserByEmail } from "@/server/modules/hr-user/hr-user.repository";
import { UnauthorizedError } from "@/server/errors";
import { createSessionToken } from "./session";
import type { LoginInput } from "./auth.types";

export type { LoginInput } from "./auth.types";

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
