# Decisiones de seguridad — identidad y organizaciones (Fases 3 y 3.1)

**Fecha:** 2026-11-17 (S-23 en adelante: Fase 3.1; auditoría detallada en [`AUTHENTICATION_SECURITY.md`](AUTHENTICATION_SECURITY.md))  
Registro de decisiones con su motivo y la prueba que las respalda. Varias surgieron de revisiones de seguridad automáticas y de la verificación en navegador durante la implementación.

| # | Decisión | Motivo / riesgo mitigado | Verificación |
|---|---|---|---|
| S-01 | Sin super admin por email; `platform_role` explícito y CLI auditada | Legacy concedía acceso total a un email hardcodeado | Test admin API |
| S-02 | Admins de plataforma sin permisos implícitos en organizaciones | Separación plataforma / tenant; mínimo privilegio | Test admin → 404 en organización ajena |
| S-03 | Autorización por organización evaluada en servidor en cada caso de uso, deny by default; no miembros → 404 | IDOR / aislamiento multi-tenant; evitar enumeración | Tests de aislamiento (servicio y HTTP) |
| S-04 | Sin escalada de roles; `owner` nunca asignable (también `CHECK` en BD) | Legacy permitía invitar como `owner` | Tests de dominio, servicio y BD |
| S-05 | Re-validación del emisor al aceptar una invitación | TOCTOU: invitación emitida antes de degradar/quitar al emisor | Test `inviter_lost_rights` |
| S-06 | Tokens de invitación de 256 bits, guardados como SHA-256, nunca devueltos por la API | Robo de BD / exposición en respuestas | Tests de hash y de respuesta |
| S-07 | Tokens de verificación/restablecimiento guardados hasheados (`storeIdentifier: "hashed"`), un solo uso, restablecer revoca sesiones | Robo de BD; sesiones comprometidas | Test de reutilización y revocación |
| S-08 | Sin cookie cache de sesión; estado `active` exigido en cada resolución (fail closed) y sesiones borradas al suspender | Revocación inmediata | Tests de suspensión y expiración |
| S-09 | Token de sesión eliminado de todos los JSON de `/api/auth/*`; `/list-sessions` desactivado | Exposición del token a JavaScript (anula httpOnly) | Test sign-in/get-session |
| S-10 | Cookies httpOnly, SameSite=Lax, Secure en producción; mismo origen sin CORS | Robo de sesión / CSRF | E2E (flags de cookie) |
| S-11 | Origin obligatorio y confiable en mutaciones; checks de Better Auth forzados también en tests | CSRF; la librería los desactiva al detectar entorno de test | Tests CSRF (identity y API) |
| S-12 | Redirecciones solo a orígenes confiables / rutas relativas | Open redirect | Test `redirectTo` externo; tests de `safeRedirect` |
| S-13 | Rate limiting de auth en BD; IP de cliente escrita por el servidor (socket o salto derecho de XFF con proxy de confianza) | Fuerza bruta; suplantación de IP para evadir límites | Test 429; test `resolveClientIp` |
| S-14 | Respuesta idéntica para email inexistente y contraseña errónea; recuperación siempre 200 | Enumeración de cuentas | Tests |
| S-15 | Logs JSON sin secretos: rutas con tokens redactadas, errores sin mensaje (solo tipo y SQLSTATE) | Fugas de tokens/PII (SQL con parámetros) en logs | Tests `log-safety` y de logs en aceptación |
| S-16 | Validación Zod estricta (campos desconocidos rechazados), IDs UUID validados antes de consultar | Mass assignment; errores de BD expuestos | Tests de validación |
| S-17 | Cabeceras de seguridad (`secureHeaders`) | Clickjacking, sniffing | Test de cabeceras |
| S-18 | Configuración que se niega a arrancar en producción sin transporte de correo, sin rate limit o sin HTTPS | Despliegue inseguro accidental | Test de configuración |
| S-19 | Rol por defecto en invitaciones = `member` (control de formulario) | Error de UI que preseleccionaba "Administrador" | E2E |
| S-20 | Versiones de librerías de autenticación fijadas (Better Auth 1.7.15, publicada >2 semanas antes) | Cadena de suministro; releases muy frecuentes | `package.json` |
| S-21 | Zod actualizado a 4.6.7 (GHSA-mrhx-c7xc-m3w5, agotamiento de memoria en validación) | La API valida cuerpos con Zod | `bun audit`, suite completa |
| S-22 | Límite de cuerpo 64 KB en `/api/v1` → 413 `PAYLOAD_TOO_LARGE` | Payloads gigantes antes de validar | Test API |
| S-23 | Hasher scrypt propio con los mismos parámetros y formato que Better Auth, concurrencia acotada, comparación en tiempo constante, hash malformado → `false` | Agotamiento de memoria/pool de hilos con ráfagas (32 MiB por hash); timing; 500 por datos corruptos | `password-hasher.test.ts` (compatibilidad en ambos sentidos, límite, lag del event loop), `auth-concurrency.test.ts` |
| S-24 | Registro sin sesión automática (`autoSignIn: false`): email existente → misma respuesta y aviso `account_exists` al titular | Enumeración de cuentas mediante el registro (antes 422 `USER_ALREADY_EXISTS`) | Tests identity (estado, forma del cuerpo, sin cookie) y E2E |
| S-25 | Correo en segundo plano (`EmailDispatcher`); los callbacks de Better Auth nunca esperan al proveedor | Enumeración por tiempo de respuesta o por un 500 del proveedor solo en cuentas existentes | Test de proveedor caído: respuestas 200 sin cambios |
| S-26 | Errores de correo saneados (código + estado SMTP), logger de nodemailer desactivado, logs sin destinatario ni enlaces | Fuga de tokens de un solo uso y emails a logs | `email-delivery.test.ts`, test de logs en authentication |
| S-27 | Asuntos de correo en una sola línea; nombres escapados en HTML | Inyección de cabeceras / HTML vía nombres de usuario u organización | `mail-config.test.ts` |
| S-28 | Producción exige SMTP con TLS/STARTTLS, credenciales, host no local y dominio de envío real; la API sale con código 1 si falta algo (incluida una BD inválida) | Despliegue con correo "falso" o a medias | `mail-config.test.ts`, `security-regressions.test.ts` |
| S-29 | `/ready` solo expone `ok`/`degraded` del correo; los contadores van a `GET /api/v1/admin/email-health` (admins) | Canal lateral: contador de pendientes revelaría si una solicitud generó un correo (hallazgo de revisión automática) | Tests API |
| S-30 | Logger de Better Auth redirigido al logger estructurado con emails redactados y argumentos reducidos a su tipo | La librería registra "Sign-up attempt for existing email: <email>" y errores crudos | Test `redactEmails` |
| S-31 | `requireLocalEmailVerified: true` explícito en la vinculación con Google | Toma de cuenta preregistrada vía OAuth | Configuración |
| S-32 | Antigüedad mínima de 14 días para instalar paquetes (`bunfig.toml`); `bun install --frozen-lockfile` y Bun fijado en CI; CI falla ante avisos críticos | Cadena de suministro | `bunfig.toml`, workflow |
| S-33 | Manejadores de último recurso: rechazos y excepciones no controladas se registran solo por tipo | Fugas de datos en trazas de error | Revisión de código |

