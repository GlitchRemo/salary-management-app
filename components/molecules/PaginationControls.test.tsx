import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PaginationControls } from "./PaginationControls";

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

function mockRouter(replace = vi.fn()) {
  vi.mocked(useRouter).mockReturnValue({
    replace,
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  });
  return replace;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useSearchParams).mockReturnValue(
    new URLSearchParams() as ReturnType<typeof useSearchParams>,
  );
  mockRouter();
});

describe("PaginationControls", () => {
  it("renders pagination buttons when totalPages > 1", () => {
    render(<PaginationControls totalPages={3} currentPage={1} />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders nothing when totalPages is 1", () => {
    const { container } = render(<PaginationControls totalPages={1} currentPage={1} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when totalPages is 0", () => {
    const { container } = render(<PaginationControls totalPages={0} currentPage={1} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("navigates to the selected page", () => {
    const mockReplace = mockRouter();
    render(<PaginationControls totalPages={3} currentPage={1} />);
    fireEvent.click(screen.getByRole("button", { name: /page 2/i }));
    expect(mockReplace).toHaveBeenCalledWith("/employees?page=2");
  });

  it("removes the page param when navigating to page 1", () => {
    const mockReplace = mockRouter();
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams("page=2") as ReturnType<typeof useSearchParams>,
    );
    render(<PaginationControls totalPages={3} currentPage={2} />);
    fireEvent.click(screen.getByRole("button", { name: /page 1/i }));
    expect(mockReplace).toHaveBeenCalledWith("/employees");
  });

  it("preserves other search params when changing page", () => {
    const mockReplace = mockRouter();
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams("search=Alice&country=US") as ReturnType<typeof useSearchParams>,
    );
    render(<PaginationControls totalPages={3} currentPage={1} />);
    fireEvent.click(screen.getByRole("button", { name: /page 2/i }));
    expect(mockReplace).toHaveBeenCalledWith("/employees?search=Alice&country=US&page=2");
  });
});
