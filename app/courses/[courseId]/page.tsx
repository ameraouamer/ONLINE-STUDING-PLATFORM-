"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Users, CheckCircle2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCourseById } from "@/lib/courses"

export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const router = useRouter()
  const [course, setCourse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null)
  const [selectedSection, setSelectedSection] = useState<number | null>(null)

  useEffect(() => {
    // Get the course from our courses library
    const foundCourse = getCourseById(params.courseId)
    setCourse(foundCourse)
    setIsLoading(false)

    // Check enrollment status
    const userProfileString = localStorage.getItem("userProfile")
    if (userProfileString) {
      try {
        const userProfile = JSON.parse(userProfileString)
        setIsEnrolled(userProfile.enrolledCourses?.includes(params.courseId) ?? false)
      } catch (error) {
        console.error("Error parsing user profile:", error)
        setIsEnrolled(false)
      }
    } else {
      setIsEnrolled(false)
    }
  }, [params.courseId])

  const handleEnroll = () => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

    if (!isAuthenticated) {
      // If not authenticated, redirect to sign-in page with redirect back to enrollment
      router.push(`/sign-in?redirect=/courses/${params.courseId}/enroll`)
      return
    }

    if (isEnrolled) {
      // If already enrolled, continue course
      setSelectedSection(0)
      window.scrollTo({
        top: document.querySelector(".lg\\:col-span-2")?.getBoundingClientRect().top + window.scrollY - 100,
        behavior: "smooth",
      })
    } else {
      // If authenticated but not enrolled, redirect to enrollment page
      router.push(`/courses/${params.courseId}/enroll`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-purple-100 dark:from-[#1a0033] dark:to-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-purple-100 dark:from-[#1a0033] dark:to-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Course Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <Button className="w-full" onClick={() => router.push("/courses")}>
              Browse All Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-b from-white to-purple-100 dark:from-[#1a0033] dark:to-black">
      <div className="relative h-[400px] bg-gradient-to-r from-purple-900 to-purple-600 dark:bg-gradient-to-r dark:from-purple-900/50 dark:to-purple-600/50">
        <Image
          src={course.image || "/placeholder.svg"}
          alt={course.title}
          fill
          className="object-cover"
          priority
          quality={80}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container mx-auto px-4 h-full flex items-center relative">
          <div className="max-w-2xl text-white">
            <Badge variant="secondary" className="mb-4">
              {course.category}
            </Badge>
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-lg mb-6">{course.description}</p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span>{course.rating} Rating</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-5 h-5" />
                <span>{course.students} Students</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-5 h-5" />
                <span>{course.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 bg-white dark:bg-transparent">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Course Content Card */}
            <Card className="mb-8 bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Course Content</h2>
                <div className="grid gap-3">
                  {course.sections.map((section, index) => (
                    <div key={index}>
                      <div
                        className={`flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer ${selectedSection === index ? "bg-gray-50 dark:bg-gray-700" : ""}`}
                        onClick={() => setSelectedSection(index === selectedSection ? null : index)}
                      >
                        <CheckCircle2 className="w-5 h-5 text-[#9333EA] mt-0.5" />
                        <span>{section.title}</span>
                      </div>
                      {selectedSection === index && (
                        <div className="ml-8 mt-2 p-3 border rounded-lg">
                          {isEnrolled ? (
                            <>
                              <h3 className="text-sm font-medium mb-2">Section Content</h3>
                              {section.videoUrl && (
                                <div className="aspect-video relative rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                                  <video
                                    src={section.videoUrl}
                                    controls
                                    className="w-full h-full"
                                    poster="/placeholder.svg?height=400&width=600"
                                  >
                                    Your browser does not support the video tag.
                                  </video>
                                </div>
                              )}
                              <p className="text-sm text-muted-foreground mt-2">
                                {section.description || "No additional description provided for this section."}
                              </p>
                            </>
                          ) : (
                            <div className="text-center py-4">
                              <h3 className="text-lg font-semibold mb-2">Content Locked</h3>
                              <p className="text-muted-foreground mb-4">
                                You need to enroll in this course to access this content.
                              </p>
                              <Button className="bg-[#9333EA] hover:bg-[#7928CA]" onClick={handleEnroll}>
                                Enroll Now
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {isEnrolled ? (
              <Card className="mb-8 bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                  <ul className="list-disc pl-5 space-y-2">
                    {course.requirements?.map((req, index) => <li key={index}>{req}</li>) || (
                      <>
                        <li>Basic understanding of the subject</li>
                        <li>A computer with internet access</li>
                      </>
                    )}
                  </ul>
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-8 bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                  <ul className="list-disc pl-5 space-y-2 opacity-75">
                    <li>Enroll to see detailed requirements</li>
                    <li>A computer with internet access</li>
                  </ul>
                </CardContent>
              </Card>
            )}

            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Instructor</h2>
                <div className="flex items-start gap-4">
                  <Image
                    src="/placeholder.svg?height=100&width=100"
                    alt={course.instructor}
                    width={100}
                    height={100}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{course.instructor}</h3>
                    <p className="text-gray-600 mb-3">
                      {course.instructorDetails?.bio ||
                        `${course.instructor} is an experienced instructor in ${course.category}`}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {course.instructorDetails?.expertise?.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      )) || <Badge variant="secondary">{course.category}</Badge>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="text-3xl font-bold mb-6">${course.price}</div>
                <Button className="w-full bg-[#9333EA] hover:bg-[#7928CA] mb-4" onClick={handleEnroll}>
                  {isEnrolled ? "Continue Course" : "Enroll Now"}
                </Button>
                <div className="text-sm text-gray-600">
                  <p className="mb-2">This course includes:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#9333EA]" />
                      {course.duration} of video content
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#9333EA]" />
                      Lifetime access
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#9333EA]" />
                      Certificate of completion
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#9333EA]" />
                      Downloadable resources
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

