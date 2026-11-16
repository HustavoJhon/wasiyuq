# Inventario de funcionalidades

**Fecha:** 2026-11-16  
**Estado:** inventario inicial basado en rutas, controladores detectados, modelos, servicios y navegación inferida. Requiere ampliación con lectura exhaustiva de cada controlador/página Vue.

## 1. Convenciones

- **Evidencia:** archivo/ruta donde se observa la funcionalidad.
- **Estado:** `Implementado (observado en código)`, `Parcial/por verificar`, `No confirmado`.
- **Actor:** visitante, adoptante, miembro equipo, admin plataforma (según middleware/rutas).

## 2. Funcionalidades públicas

| ID | Funcionalidad | Actor | Evidencia | Estado |
|---|---|---|---|---|
| PUB-01 | Página de inicio | Visitante | `routes/public.php` → `HomeController@index` | Implementado |
| PUB-02 | Listado de mascotas con filtros/búsqueda (según README/controlador) | Visitante | `/mascotas`, `Public\PetController@index`, `PetService/PetRepository` | Implementado (detalle por verificar) |
| PUB-03 | Detalle de mascota por slug | Visitante | `/mascotas/{slug}`, `Public\PetController@show` | Implementado |
| PUB-04 | Listado de mascotas perdidas | Visitante | `/mascotas-perdidas`, `Public\LostPetController@index` | Implementado |
| PUB-05 | Detalle de mascota perdida | Visitante | `/mascotas-perdidas/{id}` | Implementado |
| PUB-06 | Reporte público de mascota perdida | Visitante | `POST /mascotas-perdidas/reportar`, `LostPetController@store` | Implementado |
| PUB-07 | Listado y detalle de eventos/anuncios | Visitante | `/eventos`, `/eventos/{slug}`, `Public\EventController` | Implementado |
| PUB-08 | Listado y detalle de blog | Visitante | `/blog`, `/blog/{slug}`, `Public\BlogController` | Implementado |
| PUB-09 | Página sobre nosotros | Visitante | `/sobre-nosotros`, `AboutController` | Implementado |
| PUB-10 | Contacto (ver + enviar) | Visitante | `/contacto` GET/POST, `ContactController`, modelo `ContactRequest` | Implementado |
| PUB-11 | Sitemap y health check | Sistema/SEO | `/sitemap.xml`, `/health` | Implementado |

## 3. Autenticación y cuenta

| ID | Funcionalidad | Actor | Evidencia | Estado |
|---|---|---|---|---|
| AUTH-01 | Login/registro/password/2FA (Fortify) | Usuario | Dependencias Fortify, rutas settings/security, `config/fortify.php` (a revisar) | Implementado/parcial por verificar UI |
| AUTH-02 | Login con Google (OAuth) | Usuario | `/auth/google`, `/auth/google/callback`, `SocialLoginController`, `config/services.php` | Implementado |
| AUTH-03 | Gestión de perfil y seguridad | Autenticado | `routes/settings.php`, `Settings\ProfileController`, `SecurityController` | Implementado |
| AUTH-04 | Apariencia | Autenticado | `settings/appearance` (Inertia) | Implementado (UI por verificar) |
| AUTH-05 | Gestión de equipos personales/organizaciones del usuario | Autenticado | `settings/teams*`, `Teams\TeamController` | Implementado |
| AUTH-06 | Invitaciones a equipo (crear/aceptar/cancelar) | Autenticado/miembro | `TeamInvitationController`, rutas settings e `invitations/{invitation}/accept` | Implementado |

## 4. Área adoptante (`/mi-adopcion`)

| ID | Funcionalidad | Actor | Evidencia | Estado |
|---|---|---|---|---|
| ADP-01 | Dashboard adoptante | Adoptante | `Adopter\DashboardController@index`, `/mi-adopcion`, `/mi-adopcion/inicio` | Implementado |
| ADP-02 | Ver postulaciones propias | Adoptante | `/mi-adopcion/postulaciones`, `Adopter\ApplicationController@index` | Implementado |
| ADP-03 | Publicar mascota (crear/listar/eliminar propias) | Adoptante | `/mi-adopcion/mascotas*`, `Adopter\PetController` | Implementado |
| ADP-04 | Gestionar mascotas perdidas propias (listar/editar/actualizar/eliminar) | Adoptante | `/mi-adopcion/mascotas-perdidas*`, `Adopter\LostPetController` | Implementado |
| ADP-05 | Directorio veterinarias (listar/ver/agregar/calificar) | Adoptante | `/mi-adopcion/veterinarias*`, `Public\VeterinarianController` (usado en contexto adoptante) | Implementado |
| ADP-06 | Directorio albergues (listar/ver/calificar) | Adoptante | `/mi-adopcion/albergues*`, `Public\AlbergueController` | Implementado |
| ADP-07 | Seguimientos (listar/ver/reportar hito con datos/fotos) | Adoptante | `/mi-adopcion/seguimientos*`, `Adopter\FollowUpReportController`, `FollowUpService` | Implementado |
| ADP-08 | Postular a adopción de mascota | Adoptante | `POST /mascotas/{slug}/postular`, `Adopter\ApplicationController@store` | Implementado |

