// Vercel Serverless Function - A/B Test Statistics Dashboard
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

// Calculate conversion rate
function calculateConversionRate(impressions, conversions) {
    if (impressions === 0) return 0;
    return ((conversions / impressions) * 100).toFixed(2);
}

// Calculate statistical significance (simplified Chi-squared test)
function calculateSignificance(variantA, variantB) {
    const n1 = variantA.impressions;
    const n2 = variantB.impressions;
    const c1 = variantA.conversions;
    const c2 = variantB.conversions;

    if (n1 === 0 || n2 === 0) {
        return { significant: false, pValue: null, message: 'Insufficient data' };
    }

    const p1 = c1 / n1;
    const p2 = c2 / n2;
    const pPooled = (c1 + c2) / (n1 + n2);

    const se = Math.sqrt(pPooled * (1 - pPooled) * (1/n1 + 1/n2));

    if (se === 0) {
        return { significant: false, pValue: null, message: 'No variance' };
    }

    const zScore = Math.abs(p1 - p2) / se;
    const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));

    return {
        significant: pValue < 0.05,
        pValue: pValue.toFixed(4),
        zScore: zScore.toFixed(2),
        message: pValue < 0.05 ? 'Statistically significant!' : 'Not yet significant'
    };
}

// Normal CDF approximation
function normalCDF(x) {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - p : p;
}

// Get metrics for a variant
async function getVariantMetrics(variant, period = 'total') {
    try {
        const client = await getRedis();
        if (!client) {
            return {
                impressions: 0,
                conversions: 0,
                uniqueVisitors: 0,
                uniqueConverters: 0,
                conversionRate: '0.00'
            };
        }

        const metrics = await client.hGetAll(`metrics:${period}:${variant}`);

        const impressions = parseInt(metrics?.impressions || 0);
        const conversions = parseInt(metrics?.conversions || 0);

        // Get unique visitor counts
        const uniqueVisitors = period === 'total'
            ? await client.sCard(`visitors:total:${variant}`)
            : await client.sCard(`visitors:${period}:${variant}`);

        const uniqueConverters = period === 'total'
            ? await client.sCard(`converters:total:${variant}`)
            : await client.sCard(`converters:${period}:${variant}`);

        return {
            impressions,
            conversions,
            uniqueVisitors,
            uniqueConverters,
            conversionRate: calculateConversionRate(impressions, conversions)
        };
    } catch (error) {
        console.error(`Error getting metrics for variant ${variant} (Redis might not be set up):`, error);
        return {
            impressions: 0,
            conversions: 0,
            uniqueVisitors: 0,
            uniqueConverters: 0,
            conversionRate: '0.00'
        };
    }
}

// Get recent leads
async function getRecentLeads(limit = 10) {
    try {
        const client = await getRedis();
        if (!client) {
            return [];
        }

        const leadIds = await client.lRange('leads:all', 0, limit - 1);
        const leads = await Promise.all(
            leadIds.map(async (id) => {
                const leadData = await client.get(id);
                const lead = leadData ? JSON.parse(leadData) : {};
                return { id, ...lead };
            })
        );
        return leads;
    } catch (error) {
        console.error('Error getting recent leads (Redis might not be set up):', error);
        return [];
    }
}

