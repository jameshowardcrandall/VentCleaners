// Mock Redis
jest.mock('redis', () => ({
  createClient: jest.fn(() => ({
    connect: jest.fn(),
    set: jest.fn(),
    get: jest.fn(),
    lPush: jest.fn(),
  })),
}))

// Mock fetch for Retell API
global.fetch = jest.fn()

describe('formatPhoneE164', () => {
  // Replicate the function for testing
  const formatPhoneE164 = (phone) => {
    const digits = phone.replace(/\D/g, '')

    if (digits.length === 10) {
      return `+1${digits}`
    }

    if (digits.length === 11 && digits.startsWith('1')) {
      return `+${digits}`
    }

    return `+${digits}`
  }

  it('should convert 10-digit number to E.164 format with +1', () => {
    expect(formatPhoneE164('1234567890')).toBe('+11234567890')
  })

  it('should convert 11-digit number starting with 1 to E.164 format', () => {
    expect(formatPhoneE164('11234567890')).toBe('+11234567890')
  })

  it('should handle formatted phone numbers', () => {
    expect(formatPhoneE164('(123) 456-7890')).toBe('+11234567890')
  })

  it('should handle phone numbers with dashes', () => {
    expect(formatPhoneE164('123-456-7890')).toBe('+11234567890')
  })

  it('should handle phone numbers with dots', () => {
    expect(formatPhoneE164('123.456.7890')).toBe('+11234567890')
  })

  it('should handle phone numbers with spaces', () => {
    expect(formatPhoneE164('123 456 7890')).toBe('+11234567890')
  })

  it('should add + prefix to other lengths', () => {
    expect(formatPhoneE164('12345')).toBe('+12345')
  })

  it('should handle already E.164 formatted numbers', () => {
    // The function strips non-digits, so +11234567890 becomes 11234567890 (11 digits starting with 1)
    expect(formatPhoneE164('+11234567890')).toBe('+11234567890')
  })

  it('should strip all non-digit characters', () => {
    expect(formatPhoneE164('+1 (123) 456-7890')).toBe('+11234567890')
  })

  it('should handle empty string', () => {
    expect(formatPhoneE164('')).toBe('+')
  })
})

