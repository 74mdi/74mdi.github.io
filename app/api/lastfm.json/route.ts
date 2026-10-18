import { content } from '../../../src/content';

export const dynamic = 'force-static';

export async function GET() {
  const apiKey = process.env.LASTFM_API_KEY;
  if (!apiKey) {
    return Response.json({ artists: [], songs: [] });
  }

  const fetchChart = async (method: 'user.gettopartists' | 'user.gettoptracks') => {
    const params = new URLSearchParams({
      method,
      user: content.lastfm.user,
      api_key: apiKey,
      format: 'json',
      limit: '8',
      period: content.lastfm.period,
    });
    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;
    return response.json();
  };

  try {
    const [artistData, trackData] = await Promise.all([
      fetchChart('user.gettopartists'),
      fetchChart('user.gettoptracks'),
    ]);
    const artists = Array.isArray(artistData?.topartists?.artist) ? artistData.topartists.artist : [];
    const songs = Array.isArray(trackData?.toptracks?.track)
      ? trackData.toptracks.track.map((track: { name: string; artist?: { name?: string }; playcount: string; url: string }) => ({
          name: track.name,
          detail: track.artist?.name ?? '',
          playcount: track.playcount,
          url: track.url,
        }))
      : [];

    return Response.json(
      { artists, songs },
      { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=600' } },
    );
  } catch {
    return Response.json({ artists: [], songs: [] });
  }
}
