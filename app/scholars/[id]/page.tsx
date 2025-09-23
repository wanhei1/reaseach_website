import { Header } from "@/components/header"
import { ScholarProfile } from "@/components/scholar-profile"

export default function ScholarDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ScholarProfile scholarId={params.id} />
    </div>
  )
}
