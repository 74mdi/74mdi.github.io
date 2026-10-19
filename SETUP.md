# 7amdi site

This Next.js App Router site is built with Bun and deployed as a static export to GitHub Pages.

## Local development

- Bun 1.4.3 or newer
- Node.js 24 or newer

Install packages with `bun install`, then run `bun run dev`. Use `bun run build` to create a production build and `bun run start` to serve it locally.

Copy `.env.example` to `.env.local` and set `LASTFM_API_KEY` to enable the Last.fm charts during local builds. Keep the key server-side; it is used to generate the exported chart data and is not included in the browser bundle.

## GitHub Pages

The `Deploy Next.js site to GitHub Pages` workflow builds and publishes the site on pushes to `main`, and every six hours to refresh the Last.fm charts. Add `LASTFM_API_KEY` as a repository Actions secret. `public/CNAME` configures the `7amdi.is-a.dev` custom domain; set the repository Pages source to **GitHub Actions**.

The root route provides the shared metadata, robots policy, sitemap, JSON-LD, and generated Open Graph and Twitter cards. Writing pages can override these with their own metadata and image routes.
