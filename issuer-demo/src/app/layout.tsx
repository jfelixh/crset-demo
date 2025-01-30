"use client";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastProvider } from "@radix-ui/react-toast";
import { Toaster } from "@/components/ui/toaster";
import { LogProvider } from "./contexts/BfcLogsContext";
import {
  UnpublishedEntriesProvider,
  useUnpublishedEntriesContext,
} from "./contexts/UnpublishedEntriesContext";

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
    <AuthProvider>
      <UnpublishedEntriesProvider>
        <LogProvider>
          <html lang="en">
            <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
              <AuthWrapper>
                {children}
                <Toaster />
              </AuthWrapper>
            </body>
          </html>
        </LogProvider>
      </UnpublishedEntriesProvider>
    </AuthProvider>
  );
}

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, logout } = useAuth();
  const { thereIsUnpublished } = useUnpublishedEntriesContext();
  const pathname = usePathname();
  // const isHomePage = pathname === "/";
  return (
    <>
      <Header
        showLinks={true}
        pathname={pathname}
        logout={logout}
        isUnpublished={thereIsUnpublished}
      />
      {children}
    </>
  );
};
