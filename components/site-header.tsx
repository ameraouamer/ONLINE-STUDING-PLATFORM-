"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/theme"
import { courses } from "@/data/courses"

export function SiteHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const searchRef = useRef(null)

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem("isAuthenticated") === "true"
    setIsAuthenticated(authStatus)

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      setSearchResults([])
      setShowDropdown(false)
      return
    }

    // Only search in course titles, case-insensitive
    const filteredCourses = courses.filter((course) => course.title.toLowerCase().includes(query.toLowerCase()))
    setSearchResults(filteredCourses)
    setShowDropdown(true)
  }

  const handleCourseSelect = (courseId) => {
    setShowDropdown(false)
    setSearchQuery("")
    router.push(`/courses/${courseId}`)
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const handleLogoClick = (e) => {
    e.preventDefault()
    if (isAuthenticated) {
      router.push("/customer")
    } else {
      router.push("/")
    }
  }

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a href="#" onClick={handleLogoClick} className="text-2xl font-bold text-primary">
            NET.3ALMO
          </a>
          <div className="flex-1 max-w-2xl mx-4" ref={searchRef}>
            <div className="relative">
              <Input
                type="search"
                placeholder="Search courses..."
                className="pl-10 pr-4 py-2 w-full border-2 border-primary rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              {showDropdown && searchResults.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-background border border-border rounded-md shadow-lg max-h-[60vh] overflow-y-auto">
                  {searchResults.map((course) => (
                    <div
                      key={course.id}
                      className="px-4 py-3 hover:bg-purple-200 dark:hover:bg-purple-800 cursor-pointer border-b border-border last:border-0"
                      onClick={() => handleCourseSelect(course.id)}
                    >
                      <div className="font-medium">{course.title}</div>
                    </div>
                  ))}
                </div>
              )}
              {showDropdown && searchResults.length === 0 && (
                <div className="absolute z-50 w-full mt-2 bg-background border border-border rounded-md shadow-lg p-4 text-center text-muted-foreground">
                  No courses found
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <Link href="/sign-in">
              <Button variant="ghost" className="text-primary hover:bg-primary/10">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

