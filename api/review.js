// /api/review.js  (Vercel Node.js Serverless Function)
const OPENAI_API_KEY = process.env.STATS_KEY; // you set this in Vercel

module.exports = async (req, res) => {
  // Basic CORS preflight (harmless even on same origin)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST' });
  }

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Missing STATS_KEY on Vercel' });
  }

  try {
    const { question = '', selection = '' } = req.body || {};
    const prompt = [
      selection ? `Context:\n${selection}\n\n` : '',
      'Question:\n',
      question || '(no question provided)'
    ].join('');

    // Chat Completions (stable, simple)
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful TA for an MBA course. Be concise, accurate, and math-friendly.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2
      })
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(500).json({ error: 'OpenAI error', detail: text });
    }

    const data = await r.json();
    const answer = data.choices?.[0]?.message?.content?.trim() || 'No answer.';
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ answer });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', detail: String(err) });
  }
};
