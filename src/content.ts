/** Editable public content for the site. Last.fm credentials live in the server environment. */
export const content = {
  /** Set true to temporarily replace every page with a centered “salam!”. */
  maintenanceMode: false,
  name: '7amdi',
  lines: [
    'I’m a developer building things for the web.',
    'Posting ikhan as @7amdi on Bluesky.',
    'Listening to everything as khrya on Last.fm.',
  ],
  bluesky: '7amdi.bsky.social',
  lastfm: {
    user: 'khrya',
    period: 'overall',
  },
} as const;
