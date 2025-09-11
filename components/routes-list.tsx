"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Clock, Route, Bus } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface BusRoute {
  id: string
  routeNumber: string
  name: string
  from: string
  to: string
  distance: string
  duration: string
  frequency: string
  fare: string
  stops: string[]
  activeBuses: number
  status: "active" | "limited" | "suspended"
}

export function RoutesList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null)
  const { t } = useLanguage()

  const routes: BusRoute[] = [
    {
      id: "1",
      routeNumber: "Route 1",
      name: "Golden Temple Circuit",
      from: "Golden Temple",
      to: "Railway Station",
      distance: "8.5 km",
      duration: "25 min",
      frequency: "10 min",
      fare: "₹15",
      stops: ["Golden Temple", "Hall Gate", "Company Bagh", "Mall Road", "Railway Station"],
      activeBuses: 6,
      status: "active",
    },
    {
      id: "2",
      routeNumber: "Route 2",
      name: "University Express",
      from: "Bus Stand",
      to: "Guru Nanak Dev University",
      distance: "12.3 km",
      duration: "35 min",
      frequency: "15 min",
      fare: "₹20",
      stops: ["Bus Stand", "Lawrence Road", "Ranjit Avenue", "Majitha Road", "GNDU"],
      activeBuses: 4,
      status: "active",
    },
    {
      id: "3",
      routeNumber: "Route 3",
      name: "Mall Road Connector",
      from: "Ranjit Avenue",
      to: "Mall Road",
      distance: "6.2 km",
      duration: "18 min",
      frequency: "12 min",
      fare: "₹12",
      stops: ["Ranjit Avenue", "Lawrence Road", "Company Bagh", "Mall Road"],
      activeBuses: 3,
      status: "active",
    },
    {
      id: "4",
      routeNumber: "Route 4",
      name: "Chheharta Line",
      from: "Chheharta",
      to: "City Center",
      distance: "15.7 km",
      duration: "45 min",
      frequency: "20 min",
      fare: "₹25",
      stops: ["Chheharta", "Verka", "Putlighar", "Hall Gate", "City Center"],
      activeBuses: 2,
      status: "limited",
    },
    {
      id: "5",
      routeNumber: "Route 5",
      name: "Airport Shuttle",
      from: "Railway Station",
      to: "Airport",
      distance: "11.8 km",
      duration: "30 min",
      frequency: "30 min",
      fare: "₹30",
      stops: ["Railway Station", "GT Road", "Bypass", "Airport"],
      activeBuses: 0,
      status: "suspended",
    },
  ]

  const filteredRoutes = routes.filter(
    (route) =>
      route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.routeNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "limited":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Limited Service</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Suspended</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">{t("routes.title")}</h1>
          <p className="text-muted-foreground text-pretty">Browse all available bus routes in Amritsar</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("routes.search")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Routes List */}
        <div className="space-y-4">
          {filteredRoutes.map((route) => (
            <Card
              key={route.id}
              className={`cursor-pointer transition-all ${
                selectedRoute?.id === route.id ? "border-primary shadow-md" : "hover:shadow-sm"
              }`}
              onClick={() => setSelectedRoute(route)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{route.routeNumber}</CardTitle>
                  {getStatusBadge(route.status)}
                </div>
                <p className="text-sm font-medium text-pretty">{route.name}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{route.from}</span>
                  <span className="text-muted-foreground">→</span>
                  <span>{route.to}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Route className="h-4 w-4 text-blue-500" />
                    <span>{route.distance}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span>{route.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bus className="h-4 w-4 text-orange-500" />
                    <span>{route.activeBuses} buses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">{route.fare}</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">Frequency: Every {route.frequency}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Route Details */}
        <div className="lg:sticky lg:top-6">
          {selectedRoute ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedRoute.routeNumber}</CardTitle>
                  {getStatusBadge(selectedRoute.status)}
                </div>
                <p className="text-muted-foreground">{selectedRoute.name}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Distance:</span>
                    <p className="font-medium">{selectedRoute.distance}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <p className="font-medium">{selectedRoute.duration}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Frequency:</span>
                    <p className="font-medium">Every {selectedRoute.frequency}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fare:</span>
                    <p className="font-medium text-primary">{selectedRoute.fare}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Bus Stops</h4>
                  <div className="space-y-2">
                    {selectedRoute.stops.map((stop, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            index === 0 || index === selectedRoute.stops.length - 1
                              ? "bg-primary"
                              : "bg-muted-foreground"
                          }`}
                        />
                        <span className="text-sm">{stop}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span>Active Buses:</span>
                    <span className="font-medium">{selectedRoute.activeBuses}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <Route className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a route to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
