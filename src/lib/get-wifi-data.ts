import { prisma } from "./prisma"
import sampleData from "../../data/public-wifi-sample.json"

export interface WifiLocationRow {
  id: string
  name: string
  province: string
  district: string
  address: string
  lat: number | null
  lng: number | null
  provider: string | null
}

export interface DashboardData {
  totalCount: number
  provinceCount: number
  provinceData: { name: string; value: number }[]
  topDistricts: { name: string; count: number }[]
  locations: WifiLocationRow[]
  source: "db" | "fallback"
}

function processLocations(locations: WifiLocationRow[]): Omit<DashboardData, "locations" | "source"> {
  const provinceCounts: Record<string, number> = {}
  const districtCounts: Record<string, number> = {}

  locations.forEach((loc) => {
    provinceCounts[loc.province] = (provinceCounts[loc.province] || 0) + 1
    const districtKey = `${loc.province} ${loc.district}`
    districtCounts[districtKey] = (districtCounts[districtKey] || 0) + 1
  })

  const provinceData = Object.entries(provinceCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)

  const topDistricts = Object.entries(districtCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return {
    totalCount: locations.length,
    provinceCount: Object.keys(provinceCounts).length,
    provinceData,
    topDistricts,
  }
}

function getFallbackData(): DashboardData {
  const locations = (sampleData as WifiLocationRow[]).map((item) => ({
    ...item,
    lat: item.lat ?? null,
    lng: item.lng ?? null,
  }))
  const processed = processLocations(locations)
  return { ...processed, locations, source: "fallback" }
}

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const locations = await prisma.wifiLocation.findMany({
      select: {
        id: true,
        name: true,
        province: true,
        district: true,
        address: true,
        provider: true,
        lat: true,
        lng: true,
      },
      take: 1000,
    })

    if (locations.length === 0) {
      return getFallbackData()
    }

    const rows: WifiLocationRow[] = locations.map((loc) => ({
      id: loc.id,
      name: loc.name,
      province: loc.province,
      district: loc.district,
      address: loc.address,
      lat: loc.lat,
      lng: loc.lng,
      provider: loc.provider,
    }))

    const processed = processLocations(rows)
    return { ...processed, locations: rows, source: "db" }
  } catch {
    return getFallbackData()
  }
}
