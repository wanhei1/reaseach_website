import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download } from "lucide-react"

export function SubjectNavigation() {
  const subjects = [
    { code: "01", name: "哲学", count: 152 },
    { code: "02", name: "经济学", count: 1450 },
    { code: "03", name: "法学", count: 2428 },
    { code: "04", name: "教育学", count: 1150 },
    { code: "05", name: "文学", count: 1891 },
    { code: "06", name: "历史学", count: 5 },
    { code: "07", name: "理学", count: 4652 },
    { code: "08", name: "工学", count: 47927 },
    { code: "09", name: "农学", count: 0 },
    { code: "10", name: "医学", count: 93 },
    { code: "11", name: "军事学", count: 1 },
    { code: "12", name: "管理学", count: 14799 },
    { code: "13", name: "艺术学", count: 1350 },
    { code: "14", name: "交叉学科", count: 0 },
  ]

  const papers = [
    {
      id: 1,
      title: "情感文本数据挖掘分析与理解的计算方法研究",
      englishTitle: "Research on Computational Methods for Affective Text Data Analysis and Understanding",
      author: "周迈",
      studentId: "3820192061",
      supervisor: "夏元清",
      keywords:
        "情感计算, 情感检测, 机器言语检测, 低资源语言, 多语言自然语言处理, Affective Computing, Emotion Detection, Hate Speech Detection, Low-Resource Language",
      level: "博士",
      year: "2023",
    },
  ]

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">学位论文管理系统</h1>
          <p className="text-blue-100">Beijing Institute of Technology</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex">
            {/* 左侧学科分类导航 */}
            <div className="w-80 bg-blue-600 text-white">
              <div className="p-4 bg-blue-700">
                <h2 className="text-lg font-semibold">学科分类导航</h2>
              </div>
              <div className="p-4 space-y-2">
                {subjects.map((subject) => (
                  <div
                    key={subject.code}
                    className="flex items-center justify-between p-2 hover:bg-blue-500 rounded cursor-pointer"
                  >
                    <span className="text-sm">
                      {subject.code}-{subject.name}
                    </span>
                    <span className="text-xs bg-blue-500 px-2 py-1 rounded">({subject.count})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 右侧内容区域 */}
            <div className="flex-1">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">学科分类导航</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">题名</label>
                    <Input placeholder="请输入检索内容" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">关键词</label>
                    <Input placeholder="请输入检索内容" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">检索结果排序</label>
                    <Select defaultValue="date">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">答辩日期降序</SelectItem>
                        <SelectItem value="relevance">相关度</SelectItem>
                        <SelectItem value="downloads">下载量</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Search className="w-4 h-4 mr-2" />
                      开始检索
                    </Button>
                  </div>
                </div>
              </div>

              {/* 搜索结果 */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-600">已为您找到 75931 条相关论文</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    保存
                  </Button>
                </div>

                {papers.map((paper) => (
                  <Card key={paper.id} className="mb-4">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <input type="checkbox" className="mt-1 rounded" />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-blue-600 hover:underline cursor-pointer mb-2">
                                01. 题名：{paper.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">英文题名：{paper.englishTitle}</p>
                              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-2">
                                <div>
                                  作者：{paper.author} 学号：{paper.studentId}
                                </div>
                                <div>导师：{paper.supervisor}</div>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">关键词：{paper.keywords}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>学位级别：{paper.level}</span>
                                <span>学科专业：</span>
                                <span>答辩日期：</span>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 border-blue-600 bg-transparent"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              下载全文
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="text-center mt-6">
                  <Button variant="outline">加载更多结果</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
