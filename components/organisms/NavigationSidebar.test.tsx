import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NavigationSidebar } from "@/components/organisms/NavigationSidebar";

vi.mock("@/app/(protected)/actions", () => ({
  logoutAction: vi.fn(),
}));

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

  it("renders a Logout button", () => {
    render(<NavigationSidebar />);
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });
});
