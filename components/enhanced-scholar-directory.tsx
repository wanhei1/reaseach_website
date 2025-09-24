'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, User, BookOpen, Award, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useMemo } from "react"
import { createClient } from '@/lib/supabase/client'

interface Scholar {
  id: string
  name: string
  title: string
  department: string
  research_areas: string[]
  paper_count: number
  citation_count: number
  h_index: number
  avatar_url?: string
  email?: string
  bio?: string
}

export function ScholarDirectory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [scholars, setScholars] = useState<Scholar[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalScholars: 0,
    totalPapers: 0,
    totalCitations: 0,
    avgHIndex: 0
  })

  const supabase = createClient()

  useEffect(() => {
    fetchScholars()
    fetchStats()
  }, [])

  const fetchScholars = async () => {
    try {
      const { data, error } = await supabase
        .from('scholars')
        .select('*')
        .order('citation_count', { ascending: false })

      if (error) {
        console.error('获取学者数据失败:', error)
        // 如果数据库查询失败，使用默认数据
        setScholars(getDefaultScholars())
      } else {
        setScholars(data || [])
      }
    } catch (error) {
      console.error('连接数据库失败:', error)
      setScholars(getDefaultScholars())
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const [scholarsResult, papersResult] = await Promise.all([
        supabase.from('scholars').select('*'),
        supabase.from('papers').select('id')
      ])

      if (scholarsResult.data) {
        const totalCitations = scholarsResult.data.reduce((sum, scholar) => sum + (scholar.citation_count || 0), 0)
        const avgHIndex = scholarsResult.data.reduce((sum, scholar) => sum + (scholar.h_index || 0), 0) / scholarsResult.data.length

        setStats({
          totalScholars: scholarsResult.data.length,
          totalPapers: papersResult.data?.length || 0,
          totalCitations,
          avgHIndex: Math.round(avgHIndex * 10) / 10
        })
      }
    } catch (error) {
      console.error('获取统计数据失败:', error)
    }
  }

  const getDefaultScholars = (): Scholar[] => [
    {
      id: "1",
      name: "王博",
      title: "教授",
      department: "计算机学院",
      research_areas: ["人工智能", "机器学习", "深度学习"],
      paper_count: 45,
      citation_count: 1250,
      h_index: 18,
      avatar_url: "/diverse-professor-lecturing.png",
      bio: "专注于人工智能和机器学习领域的研究"
    },
    {
      id: "2",
      name: "李明",
      title: "副教授",
      department: "信息与电子学院",
      research_areas: ["信号处理", "通信系统", "5G技术"],
      paper_count: 32,
      citation_count: 890,
      h_index: 15,
      avatar_url: "/diverse-professor-lecturing.png",
      bio: "长期从事无线通信和信号处理技术研究"
    },
    {
      id: "3",
      name: "张华",
      title: "教授", 
      department: "机械与车辆学院",
      research_areas: ["机器人技术", "自动控制", "智能制造"],
      paper_count: 58,
      citation_count: 1680,
      h_index: 22,
      avatar_url: "/diverse-professor-lecturing.png",
      bio: "机器人技术和智能制造领域的知名专家"
    }
  ]

  // 搜索和筛选逻辑
  const filteredScholars = useMemo(() => {
    return scholars.filter(scholar => {
      const matchesSearch = !searchQuery || 
        scholar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholar.research_areas.some(area => 
          area.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        (scholar.bio && scholar.bio.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesDepartment = selectedDepartment === "all" || 
        scholar.department === getDepartmentName(selectedDepartment) ||
        scholar.department.includes(getDepartmentName(selectedDepartment))
      
      return matchesSearch && matchesDepartment
    })
  }, [searchQuery, selectedDepartment, scholars])

  const getDepartmentName = (value: string) => {
    switch (value) {
      case "cs": return "计算机学院"
      case "ee": return "信息与电子学院"
      case "me": return "机械与车辆学院"
      case "ms": return "材料学院"
      case "ae": return "宇航学院"
      case "ce": return "化学与化工学院"
      case "ma": return "管理与经济学院"
      case "oe": return "光电学院"
      default: return ""
    }
  }

  const handleSearch = () => {
    console.log("执行搜索:", { searchQuery, selectedDepartment })
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">学者目录</h1>
        <p className="text-gray-600">浏览北京理工大学的学者档案和学术成就</p>
      </div>

      {/* 搜索和筛选 */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input 
                placeholder="搜索学者姓名或研究领域..." 
                className="w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="选择院系" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部院系</SelectItem>
                <SelectItem value="cs">计算机学院</SelectItem>
                <SelectItem value="ee">信息与电子学院</SelectItem>
                <SelectItem value="me">机械与车辆学院</SelectItem>
                <SelectItem value="ms">材料学院</SelectItem>
                <SelectItem value="ae">宇航学院</SelectItem>
                <SelectItem value="ce">化学与化工学院</SelectItem>
                <SelectItem value="ma">管理与经济学院</SelectItem>
                <SelectItem value="oe">光电学院</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSearch}
            >
              <Search className="w-4 h-4 mr-2" />
              搜索
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <User className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.totalScholars}</div>
            <div className="text-sm text-gray-600">活跃学者</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.totalPapers}</div>
            <div className="text-sm text-gray-600">发表论文</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.totalCitations.toLocaleString()}</div>
            <div className="text-sm text-gray-600">总引用数</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.avgHIndex}</div>
            <div className="text-sm text-gray-600">平均H指数</div>
          </CardContent>
        </Card>
      </div>

      {/* 学者列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredScholars.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到匹配的学者</h3>
            <p className="text-gray-600">请尝试调整搜索条件或筛选选项</p>
          </div>
        ) : (
          filteredScholars.map((scholar) => (
            <Card key={scholar.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={scholar.avatar_url || "/placeholder-user.jpg"}
                    alt={scholar.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link href={`/scholars/${scholar.id}`} className="group">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                            {scholar.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 mb-2">
                          {scholar.title} • {scholar.department}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {scholar.research_areas.slice(0, 3).map((area, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                          {scholar.research_areas.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{scholar.research_areas.length - 3}
                            </Badge>
                          )}
                        </div>

                        {scholar.bio && (
                          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                            {scholar.bio}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-blue-600">{scholar.paper_count}</div>
                        <div className="text-xs text-gray-600">论文</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-green-600">{scholar.citation_count}</div>
                        <div className="text-xs text-gray-600">引用</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-orange-600">{scholar.h_index}</div>
                        <div className="text-xs text-gray-600">H指数</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )))}
      </div>

      {filteredScholars.length > 0 && (
        <div className="text-center mt-8">
          <Button variant="outline">加载更多学者</Button>
        </div>
      )}
    </div>
  )
}