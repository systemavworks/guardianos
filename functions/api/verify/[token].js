/**
 * Cloudflare Pages Function — GuardianOS Audit Verify Proxy
 * Ruta automática: guardianos.es/api/verify/{token}
 *
 * Variable de entorno (Pages → Settings → Environment variables):
 *   BACKEND_URL  →  URL raíz del backend GuardianOS Audit
 *                   Ejemplo ngrok:  https://xxxxx.ngrok-free.app
 *                   Ejemplo VPS:    https://audit.guardianos.es
 */
export async function onRequestGet({ params, env }) {
  const token   = params.token;
  const backend = (env.BACKEND_URL || '').replace(/\/$/, '');

  const cors = {
    'Access-Control-Allow-Origin': 'https://guardianos.es',
    'Content-Type':                'application/json',
    'Cache-Control':               'no-store',
  };

  if (!backend) {
    return new Response(
      JSON.stringify({ error: 'BACKEND_URL no configurada en Cloudflare Pages' }),
      { status: 503, headers: cors }
    );
  }

  const url = `${backend}/api/v1/verify/${token}`;

  let res;
  try {
    res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      cf: { cacheTtl: 0 },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Backend no disponible', detail: String(err) }),
      { status: 503, headers: cors }
    );
  }

  const body = await res.text();
  return new Response(body, { status: res.status, headers: cors });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin':  'https://guardianos.es',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
