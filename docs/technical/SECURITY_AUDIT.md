# Auditoría de seguridad (preliminar)

**Fecha:** 2026-11-16  
**Alcance:** revisión estática de código/configuración del repositorio. No se realizaron pruebas dinámicas, pentesting ni revisión de entorno productivo.  
**Severidad:** Alta / Media / Baja / Informativa.

## Hallazgos

| ID | Severidad | Área | Hallazgo | Evidencia | Recomendación |
|---|---|---|---|---|---|
| SEC-01 | **Alta** | Autorización | Bypass/privilegio de super administrador atado a email hardcodeado (`hustavojhon@gmail.com`) además de `is_super_admin`. | `app/Http/Middleware/IsSuperAdmin.php`, `EnsureTeamMembership.php` | Eliminar hardcode; usar roles/claims gestionados en datos con auditoría; rotar accesos si aplica. |
| SEC-02 | **Alta** | Configuración/secretos | Archivo `.env` presente en árbol de trabajo (contenido no auditado aquí). Riesgo de exposición accidental si se comparte o commitea. | raíz repo (`.env`) | Asegurar `.gitignore`, secretos en gestor seguro, rotación si hubo exposición. |
| SEC-03 | **Media** | Autorización fina | Existen permisos granulares (`TeamPermission`) pero no se evidenció enforcement sistemático por acción en todos los controladores/rutas. | `app/Enums/TeamPermission.php`, rutas/controladores (pendiente verificación detallada) | Implementar policies/gates centralizados por permiso y pruebas de autorización. |
| SEC-04 | **Media** | Endpoints/API | Endpoints `POST /api/chatbot/ask` y `POST /api/dni/lookup` sin middleware de auth/throttling explícito en rutas; posible abuso/abuso de cuota externa. | `routes/web.php`, servicios asociados | Aplicar rate limiting, validación estricta, auth si corresponde, logging y protección CSRF según contexto. |
| SEC-05 | **Media** | Sesiones/BD | Tabla `sessions` con `user_id` indexado pero sin FK declarada en migración. | `database/migrations/0001...create_users_table.php` (legacy, retirada en Fase 1) | Definir integridad referencial o estrategia clara de limpieza/consistencia. |
| SEC-06 | **Media** | Archivos/uploads | Manejo de fotos/actas y rutas de almacenamiento no auditado en detalle (validación de tipo/tamaño/path traversal). | modelos con `photos/acta_path`, servicios/requests (pendiente) | Validar MIME/tamaño, almacenamiento aislado, nombres seguros, permisos mínimos. |
| SEC-07 | **Baja/Media** | Móvil/dev config | `capacitor.config.ts` incluye `server.url` cleartext y `webContentsDebuggingEnabled` (config de desarrollo). | `capacitor/capacitor.config.ts` | Separar config dev/prod; deshabilitar cleartext/debug en builds release. |
| SEC-08 | **Baja** | Exposición de información | Endpoint `/health` público devuelve estado; dashboard de equipo se construye en ruta con consultas (posible fuga si middleware falla, aunque hoy protegido). | `routes/public.php`, `routes/web.php` | Mantener health mínimo; revisar respuestas de error y control de acceso. |
| SEC-09 | **Informativa** | Dependencias | Dependencias y versiones deben evaluarse contra CVEs vigentes (composer/npm audit en entorno controlado). | `composer.lock`, `package-lock.json` | Ejecutar escaneo SCA en pipeline (fuera de esta etapa de solo lectura). |
| SEC-10 | **Informativa** | CSRF/XSS/SQLi | Framework Laravel/Inertia provee protecciones base; uso real en formularios/consultas custom (SPs/DB raw) no verificado exhaustivamente. | stack general | Revisar usos de `DB::raw`, renderizado de HTML/Markdown, headers y CSP. |

## Fortalezas observadas
- Uso de Fortify para flujos de autenticación estándar.
- Middleware de autenticación/verificación/membresía en rutas sensibles.
- Uso de Eloquent/parametrización en servicios inspeccionados (reducen riesgo SQLi frente a concatenación manual, sujeto a verificación global).
- Soft deletes y enums para consistencia de estados.

## Prioridades para reconstrucción
1. Modelo de autorización centralizado (RBAC/ABAC) con pruebas.
2. Eliminación de privilegios hardcodeados y gestión segura de identidades admin.
3. Hardening de endpoints públicos (rate limit, validación, anti-abuso).
4. Política de gestión de archivos y secretos.
5. Observabilidad y auditoría de eventos de seguridad. 
