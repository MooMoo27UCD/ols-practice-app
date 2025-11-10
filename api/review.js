// api/review.js
export default async function handler(req, res) {
  // Allow only POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).send('Method Not Allowed');
  }

  // Basic CORS for browser hits if needed
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const apiKey = process.env.STATS_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server missing STATS_KEY' });
    }

    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing "prompt" in JSON body' });
    }

    // Call OpenAI Chat Completions (browser-safe via server route)
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a statistics TA. Be concise, correct, and show formulas.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 600
      })
    });

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(resp.status).json({ error: `OpenAI error: ${text}` });
    }

    const data = await resp.json();
    const answer = data?.choices?.[0]?.message?.content ?? '(No answer)';
    return res.status(200).json({ answer });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
