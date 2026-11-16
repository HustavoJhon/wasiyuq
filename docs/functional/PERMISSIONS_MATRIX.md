# Matriz de roles y permisos

**Fecha:** 2026-11-16  
**Fuentes:** `app/Enums/TeamRole.php`, `app/Enums/TeamPermission.php`, `app/Http/Middleware/IsSuperAdmin.php`, `app/Http/Middleware/EnsureTeamMembership.php`, `bootstrap/app.php`, `routes/admin.php`, `routes/web.php`, `app/Models/Team.php`, `app/Models/Membership.php`, `README.md`.

## 1. Actores y niveles de autorización

| Nivel | Mecanismo | Evidencia | Alcance |
|---|---|---|---|
| Super administrador de plataforma | `users.is_super_admin = true` **o** email `hustavojhon@gmail.com` (hardcode) | `IsSuperAdmin`, `EnsureTeamMembership` | Acceso `/admin/*`; bypass de verificación de membresía de equipo |
| Miembro de equipo (organización) | Registro en `team_members` con `role` (`TeamRole`) para `teams.is_personal = false` | `EnsureTeamMembership`, `Membership`, `TeamRole` | Acceso a rutas `/{current_team}/*` según membresía y, cuando aplique, rol mínimo |
| Usuario autenticado (adoptante/personal) | Sesión autenticada; equipos personales | `routes/web.php` (`/mi-adopcion`), `Team.is_personal` | Área adoptante y acciones autenticadas públicas |
| Visitante | Sin autenticación | `routes/public.php` | Contenido público, contacto, reporte de mascota perdida, chatbot (según implementación) |

## 2. Roles de equipo (`TeamRole`) y permisos (`TeamPermission`)

> Fuente canónica: `app/Enums/TeamRole.php::permissions()`.

| Rol (valor) | Etiqueta | Descripción | Permisos |
|---|---|---|---|
| `owner` | Propietario | Control total sobre la organización | **Todos** (`TeamPermission::cases()`) |
| `admin` | Administrador | Administración completa | `team:update,delete`, miembros e invitaciones, mascotas CRUD, adopciones (view/update-status/generate-docs), seguimientos CRUD, blog/eventos/anuncios CRUD, `reports:view`, `data:export` |
| `organization_manager` | Gestor de Organización | Gestiona organización, mascotas y adopciones | `team:update`, miembros e invitaciones, mascotas CRUD, adopciones (view/update-status/generate-docs), seguimientos CRUD, `reports:view` |
| `pet_manager` | Gestor de Mascotas | Gestiona registro y datos de mascotas | `pets:view/create/update/delete`, `adoptions:view` |
| `blog_editor` | Editor de Blog | Crea y edita contenido | `blog:view/create/update/delete`, `events:*`, `announcements:*` |
| `adoptions_coordinator` | Coordinador de Adopciones | Coordina adopción y seguimientos | `pets:view`, `adoptions:view/update-status/generate-docs`, `follow-ups:*`, `reports:view` |
| `member` | Miembro | Acceso básico limitado | `pets:view`, `adoptions:view`, `blog:view`, `events:view` |
| `viewer` | Visualizador | Solo lectura | `pets,adoptions,blog,events,announcements,follow-ups:view` |

## 3. Catálogo de permisos (`TeamPermission`)

| Módulo | Permisos |
|---|---|
| Equipo | `team:update`, `team:delete` |
| Miembros | `member:add`, `member:update`, `member:remove` |
| Invitaciones | `invitation:create`, `invitation:cancel` |
| Mascotas | `pets:view`, `pets:create`, `pets:update`, `pets:delete` |
| Adopciones | `adoptions:view`, `adoptions:update-status`, `adoptions:generate-docs` |
| Seguimientos | `follow-ups:view`, `follow-ups:create`, `follow-ups:update` |
| Blog | `blog:view`, `blog:create`, `blog:update`, `blog:delete` |
| Eventos | `events:view`, `events:create`, `events:update`, `events:delete` |
| Anuncios | `announcements:view`, `announcements:create`, `announcements:update`, `announcements:delete` |
| Reportes/Datos | `reports:view`, `data:export` |

## 4. Mapa ruta → control de acceso (resumen)

| Superficie | Middleware/guardia | Notas |
|---|---|---|
| `routes/admin.php` (`/admin`) | `auth`, `verified`, `admin` (alias `IsSuperAdmin`) | Administración global; rutas registradas con grupo protegido en `bootstrap/app.php` y en archivo de rutas |
| `/{current_team}/...` dashboard y gestión | `auth`, `verified`, `EnsureTeamMembership` | Valida pertenencia; redirige equipos personales a `/mi-adopcion`; `EnsureTeamMembership` acepta parámetro `minimumRole` (uso por ruta específica **a verificar**) |
| `/mi-adopcion/...` | `auth`, `verified` | Área de usuario adoptante; sin restricción de rol de equipo organizacional |
| `POST /mascotas/{slug}/postular` | `auth`, `verified` | Postulación |
| `settings/teams/{team}...` | `auth`, `verified` + `EnsureTeamMembership` (subconjunto) | Gestión de equipo desde settings |
| Rutas públicas | ninguna (salvo throttling implícito no documentado) | Lectura pública y formularios específicos |

## 5. Discrepancias y hallazgos

| Hallazgo | Detalle | Impacto |
|---|---|---|
| Roles README vs implementación | README lista `municipality_admin, entity_admin, entity_member, adopter, veterinarian`; código implementa `TeamRole` + `is_super_admin` | Confusión documental; migración debe definir modelo objetivo explícito |
| Email privilegiado hardcodeado | `hustavojhon@gmail.com` tratado como super admin en middlewares | Riesgo de seguridad/mantenibilidad; acopla identidad personal al control de acceso |
| Permisos definidos vs enforcement fino | `TeamPermission`/`TeamRole` existen; grado de verificación por permiso en cada acción/controlador **pendiente de confirmar** (Policies/Requests/gates) | Posible brecha entre modelo de permisos y aplicación efectiva |
| Equipos personales | Redirigidos fuera del panel organizacional; funcionan como contexto del adoptante | Debe modelarse explícitamente en nuevo sistema |

## 6. Recomendación para reconstrucción

- Separar claramente: **identidad de plataforma** (admin global), **membresía organizacional** (RBAC por permisos), y **perfil adoptante**.
- Eliminar hardcodes de privilegio; auditar todas las acciones con checks de autorización centralizados.
- Mantener matriz permiso→acción trazable a casos de uso (ver `USE_CASES.md` / backlog de verificación).
