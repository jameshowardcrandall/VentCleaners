export interface BenefitItem {
  icon: string
  title: string
  description: string
}

export interface VariantCopy {
  hero: {
    title: string
    subtitle: string
  }
  cta: {
    heading: string
    subtext: string
    buttonText: string
    trustText: string
  }
  benefits: BenefitItem[]
}

export const COPY_VARIANTS: Record<'a' | 'b', VariantCopy> = {
  a: {
    hero: {
      title: "Need Your Ducts Cleaned?",
      subtitle: "Professional dryer vent cleaning that prevents fires, cuts energy bills, and keeps your family safe.",
    },
    cta: {
      heading: "Get Your Free Quote Now",
      subtext: "Enter your phone number and we'll call you within 15 minutes",
      buttonText: "Get My Free Quote",
      trustText: "🔒 We respect your privacy. No spam, just a quick call.",
    },
    benefits: [
      {
        icon: "flame",
        title: "Fire Prevention",
        description: "Eliminate lint buildup that causes 34% of dryer fires"
      },
      {
        icon: "zap",
        title: "Save on Energy",
        description: "Reduce drying time by 50% and lower utility bills"
      },
      {
        icon: "clock",
        title: "Same-Day Service",
        description: "Fast response - most jobs completed within 24 hours"
      },
      {
        icon: "check",
        title: "Certified Experts",
        description: "Licensed, insured professionals with 10+ years experience"
      }
    ]
  },
  b: {
    hero: {
      title: "Need Your Ducts Cleaned?",
      subtitle: "Professional dryer vent cleaning delivers faster drying, lower bills, and peace of mind.",
    },
    cta: {
      heading: "Schedule Your Service Today",
      subtext: "Get a callback in 15 minutes - no commitment required",
      buttonText: "Call Me Now",
      trustText: "✓ No obligation quote • Same-day service available",
    },
    benefits: [
      {
        icon: "dollar-sign",
        title: "Lower Energy Bills",
        description: "Save up to 50% on dryer energy costs every month"
      },
      {
        icon: "zap",
        title: "Faster Drying",
        description: "Cut drying time in half - get your laundry done faster"
      },
      {
        icon: "shield",
        title: "Safety First",
        description: "Prevent dangerous lint buildup and dryer fires"
      },
      {
        icon: "wrench",
        title: "Expert Service",
        description: "Licensed professionals - same-day service available"
      }
    ]
  }
}
