'use client'
import { useEffect, useState } from 'react'

type Variant = 'a' | 'b'

interface ABTestInfo {
  variant: Variant
  visitorId: string
  isLoaded: boolean
}

export function useABTest(): ABTestInfo {
  const [variant, setVariant] = useState<Variant>('a')
  const [visitorId, setVisitorId] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Same logic as ab-test.js - localStorage access only on client
    const VARIANT_KEY = 'ab_variant'
    const VISITOR_ID_KEY = 'visitor_id'
    const VARIANTS: Variant[] = ['a', 'b']

    // Generate or retrieve visitor ID
    let vid = localStorage.getItem(VISITOR_ID_KEY)
    if (!vid) {
      vid = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem(VISITOR_ID_KEY, vid)
    }

    // Get or assign variant
    let v = localStorage.getItem(VARIANT_KEY) as Variant
    if (!v || !VARIANTS.includes(v)) {
      v = VARIANTS[Math.floor(Math.random() * VARIANTS.length)]
      localStorage.setItem(VARIANT_KEY, v)
    }

    setVariant(v)
    setVisitorId(vid)
    setIsLoaded(true)

    // Track impression
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'impression',
        variant: v,
        visitorId: vid,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct',
      }),
      keepalive: true,
    }).catch(console.error)
  }, [])

  return { variant, visitorId, isLoaded }
}
