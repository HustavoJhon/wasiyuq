# Auditoría de pruebas

**Fecha:** 2026-11-16  
**Fuentes:** `tests/**`, `phpunit.xml`, `composer.json` (scripts/test), estructura de `app/`.

## 1. Inventario de pruebas existentes

| Tipo | Archivo | Cobertura aparente |
|---|---|---|
| Feature/Auth | `AuthenticationTest.php` | Login/autenticación básica (Fortify) |
| Feature/Auth | `RegistrationTest.php` | Registro |
| Feature/Auth | `PasswordResetTest.php` | Reset de contraseña |
| Feature/Auth | `PasswordConfirmationTest.php` | Confirmación de contraseña |
| Feature/Auth | `EmailVerificationTest.php` | Verificación de email |
| Feature/Auth | `VerificationNotificationTest.php` | Notificación de verificación |
| Feature/Auth | `TwoFactorChallengeTest.php` | 2FA challenge |
| Feature/Settings | `ProfileUpdateTest.php` | Actualización de perfil |
| Feature/Settings | `SecurityTest.php` | Configuración de seguridad |
| Feature/Teams | `TeamTest.php` | Operaciones de equipo |
| Feature/Teams | `TeamMemberTest.php` | Miembros de equipo |
| Feature/Teams | `TeamInvitationTest.php` | Invitaciones |
| Feature | `DashboardTest.php` | Acceso/dashboard |
| Feature | `ExampleTest.php` | Ejemplo placeholder |
| Unit | `ExampleTest.php` | Ejemplo placeholder |
| Base | `Pest.php`, `TestCase.php` | Bootstrap Pest/PHPUnit |

**Total:** 17 archivos (15 feature, 2 unit, mayormente scaffolding de auth/teams/settings/dashboard).

## 2. Configuración de ejecución (`phpunit.xml`)

- Entorno: `testing`, `DB_CONNECTION=sqlite`, `DB_DATABASE=:memory:`, `DB_URL` vacío.
- `CACHE_STORE=array`, `SESSION_DRIVER=array`, `MAIL_MAILER=array`, `QUEUE_CONNECTION=sync`.
- `BROADCAST_CONNECTION=null`, servicios de observabilidad deshabilitados.

**Implicación:** las pruebas están orientadas a ejecución rápida en SQLite en memoria; **no validan** compatibilidad con SQL Server, stored procedures T-SQL, ni comportamiento dependiente de driver específico.

## 3. Cobertura por dominio (evaluación cualitativa)

| Dominio/Módulo | Pruebas dedicadas | Evaluación |
|---|---|---|
| Autenticación/Fortify | Sí (suite amplia) | **Media** (scaffolding estándar; casos de negocio propios no cubiertos) |
| Perfil/seguridad/equipos/invitaciones | Sí | **Media** |
| Dashboard genérico | Sí (básica) | **Baja** |
| Adopciones (postular, aprobar, rechazar, completar, cancelar) | No | **Nula** |
| Seguimientos (reportar, programar, vencer, plan automático) | No | **Nula** |
| Mascotas (CRUD público/equipo/adoptante, estados) | No | **Nula** |
| Contenido (blog, eventos/anuncios) | No | **Nula** |
| Mascotas perdidas, veterinarias, albergues, calificaciones | No | **Nula** |
| Admin (usuarios, orgs, moderación/verificación) | No | **Nula** |
| Integraciones (Google OAuth, DNI, correo, chatbot) | No | **Nula** |
| Jobs/Eventos/Listeners/Notificaciones/PDFs | No | **Nula** |
| Policies/middleware/autorización fina (permisos de equipo) | Indirecta mínima | **Baja** |
| SPs y consultas de reporte | No | **Nula** |

## 4. Hallazgos y riesgos

| Hallazgo | Severidad | Detalle |
|---|---|---|
| Dominio núcleo sin pruebas | Alta | Adopciones y seguimientos concentran reglas críticas y side-effects no cubiertos |
| Desalineación entorno de test vs producción objetivo | Media-Alta | SQLite/sync ocultan diferencias con SQL Server, colas reales y SPs |
| Ejemplos placeholder presentes | Baja | `ExampleTest` unit/feature no aportan cobertura de negocio |
| Ausencia de pruebas de autorización negativa | Media | Riesgo en RBAC/permisos de equipo y rutas admin |
| Ausencia de pruebas de contratos de integración | Media | DNI/Google/mail sin dobles/contratos verificados |
| No evidencia de medición de cobertura | Media | No se observa configuración de coverage en repo (por confirmar en CI externo) |

## 5. Recomendaciones para 2.0 (base mínima de paridad)

1. **Pruebas de dominio (prioridad 1):** máquinas de estado de adopción/mascota/seguimiento, validaciones de postulación, side-effects (eventos, cambios de estado, plan de hitos).
2. **Autorización:** casos positivos/negativos por rol de equipo y superadmin en endpoints sensibles.
3. **Integraciones:** pruebas con adaptadores mock/fake para DNI, correo, OAuth y almacenamiento; contratos para payloads.
4. **Jobs/scheduler:** ejecución de `CheckOverdueMilestonesJob`, generación de PDFs (contenido/almacenamiento) y listeners.
5. **Datos/entorno:** suite contra PostgreSQL (target) y, si se requiere paridad temporal, escenarios específicos de migración; fixtures deterministas.
6. **No funcional:** pruebas de rendimiento básicas en búsquedas/listados y de idempotencia en operaciones críticas.