# Seguridad de autenticación y sesiones (Fase 3.1)

**Fecha:** 2026-11-17  
Auditoría de los controles de identidad y organizaciones tras la Fase 3, con el resultado de cada punto y la prueba que lo respalda. Complementa [`AUTHENTICATION.md`](AUTHENTICATION.md), [`AUTHORIZATION_RBAC.md`](AUTHORIZATION_RBAC.md) y el registro [`SECURITY_DECISIONS.md`](SECURITY_DECISIONS.md).

## 1. Hash de contraseñas

### Investigación

- Better Auth 1.7.15 delega en `@better-auth/utils/password`. Su `package.json` elige por condición de exportación `node` la implementación `password.node.mjs`, que usa `crypto.scrypt` **asíncrono** de `node:crypto`. Bun resuelve esa condición (verificado con `Bun.resolveSync`), y su `scrypt` asíncrono se ejecuta en el pool de hilos del runtime, **no** en el event loop. La implementación JavaScript pura (`@noble/hashes`) solo se usa en runtimes sin `node:crypto`.
- **Conclusión:** la hipótesis de la Fase 3 (scrypt bloqueando el event loop) **no se confirmó**. El registro de 31 s observado entonces coincidió con la CPU saturada por procesos ajenos (compilación de shaders de Steam, `fossilize_replay`); con la máquina en reposo, el mismo flujo tarda ~0,1 s.
- **Riesgos reales encontrados:** (1) concurrencia ilimitada: cada derivación scrypt reserva 128·N·r = 32 MiB, así que una ráfaga de 32 registros o intentos de inicio de sesión reserva ~1 GiB y ocupa el pool de hilos que también usan DNS y ficheros; (2) comparación del hash derivado con `===` (no en tiempo constante); (3) un hash almacenado malformado lanza una excepción (500) en vez de fallar la verificación.

### Mediciones (`bun run --filter @wasiyuq/module-identity bench:hash`)

Bun 1.3.14, 12 CPU lógicas, máquina en reposo. "Lag" = mayor retraso de un temporizador de 5 ms mientras se calculan los hashes, es decir, cuánto tiempo estuvo bloqueado el event loop.

| Implementación | n | Total | Por hash | Lag máx. del event loop |
|---|---|---|---|---|
| WASIYUQ (async, concurrencia 6) | 1 | 83 ms | 83 ms | 1 ms |
| Better Auth por defecto (async) | 1 | 60 ms | 60 ms | 0 ms |
| Referencia `scryptSync` (bloqueante) | 1 | 58 ms | 58 ms | 53 ms |
| WASIYUQ (async, concurrencia 6) | 8 | 150 ms | 19 ms | 1 ms |
| Better Auth por defecto (async) | 8 | 108 ms | 14 ms | 1 ms |
| Referencia `scryptSync` (bloqueante) | 8 | 494 ms | 62 ms | 490 ms |
| WASIYUQ (async, concurrencia 6) | 32 | 448 ms | 14 ms | 2 ms |
| Better Auth por defecto (async) | 32 | 450 ms | 14 ms | 22 ms |
| Referencia `scryptSync` (bloqueante) | 32 | 2055 ms | 64 ms | 2050 ms |

Con el límite de concurrencia, el rendimiento a 32 hashes es el mismo, la memoria máxima baja de ~1 GiB a 192 MiB y el lag se mantiene en milisegundos.

### Decisión

| Aspecto | Valor |
|---|---|
| Algoritmo | scrypt (RFC 7914) vía `node:crypto` asíncrono (pool de hilos) |
| Parámetros | `N=16384, r=16, p=1, dkLen=64`, sal aleatoria de 16 bytes, contraseña normalizada NFKC; **idénticos** a los de Better Auth |
| Formato | `<salHex>:<claveHex>` (igual que Better Auth) |
| Añadidos | Semáforo FIFO de concurrencia (`AUTH_PASSWORD_HASH_CONCURRENCY`, por defecto la mitad de las CPU, mínimo 2); comparación con `timingSafeEqual`; hash malformado → `false` |
| Código | `modules/identity/src/infrastructure/password-hasher.ts`, conectado en `emailAndPassword.password.{hash,verify}` |

**Compatibilidad y migración:** no hay migración. Todos los hashes existentes se verifican sin cambios (test: hash creado por Better Auth → verificado por el hasher nuevo) y los nuevos son verificables por la implementación de Better Auth (test inverso), así que el cambio es reversible sin invalidar contraseñas. No se debilitó ningún parámetro. Si en el futuro se cambia a Argon2id u otros parámetros, el formato debe incluir un prefijo de versión y re-hashear al iniciar sesión con éxito; eso no es necesario hoy.

Se evaluaron y descartaron: `Bun.password` (Argon2id/bcrypt nativo, asíncrono), porque obliga a migrar todos los hashes sin ventaja de rendimiento medible frente al scrypt asíncrono actual; y un Worker dedicado, porque el pool de hilos de `node:crypto` ya saca el trabajo del event loop.

## 2. Revisión de controles

