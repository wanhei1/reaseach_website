"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, TrendingDown, Users, FileText, Award, Building, Target, Activity } from "lucide-react"
import { useState } from "react"

export function DataDashboard() {
  const [timeRange, setTimeRange] = useState("year")

  // Mock data for charts
  const papersByYear = [
    { year: "2019", papers: 245, citations: 1200 },
    { year: "2020", papers: 289, citations: 1450 },
    { year: "2021", papers: 324, citations: 1680 },
    { year: "2022", papers: 378, citations: 1920 },
    { year: "2023", papers: 412, citations: 2150 },
  ]

  const papersByDepartment = [
    { name: "计算机学院", value: 156, color: "#3B82F6" },
    { name: "信息与电子学院", value: 134, color: "#10B981" },
    { name: "机械与车辆学院", value: 98, color: "#F59E0B" },
    { name: "宇航学院", value: 87, color: "#EF4444" },
    { name: "理学院", value: 76, color: "#8B5CF6" },
    { name: "其他", value: 65, color: "#6B7280" },
  ]

  const researchTrends = [
    { month: "1月", ai: 45, robotics: 32, communication: 28, materials: 25 },
    { month: "2月", ai: 52, robotics: 35, communication: 30, materials: 28 },
    { month: "3月", ai: 48, robotics: 38, communication: 32, materials: 30 },
    { month: "4月", ai: 61, robotics: 42, communication: 35, materials: 32 },
    { month: "5月", ai: 55, robotics: 45, communication: 38, materials: 35 },
    { month: "6月", ai: 67, robotics: 48, communication: 40, materials: 38 },
  ]

  const topKeywords = [
    { keyword: "人工智能", count: 89, trend: "up" },
    { keyword: "机器学习", count: 76, trend: "up" },
    { keyword: "深度学习", count: 65, trend: "up" },
    { keyword: "5G通信", count: 54, trend: "down" },
    { keyword: "机器人", count: 48, trend: "up" },
    { keyword: "物联网", count: 42, trend: "stable" },
    { keyword: "区块链", count: 38, trend: "down" },
    { keyword: "量子计算", count: 35, trend: "up" },
  ]

  const scholarStats = [
    { department: "计算机学院", scholars: 45, papers: 156, hIndex: 18.5 },
    { department: "信息与电子学院", scholars: 38, papers: 134, hIndex: 16.2 },
    { department: "机械与车辆学院", scholars: 42, papers: 98, hIndex: 14.8 },
    { department: "宇航学院", scholars: 35, papers: 87, hIndex: 15.6 },
    { department: "理学院", scholars: 28, papers: 76, hIndex: 17.3 },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">数据分析仪表板</h1>
          <p className="text-gray-600">学术研究数据统计与分析</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">本月</SelectItem>
            <SelectItem value="quarter">本季度</SelectItem>
            <SelectItem value="year">本年度</SelectItem>
            <SelectItem value="all">全部</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 关键指标概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">总论文数</p>
                <p className="text-2xl font-bold text-gray-900">2,847</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.5% 较上年
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">活跃学者</p>
                <p className="text-2xl font-bold text-gray-900">188</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8.2% 较上年
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">总引用数</p>
                <p className="text-2xl font-bold text-gray-900">45,230</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +15.8% 较上年
                </p>
              </div>
              <Award className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">平均H指数</p>
                <p className="text-2xl font-bold text-gray-900">16.4</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +3.1% 较上年
                </p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 详细分析标签页 */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">总览</TabsTrigger>
          <TabsTrigger value="papers">论文分析</TabsTrigger>
          <TabsTrigger value="scholars">学者分析</TabsTrigger>
          <TabsTrigger value="trends">研究趋势</TabsTrigger>
          <TabsTrigger value="departments">院系对比</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>论文发表趋势</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={papersByYear}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="papers" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>院系论文分布</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={papersByDepartment}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {papersByDepartment.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="papers">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>论文与引用趋势对比</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={papersByYear}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="papers" fill="#3B82F6" name="论文数量" />
                      <Line yAxisId="right" type="monotone" dataKey="citations" stroke="#10B981" name="引用数量" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>热门关键词</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topKeywords.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-900">{item.keyword}</span>
                        {getTrendIcon(item.trend)}
                      </div>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scholars">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>各院系学者统计</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={scholarStats} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="department" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="scholars" fill="#3B82F6" name="学者数量" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>学者影响力分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {scholarStats.map((dept, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{dept.department}</span>
                        <span className="text-sm text-gray-600">H指数: {dept.hIndex}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(dept.hIndex / 20) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{dept.scholars} 位学者</span>
                        <span>{dept.papers} 篇论文</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>研究领域趋势分析</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={researchTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ai" stroke="#3B82F6" name="人工智能" strokeWidth={2} />
                  <Line type="monotone" dataKey="robotics" stroke="#10B981" name="机器人技术" strokeWidth={2} />
                  <Line type="monotone" dataKey="communication" stroke="#F59E0B" name="通信技术" strokeWidth={2} />
                  <Line type="monotone" dataKey="materials" stroke="#EF4444" name="材料科学" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>院系论文产出对比</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={scholarStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="papers" fill="#3B82F6" name="论文数量" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>院系详细数据</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scholarStats.map((dept, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{dept.department}</h4>
                        <Building className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-blue-600">{dept.scholars}</div>
                          <div className="text-gray-600">学者</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-600">{dept.papers}</div>
                          <div className="text-gray-600">论文</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-orange-600">{dept.hIndex}</div>
                          <div className="text-gray-600">平均H指数</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
