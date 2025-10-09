async function getAccessToken(context) {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = context.env;
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    throw new Error("Variabili d'ambiente del server non configurate.");
  }

  const basicAuth = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Authorization': `Basic ${basicAuth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: SPOTIFY_REFRESH_TOKEN }),
  });

  if (!response.ok) throw new Error("Impossibile rinfrescare il token di Spotify.");
  const data = await response.json();
  return data.access_token;
}

export async function onRequestGet(context) {
  try {
    const accessToken = await getAccessToken(context);
    const queueEndpoint = 'https://api.spotify.com/v1/me/player/queue';

    const queueResponse = await fetch(queueEndpoint, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    if (queueResponse.status === 204 || queueResponse.status > 400) {
      return new Response(JSON.stringify({ nowPlaying: null, queue: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await queueResponse.json();

    const nowPlaying = data.currently_playing ? {
        uri: data.currently_playing.uri,
    } : null;

    const queue = (data.queue || []).map(item => ({
      track: item.name || 'Traccia Sconosciuta',
      artists: (item.artists || []).map(a => a.name).join(', '),
      albumCover: item.album?.images?.[0]?.url || '',
      uri: item.uri || '',
    }));

    return new Response(JSON.stringify({ nowPlaying, queue }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Errore nella funzione queue:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
