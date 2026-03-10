"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts"

export interface ChartData {
  provinceData: { name: string; value: number }[]
  topDistricts: { name: string; count: number }[]
}

const COLORS = [
  "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#6366f1",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#0ea5e9"
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-neutral-900 border border-neutral-700 p-3 rounded-xl shadow-xl">
        <p className="text-white font-medium mb-1">{label || payload[0].name}</p>
        <p className="text-blue-400">
          설치 수: <span className="font-bold">{new Intl.NumberFormat("ko-kr").format(payload[0].value)}</span>
        </p>
      </div>
    )
  }
  return null
}

export function DashboardCharts({ data }: { data: ChartData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Bar Chart - 시도별 설치 수 */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
          <span className="w-1.5 h-6 bg-blue-500 rounded-full mr-3"></span>
          시/도별 설치 수
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.provinceData}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => (value.length > 6 ? value.replace("특별시", "").replace("광역시", "").replace("특별자치도", "") : value)}
              />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                {data.provinceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donut Chart */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
          <span className="w-1.5 h-6 bg-emerald-500 rounded-full mr-3"></span>
          시/도별 설치 비율
        </h3>
        <div className="flex-1 min-h-[320px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.provinceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.provinceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: "12px", color: "#ccc" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