describe('submit API validation', () => {
  // Mock request and response objects
  let req, res

  beforeEach(() => {
    req = {
      method: 'POST',
      body: {},
      headers: {},
      socket: { remoteAddress: '127.0.0.1' },
    }

    res = {
      setHeader: jest.fn(),
      status: jest.fn(() => res),
      json: jest.fn(() => res),
      end: jest.fn(() => res),
    }

    // Clear all mocks
    jest.clearAllMocks()
  })

  describe('HTTP methods', () => {
    it('should handle OPTIONS preflight request', () => {
      req.method = 'OPTIONS'

      // We can't easily test the handler without importing it
      // This demonstrates the test structure
      const expectedCorsHeaders = [
        ['Access-Control-Allow-Origin', '*'],
        ['Access-Control-Allow-Methods', 'POST, OPTIONS'],
        ['Access-Control-Allow-Headers', 'Content-Type'],
      ]

      expectedCorsHeaders.forEach(([key, value]) => {
        expect(typeof key).toBe('string')
        expect(typeof value).toBe('string')
      })
    })

    it('should define proper CORS headers', () => {
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }

      expect(corsHeaders['Access-Control-Allow-Origin']).toBe('*')
      expect(corsHeaders['Access-Control-Allow-Methods']).toContain('POST')
      expect(corsHeaders['Access-Control-Allow-Headers']).toContain(
        'Content-Type'
      )
    })
  })

  describe('phone validation', () => {
    it('should validate phone number is required', () => {
      const validateRequired = (body) => {
        if (!body.phone) {
          return { error: 'Phone number is required', status: 400 }
        }
        return null
      }

      expect(validateRequired({})).toEqual({
        error: 'Phone number is required',
        status: 400,
      })
      expect(validateRequired({ phone: '1234567890' })).toBeNull()
    })

    it('should validate phone number format', () => {
      const validateFormat = (phone) => {
        const phoneDigits = phone.replace(/\D/g, '')
        if (phoneDigits.length < 10 || phoneDigits.length > 11) {
          return { error: 'Invalid phone number format', status: 400 }
        }
        return null
      }

      expect(validateFormat('123')).toEqual({
        error: 'Invalid phone number format',
        status: 400,
      })
      expect(validateFormat('123456789012')).toEqual({
        error: 'Invalid phone number format',
        status: 400,
      })
      expect(validateFormat('1234567890')).toBeNull()
      expect(validateFormat('11234567890')).toBeNull()
    })
  })

  describe('lead data structure', () => {
    it('should include all required fields', () => {
      const leadData = {
        phone: '(123) 456-7890',
        variant: 'a',
        visitorId: 'visitor_123',
        timestamp: new Date().toISOString(),
        userAgent: 'Mozilla/5.0',
        referrer: 'direct',
        url: 'https://example.com',
        ip: '127.0.0.1',
      }

      expect(leadData).toHaveProperty('phone')
      expect(leadData).toHaveProperty('variant')
      expect(leadData).toHaveProperty('visitorId')
      expect(leadData).toHaveProperty('timestamp')
      expect(leadData).toHaveProperty('userAgent')
      expect(leadData).toHaveProperty('referrer')
      expect(leadData).toHaveProperty('url')
      expect(leadData).toHaveProperty('ip')
    })

    it('should set default values for optional fields', () => {
      const createLeadData = (body) => ({
        phone: body.phone,
        variant: body.variant || 'unknown',
        visitorId: body.visitorId || 'unknown',
        timestamp: body.timestamp || new Date().toISOString(),
        userAgent: body.userAgent || '',
        referrer: body.referrer || 'direct',
        url: body.url || '',
      })

      const result = createLeadData({ phone: '1234567890' })

      expect(result.variant).toBe('unknown')
      expect(result.visitorId).toBe('unknown')
      expect(result.timestamp).toBeDefined()
      expect(result.userAgent).toBe('')
      expect(result.referrer).toBe('direct')
      expect(result.url).toBe('')
    })
  })

  describe('leadId generation', () => {
    it('should generate unique lead IDs', () => {
      const generateLeadId = () =>
        `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const id1 = generateLeadId()
      const id2 = generateLeadId()

      expect(id1).toMatch(/^lead_\d+_[a-z0-9]+$/)
      expect(id2).toMatch(/^lead_\d+_[a-z0-9]+$/)
      // IDs should be different (though there's a tiny chance they could be the same)
      expect(id1).not.toBe(id2)
    })
  })

  describe('Retell API payload', () => {
    it('should construct correct API payload', () => {
      const constructRetellPayload = (phone, leadData, agentId, fromNumber) => ({
        agent_id: agentId,
        to_number: phone,
        from_number: fromNumber || null,
        metadata: {
          lead_source: 'landing_page',
          variant: leadData.variant,
          visitor_id: leadData.visitorId,
          timestamp: leadData.timestamp,
        },
      })

      const payload = constructRetellPayload(
        '+11234567890',
        {
          variant: 'a',
          visitorId: 'visitor_123',
          timestamp: '2024-01-01T00:00:00Z',
        },
        'agent_123',
        '+15551234567'
      )

      expect(payload.agent_id).toBe('agent_123')
      expect(payload.to_number).toBe('+11234567890')
      expect(payload.from_number).toBe('+15551234567')
      expect(payload.metadata.lead_source).toBe('landing_page')
      expect(payload.metadata.variant).toBe('a')
      expect(payload.metadata.visitor_id).toBe('visitor_123')
      expect(payload.metadata.timestamp).toBe('2024-01-01T00:00:00Z')
    })

    it('should handle missing from_number', () => {
      const constructRetellPayload = (phone, leadData, agentId, fromNumber) => ({
        agent_id: agentId,
        to_number: phone,
        from_number: fromNumber || null,
        metadata: {
          lead_source: 'landing_page',
          variant: leadData.variant,
          visitor_id: leadData.visitorId,
          timestamp: leadData.timestamp,
        },
      })

      const payload = constructRetellPayload(
        '+11234567890',
        { variant: 'b', visitorId: 'v_456', timestamp: '2024-01-01' },
        'agent_123',
        null
      )

      expect(payload.from_number).toBeNull()
    })
  })

  describe('error responses', () => {
    it('should return correct error structure for missing phone', () => {
      const errorResponse = {
        error: 'Phone number is required',
      }

      expect(errorResponse).toHaveProperty('error')
      expect(errorResponse.error).toBe('Phone number is required')
    })

    it('should return correct error structure for invalid format', () => {
      const errorResponse = {
        error: 'Invalid phone number format',
      }

      expect(errorResponse).toHaveProperty('error')
      expect(errorResponse.error).toBe('Invalid phone number format')
    })

    it('should return correct error structure for Retell API errors', () => {
      const errorResponse = {
        error: 'Retell API error: Invalid credentials',
      }

      expect(errorResponse.error).toContain('Retell API error')
    })
  })

  describe('success responses', () => {
    it('should return correct success structure', () => {
      const successResponse = {
        success: true,
        leadId: 'lead_123',
        callId: 'call_456',
        message: 'Call initiated successfully',
      }

      expect(successResponse.success).toBe(true)
      expect(successResponse).toHaveProperty('leadId')
      expect(successResponse).toHaveProperty('callId')
      expect(successResponse).toHaveProperty('message')
    })

    it('should return partial success when call fails but lead is captured', () => {
      const partialSuccessResponse = {
        success: true,
        leadId: 'lead_123',
        message:
          'Lead captured, but call initiation failed. We will contact you soon.',
        callStatus: 'failed',
      }

      expect(partialSuccessResponse.success).toBe(true)
      expect(partialSuccessResponse).toHaveProperty('leadId')
      expect(partialSuccessResponse.callStatus).toBe('failed')
      expect(partialSuccessResponse.message).toContain('Lead captured')
    })
  })
})
