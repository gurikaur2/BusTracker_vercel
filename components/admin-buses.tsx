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
import { Plus, Edit, Trash2, Bus, MapPin, Wrench, Search, AlertTriangle, CheckCircle } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface BusData {
  id: string
  busNumber: string
  registrationNumber: string
  model: string
  capacity: number
  assignedRoute?: string
  driverName?: string
  driverPhone?: string
  status: "active" | "maintenance" | "breakdown" | "offline"
  lastMaintenance: string
  nextMaintenance: string
  mileage: number
  fuelLevel: number
  location?: {
    lat: number
    lng: number
    lastUpdated: string
  }
  notes?: string
}

export function AdminBuses() {
  const [buses, setBuses] = useState<BusData[]>([
    {
      id: "1",
      busNumber: "AMR-101",
      registrationNumber: "PB-02-AB-1234",
      model: "Tata Starbus",
      capacity: 45,
      assignedRoute: "Route 1",
      driverName: "Rajesh Kumar",
      driverPhone: "+91-98765-43210",
      status: "active",
      lastMaintenance: "2024-01-15",
      nextMaintenance: "2024-04-15",
      mileage: 45000,
      fuelLevel: 75,
      location: {
        lat: 31.634,
        lng: 74.8723,
        lastUpdated: "2024-01-20T10:30:00Z",
      },
      notes: "Regular service, good condition",
    },
    {
      id: "2",
      busNumber: "AMR-205",
      registrationNumber: "PB-02-CD-5678",
      model: "Ashok Leyland Viking",
      capacity: 40,
      assignedRoute: "Route 2",
      driverName: "Sukhdev Singh",
      driverPhone: "+91-98765-43211",
      status: "maintenance",
      lastMaintenance: "2024-01-10",
      nextMaintenance: "2024-04-10",
      mileage: 52000,
      fuelLevel: 30,
      notes: "Scheduled maintenance in progress",
    },
    {
      id: "3",
      busNumber: "AMR-312",
      registrationNumber: "PB-02-EF-9012",
      model: "Tata Starbus",
      capacity: 45,
      assignedRoute: "Route 3",
      driverName: "Harpreet Kaur",
      driverPhone: "+91-98765-43212",
      status: "breakdown",
      lastMaintenance: "2023-12-20",
      nextMaintenance: "2024-03-20",
      mileage: 48000,
      fuelLevel: 10,
      notes: "Engine issue reported, needs immediate attention",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingBus, setEditingBus] = useState<BusData | null>(null)
  const [formData, setFormData] = useState<Partial<BusData>>({})
  const { t } = useLanguage()

  const filteredBuses = buses.filter((bus) => {
    const matchesSearch =
      bus.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.driverName?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || bus.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const resetForm = () => {
    setFormData({
      busNumber: "",
      registrationNumber: "",
      model: "",
      capacity: 40,
      assignedRoute: "",
      driverName: "",
      driverPhone: "",
      status: "offline",
      lastMaintenance: "",
      nextMaintenance: "",
      mileage: 0,
      fuelLevel: 100,
      notes: "",
    })
  }

  const handleAdd = () => {
    setIsAddDialogOpen(true)
    resetForm()
  }

  const handleEdit = (bus: BusData) => {
    setEditingBus(bus)
    setFormData({ ...bus })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (busId: string) => {
    if (confirm("Are you sure you want to delete this bus?")) {
      setBuses(buses.filter((bus) => bus.id !== busId))
    }
  }

  const handleSave = () => {
    if (!formData.busNumber || !formData.registrationNumber || !formData.model) {
      alert("Please fill in all required fields")
      return
    }

    const newBus: BusData = {
      id: editingBus?.id || Date.now().toString(),
      busNumber: formData.busNumber!,
      registrationNumber: formData.registrationNumber!,
      model: formData.model!,
      capacity: formData.capacity || 40,
      assignedRoute: formData.assignedRoute,
      driverName: formData.driverName,
      driverPhone: formData.driverPhone,
      status: (formData.status as any) || "offline",
      lastMaintenance: formData.lastMaintenance || "",
      nextMaintenance: formData.nextMaintenance || "",
      mileage: formData.mileage || 0,
      fuelLevel: formData.fuelLevel || 100,
      notes: formData.notes || "",
      location: editingBus?.location,
    }

    if (editingBus) {
      setBuses(buses.map((bus) => (bus.id === editingBus.id ? newBus : bus)))
      setIsEditDialogOpen(false)
    } else {
      setBuses([...buses, newBus])
      setIsAddDialogOpen(false)
    }

    resetForm()
    setEditingBus(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        )
      case "maintenance":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Wrench className="h-3 w-3 mr-1" />
            Maintenance
          </Badge>
        )
      case "breakdown":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Breakdown
          </Badge>
        )
      case "offline":
        return <Badge variant="secondary">Offline</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getFuelLevelColor = (level: number) => {
    if (level > 50) return "text-green-600"
    if (level > 25) return "text-yellow-600"
    return "text-red-600"
  }

  const BusForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="busNumber">Bus Number *</Label>
          <Input
            id="busNumber"
            value={formData.busNumber || ""}
            onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
            placeholder="AMR-101"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="registrationNumber">Registration Number *</Label>
          <Input
            id="registrationNumber"
            value={formData.registrationNumber || ""}
            onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
            placeholder="PB-02-AB-1234"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="model">Bus Model *</Label>
          <Input
            id="model"
            value={formData.model || ""}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            placeholder="Tata Starbus"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            type="number"
            value={formData.capacity || ""}
            onChange={(e) => setFormData({ ...formData, capacity: Number.parseInt(e.target.value) })}
            placeholder="45"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="assignedRoute">Assigned Route</Label>
          <Select
            value={formData.assignedRoute || "No Route"}
            onValueChange={(value) => setFormData({ ...formData, assignedRoute: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select route" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="No Route">No Route</SelectItem>
              <SelectItem value="Route 1">Route 1 - Golden Temple Circuit</SelectItem>
              <SelectItem value="Route 2">Route 2 - University Express</SelectItem>
              <SelectItem value="Route 3">Route 3 - Mall Road Connector</SelectItem>
              <SelectItem value="Route 4">Route 4 - Chheharta Line</SelectItem>
              <SelectItem value="Route 5">Route 5 - Airport Shuttle</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status || "offline"}
            onValueChange={(value) => setFormData({ ...formData, status: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="breakdown">Breakdown</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="driverName">Driver Name</Label>
          <Input
            id="driverName"
            value={formData.driverName || ""}
            onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
            placeholder="Rajesh Kumar"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="driverPhone">Driver Phone</Label>
          <Input
            id="driverPhone"
            value={formData.driverPhone || ""}
            onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
            placeholder="+91-98765-43210"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage (km)</Label>
          <Input
            id="mileage"
            type="number"
            value={formData.mileage || ""}
            onChange={(e) => setFormData({ ...formData, mileage: Number.parseInt(e.target.value) })}
            placeholder="45000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fuelLevel">Fuel Level (%)</Label>
          <Input
            id="fuelLevel"
            type="number"
            min="0"
            max="100"
            value={formData.fuelLevel || ""}
            onChange={(e) => setFormData({ ...formData, fuelLevel: Number.parseInt(e.target.value) })}
            placeholder="75"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastMaintenance">Last Maintenance</Label>
          <Input
            id="lastMaintenance"
            type="date"
            value={formData.lastMaintenance || ""}
            onChange={(e) => setFormData({ ...formData, lastMaintenance: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nextMaintenance">Next Maintenance</Label>
          <Input
            id="nextMaintenance"
            type="date"
            value={formData.nextMaintenance || ""}
            onChange={(e) => setFormData({ ...formData, nextMaintenance: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes || ""}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes about the bus..."
          rows={3}
        />
      </div>
    </div>
  )

  const stats = {
    total: buses.length,
    active: buses.filter((b) => b.status === "active").length,
    maintenance: buses.filter((b) => b.status === "maintenance").length,
    breakdown: buses.filter((b) => b.status === "breakdown").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">{t("admin.manage_buses")}</h1>
          <p className="text-muted-foreground text-pretty">Manage bus fleet, assignments, and maintenance</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t("admin.add_bus")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Bus</DialogTitle>
              <DialogDescription>
                Register a new bus in the fleet with driver and maintenance information.
              </DialogDescription>
            </DialogHeader>
            <BusForm />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button onClick={handleSave}>{t("common.save")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Buses</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Bus className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Maintenance</p>
                <p className="text-2xl font-bold text-blue-600">{stats.maintenance}</p>
              </div>
              <Wrench className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Breakdown</p>
                <p className="text-2xl font-bold text-red-600">{stats.breakdown}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search buses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="breakdown">Breakdown</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Buses List */}
      <div className="grid gap-4">
        {filteredBuses.map((bus) => (
          <Card key={bus.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{bus.busNumber}</CardTitle>
                  {getStatusBadge(bus.status)}
                  {bus.assignedRoute && <Badge variant="outline">{bus.assignedRoute}</Badge>}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(bus)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    {t("admin.edit")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(bus.id)}
                    className="flex items-center gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                    {t("admin.delete")}
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{bus.registrationNumber}</span>
                <span>•</span>
                <span>{bus.model}</span>
                <span>•</span>
                <span>{bus.capacity} seats</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {bus.driverName && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Driver:</span>
                  <span>{bus.driverName}</span>
                  {bus.driverPhone && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{bus.driverPhone}</span>
                    </>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Mileage:</span>
                  <p className="font-medium">{bus.mileage.toLocaleString()} km</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Fuel Level:</span>
                  <p className={`font-medium ${getFuelLevelColor(bus.fuelLevel)}`}>{bus.fuelLevel}%</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Maintenance:</span>
                  <p className="font-medium">{bus.lastMaintenance || "N/A"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Next Maintenance:</span>
                  <p className="font-medium">{bus.nextMaintenance || "N/A"}</p>
                </div>
              </div>

              {bus.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Last seen: {new Date(bus.location.lastUpdated).toLocaleString()}</span>
                </div>
              )}

              {bus.notes && <p className="text-sm text-muted-foreground text-pretty">{bus.notes}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Bus</DialogTitle>
            <DialogDescription>Update bus information, driver assignment, and maintenance details.</DialogDescription>
          </DialogHeader>
          <BusForm />
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
