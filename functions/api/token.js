// functions/api/token.js

export async function onRequestGet(context) {
  // 'context.env' contiene le variabili d'ambiente definite in Cloudflare
  const spotifyToken = context.env.SPOTIFY_ACCESS_TOKEN;

  if (!spotifyToken) {
    // Se la variabile non è impostata, restituisci un errore
    return new Response(
      JSON.stringify({ error: 'La variabile d\'ambiente del token Spotify non è configurata.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Invia il token al client in formato JSON
  return new Response(
    JSON.stringify({ accessToken: spotifyToken }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
