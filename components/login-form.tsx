"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  })
  const [adminData, setAdminData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent, userType: "student" | "admin") => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const email = userType === "admin" ? adminData.email : loginData.username
      const password = userType === "admin" ? adminData.password : loginData.password

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
        },
      })

      if (error) throw error

      router.push(userType === "admin" ? "/dashboard" : "/")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "登录失败")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center text-xl font-semibold text-gray-900">系统登录</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="student" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student">学生/教师登录</TabsTrigger>
            <TabsTrigger value="admin">管理员登录</TabsTrigger>
          </TabsList>

          <TabsContent value="student" className="space-y-4 mt-6">
            <form onSubmit={(e) => handleLogin(e, "student")} className="space-y-4">
              <div>
                <Label htmlFor="username">邮箱地址</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="username"
                    type="email"
                    placeholder="请输入邮箱地址"
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">密码</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="请输入密码"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={loginData.rememberMe}
                    onCheckedChange={(checked) => setLoginData({ ...loginData, rememberMe: checked as boolean })}
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    记住我
                  </Label>
                </div>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  忘记密码？
                </Link>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                    <span className="text-sm text-red-800">{error}</span>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? "登录中..." : "登录"}
              </Button>

              <div className="text-center">
                <span className="text-sm text-gray-600">还没有账号？</span>
                <Link href="/register" className="text-sm text-blue-600 hover:underline ml-1">
                  立即注册
                </Link>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="admin" className="space-y-4 mt-6">
            <form onSubmit={(e) => handleLogin(e, "admin")} className="space-y-4">
              <div>
                <Label htmlFor="admin-email">管理员邮箱</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="请输入管理员邮箱"
                    value={adminData.email}
                    onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="admin-password">密码</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="请输入管理员密码"
                    value={adminData.password}
                    onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="admin-remember"
                  checked={adminData.rememberMe}
                  onCheckedChange={(checked) => setAdminData({ ...adminData, rememberMe: checked as boolean })}
                />
                <Label htmlFor="admin-remember" className="text-sm text-gray-600">
                  记住我
                </Label>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                    <span className="text-sm text-red-800">{error}</span>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                {isLoading ? "登录中..." : "管理员登录"}
              </Button>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                  <span className="text-sm text-yellow-800">管理员登录需要特殊权限</span>
                </div>
              </div>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              登录即表示您同意我们的
              <Link href="/terms" className="text-blue-600 hover:underline">
                服务条款
              </Link>
              和
              <Link href="/privacy" className="text-blue-600 hover:underline">
                隐私政策
              </Link>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
