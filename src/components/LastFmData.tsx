'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { content } from '../content';

export type NowPlaying = {
  name: string;
  artist: string;
  album: string;
  image: string;
  url: string;
  nowPlaying: boolean;
  playedAt: string;
};
export type ChartItem = { name: string; detail?: string; playcount: string; url: string };
export type Charts = { artists: ChartItem[]; songs: ChartItem[]; nowPlaying: NowPlaying | null };

type LastFmData = {
  charts: Charts | null;
  failed: boolean;
  retry: () => void;
};

const LastFmContext = createContext<LastFmData | null>(null);

export function LastFmDataProvider({ children }: { children: ReactNode }) {
  const [charts, setCharts] = useState<Charts | null>(null);
  const [liveTrack, setLiveTrack] = useState<NowPlaying | null | undefined>(undefined);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
    setCharts(null);
    setFailed(false);
    fetch(`${basePath}/api/lastfm.json?v=2&retry=${attempt}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Last.fm request failed');
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data?.artists)) throw new Error('Unexpected Last.fm response');
        setCharts({
          artists: data.artists,
          songs: Array.isArray(data.songs) ? data.songs : [],
          nowPlaying: data.nowPlaying ?? null,
        });
      })
      .catch((error) => {
        if (error?.name !== 'AbortError') setFailed(true);
      });
    return () => controller.abort();
  }, [attempt]);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_LASTFM_API_KEY;
    if (!apiKey) return;

    let stopped = false;
    let request: AbortController | undefined;
    let inFlight = false;

    const refresh = async () => {
      if (stopped || inFlight || document.visibilityState !== 'visible') return;
      inFlight = true;
      const controller = new AbortController();
      request = controller;
      const params = new URLSearchParams({
        method: 'user.getrecenttracks',
        user: content.lastfm.user,
        api_key: apiKey,
        format: 'json',
        limit: '1',
      });
      try {
        const response = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!response.ok) throw new Error('Last.fm request failed');
        const data = await response.json();
        const rawTrack = data?.recenttracks?.track;
        const track = (Array.isArray(rawTrack) ? rawTrack[0] : rawTrack) as {
          name?: string;
          artist?: { '#text'?: string };
          album?: { '#text'?: string };
          image?: { size?: string; '#text'?: string }[];
          url?: string;
          date?: { uts?: string };
          '@attr'?: { nowplaying?: string };
        } | null | undefined;
        const images = track?.image ?? [];
        setLiveTrack(track?.name ? {
          name: track.name,
          artist: track.artist?.['#text'] ?? '',
          album: track.album?.['#text'] ?? '',
          image: images.find((image) => image.size === 'large')?.['#text'] || images[images.length - 1]?.['#text'] || '',
          url: track.url ?? '',
          nowPlaying: track['@attr']?.nowplaying === 'true',
          playedAt: track.date?.uts ?? '',
        } : null);
      } catch {
        // Keep the previous listen visible when Last.fm is temporarily unavailable.
      } finally {
        if (request === controller) request = undefined;
        inFlight = false;
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void refresh();
      } else {
        request?.abort();
      }
    };

    void refresh();
    const interval = window.setInterval(() => void refresh(), 10_000);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      stopped = true;
      request?.abort();
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  const dataCharts = charts && liveTrack !== undefined ? { ...charts, nowPlaying: liveTrack } : charts;
  return <LastFmContext.Provider value={{ charts: dataCharts, failed, retry }}>{children}</LastFmContext.Provider>;
}

export function useLastFmData() {
  const data = useContext(LastFmContext);
  if (!data) throw new Error('useLastFmData must be used inside LastFmDataProvider');
  return data;
}
