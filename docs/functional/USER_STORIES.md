# Historias de usuario

**Fecha:** 2026-11-16  
**Nota:** historias derivadas por ingeniería inversa del comportamiento implementado; prioridades y aceptación final **pendientes de validación con negocio**.

## Visitante
| ID | Historia | Criterios de aceptación (observados) | Evidencia | Prioridad sugerida |
|---|---|---|---|---|
| US-V-01 | Como visitante quiero explorar mascotas para encontrar una para adoptar | Puedo listar y ver detalle por slug | `Public\PetController`, rutas `/mascotas*` | Alta |
| US-V-02 | Como visitante quiero ver eventos y blog para informarme | Puedo acceder a listados y detalles públicos | `Public\EventController`, `Public\BlogController` | Media |
| US-V-03 | Como visitante quiero reportar/ver mascotas perdidas | Puedo listar, ver detalle y enviar reporte | `Public\LostPetController` | Media |
| US-V-04 | Como visitante quiero contactar a la plataforma | Puedo enviar formulario y recibir confirmación (toast/flujo) | `/contacto`, `ContactMessage` | Media |
| US-V-05 | Como visitante quiero resolver dudas rápidas | Puedo interactuar con chatbot y recibir respuestas guiadas | `/api/chatbot/ask`, `ChatbotService` | Baja |

## Adoptante
| ID | Historia | Criterios de aceptación (observados) | Evidencia | Prioridad |
|---|---|---|---|---|
| US-A-01 | Como adoptante quiero postular a una mascota para iniciar adopción | Completo screening; no puedo duplicar solicitud activa; recibo confirmación | `ApplicationController`, `StoreApplicationRequest` | Alta |
| US-A-02 | Como adoptante quiero ver mis postulaciones | Accedo a listado con estados | `/mi-adopcion/postulaciones` | Alta |
| US-A-03 | Como adoptante quiero reportar seguimientos con fotos | Solo mis seguimientos pendientes; subo evidencia y queda completado | `FollowUpReportController`, `FollowUpService` | Alta |
| US-A-04 | Como adoptante quiero gestionar mis mascotas perdidas y publicaciones propias | Puedo crear/listar/editar/eliminar según rutas disponibles | `Adopter\LostPetController`, `Adopter\PetController` | Media |
| US-A-05 | Como adoptante quiero consultar/calificar veterinarias y albergues | Puedo ver listados/detalles y enviar calificación | rutas `/mi-adopcion/veterinarias*`, `/mi-adopcion/albergues*` | Media |
| US-A-06 | Como adoptante quiero recibir notificación si aprueban mi solicitud | Recibo email con mensaje y acceso a postulaciones | `AdoptionApprovedNotification` | Media |

## Miembro de equipo / organización
| ID | Historia | Criterios de aceptación (observados) | Evidencia | Prioridad |
|---|---|---|---|---|
| US-T-01 | Como miembro quiero ver un dashboard del equipo | Veo métricas y elementos recientes | dashboard `routes/web.php` | Alta |
| US-T-02 | Como miembro quiero gestionar mascotas del equipo | CRUD con fotos y estados | `Teams\PetController` | Alta |
| US-T-03 | Como miembro quiero revisar postulaciones | Puedo listar, ver detalle, aprobar o rechazar | `Dashboard\AdoptionController`, `AdoptionService` | Alta |
| US-T-04 | Como miembro quiero gestionar seguimientos | Puedo ver, filtrar, marcar estados y programar nuevos | `Dashboard\FollowUpController` | Alta |
| US-T-05 | Como miembro quiero publicar eventos y blog | CRUD de contenido del equipo | `Dashboard\EventController`, `Dashboard\BlogPostController` | Media |
| US-T-06 | Como miembro quiero mantener el perfil del equipo | Actualizo información, logo y galería | `Teams\TeamProfileController` | Media |
| US-T-07 | Como miembro quiero recibir aviso de nuevas postulaciones | Admins+ reciben email con enlace a revisión | `NotifyEntityOfNewApplication` | Media |
| US-T-08 | Como miembro quiero invitar y administrar miembros | Gestiono invitaciones y roles según permisos | `TeamInvitationController`, `TeamPolicy` | Media |

## Super administrador
| ID | Historia | Criterios de aceptación (observados) | Evidencia | Prioridad |
|---|---|---|---|---|
| US-SA-01 | Como super admin quiero gestionar usuarios y organizaciones | CRUD y administración global desde `/admin` | `Admin\UserController`, `Admin\OrganizationController` | Alta |
| US-SA-02 | Como super admin quiero supervisar contenido y operaciones | Accedo a mascotas, eventos, blog, adopciones, seguimientos, directorios | rutas `admin.php` | Alta |
| US-SA-03 | Como super admin quiero verificar veterinarias | Puedo revisar/gestionar registros de veterinarias | `Admin\VeterinarianController` | Media |

## Brechas convertibles en historias futuras (pendientes)
| ID | Historia | Motivo | Estado |
|---|---|---|---|
| US-GAP-01 | Como equipo quiero cerrar formalmente una adopción desde la UI | `complete()` y plan de seguimiento dependen de ello; disparo no confirmado | Pendiente de confirmación |
| US-GAP-02 | Como adoptante/equipo quiero registrar datos clínicos estructurados del seguimiento | Requests aceptan campos no persistidos por servicio | Gap verificado |