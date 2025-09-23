"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, FileText, AlertCircle } from "lucide-react"
import { useState } from "react"

export function PaperSubmission() {
  const [formData, setFormData] = useState({
    title: "",
    englishTitle: "",
    author: "",
    studentId: "",
    supervisor: "",
    department: "",
    major: "",
    degree: "",
    keywords: "",
    abstract: "",
    englishAbstract: "",
    defenseDate: "",
    confidentialLevel: "public",
  })

  const [files, setFiles] = useState({
    fullText: null as File | null,
    abstract: null as File | null,
    authorization: null as File | null,
  })

  const [agreements, setAgreements] = useState({
    copyright: false,
    authenticity: false,
    privacy: false,
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (field: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [field]: file }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", { formData, files, agreements })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">论文提交</h1>
        <p className="text-gray-600">请填写完整的论文信息并上传相关文件</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title">论文题目 *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="请输入论文中文题目"
                  required
                />
              </div>
              <div>
                <Label htmlFor="englishTitle">英文题目 *</Label>
                <Input
                  id="englishTitle"
                  value={formData.englishTitle}
                  onChange={(e) => handleInputChange("englishTitle", e.target.value)}
                  placeholder="请输入论文英文题目"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="author">作者姓名 *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  placeholder="请输入作者姓名"
                  required
                />
              </div>
              <div>
                <Label htmlFor="studentId">学号 *</Label>
                <Input
                  id="studentId"
                  value={formData.studentId}
                  onChange={(e) => handleInputChange("studentId", e.target.value)}
                  placeholder="请输入学号"
                  required
                />
              </div>
              <div>
                <Label htmlFor="supervisor">指导教师 *</Label>
                <Input
                  id="supervisor"
                  value={formData.supervisor}
                  onChange={(e) => handleInputChange("supervisor", e.target.value)}
                  placeholder="请输入指导教师姓名"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="department">院系 *</Label>
                <Select onValueChange={(value) => handleInputChange("department", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择院系" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cs">计算机学院</SelectItem>
                    <SelectItem value="ee">信息与电子学院</SelectItem>
                    <SelectItem value="me">机械与车辆学院</SelectItem>
                    <SelectItem value="ae">宇航学院</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="major">专业 *</Label>
                <Input
                  id="major"
                  value={formData.major}
                  onChange={(e) => handleInputChange("major", e.target.value)}
                  placeholder="请输入专业名称"
                  required
                />
              </div>
              <div>
                <Label htmlFor="degree">学位类型 *</Label>
                <Select onValueChange={(value) => handleInputChange("degree", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择学位类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="master">硕士</SelectItem>
                    <SelectItem value="doctor">博士</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="defenseDate">答辩日期 *</Label>
                <Input
                  id="defenseDate"
                  type="date"
                  value={formData.defenseDate}
                  onChange={(e) => handleInputChange("defenseDate", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="confidentialLevel">保密级别 *</Label>
                <Select onValueChange={(value) => handleInputChange("confidentialLevel", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择保密级别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">公开</SelectItem>
                    <SelectItem value="restricted">限制</SelectItem>
                    <SelectItem value="confidential">保密</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 论文内容 */}
        <Card>
          <CardHeader>
            <CardTitle>论文内容</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="keywords">关键词 *</Label>
              <Input
                id="keywords"
                value={formData.keywords}
                onChange={(e) => handleInputChange("keywords", e.target.value)}
                placeholder="请输入关键词，用分号分隔"
                required
              />
              <p className="text-sm text-gray-500 mt-1">请用分号(;)分隔多个关键词</p>
            </div>

            <div>
              <Label htmlFor="abstract">中文摘要 *</Label>
              <Textarea
                id="abstract"
                value={formData.abstract}
                onChange={(e) => handleInputChange("abstract", e.target.value)}
                placeholder="请输入中文摘要"
                rows={6}
                required
              />
            </div>

            <div>
              <Label htmlFor="englishAbstract">英文摘要 *</Label>
              <Textarea
                id="englishAbstract"
                value={formData.englishAbstract}
                onChange={(e) => handleInputChange("englishAbstract", e.target.value)}
                placeholder="请输入英文摘要"
                rows={6}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* 文件上传 */}
        <Card>
          <CardHeader>
            <CardTitle>文件上传</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label>论文全文 *</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">点击上传或拖拽文件</p>
                  <p className="text-xs text-gray-500">支持PDF格式，最大50MB</p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileUpload("fullText", e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </div>
                {files.fullText && (
                  <p className="text-sm text-green-600 mt-2 flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    {files.fullText.name}
                  </p>
                )}
              </div>

              <div>
                <Label>论文摘要</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">点击上传或拖拽文件</p>
                  <p className="text-xs text-gray-500">支持PDF格式，最大10MB</p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileUpload("abstract", e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </div>
                {files.abstract && (
                  <p className="text-sm text-green-600 mt-2 flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    {files.abstract.name}
                  </p>
                )}
              </div>

              <div>
                <Label>授权书</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">点击上传或拖拽文件</p>
                  <p className="text-xs text-gray-500">支持PDF格式，最大10MB</p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileUpload("authorization", e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </div>
                {files.authorization && (
                  <p className="text-sm text-green-600 mt-2 flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    {files.authorization.name}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 声明与协议 */}
        <Card>
          <CardHeader>
            <CardTitle>声明与协议</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="copyright"
                checked={agreements.copyright}
                onCheckedChange={(checked) => setAgreements((prev) => ({ ...prev, copyright: checked as boolean }))}
              />
              <div>
                <Label htmlFor="copyright" className="text-sm font-medium">
                  版权声明
                </Label>
                <p className="text-sm text-gray-600">我确认拥有该论文的完整版权，并同意按照学校规定进行使用和传播。</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="authenticity"
                checked={agreements.authenticity}
                onCheckedChange={(checked) => setAgreements((prev) => ({ ...prev, authenticity: checked as boolean }))}
              />
              <div>
                <Label htmlFor="authenticity" className="text-sm font-medium">
                  原创性声明
                </Label>
                <p className="text-sm text-gray-600">
                  我声明所提交的论文是本人独立完成的研究成果，不存在抄袭、剽窃等学术不端行为。
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="privacy"
                checked={agreements.privacy}
                onCheckedChange={(checked) => setAgreements((prev) => ({ ...prev, privacy: checked as boolean }))}
              />
              <div>
                <Label htmlFor="privacy" className="text-sm font-medium">
                  隐私政策
                </Label>
                <p className="text-sm text-gray-600">
                  我已阅读并同意学校的隐私政策，同意按照相关规定处理我的个人信息。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 提交按钮 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <AlertCircle className="w-4 h-4" />
            <span>请确保所有必填信息已完整填写</span>
          </div>
          <div className="space-x-4">
            <Button type="button" variant="outline">
              保存草稿
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!agreements.copyright || !agreements.authenticity || !agreements.privacy}
            >
              提交论文
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
