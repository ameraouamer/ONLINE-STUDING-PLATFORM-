"use client"

import { useState, useEffect, useCallback } from "react"

interface Message {
  id: string
  userId: string
  text: string
  timestamp: Date
}

interface VideoCallState {
  isConnecting: boolean
  isConnected: boolean
  error: string | null
  participants: string[]
  messages: Message[]
  hostId: string | null
}

export function useVideoCall(roomId: string, userId: string) {
  const [state, setState] = useState<VideoCallState>({
    isConnecting: true,
    isConnected: false,
    error: null,
    participants: [],
    messages: [],
    hostId: null,
  })

  const initializeCall = useCallback(async () => {
    if (!roomId || !userId) {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: "Invalid room ID or user ID",
      }))
      return
    }

    try {
      // First, check if the room exists and get its info
      const checkResponse = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "get-room-info",
          roomId,
          userId,
        }),
      })

      if (!checkResponse.ok) {
        const errorData = await checkResponse.json()
        throw new Error(errorData.error || "Failed to get room info")
      }

      // If room exists, join it
      const joinResponse = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "join-room",
          roomId,
          userId,
        }),
      })

      if (!joinResponse.ok) {
        const errorData = await joinResponse.json()
        throw new Error(errorData.error || "Failed to join room")
      }

      const data = await joinResponse.json()

      setState((prev) => ({
        ...prev,
        isConnecting: false,
        isConnected: true,
        participants: data.participants || [],
        messages: data.messages || [],
        hostId: data.hostId || null,
        error: null,
      }))

      // Set up periodic room status check
      const checkInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch("/api/video", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "get-room-info",
              roomId,
              userId,
            }),
          })

          if (!statusResponse.ok) {
            throw new Error("Room no longer available")
          }

          const statusData = await statusResponse.json()
          setState((prev) => ({
            ...prev,
            participants: statusData.participants || prev.participants,
            messages: statusData.messages || prev.messages,
          }))
        } catch (error) {
          console.error("Room status check failed:", error)
        }
      }, 5000) // Check every 5 seconds

      return () => clearInterval(checkInterval)
    } catch (error) {
      console.error("Error initializing call:", error)
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : "Failed to initialize call",
      }))
    }
  }, [roomId, userId])

  const sendMessage = useCallback(
    async (text: string) => {
      if (!state.isConnected) return

      try {
        const response = await fetch("/api/video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "send-message",
            roomId,
            userId,
            data: { text },
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to send message")
        }

        const data = await response.json()
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, data.message],
        }))
      } catch (error) {
        console.error("Error sending message:", error)
      }
    },
    [roomId, userId, state.isConnected],
  )

  const leaveCall = useCallback(async () => {
    try {
      await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "leave-room",
          roomId,
          userId,
        }),
      })
    } catch (error) {
      console.error("Error leaving call:", error)
    }
  }, [roomId, userId])

  useEffect(() => {
    const cleanup = initializeCall()
    return () => {
      cleanup?.then((cleanupFn) => cleanupFn?.())
      leaveCall()
    }
  }, [initializeCall, leaveCall])

  return {
    ...state,
    sendMessage,
    leaveCall,
  }
}

