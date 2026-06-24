import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildHrUser } from "@/test/fixtures";

vi.mock("@/server/db/client", () => ({
  prisma: {
    hRUser: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from "@/server/db/client";
import { findFirstHrUserId, findHrUserByEmail } from "./hr-user.repository";

const mockFindFirst = vi.mocked(prisma.hRUser.findFirst);
const mockFindUnique = vi.mocked(prisma.hRUser.findUnique);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("findFirstHrUserId", () => {
  it("returns the id of the first HR user", async () => {
    mockFindFirst.mockResolvedValue(buildHrUser({ id: "hr_1" }));

    const result = await findFirstHrUserId();

    expect(result).toBe("hr_1");
  });

  it("returns null when no HR user exists", async () => {
    mockFindFirst.mockResolvedValue(null);

    const result = await findFirstHrUserId();

    expect(result).toBeNull();
  });
});

describe("findHrUserByEmail", () => {
  it("returns the HR user with the given email", async () => {
    const user = buildHrUser({ email: "hr@acme.com" });
    mockFindUnique.mockResolvedValue(user);

    const result = await findHrUserByEmail("hr@acme.com");

    expect(result).toEqual(user);
    expect(mockFindUnique).toHaveBeenCalledWith({ where: { email: "hr@acme.com" } });
  });

  it("returns null when no HR user matches the email", async () => {
    mockFindUnique.mockResolvedValue(null);

    const result = await findHrUserByEmail("nobody@acme.com");

    expect(result).toBeNull();
  });
});

