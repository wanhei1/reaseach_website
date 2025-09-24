"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, Save, X } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

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
}

export default function EditPaperPage({ params }: { params: { id: string } }) {
  const [paper, setPaper] = useState<Paper | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    advisor: '',
    department: '',
    major: '',
    degree_type: '',
    defense_date: '',
    abstract: '',
    keywords: [] as string[]
  })
  const [newKeyword, setNewKeyword] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchPaper()
  }, [params.id])

  const fetchPaper = async () => {
    try {
      setLoading(true)
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('papers')
        .select('*')
        .eq('id', params.id)
        .eq('submitted_by', user.id)
        .single()

      if (error) {
        console.error('获取论文失败:', error)
        setError('论文不存在或无权限访问')
        return
      }

      setPaper(data)
      setFormData({
        title: data.title || '',
        author: data.author || '',
        advisor: data.advisor || '',
        department: data.department || '',
        major: data.major || '',
        degree_type: data.degree_type || '',
        defense_date: data.defense_date || '',
        abstract: data.abstract || '',
        keywords: data.keywords || []
      })
    } catch (error) {
      console.error('获取论文失败:', error)
      setError('获取论文信息失败')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }))
      setNewKeyword('')
    }
  }

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 检查文件类型
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        setError('只支持 PDF、DOC、DOCX 格式的文件')
        return
      }
      
      // 检查文件大小 (50MB)
      if (file.size > 50 * 1024 * 1024) {
        setError('文件大小不能超过 50MB')
        return
      }
      
      setSelectedFile(file)
      setError('')
    }
  }

  const uploadFile = async (): Promise<string | null> => {
    if (!selectedFile) return paper?.file_url || null

    try {
      setUploading(true)
      
      // 删除旧文件
      if (paper?.file_url) {
        const oldFilePath = paper.file_url.split('/').pop()
        if (oldFilePath) {
          await supabase.storage.from('papers').remove([oldFilePath])
        }
      }

      // 生成唯一文件名
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('papers')
        .upload(fileName, selectedFile)

      if (error) throw error

      // 获取公共URL
      const { data: { publicUrl } } = supabase.storage
        .from('papers')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      console.error('文件上传失败:', error)
      throw error
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.author.trim()) {
      setError('请填写论文标题和作者')
      return
    }

    try {
      setSaving(true)
      setError('')

      // 上传文件
      const fileUrl = await uploadFile()

      // 更新论文信息
      const updateData = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        advisor: formData.advisor.trim() || null,
        department: formData.department || null,
        major: formData.major || null,
        degree_type: formData.degree_type || null,
        defense_date: formData.defense_date || null,
        abstract: formData.abstract.trim() || null,
        keywords: formData.keywords.length > 0 ? formData.keywords : null,
        file_url: fileUrl,
        file_name: selectedFile?.name || paper?.file_name,
        file_size: selectedFile?.size || paper?.file_size,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('papers')
        .update(updateData)
        .eq('id', params.id)

      if (error) throw error

      setSuccess('论文更新成功！')
      setTimeout(() => {
        router.push('/papers')
      }, 2000)

    } catch (error) {
      console.error('更新失败:', error)
      setError('更新论文失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">加载论文信息中...</p>
        </div>
      </div>
    )
  }

  if (error && !paper) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/papers">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回论文列表
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/papers">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">编辑论文</h1>
              <p className="text-gray-600 mt-1">修改论文信息和重新上传文件</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* 基本信息 */}
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">论文标题 *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="请输入论文标题"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="author">作者姓名 *</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => handleInputChange('author', e.target.value)}
                      placeholder="请输入作者姓名"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="advisor">指导教师</Label>
                    <Input
                      id="advisor"
                      value={formData.advisor}
                      onChange={(e) => handleInputChange('advisor', e.target.value)}
                      placeholder="请输入指导教师姓名"
                    />
                  </div>
                  <div>
                    <Label htmlFor="degree_type">学位类型</Label>
                    <Select value={formData.degree_type} onValueChange={(value) => handleInputChange('degree_type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择学位类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="学士">学士</SelectItem>
                        <SelectItem value="硕士">硕士</SelectItem>
                        <SelectItem value="博士">博士</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="department">院系</Label>
                    <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择院系" />
                      </SelectTrigger>
                      <SelectContent>
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
                      value={formData.major}
                      onChange={(e) => handleInputChange('major', e.target.value)}
                      placeholder="请输入专业名称"
                    />
                  </div>
                  <div>
                    <Label htmlFor="defense_date">答辩日期</Label>
                    <Input
                      id="defense_date"
                      type="date"
                      value={formData.defense_date}
                      onChange={(e) => handleInputChange('defense_date', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 论文内容 */}
            <Card>
              <CardHeader>
                <CardTitle>论文内容</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="abstract">摘要</Label>
                  <Textarea
                    id="abstract"
                    value={formData.abstract}
                    onChange={(e) => handleInputChange('abstract', e.target.value)}
                    placeholder="请输入论文摘要"
                    rows={6}
                  />
                </div>

                <div>
                  <Label>关键词</Label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="输入关键词"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    />
                    <Button type="button" onClick={addKeyword} variant="outline">
                      添加
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>{keyword}</span>
                        <button
                          type="button"
                          onClick={() => removeKeyword(index)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 文件上传 */}
            <Card>
              <CardHeader>
                <CardTitle>论文文件</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paper?.file_name && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">当前文件：</p>
                      <p className="font-medium">{paper.file_name}</p>
                      <p className="text-sm text-gray-500">
                        {paper.file_size ? `${(paper.file_size / 1024 / 1024).toFixed(2)} MB` : ''}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="file">上传新文件（可选）</Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      支持 PDF、DOC、DOCX 格式，最大 50MB
                    </p>
                  </div>

                  {selectedFile && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">新选择的文件：</p>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 状态消息 */}
            {error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-green-600">{success}</p>
              </div>
            )}

            {/* 提交按钮 */}
            <div className="flex justify-end space-x-4">
              <Link href="/papers">
                <Button variant="outline" type="button">
                  取消
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={saving || uploading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
                    {uploading ? '上传中...' : '保存中...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    保存修改
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}