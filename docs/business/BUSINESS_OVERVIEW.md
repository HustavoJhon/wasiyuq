# Visión general del negocio — WASIYUQ

**Fecha:** 2026-11-16  
**Método:** ingeniería inversa sobre código, rutas, modelos, enums, seeders, README y configuración.  
**Aviso:** se distingue evidencia comprobada de inferencias; ningún dato no respaldado se presenta como hecho.

## 1. Identidad y propósito

### Hechos comprobados
- **Nombre:** Wasiyuq (README: "del quechua: 'el que tiene casa'").
- **Dominio de producto:** plataforma web para facilitar la **adopción responsable de mascotas** en **Cusco, Perú** (`README.md`, textos/locale `es_PE`, timezone `America/Lima` en `.env.example`).
- **Propuesta operativa:** conecta **entidades** (equipos/organizaciones como albergues/refugios) con **ciudadanos/adoptantes** para publicar mascotas, recibir postulaciones, gestionar adopciones y realizar seguimiento post-adopción (rutas, modelos `Pet`, `Adoption`, `FollowUp`, `Team`, `Announcement`, `BlogPost`).
- **Identidad de app:** nombre "Wasiyuq" (`.env.example`), appId Capacitor `pe.wasiyuq.app`, PWA "Wasiyuq — Adopción responsable en Cusco".

### Inferencias
- WASIYUQ funciona como un **marketplace/directorio social** de adopción y gestión para organizaciones de bienestar animal, con componentes comunitarios (eventos, blog, reporte de mascotas perdidas, directorio de veterinarias).
- La presencia de albergues, calificaciones y veterinarias sugiere un ecosistema local de apoyo a la tenencia responsable, no solo un catálogo de mascotas.

## 2. Problema que resuelve (inferido de funcionalidades)

- Visibilizar mascotas disponibles para adopción y centralizar información de contacto/proceso.
- Formalizar el flujo de postulación, evaluación y aprobación/rechazo de adopciones por organizaciones.
- Dar trazabilidad al bienestar posterior mediante **seguimientos programados** y reportes del adoptante.
- Permitir a organizaciones comunicar eventos/campañas y publicar contenido educativo (blog).
- Facilitar reporte y difusión de **mascotas perdidas**.
- Ofrecer directorios/comunidad (veterinarias, albergues) y canales de contacto/asistencia (formulario, chatbot, DNI).

## 3. Servicios y capacidades ofrecidas (comprobadas por implementación)

| Área | Capacidades observadas |
|---|---|
| Catálogo público | Listado y detalle de mascotas, eventos, blog, mascotas perdidas, sobre nosotros, contacto, sitemap |
| Adopción | Postulación autenticada a mascota, gestión de solicitudes por equipo/admin, cambio de estado (aprobar/rechazar/completar/cancelar según lógica de servicio) |
| Seguimiento | Seguimientos asociados a adopción, reporte por adoptante (notas/fotos/campos), gestión por equipo/admin |
| Gestión organizacional | Panel por equipo (slug) para mascotas, adopciones, seguimientos, blog, eventos, perfil, miembros, veterinarias vinculadas |
| Administración plataforma | Panel `/admin` para usuarios, roles, organizaciones, mascotas, eventos, blog, adopciones, seguimientos, veterinarias, albergues |
| Comunidad/soporte | Contacto, chatbot por reglas, búsqueda/gestión de veterinarias y calificaciones, calificación de albergues, consulta DNI, reporte de mascotas perdidas |

## 4. Usuarios y actores

### Actores identificados (evidencia)

