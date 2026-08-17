import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "연결선 — 나만의 AI 연동 설정 설계",
  description:
    "AI에 보여줄 정보와 맡길 행동의 범위를 여섯 번의 선택으로 정리하는 개인 AI 권한 설계 시뮬레이터입니다.",
};

export default function ConnectLineLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
