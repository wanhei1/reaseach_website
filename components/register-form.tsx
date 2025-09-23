"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Mail, Lock, Phone, Building, Eye, EyeOff, AlertCircle } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    userType: "student",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    studentId: "",
    phone: "",
    department: "",
    major: "",
    agreeTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setError("密码不匹配")
      return
    }
    if (!formData.agreeTerms) {
      setError("请同意服务条款")
      return
    }

    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: formData.fullName,
            user_type: formData.userType,
            department: formData.department,
            major: formData.major,
            student_id: formData.studentId,
            phone: formData.phone,
          },
        },
      })

      if (error) throw error

      router.push("/register-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "注册失败")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center text-xl font-semibold text-gray-900">用户注册</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="userType">用户类型</Label>
            <Select value={formData.userType} onValueChange={(value) => handleInputChange("userType", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">学生</SelectItem>
                <SelectItem value="teacher">教师</SelectItem>
                <SelectItem value="researcher">研究人员</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username">用户名</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="请输入用户名"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="fullName">真实姓名</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="请输入真实姓名"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="email">邮箱地址</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="请输入邮箱地址"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {formData.userType === "student" && (
            <div>
              <Label htmlFor="studentId">学号</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="studentId"
                  type="text"
                  placeholder="请输入学号"
                  value={formData.studentId}
                  onChange={(e) => handleInputChange("studentId", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="phone">手机号码</Label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="请输入手机号码"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">院系</Label>
              <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="请选择院系" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cs">计算机学院</SelectItem>
                  <SelectItem value="ee">信息与电子学院</SelectItem>
                  <SelectItem value="me">机械与车辆学院</SelectItem>
                  <SelectItem value="ae">宇航学院</SelectItem>
                  <SelectItem value="math">理学院</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="major">专业</Label>
              <div className="relative mt-1">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="major"
                  type="text"
                  placeholder="请输入专业名称"
                  value={formData.major}
                  onChange={(e) => handleInputChange("major", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
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
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
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

          <div>
            <Label htmlFor="confirmPassword">确认密码</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="请再次输入密码"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="agreeTerms"
              checked={formData.agreeTerms}
              onCheckedChange={(checked) => handleInputChange("agreeTerms", checked as boolean)}
              className="mt-1"
            />
            <Label htmlFor="agreeTerms" className="text-sm text-gray-600 leading-relaxed">
              我已阅读并同意
              <Link href="/terms" className="text-blue-600 hover:underline">
                《服务条款》
              </Link>
              和
              <Link href="/privacy" className="text-blue-600 hover:underline">
                《隐私政策》
              </Link>
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

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={!formData.agreeTerms || isLoading}
          >
            {isLoading ? "注册中..." : "注册账号"}
          </Button>

          <div className="text-center">
            <span className="text-sm text-gray-600">已有账号？</span>
            <Link href="/login" className="text-sm text-blue-600 hover:underline ml-1">
              立即登录
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
