"use client";

import { useState, useEffect } from "react";
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
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Mail,
  Calendar,
  Edit,
  X,
  Upload,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import Image from "next/image";
import { Badge } from "@/src/components/ui/badge";
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
import { Button } from "@/src/components/ui/button";
import { updateUserProfile } from "../../api/user";

function EditProfile({
  isCurrentUser,
  editedProfile,
  setEditedProfile,
  setProfile,
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editTab, setEditTab] = useState("basic");

  const [newSkill, setNewSkill] = useState("");
  const [newExperience, setNewExperience] = useState({
    jobTitle: "",
    company: "",
    description: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    current: false,
  });
  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    current: false,
  });
  const [newAchievement, setNewAchievement] = useState({
    title: "",
    type: "",
    description: "",
    year: "",
    image: "", // Will be used for preview URL
    imageFile: null, // Will store the actual file
  });

  // const handleSaveProfile = () => {
  //   // In a real app, you would send this to an API
  //   // For demo purposes, we'll just update localStorage
  //   if (isCurrentUser) {
  //     localStorage.setItem("user", JSON.stringify(editedProfile));
  //     setProfile(editedProfile);
  //   }
  //   setIsEditDialogOpen(false);
  // };

  // const handleSaveProfile = async (e: React.FormEvent) => {
  //   try {
  //     const formData = new FormData();
  //     const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  //     // Basic fields
  //     formData.append("fullName", editedProfile.fullName);
  //     formData.append("graduationYear", editedProfile.graduationYear.toString());
  //     formData.append("role", currentUser.role);
  //     formData.append("branch", editedProfile.branch);
  //     formData.append("jobTitle", editedProfile.currentJob);
  //     formData.append("location", editedProfile.location);
  //     formData.append("bio", editedProfile.bio);
  //     formData.append("linkedIn", editedProfile.linkedinUrl);

  //     // Files
  //     if (editedProfile.profileImageFile instanceof File) {
  //       formData.append("profileImage", editedProfile.profileImageFile);
  //     } else if (typeof editedProfile.profileImage === "string") {
  //       console.log("THIS IS UNEXPECTED IMAGE URL ERROR IN PROFILE SETUP");
  //       formData.append("profileImage", editedProfile.profileImage);
  //     }

  //     if (editedProfile.resumeFile) {
  //       formData.append("resume", editedProfile.resumeFile);
  //     }

  //     // Arrays or nested data: stringify
  //     formData.append("experiences", JSON.stringify(editedProfile.experiences));
  //     formData.append("education", JSON.stringify(editedProfile.education));
  //     formData.append("skills", JSON.stringify(editedProfile.skills));

  //     // 🧠 Handle achievements separately
  //     const achievementsForUpload = editedProfile.achievements.map((ach) => {
  //       const { imageFile, ...rest } = ach;
  //       console.log("ac file = ",imageFile);
  //       return rest;
  //     });

  //     formData.append("achievements", JSON.stringify(achievementsForUpload));

  //     // 📦 Manually append imageFiles to 'achievementImages'
  //     editedProfile.achievements.forEach((ach) => {
  //       if (ach.imageFile instanceof File) {
  //         formData.append("achievementImages", ach.imageFile);
  //       }
  //     });

  //     console.log("Formdata being sent = ", formData);

  //     // 🚀 Submit form data
  //     const response = await updateUserProfile(formData);

  //     if (response) {
  //       console.log("Profile update response:", response);
  //       localStorage.setItem("user", JSON.stringify(response.data));
  //       setProfile(response.data);
  //     }

  //   } catch (err) {
  //     console.log("Failed to save profile. Please try again. = ", err);
  //   } finally {
  //     setIsEditDialogOpen(false);
  //   }
  // };
  const handleSaveProfile = async (e: React.FormEvent) => {
    try {
      const formData = new FormData();
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

      // Basic fields with null/undefined checks
      formData.append("fullName", editedProfile.fullName || "");
      formData.append(
        "graduationYear",
        (editedProfile.graduationYear || "").toString()
      );
      formData.append("role", currentUser.role || "");
      formData.append("branch", editedProfile.branch || "");
      formData.append("jobTitle", editedProfile.currentJob || "");
      formData.append("location", editedProfile.location || "");
      formData.append("bio", editedProfile.bio || "");
      formData.append("linkedIn", editedProfile.linkedinUrl || "");

      // Files with existence checks
      if (editedProfile?.profileImageFile instanceof File) {
        formData.append("profileImage", editedProfile.profileImageFile);
      } else if (
        typeof editedProfile?.profileImage === "string" &&
        editedProfile.profileImage
      ) {
        console.log("THIS IS UNEXPECTED IMAGE URL ERROR IN PROFILE SETUP");
        formData.append("profileImage", editedProfile.profileImage);
      }

      if (editedProfile?.resumeFile) {
        formData.append("resume", editedProfile.resumeFile);
      }

      // Arrays or nested data: stringify with default empty arrays
      formData.append(
        "experiences",
        JSON.stringify(editedProfile.experiences || [])
      );
      formData.append(
        "education",
        JSON.stringify(editedProfile.education || [])
      );
      formData.append("skills", JSON.stringify(editedProfile.skills || []));

      // 🧠 Handle achievements separately with null check
      const achievementsForUpload = (editedProfile.achievements || []).map(
        (ach) => {
          if (!ach) return {}; // Handle null/undefined achievement
          const { imageFile, ...rest } = ach;
          console.log("ac file = ", imageFile);
          return rest;
        }
      );

      formData.append("achievements", JSON.stringify(achievementsForUpload));

      // 📦 Manually append imageFiles to 'achievementImages' with null checks
      (editedProfile.achievements || []).forEach((ach) => {
        if (ach && ach.imageFile instanceof File) {
          formData.append("achievementImages", ach.imageFile);
        }
      });

      console.log("Formdata being sent = ", formData);

      // 🚀 Submit form data
      const response = await updateUserProfile(formData);

      if (response) {
        console.log("Profile update response:", response);
        localStorage.setItem("user", JSON.stringify(response.data || {}));
        setProfile(response.data);
      }
    } catch (err) {
      console.log("Failed to save profile. Please try again. = ", err);
    } finally {
      setIsEditDialogOpen(false);
    }
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
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
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
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        current: false,
      });
    }
  };

  const handleRemoveEducation = (index: number) => {
    const updatedEducation = [...(editedProfile.education || [])];
    updatedEducation.splice(index, 1);
    setEditedProfile({ ...editedProfile, education: updatedEducation });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a URL for preview
      const imageUrl = URL.createObjectURL(file);
      //console.log("ac file = ",file)
      setNewAchievement({
        ...newAchievement,
        image: imageUrl, // For preview
        imageFile: file, // Store the actual file
      });
    }
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
        year: "",
        image: "",
        imageFile: null,
      });
    }
  };

  const handleRemoveAchievement = (index: number) => {
    const updatedAchievements = [...(editedProfile.achievements || [])];
    updatedAchievements.splice(index, 1);
    setEditedProfile({ ...editedProfile, achievements: updatedAchievements });
  };

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
  ];

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
        <Tabs value={editTab} onValueChange={setEditTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
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
                    <SelectItem value="student">Student</SelectItem>
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
                <Label htmlFor="graduationYear">Graduation Year</Label>
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

              {editedProfile.role === "alumni" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Current Job</Label>
                    <Input
                      id="jobTitle"
                      value={editedProfile.jobTitle || ""}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          jobTitle: e.target.value,
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
                    <Label htmlFor="exp-start-month">Start Month</Label>
                    <Select
                      value={newExperience.startMonth}
                      onValueChange={(value) =>
                        setNewExperience({
                          ...newExperience,
                          startMonth: value,
                        })
                      }
                    >
                      <SelectTrigger id="exp-start-month">
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exp-start-year">Start Year</Label>
                    <Input
                      id="exp-start-year"
                      type="number"
                      min={1900}
                      max={2100}
                      value={newExperience.startYear}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          startYear: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exp-end-month">End Month</Label>
                    <Select
                      value={newExperience.endMonth}
                      onValueChange={(value) =>
                        setNewExperience({
                          ...newExperience,
                          endMonth: value,
                        })
                      }
                      disabled={newExperience.current}
                    >
                      <SelectTrigger id="exp-end-month">
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exp-end-year">End Year</Label>
                    <Input
                      id="exp-end-year"
                      type="number"
                      min={1900}
                      max={2100}
                      value={newExperience.endYear}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          endYear: e.target.value,
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
                        endMonth: checked ? "" : newExperience.endMonth,
                        endYear: checked ? "" : newExperience.endYear,
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
                  <Label htmlFor="exp-description">Description</Label>
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

                <Button type="button" onClick={handleAddExperience}>
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
                          <CardDescription>{exp.company}</CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveExperience(index)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">
                        {exp.startMonth} {exp.startYear} -{" "}
                        {exp.current
                          ? "Present"
                          : `${exp.endMonth} ${exp.endYear}`}
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
                    <Label htmlFor="edu-degree">Degree/Certificate</Label>
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
                    <Label htmlFor="edu-institution">School/University</Label>
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
                    <Label htmlFor="edu-start-month">Start Month</Label>
                    <Select
                      value={newEducation.startMonth}
                      onValueChange={(value) =>
                        setNewEducation({
                          ...newEducation,
                          startMonth: value,
                        })
                      }
                    >
                      <SelectTrigger id="edu-start-month">
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edu-start-year">Start Year</Label>
                    <Input
                      id="edu-start-year"
                      type="number"
                      min={1900}
                      max={2100}
                      value={newEducation.startYear}
                      onChange={(e) =>
                        setNewEducation({
                          ...newEducation,
                          startYear: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edu-end-month">End Month</Label>
                    <Select
                      value={newEducation.endMonth}
                      onValueChange={(value) =>
                        setNewEducation({
                          ...newEducation,
                          endMonth: value,
                        })
                      }
                      disabled={newEducation.current}
                    >
                      <SelectTrigger id="edu-end-month">
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edu-end-year">End Year</Label>
                    <Input
                      id="edu-end-year"
                      type="number"
                      min={1900}
                      max={2100}
                      value={newEducation.endYear}
                      onChange={(e) =>
                        setNewEducation({
                          ...newEducation,
                          endYear: e.target.value,
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
                        endMonth: checked ? "" : newEducation.endMonth,
                        endYear: checked ? "" : newEducation.endYear,
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

                <Button type="button" onClick={handleAddEducation}>
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
                          <CardDescription>{edu.institution}</CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveEducation(index)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {edu.startMonth} {edu.startYear} -{" "}
                        {edu.current
                          ? "Present"
                          : `${edu.endMonth} ${edu.endYear}`}
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
                        <SelectItem value="Academic">Academic</SelectItem>
                        <SelectItem value="Professional">
                          Professional
                        </SelectItem>
                        <SelectItem value="Research">Research</SelectItem>
                        <SelectItem value="Innovation">Innovation</SelectItem>
                        <SelectItem value="Leadership">Leadership</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ach-year">Year</Label>
                    <Input
                      id="ach-year"
                      type="number"
                      min={1900}
                      max={2100}
                      value={newAchievement.year}
                      onChange={(e) =>
                        setNewAchievement({
                          ...newAchievement,
                          year: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ach-image">Image (Optional)</Label>
                    <div className="flex flex-col gap-2">
                      <Input
                        id="ach-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="cursor-pointer"
                      />
                      {newAchievement.image && (
                        <div className="h-32 w-32 relative">
                          <Image
                            src={newAchievement.image}
                            alt="Achievement preview"
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ach-description">Description</Label>
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
                <Button type="button" onClick={handleAddAchievement}>
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
                          <CardDescription>{ach.type}</CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveAchievement(index)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">
                        {ach.year}
                      </p>
                      <p className="text-sm">{ach.description}</p>
                      {ach.image && (
                        <div className="mt-2 h-20 w-20 relative">
                          <Image
                            src={ach.image}
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
          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveProfile}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default EditProfile;
