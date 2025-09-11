"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MapPin, Clock, Route, Bus, RefreshCw } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface RouteOption {
  id: string
  routeNumber: string
  name: string
  from: string
  to: string
  distance: string
  duration: string
  fare: number
  stops: string[]
  activeBuses: number
}

interface FareCalculation {
  route: RouteOption
  baseFare: number
  totalFare: number
  distance: string
  estimatedTime: string
}

interface TransferRoute {
  firstRoute: RouteOption
  secondRoute: RouteOption
  transferStop: string
  totalFare: number
  totalTime: string
  totalDistance: string
}

export function RouteSelector() {
  const [selectedFrom, setSelectedFrom] = useState<string>("")
  const [selectedTo, setSelectedTo] = useState<string>("")
  const [fareCalculation, setFareCalculation] = useState<FareCalculation | null>(null)
  const [transferRoutes, setTransferRoutes] = useState<TransferRoute[]>([])
  const { t } = useLanguage()

  // Available locations (bus stops)
  const locations = [
    "Golden Temple",
    "Railway Station",
    "Bus Stand",
    "Guru Nanak Dev University",
    "Ranjit Avenue",
    "Mall Road",
    "Company Bagh",
    "Hall Gate",
    "Lawrence Road",
    "Chheharta",
    "City Center",
    "Majitha Road",
    "Putlighar",
    "Airport",
  ]

  // Available routes with fare information
  const routes: RouteOption[] = [
    {
      id: "1",
      routeNumber: "Route 1",
      name: "Golden Temple Circuit",
      from: "Golden Temple",
      to: "Railway Station",
      distance: "8.5 km",
      duration: "25 min",
      fare: 15,
      stops: ["Golden Temple", "Hall Gate", "Company Bagh", "Mall Road", "Railway Station"],
      activeBuses: 6,
    },
    {
      id: "2",
      routeNumber: "Route 2",
      name: "University Express",
      from: "Bus Stand",
      to: "Guru Nanak Dev University",
      distance: "12.3 km",
      duration: "35 min",
      fare: 20,
      stops: ["Bus Stand", "Lawrence Road", "Ranjit Avenue", "Majitha Road", "Guru Nanak Dev University"],
      activeBuses: 4,
    },
    {
      id: "3",
      routeNumber: "Route 3",
      name: "Mall Road Connector",
      from: "Ranjit Avenue",
      to: "Mall Road",
      distance: "6.2 km",
      duration: "18 min",
      fare: 12,
      stops: ["Ranjit Avenue", "Lawrence Road", "Company Bagh", "Mall Road"],
      activeBuses: 3,
    },
    {
      id: "4",
      routeNumber: "Route 4",
      name: "Chheharta Line",
      from: "Chheharta",
      to: "City Center",
      distance: "15.7 km",
      duration: "45 min",
      fare: 25,
      stops: ["Chheharta", "Putlighar", "Hall Gate", "City Center"],
      activeBuses: 2,
    },
    {
      id: "5",
      routeNumber: "Route 5",
      name: "Airport Shuttle",
      from: "Railway Station",
      to: "Airport",
      distance: "11.8 km",
      duration: "30 min",
      fare: 30,
      stops: ["Railway Station", "Mall Road", "Airport"],
      activeBuses: 1,
    },
  ]

  const findTransferRoutes = (from: string, to: string): TransferRoute[] => {
    const transfers: TransferRoute[] = []

    // Find routes that contain the starting location
    const routesFromStart = routes.filter((route) => route.stops.includes(from))

    // Find routes that contain the destination
    const routesToEnd = routes.filter((route) => route.stops.includes(to))

    // Find common stops between these routes (potential transfer points)
    for (const firstRoute of routesFromStart) {
      for (const secondRoute of routesToEnd) {
        if (firstRoute.id === secondRoute.id) continue // Skip same route

        // Find common stops between the two routes
        const commonStops = firstRoute.stops.filter(
          (stop) => secondRoute.stops.includes(stop) && stop !== from && stop !== to,
        )

        for (const transferStop of commonStops) {
          // Calculate fare and time for first leg
          const firstFromIndex = firstRoute.stops.indexOf(from)
          const firstToIndex = firstRoute.stops.indexOf(transferStop)
          const firstStopDistance = Math.abs(firstToIndex - firstFromIndex)
          const firstFare = Math.max(8, Math.round(firstRoute.fare * (firstStopDistance / firstRoute.stops.length)))
          const firstTime = Math.round(
            Number.parseInt(firstRoute.duration) * (firstStopDistance / firstRoute.stops.length),
          )

          // Calculate fare and time for second leg
          const secondFromIndex = secondRoute.stops.indexOf(transferStop)
          const secondToIndex = secondRoute.stops.indexOf(to)
          const secondStopDistance = Math.abs(secondToIndex - secondFromIndex)
          const secondFare = Math.max(8, Math.round(secondRoute.fare * (secondStopDistance / secondRoute.stops.length)))
          const secondTime = Math.round(
            Number.parseInt(secondRoute.duration) * (secondStopDistance / secondRoute.stops.length),
          )

          // Calculate total distance
          const firstDistance = Number.parseFloat(firstRoute.distance) * (firstStopDistance / firstRoute.stops.length)
          const secondDistance =
            Number.parseFloat(secondRoute.distance) * (secondStopDistance / secondRoute.stops.length)

          transfers.push({
            firstRoute,
            secondRoute,
            transferStop,
            totalFare: firstFare + secondFare,
            totalTime: `${firstTime + secondTime + 5} min`, // Add 5 min transfer time
            totalDistance: `${(firstDistance + secondDistance).toFixed(1)} km`,
          })
        }
      }
    }

    // Sort by total fare (cheapest first)
    return transfers.sort((a, b) => a.totalFare - b.totalFare).slice(0, 3) // Return top 3 options
  }

  const findRoute = () => {
    if (!selectedFrom || !selectedTo) return

    // Find direct route
    let matchingRoute = routes.find(
      (route) =>
        (route.from === selectedFrom && route.to === selectedTo) ||
        (route.from === selectedTo && route.to === selectedFrom),
    )

    // If no direct route, find route that contains both stops
    if (!matchingRoute) {
      matchingRoute = routes.find((route) => route.stops.includes(selectedFrom) && route.stops.includes(selectedTo))
    }

    if (matchingRoute) {
      // Calculate fare based on distance between stops
      const fromIndex = matchingRoute.stops.indexOf(selectedFrom)
      const toIndex = matchingRoute.stops.indexOf(selectedTo)
      const stopDistance = Math.abs(toIndex - fromIndex)

      // Base fare calculation (₹3 per stop + base fare)
      const calculatedFare = Math.max(8, Math.round(matchingRoute.fare * (stopDistance / matchingRoute.stops.length)))

      setFareCalculation({
        route: matchingRoute,
        baseFare: matchingRoute.fare,
        totalFare: calculatedFare,
        distance: `${(Number.parseFloat(matchingRoute.distance) * (stopDistance / matchingRoute.stops.length)).toFixed(1)} km`,
        estimatedTime: `${Math.round(Number.parseInt(matchingRoute.duration) * (stopDistance / matchingRoute.stops.length))} min`,
      })
      setTransferRoutes([])
    } else {
      setFareCalculation(null)
      const transfers = findTransferRoutes(selectedFrom, selectedTo)
      setTransferRoutes(transfers)
    }
  }

  const resetSelection = () => {
    setSelectedFrom("")
    setSelectedTo("")
    setFareCalculation(null)
    setTransferRoutes([])
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-balance">Route Planner</h2>
        <p className="text-muted-foreground text-pretty">Find the best route and calculate fare for your journey</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Plan Your Journey
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Route Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">From</label>
              <Select value={selectedFrom} onValueChange={setSelectedFrom}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pickup location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location} disabled={location === selectedTo}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {location}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <Select value={selectedTo} onValueChange={setSelectedTo}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location} disabled={location === selectedFrom}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {location}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={findRoute} disabled={!selectedFrom || !selectedTo} className="flex items-center gap-2">
              <Route className="h-4 w-4" />
              Find Route & Calculate Fare
            </Button>
            <Button variant="outline" onClick={resetSelection}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fare Calculation Results */}
      {fareCalculation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">₹</span>
              Journey Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Route Information */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <h3 className="font-semibold">{fareCalculation.route.routeNumber}</h3>
                <p className="text-sm text-muted-foreground">{fareCalculation.route.name}</p>
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                <Bus className="h-3 w-3 mr-1" />
                {fareCalculation.route.activeBuses} buses active
              </Badge>
            </div>

            {/* Journey Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                  <Route className="h-4 w-4" />
                  Distance
                </div>
                <div className="font-semibold">{fareCalculation.distance}</div>
              </div>

              <div className="text-center p-3 border rounded-lg">
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  Time
                </div>
                <div className="font-semibold">{fareCalculation.estimatedTime}</div>
              </div>

              <div className="text-center p-3 border rounded-lg">
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                  <span className="text-sm">₹</span>
                  Fare
                </div>
                <div className="font-semibold text-primary">₹{fareCalculation.totalFare}</div>
              </div>

              <div className="text-center p-3 border rounded-lg">
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                  <Bus className="h-4 w-4" />
                  Frequency
                </div>
                <div className="font-semibold">Every 10-15 min</div>
              </div>
            </div>

            {/* Route Path */}
            <div>
              <h4 className="font-medium mb-3">Your Journey Path</h4>
              <div className="flex items-center gap-2 flex-wrap">
                {fareCalculation.route.stops.map((stop, index) => {
                  const isSelected = stop === selectedFrom || stop === selectedTo
                  const isInPath = (() => {
                    const fromIndex = fareCalculation.route.stops.indexOf(selectedFrom)
                    const toIndex = fareCalculation.route.stops.indexOf(selectedTo)
                    const minIndex = Math.min(fromIndex, toIndex)
                    const maxIndex = Math.max(fromIndex, toIndex)
                    return index >= minIndex && index <= maxIndex
                  })()

                  return (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className={`px-3 py-1 rounded-full text-sm ${
                          isSelected
                            ? "bg-primary text-primary-foreground font-medium"
                            : isInPath
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {stop}
                      </div>
                      {index < fareCalculation.route.stops.length - 1 && (
                        <ArrowRight className={`h-4 w-4 ${isInPath ? "text-primary" : "text-muted-foreground"}`} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Fare Breakdown */}
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Fare Breakdown</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Base fare ({fareCalculation.route.routeNumber}):</span>
                  <span>₹{fareCalculation.route.fare}</span>
                </div>
                <div className="flex justify-between">
                  <span>Distance adjustment:</span>
                  <span>₹{fareCalculation.totalFare - fareCalculation.route.fare}</span>
                </div>
                <div className="border-t pt-1 flex justify-between font-medium">
                  <span>Total Fare:</span>
                  <span className="text-primary">₹{fareCalculation.totalFare}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {transferRoutes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Transfer Route Options
            </CardTitle>
            <p className="text-sm text-muted-foreground">No direct route found. Here are the best transfer options:</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {transferRoutes.map((transfer, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Option {index + 1}</h4>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {transfer.totalTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-sm">₹</span>₹{transfer.totalFare}
                    </span>
                    <span className="flex items-center gap-1">
                      <Route className="h-4 w-4" />
                      {transfer.totalDistance}
                    </span>
                  </div>
                </div>

                {/* Transfer Journey Visualization */}
                <div className="space-y-3">
                  {/* First Route */}
                  <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="flex items-center gap-2 flex-1">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                        {transfer.firstRoute.routeNumber}
                      </Badge>
                      <span className="text-sm">{selectedFrom}</span>
                      <ArrowRight className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        {transfer.transferStop}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">{transfer.firstRoute.activeBuses} buses</div>
                  </div>

                  {/* Transfer Point */}
                  <div className="flex items-center justify-center">
                    <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-950/20 text-orange-800 dark:text-orange-200 rounded-full text-sm">
                      <RefreshCw className="h-3 w-3" />
                      Transfer at {transfer.transferStop}
                    </div>
                  </div>

                  {/* Second Route */}
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="flex items-center gap-2 flex-1">
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        {transfer.secondRoute.routeNumber}
                      </Badge>
                      <span className="text-sm font-medium text-green-800 dark:text-green-200">
                        {transfer.transferStop}
                      </span>
                      <ArrowRight className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{selectedTo}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{transfer.secondRoute.activeBuses} buses</div>
                  </div>
                </div>

                {/* Route Names */}
                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div>
                    <span className="font-medium">First: </span>
                    {transfer.firstRoute.name}
                  </div>
                  <div>
                    <span className="font-medium">Second: </span>
                    {transfer.secondRoute.name}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* No Route Found */}
      {selectedFrom && selectedTo && fareCalculation === null && transferRoutes.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Route className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">No Routes Available</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Unfortunately, there are no direct or connecting routes between {selectedFrom} and {selectedTo} at this
              time.
            </p>
            <Button variant="outline" onClick={resetSelection}>
              Try Different Locations
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
