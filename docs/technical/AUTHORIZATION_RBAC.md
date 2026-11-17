# Autorización y RBAC — WASIYUQ 2.0 (Fase 3)

**Fecha:** 2026-11-17  
**Decisión:** ADR-011. **Fuente de verdad del código:** `modules/organizations/src/domain/roles.ts` (mapa rol→permisos) y `domain/policy.ts` (reglas). Vocabulario compartido: `packages/validation/src/organizations.ts`.

## 1. Dos niveles independientes

| Nivel | Mecanismo | Alcance |
|---|---|---|
| **Plataforma** | `users.platform_role` ∈ {`user`, `platform_admin`} | Endpoints `/api/v1/admin/*` (listar usuarios, suspender/reactivar). |
| **Organización** | `organization_memberships.role` (8 roles) → 31 permisos | Toda acción sobre recursos de una organización. |

- **Sin bypass por email** (el legacy trataba `hustavojhon@gmail.com` como super admin). El rol de plataforma se concede con la CLI `bun run --filter @wasiyuq/api admin:grant -- <email> [--revoke]`.
- **Los administradores de plataforma no heredan permisos en organizaciones** (el legacy les permitía entrar a cualquier panel de equipo). Consecuencia: un administrador que necesite operar en una organización debe ser miembro de ella. Requiere validación con negocio.

## 2. Roles y permisos (idénticos al legacy `TeamRole`/`TeamPermission`)

Nivel = legacy `TeamRole::level()`; se usa para impedir escaladas.

| Permiso | owner (10) | admin (9) | organization_manager (8) | adoptions_coordinator (6) | pet_manager (5) | blog_editor (4) | member (2) | viewer (1) |
|---|---|---|---|---|---|---|---|---|
| `team:update` | ✓ | ✓ | ✓ | | | | | |
| `team:delete` | ✓ | ✓ | | | | | | |
| `member:add/update/remove` | ✓ | ✓ | ✓ | | | | | |
| `invitation:create/cancel` | ✓ | ✓ | ✓ | | | | | |
| `pets:view` | ✓ | ✓ | ✓ | ✓ | ✓ | | ✓ | ✓ |
| `pets:create/update/delete` | ✓ | ✓ | ✓ | | ✓ | | | |
| `adoptions:view` | ✓ | ✓ | ✓ | ✓ | ✓ | | ✓ | ✓ |
| `adoptions:update-status`, `adoptions:generate-docs` | ✓ | ✓ | ✓ | ✓ | | | | |
| `follow-ups:view` | ✓ | ✓ | ✓ | ✓ | | | | ✓ |
| `follow-ups:create/update` | ✓ | ✓ | ✓ | ✓ | | | | |
| `blog:view`, `events:view` | ✓ | ✓ | | | | ✓ | ✓ | ✓ |
| `blog:*`, `events:*` (crear/editar/borrar) | ✓ | ✓ | | | | ✓ | | |
| `announcements:view` | ✓ | ✓ | | | | ✓ | | ✓ |
| `announcements:*` (crear/editar/borrar) | ✓ | ✓ | | | | ✓ | | |
| `reports:view` | ✓ | ✓ | ✓ | ✓ | | | | |
| `data:export` | ✓ | ✓ | | | | | | |

Un test (`modules/organizations/src/__tests__/domain.test.ts`) compara el mapa con la transcripción literal del enum legacy (historial git `8b77756^`).

## 3. Cómo se aplica (servidor)

1. `requireAuth` resuelve la sesión desde la cookie (BD en cada petición; usuario suspendido → sin sesión).
2. `requireVerifiedEmail` en `/organizations*` e `/invitations*` (equivale al middleware `verified` legacy).
3. Cada caso de uso de `OrganizationService` vuelve a leer la membresía del usuario **en la organización del recurso** y aplica `requirePermission` (deny by default).
4. **No miembros reciben 404**, no 403, para no revelar la existencia de organizaciones.
5. `OrganizationService.authorize(userId, orgId, permission)` es la guardia reutilizable para los módulos futuros (pets, adoptions…).
6. La UI solo oculta acciones; nunca es la barrera de seguridad (los tests de API ejercen las acciones prohibidas directamente).

## 4. Reglas adicionales (endurecimientos documentados respecto al legacy)

| Regla | Legacy | 2.0 |
|---|---|---|
| Asignar/invitar con rol superior al propio | Permitido | **Prohibido** (`role_escalation`) |
| Invitar como `owner` | Permitido (`Rule::enum(TeamRole)`) | **Prohibido** (y `CHECK` en BD) |
| Modificar/quitar al propietario | Quitar: prohibido; degradar: permitido | **Ambos prohibidos** |
| Gestionar a un miembro de nivel superior | Permitido | **Prohibido** |
| Modificar la propia membresía | Permitido | **Prohibido** (evita auto-degradación accidental/auto-escalada) |
| Ver invitaciones pendientes (emails) | Cualquier miembro | Requiere `invitation:create` o `invitation:cancel` |
| Invitación cuyo emisor perdió el permiso antes de aceptarse | Seguía siendo válida | **Se re-valida al aceptar**; si el emisor ya no puede conceder el rol, se cancela |
| Organizaciones personales | Redirigidas fuera del panel | No admiten invitaciones, gestión de miembros ni eliminación |

## 5. Pendientes

- Transferencia de propiedad y "abandonar organización" no existían en el legacy y no se implementaron (decisión de negocio).
- Panel de plataforma completo (organizaciones, contenido global) queda para `platform-admin` en fases posteriores.
- Auditoría persistente de cambios de rol/estado (hoy: logs estructurados).
