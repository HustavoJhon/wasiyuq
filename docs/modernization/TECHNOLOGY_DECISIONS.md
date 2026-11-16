# Decisiones tecnológicas (ADR preliminares)

**Fecha:** 2026-11-16  
**Estado:** propuestas basadas en auditoría; requieren validación/spikes y aprobación.

## ADR-001 — Reconstrucción completa fuera de Laravel
- **Contexto:** stack actual acoplado a Laravel/Inertia/Vue y con componentes específicos (Eloquent, SPs SQL Server, Fortify).
- **Decisión:** reconstruir aplicación con stack TypeScript moderno en lugar de migración incremental in-place del framework.
- **Motivación:** alineación al objetivo de modernización, simplificación de contratos API-first, preparación web/móvil, reducción de deuda estructural.
- **Consecuencias:** alto esfuerzo inicial, necesidad de paridad funcional estricta y migración de datos/archivos.

## ADR-002 — Monorepo Modular Monolith (no microservicios iniciales)
- **Contexto:** dominio integrado (adopciones depende de mascotas/organizaciones/usuarios) y equipo/tamaño de producto no justifica distribución temprana.
- **Decisión:** Turborepo + Bun workspaces con módulos/bounded contexts en un backend monolítico modular.
- **Consecuencias:** despliegue simple, límites lógicos claros; microservicios diferidos hasta evidencia.

## ADR-003 — Núcleo backend: TypeScript + Bun + Hono (preferido) + Drizzle + PostgreSQL
- **Contexto:** objetivo solicitado y necesidad de API tipada y migración desde SQL Server.
- **Decisión:** adoptar este núcleo; evaluar Elysia si aporta ventajas concretas en Bun sin sacrificar portabilidad.
- **Consecuencias:** reimplementación de ORM/reglas; migración de datos y reemplazo de SPs T-SQL.

## ADR-004 — Contratos compartidos con Zod
- **Contexto:** múltiples clientes (web, futura app móvil) y validaciones dispersas hoy.
- **Decisión:** esquemas Zod en paquete `contracts` como fuente de validación/tipos.
- **Consecuencias:** consistencia y reutilización; requiere disciplina para evitar duplicados.

## ADR-005 — Autenticación: selección condicionada a paridad
- **Contexto:** hoy existen Fortify, 2FA, passkeys, Google OAuth, equipos y super admin.
- **Decisión:** considerar Better Auth u alternativa TS solo tras spike que demuestre paridad (password, OAuth Google, 2FA, passkeys si aplica, sesiones, integración RBAC por equipos).
- **Consecuencias:** posible necesidad de combinar proveedor auth + capa de autorización propia.

## ADR-006 — Frontend web: React 19 + Vite + TanStack + shadcn/ui + Tailwind
- **Contexto:** objetivo de modernización y reuso de patrones UI.
- **Decisión:** reescribir UI (no portar Vue/Inertia).
- **Consecuencias:** costo de UI alto; oportunidad de mejorar UX, accesibilidad y consistencia.

## ADR-007 — Móvil: React Native + Expo (fase posterior, API compartida)
- **Contexto:** existe Capacitor hoy; se busca app móvil con lógica compartida.
- **Decisión:** priorizar web y API estable; introducir Expo/RN para flujos núcleo cuando haya paridad backend.
- **Consecuencias:** evita duplicar esfuerzos antes de estabilizar dominio.

## ADR-008 — Infra: Redis y S3-compatible solo por necesidad justificada
- **Contexto:** Redis/MinIO disponibles pero uso efectivo actual variable.
- **Decisión:** incluir S3-compatible si hay gestión de archivos en producción; Redis para cache/colas/rate-limit cuando métricas o requisitos lo justifiquen.
- **Consecuencias:** reduce complejidad inicial sin cerrar opciones.

## ADR-009 — Trazabilidad funcional obligatoria
- **Contexto:** riesgo de pérdida de funcionalidades/reglas implícitas.
- **Decisión:** mantener matriz de trazabilidad y criterios de aceptación por flujo antes de dar por completo cada módulo.
- **Consecuencias:** mayor esfuerzo documental inicial, menor riesgo de regresión funcional.

## Decisiones pendientes de aprobación

1. Framework HTTP final: Hono vs Elysia.
2. Proveedor/estrategia de autenticación (Better Auth u otro) con alcance de 2FA/passkeys.
3. Estrategia SEO/SSR para web pública (SPA, SSR, prerender).
4. Alcance MVP móvil y prioridades de flujos.
5. Política de retención/migración de archivos y documentos (actas/fotos).
6. Tratamiento de stored procedures: reemplazo total vs vistas/consultas equivalentes documentadas.
7. Modelo definitivo de roles de negocio (conciliación README vs implementación). 
