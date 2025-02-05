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
      <AuthProvider>
        <UnpublishedEntriesProvider>
          <LogProvider>
            <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
              <AuthWrapper>
                {children}
              </AuthWrapper>
              <Toaster />
            </body>
          </LogProvider>
        </UnpublishedEntriesProvider>
      </AuthProvider>
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
