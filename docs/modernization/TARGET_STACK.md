# Stack tecnológico objetivo (propuesta)

**Fecha:** 2026-11-16  
**Base:** requerimientos de modernización del mandato + hallazgos de auditoría actual.  
**Principio:** no agregar tecnologías por moda; justificar por necesidad de negocio, paridad funcional y mantenibilidad.

## 1. Resumen recomendado

| Capa | Tecnología propuesta | Reemplaza / relación con actual | Rol |
|---|---|---|---|
| Runtime backend | **Bun** | PHP runtime + tooling parcial Node | Ejecución TS/JS, tooling unificado |
| Lenguaje | **TypeScript** (end-to-end) | PHP backend + TS frontend separado por ecosistema | Tipado compartido y contratos |
| Framework HTTP/API | **Hono** (primera opción) o **Elysia** (alternativa) | Laravel routing/controllers/middleware | API HTTP ligera, modular, tipada |
| ORM / acceso a datos | **Drizzle ORM** | Eloquent + parte de Repositories/SPs | Consultas tipadas, migraciones SQL-first |
| Base de datos | **PostgreSQL** | SQL Server 2019 + T-SQL SPs | RDBMS robusto, ecosistema amplio |
| Validación | **Zod** | Form Requests/validaciones Laravel + validaciones ad hoc | Esquemas compartibles web/móvil/API |
| Autenticación | **Better Auth** (a evaluar) u opción equivalente madura | Fortify + Socialite + passkeys/2FA actuales | Sesiones/OAuth/2FA/passkeys según soporte |
| Frontend web | **React 19** + **Vite** | Vue 3 + Inertia + Vite | UI moderna, alineada a ecosistema solicitado |
| Routing web | **TanStack Router** | Rutas Inertia/Vue + wayfinder | Routing tipado |
| Data fetching/cache cliente | **TanStack Query** | Inertia visits/props como transporte principal | Estado servidor en cliente, cache/reintentos |
| Formularios | **TanStack Form** (cuando aporte) | Formularios Vue/Inertia actuales | Gestión de formularios complejos tipados |
| UI | **shadcn/ui + Tailwind CSS** | shadcn-vue/reka-ui + Tailwind 4 | Sistema de componentes reutilizable |
| Estado global | **Zustand** (solo si necesario) | Estado local/composables actuales | Estado UI compartido puntual |
| Móvil | **React Native + Expo** (evaluado) | Capacitor (webview) | App nativa multiplataforma con lógica compartida |
| Monorepo | **Turborepo + Bun workspaces** | Repo único no modularizado por paquetes TS | Builds/cache/pipelines por paquete |
| Contenedores | **Docker** | Docker Compose actual | Entornos reproducibles |
| Cache/colas | **Redis** (solo si justificado) | Redis disponible; hoy sync/file en ejemplo | Cache, rate limit, jobs/background |
| Almacenamiento objetos | **S3-compatible** (MinIO/otro) | MinIO/local | Archivos/fotos/documentos |
| Observabilidad | Logging estructurado + monitoreo + gestión de errores | Logs Laravel básicos/por configurar | Operación y diagnóstico |

## 2. Evaluación por tecnología solicitada

### Backend
| Tecnología | Problema que resuelve | Ventajas | Desventajas/riesgos | Complejidad | Reemplaza |
|---|---|---|---|---|---|
| TypeScript | Fragmentación PHP/JS, contratos débiles | Tipado compartido, mejor DX/refactors | Curva de migración de reglas Laravel | Media | PHP en capa app |
| Bun | Tooling/runtime múltiple | Velocidad, TS nativo, gestor integrado | Madurez variable según features; compatibilidad libs | Media | PHP+Node tooling parcial |
| Hono | Necesidad de HTTP framework ligero/modular | Simple, portable, buen tipado, middlewares | Ecosistema distinto a Laravel (auth/admin menos "baterías incluidas") | Media | Laravel HTTP stack |
| Elysia | API tipada con DX fuerte en Bun | Validación/tipos integrados, rendimiento | Más acoplado a Bun/ecosistema específico | Media | Alternativa a Hono |
| Drizzle ORM | Abstracción y migraciones tipadas | SQL cercano, tipado fuerte, migraciones controladas | Menos "magia" que Eloquent; migrar patrones existentes | Media-Alta | Eloquent/repos/SPs |
| PostgreSQL | Unificar en RDBMS objetivo | JSONB, extensiones, tooling, estándar en stack TS | Migración desde SQL Server/T-SQL | Alta | SQL Server |
| Zod | Validación inconsistente entre capas | Esquemas reutilizables y tipados | Duplicación si no se centraliza | Baja-Media | Validaciones dispersas |
| Better Auth | Auth moderna en TS | Integraciones OAuth/sesiones (según módulos) | Verificar paridad 2FA/passkeys/equipos | Media-Alta | Fortify/Socialite |

