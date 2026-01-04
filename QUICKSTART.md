# Quick Start Guide

Get your Vent Cleaners landing page live in 10 minutes!

## Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

## Step 2: Get Your Retell AI Credentials

1. Log in to [Retell AI Dashboard](https://app.retellai.com)
2. Create or select your AI agent
3. Copy your **API Key** and **Agent ID**

## Step 3: Deploy

```bash
cd VentCleaners
npm install
vercel
```

Follow the prompts:
- Link to your Vercel account
- Name your project (e.g., "vent-cleaners")
- Accept defaults for other settings

## Step 4: Set Up Database

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **Storage** tab
4. Click **Create Database** → **KV**
5. Name it "vent-cleaners-kv"
6. Click **Connect** to link it to your project

## Step 5: Add Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add these variables:

| Name | Value | Notes |
|------|-------|-------|
| `RETELL_API_KEY` | Your Retell API key | Required for calls |
| `RETELL_AGENT_ID` | Your Retell Agent ID | Required for calls |
| `STATS_TOKEN` | Any secret string | Optional, secures dashboard |

3. Click **Save**

## Step 6: Redeploy

```bash
vercel --prod
```

This final deployment includes your environment variables.

## Step 7: Test It!

1. Visit your live URnpm run dev
L (shown after deployment)
2. Test the form with your phone number
3. Verify you receive a call from Retell AI
4. Check analytics at: `https://your-url.vercel.app/api/stats?token=your_stats_token`

## You're Live! 🎉

Your landing page is now:
- ✅ Running A/B tests automatically
- ✅ Collecting phone numbers
- ✅ Triggering automatic calls via Retell AI
- ✅ Tracking all conversions and metrics

## Next Steps

### 1. Drive Traffic
- Set up Google Ads campaign
- Run Facebook/Instagram ads
- Share on social media
- Add to your Google Business profile

### 2. Monitor Performance
- Check `/api/stats` dashboard daily
- Wait for statistical significance (usually 100+ conversions)
- Identify winning variant

### 3. Iterate
Once you have a winner:
- Create new variants based on insights
- Test different headlines, CTAs, or value props
- Continuously optimize conversion rate

### 4. Scale Up
When you exceed free tier limits:
- Upgrade Vercel plan (starts at $20/month)
- Consider adding more sophisticated analytics
- Implement retargeting pixels

## Common Issues

**❌ Calls not working?**
- Double-check Retell AI credentials in Vercel dashboard
- Verify your Retell AI account has credits
- Check Vercel function logs: `vercel logs`

**❌ Dashboard showing 401 Unauthorized?**
- Make sure you added `?token=your_stats_token` to the URL
- Verify `STATS_TOKEN` matches in Vercel environment variables

**❌ Form not submitting?**
- Check browser console for errors
- Ensure phone number is 10 digits
- Verify Vercel KV database is connected

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Retell AI Docs**: https://docs.retellai.com
- **Check Logs**: `vercel logs --follow`

---

**Estimated setup time**: 10 minutes
**Monthly cost**: $0 (up to ~7,500 visitors)
**Time to first lead**: Immediately after launch! 🚀
