# Matriz de trazabilidad

**Fecha:** 2026-11-16  
**Alcance:** funcionalidades actuales ↔ reglas de negocio ↔ entidades/datos ↔ componentes legacy ↔ módulos futuros ↔ estado de verificación.  
**Leyenda estado:** **V**=Verificado (evidencia en código), **P**=Parcial, **I**=Inferido, **C**=Pendiente de confirmación.

| ID Func | Funcionalidad | Reglas de negocio asociadas | Entidades / datos | Componentes legacy (evidencia) | Módulo futuro | Prioridad | Estado |
|---|---|---|---|---|---|---|---|
| F-PUB-01 | Home y navegación pública | Mostrar contenido público sin auth | (contenido agregado) | `routes/public.php`, `HomeController` | content/platform-public | Media | V |
| F-PUB-02 | Catálogo y detalle de mascotas | Solo lectura pública; slugs | `pets`, `teams` | `Public\PetController`, SPs `sp_search_pets`,`sp_get_pet_detail` (definidos) | pets | Alta | V |
| F-PUB-03 | Eventos públicos (listar/detalle) | Mostrar publicados | `announcements`, `teams`, `users` | `Public\EventController`, SPs anuncios | content | Media | V |
| F-PUB-04 | Blog público (listar/detalle) | Mostrar publicados | `blog_posts`, `teams`, `users` | `Public\BlogController`, SPs blog | content | Media | V |
| F-PUB-05 | Mascotas perdidas público (listar/detalle/reportar) | Reporte abierto; gestión propia autenticada | `lost_pets`, `users` | `Public\LostPetController`, `Adopter\LostPetController` | community | Media | V/P |
| F-PUB-06 | Formulario de contacto | Registrar solicitud y enviar correo (reply-to) | `contact_requests` | `routes/public.php` POST contacto, `ContactMessage` | support/notifications | Media | V |
| F-PUB-07 | Sitemap y health | Exponer endpoints técnicos/SEO | N/A | `routes/public.php` | platform-public | Baja | V |
| F-AUTH-01 | Registro/login/recuperación/2FA | Fortify; políticas de password en prod | `users`, tablas Fortify/2FA | stack Fortify, settings/security | identity-access | Alta | P |
| F-AUTH-02 | Login Google OAuth | Vincular/autenticar vía proveedor | `users` (google_id) | `SocialLoginController`, `services.google` | identity-access/integrations | Alta | V/P |
| F-AUTH-03 | Perfil y seguridad de cuenta | Usuario autenticado edita sus datos | `users` | `Settings\ProfileController`, `SecurityController` | identity-access | Alta | V/P |
| F-AUTH-04 | Gestión de equipos y contexto actual | Usuario pertenece a teams; switch de team actual | `teams`, `team_user` | `Teams\TeamController`, dashboard redirect | organizations | Alta | V |
| F-AUTH-05 | Invitaciones a equipo | Crear/aceptar/cancelar con rol y código | `team_invitations`, `teams`, `users` | `TeamInvitationController`, requests, `Teams\TeamInvitation` | organizations/notifications | Media | V |
| F-AUTH-06 | Control acceso panel equipo | Debe ser miembro; team no personal→panel org; superadmin bypass | `teams`, membresías | `EnsureTeamMembership` | organizations/identity-access | Alta | V |
| F-AUTH-07 | Control acceso admin | Solo superadmin (flag o email hardcodeado) | `users` | `IsSuperAdmin` | identity-access/platform-admin | Alta | V (riesgo) |
| F-ADOP-01 | Postular a adopción | Screening obligatorio; sin duplicado activo mismo user/pet | `adoptions`, `pets`, `users`, `teams` | `Adopter\ApplicationController@store`, `StoreApplicationRequest` | adoptions | Alta | V |
| F-ADOP-02 | Crear adopción (transición inicial) | Crea `pending`, pet→`in_process`, emite evento | `adoptions`, `pets` | `AdoptionService::create`, `AdoptionApplicationSubmitted` | adoptions | Alta | V |
| F-ADOP-03 | Notificar nueva postulación | Notificar miembros rol ≥ Admin por email (cola) | `notifications` (sistema), `users` | `NotifyEntityOfNewApplication`, `AdoptionApplicationSubmittedNotification` | notifications | Alta | V |
| F-ADOP-04 | Listar/ver adopciones de equipo | Filtrar por estado; scoped a team | `adoptions`, `pets`, `users` | `Dashboard\AdoptionController`, SP `sp_list_organization_adoptions` (def) | adoptions | Alta | V |
| F-ADOP-05 | Aprobar adopción | `approved`, reviewer/fecha, pet→`adopted`, evento | `adoptions`, `pets`, `users` | `AdoptionService::approve`, `Dashboard\AdoptionController@approve` | adoptions | Alta | V |
| F-ADOP-06 | Efectos de aprobación | Email adoptante + generar acta PDF | `adoptions.acta_path`, storage | `NotifyAdopterOfApproval`, `GenerateAdoptionActaJob`, `pdfs/adoption-acta` | documents/notifications | Alta | V |
| F-ADOP-07 | Rechazar adopción | `rejected`, notas/reviewer/fecha, pet→`available` | `adoptions`, `pets` | `AdoptionService::reject` | adoptions | Alta | V |
| F-ADOP-08 | Completar adopción | `completed`, emite evento para plan seguimiento | `adoptions` | `AdoptionService::complete` | adoptions | Alta | P (disparo UI **C**) |
| F-ADOP-09 | Plan automático de seguimiento | Crear 5 hitos 30/90/180/270/365 días | `follow_ups`, `adoptions` | `CreateFollowUpPlan`, `AdoptionCompleted` | followups | Alta | V (dependiente F-ADOP-08) |
| F-ADOP-10 | Cancelar adopción | `cancelled`, pet→`available` | `adoptions`, `pets` | `AdoptionService::cancel` | adoptions | Media | P (**C**) |
| F-ADOP-11 | Consultar postulaciones propias | Solo adoptante dueño | `adoptions` | `Adopter\ApplicationController@index` | adoptions | Alta | V |
| F-ADOP-12 | Certificado de adopción (PDF) | Generar y guardar certificado | `adoptions.acta_path`, storage | `GenerateAdoptionCertificateJob`, `pdfs/adoption-certificate` | documents | Media | P (sin disparador hallado) |
| F-FUP-01 | Listar/ver seguimientos adoptante | Solo de adopciones propias | `follow_ups`, `adoptions` | `Adopter\FollowUpReportController` | followups | Alta | V |
| F-FUP-02 | Reportar hito (adoptante) | Solo `pending` y dueño; guarda notas/fotos, marca `completed` | `follow_ups`, storage `follow-ups/` | `FollowUpService::reportMilestone` | followups | Alta | V |
| F-FUP-03 | Listar/filtrar seguimientos equipo | Scoped a team; filtro estado | `follow_ups`, `adoptions` | `Dashboard\FollowUpController@index`, `FollowUpService::getByTeam` | followups | Alta | V |
| F-FUP-04 | Marcar seguimiento completado/no realizado | Cambios de estado por equipo | `follow_ups` | `Dashboard\FollowUpController`, `FollowUpService` | followups | Alta | V |
| F-FUP-05 | Programar seguimiento adicional | `scheduled_date` futura, crea `pending` | `follow_ups`, `adoptions` | `schedule` action/controller/service | followups | Media | V |
| F-FUP-06 | Vencer seguimientos automáticamente | `pending` vencidos→`missed` diario | `follow_ups` | `CheckOverdueMilestonesJob`, `routes/console.php` | followups | Alta | V (ops) |
| F-PET-01 | CRUD mascotas equipo | Gestión con fotos, estados, slug | `pets`, storage `pets/` | `Teams\PetController`, `Store/UpdatePetRequest` | pets | Alta | V |
| F-PET-02 | CRUD mascotas adoptante | Publicar/gestionar propias en mi-adopción | `pets` | `Adopter\PetController` | pets | Media | V/P |
| F-PET-03 | Gestión mascotas admin | CRUD global | `pets` | `Admin\PetController` | platform-admin/pets | Media | V/P |
| F-CONT-01 | CRUD blog equipo/admin | Publicación, slugs, categorías/tags | `blog_posts` | `Dashboard\BlogPostController`, `Admin\BlogPostController` | content | Media | V/P |
| F-CONT-02 | CRUD eventos/anuncios equipo/admin | Tipos, fechas, publicación | `announcements` | `Dashboard\EventController`, `Admin\EventController` | content | Media | V/P |
| F-TEAM-01 | Dashboard equipo | Métricas y recientes por team | `pets`,`adoptions`,`announcements`,`blog_posts`,`follow_ups` | `routes/web.php` closure dashboard | organizations/platform | Alta | V |
| F-TEAM-02 | Perfil de equipo | Editar datos/logo/galería | `teams`, storage `teams/*` | `Teams\TeamProfileController` | organizations | Media | V |
| F-TEAM-03 | Miembros y veterinarias de equipo | Listado miembros; gestión veterinarias vinculadas | `team_user`, `veterinarians` | rutas miembros, `Teams\VeterinarianController` | organizations/directory | Media | P |
| F-DIR-01 | Directorio y calificación de veterinarias | Listar/ver/agregar/calificar; verificación admin | `veterinarians`, ratings | `VeterinarianController` (public/teams/admin) | directory | Media | P |
| F-DIR-02 | Directorio y calificación de albergues | Listar/ver/calificar | `teams`, ratings | `Public\AlbergueController`, admin | directory | Media | P |
| F-ADM-01 | Administración de usuarios/roles/membresías | CRUD y asignaciones globales | `users`, `team_user` | `Admin\UserController`, `RoleManagementController` | platform-admin/identity-access | Alta | V/P |
| F-ADM-02 | Administración de organizaciones | CRUD equipos global | `teams` | `Admin\OrganizationController` | platform-admin/organizations | Alta | V/P |
| F-INT-01 | Chatbot por reglas | Matching keywords→respuesta/botones | (en memoria) | `ChatbotService`, `/api/chatbot/ask` | support | Baja | V |
| F-INT-02 | Consulta DNI externa | GET proveedor, manejo token/error | N/A (API externa) | `DniLookupService`, `/api/dni/lookup` | integrations | Media | V |
| F-INT-03 | Login Google | OAuth2 Socialite | `users` | `SocialLoginController` | integrations/identity-access | Alta | V/P |
| F-OPS-01 | Tareas programadas | Vencimiento diario de seguimientos | `follow_ups` | `routes/console.php`, `CheckOverdueMilestonesJob` | followups/ops | Alta | V |

## Gaps transversales trazados

| Gap | Impacto | Entidades afectadas | Módulos futuros | Estado |
|---|---|---|---|---|
| `complete/cancel` adopción sin disparador UI confirmado | Plan de seguimiento y cierre de ciclo incompletos | `adoptions`,`follow_ups` | adoptions, followups | C |
| Campos extendidos de seguimiento no persistidos | Pérdida de datos clínicos/reportes ricos | `follow_ups` | followups | V (gap) |
| SPs definidos sin uso en app | Ambigüedad de lógica/paridad y deuda de BD | consultas pets/adoptions/content | pets/adoptions/content | V |
| Doble job PDF sobre `acta_path` y sin descarga confirmada | Integridad documental | `adoptions`, storage | documents | V/P |
| Bypass superadmin por email hardcodeado | Seguridad/gobernanza | acceso global | identity-access/platform-admin | V |
| Cobertura de pruebas de dominio nula | Riesgo de regresión en reconstrucción | todos núcleo | QA transversal | V |