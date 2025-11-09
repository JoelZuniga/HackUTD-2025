import { useEffect, useRef, useState } from 'react'

export type SentimentPoint = {
  time: number
  score: number // -1..1
}

// This hook currently generates mock data every 2s.
// Replace the internal implementation with an API/WebSocket when backend is ready.
export default function useSentimentData() {
  const [points, setPoints] = useState<SentimentPoint[]>(() => [])
  const timerRef = useRef<number | null>(null)

  // helper: floor to minute
  const floorToMinute = (ts: number) => {
    const d = new Date(ts)
    d.setSeconds(0, 0)
    return d.getTime()
  }

  useEffect(() => {
    // generate initial seed: one point per minute for last 20 minutes
    setPoints(() => {
      const now = Date.now()
      return Array.from({ length: 20 }).map((_, i) => {
        const t = floorToMinute(now - (20 - i) * 60_000)
        return { time: t, score: (Math.random() - 0.5) * 2 }
      })
    })

    // generate a raw sample every 10s, but aggregate into minute buckets
    timerRef.current = window.setInterval(() => {
      const sampleTime = Date.now()
      const sampleScore = Math.max(-1, Math.min(1, (Math.random() - 0.5) * 2))

      setPoints((prev) => {
        const next = prev.slice()
        const minute = floorToMinute(sampleTime)

        // if last point is same minute, replace/average it; else push new minute point
        if (next.length && next[next.length - 1].time === minute) {
          // replace with latest sample for less smoothing (sharper changes)
          const last = next[next.length - 1]
          last.score = sampleScore
        } else {
          next.push({ time: minute, score: sampleScore })
        }

        // keep last 60 minutes
        return next.slice(-60)
      })
    }, 10000)

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [])

  const avg = points.length ? points.reduce((s, pt) => s + pt.score, 0) / points.length : 0
  const positive = points.filter((p) => p.score > 0.2).length
  const negative = points.filter((p) => p.score < -0.2).length

  return { points, avg, positivePct: points.length ? (positive / points.length) * 100 : 0, negativePct: points.length ? (negative / points.length) * 100 : 0 }
}
