import { Header } from "@/components/header"
import { AdvancedSearch } from "@/components/advanced-search"

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AdvancedSearch />
    </div>
  )
}
