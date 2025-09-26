"use client"
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
    <section className="bit-section-small">
      <div className="bit-container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="bit-text-heading-2 text-white mb-4">智能搜索</h2>
            <p className="bit-text-body-large text-white/80">
              快速找到您需要的学术资源和研究成果
            </p>
          </div>

          <div className="bit-card bit-card-glass p-8">
            <div className="flex mb-6">
              <button className="bit-btn bit-btn-primary">
                智能搜索
              </button>
              <button className="bit-btn bit-btn-ghost ml-2">
                全文检索
              </button>
            </div>

            <form onSubmit={handleSearch} className="flex gap-4 mb-6">
              <div className="flex-1">
                <input 
                  className="bit-input h-12 text-lg"
                  placeholder="请输入关键字进行搜索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button type="submit" className="bit-btn bit-btn-primary bit-btn-large">
                <Search className="w-5 h-5 mr-2" />
                搜索
              </button>
            </form>

            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                { value: "all", label: "全部" },
                { value: "title", label: "题名" },
                { value: "author", label: "作者" },
                { value: "supervisor", label: "导师" }
              ].map((option) => (
                <label key={option.value} className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="searchType" 
                    value={option.value}
                    checked={searchType === option.value}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 w-full ${searchType === option.value ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-gray-600 hover:bg-white/10 hover:text-white border border-transparent'}`}>
                    {option.label}
                  </div>
                </label>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="bit-text-body-small text-white/60">热门搜索：</span>
                <button onClick={() => handleHotwordClick("机器学习")} className="px-3 py-1 bg-white/10 text-white/80 rounded-full hover:bg-white/20 hover:text-white transition-all duration-200">机器学习</button>
                <button onClick={() => handleHotwordClick("人工智能")} className="px-3 py-1 bg-white/10 text-white/80 rounded-full hover:bg-white/20 hover:text-white transition-all duration-200">人工智能</button>
                <button onClick={() => router.push('/search')} className="text-blue-300 hover:text-blue-200 transition-colors duration-200">更多 →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
