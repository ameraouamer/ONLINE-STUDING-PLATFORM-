"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, Star, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SiteFooter } from "@/components/site-footer"

const userCourses = [
  {
    title: "Frontend Web Development",
    progress: 60,
    image: "/placeholder.svg?height=400&width=600",
    instructor: "David Miller",
    duration: "40h",
    rating: 4.9,
  },
  {
    title: "UI/UX Design Fundamentals",
    progress: 30,
    image: "/placeholder.svg?height=400&width=600",
    instructor: "Sarah Anderson",
    duration: "25h",
    rating: 4.8,
  },
  {
    title: "React & Next.js Masterclass",
    progress: 15,
    image: "/placeholder.svg?height=400&width=600",
    instructor: "Michael Chen",
    duration: "35h",
    rating: 4.9,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-8">
          <Link href="/home" className="text-xl font-bold text-[#9333EA] shrink-0">
            NET.3ALMO
          </Link>
          <div className="hidden md:flex items-center flex-1 max-w-2xl relative">
            <Search className="absolute left-3 w-5 h-5 text-gray-400" />
            <Input
              type="search"
              placeholder="What do you want to learn?"
              className="pl-10 bg-gray-50 border-gray-200 focus:border-[#9333EA] focus:ring-[#9333EA]"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex gap-8">
        {/* Main Content Area */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-8">Welcome back, User!</h1>
          {/* Add your main content here */}
        </div>

        {/* Right Sidebar */}
        <div className="w-80 shrink-0">
          <div className="sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
            <div className="space-y-4">
              {userCourses.map((course, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-video">
                    <Image 
                      src={course.image || "/placeholder.svg"} 
                      alt={course.title} 
                      fill 
                      className="object-cover" 
                    />
                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                      <div 
                        className="h-full bg-[#9333EA]" 
                        style={{ width: `${course.progress}%` }} 
                      />
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
                    <div className="mt-2 text-sm text-gray-600">
                      Progress: {course.progress}%
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button 
                variant="outline" 
                className="w-full border-[#9333EA] text-[#9333EA] hover:bg-[#9333EA]/10"
              >
                View All Courses
              </Button>
              
            </div>
          </div>
        </div>
      </div>

      
    </div>
  )
}

