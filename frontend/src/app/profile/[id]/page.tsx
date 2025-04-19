"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Mail,
  Calendar,
  Edit,
  X,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import AppLayout from "@/src/components/app-layout";

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editTab, setEditTab] = useState("basic");

  // Form states for editing
  const [editedProfile, setEditedProfile] = useState<any>({});
  const [newSkill, setNewSkill] = useState("");
  const [newExperience, setNewExperience] = useState({
    jobTitle: "",
    company: "",
    description: "",
    startDate: "",
    endDate: "",
    current: false,
  });
  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    startDate: "",
    endDate: "",
    current: false,
  });
  const [newAchievement, setNewAchievement] = useState({
    title: "",
    type: "",
    description: "",
    date: "",
    image: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);

      try {
        // For demo purposes, we'll use mock data
        // In a real app, you would fetch from an API
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

        // Check if this is the current user's profile
        const isMe = params.id === "me" || params.id === currentUser.id;
        setIsCurrentUser(isMe);

        if (isMe) {
          setProfile(currentUser);
          setEditedProfile(JSON.parse(JSON.stringify(currentUser)));
        } else {
          // Mock data for other profiles
          // In a real app, you would fetch from an API based on the ID
          const mockProfiles = [
            {
              id: "1",
              name: "Jane Smith",
              role: "alumni",
              graduationYear: "2018",
              degree: "Computer Science",
              currentJob: "Senior Software Engineer",
              company: "Tech Innovations Inc.",
              location: "San Francisco, CA",
              email: "jane.smith@example.com",
              bio: "Passionate about building scalable web applications and mentoring junior developers.",
              profileImage: "/placeholder.svg?height=128&width=128",
              skills: ["JavaScript", "React", "Node.js", "AWS", "GraphQL"],
              experiences: [
                {
                  jobTitle: "Senior Software Engineer",
                  company: "Tech Innovations Inc.",
                  description:
                    "Leading the frontend team for the company's main product.",
                  startDate: "2020-06",
                  endDate: "",
                  current: true,
                },
                {
                  jobTitle: "Software Engineer",
                  company: "WebDev Solutions",
                  description:
                    "Developed and maintained client websites and applications.",
                  startDate: "2018-01",
                  endDate: "2020-05",
                  current: false,
                },
              ],
              education: [
                {
                  degree: "BS in Computer Science",
                  institution: "University of Technology",
                  startDate: "2014-09",
                  endDate: "2018-05",
                  current: false,
                },
              ],
              achievements: [
                {
                  title: "Innovation Award",
                  type: "Professional",
                  description:
                    "Received for developing a new algorithm that improved system performance by 40%.",
                  date: "2021",
                  image: "/placeholder.svg?height=100&width=100",
                },
              ],
            },
            {
              id: "2",
              name: "John Doe",
              role: "alumni",
              graduationYear: "2020",
              degree: "Electrical Engineering",
              currentJob: "Hardware Engineer",
              company: "ElectroTech Corp",
              location: "Boston, MA",
              email: "john.doe@example.com",
              bio: "Specializing in embedded systems and IoT devices.",
              profileImage: "/placeholder.svg?height=128&width=128",
              skills: ["C++", "Embedded Systems", "PCB Design", "IoT", "FPGA"],
              experiences: [
                {
                  jobTitle: "Hardware Engineer",
                  company: "ElectroTech Corp",
                  description: "Designing and testing new IoT devices.",
                  startDate: "2020-08",
                  endDate: "",
                  current: true,
                },
              ],
              education: [
                {
                  degree: "MS in Electrical Engineering",
                  institution: "Tech University",
                  startDate: "2018-09",
                  endDate: "2020-05",
                  current: false,
                },
                {
                  degree: "BS in Electrical Engineering",
                  institution: "State University",
                  startDate: "2014-09",
                  endDate: "2018-05",
                  current: false,
                },
              ],
              achievements: [
                {
                  title: "Best Thesis Award",
                  type: "Academic",
                  description:
                    "Awarded for outstanding master's thesis on energy-efficient IoT devices.",
                  date: "2020",
                  image: "/placeholder.svg?height=100&width=100",
                },
              ],
            },
          ];

          const foundProfile = mockProfiles.find((p) => p.id === params.id);
          if (foundProfile) {
            setProfile(foundProfile);
          } else {
            // If profile not found, redirect to search
            router.push("/search");
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [params.id, router]);

  const handleSaveProfile = () => {
    // In a real app, you would send this to an API
    // For demo purposes, we'll just update localStorage
    if (isCurrentUser) {
      localStorage.setItem("user", JSON.stringify(editedProfile));
      setProfile(editedProfile);
    }
    setIsEditDialogOpen(false);
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      const updatedSkills = [...(editedProfile.skills || []), newSkill.trim()];
      setEditedProfile({ ...editedProfile, skills: updatedSkills });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = (editedProfile.skills || []).filter(
      (skill: string) => skill !== skillToRemove
    );
    setEditedProfile({ ...editedProfile, skills: updatedSkills });
  };

  const handleAddExperience = () => {
    if (newExperience.jobTitle && newExperience.company) {
      const updatedExperiences = [
        ...(editedProfile.experiences || []),
        { ...newExperience },
      ];
      setEditedProfile({ ...editedProfile, experiences: updatedExperiences });
      setNewExperience({
        jobTitle: "",
        company: "",
        description: "",
        startDate: "",
        endDate: "",
        current: false,
      });
    }
  };

  const handleRemoveExperience = (index: number) => {
    const updatedExperiences = [...(editedProfile.experiences || [])];
    updatedExperiences.splice(index, 1);
    setEditedProfile({ ...editedProfile, experiences: updatedExperiences });
  };

  const handleAddEducation = () => {
    if (newEducation.degree && newEducation.institution) {
      const updatedEducation = [
        ...(editedProfile.education || []),
        { ...newEducation },
      ];
      setEditedProfile({ ...editedProfile, education: updatedEducation });
      setNewEducation({
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
        current: false,
      });
    }
  };

  const handleRemoveEducation = (index: number) => {
    const updatedEducation = [...(editedProfile.education || [])];
    updatedEducation.splice(index, 1);
    setEditedProfile({ ...editedProfile, education: updatedEducation });
  };

  const handleAddAchievement = () => {
    if (newAchievement.title && newAchievement.type) {
      const updatedAchievements = [
        ...(editedProfile.achievements || []),
        { ...newAchievement },
      ];
      setEditedProfile({ ...editedProfile, achievements: updatedAchievements });
      setNewAchievement({
        title: "",
        type: "",
        description: "",
        date: "",
        image: "",
      });
    }
  };

  const handleRemoveAchievement = (index: number) => {
    const updatedAchievements = [...(editedProfile.achievements || [])];
    updatedAchievements.splice(index, 1);
    setEditedProfile({ ...editedProfile, achievements: updatedAchievements });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    try {
      const [year, month] = dateString.split("-");
      const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1);
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col gap-4 animate-pulse">
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="h-8 w-1/3 bg-muted rounded"></div>
            <div className="h-4 w-1/2 bg-muted rounded"></div>
            <div className="h-24 bg-muted rounded-lg"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!profile) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
          <p className="mb-4">
            The profile you are looking for does not exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/search">Search Alumni</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative h-32 w-32 rounded-full overflow-hidden">
                  <Image
                    src={
                      profile.profileImage ||
                      "/placeholder.svg?height=128&width=128"
                    }
                    alt={profile.fullName}
                    fill
                    className="object-cover"
                  />
                </div>
                {isCurrentUser && (
                  <Dialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Edit className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                      </DialogHeader>
                      <Tabs
                        value={editTab}
                        onValueChange={setEditTab}
                        className="w-full"
                      >
                        <TabsList className="grid grid-cols-5 mb-4">
                          <TabsTrigger value="basic">Basic Info</TabsTrigger>
                          <TabsTrigger value="skills">Skills</TabsTrigger>
                          <TabsTrigger value="experience">
                            Experience
                          </TabsTrigger>
                          <TabsTrigger value="education">Education</TabsTrigger>
                          <TabsTrigger value="achievements">
                            Achievements
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Full Name</Label>
                              <Input
                                id="name"
                                value={editedProfile.fullName || ""}
                                onChange={(e) =>
                                  setEditedProfile({
                                    ...editedProfile,
                                    fullName: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                value={editedProfile.email || ""}
                                onChange={(e) =>
                                  setEditedProfile({
                                    ...editedProfile,
                                    email: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="role">Role</Label>
                              <Select
                                value={editedProfile.role || ""}
                                onValueChange={(value) =>
                                  setEditedProfile({
                                    ...editedProfile,
                                    role: value,
                                  })
                                }
                              >
                                <SelectTrigger id="role">
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="student">
                                    Student
                                  </SelectItem>
                                  <SelectItem value="alumni">Alumni</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="location">Location</Label>
                              <Input
                                id="location"
                                value={editedProfile.location || ""}
                                onChange={(e) =>
                                  setEditedProfile({
                                    ...editedProfile,
                                    location: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="graduationYear">
                                Graduation Year
                              </Label>
                              <Input
                                id="graduationYear"
                                value={editedProfile.graduationYear || ""}
                                onChange={(e) =>
                                  setEditedProfile({
                                    ...editedProfile,
                                    graduationYear: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="degree">Degree</Label>
                              <Input
                                id="degree"
                                value={editedProfile.degree || ""}
                                onChange={(e) =>
                                  setEditedProfile({
                                    ...editedProfile,
                                    degree: e.target.value,
                                  })
                                }
                              />
                            </div>

                            {editedProfile.role === "alumni" && (
                              <>
                                <div className="space-y-2">
                                  <Label htmlFor="currentJob">
                                    Current Job
                                  </Label>
                                  <Input
                                    id="currentJob"
                                    value={editedProfile.currentJob || ""}
                                    onChange={(e) =>
                                      setEditedProfile({
                                        ...editedProfile,
                                        currentJob: e.target.value,
                                      })
                                    }
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="company">Company</Label>
                                  <Input
                                    id="company"
                                    value={editedProfile.company || ""}
                                    onChange={(e) =>
                                      setEditedProfile({
                                        ...editedProfile,
                                        company: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                              </>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                              id="bio"
                              rows={4}
                              value={editedProfile.bio || ""}
                              onChange={(e) =>
                                setEditedProfile({
                                  ...editedProfile,
                                  bio: e.target.value,
                                })
                              }
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="skills" className="space-y-4">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add a skill"
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddSkill();
                                }
                              }}
                            />
                            <Button type="button" onClick={handleAddSkill}>
                              Add
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-4">
                            {(editedProfile.skills || []).map(
                              (skill: string, index: number) => (
                                <Badge
                                  key={index}
                                  className="flex items-center gap-1 px-3 py-1"
                                >
                                  {skill}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSkill(skill)}
                                    className="text-xs rounded-full hover:bg-primary/20 p-1"
                                  >
                                    <X className="h-3 w-3" />
                                    <span className="sr-only">Remove</span>
                                  </button>
                                </Badge>
                              )
                            )}
                          </div>
                        </TabsContent>

                        <TabsContent value="experience" className="space-y-4">
                          <Card>
                            <CardHeader>
                              <CardTitle>Add Experience</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="exp-title">Job Title</Label>
                                  <Input
                                    id="exp-title"
                                    value={newExperience.jobTitle}
                                    onChange={(e) =>
                                      setNewExperience({
                                        ...newExperience,
                                        jobTitle: e.target.value,
                                      })
                                    }
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="exp-company">Company</Label>
                                  <Input
                                    id="exp-company"
                                    value={newExperience.company}
                                    onChange={(e) =>
                                      setNewExperience({
                                        ...newExperience,
                                        company: e.target.value,
                                      })
                                    }
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="exp-start">Start Date</Label>
                                  <Input
                                    id="exp-start"
                                    type="month"
                                    value={newExperience.startDate}
                                    onChange={(e) =>
                                      setNewExperience({
                                        ...newExperience,
                                        startDate: e.target.value,
                                      })
                                    }
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="exp-end">End Date</Label>
                                  <Input
                                    id="exp-end"
                                    type="month"
                                    value={newExperience.endDate}
                                    onChange={(e) =>
                                      setNewExperience({
                                        ...newExperience,
                                        endDate: e.target.value,
                                      })
                                    }
                                    disabled={newExperience.current}
                                  />
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="exp-current"
                                  checked={newExperience.current}
                                  onCheckedChange={(checked) =>
                                    setNewExperience({
                                      ...newExperience,
                                      current: checked as boolean,
                                      endDate: checked
                                        ? ""
                                        : newExperience.endDate,
                                    })
                                  }
                                />
                                <label
                                  htmlFor="exp-current"
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  I currently work here
                                </label>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="exp-description">
                                  Description
                                </Label>
                                <Textarea
                                  id="exp-description"
                                  rows={3}
                                  value={newExperience.description}
                                  onChange={(e) =>
                                    setNewExperience({
                                      ...newExperience,
                                      description: e.target.value,
                                    })
                                  }
                                />
                              </div>

                              <Button
                                type="button"
                                onClick={handleAddExperience}
                              >
                                Add Experience
                              </Button>
                            </CardContent>
                          </Card>

                          <div className="space-y-4 mt-4">
                            {(editedProfile.experiences || []).map(
                              (exp: any, index: number) => (
                                <Card key={index}>
                                  <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <CardTitle>{exp.jobTitle}</CardTitle>
                                        <CardDescription>
                                          {exp.company}
                                        </CardDescription>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          handleRemoveExperience(index)
                                        }
                                      >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Remove</span>
                                      </Button>
                                    </div>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {formatDate(exp.startDate)} -{" "}
                                      {exp.current
                                        ? "Present"
                                        : formatDate(exp.endDate)}
                                    </p>
                                    <p className="text-sm">{exp.description}</p>
                                  </CardContent>
                                </Card>
                              )
                            )}
                          </div>
                        </TabsContent>

                        <TabsContent value="education" className="space-y-4">
                          <Card>
                            <CardHeader>
                              <CardTitle>Add Education</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edu-degree">
                                    Degree/Certificate
                                  </Label>
                                  <Input
                                    id="edu-degree"
                                    value={newEducation.degree}
                                    onChange={(e) =>
                                      setNewEducation({
                                        ...newEducation,
                                        degree: e.target.value,
                                      })
                                    }
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="edu-institution">
                                    School/University
                                  </Label>
                                  <Input
                                    id="edu-institution"
                                    value={newEducation.institution}
                                    onChange={(e) =>
                                      setNewEducation({
                                        ...newEducation,
                                        institution: e.target.value,
                                      })
                                    }
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="edu-start">Start Date</Label>
                                  <Input
                                    id="edu-start"
                                    type="month"
                                    value={newEducation.startDate}
                                    onChange={(e) =>
                                      setNewEducation({
                                        ...newEducation,
                                        startDate: e.target.value,
                                      })
                                    }
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="edu-end">End Date</Label>
                                  <Input
                                    id="edu-end"
                                    type="month"
                                    value={newEducation.endDate}
                                    onChange={(e) =>
                                      setNewEducation({
                                        ...newEducation,
                                        endDate: e.target.value,
                                      })
                                    }
                                    disabled={newEducation.current}
                                  />
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="edu-current"
                                  checked={newEducation.current}
                                  onCheckedChange={(checked) =>
                                    setNewEducation({
                                      ...newEducation,
                                      current: checked as boolean,
                                      endDate: checked
                                        ? ""
                                        : newEducation.endDate,
                                    })
                                  }
                                />
                                <label
                                  htmlFor="edu-current"
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  I currently study here
                                </label>
                              </div>

                              <Button
                                type="button"
                                onClick={handleAddEducation}
                              >
                                Add Education
                              </Button>
                            </CardContent>
                          </Card>

                          <div className="space-y-4 mt-4">
                            {(editedProfile.education || []).map(
                              (edu: any, index: number) => (
                                <Card key={index}>
                                  <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <CardTitle>{edu.degree}</CardTitle>
                                        <CardDescription>
                                          {edu.institution}
                                        </CardDescription>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          handleRemoveEducation(index)
                                        }
                                      >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Remove</span>
                                      </Button>
                                    </div>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                      {formatDate(edu.startDate)} -{" "}
                                      {edu.current
                                        ? "Present"
                                        : formatDate(edu.endDate)}
                                    </p>
                                  </CardContent>
                                </Card>
                              )
                            )}
                          </div>
                        </TabsContent>

                        <TabsContent value="achievements" className="space-y-4">
                          <Card>
                            <CardHeader>
                              <CardTitle>Add Achievement</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="ach-title">Title</Label>
                                  <Input
                                    id="ach-title"
                                    value={newAchievement.title}
                                    onChange={(e) =>
                                      setNewAchievement({
                                        ...newAchievement,
                                        title: e.target.value,
                                      })
                                    }
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="ach-type">Type</Label>
                                  <Select
                                    value={newAchievement.type}
                                    onValueChange={(value) =>
                                      setNewAchievement({
                                        ...newAchievement,
                                        type: value,
                                      })
                                    }
                                  >
                                    <SelectTrigger id="ach-type">
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Academic">
                                        Academic
                                      </SelectItem>
                                      <SelectItem value="Professional">
                                        Professional
                                      </SelectItem>
                                      <SelectItem value="Research">
                                        Research
                                      </SelectItem>
                                      <SelectItem value="Innovation">
                                        Innovation
                                      </SelectItem>
                                      <SelectItem value="Leadership">
                                        Leadership
                                      </SelectItem>
                                      <SelectItem value="Other">
                                        Other
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="ach-date">Date</Label>
                                  <Input
                                    id="ach-date"
                                    type="month"
                                    value={newAchievement.date}
                                    onChange={(e) =>
                                      setNewAchievement({
                                        ...newAchievement,
                                        date: e.target.value,
                                      })
                                    }
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="ach-image">
                                    Image URL (Optional)
                                  </Label>
                                  <Input
                                    id="ach-image"
                                    value={newAchievement.image}
                                    onChange={(e) =>
                                      setNewAchievement({
                                        ...newAchievement,
                                        image: e.target.value,
                                      })
                                    }
                                    placeholder="https://example.com/image.jpg"
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="ach-description">
                                  Description
                                </Label>
                                <Textarea
                                  id="ach-description"
                                  rows={3}
                                  value={newAchievement.description}
                                  onChange={(e) =>
                                    setNewAchievement({
                                      ...newAchievement,
                                      description: e.target.value,
                                    })
                                  }
                                />
                              </div>

                              <Button
                                type="button"
                                onClick={handleAddAchievement}
                              >
                                Add Achievement
                              </Button>
                            </CardContent>
                          </Card>

                          <div className="space-y-4 mt-4">
                            {(editedProfile.achievements || []).map(
                              (ach: any, index: number) => (
                                <Card key={index}>
                                  <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <CardTitle>{ach.title}</CardTitle>
                                        <CardDescription>
                                          {ach.type}
                                        </CardDescription>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          handleRemoveAchievement(index)
                                        }
                                      >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Remove</span>
                                      </Button>
                                    </div>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {formatDate(ach.date)}
                                    </p>
                                    <p className="text-sm">{ach.description}</p>
                                    {ach.image && (
                                      <div className="mt-2 h-20 w-20 relative">
                                        <Image
                                          src={ach.image || "/placeholder.svg"}
                                          alt={ach.title}
                                          fill
                                          className="object-cover rounded-md"
                                        />
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              )
                            )}
                          </div>
                        </TabsContent>
                      </Tabs>

                      <div className="flex justify-end gap-2 mt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsEditDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleSaveProfile}>
                          Save Changes
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-2xl font-bold">{profile.fullName}</h1>
                <p className="text-muted-foreground mb-4">
                  {profile.role === "alumni" ? "Alumni" : "Student"} •{" "}
                  {profile.degree} • Class of {profile.graduationYear}
                </p>

                {profile.role === "alumni" && profile.currentJob && (
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {profile.currentJob} at {profile.company}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm mb-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.degree}</span>
                </div>

                {profile.location && (
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.location}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm mb-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.email}</span>
                </div>

                <div className="flex items-center gap-2 text-sm mb-4">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Graduated {profile.graduationYear}</span>
                </div>

                {profile.bio && <p className="mt-4 text-sm">{profile.bio}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Experience</CardTitle>
            </CardHeader>
            <CardContent>
              {profile.experiences && profile.experiences.length > 0 ? (
                <div className="space-y-6">
                  {profile.experiences.map((exp: any, index: number) => (
                    <div
                      key={index}
                      className="border-b pb-4 last:border-0 last:pb-0"
                    >
                      <h3 className="font-medium">{exp.jobTitle}</h3>
                      <p className="text-sm text-muted-foreground">
                        {exp.company}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {exp.startMonth} {exp.startYear} -{" "}
                        {exp.current
                          ? "present"
                          : `${exp.endMonth} ${exp.endYear}`}
                      </p>
                      {exp.description && (
                        <p className="mt-2 text-sm">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No experience added yet.
                </p>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                {profile.skills && profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No skills added yet.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent>
                {profile.education && profile.education.length > 0 ? (
                  <div className="space-y-4">
                    {profile.education.map((edu: any, index: number) => (
                      <div
                        key={index}
                        className="border-b pb-4 last:border-0 last:pb-0"
                      >
                        <h3 className="font-medium">{edu.degree}</h3>
                        <p className="text-sm text-muted-foreground">
                          {edu.institution}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {edu.startMonth} {edu.startYear} -{" "}
                          {edu.current ? "Present" : `${edu.endMonth} ${edu.endYear}`}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No education added yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            {profile.achievements && profile.achievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.achievements.map((ach: any, index: number) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{ach.title}</CardTitle>
                      <CardDescription>{ach.type}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {ach.image && (
                        <div className="mb-3 h-32 w-full relative">
                          <Image
                            src={ach.image || "/placeholder.svg"}
                            alt={ach.title}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground mb-2">
                        {formatDate(ach.date)}
                      </p>
                      <p className="text-sm">{ach.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No achievements added yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
