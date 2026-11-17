# Integraciones técnicas

**Fecha:** 2026-11-16  
**Fuentes:** `config/services.php`, `app/Services/DniLookupService.php`, `app/Services/ChatbotService.php`, `app/Mail/ContactMessage.php`, `app/Notifications/*`, `app/Jobs/GenerateAdoption*`, `config/filesystems.php`, `config/queue.php`, `.env.example`, `routes/*`, `vite.config.ts`, `capacitor/`.

## 1. Resumen

| Integración | Tipo | Propósito | Evidencia | Estado |
|---|---|---|---|---|
| Google OAuth (Socialite) | Externa (IdP) | Login social | `SocialLoginController`, `services.google`, rutas `/auth/google*` | Verificado |
| Google Analytics (GA4) | Externa (analítica) | Medición web | `services.google.analytics_id` (`GA_MEASUREMENT_ID`) | Configurado, uso en frontend **Parcial** |
| apisperu DNI | Externa (HTTP API) | Consulta datos por DNI | `DniLookupService`, `services.dni`, `/api/dni/lookup` | Verificado |
| Correo (SMTP/Mailpit u otro) | Infra/externa | Notificaciones y contacto | `MailMessage`, `ContactMessage`, `config/mail.php` (implícito), `.env.example` | Verificado (código) |
| Almacenamiento de archivos | Infra (local/S3-compatible) | Fotos, PDFs, logos/galerías | `config/filesystems.php`, usos de `Storage::disk('public')` | Verificado |
| Colas / Scheduler | Infra interna | Jobs, listeners/notificaciones asíncronas, vencimientos | `ShouldQueue`, `routes/console.php`, `config/queue.php` | Verificado (depende de operación) |
| SQL Server + Stored Procedures | Persistencia | BD principal objetivo y SPs T-SQL | `.env.example`, `database/stored-procedures/**`, comando carga | Verificado (definición); SPs en runtime **no evidenciado** |
| Chatbot | Interna (sin proveedor IA) | Respuestas por reglas | `ChatbotService` | Verificado |
| PWA / Capacitor | Cliente/plataforma | Offline/caché y empaquetado móvil | `vite.config.ts`, `capacitor/` | Verificado |

## 2. Detalle por integración

### 2.1 Google OAuth
- **Credenciales/config:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` (`config/services.php`).
- **Flujo:** rutas de redirección/callback en `routes/web.php` con `SocialLoginController`.
- **Riesgos:** manejo de vinculación de cuentas, email existente y estados de error **pendiente de confirmación en controlador**.
- **Migración:** mantener proveedor OAuth o equivalente en nueva auth (Better Auth/alternativa) con paridad de cuentas.

### 2.2 apisperu (DNI)
- **Endpoint:** `DNI_API_URL` (default `https://dniruc.apisperu.com/api/v1/dni`), `DNI_API_TOKEN`.
- **Contrato observado:** `GET {baseUrl}/{dni}?token=...`; éxito esperado `success==true` con `nombres`, `apellidoPaterno`, `apellidoMaterno`.
- **Comportamiento:** normaliza a 8 dígitos; sin token devuelve `source=token_missing`; no encontrado/error manejados sin excepción al cliente.
- **Timeout:** 10s. **Sin rate limiting/caching** observado en capa app para el endpoint público autenticado de consulta.
- **Exposición:** `POST /api/dni/lookup` (`Api\DniController`) — revisar protección de abuso en reconstrucción.

### 2.3 Correo y notificaciones
- **Canales:** notificaciones Laravel por `mail` (adopción enviada/aprobada, invitación equipo) implementan `ShouldQueue`.
- **Contacto:** `App\Mail\ContactMessage` (subject, `replyTo` remitente) enviado desde flujo de contacto.
- **Dependencia operativa:** driver/host de mail y ejecución de colas (`QUEUE_CONNECTION`, worker).

### 2.4 Almacenamiento de archivos
- **Disco default:** `local` (privado) por config; **uso efectivo principal:** `public` (`storage/app/public`, expuesto vía symlink `/storage`).
- **Rutas/objetos observados:** `pets/`, `lost-pets/`, `teams/logos/`, `teams/gallery/`, `follow-ups/`, `adoptions/acta-*.pdf`, `certificates/adoption-*.pdf`.
- **S3-compatible:** configurado (`AWS_*`, endpoint, path-style) pero activación depende de entorno.
- **Riesgo:** mezcla de rutas relativas y URLs (`Storage::url`) en registros; validar consistencia al migrar.

