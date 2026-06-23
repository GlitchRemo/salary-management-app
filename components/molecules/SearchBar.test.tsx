import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchBar } from "./SearchBar";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useRouter: vi.fn(() => ({
    replace: vi.fn(),
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(() => "/employees"),
}));

import { useSearchParams, useRouter } from "next/navigation";

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams() as ReturnType<typeof useSearchParams>);
  vi.mocked(useRouter).mockReturnValue({
    replace: vi.fn(),
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  });
});

describe("SearchBar", () => {
  it("renders a search input", () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText(/search by name/i)).toBeInTheDocument();
  });

  it("pre-fills the input from the search URL param", () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams("search=Alice") as ReturnType<typeof useSearchParams>,
    );
    render(<SearchBar />);
    expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
  });

  it("does not show the clear button when the input is empty", () => {
    render(<SearchBar />);
    expect(screen.queryByRole("button", { name: /clear search/i })).not.toBeInTheDocument();
  });

  it("shows the clear button when the input has a value", () => {
    render(<SearchBar />);
    fireEvent.change(screen.getByPlaceholderText(/search by name/i), {
      target: { value: "Alice" },
    });
    expect(screen.getByRole("button", { name: /clear search/i })).toBeInTheDocument();
  });

  it("calls router.replace with the search param on form submit", () => {
    const mockReplace = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      replace: mockReplace,
      push: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    });
    render(<SearchBar />);
    fireEvent.change(screen.getByPlaceholderText(/search by name/i), {
      target: { value: "Alice" },
    });
    fireEvent.submit(screen.getByRole("form", { name: /search employees/i }));
    expect(mockReplace).toHaveBeenCalledWith("/employees?search=Alice");
  });

  it("calls router.replace without the search param when clearing", () => {
    const mockReplace = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      replace: mockReplace,
      push: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    });
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams("search=Alice") as ReturnType<typeof useSearchParams>,
    );
    render(<SearchBar />);
    fireEvent.click(screen.getByRole("button", { name: /clear search/i }));
    expect(mockReplace).toHaveBeenCalledWith("/employees");
  });

  it("removes the search param when submitting an empty input", () => {
    const mockReplace = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      replace: mockReplace,
      push: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    });
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams("search=Alice") as ReturnType<typeof useSearchParams>,
    );
    render(<SearchBar />);
    fireEvent.change(screen.getByPlaceholderText(/search by name/i), {
      target: { value: "" },
    });
    fireEvent.submit(screen.getByPlaceholderText(/search by name/i).closest("form")!);
    expect(mockReplace).toHaveBeenCalledWith("/employees");
  });
});
