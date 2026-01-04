'use client'
import { useABTest } from '@/hooks/useABTest'
import { COPY_VARIANTS } from '@/lib/constants'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Stats from '@/components/Stats'
import Testimonial from '@/components/Testimonial'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'
import CalBooking from '@/components/CalBooking'

export default function Home() {
  const { variant, visitorId, isLoaded } = useABTest()

  // Prevent flash - show loading state until variant is loaded
  if (!isLoaded) {
    return <div className="min-h-screen bg-background" />
  }

  const copy = COPY_VARIANTS[variant]

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      <Navigation />
      <Hero copy={copy.hero} ctaCopy={copy.cta} variant={variant} visitorId={visitorId} />
      <Features benefits={copy.benefits} />
      <Stats />
      <Testimonial />
      <CTA copy={copy.cta} variant={variant} visitorId={visitorId} />
      <Footer />
      <CalBooking />
    </div>
  )
}
