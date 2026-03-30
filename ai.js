// routes/ai.js  — Lana AI proxy (keeps API key server-side)
const express = require('express');
const fetch   = require('node-fetch');
const { protect } = require('../middleware/auth');

const router = express.Router();

const LANA_SYSTEM = `You are Lana, a friendly and knowledgeable AI shopping assistant for PostMall — Nairobi's premier social commerce platform.

Your expertise:
- Nairobi's shopping malls: Sawa Mall (Tom Mboya St), City Mall (Moi Ave), Metropolis Building (2nd Fl), Dynamic Mall, Heritage Plaza, Central Plaza
- Categories: Fashion, Food & Restaurants, Automotive, Electronics & Tech, Accessories, Beauty, Sports
- Pricing in Kenyan Shillings (KSh)
- Local brands and popular Nairobi markets

Personality:
- Warm, practical and conversational
- Use casual Kenyan expressions: "Sawa!", "Poa!", "Hakuna matata!", "Uko sawa"
- Keep answers concise (2–4 sentences unless asked for detail)
- When recommending stores, mention the mall/building and floor where possible
- Format prices as "KSh X,XXX"

Never make up store names or prices. If unsure, say so warmly.`;

// POST /api/ai/chat
router.post('/chat', protect, async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, message: 'Messages array is required.' });
    }

    // Only allow user/assistant roles
    const safeMessages = messages
      .filter(m => ['user', 'assistant'].includes(m.role) && m.content)
      .map(m => ({ role: m.role, content: String(m.content).slice(0, 2000) }))
      .slice(-20);  // Max 20 turns

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system:     LANA_SYSTEM,
        messages:   safeMessages,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Anthropic error:', err);
      return res.status(502).json({ success: false, message: 'AI service temporarily unavailable.' });
    }

    const data  = await response.json();
    const reply = data?.content?.[0]?.text || "Sorry, I couldn't get a response right now. Please try again!";

    res.json({ success: true, reply, usage: data.usage });
  } catch (err) {
    console.error('Lana AI error:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
