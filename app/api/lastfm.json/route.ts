import { content } from '../../../src/content';

export const dynamic = 'force-static';

type RecentTrack = {
  name?: string;
  artist?: { '#text'?: string };
  album?: { '#text'?: string };
  image?: { size?: string; '#text'?: string }[];
  url?: string;
  date?: { uts?: string };
  '@attr'?: { nowplaying?: string };
};

export async function GET() {
  const apiKey = process.env.LASTFM_API_KEY;
  if (!apiKey) {
    return Response.json({ artists: [], songs: [], nowPlaying: null });
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

  const fetchRecentTrack = async () => {
    const params = new URLSearchParams({
      method: 'user.getrecenttracks',
      user: content.lastfm.user,
      api_key: apiKey,
      format: 'json',
      limit: '1',
    });
    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`, {
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const data = await response.json();
    const rawTrack = data?.recenttracks?.track;
    const track = (Array.isArray(rawTrack) ? rawTrack[0] : rawTrack ?? null) as RecentTrack | null;
    if (!track?.name) return null;
    const images = track.image ?? [];
    return {
      name: track.name,
      artist: track.artist?.['#text'] ?? '',
      album: track.album?.['#text'] ?? '',
      image: images.find((image) => image.size === 'large')?.['#text'] || images[images.length - 1]?.['#text'] || '',
      url: track.url ?? '',
      nowPlaying: track['@attr']?.nowplaying === 'true',
      playedAt: track.date?.uts ?? '',
    };
  };

  try {
    const [artistData, trackData, nowPlaying] = await Promise.all([
      fetchChart('user.gettopartists'),
      fetchChart('user.gettoptracks'),
      fetchRecentTrack().catch(() => null),
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
      { artists, songs, nowPlaying },
      { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=600' } },
    );
  } catch {
    return Response.json({ artists: [], songs: [], nowPlaying: null });
  }
}
