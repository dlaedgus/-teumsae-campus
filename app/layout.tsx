import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "틈새 — 내 공강 맞춤 루틴",
  description:
    "시간, 에너지, 목표, 장소, 도구와 방해 요인을 바탕으로 지금 실행할 공강 루틴을 제안하는 대학생 서비스",
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
