"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Search, Filter, Calendar, Award, ChevronRight, X, Sparkles, LayoutGrid, List } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Card, CardContent, CardFooter } from "@/src/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Badge } from "@/src/components/ui/badge"
import AppLayout from "@/src/components/app-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"

import { getAllAchievements } from "../../api/achievements"

// Achievement types for filter - we'll update this dynamically based on API data
const achievementTypes = ["All Types"]

// Years for filter - we'll update this dynamically based on API data
const years = ["All Years"]

export default function AchievementsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [achievements, setAchievements] = useState([])
  const [filteredAchievements, setFilteredAchievements] = useState([])
  const [availableTypes, setAvailableTypes] = useState(achievementTypes)
  const [availableYears, setAvailableYears] = useState(years)
  const [showFilters, setShowFilters] = useState(false)

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("All Types")
  const [selectedYear, setSelectedYear] = useState("All Years")
  const [activeTab, setActiveTab] = useState("grid")

  // Fetch achievements from API
  useEffect(() => {
    async function fetchAchievements() {
      try {
        const data = await getAllAchievements()
        
        // Transform the API data to match our component's expected structure
        const formattedAchievements = data.map((achievement) => ({
          id: achievement._id,
          title: achievement.title,
          type: achievement.type,
          year: achievement.year,
          description: achievement.description,
          image: achievement.image,
          user: {
            id: achievement.userId, 
            name: achievement.userName,
            avatar: achievement.profileImage || "/placeholder.svg?height=40&width=40", 
            graduationYear: achievement.graduationYear,
            branch: achievement.jobTitle || "N/A", // Using jobTitle as branch info
          }
        }))
        
        setAchievements(formattedAchievements)
        setFilteredAchievements(formattedAchievements)
        
        // Extract unique types and years for filters
        const types = ["All Types", ...new Set(formattedAchievements.map(a => a.type))]
        const yearsList = ["All Years", ...new Set(formattedAchievements.map(a => a.year))]
        
        setAvailableTypes(types)
        setAvailableYears(yearsList.sort((a, b) => {
          if (a === "All Years") return -1
          if (b === "All Years") return 1
          return parseInt(b) - parseInt(a) // Sort years in descending order
        }))
        
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to fetch achievements:", error)
        setIsLoading(false)
      }
    }

    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(userData))
    fetchAchievements()
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
  const viewProfile = (id) => {
    router.push(`/profile/${id}`)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading alumni achievements...</p>
        </div>
      </div>
    )
  }

  return (
    <AppLayout>
      <div className="container py-8">
        <div className="mb-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Alumni Achievements</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto md:mx-0">
            Discover and celebrate the remarkable accomplishments of our alumni community. Get inspired by their journeys and connect with successful graduates.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="rounded-lg border bg-card shadow-sm p-5 sticky top-24">
              <h2 className="font-semibold mb-5 flex items-center gap-2 text-lg">
                <Filter className="h-5 w-5 text-primary" />
                <span>Filters</span>
              </h2>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Achievement Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTypes.map((type) => (
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
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2">
                  <Button variant="outline" className="w-full" onClick={resetFilters}>
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            {/* Search and Mobile Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search achievements, people, skills..."
                  className="pl-9 py-6 border-primary/20 focus-visible:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-2 lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </div>

            {/* Mobile Filters Dropdown */}
            {showFilters && (
              <div className="lg:hidden rounded-lg border bg-card shadow-sm p-5 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold">Filters</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Achievement Type</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTypes.map((type) => (
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
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableYears.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button variant="outline" className="w-full" onClick={resetFilters}>
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}

            {/* Active Filters */}
            {(selectedType !== "All Types" || selectedYear !== "All Years" || searchQuery) && (
              <div className="mb-4 flex flex-wrap gap-2">
                {searchQuery && (
                  <Badge variant="secondary" className="flex items-center gap-1 py-2 px-3">
                    Search: {searchQuery}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {selectedType !== "All Types" && (
                  <Badge variant="secondary" className="flex items-center gap-1 py-2 px-3">
                    Type: {selectedType}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1"
                      onClick={() => setSelectedType("All Types")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {selectedYear !== "All Years" && (
                  <Badge variant="secondary" className="flex items-center gap-1 py-2 px-3">
                    Year: {selectedYear}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1"
                      onClick={() => setSelectedYear("All Years")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            )}

            {/* Results Count and View Toggle */}
            <div className="rounded-md bg-muted px-4 py-3 mb-6 flex justify-between items-center">
              <p className="text-sm">
                Found <strong>{filteredAchievements.length}</strong> achievements
                {(searchQuery || selectedType !== "All Types" || selectedYear !== "All Years") &&
                  " matching your filters"}
              </p>
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant={activeTab === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setActiveTab("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={activeTab === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setActiveTab("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {filteredAchievements.length === 0 ? (
              <div className="rounded-lg border border-dashed p-12 text-center">
                <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-medium mb-2">No achievements found</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                  Try adjusting your search or filters to find what you're looking for. We're constantly updating our alumni achievements database.
                </p>
                <Button onClick={resetFilters} className="bg-primary hover:bg-primary/90">
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <>
                {/* Grid View */}
                {activeTab === "grid" && (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                    {filteredAchievements.map((achievement) => (
                      <Card key={achievement.id} className="overflow-hidden border border-primary/10 transition-all duration-200 hover:shadow-md hover:border-primary/30">
                        {achievement.image && (
                          <div className="h-48 overflow-hidden relative">
                            <img
                              src={achievement.image || "/placeholder.svg"}
                              alt={achievement.title}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-primary text-primary-foreground">
                                {achievement.type}
                              </Badge>
                            </div>
                          </div>
                        )}
                        <CardContent className={`p-6 ${!achievement.image ? "pt-6" : "pt-4"}`}>
                          <div className={`flex justify-between items-start ${!achievement.image ? "mb-2" : ""}`}>
                            {!achievement.image && (
                              <Badge variant="secondary" className="mb-2">
                                {achievement.type}
                              </Badge>
                            )}
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{achievement.year}</span>
                            </div>
                          </div>

                          <h3 className="text-xl font-bold mb-2 line-clamp-2">{achievement.title}</h3>
                          <p className="text-muted-foreground mb-4 line-clamp-3">{achievement.description}</p>

                          <div
                            className="flex items-center gap-3 cursor-pointer group"
                            onClick={() => viewProfile(achievement.user.id)}
                          >
                            <Avatar className="h-10 w-10 border-2 border-primary/20">
                              <AvatarImage
                                src={achievement.user.avatar || "/placeholder.svg"}
                                alt={achievement.user.name}
                              />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {achievement.user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-sm flex-1">
                              <div className="font-medium group-hover:text-primary transition-colors">
                                {achievement.user.name}
                              </div>
                              <div className="text-muted-foreground">
                                {achievement.user.branch}, {achievement.user.graduationYear}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-6 pt-0">
                          <Button className="w-full gap-1 bg-primary hover:bg-primary/90" onClick={() => viewProfile(achievement.user.id)}>
                            View Profile
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
                
                {/* List View */}
                {activeTab === "list" && (
                  <div className="space-y-4">
                    {filteredAchievements.map((achievement) => (
                      <Card key={achievement.id} className="overflow-hidden hover:shadow-md transition-all duration-200">
                        <div className="sm:flex">
                          {achievement.image && (
                            <div className="w-full sm:w-48 h-48 sm:h-auto overflow-hidden">
                              <img
                                src={achievement.image || "/placeholder.svg"}
                                alt={achievement.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 p-6">
                            <div className="flex justify-between items-start mb-2">
                              <Badge className="bg-primary text-primary-foreground">
                                {achievement.type}
                              </Badge>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{achievement.year}</span>
                              </div>
                            </div>

                            <h3 className="text-xl font-bold mb-2">{achievement.title}</h3>
                            <p className="text-muted-foreground mb-4">{achievement.description}</p>

                            <div className="flex items-center justify-between">
                              <div
                                className="flex items-center gap-3 cursor-pointer group"
                                onClick={() => viewProfile(achievement.user.id)}
                              >
                                <Avatar className="h-10 w-10 border-2 border-primary/20">
                                  <AvatarImage
                                    src={achievement.user.avatar || "/placeholder.svg"}
                                    alt={achievement.user.name}
                                  />
                                  <AvatarFallback className="bg-primary/10 text-primary">
                                    {achievement.user.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="text-sm">
                                  <div className="font-medium group-hover:text-primary transition-colors">
                                    {achievement.user.name}
                                  </div>
                                  <div className="text-muted-foreground">
                                    {achievement.user.branch}, {achievement.user.graduationYear}
                                  </div>
                                </div>
                              </div>
                              
                              <Button 
                                size="sm"
                                className="gap-1 bg-primary hover:bg-primary/90" 
                                onClick={() => viewProfile(achievement.user.id)}
                              >
                                View Profile
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}