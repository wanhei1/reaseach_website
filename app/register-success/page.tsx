import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">BIT</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">北京理工大学</h2>
          <p className="mt-2 text-sm text-gray-600">学位论文管理系统</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <CardTitle className="text-center text-xl font-semibold text-gray-900">注册成功！</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">感谢您注册北京理工大学学位论文管理系统！</p>
            <p className="text-sm text-gray-500">我们已向您的邮箱发送了验证邮件，请点击邮件中的链接完成账户验证。</p>
            <div className="pt-4">
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                返回登录
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