### 2.5 Colas, jobs y scheduler
- **Queue default:** `database` (config), `.env.example` frecuentemente `sync` en dev (pendiente confirmar entorno real).
- **Jobs:** `GenerateAdoptionActaJob`, `GenerateAdoptionCertificateJob`, `CheckOverdueMilestonesJob` (todos `ShouldQueue`).
- **Listeners en cola:** notificaciones de adopción y creación de plan.
- **Scheduler:** `CheckOverdueMilestonesJob` diario en `routes/console.php`.

### 2.6 Base de datos y Stored Procedures
- **Objetivo declarado:** SQL Server (`sqlsrv`), SPs en `database/stored-procedures/{pets,adoptions,announcements,blog,reports}`.
- **Operación:** comando `app:load-stored-procedures` carga definiciones.
- **Hallazgo:** no se evidenció consumo de `sp_*` desde aplicación; lógica actual usa Eloquent/queries. **Crítico para paridad y migración.**

### 2.7 Chatbot (interna)
- **Implementación:** reglas y matching por keywords en memoria (`ChatbotService`), sin NLP/LLM externo.
- **API:** `POST /api/chatbot/ask`.
- **Consideración:** contenido/respuestas hardcodeadas (contacto, costos, flujos) deben pasar a configuración/contenido gestionable en 2.0.

### 2.8 Frontend/PWA/Capacitor y analítica
- **PWA:** Workbox/VitePWA con caché de assets, fuentes e imágenes.
- **Móvil:** Capacitor (cámara, notificaciones push locales/plugins, splash/status bar) — paridad funcional móvil **pendiente**.
- **GA:** ID configurable; inyección/uso en vistas frontend **por confirmar**.

## 3. Matriz de variables de entorno (observadas)

| Variable | Uso |
|---|---|
| `GOOGLE_CLIENT_ID/SECRET/REDIRECT_URI`, `GA_MEASUREMENT_ID` | OAuth/analítica |
| `DNI_API_TOKEN`, `DNI_API_URL` | Consulta DNI |
| `MAIL_*` | Correo transaccional |
| `FILESYSTEM_DISK`, `AWS_*` | Almacenamiento |
| `QUEUE_CONNECTION`, `DB_QUEUE_*`, `REDIS_*` | Colas |
| `DB_CONNECTION`, `DB_*` | Persistencia (SQL Server en target legacy) |

## 4. Recomendaciones de reconstrucción
- Centralizar integraciones detrás de interfaces (puertos) por módulo: identidad, notificaciones, documentos, almacenamiento, búsqueda de identidad (DNI).
- Añadir idempotencia, retries con backoff, observabilidad y protección anti-abuso en endpoints expuestos (chatbot/DNI).
- Definir estrategia de archivos (S3-compatible) y URLs firmadas si aplica; planificar migración de binarios existentes.

## 5. Estado en WASIYUQ 2.0 (Fase 3, 2026-11-17)

| Integración | 2.0 | Configuración | Estado |
|---|---|---|---|
| Autenticación | Better Auth 1.7.15 (librería embebida, no servicio externo) | `AUTH_SECRET`, `AUTH_BASE_URL`, `WEB_APP_URL`, `AUTH_TRUSTED_ORIGINS`, `AUTH_RATE_LIMIT`, `AUTH_TRUST_PROXY` | Implementado |
| Google OAuth | Proveedor social de Better Auth; vinculación por email verificado (paridad Socialite) | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`; callback `${AUTH_BASE_URL}/api/auth/callback/google` | Implementado; **activo solo con credenciales; no probado contra Google real** |
| Correo | Puerto `EmailSender`: transportes `console` (desarrollo) y `memory` (tests); plantillas en español (verificación, restablecimiento, invitación) | `MAIL_TRANSPORT` | Implementado para dev/test; **sin transporte de producción** (arranque bloqueado en producción) |
| DNI (apisperu) | — | — | No migrado (fase posterior, `modules/integrations`) |
| Analítica GA4 | — | — | No migrado |

Detalle: `docs/technical/AUTHENTICATION.md`.
