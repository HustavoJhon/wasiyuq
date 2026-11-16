# Documentación de auditoría — WASIYUQ

Este directorio contiene el expediente técnico y funcional generado a partir de la **ingeniería inversa, auditoría y análisis de modernización** del repositorio actual de WASIYUQ.

> **Estado:** auditoría inicial en progreso (etapa documental).  
> **Regla aplicada:** no se ha modificado código fuente de la aplicación, dependencias, migraciones, base de datos ni configuración operativa; solo se ha generado documentación en `docs/`.

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
| `technical/` | Stack actual, arquitectura, esquema de BD, APIs/rutas, integraciones, seguridad, pruebas y deuda técnica. |
| `modernization/` | Stack objetivo, arquitectura objetivo, límites de módulos, decisiones tecnológicas, estrategia y roadmap. |
| `development/` | Auditoría del repositorio, inventario de funcionalidades y cobertura documental. |

## Convenciones

- **Hecho comprobado:** respaldado por evidencia en código, configuración o archivos del repositorio (se referencia ruta).
- **Inferencia:** conclusión razonable derivada de evidencia parcial; marcada explícitamente.
- **Pendiente de confirmación:** requiere validación con stakeholders o ejecución/entorno real.
- **Implementado vs planificado:** se distingue lo presente en código de lo mencionado solo en README/documentos.

## Fuentes principales inspeccionadas (inicial)

- `README.md`, `composer.json`, `package.json`, `Makefile`, `.env.example`
- `docker-compose.yml`, `docker/`, `vite.config.ts`, `tsconfig.json`, `capacitor/`
- `routes/` (`web.php`, `public.php`, `admin.php`, `settings.php`, `console.php`)
- `app/` (Enums, Models, Services, Repositories, Http/Middleware, etc.)
- `database/migrations/`, `database/seeders/`, `database/stored-procedures/`
- `resources/js/`, `config/`

## Índice rápido

- [Auditoría del repositorio](development/REPOSITORY_AUDIT.md)
- [Stack tecnológico actual](technical/CURRENT_STACK.md)
- [Visión general del negocio](business/BUSINESS_OVERVIEW.md)
- [Inventario de funcionalidades](development/FEATURE_INVENTORY.md)
- [Roadmap de reconstrucción](modernization/RECONSTRUCTION_ROADMAP.md)

## Notas

- La documentación se redacta en español.
- Se incluyen diagramas Mermaid cuando aportan claridad.
- Este expediente no sustituye validación funcional en entorno ejecutándose; algunos comportamientos quedan como pendientes de verificación.
