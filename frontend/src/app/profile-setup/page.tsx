"use client"
import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { GraduationCap, Loader2, Upload, Linkedin, Plus, X } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Alert, AlertDescription } from "@/src/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Progress } from "@/src/components/ui/progress"
import { Badge } from "@/src/components/ui/badge"
import { Checkbox } from "@/src/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"

import {updateUserProfile} from "../../api/user"

// Generate years for graduation year dropdown
const currentYear = new Date().getFullYear()
const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

// Generate months for date dropdowns
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

// Mock branches
const branches = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Business Administration",
  "Economics",
  "Psychology",
  "Biology",
  "Chemistry",
  "Physics",
  "Mathematics",
  "Other",
]

// Achievement types
const achievementTypes = [
  "Academic",
  "Professional Recognition",
  "Industry Award",
  "Innovation",
  "Research",
  "Community Service",
  "Leadership",
  "Other",
]

export default function ProfileSetupPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("basic")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [profileImageFile, setProfileImageFile] = useState(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  // Basic info
  const [basicInfo, setBasicInfo] = useState({
    fullName: "",
    graduationYear: "",
    branch: "",
    location: "",
    currentJob: "",
    bio: "",
    linkedinUrl: "",
  })

  // Skills
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")

  // Experience
  const [experiences, setExperiences] = useState<any[]>([])
  const [newExperience, setNewExperience] = useState({
    jobTitle: "",
    company: "",
    description: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    current: false,
  })

  // Education
  const [education, setEducation] = useState<any[]>([])
  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    current: false,
  })

  // Achievements
  const [achievements, setAchievements] = useState<any[]>([])
  const [newAchievement, setNewAchievement] = useState({
    title: "",
    type: "",
    description: "",
    year: "",
    image: null as string | null,
    imageFile: null,
  })

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Pre-fill name if available
    if (parsedUser.name) {
      setBasicInfo((prev) => ({ ...prev, fullName: parsedUser.name }))
    }

    // Calculate initial progress
    calculateProgress()
  }, [router])

  // Calculate form completion progress
  const calculateProgress = () => {
    let totalPoints = 0
    let earnedPoints = 0

    // Basic info (7 fields)
    const basicInfoFields = Object.values(basicInfo)
    const filledBasicFields = basicInfoFields.filter((field) => field && field.trim() !== "").length
    totalPoints += 7
    earnedPoints += filledBasicFields

    // Profile image and resume (2 points)
    totalPoints += 2
    if (profileImage) earnedPoints += 1
    if (resumeFile) earnedPoints += 1

    // Skills (up to 5 points)
    totalPoints += 5
    earnedPoints += Math.min(skills.length, 5)

    // Experience (3 points per experience, up to 3 experiences)
    totalPoints += 9
    earnedPoints += Math.min(experiences.length * 3, 9)

    // Education (3 points per education, up to 2 educations)
    totalPoints += 6
    earnedPoints += Math.min(education.length * 3, 6)

    // Achievements (2 points per achievement, up to 3 achievements)
    totalPoints += 6
    earnedPoints += Math.min(achievements.length * 2, 6)

    const calculatedProgress = Math.round((earnedPoints / totalPoints) * 100)
    setProgress(calculatedProgress)
  }

  // Update basic info and recalculate progress
  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBasicInfo((prev) => ({ ...prev, [name]: value }))
    setTimeout(calculateProgress, 0)
  }

  // Handle select changes for basic info
  const handleBasicInfoSelectChange = (name: string, value: string) => {
    setBasicInfo((prev) => ({ ...prev, [name]: value }))
    setTimeout(calculateProgress, 0)
  }

  // Handle profile image upload
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfileImageFile(file)
      console.log(file);

      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string) // just for preview
          calculateProgress()
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle resume upload
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setResumeFile(file)
      calculateProgress()
    }
  }

  // Handle LinkedIn auto-fill (mock implementation)
  const handleLinkedInAutoFill = async () => {
    if (!basicInfo.linkedinUrl) {
      setError("Please enter your LinkedIn URL first")
      return
    }

    setIsLoading(true)

    try {
      // Mock API call to fetch LinkedIn data
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock data that would come from LinkedIn API
      const mockLinkedInData = {
        currentJob: "Software Engineer at Tech Company",
        location: "San Francisco, CA",
        bio: "Passionate software engineer with experience in web development and machine learning.",
        skills: ["JavaScript", "React", "Node.js", "Python", "Machine Learning"],
        experiences: [
          {
            jobTitle: "Software Engineer",
            company: "Tech Company",
            description: "Working on full-stack web development projects.",
            startMonth: "January",
            startYear: "2022",
            endMonth: "",
            endYear: "",
            current: true,
          },
        ],
        education: [
          {
            degree: "B.S. Computer Science",
            institution: "University Name",
            startMonth: "September",
            startYear: "2018",
            endMonth: "May",
            endYear: "2022",
            current: false,
          },
        ],
      }

      setBasicInfo((prev) => ({
        ...prev,
        currentJob: mockLinkedInData.currentJob,
        location: mockLinkedInData.location,
        bio: mockLinkedInData.bio,
      }))

      setSkills(mockLinkedInData.skills)
      setExperiences(mockLinkedInData.experiences)
      setEducation(mockLinkedInData.education)

      calculateProgress()
    } catch (err) {
      setError("Failed to fetch LinkedIn data. Please fill in manually.")
    } finally {
      setIsLoading(false)
    }
  }

  // Add a new skill
  const addSkill = () => {
    if (!newSkill.trim()) return
    if (skills.includes(newSkill.trim())) {
      setError("This skill is already added")
      return
    }

    setSkills((prev) => [...prev, newSkill.trim()])
    setNewSkill("")
    calculateProgress()
  }

  // Remove a skill
  const removeSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove))
    calculateProgress()
  }

  // Handle experience form changes
  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewExperience((prev) => ({ ...prev, [name]: value }))
  }

  // Handle experience select changes
  const handleExperienceSelectChange = (name: string, value: string) => {
    setNewExperience((prev) => ({ ...prev, [name]: value }))
  }

  // Handle experience checkbox change
  const handleExperienceCheckboxChange = (checked: boolean) => {
    setNewExperience((prev) => ({ ...prev, current: checked }))
  }

  // Add a new experience
  const addExperience = () => {
    if (!newExperience.jobTitle.trim() || !newExperience.company.trim()) return

    setExperiences((prev) => [...prev, { ...newExperience, id: Date.now() }])
    setNewExperience({
      jobTitle: "",
      company: "",
      description: "",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      current: false,
    })
    calculateProgress()
  }

  // Remove an experience
  const removeExperience = (id: number) => {
    setExperiences((prev) => prev.filter((exp) => exp.id !== id))
    calculateProgress()
  }

  // Handle education form changes
  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewEducation((prev) => ({ ...prev, [name]: value }))
  }

  // Handle education select changes
  const handleEducationSelectChange = (name: string, value: string) => {
    setNewEducation((prev) => ({ ...prev, [name]: value }))
  }

  // Handle education checkbox change
  const handleEducationCheckboxChange = (checked: boolean) => {
    setNewEducation((prev) => ({ ...prev, current: checked }))
  }

  // Add a new education
  const addEducation = () => {
    if (!newEducation.degree.trim() || !newEducation.institution.trim()) return

    setEducation((prev) => [...prev, { ...newEducation, id: Date.now() }])
    setNewEducation({
      degree: "",
      institution: "",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      current: false,
    })
    calculateProgress()
  }

  // Remove an education
  const removeEducation = (id: number) => {
    setEducation((prev) => prev.filter((edu) => edu.id !== id))
    calculateProgress()
  }

  // Handle achievement form changes
  const handleAchievementChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewAchievement((prev) => ({ ...prev, [name]: value }))
  }

  // Handle achievement select changes
  const handleAchievementSelectChange = (name: string, value: string) => {
    setNewAchievement((prev) => ({ ...prev, [name]: value }))
  }

  // Handle achievement image upload
  const handleAchievementImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = (event) => {
        if (event.target?.result) {
          setNewAchievement((prev) => ({ ...prev, 
            image: event.target?.result as string ,
            imageFile: file
          }))
        }
      }

      reader.readAsDataURL(file)
    }
  }

  // Add a new achievement
  const addAchievement = () => {
    if (!newAchievement.title.trim() || !newAchievement.type) return

    setAchievements((prev) => [...prev, { ...newAchievement, id: Date.now() }])
    setNewAchievement({
      title: "",
      type: "",
      description: "",
      year: "",
      image: null,
    })
    calculateProgress()
  }

  // Remove an achievement
  const removeAchievement = (id: number) => {
    setAchievements((prev) => prev.filter((achievement) => achievement.id !== id))
    calculateProgress()
  }

  // Navigate to next tab
  const goToNextTab = () => {
    if (activeTab === "basic") setActiveTab("experience")
    else if (activeTab === "experience") setActiveTab("education")
    else if (activeTab === "education") setActiveTab("skills")
    else if (activeTab === "skills") setActiveTab("achievements")
  }

  // Navigate to previous tab
  const goToPrevTab = () => {
    if (activeTab === "achievements") setActiveTab("skills")
    else if (activeTab === "skills") setActiveTab("education")
    else if (activeTab === "education") setActiveTab("experience")
    else if (activeTab === "experience") setActiveTab("basic")
  }

  // Handle form submission
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setError("")
  //   setIsLoading(true)

  //   try {// need this as a form data
  //     const body = {
  //       "fullName" : basicInfo.fullName,
  //       "graduationYear" : basicInfo.graduationYear,
  //       "role" : user.role,
  //       "branch" : basicInfo.branch,
  //       "jobTitle" : basicInfo.currentJob,
  //       "location" : basicInfo.location,
  //       "bio" : basicInfo.bio,
  //       "profileImage" : profileImage, // make sure this is correct
  //       "linkedIn" : basicInfo.linkedinUrl,
  //       "resume" : resumeFile, // make sure it is correct
  //       "experiences" : experiences,
  //       "education" : education,
  //       "skills" : skills,
  //       "achievements" : achievements
  //     }
  //     const response = await updateUserProfile(body);
      

  //     // Update user data in localStorage
  //     const updatedUser = {
  //       ...user,
  //       ...basicInfo,
  //       isProfileComplete: true,
  //       profileImage,
  //       hasResume: !!resumeFile,
  //       skills,
  //       experiences,
  //       education,
  //       achievements,
  //     }

  //     //localStorage.setItem("user", JSON.stringify(updatedUser))
  //     if(response){
  //       console.log("prof data response = ",response);
  //       localStorage.setItem("user", JSON.stringify(response.data))
  //     }
      

  //     // Redirect to home page
  //     router.push("/home")
  //   } catch (err) {
  //     setError("Failed to save profile. Please try again.")
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");
  //   setIsLoading(true);
  
  //   try {
  //     const formData = new FormData();
  
  //     // Basic fields
  //     formData.append("fullName", basicInfo.fullName);
  //     formData.append("graduationYear", basicInfo.graduationYear.toString());
  //     formData.append("role", user.role);
  //     formData.append("branch", basicInfo.branch);
  //     formData.append("jobTitle", basicInfo.currentJob);
  //     formData.append("location", basicInfo.location);
  //     formData.append("bio", basicInfo.bio);
  //     formData.append("linkedIn", basicInfo.linkedinUrl);
  
  //     // Files
  //     if (profileImageFile instanceof File) {
  //       formData.append("profileImage", profileImageFile);
  //     } else if (typeof profileImage === "string") {
  //       console.log("THIS IS UNEXPECTED IMAGE URL ERROR IN PROFILE SETUP")
  //       formData.append("profileImage", profileImage); // Send URL separately if it's already uploaded
  //     }
  
  //     if (resumeFile) {
  //       formData.append("resume", resumeFile);
  //     }
  
  //     // Arrays or nested data: stringify
  //     formData.append("experiences", JSON.stringify(experiences));
  //     formData.append("education", JSON.stringify(education));
  //     formData.append("skills", JSON.stringify(skills));
  //     formData.append("achievements", JSON.stringify(achievements));
  
  //     console.log("Formdata contains = ",formData);
  //     // Send the FormData
  //     const response = await updateUserProfile(formData); // this must support FormData
  
  //     // Update user data in localStorage
  //     if (response) {
  //       console.log("prof data response = ", response);
  //       localStorage.setItem("user", JSON.stringify(response.data));
  //     }
  
  //     router.push("/home");
  //   } catch (err) {
  //     setError("Failed to save profile. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
  
    try {
      const formData = new FormData();
  
      // Basic fields
      formData.append("fullName", basicInfo.fullName);
      formData.append("graduationYear", basicInfo.graduationYear.toString());
      formData.append("role", user.role);
      formData.append("branch", basicInfo.branch);
      formData.append("jobTitle", basicInfo.currentJob);
      formData.append("location", basicInfo.location);
      formData.append("bio", basicInfo.bio);
      formData.append("linkedIn", basicInfo.linkedinUrl);
  
      // Files
      if (profileImageFile instanceof File) {
        formData.append("profileImage", profileImageFile);
      } else if (typeof profileImage === "string") {
        console.log("THIS IS UNEXPECTED IMAGE URL ERROR IN PROFILE SETUP");
        formData.append("profileImage", profileImage);
      }
  
      if (resumeFile) {
        formData.append("resume", resumeFile);
      }
  
      // Arrays or nested data: stringify
      formData.append("experiences", JSON.stringify(experiences));
      formData.append("education", JSON.stringify(education));
      formData.append("skills", JSON.stringify(skills));
  
      // 🧠 Handle achievements separately
      const achievementsForUpload = achievements.map((ach) => {
        const { imageFile, ...rest } = ach;
        return rest;
      });
  
      formData.append("achievements", JSON.stringify(achievementsForUpload));
  
      // 📦 Manually append imageFiles to 'achievementImages'
      achievements.forEach((ach) => {
        if (ach.imageFile instanceof File) {
          formData.append("achievementImages", ach.imageFile);
        }
      });
  
      console.log("Formdata being sent = ", formData);
  
      // 🚀 Submit form data
      const response = await updateUserProfile(formData);
  
      if (response) {
        console.log("Profile update response:", response);
        localStorage.setItem("user", JSON.stringify(response.data));
      }
  
      router.push("/home");
    } catch (err) {
      setError("Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <GraduationCap className="h-6 w-6" />
            <span>Nexus</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 py-6 px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Complete Your Profile</h1>
            <p className="text-muted-foreground mt-2">Help others get to know you better by completing your profile</p>
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <Progress value={progress} className="h-2" />
                <span className="text-sm font-medium">{progress}%</span>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Fill in your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative h-24 w-24 overflow-hidden rounded-full border">
                        {profileImage ? (
                          <img
                            src={profileImage || "/placeholder.svg"}
                            alt="Profile"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted">
                            <GraduationCap className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="profile-image" className="cursor-pointer">
                          <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                            <Upload className="h-4 w-4" />
                            <span>{profileImage ? "Change Photo" : "Upload Photo"}</span>
                          </div>
                        </Label>
                        <Input
                          id="profile-image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleProfileImageChange}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={basicInfo.fullName}
                          onChange={handleBasicInfoChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="graduationYear">Graduation Year</Label>
                        <Select
                          value={basicInfo.graduationYear}
                          onValueChange={(value) => handleBasicInfoSelectChange("graduationYear", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="branch">Branch/Major</Label>
                        <Select
                          value={basicInfo.branch}
                          onValueChange={(value) => handleBasicInfoSelectChange("branch", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select branch" />
                          </SelectTrigger>
                          <SelectContent>
                            {branches.map((branch) => (
                              <SelectItem key={branch} value={branch}>
                                {branch}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          placeholder="City, Country"
                          value={basicInfo.location}
                          onChange={handleBasicInfoChange}
                        />
                      </div>

                      {user.role === "alumni" && (
                        <div className="space-y-2">
                          <Label htmlFor="currentJob">Current Job</Label>
                          <Input
                            id="currentJob"
                            name="currentJob"
                            placeholder="Job Title at Company"
                            value={basicInfo.currentJob}
                            onChange={handleBasicInfoChange}
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="linkedinUrl">LinkedIn Profile URL</Label>
                        <div className="flex gap-2">
                          <Input
                            id="linkedinUrl"
                            name="linkedinUrl"
                            placeholder="https://linkedin.com/in/username"
                            value={basicInfo.linkedinUrl}
                            onChange={handleBasicInfoChange}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={handleLinkedInAutoFill}
                            disabled={isLoading || !basicInfo.linkedinUrl}
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Linkedin className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Add your LinkedIn to auto-fill profile information
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        placeholder="Tell us about yourself, your interests, and your goals"
                        value={basicInfo.bio}
                        onChange={handleBasicInfoChange}
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resume">Resume (PDF)</Label>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="resume" className="cursor-pointer flex-1">
                          <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                            <Upload className="h-4 w-4" />
                            <span>{resumeFile ? resumeFile.name : "Upload Resume"}</span>
                          </div>
                        </Label>
                        <Input id="resume" type="file" accept=".pdf" className="hidden" onChange={handleResumeChange} />
                      </div>
                      <p className="text-xs text-muted-foreground">Upload your resume in PDF format (max 5MB)</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={goToNextTab}>Next: Experience</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent value="experience">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Experience</CardTitle>
                  <CardDescription>Add your work experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="rounded-lg border p-4 relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => removeExperience(exp.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-bold">{exp.jobTitle}</h3>
                              <p className="text-muted-foreground">{exp.company}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {exp.startMonth} {exp.startYear} -{" "}
                              {exp.current ? "Present" : `${exp.endMonth} ${exp.endYear}`}
                            </p>
                          </div>
                          <p className="text-sm">{exp.description}</p>
                        </div>
                      </div>
                    ))}

                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-4">Add New Experience</h3>
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="title">Job Title</Label>
                            <Input
                              id="title"
                              name="title"
                              value={newExperience.jobTitle}
                              onChange={handleExperienceChange}
                              placeholder="e.g. Software Engineer"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="company">Company</Label>
                            <Input
                              id="company"
                              name="company"
                              value={newExperience.company}
                              onChange={handleExperienceChange}
                              placeholder="e.g. Google"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            name="description"
                            value={newExperience.description}
                            onChange={handleExperienceChange}
                            placeholder="Describe your responsibilities and achievements"
                            rows={3}
                          />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Start Date</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <Select
                                value={newExperience.startMonth}
                                onValueChange={(value) => handleExperienceSelectChange("startMonth", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent>
                                  {months.map((month) => (
                                    <SelectItem key={month} value={month}>
                                      {month}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Select
                                value={newExperience.startYear}
                                onValueChange={(value) => handleExperienceSelectChange("startYear", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                  {years.map((year) => (
                                    <SelectItem key={year} value={year.toString()}>
                                      {year}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>End Date</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <Select
                                value={newExperience.endMonth}
                                onValueChange={(value) => handleExperienceSelectChange("endMonth", value)}
                                disabled={newExperience.current}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent>
                                  {months.map((month) => (
                                    <SelectItem key={month} value={month}>
                                      {month}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Select
                                value={newExperience.endYear}
                                onValueChange={(value) => handleExperienceSelectChange("endYear", value)}
                                disabled={newExperience.current}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                  {years.map((year) => (
                                    <SelectItem key={year} value={year.toString()}>
                                      {year}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="current"
                            checked={newExperience.current}
                            onCheckedChange={handleExperienceCheckboxChange}
                          />
                          <Label htmlFor="current">I currently work here</Label>
                        </div>

                        <Button type="button" onClick={addExperience} className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Experience
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={goToPrevTab}>
                    Back
                  </Button>
                  <Button onClick={goToNextTab}>Next: Education</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education">
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>Add your educational background</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {education.map((edu) => (
                      <div key={edu.id} className="rounded-lg border p-4 relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => removeEducation(edu.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-bold">{edu.degree}</h3>
                              <p className="text-muted-foreground">{edu.institution}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {edu.startMonth} {edu.startYear} -{" "}
                              {edu.current ? "Present" : `${edu.endMonth} ${edu.endYear}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-4">Add New Education</h3>
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="degree">Degree/Certificate</Label>
                            <Input
                              id="degree"
                              name="degree"
                              value={newEducation.degree}
                              onChange={handleEducationChange}
                              placeholder="e.g. Bachelor of Science in Computer Science"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="institution">Institution</Label>
                            <Input
                              id="institution"
                              name="institution"
                              value={newEducation.institution}
                              onChange={handleEducationChange}
                              placeholder="e.g. Stanford University"
                            />
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Start Date</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <Select
                                value={newEducation.startMonth}
                                onValueChange={(value) => handleEducationSelectChange("startMonth", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent>
                                  {months.map((month) => (
                                    <SelectItem key={month} value={month}>
                                      {month}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Select
                                value={newEducation.startYear}
                                onValueChange={(value) => handleEducationSelectChange("startYear", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                  {years.map((year) => (
                                    <SelectItem key={year} value={year.toString()}>
                                      {year}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>End Date</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <Select
                                value={newEducation.endMonth}
                                onValueChange={(value) => handleEducationSelectChange("endMonth", value)}
                                disabled={newEducation.current}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent>
                                  {months.map((month) => (
                                    <SelectItem key={month} value={month}>
                                      {month}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Select
                                value={newEducation.endYear}
                                onValueChange={(value) => handleEducationSelectChange("endYear", value)}
                                disabled={newEducation.current}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                  {years.map((year) => (
                                    <SelectItem key={year} value={year.toString()}>
                                      {year}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="eduCurrent"
                            checked={newEducation.current}
                            onCheckedChange={handleEducationCheckboxChange}
                          />
                          <Label htmlFor="eduCurrent">I am currently studying here</Label>
                        </div>

                        <Button type="button" onClick={addEducation} className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Education
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={goToPrevTab}>
                    Back
                  </Button>
                  <Button onClick={goToNextTab}>Next: Skills</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills">
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                  <CardDescription>Add your skills and expertise</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="px-3 py-1">
                          {skill}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-1 p-0"
                            onClick={() => removeSkill(skill)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                      {skills.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          No skills added yet. Add your first skill below.
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a skill (e.g. JavaScript, Project Management)"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newSkill.trim()) {
                            e.preventDefault()
                            addSkill()
                          }
                        }}
                      />
                      <Button onClick={addSkill} disabled={!newSkill.trim()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={goToPrevTab}>
                    Back
                  </Button>
                  <Button onClick={goToNextTab}>Next: Achievements</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements">
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Add your awards, recognitions, and accomplishments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {achievements.map((achievement) => (
                      <div key={achievement.id} className="rounded-lg border p-4 relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => removeAchievement(achievement.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-bold">{achievement.jobTitle}</h3>
                              <Badge variant="outline" className="mt-1">
                                {achievement.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{achievement.year}</p>
                          </div>
                          {achievement.image && (
                            <div className="mt-2">
                              <img
                                src={achievement.image || "/placeholder.svg"}
                                alt={achievement.jobTitle}
                                className="rounded-md max-h-40 object-contain"
                              />
                            </div>
                          )}
                          <p className="text-sm">{achievement.description}</p>
                        </div>
                      </div>
                    ))}

                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-4">Add New Achievement</h3>
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="achievementTitle">Title</Label>
                            <Input
                              id="achievementTitle"
                              name="title"
                              value={newAchievement.jobTitle}
                              onChange={handleAchievementChange}
                              placeholder="e.g. Best Paper Award"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="achievementType">Type</Label>
                            <Select
                              value={newAchievement.type}
                              onValueChange={(value) => handleAchievementSelectChange("type", value)}
                            >
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
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="achievementYear">Year</Label>
                          <Select
                            value={newAchievement.year}
                            onValueChange={(value) => handleAchievementSelectChange("year", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                              {years.slice(0, 10).map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="achievementDescription">Description</Label>
                          <Textarea
                            id="achievementDescription"
                            name="description"
                            value={newAchievement.description}
                            onChange={handleAchievementChange}
                            placeholder="Describe your achievement"
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="achievementImage">Image (Optional)</Label>
                          <div className="flex items-center gap-2">
                            <Label htmlFor="achievementImage" className="cursor-pointer flex-1">
                              <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                                <Upload className="h-4 w-4" />
                                <span>{newAchievement.image ? "Change Image" : "Upload Image"}</span>
                              </div>
                            </Label>
                            <Input
                              id="achievementImage"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleAchievementImageChange}
                            />
                          </div>
                          {newAchievement.image && (
                            <div className="mt-2">
                              <img
                                src={newAchievement.image || "/placeholder.svg"}
                                alt="Achievement"
                                className="rounded-md max-h-40 object-contain"
                              />
                            </div>
                          )}
                        </div>

                        <Button type="button" onClick={addAchievement} className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Achievement
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={goToPrevTab}>
                    Back
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push("/home")}>
                      Skip for Now
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Complete Profile"
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="border-t py-4">
        <div className="container flex justify-center">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Nexus. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
