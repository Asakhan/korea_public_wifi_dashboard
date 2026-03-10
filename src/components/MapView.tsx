"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

export interface MapLocation {
  id: string
  name: string
  address: string
  lat: number | null
  lng: number | null
  provider: string | null
}

const MapLoading = () => (
  <div className="h-full w-full flex items-center justify-center bg-neutral-900 border border-neutral-800 rounded-xl min-h-[400px]">
    <div className="flex flex-col items-center space-y-3">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      <span className="text-neutral-400 font-medium tracking-wide">지도를 불러오는 중...</span>
    </div>
  </div>
)

const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: MapLoading,
})

export default MapComponent
