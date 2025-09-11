"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useLanguage } from "@/components/language-provider"
import { useEffect, useState } from "react"

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="flex items-center gap-2">
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  const themes = [
    { value: "light", label: t("settings.light"), icon: Sun },
    { value: "dark", label: t("settings.dark"), icon: Moon },
    { value: "system", label: t("settings.system"), icon: Monitor },
  ]

  const currentTheme = themes.find((t) => t.value === theme) || themes.find((t) => t.value === resolvedTheme)
  const CurrentIcon = currentTheme?.icon || Sun

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    // Force a small delay to ensure theme is applied
    setTimeout(() => {
      document.documentElement.classList.toggle(
        "dark",
        newTheme === "dark" || (newTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches),
      )
    }, 50)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <CurrentIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{currentTheme?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon
          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => handleThemeChange(themeOption.value)}
              className={`flex items-center gap-2 ${theme === themeOption.value ? "bg-accent" : ""}`}
            >
              <Icon className="h-4 w-4" />
              <span>{themeOption.label}</span>
              {theme === themeOption.value && <span className="ml-auto text-xs text-muted-foreground">✓</span>}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
