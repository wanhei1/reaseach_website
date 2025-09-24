"use client"
import { Header } from "@/components/header"
import { EnhancedSearchEngine } from "@/components/enhanced-search-engine"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [initialQuery, setInitialQuery] = useState("")
  const [initialFilters, setInitialFilters] = useState({})

  useEffect(() => {
    const query = searchParams.get("q") || ""
    const department = searchParams.get("department") || ""
    const major = searchParams.get("major") || ""
    const year = searchParams.get("year") || ""
    const author = searchParams.get("author") || ""
    const status = searchParams.get("status") || ""
    
    setInitialQuery(query)
    setInitialFilters({
      department,
      major,
      year,
      author,
      status
    })
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <EnhancedSearchEngine 
        initialQuery={initialQuery} 
        initialFilters={initialFilters}
      />
    </div>
  )
}
