import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SummaryCard } from "./SummaryCard";

describe("SummaryCard", () => {
  it("renders the title", () => {
    render(<SummaryCard title="Employee Count" value="42" />);
    expect(screen.getByText("Employee Count")).toBeInTheDocument();
  });

  it("renders the value", () => {
    render(<SummaryCard title="Total Payroll" value="$1,200,000" />);
    expect(screen.getByText("$1,200,000")).toBeInTheDocument();
  });
});
