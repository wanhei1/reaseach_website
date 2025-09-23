import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function SearchSection() {
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

          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <Input placeholder="请输入关键字进行搜索" className="h-12 text-lg" />
            </div>
            <Button className="h-12 px-8 bg-orange-500 hover:bg-orange-600">
              <Search className="w-5 h-5 mr-2" />
              检索
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center">
              <input type="radio" name="searchType" className="mr-2" defaultChecked />
              <span>全部</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="searchType" className="mr-2" />
              <span>题名</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="searchType" className="mr-2" />
              <span>作者</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="searchType" className="mr-2" />
              <span>学号</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="searchType" className="mr-2" />
              <span>导师</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="searchType" className="mr-2" />
              <span>关键词</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="searchType" className="mr-2" />
              <span>摘要</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="searchType" className="mr-2" />
              <span>目次</span>
            </label>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
              <span>热门检索词：</span>
              <a href="#" className="text-blue-600 hover:underline">
                王博
              </a>
              <span>|</span>
              <a href="#" className="text-blue-600 hover:underline">
                机器人
              </a>
              <span>|</span>
              <a href="#" className="text-blue-600 hover:underline">
                曹元大
              </a>
              <span>|</span>
              <a href="#" className="text-blue-600 hover:underline">
                有限体积法
              </a>
              <span>|</span>
              <a href="#" className="text-blue-600 hover:underline">
                视觉焊
              </a>
              <span>|</span>
              <a href="#" className="text-blue-600 hover:underline">
                更多
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
