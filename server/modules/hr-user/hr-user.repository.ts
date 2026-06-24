import { prisma } from "@/server/db/client";
import type { HRUser } from "@/app/generated/prisma/client";

// TODO: remove once login page is complete and sessions work end-to-end (Phase 6)
export async function findFirstHrUserId(): Promise<string | null> {
  const user = await prisma.hRUser.findFirst({ select: { id: true } });
  return user?.id ?? null;
}

export async function findHrUserByEmail(email: string): Promise<HRUser | null> {
  return prisma.hRUser.findUnique({ where: { email } });
}
