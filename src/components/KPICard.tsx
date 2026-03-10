import { ReactNode } from "react"

interface KPICardProps {
  title: string
  value: string | number
  icon: ReactNode
  description?: string
  trend?: {
    value: string
    positive: boolean
  }
}

export function KPICard({ title, value, icon, description, trend }: KPICardProps) {
  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 backdrop-blur-xl hover:bg-neutral-900 transition-all duration-300 shadow-xl group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-neutral-800/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        {trend && (
          <div
            className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
              trend.positive
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            <span>{trend.positive ? "↑" : "↓"}</span>
            <span>{trend.value}</span>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-neutral-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold tracking-tight text-white mb-1">
          {typeof value === "number" ? new Intl.NumberFormat("ko-KR").format(value) : value}
        </p>
        {description && (
          <p className="text-xs text-neutral-500">{description}</p>
        )}
      </div>
    </div>
  )
}
