import { Header } from "@/components/header"
import { PaperManagement } from "@/components/paper-management"

export default function PapersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <PaperManagement />
    </div>
  )
}
