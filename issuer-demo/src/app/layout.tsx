"use client";

import Header from "@/components/header";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import { LogProvider } from "./contexts/logsContext";
import {
  UnpublishedEntriesProvider,
  useUnpublishedEntriesContext,
} from "./contexts/unpublishedEntriesContext";
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
      <Header pathname={pathname} isUnpublished={thereIsUnpublished} />
      {children}
    </>
  );
};
