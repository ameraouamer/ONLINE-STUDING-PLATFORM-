"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Star, Clock, Search, Bell, Moon, Sun, Video, BookOpen, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ProfileMenu } from "@/components/ProfileMenu"
import { useTheme } from "@/lib/theme"
import { getCourses } from "@/lib/courses"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { SiteFooter } from "@/components/site-footer"

interface Session {
  id: string
  title: string
  date: string
  time: string
  duration: string
  participants: number
  status: "upcoming" | "completed"
}

export default function CustomerPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [isTeacher, setIsTeacher] = useState(false)
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [teacherCourses, setTeacherCourses] = useState([])
  const [refreshKey, setRefreshKey] = useState(0) // Used to force refresh
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      title: "Introduction to Web Development",
      date: "2024-02-22",
      time: "10:00 AM",
      duration: "1h 30m",
      participants: 15,
      status: "upcoming",
    },
    {
      id: "2",
      title: "Advanced React Patterns",
      date: "2024-02-21",
      time: "2:00 PM",
      duration: "2h",
      participants: 12,
      status: "completed",
    },
    {
      id: "3",
      title: "JavaScript Fundamentals",
      date: "2024-02-20",
      time: "11:00 AM",
      duration: "1h",
      participants: 20,
      status: "completed",
    },
  ])
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New session scheduled",
      message: "Web Development session tomorrow at 10 AM",
      time: "2h ago",
      isRead: false,
    },
    { id: 2, title: "Session reminder", message: "React Patterns session in 1 hour", time: "5h ago", isRead: true },
    {
      id: 3,
      title: "Session feedback",
      message: "Students have left feedback on your last session",
      time: "1d ago",
      isRead: false,
    },
  ])
  const { theme, setTheme } = useTheme()

  // Force refresh when component mounts
  useEffect(() => {
    // Increment refresh key to force a re-render
    setRefreshKey((prev) => prev + 1)
  }, [])

  useEffect(() => {
    const storedUserProfile = localStorage.getItem("userProfile")
    if (storedUserProfile) {
      const userProfile = JSON.parse(storedUserProfile)
      setUserName(`${userProfile.firstName} ${userProfile.lastName}`)
      setIsTeacher(userProfile.role === "teacher")

      // Get the latest courses data
      const allCourses = getCourses()

      // For teachers, filter courses by instructor name
      if (userProfile.role === "teacher") {
        const instructorName = `${userProfile.firstName} ${userProfile.lastName}`
        const filteredCourses = allCourses.filter((course) => course.instructor === instructorName)
        setTeacherCourses(filteredCourses)
        console.log("Teacher courses:", filteredCourses)
      } else {
        // For students, show enrolled courses
        const userEnrolledCourses = allCourses.filter((course) => userProfile.enrolledCourses?.includes(course.id))
        setEnrolledCourses(userEnrolledCourses)
      }
    }
  }, []) // Removed refreshKey dependency

  const handleNotificationClick = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  // Function to manually refresh courses
  const refreshCourses = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handleLogoClick = (e) => {
    e.preventDefault()
    router.push("/customer")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-100 dark:from-[#1a0033] dark:to-black flex flex-col">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="#" onClick={handleLogoClick} className="text-2xl font-bold text-[#9333EA]">
              NET.3ALMO
            </a>
            <div className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const searchValue = (e.target as HTMLFormElement).querySelector("input")?.value
                    if (searchValue?.match(/^[a-z0-9]{9}$/)) {
                      // If input matches the meeting ID format (9 alphanumeric characters)
                      router.push(`/video-call/${searchValue}`)
                    } else {
                      // Regular search functionality
                      const searchParams = new URLSearchParams(window.location.search)
                      searchParams.set("search", searchValue || "")
                      router.push(`/courses?${searchParams.toString()}`)
                    }
                  }}
                >
                  <Input
                    type="search"
                    placeholder="Search courses or enter lecture ID..."
                    className="pl-10 pr-4 py-2 w-full border-2 border-[#9333EA] rounded-full focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </form>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isTeacher && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10"
                    >
                      <Plus className="h-4 w-4" />
                      Create New
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New</DialogTitle>
                      <DialogDescription>Choose what you want to create</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        className="h-32 flex flex-col items-center justify-center gap-2"
                        onClick={() => router.push("/create-session")}
                      >
                        <Video className="h-8 w-8" />
                        <span>Live Session</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-32 flex flex-col items-center justify-center gap-2"
                        onClick={() => router.push("/create-course")}
                      >
                        <BookOpen className="h-8 w-8" />
                        <span>New Course</span>
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Bell className="w-6 h-6 text-[#9333EA]" />
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.filter((n) => !n.isRead).length}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="flex items-start p-3 space-x-3"
                      onSelect={() => handleNotificationClick(notification.id)}
                    >
                      <div
                        className={`w-2 h-2 mt-1 rounded-full ${notification.isRead ? "bg-gray-300" : "bg-blue-500"}`}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <span className="font-semibold">{notification.title}</span>
                          <span className="text-xs text-gray-400">{notification.time}</span>
                        </div>
                        <p className="text-sm text-gray-500">{notification.message}</p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <ProfileMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Welcome back, {userName}!</h1>

        {isTeacher ? (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Your Sessions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map((session) => (
                  <Card key={session.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-lg">{session.title}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            session.status === "upcoming"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                          }`}
                        >
                          {session.status}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>
                            {session.date} at {session.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          <span>Duration: {session.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4" />
                          <span>{session.participants} participants</span>
                        </div>
                      </div>
                      {session.status === "upcoming" && (
                        <Button
                          className="w-full mt-4 bg-primary hover:bg-primary/90"
                          onClick={() => router.push("/video-call")}
                        >
                          Start Session
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Your Courses</h2>
                <Button variant="outline" onClick={refreshCourses}>
                  Refresh Courses
                </Button>
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
                        <Link href={`/courses/${course.id}`}>
                          <Button className="w-full mt-4">View Course</Button>
                        </Link>
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
        ) : (
          <div className="space-y-12">
            {/* My Courses Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">My Courses</h2>
                <Link href="/my-courses">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                    View All Courses
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {enrolledCourses.slice(0, 3).map((course) => (
                  <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative aspect-video">
                      <Image
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                        <div className="h-full bg-[#9333EA]" style={{ width: `${course.progress || 0}%` }} />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{course.instructor}</p>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-[#9333EA] text-[#9333EA]" />
                          <span>{course.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">Progress: {course.progress || 0}%</div>
                      <Link href={`/courses/${course.id}`}>
                        <Button className="w-full mt-4 bg-[#9333EA] hover:bg-[#7928CA] text-white">
                          Continue Course
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recommended Courses Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Recommended Courses</h2>
                <Link href="/courses">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                    View All Courses
                  </Button>
                </Link>
              </div>
              <div
                className="relative overflow-hidden"
                onMouseDown={(e) => {
                  const slider = e.currentTarget
                  let isDown = true
                  const startX = e.pageX - slider.offsetLeft
                  const scrollLeft = slider.scrollLeft

                  const handleMouseMove = (e: MouseEvent) => {
                    if (!isDown) return
                    e.preventDefault()
                    const x = e.pageX - slider.offsetLeft
                    const walk = (x - startX) * 2
                    slider.scrollLeft = scrollLeft - walk
                  }

                  const handleMouseUp = () => {
                    isDown = false
                    document.removeEventListener("mousemove", handleMouseMove)
                    document.removeEventListener("mouseup", handleMouseUp)
                  }

                  document.addEventListener("mousemove", handleMouseMove)
                  document.addEventListener("mouseup", handleMouseUp)
                }}
              >
                <div className="flex gap-6 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing snap-x snap-mandatory">
                  {getCourses()
                    .filter((course) => !enrolledCourses.find((ec) => ec.id === course.id))
                    .map((course) => (
                      <Card
                        key={course.id}
                        className="flex-none w-[300px] overflow-hidden hover:shadow-lg transition-shadow snap-start"
                      >
                        <div className="relative aspect-video">
                          <Image
                            src={course.image || "/placeholder.svg"}
                            alt={course.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2 line-clamp-2">{course.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{course.instructor}</p>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-[#9333EA] text-[#9333EA]" />
                              <span>{course.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{course.duration}</span>
                            </div>
                          </div>
                          <div className="mt-2 text-sm font-semibold text-primary">${course.price}</div>
                          <Link href={`/courses/${course.id}`}>
                            <Button className="w-full mt-4 bg-[#9333EA] hover:bg-[#7928CA] text-white">
                              Learn More
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}

