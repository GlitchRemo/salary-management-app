import "dotenv/config";
import path from "path";
import { createHash } from "crypto";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../app/generated/prisma/client";
import {
  Country,
  Currency,
  Department,
} from "../app/generated/prisma/enums";

const rawUrl = process.env.DATABASE_URL ?? "file:./dev.db";

const resolvedUrl =
  rawUrl.startsWith("file:./") || rawUrl.startsWith("file:../")
    ? `file:${path.resolve(process.cwd(), rawUrl.slice(5))}`
    : rawUrl;

const adapter = new PrismaLibSql({
  url: resolvedUrl,
});

const prisma = new PrismaClient({ adapter });

const TOTAL_EMPLOYEES = 10000;
const BATCH_SIZE = 500;

/**
 * ----------------------------------------------------
 * Deterministic Random Generator
 * ----------------------------------------------------
 */

let seed = 123456789;

function random() {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
}

function randomInt(min: number, max: number) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

/**
 * ----------------------------------------------------
 * Name Pools
 * ----------------------------------------------------
 */

const firstNames = [
  "James","John","Robert","Michael","William","David","Richard","Joseph",
  "Thomas","Charles","Christopher","Daniel","Matthew","Anthony","Mark",
  "Donald","Steven","Paul","Andrew","Joshua","Kenneth","Kevin","Brian",
  "George","Edward","Ronald","Timothy","Jason","Jeffrey","Ryan","Jacob",
  "Gary","Nicholas","Eric","Jonathan","Stephen","Larry","Justin","Scott",
  "Brandon","Benjamin","Samuel","Frank","Gregory","Raymond","Alexander",
  "Patrick","Jack","Dennis","Jerry","Tyler","Aaron","Jose","Adam","Nathan",
  "Henry","Douglas","Peter","Zachary","Kyle","Walter","Ethan","Jeremy",
  "Harold","Keith","Christian","Roger","Noah","Gerald","Carl","Terry",
  "Sean","Austin","Arthur","Lawrence","Jesse","Dylan","Bryan","Joe",
  "Jordan","Billy","Bruce","Albert","Willie","Gabriel","Logan","Alan",
  "Juan","Wayne","Roy","Ralph","Randy","Eugene","Vincent","Russell",
  "Elijah","Louis","Bobby","Philip",
  "Emma","Olivia","Sophia","Isabella","Ava","Mia","Charlotte","Amelia",
  "Harper","Evelyn","Abigail","Emily","Elizabeth","Sofia","Ella","Avery",
  "Scarlett","Grace","Chloe","Victoria","Riya","Priya","Ananya","Fatima",
  "Yuki","Chen","Wei","Carlos","Amara"
];

const lastNames = [
  "Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis",
  "Rodriguez","Martinez","Hernandez","Lopez","Gonzalez","Wilson","Anderson",
  "Thomas","Taylor","Moore","Jackson","Martin","Lee","Perez","Thompson",
  "White","Harris","Sanchez","Clark","Ramirez","Lewis","Robinson","Walker",
  "Young","Allen","King","Wright","Scott","Torres","Nguyen","Hill","Flores",
  "Green","Adams","Nelson","Baker","Hall","Rivera","Campbell","Mitchell",
  "Carter","Roberts","Gomez","Phillips","Evans","Turner","Diaz","Parker",
  "Cruz","Edwards","Collins","Reyes","Stewart","Morris","Morales","Murphy",
  "Cook","Rogers","Gutierrez","Ortiz","Morgan","Cooper","Peterson","Bailey",
  "Reed","Kelly","Howard","Ramos","Kim","Cox","Ward","Richardson","Watson",
  "Brooks","Chavez","Wood","James","Bennett","Gray","Mendoza","Ruiz",
  "Hughes","Price","Alvarez","Castillo","Sanders","Patel","Sharma","Das",
  "Singh","Ghosh","Mukherjee","Banerjee"
];

/**
 * ----------------------------------------------------
 * Currency Mapping
 * ----------------------------------------------------
 */

const currencyMap: Record<Country, Currency> = {
  [Country.US]: Currency.USD,
  [Country.DE]: Currency.EUR,
  [Country.GB]: Currency.GBP,
  [Country.BR]: Currency.BRL,
  [Country.IN]: Currency.INR,
};

