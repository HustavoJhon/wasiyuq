# Wasiyuq — Adopción responsable en Cusco

**Wasiyuq** (del quechua: "el que tiene casa") es una plataforma web que conecta entidades (municipalidades, albergues, ONGs) con ciudadanos para facilitar la adopción responsable de mascotas en Cusco, Perú.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Backend | Laravel 13 (PHP 8.3) |
| Frontend | **Vue 3** + Composition API + `<script setup lang="ts">` |
| Bridge | Inertia.js v3 |
| Lenguaje | TypeScript 5 (strict mode) |
| Estilos | Tailwind CSS 4 |
| Componentes UI | shadcn-vue (reka-ui + CVA) |
| Base de datos | SQL Server 2019+ |
| Caché / Queue | Redis 7 |
| Storage local | MinIO (S3-compatible) |
| PWA | Vite PWA Plugin (Workbox) |
| App nativa | Capacitor 6 (Android) |
| Contenedores | Docker + Docker Compose |
| Auth | Laravel Fortify + 2FA TOTP |
| Testing | Pest (PHP), vue-tsc (TS) |

**Sí, el frontend es Vue 3.** Inertia.js actúa como puente entre Laravel y Vue: los datos se renderizan desde el servidor pero la experiencia es de SPA. No hay API REST separada — es un monolito full-stack.

---

## Requisitos

- Docker + Docker Compose
- PHP 8.3+ (solo para comandos locales)
- Composer (solo para instalar dependencias iniciales)

---

## Setup y Ejecución

```bash
# 1. Clonar el repo
git clone <url> wasiyuq
cd wasiyuq

# 2. Copiar variables de entorno
cp .env.example .env

# 3. Iniciar contenedores
make up

# 4. Instalar dependencias PHP dentro del contenedor
make shell
composer install
exit

# 5. Setup completo (crea BD, migra, carga SP y enlaza storage)
make setup

# 6. (Opcional) Compilar assets frontend
make build

# 7. (Opcional) Iniciar dev server de Vite con HMR
make dev
```

La aplicación estará disponible en `http://localhost:8080`.

---

## Comandos (Makefile)

| Comando | Descripción |
|---------|-------------|
| Comando | Descripción |
|---------|-------------|
| `make up` | Inicia todos los servicios Docker |
| `make down` | Detiene los servicios |
| `make shell` | Accede al contenedor `app` (bash) |
| `make link` | Crea enlace simbólico storage/public |
| `make migrate` | Ejecuta migraciones + seeders |
| `make sp` | Ejecuta migraciones de Stored Procedures |
| `make test` | Corre los tests (Pest) |
| `make build` | Compila assets para producción |
| `make dev` | Inicia Vite HMR para desarrollo frontend |
| `make pint` | Corre Laravel Pint (CS Fixer) |
| `make queue` | Inicia el worker de colas |

---

## Servicios Docker

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| nginx | 8080 | Servidor web |
| sqlserver | 1433 | Base de datos |
| redis | 6379 | Caché + Queue |
| minio | 9000 / 9001 | Storage S3 (API + Console) |
| mailpit | 8025 / 1025 | Web UI / SMTP para emails en dev |

---

## Estructura del Proyecto

```
app/
├── Http/Controllers/{Public,Auth,Dashboard,Adopter,Admin}/
├── Http/Requests/                          # Form Requests (validación)
├── Http/Middleware/
├── Models/
├── Services/                               # Lógica de negocio
├── Repositories/                           # Acceso a datos (SPs + Eloquent)
├── Policies/                               # Autorización
├── Jobs/                                   # Colas asíncronas
├── Events/ + Listeners/
└── Notifications/

resources/
├── js/
│   ├── pages/{Public,Auth,Dashboard,Adopter,Admin}/
│   ├── components/{ui,pets,adoptions,follow-up,announcements,blog,organizations,shared}/
│   ├── layouts/{PublicLayout,DashboardLayout}.vue
│   ├── composables/
│   ├── stores/                              # Pinia
│   └── types/                               # TypeScript interfaces
├── css/app.css                              # Tailwind CSS 4 + design tokens
└── views/{app.blade.php,emails/}

database/
├── stored-procedures/{pets,adoptions,announcements,blog,reports}/
└── migrations/stored_procedures/

docker/
├── php/Dockerfile                           # PHP 8.3 + pdo_sqlsrv + extensiones
├── nginx/default.conf
└── minio/init.sh

capacitor/
└── capacitor.config.ts                      # pe.wasiyuq.app
```

---

## Páginas Públicas (SEO)

| Ruta | Descripción |
|------|-------------|
| `/` | Home con hero, contadores, mascotas destacadas |
| `/mascotas` | Listado con filtros + búsqueda |
| `/mascotas/{slug}` | Perfil individual de mascota |
| `/eventos` | Calendario de campañas y eventos |
| `/eventos/{slug}` | Detalle de evento |
| `/blog` | Artículos de bienestar animal |
| `/blog/{slug}` | Artículo completo |
| `/contacto` | Formulario + Login/Register integrado |

Todas las páginas públicas tienen SSR, meta tags SEO dinámicos y Schema.org JSON-LD.

---

## Roles de Usuario

| Rol | Descripción |
|-----|-------------|
| `super_admin` | Administra la plataforma, verifica entidades |
| `municipality_admin` | Gestiona mascotas y campañas de su municipalidad |
| `entity_admin` | Gestiona mascotas de su albergue/ONG |
| `entity_member` | Miembro de entidad con permisos limitados |
| `adopter` | Ciudadano que postula a adopciones |
| `veterinarian` | Profesional que valida registros médicos |

---

## Licencia

MIT
