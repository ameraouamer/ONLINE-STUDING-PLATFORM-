"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Check, X } from "lucide-react"

interface PasswordCriteria {
  minLength: boolean
  hasNumber: boolean
  hasUppercase: boolean
  hasLowercase: boolean
  hasSpecialChar: boolean
}

export default function SignUpPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [passwordCriteria, setPasswordCriteria] = useState<PasswordCriteria>({
    minLength: false,
    hasNumber: false,
    hasUppercase: false,
    hasLowercase: false,
    hasSpecialChar: false,
  })

  const validatePassword = (value: string) => {
    setPasswordCriteria({
      minLength: value.length >= 8,
      hasNumber: /\d/.test(value),
      hasUppercase: /[A-Z]/.test(value),
      hasLowercase: /[a-z]/.test(value),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    validatePassword(value)
  }

  const validatePhoneNumber = (value: string) => {
    // Remove any non-digit characters
    const cleaned = value.replace(/\D/g, "")
    // Format the number as (XXX) XXX-XXXX
    let formatted = cleaned
    if (cleaned.length >= 3) {
      formatted = `(${cleaned.slice(0, 3)}`
      if (cleaned.length >= 6) {
        formatted += `) ${cleaned.slice(3, 6)}`
        if (cleaned.length >= 10) {
          formatted += `-${cleaned.slice(6, 10)}`
        } else {
          formatted += `-${cleaned.slice(6)}`
        }
      } else {
        formatted += `) ${cleaned.slice(3)}`
      }
    }
    return formatted
  }

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = validatePhoneNumber(e.target.value)
    setPhoneNumber(formatted)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all criteria are met
    const allCriteriaMet = Object.values(passwordCriteria).every(Boolean)
    if (!allCriteriaMet) {
      setError("Please meet all password requirements")
      return
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Validate phone number
    const cleanedPhone = phoneNumber.replace(/\D/g, "")
    if (cleanedPhone.length !== 10) {
      setError("Please enter a valid phone number")
      return
    }

    const userData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      image: "/placeholder.svg",
      enrolledCourses: [],
    }
    localStorage.setItem("userProfile", JSON.stringify(userData))
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userName", `${firstName} ${lastName}`)
    router.push("/onboarding")
  }

  const CriteriaItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center space-x-2">
      {met ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}
      <span className={met ? "text-green-500" : "text-red-500"}>{text}</span>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-purple-100 dark:from-[#1a0033] dark:to-black p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <h2 className="text-3xl font-bold">Create an account</h2>
          <p className="text-muted-foreground">Join our community of lifelong learners</p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  id="first-name"
                  placeholder="John"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  id="last-name"
                  placeholder="Doe"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(123) 456-7890"
                required
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                maxLength={14}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={handlePasswordChange}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-medium">Password Requirements:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <CriteriaItem met={passwordCriteria.minLength} text="At least 8 characters" />
                <CriteriaItem met={passwordCriteria.hasNumber} text="Contains a number" />
                <CriteriaItem met={passwordCriteria.hasUppercase} text="Contains uppercase" />
                <CriteriaItem met={passwordCriteria.hasLowercase} text="Contains lowercase" />
                <CriteriaItem met={passwordCriteria.hasSpecialChar} text="Contains special character" />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Sign Up
            </Button>
          </CardContent>
        </form>
        <CardFooter className="text-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

