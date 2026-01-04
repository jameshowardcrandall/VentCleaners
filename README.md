# Vent Cleaners Landing Page

High-converting landing page for Vent Cleaners dryer vent service with built-in A/B testing and Retell AI integration for automatic outbound calls.

## Features

- **Two A/B Test Variants**: Automatically splits traffic 50/50 between safety-focused and value-focused messaging
- **Automatic Call Triggering**: Integrates with Retell AI to immediately call leads when they submit their phone number
- **Real-time Analytics**: Track impressions, conversions, and statistical significance
- **Zero Cost**: Runs entirely on Vercel's free tier (KV storage + serverless functions)
- **Mobile Optimized**: Fully responsive design
- **Phone Validation**: Real-time formatting and validation

## Architecture

- **Frontend**: Pure HTML/CSS/JavaScript (no build step required)
- **Hosting**: Vercel (free tier)
- **Database**: Vercel KV (Redis)
- **Backend**: Vercel Serverless Functions (Node.js)
- **AI Calls**: Retell AI API

## Project Structure

```
VentCleaners/
├── public/
│   ├── index.html          # Main landing page with variant templates
│   ├── styles.css          # Styling for both variants
│   ├── ab-test.js          # A/B testing logic
│   └── form-handler.js     # Form submission and validation
├── api/
│   ├── submit.js           # Handle form submissions + Retell AI integration
│   ├── track.js            # Track analytics events
│   └── stats.js            # A/B test dashboard
├── package.json
├── vercel.json
└── .env.example
```

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- Vercel account (free)
- Retell AI account with API credentials

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Retell AI credentials:

```env
RETELL_API_KEY=your_retell_api_key_here
RETELL_AGENT_ID=your_agent_id_here
STATS_TOKEN=your_secret_dashboard_token
```

### 4. Local Development

```bash
npm run dev
```

This starts Vercel's development server at `http://localhost:3000`

### 5. Deploy to Production

#### First Time Setup:

```bash
npm install -g vercel
vercel login
```

#### Deploy:

```bash
npm run deploy
```

Follow the prompts to:
1. Link to your Vercel account
2. Choose a project name
3. Configure the project settings

#### Add Environment Variables to Vercel:

After deployment, add your environment variables in the Vercel dashboard:

1. Go to your project dashboard
2. Click "Settings" → "Environment Variables"
3. Add:
   - `RETELL_API_KEY`
   - `RETELL_AGENT_ID`
   - `STATS_TOKEN` (optional, for dashboard security)

#### Enable Vercel KV:

1. In your Vercel project dashboard
2. Go to "Storage" tab
3. Click "Create Database" → "KV"
4. Name it (e.g., "vent-cleaners-kv")
5. Connect it to your project

The KV environment variables (`KV_REST_API_URL`, `KV_REST_API_TOKEN`) will be automatically injected.

### 6. Verify Deployment

Visit your deployed URL (e.g., `https://vent-cleaners.vercel.app`)

Test the form submission to ensure:
- Phone validation works
- Form submits successfully
- Retell AI call is triggered
- Analytics are tracked

## Viewing A/B Test Results

Access the dashboard at: `https://your-domain.vercel.app/api/stats?token=your_stats_token`

The dashboard shows:
- Impressions and conversions for each variant
- Conversion rates
- Statistical significance (p-value)
- Winner declaration when statistically significant
- Recent leads with call status

## A/B Test Variants

### Variant A: Safety Focus
- Headline: "Protect Your Home from Dryer Fires"
- Emphasizes fire prevention and urgency
- Warning badge: "15,000+ dryer fires occur annually"
- CTA: "Get My Free Quote"

### Variant B: Value Focus
- Headline: "Cut Your Dryer Energy Costs in Half"
- Emphasizes savings and efficiency
- Value badge: "Save $200+ per year on energy"
- CTA: "Call Me Now"

## How It Works

### User Flow:
1. Visitor lands on the page
2. JavaScript randomly assigns them to Variant A or B
3. Variant is stored in localStorage (consistent experience on return)
4. Impression is tracked via `/api/track`
5. User enters phone number and submits
6. Form validates and submits to `/api/submit`
7. Backend:
   - Stores lead in Vercel KV
   - Triggers Retell AI call
   - Tracks conversion event
