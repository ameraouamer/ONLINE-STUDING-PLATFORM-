"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const steps = [
  {
    title: "Teaching Experience",
    description: "Tell us about your teaching background",
    fields: [
      {
        type: "select",
        name: "yearsTeaching",
        label: "Years of Teaching Experience",
        options: ["1-3 years", "4-6 years", "7-10 years", "10+ years"],
      },
      {
        type: "input",
        name: "currentInstitution",
        label: "Current Institution",
        placeholder: "Where do you currently teach?",
      },
      {
        type: "textarea",
        name: "teachingPhilosophy",
        label: "Teaching Philosophy",
        placeholder: "Share your approach to teaching...",
      },
    ],
  },
  {
    title: "Course Topics",
    description: "What subjects would you like to teach?",
    fields: [
      {
        type: "checkbox",
        name: "subjects",
        label: "Teaching Subjects",
        options: [
          "Web Development",
          "Mobile Development",
          "Data Science",
          "AI/Machine Learning",
          "Design",
          "Business",
          "Marketing",
          "Languages",
        ],
      },
      {
        type: "select",
        name: "primaryLanguage",
        label: "Primary Teaching Language",
        options: ["English", "French", "Arabic"],
      },
      {
        type: "checkbox",
        name: "expertise",
        label: "Areas of Expertise",
        options: [
          "Frontend Development",
          "Backend Development",
          "Database Design",
          "UI/UX Design",
          "Project Management",
          "Digital Marketing",
        ],
      },
    ],
  },
  {
    title: "Teaching Preferences",
    description: "Set up your teaching environment",
    fields: [
      {
        type: "select",
        name: "availability",
        label: "Weekly Availability",
        options: ["5-10 hours", "10-20 hours", "20-30 hours", "30+ hours"],
      },
      {
        type: "checkbox",
        name: "teachingStyle",
        label: "Preferred Teaching Methods",
        options: [
          "Live Sessions",
          "Pre-recorded Videos",
          "Interactive Workshops",
          "Project-Based Learning",
          "One-on-One Mentoring",
        ],
      },
      {
        type: "textarea",
        name: "additionalInfo",
        label: "Additional Information",
        placeholder: "Any other details you'd like to share...",
      },
    ],
  },
]

export default function TeacherOnboardingPage({
  params,
}: {
  params: { step: string }
}) {
  const router = useRouter()
  const currentStep = Number.parseInt(params.step)
  const step = steps[currentStep - 1]

  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    const storedData = localStorage.getItem("teacherOnboarding")
    if (storedData) {
      setFormData(JSON.parse(storedData))
    }
  }, [])

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value }
      localStorage.setItem("teacherOnboarding", JSON.stringify(newData))
      return newData
    })
  }

  const handleNext = () => {
    // Check if all required fields are filled
    const requiredFields = step.fields.filter((field) => field.type === "select").map((field) => field.name)

    const hasEmptyRequiredFields = requiredFields.some((fieldName) => !formData[fieldName])

    if (hasEmptyRequiredFields) {
      alert("Please fill in all required fields")
      return
    }

    if (currentStep < steps.length) {
      router.push(`/onboarding/teacher/${currentStep + 1}`)
    } else {
      // Update user profile with onboarding data
      const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
      localStorage.setItem(
        "userProfile",
        JSON.stringify({
          ...userProfile,
          onboarding: {
            ...userProfile.onboarding,
            teacher: formData,
          },
        }),
      )
      router.push("/customer")
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      router.push(`/onboarding/teacher/${currentStep - 1}`)
    } else {
      router.push("/onboarding")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-100 dark:from-[#1a0033] dark:to-black">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-center mb-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full mx-2 ${
                    index + 1 <= currentStep ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                  }`}
                />
              ))}
            </div>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader className="text-center">
                  <h2 className="text-3xl font-bold mb-2">{step.title}</h2>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {step.fields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <Label>{field.label}</Label>
                      {field.type === "select" && (
                        <Select
                          value={formData[field.name] || ""}
                          onValueChange={(value) => handleInputChange(field.name, value)}
                          required
                        >
                          <SelectTrigger className={!formData[field.name] ? "border-red-500" : ""}>
                            <SelectValue placeholder={`Select ${field.label}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {field.type === "input" && (
                        <Input
                          placeholder={field.placeholder}
                          value={formData[field.name] || ""}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                        />
                      )}
                      {field.type === "textarea" && (
                        <Textarea
                          placeholder={field.placeholder}
                          value={formData[field.name] || ""}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          className="min-h-[100px]"
                        />
                      )}
                      {field.type === "checkbox" && (
                        <div className="grid grid-cols-2 gap-4">
                          {field.options.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${field.name}-${option}`}
                                checked={(formData[field.name] || []).includes(option)}
                                onCheckedChange={(checked) => {
                                  const currentValues = formData[field.name] || []
                                  const newValues = checked
                                    ? [...currentValues, option]
                                    : currentValues.filter((v) => v !== option)
                                  handleInputChange(field.name, newValues)
                                }}
                              />
                              <label htmlFor={`${field.name}-${option}`} className="text-sm">
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="flex justify-between pt-6">
                    <Button variant="outline" onClick={handleBack}>
                      Back
                    </Button>
                    <Button onClick={handleNext}>{currentStep === steps.length ? "Complete" : "Next"}</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

