"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, BookOpen, Users, Mail, Globe2 } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { courses } from "@/data/courses"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getCourses } from "@/lib/courses"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

interface TeacherProfile {
  firstName: string
  lastName: string
  email: string
  image: string
  onboarding?: {
    teacher?: {
      yearsTeaching: string
      currentInstitution: string
      teachingPhilosophy: string
      subjects: string[]
      primaryLanguage: string
      expertise: string[]
      availability: string
      teachingStyle: string[]
      additionalInfo?: string
    }
  }
}

export default function TeacherProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<TeacherProfile | null>(null)
  const [teacherCourses, setTeacherCourses] = useState(courses)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile")
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile)
      if (parsedProfile.role !== "teacher") {
        router.push("/customer")
        return
      }
      setProfile(parsedProfile)

      // Filter courses by teacher name using getCourses() to get the latest courses
      const allCourses = getCourses()
      const filteredCourses = allCourses.filter(
        (course) => course.instructor === `${parsedProfile.firstName} ${parsedProfile.lastName}`,
      )
      setTeacherCourses(filteredCourses)
    } else {
      router.push("/sign-in")
    }
    setIsLoading(false)
  }, [router])

  if (isLoading || !profile || !profile.onboarding?.teacher) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-purple-100 dark:from-[#1a0033] dark:to-black">
        <SiteHeader />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  const teacherInfo = profile.onboarding.teacher

  const handleRemoveCourse = (courseId: string) => {
    try {
      // Get current courses from storage
      const allCourses = getCourses()
      // Filter out the course to be removed
      const updatedCourses = allCourses.filter((course) => course.id !== courseId)

      // Update localStorage
      localStorage.setItem("net3almo-courses", JSON.stringify(updatedCourses))

      // Update state to reflect changes
      setTeacherCourses((prevCourses) => prevCourses.filter((course) => course.id !== courseId))

      toast.success("Course removed successfully")
    } catch (error) {
      console.error("Error removing course:", error)
      toast.error("Failed to remove course")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-100 dark:from-[#1a0033] dark:to-black">
      <SiteHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Teacher Profile Card */}
          <div className="md:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="relative pb-0">
                <div className="w-full h-32 bg-gradient-to-r from-purple-500 to-purple-700 rounded-t-lg" />
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                  <div className="relative w-24 h-24 rounded-full border-4 border-background overflow-hidden">
                    <Image src={profile.image || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-16 text-center">
                <h2 className="text-2xl font-bold mb-1">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-muted-foreground mb-4">{teacherInfo.currentInstitution}</p>

                <div className="flex items-center justify-center gap-2 mb-6">
                  <Badge variant="secondary">{teacherInfo.yearsTeaching} Experience</Badge>
                  <Badge variant="secondary">{teacherInfo.primaryLanguage}</Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Globe2 className="w-4 h-4 text-primary" />
                    <span>{teacherInfo.primaryLanguage} (Primary Teaching Language)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>Available {teacherInfo.availability}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Areas of Expertise</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {(teacherInfo.expertise || []).map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Teaching Style</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {(teacherInfo.teachingStyle || []).map((style) => (
                      <Badge key={style} variant="outline">
                        {style}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-6 text-left">
                  <h3 className="font-semibold mb-2">Teaching Philosophy</h3>
                  <p className="text-sm text-muted-foreground">{teacherInfo.teachingPhilosophy}</p>
                </div>

                {teacherInfo.additionalInfo && (
                  <div className="mt-6 text-left">
                    <h3 className="font-semibold mb-2">Additional Information</h3>
                    <p className="text-sm text-muted-foreground">{teacherInfo.additionalInfo}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Teacher Stats and Courses */}
          <div className="md:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <BookOpen className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{teacherCourses.length}</p>
                      <p className="text-sm text-muted-foreground">Courses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Users className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">
                        {teacherCourses.reduce(
                          (total, course) => total + Number.parseInt(course.students.replace(/[^0-9]/g, "")),
                          0,
                        )}
                        k+
                      </p>
                      <p className="text-sm text-muted-foreground">Students</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Star className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">
                        {teacherCourses.length > 0
                          ? (
                              teacherCourses.reduce((total, course) => total + course.rating, 0) / teacherCourses.length
                            ).toFixed(1)
                          : "0.0"}
                      </p>
                      <p className="text-sm text-muted-foreground">Avg. Rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Teaching Subjects</h2>
              <div className="flex flex-wrap gap-2">
                {(teacherInfo.subjects || []).map((subject) => (
                  <Badge key={subject} className="text-sm">
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Your Courses ({teacherCourses.length})</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teacherCourses.length > 0 ? (
                  teacherCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative aspect-video">
                        <Image
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{course.category}</Badge>
                          <span className="text-sm text-muted-foreground">{course.students} students</span>
                        </div>
                        <h3 className="font-semibold mb-2">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{course.description}</p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-primary text-primary" />
                            <span>{course.rating}</span>
                          </div>
                          <span>{course.duration}</span>
                        </div>
                        <div className="mt-2 text-sm font-semibold text-primary">${course.price}</div>
                        <div className="flex gap-2 mt-4">
                          <Link href={`/courses/${course.id}`} className="flex-1">
                            <Button className="w-full">View Course</Button>
                          </Link>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="destructive" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Remove Course</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to remove "{course.title}"? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="mt-4">
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    document
                                      .querySelector('[role="dialog"]')
                                      ?.querySelector('button[aria-label="Close"]')
                                      ?.click()
                                  }
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => {
                                    handleRemoveCourse(course.id)
                                    document
                                      .querySelector('[role="dialog"]')
                                      ?.querySelector('button[aria-label="Close"]')
                                      ?.click()
                                  }}
                                >
                                  Remove
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8">
                    <p className="text-muted-foreground">You haven't created any courses yet.</p>
                    <Button className="mt-4" onClick={() => router.push("/create-course")}>
                      Create Your First Course
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

