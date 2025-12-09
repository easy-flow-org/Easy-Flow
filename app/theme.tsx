"use client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { PropsWithChildren } from "react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#206cb9ff",
    },
    secondary: {
      main: "#f50057",
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

export default function Theme({ children }: PropsWithChildren) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
