"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bus, MapPin, Route, Settings, LogOut, Menu, Shield, User } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { LiveMap } from "@/components/live-map"
import { RoutesList } from "@/components/routes-list"
import { SettingsPanel } from "@/components/settings-panel"
import { AdminRoutes } from "@/components/admin-routes"
import { AdminBuses } from "@/components/admin-buses"
import { RouteSelector } from "@/components/route-selector"

type ActiveTab = "home" | "routes" | "route-planner" | "settings" | "admin-routes" | "admin-buses"

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const { t } = useLanguage()

  const stats = {
    liveBuses: 42,
    totalRoutes: 15,
    activeBuses: 38,
  }

  const navigationItems = [
    { id: "home" as ActiveTab, label: t("nav.home"), icon: MapPin },
    { id: "routes" as ActiveTab, label: t("nav.routes"), icon: Route },
    { id: "route-planner" as ActiveTab, label: "Route Planner", icon: Route }, // Added route planner tab
    ...(user?.role === "admin"
      ? [
          { id: "admin-routes" as ActiveTab, label: t("nav.manage_routes"), icon: Route },
          { id: "admin-buses" as ActiveTab, label: t("nav.manage_buses"), icon: Bus },
        ]
      : []),
    { id: "settings" as ActiveTab, label: t("nav.settings"), icon: Settings },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-balance">{t("home.title")}</h1>
                <p className="text-muted-foreground text-pretty">{t("home.subtitle")}</p>
              </div>
              <Badge variant={user?.role === "admin" ? "default" : "secondary"} className="flex items-center gap-1">
                {user?.role === "admin" ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                {user?.role === "admin" ? t("login.admin") : t("login.user")}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("home.live_buses")}</CardTitle>
                  <Bus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.liveBuses}</div>
                  <p className="text-xs text-muted-foreground">Currently on routes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("home.total_routes")}</CardTitle>
                  <Route className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalRoutes}</div>
                  <p className="text-xs text-muted-foreground">Active routes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("home.active_buses")}</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeBuses}</div>
                  <p className="text-xs text-muted-foreground">In service</p>
                </CardContent>
              </Card>
            </div>

            <LiveMap />
          </div>
        )
      case "routes":
        return <RoutesList />
      case "route-planner": // Added route planner case
        return <RouteSelector />
      case "admin-routes":
        return user?.role === "admin" ? <AdminRoutes /> : null
      case "admin-buses":
        return user?.role === "admin" ? <AdminBuses /> : null
      case "settings":
        return <SettingsPanel />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bus className="h-6 w-6 text-primary" />
            <span className="font-semibold">Bus Tracker</span>
          </div>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            ×
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab(item.id)
                  setSidebarOpen(false)
                }}
              >
                <Icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            )
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <div className="flex justify-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
          <Button variant="outline" className="w-full justify-start bg-transparent" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            {t("nav.logout")}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b p-4 lg:hidden">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
