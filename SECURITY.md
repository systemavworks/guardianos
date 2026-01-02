
---

## 📄 `SECURITY.md`

```markdown
# Política de Seguridad — GuardianOS  
### Divulgación Responsable para la Protección de Menores

Agradecemos a la comunidad de seguridad su labor en identificar y reportar vulnerabilidades. Tu trabajo ayuda a proteger a familias y menores. Esta política define cómo colaborar con nosotros de forma ética y efectiva.

---

## 🎯 Alcance

Los siguientes activos están dentro del alcance de esta política:

| Tipo | Dominio / Servicio |
|------|--------------------|
| Web | `https://guardianos.es` y subdominios (`www`, `*.guardianos.es`) |
| Infraestructura | Servicios autohospedados vinculados a `guardianos.es` |
| Aplicaciones | App **GuardianOS** (cuando esté publicada) |

> ❌ **Fuera de alcance**:  
> - Servicios de terceros (GitHub, Cloudflare, DonDominio).  
> - Ataques de fuerza bruta, phishing o ingeniería social contra usuarios.  
> - Vulnerabilidades teóricas sin impacto práctico en menores o familias.

---

## ✅ Cómo reportar

1. **Cifra tu reporte**  
   Usa nuestra clave PGP pública:  
   🔗 [`https://guardianos.es/pgp-key.txt`](https://guardianos.es/pgp-key.txt)  
   Fingerprint: `8D5D 2148 485D BFD3 1BFC 3DDB 2F50 61C4 7E2B F14F`

2. **Envía a**: `info@guardianos.es`  
   Asunto: `[SECURITY] Breve descripción`

3. **Incluye**:  
   - Tipo de vulnerabilidad (XSS, SSRF, configuración insegura, etc.)  
   - Pasos para reproducir (sin dañar servidores)  
   - Impacto potencial (¿afecta a datos de menores? ¿permite suplantación?)  
   - Propuesta de mitigación (opcional pero valorada)

---

## 📅 Tiempos de respuesta

| Etapa | Plazo |
|------|-------|
| Confirmación de recepción | ≤ 72 horas |
| Evaluación técnica | ≤ 7 días |
| Solución (crítica) | ≤ 14 días |
| Reconocimiento público | Tras resolución, y solo con tu consentimiento |

---

## 🛡️ Lo que esperamos de ti

- ✅ **Ética primero**: no extraigas, modifiques ni compartas datos.  
- ✅ **Comunica antes de publicar**: respetamos el *coordinated disclosure*.  
- ✅ **Evita escaneo agresivo**: no uses herramientas que generen tráfico masivo (ej. `sqlmap --batch`).  
- ✅ **Protege a menores**: si encuentras riesgos en apps infantiles, avísanos inmediatamente.

---

## 🏆 Reconocimiento

Quienes reporten vulnerabilidades válidas y críticas serán incluidos (con permiso) en nuestra:  
🔗 [**Hall of Fame de Seguridad**](https://guardianos.es/security-hall-of-fame.html)  
*(página en desarrollo — ¡serás el primero!)*

---

## 📜 Cumplimiento legal

Esta política se rige por la normativa española (LOPDGDD, RGPD) y los principios del **Marco Ético de Ciberseguridad para Menores** (UNICEF, 2023).

> 📬 En caso de duda: `info@guardianos.es` — cifrado, por favor.

**Protegemos a menores. Actuamos con integridad. Agradecemos tu responsabilidad.**