## Riesgos aceptados / pendientes

- 2FA y passkeys diferidos: cuentas protegidas solo por contraseña (o Google).
- Cola de correo en memoria (se pierde si el proceso muere abruptamente; el usuario puede reenviar).
- Pre-registro con el email de otra persona mientras se permita iniciar sesión sin verificar (paridad legacy; decisión de negocio).
- Rate limit de `/api/v1` en memoria por proceso.
- Sin auditoría persistente de acciones administrativas (solo logs).
- Vinculación automática de Google por email (paridad legacy) confía en la verificación de email de Google.
- Política de contraseñas: solo longitud (8–128); sin comprobación de contraseñas filtradas (plugin `haveibeenpwned` disponible, requiere llamada externa: decisión pendiente).

## Auditoría de dependencias (`bun audit`, Fase 3.1, 2026-11-17)

**Antes:** 38 avisos (1 crítico, 26 altos, 11 moderados). **Después:** 4 avisos (0 críticos, 1 alto, 3 moderados).

Corregido sin overrides:
- `apps/mobile`: Expo SDK 52 (sin soporte) → **SDK 58** (`expo ~58.0.22`, `react-native 0.88.1`, `react 19.3.0`, versiones del `bundledNativeModules.json` del SDK 58). El workspace móvil es un marcador sin código, así que no hubo cambios de API. Esto eliminó `tar` (crítico), `@xmldom/xmldom`, `image-size`, `uuid` y las copias antiguas de `postcss`.
- `apps/web`: `react`/`react-dom` fijados a 19.3.0 (antes `^19` → 19.3.1). React Native 0.88.1 exige exactamente `react` 19.3.0 y en el monorepo hay una sola copia, así que web y móvil comparten esa versión y `react-dom` coincide con `react`.

Avisos restantes (sin versión compatible publicada o fuera de runtime):

| Paquete | Severidad | Origen | Impacto | Mitigación |
|---|---|---|---|---|
| `picomatch` ≤4.0.7 (GHSA-fc5q-39xc-vjpf, ReDoS con extglobs) | alta | vite, tailwindcss, expo, react-native (tooling) | Solo patrones de glob definidos por el proyecto en herramientas de build/desarrollo; nunca entrada de usuarios | **No existe versión parcheada** (4.0.7 es la última). Revisar en cada actualización de dependencias |
| `esbuild` ≤0.24.2 (GHSA-67mh-4wv8-2f99) | moderada | `drizzle-kit` → `@esbuild-kit/core-utils` (esbuild 0.18) | El aviso afecta al modo `serve` de esbuild, que drizzle-kit no usa. Vite usa esbuild 0.25 (corregido) | Desaparece con drizzle-kit 1.0 (hoy en RC); no adoptar una RC |
| `glob` 9–14.0.1, `minimatch` 7–11.0.0 | moderada | `@expo/cli` y paquetes de Expo SDK 58 | Herramientas de la CLI móvil en máquinas de desarrollo | Se resolverá con un parche de Expo 58 que cumpla la antigüedad mínima de 14 días |

API (`hono`, `better-auth`, `drizzle-orm`, `postgres`, `zod`, `nodemailer`) y bundle web: **sin avisos**. CI falla ante cualquier aviso crítico (`bun audit --audit-level=critical`) y muestra el resto.
