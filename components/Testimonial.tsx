import { Star } from 'lucide-react'
import Image from 'next/image'

export default function Testimonial() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            {/* Image using Unsplash */}
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative z-10">
              <Image
                src="https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?q=80&w=2070&auto=format&fit=crop"
                alt="Modern clean laundry room"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
          </div>

          <div>
            <Star className="w-12 h-12 text-accent fill-current mb-8" />
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-8 leading-tight">
              "I didn't realize how dangerous my clogged vent was until I saw what they pulled out!"
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop"
                  alt="Customer Sarah M."
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-bold text-lg">Sarah Jenkins</div>
                <div className="text-muted-foreground">Homeowner in Seattle, WA</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
