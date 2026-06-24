import { describe, it, expect, vi, beforeEach } from "vitest";
import { UnauthorizedError } from "@/server/errors";

vi.mock("@/server/modules/auth/auth.service", () => ({
  login: vi.fn(),
}));

const mockCookieSet = vi.hoisted(() => vi.fn());
vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({ set: mockCookieSet }),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

import { login } from "@/server/modules/auth/auth.service";
import { redirect } from "next/navigation";
import { loginAction } from "./actions";

const mockLogin = vi.mocked(login);
const mockRedirect = vi.mocked(redirect);

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    fd.append(key, value);
  }
  return fd;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("loginAction", () => {
  describe("validation", () => {
    it("returns an error when email is missing", async () => {
      const result = await loginAction(null, makeFormData({ password: "password" }));

      expect(result).toEqual({ error: "Email and password are required." });
      expect(mockLogin).not.toHaveBeenCalled();
    });

    it("returns an error when email is not a valid email address", async () => {
      const result = await loginAction(null, makeFormData({ email: "notanemail", password: "password" }));

      expect(result).toEqual({ error: "Email and password are required." });
      expect(mockLogin).not.toHaveBeenCalled();
    });

    it("returns an error when password is missing", async () => {
      const result = await loginAction(null, makeFormData({ email: "hr@acme.com" }));

      expect(result).toEqual({ error: "Email and password are required." });
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  describe("invalid credentials", () => {
    it("returns an error when login throws UnauthorizedError", async () => {
      mockLogin.mockRejectedValue(new UnauthorizedError("Invalid credentials"));

      const result = await loginAction(
        null,
        makeFormData({ email: "hr@acme.com", password: "wrongpassword" }),
      );

      expect(result).toEqual({ error: "Invalid email or password." });
    });
  });

  describe("successful login", () => {
    it("sets the session cookie with the token", async () => {
      mockLogin.mockResolvedValue("mock-token");

      await loginAction(null, makeFormData({ email: "hr@acme.com", password: "password" }));

      expect(mockCookieSet).toHaveBeenCalledWith(
        "session",
        "mock-token",
        expect.objectContaining({ httpOnly: true, path: "/" }),
      );
    });

    it("redirects to /dashboard", async () => {
      mockLogin.mockResolvedValue("mock-token");

      await loginAction(null, makeFormData({ email: "hr@acme.com", password: "password" }));

      expect(mockRedirect).toHaveBeenCalledWith("/dashboard");
    });

    it("passes the email and password to the login service", async () => {
      mockLogin.mockResolvedValue("mock-token");

      await loginAction(null, makeFormData({ email: "hr@acme.com", password: "password" }));

      expect(mockLogin).toHaveBeenCalledWith({ email: "hr@acme.com", password: "password" });
    });
  });

  describe("unexpected errors", () => {
    it("re-throws errors that are not UnauthorizedError", async () => {
      mockLogin.mockRejectedValue(new Error("Database connection failed"));

      await expect(
        loginAction(null, makeFormData({ email: "hr@acme.com", password: "password" })),
      ).rejects.toThrow("Database connection failed");
    });
  });
});