// Main handler
export default async function handler(req, res) {
    // Simple authentication (optional - add your own security)
    const authToken = req.headers['x-auth-token'] || req.query.token;
    const expectedToken = process.env.STATS_TOKEN;

    if (expectedToken && authToken !== expectedToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const period = req.query.period || 'total';

        // Get metrics for both variants
        const variantA = await getVariantMetrics('a', period);
        const variantB = await getVariantMetrics('b', period);

        // Calculate statistical significance
        const significance = calculateSignificance(variantA, variantB);

        // Get recent leads
        const recentLeads = await getRecentLeads(10);

        // Determine winner
        let winner = null;
        if (significance.significant) {
            winner = parseFloat(variantA.conversionRate) > parseFloat(variantB.conversionRate) ? 'A' : 'B';
        }

        const stats = {
            period,
            lastUpdated: new Date().toISOString(),
            variants: {
                a: {
                    name: 'Variant A (Safety Focus)',
                    ...variantA
                },
                b: {
                    name: 'Variant B (Value Focus)',
                    ...variantB
                }
            },
            significance,
            winner,
            recentLeads: recentLeads.map(lead => ({
                id: lead.id,
                phone: lead.phone,
                variant: lead.variant,
                timestamp: lead.timestamp,
                callStatus: lead.callStatus
            }))
        };

        // Return HTML dashboard if accessed via browser
        if (req.headers.accept?.includes('text/html')) {
            const html = generateDashboardHTML(stats);
            res.setHeader('Content-Type', 'text/html');
            return res.status(200).send(html);
        }

        // Return JSON for API calls
        return res.status(200).json(stats);

    } catch (error) {
        console.error('Stats handler error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}

// Generate HTML dashboard
function generateDashboardHTML(stats) {
    const { variants, significance, winner, recentLeads } = stats;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>A/B Test Dashboard - Vent Cleaners</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f7fafc;
            padding: 40px 20px;
            color: #2d3748;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { font-size: 2.5rem; margin-bottom: 10px; color: #1a202c; }
        .subtitle { color: #718096; margin-bottom: 40px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .card {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .card.winner { border: 3px solid #48bb78; }
        .winner-badge {
            display: inline-block;
            background: #48bb78;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 600;
            margin-left: 10px;
        }
        h2 { font-size: 1.5rem; margin-bottom: 20px; color: #2d3748; }
        .metric { margin-bottom: 15px; }
        .metric-label { font-size: 0.875rem; color: #718096; margin-bottom: 5px; }
        .metric-value { font-size: 2rem; font-weight: 700; color: #1a202c; }
        .conversion-rate { color: #667eea; }
        .significance {
            background: #edf2f7;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 40px;
        }
        .significance.significant { background: #c6f6d5; border: 2px solid #48bb78; }
        .leads-table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; }
        .leads-table th { background: #667eea; color: white; padding: 15px; text-align: left; }
        .leads-table td { padding: 12px 15px; border-bottom: 1px solid #e2e8f0; }
        .leads-table tr:last-child td { border-bottom: none; }
        .variant-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        .variant-a { background: #fed7d7; color: #c53030; }
        .variant-b { background: #c6f6d5; color: #2f855a; }
        .refresh-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            font-size: 1rem;
            cursor: pointer;
            margin-bottom: 20px;
        }
        .refresh-btn:hover { background: #5a67d8; }
    </style>
</head>
<body>
    <div class="container">
        <h1>A/B Test Dashboard</h1>
        <p class="subtitle">Last updated: ${new Date(stats.lastUpdated).toLocaleString()}</p>

        <button class="refresh-btn" onclick="location.reload()">🔄 Refresh Data</button>

        <div class="significance ${significance.significant ? 'significant' : ''}">
            <h3>Statistical Significance</h3>
            <p><strong>Status:</strong> ${significance.message}</p>
            ${significance.pValue ? `<p><strong>P-Value:</strong> ${significance.pValue} ${significance.significant ? '✅' : '⏳'}</p>` : ''}
            ${winner ? `<p style="margin-top: 10px; font-size: 1.1rem;"><strong>🏆 Winner: Variant ${winner}</strong></p>` : ''}
        </div>

        <div class="grid">
            <div class="card ${winner === 'A' ? 'winner' : ''}">
                <h2>
                    ${variants.a.name}
                    ${winner === 'A' ? '<span class="winner-badge">Winner</span>' : ''}
                </h2>
                <div class="metric">
                    <div class="metric-label">Impressions</div>
                    <div class="metric-value">${variants.a.impressions.toLocaleString()}</div>
                </div>
                <div class="metric">
                    <div class="metric-label">Conversions</div>
                    <div class="metric-value">${variants.a.conversions.toLocaleString()}</div>
                </div>
                <div class="metric">
                    <div class="metric-label">Conversion Rate</div>
                    <div class="metric-value conversion-rate">${variants.a.conversionRate}%</div>
                </div>
                <div class="metric">
                    <div class="metric-label">Unique Visitors</div>
                    <div class="metric-value" style="font-size: 1.5rem;">${variants.a.uniqueVisitors.toLocaleString()}</div>
                </div>
            </div>

            <div class="card ${winner === 'B' ? 'winner' : ''}">
                <h2>
                    ${variants.b.name}
                    ${winner === 'B' ? '<span class="winner-badge">Winner</span>' : ''}
                </h2>
                <div class="metric">
                    <div class="metric-label">Impressions</div>
                    <div class="metric-value">${variants.b.impressions.toLocaleString()}</div>
                </div>
                <div class="metric">
                    <div class="metric-label">Conversions</div>
                    <div class="metric-value">${variants.b.conversions.toLocaleString()}</div>
                </div>
                <div class="metric">
                    <div class="metric-label">Conversion Rate</div>
                    <div class="metric-value conversion-rate">${variants.b.conversionRate}%</div>
                </div>
                <div class="metric">
                    <div class="metric-label">Unique Visitors</div>
                    <div class="metric-value" style="font-size: 1.5rem;">${variants.b.uniqueVisitors.toLocaleString()}</div>
                </div>
            </div>
        </div>

        <div class="card">
            <h2>Recent Leads (Last 10)</h2>
            <table class="leads-table">
                <thead>
                    <tr>
                        <th>Phone</th>
                        <th>Variant</th>
                        <th>Timestamp</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${recentLeads.length > 0 ? recentLeads.map(lead => `
                        <tr>
                            <td>${lead.phone}</td>
                            <td><span class="variant-badge variant-${lead.variant}">${lead.variant.toUpperCase()}</span></td>
                            <td>${new Date(lead.timestamp).toLocaleString()}</td>
                            <td>${lead.callStatus || 'Pending'}</td>
                        </tr>
                    `).join('') : '<tr><td colspan="4" style="text-align: center; color: #718096;">No leads yet</td></tr>'}
                </tbody>
            </table>
        </div>
    </div>

    <script>
        // Auto-refresh every 30 seconds
        setTimeout(() => location.reload(), 30000);
    </script>
</body>
</html>
    `;
}
