// A/B Testing System
(function() {
    'use strict';

    // Configuration
    const VARIANT_KEY = 'ab_variant';
    const VISITOR_ID_KEY = 'visitor_id';
    const VARIANTS = ['a', 'b'];

    // Generate or retrieve visitor ID
    function getVisitorId() {
        let visitorId = localStorage.getItem(VISITOR_ID_KEY);
        if (!visitorId) {
            visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem(VISITOR_ID_KEY, visitorId);
        }
        return visitorId;
    }

    // Get or assign variant
    function getVariant() {
        let variant = localStorage.getItem(VARIANT_KEY);

        // If no variant assigned, randomly assign one
        if (!variant || !VARIANTS.includes(variant)) {
            variant = VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
            localStorage.setItem(VARIANT_KEY, variant);
        }

        return variant;
    }

    // Load the assigned variant
    function loadVariant() {
        const variant = getVariant();
        const visitorId = getVisitorId();

        console.log(`Loading variant: ${variant} for visitor: ${visitorId}`);

        // Get the template for this variant
        const template = document.getElementById(`variant-${variant}`);
        if (!template) {
            console.error(`Template for variant ${variant} not found`);
            return;
        }

        // Clone and insert the template content
        const container = document.getElementById('variant-container');
        const content = template.content.cloneNode(true);
        container.appendChild(content);

        // Track impression
        trackEvent('impression', {
            variant: variant,
            visitorId: visitorId,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'direct'
        });
    }

    // Track events to analytics endpoint
    function trackEvent(eventType, data) {
        const payload = {
            eventType: eventType,
            variant: data.variant || getVariant(),
            visitorId: data.visitorId || getVisitorId(),
            timestamp: data.timestamp || new Date().toISOString(),
            userAgent: data.userAgent || navigator.userAgent,
            referrer: data.referrer || document.referrer || 'direct',
            ...data
        };

        // Send to analytics endpoint
        fetch('/api/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            // Use keepalive to ensure tracking completes even if user navigates away
            keepalive: true
        }).catch(err => {
            console.error('Tracking error:', err);
        });

        console.log(`Tracked ${eventType}:`, payload);
    }

    // Expose trackEvent globally for form handler
    window.trackConversion = function(data) {
        trackEvent('conversion', data);
    };

    // Export variant info for form submission
    window.getABTestInfo = function() {
        return {
            variant: getVariant(),
            visitorId: getVisitorId()
        };
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadVariant);
    } else {
        loadVariant();
    }
})();
