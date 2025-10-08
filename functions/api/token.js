
export async function onRequestGet(context) {
  const clientId = context.env.SPOTIFY_CLIENT_ID;
  const clientSecret = context.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = context.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return new Response(
      JSON.stringify({ error: "Variabili d'ambiente del server non configurate correttamente." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const tokenEndpoint = 'https://accounts.spotify.com/api/token';
  
  const basicAuth = btoa(`${clientId}:${clientSecret}`);

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Errore da Spotify API:", response.status, errorBody);
      throw new Error(`Spotify ha risposto con un errore: ${response.status}`);
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({ accessToken: data.access_token }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Errore nella funzione per ottenere il token:", error);
    return new Response(
      JSON.stringify({ error: "Impossibile generare un nuovo token di accesso." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
