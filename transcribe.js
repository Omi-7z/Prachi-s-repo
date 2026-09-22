// Proxies a session recording to a self-hosted Whisper service.
// The audio is never persisted here and never leaves your infrastructure.
// Whisper is too heavy for Vercel function limits — run it as its own container
// (Fly / Railway / GPU box) and point WHISPER_URL at it.

export const config = { runtime: 'nodejs', maxDuration: 300 };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const form = await req.formData();
  const file = form.get('audio');
  const langHint = form.get('lang') || undefined;
  if (!file) return res.status(400).json({ error: 'audio required' });

  const upstream = new FormData();
  upstream.append('audio', file);
  // transcribe, never translate — the extractor needs the artisan's words as spoken
  upstream.append('task', 'transcribe');
  upstream.append('model', 'large-v3');
  // a hint only; sessions code-switch mid-sentence and Whisper should be free to override
  if (langHint) upstream.append('language_hint', langHint);

  try {
    const r = await fetch(process.env.WHISPER_URL + '/transcribe', {
      method: 'POST',
      headers: { authorization: 'Bearer ' + process.env.WHISPER_TOKEN },
      body: upstream
    });
    if (!r.ok) return res.status(502).json({ error: 'transcription failed', detail: await r.text() });

    const { text, language, segments } = await r.json();
    // Return the raw transcript for facilitator review BEFORE extraction runs.
    // They were in the room; only they can catch a mis-heard craft term.
    return res.status(200).json({ text, language, segments });
  } finally {
    // Nothing to unlink on this side — we stream through and hold no copy.
    // The Whisper container must delete its temp file in its own finally block.
  }
}
