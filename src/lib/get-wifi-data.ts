import { readFileSync } from "fs"
import { join } from "path"
import { parse } from "csv-parse/sync"
import iconv from "iconv-lite"
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

export type DataSource = "db" | "csv" | "fallback"

export interface DashboardData {
  totalCount: number
  provinceCount: number
  provinceData: { name: string; value: number }[]
  topDistricts: { name: string; count: number }[]
  locations: WifiLocationRow[]
  source: DataSource
}

// 공공와이파이 표준데이터 CSV 컬럼명 (EUC-KR)
const CSV_COLUMNS = {
  id: "관리번호",
  name: "설치장소명",
  address: "소재지도로명주소",
  addressDetail: "설치장소상세",
  province: "설치시도명",
  district: "설치시군구명",
  provider: "서비스제공사명",
  lat: "WGS84위도",
  lng: "WGS84경도",
} as const

function parseCsvToLocations(csvPath: string): WifiLocationRow[] {
  const raw = readFileSync(csvPath)
  const decoded = iconv.decode(raw, "euc-kr")
  const records = parse(decoded, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    trim: true,
    bom: true,
  }) as Record<string, string>[]

  if (records.length === 0) return []

  const first = records[0]
  const headerKeys = Object.keys(first)
  const trimKey = (k: string) => k.replace(/^\uFEFF/, "").trim()
  const keyByCol = (colName: string): string | null => {
    const found = headerKeys.find((k) => trimKey(k) === colName)
    return found ?? null
  }

  const keyId = keyByCol(CSV_COLUMNS.id)
  const keyName = keyByCol(CSV_COLUMNS.name)
  const keyAddress = keyByCol(CSV_COLUMNS.address)
  const keyAddressDetail = keyByCol(CSV_COLUMNS.addressDetail)
  const keyProvince = keyByCol(CSV_COLUMNS.province)
  const keyDistrict = keyByCol(CSV_COLUMNS.district)
  const keyProvider = keyByCol(CSV_COLUMNS.provider)
  const keyLat = keyByCol(CSV_COLUMNS.lat)
  const keyLng = keyByCol(CSV_COLUMNS.lng)

  const get = (row: Record<string, string>, key: string | null) =>
    key && row[key] !== undefined ? String(row[key]).trim() : ""
  const toNum = (v: string): number | null => {
    if (v == null || v === "") return null
    const n = Number(v)
    return Number.isFinite(n) ? n : null
  }

  return records.map((row, i) => {
    const address = get(row, keyAddress) || get(row, keyAddressDetail) || ""
    const lat = toNum(get(row, keyLat))
    const lng = toNum(get(row, keyLng))
    return {
      id: get(row, keyId) || `csv-${i + 1}`,
      name: get(row, keyName) || "(이름 없음)",
      province: get(row, keyProvince) || "",
      district: get(row, keyDistrict) || "",
      address,
      lat: lat ?? null,
      lng: lng ?? null,
      provider: get(row, keyProvider) || null,
    }
  })
}

function loadWifiFromCsv(): WifiLocationRow[] | null {
  try {
    const csvPath = join(process.cwd(), "data", "freewifi_260313.csv")
    return parseCsvToLocations(csvPath)
  } catch {
    return null
  }
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
  // CSV 우선: freewifi_260313.csv가 있으면 전국 데이터로 표시 (DB 시드보다 CSV 전체 사용)
  const csvLocations = loadWifiFromCsv()
  if (csvLocations && csvLocations.length > 0) {
    const processed = processLocations(csvLocations)
    const maxDisplay = 5000
    const locationsToShow = csvLocations.length > maxDisplay ? csvLocations.slice(0, maxDisplay) : csvLocations
    return { ...processed, locations: locationsToShow, source: "csv" }
  }

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
    if (locations.length > 0) {
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
    }
  } catch {
    // DB 연결 실패 시 fallback으로 진행
  }

  return getFallbackData()
}
