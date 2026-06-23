import "dotenv/config";
import path from "path";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../app/generated/prisma/client";
import { createHash } from "crypto";

const rawUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const resolvedUrl =
  rawUrl.startsWith("file:./") || rawUrl.startsWith("file:../")
    ? `file:${path.resolve(process.cwd(), rawUrl.slice(5))}`
    : rawUrl;

const adapter = new PrismaLibSql({ url: resolvedUrl });

const prisma = new PrismaClient({ adapter });

async function main() {
  // Seed an HR user
  const hr = await prisma.hRUser.upsert({
    where: { email: "hr@acme.com" },
    update: {},
    create: {
      email: "hr@acme.com",
      // SHA-256 placeholder — use bcrypt in production
      passwordHash: createHash("sha256").update("password").digest("hex"),
    },
  });

  const employees = [
    {
      name: "Alice Johnson",
      email: "alice@acme.com",
      department: "Engineering",
      country: "US",
      currency: "USD",
      baseSalary: 120000,
      bonus: 15000,
    },
    {
      name: "Bob Smith",
      email: "bob@acme.com",
      department: "Product",
      country: "US",
      currency: "USD",
      baseSalary: 110000,
      bonus: 10000,
    },
    {
      name: "Clara Müller",
      email: "clara@acme.com",
      department: "Engineering",
      country: "DE",
      currency: "EUR",
      baseSalary: 95000,
      bonus: 8000,
    },
    {
      name: "David Okonkwo",
      email: "david@acme.com",
      department: "Finance",
      country: "GB",
      currency: "GBP",
      baseSalary: 85000,
      bonus: 7500,
    },
    {
      name: "Eva Santos",
      email: "eva@acme.com",
      department: "Design",
      country: "BR",
      currency: "BRL",
      baseSalary: 72000,
      bonus: 5000,
    },
  ];

  for (const data of employees) {
    const employee = await prisma.employee.upsert({
      where: { email: data.email },
      update: {},
      create: data,
    });

    // Only create the initial audit record if none exist yet (idempotent)
    const existingAudits = await prisma.salaryAudit.count({
      where: { employeeId: employee.id },
    });
    if (existingAudits === 0) {
      await prisma.salaryAudit.create({
        data: {
          employeeId: employee.id,
          changedById: hr.id,
          previousBaseSalary: data.baseSalary - 5000,
          newBaseSalary: data.baseSalary,
          previousBonus: 0,
          newBonus: data.bonus,
        },
      });
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