8. Success modal shows confirmation
9. Retell AI initiates outbound call within minutes

### Analytics Flow:
- Impressions tracked when variant loads
- Conversions tracked when form submits successfully
- Metrics stored by variant and date
- Dashboard calculates conversion rates and statistical significance

## Retell AI Configuration

Your Retell AI agent should be configured to:
1. Introduce the service
2. Ask qualifying questions
3. Schedule an appointment
4. Handle objections

The landing page passes metadata to Retell:
- `lead_source`: "landing_page"
- `variant`: Which A/B test variant converted them
- `visitor_id`: Unique visitor identifier
- `timestamp`: When they submitted

## Customization

### Change Variant Copy:
Edit the `<template>` sections in [public/index.html](public/index.html)

### Modify Styling:
Edit [public/styles.css](public/styles.css)

### Add More Variants:
1. Add new `<template id="variant-c">` in index.html
2. Update VARIANTS array in [public/ab-test.js](public/ab-test.js)
3. Update dashboard in [api/stats.js](api/stats.js)

### Change Phone Validation:
Modify `validatePhone()` function in [public/form-handler.js](public/form-handler.js)

## Monitoring & Maintenance

### Check Logs:
```bash
vercel logs
```

### View KV Data:
Use Vercel dashboard or CLI:
```bash
vercel kv ls
```

### Reset Test Data:
Delete keys from Vercel KV dashboard or use CLI

## Cost Breakdown

### Vercel Free Tier Limits:
- **Bandwidth**: 100 GB/month
- **Serverless Function Execution**: 100 GB-hours/month
- **Invocations**: Unlimited
- **KV Storage**: 256 MB
- **KV Commands**: 30,000/month

### Expected Usage (per 1,000 visitors):
- **Bandwidth**: ~50 MB (landing page loads)
- **Function Executions**: ~2,000 invocations (track + submit)
- **KV Storage**: ~1 MB (leads + events)
- **KV Commands**: ~4,000 commands

**Estimated capacity**: ~7,500 visitors/month on free tier

### When You Exceed Free Tier:
Vercel charges:
- **Bandwidth**: $40/TB
- **Function Execution**: $65/100 GB-hours
- **KV**: $0.30/100K commands

For most small businesses, you'll stay within free limits. At 10,000 visitors/month, estimated cost: **$0-5/month**

## Retell AI Costs

Check [Retell AI pricing](https://retellai.com/pricing) for current rates. Typically:
- Per-minute charges for calls
- Free trial credits available

## Troubleshooting

### Calls Not Triggering:
1. Check Retell AI credentials in Vercel environment variables
2. Check Vercel function logs for errors
3. Verify Retell AI account is active and has credits

### Analytics Not Tracking:
1. Check browser console for errors
2. Verify KV database is connected
3. Check `/api/track` endpoint in Vercel logs

### Form Submission Failing:
1. Check phone number format (must be 10-11 digits)
2. Check browser console for JavaScript errors
3. Verify `/api/submit` endpoint is working

### Dashboard Not Loading:
1. Verify KV database is set up
2. Check if `STATS_TOKEN` matches query parameter
3. Check Vercel function logs

## Security Notes

- **Dashboard Access**: Protect `/api/stats` with `STATS_TOKEN` in production
- **Rate Limiting**: Consider adding rate limiting to prevent abuse
- **Phone Validation**: Server-side validation prevents invalid submissions
- **CORS**: Configured to allow your domain only (update in production)

## Next Steps

1. **Run Traffic**: Start driving traffic to test both variants
2. **Monitor Results**: Check dashboard daily for statistical significance
3. **Optimize Winner**: Once you have a winner, iterate on that variant
4. **Scale Up**: When ready, upgrade Vercel plan for more traffic

## Support

For issues or questions:
- Vercel: https://vercel.com/docs
- Retell AI: https://docs.retellai.com

## License

MIT
