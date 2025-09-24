"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { TrendingUp, TrendingDown, Users, FileText, Award, Building, Target, Activity, Download, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface DashboardStats {
  totalPapers: number
  approvedPapers: number
  pendingPapers: number
  rejectedPapers: number
  totalAuthors: number
  departmentStats: Array<{
    name: string
    value: number
    color: string
  }>
  yearlyTrends: Array<{
    year: string
    papers: number
    approved: number
    pending: number
    rejected: number
  }>
  monthlySubmissions: Array<{
    month: string
    submissions: number
  }>
  topKeywords: Array<{
    keyword: string
    count: number
  }>
  degreeDistribution: Array<{
    name: string
    value: number
    color: string
  }>
}

export function RealDataDashboard() {
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("year")
  const [stats, setStats] = useState<DashboardStats>({
    totalPapers: 0,
    approvedPapers: 0,
    pendingPapers: 0,
    rejectedPapers: 0,
    totalAuthors: 0,
    departmentStats: [],
    yearlyTrends: [],
    monthlySubmissions: [],
    topKeywords: [],
    degreeDistribution: []
  })
  const [refreshing, setRefreshing] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchDashboardData()
  }, [timeRange])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // 获取所有论文数据用于统计
      const { data: papers, error } = await supabase
        .from('papers')
        .select('*')

      if (error) {
        console.error('获取数据失败:', error)
        return
      }

      const papersData = papers || []
      
      // 计算基础统计
      const totalPapers = papersData.length
      const approvedPapers = papersData.filter(p => p.status === 'approved').length
      const pendingPapers = papersData.filter(p => p.status === 'pending').length
      const rejectedPapers = papersData.filter(p => p.status === 'rejected').length
      const totalAuthors = new Set(papersData.map(p => p.author)).size

      // 按院系统计
      const departmentCounts = papersData.reduce((acc, paper) => {
        const dept = paper.department || '未分类'
        acc[dept] = (acc[dept] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280', '#EC4899', '#14B8A6']
      const departmentStats = Object.entries(departmentCounts)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 8)
        .map(([name, value], index) => ({
          name,
          value: value as number,
          color: colors[index % colors.length]
        }))

      // 按年份统计
      const yearlyData = papersData.reduce((acc, paper) => {
        const year = new Date(paper.created_at).getFullYear().toString()
        if (!acc[year]) {
          acc[year] = { papers: 0, approved: 0, pending: 0, rejected: 0 }
        }
        acc[year].papers++
        if (paper.status === 'approved') acc[year].approved++
        else if (paper.status === 'pending') acc[year].pending++
        else if (paper.status === 'rejected') acc[year].rejected++
        return acc
      }, {} as Record<string, { papers: number, approved: number, pending: number, rejected: number }>)

      const yearlyTrends = Object.entries(yearlyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([year, data]) => {
          const typedData = data as { papers: number, approved: number, pending: number, rejected: number }
          return {
            year,
            papers: typedData.papers,
            approved: typedData.approved,
            pending: typedData.pending,
            rejected: typedData.rejected
          }
        })

      // 按月份统计提交数量
      const monthlyData = papersData.reduce((acc, paper) => {
        const date = new Date(paper.created_at)
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        acc[month] = (acc[month] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const monthlySubmissions = Object.entries(monthlyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-12) // 最近12个月
        .map(([month, submissions]) => ({
          month: month.split('-')[1] + '月',
          submissions: submissions as number
        }))

      // 统计热门关键词
      const keywordCounts = papersData.reduce((acc, paper) => {
        if (paper.keywords) {
          paper.keywords.forEach((keyword: string) => {
            acc[keyword] = (acc[keyword] || 0) + 1
          })
        }
        return acc
      }, {} as Record<string, number>)

      const topKeywords = Object.entries(keywordCounts)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 20)
        .map(([keyword, count]) => ({
          keyword,
          count: count as number
        }))

      // 学位分布统计
      const degreeCounts = papersData.reduce((acc, paper) => {
        const degree = paper.degree_type || '未分类'
        acc[degree] = (acc[degree] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const degreeDistribution = Object.entries(degreeCounts)
        .map(([name, value], index) => ({
          name,
          value: value as number,
          color: colors[index % colors.length]
        }))

      setStats({
        totalPapers,
        approvedPapers,
        pendingPapers,
        rejectedPapers,
        totalAuthors,
        departmentStats,
        yearlyTrends,
        monthlySubmissions,
        topKeywords,
        degreeDistribution
      })

    } catch (error) {
      console.error('获取统计数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDashboardData()
    setRefreshing(false)
  }

  const exportData = () => {
    const dataToExport = {
      stats,
      exportDate: new Date().toISOString(),
      timeRange
    }
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `论文统计数据-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">加载统计数据中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">数据分析面板</h1>
          <p className="text-gray-600">论文提交和管理的统计分析</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">本月</SelectItem>
              <SelectItem value="quarter">本季度</SelectItem>
              <SelectItem value="year">本年度</SelectItem>
              <SelectItem value="all">全部时间</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            刷新
          </Button>
          <Button
            variant="outline"
            onClick={exportData}
          >
            <Download className="w-4 h-4 mr-2" />
            导出数据
          </Button>
        </div>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">论文总数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPapers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">实时数据</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">已通过</p>
                <p className="text-2xl font-bold text-green-600">{stats.approvedPapers}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">
                通过率：{stats.totalPapers > 0 ? Math.round((stats.approvedPapers / stats.totalPapers) * 100) : 0}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">待审核</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingPapers}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">
                需要审核的论文数量
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">作者人数</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalAuthors}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">
                独立作者统计
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">趋势分析</TabsTrigger>
          <TabsTrigger value="departments">院系分布</TabsTrigger>
          <TabsTrigger value="keywords">热门关键词</TabsTrigger>
          <TabsTrigger value="degrees">学位分布</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>论文提交趋势</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={stats.yearlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="papers" 
                      stackId="1"
                      stroke="#3B82F6" 
                      fill="#3B82F6" 
                      name="总数"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="approved" 
                      stackId="2"
                      stroke="#10B981" 
                      fill="#10B981" 
                      name="已通过"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>月度提交量</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.monthlySubmissions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="submissions" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>院系论文分布</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.departmentStats}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({name, percent}: any) => `${name} ${(percent * 100).toFixed(1)}%`}
                    >
                      {stats.departmentStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>院系排行榜</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.departmentStats.slice(0, 8).map((dept, index) => (
                    <div key={dept.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: dept.color }}>
                          {index + 1}
                        </div>
                        <span className="font-medium">{dept.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{dept.value} 篇</Badge>
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              backgroundColor: dept.color,
                              width: `${(dept.value / Math.max(...stats.departmentStats.map(d => d.value))) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="keywords">
          <Card>
            <CardHeader>
              <CardTitle>热门关键词云</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.topKeywords.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="keyword" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">关键词排行</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {stats.topKeywords.slice(0, 20).map((keyword, index) => (
                      <div key={keyword.keyword} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <span className="text-sm">{keyword.keyword}</span>
                        </div>
                        <Badge variant="outline">{keyword.count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="degrees">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>学位类型分布</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.degreeDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({name, value, percent}: any) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
                    >
                      {stats.degreeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>学位统计详情</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.degreeDistribution.map((degree, index) => (
                    <div key={degree.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: degree.color }}
                        />
                        <span className="font-medium">{degree.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{degree.value}</div>
                        <div className="text-sm text-gray-500">
                          {stats.totalPapers > 0 ? ((degree.value / stats.totalPapers) * 100).toFixed(1) : 0}%
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