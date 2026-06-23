import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildHrUser } from "@/test/fixtures";

vi.mock("@/server/db/client", () => ({
  prisma: {
    hRUser: {
      findFirst: vi.fn(),
    },
  },
}));

import { prisma } from "@/server/db/client";
import { findFirstHrUserId } from "./hr-user.repository";


const mockFindFirst = vi.mocked(prisma.hRUser.findFirst);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("findFirstHrUserId", () => {
  it("returns the id of the first HR user", async () => {
    mockFindFirst.mockResolvedValue(buildHrUser({ id: "hr_1" }));

    const result = await findFirstHrUserId();

    expect(result).toBe("hr_1");
  });

  it("queries only the id field", async () => {
    mockFindFirst.mockResolvedValue(buildHrUser());

    await findFirstHrUserId();

    expect(mockFindFirst).toHaveBeenCalledWith({ select: { id: true } });
  });

  it("returns null when no HR user exists", async () => {
    mockFindFirst.mockResolvedValue(null);

    const result = await findFirstHrUserId();

    expect(result).toBeNull();
  });
});
