import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

// Configure Inter font with display swap for better performance
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
})

// Configure JetBrains Mono for code elements
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: "北京理工大学学术研究平台",
  description: "Beijing Institute of Technology Academic Research Platform - 基于IBM Carbon和Microsoft Fluent UI设计的现代化学术管理系统",
  generator: "BIT Research Platform v2.0",
  manifest: "/manifest.json",
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="bit-animate-fade-in">
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800">
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center">
                <div className="animate-pulse text-white">加载中...</div>
              </div>
            </div>
          }>
            {children}
          </Suspense>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
