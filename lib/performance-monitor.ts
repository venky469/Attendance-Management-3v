export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map()

  start(label: string): () => void {
    const startTime = performance.now()
    
    return () => {
      const duration = performance.now() - startTime
      
      if (!this.metrics.has(label)) {
        this.metrics.set(label, [])
      }
      
      const measurements = this.metrics.get(label)!
      measurements.push(duration)
      
      // Keep only last 100 measurements
      if (measurements.length > 100) {
        measurements.shift()
      }
      
      // Log if slow (> 1 second)
      if (duration > 1000) {
        console.warn(`[Performance] Slow operation: ${label} took ${duration.toFixed(2)}ms`)
      }
      
      return duration
    }
  }

  getStats(label: string) {
    const measurements = this.metrics.get(label)
    if (!measurements || measurements.length === 0) {
      return null
    }

    const sorted = [...measurements].sort((a, b) => a - b)
    const sum = sorted.reduce((acc, val) => acc + val, 0)
    
    return {
      count: measurements.length,
      avg: sum / measurements.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    }
  }

  getAllStats() {
    const stats: Record<string, any> = {}
    for (const [label, _] of this.metrics) {
      stats[label] = this.getStats(label)
    }
    return stats
  }

  reset() {
    this.metrics.clear()
  }
}

export const perfMonitor = new PerformanceMonitor()
