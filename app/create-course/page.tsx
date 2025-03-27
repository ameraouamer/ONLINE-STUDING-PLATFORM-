"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { addCourse, type Course } from "@/lib/courses"

interface Section {
  id: string
  title: string
  video: File | null
  duration: string
}

// These categories must match exactly with the categories in the "All Courses" page
const categories = [
  "Design",
  "Development",
  "Marketing",
  "IT",
  "Software",
  "Personal Development",
  "Business",
  "Photography",
]

export default function CreateCoursePage() {
  const router = useRouter()
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    thumbnail: null as File | null,
  })
  const [sections, setSections] = useState<Section[]>([])
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCourseData((prev) => ({ ...prev, thumbnail: file }))
    }
  }

  const handleAddSection = () => {
    setSections((prev) => [...prev, { id: Math.random().toString(), title: "", video: null, duration: "" }])
  }

  const handleSectionChange = (id: string, field: keyof Section, value: any) => {
    setSections((prev) => prev.map((section) => (section.id === id ? { ...section, [field]: value } : section)))
  }

  const handleRemoveSection = (id: string) => {
    setSections((prev) => prev.filter((section) => section.id !== id))
  }

  const handlePublish = () => {
    // Validate form
    if (!courseData.title || !courseData.description || !courseData.category || !courseData.price) {
      toast.error("Please fill in all required fields")
      return
    }

    if (sections.length === 0) {
      toast.error("Please add at least one section")
      return
    }

    if (sections.some((section) => !section.title || !section.video)) {
      toast.error("Please complete all section details")
      return
    }

    setShowConfirmDialog(true)
  }

  const handleConfirmPublish = async () => {
    setIsPublishing(true)

    try {
      // Get user profile
      const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
      const instructor = `${userProfile.firstName} ${userProfile.lastName}`

      // Generate a simple ID format that's URL-friendly
      const courseId = courseData.title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now().toString().slice(-6)

      // Create new course object
      const newCourse: Course = {
        id: courseId,
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        price: Number.parseFloat(courseData.price),
        image: courseData.thumbnail ? URL.createObjectURL(courseData.thumbnail) : "/placeholder.svg",
        instructor,
        rating: 0,
        students: "0",
        duration: sections.reduce((total, section) => total + Number.parseFloat(section.duration || "0"), 0) + "h",
        sections: sections.map((section) => ({
          title: section.title,
          videoUrl: section.video ? URL.createObjectURL(section.video) : "",
        })),
        requirements: ["Basic understanding of the subject", "A computer with internet access"],
        instructorDetails: {
          bio: userProfile.bio || `${instructor} is an experienced instructor in ${courseData.category}`,
          expertise: [courseData.category],
        },
      }

      // Add the course
      addCourse(newCourse)

      toast.success("Course published successfully!")

      // Redirect to the customer page with a small delay to ensure storage is updated
      setTimeout(() => {
        router.push("/customer")
      }, 500)
    } catch (error) {
      console.error("Error publishing course:", error)
      toast.error("Failed to publish course. Please try again.")
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-100 dark:from-[#1a0033] dark:to-black p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create New Course</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  value={courseData.title}
                  onChange={(e) => setCourseData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter course title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={courseData.category}
                  onValueChange={(value) => setCourseData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Course Description</Label>
              <Textarea
                id="description"
                value={courseData.description}
                onChange={(e) => setCourseData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your course"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={courseData.price}
                  onChange={(e) => setCourseData((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="Enter course price"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Course Thumbnail</Label>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Course Sections</h3>
                <Button onClick={handleAddSection} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
              </div>

              <div className="space-y-4">
                {sections.map((section) => (
                  <Card key={section.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Section Title</Label>
                              <Input
                                value={section.title}
                                onChange={(e) => handleSectionChange(section.id, "title", e.target.value)}
                                placeholder="Enter section title"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Duration (hours)</Label>
                              <Input
                                type="number"
                                min="0"
                                step="0.5"
                                value={section.duration}
                                onChange={(e) => handleSectionChange(section.id, "duration", e.target.value)}
                                placeholder="Enter duration"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Video</Label>
                            <Input
                              type="file"
                              accept="video/*"
                              onChange={(e) =>
                                handleSectionChange(section.id, "video", e.target.files ? e.target.files[0] : null)
                              }
                              className="cursor-pointer"
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleRemoveSection(section.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button onClick={handlePublish}>Publish Course</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Publication</DialogTitle>
            <DialogDescription>
              Are you sure you want to publish this course? Once published, students will be able to enroll.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isPublishing}>
              Cancel
            </Button>
            <Button onClick={handleConfirmPublish} disabled={isPublishing}>
              {isPublishing ? "Publishing..." : "Confirm"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

