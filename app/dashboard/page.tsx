import { Header } from "@/components/header"
import { RealDataDashboard } from "@/components/real-data-dashboard"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <RealDataDashboard />
    </div>
  )
}
