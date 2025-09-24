import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Eye, Share2, BookOpen, User, Calendar, Building, Tag, FileText, CheckCircle } from "lucide-react"

interface PaperDetailProps {
  paperId: string
}

export function PaperDetail({ paperId }: PaperDetailProps) {
  // 处理文件下载
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = `/api/download?file=${encodeURIComponent(paper.title + '.pdf')}`
    link.download = paper.title + '.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // 处理在线预览
  const handlePreview = () => {
    // 模拟PDF预览URL
    const previewUrl = `/api/preview?file=${encodeURIComponent(paper.title + '.pdf')}`
    window.open(previewUrl, '_blank', 'width=1000,height=800')
  }

  // 处理分享功能
  const handleShare = async () => {
    const shareData = {
      title: paper.title,
      text: `查看论文: ${paper.title}`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // 备用方案：复制到剪贴板
        await navigator.clipboard.writeText(window.location.href)
        alert('链接已复制到剪贴板！')
      }
    } catch (error) {
      console.error('分享失败:', error)
      // 备用方案：复制到剪贴板
      await navigator.clipboard.writeText(window.location.href)
      alert('链接已复制到剪贴板！')
    }
  }

  // Mock data - in real app would fetch based on paperId
  const paper = {
    id: paperId,
    title: "基于深度学习的图像识别算法研究",
    englishTitle: "Research on Image Recognition Algorithms Based on Deep Learning",
    author: "张三",
    studentId: "2021001",
    supervisor: "王教授",
    department: "计算机学院",
    major: "计算机科学与技术",
    degree: "硕士",
    status: "已通过",
    submissionDate: "2023-12-01",
    defenseDate: "2023-12-15",
    keywords: ["深度学习", "图像识别", "卷积神经网络", "计算机视觉"],
    abstract: `本文研究了基于深度学习的图像识别算法，提出了一种新的卷积神经网络结构。该结构通过引入注意力机制和残差连接，有效提升了图像识别的准确率和效率。实验结果表明，所提出的算法在多个公开数据集上均取得了优异的性能，相比传统方法有显著提升。本研究为深度学习在图像识别领域的应用提供了新的思路和方法。`,
    englishAbstract: `This paper studies image recognition algorithms based on deep learning and proposes a new convolutional neural network structure. The structure effectively improves the accuracy and efficiency of image recognition by introducing attention mechanisms and residual connections. Experimental results show that the proposed algorithm achieves excellent performance on multiple public datasets, with significant improvements compared to traditional methods. This research provides new ideas and methods for the application of deep learning in the field of image recognition.`,
    downloadCount: 156,
    citationCount: 23,
    viewCount: 892,
    fileSize: "2.3 MB",
    pages: 78,
    confidentialLevel: "公开",
    reviewComments: [
      {
        reviewer: "评审专家A",
        date: "2023-12-10",
        comment: "论文结构清晰，研究方法科学，实验结果可信，建议通过。",
        rating: "优秀",
      },
      {
        reviewer: "评审专家B",
        date: "2023-12-12",
        comment: "创新性较强，技术路线合理，但部分实验数据需要进一步验证。",
        rating: "良好",
      },
    ],
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 论文基本信息 */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{paper.title}</h1>
              <h2 className="text-xl text-gray-600 mb-4">{paper.englishTitle}</h2>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    <span className="font-medium">作者：</span>
                    {paper.author}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    <span className="font-medium">院系：</span>
                    {paper.department}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    <span className="font-medium">学位：</span>
                    {paper.degree}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    <span className="font-medium">答辩：</span>
                    {paper.defenseDate}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <Badge className={getStatusColor(paper.status)}>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {paper.status}
                </Badge>
                <span className="text-sm text-gray-600">保密级别：{paper.confidentialLevel}</span>
                <span className="text-sm text-gray-600">页数：{paper.pages}页</span>
                <span className="text-sm text-gray-600">文件大小：{paper.fileSize}</span>
              </div>

              <div className="mb-4">
                <span className="text-sm font-medium text-gray-700 mr-2">关键词：</span>
                <div className="inline-flex flex-wrap gap-2">
                  {paper.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3 ml-8">
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-2" />
                下载全文
              </Button>
              <Button 
                variant="outline"
                onClick={handlePreview}
              >
                <Eye className="w-4 h-4 mr-2" />
                在线预览
              </Button>
              <Button 
                variant="outline"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                分享
              </Button>
            </div>
          </div>

          {/* 统计信息 */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{paper.downloadCount}</div>
              <div className="text-sm text-gray-600">下载次数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{paper.viewCount}</div>
              <div className="text-sm text-gray-600">浏览次数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{paper.citationCount}</div>
              <div className="text-sm text-gray-600">引用次数</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 详细内容标签页 */}
      <Tabs defaultValue="abstract" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="abstract">摘要</TabsTrigger>
          <TabsTrigger value="details">详细信息</TabsTrigger>
          <TabsTrigger value="reviews">评审意见</TabsTrigger>
          <TabsTrigger value="citations">引用情况</TabsTrigger>
        </TabsList>

        <TabsContent value="abstract">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>中文摘要</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{paper.abstract}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>英文摘要</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{paper.englishAbstract}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>详细信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">学号</h4>
                  <p className="text-gray-600">{paper.studentId}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">指导教师</h4>
                  <p className="text-gray-600">{paper.supervisor}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">专业</h4>
                  <p className="text-gray-600">{paper.major}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">提交日期</h4>
                  <p className="text-gray-600">{paper.submissionDate}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">答辩日期</h4>
                  <p className="text-gray-600">{paper.defenseDate}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">论文状态</h4>
                  <Badge className={getStatusColor(paper.status)}>{paper.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>评审意见</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {paper.reviewComments.map((review, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{review.reviewer}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{review.rating}</Badge>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="citations">
          <Card>
            <CardHeader>
              <CardTitle>引用情况</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">暂无引用数据</p>
                <p className="text-sm text-gray-400 mt-2">引用信息将在论文发布后更新</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
