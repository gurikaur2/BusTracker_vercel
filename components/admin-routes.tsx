"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Route, MapPin, Clock, DollarSign, Search } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface RouteData {
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
  status: "active" | "limited" | "suspended"
  description?: string
}

export function AdminRoutes() {
  const [routes, setRoutes] = useState<RouteData[]>([
    {
      id: "1",
      routeNumber: "Route 1",
      name: "Golden Temple Circuit",
      from: "Golden Temple",
      to: "Railway Station",
      distance: "8.5",
      duration: "25",
      frequency: "10",
      fare: "15",
      stops: ["Golden Temple", "Hall Gate", "Company Bagh", "Mall Road", "Railway Station"],
      status: "active",
      description: "Main tourist route connecting Golden Temple to Railway Station",
    },
    {
      id: "2",
      routeNumber: "Route 2",
      name: "University Express",
      from: "Bus Stand",
      to: "Guru Nanak Dev University",
      distance: "12.3",
      duration: "35",
      frequency: "15",
      fare: "20",
      stops: ["Bus Stand", "Lawrence Road", "Ranjit Avenue", "Majitha Road", "GNDU"],
      status: "active",
      description: "Express service to university campus",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingRoute, setEditingRoute] = useState<RouteData | null>(null)
  const [formData, setFormData] = useState<Partial<RouteData>>({})
  const { t } = useLanguage()

  const filteredRoutes = routes.filter(
    (route) =>
      route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.routeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.to.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const resetForm = () => {
    setFormData({
      routeNumber: "",
      name: "",
      from: "",
      to: "",
      distance: "",
      duration: "",
      frequency: "",
      fare: "",
      stops: [],
      status: "active",
      description: "",
    })
  }

  const handleAdd = () => {
    setIsAddDialogOpen(true)
    resetForm()
  }

  const handleEdit = (route: RouteData) => {
    setEditingRoute(route)
    setFormData({ ...route })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (routeId: string) => {
    if (confirm("Are you sure you want to delete this route?")) {
      setRoutes(routes.filter((route) => route.id !== routeId))
    }
  }

  const handleSave = () => {
    if (!formData.routeNumber || !formData.name || !formData.from || !formData.to) {
      alert("Please fill in all required fields")
      return
    }

    const newRoute: RouteData = {
      id: editingRoute?.id || Date.now().toString(),
      routeNumber: formData.routeNumber!,
      name: formData.name!,
      from: formData.from!,
      to: formData.to!,
      distance: formData.distance || "0",
      duration: formData.duration || "0",
      frequency: formData.frequency || "15",
      fare: formData.fare || "10",
      stops: formData.stops || [],
      status: (formData.status as "active" | "limited" | "suspended") || "active",
      description: formData.description || "",
    }

    if (editingRoute) {
      setRoutes(routes.map((route) => (route.id === editingRoute.id ? newRoute : route)))
      setIsEditDialogOpen(false)
    } else {
      setRoutes([...routes, newRoute])
      setIsAddDialogOpen(false)
    }

    resetForm()
    setEditingRoute(null)
  }

  const handleStopsChange = (stopsText: string) => {
    const stops = stopsText.split("\n").filter((stop) => stop.trim() !== "")
    setFormData({ ...formData, stops })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "limited":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Limited</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Suspended</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const RouteForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="routeNumber">Route Number *</Label>
          <Input
            id="routeNumber"
            value={formData.routeNumber || ""}
            onChange={(e) => setFormData({ ...formData, routeNumber: e.target.value })}
            placeholder="Route 1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status || "active"}
            onValueChange={(value) => setFormData({ ...formData, status: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="limited">Limited Service</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Route Name *</Label>
        <Input
          id="name"
          value={formData.name || ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Golden Temple Circuit"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="from">From *</Label>
          <Input
            id="from"
            value={formData.from || ""}
            onChange={(e) => setFormData({ ...formData, from: e.target.value })}
            placeholder="Golden Temple"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="to">To *</Label>
          <Input
            id="to"
            value={formData.to || ""}
            onChange={(e) => setFormData({ ...formData, to: e.target.value })}
            placeholder="Railway Station"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="distance">Distance (km)</Label>
          <Input
            id="distance"
            type="number"
            value={formData.distance || ""}
            onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
            placeholder="8.5"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (min)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration || ""}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="25"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="frequency">Frequency (min)</Label>
          <Input
            id="frequency"
            type="number"
            value={formData.frequency || ""}
            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
            placeholder="10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fare">Fare (₹)</Label>
          <Input
            id="fare"
            type="number"
            value={formData.fare || ""}
            onChange={(e) => setFormData({ ...formData, fare: e.target.value })}
            placeholder="15"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Route description..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stops">Bus Stops (one per line)</Label>
        <Textarea
          id="stops"
          value={formData.stops?.join("\n") || ""}
          onChange={(e) => handleStopsChange(e.target.value)}
          placeholder="Golden Temple&#10;Hall Gate&#10;Company Bagh&#10;Mall Road&#10;Railway Station"
          rows={5}
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">{t("admin.manage_routes")}</h1>
          <p className="text-muted-foreground text-pretty">Add, edit, and manage bus routes</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t("admin.add_route")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Route</DialogTitle>
              <DialogDescription>Create a new bus route with stops and schedule information.</DialogDescription>
            </DialogHeader>
            <RouteForm />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button onClick={handleSave}>{t("common.save")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search routes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4">
        {filteredRoutes.map((route) => (
          <Card key={route.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{route.routeNumber}</CardTitle>
                  {getStatusBadge(route.status)}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(route)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    {t("admin.edit")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(route.id)}
                    className="flex items-center gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                    {t("admin.delete")}
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground text-pretty">{route.name}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{route.from}</span>
                <span className="text-muted-foreground">→</span>
                <span>{route.to}</span>
              </div>

              {route.description && <p className="text-sm text-muted-foreground text-pretty">{route.description}</p>}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Route className="h-4 w-4 text-blue-500" />
                  <span>{route.distance} km</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span>{route.duration} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span>Every {route.frequency} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span>₹{route.fare}</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-sm">Bus Stops ({route.stops.length})</h4>
                <div className="flex flex-wrap gap-1">
                  {route.stops.map((stop, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {stop}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Route</DialogTitle>
            <DialogDescription>Update route information and schedule details.</DialogDescription>
          </DialogHeader>
          <RouteForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleSave}>{t("common.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
