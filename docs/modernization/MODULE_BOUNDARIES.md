# Límites de módulos (Module Boundaries)

**Fecha:** 2026-11-16  
**Objetivo:** definir límites objetivo para la reconstrucción modular y mapearlos al código legacy actual, como base de contratos y trazabilidad.

## 1. Principios de modularidad

- **Modular monolith primero:** despliegue único, límites internos claros, extracción a servicios solo si hay justificación operativa.
- **Propiedad de datos:** cada módulo es dueño de sus tablas/entidades y reglas; otros módulos consumen vía contratos (API interna/servicios de aplicación), no acceso directo cruzado indiscriminado.
- **Contratos compartidos:** DTOs/esquemas (Zod) en paquete común, sin filtrar detalles de persistencia.
- **Eventos de dominio:** para side-effects entre módulos (p.ej. adopción→notificaciones/documentos/seguimientos).

## 2. Módulos objetivo y responsabilidades

| Módulo (bounded context) | Responsabilidad | Entidades núcleo | Interfaces expuestas | Dependencias permitidas |
|---|---|---|---|---|
| **identity-access** | Usuarios, auth, sesiones, OAuth, 2FA/passkeys (según alcance), perfil básico | User, credenciales/factores | Auth API, contexto de usuario | Ningún dominio de negocio; provee identidad a todos |
| **organizations** (teams) | Equipos/orgs, membresías, roles/permisos, invitaciones, perfil de equipo | Team, TeamMember, TeamInvitation, Role/Permission | API de equipos/membresía, guardas de autorización | identity-access |
| **pets** | Catálogo y gestión de mascotas, estados, media | Pet, fotos | API mascotas, eventos de cambio de estado | organizations, storage/media |
| **adoptions** | Postulación, screening, revisión, decisiones, acta/certificado | Adoption | API adopciones, eventos (`submitted/approved/rejected/completed/cancelled`) | identity-access, organizations, pets, documents, notifications |
| **followups** | Plan y ejecución de seguimientos, reportes, vencimientos | FollowUp | API seguimientos, tareas programadas | adoptions, identity-access, storage/media |
| **content** | Blog, eventos/anuncios, páginas informativas públicas | BlogPost, Announcement | API/CMS de contenido, feed público | organizations, identity-access |
| **community** | Mascotas perdidas, interacción comunitaria asociada | LostPet | API reportes/listados | identity-access, storage/media |
| **directory** | Veterinarias, albergues, calificaciones/verificación | Veterinarian, Rating | API directorio y calificaciones | organizations, identity-access |
| **support** | Contacto, chatbot, FAQs operativas | ContactRequest, reglas chatbot | API contacto/chat | notifications (opcional), contenido configurable |
| **integrations** | Adaptadores externos (DNI, OAuth provider-specific, analítica) | N/A (stateless/adapters) | Servicios internos tipados | config/secrets |
| **documents** | Generación/almacenaje de PDFs y plantillas | Documentos (acta/certificado) | Servicio de generación y storage | storage, adoptions/pets (datos) |
| **notifications** | Email/in-app/push (futuro) | Plantillas/envíos | API de envío, consumidores de eventos | identity-access, providers |
| **platform-admin** | Operaciones globales y supervisión | Vistas agregadas | Endpoints/admin UI | lectura orquestada de módulos (con cuidado) |

## 3. Mapa legacy → módulo objetivo

| Área legacy (evidencia) | Módulo objetivo | Notas |
|---|---|---|
| `app/Http/Middleware/*Admin*`, `EnsureTeamMembership`, Fortify/Socialite, `Settings/*`, `User` | identity-access, organizations | Separar identidad de tenancy/RBAC |
| `Teams/*`, `Team*`, roles/permisos enums, invitaciones | organizations | Centralizar enforcement de permisos (hoy parcial) |
| `Pet*`, `Public\PetController`, `Teams\PetController`, `Adopter\PetController` | pets | Unificar flujos de media/estados |
| `Adoption*`, `AdoptionService`, eventos/listeners adopción, PDFs acta/cert | adoptions + documents + notifications | Hoy acoplado vía eventos; mantener pero con contratos claros |
| `FollowUp*`, `FollowUpService`, `CreateFollowUpPlan`, `CheckOverdueMilestonesJob` | followups | Scheduler como worker del módulo |
| `Blog*`, `Event/Announcement*` | content | |
| `LostPet*` | community | |
| `Veterinarian*`, `Albergue*`, ratings | directory | Validar modelo de calificaciones |
| `Contact*`, `Chatbot*`, `Dni*` | support / integrations | DNI y chatbot como adaptadores/capacidades separadas |
| `Admin\*` | platform-admin | Evitar bypass de reglas de dominio |

## 4. Contratos y eventos recomendados

| Evento/contrato | Productor | Consumidores | Estado legacy |
|---|---|---|---|
| `AdoptionSubmitted` | adoptions | notifications, (analytics) | Existe (`AdoptionApplicationSubmitted`) |
| `AdoptionApproved` | adoptions | notifications, documents | Existe |
| `AdoptionCompleted` | adoptions | followups, documents (certificado, definir) | Existe (disparo operativo a confirmar) |
| `AdoptionRejected/Cancelled` | adoptions | notifications (opcional) | No implementado como evento |
| `FollowUpOverdue` | followups | notifications | No implementado (solo cambio de estado) |

## 5. Reglas de dependencia (target)

- `identity-access` y `organizations` no dependen de módulos de negocio.
- `adoptions` no accede a tablas de `followups` directamente salvo vía evento/proceso definido; `followups` consume `Adoption` por referencia/contrato.
- `platform-admin` usa casos de uso/lecturas de módulos, no lógica duplicada.
- Adaptadores externos aislados en `integrations`; módulos de dominio consumen interfaces.

## 6. Brechas de frontera en legacy

- Lógica de negocio en closures de rutas (dashboard) y mezcla en controladores.
- Autorización distribuida (middleware, checks ad-hoc, policy parcial) vs catálogo de permisos.
- Side-effects implícitos (PDFs, almacenamiento) acoplados a listeners concretos; semántica de documentos duplicada.