# Add Environment Variables to Vercel

Your code is deployed, but you need to add the `RETELL_FROM_NUMBER` environment variable to Vercel.

## Quick Steps

1. Go to https://vercel.com/dashboard
2. Click on your **vent-cleaners** project
3. Go to **Settings** → **Environment Variables**
4. Add this variable:

| Name | Value | Environments |
|------|-------|--------------|
| `RETELL_FROM_NUMBER` | `+15406845359` | Production, Preview, Development |

5. Click **Save**

## Verify Other Variables

While you're there, make sure these are also set:

- ✅ `RETELL_API_KEY` = `**`
- ✅ `RETELL_AGENT_ID` = ``
- ✅ `RETELL_FROM_NUMBER` = `` **(NEW - add this)**
- ⚠️ `STATS_TOKEN` = (optional - set to a secret string if you want dashboard security)

## After Adding

The environment variable will be available immediately - no need to redeploy!

However, if you want to be safe, you can redeploy:

```bash
vercel --prod
```

## What Changed

The code now:
- ✅ Formats phone numbers to **E.164 format** (e.g., `+12137774445`)
- ✅ Uses your **from_number** (`+15406845359`) for outbound calls
- ✅ Properly integrates with Retell AI SDK format

## Test It

1. Visit https://vent-cleaners.vercel.app
2. Submit a test lead with a phone number
3. Check Vercel logs: `vercel logs --follow`
4. You should see: `Initiating Retell call to +1XXXXXXXXXX from +15406845359`
5. Your phone should ring within minutes!

---

**Your Production URL**: https://vent-cleaners.vercel.app
