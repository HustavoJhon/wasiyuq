# Catálogo de entidades

**Fecha:** 2026-11-16  
**Fuentes:** `app/Models/*.php`, `database/migrations/*.php` (Laravel legacy, retiradas en Fase 1; historial git previo a `f02d015`), `app/Enums/*.php`.

## 1. Entidades principales

### User (`users`, `app/Models/User.php`)
- **Propósito:** cuenta de usuario, autenticación y pertenencia a equipos.
- **Atributos clave:** `name`, `email` (unique), `dni` (unique nullable), `whatsapp`, `password`, `is_super_admin`, `current_team_id`, `social_id`, `social_provider`, `avatar`, `email_verified_at`, 2FA (`two_factor_secret`, `two_factor_recovery_codes`, `two_factor_confirmed_at`).
- **Relaciones:** equipos vía `HasTeams`/`team_members` (membresías), `currentTeam` implícito por `current_team_id`, adopciones como adoptante, autoría de contenido, passkeys, etc. (algunas relaciones definidas en traits/modelos relacionados).
- **Notas:** implementa passkeys (`PasskeyAuthenticatable`), 2FA (`TwoFactorAuthenticatable`).

### Team (`teams`, `app/Models/Team.php`)
- **Propósito:** organización/albergue o equipo personal.
- **Atributos clave:** `name`, `slug` (unique, route key), `is_personal`, perfil (`bio`, `logo`, `website`, `phone`, `address`, `city`, `state`, `social_links` json, `map_embed`, `gallery` json, `support_info` json), soft deletes.
- **Relaciones:** `members()` (BelongsToMany User vía `Membership`), `memberships`, `invitations`, `pets`, `announcements`, `blogPosts`, `adoptions`, `ratings`.
- **Reglas:** slug autogenerado/actualizado al crear/cambiar nombre.

### Membership (`team_members`, `app/Models/Membership.php`)
- **Propósito:** pivote usuario-equipo con rol.
- **Atributos:** `team_id`, `user_id`, `role` (cast `TeamRole`).
- **Restricción:** unique (`team_id`,`user_id`).

### TeamInvitation (`team_invitations`)
- **Propósito:** invitación a unirse a equipo.
- **Atributos:** `code` (unique), `team_id`, `email`, `role`, `invited_by`, `expires_at`, `accepted_at`.

### Pet (`pets`, `app/Models/Pet.php`)
- **Propósito:** mascota en gestión/adopción.
- **Atributos:** `team_id`, `name`, `slug` (route key), `species` (enum), `breed`, `age_years/months`, `gender`, `size` (enum), `color`, `description`, `medical_notes`, `status` (enum), `photos` (json), soft deletes.
- **Relaciones:** `team`, `adoptions`.

### Adoption (`adoptions`, `app/Models/Adoption.php`)
- **Propósito:** solicitud/proceso de adopción.
- **Atributos:** `pet_id`, `user_id`, `team_id`, `status` (enum), `motivation`, screening (`why_this_pet`, `has_yard`, `has_children`, `other_pets`, `housing_type`, `housing_ownership`, `hours_alone`, `experience_with_pets`, `family_composition`, `veterinary_plan`, `agreement`), `notes`, `reviewed_by`, `reviewed_at`, `acta_path`, soft deletes.
- **Relaciones:** `pet`, `adopter` (User), `team`, `reviewer` (User), `followUps`.

### FollowUp (`follow_ups`, `app/Models/FollowUp.php`)
- **Propósito:** seguimiento post-adopción.
- **Atributos:** `adoption_id`, `scheduled_date`, `completed_date`, `status` (enum), `notes`, `photos` (json), `created_by`, `drive_link`, `weight_kg`, `vaccines` (json), `behavior`, `health_status`.
- **Relaciones:** `adoption`, `createdBy`.

