// Vercel Serverless Function - Form Submission Handler
import { kv } from '@vercel/kv';

// Retell AI integration
async function triggerRetellCall(phone, leadData) {
    const retellApiKey = process.env.RETELL_API_KEY;
    const retellAgentId = process.env.RETELL_AGENT_ID;

    if (!retellApiKey || !retellAgentId) {
        console.error('Retell AI credentials not configured');
        throw new Error('Retell AI not configured');
    }

    try {
        const response = await fetch('https://api.retellai.com/v2/create-phone-call', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${retellApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                agent_id: retellAgentId,
                to_number: phone.replace(/\D/g, ''), // Remove formatting
                from_number: null, // Retell will use your configured number
                metadata: {
                    lead_source: 'landing_page',
                    variant: leadData.variant,
                    visitor_id: leadData.visitorId,
                    timestamp: leadData.timestamp
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Retell API error: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();
        console.log('Retell call initiated:', data);
        return data;

    } catch (error) {
        console.error('Retell AI error:', error);
        throw error;
    }
}

// Store lead in database
async function storeLead(leadData) {
    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
        // Store lead data
        await kv.set(leadId, {
            ...leadData,
            createdAt: new Date().toISOString(),
            status: 'pending_call'
        });

        // Add to leads list (for easy retrieval)
        await kv.lpush('leads:all', leadId);

        // Track by variant
        await kv.lpush(`leads:variant:${leadData.variant}`, leadId);

        console.log('Lead stored:', leadId);
        return leadId;

    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to store lead');
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
        const { phone, variant, visitorId, timestamp, userAgent, referrer, url } = req.body;

        // Validate required fields
        if (!phone) {
            return res.status(400).json({ error: 'Phone number is required' });
        }

        // Validate phone format
        const phoneDigits = phone.replace(/\D/g, '');
        if (phoneDigits.length < 10 || phoneDigits.length > 11) {
            return res.status(400).json({ error: 'Invalid phone number format' });
        }

        const leadData = {
            phone,
            variant: variant || 'unknown',
            visitorId: visitorId || 'unknown',
            timestamp: timestamp || new Date().toISOString(),
            userAgent: userAgent || '',
            referrer: referrer || 'direct',
            url: url || '',
            ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
        };

        // Store lead in database
        const leadId = await storeLead(leadData);

        // Trigger Retell AI call
        let retellResponse;
        try {
            retellResponse = await triggerRetellCall(phone, leadData);
        } catch (retellError) {
            // Log error but don't fail the request
            // The lead is already stored
            console.error('Retell call failed:', retellError);
            return res.status(200).json({
                success: true,
                leadId,
                message: 'Lead captured, but call initiation failed. We will contact you soon.',
                callStatus: 'failed'
            });
        }

        // Update lead with call ID
        try {
            const lead = await kv.get(leadId);
            await kv.set(leadId, {
                ...lead,
                retellCallId: retellResponse.call_id,
                callStatus: retellResponse.call_status
            });
        } catch (error) {
            console.error('Failed to update lead with call ID:', error);
        }

        return res.status(200).json({
            success: true,
            leadId,
            callId: retellResponse.call_id,
            message: 'Call initiated successfully'
        });

    } catch (error) {
        console.error('Submit handler error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
