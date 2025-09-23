"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, Building, Edit, Save, Key, FileText, Calendar } from "lucide-react"
import { useState } from "react"

export function UserProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState({
    username: "zhangsan",
    fullName: "张三",
    email: "zhangsan@bit.edu.cn",
    phone: "13800138000",
    studentId: "2021001",
    department: "计算机学院",
    major: "计算机科学与技术",
    userType: "学生",
    joinDate: "2021-09-01",
    lastLogin: "2023-12-15 14:30:00",
  })

  const userPapers = [
    {
      id: 1,
      title: "基于深度学习的图像识别算法研究",
      status: "已通过",
      submissionDate: "2023-12-01",
      defenseDate: "2023-12-15",
    },
    {
      id: 2,
      title: "机器学习在自然语言处理中的应用",
      status: "审核中",
      submissionDate: "2023-11-20",
      defenseDate: "2024-01-10",
    },
  ]

  const userActivities = [
    { date: "2023-12-15", action: "提交论文", description: "提交了学位论文《基于深度学习的图像识别算法研究》" },
    { date: "2023-12-10", action: "修改资料", description: "更新了个人联系方式" },
    { date: "2023-12-05", action: "下载文件", description: "下载了论文模板文件" },
    { date: "2023-12-01", action: "登录系统", description: "首次登录学位论文管理系统" },
  ]

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving user info:", userInfo)
    setIsEditing(false)
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">个人中心</h1>
          <p className="text-gray-600">管理您的个人信息和学术资料</p>
        </div>
        <Button variant="outline" onClick={() => (window.location.href = "/login")}>
          退出登录
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 用户信息卡片 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  个人信息
                </span>
                <Button size="sm" variant="outline" onClick={() => (isEditing ? handleSave() : setIsEditing(true))}>
                  {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                  {isEditing ? "保存" : "编辑"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-2xl">{userInfo.fullName.charAt(0)}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{userInfo.fullName}</h3>
                <Badge variant="secondary">{userInfo.userType}</Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="fullName">姓名</Label>
                  <Input
                    id="fullName"
                    value={userInfo.fullName}
                    onChange={(e) => setUserInfo({ ...userInfo, fullName: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">邮箱</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">手机号</Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="studentId">学号</Label>
                  <Input id="studentId" value={userInfo.studentId} disabled className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="department">院系</Label>
                  <div className="relative mt-1">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="department" value={userInfo.department} disabled className="pl-10" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="major">专业</Label>
                  <Input id="major" value={userInfo.major} disabled className="mt-1" />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>注册时间:</span>
                  <span>{userInfo.joinDate}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>最后登录:</span>
                  <span>{userInfo.lastLogin}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 详细信息标签页 */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="papers" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="papers">我的论文</TabsTrigger>
              <TabsTrigger value="activities">活动记录</TabsTrigger>
              <TabsTrigger value="security">安全设置</TabsTrigger>
            </TabsList>

            <TabsContent value="papers">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    我的论文 ({userPapers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userPapers.map((paper) => (
                      <div key={paper.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-2">{paper.title}</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">提交日期：</span>
                                {paper.submissionDate}
                              </div>
                              <div>
                                <span className="font-medium">答辩日期：</span>
                                {paper.defenseDate}
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(paper.status)}>{paper.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activities">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    活动记录
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userActivities.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-gray-900">{activity.action}</h4>
                            <span className="text-sm text-gray-500">{activity.date}</span>
                          </div>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Key className="w-5 h-5 mr-2" />
                    安全设置
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">修改密码</h4>
                        <p className="text-sm text-gray-600">定期更新密码以保护账户安全</p>
                      </div>
                      <Button variant="outline">修改密码</Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">两步验证</h4>
                        <p className="text-sm text-gray-600">为您的账户添加额外的安全保护</p>
                      </div>
                      <Button variant="outline">启用</Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">登录设备管理</h4>
                        <p className="text-sm text-gray-600">查看和管理已登录的设备</p>
                      </div>
                      <Button variant="outline">管理设备</Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">账户注销</h4>
                        <p className="text-sm text-gray-600 text-red-600">永久删除您的账户和所有数据</p>
                      </div>
                      <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent">
                        注销账户
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
