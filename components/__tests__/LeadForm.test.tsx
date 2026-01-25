import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LeadForm from '../LeadForm'

// Mock fetch
global.fetch = jest.fn()

describe('LeadForm', () => {
  const defaultProps = {
    variant: 'a' as const,
    visitorId: 'visitor_123',
    ctaCopy: {
      buttonText: 'Get My Free Quote',
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        leadId: 'lead_123',
        callId: 'call_456',
      }),
    })
  })

  describe('rendering', () => {
    it('should render phone input', () => {
      render(<LeadForm {...defaultProps} />)

      const input = screen.getByPlaceholderText('(555) 123-4567')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'tel')
    })

    it('should render submit button with correct text', () => {
      render(<LeadForm {...defaultProps} />)

      const button = screen.getByRole('button', { name: 'Get My Free Quote' })
      expect(button).toBeInTheDocument()
    })

    it('should render button with variant B text', () => {
      render(
        <LeadForm
          {...defaultProps}
          variant="b"
          ctaCopy={{ buttonText: 'Call Me Now' }}
        />
      )

      const button = screen.getByRole('button', { name: 'Call Me Now' })
      expect(button).toBeInTheDocument()
    })
  })

  describe('phone input formatting', () => {
    it('should format phone number as user types', async () => {
      const user = userEvent.setup()
      render(<LeadForm {...defaultProps} />)

      const input = screen.getByPlaceholderText('(555) 123-4567')

      await user.type(input, '1234567890')

      expect(input).toHaveValue('(123) 456-7890')
    })

    it('should clear error on input change', async () => {
      const user = userEvent.setup()
      render(<LeadForm {...defaultProps} />)

      const button = screen.getByRole('button')
      const input = screen.getByPlaceholderText('(555) 123-4567')

      // Type invalid phone and submit to trigger error
      await user.type(input, '123')
      fireEvent.click(button)

      await waitFor(() => {
        expect(
          screen.getByText(/Please enter a valid 10-digit phone number/i)
        ).toBeInTheDocument()
      })

      // Start typing to clear error
      await user.type(input, '4567890')

      await waitFor(() => {
        expect(
          screen.queryByText(/Please enter a valid 10-digit phone number/i)
        ).not.toBeInTheDocument()
      })
    })
  })

  describe('form validation', () => {
    it('should show error for invalid phone number', async () => {
      const user = userEvent.setup()
      render(<LeadForm {...defaultProps} />)

      const input = screen.getByPlaceholderText('(555) 123-4567')
      const button = screen.getByRole('button')

      // Type partial phone number
      await user.type(input, '123')
      fireEvent.click(button)

      await waitFor(() => {
        expect(
          screen.getByText(/Please enter a valid 10-digit phone number/i)
        ).toBeInTheDocument()
      })

      // Should not call API
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('should show error for phone number that is too short', async () => {
      const user = userEvent.setup()
      render(<LeadForm {...defaultProps} />)

      const input = screen.getByPlaceholderText('(555) 123-4567')
      const button = screen.getByRole('button')

      await user.type(input, '123456789')
      fireEvent.click(button)

      await waitFor(() => {
        expect(
          screen.getByText(/Please enter a valid 10-digit phone number/i)
        ).toBeInTheDocument()
      })
    })

    it('should handle phone numbers longer than 10 digits by truncating', async () => {
      const user = userEvent.setup()
      render(<LeadForm {...defaultProps} />)

      const input = screen.getByPlaceholderText('(555) 123-4567') as HTMLInputElement
      const button = screen.getByRole('button')

      // The formatPhoneNumber function truncates to first 10 digits
      await user.type(input, '12345678901234567890')

      // Should only show first 10 digits formatted
      expect(input.value).toBe('(123) 456-7890')

      // Should submit successfully since it's now a valid 10-digit number
      fireEvent.click(button)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })
    })
  })

  describe('form submission', () => {
    it('should submit form with valid phone number', async () => {
      const user = userEvent.setup()
      render(<LeadForm {...defaultProps} />)

      const input = screen.getByPlaceholderText('(555) 123-4567')
      const button = screen.getByRole('button')

      await user.type(input, '1234567890')
      fireEvent.click(button)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/submit',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          })
        )
      })
    })

    it('should include correct data in submission', async () => {
      const user = userEvent.setup()
      render(<LeadForm {...defaultProps} variant="b" visitorId="visitor_456" />)

      const input = screen.getByPlaceholderText('(555) 123-4567')
      const button = screen.getByRole('button')

      await user.type(input, '5551234567')
      fireEvent.click(button)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })

      const callArgs = (global.fetch as jest.Mock).mock.calls[0]
      const body = JSON.parse(callArgs[1].body)

      expect(body).toMatchObject({
        phone: '(555) 123-4567',
        variant: 'b',
        visitorId: 'visitor_456',
      })
      expect(body.timestamp).toBeDefined()
      expect(body.userAgent).toBeDefined()
    })

    it('should track conversion on successful submission', async () => {
      const user = userEvent.setup()
      render(<LeadForm {...defaultProps} />)

      const input = screen.getByPlaceholderText('(555) 123-4567')
      const button = screen.getByRole('button')

      await user.type(input, '1234567890')
      fireEvent.click(button)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2)
      })

      // Second call should be to track conversion
      const trackCall = (global.fetch as jest.Mock).mock.calls[1]
      expect(trackCall[0]).toBe('/api/track')

      const trackBody = JSON.parse(trackCall[1].body)
      expect(trackBody.eventType).toBe('conversion')
    })

    it('should clear form after successful submission', async () => {
      const user = userEvent.setup()
      render(<LeadForm {...defaultProps} />)

      const input = screen.getByPlaceholderText(
        '(555) 123-4567'
      ) as HTMLInputElement
      const button = screen.getByRole('button')

      await user.type(input, '1234567890')
      fireEvent.click(button)

      await waitFor(() => {
        expect(input.value).toBe('')
      })
    })

    it('should show success modal after submission', async () => {
      const user = userEvent.setup()
      render(<LeadForm {...defaultProps} />)

      const input = screen.getByPlaceholderText('(555) 123-4567')
      const button = screen.getByRole('button')

      await user.type(input, '1234567890')
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText(/\(123\) 456-7890/)).toBeInTheDocument()
      })
    })
  })

  describe('loading state', () => {
    it('should show loading text on button while submitting', async () => {
      const user = userEvent.setup()
      ;(global.fetch as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ success: true, leadId: 'lead_123' }),
                }),
              100
            )
          )
      )

      render(<LeadForm {...defaultProps} />)

      const input = screen.getByPlaceholderText('(555) 123-4567')
      const button = screen.getByRole('button')

      await user.type(input, '1234567890')
      fireEvent.click(button)

      expect(screen.getByText('Submitting...')).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.queryByText('Submitting...')).not.toBeInTheDocument()
      })
    })

    it('should disable button while loading', async () => {
      const user = userEvent.setup()
      ;(global.fetch as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ success: true, leadId: 'lead_123' }),
                }),
              100
            )
          )
      )

      render(<LeadForm {...defaultProps} />)

      const input = screen.getByPlaceholderText('(555) 123-4567')
      const button = screen.getByRole('button')

      await user.type(input, '1234567890')
      fireEvent.click(button)

      expect(button).toBeDisabled()

      await waitFor(() => {
        expect(button).not.toBeDisabled()
      })
    })

    it('should show loading spinner while submitting', async () => {
      const user = userEvent.setup()
      ;(global.fetch as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ success: true, leadId: 'lead_123' }),
                }),
              100
            )
          )
      )

      render(<LeadForm {...defaultProps} />)

      const input = screen.getByPlaceholderText('(555) 123-4567')
      const button = screen.getByRole('button')

      await user.type(input, '1234567890')
      fireEvent.click(button)

      // LoadingSpinner should be rendered
      await waitFor(() => {
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
      })
    })
  })

  describe('error handling', () => {
    it('should show error message on API failure', async () => {
      const user = userEvent.setup()
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Server error' }),
      })

      render(<LeadForm {...defaultProps} />)

      const input = screen.getByPlaceholderText('(555) 123-4567')
      const button = screen.getByRole('button')

      await user.type(input, '1234567890')
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText(/Server error/i)).toBeInTheDocument()
      })
    })

    it('should show error message on network error', async () => {
      const user = userEvent.setup()
      ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      render(<LeadForm {...defaultProps} />)

      const input = screen.getByPlaceholderText('(555) 123-4567')
      const button = screen.getByRole('button')

      await user.type(input, '1234567890')
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText(/Network error/i)).toBeInTheDocument()
      })
    })

    it('should show generic error for unknown errors', async () => {
      const user = userEvent.setup()
      ;(global.fetch as jest.Mock).mockRejectedValue('Unknown error')

      render(<LeadForm {...defaultProps} />)

      const input = screen.getByPlaceholderText('(555) 123-4567')
      const button = screen.getByRole('button')

      await user.type(input, '1234567890')
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
      })
    })
  })

  describe('accessibility', () => {
    it('should have required attribute on input', () => {
      render(<LeadForm {...defaultProps} />)

      const input = screen.getByPlaceholderText('(555) 123-4567')
      expect(input).toBeRequired()
    })

    it('should be able to submit form by pressing Enter', async () => {
      const user = userEvent.setup()
      render(<LeadForm {...defaultProps} />)

      const input = screen.getByPlaceholderText('(555) 123-4567')

      await user.type(input, '1234567890')
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })
    })
  })
})
