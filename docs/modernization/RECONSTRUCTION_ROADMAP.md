# Roadmap de reconstrucción

**Fecha:** 2026-11-16  
**Contexto:** propuesta preliminar para reconstruir WASIYUQ fuera de Laravel, preservando funcionalidades y reglas de negocio identificadas en la auditoría. Debe ajustarse tras completar inventario y matriz de trazabilidad.

## Principios

- **Paridad funcional antes de optimización prematura:** ninguna capacidad existente se descarta sin decisión explícita.
- **API-first y contratos tipados:** habilitar web y futura app móvil (React Native/Expo) sobre el mismo dominio.
- **Migración incremental por dominio:** evitar "big bang" sin validación.
- **Evidencia y trazabilidad:** cada módulo nuevo mapea a funcionalidades/reglas/datos actuales.

## Fases propuestas

### Fase 1 — Fundación tecnológica y monorepo
- **Objetivo:** establecer base de desarrollo, estándares y tooling.
- **Módulos afectados:** transversales.
- **Dependencias:** decisiones de stack aprobadas.
- **Tareas:** crear monorepo (Turborepo + Bun workspaces), paquetes compartidos (tipos/contratos/validación), lint/test/build, convenciones de arquitectura modular.
- **Criterios de aceptación:** CI básica, builds reproducibles, estructura de bounded contexts definida.
- **Riesgos:** sobre-diseño inicial.
- **Complejidad:** Media.
- **Prioridad:** Alta.

### Fase 2 — Infraestructura y base de datos
- **Objetivo:** preparar persistencia y servicios de soporte.
- **Módulos afectados:** todos (datos).
- **Dependencias:** Fase 1.
- **Tareas:** diseñar esquema PostgreSQL + migraciones Drizzle, estrategia de migración de datos desde SQL Server, storage S3-compatible, Redis solo si se justifica (cache/colas/sesiones), observabilidad base.
- **Criterios de aceptación:** entorno local reproducible (Docker), migraciones versionadas, plan de backfill/validación de datos.
- **Riesgos:** diferencias de tipos/semántica SQL Server→PostgreSQL, pérdida/alteración de datos si no hay validación.
- **Complejidad:** Alta.
- **Prioridad:** Alta.

### Fase 3 — Identidad, autenticación y permisos
- **Objetivo:** replicar acceso y autorización.
- **Módulos afectados:** usuarios, equipos, membresías, invitaciones, admin.
- **Dependencias:** Fase 2.
- **Tareas:** auth (email/password, 2FA/passkeys si aplica, OAuth Google), modelo de equipos personales/organizaciones, RBAC/ABAC por permisos equivalentes a `TeamPermission`, bypass/control super admin sin hardcodes.
- **Criterios de aceptación:** flujos de login, cambio de equipo, invitaciones y restricciones por rol equivalentes y auditables.
- **Riesgos:** brechas de seguridad en reimplementación; incompatibilidades con cuentas existentes.
- **Complejidad:** Alta.
- **Prioridad:** Alta.

### Fase 4 — Dominio núcleo
- **Objetivo:** implementar entidades y reglas de negocio centrales.
- **Módulos afectados:** mascotas, adopciones, seguimientos, organizaciones/equipos.
- **Dependencias:** Fase 3.
- **Tareas:** CRUD y estados de mascotas, postulaciones y transiciones de adopción, programación/reporte de seguimientos, validaciones y eventos de dominio.
- **Criterios de aceptación:** máquinas de estado y reglas críticas probadas; paridad con flujos actuales.
- **Riesgos:** reglas implícitas no detectadas en código.
- **Complejidad:** Alta.
- **Prioridad:** Muy alta.

### Fase 5 — Módulos funcionales complementarios
- **Objetivo:** completar capacidades de producto.
- **Módulos afectados:** eventos/anuncios, blog, mascotas perdidas, veterinarias/albergues/calificaciones, contacto.
- **Dependencias:** Fases 3-4.
- **Tareas:** contenidos públicos y gestión por equipo/admin, directorios y ratings, formularios y moderación/verificación donde aplique.
- **Criterios de aceptación:** paridad de pantallas/operaciones y SEO básico equivalente.
- **Riesgos:** alcance oculto en UI.
- **Complejidad:** Media-Alta.
- **Prioridad:** Alta.

### Fase 6 — Integraciones externas y utilidades
- **Objetivo:** reimplementar integraciones.
- **Módulos afectados:** chatbot, DNI, correo, analítica, PDFs/actas si aplica.
- **Dependencias:** Fases 4-5 según necesidad.
- **Tareas:** integración API DNI, servicio de email/transaccional, chatbot (reglas o evolución definida), generación documental, analítica.
- **Criterios de aceptación:** contratos externos aislados, fallbacks y manejo de errores.
- **Riesgos:** dependencia de proveedores/tokens; cambios de API.
- **Complejidad:** Media.
- **Prioridad:** Media-Alta.

