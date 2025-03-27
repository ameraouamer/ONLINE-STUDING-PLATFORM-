"use client"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

const categories = [
  {
    name: "Design",
    description: "Master the art of design with our comprehensive courses",
    subcategories: ["Graphic Design", "UX/UI Design", "Web Design", "Interior Design"],
  },
  {
    name: "Development",
    description: "Learn programming and software development from expert instructors",
    subcategories: ["Web Development", "Mobile Development", "Game Development", "Software Engineering"],
  },
  {
    name: "Marketing",
    description: "Develop your marketing skills with industry-leading courses",
    subcategories: ["Digital Marketing", "Social Media Marketing", "Content Marketing", "SEO"],
  },
  {
    name: "IT",
    description: "Master essential IT skills and advance your tech career",
    subcategories: ["Network & Security", "Hardware", "Operating Systems", "IT Certifications"],
  },
  {
    name: "Software",
    description: "Learn industry-standard software and tools",
    subcategories: ["DevOps", "Cloud Computing", "Database Management", "System Administration"],
  },
  {
    name: "Personal Development",
    description: "Invest in yourself with our personal development programs",
    subcategories: ["Leadership", "Productivity", "Personal Finance", "Career Development"],
  },
  {
    name: "Business",
    description: "Build your business acumen with comprehensive business courses",
    subcategories: ["Entrepreneurship", "Management", "Sales", "Strategy"],
  },
  {
    name: "Photography",
    description: "Master photography with hands-on courses from professional photographers",
    subcategories: ["Digital Photography", "Portrait Photography", "Commercial Photography", "Video Production"],
  },
]

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-100 dark:from-[#1a0033] dark:to-black flex flex-col">
      <SiteHeader />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-8 text-center">Course Categories</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link key={category.name} href={`/courses/categories/${category.name.toLowerCase()}`}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h2>
                    <p className="text-muted-foreground mb-4">{category.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {category.subcategories.map((sub) => (
                        <Badge key={sub} variant="secondary">
                          {sub}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

