import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return { ...actual, useActionState: vi.fn() };
});

import { useActionState } from "react";
import { CsvUpload } from "./CsvUpload";
import type { ImportResult } from "@/server/modules/employee/employee.types";

const mockOnImport = vi.fn();

function setupState(result: ImportResult | null, isPending = false) {
  vi.mocked(useActionState).mockReturnValue([result, vi.fn(), isPending] as ReturnType<
    typeof useActionState
  >);
}

beforeEach(() => {
  vi.clearAllMocks();
  setupState(null);
});

describe("CsvUpload", () => {
  it("renders the import button", () => {
    render(<CsvUpload onImport={mockOnImport} />);
    expect(screen.getByRole("button", { name: /import csv/i })).toBeInTheDocument();
  });

  it("renders a hidden file input that accepts .csv files", () => {
    render(<CsvUpload onImport={mockOnImport} />);
    const input = screen.getByLabelText(/csv file input/i);
    expect(input).toHaveAttribute("type", "file");
    expect(input).toHaveAttribute("accept", ".csv");
  });

  it("shows 'Importing…' and disables the button while pending", () => {
    setupState(null, true);
    render(<CsvUpload onImport={mockOnImport} />);
    const button = screen.getByRole("button", { name: /importing/i });
    expect(button).toBeDisabled();
  });

  it("shows a success alert with the imported count after a successful import", () => {
    setupState({ success: true, imported: 42 });
    render(<CsvUpload onImport={mockOnImport} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Successfully imported 42 employees");
  });

  it("uses singular 'employee' when exactly 1 is imported", () => {
    setupState({ success: true, imported: 1 });
    render(<CsvUpload onImport={mockOnImport} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Successfully imported 1 employee");
    expect(screen.getByRole("alert")).not.toHaveTextContent("employees");
  });

  it("shows an error alert listing all errors after a failed import", () => {
    setupState({
      success: false,
      errors: [
        "Row 2: email must be a valid email address",
        "Row 3: department must be one of: Engineering, Product, Finance, Design",
      ],
    });
    render(<CsvUpload onImport={mockOnImport} />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Row 2: email must be a valid email address");
    expect(alert).toHaveTextContent("Row 3: department must be one of");
  });

  it("shows no alert when there is no result yet", () => {
    setupState(null);
    render(<CsvUpload onImport={mockOnImport} />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("opens the file picker when the Import CSV button is clicked", () => {
    render(<CsvUpload onImport={mockOnImport} />);
    const input = screen.getByLabelText(/csv file input/i);
    const clickSpy = vi.spyOn(input, "click");
    fireEvent.click(screen.getByRole("button", { name: /import csv/i }));
    expect(clickSpy).toHaveBeenCalledOnce();
  });
});
