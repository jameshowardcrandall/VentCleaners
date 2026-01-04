# Set Up Vercel KV Database - 2 Minutes

You're seeing this error in logs:
```
Error: @vercel/kv: Missing required environment variables KV_REST_API_URL and KV_REST_API_TOKEN
```

This is **normal** - your KV database just isn't connected yet. Everything still works, but leads and analytics aren't being stored.

## Quick Fix (2 minutes)

### Option 1: Via Vercel Dashboard (Easiest)

1. Go to https://vercel.com/dashboard
2. Click on your **vent-cleaners** project
3. Click **Storage** tab (top navigation)
4. Click **Create Database**
5. Select **KV** (Redis)
6. Name: `vent-cleaners-kv`
7. Region: **Washington, D.C., USA (iad1)** (same as your deployment)
8. Click **Create**
9. Click **Connect to Project**
10. Select **vent-cleaners**
11. Click **Connect**

**Done!** The environment variables are automatically added.

### Option 2: Via CLI (Advanced)

```bash
vercel integration add kv
```

Follow the prompts to create and connect.

## What This Enables

| Feature | Without KV | With KV |
|---------|-----------|---------|
| Landing page works | ✅ | ✅ |
| Form submission | ✅ | ✅ |
| Retell AI calls | ✅ | ✅ |
| Lead storage | ❌ Logged only | ✅ Stored in DB |
| Analytics tracking | ❌ Logged only | ✅ Tracked in DB |
| Dashboard shows data | ❌ Shows 0 | ✅ Shows real data |

## After Setup

1. No need to redeploy - it works immediately
2. Submit a test lead to verify
3. Check dashboard: https://vent-cleaners.vercel.app/api/stats
4. You should see leads appear!

## Verify It Worked

Check logs after setup:
```bash
vercel logs --follow
```

You should **NOT** see the KV error anymore.

## Cost

**Free Tier:**
- 256 MB storage
- 30,000 commands/month
- Good for ~10,000 leads

**Your current usage:** $0/month

---

**Set this up now to start tracking your leads and A/B test results!**
