export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (env.MAINTENANCE !== 'TRUE') {
    return await next();
  }

  if (pathname.startsWith('/maintenance.html')) {
    return await next();
  }

  const maintenanceAsset = await env.ASSETS.fetch(new URL('/maintenance.html', request.url));

  return new Response(maintenanceAsset.body, {
    status: 503,
    statusText: 'Service Unavailable',
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
