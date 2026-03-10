import type { Metadata } from "next"
import "./globals.css"
import { SessionProvider } from "@/components/SessionProvider"

export const metadata: Metadata = {
  title: "Korea Public WiFi Dashboard",
  description: "전국 공공 와이파이 설치 현황 대시보드",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="font-sans bg-neutral-950 text-white min-h-screen antialiased selection:bg-blue-500/30">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
