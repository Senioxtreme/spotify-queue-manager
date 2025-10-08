// functions/api/config.js

export async function onRequestGet(context) {
  // Legge la variabile d'ambiente EVENT_NAME. Se non è definita, usa un valore di default.
  const eventName = context.env.EVENT_NAME || "Il Nostro Fantastico Evento";

  // Prepara i dati di configurazione da inviare al frontend
  const config = {
    eventName: eventName,
  };

  // Restituisce la configurazione in formato JSON
  return new Response(JSON.stringify(config), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
