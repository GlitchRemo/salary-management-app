import { describe, it, expect } from "vitest";
import { Country, Department, Currency } from "@/app/generated/prisma/enums";
import { parseCSV } from "./csv-parser.service";

const HEADERS = "employeeId,firstName,lastName,email,department,country,currency,baseSalary,bonus";
const VALID_ROW = "emp_1,John,Doe,john.doe@acme.com,Engineering,US,USD,80000,5000";
const VALID_CSV = `${HEADERS}\n${VALID_ROW}`;

describe("parseCSV", () => {
  describe("valid input", () => {
    it("returns success with a parsed row for a valid CSV", () => {
      const result = parseCSV(VALID_CSV);
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0]).toEqual({
        employeeId: "emp_1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@acme.com",
        department: Department.Engineering,
        country: Country.US,
        currency: Currency.USD,
        baseSalary: 80000,
        bonus: 5000,
      });
    });

    it("returns success with empty rows when the CSV has only a header line", () => {
      const result = parseCSV(HEADERS);
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.rows).toHaveLength(0);
    });

    it("accepts a bonus of 0", () => {
      const result = parseCSV(`${HEADERS}\nemp_1,John,Doe,john.doe@acme.com,Engineering,US,USD,80000,0`);
      expect(result.success).toBe(true);
    });

    it("parses multiple rows", () => {
      const csv = [
        HEADERS,
        "emp_1,John,Doe,john.doe@acme.com,Engineering,US,USD,80000,5000",
        "emp_2,Jane,Smith,jane.smith@acme.com,Product,DE,EUR,90000,6000",
      ].join("\n");
      const result = parseCSV(csv);
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.rows).toHaveLength(2);
    });

    it("strips a leading BOM character", () => {
      const result = parseCSV(`\uFEFF${VALID_CSV}`);
      expect(result.success).toBe(true);
    });

    it("handles CRLF line endings", () => {
      const result = parseCSV(VALID_CSV.replace(/\n/g, "\r\n"));
      expect(result.success).toBe(true);
    });

    it("accepts columns in any order", () => {
      const shuffledHeaders = "bonus,baseSalary,currency,country,department,email,lastName,firstName,employeeId";
      const shuffledRow = "5000,80000,USD,US,Engineering,john.doe@acme.com,Doe,John,emp_1";
      const result = parseCSV(`${shuffledHeaders}\n${shuffledRow}`);
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.rows[0].employeeId).toBe("emp_1");
      expect(result.rows[0].department).toBe(Department.Engineering);
    });
  });

  describe("structural errors", () => {
    it("returns failure for an empty string", () => {
      const result = parseCSV("");
      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.errors).toContain("CSV file is empty");
    });

    it("returns failure listing missing columns", () => {
      const result = parseCSV("employeeId,firstName,email\nemp_1,John,john@acme.com");
      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.errors[0]).toMatch(/missing required columns/i);
      expect(result.errors[0]).toContain("lastName");
    });

    it("returns failure listing unexpected columns", () => {
      const result = parseCSV(`${HEADERS},extraColumn\n${VALID_ROW},extra`);
      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.errors[0]).toMatch(/unexpected columns/i);
      expect(result.errors[0]).toContain("extraColumn");
    });
  });

  describe("row validation errors", () => {
    function rowWith(field: string, value: string): string {
      const fields: Record<string, string> = {
        employeeId: "emp_1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@acme.com",
        department: "Engineering",
        country: "US",
        currency: "USD",
        baseSalary: "80000",
        bonus: "5000",
      };
      fields[field] = value;
      const headers = Object.keys(fields).join(",");
      const values = Object.values(fields).join(",");
      return `${headers}\n${values}`;
    }

    it("returns failure for an invalid department value", () => {
      const result = parseCSV(rowWith("department", "Marketing"));
      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.errors[0]).toMatch(/department/i);
    });

    it("returns failure for an invalid country value", () => {
      const result = parseCSV(rowWith("country", "INVALID"));
      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.errors[0]).toMatch(/country/i);
    });

    it("returns failure for an invalid currency value", () => {
      const result = parseCSV(rowWith("currency", "CHF"));
      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.errors[0]).toMatch(/currency/i);
    });

    it("returns failure when baseSalary is zero", () => {
      const result = parseCSV(rowWith("baseSalary", "0"));
      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.errors[0]).toMatch(/baseSalary/i);
    });

    it("returns failure when baseSalary is negative", () => {
      const result = parseCSV(rowWith("baseSalary", "-1000"));
      expect(result.success).toBe(false);
    });

    it("returns failure when baseSalary is not a number", () => {
      const result = parseCSV(rowWith("baseSalary", "abc"));
      expect(result.success).toBe(false);
    });

    it("returns failure when bonus is negative", () => {
      const result = parseCSV(rowWith("bonus", "-1"));
      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.errors[0]).toMatch(/bonus/i);
    });

    it("returns failure for an invalid email", () => {
      const result = parseCSV(rowWith("email", "not-an-email"));
      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.errors[0]).toMatch(/email/i);
    });

    it("returns failure when employeeId is empty", () => {
      const result = parseCSV(rowWith("employeeId", ""));
      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.errors[0]).toMatch(/employeeId/i);
    });

    it("collects errors from multiple rows and returns them all", () => {
      const csv = [
        HEADERS,
        "emp_1,John,Doe,not-an-email,Engineering,US,USD,80000,5000",
        "emp_2,Jane,Smith,jane@acme.com,INVALID_DEPT,US,USD,90000,0",
      ].join("\n");
      const result = parseCSV(csv);
      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.errors).toHaveLength(2);
      expect(result.errors[0]).toContain("Row 2");
      expect(result.errors[1]).toContain("Row 3");
    });
  });
});
