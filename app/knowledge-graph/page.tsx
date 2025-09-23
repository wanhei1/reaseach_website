import { Header } from "@/components/header"
import { KnowledgeGraph } from "@/components/knowledge-graph"

export default function KnowledgeGraphPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <KnowledgeGraph />
    </div>
  )
}
