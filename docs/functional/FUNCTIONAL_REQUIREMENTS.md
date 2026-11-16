# Requisitos funcionales

**Fecha:** 2026-11-16  
**Base:** inventario de rutas/controladores, servicios, requests y documentación existente (`docs/development/FEATURE_INVENTORY.md`, `docs/technical/API_CATALOG.md`).  
**Leyenda estado:** **V**erificado, **P**arcial, **I**nferido, **C** Pendiente de confirmación.

## 1. Acceso público y contenido

| ID | Requisito | Prioridad implícita | Evidencia | Estado |
|---|---|---|---|---|
| FR-PUB-01 | Mostrar página de inicio con acceso a secciones principales | Alta | `routes/public.php`, `HomeController` | V |
| FR-PUB-02 | Listar y filtrar mascotas disponibles con vista de detalle por slug | Alta | `Public\PetController`, `PetService/Repository` | V |
| FR-PUB-03 | Listar/detallar mascotas perdidas y permitir reporte público | Media | `Public\LostPetController`, rutas lost-pets | V |
| FR-PUB-04 | Listar/detallar eventos/anuncios publicados | Media | `Public\EventController` | V |
| FR-PUB-05 | Listar/detallar publicaciones de blog | Media | `Public\BlogController` | V |
| FR-PUB-06 | Mostrar página “Sobre nosotros” | Baja | `AboutController` | V |
| FR-PUB-07 | Permitir envío de formulario de contacto y notificación por correo | Media | `ContactController` ruta, `ContactMessage` | V |
| FR-PUB-08 | Exponer sitemap y endpoint de salud | Baja | `/sitemap.xml`, `/health` | V |

## 2. Identidad, cuentas y equipos

| ID | Requisito | Evidencia | Estado |
|---|---|---|---|
| FR-AUTH-01 | Registrar, iniciar sesión, recuperar/gestionar contraseña y 2FA (Fortify) | Dependencias/config Fortify, rutas settings/security | P |
| FR-AUTH-02 | Iniciar sesión con Google OAuth | `SocialLoginController`, `config/services.php` | V |
| FR-AUTH-03 | Gestionar perfil, seguridad y apariencia de cuenta | `Settings\ProfileController`, `SecurityController`, rutas settings | V |
| FR-AUTH-04 | Crear/gestionar equipos y cambiar contexto de equipo actual | `Teams\TeamController`, rutas settings/teams, dashboard redirect | V |
| FR-AUTH-05 | Invitar, aceptar y cancelar invitaciones a equipos con rol | `TeamInvitationController`, requests teams, notificación invitación | V |
| FR-AUTH-06 | Restringir acceso a panel de equipo a miembros (y equipo no personal) con bypass superadmin | `EnsureTeamMembership` | V |
| FR-AUTH-07 | Restringir panel admin a superadministradores | `IsSuperAdmin` | V |

## 3. Adopciones (núcleo)

| ID | Requisito | Evidencia | Estado |
|---|---|---|---|
| FR-ADOP-01 | Permitir a adoptante postular a mascota con formulario de screening obligatorio | `StoreApplicationRequest`, `Adopter\ApplicationController@store` | V |
| FR-ADOP-02 | Impedir solicitudes duplicadas activas (pending/approved) por usuario y mascota | `ApplicationController@store` | V |
| FR-ADOP-03 | Al crear postulación, registrar adopción `pending`, marcar mascota `in_process` y notificar a admins del equipo | `AdoptionService::create`, evento/listener/notificación | V |
| FR-ADOP-04 | Permitir a equipo listar/ver adopciones y filtrar por estado | `Dashboard\AdoptionController@index,show` | V |
| FR-ADOP-05 | Permitir aprobar adopción (reviewer, fecha, mascota `adopted`, notificar adoptante, generar acta PDF) | `AdoptionService::approve`, `NotifyAdopterOfApproval`, `GenerateAdoptionActaJob` | V |
| FR-ADOP-06 | Permitir rechazar adopción con notas y liberar mascota (`available`) | `AdoptionService::reject`, `Dashboard\AdoptionController@reject` | V |
| FR-ADOP-07 | Soportar completar adopción y disparar plan de 5 seguimientos | `AdoptionService::complete`, `CreateFollowUpPlan` | P (lógica verificada, disparo UI/ruta **C**) |
| FR-ADOP-08 | Soportar cancelar adopción y liberar mascota | `AdoptionService::cancel` | P (disparo **C**) |
| FR-ADOP-09 | Permitir a adoptante consultar historial/estado de sus postulaciones | `Adopter\ApplicationController@index` | V |

