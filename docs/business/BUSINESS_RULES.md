# Reglas de negocio

**Fecha:** 2026-11-16  
**Fuente principal:** `app/Services/*.php`, `app/Enums/*.php`, `app/Models/*.php`, `routes/*.php`, `app/Http/Middleware/*.php`, `database/migrations/*`.  
**Método:** extracción desde implementación observable. Donde la regla no está completamente evidenciada, se marca como **pendiente de verificación**.

## 1. Identidad, acceso y contexto

| ID | Regla | Evidencia | Tipo |
|---|---|---|---|
| BR-AUTH-01 | Super administrador de plataforma: usuario con `is_super_admin=true` **o** email `hustavojhon@gmail.com` tiene acceso admin y bypass de membresía de equipo. | `app/Http/Middleware/IsSuperAdmin.php`, `EnsureTeamMembership.php` | Hecho (implementado) / Riesgo |
| BR-AUTH-02 | Acceso a rutas `/{current_team}/...` requiere autenticación, verificación y pertenencia al equipo; si el equipo es personal, se redirige a `/mi-adopcion`. | `EnsureTeamMembership` | Hecho |
| BR-AUTH-03 | Las membresías de equipo tienen rol (`TeamRole`) con conjunto fijo de permisos (`TeamPermission`). | `app/Enums/TeamRole.php`, `TeamPermission.php`, `Membership` | Hecho |
| BR-AUTH-04 | Un usuario tiene `current_team_id` como contexto activo; al acceder a un equipo distinto puede cambiarse el equipo actual (según middleware). | `EnsureTeamMembership`, `User` fillable/casts, `TeamController` settings | Hecho/parcial |
| BR-TEAM-01 | Los equipos tienen `slug` único y se usan como clave de ruta; cambios de nombre regeneran slug (según modelo). | `app/Models/Team.php::boot()`, `getRouteKeyName()` | Hecho |
| BR-TEAM-02 | `teams.is_personal` distingue equipos personales de organizaciones. | `Team` fillable/casts, rutas/middleware | Hecho |

## 2. Mascotas

| ID | Regla | Evidencia | Tipo |
|---|---|---|---|
| BR-PET-01 | Estados de mascota: `available`, `adopted`, `in_process`, `withheld`. | `app/Enums/PetStatus.php` | Hecho |
| BR-PET-02 | Especies soportadas: perro, gato, conejo, ave, otro. Tamaños: pequeño, mediano, grande. | `PetSpecies`, `PetSize` | Hecho |
| BR-PET-03 | Las mascotas pertenecen a un `team_id` y usan `slug` único (con soft delete considerado en generación). | `Pet` model/migration | Hecho |
| BR-PET-04 | Al crear mascota vía servicio, si no se provee slug se genera desde el nombre. | `app/Services/PetService.php::create()` | Hecho |
| BR-PET-05 | Búsqueda pública de mascotas admite filtros `species`, `size`, `gender`, `search`, orden y paginación. | `PetService::searchPublished()`, `PetRepository` (invocado), rutas/páginas públicas | Hecho (contrato de alto nivel) |

## 3. Adopciones

| ID | Regla | Evidencia | Tipo |
|---|---|---|---|
| BR-ADP-01 | Estados de adopción: `pending`, `approved`, `rejected`, `completed`, `cancelled`. | `app/Enums/AdoptionStatus.php` | Hecho |
| BR-ADP-02 | Al crear una adopción: se crea el registro y la mascota asociada pasa a estado `in_process`; se dispara evento `AdoptionApplicationSubmitted`. Operación transaccional. | `AdoptionService::create()` | Hecho |
| BR-ADP-03 | Al aprobar adopción: estado `approved`, se registra `reviewed_by/reviewed_at`, la mascota pasa a `adopted`, se dispara `AdoptionApproved`. Transaccional. | `AdoptionService::approve()` | Hecho |
| BR-ADP-04 | Al rechazar adopción: estado `rejected`, se registra revisor/fecha/notas, la mascota vuelve a `available`. Transaccional. | `AdoptionService::reject()` | Hecho |
| BR-ADP-05 | Al completar adopción: estado `completed` y evento `AdoptionCompleted`. | `AdoptionService::complete()` | Hecho |
| BR-ADP-06 | Al cancelar adopción: estado `cancelled` y mascota vuelve a `available`. Transaccional. | `AdoptionService::cancel()` | Hecho |
| BR-ADP-07 | La solicitud captura datos de screening (motivación, por qué esa mascota, vivienda/propiedad/patio, composición familiar, niños, otras mascotas, horas solo, experiencia, plan veterinario, acuerdo) según modelo/migraciones. Validaciones exactas **pendientes de verificar** en Form Requests/controladores. | `Adoption` fillable/casts, migraciones screening, UI `Public/Pets/Show.vue` | Hecho (campos) / Pendiente (validaciones) |
| BR-ADP-08 | Adopciones tienen revisor opcional y pueden almacenar `acta_path`; generación de acta/certificado existe como jobs/vistas PDF (flujo de disparo a verificar). | `Adoption` campos, `Jobs/GenerateAdoptionActaJob`, `GenerateAdoptionCertificateJob`, `resources/views/pdfs/*` | Parcial |

