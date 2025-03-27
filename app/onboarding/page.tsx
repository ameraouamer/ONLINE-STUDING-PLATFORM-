"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { GraduationCap, Users, Briefcase } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const roles = [
  {
    id: "student",
    title: "Student",
    description: "I want to learn new skills and advance my education",
    icon: GraduationCap,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "teacher",
    title: "Teacher",
    description: "I want to share my knowledge and teach others",
    icon: Users,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "professional",
    title: "Professional",
    description: "I want to mentor others and share industry expertise",
    icon: Briefcase,
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role)
    // Store the selected role in localStorage
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        ...userProfile,
        role: role,
      }),
    )
    // Redirect to the appropriate onboarding flow
    router.push(`/onboarding/${role}/1`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-100 dark:from-[#1a0033] dark:to-black">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl font-bold mb-4">Welcome to NET3ALMO</h1>
            <p className="text-xl text-muted-foreground mb-12">Tell us a bit about yourself to get started</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedRole === role.id ? "border-primary ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handleRoleSelect(role.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="mb-6">
                      <role.icon className="w-12 h-12 mx-auto text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
                    <Button variant={selectedRole === role.id ? "default" : "outline"} className="w-full">
                      Select
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

