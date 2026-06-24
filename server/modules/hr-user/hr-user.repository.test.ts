import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildHrUser } from "@/test/fixtures";

vi.mock("@/server/db/client", () => ({
  prisma: {
    hRUser: {
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from "@/server/db/client";
import { findHrUserByEmail } from "./hr-user.repository";

const mockFindUnique = vi.mocked(prisma.hRUser.findUnique);

beforeEach(() => {
  vi.clearAllMocks();
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

