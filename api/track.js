// Vercel Serverless Function - Analytics Tracking
import { createClient } from 'redis';

// Redis client singleton
let redis = null;
async function getRedis() {
    if (!redis && process.env.REDIS_URL) {
        redis = createClient({ url: process.env.REDIS_URL });
        await redis.connect();
    }
    return redis;
}

// Track event and update A/B test metrics
async function trackEvent(eventData) {
    const { eventType, variant, visitorId, timestamp } = eventData;

    const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
        const client = await getRedis();
        if (!client) {
            console.log(`Tracked ${eventType} for variant ${variant} (Redis not available)`);
            return { success: true, eventId };
        }

        // Store raw event
        await client.set(eventId, JSON.stringify({
            ...eventData,
            storedAt: new Date().toISOString()
        }));

        // Add to events list
        await client.lPush('events:all', eventId);

        // Increment variant-specific metrics
        const dateKey = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        if (eventType === 'impression') {
            // Increment impression counter
            await client.hIncrBy(`metrics:${dateKey}:${variant}`, 'impressions', 1);
            await client.hIncrBy(`metrics:total:${variant}`, 'impressions', 1);

            // Track unique visitors
            await client.sAdd(`visitors:${dateKey}:${variant}`, visitorId);
            await client.sAdd(`visitors:total:${variant}`, visitorId);

        } else if (eventType === 'conversion') {
            // Increment conversion counter
            await client.hIncrBy(`metrics:${dateKey}:${variant}`, 'conversions', 1);
            await client.hIncrBy(`metrics:total:${variant}`, 'conversions', 1);

            // Track converting visitors
            await client.sAdd(`converters:${dateKey}:${variant}`, visitorId);
            await client.sAdd(`converters:total:${variant}`, visitorId);
        }

        console.log(`Tracked ${eventType} for variant ${variant}`);
        return { success: true, eventId };

    } catch (error) {
        console.error('Tracking error (Redis might not be set up):', error);
        console.log(`Would track ${eventType} for variant ${variant}`);
        return { success: true, eventId };
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
