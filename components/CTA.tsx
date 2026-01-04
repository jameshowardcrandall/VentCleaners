import LeadForm from './LeadForm'

interface CTAProps {
  copy: {
    heading: string
    subtext: string
    buttonText: string
    trustText: string
  }
  variant: 'a' | 'b'
  visitorId: string
}

export default function CTA({ copy, variant, visitorId }: CTAProps) {
  return (
    <section className="py-24 bg-gradient-to-br from-green-900 to-green-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-10" />
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
          Ready for Peace of Mind?
        </h2>
        <p className="text-xl text-green-100/80 mb-10 max-w-2xl mx-auto">
          Get your instant quote now. It takes less than 30 seconds to start protecting your home.
        </p>
        <div className="bg-white p-8 rounded-2xl max-w-md mx-auto shadow-2xl">
          <h3 className="text-2xl font-display font-bold text-foreground mb-3">
            {copy.heading}
          </h3>
          <p className="text-muted-foreground mb-6">{copy.subtext}</p>
          <LeadForm variant={variant} visitorId={visitorId} ctaCopy={copy} />
          <p className="text-sm text-muted-foreground mt-4">{copy.trustText}</p>
        </div>
      </div>
    </section>
  )
}