| Control | Estado tras la revisión | Prueba |
|---|---|---|
| Cookies | `__Secure-wasiyuq.session_token` en producción: `Secure`, `HttpOnly`, `SameSite=Lax`, `Path=/`. En desarrollo sin `Secure` (HTTP local) | Test de cookie de producción; E2E (httpOnly, SameSite, no legible desde `document.cookie`) |
| CSRF | Origin obligatorio y confiable en mutaciones; comprobaciones de Better Auth forzadas también en tests | Tests identity y API |
| CORS | No se configura: sin `Access-Control-Allow-Origin` ni en preflight ni en respuestas | `security-regressions.test.ts` |
| Expiración y revocación de sesiones | 7 días, sin cookie cache, revocación inmediata (logout, restablecer contraseña, suspensión, revocar por id) | Tests identity, API y E2E |
| Restablecer contraseña | Token de 1 h guardado hasheado, un solo uso, revoca todas las sesiones, aviso `password_changed` por correo | Tests de reutilización, expiración y revocación; E2E |
| Verificación de email | JWT firmado de 24 h; reutilizarlo no abre otra sesión; un enlace manipulado se rechaza | Tests de reutilización y manipulación |
| Enumeración de cuentas | Respuesta idéntica para usuario inexistente o contraseña errónea; recuperación siempre 200 con cuerpo idéntico; **registro con email existente indistinguible** (ver §3); correo en segundo plano (sin diferencia de tiempos); `/ready` sin contadores por mensaje | Tests identity, API y E2E |
| Rate limiting y proxy | Límites en BD por IP; IP escrita por el servidor (socket o salto derecho de XFF con proxy de confianza) | Test de cliente con cabeceras de IP falsas a través de `Bun.serve` real → 429 |
| Suspensión | Fail closed: sesiones borradas y acceso denegado en la siguiente petición | Tests identity y API |
| Cambio de organización | Solo a organizaciones de las que se es miembro | Test API |
| Autorización entre organizaciones | No miembros → 404; 8 roles y 31 permisos sin cambios; deny by default | Tests de servicio, API y E2E |
| Invitaciones | Hash SHA-256, ligadas al email, un solo uso, caducan en 3 días, cancelables, revalidación del emisor al aceptar | Tests de servicio, API y E2E |
| Escalada de roles | Nadie concede un rol superior al propio; `owner` nunca asignable (también `CHECK` en BD) | Tests de dominio, servicio y API |
| Administración de plataforma | Rol explícito, sin acceso implícito a organizaciones; no puede suspenderse a sí mismo | Test API |
| Vinculación con Google | Solo con email local verificado (`requireLocalEmailVerified: true`, explícito) | Configuración (no probado contra Google real) |
| Logs de aplicación | JSON estructurado; rutas con tokens redactadas; errores solo con tipo y SQLSTATE; las líneas de Better Auth pasan por el logger con los emails redactados; correo sin destinatario ni enlaces | `log-safety.test.ts`, tests de correo y de redacción |
| Logs de PostgreSQL | Configuración por defecto (verificada con `SHOW`): `log_statement=none`; ante un error se registra el texto de la sentencia (`log_min_error_statement=error`), que usa parámetros `$1…` porque postgres.js envía consultas parametrizadas, y `log_parameter_max_length_on_error=0` evita registrar sus valores (emails, hashes). Mantener estos valores en producción | Revisión de configuración (contenedor `postgres:16-alpine`) |

## 3. Cambio de comportamiento: registro sin sesión automática

Antes, `POST /api/auth/sign-up/email` abría sesión (`autoSignIn: true`) y un email ya registrado devolvía 422 `USER_ALREADY_EXISTS`, lo que permitía comprobar si un correo tenía cuenta. Ahora (`autoSignIn: false`):

- Email nuevo o existente: **misma respuesta** (200, mismo cuerpo, sin cookie) y el mismo coste de hash en ambos caminos (Better Auth hashea también en el camino del duplicado).
- Email nuevo: se envía la verificación. Email existente: se avisa al titular (`account_exists`) y su cuenta no cambia.
- La web muestra "Revisa tu correo". El enlace de verificación inicia sesión (`autoSignInAfterVerification`); también se puede iniciar sesión sin verificar (paridad legacy), pero las funciones de organización requieren email verificado.

## 4. Riesgos aceptados o pendientes

| Riesgo | Mitigación actual | Pendiente |
|---|---|---|
| Sin 2FA ni passkeys | Contraseña de 8–128 caracteres, rate limiting, avisos por correo | Diferido a una fase propia (ver `AUTHENTICATION.md` §7) |
| Pre-registro de una cuenta con el email de otra persona (el atacante conoce la contraseña) | El titular recibe la verificación; Google no se vincula a cuentas sin verificar | Política opcional: exigir verificación antes del primer inicio de sesión (cambia la paridad legacy; decisión de negocio) |
| Rate limit de `/api/v1` en memoria | Suficiente con una instancia | Mover a BD/Redis al escalar |
| Cola de correo en memoria | Reintentos y drenado al apagar | Cola persistente si hay varias instancias |
| Sin comprobación de contraseñas filtradas | Longitud mínima | Plugin `haveibeenpwned` (llamada externa con k-anonymity): decisión pendiente |
