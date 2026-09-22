// Self-service sign-up: creates a new organisation and its first facilitator, then signs in.
// Open to anyone by default. Set SIGNUP_CODE in Vercel to require a shared code, or
// SIGNUP_DISABLED=1 to close it and create accounts with `npm run facilitator` only.
import { timingSafeEqual } from 'node:crypto';
import { sessionCookie } from '../lib/auth.js';
import { createAccount } from '../lib/accounts.js';
import { json, readJson, route } from '../lib/http.js';

const settings = () => ({ open: process.env.SIGNUP_DISABLED !== '1', needsCode: !!process.env.SIGNUP_CODE });

function codeOk(given) {
  const want = Buffer.from(process.env.SIGNUP_CODE || '');
  const got = Buffer.from(String(given || ''));
  return want.length === got.length && timingSafeEqual(want, got);
}

export const GET = route(async () => json(settings()));

export const POST = route(async req => {
  const s = settings();
  if (!s.open) return json({ error: 'Sign-up is closed. Ask your organisation for an account.' }, 403);
  const body = await readJson(req);
  if (s.needsCode && !codeOk(body.code)) return json({ error: 'That sign-up code is not right.' }, 403);
  const f = await createAccount(body);
  return json({ ok: true }, 200, { 'set-cookie': sessionCookie(f.id) });
});
