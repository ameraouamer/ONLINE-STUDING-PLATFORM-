"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Users } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getCourses } from "@/lib/courses"

const categories = [
  {
    name: "Design",
    subcategories: ["Graphic Design", "UX/UI Design", "Web Design", "Interior Design"],
  },
  {
    name: "Development",
    subcategories: ["Web Development", "Mobile Development", "Game Development", "Software Engineering"],
  },
  {
    name: "Marketing",
    subcategories: ["Digital Marketing", "Social Media Marketing", "Content Marketing", "SEO"],
  },
  {
    name: "IT",
    subcategories: ["Network & Security", "Hardware", "Operating Systems", "IT Certifications"],
  },
  {
    name: "Software",
    subcategories: ["DevOps", "Cloud Computing", "Database Management", "System Administration"],
  },
  {
    name: "Personal Development",
    subcategories: ["Leadership", "Productivity", "Personal Finance", "Career Development"],
  },
  {
    name: "Business",
    subcategories: ["Entrepreneurship", "Management", "Sales", "Strategy"],
  },
  {
    name: "Photography",
    subcategories: ["Digital Photography", "Portrait Photography", "Commercial Photography", "Video Production"],
  },
]

const CourseCard = ({ course }) => (
  <Link href={`/courses/${course.id}`}>
    <Card className="group overflow-hidden transform hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_30px_rgba(147,51,234,0.2)]">
      <div className="relative aspect-video">
        <Image
          src={course.image || "/placeholder.svg"}
          alt={course.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white font-semibold">View Course</span>
        </div>
      </div>
      <CardContent className="p-6">
        <Badge variant="secondary" className="mb-2">
          {course.category}
        </Badge>
        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span>{course.rating}</span>
            <span className="flex items-center gap-1 ml-2">
              <Users className="w-4 h-4" />
              {course.students}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">By {course.instructor}</span>
            <span className="text-lg font-bold text-primary">${course.price}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
)

export default function CategoryPage({ params }) {
  const currentCategory = params.category
  const categoryInfo = categories.find((cat) => cat.name.toLowerCase() === currentCategory.toLowerCase())

  if (!categoryInfo) {
    return <div>Category not found</div>
  }

  const allCourses = getCourses()
  const categoryCourses = allCourses.filter((course) => {
    const courseCategory = course.category?.toLowerCase() || ""
    return (
      courseCategory.includes(currentCategory.toLowerCase()) ||
      categoryInfo.subcategories.some((sub) => courseCategory.includes(sub.toLowerCase()))
    )
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-100 dark:from-[#1a0033] dark:to-black flex flex-col">
      <SiteHeader />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">{categoryInfo.name} Courses</h1>
            <div className="flex gap-2 flex-wrap">
              {categoryInfo.subcategories.map((subcategory) => (
                <Badge key={subcategory} variant="outline">
                  {subcategory}
                </Badge>
              ))}
            </div>
          </div>

          {categoryCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No courses found in this category.</p>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

