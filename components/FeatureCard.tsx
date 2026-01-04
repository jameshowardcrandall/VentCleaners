'use client'
import { motion } from 'framer-motion'
import { Flame, Zap, Clock, Check, DollarSign, Shield, Wrench } from 'lucide-react'

interface FeatureCardProps {
  icon: string
  title: string
  description: string
  delay: number
}

const iconMap = {
  flame: Flame,
  zap: Zap,
  clock: Clock,
  check: Check,
  'dollar-sign': DollarSign,
  shield: Shield,
  wrench: Wrench,
}

export default function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || Check

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow group hover:-translate-y-1 duration-300"
    >
      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <IconComponent className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-xl font-display font-bold mb-3 text-foreground">
        {title}
      </h3>
      <p className="text-muted-foreground">
        {description}
      </p>
    </motion.div>
  )
}
