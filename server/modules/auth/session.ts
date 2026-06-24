import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { SessionPayload } from "./auth.types";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is not set");
  }
  return secret;
}

function base64urlEncode(value: string): string {
  return Buffer.from(value).toString("base64url");
}

function base64urlDecode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createSessionToken(userId: string): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload: SessionPayload = { userId, expiresAt };
  const encodedPayload = base64urlEncode(JSON.stringify(payload));
  const signature = sign(encodedPayload, getSecret());
  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const dotIndex = token.lastIndexOf(".");
  if (dotIndex === -1) return null;

  const encodedPayload = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);

  const expectedSignature = sign(encodedPayload, getSecret());
  const signatureBuffer = Buffer.from(signature, "base64url");
  const expectedBuffer = Buffer.from(expectedSignature, "base64url");

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  let payload: SessionPayload;
  try {
    payload = JSON.parse(base64urlDecode(encodedPayload)) as SessionPayload;
  } catch {
    return null;
  }

  if (Date.now() > payload.expiresAt) return null;

  return payload;
}

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  const payload = verifySessionToken(token);
  return payload?.userId ?? null;
}
