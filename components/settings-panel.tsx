"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Languages,
  Monitor,
  Moon,
  Sun,
  Bell,
  MapPin,
  Route,
  Bus,
  Shield,
  User,
  Smartphone,
  Wifi,
  Volume2,
} from "lucide-react"
import { useLanguage, type Language } from "@/components/language-provider"
import { useTheme } from "next-themes"
import { useAuth } from "@/components/auth-provider"

export function SettingsPanel() {
  const { language, setLanguage, t } = useLanguage()
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()
  const { toast } = useToast()

  // Local settings state
  const [notifications, setNotifications] = useState({
    busDelays: true,
    routeUpdates: true,
    maintenanceAlerts: false,
    generalAnnouncements: true,
  })

  const [preferences, setPreferences] = useState({
    autoRefresh: true,
    soundEnabled: true,
    lowBandwidthMode: false,
    showAllRoutes: true,
  })

  const languages: { code: Language; name: string; nativeName: string }[] = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
    { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  ]

  const themes = [
    { value: "light", label: t("settings.light"), icon: Sun },
    { value: "dark", label: t("settings.dark"), icon: Moon },
    { value: "system", label: t("settings.system"), icon: Monitor },
  ]

  const handleSaveSettings = () => {
    // In a real app, this would save to backend/localStorage
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    })
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-balance">{t("settings.title")}</h1>
        <p className="text-muted-foreground text-pretty">Customize your bus tracking experience</p>
      </div>

      <div className="grid gap-6">
        {/* User Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {user?.role === "admin" ? <Shield className="h-5 w-5" /> : <User className="h-5 w-5" />}
              User Profile
            </CardTitle>
            <CardDescription>Your account information and role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Name</Label>
                <p className="text-sm text-muted-foreground">{user?.name}</p>
              </div>
              <Badge variant={user?.role === "admin" ? "default" : "secondary"} className="flex items-center gap-1">
                {user?.role === "admin" ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                {user?.role === "admin" ? t("login.admin") : t("login.user")}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium">Email</Label>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Language & Theme */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              {t("settings.language")} & {t("settings.theme")}
            </CardTitle>
            <CardDescription>Customize the appearance and language of the application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="language">{t("settings.language")}</Label>
              <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center gap-2">
                        <span>{lang.nativeName}</span>
                        <span className="text-xs text-muted-foreground">({lang.name})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme">{t("settings.theme")}</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((themeOption) => {
                    const Icon = themeOption.icon
                    return (
                      <SelectItem key={themeOption.value} value={themeOption.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{themeOption.label}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              {t("settings.notifications")}
            </CardTitle>
            <CardDescription>Choose what notifications you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Bus Delays</Label>
                <p className="text-sm text-muted-foreground">Get notified when buses are running late</p>
              </div>
              <Switch
                checked={notifications.busDelays}
                onCheckedChange={(checked) => setNotifications({ ...notifications, busDelays: checked })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Route Updates</Label>
                <p className="text-sm text-muted-foreground">Receive updates about route changes</p>
              </div>
              <Switch
                checked={notifications.routeUpdates}
                onCheckedChange={(checked) => setNotifications({ ...notifications, routeUpdates: checked })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Alerts</Label>
                <p className="text-sm text-muted-foreground">Get alerts about bus maintenance schedules</p>
              </div>
              <Switch
                checked={notifications.maintenanceAlerts}
                onCheckedChange={(checked) => setNotifications({ ...notifications, maintenanceAlerts: checked })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>General Announcements</Label>
                <p className="text-sm text-muted-foreground">Receive general service announcements</p>
              </div>
              <Switch
                checked={notifications.generalAnnouncements}
                onCheckedChange={(checked) => setNotifications({ ...notifications, generalAnnouncements: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              App Preferences
            </CardTitle>
            <CardDescription>Customize how the app behaves and performs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Auto Refresh
                </Label>
                <p className="text-sm text-muted-foreground">Automatically refresh bus locations every 30 seconds</p>
              </div>
              <Switch
                checked={preferences.autoRefresh}
                onCheckedChange={(checked) => setPreferences({ ...preferences, autoRefresh: checked })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  Sound Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Play sounds for important notifications</p>
              </div>
              <Switch
                checked={preferences.soundEnabled}
                onCheckedChange={(checked) => setPreferences({ ...preferences, soundEnabled: checked })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Wifi className="h-4 w-4" />
                  Low Bandwidth Mode
                </Label>
                <p className="text-sm text-muted-foreground">Reduce data usage for slower connections</p>
              </div>
              <Switch
                checked={preferences.lowBandwidthMode}
                onCheckedChange={(checked) => setPreferences({ ...preferences, lowBandwidthMode: checked })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Route className="h-4 w-4" />
                  Show All Routes
                </Label>
                <p className="text-sm text-muted-foreground">Display all routes including inactive ones</p>
              </div>
              <Switch
                checked={preferences.showAllRoutes}
                onCheckedChange={(checked) => setPreferences({ ...preferences, showAllRoutes: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Admin Settings */}
        {user?.role === "admin" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Admin Settings
              </CardTitle>
              <CardDescription>Administrative preferences and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Route className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Route Management</p>
                    <p className="text-sm text-muted-foreground">Full access to route configuration</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Bus className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Bus Management</p>
                    <p className="text-sm text-muted-foreground">Manage bus fleet and assignments</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Settings */}
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} className="flex items-center gap-2">
            {t("common.save")} Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
