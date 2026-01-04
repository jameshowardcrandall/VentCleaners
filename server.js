// Simple local development server
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// In-memory storage for local development
const storage = {
  leads: [],
  events: [],
  metrics: {
    a: { impressions: 0, conversions: 0 },
    b: { impressions: 0, conversions: 0 }
  }
};

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

// Mock Retell AI call (for local testing)
async function mockRetellCall(phone, metadata) {
  console.log('\n📞 [MOCK] Retell AI Call Triggered:');
  console.log('   Phone:', phone);
  console.log('   Variant:', metadata.variant);
  console.log('   Visitor ID:', metadata.visitor_id);
  console.log('   (In production, this would trigger a real call)\n');

  return {
    call_id: `mock_call_${Date.now()}`,
    call_status: 'initiated'
  };
}

// API handlers
async function handleApiRequest(req, res, pathname) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Parse POST body
  let body = '';
  if (req.method === 'POST') {
    await new Promise((resolve) => {
      req.on('data', chunk => body += chunk);
      req.on('end', resolve);
    });
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }

  // Route API requests
  if (pathname === '/api/submit') {
    console.log('\n📝 Form Submission:', body);

    const lead = {
      id: `lead_${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString()
    };

    // Store lead
    storage.leads.push(lead);

    // Mock Retell AI call
    const callResult = await mockRetellCall(body.phone, {
      variant: body.variant,
      visitor_id: body.visitorId
    });

    lead.callId = callResult.call_id;
    lead.callStatus = callResult.call_status;

    // Track conversion
    if (body.variant === 'a' || body.variant === 'b') {
      storage.metrics[body.variant].conversions++;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      leadId: lead.id,
      callId: callResult.call_id,
      message: 'Lead captured (mock mode - no real call made)'
    }));

  } else if (pathname === '/api/track') {
    const { eventType, variant } = body;

    console.log(`📊 Tracking: ${eventType} for variant ${variant}`);

    // Store event
    storage.events.push({
      ...body,
      timestamp: new Date().toISOString()
    });

    // Update metrics
    if (eventType === 'impression' && (variant === 'a' || variant === 'b')) {
      storage.metrics[variant].impressions++;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));

  } else if (pathname.startsWith('/api/stats')) {
    const variantA = storage.metrics.a;
    const variantB = storage.metrics.b;

    const calcRate = (conversions, impressions) =>
      impressions > 0 ? ((conversions / impressions) * 100).toFixed(2) : '0.00';

    const stats = {
      period: 'total',
      lastUpdated: new Date().toISOString(),
      variants: {
        a: {
          name: 'Variant A (Safety Focus)',
          impressions: variantA.impressions,
          conversions: variantA.conversions,
          conversionRate: calcRate(variantA.conversions, variantA.impressions)
        },
        b: {
          name: 'Variant B (Value Focus)',
          impressions: variantB.impressions,
          conversions: variantB.conversions,
          conversionRate: calcRate(variantB.conversions, variantB.impressions)
        }
      },
      recentLeads: storage.leads.slice(-10).reverse().map(lead => ({
        id: lead.id,
        phone: lead.phone,
        variant: lead.variant,
        timestamp: lead.timestamp,
        callStatus: lead.callStatus
      }))
    };

    // Return HTML dashboard
    const html = generateDashboard(stats);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);

  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'API endpoint not found' }));
  }
}

function generateDashboard(stats) {
  const { variants, recentLeads } = stats;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>A/B Test Dashboard - LOCAL DEV MODE</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, sans-serif; background: #f7fafc; padding: 40px 20px; }
    .dev-banner { background: #ff6b6b; color: white; padding: 15px; text-align: center; font-weight: 600; margin-bottom: 20px; }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { font-size: 2rem; margin-bottom: 20px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 40px; }
    .card { background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    h2 { font-size: 1.5rem; margin-bottom: 20px; }
    .metric { margin-bottom: 15px; }
    .metric-label { font-size: 0.875rem; color: #718096; margin-bottom: 5px; }
    .metric-value { font-size: 2rem; font-weight: 700; }
    .conversion-rate { color: #667eea; }
    .leads-table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; }
    .leads-table th { background: #667eea; color: white; padding: 15px; text-align: left; }
    .leads-table td { padding: 12px 15px; border-bottom: 1px solid #e2e8f0; }
    .variant-badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
    .variant-a { background: #fed7d7; color: #c53030; }
    .variant-b { background: #c6f6d5; color: #2f855a; }
  </style>
</head>
<body>
  <div class="dev-banner">
    🔧 LOCAL DEVELOPMENT MODE - Data is stored in memory (resets on server restart)
  </div>
  <div class="container">
    <h1>A/B Test Dashboard</h1>
    <p style="color: #718096; margin-bottom: 30px;">Last updated: ${new Date().toLocaleString()}</p>

    <div class="grid">
      <div class="card">
        <h2>${variants.a.name}</h2>
        <div class="metric">
          <div class="metric-label">Impressions</div>
          <div class="metric-value">${variants.a.impressions}</div>
        </div>
        <div class="metric">
          <div class="metric-label">Conversions</div>
          <div class="metric-value">${variants.a.conversions}</div>
        </div>
        <div class="metric">
          <div class="metric-label">Conversion Rate</div>
          <div class="metric-value conversion-rate">${variants.a.conversionRate}%</div>
        </div>
      </div>

      <div class="card">
        <h2>${variants.b.name}</h2>
        <div class="metric">
          <div class="metric-label">Impressions</div>
          <div class="metric-value">${variants.b.impressions}</div>
        </div>
        <div class="metric">
          <div class="metric-label">Conversions</div>
          <div class="metric-value">${variants.b.conversions}</div>
        </div>
        <div class="metric">
          <div class="metric-label">Conversion Rate</div>
          <div class="metric-value conversion-rate">${variants.b.conversionRate}%</div>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>Recent Leads</h2>
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
              <td>${lead.callStatus || 'mock'}</td>
            </tr>
          `).join('') : '<tr><td colspan="4" style="text-align: center; color: #718096;">No leads yet</td></tr>'}
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>
  `;
}

// Main server
const server = http.createServer((req, res) => {
  let pathname = req.url.split('?')[0];

  // Handle API routes
  if (pathname.startsWith('/api/')) {
    handleApiRequest(req, res, pathname);
    return;
  }

  // Serve static files
  if (pathname === '/') {
    pathname = '/index.html';
  }

  const filePath = path.join(__dirname, 'public', pathname);
  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║   VENT CLEANERS - LOCAL DEVELOPMENT SERVER          ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
  console.log(`📊 Dashboard at: http://localhost:${PORT}/api/stats`);
  console.log('\n⚠️  LOCAL MODE:');
  console.log('   - Data stored in memory (resets on restart)');
  console.log('   - Retell AI calls are mocked (logged to console)');
  console.log('   - No database required\n');
  console.log('📝 To deploy to production, run: npm run deploy\n');
  console.log('Press Ctrl+C to stop\n');
});
