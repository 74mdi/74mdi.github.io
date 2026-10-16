# 7amdi site

Next.js App Router site built with Bun and vinext for Cloudflare Workers.

## Requirements

- Bun 1.4.3 or newer
- Node.js 22 or newer for Cloudflare and vinext tooling

Install dependencies with `bun install`. Common commands:

- `bun run dev` — Cloudflare Vite development server
- `bun run build` — optimized Worker and prerendered static assets
- `bun run preview` — preview the Vite build
- `bun run deploy` — deploy to Cloudflare Workers
- `bun run check:compat` — check the app against vinext's Next.js API support
- `bun run dev:next` — use the standard Next.js dev server

Set `NEXT_PUBLIC_SITE_URL` to the site's public HTTPS origin in the Cloudflare build environment. This value supplies the canonical URL, sitemap, Open Graph URL, and structured data. It currently falls back to the original Attie site URL.

Set `LASTFM_API_KEY` as a server-side secret to enable top artists. Use `.env.local` for the Next.js development server and `.dev.vars` for the Cloudflare Vite development server (templates are provided). For production, add it as a Cloudflare Worker secret with `bunx wrangler secret put LASTFM_API_KEY`. The key is read by `/api/lastfm` and is never included in the browser bundle.

The root route owns the shared metadata, robots policy, sitemap, JSON-LD, and generated Open Graph and Twitter cards. Route-specific pages inherit these defaults and can override them with their own metadata and image routes.
