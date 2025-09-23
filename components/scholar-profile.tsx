import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Award, Users, Mail, Phone, MapPin, Download } from "lucide-react"

interface ScholarProfileProps {
  scholarId: string
}

export function ScholarProfile({ scholarId }: ScholarProfileProps) {
  // Mock data - in real app would fetch based on scholarId
  const scholar = {
    id: scholarId,
    name: "王博",
    title: "教授",
    department: "计算机学院",
    email: "wangbo@bit.edu.cn",
    phone: "+86-10-68912345",
    office: "中关村校区 计算机楼 A301",
    avatar: "/diverse-professor-lecturing.png",
    researchAreas: ["人工智能", "机器学习", "深度学习", "计算机视觉"],
    biography:
      "王博教授是北京理工大学计算机学院的知名学者，专注于人工智能和机器学习领域的研究。他在深度学习算法优化、计算机视觉应用等方面有着丰富的研究经验，发表了多篇高质量的学术论文。",
    education: [
      { degree: "博士", major: "计算机科学与技术", university: "清华大学", year: "2010" },
      { degree: "硕士", major: "计算机应用技术", university: "北京理工大学", year: "2007" },
      { degree: "学士", major: "计算机科学与技术", university: "北京理工大学", year: "2005" },
    ],
    papers: [
      {
        title: "基于深度学习的图像识别算法研究",
        authors: "王博, 李明, 张华",
        journal: "计算机学报",
        year: "2023",
        citations: 45,
        type: "期刊论文",
      },
      {
        title: "神经网络在自然语言处理中的应用",
        authors: "王博, 陈伟",
        journal: "软件学报",
        year: "2023",
        citations: 32,
        type: "期刊论文",
      },
      {
        title: "机器学习算法优化研究",
        authors: "王博, 刘强, 赵敏",
        journal: "中国科学：信息科学",
        year: "2022",
        citations: 67,
        type: "期刊论文",
      },
    ],
    projects: [
      {
        name: "基于深度学习的智能图像分析系统",
        funding: "国家自然科学基金",
        amount: "50万元",
        period: "2022-2025",
        role: "项目负责人",
      },
      {
        name: "人工智能在工业4.0中的应用研究",
        funding: "科技部重点研发计划",
        amount: "200万元",
        period: "2021-2024",
        role: "主要参与者",
      },
    ],
    awards: [
      { name: "北京市科学技术奖二等奖", year: "2023" },
      { name: "中国计算机学会优秀论文奖", year: "2022" },
      { name: "北京理工大学优秀教师", year: "2021" },
    ],
    stats: {
      paperCount: 45,
      citationCount: 1250,
      hIndex: 18,
      studentCount: 12,
    },
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 学者基本信息 */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-8">
            <img
              src={scholar.avatar || "/placeholder.svg"}
              alt={scholar.name}
              className="w-32 h-32 rounded-full object-cover mx-auto lg:mx-0"
            />
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{scholar.name}</h1>
              <p className="text-xl text-gray-600 mb-4">
                {scholar.title} · {scholar.department}
              </p>

              <div className="mb-4">
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {scholar.researchAreas.map((area, index) => (
                    <Badge key={index} variant="secondary">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{scholar.stats.paperCount}</div>
                  <div className="text-sm text-gray-600">发表论文</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{scholar.stats.citationCount}</div>
                  <div className="text-sm text-gray-600">总引用数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{scholar.stats.hIndex}</div>
                  <div className="text-sm text-gray-600">H指数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{scholar.stats.studentCount}</div>
                  <div className="text-sm text-gray-600">指导学生</div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {scholar.email}
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {scholar.phone}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {scholar.office}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 详细信息标签页 */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="papers">论文成果</TabsTrigger>
          <TabsTrigger value="projects">科研项目</TabsTrigger>
          <TabsTrigger value="awards">获奖荣誉</TabsTrigger>
          <TabsTrigger value="education">教育背景</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>个人简介</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{scholar.biography}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="papers">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                发表论文 ({scholar.papers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scholar.papers.map((paper, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <h4 className="font-semibold text-gray-900 mb-1">{paper.title}</h4>
                    <p className="text-sm text-gray-600 mb-1">作者：{paper.authors}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{paper.journal}</span>
                        <span>{paper.year}</span>
                        <Badge variant="outline">{paper.type}</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">引用: {paper.citations}</span>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          下载
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                科研项目 ({scholar.projects.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scholar.projects.map((project, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{project.name}</h4>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">资助机构：</span>
                        <span>{project.funding}</span>
                      </div>
                      <div>
                        <span className="font-medium">资助金额：</span>
                        <span>{project.amount}</span>
                      </div>
                      <div>
                        <span className="font-medium">项目周期：</span>
                        <span>{project.period}</span>
                      </div>
                      <div>
                        <span className="font-medium">承担角色：</span>
                        <span>{project.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="awards">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                获奖荣誉 ({scholar.awards.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scholar.awards.map((award, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{award.name}</span>
                    <span className="text-sm text-gray-600">{award.year}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card>
            <CardHeader>
              <CardTitle>教育背景</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scholar.education.map((edu, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {edu.degree} · {edu.major}
                      </h4>
                      <p className="text-gray-600">
                        {edu.university} · {edu.year}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
