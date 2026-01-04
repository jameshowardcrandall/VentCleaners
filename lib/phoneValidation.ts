export interface PhoneValidationResult {
  valid: boolean
  error?: string
  formatted?: string
}

export function validatePhone(phone: string): PhoneValidationResult {
  const numbers = phone.replace(/\D/g, '')

  if (numbers.length < 10) {
    return { valid: false, error: 'Please enter a valid 10-digit phone number' }
  }

  if (numbers.length > 11) {
    return { valid: false, error: 'Phone number is too long' }
  }

  const formatted = `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
  return { valid: true, formatted }
}

export function formatPhoneNumber(value: string): string {
  const numbers = value.replace(/\D/g, '')

  if (numbers.length >= 10) {
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
  }

  return value
}