## 4. Seguimiento post-adopción

| ID | Requisito | Evidencia | Estado |
|---|---|---|---|
| FR-FUP-01 | Crear automáticamente hitos a 30/90/180/270/365 días al completar adopción | `CreateFollowUpPlan` | P (depende FR-ADOP-07) |
| FR-FUP-02 | Permitir a adoptante listar/ver y reportar hitos pendientes con notas y fotos | `FollowUpReportController`, `FollowUpService::reportMilestone` | V |
| FR-FUP-03 | Permitir a equipo listar/ver, marcar completado/no realizado y programar seguimientos adicionales | `Dashboard\FollowUpController`, `FollowUpService` | V |
| FR-FUP-04 | Marcar automáticamente como `missed` seguimientos pendientes vencidos (ejecución diaria) | `routes/console.php`, `CheckOverdueMilestonesJob` | V (requiere scheduler/colas activos) |
| FR-FUP-05 | Persistir metadatos extendidos de reporte (peso, vacunas, comportamiento, salud, enlaces) | Campos en `Store/UpdateFollowUpRequest` | **Gap verificado**: requests los aceptan pero servicio no los persiste |

## 5. Gestión de mascotas y contenido por equipo

| ID | Requisito | Evidencia | Estado |
|---|---|---|---|
| FR-TEAM-01 | CRUD de mascotas del equipo con imágenes y estados | `Teams\PetController`, requests Pet | V |
| FR-TEAM-02 | CRUD de blog y eventos/anuncios del equipo | `Dashboard\BlogPostController`, `Dashboard\EventController` | V |
| FR-TEAM-03 | Editar perfil de equipo (datos, logo, galería) | `Teams\TeamProfileController` | V |
| FR-TEAM-04 | Visualizar miembros y gestionar veterinarias del equipo | rutas/`Teams\VeterinarianController` | P |
| FR-TEAM-05 | Mostrar dashboard con métricas y actividad reciente | closure dashboard en `routes/web.php` | V |

## 6. Área adoptante (mi adopción)

| ID | Requisito | Evidencia | Estado |
|---|---|---|---|
| FR-ADP-01 | Dashboard adoptante | `Adopter\DashboardController` | V |
| FR-ADP-02 | Publicar/gestionar mascotas propias y mascotas perdidas propias | `Adopter\PetController`, `Adopter\LostPetController` | V |
| FR-ADP-03 | Consultar y calificar veterinarias y albergues | rutas/controladores veterinarias/albergues, acciones calificar | P |

## 7. Administración global

| ID | Requisito | Evidencia | Estado |
|---|---|---|---|
| FR-ADM-01 | Gestionar usuarios (CRUD, rol, membresías) y consultar roles | `Admin\UserController`, `Admin\RoleManagementController` | V |
| FR-ADM-02 | Gestionar organizaciones, mascotas, eventos, blog, seguimientos globalmente | `Admin\*Controller` correspondientes | V |
| FR-ADM-03 | Consultar adopciones y gestionar/verificar veterinarias y albergues | `Admin\AdoptionController`, `Admin\VeterinarianController`, `Admin\AlbergueController` | P |

## 8. Integraciones y utilidades

| ID | Requisito | Evidencia | Estado |
|---|---|---|---|
| FR-INT-01 | Responder consultas vía chatbot basado en reglas | `ChatbotService`, `/api/chatbot/ask` | V |
| FR-INT-02 | Consultar datos por DNI en proveedor externo | `DniLookupService`, `/api/dni/lookup` | V |
| FR-INT-03 | Generar documentos PDF de adopción/acta/certificado | DomPDF, jobs PDF, vistas `resources/views/pdfs/*` | V (duplicidad job/semántica **C**) |

## 9. Requisitos no funcionales observados (parcial)

| ID | Requisito | Evidencia | Estado |
|---|---|---|---|
| NFR-01 | PWA (manifest, offline, caché) y soporte empaquetado móvil (Capacitor) | `vite.config.ts`, `capacitor/` | V |
| NFR-02 | Localización es-PE y timezone America/Lima | configuración app/.env.example | V |
| NFR-03 | Soft deletes en entidades clave | modelos (`SoftDeletes`) | V |
| NFR-04 | Controles de acceso por membresía/rol y superadmin | middlewares/policies/enums | V (enforcement fino **P**) |