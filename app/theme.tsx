"use client";
import { PropsWithChildren } from "react";

// This component is now just a passthrough since ThemeProvider handles everything
export default function Theme({ children }: PropsWithChildren) {
  return <>{children}</>;
}
