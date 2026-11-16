# Estrategia de migración y reconstrucción

**Fecha:** 2026-11-16  
**Objetivo:** reconstruir WASIYUQ en el stack objetivo preservando funcionalidades, reglas, datos y conocimiento del sistema actual.

## 1. Enfoque general

- **Reconstrucción paralela (strangler por producto), no refactor in-place de Laravel.** El sistema actual permanece como referencia funcional y, si aplica, como origen de datos hasta el corte.
- **Dominio primero:** congelar entendimiento de reglas/estados/permisos en documentación y matriz de trazabilidad antes de implementar.
- **Entrega incremental por slices verticales:** API + datos + UI por contexto de negocio, con validación de paridad.
- **Datos migrados con verificación:** scripts repetibles, reconciliación y rollback.

## 2. Inventario de lo que debe preservarse

| Categoría | Elementos | Fuente |
|---|---|---|
| Funcionalidades | Catálogo público, auth, equipos, mascotas, adopciones, seguimientos, eventos/blog, mascotas perdidas, veterinarias/albergues, contacto/chatbot/DNI, admin | rutas/controladores/UI |
| Reglas de negocio | Transiciones de estados, efectos sobre mascota/adopción, permisos por rol, screening/reportes | servicios/enums/modelos |
| Datos | Usuarios, equipos, membresías, invitaciones, mascotas, adopciones, seguimientos, contenido, ratings, directorios, contacto, archivos asociados | BD y storage |
| Integraciones | Google OAuth, DNI API, correo, analítica (si se usa), almacenamiento | config/servicios |

## 3. Estrategia de datos (SQL Server → PostgreSQL)

### 3.1 Fases
1. **Modelado objetivo:** esquema PostgreSQL/Drizzle alineado al dominio (normalizar donde convenga, mantener compatibilidad semántica).
2. **Mapeo fuente-destino:** tabla/columna/enum/tipo por entidad (incl. JSON, booleanos, fechas, soft deletes).
3. **Extracción:** lectura desde SQL Server (snapshots/exports controlados) sin modificar origen.
4. **Transformación:** conversión de tipos, normalización de estados/strings, resolución de slugs/IDs, manejo de nulos y campos nuevos.
5. **Carga:** inserción en PostgreSQL con preservación de relaciones (orden por dependencias) y, si se decide, mapeo de IDs antiguos.
6. **Verificación:** conteos, checksums/muestras, integridad referencial, validación funcional de casos críticos.
7. **Cutover:** ventana de migración final (delta si hay operación continua), freeze/control de cambios, switch de tráfico.

### 3.2 Consideraciones específicas
- **Stored procedures T-SQL:** no migrar como SPs; reimplementar consultas/casos de uso equivalentes y validar salidas.
- **Enums:** hoy strings en BD; definir enums nativos PG o constraints/checks según estrategia.
- **Soft deletes:** mantener `deleted_at` y semántica en consultas.
- **Archivos:** migrar `photos`, `cover_image`, `acta_path` desde storage local/MinIO a S3-compatible con verificación de existencia y URLs.
- **Credenciales:** hashes de contraseña/secretos 2FA/passkeys requieren compatibilidad o plan de re-autenticación; **definir antes de implementar auth**.

## 4. Estrategia de aplicación

| Fase | Slice | Criterio de salida |
|---|---|---|
| Fundacional | Monorepo, CI, DB, auth base, RBAC | Login, equipos, permisos básicos probados |
| Núcleo | Mascotas + adopciones + seguimientos | Flujo end-to-end de adopción con paridad de estados |
| Operación org | Panel equipo, miembros, contenido básico | Gestión organizacional operativa |
| Público/comunidad | Catálogo SEO, blog/eventos, perdidos, directorios, contacto | Paridad de experiencia pública clave |
| Integraciones | DNI, correo, PDFs/actas, analítica | Integraciones estables y observables |
| Móvil (opcional posterior) | Flujos prioritarios en Expo/RN | MVP móvil validado |

## 5. Gestión de paridad y calidad

- **Matriz de trazabilidad:** cada ruta/función actual con estado `No iniciado / En progreso / Paridad validada / Descartado (aprobado)`.
- **Pruebas de paridad:** escenarios dorados (postular, aprobar, rechazar, reportar seguimiento, permisos por rol, publicación de contenido).
- **Revisión de reglas implícitas:** contrastar con UI y datos reales de ejemplo (seeders) para detectar gaps.
- **Feature flags / rollout progresivo** en nuevo sistema cuando aplique.

## 6. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Pérdida de reglas no documentadas | Completar auditoría de Requests/Policies/Jobs/Listeners y validación con stakeholders |
| Incompatibilidad auth (hashes/passkeys/2FA) | Spike de migración de credenciales y estrategia de fallback |
| Divergencia de datos en cutover | Migración delta, freeze controlado, reconciliación |
| Desfase en permisos | Pruebas de autorización por matriz permiso-acción |
| Sobrealcance móvil | Diferir a post-web/API estable |

## 7. Dependencias y prerrequisitos

- Aprobación de stack/auth y prioridades de negocio.
- Acceso a dumps/datos representativos (anonimizados si es necesario) para pruebas de migración.
- Definición de entorno objetivo (hosting, dominios, correo, storage, observabilidad).
- Cierre de documentos pendientes críticos: workflows, state machines, testing/security audit detallada.

## 8. Criterio de "listo para iniciar reconstrucción"

- Inventario funcional y matriz de trazabilidad suficientemente completos.
- Reglas de estados/permisos validadas.
- Decisiones ADR-005 (auth) y ADR-003 (núcleo) confirmadas por spike.
- Plan de migración de datos y archivos aprobado. 