| Actor | Descripción | Evidencia |
|---|---|---|
| Visitante público | Navega contenido público, ve mascotas/eventos/blog, puede contactar/reportar mascota perdida según rutas | `routes/public.php`, `Public/*` controllers |
| Adoptante / ciudadano registrado | Usuario autenticado que accede a `/mi-adopcion`, postula, gestiona sus mascotas publicadas/perdidas, consulta seguimientos, directorios | `routes/web.php` (grupo `adopter`), `Adopter/*` |
| Miembro de equipo (organización) | Usuario con membresía en `Team` no personal; accede a dashboard del equipo según permisos/rol | `EnsureTeamMembership`, `TeamRole`, `TeamPermission` |
| Administrador de equipo | Roles con mayores permisos dentro del equipo (Owner/Admin/gestores específicos) | `app/Enums/TeamRole.php` |
| Super administrador | `is_super_admin` (o email especial hardcodeado) con acceso a `/admin` y bypass en middleware de membresía | `IsSuperAdmin`, `EnsureTeamMembership`, rutas admin |
| Organización/Albergue (entidad) | Representada como `Team` con perfil público/operativo y recursos asociados | `Team`, relaciones pets/adoptions/blog/events/ratings |
| Veterinaria | Entidad de directorio con perfil, servicios, verificación y calificaciones | `Veterinarian`, rutas públicas/adopter/team/admin |

### Nota sobre roles declarados en README
README menciona `super_admin, municipality_admin, entity_admin, entity_member, adopter, veterinarian`. La implementación real observada usa **roles de equipo** (`TeamRole` enum: owner, admin, organization_manager, pet_manager, blog_editor, adoptions_coordinator, member, viewer) y flag `is_super_admin` en usuario; no se hallaron enums/clases con esos nombres exactos en `app/Enums/`. **Discrepancia a registrar como pendiente de conciliación documental-funcional.**

## 5. Tipos de clientes / segmentos (inferencia respaldada)

- **Organizaciones de rescate/albergues/ONGs/municipalidades** que gestionan mascotas y procesos de adopción.
- **Ciudadanos** interesados en adoptar o participar (eventos, educación, reportes).
- **Profesionales/establecimientos veterinarios** como soporte del ecosistema (directorio).
- **Administradores de la plataforma** que gobiernan usuarios, organizaciones y contenido global.

## 6. Necesidades que cubre

- Encontrar mascotas y organizaciones confiables.
- Gestionar inventario de mascotas y su estado (disponible, en proceso, adoptado, reservado).
- Evaluar postulantes y documentar decisiones.
- Asegurar seguimiento post-adopción.
- Difundir actividades y conocimiento.
- Atender reportes de extravío y consultas.

## 7. Propuesta de valor (sintetizada)

Centralizar en una sola plataforma el ciclo de **difusión → postulación → evaluación → adopción → seguimiento** para mascotas en Cusco, con herramientas para organizaciones y canales públicos/comunitarios.

## 8. Operaciones principales del negocio

1. Publicación y administración de mascotas por organizaciones.
2. Recepción y tramitación de postulaciones de adopción.
3. Aprobación/rechazo y actualización de estados de mascota/adopción.
4. Programación y cumplimiento de seguimientos.
5. Publicación de eventos y contenido de blog.
6. Gestión de directorios (veterinarias/albergues) y reputación (calificaciones).
7. Atención de contacto y reporte de mascotas perdidas.
8. Administración de usuarios, equipos y permisos.

## 9. Hechos, inferencias y pendientes

| Tipo | Ítem |
|---|---|
| Hecho | Plataforma Laravel + Inertia/Vue orientada a adopción de mascotas en Cusco; módulos y rutas anteriores existen en código. |
| Hecho | Multi-tenant lógico por `Team` (slug en URL) con roles/permisos propios y panel admin global. |
| Inferencia | Uso real en producción y volumen operativo; procesos offline complementarios no observables en repositorio. |
| Pendiente | Confirmar significado operativo de cada `TeamRole` en negocio (más allá de permisos), flujos exactos de verificación de organizaciones, y uso real de PDFs/SPs/chatbot en producción. |
| Pendiente | Conciliar taxonomía de roles del README con implementación real. |
