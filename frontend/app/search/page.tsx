"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Search, Filter, MapPin, Briefcase, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import AppLayout from "@/components/app-layout"

// Mock alumni data
const mockAlumni = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=100&width=100",
    graduationYear: "2018",
    branch: "Computer Science",
    location: "San Francisco, CA",
    currentJob: "Senior Software Engineer at Google",
    bio: "Passionate about AI and machine learning. Working on cutting-edge technology at Google.",
    skills: ["JavaScript", "Python", "Machine Learning", "React", "Node.js"],
  },
  {
    id: 2,
    name: "David Wilson",
    avatar: "/placeholder.svg?height=100&width=100",
    graduationYear: "2015",
    branch: "Business Administration",
    location: "New York, NY",
    currentJob: "Product Manager at Amazon",
    bio: "Experienced product manager with a passion for creating user-centric products.",
    skills: ["Product Management", "UX Design", "Market Research", "Agile", "Leadership"],
  },
  {
    id: 3,
    name: "Priya Sharma",
    avatar: "/placeholder.svg?height=100&width=100",
    graduationYear: "2020",
    branch: "Electrical Engineering",
    location: "Seattle, WA",
    currentJob: "Hardware Engineer at Microsoft",
    bio: "Working on next-generation hardware solutions at Microsoft.",
    skills: ["Circuit Design", "PCB Layout", "FPGA", "Embedded Systems", "C++"],
  },
  {
    id: 4,
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=100&width=100",
    graduationYear: "2019",
    branch: "Computer Science",
    location: "Austin, TX",
    currentJob: "Full Stack Developer at IBM",
    bio: "Building enterprise applications and cloud solutions at IBM.",
    skills: ["JavaScript", "React", "Node.js", "AWS", "Docker"],
  },
  {
    id: 5,
    name: "Jessica Lee",
    avatar: "/placeholder.svg?height=100&width=100",
    graduationYear: "2017",
    branch: "Psychology",
    location: "Chicago, IL",
    currentJob: "UX Researcher at Facebook",
    bio: "Helping create better user experiences through research and testing.",
    skills: ["User Research", "Usability Testing", "Data Analysis", "Prototyping", "Interviewing"],
  },
  {
    id: 6,
    name: "Raj Patel",
    avatar: "/placeholder.svg?height=100&width=100",
    graduationYear: "2021",
    branch: "Mechanical Engineering",
    location: "Detroit, MI",
    currentJob: "Design Engineer at Tesla",
    bio: "Working on innovative automotive designs at Tesla.",
    skills: ["CAD", "3D Modeling", "Simulation", "Prototyping", "Manufacturing"],
  },
]

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
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [alumni, setAlumni] = useState(mockAlumni)
  const [filteredAlumni, setFilteredAlumni] = useState(mockAlumni)

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [selectedBranch, setSelectedBranch] = useState<string>("")
  const [selectedLocation, setSelectedLocation] = useState<string>("")

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
    if (selectedYear) {
      results = results.filter((person) => person.graduationYear === selectedYear)
    }

    // Apply branch filter
    if (selectedBranch) {
      results = results.filter((person) => person.branch === selectedBranch)
    }

    // Apply location filter
    if (selectedLocation) {
      results = results.filter((person) => person.location.toLowerCase().includes(selectedLocation.toLowerCase()))
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
          <h1 className="text-2xl font-bold mb-2">Search Alumni</h1>
          <p className="text-muted-foreground">
            Find and connect with alumni based on graduation year, branch, location, or interests
          </p>
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
                  <label className="text-sm font-medium">Graduation Year</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
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

                <div className="space-y-2">
                  <label className="text-sm font-medium">Branch/Major</label>
                  <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      {branches.map((branch) => (
                        <SelectItem key={branch} value={branch}>
                          {branch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    placeholder="City or Country"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  />
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
                placeholder="Search by name, job title, skills..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="rounded-md bg-muted px-4 py-3">
              <p className="text-sm">
                Found <strong>{filteredAlumni.length}</strong> alumni
                {(searchQuery || selectedYear || selectedBranch || selectedLocation) && " matching your filters"}
              </p>
            </div>

            {filteredAlumni.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <h3 className="font-medium">No results found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search or filters to find what you're looking for
                </p>
                <Button variant="outline" className="mt-4" onClick={resetFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAlumni.map((person) => (
                  <Card key={person.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="bg-muted h-24 flex items-center justify-center">
                        <Avatar className="h-20 w-20 border-4 border-background">
                          <AvatarImage src={person.avatar || "/placeholder.svg"} alt={person.name} />
                          <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg">{person.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Briefcase className="h-3 w-3" />
                          <span>{person.currentJob}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{person.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <GraduationCap className="h-3 w-3" />
                          <span>
                            {person.branch}, {person.graduationYear}
                          </span>
                        </div>
                        <Separator className="my-3" />
                        <p className="text-sm line-clamp-2">{person.bio}</p>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {person.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {person.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{person.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button variant="outline" className="w-full" onClick={() => viewProfile(person.id)}>
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