### Fase 7 — Frontend web
- **Objetivo:** entregar experiencia web moderna.
- **Módulos afectados:** todos los visibles.
- **Dependencias:** APIs/contratos de fases previas (puede solaparse).
- **Tareas:** app React 19 + Vite + TanStack Router/Query, UI con shadcn/Tailwind, formularios/validación compartida (Zod), SEO/SSR o prerender según necesidad.
- **Criterios de aceptación:** flujos críticos end-to-end, accesibilidad básica, rendimiento aceptable.
- **Riesgos:** regresiones UX; paridad incompleta.
- **Complejidad:** Alta.
- **Prioridad:** Alta.

### Fase 8 — Aplicación móvil
- **Objetivo:** habilitar cliente móvil reutilizando dominio/contratos.
- **Módulos afectados:** subconjunto priorizado (catálogo, postulación, seguimientos, perfil).
- **Dependencias:** Fase 7/API madura.
- **Tareas:** evaluar React Native/Expo, compartir tipos/cliente API/validaciones, capacidades nativas necesarias (cámara/notificaciones) con justificación.
- **Criterios de aceptación:** MVP móvil funcional para flujos prioritarios.
- **Riesgos:** alcance excesivo; diferencias de UX/plataforma.
- **Complejidad:** Media-Alta.
- **Prioridad:** Media (tras web/core estable).

### Fase 9 — Pruebas y validación
- **Objetivo:** asegurar paridad y calidad.
- **Módulos afectados:** todos.
- **Dependencias:** implementación de módulos.
- **Tareas:** pruebas unitarias/integración/e2e, validación de migración de datos, reconciliación funcional con matriz de trazabilidad, pruebas de seguridad.
- **Criterios de aceptación:** criterios de paridad cumplidos, defectos críticos resueltos.
- **Riesgos:** cobertura insuficiente por desconocimiento de casos borde.
- **Complejidad:** Alta.
- **Prioridad:** Muy alta.

### Fase 10 — Despliegue y puesta en producción
- **Objetivo:** salida controlada.
- **Módulos afectados:** plataforma completa.
- **Dependencias:** Fase 9.
- **Tareas:** CI/CD, entornos, backups/restore, monitoreo/logging/alertas, cutover y rollback plan.
- **Criterios de aceptación:** operación estable, observabilidad y procedimientos de recuperación verificados.
- **Riesgos:** interrupción de servicio, inconsistencias de datos en corte.
- **Complejidad:** Alta.
- **Prioridad:** Alta.

## Priorización inicial (borrador)

| Prioridad | Ámbito | Justificación |
|---|---|---|
| Muy alta | Identidad/permisos, mascotas, adopciones, seguimientos | Núcleo del valor de negocio |
| Alta | Organizaciones/equipos, contenido público (eventos/blog), mascotas perdidas, directorios | Completa experiencia y operación |
| Media | Chatbot, analítica avanzada, optimizaciones móviles/PWA avanzadas | Valor agregado tras núcleo estable |

## Matriz de trazabilidad (plantilla inicial)

| Funcionalidad actual | Regla de negocio | Entidades | Módulo nuevo (propuesto) | Prioridad | Estado |
|---|---|---|---|---|---|
| Catálogo y detalle de mascotas | Visibilidad por estado/publicación (a confirmar) | `Pet`, `Team` | `pets` | Muy alta | Pendiente detalle |
| Postulación de adopción | Creación de solicitud y cambio a `in_process` (evidencia en servicio) | `Adoption`, `Pet`, `User`, `Team` | `adoptions` | Muy alta | Pendiente detalle |
| Aprobación/rechazo adopción | Transiciones y efectos sobre mascota/revisión | `Adoption`, `Pet` | `adoptions` | Muy alta | Pendiente detalle |
| Seguimientos post-adopción | Programación, reporte, estados | `FollowUp`, `Adoption` | `follow-ups` | Muy alta | Pendiente detalle |
| Eventos y blog | Publicación por equipo/autor | `Announcement`, `BlogPost`, `Team` | `content` | Alta | Pendiente detalle |
| Mascotas perdidas | Reporte público y gestión | `LostPet` | `lost-pets` | Alta | Pendiente detalle |
| Veterinarias y calificaciones | Registro/verificación/rating | `Veterinarian`, `VeterinarianRating` | `directory` | Alta | Pendiente detalle |
| Contacto y chatbot | Atención/guía automatizada | `ContactRequest` (+ reglas) | `support` | Media | Pendiente detalle |
| Consulta DNI | Validación/lookup externo | — | `integrations.identity` | Media | Pendiente detalle |

> Esta matriz debe completarse con IDs por funcionalidad, reglas verificadas y referencias a código conforme avance la auditoría.
