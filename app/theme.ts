"use client";

import { createTheme } from "@mui/material/styles";

const petrol = {
  main: "#005F6B",
  light: "#00899A",
  dark: "#003F4A",
  contrastText: "#FFFFFF",
};

const theme = createTheme({
  palette: {
    primary: petrol,
    background: {
      default: "#F7F7F5",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A1A1A",
      secondary: "#555555",
    },
  },
  typography: {
    fontFamily: "var(--font-geist-sans), sans-serif",
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: petrol.dark,
          color: "#FFFFFF",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: "2px 8px",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.12)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(255,255,255,0.20)",
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "rgba(255,255,255,0.80)",
          minWidth: 40,
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: "#FFFFFF",
          fontSize: "0.9rem",
        },
      },
    },
  },
});

export default theme;
