import { Header } from "@/components/header"
import { DataDashboard } from "@/components/data-dashboard"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DataDashboard />
    </div>
  )
}
