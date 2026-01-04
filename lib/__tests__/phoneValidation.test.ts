import { validatePhone, formatPhoneNumber } from '../phoneValidation'

describe('validatePhone', () => {
  describe('valid phone numbers', () => {
    it('should accept valid 10-digit phone number', () => {
      const result = validatePhone('1234567890')
      expect(result.valid).toBe(true)
      expect(result.formatted).toBe('(123) 456-7890')
      expect(result.error).toBeUndefined()
    })

    it('should accept 11-digit phone number with country code', () => {
      const result = validatePhone('11234567890')
      expect(result.valid).toBe(true)
      expect(result.formatted).toBe('(112) 345-6789')
    })

    it('should accept phone number with formatting characters', () => {
      const result = validatePhone('(123) 456-7890')
      expect(result.valid).toBe(true)
      expect(result.formatted).toBe('(123) 456-7890')
    })

    it('should accept phone number with dashes', () => {
      const result = validatePhone('123-456-7890')
      expect(result.valid).toBe(true)
      expect(result.formatted).toBe('(123) 456-7890')
    })

    it('should accept phone number with dots', () => {
      const result = validatePhone('123.456.7890')
      expect(result.valid).toBe(true)
      expect(result.formatted).toBe('(123) 456-7890')
    })

    it('should accept phone number with spaces', () => {
      const result = validatePhone('123 456 7890')
      expect(result.valid).toBe(true)
      expect(result.formatted).toBe('(123) 456-7890')
    })

    it('should accept phone number with mixed formatting', () => {
      const result = validatePhone('+1 (123) 456-7890')
      expect(result.valid).toBe(true)
      expect(result.formatted).toBe('(112) 345-6789')
    })
  })

  describe('invalid phone numbers', () => {
    it('should reject phone number with less than 10 digits', () => {
      const result = validatePhone('123456789')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Please enter a valid 10-digit phone number')
      expect(result.formatted).toBeUndefined()
    })

    it('should reject phone number with only 9 digits', () => {
      const result = validatePhone('12345678')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Please enter a valid 10-digit phone number')
    })

    it('should reject phone number with more than 11 digits', () => {
      const result = validatePhone('123456789012')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Phone number is too long')
      expect(result.formatted).toBeUndefined()
    })

    it('should reject empty string', () => {
      const result = validatePhone('')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Please enter a valid 10-digit phone number')
    })

    it('should reject phone number with only special characters', () => {
      const result = validatePhone('()---')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Please enter a valid 10-digit phone number')
    })
  })

  describe('edge cases', () => {
    it('should handle phone number with letters by treating them as non-digits', () => {
      const result = validatePhone('123ABC7890')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Please enter a valid 10-digit phone number')
    })

    it('should handle phone number with only letters', () => {
      const result = validatePhone('ABCDEFGHIJ')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Please enter a valid 10-digit phone number')
    })

    it('should accept exactly 10 digits', () => {
      const result = validatePhone('0000000000')
      expect(result.valid).toBe(true)
      expect(result.formatted).toBe('(000) 000-0000')
    })

    it('should accept exactly 11 digits', () => {
      const result = validatePhone('10000000000')
      expect(result.valid).toBe(true)
      expect(result.formatted).toBe('(100) 000-0000')
    })
  })
})

describe('formatPhoneNumber', () => {
  it('should format 10-digit phone number', () => {
    const result = formatPhoneNumber('1234567890')
    expect(result).toBe('(123) 456-7890')
  })

  it('should format phone number with existing formatting', () => {
    const result = formatPhoneNumber('123-456-7890')
    expect(result).toBe('(123) 456-7890')
  })

  it('should return partial input if less than 10 digits', () => {
    const result = formatPhoneNumber('12345')
    expect(result).toBe('12345')
  })

  it('should return empty string for empty input', () => {
    const result = formatPhoneNumber('')
    expect(result).toBe('')
  })

  it('should format only first 10 digits for longer input', () => {
    const result = formatPhoneNumber('12345678901234')
    expect(result).toBe('(123) 456-7890')
  })

  it('should strip non-digit characters before formatting', () => {
    const result = formatPhoneNumber('(555) 123-4567')
    expect(result).toBe('(555) 123-4567')
  })

  it('should handle partial input gracefully', () => {
    expect(formatPhoneNumber('1')).toBe('1')
    expect(formatPhoneNumber('12')).toBe('12')
    expect(formatPhoneNumber('123')).toBe('123')
    expect(formatPhoneNumber('1234')).toBe('1234')
    expect(formatPhoneNumber('12345')).toBe('12345')
    expect(formatPhoneNumber('123456')).toBe('123456')
    expect(formatPhoneNumber('1234567')).toBe('1234567')
    expect(formatPhoneNumber('12345678')).toBe('12345678')
    expect(formatPhoneNumber('123456789')).toBe('123456789')
    expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890')
  })

  it('should handle special characters mixed with digits', () => {
    const result = formatPhoneNumber('555-123-4567')
    expect(result).toBe('(555) 123-4567')
  })
})
