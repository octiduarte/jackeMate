"use client"

import { useEffect, useRef } from "react"

interface Report {
  id: number
  title: string
  description: string
  category: string
  priority: string
  status: string
  location: string
  coordinates: [number, number]
  author: string
  createdAt: string
  image?: string
}

interface MapContainerProps {
  reports: Report[]
}

export function MapContainer({ reports }: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgente":
        return "#ef4444"
      case "Media":
        return "#f59e0b"
      case "Baja":
        return "#10b981"
      default:
        return "#6b7280"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resuelto":
        return "#10b981"
      case "En Progreso":
        return "#3b82f6"
      case "Reportado":
        return "#f59e0b"
      default:
        return "#6b7280"
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current && !mapInstanceRef.current) {
      // Dynamically import Leaflet
      import("leaflet").then((L) => {
        // Initialize map
        const map = L.map(mapRef.current!).setView([-27.3676, -55.8961], 13)

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map)

        mapInstanceRef.current = map

        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        })
      })
    }
  }, [])

  useEffect(() => {
    if (mapInstanceRef.current && typeof window !== "undefined") {
      import("leaflet").then((L) => {
        // Clear existing markers
        markersRef.current.forEach((marker) => {
          mapInstanceRef.current.removeLayer(marker)
        })
        markersRef.current = []

        // Add new markers
        reports.forEach((report) => {
          const customIcon = L.divIcon({
            className: "custom-marker",
            html: `
              <div style="
                background-color: ${getPriorityColor(report.priority)};
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <div style="
                  width: 8px;
                  height: 8px;
                  background-color: white;
                  border-radius: 50%;
                "></div>
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          })

          const marker = L.marker([report.coordinates[0], report.coordinates[1]], {
            icon: customIcon,
          }).addTo(mapInstanceRef.current)

          // Create popup content
          const popupContent = `
            <div style="min-width: 250px; font-family: system-ui, -apple-system, sans-serif;">
              <div style="margin-bottom: 8px;">
                <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
                  <a href="/reportes/${report.id}" style="color: #059669; text-decoration: none;">
                    ${report.title}
                  </a>
                </h3>
                <p style="margin: 0; font-size: 12px; color: #6b7280; display: flex; align-items: center; gap: 4px;">
                  <span>📍</span> ${report.location}
                </p>
              </div>
              
              ${
                report.image
                  ? `<div style="margin-bottom: 8px;">
                       <img src="${report.image}" alt="${report.title}" 
                            style="width: 100%; height: 120px; object-fit: cover; border-radius: 6px;" />
                     </div>`
                  : ""
              }
              
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #374151; line-height: 1.4;">
                ${report.description.length > 100 ? report.description.substring(0, 100) + "..." : report.description}
              </p>
              
              <div style="display: flex; gap: 6px; margin-bottom: 8px; flex-wrap: wrap;">
                <span style="
                  background-color: ${getStatusColor(report.status)}20;
                  color: ${getStatusColor(report.status)};
                  padding: 2px 8px;
                  border-radius: 12px;
                  font-size: 11px;
                  font-weight: 500;
                  border: 1px solid ${getStatusColor(report.status)}40;
                ">${report.status}</span>
                <span style="
                  background-color: #f3f4f6;
                  color: #374151;
                  padding: 2px 8px;
                  border-radius: 12px;
                  font-size: 11px;
                  font-weight: 500;
                  border: 1px solid #d1d5db;
                ">${report.category}</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #6b7280;">
                <span>👤 ${report.author}</span>
                <span>📅 ${new Date(report.createdAt).toLocaleDateString("es-AR")}</span>
              </div>
            </div>
          `

          marker.bindPopup(popupContent, {
            maxWidth: 300,
            className: "custom-popup",
          })

          markersRef.current.push(marker)
        })

        // Fit map to show all markers if there are any
        if (reports.length > 0) {
          const group = new L.featureGroup(markersRef.current)
          mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1))
        }
      })
    }
  }, [reports])

  return (
    <>
      <div ref={mapRef} className="w-full h-full" />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm border rounded-lg p-4 shadow-lg z-[1000]">
        <h4 className="font-semibold text-sm mb-3">Leyenda</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Urgente</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span>Media</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span>Baja</span>
          </div>
        </div>
      </div>

      {/* Map Controls Info */}
      <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg z-[1000]">
        <p className="text-xs text-muted-foreground">Haz clic en los marcadores para ver detalles</p>
      </div>

      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />
    </>
  )
}
