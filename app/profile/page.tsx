"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UserProfile {
  name: string
  email: string
  image: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    image: "/placeholder.svg?height=40&width=40",
  })
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    // In a real application, you would fetch the user's profile from an API
    const storedProfile = localStorage.getItem("userProfile")
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile))
    }
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, image: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would send this data to an API
    localStorage.setItem("userProfile", JSON.stringify(profile))
    if (password && password === confirmPassword) {
      // Update password logic would go here
      console.log("Password updated")
    }
    router.push("/customer")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center mb-4">
              <Image
                src={profile.image || "/placeholder.svg"}
                alt="Profile"
                width={100}
                height={100}
                className="rounded-full"
              />
              <Label htmlFor="image-upload" className="cursor-pointer mt-2 text-sm text-[#9333EA]">
                Change Profile Picture
              </Label>
              <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="password">New Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full bg-[#9333EA] hover:bg-[#7928CA] text-white">
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

