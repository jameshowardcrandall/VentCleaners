import { renderHook, waitFor } from '@testing-library/react'
import { useABTest } from '../useABTest'

// Mock fetch
global.fetch = jest.fn()

describe('useABTest', () => {
  let localStorageMock: { [key: string]: string }

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    })

    // Mock localStorage
    localStorageMock = {}

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => localStorageMock[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          localStorageMock[key] = value
        }),
        removeItem: jest.fn((key: string) => {
          delete localStorageMock[key]
        }),
        clear: jest.fn(() => {
          localStorageMock = {}
        }),
      },
      writable: true,
    })
  })

  describe('visitor ID generation', () => {
    it('should generate a new visitor ID on first visit', async () => {
      const { result } = renderHook(() => useABTest())

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true)
      })

      expect(result.current.visitorId).toMatch(/^visitor_\d+_[a-z0-9]+$/)
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'visitor_id',
        expect.stringMatching(/^visitor_\d+_[a-z0-9]+$/)
      )
    })

    it('should reuse existing visitor ID', async () => {
      const existingVisitorId = 'visitor_123_abc'
      localStorageMock['visitor_id'] = existingVisitorId

      const { result } = renderHook(() => useABTest())

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true)
      })

      expect(result.current.visitorId).toBe(existingVisitorId)
    })
  })

  describe('variant assignment', () => {
    it('should assign variant A or B randomly', async () => {
      const { result } = renderHook(() => useABTest())

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true)
      })

      expect(['a', 'b']).toContain(result.current.variant)
    })

    it('should persist variant assignment in localStorage', async () => {
      const { result } = renderHook(() => useABTest())

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true)
      })

      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'ab_variant',
        expect.stringMatching(/^[ab]$/)
      )
    })

    it('should reuse existing variant assignment', async () => {
      localStorageMock['ab_variant'] = 'a'

      const { result } = renderHook(() => useABTest())

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true)
      })

      expect(result.current.variant).toBe('a')
    })

    it('should reassign variant if existing variant is invalid', async () => {
      localStorageMock['ab_variant'] = 'invalid'

      const { result } = renderHook(() => useABTest())

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true)
      })

      expect(['a', 'b']).toContain(result.current.variant)
      expect(result.current.variant).not.toBe('invalid')
    })
  })

  describe('loading state', () => {
    it('should set isLoaded to true after initialization', async () => {
      const { result } = renderHook(() => useABTest())

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true)
      })
    })

    it('should have a valid variant after loading', async () => {
      const { result } = renderHook(() => useABTest())

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true)
      })

      expect(['a', 'b']).toContain(result.current.variant)
    })
  })

  describe('impression tracking', () => {
    it('should send impression tracking event', async () => {
      const { result } = renderHook(() => useABTest())

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true)
      })

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/track',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
        })
      )
    })

    it('should include correct event data in tracking call', async () => {
      localStorageMock['ab_variant'] = 'b'
      localStorageMock['visitor_id'] = 'visitor_test_123'

      const { result } = renderHook(() => useABTest())

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true)
      })

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/track',
        expect.objectContaining({
          body: expect.stringContaining('"eventType":"impression"'),
        })
      )

      const callArgs = (global.fetch as jest.Mock).mock.calls[0]
      const body = JSON.parse(callArgs[1].body)

      expect(body).toMatchObject({
        eventType: 'impression',
        variant: 'b',
        visitorId: 'visitor_test_123',
      })
      expect(body.timestamp).toBeDefined()
      expect(body.userAgent).toBeDefined()
      expect(body.referrer).toBeDefined()
    })

    it('should handle tracking API failure gracefully', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValue(
        new Error('Network error')
      )

      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      const { result } = renderHook(() => useABTest())

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true)
      })

      // Hook should still load successfully even if tracking fails
      expect(result.current.isLoaded).toBe(true)
      expect(result.current.variant).toMatch(/^[ab]$/)

      consoleErrorSpy.mockRestore()
    })

    it('should include userAgent in tracking data', async () => {
      const mockUserAgent = 'Mozilla/5.0 Test Browser'
      Object.defineProperty(navigator, 'userAgent', {
        value: mockUserAgent,
        configurable: true,
      })

      renderHook(() => useABTest())

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })

      const callArgs = (global.fetch as jest.Mock).mock.calls[0]
      const body = JSON.parse(callArgs[1].body)

      expect(body.userAgent).toBe(mockUserAgent)
    })

    it('should include referrer in tracking data', async () => {
      Object.defineProperty(document, 'referrer', {
        value: 'https://google.com',
        configurable: true,
      })

      renderHook(() => useABTest())

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })

      const callArgs = (global.fetch as jest.Mock).mock.calls[0]
      const body = JSON.parse(callArgs[1].body)

      expect(body.referrer).toBe('https://google.com')
    })

    it('should set referrer to direct when no referrer', async () => {
      Object.defineProperty(document, 'referrer', {
        value: '',
        configurable: true,
      })

      renderHook(() => useABTest())

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })

      const callArgs = (global.fetch as jest.Mock).mock.calls[0]
      const body = JSON.parse(callArgs[1].body)

      expect(body.referrer).toBe('direct')
    })
  })

  describe('useEffect dependencies', () => {
    it('should only run effect once on mount', async () => {
      const { rerender } = renderHook(() => useABTest())

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1)
      })

      rerender()

      // Should still only be called once
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('return value structure', () => {
    it('should return object with variant, visitorId, and isLoaded', async () => {
      const { result } = renderHook(() => useABTest())

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true)
      })

      expect(result.current).toHaveProperty('variant')
      expect(result.current).toHaveProperty('visitorId')
      expect(result.current).toHaveProperty('isLoaded')
    })

    it('should have correct types', async () => {
      const { result } = renderHook(() => useABTest())

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true)
      })

      expect(typeof result.current.variant).toBe('string')
      expect(typeof result.current.visitorId).toBe('string')
      expect(typeof result.current.isLoaded).toBe('boolean')
    })
  })
})
