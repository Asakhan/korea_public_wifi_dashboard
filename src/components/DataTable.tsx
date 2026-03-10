"use client"

import { useState, useMemo } from "react"
import { Search, MapPin, Database } from "lucide-react"

export interface TableDataRow {
  id: string
  name: string
  province: string
  district: string
  address: string
  provider: string | null
  lat?: number | null
  lng?: number | null
}

interface DataTableProps {
  data: TableDataRow[]
}

export function DataTable({ data }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [provinceFilter, setProvinceFilter] = useState<string>("")
  const [page, setPage] = useState(1)
  const rowsPerPage = 10

  const provinceOptions = useMemo(() => {
    const set = new Set(data.map((r) => r.province).filter(Boolean))
    return Array.from(set).sort()
  }, [data])

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const matchSearch =
        (row.name + row.province + row.district + row.address + (row.provider ?? ""))
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      const matchProvince = !provinceFilter || row.province === provinceFilter
      return matchSearch && matchProvince
    })
  }, [data, searchTerm, provinceFilter])

  const totalPages = Math.ceil(filteredData.length / rowsPerPage)
  const currentData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm flex flex-col">
      <div className="p-6 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <span className="w-1.5 h-6 bg-purple-500 rounded-full mr-3"></span>
          상세 설치 내역
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={provinceFilter}
            onChange={(e) => {
              setProvinceFilter(e.target.value)
              setPage(1)
            }}
            className="bg-black/40 border border-neutral-700 text-neutral-200 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">전체 시/도</option>
            {provinceOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <div className="relative">
            <input
              type="text"
              placeholder="검색어 입력..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(1)
              }}
              className="w-full sm:w-64 bg-black/40 border border-neutral-700 text-neutral-200 text-sm rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-2.5" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-neutral-800/50 text-neutral-400 font-medium">
            <tr>
              <th className="px-6 py-4">설치 위치명</th>
              <th className="px-6 py-4">시/도</th>
              <th className="px-6 py-4">시/군/구</th>
              <th className="px-6 py-4 w-1/3">상세 주소</th>
              <th className="px-6 py-4">좌표</th>
              <th className="px-6 py-4">제공자</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50 text-neutral-300">
            {currentData.length > 0 ? (
              currentData.map((row) => (
                <tr key={row.id} className="hover:bg-neutral-800/30 transition-colors group">
                  <td className="px-6 py-4 font-medium text-blue-100 group-hover:text-blue-400">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-neutral-600" />
                      <span>{row.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-400">{row.province}</td>
                  <td className="px-6 py-4 text-neutral-400">{row.district}</td>
                  <td className="px-6 py-4 text-neutral-400 truncate max-w-[200px] sm:max-w-xs xl:max-w-md">
                    {row.address}
                  </td>
                  <td className="px-6 py-4 text-neutral-500 text-xs font-mono">
                    {row.lat != null && row.lng != null
                      ? `${row.lat.toFixed(4)}, ${row.lng.toFixed(4)}`
                      : "-"}
                  </td>
                  <td className="px-6 py-4">
                    {row.provider ? (
                      <span className="px-2.5 py-1 bg-neutral-800 border border-neutral-700 rounded-full text-xs font-medium text-neutral-300">
                        {row.provider}
                      </span>
                    ) : (
                      <span className="text-neutral-600">-</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <Database className="w-8 h-8 opacity-20 text-blue-500" />
                    <span>데이터가 없습니다.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredData.length > 0 && (
        <div className="p-4 border-t border-neutral-800 flex items-center justify-between text-sm bg-neutral-900/30">
          <span className="text-neutral-500">
            총 <strong className="text-white">{filteredData.length}</strong>건의 결과가 있습니다.
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-300 hover:bg-neutral-700 disabled:opacity-50 disabled:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              이전
            </button>
            <span className="text-neutral-400 px-2 font-mono">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-300 hover:bg-neutral-700 disabled:opacity-50 disabled:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              다음
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
