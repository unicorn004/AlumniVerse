"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Search, Filter, MapPin, Briefcase, GraduationCap, X, ChevronRight } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Card, CardContent, CardFooter } from "@/src/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Badge } from "@/src/components/ui/badge"
import { Separator } from "@/src/components/ui/separator"
import AppLayout from "@/src/components/app-layout"

import { getAllUsers } from "../../api/user"

// Generate graduation years for filter
const currentYear = new Date().getFullYear()
const graduationYears = Array.from({ length: 10 }, (_, i) => (currentYear - i).toString())

// Branches for filter
const branches = [
  "Computer Science",
  "Business Administration", 
  "Electrical Engineering",
  "Mechanical Engineering",
  "Psychology",
  "Other",
]

export default function SearchPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [alumni, setAlumni] = useState([])
  const [filteredAlumni, setFilteredAlumni] = useState([])
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  useEffect(() => {
    // Count active filters
    let count = 0
    if (selectedYear && selectedYear !== "all") count++
    if (selectedBranch && selectedBranch !== "all") count++
    if (selectedLocation) count++
    setActiveFiltersCount(count)
  }, [selectedYear, selectedBranch, selectedLocation])

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(userData))
    
    // Fetch alumni data
    const fetchAlumni = async () => {
      try {
        const users = await getAllUsers()
        
        // Filter only alumni and map to required format
        const alumniUsers = users
          .filter(user => user.role === "alumni")
          .map(user => ({
            id: user._id,
            name: user.fullName || "Anonymous Alumni",
            avatar: user.profileImage || "/placeholder.svg?height=100&width=100",
            graduationYear: user.graduationYear?.toString() || "N/A",
            branch: user.branch || "Not Specified",
            location: user.location || "Not Specified",
            currentJob: user.jobTitle || "Not Specified",
            bio: user.bio || "No bio available",
            skills: user.skills || [],
          }))
        
        setAlumni(alumniUsers)
        setFilteredAlumni(alumniUsers)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching alumni data:", error)
        setIsLoading(false)
      }
    }

    fetchAlumni()
  }, [router])

  // Apply filters
  useEffect(() => {
    let results = [...alumni]

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        (person) =>
          person.name.toLowerCase().includes(query) ||
          person.currentJob.toLowerCase().includes(query) ||
          person.bio.toLowerCase().includes(query) ||
          person.skills.some((skill) => skill.toLowerCase().includes(query)),
      )
    }

    // Apply graduation year filter
    if (selectedYear && selectedYear !== "all") {
      results = results.filter((person) => person.graduationYear === selectedYear)
    }

    // Apply branch filter
    if (selectedBranch && selectedBranch !== "all") {
      results = results.filter((person) => person.branch === selectedBranch)
    }

    // Apply location filter
    if (selectedLocation) {
      results = results.filter((person) => 
        person.location.toLowerCase().includes(selectedLocation.toLowerCase())
      )
    }

    setFilteredAlumni(results)
  }, [searchQuery, selectedYear, selectedBranch, selectedLocation, alumni])

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedYear("")
    setSelectedBranch("")
    setSelectedLocation("")
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
          <p className="text-muted-foreground">Loading alumni directory...</p>
        </div>
      </div>
    )
  }

  return (
    <AppLayout>
      <div className="container py-8 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">Alumni Directory</h1>
          <p className="text-muted-foreground max-w-2xl">
            Connect with fellow graduates, discover career paths, and build your professional network with alumni from your field and beyond.
          </p>
        </div>

        {/* Mobile Filters Toggle */}
        <div className="block md:hidden mb-6">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-between"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <span className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">{activeFiltersCount}</Badge>
              )}
            </span>
            <ChevronRight className={`h-4 w-4 transition-transform ${showMobileFilters ? 'rotate-90' : ''}`} />
          </Button>
          
          {showMobileFilters && (
            <div className="mt-4 rounded-lg border p-4 shadow-sm">
              <FiltersContent 
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                selectedBranch={selectedBranch}
                setSelectedBranch={setSelectedBranch}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                resetFilters={resetFilters}
              />
            </div>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-[280px_1fr]">
          {/* Desktop Filters */}
          <div className="hidden md:block space-y-6">
            <div className="rounded-xl border p-5 shadow-sm bg-card sticky top-24">
              <h2 className="font-semibold mb-5 flex items-center gap-2 text-lg border-b pb-3">
                <Filter className="h-5 w-5" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-auto">{activeFiltersCount}</Badge>
                )}
              </h2>

              <FiltersContent 
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                selectedBranch={selectedBranch}
                setSelectedBranch={setSelectedBranch}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                resetFilters={resetFilters}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, job title, skills..."
                  className="pl-10 py-6 h-auto"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="shrink-0 bg-muted rounded-md flex items-center px-4 h-10 sm:h-full justify-center">
                <p className="text-sm whitespace-nowrap">
                  <strong>{filteredAlumni.length}</strong> alumni found
                </p>
              </div>
            </div>

            {filteredAlumni.length === 0 ? (
              <div className="rounded-xl border border-dashed p-12 text-center">
                <div className="max-w-md mx-auto">
                  <h3 className="font-medium text-lg mb-2">No matches found</h3>
                  <p className="text-muted-foreground mb-6">
                    We couldn't find any alumni matching your current search criteria. Try adjusting your filters or search terms.
                  </p>
                  <Button variant="default" onClick={resetFilters}>
                    Clear All Filters
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAlumni.map((person) => (
                  <Card key={person.id} className="overflow-hidden border rounded-xl transition-all duration-300 hover:shadow-md hover:border-primary/20 group">
                    <CardContent className="p-0">
                      <div className="bg-gradient-to-r from-primary/10 to-primary/5 h-28 flex items-center justify-center">
                        <Avatar className="h-24 w-24 border-4 border-background shadow-md transition-transform group-hover:scale-105">
                          <AvatarImage src={person.avatar || "/placeholder.svg"} alt={person.name} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium text-xl">
                            {person.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-xl group-hover:text-primary transition-colors">{person.name}</h3>
                        <div className="flex items-start gap-2 text-sm text-muted-foreground mt-2">
                          <Briefcase className="h-4 w-4 mt-0.5 shrink-0 text-primary/70" />
                          <span className="line-clamp-1">{person.currentJob}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary/70" />
                          <span className="line-clamp-1">{person.location}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <GraduationCap className="h-4 w-4 mt-0.5 shrink-0 text-primary/70" />
                          <span>
                            {person.branch}, {person.graduationYear}
                          </span>
                        </div>
                        <Separator className="my-4" />
                        <p className="text-sm line-clamp-3 text-muted-foreground">{person.bio}</p>
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {person.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs py-1 font-normal">
                              {skill}
                            </Badge>
                          ))}
                          {person.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs py-1">
                              +{person.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-5 pt-0">
                      <Button 
                        className="w-full gap-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors" 
                        variant="outline" 
                        onClick={() => viewProfile(person.id)}
                      >
                        View Profile
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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

// Extracted filter component to avoid duplication
function FiltersContent({ 
  selectedYear, 
  setSelectedYear, 
  selectedBranch, 
  setSelectedBranch, 
  selectedLocation, 
  setSelectedLocation, 
  resetFilters 
}) {
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <label className="text-sm font-medium">Graduation Year</label>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {graduationYears.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Field of Study</label>
        <Select value={selectedBranch} onValueChange={setSelectedBranch}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All fields" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fields</SelectItem>
            {branches.map((branch) => (
              <SelectItem key={branch} value={branch}>
                {branch}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Location</label>
        <Input
          placeholder="City, state or country"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        />
      </div>

      <Button 
        variant="outline" 
        className="w-full border-dashed" 
        onClick={resetFilters}
      >
        Reset All Filters
      </Button>
    </div>
  )
}