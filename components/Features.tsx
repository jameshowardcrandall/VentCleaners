import FeatureCard from './FeatureCard'
import { BenefitItem } from '@/lib/constants'

interface FeaturesProps {
  benefits: BenefitItem[]
}

export default function Features({ benefits }: FeaturesProps) {
  return (
    <section className="py-24 bg-secondary/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            Why Homeowners Trust Us
          </h2>
          <p className="text-lg text-muted-foreground">
            Don't risk a DIY disaster. Our certified technicians ensure your dryer system is running at peak performance and safety.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <FeatureCard
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
