# Reportes y exportaciones

**Fecha:** 2026-11-16  
**Fuentes:** `app/Jobs/GenerateAdoptionActaJob.php`, `app/Jobs/GenerateAdoptionCertificateJob.php`, `resources/views/pdfs/*`, `database/stored-procedures/reports` (si aplica), rutas/controladores, `dompdf` en dependencias.

## 1. Documentos PDF generados

| ID | Documento | Generación | Plantilla | Salida/almacenamiento | Disparador observado | Estado |
|---|---|---|---|---|---|---|
| REP-PDF-01 | Acta de adopción | `Barryvdh\DomPDF\Facade\Pdf::loadView` | `resources/views/pdfs/adoption-acta.blade.php` | `Storage::disk('public')->put('adoptions/acta-{id}-{ts}.pdf')`, actualiza `adoptions.acta_path` | `NotifyAdopterOfApproval` → `GenerateAdoptionActaJob::dispatch` al aprobar | **Verificado** |
| REP-PDF-02 | Certificado de adopción | DomPDF | `resources/views/pdfs/adoption-certificate.blade.php` | `Storage::disk('public')->put("certificates/adoption-{id}.pdf")`, actualiza `acta_path` con `updateQuietly` | **No se halló invocación** en `app/` (búsqueda estática) | **Parcial/No usado confirmado** |

### Hallazgos
- **Colisión semántica/campo:** ambos jobs escriben en `acta_path` (rutas/convenciones distintas). Puede sobrescribir el documento previo o generar ambigüedad sobre cuál es el “acta” oficial. **Verificado.**
- **Entrega al usuario:** almacenamiento en disco `public`; no se evidenció ruta de descarga/stream en controladores revisados (pendiente rastrear `acta_path` en UI/controladores de detalle).

## 2. Reportes de datos / vistas analíticas en UI

| ID | Reporte/vista | Contenido | Evidencia | Estado |
|---|---|---|---|---|
| REP-UI-01 | Dashboard de equipo | Métricas agregadas (conteos pets/adoptions/announcements/blog/follow-ups) y listados recientes | `routes/web.php` closure `/{current_team}/dashboard` (queries Eloquent) | **Verificado** |
| REP-UI-02 | Dashboard adoptante | Resumen de actividad del adoptante | `Adopter\DashboardController` | **Verificado** (detalle de métricas por leer en UI/controller) |
| REP-UI-03 | Dashboard admin | Métricas/gestión global | `Admin\DashboardController` | **Parcial** |
| REP-UI-04 | Listados filtrables (adopciones/seguimientos/mascotas) | Tablas/paginación y filtros por estado | Controladores dashboard/adopter/admin | **Verificado** |

## 3. Reportes/consultas vía Stored Procedures (T-SQL)

| SP | Propósito (según SQL) | Parámetros | Uso en aplicación | Estado |
|---|---|---|---|---|
| `sp_search_pets` | Búsqueda paginada de mascotas con filtros | species,size,gender,status,search,page,per_page | No invocado en `app/` | Definido, **uso no evidenciado** |
| `sp_get_pet_detail` | Detalle de mascota por slug | slug | No invocado | Definido, uso no evidenciado |
| `sp_get_organization_pets` | Mascotas por equipo/estado | team_id,status | No invocado | Definido, uso no evidenciado |
| `sp_list_organization_adoptions` | Adopciones por equipo/estado | team_id,status | No invocado | Definido, uso no evidenciado |
| `sp_get_adoption_detail` | Detalle de adopción | adoption_id | No invocado | Definido, uso no evidenciado |
| `sp_search_blog_posts` | Búsqueda paginada blog publicado | category,team_id,page,per_page | No invocado | Definido, uso no evidenciado |
| `sp_get_blog_post_detail` | Detalle blog por slug | slug | No invocado | Definido, uso no evidenciado |
| `sp_search_announcements` | Búsqueda paginada anuncios publicados | type,team_id,page,per_page | No invocado | Definido, uso no evidenciado |
| `sp_get_announcement_detail` | Detalle anuncio por slug | slug | No invocado | Definido, uso no evidenciado |

**Evidencia:** archivos en `database/stored-procedures/**`; búsqueda `rg sp_` en `app/` solo mostró definiciones/comando de carga. `database/stored-procedures/reports/` existe pero no se halló `sp_adoption_statistics.sql` u otros archivos de reporte en la inspección rápida (directorio presente).

## 4. Exportaciones

| Tipo | Hallazgo | Estado |
|---|---|---|
| CSV/Excel/descargas masivas | No se identificaron endpoints/controladores de exportación en rutas revisadas | No evidenciado / **Pendiente de confirmación** |
| Descarga de acta/certificado | Campo `acta_path` existe; ruta pública/privada de descarga no confirmada | Pendiente de confirmación |

## 5. Recomendaciones para reconstrucción

- Unificar documento oficial (acta vs certificado), campo/ruta de almacenamiento y endpoint de descarga con control de acceso.
- Decidir si los SPs se reemplazan por consultas/queries tipadas (Drizzle) o se migran como vistas/consultas equivalentes en PostgreSQL, según paridad requerida.