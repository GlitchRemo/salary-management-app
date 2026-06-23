import { Country, Department, Currency } from "@/app/generated/prisma/enums";
import type { CsvParseResult, CsvRow } from "./csv-parser.types";

export const REQUIRED_COLUMNS = [
  "employeeId",
  "firstName",
  "lastName",
  "email",
  "department",
  "country",
  "currency",
  "baseSalary",
  "bonus",
] as const;

const VALID_DEPARTMENTS: readonly Department[] = [
  Department.Engineering,
  Department.Product,
  Department.Finance,
  Department.Design,
];

const VALID_COUNTRIES: readonly Country[] = [
  Country.US,
  Country.DE,
  Country.GB,
  Country.BR,
  Country.IN,
];

const VALID_CURRENCIES: readonly Currency[] = [
  Currency.USD,
  Currency.EUR,
  Currency.GBP,
  Currency.BRL,
  Currency.INR,
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseLine(line: string): string[] {
  return line.split(",").map((cell) => cell.trim());
}

function validateHeaders(headers: string[]): string[] {
  const headerSet = new Set<string>(headers);
  const requiredSet = new Set<string>(REQUIRED_COLUMNS);

  const missing = REQUIRED_COLUMNS.filter((col) => !headerSet.has(col));
  const extra = headers.filter((col) => !requiredSet.has(col));

  const errors: string[] = [];
  if (missing.length > 0) {
    errors.push(`Missing required columns: ${missing.join(", ")}`);
  }
  if (extra.length > 0) {
    errors.push(`Unexpected columns: ${extra.join(", ")}`);
  }
  return errors;
}

function parseRow(
  raw: Record<string, string>,
  rowNumber: number,
): { row: CsvRow } | { errors: string[] } {
  const errors: string[] = [];

  if (!raw["employeeId"]) errors.push(`Row ${rowNumber}: employeeId is required`);
  if (!raw["firstName"]) errors.push(`Row ${rowNumber}: firstName is required`);
  if (!raw["lastName"]) errors.push(`Row ${rowNumber}: lastName is required`);

  if (!raw["email"] || !EMAIL_PATTERN.test(raw["email"])) {
    errors.push(`Row ${rowNumber}: email must be a valid email address`);
  }

  const department = VALID_DEPARTMENTS.find((d) => d === raw["department"]);
  if (department === undefined) {
    errors.push(
      `Row ${rowNumber}: department must be one of: ${VALID_DEPARTMENTS.join(", ")}`,
    );
  }

  const country = VALID_COUNTRIES.find((c) => c === raw["country"]);
  if (country === undefined) {
    errors.push(
      `Row ${rowNumber}: country must be one of: ${VALID_COUNTRIES.join(", ")}`,
    );
  }

  const currency = VALID_CURRENCIES.find((c) => c === raw["currency"]);
  if (currency === undefined) {
    errors.push(
      `Row ${rowNumber}: currency must be one of: ${VALID_CURRENCIES.join(", ")}`,
    );
  }

  const baseSalary = Number(raw["baseSalary"]);
  if (!raw["baseSalary"] || isNaN(baseSalary) || baseSalary <= 0) {
    errors.push(`Row ${rowNumber}: baseSalary must be greater than 0`);
  }

  const bonus = Number(raw["bonus"]);
  if (raw["bonus"] === "" || isNaN(bonus) || bonus < 0) {
    errors.push(`Row ${rowNumber}: bonus must be zero or greater`);
  }

  if (errors.length > 0) return { errors };

  return {
    row: {
      employeeId: raw["employeeId"],
      firstName: raw["firstName"],
      lastName: raw["lastName"],
      email: raw["email"],
      department: department ?? Department.Engineering,
      country: country ?? Country.US,
      currency: currency ?? Currency.USD,
      baseSalary,
      bonus,
    },
  };
}

export function parseCSV(content: string): CsvParseResult {
  const text = content.startsWith("\uFEFF") ? content.slice(1) : content;

  const lines = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return { success: false, errors: ["CSV file is empty"] };
  }

  const headers = parseLine(lines[0]);
  const headerErrors = validateHeaders(headers);
  if (headerErrors.length > 0) {
    return { success: false, errors: headerErrors };
  }

  if (lines.length === 1) {
    return { success: true, rows: [] };
  }

  const allErrors: string[] = [];
  const rows: CsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cells = parseLine(lines[i]);
    const raw: Record<string, string> = {};
    headers.forEach((header, idx) => {
      raw[header] = cells[idx] ?? "";
    });

    const result = parseRow(raw, i + 1);
    if ("errors" in result) {
      allErrors.push(...result.errors);
    } else {
      rows.push(result.row);
    }
  }

  if (allErrors.length > 0) {
    return { success: false, errors: allErrors };
  }

  return { success: true, rows };
}
