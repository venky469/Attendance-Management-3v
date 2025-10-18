
import { io, type Socket } from "socket.io-client"
import type { AttendanceUpdateEvent, StatsUpdateEvent } from "./socket"

class SocketClient {
  private socket: Socket | null = null
  private static instance: SocketClient

  static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient()
    }
    return SocketClient.instance
  }

  connect() {
    if (this.socket?.connected) return this.socket

    this.socket = io({
      path: "/api/socketio",
      addTrailingSlash: false,
    })

    this.socket.on("connect", () => {
      console.log("[Socket.io Client] Connected:", this.socket?.id)
      this.socket?.emit("join_attendance_room")
    })

    this.socket.on("disconnect", () => {
      console.log("[Socket.io Client] Disconnected")
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  onAttendanceUpdate(callback: (event: AttendanceUpdateEvent) => void) {
    this.socket?.on("attendance_update", callback)
  }

  onStatsUpdate(callback: (event: StatsUpdateEvent) => void) {
    this.socket?.on("stats_update", callback)
  }

  emitAttendanceUpdate(event: AttendanceUpdateEvent) {
    this.socket?.emit("attendance_update", event)
  }

  emitStatsUpdate(event: StatsUpdateEvent) {
    this.socket?.emit("stats_update", event)
  }

  getSocket() {
    return this.socket
  }
}

const socketClient = SocketClient.getInstance()
export const socket = socketClient.connect()

export default SocketClient
