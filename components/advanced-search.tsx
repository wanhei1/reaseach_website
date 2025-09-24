"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Search } from "lucide-react"
import { useState, useEffect } from "react"

interface AdvancedSearchProps {
  initialQuery?: string
  initialType?: string
}

export function AdvancedSearch({ initialQuery = "", initialType = "all" }: AdvancedSearchProps) {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [searchType, setSearchType] = useState(initialType)

  useEffect(() => {
    setSearchQuery(initialQuery)
    setSearchType(initialType)
  }, [initialQuery, initialType])

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">学位论文管理系统</h1>
          <p className="text-blue-100">Beijing Institute of Technology</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex mb-6">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-l-md font-medium">学段检索</button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium">全文检索</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左侧搜索条件 */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">检索关系</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <Checkbox defaultChecked />
                    <span className="ml-2 text-sm">或</span>
                  </label>
                  <label className="flex items-center">
                    <Checkbox />
                    <span className="ml-2 text-sm">与</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">检索字段</label>
                  <Select defaultValue="title">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="title">题名</SelectItem>
                      <SelectItem value="author">作者</SelectItem>
                      <SelectItem value="keyword">关键词</SelectItem>
                      <SelectItem value="abstract">摘要</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">检索字段</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">模糊</SelectItem>
                      <SelectItem value="exact">精确</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">保密级别</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="public">公开</SelectItem>
                      <SelectItem value="restricted">限制</SelectItem>
                      <SelectItem value="confidential">保密</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">学位名称</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="master">硕士</SelectItem>
                      <SelectItem value="doctor">博士</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">学科专业</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="cs">计算机科学</SelectItem>
                      <SelectItem value="ee">电子工程</SelectItem>
                      <SelectItem value="me">机械工程</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">所属院系</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="cs">计算机学院</SelectItem>
                      <SelectItem value="ee">信息与电子学院</SelectItem>
                      <SelectItem value="me">机械与车辆学院</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">答辩时间范围</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? startDate.toLocaleDateString() : "开始日期"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">到</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? endDate.toLocaleDateString() : "结束日期"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">检索结果排序</label>
                <Select defaultValue="date">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">答辩日期降序</SelectItem>
                    <SelectItem value="relevance">相关度</SelectItem>
                    <SelectItem value="title">题名</SelectItem>
                    <SelectItem value="author">作者</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 右侧搜索词输入 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">检索词</label>
                <Input placeholder="请输入检索内容" className="mb-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">关键词</label>
                <Input placeholder="请输入检索内容" className="mb-2" />
              </div>
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
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-2">
              <Search className="w-4 h-4 mr-2" />
              开始检索
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
