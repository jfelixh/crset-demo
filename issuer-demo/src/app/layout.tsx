"use client";

import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import localFont from "next/font/local";
import { usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LogProvider } from "./contexts/BfcLogsContext";
import {
  UnpublishedEntriesProvider,
  useUnpublishedEntriesContext,
} from "./contexts/UnpublishedEntriesContext";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <UnpublishedEntriesProvider>
            <LogProvider>
              <AuthWrapper>{children}</AuthWrapper>
              <Toaster />
            </LogProvider>
          </UnpublishedEntriesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, logout } = useAuth();
  const { thereIsUnpublished } = useUnpublishedEntriesContext();
  const pathname = usePathname();
  return (
    <>
      <Header
        showLinks={isAuthenticated}
        pathname={pathname}
        logout={logout}
        isUnpublished={thereIsUnpublished}
      />
      {children}
    </>
  );
};
