import "dotenv/config";
import path from "path";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../app/generated/prisma/client";
import { Country, Department, Currency } from "../app/generated/prisma/enums";
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
  await prisma.hRUser.upsert({
    where: { email: "hr@acme.com" },
    update: {},
    create: {
      email: "hr@acme.com",
      // SHA-256 placeholder — use bcrypt in production
      passwordHash: createHash("sha256").update("password").digest("hex"),
    },
  });

  const TOTAL_EMPLOYEES = 10000;
  const BATCH_SIZE = 500;

  const firstNames = [
    "Alice", "Bob", "Clara", "David", "Eva", "Priya", "James", "Sofia",
    "Lucas", "Amara", "Chen", "Fatima", "Liam", "Nadia", "Omar", "Yuki",
    "Carlos", "Ingrid", "Kwame", "Leila", "Marco", "Nora", "Paulo", "Riya",
    "Samuel", "Tania", "Uche", "Vera", "Wei", "Xena",
  ];

  const lastNames = [
    "Johnson", "Smith", "Müller", "Okonkwo", "Santos", "Sharma", "Brown",
    "Garcia", "Wilson", "Anderson", "Taylor", "Thomas", "Jackson", "White",
    "Harris", "Martin", "Thompson", "Moore", "Lee", "Walker", "Hall",
    "Allen", "Young", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill",
    "Flores",
  ];

  const departments = [
    Department.Engineering,
    Department.Product,
    Department.Finance,
    Department.Design,
  ];

  const countryConfig: Record<Country, { currency: Currency; salaryBase: number }> = {
    [Country.US]: { currency: Currency.USD, salaryBase: 100000 },
    [Country.DE]: { currency: Currency.EUR, salaryBase: 85000 },
    [Country.GB]: { currency: Currency.GBP, salaryBase: 80000 },
    [Country.BR]: { currency: Currency.BRL, salaryBase: 60000 },
    [Country.IN]: { currency: Currency.INR, salaryBase: 2000000 },
  };

  const countries = Object.keys(countryConfig) as Country[];

  function pick<T>(arr: T[], index: number): T {
    return arr[index % arr.length];
  }

  function salaryForCountry(country: Country, index: number): number {
    const base = countryConfig[country].salaryBase;
    const variance = (index % 10) * (base * 0.02);
    return Math.round(base + variance);
  }

  // Build all employee records up front
  const allEmployeeData = Array.from({ length: TOTAL_EMPLOYEES }, (_, globalIndex) => {
    const firstName = pick(firstNames, globalIndex + globalIndex * 3);
    const lastName = pick(lastNames, globalIndex + globalIndex * 7);
    const country = pick(countries, globalIndex);
    const department = pick(departments, globalIndex);
    const baseSalary = salaryForCountry(country, globalIndex);
    const bonus = Math.round(baseSalary * 0.1);

    return {
      name: `${firstName} ${lastName}`,
      email: `employee.${globalIndex + 1}@acme.com`,
      department,
      country,
      currency: countryConfig[country].currency,
      baseSalary,
      bonus,
    };
  });

  const existingCount = await prisma.employee.count();
  if (existingCount > 0) {
    console.log(`Already seeded (${existingCount} employees). Skipping.`);
    return;
  }

  // Bulk insert employees in batches
  for (let i = 0; i < TOTAL_EMPLOYEES; i += BATCH_SIZE) {
    const batch = allEmployeeData.slice(i, i + BATCH_SIZE);
    await prisma.employee.createMany({ data: batch });
    console.log(`Inserted employees ${i + 1}–${Math.min(i + BATCH_SIZE, TOTAL_EMPLOYEES)}`);
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