### Announcement (`announcements`, `app/Models/Announcement.php`)
- **Propósito:** evento/anuncio/campaña.
- **Atributos:** `team_id`, `user_id`, `title`, `slug`, `description`, `event_date`, `location`, `type` (enum), `cover_image`, `is_published`, `published_at`, soft deletes.
- **Relaciones:** `team`, `author`.

### BlogPost (`blog_posts`, `app/Models/BlogPost.php`)
- **Propósito:** contenido editorial/blog.
- **Atributos:** `team_id`, `user_id`, `title`, `slug`, `excerpt`, `content`, `cover_image`, `category`, `tags` (json), `is_published`, `published_at`, soft deletes.
- **Relaciones:** `team`, `author`.

### LostPet (`lost_pets`, `app/Models/LostPet.php`)
- **Propósito:** reporte de mascota perdida/encontrada.
- **Atributos:** `name`, `species`, `breed`, `color`, `size`, `age_description`, `description`, `last_seen_location`, `last_seen_date`, `contact_phone`, `contact_email`, `photos`, `status`, `user_id`, `team_id`, `is_resolved`, soft deletes.

### ContactRequest (`contact_requests`, `app/Models/ContactRequest.php`)
- **Propósito:** mensaje de contacto.
- **Atributos:** `name`, `email`, `subject`, `message`, `pet_id`, `read_at`.

### Veterinarian (`veterinarians`, `app/Models/Veterinarian.php`)
- **Propósito:** directorio de veterinarias.
- **Atributos:** `name`, `address`, `city`, contacto (`phone`, `whatsapp`, `email`), `website`, geolocalización, `description`, `services`/`photos` (json), `is_verified`, `team_id`, `user_id`, soft deletes.
- **Relaciones:** `ratings`, `team`, `user`.

### VeterinarianRating (`veterinarian_ratings`)
- **Atributos:** `veterinarian_id`, `user_id`, `rating`, `comment`; unique por par.

### TeamRating (`team_ratings`)
- **Atributos:** `team_id`, `user_id`, `rating`, `comment`; unique por par.

### Passkey (`passkeys`)
- **Propósito:** credenciales WebAuthn/passkeys vinculadas a usuario.

## 2. Enumeraciones de dominio

| Enum | Valores | Uso |
|---|---|---|
| `PetStatus` | `available`, `adopted`, `in_process`, `withheld` | Estado de mascota |
| `PetSpecies` | `dog`, `cat`, `rabbit`, `bird`, `other` | Especie |
| `PetSize` | `small`, `medium`, `large` | Tamaño |
| `AdoptionStatus` | `pending`, `approved`, `rejected`, `completed`, `cancelled` | Estado de adopción |
| `FollowUpStatus` | `pending`, `completed`, `missed` | Estado de seguimiento |
| `AnnouncementType` | `adoption_fair`, `fundraiser`, `workshop`, `campaign`, `other` | Tipo de evento/anuncio |
| `TeamRole` | `owner`, `admin`, `organization_manager`, `pet_manager`, `blog_editor`, `adoptions_coordinator`, `member`, `viewer` | Rol en equipo |
| `TeamPermission` | (catálogo granular) | Permisos por módulo/acción |

## 3. Entidades/artefactos de soporte

- **Infra Laravel:** `sessions`, `cache*`, `jobs*`, `failed_jobs`, `password_reset_tokens`.
- **Stored procedures:** entidades de consulta/reporting en capa BD (ver `technical/DATABASE_SCHEMA.md`).
- **Documentos generados:** actas/certificados de adopción (PDF templates/jobs, `acta_path`). 

## 4. Notas

- Soft deletes presentes en `Team`, `Pet`, `Adoption`, `Announcement`, `BlogPost`, `LostPet`, `Veterinarian`.
- Varios campos JSON (`photos`, `tags`, `social_links`, `gallery`, `support_info`, `services`, `vaccines`) requieren esquema/validación explícita en reconstrucción.
