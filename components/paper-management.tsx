"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, FileText, Clock, CheckCircle, XCircle, Download, Eye, Edit, Trash2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

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
  file_size: number | null
  status: string
  submitted_by: string
  created_at: string
  updated_at: string
}

export function PaperManagement() {
  const [activeTab, setActiveTab] = useState("all")
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchPapers()
  }, [])

  const fetchPapers = async () => {
    try {
      setLoading(true)
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        console.error('用户未登录')
        return
      }

      const { data, error } = await supabase
        .from('papers')
        .select('*')
        .eq('submitted_by', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('获取论文失败:', error)
      } else {
        setPapers(data || [])
      }
    } catch (error) {
      console.error('获取论文失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (paperId: string) => {
    if (!deleteConfirm) {
      setDeleteConfirm(paperId)
      return
    }

    try {
      setActionLoading(paperId)
      
      // 首先获取论文信息以删除文件
      const paper = papers.find(p => p.id === paperId)
      if (paper?.file_url) {
        // 从URL中提取文件路径
        const filePath = paper.file_url.split('/').pop()
        if (filePath) {
          await supabase.storage
            .from('papers')
            .remove([filePath])
        }
      }

      // 删除数据库记录
      const { error } = await supabase
        .from('papers')
        .delete()
        .eq('id', paperId)

      if (error) throw error

      // 更新本地状态
      setPapers(papers.filter(p => p.id !== paperId))
      setDeleteConfirm(null)
      
    } catch (error) {
      console.error('删除论文失败:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDownload = async (paper: Paper) => {
    if (!paper.file_url) return
    
    try {
      setActionLoading(paper.id)
      
      // 创建下载链接
      const link = document.createElement('a')
      link.href = paper.file_url
      link.download = paper.file_name || '论文.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
    } catch (error) {
      console.error('下载失败:', error)
    } finally {
      setActionLoading(null)
    }
  }

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
    // 按状态筛选
    let statusMatch = true
    if (activeTab === "approved") statusMatch = paper.status === "approved"
    else if (activeTab === "pending") statusMatch = paper.status === "pending"
    else if (activeTab === "revision") statusMatch = paper.status === "rejected"

    // 按搜索词筛选
    let searchMatch = true
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      searchMatch = paper.title.toLowerCase().includes(searchLower) ||
                   paper.author.toLowerCase().includes(searchLower) ||
                   (paper.keywords && paper.keywords.some(k => k.toLowerCase().includes(searchLower))) ||
                   false
    }

    // 按院系筛选
    let deptMatch = true
    if (departmentFilter !== "all") {
      deptMatch = paper.department === departmentFilter
    }

    return statusMatch && searchMatch && deptMatch
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN')
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved": return "已通过"
      case "pending": return "审核中"
      case "rejected": return "待修改"
      default: return "待审核"
    }
  }

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
            <div className="text-2xl font-bold text-gray-900">{papers.filter((p) => p.status === "approved").length}</div>
            <div className="text-sm text-gray-600">已通过</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{papers.filter((p) => p.status === "pending").length}</div>
            <div className="text-sm text-gray-600">审核中</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{papers.filter((p) => p.status === "rejected").length}</div>
            <div className="text-sm text-gray-600">待修改</div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input 
                placeholder="搜索论文标题、作者或关键词..." 
                className="w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="选择院系" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部院系</SelectItem>
                <SelectItem value="计算机学院">计算机学院</SelectItem>
                <SelectItem value="信息与电子学院">信息与电子学院</SelectItem>
                <SelectItem value="机械与车辆学院">机械与车辆学院</SelectItem>
                <SelectItem value="材料学院">材料学院</SelectItem>
                <SelectItem value="光电学院">光电学院</SelectItem>
                <SelectItem value="自动化学院">自动化学院</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                // 搜索功能已通过实时筛选实现
              }}
            >
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

                              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-3 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">作者：</span>
                                  {paper.author}
                                </div>
                                <div>
                                  <span className="font-medium">导师：</span>
                                  {paper.advisor || '未指定'}
                                </div>
                                <div>
                                  <span className="font-medium">学位：</span>
                                  {paper.degree_type || '未指定'}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-3 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">院系：</span>
                                  {paper.department || '未指定'}
                                </div>
                                <div>
                                  <span className="font-medium">专业：</span>
                                  {paper.major || '未指定'}
                                </div>
                                <div>
                                  <span className="font-medium">提交日期：</span>
                                  {formatDate(paper.created_at)}
                                </div>
                              </div>

                              {paper.keywords && paper.keywords.length > 0 && (
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
                              )}

                              <p className="text-sm text-gray-700 line-clamp-2">{paper.abstract || '暂无摘要'}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-3 ml-6">
                          <Badge className={`${getStatusColor(paper.status)} flex items-center space-x-1`}>
                            {getStatusIcon(paper.status)}
                            <span>{getStatusText(paper.status)}</span>
                          </Badge>

                          <div className="flex space-x-2">
                            <Link href={`/papers/${paper.id}`}>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                查看
                              </Button>
                            </Link>
                            {paper.file_url && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDownload(paper)}
                                disabled={actionLoading === paper.id}
                              >
                                <Download className="w-4 h-4 mr-1" />
                                下载
                              </Button>
                            )}
                            <Link href={`/papers/edit/${paper.id}`}>
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4 mr-1" />
                                编辑
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                              onClick={() => handleDelete(paper.id)}
                              disabled={actionLoading === paper.id}
                            >
                              {deleteConfirm === paper.id ? (
                                <>
                                  <AlertTriangle className="w-4 h-4 mr-1" />
                                  确认删除
                                </>
                              ) : (
                                <>
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  删除
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 animate-spin border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-500">加载论文数据中...</p>
                </div>
              ) : filteredPapers.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {searchTerm || departmentFilter !== "all" ? "没有找到匹配的论文" : "暂无论文数据"}
                  </p>
                  {(!searchTerm && departmentFilter === "all") && (
                    <Link href="/papers/submit">
                      <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        提交第一篇论文
                      </Button>
                    </Link>
                  )}
                </div>
              ) : null}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
