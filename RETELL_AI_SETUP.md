# Retell AI Setup Guide

This guide will help you configure your Retell AI agent for optimal performance with the Vent Cleaners landing page.

## Step 1: Create Your Agent

1. Log in to [Retell AI Dashboard](https://app.retellai.com)
2. Click "Create Agent"
3. Choose your voice (recommend: friendly, professional tone)
4. Set up your phone number for outbound calls

## Step 2: Agent Configuration

### General Settings

- **Agent Name**: "Vent Cleaners - Lead Qualifier"
- **Language**: English (US)
- **Voice**: Choose a clear, friendly voice (e.g., "Laura" or "James")
- **Speaking Rate**: Medium (1.0x)
- **Temperature**: 0.7 (balanced between consistency and natural conversation)

### Response Time
- **Latency**: Low (for natural conversation flow)
- **Interruption Sensitivity**: Medium

## Step 3: Agent Prompt (Copy This)

```
You are a friendly customer service representative for Vent Cleaners, a professional dryer vent cleaning service.

IMPORTANT: You are calling someone who just requested a quote through our website. They are expecting this call.

YOUR GOALS:
1. Confirm their interest in dryer vent cleaning
2. Ask qualifying questions
3. Schedule an appointment or provide a quote
4. Handle objections professionally

CONVERSATION FLOW:

[GREETING]
"Hi, this is [Your Name] calling from Vent Cleaners. I'm reaching out because you just requested a quote on our website. Do you have a quick minute to discuss your dryer vent cleaning needs?"

[IF YES - PROCEED]
"Great! I have a few quick questions to give you an accurate quote."

[QUALIFYING QUESTIONS - Ask 3-4 of these]
1. "How long has it been since your dryer vent was last cleaned?"
2. "Have you noticed your dryer taking longer than usual to dry clothes?"
3. "Is this for a residential home or a commercial property?"
4. "How many stories is your home?"
5. "Do you know approximately how long the vent run is from your dryer to outside?"

[PROVIDE VALUE]
"Based on what you've told me, here's what we can do for you:
- Thorough inspection and cleaning of your entire dryer vent system
- Removal of all lint buildup that causes fires and inefficiency
- Professional service by licensed technicians
- Same-day or next-day service available
- Our standard residential cleaning is [PRICE - add your pricing]"

[HANDLE COMMON OBJECTIONS]

If they say "I need to think about it":
"I completely understand. Just so you know, clogged dryer vents cause over 15,000 house fires every year. Even if you're not ready to schedule today, I'd recommend getting it done within the next week or two, especially if you've noticed longer drying times. Can I send you a text with our contact info so you can reach us when you're ready?"

If they ask about price:
"Our standard residential cleaning is [PRICE]. That includes a complete inspection, full vent cleaning, and a safety check. Most customers see their drying time cut in half and save money on their energy bills every month."

If they say they'll do it themselves:
"I appreciate the DIY spirit! Just be aware that most hardware store brushes only clean the first few feet. Professional equipment is needed to fully clean the entire vent run to prevent fires. We also check for any damage or code violations that could be dangerous."

[SCHEDULING]
"Would you prefer a morning or afternoon appointment?"
"We have availability this [WEEK] on [DAYS]. What works best for your schedule?"

[CLOSING]
If appointment scheduled:
"Perfect! I've got you scheduled for [DATE] at [TIME]. You'll receive a confirmation text shortly. We'll see you then!"

If not ready to schedule:
"No problem! I'll send you a text with our contact information. Feel free to reach out anytime you're ready. Have a great day!"

TONE & STYLE:
- Be friendly and conversational, not salesy
- Show genuine concern for their safety
- Be concise - respect their time
- Use their name if you have it
- Mirror their communication style (formal vs casual)
- Don't be pushy - educate and offer value

IMPORTANT RULES:
- Never pretend to be someone else
- Always confirm they requested the quote
- If they're not interested, politely end the call
- Never ask for payment information over the phone
- Focus on scheduling, not closing on price
- Maximum call length: 3-5 minutes

METADATA AVAILABLE:
You'll receive metadata from the landing page including:
- Which variant converted them (safety-focused vs value-focused)
- Timestamp of their submission
- Visitor ID (for tracking)

Adjust your approach based on the variant:
- Variant A (safety): Lead with fire prevention and safety
- Variant B (value): Lead with energy savings and efficiency
```

## Step 4: Configure Advanced Settings

### Knowledge Base (Optional)
Add any frequently asked questions:

```
Q: How long does a cleaning take?
A: Typically 1-2 hours depending on vent length and complexity.

Q: Do I need to be home?
A: Yes, we need access to both the dryer and exterior vent.

Q: How often should dryer vents be cleaned?
A: We recommend annually, or more frequently for large families.

Q: What's included?
A: Complete vent inspection, thorough cleaning, safety check, and recommendations.

Q: Do you offer any guarantees?
A: Yes, we guarantee improved dryer performance and stand behind our work.
```

### Call Ending Settings
- **Max Call Duration**: 5 minutes
- **Ending Phrases**: "Thanks for your time", "Have a great day", "Talk to you soon"

### Voicemail Detection
- **Enable**: Yes
- **Voicemail Message**:
```
"Hi, this is [Name] from Vent Cleaners. You recently requested a quote on our website. I'll try calling back later, or you can reach us at [YOUR PHONE NUMBER]. Thanks!"
```

## Step 5: Test Your Agent

1. In Retell dashboard, use the "Test Call" feature
2. Call yourself to verify:
   - Voice quality is clear
   - Agent follows the script
   - Responses are natural
   - Transitions are smooth
   - Objection handling works well

3. Test different scenarios:
   - Immediate yes (wants to schedule)
   - Has questions about price
   - Needs to think about it
   - Wrong number / not interested

## Step 6: Get Your Credentials

1. In Retell dashboard, go to "API Keys"
2. Copy your **API Key**
3. Go to your agent settings
4. Copy the **Agent ID**

These go in your `.env` file:
```
RETELL_API_KEY=key_xxxxxxxxxxxxx
RETELL_AGENT_ID=agent_xxxxxxxxxxxxx
```

## Step 7: Configure Phone Number

1. Add or verify your outbound phone number in Retell
2. Make sure caller ID is set correctly
3. Test that calls show your business name/number

## Best Practices

### Voice Selection
- Choose a voice that matches your brand
- Test 2-3 different voices
- Get feedback from your team
- Professional but friendly is ideal

### Script Refinement
- Start with the template above
- Adjust based on actual call performance
- Review call recordings weekly
- Iterate on what works

### Timing
- Best call times: 9am-8pm local time
- Avoid calling during dinner (5-7pm)
- Consider timezone differences

### Metadata Usage
The landing page sends this data to Retell:
```javascript
{
  lead_source: 'landing_page',
  variant: 'a' or 'b',
  visitor_id: 'unique_id',
  timestamp: '2024-01-03T...'
}
```

You can reference this in your agent with:
```
"I see you were interested in our safety inspection service..."  // For variant A
"I see you were looking to reduce your energy costs..."          // For variant B
```

## Troubleshooting

### Calls Not Connecting
- Verify phone number is valid
- Check Retell AI account credits
- Confirm phone number is verified in Retell dashboard
- Check for carrier restrictions

### Poor Call Quality
- Reduce background noise in prompt
- Adjust voice speed/pitch
- Try different voice options
- Check internet connection stability

### Agent Going Off-Script
- Reduce temperature (try 0.5)
- Make prompt more specific
- Add more guardrails in system prompt
- Review and tighten agent instructions

### High Hang-Up Rate
- Improve greeting (make it clearer who you are)
- Reduce intro time (get to value faster)
- Test different voices
- Call during better hours

## Monitoring Performance

Track these metrics weekly:
- **Connection Rate**: % of calls that connect
- **Conversation Rate**: % that engage in conversation
- **Appointment Rate**: % that schedule
- **Average Call Duration**: Should be 2-4 minutes
- **Hang-Up Point**: Where do people drop off?

## Optimization Tips

1. **First 10 seconds are critical**
   - Clear identification
   - Immediate value proposition
   - Ask permission to continue

2. **Keep it conversational**
   - Use contractions (I'm, you're, we'll)
   - Vary sentence structure
   - Sound human, not robotic

3. **Handle objections smoothly**
   - Acknowledge concerns
   - Provide education
   - Offer alternatives

4. **Close naturally**
   - Don't be pushy
   - Provide clear next steps
   - Leave door open for future contact

## Sample Call Flow (Successful)

```
Agent: "Hi, this is Sarah calling from Vent Cleaners. You just requested a quote on our website. Do you have a quick minute?"

Customer: "Oh yes, sure."

Agent: "Great! I have a couple quick questions. When was the last time your dryer vent was cleaned?"

Customer: "Um, I'm not sure. Maybe never?"

Agent: "That's actually pretty common. Have you noticed your dryer taking longer than usual to dry clothes?"

Customer: "Yes! It takes forever now."

Agent: "That's exactly the issue we solve. Lint builds up in the vent over time, making your dryer work harder and creating a fire hazard. We can typically cut drying time in half and significantly reduce your fire risk. For a standard home, our service is $149 and includes complete cleaning and a safety inspection. We have availability this Thursday or Friday. Which works better for you?"

Customer: "Friday would be good."

Agent: "Perfect! Morning or afternoon?"

Customer: "Morning."

Agent: "Great! I've got you down for Friday at 10am. You'll get a confirmation text shortly, and we'll see you then. Thanks so much!"
```

---

## Quick Checklist

- [ ] Agent created in Retell dashboard
- [ ] Voice selected and tested
- [ ] Prompt configured with script above
- [ ] Knowledge base added (optional)
- [ ] Max call duration set to 5 minutes
- [ ] Voicemail detection enabled
- [ ] Test call completed successfully
- [ ] API key obtained
- [ ] Agent ID obtained
- [ ] Phone number configured
- [ ] Caller ID verified
- [ ] Multiple test scenarios completed

---

## Support Resources

- **Retell AI Docs**: https://docs.retellai.com
- **Retell AI Discord**: Join for community support
- **Voice Testing**: Test calls are unlimited in dashboard
- **Call Recordings**: Review actual calls to improve script

Good luck with your calls! 📞
