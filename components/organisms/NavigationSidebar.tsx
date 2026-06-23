"use client";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
  { label: "Employees", href: "/employees", icon: <PeopleIcon /> },
  { label: "Analytics", href: "/analytics", icon: <BarChartIcon /> },
] as const;

export function NavigationSidebar() {
  return (
    <List component="nav" sx={{ pt: 1 }}>
      {NAV_ITEMS.map(({ label, href, icon }) => (
        <ListItemButton key={href} component="a" href={href}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={label} />
        </ListItemButton>
      ))}
    </List>
  );
}
