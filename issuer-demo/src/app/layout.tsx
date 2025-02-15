"use client";

import { Toaster } from "@/components/ui/toaster";
import { LogProvider } from "./contexts/BfcLogsContext";
import {
  UnpublishedEntriesProvider,
} from "./contexts/UnpublishedEntriesContext";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
          <UnpublishedEntriesProvider>
            <LogProvider>
              {children}
              <Toaster />
            </LogProvider>
          </UnpublishedEntriesProvider>
      </body>
    </html>
  );
}
