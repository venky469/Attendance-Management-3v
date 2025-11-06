// export class RealtimeClient {
//   private pollingInterval: NodeJS.Timeout | null = null
//   private lastEventTime: string = new Date().toISOString()
//   private listeners: { [key: string]: Function[] } = {}
//   private isPolling = false
//   private connectionStatus: "connected" | "disconnected" | "error" = "disconnected"
//   private retryCount = 0
//   private maxRetries = 5

//   constructor(private baseUrl = "") {
//     this.baseUrl = baseUrl || (typeof window !== "undefined" ? window.location.origin : "")
//   }

//   connect() {
//     if (this.isPolling) return

//     this.isPolling = true
//     this.connectionStatus = "connected"
//     this.retryCount = 0
//     this.startPolling()
//     console.log("[Realtime] Connected via polling")
//   }

//   disconnect() {
//     if (this.pollingInterval) {
//       clearInterval(this.pollingInterval)
//       this.pollingInterval = null
//     }
//     this.isPolling = false
//     this.connectionStatus = "disconnected"
//     console.log("[Realtime] Disconnected")
//   }

//   getConnectionStatus() {
//     return this.connectionStatus
//   }

//   on(eventType: string, callback: Function) {
//     if (!this.listeners[eventType]) {
//       this.listeners[eventType] = []
//     }
//     this.listeners[eventType].push(callback)
//   }

//   off(eventType: string, callback: Function) {
//     if (this.listeners[eventType]) {
//       this.listeners[eventType] = this.listeners[eventType].filter((cb) => cb !== callback)
//     }
//   }

//   private startPolling() {
//     this.pollingInterval = setInterval(async () => {
//       try {
//         const response = await fetch(`${this.baseUrl}/api/realtime/events?since=${this.lastEventTime}`, {
//           signal: AbortSignal.timeout(10000), // 10 second timeout
//         })

//         if (!response.ok) {
//           throw new Error(`HTTP ${response.status}: ${response.statusText}`)
//         }

//         const data = await response.json()

//         if (data.events && data.events.length > 0) {
//           data.events.forEach((event: any) => {
//             this.emit(event.type, event)
//           })

//           // Update last event time
//           this.lastEventTime = data.timestamp
//         }

//         this.retryCount = 0
//         if (this.connectionStatus !== "connected") {
//           this.connectionStatus = "connected"
//           this.emit("connection_restored", { message: "Connection restored" })
//         }
//       } catch (error) {
//         console.error("[Realtime] Polling error:", error)
//         this.connectionStatus = "error"
//         this.retryCount++

//         this.emit("connection_error", {
//           error: error instanceof Error ? error.message : "Unknown error",
//           retryCount: this.retryCount,
//         })

//         if (this.retryCount >= this.maxRetries) {
//           console.error("[Realtime] Max retries reached, stopping polling")
//           this.disconnect()
//           this.emit("connection_failed", { message: "Connection failed after maximum retries" })
//         }
//       }
//     }, 2000) // Poll every 2 seconds
//   }

//   private emit(eventType: string, data: any) {
//     if (this.listeners[eventType]) {
//       this.listeners[eventType].forEach((callback) => {
//         try {
//           callback(data)
//         } catch (error) {
//           console.error("[Realtime] Listener error:", error)
//         }
//       })
//     }
//   }

//   // Emit event to server
//   async emitToServer(eventType: string, data: any) {
//     try {
//       const response = await fetch(`${this.baseUrl}/api/realtime/events`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ type: eventType, ...data }),
//         signal: AbortSignal.timeout(5000), // 5 second timeout
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`)
//       }
//     } catch (error) {
//       console.error("[Realtime] Emit error:", error)
//       throw error // Re-throw so caller can handle
//     }
//   }

//   async forceRefresh() {
//     try {
//       const response = await fetch(
//         `${this.baseUrl}/api/realtime/events?since=${new Date(Date.now() - 60000).toISOString()}`,
//         {
//           signal: AbortSignal.timeout(10000),
//         },
//       )

//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`)
//       }

//       const data = await response.json()
//       if (data.events && data.events.length > 0) {
//         data.events.forEach((event: any) => {
//           this.emit(event.type, event)
//         })
//         this.lastEventTime = data.timestamp
//       }
//       return true
//     } catch (error) {
//       console.error("[Realtime] Force refresh error:", error)
//       return false
//     }
//   }
// }

