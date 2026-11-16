# Cobertura documental

**Fecha:** 2026-11-16 (actualizado tras cierre documental Fase 0)  
**Estado:** cobertura **ampliada**; quedan puntos explícitos de **pendiente de confirmación** y **gaps** verificados (no resueltos en código). Se separa claramente **verificado/inferido/incompleto/pendiente** en este documento.

## 1. Documentos generados/actualizados

| Ruta | Estado | Notas |
|---|---|---|
| `docs/README.md` | Actualizado previo | Índice base |
| `docs/development/REPOSITORY_AUDIT.md` | Existente | Auditoría repo |
| `docs/development/FEATURE_INVENTORY.md` | **Actualizado** | Ampliado con flujos profundos y hallazgos |
| `docs/development/DOCUMENTATION_COVERAGE.md` | **Actualizado (este)** | Cobertura y clasificación |
| `docs/development/TRACEABILITY_MATRIX.md` | **Nuevo** | Trazabilidad funcionalidades↔reglas↔entidades↔módulos |
| `docs/business/BUSINESS_OVERVIEW.md` | Existente | Alto nivel |
| `docs/business/ACTORS_AND_USERS.md` | Existente | |
| `docs/business/MODULES_CATALOG.md` | Existente | |
| `docs/business/BUSINESS_RULES.md` | Existente | |
| `docs/business/WORKFLOWS.md` | **Nuevo** | Flujos operativos (Mermaid) |
| `docs/business/BUSINESS_MODEL.md` | **Nuevo** | Modelo operativo/valor y ausencia de monetización |
| `docs/business/GLOSSARY.md` | **Nuevo** | Glosario verificado/mixto |
| `docs/domain/ENTITY_CATALOG.md` | Existente | |
| `docs/domain/DOMAIN_MODEL.md` | **Nuevo** | Contextos, agregados, invariantes |
| `docs/domain/ER_DIAGRAM.md` | **Nuevo** | ER lógico (Mermaid) + notas de fidelidad |
| `docs/domain/STATE_MACHINES.md` | **Nuevo** | Estados de mascota/adopción/seguimiento |
| `docs/functional/PERMISSIONS_MATRIX.md` | Existente | |
| `docs/functional/FUNCTIONAL_REQUIREMENTS.md` | **Nuevo** | FR/NFR con estado |
| `docs/functional/USE_CASES.md` | **Nuevo** | Casos de uso clave |
| `docs/functional/USER_STORIES.md` | **Nuevo** | Historias derivadas |
| `docs/functional/REPORTS_AND_EXPORTS.md` | **Nuevo** | PDFs, UI reports, SPs (no usados) |
| `docs/technical/CURRENT_STACK.md` | Existente | |
| `docs/technical/CURRENT_ARCHITECTURE.md` | Existente | |
| `docs/technical/DATABASE_SCHEMA.md` | Existente | |
| `docs/technical/API_CATALOG.md` | Existente | |
| `docs/technical/SECURITY_AUDIT.md` | Existente | |
| `docs/technical/TECHNICAL_DEBT.md` | Existente | |
| `docs/technical/INTEGRATIONS.md` | **Nuevo** | Integraciones detalladas |
| `docs/technical/TESTING_AUDIT.md` | **Nuevo** | Inventario y gaps de pruebas |
| `docs/modernization/RECONSTRUCTION_ROADMAP.md` | Existente | |
| `docs/modernization/TARGET_STACK.md` | Existente | |
| `docs/modernization/TARGET_ARCHITECTURE.md` | Existente | |
| `docs/modernization/TECHNOLOGY_DECISIONS.md` | Existente | |
| `docs/modernization/MIGRATION_STRATEGY.md` | Existente | |
| `docs/modernization/MODULE_BOUNDARIES.md` | **Nuevo** | Límites objetivo y mapa legacy |
| `docs/modernization/LEGACY_CLEANUP_PLAN.md` | **Nuevo** | Plan de retiro sin eliminar (inventario completo) |
| `docs/FINAL_AUDIT_REPORT.md` | **Actualizado** | Ver sección final |

## 2. Clasificación de hallazgos

### Verificados (evidencia directa en código/config)
- Flujos de adopción y efectos (transacciones, eventos, notificaciones, jobs PDF) y de seguimientos (reportes, programación, job diario) según archivos en `app/Services`, `app/Http/Controllers`, `app/Events`, `app/Listeners`, `app/Jobs`, `routes/console.php`.
- Requests/Form Requests enumerados y reglas clave leídas (adopción, seguimiento, pets, teams, settings, admin/users).
- Policies/middleware clave: `TeamPolicy`, `IsSuperAdmin`, `EnsureTeamMembership`.
- SPs T-SQL definidos en `database/stored-procedures/**`; comando de carga presente. **No se hallaron invocaciones** en `app/`.
- Config de integraciones/colas/storage: `config/services.php`, `config/queue.php`, `config/filesystems.php`.
- Pruebas existentes listadas en `tests/**`, `phpunit.xml` (SQLite in-memory, sync/mail array).

### Inferidos (razonables, no confirmados al 100%)
- Alcance detallado de algunas acciones admin y UI (pantallas Vue) más allá de controladores/rutas inspeccionados.
- Uso real de Redis/MinIO/S3 en entornos desplegados (config presente; ejecución no verificada).
- Flujos exactos de Google OAuth y verificación de email/2FA más allá de archivos revisados.
- Parámetros/columnas exactas de tablas no listadas explícitamente en docs previos (referencia a migraciones).

### Incompletos (documentados pero con huecos)
- Persistencia de campos extendidos de seguimiento aceptados por requests pero no usados en `FollowUpService`.
- Semántica unificada de documentos (acta vs certificado) y rutas de descarga.
- Modelo detallado de calificaciones/rating y relaciones auxiliares (parcial).
- Pruebas de dominio e integración (ausentes).

### Pendiente de confirmación (requiere ejecución/stakeholders)
- Disparo desde UI de `AdoptionService::complete` y `cancel`.
- Uso en producción de SPs, colas reales (no sync), scheduler activo, storage S3/MinIO.
- Resultados de tests en entorno real y cobertura.
- Validación de reglas de negocio con dueños del producto (precios/costos, políticas de seguimiento, excepciones).

## 3. Áreas con mayor brecha histórica (resueltas ahora en docs)
- Workflows, modelos de dominio/estado, requisitos/uso/historias, integraciones, auditoría de pruebas, límites de módulos, matriz de trazabilidad y plan de limpieza: **cubiertos como documentos nuevos** con clasificación explícita.

## 4. Próximos pasos (post Fase 0)
1. Validar con stakeholders `complete/cancel`, acta vs certificado y campos de seguimiento.
2. Ejecutar spike auth y verificación de paridad (OAuth/2FA/passkeys) según `TECHNOLOGY_DECISIONS.md`.
3. Decidir destino de SPs y estrategia de migración de datos/archivos (bloqueante para implementación).
4. Añadir pruebas de dominio críticas antes de portar lógica a 2.0.