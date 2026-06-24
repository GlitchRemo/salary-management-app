"use client";

import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import Avatar from "@mui/material/Avatar";
import { NavigationSidebar } from "@/components/organisms/NavigationSidebar";

const SIDEBAR_WIDTH = 220;

interface DashboardLayoutProps {
  children: ReactNode;
  userEmail?: string;
}

export function DashboardLayout({ children, userEmail = "" }: DashboardLayoutProps) {
  const initial = userEmail.charAt(0).toUpperCase() || "?";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap component="div">
            ACME HR
          </Typography>
          {userEmail && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography variant="body2" sx={{ color: "primary.contrastText" }}>
                {userEmail}
              </Typography>
              <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.light", fontSize: 14 }}>
                {initial}
              </Avatar>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: SIDEBAR_WIDTH,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Toolbar />
        <NavigationSidebar />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: "background.default",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
