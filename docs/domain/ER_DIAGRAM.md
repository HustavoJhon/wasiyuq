# Diagrama entidad-relación (ER)

**Fecha:** 2026-11-16  
**Base:** `docs/technical/DATABASE_SCHEMA.md`, `app/Models/*`, migraciones y relaciones observadas en servicios/controladores.  
**Nota:** diagrama lógico **parcial/inferido** en algunos campos opcionales y tablas auxiliares; validar contra migraciones exactas para paridad 1:1.

## 1. ER lógico principal

```mermaid
erDiagram
  USERS ||--o{ TEAM_USER : "pertenece"
  TEAMS ||--o{ TEAM_USER : "tiene"
  TEAMS ||--o{ TEAM_INVITATIONS : "invita"
  USERS ||--o{ TEAM_INVITATIONS : "invita/recibe?"
  TEAMS ||--o{ PETS : "publica"
  USERS ||--o{ PETS : "puede registrar?"
  PETS ||--o{ ADOPTIONS : "recibe"
  USERS ||--o{ ADOPTIONS : "postula (adopter)"
  USERS ||--o{ ADOPTIONS : "revisa (reviewer)"
  TEAMS ||--o{ ADOPTIONS : "gestiona"
  ADOPTIONS ||--o{ FOLLOW_UPS : "genera"
  USERS ||--o{ FOLLOW_UPS : "crea (created_by)"
  TEAMS ||--o{ ANNOUNCEMENTS : "publica"
  USERS ||--o{ ANNOUNCEMENTS : "autor"
  TEAMS ||--o{ BLOG_POSTS : "publica"
  USERS ||--o{ BLOG_POSTS : "autor"
  USERS ||--o{ LOST_PETS : "reporta"
  TEAMS ||--o{ VETERINARIANS : "asocia?"
  VETERINARIANS ||--o{ RATINGS : "recibe?"
  TEAMS ||--o{ RATINGS : "recibe? (albergue)"
  USERS ||--o{ RATINGS : "emite"
  USERS ||--o{ CONTACT_REQUESTS : "envía?"

  USERS {
    bigint id PK
    string name
    string email UK
    string password
    bool is_super_admin
    string google_id
    datetime email_verified_at
    timestamps
  }
  TEAMS {
    bigint id PK
    string name
    string slug UK
    bool is_personal
    string logo
    text bio
    string phone
    string website
    string city
    string state
    softDeletes
    timestamps
  }
  TEAM_USER {
    bigint team_id FK
    bigint user_id FK
    string role
    timestamps
  }
  TEAM_INVITATIONS {
    bigint id PK
    bigint team_id FK
    bigint inviter_id FK
    string email
    string role
    string code/token
    timestamps
  }
  PETS {
    bigint id PK
    bigint team_id FK
    string name
    string slug
    string species
    string breed
    int age_years
    int age_months
    string gender
    string size
    string color
    text description
    text medical_notes
    string status
    json photos
    softDeletes
    timestamps
  }
  ADOPTIONS {
    bigint id PK
    bigint pet_id FK
    bigint user_id FK
    bigint team_id FK
    bigint reviewed_by FK
    string status
    text motivation
    bool experience_with_pets
    bool has_yard
    string housing_type
    string family_composition
    text why_this_pet
    bool has_children
    string other_pets
    string housing_ownership
    int hours_alone
    text veterinary_plan
    bool agreement
    text notes
    string acta_path
    datetime reviewed_at
    softDeletes
    timestamps
  }
  FOLLOW_UPS {
    bigint id PK
    bigint adoption_id FK
    bigint created_by FK
    date scheduled_date
    datetime completed_date
    string status
    text notes
    json photos
    timestamps
  }
  ANNOUNCEMENTS {
    bigint id PK
    bigint team_id FK
    bigint user_id FK
    string title
    string slug
    text description
    datetime event_date
    string location
    string type
    string cover_image
    bool is_published
    datetime published_at
    softDeletes
    timestamps
  }
  BLOG_POSTS {
    bigint id PK
    bigint team_id FK
    bigint user_id FK
    string title
    string slug
    text excerpt
    longtext content
    string cover_image
    string category
    json tags
    bool is_published
    datetime published_at
    softDeletes
    timestamps
  }
  LOST_PETS {
    bigint id PK
    bigint user_id FK
    string status
    string location
    json photos
    text description
    softDeletes
    timestamps
  }
  VETERINARIANS {
    bigint id PK
    bigint team_id FK
    string name
    string address
    string phone
    bool is_verified
    softDeletes
    timestamps
  }
  CONTACT_REQUESTS {
    bigint id PK
    string name
    string email
    string subject
    text message
    timestamps
  }
```

## 2. Notas de fidelidad

| Tema | Observación | Estado |
|---|---|---|
| Columnas exactas/tipos/índices/FKs | Resumidos; fuente de verdad en migraciones (`database/migrations/**`) y `docs/technical/DATABASE_SCHEMA.md` | Parcial |
| `RATINGS` / tablas de calificación | Relaciones inferidas de rutas/controladores (`calificar` veterinarias/albergues); estructura exacta **pendiente de confirmación** | Inferido |
| `TEAM_USER` pivot | Nombre real de tabla pivot (`team_user`/`memberships`) a confirmar en migración/modelo | Pendiente |
| Campos extendidos de seguimiento | Requests aceptan `weight_kg`, `vaccines`, `behavior`, `health_status`, `drive_link`; persistencia real no confirmada en servicio/modelo | Brecha verificada |
| SPs vs esquema | Algunos SPs seleccionan subconjuntos de columnas; posible desfase con migraciones recientes | Inferido/Parcial |