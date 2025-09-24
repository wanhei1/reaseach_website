import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, Users, BookOpen } from "lucide-react"

export default function DepartmentsPage() {
  const departments = [
    {
      id: 1,
      name: "机械与车辆学院",
      description: "涵盖机械工程、车辆工程、工业设计等专业",
      majors: ["机械工程", "车辆工程", "工业设计", "机械电子工程"],
      paperCount: 245,
      scholarCount: 67
    },
    {
      id: 2,
      name: "光电学院",
      description: "光学工程、电子科学与技术等前沿学科",
      majors: ["光学工程", "电子科学与技术", "测控技术与仪器"],
      paperCount: 189,
      scholarCount: 42
    },
    {
      id: 3,
      name: "信息与电子学院",
      description: "信息与通信工程、电子信息工程等热门专业",
      majors: ["信息与通信工程", "电子信息工程", "电子科学与技术"],
      paperCount: 312,
      scholarCount: 89
    },
    {
      id: 4,
      name: "自动化学院",
      description: "自动化、电气工程及其自动化等工程学科",
      majors: ["自动化", "电气工程及其自动化", "智能科学与技术"],
      paperCount: 198,
      scholarCount: 56
    },
    {
      id: 5,
      name: "计算机学院",
      description: "计算机科学与技术、软件工程等信息技术学科",
      majors: ["计算机科学与技术", "软件工程", "网络工程", "信息安全"],
      paperCount: 387,
      scholarCount: 94
    },
    {
      id: 6,
      name: "材料学院",
      description: "材料科学与工程、材料物理等材料学科",
      majors: ["材料科学与工程", "材料物理", "材料化学"],
      paperCount: 156,
      scholarCount: 38
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">院系专业导航</h1>
          <p className="text-gray-600">
            浏览北京理工大学各院系的专业设置、论文数量和学者信息
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <Card key={dept.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                  <Building className="w-5 h-5 mr-2 text-blue-600" />
                  {dept.name}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2">{dept.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {dept.majors.map((major, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {major}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span>{dept.paperCount} 篇论文</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{dept.scholarCount} 位学者</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="py-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">数据统计</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {departments.length}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">学院</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {departments.reduce((sum, dept) => sum + dept.paperCount, 0)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">论文总数</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {departments.reduce((sum, dept) => sum + dept.scholarCount, 0)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">学者总数</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}