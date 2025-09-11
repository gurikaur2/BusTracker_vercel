"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type Language = "en" | "hi" | "pa"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.routes": "Routes",
    "nav.settings": "Settings",
    "nav.login": "Login",
    "nav.logout": "Logout",
    "nav.manage_routes": "Manage Routes",
    "nav.manage_buses": "Manage Buses",

    // Login
    "login.title": "Login to Bus Tracker",
    "login.email": "Email",
    "login.password": "Password",
    "login.role": "Login as",
    "login.user": "User",
    "login.admin": "Admin",
    "login.submit": "Login",
    "login.error": "Invalid credentials",

    // Home
    "home.title": "Amritsar Bus Tracker",
    "home.subtitle": "Track government buses in real-time",
    "home.live_buses": "Live Buses",
    "home.total_routes": "Total Routes",
    "home.active_buses": "Active Buses",

    // Routes
    "routes.title": "Bus Routes",
    "routes.search": "Search routes...",
    "routes.from": "From",
    "routes.to": "To",
    "routes.duration": "Duration",
    "routes.frequency": "Frequency",

    // Settings
    "settings.title": "Settings",
    "settings.language": "Language",
    "settings.theme": "Theme",
    "settings.notifications": "Notifications",
    "settings.system": "System",
    "settings.light": "Light",
    "settings.dark": "Dark",

    // Admin
    "admin.manage_routes": "Manage Routes",
    "admin.manage_buses": "Manage Buses",
    "admin.add_route": "Add Route",
    "admin.add_bus": "Add Bus",
    "admin.edit": "Edit",
    "admin.delete": "Delete",

    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.loading": "Loading...",
    "common.error": "Error occurred",
    "common.success": "Success",

    // Language names
    "lang.english": "English",
    "lang.hindi": "हिन्दी",
    "lang.punjabi": "ਪੰਜਾਬੀ",

    // Map and tracking
    "map.live_tracking": "Live Bus Tracking",
    "map.select_bus": "Select a bus to view details",
    "map.bus_details": "Bus Details",
    "map.next_stop": "Next Stop",
    "map.eta": "ETA",
    "map.speed": "Speed",

    // Bus status
    "status.active": "Active",
    "status.delayed": "Delayed",
    "status.breakdown": "Breakdown",
    "status.maintenance": "Maintenance",
    "status.offline": "Offline",
    "status.limited": "Limited Service",
    "status.suspended": "Suspended",

    // Bus management
    "bus.number": "Bus Number",
    "bus.registration": "Registration Number",
    "bus.model": "Bus Model",
    "bus.capacity": "Capacity",
    "bus.driver": "Driver",
    "bus.route": "Assigned Route",
    "bus.mileage": "Mileage",
    "bus.fuel": "Fuel Level",
    "bus.last_maintenance": "Last Maintenance",
    "bus.next_maintenance": "Next Maintenance",
    "bus.notes": "Notes",

    // Route management
    "route.number": "Route Number",
    "route.name": "Route Name",
    "route.distance": "Distance",
    "route.stops": "Bus Stops",
    "route.fare": "Fare",
    "route.description": "Description",

    // Notifications
    "notif.bus_delayed": "Bus delayed",
    "notif.route_updated": "Route updated",
    "notif.maintenance_due": "Maintenance due",
  },
  hi: {
    // Navigation
    "nav.home": "होम",
    "nav.routes": "रूट",
    "nav.settings": "सेटिंग्स",
    "nav.login": "लॉगिन",
    "nav.logout": "लॉगआउट",
    "nav.manage_routes": "रूट प्रबंधन",
    "nav.manage_buses": "बस प्रबंधन",

    // Login
    "login.title": "बस ट्रैकर में लॉगिन करें",
    "login.email": "ईमेल",
    "login.password": "पासवर्ड",
    "login.role": "लॉगिन करें",
    "login.user": "उपयोगकर्ता",
    "login.admin": "एडमिन",
    "login.submit": "लॉगिन",
    "login.error": "गलत जानकारी",

    // Home
    "home.title": "अमृतसर बस ट्रैकर",
    "home.subtitle": "सरकारी बसों को रियल-टाइम में ट्रैक करें",
    "home.live_buses": "लाइव बसें",
    "home.total_routes": "कुल रूट",
    "home.active_buses": "सक्रिय बसें",

    // Routes
    "routes.title": "बस रूट",
    "routes.search": "रूट खोजें...",
    "routes.from": "से",
    "routes.to": "तक",
    "routes.duration": "समय",
    "routes.frequency": "आवृत्ति",

    // Settings
    "settings.title": "सेटिंग्स",
    "settings.language": "भाषा",
    "settings.theme": "थीम",
    "settings.notifications": "सूचनाएं",
    "settings.system": "सिस्टम",
    "settings.light": "लाइट",
    "settings.dark": "डार्क",

    // Admin
    "admin.manage_routes": "रूट प्रबंधन",
    "admin.manage_buses": "बस प्रबंधन",
    "admin.add_route": "रूट जोड़ें",
    "admin.add_bus": "बस जोड़ें",
    "admin.edit": "संपादित करें",
    "admin.delete": "हटाएं",

    // Common
    "common.save": "सेव करें",
    "common.cancel": "रद्द करें",
    "common.loading": "लोड हो रहा है...",
    "common.error": "त्रुटि हुई",
    "common.success": "सफल",

    // Language names
    "lang.english": "English",
    "lang.hindi": "हिन्दी",
    "lang.punjabi": "ਪੰਜਾਬੀ",

    // Map and tracking
    "map.live_tracking": "लाइव बस ट्रैकिंग",
    "map.select_bus": "विवरण देखने के लिए बस चुनें",
    "map.bus_details": "बस विवरण",
    "map.next_stop": "अगला स्टॉप",
    "map.eta": "पहुंचने का समय",
    "map.speed": "गति",

    // Bus status
    "status.active": "सक्रिय",
    "status.delayed": "देरी",
    "status.breakdown": "खराब",
    "status.maintenance": "रखरखाव",
    "status.offline": "ऑफलाइन",
    "status.limited": "सीमित सेवा",
    "status.suspended": "निलंबित",

    // Bus management
    "bus.number": "बस नंबर",
    "bus.registration": "पंजीकरण नंबर",
    "bus.model": "बस मॉडल",
    "bus.capacity": "क्षमता",
    "bus.driver": "ड्राइवर",
    "bus.route": "निर्धारित रूट",
    "bus.mileage": "माइलेज",
    "bus.fuel": "ईंधन स्तर",
    "bus.last_maintenance": "अंतिम रखरखाव",
    "bus.next_maintenance": "अगला रखरखाव",
    "bus.notes": "नोट्स",

    // Route management
    "route.number": "रूट नंबर",
    "route.name": "रूट नाम",
    "route.distance": "दूरी",
    "route.stops": "बस स्टॉप",
    "route.fare": "किराया",
    "route.description": "विवरण",

    // Notifications
    "notif.bus_delayed": "बस में देरी",
    "notif.route_updated": "रूट अपडेट किया गया",
    "notif.maintenance_due": "रखरखाव की आवश्यकता",
  },
  pa: {
    // Navigation
    "nav.home": "ਘਰ",
    "nav.routes": "ਰੂਟ",
    "nav.settings": "ਸੈਟਿੰਗਜ਼",
    "nav.login": "ਲਾਗਇਨ",
    "nav.logout": "ਲਾਗਆਉਟ",
    "nav.manage_routes": "ਰੂਟ ਪ੍ਰਬੰਧਨ",
    "nav.manage_buses": "ਬੱਸ ਪ੍ਰਬੰਧਨ",

    // Login
    "login.title": "ਬੱਸ ਟਰੈਕਰ ਵਿੱਚ ਲਾਗਇਨ ਕਰੋ",
    "login.email": "ਈਮੇਲ",
    "login.password": "ਪਾਸਵਰਡ",
    "login.role": "ਲਾਗਇਨ ਕਰੋ",
    "login.user": "ਯੂਜ਼ਰ",
    "login.admin": "ਐਡਮਿਨ",
    "login.submit": "ਲਾਗਇਨ",
    "login.error": "ਗਲਤ ਜਾਣਕਾਰੀ",

    // Home
    "home.title": "ਅਮ੍ਰਿਤਸਰ ਬੱਸ ਟਰੈਕਰ",
    "home.subtitle": "ਸਰਕਾਰੀ ਬੱਸਾਂ ਨੂੰ ਰੀਅਲ-ਟਾਈਮ ਵਿੱਚ ਟਰੈਕ ਕਰੋ",
    "home.live_buses": "ਲਾਈਵ ਬੱਸਾਂ",
    "home.total_routes": "ਕੁੱਲ ਰੂਟ",
    "home.active_buses": "ਸਰਗਰਮ ਬੱਸਾਂ",

    // Routes
    "routes.title": "ਬੱਸ ਰੂਟ",
    "routes.search": "ਰੂਟ ਖੋਜੋ...",
    "routes.from": "ਤੋਂ",
    "routes.to": "ਤੱਕ",
    "routes.duration": "ਸਮਾਂ",
    "routes.frequency": "ਬਾਰੰਬਾਰਤਾ",

    // Settings
    "settings.title": "ਸੈਟਿੰਗਜ਼",
    "settings.language": "ਭਾਸ਼ਾ",
    "settings.theme": "ਥੀਮ",
    "settings.notifications": "ਸੂਚਨਾਵਾਂ",
    "settings.system": "ਸਿਸਟਮ",
    "settings.light": "ਲਾਈਟ",
    "settings.dark": "ਡਾਰਕ",

    // Admin
    "admin.manage_routes": "ਰੂਟ ਪ੍ਰਬੰਧਨ",
    "admin.manage_buses": "ਬੱਸ ਪ੍ਰਬੰਧਨ",
    "admin.add_route": "ਰੂਟ ਜੋੜੋ",
    "admin.add_bus": "ਬੱਸ ਜੋੜੋ",
    "admin.edit": "ਸੰਪਾਦਿਤ ਕਰੋ",
    "admin.delete": "ਮਿਟਾਓ",

    // Common
    "common.save": "ਸੇਵ ਕਰੋ",
    "common.cancel": "ਰੱਦ ਕਰੋ",
    "common.loading": "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
    "common.error": "ਗਲਤੀ ਹੋਈ",
    "common.success": "ਸਫਲ",

    // Language names
    "lang.english": "English",
    "lang.hindi": "हिन्दी",
    "lang.punjabi": "ਪੰਜਾਬੀ",

    // Map and tracking
    "map.live_tracking": "ਲਾਈਵ ਬੱਸ ਟਰੈਕਿੰਗ",
    "map.select_bus": "ਵੇਰਵੇ ਵੇਖਣ ਲਈ ਬੱਸ ਚੁਣੋ",
    "map.bus_details": "ਬੱਸ ਵੇਰਵੇ",
    "map.next_stop": "ਅਗਲਾ ਸਟਾਪ",
    "map.eta": "ਪਹੁੰਚਣ ਦਾ ਸਮਾਂ",
    "map.speed": "ਗਤੀ",

    // Bus status
    "status.active": "ਸਰਗਰਮ",
    "status.delayed": "ਦੇਰੀ",
    "status.breakdown": "ਖਰਾਬ",
    "status.maintenance": "ਰੱਖ-ਰਖਾਅ",
    "status.offline": "ਆਫਲਾਈਨ",
    "status.limited": "ਸੀਮਤ ਸੇਵਾ",
    "status.suspended": "ਮੁਅੱਤਲ",

    // Bus management
    "bus.number": "ਬੱਸ ਨੰਬਰ",
    "bus.registration": "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਨੰਬਰ",
    "bus.model": "ਬੱਸ ਮਾਡਲ",
    "bus.capacity": "ਸਮਰੱਥਾ",
    "bus.driver": "ਡਰਾਈਵਰ",
    "bus.route": "ਨਿਰਧਾਰਿਤ ਰੂਟ",
    "bus.mileage": "ਮਾਈਲੇਜ",
    "bus.fuel": "ਬਾਲਣ ਦਾ ਪੱਧਰ",
    "bus.last_maintenance": "ਆਖਰੀ ਰੱਖ-ਰਖਾਅ",
    "bus.next_maintenance": "ਅਗਲਾ ਰੱਖ-ਰਖਾਅ",
    "bus.notes": "ਨੋਟਸ",

    // Route management
    "route.number": "ਰੂਟ ਨੰਬਰ",
    "route.name": "ਰੂਟ ਨਾਮ",
    "route.distance": "ਦੂਰੀ",
    "route.stops": "ਬੱਸ ਸਟਾਪ",
    "route.fare": "ਕਿਰਾਇਆ",
    "route.description": "ਵੇਰਵਾ",

    // Notifications
    "notif.bus_delayed": "ਬੱਸ ਵਿੱਚ ਦੇਰੀ",
    "notif.route_updated": "ਰੂਟ ਅਪਡੇਟ ਕੀਤਾ ਗਿਆ",
    "notif.maintenance_due": "ਰੱਖ-ਰਖਾਅ ਦੀ ਲੋੜ",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("bus-tracker-language") as Language
    if (savedLanguage && ["en", "hi", "pa"].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("bus-tracker-language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
