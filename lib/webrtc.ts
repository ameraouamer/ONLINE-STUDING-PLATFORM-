// Configuration for STUN/TURN servers
export const rtcConfig = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
    // Add your TURN server configuration here
    // {
    //   urls: "turn:your-turn-server.com:3478",
    //   username: "username",
    //   credential: "password"
    // }
  ],
  iceCandidatePoolSize: 10,
}

export class WebRTCConnection {
  private peerConnection: RTCPeerConnection
  private localStream: MediaStream | null = null
  private remoteStream: MediaStream | null = null
  private onTrackCallback: ((stream: MediaStream) => void) | null = null
  private onConnectionStateCallback: ((state: RTCPeerConnectionState) => void) | null = null

  constructor() {
    this.peerConnection = new RTCPeerConnection(rtcConfig)
    this.setupPeerConnectionListeners()
  }

  private setupPeerConnectionListeners() {
    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0]
      this.onTrackCallback?.(this.remoteStream)
    }

    this.peerConnection.onconnectionstatechange = () => {
      this.onConnectionStateCallback?.(this.peerConnection.connectionState)
    }

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // Send the ICE candidate to the signaling server
        this.sendSignalingMessage({
          type: "ice-candidate",
          candidate: event.candidate,
        })
      }
    }
  }

  async initializeLocalStream(constraints: MediaStreamConstraints = { video: true, audio: true }) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints)
      this.localStream.getTracks().forEach((track) => {
        if (this.localStream) {
          this.peerConnection.addTrack(track, this.localStream)
        }
      })
      return this.localStream
    } catch (error) {
      console.error("Error accessing media devices:", error)
      throw error
    }
  }

  async createOffer() {
    try {
      const offer = await this.peerConnection.createOffer()
      await this.peerConnection.setLocalDescription(offer)
      return offer
    } catch (error) {
      console.error("Error creating offer:", error)
      throw error
    }
  }

  async handleAnswer(answer: RTCSessionDescriptionInit) {
    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
    } catch (error) {
      console.error("Error handling answer:", error)
      throw error
    }
  }

  async handleIceCandidate(candidate: RTCIceCandidateInit) {
    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
    } catch (error) {
      console.error("Error handling ICE candidate:", error)
      throw error
    }
  }

  onTrack(callback: (stream: MediaStream) => void) {
    this.onTrackCallback = callback
  }

  onConnectionState(callback: (state: RTCPeerConnectionState) => void) {
    this.onConnectionStateCallback = callback
  }

  private async sendSignalingMessage(message: any) {
    try {
      await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      })
    } catch (error) {
      console.error("Error sending signaling message:", error)
      throw error
    }
  }

  cleanup() {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
    }
    this.peerConnection.close()
  }
}

