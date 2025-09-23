"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, FileText, Clock, CheckCircle, XCircle, Download, Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function PaperManagement() {
  const [activeTab, setActiveTab] = useState("all")

  const papers = [
    {
      id: "1",
      title: "基于深度学习的图像识别算法研究",
      author: "张三",
      studentId: "2021001",
      supervisor: "王教授",
      department: "计算机学院",
      major: "计算机科学与技术",
      degree: "硕士",
      status: "已通过",
      submissionDate: "2023-12-01",
      defenseDate: "2023-12-15",
      keywords: ["深度学习", "图像识别", "卷积神经网络"],
      abstract: "本文研究了基于深度学习的图像识别算法，提出了一种新的卷积神经网络结构...",
    },
    {
      id: "2",
      title: "5G通信系统中的信号处理技术研究",
      author: "李四",
      studentId: "2021002",
      supervisor: "李教授",
      department: "信息与电子学院",
      major: "通信工程",
      degree: "博士",
      status: "审核中",
      submissionDate: "2023-11-20",
      defenseDate: "2024-01-10",
      keywords: ["5G通信", "信号处理", "MIMO技术"],
      abstract: "本文针对5G通信系统中的信号处理技术进行了深入研究，重点分析了MIMO技术...",
    },
    {
      id: "3",
      title: "智能制造系统中的机器人控制算法",
      author: "王五",
      studentId: "2021003",
      supervisor: "张教授",
      department: "机械与车辆学院",
      major: "机械工程",
      degree: "硕士",
      status: "待修改",
      submissionDate: "2023-11-15",
      defenseDate: "2023-12-20",
      keywords: ["智能制造", "机器人控制", "自动化"],
      abstract: "本文研究了智能制造系统中的机器人控制算法，提出了一种基于强化学习的控制方法...",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "已通过":
        return "bg-green-100 text-green-800"
      case "审核中":
        return "bg-yellow-100 text-yellow-800"
      case "待修改":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "已通过":
        return <CheckCircle className="w-4 h-4" />
      case "审核中":
        return <Clock className="w-4 h-4" />
      case "待修改":
        return <XCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const filteredPapers = papers.filter((paper) => {
    if (activeTab === "all") return true
    if (activeTab === "approved") return paper.status === "已通过"
    if (activeTab === "pending") return paper.status === "审核中"
    if (activeTab === "revision") return paper.status === "待修改"
    return true
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">论文管理</h1>
          <p className="text-gray-600">管理学位论文的提交、审核和发布</p>
        </div>
        <Link href="/papers/submit">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            提交论文
          </Button>
        </Link>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{papers.length}</div>
            <div className="text-sm text-gray-600">总论文数</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{papers.filter((p) => p.status === "已通过").length}</div>
            <div className="text-sm text-gray-600">已通过</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{papers.filter((p) => p.status === "审核中").length}</div>
            <div className="text-sm text-gray-600">审核中</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{papers.filter((p) => p.status === "待修改").length}</div>
            <div className="text-sm text-gray-600">待修改</div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input placeholder="搜索论文标题、作者或关键词..." className="w-full" />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="选择院系" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部院系</SelectItem>
                <SelectItem value="cs">计算机学院</SelectItem>
                <SelectItem value="ee">信息与电子学院</SelectItem>
                <SelectItem value="me">机械与车辆学院</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Search className="w-4 h-4 mr-2" />
              搜索
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 论文列表 */}
      <Card>
        <CardHeader>
          <CardTitle>论文列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="approved">已通过</TabsTrigger>
              <TabsTrigger value="pending">审核中</TabsTrigger>
              <TabsTrigger value="revision">待修改</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="space-y-4">
                {filteredPapers.map((paper) => (
                  <Card key={paper.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start space-x-4">
                            <div className="flex-1">
                              <Link href={`/papers/${paper.id}`}>
                                <h3 className="text-lg font-semibold text-blue-600 hover:underline cursor-pointer mb-2">
                                  {paper.title}
                                </h3>
                              </Link>

                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">作者：</span>
                                  {paper.author}
                                </div>
                                <div>
                                  <span className="font-medium">学号：</span>
                                  {paper.studentId}
                                </div>
                                <div>
                                  <span className="font-medium">导师：</span>
                                  {paper.supervisor}
                                </div>
                                <div>
                                  <span className="font-medium">学位：</span>
                                  {paper.degree}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-3 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">院系：</span>
                                  {paper.department}
                                </div>
                                <div>
                                  <span className="font-medium">专业：</span>
                                  {paper.major}
                                </div>
                                <div>
                                  <span className="font-medium">提交日期：</span>
                                  {paper.submissionDate}
                                </div>
                              </div>

                              <div className="mb-3">
                                <span className="text-sm font-medium text-gray-600">关键词：</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {paper.keywords.map((keyword, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {keyword}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <p className="text-sm text-gray-700 line-clamp-2">{paper.abstract}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-3 ml-6">
                          <Badge className={`${getStatusColor(paper.status)} flex items-center space-x-1`}>
                            {getStatusIcon(paper.status)}
                            <span>{paper.status}</span>
                          </Badge>

                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              查看
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4 mr-1" />
                              下载
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4 mr-1" />
                              编辑
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              删除
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredPapers.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">暂无论文数据</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
