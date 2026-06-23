import { prisma } from "@/server/db/client";

// TODO: replace with auth session lookup in Phase 8
export async function findFirstHrUserId(): Promise<string | null> {
  const user = await prisma.hRUser.findFirst({ select: { id: true } });
  return user?.id ?? null;
}
