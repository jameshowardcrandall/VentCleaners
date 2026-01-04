'use client'
import { motion } from 'framer-motion'

export default function Stats() {
  const stats = [
    { label: 'Vents Cleaned', value: '5,000+' },
    { label: 'Fires Prevented', value: '100%' },
    { label: 'Energy Saved', value: '$200/yr' },
    { label: 'Satisfaction', value: '5.0 ★' },
  ]

  return (
    <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="text-4xl md:text-5xl font-display font-bold mb-2">
                {stat.value}
              </div>
              <div className="text-primary-foreground/80 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
