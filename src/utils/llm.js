const NEBIUS_API_KEY = import.meta.env.VITE_NEBIUS_API_KEY || 'YOUR_NEBIUS_API_KEY_HERE';
const NEBIUS_BASE    = 'https://api.studio.nebius.com/v1';
const MODEL          = import.meta.env.VITE_NEBIUS_MODEL || 'google/gemma-3-27b-it';

export async function callLLMDirect(prompt) {
  const res = await fetch(`${NEBIUS_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${NEBIUS_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1400,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? null;
}
