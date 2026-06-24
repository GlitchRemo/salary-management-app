import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

import { CountrySelector } from "./CountrySelector";

describe("CountrySelector", () => {
  it("renders the country select with the current value", () => {
    render(<CountrySelector selectedCountry="US" />);
    expect(screen.getByLabelText("Country")).toBeInTheDocument();
  });

  it("displays the label for the selected country", () => {
    render(<CountrySelector selectedCountry="US" />);
    expect(screen.getByText("United States")).toBeInTheDocument();
  });

  it("displays the label for a different selected country", () => {
    render(<CountrySelector selectedCountry="DE" />);
    expect(screen.getByText("Germany")).toBeInTheDocument();
  });
});
