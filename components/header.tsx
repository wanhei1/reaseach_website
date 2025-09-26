"use client"
import { Button } from "@/components/ui/button"
import { User, LogOut } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ name: string; type: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // 获取当前用户状态
    const getUser = async () => {
      try {
        const { data: { user: authUser }, error } = await supabase.auth.getUser()
        
        if (error || !authUser) {
          setIsAuthenticated(false)
          setUser(null)
        } else {
          setIsAuthenticated(true)
          
          // 尝试从profiles表获取用户信息
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, full_name, user_type')
            .eq('id', authUser.id)
            .single()

          if (profile) {
            setUser({
              name: profile.full_name || profile.username || authUser.email?.split('@')[0] || '用户',
              type: profile.user_type || '用户'
            })
          } else {
            // 如果没有profile，使用auth用户基本信息
            setUser({
              name: authUser.email?.split('@')[0] || '用户',
              type: '用户'
            })
          }
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setIsAuthenticated(false)
        setUser(null)
      } else if (event === 'SIGNED_IN' && session) {
        getUser() // 重新获取用户信息
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setIsAuthenticated(false)
      setUser(null)
      window.location.href = "/"
    } catch (error) {
      console.error('退出失败:', error)
    }
  }

  return (
    <header className="relative">
      <div className="bit-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section - Enterprise Style */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="w-12 h-12 bit-gradient-blue rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <span className="text-white font-bold text-lg tracking-tight">BIT</span>
                </div>
                <div className="absolute -inset-0.5 bit-gradient-blue rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="bit-text-heading-3 text-white group-hover:bit-text-gradient transition-all duration-300">
                  北京理工大学
                </h1>
                <p className="bit-text-body-small text-white/70">
                  学术研究平台
                </p>
              </div>
            </Link>
          </div>

          {/* Main Navigation - IBM Carbon Style */}
          <nav className="hidden lg:flex items-center space-x-1">
            {[
              { href: "/", label: "首页", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
              { href: "/papers", label: "论文管理", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
              { href: "/scholars", label: "学者目录", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
              { href: "/search", label: "高级检索", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
              { href: "/knowledge-graph", label: "知识图谱", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
              { href: "/dashboard", label: "数据分析", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <svg className="w-4 h-4 mr-2 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
                <span className="bit-text-body-small font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Section - Microsoft Fluent Style */}
          <div className="flex items-center space-x-3">
            {loading ? (
              <div className="w-8 h-8 animate-spin border-2 border-white/30 border-t-white rounded-full"></div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <Link href="/profile">
                  <button className="bit-btn bit-btn-secondary bit-btn-small">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline ml-2">{user.name}</span>
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bit-btn bit-btn-ghost bit-btn-small text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2">退出</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <button className="bit-btn bit-btn-primary bit-btn-small">
                    <User className="w-4 h-4" />
                    <span className="ml-2">登录</span>
                  </button>
                </Link>
                <Link href="/register">
                  <button className="bit-btn bit-btn-ghost bit-btn-small">
                    注册
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
