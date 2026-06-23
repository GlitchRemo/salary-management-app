import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NavigationSidebar } from "@/components/organisms/NavigationSidebar";

describe("NavigationSidebar", () => {
  it("renders the Dashboard navigation link", () => {
    render(<NavigationSidebar />);
    const link = screen.getByRole("link", { name: /dashboard/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/dashboard");
  });

  it("renders the Employees navigation link", () => {
    render(<NavigationSidebar />);
    const link = screen.getByRole("link", { name: /employees/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/employees");
  });

  it("renders the Analytics navigation link", () => {
    render(<NavigationSidebar />);
    const link = screen.getByRole("link", { name: /analytics/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/analytics");
  });
});
