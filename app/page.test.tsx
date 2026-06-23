import { describe, it, expect, vi } from "vitest";
import * as navigation from "next/navigation";
import RootPage from "@/app/page";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("RootPage", () => {
  it("redirects to /dashboard", () => {
    RootPage();
    expect(vi.mocked(navigation.redirect)).toHaveBeenCalledWith("/dashboard");
  });
});
