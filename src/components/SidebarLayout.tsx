"use client"

import { ReactNode } from "react"
import { BarChart3, Map as MapIcon, Info, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

interface SidebarProps {
  children: ReactNode
}

export default function SidebarLayout({ children }: SidebarProps) {
  const pathname = usePathname()

  const navLinks = [
    { href: "/", label: "대시보드", icon: BarChart3 },
    { href: "/about", label: "서비스 소개", icon: Info },
  ]

  return (
    <div className="flex h-screen bg-neutral-950 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col hidden md:flex shrink-0">
        <div className="p-6 flex items-center space-x-3 text-blue-500">
          <MapIcon className="w-8 h-8" />
          <span className="text-xl font-bold text-white tracking-tight">K-WiFi</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-blue-500/10 text-blue-500 font-semibold"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-blue-500" : ""}`} />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>로그아웃</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-black/50">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-neutral-900 border-b border-neutral-800">
          <div className="flex items-center space-x-2 text-blue-500">
            <MapIcon className="w-6 h-6" />
            <span className="font-bold text-white">K-WiFi</span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-neutral-400 p-2"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
