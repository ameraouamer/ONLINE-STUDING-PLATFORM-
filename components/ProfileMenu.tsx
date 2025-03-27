"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { LogOut, Settings, CreditCard, BookOpen, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"

interface UserProfile {
  name: string
  email: string
  image: string
  role?: string
}

export function ProfileMenu() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    image: "/placeholder.svg?height=40&width=40",
  })
  const [isTeacher, setIsTeacher] = useState(false)

  useEffect(() => {
    const updateProfile = () => {
      const storedProfile = localStorage.getItem("userProfile")
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile)
        setProfile((prevProfile) => ({
          ...prevProfile,
          image: parsedProfile.image || "/placeholder.svg?height=40&width=40",
        }))
        setIsTeacher(parsedProfile.role === "teacher")
      }
    }

    updateProfile()
    window.addEventListener("storage", updateProfile)

    return () => {
      window.removeEventListener("storage", updateProfile)
    }
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userName")
    router.push("/sign-in")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full overflow-hidden">
          <Image
            src={profile.image || "/placeholder.svg"}
            alt="Profile"
            className="rounded-full object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        {isTeacher && (
          <DropdownMenuItem onClick={() => router.push("/teacher-profile")}>
            <UserCircle className="mr-2 h-4 w-4" />
            <span>View Profile</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => router.push("/my-courses")}>
          <BookOpen className="mr-2 h-4 w-4" />
          <span>My Courses</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/membership")}>
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Membership</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/parameters")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Parameters</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

