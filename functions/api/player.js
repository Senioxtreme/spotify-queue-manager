import { json } from '../_http.js';
import { spotifyFetch, spotifyError, trackFromSpotify } from '../_spotify.js';

export async function onRequestGet({ env }) {
  try {
    const response = await spotifyFetch(env, '/me/player?market=from_token');
    if (response.status === 204) return json({ isPlaying: false, track: null });
    if (!response.ok) { const e = spotifyError(response); return json({ error: e.error }, e.status); }
    const data = await response.json();
    return json({ isPlaying: Boolean(data.is_playing), track: trackFromSpotify(data.item), progressMs: data.progress_ms || 0 });
  } catch (error) {
    console.error('player:', error.message);
    return json({ error: 'Impossibile leggere il player Spotify.' }, 503);
  }
}
