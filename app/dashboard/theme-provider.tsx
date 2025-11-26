"use client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { PropsWithChildren } from "react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#222222ff",
    },
    secondary: {
      main: "#005ecaff",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

// TODO: MOVE THIS TO COMPONENTS FOLDER

export default function ThemeRegistry({ children }: PropsWithChildren) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
