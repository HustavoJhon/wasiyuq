# Decisiones de seguridad — identidad y organizaciones (Fase 3)

**Fecha:** 2026-11-17  
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

## Riesgos aceptados / pendientes

- 2FA y passkeys diferidos: cuentas protegidas solo por contraseña (o Google).
- Rate limit de `/api/v1` en memoria por proceso.
- Sin auditoría persistente de acciones administrativas (solo logs).
- Vinculación automática de Google por email (paridad legacy) confía en la verificación de email de Google.
- Política de contraseñas: solo longitud (8–128); sin comprobación de contraseñas filtradas (plugin `haveibeenpwned` disponible, requiere llamada externa: decisión pendiente).
