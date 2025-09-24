import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, User, BookOpen, Award, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useState, useMemo } from "react"

export function ScholarDirectory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const scholars = [
    {
      id: "1",
      name: "王博",
      title: "教授",
      department: "计算机学院",
      researchAreas: ["人工智能", "机器学习", "深度学习"],
      paperCount: 45,
      citationCount: 1250,
      hIndex: 18,
      avatar: "/diverse-professor-lecturing.png",
      recentPapers: ["基于深度学习的图像识别算法研究", "神经网络在自然语言处理中的应用"],
    },
    {
      id: "2",
      name: "李明",
      title: "副教授",
      department: "信息与电子学院",
      researchAreas: ["信号处理", "通信系统", "5G技术"],
      paperCount: 32,
      citationCount: 890,
      hIndex: 15,
      avatar: "/diverse-professor-lecturing.png",
      recentPapers: ["5G通信系统中的信号处理技术", "无线通信网络优化算法研究"],
    },
    {
      id: "3",
      name: "张华",
      title: "教授",
      department: "机械与车辆学院",
      researchAreas: ["机器人技术", "自动控制", "智能制造"],
      paperCount: 58,
      citationCount: 1680,
      hIndex: 22,
      avatar: "/diverse-professor-lecturing.png",
      recentPapers: ["工业机器人控制系统设计与实现", "智能制造系统中的自动化技术"],
    },
    {
      id: "4",
      name: "刘教授",
      title: "教授",
      department: "计算机学院",
      researchAreas: ["数据库系统", "大数据", "云计算"],
      paperCount: 67,
      citationCount: 2100,
      hIndex: 25,
      avatar: "/diverse-professor-lecturing.png",
      recentPapers: ["分布式数据库系统设计", "云计算环境下的数据处理"],
    },
    {
      id: "5",
      name: "陈副教授",
      title: "副教授",
      department: "信息与电子学院",
      researchAreas: ["网络安全", "密码学", "区块链"],
      paperCount: 29,
      citationCount: 650,
      hIndex: 12,
      avatar: "/diverse-professor-lecturing.png",
      recentPapers: ["区块链技术在网络安全中的应用", "现代密码学算法研究"],
    },
  ]

  // 搜索和筛选逻辑
  const filteredScholars = useMemo(() => {
    return scholars.filter(scholar => {
      const matchesSearch = !searchQuery || 
        scholar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholar.researchAreas.some(area => 
          area.toLowerCase().includes(searchQuery.toLowerCase())
        )
      
      const matchesDepartment = selectedDepartment === "all" || 
        scholar.department === getDepartmentName(selectedDepartment)
      
      return matchesSearch && matchesDepartment
    })
  }, [searchQuery, selectedDepartment])

  const getDepartmentName = (value: string) => {
    switch (value) {
      case "cs": return "计算机学院"
      case "ee": return "信息与电子学院"
      case "me": return "机械与车辆学院"
      default: return ""
    }
  }

  const handleSearch = () => {
    // 搜索功能已经通过useMemo实现实时搜索
    console.log("执行搜索:", { searchQuery, selectedDepartment })
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
            <div className="text-2xl font-bold text-gray-900">156</div>
            <div className="text-sm text-gray-600">活跃学者</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">2,847</div>
            <div className="text-sm text-gray-600">发表论文</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">45,230</div>
            <div className="text-sm text-gray-600">总引用数</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">18.5</div>
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
                  src={scholar.avatar || "/placeholder.svg"}
                  alt={scholar.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Link href={`/scholars/${scholar.id}`}>
                        <h3 className="text-xl font-semibold text-blue-600 hover:underline cursor-pointer">
                          {scholar.name}
                        </h3>
                      </Link>
                      <p className="text-gray-600">
                        {scholar.title} · {scholar.department}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">研究领域：</p>
                    <div className="flex flex-wrap gap-2">
                      {scholar.researchAreas.map((area, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">{scholar.paperCount}</div>
                      <div className="text-gray-600">论文数</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-600">{scholar.citationCount}</div>
                      <div className="text-gray-600">引用数</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-orange-600">{scholar.hIndex}</div>
                      <div className="text-gray-600">H指数</div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">近期论文：</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {scholar.recentPapers.map((paper, index) => (
                        <li key={index} className="truncate">
                          • {paper}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )))}
      </div>

      <div className="text-center mt-8">
        <Button variant="outline">加载更多学者</Button>
      </div>
    </div>
  )
}
