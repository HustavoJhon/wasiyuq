# Cobertura documental

**Fecha:** 2026-11-16  
**Estado:** auditoría documental inicial generada (primera pasada). Cobertura **parcial** por tamaño del repositorio y ausencia de ejecución funcional en entorno vivo.

## 1. Documentos generados en esta etapa

| Ruta | Estado | Contenido |
|---|---|---|
| `docs/README.md` | Creado | Índice, propósito, convenciones y fuentes |
| `docs/development/REPOSITORY_AUDIT.md` | Creado | Estructura repo, git, hallazgos iniciales |
| `docs/development/FEATURE_INVENTORY.md` | Creado | Inventario inicial de funcionalidades por módulo/ruta |
| `docs/development/DOCUMENTATION_COVERAGE.md` | Creado | Este seguimiento de cobertura y pendientes |
| `docs/business/BUSINESS_OVERVIEW.md` | Creado | Identidad, propósito, operaciones, actores (alto nivel) |
| `docs/business/ACTORS_AND_USERS.md` | Creado | Actores, roles de equipo y contextos |
| `docs/business/MODULES_CATALOG.md` | Creado | Catálogo de módulos y dependencias |
| `docs/business/BUSINESS_RULES.md` | Creado | Reglas extraídas de enums/servicios/modelos (parcial) |
| `docs/domain/ENTITY_CATALOG.md` | Creado | Entidades, atributos y relaciones principales |
| `docs/functional/PERMISSIONS_MATRIX.md` | Creado | Matriz de roles/permisos y mapa de acceso |
| `docs/technical/CURRENT_STACK.md` | Creado | Tecnologías, versiones, integraciones, observaciones |
| `docs/technical/CURRENT_ARCHITECTURE.md` | Creado | Arquitectura monolito Inertia/Laravel y hallazgos |
| `docs/technical/DATABASE_SCHEMA.md` | Creado | Migraciones, tablas, ER resumido, SPs |
| `docs/technical/API_CATALOG.md` | Creado | Catálogo de rutas web/admin/settings/APIs internas |
| `docs/modernization/RECONSTRUCTION_ROADMAP.md` | Creado | Fases, riesgos, prioridades, matriz plantilla |
| `docs/modernization/TARGET_STACK.md` | Creado | Propuesta de stack objetivo y evaluación |
| `docs/modernization/TARGET_ARCHITECTURE.md` | Creado | Arquitectura objetivo, bounded contexts, capas |
| `docs/modernization/TECHNOLOGY_DECISIONS.md` | Creado | ADRs preliminares y decisiones pendientes |

## 2. Documentos solicitados aún pendientes o por profundizar

| Documento sugerido | Estado | Trabajo pendiente |
|---|---|---|
| `business/BUSINESS_MODEL.md` | Pendiente | Modelo de valor/operación detallado y validación con stakeholders |
| `business/GLOSSARY.md` | Pendiente | Glosario formal de términos del dominio |
| `business/WORKFLOWS.md` | Pendiente | Flujos detallados paso a paso con diagramas Mermaid por proceso |
| `domain/DOMAIN_MODEL.md` | Pendiente | Consolidación narrativa del modelo de dominio y agregados |
| `domain/ER_DIAGRAM.md` | Parcial (incluido en DB schema) | Diagrama ER completo y validado campo a campo |
| `domain/STATE_MACHINES.md` | Pendiente | Máquinas de estado formales (mascota, adopción, seguimiento, invitación, etc.) |
| `functional/FUNCTIONAL_REQUIREMENTS.md` | Pendiente | Requisitos funcionales estructurados y trazables |
| `functional/USE_CASES.md` | Pendiente | Casos de uso por actor con pre/postcondiciones |
| `functional/USER_STORIES.md` | Pendiente | Historias de usuario priorizadas |
| `functional/REPORTS_AND_EXPORTS.md` | Pendiente | Inventario de reportes/PDFs/exportaciones reales |
| `technical/INTEGRATIONS.md` | Pendiente | Detalle de integraciones (Google, DNI, mail, storage, GA) y contratos |
| `technical/SECURITY_AUDIT.md` | Pendiente | Auditoría de seguridad con severidades y evidencias ampliadas |
| `technical/TESTING_AUDIT.md` | Pendiente | Cobertura real de tests, calidad y gaps |
| `technical/TECHNICAL_DEBT.md` | Pendiente | Deuda técnica priorizada con impacto/esfuerzo |
| `modernization/MODULE_BOUNDARIES.md` | Parcial (en target arch) | Límites de módulos con ownership y contratos |
| `modernization/MIGRATION_STRATEGY.md` | Pendiente | Estrategia detallada de migración de datos/código/cutover |

## 3. Áreas inspeccionadas vs no inspeccionadas en profundidad

| Área | Cobertura | Comentario |
|---|---|---|
| Estructura repo, git, configs raíz, docker | Alta | Evidencia directa leída |
| Rutas, enums, modelos clave, servicios principales | Alta | Base para reglas y módulos |
| Migraciones y SPs | Alta (estática) | Sin ejecución en BD |
| Frontend (páginas/componentes/config) | Media-Alta | Inventario amplio vía subagente/inspección; falta revisar cada pantalla en detalle funcional |
| Controladores, Form Requests, Policies, Jobs/Events/Listeners/Notifications | Media | Inventariados parcialmente; falta extraer reglas y efectos por acción |
| Pruebas automatizadas | Baja | `tests/` existe pero contenido no auditado en detalle |
| Uso real de SPs/Redis/colas/storage en runtime | Baja-Media | Requiere trazado de llamadas y verificación de entorno |

## 4. Validación contra criterios solicitados (estado)

| Criterio | Estado |
|---|---|
| Módulos actuales documentados | Parcial (catálogo inicial completo de dominios detectados) |
| Rutas relevantes inventariadas | **Sí (mayoría)** en `API_CATALOG` |
| Modelos y relaciones documentados | Parcial (catálogo entidades + esquema BD) |
| Roles y permisos identificados | **Sí (implementación observada)** + discrepancias |
| Procesos principales con diagramas | Parcial (algunos diagramas); faltan workflows detallados |
| Integraciones identificadas | Parcial (listadas); falta documento dedicado |
| Funcionalidades incompletas registradas | Parcial (observaciones/hallazgos); falta consolidado |
| Reglas de negocio con referencias | Parcial (reglas clave con evidencia) |
| Propuesta tecnológica cubre necesidades | **Sí (preliminar)**, sujeta a validación |
| Roadmap permite reconstrucción sin Laravel | **Sí (preliminar)** |

## 5. Próximos pasos documentales recomendados

1. Completar `WORKFLOWS.md` y `STATE_MACHINES.md` con diagramas Mermaid por flujo crítico.
2. Auditar `tests/`, `app/Http/Requests`, `Policies`, `Events/Listeners/Jobs/Notifications` para cerrar reglas y efectos secundarios.
3. Crear `SECURITY_AUDIT.md`, `TECHNICAL_DEBT.md`, `INTEGRATIONS.md`, `MIGRATION_STRATEGY.md`.
4. Construir matriz de trazabilidad completa (funcionalidad → regla → entidad → módulo nuevo → prioridad).
5. Validar hallazgos con ejecución local/entrevistas de stakeholders cuando sea posible. 
