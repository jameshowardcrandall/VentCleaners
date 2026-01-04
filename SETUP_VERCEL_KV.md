# Setting Up Vercel KV Database

Your landing page is now deployed and working! However, to store leads and track analytics properly, you need to set up Vercel KV.

## Current Status

✅ **Landing page is live**: https://vent-cleaners.vercel.app
✅ **Form submission works** (logs to console)
✅ **Retell AI ready** (will trigger calls once credentials are added)
⚠️ **KV Database needed** for persistent storage

## Quick Setup (5 minutes)

### Step 1: Go to Vercel Dashboard

1. Visit: https://vercel.com/dashboard
2. Click on your **vent-cleaners** project

### Step 2: Create KV Database

1. Click the **Storage** tab (top navigation)
2. Click **Create Database**
3. Select **KV** (Redis)
4. Name it: `vent-cleaners-kv`
5. Select region: **Same as your deployment** (probably US East)
6. Click **Create**

### Step 3: Connect to Project

1. In the KV database page, click **Connect to Project**
2. Select **vent-cleaners**
3. Click **Connect**

That's it! The environment variables will be automatically added.

### Step 4: Add Retell AI Credentials

1. In your project, go to **Settings** → **Environment Variables**
2. Add these two variables:

| Name | Value |
|------|-------|
| `RETELL_API_KEY` | `key_39167ebebff655fd5b3137ece1d0` |
| `RETELL_AGENT_ID` | `agent_fbb694cde6fb017bdaf00a49bd` |

3. Select **Production**, **Preview**, and **Development** for both
4. Click **Save**

### Step 5: Redeploy (Optional)

The KV connection is automatic, but to ensure everything is loaded:

```bash
vercel --prod
```

Or just wait - the next deployment will pick it up automatically.

## Verify Everything Works

1. **Visit your site**: https://vent-cleaners.vercel.app
2. **Submit a test lead** with your phone number
3. **Check you receive a call** from Retell AI
4. **View the dashboard**: https://vent-cleaners.vercel.app/api/stats

## What Happens Without KV?

The site still works! Here's what's different:

| Feature | Without KV | With KV |
|---------|-----------|---------|
| Landing page | ✅ Works | ✅ Works |
| Form submission | ✅ Works | ✅ Works |
| Retell AI calls | ✅ Works | ✅ Works |
| Lead storage | ⚠️ Logged only | ✅ Stored in DB |
| Analytics tracking | ⚠️ Logged only | ✅ Tracked in DB |
| Dashboard | ⚠️ Shows 0 | ✅ Shows real data |

## Cost

**Vercel KV Free Tier:**
- 256 MB storage
- 30,000 commands/month
- $0/month

This is enough for:
- ~10,000 leads
- ~50,000 analytics events
- Several months of data

## Troubleshooting

### Dashboard shows "KV not available"

This means KV isn't connected yet. Follow steps above.

### "Internal server error" on form submit

1. Check Vercel logs: `vercel logs --follow`
2. Ensure Retell AI credentials are added
3. Verify KV is connected

### Retell calls not working

1. Check environment variables are set
2. Verify API key and Agent ID are correct
3. Ensure Retell AI account has credits

## Next Steps

Once KV is set up:

1. ✅ Submit test leads
2. ✅ Verify data appears in dashboard
3. ✅ Start driving traffic
4. ✅ Monitor A/B test results
5. ✅ Iterate and optimize

---

**Your production URL**: https://vent-cleaners.vercel.app
**Dashboard URL**: https://vent-cleaners.vercel.app/api/stats

Enjoy your new lead generation system! 🚀
