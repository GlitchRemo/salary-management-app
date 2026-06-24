import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TopEarnersTable } from "./TopEarnersTable";
import type { TopEarner } from "@/server/modules/analytics/analytics.types";

const earners: TopEarner[] = [
  {
    name: "Alice Smith",
    department: "Engineering",
    country: "US",
    currency: "USD",
    baseSalary: 150000,
    bonus: 20000,
    totalCompensation: 170000,
  },
  {
    name: "Bob Jones",
    department: "Product",
    country: "US",
    currency: "USD",
    baseSalary: 120000,
    bonus: 10000,
    totalCompensation: 130000,
  },
];

describe("TopEarnersTable", () => {
  it("renders employee names", () => {
    render(<TopEarnersTable earners={earners} currency="USD" />);
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Jones")).toBeInTheDocument();
  });

  it("renders department for each earner", () => {
    render(<TopEarnersTable earners={earners} currency="USD" />);
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("Product")).toBeInTheDocument();
  });

  it("renders a fallback when there are no earners", () => {
    render(<TopEarnersTable earners={[]} currency="USD" />);
    expect(screen.getByText(/no earner data available/i)).toBeInTheDocument();
  });
});
