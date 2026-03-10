import SidebarLayout from "@/components/SidebarLayout"
import { BookOpen, MapPin, Database, Award, CheckCircle } from "lucide-react"

export default function AboutPage() {
  return (
    <SidebarLayout>
      <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl max-w-7xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">서비스 소개</h1>
          <p className="text-neutral-400">
            한국 공공데이터를 활용한 &ldquo;전국 공공 와이파이 설치 현황 대시보드&rdquo; 프로젝트입니다.
          </p>
        </div>

        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm prose prose-invert max-w-none">
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
              <Award className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1 !mt-0">프로젝트 개요</h2>
              <p className="text-neutral-400">대학원 과제 제출용으로 제작된 대시보드 애플리케이션입니다.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
            <div className="bg-neutral-800/30 rounded-xl p-6 border border-neutral-700/50">
              <div className="flex items-center space-x-3 text-emerald-400 mb-4">
                <Database className="w-6 h-6" />
                <h3 className="text-lg font-semibold text-white !my-0">사용 데이터</h3>
              </div>
              <ul className="space-y-3 text-neutral-300">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 shrink-0 mt-0.5" />
                  <span>공공데이터포털(data.go.kr) 전국 공공와이파이 표준데이터</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 shrink-0 mt-0.5" />
                  <span>시도/시군구별 설치 통계 및 공간 정보(위경도) 활용</span>
                </li>
              </ul>
            </div>

            <div className="bg-neutral-800/30 rounded-xl p-6 border border-neutral-700/50">
              <div className="flex items-center space-x-3 text-purple-400 mb-4">
                <BookOpen className="w-6 h-6" />
                <h3 className="text-lg font-semibold text-white !my-0">주요 기능</h3>
              </div>
              <ul className="space-y-3 text-neutral-300">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-purple-500 mr-2 shrink-0 mt-0.5" />
                  <span>NextAuth를 활용한 Google OAuth 및 Allowlist 접근 제어</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-purple-500 mr-2 shrink-0 mt-0.5" />
                  <span>Prisma + Vercel Postgres/Supabase 연동</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-purple-500 mr-2 shrink-0 mt-0.5" />
                  <span>Recharts, React-Leaflet 기반의 인터랙티브 시각화</span>
                </li>
              </ul>
            </div>
          </div>

          <hr className="border-neutral-800 my-8" />

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-400 flex items-center mb-4">
              <MapPin className="w-5 h-5 mr-2" />
              과제 제출 안내
            </h3>
            <p className="text-neutral-300 mb-4">
              본 서비스는 허용된 사용자(Allowed Users)만 접근 가능하도록 설정되어 있습니다. 
              최초 seed 데이터를 통해 아래 계정은 기본적으로 접근 권한이 부여됩니다.
            </p>
            <div className="bg-black/50 p-4 rounded-lg border border-neutral-800 font-mono text-sm text-green-400 inline-block">
              kts123@kookmin.ac.kr
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}
