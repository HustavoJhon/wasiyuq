# Plan de retiro de legado (Laravel) — sin eliminaciones

**Fecha:** 2026-11-16  
**Objetivo:** inventariar con precisión qué pertenece al stack Laravel legacy, qué debe reemplazarse, conservarse o respaldarse, y qué integraciones/datos requieren reconstrucción o migración, **sin eliminar nada todavía**.  
**Alcance:** preparación para WASIYUQ 2.0 (Bun, TypeScript, Hono, PostgreSQL, Drizzle, React, TanStack, shadcn/ui).

## 1. Inventario por categoría

### 1.1 Código y artefactos exclusivos de Laravel/PHP (candidatos a retirar en fase de limpieza)

| Categoría | Rutas/elementos | Motivo | Acción futura |
|---|---|---|---|
| Núcleo aplicación PHP | `app/`, `bootstrap/`, `config/`, `routes/`, `database/migrations/`, `database/factories/`, `database/seeders/`, `resources/views/` (Blade), `tests/` (Pest/PHPUnit), `artisan` | Implementación y framework Laravel | Reemplazar por nueva implementación TS; retirar tras paridad/cutover |
| Dependencias PHP | `composer.json`, `composer.lock`, `vendor/` (si existe) | Gestor y paquetes Laravel/PHP | Eliminar en fase de limpieza |
| Config/tooling PHP | `phpunit.xml`, `.php-cs-fixer*`, `pint.json`/config Pint si aplica, `.editorconfig` secciones PHP (revisar) | Calidad/tests PHP | Reemplazar por toolchain TS (Biome/ESLint, Vitest, etc.) |
| Frontend acoplado a Laravel/Inertia Vue | `resources/js/` (Vue/Inertia), `vite.config.ts` (si es el de Laravel/Vue), `components.json` (shadcn-vue), `tailwind.config*` actual, `package.json` scripts/build actuales orientados a Laravel | UI legacy | Reemplazar por React/Vite nuevo; conservar solo assets referenciados (ver 1.4) |
| Autogenerados/build legacy | `public/build/`, `public/hot` (si existen), `bootstrap/cache/*.php`, `storage/framework/*` | Artefactos runtime/build | No migrar; regenerables o obsoletos |

### 1.2 Dependencias a eliminar (al migrar)

| Ecosistema | Dependencias (observadas) | Nota |
|---|---|---|
| Composer | `laravel/framework`, `inertiajs/inertia-laravel`, `laravel/fortify`, `laravel/socialite`, `barryvdh/laravel-dompdf`, `laravel/wayfinder`, `laravel/tinker`, drivers/extensiones PHP según `composer.json` | Confirmar lista exacta en `composer.json` antes de borrar |
| NPM (legacy UI) | `vue`, `@inertiajs/vue3`, `reka-ui`/componentes Vue, plugins Vite Laravel, Tailwind v4 config actual, Capacitor (decidir continuidad), `workbox/vite-plugin-pwa` (si se rehace) | Evaluar qué se conserva para app móvil/PWA nueva |
| Runtime | PHP 8.4, extensiones `sqlsrv/pdo_sqlsrv`, Composer | Reemplazo por Bun/Node toolchain TS |

### 1.3 Configuración Docker e infraestructura a reemplazar

| Elemento | Ubicación | Estado/rol | Acción futura |
|---|---|---|---|
| Orquestación legacy | `docker-compose.yml` | Stack dev con PHP-FPM, Nginx, SQL Server 2019, Redis, MinIO, Mailpit (según auditoría) | Diseñar nuevo compose para Postgres + API Bun + web + servicios necesarios |
| Imágenes/config PHP/Nginx | `docker/` (Dockerfiles, nginx conf, php ini/fpm, scripts) | Runtime Laravel | Reemplazar por imágenes Node/Bun/Nginx o equivalente; retirar configs PHP |
| Makefile/scripts legacy | `Makefile` | Comandos orientados a artisan/composer/npm legacy | Reescribir para nuevo monorepo (turborepo/bun) |
| Env legacy | `.env`, `.env.example` (mantener referencia histórica temporal) | Variables Laravel/SQL Server | Crear nuevo esquema de env; **respaldar valores secretos fuera del repo** antes de cambios |

### 1.4 Recursos visuales y de producto a conservar

| Recurso | Ubicación | Motivo de conservación | Nota |
|---|---|---|---|
| Identidad/estáticos públicos | `public/` (logos, íconos, imágenes, favicons, manifest si aplica), excluyendo `public/build` | Marca y assets de UI | Revisar referencias y licencias; migrar a estructura del nuevo frontend |
| Plantillas PDF (referencia visual/contenido) | `resources/views/pdfs/adoption-acta.blade.php`, `adoption-certificate.blade.php` | Contenido legal/formato del documento | Reimplementar en generador PDF del nuevo stack conservando texto/campos aprobados |
| Contenido/copy de negocio | Textos en chatbot, páginas públicas, emails/notificaciones | Conocimiento de producto | Extraer a contenido/config i18n en nuevo sistema |
| Assets subidos por usuarios (si existen en entorno) | `storage/app/public/**`, `public/storage` (symlink), buckets S3/MinIO | Datos de producción/usuarios | **Respaldar y migrar** (ver 1.6) |

### 1.5 Documentación y conocimiento a permanecer

| Elemento | Ubicación | Acción |
|---|---|---|
| Expediente de auditoría y modernización | `docs/**` | **Conservar**; actualizar como fuente de verdad de paridad y decisiones |
| README/historial de decisiones | `README.md` (actualizar cuando corresponda), ADRs en `docs/modernization/` | Conservar y evolucionar para 2.0 |
| Especificación de SPs y esquema | `database/stored-procedures/**`, `database/migrations/**`, `docs/technical/DATABASE_SCHEMA.md` | Conservar como referencia de migración hasta cierre de paridad de datos |

