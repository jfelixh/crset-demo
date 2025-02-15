"use client";

import Header from "@/components/Header";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import { LogProvider } from "./contexts/BfcLogsContext";
import {
  UnpublishedEntriesProvider,
  useUnpublishedEntriesContext,
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
            <HeaderWrapper>{children}</HeaderWrapper>
            <Toaster />
          </LogProvider>
        </UnpublishedEntriesProvider>
      </body>
    </html>
  );
}

const HeaderWrapper = ({ children }: { children: React.ReactNode }) => {
  const { thereIsUnpublished } = useUnpublishedEntriesContext();
  const pathname = usePathname();
  return (
    <>
      <Header
        pathname={pathname}
        isUnpublished={thereIsUnpublished}
      />
      {children}
    </>
  );
};
