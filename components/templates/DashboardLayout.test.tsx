import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardLayout } from "@/components/templates/DashboardLayout";

describe("DashboardLayout", () => {
  it("renders the application title in the AppBar", () => {
    render(<DashboardLayout>content</DashboardLayout>);
    expect(screen.getByText("ACME HR")).toBeInTheDocument();
  });

  it("renders children in the main content area", () => {
    render(<DashboardLayout><p>page content</p></DashboardLayout>);
    expect(screen.getByText("page content")).toBeInTheDocument();
  });

  it("renders the navigation sidebar", () => {
    render(<DashboardLayout>content</DashboardLayout>);
    expect(screen.getByRole("link", { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /employees/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /analytics/i })).toBeInTheDocument();
  });
});
