"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useVideoCall } from "@/lib/use-video-call"
import {
  Mic,
  MicOff,
  VideoIcon,
  VideoOff,
  MessageSquare,
  Users,
  Phone,
  Send,
  Settings,
  Maximize2,
  Copy,
  LayoutGrid,
  Monitor,
  Volume2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface AudioDevice {
  deviceId: string
  label: string
}

interface VideoDevice {
  deviceId: string
  label: string
}

export default function JoinVideoCallPage({ params }: { params: { meetingId: string } }) {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [isChatVisible, setIsChatVisible] = useState(true)
  const [newMessage, setNewMessage] = useState("")
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [audioDevices, setAudioDevices] = useState<AudioDevice[]>([])
  const [videoDevices, setVideoDevices] = useState<VideoDevice[]>([])
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>("")
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>("")
  const [selectedLayout, setSelectedLayout] = useState<"grid" | "spotlight">("grid")
  const [permissionError, setPermissionError] = useState<string | null>(null)

  const { isConnecting, isConnected, error, participants, messages, sendMessage, leaveCall } = useVideoCall(
    params.meetingId,
    userName,
  )

  const requestMediaPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      stream.getTracks().forEach((track) => track.stop())
      return true
    } catch (error) {
      console.error("Permission error:", error)
      return false
    }
  }

  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile")
    if (storedProfile) {
      const profile = JSON.parse(storedProfile)
      setUserName(`${profile.firstName} ${profile.lastName}`)
    }

    const initializeMedia = async () => {
      try {
        const hasPermissions = await requestMediaPermissions()
        if (!hasPermissions) {
          setPermissionError("Please allow access to camera and microphone to join the session")
          setIsMicOn(false)
          setIsCameraOn(false)
          return
        }

        const devices = await navigator.mediaDevices.enumerateDevices()
        const audioInputs = devices.filter((device) => device.kind === "audioinput")
        const videoInputs = devices.filter((device) => device.kind === "videoinput")

        setAudioDevices(
          audioInputs.map((device) => ({
            deviceId: device.deviceId,
            label: device.label || `Microphone ${audioInputs.indexOf(device) + 1}`,
          })),
        )

        setVideoDevices(
          videoInputs.map((device) => ({
            deviceId: device.deviceId,
            label: device.label || `Camera ${videoInputs.indexOf(device) + 1}`,
          })),
        )

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoInputs.length > 0 ? { deviceId: videoInputs[0].deviceId } : true,
          audio: audioInputs.length > 0 ? { deviceId: audioInputs[0].deviceId } : true,
        })

        setStream(mediaStream)
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream
        }

        if (videoInputs.length > 0) setSelectedVideoDevice(videoInputs[0].deviceId)
        if (audioInputs.length > 0) setSelectedAudioDevice(audioInputs[0].deviceId)

        setPermissionError(null)
      } catch (err) {
        console.error("Error accessing media devices:", err)
        setPermissionError("Could not access camera or microphone. Please check your device permissions.")
        setIsMicOn(false)
        setIsCameraOn(false)
      }
    }

    initializeMedia()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, []) // Removed requestMediaPermissions and stream from dependencies

  const retryMediaAccess = async () => {
    const hasPermissions = await requestMediaPermissions()
    if (hasPermissions) {
      setPermissionError(null)
      // Re-initialize media devices
      const devices = await navigator.mediaDevices.enumerateDevices()
      const audioInputs = devices.filter((device) => device.kind === "audioinput")
      const videoInputs = devices.filter((device) => device.kind === "videoinput")

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: videoInputs.length > 0 ? { deviceId: videoInputs[0].deviceId } : true,
        audio: audioInputs.length > 0 ? { deviceId: audioInputs[0].deviceId } : true,
      })

      setStream(mediaStream)
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream
      }

      setIsMicOn(true)
      setIsCameraOn(true)
      toast.success("Successfully connected to camera and microphone")
    } else {
      toast.error("Failed to get permission for camera and microphone")
    }
  }

  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !isMicOn
        setIsMicOn(!isMicOn)
      }
    }
  }

  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !isCameraOn
        setIsCameraOn(!isCameraOn)
      }
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      sendMessage(newMessage)
      setNewMessage("")
    }
  }

  const handleEndCall = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
    leaveCall()
    router.push("/customer")
  }

  const changeAudioDevice = async (deviceId: string) => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId },
        video: stream?.getVideoTracks()[0] ? { deviceId: selectedVideoDevice } : false,
      })

      // Replace audio track
      const audioTrack = stream?.getAudioTracks()[0]
      if (audioTrack) {
        stream.removeTrack(audioTrack)
        audioTrack.stop()
      }
      stream?.addTrack(newStream.getAudioTracks()[0])

      setSelectedAudioDevice(deviceId)
      toast.success("Audio device changed successfully")
    } catch (error) {
      console.error("Error changing audio device:", error)
      toast.error("Failed to change audio device")
    }
  }

  const changeVideoDevice = async (deviceId: string) => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId },
        audio: stream?.getAudioTracks()[0] ? { deviceId: selectedAudioDevice } : false,
      })

      // Replace video track
      const videoTrack = stream?.getVideoTracks()[0]
      if (videoTrack) {
        stream.removeTrack(videoTrack)
        videoTrack.stop()
      }
      stream?.addTrack(newStream.getVideoTracks()[0])

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      setSelectedVideoDevice(deviceId)
      toast.success("Video device changed successfully")
    } catch (error) {
      console.error("Error changing video device:", error)
      toast.error("Failed to change video device")
    }
  }

  const copyMeetingId = async () => {
    try {
      await navigator.clipboard.writeText(params.meetingId)
      toast.success("Meeting ID copied to clipboard")
    } catch (error) {
      toast.error("Failed to copy meeting ID")
    }
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={() => router.push("/customer")} className="w-full">
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  if (permissionError) {
    return (
      <div className="h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full space-y-4">
          <Alert variant="destructive">
            <AlertDescription>{permissionError}</AlertDescription>
          </Alert>
          <div className="space-y-2">
            <Button onClick={retryMediaAccess} className="w-full">
              Grant Permissions
            </Button>
            <Button onClick={() => router.push("/customer")} variant="outline" className="w-full">
              Return to Dashboard
            </Button>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Please make sure to allow camera and microphone access in your browser settings
          </p>
        </div>
      </div>
    )
  }

  if (isConnecting) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Joining the lecture...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-black flex">
      {/* Main Content */}
      <div className={cn("flex-1 flex flex-col transition-all duration-300", isChatVisible ? "mr-[400px]" : "")}>
        {/* Meeting Info Bar */}
        <div className="bg-background/10 backdrop-blur-sm border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-white font-semibold">Lecture Session</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/60">Meeting ID: {params.meetingId}</span>
                <Button variant="ghost" size="icon" onClick={copyMeetingId} className="text-white/60 hover:text-white">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/60">{participants.length} participant(s)</span>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div ref={videoContainerRef} className="flex-1 p-4">
          <div className="relative w-full h-full bg-gray-800 rounded-lg overflow-hidden">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-4 text-white text-sm bg-black/50 px-2 py-1 rounded-lg">
              {userName} {!isMicOn && "(Muted)"}
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
                {isCameraOn ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full hover:bg-white/10",
                  isChatVisible && "bg-primary/50 text-white hover:bg-primary/75",
                )}
                onClick={() => setIsChatVisible(!isChatVisible)}
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                <Users className="h-5 w-5" />
              </Button>

              {/* Settings Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Meeting Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Volume2 className="mr-2 h-4 w-4" />
                        <span>Audio</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          {audioDevices.map((device) => (
                            <DropdownMenuItem key={device.deviceId} onClick={() => changeAudioDevice(device.deviceId)}>
                              <span className={cn(selectedAudioDevice === device.deviceId && "font-semibold")}>
                                {device.label}
                              </span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <VideoIcon className="mr-2 h-4 w-4" />
                        <span>Video</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          {videoDevices.map((device) => (
                            <DropdownMenuItem key={device.deviceId} onClick={() => changeVideoDevice(device.deviceId)}>
                              <span className={cn(selectedVideoDevice === device.deviceId && "font-semibold")}>
                                {device.label}
                              </span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <LayoutGrid className="mr-2 h-4 w-4" />
                        <span>Layout</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem onClick={() => setSelectedLayout("grid")}>
                            <span className={cn(selectedLayout === "grid" && "font-semibold")}>Grid</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedLayout("spotlight")}>
                            <span className={cn(selectedLayout === "spotlight" && "font-semibold")}>Spotlight</span>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <Dialog>
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Monitor className="mr-2 h-4 w-4" />
                        <span>Meeting Details</span>
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Meeting Details</DialogTitle>
                        <DialogDescription>Share these details with others to join the meeting</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-2">Meeting ID</p>
                          <div className="flex items-center gap-2">
                            <Input value={params.meetingId} readOnly className="bg-muted" />
                            <Button size="icon" onClick={copyMeetingId}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">Participants ({participants.length})</p>
                          <div className="bg-muted rounded-md p-2">
                            {participants.map((participant, index) => (
                              <div key={index} className="text-sm py-1">
                                {participant}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10" onClick={toggleFullscreen}>
                <Maximize2 className="h-5 w-5" />
              </Button>

              <Button variant="destructive" size="icon" className="rounded-full" onClick={handleEndCall}>
                <Phone className="h-5 w-5 rotate-[135deg]" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 bottom-0 w-[400px] bg-background/10 backdrop-blur-sm border-l border-white/10",
          "flex flex-col transition-all duration-300",
          isChatVisible ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h2 className="font-semibold text-white">Session Chat</h2>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{message.userId}</span>
                    <span className="text-xs text-white/60">{new Date(message.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm text-white/80">{message.text}</p>
                </div>
              ))}
            </div>
          </ScrollArea>

          <Separator className="bg-white/10" />

          <form onSubmit={handleSendMessage} className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
              <Button type="submit" size="icon" variant="ghost" className="shrink-0 hover:bg-white/10">
                <Send className="h-4 w-4 text-white" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

