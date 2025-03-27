import { NextResponse } from "next/server"

// Store active rooms and their participants
interface Room {
  participants: Set<string>
  messages: Array<{
    id: string
    userId: string
    text: string
    timestamp: Date
  }>
  data?: {
    sessionName?: string
    description?: string
  }
  createdAt: Date
  hostId: string
}

const rooms = new Map<string, Room>()

// Clean up inactive rooms (older than 24 hours)
const cleanupInactiveRooms = () => {
  const now = new Date()
  for (const [roomId, room] of rooms.entries()) {
    const timeDiff = now.getTime() - room.createdAt.getTime()
    if (timeDiff > 24 * 60 * 60 * 1000) {
      // 24 hours
      rooms.delete(roomId)
    }
  }
}

export async function POST(req: Request) {
  try {
    const { type, roomId, userId, data } = await req.json()

    // Clean up inactive rooms periodically
    cleanupInactiveRooms()

    switch (type) {
      case "create-room": {
        if (rooms.has(roomId)) {
          return NextResponse.json({ error: "Room already exists" }, { status: 400 })
        }

        const newRoom: Room = {
          participants: new Set([userId]),
          messages: [],
          data,
          createdAt: new Date(),
          hostId: userId,
        }

        rooms.set(roomId, newRoom)

        return NextResponse.json({
          roomId,
          participants: Array.from(newRoom.participants),
          messages: newRoom.messages,
          data: newRoom.data,
          hostId: newRoom.hostId,
        })
      }

      case "join-room": {
        const room = rooms.get(roomId)
        if (!room) {
          return NextResponse.json({ error: "Room not found" }, { status: 404 })
        }

        // Add participant if not already in the room
        if (!room.participants.has(userId)) {
          room.participants.add(userId)
        }

        return NextResponse.json({
          participants: Array.from(room.participants),
          messages: room.messages,
          data: room.data,
          hostId: room.hostId,
        })
      }

      case "leave-room": {
        const room = rooms.get(roomId)
        if (room) {
          room.participants.delete(userId)
          if (room.participants.size === 0) {
            rooms.delete(roomId)
          }
        }
        return NextResponse.json({ success: true })
      }

      case "send-message": {
        const room = rooms.get(roomId)
        if (!room) {
          return NextResponse.json({ error: "Room not found" }, { status: 404 })
        }

        const message = {
          id: Date.now().toString(),
          userId,
          text: data.text,
          timestamp: new Date(),
        }

        room.messages.push(message)
        return NextResponse.json({ message })
      }

      case "get-room-info": {
        const room = rooms.get(roomId)
        if (!room) {
          return NextResponse.json({ error: "Room not found" }, { status: 404 })
        }

        return NextResponse.json({
          participants: Array.from(room.participants),
          messages: room.messages,
          data: room.data,
          hostId: room.hostId,
        })
      }

      default:
        return NextResponse.json({ error: "Invalid request type" }, { status: 400 })
    }
  } catch (error) {
    console.error("Video API Error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

