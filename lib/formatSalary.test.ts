import { describe, it, expect } from "vitest";
import { formatSalary } from "./formatSalary";

describe("formatSalary", () => {
  it("formats INR using Indian grouping (en-IN)", () => {
    expect(formatSalary(1130000, "INR")).toBe("11,30,000");
  });

  it("formats USD using US grouping (en-US)", () => {
    expect(formatSalary(1130000, "USD")).toBe("1,130,000");
  });

  it("formats GBP using UK grouping (en-GB)", () => {
    expect(formatSalary(1130000, "GBP")).toBe("1,130,000");
  });

  it("formats EUR using Irish grouping (en-IE)", () => {
    expect(formatSalary(1130000, "EUR")).toBe("1,130,000");
  });

  it("formats BRL using Brazilian grouping (pt-BR)", () => {
    expect(formatSalary(1130000, "BRL")).toBe("1.130.000");
  });

  it("falls back to en-US grouping for an unknown currency", () => {
    expect(formatSalary(1130000, "XYZ")).toBe("1,130,000");
  });

  it("formats zero correctly", () => {
    expect(formatSalary(0, "USD")).toBe("0");
  });

  it("formats values below the first grouping threshold without commas", () => {
    expect(formatSalary(999, "USD")).toBe("999");
  });
});
