import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import { cookies } from "next/headers";
import { createSessionToken, verifySessionToken, getSessionUserId } from "./session";

const mockCookies = vi.mocked(cookies);

beforeEach(() => {
  process.env.SESSION_SECRET = "test-secret";
});

afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe("createSessionToken", () => {
  it("returns a dot-separated token", () => {
    const token = createSessionToken("hr_1");

    expect(token).toContain(".");
    const parts = token.split(".");
    expect(parts.length).toBe(2);
  });

  it("encodes the userId in the payload", () => {
    const token = createSessionToken("hr_1");

    const encodedPayload = token.split(".")[0];
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));

    expect(payload.userId).toBe("hr_1");
  });

  it("sets expiresAt approximately 7 days from now", () => {
    const before = Date.now();
    const token = createSessionToken("hr_1");
    const after = Date.now();

    const encodedPayload = token.split(".")[0];
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));

    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    expect(payload.expiresAt).toBeGreaterThanOrEqual(before + sevenDaysMs);
    expect(payload.expiresAt).toBeLessThanOrEqual(after + sevenDaysMs);
  });

  it("throws when SESSION_SECRET is not set", () => {
    delete process.env.SESSION_SECRET;

    expect(() => createSessionToken("hr_1")).toThrow("SESSION_SECRET environment variable is not set");
  });
});

describe("verifySessionToken", () => {
  it("returns the payload for a valid token", () => {
    const token = createSessionToken("hr_1");

    const payload = verifySessionToken(token);

    expect(payload).not.toBeNull();
    expect(payload?.userId).toBe("hr_1");
  });

  it("returns null for a tampered signature", () => {
    const token = createSessionToken("hr_1");
    const tampered = token.slice(0, -4) + "XXXX";

    expect(verifySessionToken(tampered)).toBeNull();
  });

  it("returns null for a tampered payload", () => {
    const [, signature] = createSessionToken("hr_1").split(".");
    const fakePayload = Buffer.from(JSON.stringify({ userId: "attacker", expiresAt: Date.now() + 99999 })).toString("base64url");
    const tampered = `${fakePayload}.${signature}`;

    expect(verifySessionToken(tampered)).toBeNull();
  });

  it("returns null for an expired token", () => {
    vi.useFakeTimers();
    const token = createSessionToken("hr_1");

    vi.advanceTimersByTime(8 * 24 * 60 * 60 * 1000); // 8 days

    expect(verifySessionToken(token)).toBeNull();
  });

  it("returns null when token has no dot separator", () => {
    expect(verifySessionToken("nodothere")).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(verifySessionToken("")).toBeNull();
  });

  it("returns null for malformed base64url payload", () => {
    expect(verifySessionToken("!!!.invalidsig")).toBeNull();
  });
});

describe("getSessionUserId", () => {
  it("returns the userId from a valid session cookie", async () => {
    const token = createSessionToken("hr_1");
    mockCookies.mockResolvedValue({ get: () => ({ name: "session", value: token }) } as ReturnType<typeof cookies> extends Promise<infer T> ? T : never);

    const result = await getSessionUserId();

    expect(result).toBe("hr_1");
  });

  it("returns null when the session cookie is absent", async () => {
    mockCookies.mockResolvedValue({ get: () => undefined } as ReturnType<typeof cookies> extends Promise<infer T> ? T : never);

    const result = await getSessionUserId();

    expect(result).toBeNull();
  });

  it("returns null when the session cookie contains an invalid token", async () => {
    mockCookies.mockResolvedValue({ get: () => ({ name: "session", value: "bad.token" }) } as ReturnType<typeof cookies> extends Promise<infer T> ? T : never);

    const result = await getSessionUserId();

    expect(result).toBeNull();
  });
});
