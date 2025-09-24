"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Search, Filter, Download, Eye, SortAsc, SortDesc, Calendar, User, Building, BookOpen, FileText } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"

interface Paper {
  id: string
  title: string
  author: string
  advisor: string | null
  department: string | null
  major: string | null
  degree_type: string | null
  defense_date: string | null
  abstract: string | null
  keywords: string[] | null
  file_url: string | null
  file_name: string | null
  status: string
  created_at: string
  updated_at: string
}

interface SearchFilters {
  department?: string
  major?: string
  year?: string
  author?: string
  status?: string
  degree_type?: string
  advisor?: string
  keywords?: string[]
  dateRange?: [string, string]
}

interface EnhancedSearchEngineProps {
  initialQuery?: string
  initialFilters?: any
}

export function EnhancedSearchEngine({ initialQuery = "", initialFilters = {} }: EnhancedSearchEngineProps) {
  const [query, setQuery] = useState(initialQuery)
  const [filters, setFilters] = useState<SearchFilters>(initialFilters)
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'title' | 'author'>('relevance')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (initialQuery || Object.keys(initialFilters).length > 0) {
      performSearch()
    }
    loadSearchHistory()
  }, [initialQuery, initialFilters])

  const loadSearchHistory = () => {
    const history = localStorage.getItem('searchHistory')
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }

  const saveToSearchHistory = (searchQuery: string) => {
    if (!searchQuery.trim()) return
    
    const history = [...searchHistory]
    const index = history.indexOf(searchQuery)
    if (index > -1) {
      history.splice(index, 1)
    }
    history.unshift(searchQuery)
    const newHistory = history.slice(0, 10) // 保持最近10个搜索
    
    setSearchHistory(newHistory)
    localStorage.setItem('searchHistory', JSON.stringify(newHistory))
  }

  const buildSearchQuery = useCallback(() => {
    let queryBuilder = supabase
      .from('papers')
      .select('*', { count: 'exact' })
      .eq('status', 'approved') // 只搜索已通过的论文

    // 文本搜索
    if (query.trim()) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,author.ilike.%${query}%,abstract.ilike.%${query}%`)
    }

    // 院系筛选
    if (filters.department) {
      queryBuilder = queryBuilder.eq('department', filters.department)
    }

    // 专业筛选
    if (filters.major) {
      queryBuilder = queryBuilder.ilike('major', `%${filters.major}%`)
    }

    // 作者筛选
    if (filters.author) {
      queryBuilder = queryBuilder.ilike('author', `%${filters.author}%`)
    }

    // 导师筛选
    if (filters.advisor) {
      queryBuilder = queryBuilder.ilike('advisor', `%${filters.advisor}%`)
    }

    // 学位类型筛选
    if (filters.degree_type) {
      queryBuilder = queryBuilder.eq('degree_type', filters.degree_type)
    }

    // 年份筛选
    if (filters.year) {
      const startDate = `${filters.year}-01-01`
      const endDate = `${filters.year}-12-31`
      queryBuilder = queryBuilder.gte('created_at', startDate).lte('created_at', endDate)
    }

    // 排序
    const orderColumn = sortBy === 'relevance' ? 'created_at' : 
                       sortBy === 'date' ? 'created_at' :
                       sortBy === 'title' ? 'title' : 'author'
    queryBuilder = queryBuilder.order(orderColumn, { ascending: sortOrder === 'asc' })

    // 分页
    const from = (currentPage - 1) * pageSize
    const to = from + pageSize - 1
    queryBuilder = queryBuilder.range(from, to)

    return queryBuilder
  }, [query, filters, sortBy, sortOrder, currentPage, pageSize])

  const performSearch = async () => {
    try {
      setLoading(true)
      
      const queryBuilder = buildSearchQuery()
      const { data, error, count } = await queryBuilder

      if (error) {
        console.error('搜索失败:', error)
        return
      }

      setPapers(data || [])
      setTotalResults(count || 0)
      
      // 保存搜索历史
      if (query.trim()) {
        saveToSearchHistory(query)
      }
      
      // 更新URL
      updateURL()

    } catch (error) {
      console.error('搜索失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateURL = () => {
    const params = new URLSearchParams()
    
    if (query) params.set('q', query)
    if (filters.department) params.set('department', filters.department)
    if (filters.major) params.set('major', filters.major)
    if (filters.year) params.set('year', filters.year)
    if (filters.author) params.set('author', filters.author)
    if (filters.advisor) params.set('advisor', filters.advisor)
    if (filters.degree_type) params.set('degree_type', filters.degree_type)
    if (currentPage > 1) params.set('page', currentPage.toString())
    if (sortBy !== 'relevance') params.set('sort', sortBy)
    if (sortOrder !== 'desc') params.set('order', sortOrder)

    const newURL = `/search?${params.toString()}`
    router.push(newURL, { scroll: false })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    performSearch()
  }

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({})
    setQuery("")
    setCurrentPage(1)
  }

  const toggleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
    setCurrentPage(1)
    performSearch()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN')
  }

  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text
    
    const regex = new RegExp(`(${searchTerm})`, 'gi')
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
  }

  const totalPages = Math.ceil(totalResults / pageSize)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 搜索头部 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">高级搜索</h1>
        <p className="text-gray-600">在论文数据库中搜索相关内容</p>
      </div>

      {/* 搜索表单 */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="输入关键词搜索论文标题、作者或摘要..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="text-lg h-12"
                />
              </div>
              <Button type="submit" className="h-12 px-8 bg-blue-600 hover:bg-blue-700">
                <Search className="w-5 h-5 mr-2" />
                搜索
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 px-6"
              >
                <Filter className="w-5 h-5 mr-2" />
                筛选
              </Button>
            </div>

            {/* 搜索历史 */}
            {searchHistory.length > 0 && !query && (
              <div className="mt-4">
                <Label className="text-sm text-gray-600 mb-2 block">搜索历史</Label>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((historyItem, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setQuery(historyItem)}
                    >
                      {historyItem}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* 高级筛选 */}
            {showFilters && (
              <div className="border-t pt-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="department">院系</Label>
                    <Select
                      value={filters.department || ""}
                      onValueChange={(value) => handleFilterChange('department', value || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择院系" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">全部院系</SelectItem>
                        <SelectItem value="计算机学院">计算机学院</SelectItem>
                        <SelectItem value="信息与电子学院">信息与电子学院</SelectItem>
                        <SelectItem value="机械与车辆学院">机械与车辆学院</SelectItem>
                        <SelectItem value="材料学院">材料学院</SelectItem>
                        <SelectItem value="光电学院">光电学院</SelectItem>
                        <SelectItem value="自动化学院">自动化学院</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="major">专业</Label>
                    <Input
                      id="major"
                      placeholder="输入专业名称"
                      value={filters.major || ""}
                      onChange={(e) => handleFilterChange('major', e.target.value || undefined)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="author">作者</Label>
                    <Input
                      id="author"
                      placeholder="输入作者姓名"
                      value={filters.author || ""}
                      onChange={(e) => handleFilterChange('author', e.target.value || undefined)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="advisor">导师</Label>
                    <Input
                      id="advisor"
                      placeholder="输入导师姓名"
                      value={filters.advisor || ""}
                      onChange={(e) => handleFilterChange('advisor', e.target.value || undefined)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="degree_type">学位类型</Label>
                    <Select
                      value={filters.degree_type || ""}
                      onValueChange={(value) => handleFilterChange('degree_type', value || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择学位类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">全部学位</SelectItem>
                        <SelectItem value="学士">学士</SelectItem>
                        <SelectItem value="硕士">硕士</SelectItem>
                        <SelectItem value="博士">博士</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="year">年份</Label>
                    <Select
                      value={filters.year || ""}
                      onValueChange={(value) => handleFilterChange('year', value || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择年份" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">全部年份</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                        <SelectItem value="2020">2020</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearFilters}
                  >
                    清除筛选
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    应用筛选
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* 搜索结果统计和排序 */}
      {(papers.length > 0 || loading) && (
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            {loading ? "搜索中..." : `找到 ${totalResults} 条结果`}
          </div>
          
          <div className="flex items-center space-x-4">
            <Label className="text-sm">排序：</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort('date')}
              className={sortBy === 'date' ? 'bg-blue-50' : ''}
            >
              <Calendar className="w-4 h-4 mr-1" />
              日期
              {sortBy === 'date' && (
                sortOrder === 'desc' ? <SortDesc className="w-4 h-4 ml-1" /> : <SortAsc className="w-4 h-4 ml-1" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort('title')}
              className={sortBy === 'title' ? 'bg-blue-50' : ''}
            >
              <BookOpen className="w-4 h-4 mr-1" />
              标题
              {sortBy === 'title' && (
                sortOrder === 'desc' ? <SortDesc className="w-4 h-4 ml-1" /> : <SortAsc className="w-4 h-4 ml-1" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort('author')}
              className={sortBy === 'author' ? 'bg-blue-50' : ''}
            >
              <User className="w-4 h-4 mr-1" />
              作者
              {sortBy === 'author' && (
                sortOrder === 'desc' ? <SortDesc className="w-4 h-4 ml-1" /> : <SortAsc className="w-4 h-4 ml-1" />
              )}
            </Button>
          </div>
        </div>
      )}

      {/* 搜索结果 */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 animate-spin border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">搜索中...</p>
          </div>
        ) : papers.length > 0 ? (
          papers.map((paper) => (
            <Card key={paper.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Link href={`/papers/${paper.id}`}>
                      <h3 
                        className="text-lg font-semibold text-blue-600 hover:underline mb-2"
                        dangerouslySetInnerHTML={{
                          __html: highlightSearchTerm(paper.title, query)
                        }}
                      />
                    </Link>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span>
                        作者：
                        <span 
                          dangerouslySetInnerHTML={{
                            __html: highlightSearchTerm(paper.author, query)
                          }}
                        />
                      </span>
                      {paper.advisor && <span>导师：{paper.advisor}</span>}
                      <span>发表时间：{formatDate(paper.created_at)}</span>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3 text-sm text-gray-600">
                      {paper.department && (
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          {paper.department}
                        </div>
                      )}
                      {paper.major && (
                        <div className="flex items-center">
                          <BookOpen className="w-4 h-4 mr-1" />
                          {paper.major}
                        </div>
                      )}
                      {paper.degree_type && (
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          {paper.degree_type}
                        </div>
                      )}
                      {paper.defense_date && (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(paper.defense_date)}
                        </div>
                      )}
                    </div>

                    {paper.keywords && paper.keywords.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-2">
                          {paper.keywords.map((keyword, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className="text-xs cursor-pointer hover:bg-blue-100"
                              onClick={() => setQuery(keyword)}
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {paper.abstract && (
                      <p 
                        className="text-sm text-gray-700 line-clamp-3"
                        dangerouslySetInnerHTML={{
                          __html: highlightSearchTerm(paper.abstract.substring(0, 200) + "...", query)
                        }}
                      />
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-6">
                    <Link href={`/papers/${paper.id}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        查看
                      </Button>
                    </Link>
                    {paper.file_url && (
                      <Button size="sm" variant="outline" onClick={() => window.open(paper.file_url!)}>
                        <Download className="w-4 h-4 mr-1" />
                        下载
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : query || Object.keys(filters).some(key => filters[key as keyof SearchFilters]) ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">未找到匹配的论文</p>
            <p className="text-gray-400">尝试调整搜索条件或使用不同的关键词</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">开始搜索论文</p>
            <p className="text-gray-400">输入关键词或使用高级筛选来查找相关论文</p>
          </div>
        )}
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            上一页
          </Button>
          
          {[...Array(Math.min(totalPages, 5))].map((_, index) => {
            const pageNum = Math.max(1, currentPage - 2) + index
            if (pageNum > totalPages) return null
            
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                onClick={() => setCurrentPage(pageNum)}
                className="w-10 h-10"
              >
                {pageNum}
              </Button>
            )
          })}
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            下一页
          </Button>
        </div>
      )}
    </div>
  )
}