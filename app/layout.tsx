import type { Metadata } from "next";
import { AuthProvider } from "./context/authContext";
import Theme from "./theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "Easy Flow",
  description: "College platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Theme>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Theme>
      </body>
    </html>
  );
}
