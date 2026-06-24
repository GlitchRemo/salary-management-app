import { prisma } from "@/server/db/client";
import type { HRUser } from "@/app/generated/prisma/client";

export async function findHrUserById(id: string): Promise<HRUser | null> {
  return prisma.hRUser.findUnique({ where: { id } });
}

export async function findHrUserByEmail(email: string): Promise<HRUser | null> {
  return prisma.hRUser.findUnique({ where: { email } });
}
