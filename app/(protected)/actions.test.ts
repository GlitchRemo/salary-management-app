import { describe, it, expect, vi } from "vitest";

const mockCookieDelete = vi.hoisted(() => vi.fn());
vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({ delete: mockCookieDelete }),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

import { redirect } from "next/navigation";
import { logoutAction } from "./actions";

const mockRedirect = vi.mocked(redirect);

describe("logoutAction", () => {
  it("deletes the session cookie", async () => {
    await logoutAction();

    expect(mockCookieDelete).toHaveBeenCalledWith("session");
  });

  it("redirects to /login", async () => {
    await logoutAction();

    expect(mockRedirect).toHaveBeenCalledWith("/login");
  });
});
