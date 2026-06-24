import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildHrUser } from "@/test/fixtures";
import { createHash } from "crypto";

vi.mock("@/server/modules/hr-user/hr-user.repository", () => ({
  findHrUserByEmail: vi.fn(),
}));

vi.mock("./session", () => ({
  createSessionToken: vi.fn().mockReturnValue("mock-token"),
}));

import { findHrUserByEmail } from "@/server/modules/hr-user/hr-user.repository";
import { login } from "./auth.service";
import { UnauthorizedError } from "@/server/errors";

const mockFindByEmail = vi.mocked(findHrUserByEmail);

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("login", () => {
  it("returns a session token when credentials are valid", async () => {
    mockFindByEmail.mockResolvedValue(
      buildHrUser({ id: "hr_1", email: "hr@acme.com", passwordHash: sha256("password") }),
    );

    const token = await login({ email: "hr@acme.com", password: "password" });

    expect(token).toBe("mock-token");
  });

  it("throws UnauthorizedError when email is not found", async () => {
    mockFindByEmail.mockResolvedValue(null);

    await expect(login({ email: "unknown@acme.com", password: "password" })).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it("throws UnauthorizedError when password is incorrect", async () => {
    mockFindByEmail.mockResolvedValue(
      buildHrUser({ passwordHash: sha256("correctpassword") }),
    );

    await expect(login({ email: "hr@acme.com", password: "wrongpassword" })).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it("does not distinguish between missing email and wrong password", async () => {
    mockFindByEmail.mockResolvedValue(null);

    await expect(login({ email: "no@acme.com", password: "any" })).rejects.toThrow(
      "Invalid credentials",
    );
  });
});
