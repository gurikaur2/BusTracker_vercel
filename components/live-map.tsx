"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Bus, MapPin, Navigation, Search, Zap, Clock } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useTheme } from "next-themes"
import dynamic from "next/dynamic"

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

interface BusLocation {
  id: string
  busNumber: string
  route: string
  lat: number
  lng: number
  speed: number
  nextStop: string
  eta: string
  status: "active" | "delayed" | "breakdown"
}

export function LiveMap() {
  const [buses, setBuses] = useState<BusLocation[]>([])
  const [selectedBus, setSelectedBus] = useState<BusLocation | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isClient, setIsClient] = useState(false)
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const { t } = useLanguage()
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setIsClient(true)

    if (typeof window !== "undefined") {
      // Load Leaflet CSS
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)

      // Load Leaflet JS
      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.onload = () => {
        // Fix default marker icons
        const L = (window as any).L
        if (L) {
          delete (L.Icon.Default.prototype as any)._getIconUrl
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
            iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
          })
          setLeafletLoaded(true)
        }
      }
      document.head.appendChild(script)
    }
  }, [])

  useEffect(() => {
    const mockBuses: BusLocation[] = [
      {
        id: "1",
        busNumber: "AMR-101",
        route: "Golden Temple - Railway Station",
        lat: 31.634, // Near Golden Temple
        lng: 74.8723,
        speed: 25,
        nextStop: "Hall Gate",
        eta: "3 min",
        status: "active",
      },
      {
        id: "2",
        busNumber: "AMR-205",
        route: "Bus Stand - Guru Nanak Dev University",
        lat: 31.6167, // Near Bus Stand
        lng: 74.8723,
        speed: 0,
        nextStop: "Company Bagh",
        eta: "5 min",
        status: "delayed",
      },
      {
        id: "3",
        busNumber: "AMR-312",
        route: "Ranjit Avenue - Mall Road",
        lat: 31.65, // Ranjit Avenue area
        lng: 74.86,
        speed: 30,
        nextStop: "Lawrence Road",
        eta: "2 min",
        status: "active",
      },
      {
        id: "4",
        busNumber: "AMR-408",
        route: "Chheharta - City Center",
        lat: 31.62, // Chheharta area
        lng: 74.88,
        speed: 0,
        nextStop: "Putlighar",
        eta: "Delayed",
        status: "breakdown",
      },
      {
        id: "5",
        busNumber: "AMR-515",
        route: "Majitha Road - Court Complex",
        lat: 31.628, // Court area
        lng: 74.875,
        speed: 22,
        nextStop: "District Courts",
        eta: "4 min",
        status: "active",
      },
      {
        id: "6",
        busNumber: "AMR-622",
        route: "Batala Road - Sultanwind Gate",
        lat: 31.645, // Sultanwind area
        lng: 74.865,
        speed: 18,
        nextStop: "Sultanwind Gate",
        eta: "6 min",
        status: "active",
      },
    ]

    setBuses(mockBuses)

    const interval = setInterval(() => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) => ({
          ...bus,
          lat: bus.lat + (Math.random() - 0.5) * 0.001,
          lng: bus.lng + (Math.random() - 0.5) * 0.001,
          speed: bus.status === "active" ? Math.floor(Math.random() * 40) + 10 : 0,
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const filteredBuses = buses.filter(
    (bus) =>
      bus.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.route.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "delayed":
        return "bg-yellow-500"
      case "breakdown":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "delayed":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Delayed</Badge>
      case "breakdown":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Breakdown</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const createBusIcon = (status: string) => {
    if (typeof window === "undefined" || !leafletLoaded) return null

    const L = (window as any).L
    if (!L) return null

    const color = status === "active" ? "#22c55e" : status === "delayed" ? "#eab308" : "#ef4444"

    return L.divIcon({
      html: `
        <div style="
          width: 24px; 
          height: 24px; 
          background-color: ${color}; 
          border: 3px solid white; 
          border-radius: 50%; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
            <path d="M3 6h18v12H3V6zm2 2v8h14V8H5zm2 2h2v4H7v-4zm8 0h2v4h-2v-4z"/>
          </svg>
        </div>
      `,
      className: "custom-bus-icon",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Map Area */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Live Bus Tracking - Amritsar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative rounded-lg h-96 overflow-hidden border-2 border-border">
              {isClient && leafletLoaded ? (
                <MapContainer
                  center={[31.634, 74.8723]} // Golden Temple coordinates
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                  className="z-0"
                >
                  <TileLayer
                    url={
                      resolvedTheme === "dark"
                        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    }
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />

                  {filteredBuses.map((bus) => {
                    const icon = createBusIcon(bus.status)
                    return icon ? (
                      <Marker
                        key={bus.id}
                        position={[bus.lat, bus.lng]}
                        icon={icon}
                        eventHandlers={{
                          click: () => setSelectedBus(bus),
                        }}
                      >
                        <Popup>
                          <div className="p-2">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold flex items-center gap-2">
                                <Bus className="h-4 w-4" />
                                {bus.busNumber}
                              </h4>
                              {getStatusBadge(bus.status)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{bus.route}</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center gap-1">
                                <Navigation className="h-3 w-3 text-blue-500" />
                                <span>{bus.speed} km/h</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-green-500" />
                                <span>ETA: {bus.eta}</span>
                              </div>
                              <div className="col-span-2 flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-orange-500" />
                                <span>Next: {bus.nextStop}</span>
                              </div>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ) : null
                  })}
                </MapContainer>
              ) : (
                <div className="flex items-center justify-center h-full bg-muted">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading map...</p>
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                <div className="bg-background/90 backdrop-blur-sm border rounded-lg p-2">
                  <div className="text-xs font-medium mb-1">Legend</div>
                  <div className="flex items-center gap-1 text-xs">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Active</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span>Delayed</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span>Breakdown</span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded z-10">
                Live Tracking • Amritsar Bus Service • Real Map
              </div>
            </div>

            {selectedBus && (
              <div className="mt-4 p-4 bg-muted rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Bus className="h-4 w-4" />
                    {selectedBus.busNumber}
                  </h4>
                  {getStatusBadge(selectedBus.status)}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{selectedBus.route}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-blue-500" />
                    <span>{selectedBus.speed} km/h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span>ETA: {selectedBus.eta}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    <span>Next: {selectedBus.nextStop}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bus List */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Buses</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search buses or routes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {filteredBuses.map((bus) => (
              <div
                key={bus.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedBus?.id === bus.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedBus(bus)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{bus.busNumber}</span>
                  {getStatusBadge(bus.status)}
                </div>
                <p className="text-sm text-muted-foreground mb-2 text-pretty">{bus.route}</p>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    <span>{bus.speed} km/h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{bus.eta}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Active Buses</span>
              <span className="font-medium text-green-600">{buses.filter((b) => b.status === "active").length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Delayed</span>
              <span className="font-medium text-yellow-600">{buses.filter((b) => b.status === "delayed").length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Out of Service</span>
              <span className="font-medium text-red-600">{buses.filter((b) => b.status === "breakdown").length}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-medium">Total</span>
              <span className="font-bold">{buses.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
