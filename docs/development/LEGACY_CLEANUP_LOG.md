# Registro de limpieza del legado (Fase 1)

**Fecha inicio:** 2026-11-16  
**Rama:** `dev`  
**Base:** Fase 0 completada (`161b3c7`), documentación íntegra en `docs/`.

## 1. Estado previo (verificado)
- Stack legacy presente: Laravel/PHP (app, bootstrap, config, routes, resources Blade/Vue-Inertia, tests Pest/PHPUnit, artisan, composer, vendor), frontend Vue 3 + Inertia + Vite + Tailwind/shadcn-vue, Capacitor, Docker/Nginx/PHP/SQL Server/Redis/MinIO/Mailpit, Makefile.
- Artefactos runtime/build: `node_modules/`, `vendor/`, `public/build/`, `public/dist/`, caches de `storage/` y `bootstrap/cache/`.
- Referencias de datos conservadas en repo: `database/migrations/`, `database/factories/`, `database/seeders/`, `database/stored-procedures/`.
- Archivos sensibles/locales detectados: `.env` (presente localmente; no debe perderse su información; no se versionará nuevo contenido sensible).

## 2. Conservado (protegido)
- `docs/**` completo (negocio, dominio, funcional, técnico, modernización, trazabilidad).
- `database/stored-procedures/**`, `database/migrations/**`, `database/factories/**`, `database/seeders/**` como **referencia de migración/paridad** (no operativos en 2.0).
- Recursos visuales/estáticos públicos identificados para posible reutilización (logos, íconos, favicons, imágenes hero, OG, QR, verificación, placeholders, robots/offline según aplique) — respaldo en `legacy-assets/` durante limpieza.
- `.env` local preservado como `.env.legacy` (referencia local; no se commitea si está ignorado).

## 3. Eliminado / reemplazado
_Se irá registrando por commit._

## 4. Reemplazos introducidos (nuevo stack)
_Pendiente._

## 5. Pendientes de migración posterior
- Datos/BD original (SQL Server), archivos de usuarios, secretos de proveedores, credenciales/factores auth (ver `docs/modernization/LEGACY_CLEANUP_PLAN.md`).
- Decisiones aprobadas pendientes: SPs, acta/certificado, campos seguimiento, complete/cancel, auth provider, Hono/Elysia, SEO/SSR, móvil.

## 6. Riesgos remanentes
- Backups reales de BD/archivos/secretos no verificables desde este repo.
- `.env` local contiene configuración legacy; debe resguardarse fuera del repo antes de cualquier descarte definitivo.
- `node_modules/` y `vendor/` son voluminosos; su retiro es seguro como artefactos reinstalables (legacy). 
- Compatibilidad de versiones del nuevo toolchain sujeta al entorno de ejecución.

## 7. Verificaciones
_Pendiente._