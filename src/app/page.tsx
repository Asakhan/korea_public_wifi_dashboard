import SidebarLayout from "@/components/SidebarLayout"
import { KPICard } from "@/components/KPICard"
import { DashboardCharts } from "@/components/DashboardCharts"
import MapView from "@/components/MapView"
import { DataTable } from "@/components/DataTable"
import { Database, MapPin, Wifi, Activity } from "lucide-react"
import { getDashboardData } from "@/lib/get-wifi-data"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <SidebarLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">공공 와이파이 대시보드</h1>
            <p className="text-neutral-400">
              전국 공공 와이파이 설치 현황 및 지역별 분석 데이터를 제공합니다.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-neutral-500 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{data.source === "db" ? "데이터베이스 동기화 완료" : "샘플 데이터 표시"}</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="총 설치 개수"
            value={data.totalCount}
            icon={<Wifi className="w-6 h-6 text-blue-400" />}
            description="전국 등록된 공공 와이파이"
          />
          <KPICard
            title="시/도 개수"
            value={data.provinceCount}
            icon={<MapPin className="w-6 h-6 text-purple-400" />}
            description="데이터 보유 광역 자치단체"
          />
          <KPICard
            title="최다 설치 시/도"
            value={data.provinceData.length > 0 ? data.provinceData[0].name : "-"}
            icon={<Activity className="w-6 h-6 text-emerald-400" />}
            description={
              data.provinceData.length > 0
                ? `${new Intl.NumberFormat("ko-kr").format(data.provinceData[0].value)}개 설치됨`
                : "데이터 없음"
            }
          />
          <KPICard
            title="최근 업데이트"
            value="Today"
            icon={<Database className="w-6 h-6 text-orange-400" />}
            description="공공데이터 반영 기준"
          />
        </div>

        {/* Charts */}
        <DashboardCharts
          data={{
            provinceData: data.provinceData,
            topDistricts: data.topDistricts,
          }}
        />

        {/* Map */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
            <span className="w-1.5 h-6 bg-pink-500 rounded-full mr-3"></span>
            전국 설치 지도
          </h3>
          <div className="h-[400px] w-full rounded-xl overflow-hidden border border-neutral-800">
            <MapView locations={data.locations} />
          </div>
        </div>

        {/* Data Table */}
        <DataTable data={data.locations} />
      </div>
    </SidebarLayout>
  )
}
