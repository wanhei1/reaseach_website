import { Header } from "@/components/header"
import { PaperDetail } from "@/components/paper-detail"

export default function PaperDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <PaperDetail paperId={params.id} />
    </div>
  )
}