## 4. Seguimientos

| ID | Regla | Evidencia | Tipo |
|---|---|---|---|
| BR-FUP-01 | Estados de seguimiento: `pending`, `completed`, `missed`. | `app/Enums/FollowUpStatus.php` | Hecho |
| BR-FUP-02 | El adoptante puede reportar hito: guarda notas/fotos (merge con existentes), marca `completed` y `completed_date=now`. | `FollowUpService::reportMilestone()` | Hecho |
| BR-FUP-03 | El equipo/admin puede marcar seguimiento como completado o no realizado (`missed`). | `FollowUpService::markCompleted/markMissed`, rutas dashboard/admin | Hecho |
| BR-FUP-04 | Se pueden programar seguimientos adicionales para una adopción. | `FollowUpService::scheduleAdditional()` | Hecho |
| BR-FUP-05 | Seguimientos pendientes con fecha anterior a hoy pueden marcarse como `missed` (`checkOverdue()`); existe job `CheckOverdueMilestonesJob` (programación/ejecución a verificar). | `FollowUpService::checkOverdue/getOverdue`, `app/Jobs/CheckOverdueMilestonesJob.php` | Parcial |
| BR-FUP-06 | Seguimientos registran información de bienestar (peso, vacunas, comportamiento, estado de salud, enlace drive) según esquema. | migración tracking, `FollowUp` model | Hecho (estructura) |

## 5. Contenido (eventos y blog)

| ID | Regla | Evidencia | Tipo |
|---|---|---|---|
| BR-CNT-01 | Anuncios/eventos tienen tipos: feria de adopción, recaudación, taller, campaña, otro. | `AnnouncementType` | Hecho |
| BR-CNT-02 | Anuncios y posts tienen `slug`, autor (`user_id`), equipo (`team_id`), flags de publicación y fechas de publicación. | modelos/migraciones `Announcement`, `BlogPost` | Hecho |
| BR-CNT-03 | Búsqueda/listado público de contenido publicado se apoya en SPs T-SQL disponibles (uso real a confirmar). | `database/stored-procedures/announcements/*`, `blog/*` | Parcial |

## 6. Mascotas perdidas, veterinarias y calificaciones

| ID | Regla | Evidencia | Tipo |
|---|---|---|---|
| BR-LOST-01 | Se permiten reportes de mascotas perdidas/encontradas con datos descriptivos, ubicación/fecha, contacto y fotos; pueden asociarse opcionalmente a usuario/equipo. | `LostPet` model/migration, rutas públicas/adoptante | Hecho (estructura) |
| BR-VET-01 | Veterinarias pueden ser registradas, listadas, calificadas y verificadas por administración (`is_verified`). | `Veterinarian`, `VeterinarianRating`, rutas admin/team/adopter | Hecho |
| BR-RATE-01 | Calificaciones de veterinarias y equipos: una por usuario-entidad (restricción única por par). | migraciones `veterinarian_ratings`, `team_ratings` | Hecho |

## 7. Contacto, chatbot y DNI

| ID | Regla | Evidencia | Tipo |
|---|---|---|---|
| BR-SUP-01 | Mensajes de contacto se almacenan (`contact_requests`) y pueden referenciar una mascota. | `ContactRequest`, `ContactController` | Hecho |
| BR-BOT-01 | Chatbot responde por coincidencia de palabras clave sobre reglas predefinidas (adopción, requisitos, costos, vivienda, seguimiento, contacto, organizaciones, etc.); si no hay match devuelve opciones genéricas. | `app/Services/ChatbotService.php` | Hecho |
| BR-DNI-01 | Consulta DNI normaliza a 8 dígitos; sin token configurado responde estado `token_missing`; consulta API externa y maneja éxito/no encontrado/error. | `DniLookupService` | Hecho |

## 8. Reglas pendientes de confirmación

- Validaciones exactas de formularios (Form Requests) para cada acción CRUD.
- Autorización fina por permiso en controladores/policies para cada operación de equipo.
- Condiciones de visibilidad/publicación (qué mascotas/contenidos ve el público).
- Reglas de negocio de recomendación de mascotas (`PetRecommendationService`) y compatibilidad mostrada en UI.
- Disparo/agenda real de jobs, listeners, notificaciones y correos en producción.
- Reglas de carga/almacenamiento de archivos (fotos, actas) y límites.
- Conciliación de roles declarados en README con roles/permisos implementados.
