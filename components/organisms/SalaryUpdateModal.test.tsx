import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, render, screen, fireEvent, waitFor } from "@testing-library/react";
import { buildEmployeeDto } from "@/test/fixtures";
import { SalaryUpdateModal } from "./SalaryUpdateModal";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ refresh: vi.fn() })),
}));

import { useRouter } from "next/navigation";

function renderModal(
  overrides: Partial<Parameters<typeof SalaryUpdateModal>[0]> = {},
) {
  const mockOnUpdate = vi.fn().mockResolvedValue(undefined);
  const employee = buildEmployeeDto({ currency: "USD", baseSalary: 80000, bonus: 5000 });
  render(
    <SalaryUpdateModal
      employee={employee}
      onUpdate={mockOnUpdate}
      {...overrides}
    />,
  );
  return { mockOnUpdate, employee };
}

function openModal(label: RegExp = /edit base salary/i) {
  fireEvent.click(screen.getByRole("button", { name: label }));
}

describe("SalaryUpdateModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders base salary value with currency", () => {
    renderModal();
    expect(screen.getByText("USD 80,000")).toBeInTheDocument();
  });

  it("renders bonus value with currency", () => {
    renderModal();
    expect(screen.getByText("USD 5,000")).toBeInTheDocument();
  });

  it("renders an edit button for base salary", () => {
    renderModal();
    expect(screen.getByRole("button", { name: /edit base salary/i })).toBeInTheDocument();
  });

  it("renders an edit button for bonus", () => {
    renderModal();
    expect(screen.getByRole("button", { name: /edit bonus/i })).toBeInTheDocument();
  });

  it("opens the dialog when the base salary edit button is clicked", () => {
    renderModal();
    openModal(/edit base salary/i);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("opens the dialog when the bonus edit button is clicked", () => {
    renderModal();
    openModal(/edit bonus/i);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("pre-fills the base salary field when editing base salary", () => {
    renderModal();
    openModal(/edit base salary/i);
    expect(screen.getByDisplayValue("80000")).toBeInTheDocument();
  });

  it("pre-fills the bonus field when editing bonus", () => {
    renderModal();
    openModal(/edit bonus/i);
    expect(screen.getByDisplayValue("5000")).toBeInTheDocument();
  });

  it("clicking Cancel does not call onUpdate", () => {
    const { mockOnUpdate } = renderModal();
    openModal();
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockOnUpdate).not.toHaveBeenCalled();
  });

  it("calls onUpdate with updated base salary and existing bonus on salary save", async () => {
    const { mockOnUpdate, employee } = renderModal();
    openModal(/edit base salary/i);
    fireEvent.change(screen.getByDisplayValue("80000"), { target: { value: "90000" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    await waitFor(() => expect(mockOnUpdate).toHaveBeenCalledWith(90000, employee.bonus));
  });

  it("calls onUpdate with existing base salary and updated bonus on bonus save", async () => {
    const { mockOnUpdate, employee } = renderModal();
    openModal(/edit bonus/i);
    fireEvent.change(screen.getByDisplayValue("5000"), { target: { value: "6000" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    await waitFor(() => expect(mockOnUpdate).toHaveBeenCalledWith(employee.baseSalary, 6000));
  });

  it("calls router.refresh after a successful save", async () => {
    const mockRefresh = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      refresh: mockRefresh,
      back: vi.fn(),
      forward: vi.fn(),
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    });
    renderModal();
    openModal();
    await act(async () => {
      fireEvent.change(screen.getByDisplayValue("80000"), { target: { value: "90000" } });
      fireEvent.click(screen.getByRole("button", { name: /save/i }));
    });
    expect(mockRefresh).toHaveBeenCalled();
  });

  it("shows a validation error when base salary is zero", async () => {
    renderModal();
    openModal();
    fireEvent.change(screen.getByDisplayValue("80000"), { target: { value: "0" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(await screen.findByText(/base salary must be greater than 0/i)).toBeInTheDocument();
  });

  it("shows a validation error when base salary is negative", async () => {
    renderModal();
    openModal();
    fireEvent.change(screen.getByDisplayValue("80000"), { target: { value: "-1" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(await screen.findByText(/base salary must be greater than 0/i)).toBeInTheDocument();
  });

  it("shows a validation error when bonus is negative", async () => {
    renderModal();
    openModal(/edit bonus/i);
    fireEvent.change(screen.getByDisplayValue("5000"), { target: { value: "-1" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(await screen.findByText(/bonus must be zero or greater/i)).toBeInTheDocument();
  });

  it("does not call onUpdate when validation fails", async () => {
    const { mockOnUpdate } = renderModal();
    openModal();
    fireEvent.change(screen.getByDisplayValue("80000"), { target: { value: "0" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(mockOnUpdate).not.toHaveBeenCalled();
  });

  it("shows a server error message when onUpdate rejects", async () => {
    const mockOnUpdate = vi.fn().mockRejectedValue(new Error("server error"));
    renderModal({ onUpdate: mockOnUpdate });
    openModal();
    fireEvent.change(screen.getByDisplayValue("80000"), { target: { value: "90000" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(
      await screen.findByText(/failed to update salary/i),
    ).toBeInTheDocument();
  });

  it("does not call onUpdate when the value is unchanged", async () => {
    const { mockOnUpdate } = renderModal();
    openModal();
    // value is pre-filled with current salary — do not change it
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(mockOnUpdate).not.toHaveBeenCalled();
  });
});
