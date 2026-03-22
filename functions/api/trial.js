/**
 * Cloudflare Pages Function — GuardianOS Audit Trial Proxy
 * Ruta automática: guardianos.es/api/trial  (POST)
 *
 * Redirige la solicitud de prueba gratuita al backend GuardianOS Audit.
 *
 * Variable de entorno (Pages → Settings → Environment variables):
 *   BACKEND_URL  →  URL raíz del backend, p.ej. https://audit.guardianos.es
 */

const CORS = {
  'Access-Control-Allow-Origin':  'https://guardianos.es',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestPost({ request, env }) {
  const backend = (env.BACKEND_URL || '').replace(/\/$/, '');

  if (!backend) {
    return new Response(
      JSON.stringify({ error: 'Servicio temporalmente no disponible. Inténtalo de nuevo en unos minutos.' }),
      { status: 503, headers: CORS }
    );
  }

  // Leer body del cliente
  let body;
  try {
    body = await request.text();
    JSON.parse(body); // validar JSON
  } catch {
    return new Response(
      JSON.stringify({ error: 'Solicitud inválida' }),
      { status: 400, headers: CORS }
    );
  }

  // Reenviar al backend con la IP real del visitante (para rate-limit)
  const clientIp = request.headers.get('CF-Connecting-IP') || '';

  let res;
  try {
    res = await fetch(`${backend}/api/v1/trial`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Real-IP': clientIp,
        'Accept': 'application/json',
      },
      body,
      cf: { cacheTtl: 0 },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Backend no disponible. Inténtalo en unos minutos.', detail: String(err) }),
      { status: 503, headers: CORS }
    );
  }

  const respBody = await res.text();
  return new Response(respBody, { status: res.status, headers: CORS });
}
