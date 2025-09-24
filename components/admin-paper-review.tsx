"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, XCircle, Clock, FileText, Eye, MessageSquare } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

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
  submitted_by: string
  review_comments?: string | null
}

export function AdminPaperReview() {
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [reviewComments, setReviewComments] = useState<{[key: string]: string}>({})
  
  const supabase = createClient()

  useEffect(() => {
    fetchPapers()
  }, [])

  const fetchPapers = async () => {
    try {
      setLoading(true)
      
      // 这里应该检查用户是否是管理员/导师
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        console.error('用户未登录')
        return
      }

      const { data, error } = await supabase
        .from('papers')
        .select('*')
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

  const handleStatusChange = async (paperId: string, newStatus: string, comments?: string) => {
    try {
      setActionLoading(paperId)
      
      const { error } = await supabase
        .from('papers')
        .update({ 
          status: newStatus,
          review_comments: comments || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', paperId)

      if (error) throw error

      // 更新本地状态
      setPapers(papers.map(paper => 
        paper.id === paperId 
          ? { ...paper, status: newStatus, review_comments: comments || null }
          : paper
      ))

      // 清空评论输入
      setReviewComments(prev => ({
        ...prev,
        [paperId]: ''
      }))

    } catch (error) {
      console.error('更新状态失败:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved": return "已通过"
      case "pending": return "审核中"
      case "rejected": return "需修改"
      default: return "待审核"
    }
  }

  const filteredPapers = papers.filter(paper => {
    if (statusFilter === "all") return true
    return paper.status === statusFilter
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">加载论文数据中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">论文审核管理</h1>
          <p className="text-gray-600">管理和审核学生提交的学位论文</p>
        </div>
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
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {papers.filter(p => p.status === "pending").length}
            </div>
            <div className="text-sm text-gray-600">待审核</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {papers.filter(p => p.status === "approved").length}
            </div>
            <div className="text-sm text-gray-600">已通过</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {papers.filter(p => p.status === "rejected").length}
            </div>
            <div className="text-sm text-gray-600">需修改</div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选器 */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">筛选状态：</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">待审核</SelectItem>
                <SelectItem value="approved">已通过</SelectItem>
                <SelectItem value="rejected">需修改</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 论文列表 */}
      <div className="space-y-6">
        {filteredPapers.map((paper) => (
          <Card key={paper.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {paper.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>作者：{paper.author}</span>
                        {paper.advisor && <span>导师：{paper.advisor}</span>}
                        <span>提交时间：{formatDate(paper.created_at)}</span>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(paper.status)} flex items-center space-x-1`}>
                      {getStatusIcon(paper.status)}
                      <span>{getStatusText(paper.status)}</span>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm text-gray-600">
                    {paper.department && (
                      <div>
                        <span className="font-medium">院系：</span>
                        {paper.department}
                      </div>
                    )}
                    {paper.major && (
                      <div>
                        <span className="font-medium">专业：</span>
                        {paper.major}
                      </div>
                    )}
                    {paper.degree_type && (
                      <div>
                        <span className="font-medium">学位：</span>
                        {paper.degree_type}
                      </div>
                    )}
                    {paper.defense_date && (
                      <div>
                        <span className="font-medium">答辩日期：</span>
                        {new Date(paper.defense_date).toLocaleDateString('zh-CN')}
                      </div>
                    )}
                  </div>

                  {paper.keywords && paper.keywords.length > 0 && (
                    <div className="mb-4">
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

                  {paper.abstract && (
                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                      {paper.abstract}
                    </p>
                  )}

                  {paper.review_comments && (
                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mb-4">
                      <div className="flex items-center mb-2">
                        <MessageSquare className="w-4 h-4 text-yellow-600 mr-2" />
                        <span className="text-sm font-medium text-yellow-800">审核意见</span>
                      </div>
                      <p className="text-sm text-yellow-700">{paper.review_comments}</p>
                    </div>
                  )}

                  {/* 审核操作 */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-4">
                      <div className="flex-1">
                        <Textarea
                          placeholder="添加审核意见（可选）"
                          value={reviewComments[paper.id] || ''}
                          onChange={(e) => setReviewComments(prev => ({
                            ...prev,
                            [paper.id]: e.target.value
                          }))}
                          rows={2}
                          className="mb-3"
                        />
                        <div className="flex items-center space-x-2">
                          <Link href={`/papers/${paper.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              查看详情
                            </Button>
                          </Link>
                          
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleStatusChange(
                              paper.id, 
                              "approved", 
                              reviewComments[paper.id]
                            )}
                            disabled={actionLoading === paper.id || paper.status === "approved"}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            通过
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 border-red-600"
                            onClick={() => handleStatusChange(
                              paper.id, 
                              "rejected", 
                              reviewComments[paper.id] || "需要修改"
                            )}
                            disabled={actionLoading === paper.id || paper.status === "rejected"}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            退回修改
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(paper.id, "pending")}
                            disabled={actionLoading === paper.id || paper.status === "pending"}
                          >
                            <Clock className="w-4 h-4 mr-1" />
                            重新审核
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {actionLoading === paper.id && (
                <div className="flex items-center justify-center py-4">
                  <div className="w-6 h-6 animate-spin border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">处理中...</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredPapers.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">暂无符合条件的论文</p>
          </div>
        )}
      </div>
    </div>
  )
}