// // Export singleton instance
// export const realtimeClient = new RealtimeClient()




export class RealtimeClient {
  private pollingInterval: NodeJS.Timeout | null = null
  private lastEventTime: string = new Date().toISOString()
  private listeners: { [key: string]: Function[] } = {}
  private isPolling = false
  private connectionStatus: "connected" | "disconnected" | "error" = "disconnected"
  private retryCount = 0
  private maxRetries = 5

  constructor(private baseUrl = "") {
    this.baseUrl = baseUrl || (typeof window !== "undefined" ? window.location.origin : "")
  }

  connect() {
    if (this.isPolling) return

    this.isPolling = true
    this.connectionStatus = "connected"
    this.retryCount = 0
    this.startPolling()
    console.log("[Realtime] Connected via polling")
  }

  disconnect() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
      this.pollingInterval = null
    }
    this.isPolling = false
    this.connectionStatus = "disconnected"
    console.log("[Realtime] Disconnected")
  }

  getConnectionStatus() {
    return this.connectionStatus
  }

  on(eventType: string, callback: Function) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = []
    }
    this.listeners[eventType].push(callback)
  }

  off(eventType: string, callback: Function) {
    if (this.listeners[eventType]) {
      this.listeners[eventType] = this.listeners[eventType].filter((cb) => cb !== callback)
    }
  }

  private startPolling() {
    this.pollingInterval = setInterval(async () => {
      try {
        const response = await fetch(`${this.baseUrl}/api/realtime/events?since=${this.lastEventTime}`, {
          signal: AbortSignal.timeout(10000), // 10 second timeout
        })

        if (!response.ok) {
          console.warn(`[Realtime] Server returned ${response.status}, continuing...`)
          // Don't throw error, just log and continue polling
          return
        }

        const data = await response.json()

        if (data.events && data.events.length > 0) {
          data.events.forEach((event: any) => {
            this.emit(event.type, event)
          })

          // Update last event time
          this.lastEventTime = data.timestamp
        }

        this.retryCount = 0
        if (this.connectionStatus !== "connected") {
          this.connectionStatus = "connected"
          this.emit("connection_restored", { message: "Connection restored" })
        }
      } catch (error) {
        console.warn("[Realtime] Polling error (will retry):", error)
        this.connectionStatus = "error"
        this.retryCount++

        this.emit("connection_error", {
          error: error instanceof Error ? error.message : "Unknown error",
          retryCount: this.retryCount,
        })

        if (this.retryCount >= 10) {
          console.warn("[Realtime] Many retries, but continuing to poll...")
          this.retryCount = 0 // Reset retry count to keep trying
        }
      }
    }, 3000) // Increased to 3 seconds to reduce server load
  }

  private emit(eventType: string, data: any) {
    if (this.listeners[eventType]) {
      this.listeners[eventType].forEach((callback) => {
        try {
          callback(data)
        } catch (error) {
          console.error("[Realtime] Listener error:", error)
        }
      })
    }
  }

  // Emit event to server
  async emitToServer(eventType: string, data: any) {
    try {
      const response = await fetch(`${this.baseUrl}/api/realtime/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: eventType, ...data }),
        signal: AbortSignal.timeout(5000), // 5 second timeout
      })

      if (!response.ok) {
        console.warn(`[Realtime] Emit failed with ${response.status}`)
        return false
      }
      return true
    } catch (error) {
      console.warn("[Realtime] Emit error:", error)
      return false // Return false instead of throwing
    }
  }

  async forceRefresh() {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/realtime/events?since=${new Date(Date.now() - 60000).toISOString()}`,
        {
          signal: AbortSignal.timeout(10000),
        },
      )

      if (!response.ok) {
        console.warn(`[Realtime] Force refresh failed with ${response.status}`)
        return false
      }

      const data = await response.json()
      if (data.events && data.events.length > 0) {
        data.events.forEach((event: any) => {
          this.emit(event.type, event)
        })
        this.lastEventTime = data.timestamp
      }
      return true
    } catch (error) {
      console.warn("[Realtime] Force refresh error:", error)
      return false
    }
  }
}

// Export singleton instance
export const realtimeClient = new RealtimeClient()
