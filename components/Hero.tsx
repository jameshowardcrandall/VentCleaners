'use client'
import { motion } from 'framer-motion'
import { ShieldCheck, Star } from 'lucide-react'
import LeadForm from './LeadForm'

interface HeroProps {
  copy: {
    title: string
    subtitle: string
  }
  ctaCopy: {
    heading: string
    subtext: string
    buttonText: string
    trustText: string
  }
  variant: 'a' | 'b'
  visitorId: string
}

export default function Hero({ copy, ctaCopy, variant, visitorId }: HeroProps) {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden" id="contact">
      {/* Abstract background shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent-foreground/90 font-medium text-sm mb-6 border border-accent/20">
              <ShieldCheck className="w-4 h-4 mr-2 text-accent" />
              #1 Rated Safety Experts
            </div>

            <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight mb-6 text-balance">
              Safe & Efficient <br />
              <span className="text-primary">Dryer Vent</span> Cleaning
            </h1>

            <p className="text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto lg:mx-0">
              {copy.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <div className="flex -space-x-3 items-center">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-background bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center text-xs font-bold overflow-hidden"
                  />
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold z-10 text-muted-foreground pl-1">
                  +2k
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex text-accent">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-foreground">Happy Customers</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <div className="bg-primary/10 text-primary-dark px-5 py-2 rounded-full font-semibold text-sm border-2 border-primary/30 whitespace-nowrap">
                ✓ Upfront Pricing
              </div>
              <div className="bg-primary/10 text-primary-dark px-5 py-2 rounded-full font-semibold text-sm border-2 border-primary/30 whitespace-nowrap">
                ✓ 100% Satisfaction Guaranteed
              </div>
              <div className="bg-primary/10 text-primary-dark px-5 py-2 rounded-full font-semibold text-sm border-2 border-primary/30 whitespace-nowrap">
                ✓ No Hidden Fees
              </div>
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
                {ctaCopy.heading}
              </h2>
              <p className="text-muted-foreground mb-6">{ctaCopy.subtext}</p>
              <LeadForm variant={variant} visitorId={visitorId} ctaCopy={ctaCopy} />
              <p className="text-sm text-muted-foreground mt-4 text-center">
                {ctaCopy.trustText}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
