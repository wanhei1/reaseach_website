"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Search,
  Network,
  Users,
  FileText,
  Tag,
  Building,
  Zap,
  Filter,
  Download,
  Maximize2,
  RotateCcw,
  Play,
  Pause,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface Node {
  id: string
  label: string
  type: "scholar" | "paper" | "keyword" | "department"
  size: number
  color: string
  x?: number
  y?: number
  vx?: number
  vy?: number
}

interface Link {
  source: string
  target: string
  strength: number
  type: "collaboration" | "authorship" | "citation" | "keyword"
}

export function KnowledgeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [linkStrength, setLinkStrength] = useState([0.5])
  const [isSimulating, setIsSimulating] = useState(true)
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null)

  // Mock knowledge graph data
  const nodes: Node[] = [
    // Scholars
    { id: "scholar1", label: "王博", type: "scholar", size: 20, color: "#3B82F6" },
    { id: "scholar2", label: "李明", type: "scholar", size: 18, color: "#3B82F6" },
    { id: "scholar3", label: "张华", type: "scholar", size: 22, color: "#3B82F6" },
    { id: "scholar4", label: "陈伟", type: "scholar", size: 16, color: "#3B82F6" },
    { id: "scholar5", label: "刘强", type: "scholar", size: 19, color: "#3B82F6" },

    // Papers
    { id: "paper1", label: "深度学习算法研究", type: "paper", size: 15, color: "#10B981" },
    { id: "paper2", label: "5G通信技术", type: "paper", size: 14, color: "#10B981" },
    { id: "paper3", label: "机器人控制系统", type: "paper", size: 16, color: "#10B981" },
    { id: "paper4", label: "图像识别技术", type: "paper", size: 13, color: "#10B981" },
    { id: "paper5", label: "自然语言处理", type: "paper", size: 17, color: "#10B981" },

    // Keywords
    { id: "keyword1", label: "人工智能", type: "keyword", size: 25, color: "#F59E0B" },
    { id: "keyword2", label: "机器学习", type: "keyword", size: 23, color: "#F59E0B" },
    { id: "keyword3", label: "深度学习", type: "keyword", size: 21, color: "#F59E0B" },
    { id: "keyword4", label: "计算机视觉", type: "keyword", size: 19, color: "#F59E0B" },
    { id: "keyword5", label: "5G通信", type: "keyword", size: 18, color: "#F59E0B" },

    // Departments
    { id: "dept1", label: "计算机学院", type: "department", size: 30, color: "#EF4444" },
    { id: "dept2", label: "信息与电子学院", type: "department", size: 28, color: "#EF4444" },
    { id: "dept3", label: "机械与车辆学院", type: "department", size: 26, color: "#EF4444" },
  ]

  const links: Link[] = [
    // Scholar-Paper relationships
    { source: "scholar1", target: "paper1", strength: 0.8, type: "authorship" },
    { source: "scholar1", target: "paper4", strength: 0.7, type: "authorship" },
    { source: "scholar2", target: "paper2", strength: 0.9, type: "authorship" },
    { source: "scholar3", target: "paper3", strength: 0.8, type: "authorship" },
    { source: "scholar4", target: "paper5", strength: 0.7, type: "authorship" },

    // Scholar-Department relationships
    { source: "scholar1", target: "dept1", strength: 1.0, type: "collaboration" },
    { source: "scholar2", target: "dept2", strength: 1.0, type: "collaboration" },
    { source: "scholar3", target: "dept3", strength: 1.0, type: "collaboration" },
    { source: "scholar4", target: "dept1", strength: 1.0, type: "collaboration" },
    { source: "scholar5", target: "dept1", strength: 1.0, type: "collaboration" },

    // Paper-Keyword relationships
    { source: "paper1", target: "keyword1", strength: 0.9, type: "keyword" },
    { source: "paper1", target: "keyword2", strength: 0.8, type: "keyword" },
    { source: "paper1", target: "keyword3", strength: 0.9, type: "keyword" },
    { source: "paper4", target: "keyword4", strength: 0.8, type: "keyword" },
    { source: "paper2", target: "keyword5", strength: 0.9, type: "keyword" },

    // Scholar collaborations
    { source: "scholar1", target: "scholar4", strength: 0.6, type: "collaboration" },
    { source: "scholar1", target: "scholar5", strength: 0.5, type: "collaboration" },
    { source: "scholar2", target: "scholar3", strength: 0.4, type: "collaboration" },

    // Paper citations
    { source: "paper1", target: "paper4", strength: 0.3, type: "citation" },
    { source: "paper2", target: "paper3", strength: 0.2, type: "citation" },
  ]

  const [graphNodes, setGraphNodes] = useState<Node[]>(nodes)
  const [graphLinks, setGraphLinks] = useState<Link[]>(links)

  // Simple force simulation
  useEffect(() => {
    if (!isSimulating) return

    const interval = setInterval(() => {
      setGraphNodes((prevNodes) => {
        const newNodes = prevNodes.map((node) => {
          if (!node.x) node.x = Math.random() * 800
          if (!node.y) node.y = Math.random() * 600
          if (!node.vx) node.vx = 0
          if (!node.vy) node.vy = 0

          let fx = 0
          let fy = 0

          // Repulsion between nodes
          prevNodes.forEach((other) => {
            if (other.id !== node.id && other.x && other.y) {
              const dx = node.x! - other.x
              const dy = node.y! - other.y
              const distance = Math.sqrt(dx * dx + dy * dy) || 1
              const force = (node.size + other.size) / distance
              fx += (dx / distance) * force * 0.1
              fy += (dy / distance) * force * 0.1
            }
          })

          // Attraction from links
          graphLinks.forEach((link) => {
            if (link.source === node.id || link.target === node.id) {
              const other = prevNodes.find((n) => n.id === (link.source === node.id ? link.target : link.source))
              if (other && other.x && other.y) {
                const dx = other.x - node.x!
                const dy = other.y - node.y!
                const distance = Math.sqrt(dx * dx + dy * dy) || 1
                const force = link.strength * linkStrength[0]
                fx += (dx / distance) * force * 0.05
                fy += (dy / distance) * force * 0.05
              }
            }
          })

          // Center force
          const centerX = 400
          const centerY = 300
          fx += (centerX - node.x!) * 0.001
          fy += (centerY - node.y!) * 0.001

          // Update velocity and position
          node.vx = (node.vx + fx) * 0.9
          node.vy = (node.vy + fy) * 0.9
          node.x = Math.max(node.size, Math.min(800 - node.size, node.x! + node.vx))
          node.y = Math.max(node.size, Math.min(600 - node.size, node.y! + node.vy))

          return { ...node }
        })
        return newNodes
      })
    }, 50)

    return () => clearInterval(interval)
  }, [isSimulating, linkStrength, graphLinks])

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw links
    graphLinks.forEach((link) => {
      const sourceNode = graphNodes.find((n) => n.id === link.source)
      const targetNode = graphNodes.find((n) => n.id === link.target)

      if (sourceNode && targetNode && sourceNode.x && sourceNode.y && targetNode.x && targetNode.y) {
        ctx.beginPath()
        ctx.moveTo(sourceNode.x, sourceNode.y)
        ctx.lineTo(targetNode.x, targetNode.y)
        ctx.strokeStyle = `rgba(156, 163, 175, ${link.strength * linkStrength[0]})`
        ctx.lineWidth = link.strength * 2
        ctx.stroke()
      }
    })

    // Draw nodes
    graphNodes.forEach((node) => {
      if (node.x && node.y) {
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI)
        ctx.fillStyle = node.color
        if (selectedNode?.id === node.id) {
          ctx.strokeStyle = "#1F2937"
          ctx.lineWidth = 3
          ctx.stroke()
        }
        if (hoveredNode?.id === node.id) {
          ctx.strokeStyle = "#6B7280"
          ctx.lineWidth = 2
          ctx.stroke()
        }
        ctx.fill()

        // Draw labels
        ctx.fillStyle = "#1F2937"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(node.label, node.x, node.y + node.size + 15)
      }
    })
  }, [graphNodes, graphLinks, selectedNode, hoveredNode, linkStrength])

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const clickedNode = graphNodes.find((node) => {
      if (node.x && node.y) {
        const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2)
        return distance <= node.size
      }
      return false
    })

    setSelectedNode(clickedNode || null)
  }

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const hoveredNode = graphNodes.find((node) => {
      if (node.x && node.y) {
        const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2)
        return distance <= node.size
      }
      return false
    })

    setHoveredNode(hoveredNode || null)
    canvas.style.cursor = hoveredNode ? "pointer" : "default"
  }

  const resetGraph = () => {
    setGraphNodes(
      nodes.map((node) => ({
        ...node,
        x: Math.random() * 800,
        y: Math.random() * 600,
        vx: 0,
        vy: 0,
      })),
    )
  }

  const getNodeTypeIcon = (type: string) => {
    switch (type) {
      case "scholar":
        return <Users className="w-4 h-4" />
      case "paper":
        return <FileText className="w-4 h-4" />
      case "keyword":
        return <Tag className="w-4 h-4" />
      case "department":
        return <Building className="w-4 h-4" />
      default:
        return <Network className="w-4 h-4" />
    }
  }

  const getNodeTypeColor = (type: string) => {
    switch (type) {
      case "scholar":
        return "bg-blue-100 text-blue-800"
      case "paper":
        return "bg-green-100 text-green-800"
      case "keyword":
        return "bg-yellow-100 text-yellow-800"
      case "department":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">知识图谱</h1>
          <p className="text-gray-600">探索学者、论文和研究领域之间的关系网络</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={resetGraph}>
            <RotateCcw className="w-4 h-4 mr-2" />
            重置
          </Button>
          <Button variant="outline" onClick={() => setIsSimulating(!isSimulating)}>
            {isSimulating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isSimulating ? "暂停" : "开始"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 控制面板 */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                控制面板
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">搜索节点</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="搜索学者、论文或关键词..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">节点类型</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="scholar">学者</SelectItem>
                    <SelectItem value="paper">论文</SelectItem>
                    <SelectItem value="keyword">关键词</SelectItem>
                    <SelectItem value="department">院系</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">连接强度</label>
                <Slider
                  value={linkStrength}
                  onValueChange={setLinkStrength}
                  max={1}
                  min={0.1}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>弱</span>
                  <span>强</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-3">图例</h4>
                <div className="space-y-2">
                  {["scholar", "paper", "keyword", "department"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <div
                        className={`w-4 h-4 rounded-full ${type === "scholar" ? "bg-blue-500" : type === "paper" ? "bg-green-500" : type === "keyword" ? "bg-yellow-500" : "bg-red-500"}`}
                      ></div>
                      <span className="text-sm text-gray-700 capitalize">
                        {type === "scholar"
                          ? "学者"
                          : type === "paper"
                            ? "论文"
                            : type === "keyword"
                              ? "关键词"
                              : "院系"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 选中节点信息 */}
          {selectedNode && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {getNodeTypeIcon(selectedNode.type)}
                  <span className="ml-2">节点信息</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedNode.label}</h4>
                    <Badge className={getNodeTypeColor(selectedNode.type)}>
                      {selectedNode.type === "scholar"
                        ? "学者"
                        : selectedNode.type === "paper"
                          ? "论文"
                          : selectedNode.type === "keyword"
                            ? "关键词"
                            : "院系"}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>
                      连接数:{" "}
                      {graphLinks.filter((l) => l.source === selectedNode.id || l.target === selectedNode.id).length}
                    </p>
                    <p>影响力: {selectedNode.size}</p>
                  </div>
                  <div className="pt-2">
                    <h5 className="font-medium text-gray-900 mb-2">相关连接</h5>
                    <div className="space-y-1">
                      {graphLinks
                        .filter((l) => l.source === selectedNode.id || l.target === selectedNode.id)
                        .slice(0, 5)
                        .map((link, index) => {
                          const connectedNodeId = link.source === selectedNode.id ? link.target : link.source
                          const connectedNode = graphNodes.find((n) => n.id === connectedNodeId)
                          return (
                            <div key={index} className="text-xs text-gray-600 flex items-center justify-between">
                              <span>{connectedNode?.label}</span>
                              <span className="text-gray-400">{(link.strength * 100).toFixed(0)}%</span>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 知识图谱可视化 */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Network className="w-5 h-5 mr-2" />
                  知识图谱可视化
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    导出
                  </Button>
                  <Button size="sm" variant="outline">
                    <Maximize2 className="w-4 h-4 mr-2" />
                    全屏
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="border rounded-lg cursor-crosshair"
                  onClick={handleCanvasClick}
                  onMouseMove={handleCanvasMouseMove}
                />
                <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 text-sm">
                  <div className="flex items-center space-x-4">
                    <span>节点: {graphNodes.length}</span>
                    <span>连接: {graphLinks.length}</span>
                    <span className="flex items-center">
                      <Zap className="w-3 h-3 mr-1" />
                      {isSimulating ? "运行中" : "已暂停"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 统计信息 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-lg font-semibold text-gray-900">
                  {nodes.filter((n) => n.type === "scholar").length}
                </div>
                <div className="text-sm text-gray-600">学者节点</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-lg font-semibold text-gray-900">
                  {nodes.filter((n) => n.type === "paper").length}
                </div>
                <div className="text-sm text-gray-600">论文节点</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Tag className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                <div className="text-lg font-semibold text-gray-900">
                  {nodes.filter((n) => n.type === "keyword").length}
                </div>
                <div className="text-sm text-gray-600">关键词节点</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Building className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <div className="text-lg font-semibold text-gray-900">
                  {nodes.filter((n) => n.type === "department").length}
                </div>
                <div className="text-sm text-gray-600">院系节点</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
