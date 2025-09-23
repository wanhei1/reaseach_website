import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, TrendingUp, Download, Users } from "lucide-react"

export function MainContent() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 管理规定 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              管理规定
              <span className="ml-auto text-sm font-normal text-blue-600">MORE+</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <a href="#" className="text-sm text-gray-700 hover:text-blue-600 leading-relaxed">
                电子学位论文提交注意事项
              </a>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <a href="#" className="text-sm text-gray-700 hover:text-blue-600 leading-relaxed">
                常见问题解答
              </a>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <a href="#" className="text-sm text-gray-700 hover:text-blue-600 leading-relaxed">
                已审论文延行撤销处理的相关规定
              </a>
            </div>
          </CardContent>
        </Card>

        {/* 下载排行 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              下载排行
              <span className="ml-auto text-sm font-normal text-blue-600">MORE+</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="text-sm font-semibold text-orange-500 bg-orange-100 px-2 py-1 rounded">1</span>
              <a href="#" className="text-sm text-gray-700 hover:text-blue-600 leading-relaxed flex-1">
                高速动能弹高速度侵彻混凝土数值模拟...
              </a>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-sm font-semibold text-orange-500 bg-orange-100 px-2 py-1 rounded">2</span>
              <a href="#" className="text-sm text-gray-700 hover:text-blue-600 leading-relaxed flex-1">
                玻璃纤维增强混凝土气凝胶力学性能及...
              </a>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-sm font-semibold text-orange-500 bg-orange-100 px-2 py-1 rounded">3</span>
              <a href="#" className="text-sm text-gray-700 hover:text-blue-600 leading-relaxed flex-1">
                星载主动雷达高度计信号处理技术研...
              </a>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">4</span>
              <a href="#" className="text-sm text-gray-700 hover:text-blue-600 leading-relaxed flex-1">
                基于卷积神经网络的单目标跟踪算法
              </a>
            </div>
          </CardContent>
        </Card>

        {/* 表格下载 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <Download className="w-5 h-5 mr-2 text-blue-600" />
              表格下载
              <span className="ml-auto text-sm font-normal text-blue-600">MORE+</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-orange-600 bg-orange-200 px-2 py-1 rounded">1</span>
                <span className="text-sm text-gray-700">内部论文说明单</span>
              </div>
              <Button size="sm" variant="outline" className="text-orange-600 border-orange-600 bg-transparent">
                下载
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-600 bg-gray-200 px-2 py-1 rounded">2</span>
                <span className="text-sm text-gray-700">电子论文数据申请</span>
              </div>
              <Button size="sm" variant="outline">
                下载
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-600 bg-gray-200 px-2 py-1 rounded">3</span>
                <span className="text-sm text-gray-700">博士学位论文模板</span>
              </div>
              <Button size="sm" variant="outline">
                下载
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-600 bg-gray-200 px-2 py-1 rounded">4</span>
                <span className="text-sm text-gray-700">硕士学位论文模板</span>
              </div>
              <Button size="sm" variant="outline">
                下载
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 统一认证登录区域 */}
      <div className="mt-12 bg-blue-600 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">统一认证</h3>
        <p className="text-blue-100 mb-6">论文提交请从此处</p>
        <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8">
          <Users className="w-5 h-5 mr-2" />
          统一认证登录
        </Button>
      </div>
    </main>
  )
}
