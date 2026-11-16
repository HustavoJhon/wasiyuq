# Inventario de funcionalidades

**Fecha:** 2026-11-16 (actualizado — Fase 0 cierre documental)  
**Estado:** ampliado con evidencia de requests, servicios, eventos, jobs, listeners, notificaciones, SPs, storage y pruebas.  
**Leyenda:** **V**=Verificado, **P**=Parcial, **I**=Inferido, **C**=Pendiente de confirmación. IDs y descripciones alineados con `docs/development/TRACEABILITY_MATRIX.md`.

## 1. Público
| ID | Funcionalidad | Actor | Evidencia | Estado |
|---|---|---|---|---|
| PUB-01 | Página de inicio | Visitante | `routes/public.php` → `HomeController@index` | V |
| PUB-02 | Catálogo y detalle de mascotas | Visitante | `Public\PetController`, `PetService/Repository` | V |
| PUB-03 | Listado/detalle/reporte de mascotas perdidas | Visitante | `Public\LostPetController`, rutas `mascotas-perdidas*` | V |
| PUB-04 | Listado/detalle de eventos/anuncios | Visitante | `Public\EventController` | V |
| PUB-05 | Listado/detalle de blog | Visitante | `Public\BlogController` | V |
| PUB-06 | Sobre nosotros | Visitante | `AboutController` | V |
| PUB-07 | Contacto (formulario + envío de correo) | Visitante | `POST /contacto`, `App\Mail\ContactMessage` | V |
| PUB-08 | Sitemap y health check | Sistema/SEO | `/sitemap.xml`, `/health` | V |

## 2. Autenticación, cuenta y equipos
| ID | Funcionalidad | Actor | Evidencia | Estado |
|---|---|---|---|---|
| AUTH-01 | Login/registro/password/2FA (Fortify) | Usuario | Stack Fortify, tests auth, `Settings\SecurityController` | P |
| AUTH-02 | Login Google OAuth | Usuario | `/auth/google*`, `SocialLoginController`, `config/services.php` | V/P |
| AUTH-03 | Perfil y seguridad | Autenticado | `Settings\ProfileController`, `SecurityController` | V |
| AUTH-04 | Apariencia | Autenticado | `settings/appearance` | P |
| AUTH-05 | Gestión de equipos y contexto | Autenticado | `settings/teams*`, `Teams\TeamController`, redirect dashboard | V |
| AUTH-06 | Invitaciones (crear/aceptar/cancelar) | Autenticado/miembro | `TeamInvitationController`, requests teams, `Notifications\Teams\TeamInvitation` | V |
| AUTH-07 | Control acceso equipo (membresía, no personal) y bypass superadmin | Sistema | `EnsureTeamMembership` | V |
| AUTH-08 | Control acceso admin | Sistema | `IsSuperAdmin` (flag o email hardcodeado) | V (riesgo) |

## 3. Área adoptante (`/mi-adopcion`)
| ID | Funcionalidad | Actor | Evidencia | Estado |
|---|---|---|---|---|
| ADP-01 | Dashboard adoptante | Adoptante | `Adopter\DashboardController` | V |
| ADP-02 | Ver postulaciones propias | Adoptante | `Adopter\ApplicationController@index` | V |
| ADP-03 | Postular a adopción con screening y anti-duplicado | Adoptante | `POST /mascotas/{slug}/postular`, `StoreApplicationRequest`, `ApplicationController@store` | V |
| ADP-04 | Publicar/listar/eliminar mascotas propias | Adoptante | `Adopter\PetController` | V/P |
| ADP-05 | Gestionar mascotas perdidas propias | Adoptante | `Adopter\LostPetController` | V/P |
| ADP-06 | Directorio/calificación veterinarias y albergues | Adoptante | rutas/controladores veterinarias y albergues | P |
| ADP-07 | Listar/ver/reportar seguimientos (notas/fotos) | Adoptante | `Adopter\FollowUpReportController`, `FollowUpService::reportMilestone` | V |