**Recomendación preliminar:** Hono + Drizzle + PostgreSQL + Zod como núcleo; Better Auth sujeto a prueba de paridad (2FA, passkeys, OAuth Google, multi-equipo) antes de compromiso final.

### Frontend web
| Tecnología | Problema que resuelve | Ventajas | Desventajas/riesgos | Complejidad | Reemplaza |
|---|---|---|---|---|---|
| React 19 + Vite | Alineación al stack objetivo | Ecosistema, contratación, componentes | Reescritura total de UI Vue/Inertia | Alta | Vue 3 + Inertia |
| TanStack Router | Rutas tipadas y data loading | Tipado, composición | Cambio de modelo mental vs Inertia | Media | Rutas Inertia/Wayfinder |
| TanStack Query | Gestión de estado servidor | Cache, sincronización, invalidación | Requiere diseño de API coherente | Media | Props/visits Inertia |
| TanStack Form | Formularios complejos | Tipado y validación integrada | Overhead en forms simples | Baja-Media | Formularios actuales |
| shadcn/ui + Tailwind | Consistencia UI | Reutilizable, accesible con trabajo | Montaje y personalización inicial | Media | shadcn-vue/reka-ui |
| Zustand | Estado global UI puntual | Simple y ligero | Usar en exceso degrada arquitectura | Baja | N/A |

### Móvil
| Tecnología | Problema que resuelve | Ventajas | Desventajas/riesgos | Complejidad |
|---|---|---|---|---|
| React Native + Expo | App nativa con mayor acceso a capacidades | Compartir contratos/lógica TS, ecosistema móvil | Esfuerzo mayor que Capacitor; paridad UX | Media-Alta |
| Cliente API compartido | Duplicación web/móvil | Reutilización tipos/validaciones/SDK | Requiere API estable | Media |

**Nota:** Capacitor existe hoy; migrar a RN/Expo se justifica si se priorizan capacidades nativas/experiencia móvil, no por defecto.

### Infraestructura y plataforma
| Tecnología | ¿Incluir? | Justificación |
|---|---|---|
| Turborepo + Bun workspaces | Sí | Monorepo con apps (`api`, `web`, `mobile`) y paquetes (`domain`, `contracts`, `ui`, `config`) |
| Docker | Sí | Paridad local/CI/prod |
| PostgreSQL | Sí | BD objetivo única |
| Redis | Condicional | Solo para cache, sesiones distribuidas, rate limiting o colas justificadas |
| S3-compatible | Condicional/Sí si hay uploads | Fotos de mascotas/seguimientos, documentos, portabilidad |
| CI/CD, logging, monitoreo, backups | Sí | Requisito operativo para producción segura |

## 3. Decisiones de arquitectura (alineadas)

- **Monorepo** con **Modular Monolith** en backend como estado inicial; evitar microservicios prematuros.
- **DDD táctico y bounded contexts** según dominio real (adopciones, mascotas, organizaciones, contenido, comunidad, identidad).
- **Separación por capas:** dominio, aplicación, infraestructura, interfaces (HTTP/UI).
- **API-first** con contratos tipados compartidos (Zod/TS) para web y móvil.
- **Hexagonal/ports & adapters** donde aporte aislamiento (integraciones DNI, email, storage, auth provider).

## 4. Riesgos principales de la propuesta

1. **Paridad de autenticación:** 2FA, passkeys, OAuth y equipos deben validarse explícitamente.
2. **Migración de datos:** SQL Server→PostgreSQL y semántica de soft deletes/constraints.
3. **Pérdida de reglas implícitas:** lógica hoy distribuida en UI/controladores/closures.
4. **Sobrecarga de herramientas:** mantener stack mínimo necesario por fase.

## 5. Criterios para confirmar el stack

- Matriz de trazabilidad funcional completa y aprobada.
- Spike técnico: Hono+Drizzle+PostgreSQL con módulo de identidad/equipos y un flujo de adopción.
- Decisión documentada de auth (Better Auth vs alternativa) con evidencia de paridad.
- Plan de migración de datos y archivos validado en entorno de prueba.
