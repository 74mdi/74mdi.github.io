'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

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

  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  return <LastFmContext.Provider value={{ charts, failed, retry }}>{children}</LastFmContext.Provider>;
}

export function useLastFmData() {
  const data = useContext(LastFmContext);
  if (!data) throw new Error('useLastFmData must be used inside LastFmDataProvider');
  return data;
}
