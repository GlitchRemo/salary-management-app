import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { getSessionUser } from "@/server/modules/auth/auth.service";
import type { ReactNode } from "react";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  return <DashboardLayout userEmail={user?.email ?? ""}>{children}</DashboardLayout>;
}
