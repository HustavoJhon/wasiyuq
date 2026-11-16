# Documentación de WASIYUQ

Este directorio contiene el expediente técnico y funcional generado a partir de la **ingeniería inversa, auditoría y análisis de modernización** del repositorio de WASIYUQ, además de los registros de la transición hacia **WASIYUQ 2.0**.

> **Estado:** Fase 0 documental completada; **Fase 1 (limpieza de legado y fundación del monorepo 2.0) completada en `dev`** (2026-11-16).  
> **Alcance actual:** el runtime legacy Laravel/PHP/Inertia/Vue fue retirado del proyecto activo; se conservan `docs/**`, referencias de BD en `database/` y respaldos/referencias en `legacy-assets/`. No se han modificado ni destruido bases de datos originales y no se han implementado módulos de negocio.

## Propósito

- Comprender qué es WASIYUQ, cómo funciona el negocio y qué funcionalidades implementa realmente.
- Documentar el estado actual (arquitectura, datos, seguridad, integraciones, deuda técnica).
- Proponer una arquitectura y stack objetivo para una reconstrucción tecnológica sin Laravel.
- Proveer una base trazable para que otro equipo pueda reconstruir el sistema sin reanalizar todo el repositorio.

## Estructura

| Carpeta | Contenido |
|---|---|
| `business/` | Identidad del negocio, actores, glosario, catálogo de módulos, reglas y flujos operativos. |
| `domain/` | Modelo de dominio, entidades, ER, máquinas de estados. |
| `functional/` | Requisitos funcionales, casos de uso, historias, matriz de permisos, reportes/exportaciones. |
| `technical/` | Stack/arquitectura/BD/integraciones/seguridad/pruebas/deuda del sistema **legacy auditado** (referencia histórica y de paridad). |
| `modernization/` | Stack objetivo, arquitectura objetivo, límites de módulos, decisiones tecnológicas, estrategia y roadmap. |
| `development/` | Auditoría, inventario, cobertura, trazabilidad y registros de transición (incl. `LEGACY_CLEANUP_LOG.md`). |

## Convenciones

- **Hecho comprobado:** respaldado por evidencia en código, configuración o archivos del repositorio (se referencia ruta).
- **Inferencia:** conclusión razonable derivada de evidencia parcial; marcada explícitamente.
- **Pendiente de confirmación:** requiere validación con stakeholders o ejecución/entorno real.
- **Implementado vs planificado:** se distingue lo presente en código de lo mencionado solo en README/documentos.

## Fuentes principales inspeccionadas (inicial, Fase 0)

- `README.md`, `composer.json`, `package.json`, `Makefile`, `.env.example`
- `docker-compose.yml`, `docker/`, `vite.config.ts`, `tsconfig.json`, `capacitor/`
- `routes/` (`web.php`, `public.php`, `admin.php`, `settings.php`, `console.php`)
- `app/` (Enums, Models, Services, Repositories, Http/Middleware, etc.)
- Migraciones Laravel legacy (`database/migrations/`, **retiradas en limpieza Fase 1**), `database/seeders/`, `database/stored-procedures/` (referencias conservadas según decisión)
- `resources/js/`, `config/`

> **WASIYUQ 2.0:** las migraciones de base de datos ya no usan Laravel/Artisan; la estructura de migraciones pertenece exclusivamente a `packages/db/migrations/` (Drizzle ORM + PostgreSQL, preparada, sin esquema funcional completo aún). `database/factories/`, `database/seeders/` y `database/stored-procedures/` permanecen como referencias legacy pendientes de decisión independiente.

## Índice rápido

- [Auditoría del repositorio](development/REPOSITORY_AUDIT.md)
- [Stack tecnológico legacy auditado](technical/CURRENT_STACK.md)
- [Visión general del negocio](business/BUSINESS_OVERVIEW.md)
- [Inventario de funcionalidades](development/FEATURE_INVENTORY.md)
- [Matriz de trazabilidad](development/TRACEABILITY_MATRIX.md)
- [Registro de limpieza Fase 1](development/LEGACY_CLEANUP_LOG.md)
- [Plan de retiro de legado](modernization/LEGACY_CLEANUP_PLAN.md)
- [Stack objetivo (Fase 1 aplicado)](modernization/TARGET_STACK.md)
- [Arquitectura objetivo](modernization/TARGET_ARCHITECTURE.md)
- [Roadmap de reconstrucción](modernization/RECONSTRUCTION_ROADMAP.md)

## Notas

- La documentación se redacta en español.
- Se incluyen diagramas Mermaid cuando aportan claridad.
- Este expediente no sustituye validación funcional en entorno ejecutándose; algunos comportamientos quedan como pendientes de verificación.
