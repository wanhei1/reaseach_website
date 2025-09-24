"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import type React from "react"

export function SearchSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("all")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // 跳转到搜索结果页面，带上查询参数
      const searchParams = new URLSearchParams({
        q: searchQuery.trim(),
        type: searchType
      })
      router.push(`/search?${searchParams.toString()}`)
    }
  }

  const handleHotwordClick = (keyword: string) => {
    const searchParams = new URLSearchParams({
      q: keyword,
      type: "all"
    })
    router.push(`/search?${searchParams.toString()}`)
  }

  return (
    <section className="bg-gradient-to-r from-blue-500 to-blue-600 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">学位论文管理系统</h2>
          <p className="text-blue-100">Beijing Institute of Technology</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex mb-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-l-md font-medium">学段检索</button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium">全文检索</button>
          </div>

          <form onSubmit={handleSearch} className="flex gap-3 mb-4">
            <div className="flex-1">
              <Input 
                placeholder="请输入关键字进行搜索" 
                className="h-12 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="h-12 px-8 bg-orange-500 hover:bg-orange-600">
              <Search className="w-5 h-5 mr-2" />
              检索
            </Button>
          </form>

          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center">
              <input 
                type="radio" 
                name="searchType" 
                value="all"
                checked={searchType === "all"}
                onChange={(e) => setSearchType(e.target.value)}
                className="mr-2" 
              />
              <span>全部</span>
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="searchType" 
                value="title"
                checked={searchType === "title"}
                onChange={(e) => setSearchType(e.target.value)}
                className="mr-2" 
              />
              <span>题名</span>
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="searchType" 
                value="author"
                checked={searchType === "author"}
                onChange={(e) => setSearchType(e.target.value)}
                className="mr-2" 
              />
              <span>作者</span>
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="searchType" 
                value="studentId"
                checked={searchType === "studentId"}
                onChange={(e) => setSearchType(e.target.value)}
                className="mr-2" 
              />
              <span>学号</span>
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="searchType" 
                value="supervisor"
                checked={searchType === "supervisor"}
                onChange={(e) => setSearchType(e.target.value)}
                className="mr-2" 
              />
              <span>导师</span>
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="searchType" 
                value="keywords"
                checked={searchType === "keywords"}
                onChange={(e) => setSearchType(e.target.value)}
                className="mr-2" 
              />
              <span>关键词</span>
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="searchType" 
                value="abstract"
                checked={searchType === "abstract"}
                onChange={(e) => setSearchType(e.target.value)}
                className="mr-2" 
              />
              <span>摘要</span>
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="searchType" 
                value="contents"
                checked={searchType === "contents"}
                onChange={(e) => setSearchType(e.target.value)}
                className="mr-2" 
              />
              <span>目次</span>
            </label>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
              <span>热门检索词：</span>
              <button onClick={() => handleHotwordClick("王博")} className="text-blue-600 hover:underline">
                王博
              </button>
              <span>|</span>
              <button onClick={() => handleHotwordClick("机器人")} className="text-blue-600 hover:underline">
                机器人
              </button>
              <span>|</span>
              <button onClick={() => handleHotwordClick("曹元大")} className="text-blue-600 hover:underline">
                曹元大
              </button>
              <span>|</span>
              <button onClick={() => handleHotwordClick("有限体积法")} className="text-blue-600 hover:underline">
                有限体积法
              </button>
              <span>|</span>
              <button onClick={() => handleHotwordClick("视觉焊")} className="text-blue-600 hover:underline">
                视觉焊
              </button>
              <span>|</span>
              <button onClick={() => router.push('/search')} className="text-blue-600 hover:underline">
                更多
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
