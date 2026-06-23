import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EnumFilterSelect } from "./EnumFilterSelect";

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

const OPTIONS = [
  { value: "foo", label: "Foo Label" },
  { value: "bar", label: "Bar Label" },
];

const DEFAULT_PROPS = {
  param: "type",
  label: "Type",
  allLabel: "All types",
  options: OPTIONS,
  ariaLabel: "Filter by type",
};

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

describe("EnumFilterSelect", () => {
  it("renders the aria label", () => {
    render(<EnumFilterSelect {...DEFAULT_PROPS} />);
    expect(screen.getByLabelText(/filter by type/i)).toBeInTheDocument();
  });

  it("renders the all-items option and each provided option", () => {
    render(<EnumFilterSelect {...DEFAULT_PROPS} />);
    fireEvent.mouseDown(screen.getByRole("combobox"));
    expect(screen.getByRole("option", { name: /all types/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /foo label/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /bar label/i })).toBeInTheDocument();
  });

  it("pre-fills from the URL param", () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams("type=foo") as ReturnType<typeof useSearchParams>,
    );
    render(<EnumFilterSelect {...DEFAULT_PROPS} />);
    expect(screen.getByText("Foo Label")).toBeInTheDocument();
  });

  it("calls router.replace with the param set when an option is selected", () => {
    const mockReplace = mockRouter();
    render(<EnumFilterSelect {...DEFAULT_PROPS} />);
    fireEvent.mouseDown(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: /bar label/i }));
    expect(mockReplace).toHaveBeenCalledWith("/employees?type=bar");
  });

  it("removes the param when the all-items option is selected", () => {
    const mockReplace = mockRouter();
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams("type=foo") as ReturnType<typeof useSearchParams>,
    );
    render(<EnumFilterSelect {...DEFAULT_PROPS} />);
    fireEvent.mouseDown(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: /all types/i }));
    expect(mockReplace).toHaveBeenCalledWith("/employees");
  });

  it("preserves other search params when selecting an option", () => {
    const mockReplace = mockRouter();
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams("search=Alice") as ReturnType<typeof useSearchParams>,
    );
    render(<EnumFilterSelect {...DEFAULT_PROPS} />);
    fireEvent.mouseDown(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: /foo label/i }));
    expect(mockReplace).toHaveBeenCalledWith("/employees?search=Alice&type=foo");
  });
});
