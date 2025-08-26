"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, List, Layers } from "lucide-react"
import Link from "next/link"
import { MapContainer } from "@/components/map-container"

// Mock data for reports with coordinates
const mockReports = [
  {
    id: 1,
    title: "Bache en Av. Quaranta",
    description: "Bache de gran tamaño que dificulta el tránsito vehicular",
    category: "Vialidad",
    priority: "Urgente",
    status: "En Progreso",
    location: "Centro, Posadas",
    coordinates: [-27.3676, -55.8961], // Posadas center
    author: "María González",
    createdAt: "2024-01-15",
    image: "/bache-en-calle-de-posadas.png",
  },
  {
    id: 2,
    title: "Semáforo Descompuesto",
    description: "El semáforo de la intersección no funciona desde ayer",
    category: "Tránsito",
    priority: "Media",
    status: "Reportado",
    location: "Villa Cabello, Posadas",
    coordinates: [-27.3856, -55.8745],
    author: "Carlos Ruiz",
    createdAt: "2024-01-14",
    image: "/semaforo-roto-en-interseccion.png",
  },
  {
    id: 3,
    title: "Alumbrado Público Defectuoso",
    description: "Varias farolas sin funcionar en la cuadra",
    category: "Alumbrado",
    priority: "Baja",
    status: "Resuelto",
    location: "San Roque, Posadas",
    coordinates: [-27.3456, -55.9123],
    author: "Ana Martínez",
    createdAt: "2024-01-12",
    image: "/farola-de-luz-publica-apagada-de-noche.png",
  },
  {
    id: 4,
    title: "Basura Acumulada",
    description: "Acumulación de residuos en la esquina",
    category: "Limpieza",
    priority: "Media",
    status: "Reportado",
    location: "Villa Sarita, Posadas",
    coordinates: [-27.3789, -55.8834],
    author: "Pedro López",
    createdAt: "2024-01-13",
  },
  {
    id: 5,
    title: "Árbol Caído",
    description: "Árbol caído obstruye la vereda",
    category: "Espacios Verdes",
    priority: "Urgente",
    status: "En Progreso",
    location: "Centro, Posadas",
    coordinates: [-27.3612, -55.8978],
    author: "Laura Fernández",
    createdAt: "2024-01-16",
  },
]

export default function MapaPage() {
  const [filteredReports, setFilteredReports] = useState(mockReports)
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
    priority: "all",
  })
  const [showSidebar, setShowSidebar] = useState(true)

  useEffect(() => {
    let filtered = mockReports

    if (filters.category !== "all") {
      filtered = filtered.filter((report) => report.category.toLowerCase() === filters.category)
    }
    if (filters.status !== "all") {
      filtered = filtered.filter((report) => report.status.toLowerCase().replace(" ", "-") === filters.status)
    }
    if (filters.priority !== "all") {
      filtered = filtered.filter((report) => report.priority.toLowerCase() === filters.priority)
    }

    setFilteredReports(filtered)
  }, [filters])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgente":
        return "#ef4444" // red
      case "Media":
        return "#f59e0b" // amber
      case "Baja":
        return "#10b981" // emerald
      default:
        return "#6b7280" // gray
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resuelto":
        return "#10b981" // emerald
      case "En Progreso":
        return "#3b82f6" // blue
      case "Reportado":
        return "#f59e0b" // amber
      default:
        return "#6b7280" // gray
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Posadas Reporta</h1>
                  <p className="text-sm text-muted-foreground">Mapa de Reportes</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setShowSidebar(!showSidebar)}>
                <Layers className="w-4 h-4 mr-2" />
                {showSidebar ? "Ocultar" : "Mostrar"} Filtros
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/reportes">
                  <List className="w-4 h-4 mr-2" />
                  Vista Lista
                </Link>
              </Button>
              <Button variant="outline" size="sm">
                Iniciar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-80 border-r bg-card/50 backdrop-blur-sm overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filtros y Reportes</h2>
                <Badge variant="outline">{filteredReports.length} reportes</Badge>
              </div>

              {/* Filters */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Categoría</label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      <SelectItem value="vialidad">Vialidad</SelectItem>
                      <SelectItem value="tránsito">Tránsito</SelectItem>
                      <SelectItem value="alumbrado">Alumbrado</SelectItem>
                      <SelectItem value="limpieza">Limpieza</SelectItem>
                      <SelectItem value="espacios verdes">Espacios Verdes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Estado</label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="reportado">Reportado</SelectItem>
                      <SelectItem value="en-progreso">En Progreso</SelectItem>
                      <SelectItem value="resuelto">Resuelto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Prioridad</label>
                  <Select
                    value={filters.priority}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las prioridades</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="baja">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({ category: "all", status: "all", priority: "all" })}
                  className="w-full"
                >
                  Limpiar Filtros
                </Button>
              </div>

              {/* Reports List */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Reportes en el Mapa</h3>
                {filteredReports.map((report) => (
                  <Card key={report.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                          style={{ backgroundColor: getPriorityColor(report.priority) }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">
                            <Link href={`/reportes/${report.id}`} className="hover:text-primary">
                              {report.title}
                            </Link>
                          </h4>
                          <p className="text-xs text-muted-foreground mb-2">{report.location}</p>
                          <div className="flex gap-1">
                            <Badge
                              variant="outline"
                              className="text-xs"
                              style={{ color: getStatusColor(report.status) }}
                            >
                              {report.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {report.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer reports={filteredReports} />
        </div>
      </div>
    </div>
  )
}
