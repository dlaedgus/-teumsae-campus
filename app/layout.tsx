import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "틈새 — 공강 루틴 추천",
  description: "시간, 에너지, 목적, 장소에 맞춰 공강 루틴을 제안하는 대학생 서비스",
  other: {
    "codex-preview": "development",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
