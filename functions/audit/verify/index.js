/**
 * Cloudflare Pages Function — GuardianOS Audit Verify (sin token)
 * Ruta automática: guardianos.es/audit/verify  (GET)
 *
 * Sirve la página de verificación de certificados con un campo para
 * introducir el token manualmente. El JS de la página redirige a
 * guardianos.es/audit/verify/{token} que hace proxy al backend.
 */
export async function onRequestGet() {
  return new Response(verifyIndexHtml(), {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Frame-Options': 'SAMEORIGIN',
    },
  });
}

function verifyIndexHtml() {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Verificar certificado — GuardianOS Audit</title>
  <meta name="description" content="Comprueba la autenticidad y vigencia de cualquier certificado de auditoría emitido por GuardianOS Audit.">
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',system-ui,sans-serif;background:#0a0e12;color:#cbd5e1;
         min-height:100vh;display:flex;flex-direction:column;align-items:center;
         justify-content:center;padding:1.5rem}
    a{color:#2a9d8f;text-decoration:none}
    a:hover{text-decoration:underline}

    .card{background:#0f1923;border:1px solid #1e2d3d;border-radius:16px;
          padding:2.5rem 2rem;max-width:520px;width:100%}

    .logo{display:flex;align-items:center;gap:.7rem;margin-bottom:2rem}
    .logo img{height:36px;width:36px;border-radius:6px;object-fit:contain}
    .logo-text{font-size:1rem;font-weight:700;color:#f1f5f9}
    .logo-sub{font-size:.75rem;color:#64748b}

    h1{font-size:1.35rem;font-weight:800;color:#f1f5f9;margin-bottom:.5rem}
    .desc{font-size:.88rem;color:#94a3b8;line-height:1.6;margin-bottom:1.8rem}

    label{display:block;font-size:.8rem;color:#94a3b8;margin-bottom:.4rem;font-weight:500}
    input{width:100%;background:#0a0e12;border:1px solid #1e2d3d;border-radius:8px;
          padding:.75rem 1rem;color:#f1f5f9;font-size:.9rem;font-family:monospace;
          transition:border-color .2s;outline:none}
    input:focus{border-color:#2a9d8f}
    input::placeholder{color:#334155;font-family:'Segoe UI',system-ui,sans-serif}

    .btn{display:block;width:100%;margin-top:1rem;padding:.8rem;
         background:#2a9d8f;color:#fff;border:none;border-radius:8px;
         font-size:.95rem;font-weight:700;cursor:pointer;transition:opacity .2s}
    .btn:hover{opacity:.88}

    .hint{font-size:.75rem;color:#475569;margin-top:.8rem;text-align:center}
    .hint code{background:#1e2d3d;padding:.15rem .4rem;border-radius:4px;
               font-family:monospace;color:#94a3b8}

    .footer{margin-top:2rem;font-size:.78rem;color:#334155;text-align:center}
    .footer a{color:#2a9d8f}

    .info-box{background:#0a1628;border:1px solid #1e3a5f;border-radius:10px;
              padding:1rem;margin-top:1.5rem}
    .info-box h3{font-size:.82rem;font-weight:700;color:#60a5fa;margin-bottom:.6rem}
    .info-box ul{list-style:none;display:flex;flex-direction:column;gap:.35rem}
    .info-box li{font-size:.78rem;color:#94a3b8;padding-left:.9rem;position:relative}
    .info-box li::before{content:'✓';position:absolute;left:0;color:#2a9d8f}
  </style>
</head>
<body>

<div class="card">
  <div class="logo">
    <img src="/audit/logo_guardianos_audit.jpg" alt="GuardianOS Audit">
    <div>
      <div class="logo-text">GuardianOS Audit</div>
      <div class="logo-sub">Verificación de certificados</div>
    </div>
  </div>

  <h1>Verificar certificado de auditoría</h1>
  <p class="desc">
    Introduce el token de verificación para comprobar la autenticidad,
    puntuación y vigencia de cualquier auditoría emitida por GuardianOS Audit.
  </p>

  <form id="vform" onsubmit="return false">
    <label for="token">Token de verificación</label>
    <input type="text" id="token" placeholder="ej. ab2c4d8e1f3a"
           autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
           minlength="8" maxlength="64">
    <button type="submit" class="btn" id="vbtn">🔍 Verificar certificado</button>
  </form>

  <p class="hint">
    El token aparece en el QR del PDF o en el email de auditoría.<br>
    Formato: <code>ab2c4d8e1f3a</code> (12 caracteres)
  </p>

  <div class="info-box">
    <h3>¿Qué verifica este certificado?</h3>
    <ul>
      <li>Puntuación de seguridad en el momento de la auditoría</li>
      <li>Hash SHA-256 de integridad del informe (FIPS 180-4)</li>
      <li>Cadena forense — cualquier modificación invalida el hash</li>
      <li>Estado: activo, expirado o revocado</li>
      <li>Empresa y dominio auditado</li>
    </ul>
  </div>
</div>

<div class="footer">
  <a href="https://guardianos.es/audit">← guardianos.es/audit</a>
  &nbsp;·&nbsp; GuardianOS Audit © 2026
  &nbsp;·&nbsp; <a href="mailto:audit@guardianos.es">audit@guardianos.es</a>
</div>

<script>
  document.getElementById('vform').addEventListener('submit', function() {
    const raw   = (document.getElementById('token').value || '').trim();
    const token = raw.replace(/[^a-zA-Z0-9_-]/g, '');
    const btn   = document.getElementById('vbtn');

    if (token.length < 8) {
      btn.textContent = '⚠ Token demasiado corto';
      setTimeout(() => { btn.textContent = '🔍 Verificar certificado'; }, 2000);
      return;
    }
    btn.textContent = 'Verificando…';
    btn.disabled = true;
    window.location.href = '/audit/verify/' + encodeURIComponent(token);
  });

  // Si la URL tiene un hash (#token) o query (?token=…), autocompletar el campo
  const urlToken = new URLSearchParams(window.location.search).get('token')
    || window.location.hash.replace('#', '');
  if (urlToken) {
    document.getElementById('token').value = urlToken;
  }
</script>
</body>
</html>`;
}
