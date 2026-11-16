# Actores y usuarios

**Fecha:** 2026-11-16  
**Fuentes:** `routes/*.php`, `app/Enums/TeamRole.php`, `app/Http/Middleware/*`, `app/Models/User.php`, `app/Models/Team.php`, `README.md`, páginas frontend.

## 1. Actores del sistema

| Actor | Tipo | Descripción | Evidencia | Capacidades principales |
|---|---|---|---|---|
| Visitante | Externo no autenticado | Persona que navega el sitio público | `routes/public.php` | Ver home, mascotas, eventos, blog, mascotas perdidas, contacto, sitemap; reportar mascota perdida |
| Adoptante / ciudadano registrado | Usuario autenticado | Usuario que interactúa desde `/mi-adopcion` | grupo `adopter.*` en `routes/web.php` | Ver dashboard, postular a adopciones, ver postulaciones, publicar/gestionar mascotas propias, gestionar mascotas perdidas, consultar/calificar veterinarias y albergues, ver/reportar seguimientos |
| Miembro de organización (equipo) | Usuario con membresía en `Team` no personal | Opera recursos del equipo según rol/permisos | `EnsureTeamMembership`, `TeamRole` | Dashboard de equipo, gestión de mascotas/adopciones/seguimientos/contenido/perfil/miembros/veterinarias vinculadas |
| Administrador de plataforma | Super admin | Gobierna la plataforma globalmente | `IsSuperAdmin`, `routes/admin.php` | Gestionar usuarios, roles, organizaciones, mascotas, eventos, blog, adopciones, seguimientos, veterinarias, albergues |
| Organización / albergue | Entidad de negocio (Team) | Entidad que publica mascotas y gestiona adopciones | `Team`, relaciones y panel `/{team}` | Perfil público/operativo, catálogo de mascotas, procesos de adopción y seguimiento |
| Veterinaria | Entidad en directorio | Prestador/establecimiento listado y calificable | `Veterinarian`, rutas y UI | Ser consultada, calificada, vinculada a equipo, verificada por admin |

## 2. Roles de equipo (implementación)

| Rol | Valor | Intención declarada | Capacidades (resumen) |
|---|---|---|---|
| Propietario | `owner` | Control total | Todos los permisos |
| Administrador | `admin` | Administración completa | Gestión de equipo, miembros, invitaciones, módulos operativos y contenido, reportes/exportación |
| Gestor de Organización | `organization_manager` | Gestión operativa y adopciones | Equipo (update), miembros/invitaciones, mascotas, adopciones, seguimientos, reportes |
| Gestor de Mascotas | `pet_manager` | Gestión de mascotas | CRUD mascotas, vista adopciones |
| Editor de Blog | `blog_editor` | Gestión de contenido | Blog, eventos, anuncios |
| Coordinador de Adopciones | `adoptions_coordinator` | Adopciones y seguimientos | Vista mascotas, gestión adopciones/seguimientos, reportes |
| Miembro | `member` | Acceso básico | Vistas de mascotas, adopciones, blog, eventos |
| Visualizador | `viewer` | Solo lectura | Vistas de módulos principales |

## 3. Contextos de usuario

| Contexto | Descripción | Evidencia |
|---|---|---|
| Equipo personal | Equipo con `is_personal=true`; acceso al panel organizacional redirigido a `/mi-adopcion` | `EnsureTeamMembership` |
| Equipo organizacional | Equipo de trabajo/albergue con slug y miembros | `Team`, rutas `/{current_team}` |
| Equipo actual (`current_team_id`) | Equipo seleccionado/activo del usuario | `User.current_team_id`, `SetTeamUrlDefaults`/middleware |

## 4. Necesidades por actor (inferidas)

| Actor | Necesidades clave |
|---|---|
| Visitante | Descubrir mascotas y confiar en el proceso |
| Adoptante | Encontrar mascota compatible, postular, hacer seguimiento y recibir orientación |
| Organización | Publicar mascotas, evaluar postulantes, coordinar entrega y seguimiento, comunicar actividades |
| Admin plataforma | Moderar/gobernar usuarios y entidades, asegurar calidad y operación |
| Veterinaria/comunidad | Visibilidad y retroalimentación (ratings) |

## 5. Brechas y pendientes

- README declara roles `municipality_admin`, `entity_admin`, `entity_member`, `adopter`, `veterinarian` no presentes como enums equivalentes; **requiere conciliación** con stakeholders.
- "Veterinario" como usuario con rol de sistema no está evidenciado; sí existe entidad/directorio `Veterinarian`.
- Permisos efectivos por pantalla/acción deben confirmarse contra Policies/FormRequests.
