import type { Metadata } from "next";
import { SessionProvider } from "@/components/providers/session-provider";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Pickable",
  description: "GDGoC 해커톤 프로젝트",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <SessionProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </SessionProvider>
      </body>
    </html>
  );
}