## 4. Panel de equipo (`/{current_team}`)
| ID | Funcionalidad | Actor | Evidencia | Estado |
|---|---|---|---|---|
| TEAM-01 | Dashboard con métricas y recientes | Miembro | closure dashboard en `routes/web.php` | V |
| TEAM-02 | CRUD mascotas (fotos/storage) | Miembro | `Teams\PetController`, `Store/UpdatePetRequest` | V |
| TEAM-03 | Listar/ver/aprobar/rechazar adopciones | Miembro | `Dashboard\AdoptionController`, `AdoptionService` | V |
| TEAM-04 | Gestionar seguimientos (listar, ver, completar, missed, programar) | Miembro | `Dashboard\FollowUpController`, `FollowUpService` | V |
| TEAM-05 | CRUD blog | Miembro | `Dashboard\BlogPostController` | V |
| TEAM-06 | CRUD eventos/anuncios | Miembro | `Dashboard\EventController` | V |
| TEAM-07 | Perfil de equipo (logo/galería) | Miembro | `Teams\TeamProfileController` | V |
| TEAM-08 | Ver miembros | Miembro | ruta `miembros` | V/P |
| TEAM-09 | Veterinarias del equipo | Miembro | `Teams\VeterinarianController` | P |

## 5. Administración (`/admin`)
| ID | Funcionalidad | Actor | Evidencia | Estado |
|---|---|---|---|---|
| ADM-01..12 | Dashboard, perfil, roles, usuarios/membresías, organizaciones, mascotas, eventos, blog, adopciones, seguimientos, veterinarias (verificación), albergues | Super admin | `routes/admin.php`, `Admin\*Controller` | V/P (alcance fino variable) |

## 6. Procesos asíncronos y automatismos
| ID | Funcionalidad | Evidencia | Estado |
|---|---|---|---|
| ASYNC-01 | Notificación a admins al enviar postulación (queued) | `AdoptionApplicationSubmitted` → `NotifyEntityOfNewApplication` | V |
| ASYNC-02 | Notificación a adoptante al aprobar + generación de acta PDF (queued) | `AdoptionApproved` → `NotifyAdopterOfApproval` → `GenerateAdoptionActaJob` | V |
| ASYNC-03 | Creación de plan 5 seguimientos al completar adopción (queued listener) | `AdoptionCompleted` → `CreateFollowUpPlan` | V (disparo `complete` **C**) |
| ASYNC-04 | Vencimiento diario de seguimientos (`pending`→`missed`) | `routes/console.php`, `CheckOverdueMilestonesJob` | V (requiere scheduler/worker) |
| ASYNC-05 | Generación de certificado PDF | `GenerateAdoptionCertificateJob` | P (sin invocación hallada) |

## 7. APIs e integraciones
| ID | Funcionalidad | Evidencia | Estado |
|---|---|---|---|
| API-01 | Chatbot por reglas | `POST /api/chatbot/ask`, `ChatbotService` | V |
| API-02 | Consulta DNI externa | `POST /api/dni/lookup`, `DniLookupService`, `services.dni` | V |
| API-03 | OAuth Google | rutas auth/google, `SocialLoginController` | V/P |

## 8. Datos, documentos y almacenamiento
| ID | Funcionalidad | Evidencia | Estado |
|---|---|---|---|
| DATA-01 | Stored procedures T-SQL (búsqueda/detalle/reportes) definidos | `database/stored-procedures/**` (9 archivos) | V (definición); uso app **no evidenciado** |
| DATA-02 | PDFs acta/certificado en storage público | `pdfs/*`, jobs DomPDF, `acta_path` | V (semántica/descarga **P**) |
| DATA-03 | Uploads de imágenes (pets, lost-pets, teams, follow-ups) | usos `Storage::disk('public')`/`->store` en controladores/servicios | V |

## 9. Pruebas (estado real)
| Área | Cobertura | Evidencia | Estado |
|---|---|---|---|
| Auth/Teams/Settings/Dashboard | Tests scaffolding/presentes | `tests/Feature/Auth/*`, `Teams/*`, `Settings/*`, `DashboardTest` | P |
| Dominio adopciones/seguimientos/contenido/integraciones | Sin tests dedicados | ausencia en `tests/` | V (gap) |
| Entorno de test | SQLite in-memory, queue sync | `phpunit.xml` | V |

## 10. Hallazgos y gaps clave (resumen)
- **GAP-01 (C):** `complete`/`cancel` en servicio sin disparador UI/ruta confirmado.
- **GAP-02 (V):** campos extendidos de seguimiento en requests no persistidos por `FollowUpService`.
- **GAP-03 (V):** SPs sin invocación en runtime; paridad a decidir.
- **GAP-04 (V/P):** doble job PDF escribiendo `acta_path`; descarga no confirmada.
- **GAP-05 (V):** bypass superadmin por email hardcodeado.
- **GAP-06 (V):** cobertura de pruebas de dominio nula.