## 5. Panel de equipo/organización (`/{current_team}`)

| ID | Funcionalidad | Actor | Evidencia | Estado |
|---|---|---|---|---|
| TEAM-01 | Dashboard con métricas y recientes | Miembro equipo | `routes/web.php` closure dashboard, consultas `Pet/Adoption/Announcement/BlogPost/FollowUp` | Implementado |
| TEAM-02 | CRUD mascotas del equipo | Miembro equipo (según permisos) | `Teams\PetController`, rutas `mascotas*` | Implementado |
| TEAM-03 | Gestión adopciones (listar, ver, aprobar, rechazar) | Miembro equipo | `Dashboard\AdoptionController`, `AdoptionService` | Implementado |
| TEAM-04 | Gestión seguimientos (listar, ver, completar, marcar no realizado, programar) | Miembro equipo | `Dashboard\FollowUpController`, `FollowUpService` | Implementado |
| TEAM-05 | CRUD blog del equipo | Miembro equipo | `Dashboard\BlogPostController` | Implementado |
| TEAM-06 | CRUD eventos/anuncios del equipo | Miembro equipo | `Dashboard\EventController` | Implementado |
| TEAM-07 | Editar perfil de equipo | Miembro equipo | `Teams\TeamProfileController` | Implementado |
| TEAM-08 | Ver miembros del equipo | Miembro equipo | ruta `miembros` (closure Inertia) | Implementado |
| TEAM-09 | Gestionar veterinarias vinculadas al equipo | Miembro equipo | `Teams\VeterinarianController` | Implementado |

## 6. Administración global (`/admin`)

| ID | Funcionalidad | Actor | Evidencia | Estado |
|---|---|---|---|---|
| ADM-01 | Dashboard admin | Super admin | `Admin\DashboardController` | Implementado |
| ADM-02 | Perfil admin | Super admin | `Admin\ProfileController` | Implementado |
| ADM-03 | Consulta de roles | Super admin | `Admin\RoleManagementController` | Implementado |
| ADM-04 | Gestión de usuarios (CRUD, rol, membresías) | Super admin | `Admin\UserController` | Implementado |
| ADM-05 | Gestión global de mascotas | Super admin | `Admin\PetController` | Implementado |
| ADM-06 | Gestión de organizaciones/equipos | Super admin | `Admin\OrganizationController` | Implementado |
| ADM-07 | Gestión global de eventos | Super admin | `Admin\EventController` | Implementado |
| ADM-08 | Gestión global de blog | Super admin | `Admin\BlogPostController` | Implementado |
| ADM-09 | Consulta de adopciones | Super admin | `Admin\AdoptionController` (index/show) | Implementado (alcance por verificar) |
| ADM-10 | Gestión de seguimientos | Super admin | `Admin\FollowUpController` (CRUD) | Implementado |
| ADM-11 | Gestión/verificación de veterinarias | Super admin | `Admin\VeterinarianController` | Implementado |
| ADM-12 | Listado de albergues | Super admin | `Admin\AlbergueController` | Implementado |

## 7. APIs y utilidades integradas

| ID | Funcionalidad | Actor | Evidencia | Estado |
|---|---|---|---|---|
| API-01 | Chatbot por reglas (respuestas/botones) | Visitante/app | `POST /api/chatbot/ask`, `Public\ChatbotController`, `ChatbotService` | Implementado (lógica en memoria/reglas) |
| API-02 | Consulta DNI externa | Autenticado/contexto app | `POST /api/dni/lookup`, `Api\DniController`, `DniLookupService` | Implementado (depende de token externo) |

## 8. Capacidades transversales observadas

- PWA con manifest, offline fallback y caché de assets/fuentes/imágenes (`vite.config.ts`).
- Soporte Capacitor para empaquetado móvil (`capacitor/`, plugins cámara/notificaciones/splash/status bar).
- Soft deletes en entidades clave (`Pet`, `Team`, `Adoption`, `Announcement`, `BlogPost`, `LostPet`, `Veterinarian`).
- Slugs para rutas públicas/amigables en pets, teams, announcements, blog posts.
- Enums para estados/tipos (adopción, seguimiento, especie/tamaño/estado mascota, tipo anuncio, roles/permisos equipo).

## 9. Pendientes de verificación

- Reglas exactas de validación en Form Requests y autorización en Policies por acción.
- Campos y pantallas reales en cada página Vue (formularios, filtros, exportaciones, reportes).
- Uso efectivo de stored procedures, jobs/eventos/listeners/notificaciones/mail en flujos reales.
- Generación de PDF/actas (`acta_path` en adopciones, DomPDF instalado) y descargas/exportaciones.
- Cobertura de pruebas y funcionalidades incompletas o deshabilitadas.
