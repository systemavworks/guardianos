/**
 * Cloudflare Pages Function — GuardianOS Audit Verify SPA
 * Ruta automática: guardianos.es/audit/verify/{token}
 *
 * Sirve audit/index.html manteniendo la URL original para que
 * el JS de la página detecte /verify/TOKEN en window.location.
 */
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  // Servir el index del audit como SPA (preserva la URL del navegador)
  url.pathname = '/audit/index.html';
  return env.ASSETS.fetch(url.toString());
}
