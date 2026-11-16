# Glosario de negocio y dominio

**Fecha:** 2026-11-16  
**Fuentes:** `app/Enums/*`, `app/Models/*`, `app/Services/*`, `routes/*`, `docs/business/*`.

| Término | Definición | Evidencia | Estado |
|---|---|---|---|
| **WASIYUQ** | Plataforma de adopción responsable de mascotas (Cusco, Perú) | `README.md`, rutas públicas, locale `es`/timezone `America/Lima` | Verificado |
| **Visitante** | Usuario no autenticado que navega contenido público | `routes/public.php` | Verificado |
| **Adoptante** | Usuario autenticado que postula/adopta y realiza seguimientos | `routes/web.php` prefijo `/mi-adopcion`, `Adopter\*` | Verificado |
| **Usuario** | Cuenta autenticada del sistema (Fortify) | `app/Models/User.php`, auth stack | Verificado |
| **Super Admin** | Usuario con acceso global a `/admin`; autorizado por `is_super_admin` o email hardcodeado | `IsSuperAdmin`, `User::$fillable` incluye `is_super_admin` | Verificado |
| **Equipo (Team)** | Unidad organizativa/tenant lógico; puede ser personal u organizacional, identificado por `slug` | `app/Models/Team.php`, rutas `/{current_team}` | Verificado |
| **Equipo personal** | Team de uso individual; middleware redirige su dashboard a `/mi-adopcion` | `EnsureTeamMembership` (`is_personal`) | Verificado |
| **Organización / Albergue** | Team organizacional que publica mascotas y gestiona adopciones | `Teams` en rutas, admin organizaciones, chatbot menciona refugio/albergue | Verificado (términos usados de forma cercana) |
| **Membresía** | Relación usuario–equipo con rol y metadatos | `TeamMember`/pivot, `EnsureTeamMembership`, policies | Verificado |
| **Rol de equipo** | Nivel de acceso: `Owner`, `Admin`, `Editor`, `Member` (según enum) | `app/Enums/TeamRole.php` | Verificado |
| **Permiso de equipo** | Capacidad granular (gestión equipo/miembros/invitaciones, etc.) | `app/Enums/TeamPermission.php` | Verificado |
| **Invitación a equipo** | Solicitud para unirse a un team con código/estado y rol | `TeamInvitation`, `TeamInvitationController`, notificación `Teams\TeamInvitation` | Verificado |
| **Mascota (Pet)** | Animal publicado para adopción o gestión; tiene `slug`, especie, estado, fotos | `app/Models/Pet.php`, controladores Pet | Verificado |
| **Estado de mascota** | `available`, `in_process`, `adopted`, `withheld` (nombres según enum) | `app/Enums/PetStatus.php`, `AdoptionService` | Verificado |
| **Adopción** | Solicitud/proceso de adopción de una mascota por un usuario dentro de un team | `app/Models/Adoption.php`, `AdoptionService` | Verificado |
| **Estado de adopción** | `pending`, `approved`, `rejected`, `completed`, `cancelled` | `AdoptionService`, requests/consultas | Verificado |
| **Postulación** | Acción del adoptante de enviar solicitud (`/mascotas/{slug}/postular`) | `Adopter\ApplicationController@store` | Verificado |
| **Screening** | Datos de evaluación (motivación, experiencia, vivienda, patio, composición familiar, etc.) | `StoreApplicationRequest`, campos en `create` | Verificado |
| **Acta / Certificado de adopción** | PDF generado y almacenado en `acta_path` (disk `public`) | `GenerateAdoptionActaJob`, `GenerateAdoptionCertificateJob`, vistas `pdfs/*` | Verificado (dos variantes/jobs) |
| **Seguimiento (FollowUp)** | Hito de control post-adopción asociado a una adopción | `app/Models/FollowUp.php`, `FollowUpService` | Verificado |
| **Estado de seguimiento** | `pending`, `completed`, `missed` | `app/Enums/FollowUpStatus.php`, `FollowUpService` | Verificado |
| **Hito/Milestone** | Seguimiento programado (automático al completar: 30/90/180/270/365 días) o manual | `CreateFollowUpPlan`, `scheduleAdditional` | Verificado |
| **Reporte de hito** | Envío de notas/fotos por adoptante para completar un seguimiento pendiente | `FollowUpService::reportMilestone`, `FollowUpReportController` | Verificado |
| **Mascota perdida (LostPet)** | Reporte/listado público y gestión de mascotas extraviadas | `LostPet` modelo/controladores/rutas | Verificado |
| **Anuncio/Evento (Announcement)** | Publicación de eventos/actividades por equipos | `Announcement`, `Dashboard\Public EventController` | Verificado |
| **BlogPost** | Artículo de contenido del equipo/plataforma | `BlogPost`, controladores blog | Verificado |
| **Veterinaria** | Registro en directorio, asociable a equipos y calificable | `Veterinarian`, controladores/rutas veterinarias | Verificado |
| **Albergue (directorio)** | Entidad listable/calificable en área adoptante | `Public\AlbergueController`, rutas adoptante | Verificado |
| **Calificación (Rating)** | Valoración de veterinarias/albergues | rutas `...calificar`, modelos relacionados (detalle parcial) | Parcial |
| **Solicitud de contacto** | Mensaje enviado desde formulario público | `ContactRequest`, `ContactMessage` | Verificado |
| **Chatbot** | Asistente por reglas y palabras clave con respuestas/botones predefinidos | `ChatbotService`, `/api/chatbot/ask` | Verificado |
| **Consulta DNI** | Búsqueda de datos por DNI vía API externa (apisperu) | `DniLookupService`, `/api/dni/lookup` | Verificado |
| **Stored Procedure (SP)** | Procedimiento T-SQL definido para consultas/reportes (pets/blog/announcements/adoptions) | `database/stored-procedures/**`, comando de carga | Verificado (definición); uso runtime **no evidenciado** |