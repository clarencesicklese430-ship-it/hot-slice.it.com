/*
 * Cloudflare Pages Function: /sl/<gameId>
 *
 * Slots Launch requires signed iframe URLs (from 15 Nov 2026). The page embeds
 * <iframe src="/sl/<gameId>">; this function signs a fresh URL and 302s the
 * iframe to it, so the API secret never reaches the browser and cached HTML
 * never contains an expiring signature.
 *
 * sig = HMAC-SHA256(secret, "<gameId>\n<exp>\n<siteDomain>")  (hex)
 * Same scheme as slotslaunch/slotslaunch-php Client::signEmbed().
 *
 * Pages project env vars:
 *   SL_API_KEY      Launch Pad → API key (goes into ?token=)
 *   SL_API_SECRET   Launch Pad → API secret (encrypted variable)
 *   SL_SITE_DOMAIN  optional; defaults to the request host without "www."
 *   SL_TTL          optional; signature lifetime in seconds (default 3600)
 */
const enc = new TextEncoder();

async function hmacHex(secret, payload) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const buf = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequestGet({ params, env, request }) {
  const id = String(params.id || '');
  if (!/^\d{1,9}$/.test(id) || !env.SL_API_KEY || !env.SL_API_SECRET) {
    return new Response('Demo unavailable', { status: 404, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });
  }
  const domain = (env.SL_SITE_DOMAIN || new URL(request.url).hostname).replace(/^www\./, '');
  const exp = Math.floor(Date.now() / 1000) + (parseInt(env.SL_TTL, 10) || 3600);
  const sig = await hmacHex(env.SL_API_SECRET, `${id}\n${exp}\n${domain}`);
  const url = `https://slotslaunch.com/iframe/${id}?token=${encodeURIComponent(env.SL_API_KEY)}&exp=${exp}&sig=${sig}`;
  return new Response(null, {
    status: 302,
    headers: { Location: url, 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' }
  });
}

export const onRequestHead = onRequestGet;
