import { content } from '../../../src/content';

export const dynamic = 'force-static';

export async function GET() {
  const apiKey = process.env.LASTFM_API_KEY;
  if (!apiKey) {
    return Response.json({ artists: [] });
  }

  const params = new URLSearchParams({
    method: 'user.gettopartists',
    user: content.lastfm.user,
    api_key: apiKey,
    format: 'json',
    limit: '8',
    period: content.lastfm.period,
  });

  try {
    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      return Response.json({ artists: [] });
    }

    const data = await response.json();
    const artists = data?.topartists?.artist;
    if (!Array.isArray(artists)) {
      return Response.json({ artists: [] });
    }

    return Response.json(
      { artists },
      { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=600' } },
    );
  } catch {
    return Response.json({ artists: [] });
  }
}
