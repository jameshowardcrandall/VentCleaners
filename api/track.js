// Vercel Serverless Function - Analytics Tracking
let kv;
try {
    const kvModule = await import('@vercel/kv');
    kv = kvModule.kv;
} catch (e) {
    console.warn('KV not available, using fallback mode');
    kv = null;
}

// Track event and update A/B test metrics
async function trackEvent(eventData) {
    const { eventType, variant, visitorId, timestamp } = eventData;

    const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    if (!kv) {
        console.log(`Tracked ${eventType} for variant ${variant} (KV not available)`);
        return { success: true, eventId };
    }

    try {
        // Store raw event
        await kv.set(eventId, {
            ...eventData,
            storedAt: new Date().toISOString()
        });

        // Add to events list
        await kv.lpush('events:all', eventId);

        // Increment variant-specific metrics
        const dateKey = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        if (eventType === 'impression') {
            // Increment impression counter
            await kv.hincrby(`metrics:${dateKey}:${variant}`, 'impressions', 1);
            await kv.hincrby(`metrics:total:${variant}`, 'impressions', 1);

            // Track unique visitors
            await kv.sadd(`visitors:${dateKey}:${variant}`, visitorId);
            await kv.sadd(`visitors:total:${variant}`, visitorId);

        } else if (eventType === 'conversion') {
            // Increment conversion counter
            await kv.hincrby(`metrics:${dateKey}:${variant}`, 'conversions', 1);
            await kv.hincrby(`metrics:total:${variant}`, 'conversions', 1);

            // Track converting visitors
            await kv.sadd(`converters:${dateKey}:${variant}`, visitorId);
            await kv.sadd(`converters:total:${variant}`, visitorId);
        }

        console.log(`Tracked ${eventType} for variant ${variant}`);
        return { success: true, eventId };

    } catch (error) {
        console.error('Tracking error:', error);
        throw error;
    }
}

// Main handler
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only accept POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const eventData = req.body;

        // Validate required fields
        if (!eventData.eventType || !eventData.variant || !eventData.visitorId) {
            return res.status(400).json({
                error: 'Missing required fields: eventType, variant, visitorId'
            });
        }

        // Add server-side data
        eventData.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        eventData.serverTimestamp = new Date().toISOString();

        // Track the event
        const result = await trackEvent(eventData);

        return res.status(200).json({
            success: true,
            eventId: result.eventId
        });

    } catch (error) {
        console.error('Track handler error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
