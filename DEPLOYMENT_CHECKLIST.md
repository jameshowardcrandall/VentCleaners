# Deployment Checklist

Use this checklist to ensure everything is configured correctly.

## Pre-Deployment

- [ ] Node.js 18+ installed
- [ ] Vercel account created
- [ ] Retell AI account created with credits
- [ ] Retell AI agent configured and tested
- [ ] `npm install` completed successfully

## Retell AI Setup

- [ ] API key obtained
- [ ] Agent ID obtained
- [ ] Agent configured with appropriate script for dryer vent cleaning
- [ ] Agent tested manually via Retell dashboard
- [ ] Phone number configured in Retell AI (for outbound calls)

## Environment Variables

- [ ] `.env` file created from `.env.example`
- [ ] `RETELL_API_KEY` added to `.env`
- [ ] `RETELL_AGENT_ID` added to `.env`
- [ ] `STATS_TOKEN` set to secure random string

## Initial Deployment

- [ ] Vercel CLI installed globally (`npm install -g vercel`)
- [ ] Logged in to Vercel (`vercel login`)
- [ ] Initial deployment completed (`vercel`)
- [ ] Project linked to Vercel account

## Vercel Dashboard Configuration

- [ ] Vercel KV database created
- [ ] KV database connected to project
- [ ] `RETELL_API_KEY` added to environment variables
- [ ] `RETELL_AGENT_ID` added to environment variables
- [ ] `STATS_TOKEN` added to environment variables
- [ ] Environment variables set for Production, Preview, and Development

## Production Deployment

- [ ] Production deployment completed (`vercel --prod`)
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic with Vercel)

## Testing

- [ ] Landing page loads correctly
- [ ] Variant A displays properly
- [ ] Variant B displays properly
- [ ] Refreshing page shows same variant (localStorage working)
- [ ] Phone input accepts and formats numbers
- [ ] Form validation works (try invalid phone numbers)
- [ ] Form submission successful with valid phone
- [ ] Success modal appears after submission
- [ ] Retell AI call initiated (verify by receiving actual call)
- [ ] Dashboard accessible at `/api/stats?token=YOUR_TOKEN`
- [ ] Dashboard shows test submission
- [ ] Analytics tracking impressions
- [ ] Analytics tracking conversions

## Retell AI Call Verification

- [ ] Call received within 15 minutes
- [ ] Caller ID shows configured number
- [ ] AI agent greets appropriately
- [ ] Agent mentions dryer vent cleaning
- [ ] Call quality is acceptable
- [ ] Agent completes script successfully

## Analytics Verification

Visit `/api/stats?token=YOUR_TOKEN` and verify:

- [ ] Both variants show in dashboard
- [ ] Impression counts incrementing
- [ ] Test conversion appears in "Recent Leads"
- [ ] Phone number displayed correctly
- [ ] Timestamp accurate
- [ ] Variant label correct (A or B)

## Performance Testing

- [ ] Page loads in under 3 seconds
- [ ] Mobile responsive on phone
- [ ] Mobile responsive on tablet
- [ ] Works on Chrome
- [ ] Works on Safari
- [ ] Works on Firefox
- [ ] Works on mobile browsers

## Security

- [ ] `.env` file in `.gitignore`
- [ ] No sensitive data committed to git
- [ ] `STATS_TOKEN` is strong and secret
- [ ] Dashboard not accessible without token
- [ ] HTTPS enabled (automatic with Vercel)

## Monitoring Setup

- [ ] Vercel email notifications enabled
- [ ] Error tracking configured
- [ ] Uptime monitoring setup (optional)
- [ ] Analytics dashboard bookmarked

## Go-Live

- [ ] All above items checked
- [ ] Stakeholders notified
- [ ] Marketing campaigns updated with new URL
- [ ] Google Ads pointed to landing page
- [ ] Social media links updated
- [ ] Documentation reviewed

## Post-Launch (First 24 Hours)

- [ ] Monitor Vercel logs for errors
- [ ] Check dashboard for traffic
- [ ] Verify calls are being made
- [ ] Respond to test leads
- [ ] Monitor A/B test distribution (should be ~50/50)

## Post-Launch (First Week)

- [ ] Daily dashboard checks
- [ ] Review call recordings (if enabled in Retell AI)
- [ ] Monitor conversion rates
- [ ] Adjust Retell AI script if needed
- [ ] Collect feedback from team handling calls

## Optimization (Ongoing)

- [ ] Wait for statistical significance (100+ conversions per variant)
- [ ] Identify winning variant
- [ ] Plan next round of A/B tests
- [ ] Iterate on messaging based on call feedback
- [ ] Consider additional variants

## Scaling Checklist (When Needed)

- [ ] Monitor Vercel usage dashboard
- [ ] Upgrade Vercel plan if approaching limits
- [ ] Add rate limiting if needed
- [ ] Consider CDN for assets
- [ ] Implement caching strategies
- [ ] Add monitoring/alerting tools

---

## Quick Reference

**Production URL**: `https://your-project.vercel.app`

**Dashboard URL**: `https://your-project.vercel.app/api/stats?token=YOUR_TOKEN`

**Vercel Logs**: `vercel logs --follow`

**Redeploy**: `vercel --prod`

---

**Date Completed**: _______________

**Deployed By**: _______________

**Notes**:
