import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/server/modules/auth/session", () => ({
  verifySessionToken: vi.fn(),
}));

import { verifySessionToken } from "@/server/modules/auth/session";
import { proxy } from "./proxy";

const mockVerify = vi.mocked(verifySessionToken);

function makeRequest(path: string, sessionCookie?: string): NextRequest {
  const url = `http://localhost:3000${path}`;
  const headers: HeadersInit = sessionCookie
    ? { cookie: `session=${sessionCookie}` }
    : {};
  return new NextRequest(url, { headers });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("proxy", () => {
  describe("unauthenticated requests", () => {
    it("redirects to /login when no session cookie is present", () => {
      const request = makeRequest("/dashboard");

      const response = proxy(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe("http://localhost:3000/login");
    });

    it("redirects to /login when the session token is invalid", () => {
      mockVerify.mockReturnValue(null);
      const request = makeRequest("/dashboard", "bad-token");

      const response = proxy(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe("http://localhost:3000/login");
    });

    it("redirects to /login when the session token is expired", () => {
      mockVerify.mockReturnValue(null);
      const request = makeRequest("/employees", "expired-token");

      const response = proxy(request);

      expect(response.status).toBe(307);
    });
  });

  describe("authenticated requests", () => {
    it("proceeds when the session token is valid", () => {
      mockVerify.mockReturnValue({ userId: "hr_1", expiresAt: Date.now() + 99999 });
      const request = makeRequest("/dashboard", "valid-token");

      const response = proxy(request);

      expect(response.status).toBe(200);
    });

    it("proceeds for /employees with a valid session", () => {
      mockVerify.mockReturnValue({ userId: "hr_1", expiresAt: Date.now() + 99999 });
      const request = makeRequest("/employees", "valid-token");

      const response = proxy(request);

      expect(response.status).toBe(200);
    });
  });
});
