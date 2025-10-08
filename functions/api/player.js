async function getAccessToken(context) {
  const clientId = context.env.SPOTIFY_CLIENT_ID;
  const clientSecret = context.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = context.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Variabili d'ambiente del server non configurate.");
  }

  const basicAuth = btoa(`${clientId}:${clientSecret}`);
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Impossibile rinfrescare il token di Spotify.");
  }

  const data = await response.json();
  return data.access_token;
}

export async function onRequestGet(context) {
  try {
    const accessToken = await getAccessToken(context);
    const playerEndpoint = 'https://api.spotify.com/v1/me/player?market=from_token';

    const playerResponse = await fetch(playerEndpoint, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    // Se non sta suonando nulla, Spotify risponde con 204 No Content
    if (playerResponse.status === 204 || playerResponse.status > 400) {
      return new Response(JSON.stringify({ isPlaying: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await playerResponse.json();

    const responsePayload = {
      isPlaying: data.is_playing,
      track: data.item?.name || 'Unknown Track',
      artists: (data.item?.artists || []).map(a => a.name).join(', '),
      albumCover: data.item?.album?.images?.[0]?.url || '',
      uri: data.item?.uri || '',
    };

    return new Response(JSON.stringify(responsePayload), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Errore nella funzione player:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
