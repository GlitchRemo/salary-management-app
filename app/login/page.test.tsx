import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { LoginActionState } from "./actions";

vi.mock("./actions", () => ({
  loginAction: vi.fn(),
}));

vi.mock("react-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-dom")>();
  return {
    ...actual,
    useFormStatus: vi.fn().mockReturnValue({ pending: false }),
  };
});

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return {
    ...actual,
    useActionState: vi.fn().mockReturnValue([null, vi.fn(), false]),
  };
});

import { useActionState } from "react";
import LoginPage from "./page";

const mockUseActionState = vi.mocked(useActionState);

describe("LoginPage", () => {
  it("renders the application name", () => {
    render(<LoginPage />);
    expect(screen.getByRole("heading", { name: /acme hr/i })).toBeInTheDocument();
  });

  it("renders the email field", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("renders the password field", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("renders the sign in button", () => {
    render(<LoginPage />);
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("does not show an error alert by default", () => {
    render(<LoginPage />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

describe("LoginPage — error state", () => {
  it("displays the error message returned by the action", () => {
    mockUseActionState.mockReturnValueOnce([
      { error: "Invalid email or password." } satisfies LoginActionState,
      vi.fn(),
      false,
    ]);

    render(<LoginPage />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Invalid email or password.")).toBeInTheDocument();
  });
});
