# Deuda técnica y hallazgos de calidad

**Fecha:** 2026-11-16  
**Fuente:** auditoría estática de código, rutas, modelos, migraciones, frontend y configuración.

## 1. Deuda arquitectónica y de diseño

| ID | Hallazgo | Evidencia | Impacto | Esfuerzo estimado |
|---|---|---|---|---|
| TD-01 | Lógica de negocio distribuida (Services/Repositories) y consultas/lógica en closures de rutas y controladores. | `routes/web.php` dashboard equipo; `app/Services`, `app/Repositories`, controladores variados | Mantenibilidad, testabilidad | Medio-Alto |
| TD-02 | Modelo de permisos definido pero enforcement posiblemente inconsistente por acción. | `TeamRole/TeamPermission` vs rutas/controladores | Riesgo funcional/seguridad | Medio-Alto |
| TD-03 | Persistencia híbrida Eloquent + stored procedures T-SQL con desfase respecto a esquema reciente. | `database/stored-procedures`, migraciones posteriores | Complejidad, bugs de datos | Alto |
| TD-04 | Acoplamiento fuerte a Laravel/Inertia que dificulta evolución incremental al nuevo stack. | estructura completa | Costo de cambio | Alto (motiva reconstrucción) |
| TD-05 | Multi-contexto por equipos con reglas especiales (personal vs organización, `current_team`) repartidas en middleware/rutas/UI. | `EnsureTeamMembership`, settings, rutas | Complejidad de autorización/navegación | Medio |

## 2. Inconsistencias y configuración

| ID | Hallazgo | Evidencia | Impacto |
|---|---|---|---|
| TD-06 | Discrepancia de documentación de versiones (README PHP/Laravel/stack) vs manifiestos reales. | `README.md`, `composer.json`, `Dockerfile` | Confusión operativa |
| TD-07 | `.env` presente y defaults dev/prod potencialmente mezclados (p.ej. Capacitor cleartext/debug). | `.env`, `capacitor.config.ts` | Riesgo operativo/seguridad |
| TD-08 | Redis/MinIO disponibles pero env ejemplo usa `sync/file/local`; comportamiento depende del entorno. | `docker-compose.yml`, `.env.example` | Ambigüedad de capacidades activas |
| TD-09 | Email superadmin hardcodeado. | `IsSuperAdmin`, `EnsureTeamMembership` | Seguridad/mantenibilidad |

## 3. Calidad de código y mantenibilidad

| ID | Hallazgo | Evidencia | Impacto |
|---|---|---|---|
| TD-10 | `Welcome.vue` tipo starter convive con home real `Public/Home.vue`. | `resources/js/pages/Welcome.vue`, rutas | Código muerto/confusión |
| TD-11 | Variación de convenciones de parámetros/rutas (`{id}` vs `{slug}`, `{current_team}` string/slug). | `routes/web.php`, `admin.php` | Complejidad de contratos |
| TD-12 | Factories/artefactos no alineados con campos recientes (adoptions/follow-ups). | `database/factories`, migraciones | Tests/seed incompletos |
| TD-13 | Uso real de `vendor/` y `node_modules/` en árbol puede dificultar auditorías y aumentar ruido (aunque no se modifican). | raíz repo | Operativo |

## 4. Pruebas y aseguramiento

| ID | Hallazgo | Evidencia | Impacto |
|---|---|---|---|
| TD-14 | Cobertura real de pruebas no verificada en esta auditoría; riesgo de regresiones en reglas críticas (estados adopción/seguimiento, permisos). | `tests/`, phpunit/pest config presentes | Confianza limitada |
| TD-15 | Ausencia de matriz de trazabilidad formal previamente (se inicia en esta etapa). | falta en repo antes de `docs/` | Riesgo de pérdida funcional en reconstrucción |

## 5. Frontend y UX técnica

| ID | Hallazgo | Evidencia | Impacto |
|---|---|---|---|
| TD-16 | Coexistencia de layouts/shells (`DashboardLayout` y `AppLayout/app/*`) y patrones mixtos. | `resources/js/layouts/*` | Mantenimiento UI |
| TD-17 | Chatbot con reglas hardcodeadas en servicio (no gestionable por contenido/config). | `ChatbotService` | Evolución limitada |
| TD-18 | Dependencia de servicios externos (DNI) sin estrategia de resiliencia documentada más allá de manejo básico. | `DniLookupService` | Disponibilidad funcional |

## 6. Priorización sugerida (para informar reconstrucción)

1. **Crítico:** consolidar reglas de negocio y matriz de trazabilidad (adopciones, seguimientos, permisos).
2. **Alto:** diseñar autorización y modelo de datos objetivo sin ambigüedades.
3. **Alto:** plan de migración de datos/archivos y sustitución de SPs.
4. **Medio:** saneamiento de configuración, eliminación de hardcodes y código legacy.
5. **Medio:** estrategia de pruebas de paridad (golden paths + casos borde). 