### 1.6 Datos e información que NO deben perderse (respaldos obligatorios antes de cualquier limpieza/cutover)

| Dato | Fuente actual | Riesgo si se pierde | Plan de respaldo/migración |
|---|---|---|---|
| Base de datos operativa (SQL Server) | Instancia/volúmenes SQL Server (`sqlsrv`), dumps/backups | Pérdida total de negocio | Backup completo + verificación de restore; mapeo tabla-a-tabla a PostgreSQL; preservar IDs/slugs si se requiere compatibilidad |
| Definiciones y lógica de SPs | `database/stored-procedures/**` y SPs cargados en BD | Pérdida de reglas/reportes legacy | Versionar archivos (ya en repo) + exportar desde BD viva; decidir equivalentes en consultas/SQL Postgres |
| Archivos de usuarios | `storage/app/public` (pets, lost-pets, teams, follow-ups, adoptions PDFs, certificates) y/o MinIO/S3 | Pérdida de evidencia, imágenes y documentos | Inventario y copia íntegra; plan de remapeo de rutas/URLs y `acta_path` |
| Credenciales y secretos | `.env`, proveedores (Google, DNI, mail, AWS/MinIO), llaves app | Interrupción de integraciones/acceso | Vault/gestor seguro; rotación planificada; **no** depender de `.env` en repo |
| Cuentas y factores de autenticación | `users`, hashes de contraseña, 2FA, passkeys, tokens OAuth vinculados | Imposibilidad de login/migración de identidad | Estrategia explícita de migración de hashes y factores (spike de paridad) |
| Configuración de negocio | Roles, equipos, membresías, invitaciones vigentes | Pérdida de estructura organizativa | Incluir en migración de datos con validación de integridad |
| Historial de adopciones y seguimientos | `adoptions`, `follow_ups` y estados/fechas | Pérdida legal/operativa y trazabilidad | Migración prioritaria con reconciliación de estados y documentos |

### 1.7 Integraciones que requieren reconstrucción

| Integración | Situación legacy | Acción en 2.0 | Prioridad |
|---|---|---|---|
| Autenticación (Fortify, Google Socialite) | Acoplada a Laravel | Implementar auth con paridad (password, OAuth Google, 2FA, passkeys si aplica) | Alta |
| Consulta DNI (apisperu) | Servicio HTTP server-side | Reimplementar adaptador con timeout/retries/rate-limit y manejo de errores | Media |
| Correo transaccional | Mail/Notifications Laravel (cola) | Proveedor SMTP/API + plantillas y cola/jobs equivalentes | Alta |
| Generación de PDFs (DomPDF) | Jobs + Blade views | Librería PDF en TS/servicio documents; unificar acta/certificado | Alta |
| Almacenamiento de archivos | Disk local public/S3 | Abstracción storage (S3-compatible) con migración de objetos y URLs | Alta |
| Colas y scheduler | Laravel Queue + schedule | Worker/cron equivalente (BullMQ/temporal/cron + jobs) para vencimientos y async | Alta |
| Chatbot | Reglas en memoria | Servicio configurable (contenido administrable) manteniendo API/UX | Baja |
| Analítica (GA4) | Configurada, uso parcial | Reintegrar en frontend nuevo según necesidad | Baja |
| PWA/Capacitor | Configurada en stack Vue | Redefinir estrategia web/móvil (Expo/RN separado o PWA React) | Media |

## 2. Elementos con ambigüedad (requieren decisión antes de borrar)

| Elemento | Duda | Decisión requerida |
|---|---|---|
| SPs T-SQL | No invocados en app pero definidos/cargables | ¿Descartar, portar lógica a consultas Postgres o mantener equivalentes de reporte? |
| `GenerateAdoptionCertificateJob` | Sin disparador observado | ¿Eliminar concepto, unificar con acta o implementar flujo? |
| Campos extendidos de seguimiento | Aceptados en requests, no persistidos | ¿Soportar en 2.0 (migración de esquema) o deprecar? |
| Transiciones `complete/cancel` adopción | Lógica existe, UI no confirmada | Confirmar flujo operativo real antes de congelar paridad |
| `acta_path` y acceso a documentos | Almacenado, descarga no confirmada | Definir modelo de documentos y permisos de acceso |
| Bypass superadmin por email | Hardcodeado en legacy | Eliminar en 2.0 y definir mecanismo seguro de bootstrap admin |
| README vs versión/comandos reales | Discrepancias detectadas | Actualizar al iniciar 2.0 |

## 3. Secuencia segura de limpieza (futura, no ejecutar ahora)

1. **Congelar paridad:** cerrar matriz de trazabilidad y gaps aprobados.
2. **Respaldar:** BD, archivos, secretos, export de configuración de proveedores.
3. **Preparar target:** monorepo 2.0, CI, entornos, migraciones PostgreSQL y storage.
4. **Migrar datos y validar:** ensayo de carga, integridad, credenciales y documentos.
5. **Cutover controlado:** tráfico a nuevo sistema, monitoreo, rollback plan.
6. **Retirar legacy:** eliminar código/config Docker/deps Laravel listados en 1.1–1.3 solo tras ventana de estabilidad y confirmación de backups.

## 4. Criterio de “listo para limpiar”
- Matriz de trazabilidad sin críticos abiertos sin decisión.
- Backups verificados y plan de rollback probado.
- Paridad aprobada para módulos de prioridad alta (identidad/equipos, mascotas, adopciones, seguimientos).
- Documentación `docs/` actualizada con decisiones finales.