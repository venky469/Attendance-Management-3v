export class ApiClient {
  private static defaultTimeout = 30000 // 30 seconds

  static async fetch(
    url: string,
    options: RequestInit = {},
    timeoutMs: number = this.defaultTimeout,
  ): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`Request to ${url} timed out after ${timeoutMs}ms`)
      }
      throw error
    }
  }

  static async get(url: string, timeoutMs?: number): Promise<Response> {
    return this.fetch(url, { method: "GET" }, timeoutMs)
  }

  static async post(url: string, data: any, timeoutMs?: number): Promise<Response> {
    return this.fetch(
      url,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
      timeoutMs,
    )
  }

  static async put(url: string, data: any, timeoutMs?: number): Promise<Response> {
    return this.fetch(
      url,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
      timeoutMs,
    )
  }

  static async delete(url: string, data?: any, timeoutMs?: number): Promise<Response> {
    return this.fetch(
      url,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: data ? JSON.stringify(data) : undefined,
      },
      timeoutMs,
    )
  }
}
