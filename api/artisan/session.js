// The signed-in artisan's own profile (the same artisan-safe view a /k/<token> link gets).
import { currentArtisan } from '../../lib/artisan-auth.js';
import { artisanProfile } from '../../lib/profiles.js';
import { json, route } from '../../lib/http.js';

export const GET = route(async req => {
  const who = await currentArtisan(req);
  if (!who) return json({ error: 'signed out' }, 401);
  const profile = await artisanProfile(who.profileId, who.tokenId);
  return profile ? json({ profile }) : json({ error: 'signed out' }, 401);
});
