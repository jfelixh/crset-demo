"use client";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastProvider } from "@radix-ui/react-toast";

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
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <AuthWrapper>{children}</AuthWrapper>
        </body>
      </html>
    </AuthProvider>
  );
}

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  // const isHomePage = pathname === "/";
  return (
    <>
      <Header showLinks={isAuthenticated} pathname={pathname} logout={logout} />
      {children}
    </>
  );
};
