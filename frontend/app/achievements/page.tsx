"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Search, Filter, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import AppLayout from "@/components/app-layout"

// Mock achievements data
const mockAchievements = [
  {
    id: 1,
    title: "Google Developer Expert",
    type: "Professional Recognition",
    year: "2022",
    description:
      "Recognized as a Google Developer Expert in Machine Learning for contributions to the field and community engagement.",
    user: {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      graduationYear: "2018",
      branch: "Computer Science",
    },
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 2,
    title: "Best Paper Award",
    type: "Academic",
    year: "2020",
    description:
      "Received best paper award at the International Conference on Machine Learning for the research on 'Efficient Transformer Models'.",
    user: {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      graduationYear: "2018",
      branch: "Computer Science",
    },
    image: null,
  },
  {
    id: 3,
    title: "Product of the Year",
    type: "Industry Award",
    year: "2021",
    description:
      "Led the team that won Product of the Year at the Product Management Awards for innovative marketplace solution.",
    user: {
      id: 2,
      name: "David Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      graduationYear: "2015",
      branch: "Business Administration",
    },
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 4,
    title: "Patent Filed",
    type: "Innovation",
    year: "2022",
    description:
      "Filed a patent for a novel circuit design technique that improves energy efficiency in mobile devices.",
    user: {
      id: 3,
      name: "Priya Sharma",
      avatar: "/placeholder.svg?height=40&width=40",
      graduationYear: "2020",
      branch: "Electrical Engineering",
    },
    image: null,
  },
  {
    id: 5,
    title: "Forbes 30 Under 30",
    type: "Recognition",
    year: "2021",
    description: "Named in Forbes 30 Under 30 list in the Technology category for contributions to cloud computing.",
    user: {
      id: 4,
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      graduationYear: "2019",
      branch: "Computer Science",
    },
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 6,
    title: "Research Grant",
    type: "Academic",
    year: "2023",
    description:
      "Received a $500,000 research grant from the National Science Foundation for work on sustainable energy solutions.",
    user: {
      id: 6,
      name: "Raj Patel",
      avatar: "/placeholder.svg?height=40&width=40",
      graduationYear: "2021",
      branch: "Mechanical Engineering",
    },
    image: "/placeholder.svg?height=200&width=400",
  },
]

// Achievement types for filter
const achievementTypes = [
  "All Types",
  "Academic",
  "Professional Recognition",
  "Industry Award",
  "Innovation",
  "Recognition",
]

// Years for filter
const years = ["All Years", "2023", "2022", "2021", "2020", "2019", "2018"]

export default function AchievementsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [achievements, setAchievements] = useState(mockAchievements)
  const [filteredAchievements, setFilteredAchievements] = useState(mockAchievements)

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("All Types")
  const [selectedYear, setSelectedYear] = useState("All Years")

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("nexus-user")
    if (!userData) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(userData))
    setIsLoading(false)
  }, [router])

  // Apply filters
  useEffect(() => {
    let results = [...achievements]

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        (achievement) =>
          achievement.title.toLowerCase().includes(query) ||
          achievement.description.toLowerCase().includes(query) ||
          achievement.user.name.toLowerCase().includes(query),
      )
    }

    // Apply type filter
    if (selectedType !== "All Types") {
      results = results.filter((achievement) => achievement.type === selectedType)
    }

    // Apply year filter
    if (selectedYear !== "All Years") {
      results = results.filter((achievement) => achievement.year === selectedYear)
    }

    setFilteredAchievements(results)
  }, [searchQuery, selectedType, selectedYear, achievements])

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedType("All Types")
    setSelectedYear("All Years")
  }

  // Navigate to profile page
  const viewProfile = (id: number) => {
    router.push(`/profile/${id}`)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <AppLayout>
      <div className="container py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Alumni Achievements</h1>
          <p className="text-muted-foreground">Discover and celebrate the accomplishments of our alumni community</p>
        </div>

        <div className="grid gap-6 md:grid-cols-[250px_1fr]">
          <div className="space-y-6">
            <div className="rounded-lg border p-4">
              <h2 className="font-medium mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Achievement Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {achievementTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Year</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" className="w-full" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search achievements..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="rounded-md bg-muted px-4 py-3">
              <p className="text-sm">
                Found <strong>{filteredAchievements.length}</strong> achievements
                {(searchQuery || selectedType !== "All Types" || selectedYear !== "All Years") &&
                  " matching your filters"}
              </p>
            </div>

            {filteredAchievements.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <h3 className="font-medium">No achievements found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search or filters to find what you're looking for
                </p>
                <Button variant="outline" className="mt-4" onClick={resetFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {filteredAchievements.map((achievement) => (
                  <Card key={achievement.id} className="overflow-hidden">
                    {achievement.image && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={achievement.image || "/placeholder.svg"}
                          alt={achievement.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className={`p-6 ${!achievement.image ? "pt-6" : "pt-4"}`}>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="bg-primary/10">
                          {achievement.type}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{achievement.year}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold mb-2">{achievement.title}</h3>
                      <p className="text-muted-foreground mb-4">{achievement.description}</p>

                      <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => viewProfile(achievement.user.id)}
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={achievement.user.avatar || "/placeholder.svg"}
                            alt={achievement.user.name}
                          />
                          <AvatarFallback>{achievement.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <span className="font-medium">{achievement.user.name}</span>
                          <span className="text-muted-foreground">
                            {" "}
                            • {achievement.user.branch}, {achievement.user.graduationYear}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <Button variant="outline" className="w-full" onClick={() => viewProfile(achievement.user.id)}>
                        View Profile
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
