"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { GraduationCap, Home, Search, Trophy, MessageSquare, LogOut, Menu } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet"
import { useMobile } from "@/src/hooks/use-mobile"

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useMobile()

  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(userData))
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  const navItems = [
    {
      name: "Home",
      href: "/home",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Search Alumni",
      href: "/search",
      icon: <Search className="h-5 w-5" />,
    },
    {
      name: "Achievements",
      href: "/achievements",
      icon: <Trophy className="h-5 w-5" />,
    },
    {
      name: "Messages",
      href: "/chat",
      icon: <MessageSquare className="h-5 w-5" />,
    },
  ]

  if (isLoading) {
    return <div className="min-h-screen" />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                  <div className="flex flex-col h-full">
                    <div className="py-4">
                      <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <GraduationCap className="h-6 w-6" />
                        <span>Nexus</span>
                      </Link>
                    </div>
                    <nav className="flex-1 space-y-2">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                            pathname === item.href ? "bg-muted" : "hover:bg-muted"
                          }`}
                        >
                          {item.icon}
                          {item.name}
                        </Link>
                      ))}
                    </nav>
                    <div className="border-t py-4">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 text-sm font-medium"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-5 w-5" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <GraduationCap className="h-6 w-6" />
              <span>Nexus</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href={`/profile/${user?.id || "me"}`}>
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user?.profileImage || "/placeholder.svg?height=32&width=32"}
                  alt={user?.name || user?.fullName}
                />
                <AvatarFallback>{(user?.name || user?.fullName || "User").charAt(0)}</AvatarFallback>
              </Avatar>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="hidden md:flex">
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
