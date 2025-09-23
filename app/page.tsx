import { Header } from "@/components/header"
import { SearchSection } from "@/components/search-section"
import { MainContent } from "@/components/main-content"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SearchSection />
      <MainContent />
    </div>
  )
}
