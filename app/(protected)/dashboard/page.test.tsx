import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardPage from "@/app/(protected)/dashboard/page";

describe("DashboardPage", () => {
  it("renders the page heading", () => {
    render(<DashboardPage />);
    expect(screen.getByRole("heading", { name: /dashboard/i })).toBeInTheDocument();
  });

  it("renders a coming soon message", () => {
    render(<DashboardPage />);
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
  });
});
