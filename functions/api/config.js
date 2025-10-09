export async function onRequestGet(context) {
  const eventName = context.env.EVENT_NAME || "Il Nostro Fantastico Evento";
  const googleAnalyticsId = context.env.GOOGLE_ANALYTICS_ID || null;

  const config = {
    eventName: eventName,
    googleAnalyticsId: googleAnalyticsId,
  };

  return new Response(JSON.stringify(config), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
