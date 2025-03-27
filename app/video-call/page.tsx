"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  MessageSquare,
  Users,
  Phone,
  Settings,
  X,
  Send,
  Maximize2,
} from "lucide-react"

interface Message {
  id: string
  sender: string
  text: string
  timestamp: Date
}

export default function VideoCallPage() {
  const router = useRouter()
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [participants] = useState([
    { id: "1", name: "You (Teacher)", isSpeaking: true },
    { id: "2", name: "John Doe", isSpeaking: false },
    { id: "3", name: "Jane Smith", isSpeaking: false },
  ])

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream
          }
        })
        .catch((err) => console.error("Error accessing media devices:", err))
    }
  }, [])

  const toggleMic = () => setIsMicOn(!isMicOn)
  const toggleCamera = () => setIsCameraOn(!isCameraOn)

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        })
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream
          screenStream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false)
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
              if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream
              }
            })
          }
        }
      } else {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream
          }
        })
      }
      setIsScreenSharing(!isScreenSharing)
    } catch (err) {
      console.error("Error sharing screen:", err)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const endCall = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
    }
    router.push("/customer")
  }

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: "You",
        text: newMessage,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, message])
      setNewMessage("")
    }
  }

  return (
    <div className="h-screen bg-black flex">
      {/* Main Content */}
      <div
        className={cn("flex-1 flex flex-col transition-all duration-300 ease-in-out", isChatOpen ? "mr-[320px]" : "")}
      >
        {/* Video Grid */}
        <div className="flex-1 grid grid-cols-1 gap-4 p-4">
          <div className="relative w-full h-full bg-gray-800 rounded-lg overflow-hidden">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-4 text-white text-sm bg-black/50 px-2 py-1 rounded-lg flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              You (Teacher) {!isMicOn && "(Muted)"}
            </div>
          </div>
        </div>

        {/* Control Bar */}
        <div className="bg-background/10 backdrop-blur-sm border-t border-white/10 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full hover:bg-white/10",
                  !isMicOn && "bg-red-500/50 text-white hover:bg-red-500/75",
                )}
                onClick={toggleMic}
              >
                {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full hover:bg-white/10",
                  !isCameraOn && "bg-red-500/50 text-white hover:bg-red-500/75",
                )}
                onClick={toggleCamera}
              >
                {isCameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full hover:bg-white/10",
                  isScreenSharing && "bg-primary/50 text-white hover:bg-primary/75",
                )}
                onClick={toggleScreenShare}
              >
                <ScreenShare className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full hover:bg-white/10",
                  isChatOpen && "bg-primary/50 text-white hover:bg-primary/75",
                )}
                onClick={() => setIsChatOpen(!isChatOpen)}
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                <Users className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10" onClick={toggleFullscreen}>
                <Maximize2 className="h-5 w-5" />
              </Button>
              <Button variant="destructive" size="icon" className="rounded-full" onClick={endCall}>
                <Phone className="h-5 w-5 rotate-[135deg]" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      <div
        className={cn(
          "fixed right-0 top-0 bottom-0 w-[320px] bg-background/10 backdrop-blur-sm border-l border-white/10 transition-transform duration-300 ease-in-out",
          isChatOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="h-full flex flex-col text-white">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="font-semibold">Session Chat</h2>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/10"
              onClick={() => setIsChatOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{message.sender}</span>
                    <span className="text-xs text-gray-400">{message.timestamp.toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm text-gray-200">{message.text}</p>
                </div>
              ))}
            </div>
          </ScrollArea>

          <Separator className="bg-white/10" />

          <form onSubmit={sendMessage} className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button type="submit" size="icon" variant="ghost" className="shrink-0 hover:bg-white/10">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

