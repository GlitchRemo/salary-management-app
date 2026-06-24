"use client";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LogoutIcon from "@mui/icons-material/Logout";
import { logoutAction } from "@/app/(protected)/actions";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
  { label: "Employees", href: "/employees", icon: <PeopleIcon /> },
  { label: "Analytics", href: "/analytics", icon: <BarChartIcon /> },
] as const;

export function NavigationSidebar() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
      <List component="nav" sx={{ pt: 1 }}>
        {NAV_ITEMS.map(({ label, href, icon }) => (
          <ListItemButton key={href} component="a" href={href}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ mt: "auto", p: 1 }}>
        <form action={logoutAction}>
          <ListItemButton
            type="submit"
            component="button"
            sx={{ width: "100%", borderRadius: 2, mx: 0 }}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </form>
      </Box>
    </Box>
  );
}