/**
 * ----------------------------------------------------
 * Salary Bands
 * ----------------------------------------------------
 */

const salaryBands: Record<
  Department,
  Record<Country, [number, number]>
> = {
  [Department.Engineering]: {
    [Country.US]: [90000, 220000],
    [Country.DE]: [70000, 150000],
    [Country.GB]: [65000, 140000],
    [Country.BR]: [50000, 100000],
    [Country.IN]: [900000, 4500000],
  },

  [Department.Product]: {
    [Country.US]: [80000, 190000],
    [Country.DE]: [65000, 130000],
    [Country.GB]: [60000, 120000],
    [Country.BR]: [45000, 90000],
    [Country.IN]: [800000, 3500000],
  },

  [Department.Design]: {
    [Country.US]: [70000, 160000],
    [Country.DE]: [55000, 110000],
    [Country.GB]: [50000, 100000],
    [Country.BR]: [40000, 80000],
    [Country.IN]: [600000, 2500000],
  },

  [Department.Finance]: {
    [Country.US]: [75000, 180000],
    [Country.DE]: [60000, 120000],
    [Country.GB]: [55000, 110000],
    [Country.BR]: [45000, 90000],
    [Country.IN]: [700000, 3000000],
  },
};

/**
 * ----------------------------------------------------
 * Employee Level Multipliers
 * ----------------------------------------------------
 */

const levelMultiplier = {
  Junior: 0.75,
  Mid: 1,
  Senior: 1.35,
  Lead: 1.7,
} as const;

type Level = keyof typeof levelMultiplier;

/**
 * ----------------------------------------------------
 * Random Distributions
 * ----------------------------------------------------
 */

function randomDepartment(): Department {
  const r = random();

  if (r < 0.45) return Department.Engineering;
  if (r < 0.65) return Department.Product;
  if (r < 0.82) return Department.Design;

  return Department.Finance;
}

function randomCountry(): Country {
  const r = random();

  if (r < 0.40) return Country.IN;
  if (r < 0.65) return Country.US;
  if (r < 0.80) return Country.DE;
  if (r < 0.92) return Country.GB;

  return Country.BR;
}

function randomLevel(): Level {
  const r = random();

  if (r < 0.45) return "Junior";
  if (r < 0.80) return "Mid";
  if (r < 0.95) return "Senior";

  return "Lead";
}

/**
 * ----------------------------------------------------
 * Main
 * ----------------------------------------------------
 */

async function main() {
  await prisma.hRUser.upsert({
    where: {
      email: "hr@acme.com",
    },
    update: {},
    create: {
      email: "hr@acme.com",
      passwordHash: createHash("sha256")
        .update("password")
        .digest("hex"),
    },
  });

  const existingEmployees = await prisma.employee.count();

  if (existingEmployees > 0) {
    console.log(
      `Database already contains ${existingEmployees} employees. Skipping seed.`
    );
    return;
  }

  const employees = Array.from(
    { length: TOTAL_EMPLOYEES },
    (_, index) => {
      const firstName = pickRandom(firstNames);
      const lastName = pickRandom(lastNames);

      const department = randomDepartment();
      const country = randomCountry();
      const level = randomLevel();

      const [minSalary, maxSalary] =
        salaryBands[department][country];

      let baseSalary = randomInt(minSalary, maxSalary);

      baseSalary = Math.round(
        baseSalary * levelMultiplier[level]
      );

      const bonusPercent = 0.05 + random() * 0.25;

      const bonus = Math.round(baseSalary * bonusPercent);

      return {
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index + 1}@acme.com`,
        department,
        country,
        currency: currencyMap[country],
        baseSalary,
        bonus,
      };
    }
  );

  for (let i = 0; i < employees.length; i += BATCH_SIZE) {
    const batch = employees.slice(i, i + BATCH_SIZE);

    await prisma.employee.createMany({
      data: batch,
    });

    console.log(
      `Inserted ${i + 1} - ${Math.min(
        i + BATCH_SIZE,
        TOTAL_EMPLOYEES
      )}`
    );
  }

  console.log("✅ Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });