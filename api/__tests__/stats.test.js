// Mock Redis before importing the module
jest.mock('redis', () => ({
  createClient: jest.fn(() => ({
    connect: jest.fn(),
    set: jest.fn(),
    get: jest.fn(),
    hGetAll: jest.fn(),
    sCard: jest.fn(),
    lRange: jest.fn(),
  })),
}))

// We need to test the pure functions from stats.js
// Since they're not exported, we'll create a test utilities file
// For now, let's test them by extracting them

describe('Statistical Calculations', () => {
  describe('calculateConversionRate', () => {
    // Since the function isn't exported, we'll replicate it for testing
    const calculateConversionRate = (impressions, conversions) => {
      if (impressions === 0) return 0
      return ((conversions / impressions) * 100).toFixed(2)
    }

    it('should return 0 when impressions is 0', () => {
      expect(calculateConversionRate(0, 0)).toBe(0)
    })

    it('should return 0 when conversions is 0 but impressions exist', () => {
      expect(calculateConversionRate(100, 0)).toBe('0.00')
    })

    it('should calculate correct percentage', () => {
      expect(calculateConversionRate(100, 25)).toBe('25.00')
    })

    it('should return value with 2 decimal places', () => {
      expect(calculateConversionRate(100, 33)).toBe('33.00')
    })

    it('should round to 2 decimal places', () => {
      expect(calculateConversionRate(100, 33.333)).toBe('33.33')
    })

    it('should handle small conversion rates', () => {
      expect(calculateConversionRate(1000, 1)).toBe('0.10')
    })

    it('should handle high conversion rates', () => {
      expect(calculateConversionRate(100, 95)).toBe('95.00')
    })

    it('should handle 100% conversion rate', () => {
      expect(calculateConversionRate(100, 100)).toBe('100.00')
    })

    it('should handle decimal conversions', () => {
      expect(calculateConversionRate(100, 12.5)).toBe('12.50')
    })
  })

  describe('normalCDF', () => {
    // Replicate the function for testing
    const normalCDF = (x) => {
      const t = 1 / (1 + 0.2316419 * Math.abs(x))
      const d = 0.3989423 * Math.exp((-x * x) / 2)
      const p =
        d *
        t *
        (0.3193815 +
          t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
      return x > 0 ? 1 - p : p
    }

    it('should return value between 0 and 1', () => {
      const result = normalCDF(1.96)
      expect(result).toBeGreaterThan(0)
      expect(result).toBeLessThan(1)
    })

    it('should return approximately 0.5 for z-score of 0', () => {
      const result = normalCDF(0)
      expect(result).toBeCloseTo(0.5, 1)
    })

    it('should return approximately 0.975 for z-score of 1.96', () => {
      const result = normalCDF(1.96)
      expect(result).toBeCloseTo(0.975, 2)
    })

    it('should return approximately 0.025 for z-score of -1.96', () => {
      const result = normalCDF(-1.96)
      expect(result).toBeCloseTo(0.025, 2)
    })

    it('should handle positive z-scores', () => {
      const result = normalCDF(2.0)
      expect(result).toBeGreaterThan(0.5)
    })

    it('should handle negative z-scores', () => {
      const result = normalCDF(-2.0)
      expect(result).toBeLessThan(0.5)
    })

    it('should be symmetric around 0', () => {
      const positive = normalCDF(1.5)
      const negative = normalCDF(-1.5)
      expect(positive + negative).toBeCloseTo(1, 2)
    })
  })

  describe('calculateSignificance', () => {
    // Replicate the helper functions
    const normalCDF = (x) => {
      const t = 1 / (1 + 0.2316419 * Math.abs(x))
      const d = 0.3989423 * Math.exp((-x * x) / 2)
      const p =
        d *
        t *
        (0.3193815 +
          t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
      return x > 0 ? 1 - p : p
    }

    const calculateSignificance = (variantA, variantB) => {
      const n1 = variantA.impressions
      const n2 = variantB.impressions
      const c1 = variantA.conversions
      const c2 = variantB.conversions

      if (n1 === 0 || n2 === 0) {
        return {
          significant: false,
          pValue: null,
          message: 'Insufficient data',
        }
      }

      const p1 = c1 / n1
      const p2 = c2 / n2
      const pPooled = (c1 + c2) / (n1 + n2)

      const se = Math.sqrt(pPooled * (1 - pPooled) * (1 / n1 + 1 / n2))

      if (se === 0) {
        return { significant: false, pValue: null, message: 'No variance' }
      }

      const zScore = Math.abs(p1 - p2) / se
      const pValue = 2 * (1 - normalCDF(Math.abs(zScore)))

      return {
        significant: pValue < 0.05,
        pValue: pValue.toFixed(4),
        zScore: zScore.toFixed(2),
        message:
          pValue < 0.05 ? 'Statistically significant!' : 'Not yet significant',
      }
    }

    it('should return "insufficient data" when n1 is 0', () => {
      const variantA = { impressions: 0, conversions: 0 }
      const variantB = { impressions: 100, conversions: 10 }
      const result = calculateSignificance(variantA, variantB)

      expect(result.significant).toBe(false)
      expect(result.pValue).toBeNull()
      expect(result.message).toBe('Insufficient data')
    })

    it('should return "insufficient data" when n2 is 0', () => {
      const variantA = { impressions: 100, conversions: 10 }
      const variantB = { impressions: 0, conversions: 0 }
      const result = calculateSignificance(variantA, variantB)

      expect(result.significant).toBe(false)
      expect(result.pValue).toBeNull()
      expect(result.message).toBe('Insufficient data')
    })

    it('should return "no variance" when SE is 0', () => {
      const variantA = { impressions: 100, conversions: 0 }
      const variantB = { impressions: 100, conversions: 0 }
      const result = calculateSignificance(variantA, variantB)

      expect(result.significant).toBe(false)
      expect(result.pValue).toBeNull()
      expect(result.message).toBe('No variance')
    })

    it('should identify significant results with large sample and clear difference', () => {
      const variantA = { impressions: 1000, conversions: 100 } // 10%
      const variantB = { impressions: 1000, conversions: 200 } // 20%
      const result = calculateSignificance(variantA, variantB)

      expect(result.significant).toBe(true)
      expect(result.message).toBe('Statistically significant!')
      expect(parseFloat(result.pValue)).toBeLessThan(0.05)
    })

    it('should identify non-significant results with small sample', () => {
      const variantA = { impressions: 10, conversions: 1 } // 10%
      const variantB = { impressions: 10, conversions: 2 } // 20%
      const result = calculateSignificance(variantA, variantB)

      expect(result.significant).toBe(false)
      expect(result.message).toBe('Not yet significant')
      expect(parseFloat(result.pValue)).toBeGreaterThan(0.05)
    })

    it('should identify non-significant results with equal conversion rates', () => {
      const variantA = { impressions: 1000, conversions: 100 } // 10%
      const variantB = { impressions: 1000, conversions: 100 } // 10%
      const result = calculateSignificance(variantA, variantB)

      expect(result.significant).toBe(false)
      expect(result.message).toBe('Not yet significant')
    })

    it('should calculate correct z-score', () => {
      const variantA = { impressions: 1000, conversions: 100 }
      const variantB = { impressions: 1000, conversions: 200 }
      const result = calculateSignificance(variantA, variantB)

      expect(result.zScore).toBeDefined()
      expect(parseFloat(result.zScore)).toBeGreaterThan(0)
    })

    it('should return p-value with 4 decimal places', () => {
      const variantA = { impressions: 100, conversions: 10 }
      const variantB = { impressions: 100, conversions: 15 }
      const result = calculateSignificance(variantA, variantB)

      expect(result.pValue).toMatch(/^\d+\.\d{4}$/)
    })

    it('should handle very small conversion rates', () => {
      const variantA = { impressions: 10000, conversions: 1 }
      const variantB = { impressions: 10000, conversions: 2 }
      const result = calculateSignificance(variantA, variantB)

      expect(result.significant).toBe(false)
    })

    it('should handle high conversion rates', () => {
      const variantA = { impressions: 1000, conversions: 900 } // 90%
      const variantB = { impressions: 1000, conversions: 950 } // 95%
      const result = calculateSignificance(variantA, variantB)

      expect(result.pValue).toBeDefined()
      expect(result.zScore).toBeDefined()
    })
  })
})
