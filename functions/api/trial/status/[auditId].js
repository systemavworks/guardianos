/**
 * Cloudflare Pages Function — GuardianOS Audit Trial Status Proxy
 * Ruta automática: guardianos.es/api/trial/status/{auditId}  (GET)
 *
 * Devuelve el estado minimalista de una auditoría de trial para polling
 * desde la landing page. No requiere autenticación.
 *
 * Variable de entorno:
 *   BACKEND_URL  →  https://audit.guardianos.es
 */

const CORS = {
  'Access-Control-Allow-Origin':  'https://guardianos.es',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestGet({ params, env }) {
  const auditId = params.auditId;
  const backend = (env.BACKEND_URL || '').replace(/\/$/, '');

  if (!backend) {
    return new Response(
      JSON.stringify({ error: 'Servicio no disponible' }),
      { status: 503, headers: CORS }
    );
  }

  let res;
  try {
    res = await fetch(`${backend}/api/v1/trial/status/${auditId}`, {
      headers: { 'Accept': 'application/json' },
      cf: { cacheTtl: 0 },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Backend no disponible', detail: String(err) }),
      { status: 503, headers: CORS }
    );
  }

  const body = await res.text();
  return new Response(body, { status: res.status, headers: CORS });
}
