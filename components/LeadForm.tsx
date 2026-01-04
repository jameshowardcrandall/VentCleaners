'use client'
import { useState, FormEvent, ChangeEvent } from 'react'
import { validatePhone, formatPhoneNumber } from '@/lib/phoneValidation'
import SuccessModal from './SuccessModal'
import LoadingSpinner from './LoadingSpinner'

interface LeadFormProps {
  variant: 'a' | 'b'
  visitorId: string
  ctaCopy: { buttonText: string }
}

export default function LeadForm({ variant, visitorId, ctaCopy }: LeadFormProps) {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submittedPhone, setSubmittedPhone] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
    setError('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const validation = validatePhone(phone)
    if (!validation.valid) {
      setError(validation.error!)
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: validation.formatted,
          variant,
          visitorId,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer || 'direct',
          url: window.location.href,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Submission failed')

      // Track conversion
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'conversion',
          variant,
          visitorId,
          phone: validation.formatted,
          convertedAt: new Date().toISOString(),
        }),
        keepalive: true,
      })

      setSubmittedPhone(validation.formatted!)
      setSuccess(true)
      setPhone('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="tel"
          value={phone}
          onChange={handleChange}
          placeholder="(555) 123-4567"
          className="w-full px-6 py-4 text-lg border-2 border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : ctaCopy.buttonText}
        </button>
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
      </form>
      {loading && <LoadingSpinner />}
      {success && <SuccessModal phone={submittedPhone} onClose={() => setSuccess(false)} />}
    </>
  )
}
