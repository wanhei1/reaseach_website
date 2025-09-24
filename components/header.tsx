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
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">BIT</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">北京理工大学</h1>
                <p className="text-sm text-gray-600">学位论文管理系统</p>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
              首页
            </Link>
            <Link href="/subjects" className="text-gray-700 hover:text-blue-600 font-medium">
              学科导航
            </Link>
            <Link href="/papers/submit" className="text-gray-700 hover:text-blue-600 font-medium">
              论文提交
            </Link>
            <Link href="/departments" className="text-gray-700 hover:text-blue-600 font-medium">
              院系专业导航
            </Link>
            <Link href="/search" className="text-gray-700 hover:text-blue-600 font-medium">
              高级检索
            </Link>
            <Link href="/scholars" className="text-gray-700 hover:text-blue-600 font-medium">
              学者目录
            </Link>
            <Link href="/papers" className="text-gray-700 hover:text-blue-600 font-medium">
              论文管理
            </Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
              数据分析
            </Link>
            <Link href="/knowledge-graph" className="text-gray-700 hover:text-blue-600 font-medium">
              知识图谱
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 animate-spin border-2 border-blue-600 border-t-transparent rounded-full"></div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <Link href="/profile">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {user.name}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  退出
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent"
                  >
                    <User className="w-4 h-4 mr-2" />
                    登录
                  </Button>
                </Link>
                <span className="text-sm text-gray-500">IT用户</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
