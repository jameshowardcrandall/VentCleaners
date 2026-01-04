// Form submission handler
(function() {
    'use strict';

    // Wait for DOM to be ready
    function init() {
        // Use event delegation since form is loaded dynamically
        document.addEventListener('submit', function(e) {
            if (e.target.id === 'lead-form') {
                e.preventDefault();
                handleFormSubmit(e.target);
            }
        });
    }

    // Phone number formatting
    function formatPhoneNumber(value) {
        // Remove all non-numeric characters
        const numbers = value.replace(/\D/g, '');

        // Format as (XXX) XXX-XXXX
        if (numbers.length >= 10) {
            return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
        }
        return value;
    }

    // Add real-time phone formatting
    document.addEventListener('input', function(e) {
        if (e.target.id === 'phone') {
            const cursorPosition = e.target.selectionStart;
            const oldValue = e.target.value;
            const newValue = formatPhoneNumber(oldValue);

            if (oldValue !== newValue) {
                e.target.value = newValue;
                // Adjust cursor position
                const diff = newValue.length - oldValue.length;
                e.target.setSelectionRange(cursorPosition + diff, cursorPosition + diff);
            }
        }
    });

    // Validate phone number
    function validatePhone(phone) {
        const numbers = phone.replace(/\D/g, '');
        if (numbers.length < 10) {
            return { valid: false, error: 'Please enter a valid 10-digit phone number' };
        }
        if (numbers.length > 11) {
            return { valid: false, error: 'Phone number is too long' };
        }
        return { valid: true, formatted: formatPhoneNumber(numbers) };
    }

    // Show error message
    function showError(message) {
        // Remove existing error
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Create and show new error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;

        const form = document.getElementById('lead-form');
        form.appendChild(errorDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => errorDiv.remove(), 5000);
    }

    // Show loading state
    function showLoading(show) {
        const loading = document.getElementById('loading');
        loading.style.display = show ? 'flex' : 'none';

        const button = document.querySelector('.cta-button');
        if (button) {
            button.disabled = show;
            button.textContent = show ? 'Submitting...' : button.textContent;
        }
    }

    // Show success modal
    function showSuccess(phone) {
        const modal = document.getElementById('success-modal');
        const phoneDisplay = document.getElementById('submitted-phone');

        phoneDisplay.textContent = phone;
        modal.style.display = 'flex';

        // Track conversion
        if (window.trackConversion) {
            window.trackConversion({
                phone: phone,
                convertedAt: new Date().toISOString()
            });
        }
    }

    // Handle form submission
    async function handleFormSubmit(form) {
        const phoneInput = form.querySelector('#phone');
        const phone = phoneInput.value.trim();

        // Validate phone
        const validation = validatePhone(phone);
        if (!validation.valid) {
            showError(validation.error);
            phoneInput.focus();
            return;
        }

        // Get A/B test info
        const abTestInfo = window.getABTestInfo ? window.getABTestInfo() : {};

        // Show loading
        showLoading(true);

        try {
            // Submit to backend
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: validation.formatted,
                    variant: abTestInfo.variant,
                    visitorId: abTestInfo.visitorId,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    referrer: document.referrer || 'direct',
                    url: window.location.href
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Submission failed');
            }

            // Hide loading
            showLoading(false);

            // Show success
            showSuccess(validation.formatted);

            // Reset form
            form.reset();

        } catch (error) {
            console.error('Submission error:', error);
            showLoading(false);
            showError(error.message || 'Something went wrong. Please try again.');
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
