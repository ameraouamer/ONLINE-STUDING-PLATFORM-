"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const steps = [
  {
    title: "Educational Background",
    description: "Tell us about your education and learning goals",
    fields: [
      {
        type: "select",
        name: "educationLevel",
        label: "Current Education Level",
        options: ["High School", "Bachelor's Degree", "Master's Degree", "Ph.D.", "Other"],
      },
      {
        type: "select",
        name: "fieldOfStudy",
        label: "Field of Study",
        options: ["Computer Science", "Business", "Engineering", "Arts", "Medicine", "Other"],
      },
      {
        type: "input",
        name: "institution",
        label: "Institution Name",
        placeholder: "Enter your school or university name",
      },
    ],
  },
  {
    title: "Interests & Skills",
    description: "Help us personalize your learning experience",
    fields: [
      {
        type: "checkbox",
        name: "interests",
        label: "Areas of Interest",
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
        name: "experienceLevel",
        label: "Programming Experience",
        options: ["Beginner", "Intermediate", "Advanced", "Expert"],
      },
      {
        type: "checkbox",
        name: "goals",
        label: "Learning Goals",
        options: [
          "Career Change",
          "Skill Enhancement",
          "Personal Interest",
          "Academic Requirements",
          "Professional Certification",
        ],
      },
    ],
  },
  {
    title: "Learning Preferences",
    description: "Customize your learning environment",
    fields: [
      {
        type: "select",
        name: "preferredLanguage",
        label: "Preferred Learning Language",
        options: ["English", "French", "Arabic"],
      },
      {
        type: "checkbox",
        name: "learningStyle",
        label: "Preferred Learning Style",
        options: ["Video Lectures", "Interactive Exercises", "Reading Materials", "Project-Based", "Group Learning"],
      },
      {
        type: "select",
        name: "timeCommitment",
        label: "Weekly Time Commitment",
        options: ["1-5 hours", "5-10 hours", "10-20 hours", "20+ hours"],
      },
    ],
  },
]

export default function StudentOnboardingPage({
  params,
}: {
  params: { step: string }
}) {
  const router = useRouter()
  const currentStep = Number.parseInt(params.step)
  const step = steps[currentStep - 1]

  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    const storedData = localStorage.getItem("studentOnboarding")
    if (storedData) {
      setFormData(JSON.parse(storedData))
    }
  }, [])

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value }
      localStorage.setItem("studentOnboarding", JSON.stringify(newData))
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
      router.push(`/onboarding/student/${currentStep + 1}`)
    } else {
      const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
      localStorage.setItem(
        "userProfile",
        JSON.stringify({
          ...userProfile,
          onboarding: {
            ...userProfile.onboarding,
            student: formData,
          },
        }),
      )
      router.push("/customer")
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      router.push(`/onboarding/student/${currentStep - 1}`)
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

