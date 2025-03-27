"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function CreateSessionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const sessionName = formData.get("sessionName") as string
      const description = formData.get("description") as string
      const meetingId = Math.random().toString(36).substring(2, 15)

      // Get user profile for the host ID
      const userProfile = localStorage.getItem("userProfile")
      if (!userProfile) {
        throw new Error("User profile not found")
      }
      const { firstName, lastName } = JSON.parse(userProfile)
      const hostId = `${firstName} ${lastName}`

      // Create the room first
      const createRoomResponse = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "create-room",
          roomId: meetingId,
          userId: hostId,
          data: {
            sessionName,
            description,
          },
        }),
      })

      if (!createRoomResponse.ok) {
        const error = await createRoomResponse.json()
        throw new Error(error.error || "Failed to create session")
      }

      toast.success("Session created successfully")
      router.push(`/video-call/${meetingId}`)
    } catch (error) {
      console.error("Error creating session:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create session")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create New Session</CardTitle>
          <CardDescription>Set up a new lecture session</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sessionName">Session Name</Label>
              <Input
                id="sessionName"
                name="sessionName"
                placeholder="Enter session name"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter session description"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating..." : "Start Session"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

