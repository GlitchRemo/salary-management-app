import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildHrUser } from "@/test/fixtures";
import { createHash } from "crypto";

vi.mock("@/server/modules/hr-user/hr-user.repository", () => ({
  findHrUserByEmail: vi.fn(),
  findHrUserById: vi.fn(),
}));

vi.mock("./session", () => ({
  createSessionToken: vi.fn().mockReturnValue("mock-token"),
  getSessionUserId: vi.fn(),
}));

import { findHrUserByEmail, findHrUserById } from "@/server/modules/hr-user/hr-user.repository";
import { getSessionUserId } from "./session";
import { login, getSessionUser } from "./auth.service";
import { UnauthorizedError } from "@/server/errors";

const mockFindByEmail = vi.mocked(findHrUserByEmail);
const mockFindById = vi.mocked(findHrUserById);
const mockGetSessionUserId = vi.mocked(getSessionUserId);

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

describe("getSessionUser", () => {
  it("returns the session user when a valid session exists", async () => {
    mockGetSessionUserId.mockResolvedValue("hr_1");
    mockFindById.mockResolvedValue(buildHrUser({ id: "hr_1", email: "hr@acme.com" }));

    const result = await getSessionUser();

    expect(result).toEqual({ id: "hr_1", email: "hr@acme.com" });
  });

  it("returns null when there is no session", async () => {
    mockGetSessionUserId.mockResolvedValue(null);

    const result = await getSessionUser();

    expect(result).toBeNull();
    expect(mockFindById).not.toHaveBeenCalled();
  });

  it("returns null when the session user is not found in the database", async () => {
    mockGetSessionUserId.mockResolvedValue("hr_1");
    mockFindById.mockResolvedValue(null);

    const result = await getSessionUser();

    expect(result).toBeNull();
  });
});
