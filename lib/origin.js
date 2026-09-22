// The public address artisans' links and QR codes point at.
//
// It must never be the address the console happens to be open on: every Vercel deployment
// also has its own URL (karigar-toolkit-<hash>-<team>.vercel.app) that carries the team name
// and sits behind Vercel's login, so a link built from it cannot be opened by an artisan.
//   1. APP_ORIGIN, if set in Vercel (e.g. a custom domain like https://karigar.in)
//   2. the project's production domain, which Vercel provides automatically
//   3. the request's own origin (local development)
export function publicOrigin(req) {
  const set = (process.env.APP_ORIGIN || process.env.NEXT_PUBLIC_APP_ORIGIN || '').trim().replace(/\/+$/, '');
  if (/^https?:\/\/[^/\s]+$/.test(set)) return set;
  const prod = (process.env.VERCEL_PROJECT_PRODUCTION_URL || '').trim();
  if (prod) return 'https://' + prod.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  return new URL(req.url).origin;
}
