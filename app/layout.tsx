import type { Metadata } from "next";
import { AuthProvider } from "./context/authContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Easy Flow",
  description: "College platform",
};
import ThemeRegistry from "./theme";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
