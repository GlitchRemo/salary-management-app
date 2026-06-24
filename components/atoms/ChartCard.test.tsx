import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChartCard } from "./ChartCard";

describe("ChartCard", () => {
  it("renders the title", () => {
    render(<ChartCard title="Payroll by Department">content</ChartCard>);
    expect(screen.getByText("Payroll by Department")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(<ChartCard title="Test"><span>chart goes here</span></ChartCard>);
    expect(screen.getByText("chart goes here")).toBeInTheDocument();
  });
});
