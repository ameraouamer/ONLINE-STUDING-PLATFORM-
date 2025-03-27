"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Clock, Search, Bell, Moon, Sun } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { getCourses } from "@/lib/courses"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ProfileMenu } from "@/components/ProfileMenu"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/lib/theme"

export default function MyCoursesPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New course available", message: "Check out our latest AI course!", time: "2h ago", isRead: false },
    {
      id: 2,
      title: "Assignment due soon",
      message: "Complete your React project by tomorrow",
      time: "5h ago",
      isRead: true,
    },
    {
      id: 3,
      title: "New message from instructor",
      message: "Sarah has left feedback on your submission",
      time: "1d ago",
      isRead: false,
    },
  ])
  const { theme, setTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = localStorage.getItem("isAuthenticated") === "true"
    if (!isAuth) {
      router.push("/sign-in?redirect=/my-courses")
      return
    }

    const storedUserProfile = localStorage.getItem("userProfile")
    if (storedUserProfile) {
      const userProfile = JSON.parse(storedUserProfile)
      setUserName(`${userProfile.firstName} ${userProfile.lastName}`)

      // Get enrolled courses
      const allCourses = getCourses()
      const userEnrolledCourses = allCourses.filter((course) => userProfile.enrolledCourses?.includes(course.id))
      setEnrolledCourses(userEnrolledCourses)
    }

    setIsLoading(false)
  }, [router])

  const handleNotificationClick = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const handleLogoClick = (e) => {
    e.preventDefault()
    router.push("/customer")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-purple-100 dark:from-[#1a0033] dark:to-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
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
                <Input
                  type="search"
                  placeholder="What do you want to learn?"
                  className="pl-10 pr-4 py-2 w-full border-2 border-[#9333EA] rounded-full focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center gap-4">
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
        <h1 className="text-3xl font-bold mb-8">My Courses</h1>
        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrolledCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-video">
                  <Image src={course.image || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
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
                    <Button className="w-full mt-4 bg-[#9333EA] hover:bg-[#7928CA] text-white">Continue Course</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-6">You are not enrolled in any courses yet.</p>
            <Link href="/courses">
              <Button className="bg-primary hover:bg-primary/90">Browse Courses</Button>
            </Link>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}

