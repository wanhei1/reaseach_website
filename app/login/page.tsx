import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
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
        <LoginForm />
      </div>
    </div>
  )
}
