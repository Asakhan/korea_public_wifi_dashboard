"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useEffect } from "react"

// Fix for default marker icon in leaflet under React
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

interface MapComponentProps {
  locations: Array<{
    id: string
    name: string
    address: string
    lat: number | null
    lng: number | null
    provider: string | null
  }>
}

export default function MapComponent({ locations }: MapComponentProps) {
  // Center roughly at Korea or the first valid coordinate
  const firstValid = locations.find(l => l.lat != null && l.lng != null)
  const center: [number, number] = firstValid
    ? [firstValid.lat!, firstValid.lng!]
    : [37.5665, 126.978]

  // Filter out invalid coordinates
  const validLocations = locations.filter(l => l.lat != null && l.lng != null) as Array<typeof locations[0] & { lat: number; lng: number }>

  return (
    <div className="h-full w-full relative z-0 rounded-xl overflow-hidden">
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom={false}
        className="h-full w-full z-0"
      >
        {/* Using CartoDB Dark Matter for dark mode friendly map */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {validLocations.map((loc) => (
          <Marker key={loc.id} position={[loc.lat, loc.lng]}>
            <Popup>
              <div className="text-sm font-sans text-neutral-800">
                <strong className="block text-base mb-1">{loc.name}</strong>
                <p className="mb-1 text-xs text-neutral-500">{loc.address}</p>
                {loc.provider && (
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium mt-1">
                    {loc.provider}
                  </span>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
