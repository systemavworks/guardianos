/**
 * Cloudflare Pages Function — GuardianOS Audit Verify Proxy
 * Ruta automática: guardianos.es/audit/verify/{token}
 *
 * Hace proxy al backend GuardianOS Audit que ya genera la página
 * HTML completa de verificación del certificado.
 *
 * Variable de entorno (Pages → Settings → Environment variables):
 *   BACKEND_URL  →  URL raíz del backend GuardianOS Audit
 *                   Ejemplo VPS:    https://audit.guardianos.es
 */
export async function onRequestGet({ params, request, env }) {
  const token   = params.token;
  const backend = (env.BACKEND_URL || '').replace(/\/$/, '');

  // Sin BACKEND_URL configurada → página de error informativa
  if (!backend) {
    return new Response(notConfiguredHtml(token), {
      status: 503,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }

  const verifyUrl = `${backend}/verify/${token}`;

  let res;
  try {
    res = await fetch(verifyUrl, {
      headers: { 'Accept': 'text/html', 'X-Forwarded-For': request.headers.get('CF-Connecting-IP') || '' },
      cf: { cacheTtl: 0 },
    });
  } catch (err) {
    return new Response(errorHtml(token, 'Backend no disponible', String(err)), {
      status: 503,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }

  if (res.status === 404) {
    return new Response(notFoundHtml(token), {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }

  // Devolver la página HTML generada por el backend tal cual
  return new Response(res.body, {
    status: res.status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Frame-Options': 'SAMEORIGIN',
    },
  });
}

// ── Páginas de error ──────────────────────────────────────────────────────────

const baseStyle = `
  body{margin:0;font-family:'Segoe UI',system-ui,sans-serif;background:#0a0e12;color:#cbd5e1;
       display:flex;align-items:center;justify-content:center;min-height:100vh}
  .card{background:#0f1923;border:1px solid #1e2d3d;border-radius:16px;padding:2.5rem;
        max-width:480px;width:90%;text-align:center}
  h1{color:#2a9d8f;font-size:1.4rem;margin:0 0 1rem}
  p{line-height:1.6;font-size:.9rem}
  code{background:#1e2d3d;padding:.2rem .5rem;border-radius:4px;font-family:monospace}
  a{color:#2a9d8f;text-decoration:none}
  a:hover{text-decoration:underline}
`;

function notFoundHtml(token) {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">
<title>Certificado no encontrado — GuardianOS Audit</title>
<style>${baseStyle}</style></head><body>
<div class="card">
  <h1>⚠ Certificado no encontrado</h1>
  <p>El token <code>${token}</code> no corresponde a ningún certificado emitido,
     o el certificado ha sido revocado.</p>
  <p><a href="https://guardianos.es/audit">← Volver a guardianos.es/audit</a></p>
</div></body></html>`;
}

function notConfiguredHtml(token) {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">
<title>Servicio no disponible — GuardianOS Audit</title>
<style>${baseStyle}</style></head><body>
<div class="card">
  <h1>⚙ Servicio no disponible</h1>
  <p>La verificación del certificado <code>${token}</code> no está disponible en este momento.</p>
  <p>Contacta con <a href="mailto:audit@guardianos.es">audit@guardianos.es</a> si el problema persiste.</p>
  <p><a href="https://guardianos.es/audit">← Volver a guardianos.es/audit</a></p>
</div></body></html>`;
}

function errorHtml(token, msg, detail) {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">
<title>Error de verificación — GuardianOS Audit</title>
<style>${baseStyle}</style></head><body>
<div class="card">
  <h1>✗ Error al verificar</h1>
  <p>${msg}</p>
  <p>Token: <code>${token}</code></p>
  <p><a href="https://guardianos.es/audit">← Volver a guardianos.es/audit</a></p>
</div></body></html>`;
}
