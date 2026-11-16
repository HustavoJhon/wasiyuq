# Casos de uso

**Fecha:** 2026-11-16  
**Formato:** objetivo, actores, precondiciones, flujo principal, alternos/excepciones, postcondiciones, evidencia y estado.

## UC-01 Explorar mascotas públicas
- **Actor:** Visitante
- **Precondiciones:** Ninguna.
- **Flujo principal:** 1) Accede a `/mascotas`. 2) Aplica filtros/búsqueda (según UI). 3) Abre detalle `/mascotas/{slug}`.
- **Postcondiciones:** Visualiza información de mascota y organización.
- **Evidencia:** `routes/public.php`, `Public\PetController`. **Estado:** Verificado (detalle de filtros UI: Parcial).

## UC-02 Postular a adopción
- **Actor:** Adoptante (autenticado)
- **Precondiciones:** Sesión iniciada; mascota existente.
- **Flujo principal:** 1) Envía formulario en `POST /mascotas/{slug}/postular`. 2) Sistema valida `StoreApplicationRequest`. 3) Verifica que no exista solicitud activa propia. 4) Crea adopción `pending`, cambia mascota a `in_process`. 5) Dispara notificación a admins del equipo. 6) Redirige a mis postulaciones con éxito.
- **Alternos:** A1) Solicitud activa existente → mensaje de error. A2) Validación falla → errores de formulario.
- **Postcondiciones:** Adopción registrada y en revisión.
- **Evidencia:** `ApplicationController@store`, `AdoptionService::create`, `NotifyEntityOfNewApplication`. **Estado:** Verificado.

## UC-03 Revisar y aprobar adopción
- **Actor:** Miembro de equipo (org)
- **Precondiciones:** Miembro del team; adopción `pending` del team.
- **Flujo principal:** 1) Lista/ver adopción. 2) Ejecuta aprobar. 3) Sistema marca `approved`, registra revisor/fecha, mascota `adopted`. 4) Notifica adoptante y genera acta PDF.
- **Postcondiciones:** Adopción aprobada, mascota adoptada, documento en generación/almacenado.
- **Evidencia:** `Dashboard\AdoptionController@approve`, `AdoptionService::approve`, `NotifyAdopterOfApproval`, `GenerateAdoptionActaJob`. **Estado:** Verificado.

## UC-04 Rechazar adopción
- **Actor:** Miembro de equipo
- **Precondiciones:** Adopción del team.
- **Flujo principal:** 1) Envía rechazo (nota opcional). 2) Sistema marca `rejected`, guarda revisor/fecha/nota, mascota vuelve a `available`.
- **Evidencia:** `Dashboard\AdoptionController@reject`, `AdoptionService::reject`. **Estado:** Verificado.

## UC-05 Completar adopción y generar plan de seguimiento
- **Actor:** Sistema/Operador autorizado
- **Precondiciones:** Adopción en estado que permita completar (lógica de servicio no restringe explícitamente, a validar).
- **Flujo principal:** 1) Invoca completar. 2) Sistema marca `completed` y dispara evento. 3) Listener crea 5 hitos pendientes.
- **Postcondiciones:** Plan de seguimiento activo.
- **Evidencia:** `AdoptionService::complete`, `CreateFollowUpPlan`. **Estado:** Parcial (**disparador UI/ruta no confirmado**).

## UC-06 Reportar hito de seguimiento (adoptante)
- **Actor:** Adoptante
- **Precondiciones:** Seguimiento `pending` asociado a adopción propia.
- **Flujo principal:** 1) Abre seguimiento. 2) Envía notas y/o fotos. 3) Sistema valida (imágenes ≤5MB), almacena archivos, marca `completed` con fecha.
- **Alternos:** A1) No es dueño → 403. A2) No está pendiente → 422.
- **Evidencia:** `FollowUpReportController@report`, `FollowUpService::reportMilestone`. **Estado:** Verificado.

## UC-07 Gestionar seguimientos (equipo)
- **Actor:** Miembro de equipo
- **Precondiciones:** Pertenencia al team.
- **Flujo principal:** 1) Lista/filtra seguimientos. 2) Marca completado o no realizado, o programa uno nuevo (fecha futura).
- **Evidencia:** `Dashboard\FollowUpController`, `FollowUpService`. **Estado:** Verificado (autorización fina por permisos: Parcial).

## UC-08 Vencer seguimientos automáticamente
- **Actor:** Scheduler del sistema
- **Precondiciones:** `schedule:run` y cola configurados.
- **Flujo principal:** 1) Ejecuta job diario. 2) Marca `pending` vencidos como `missed`.
- **Evidencia:** `routes/console.php`, `CheckOverdueMilestonesJob`. **Estado:** Verificado.

## UC-09 Gestionar mascotas del equipo
- **Actor:** Miembro de equipo
- **Precondiciones:** Acceso al team.
- **Flujo principal:** 1) Crea/edita/elimina mascota. 2) Sube foto (storage público) y define estado/datos.
- **Evidencia:** `Teams\PetController`, `Store/UpdatePetRequest`. **Estado:** Verificado.

## UC-10 Administrar plataforma
- **Actor:** Super Admin
- **Precondiciones:** `is_super_admin` o email autorizado.
- **Flujo principal:** Gestiona usuarios, organizaciones, contenido, adopciones, seguimientos y directorios desde `/admin`.
- **Evidencia:** `routes/admin.php`, `Admin\*`. **Estado:** Verificado (alcance por acción: Parcial).

## UC-11 Consultar DNI
- **Actor:** Usuario/app (según endpoint)
- **Precondiciones:** Token de servicio configurado (o manejo de ausencia).
- **Flujo principal:** Envía DNI → servicio consulta API externa y retorna datos o estado (`token_missing/not_found/error`).
- **Evidencia:** `DniLookupService`, `/api/dni/lookup`. **Estado:** Verificado.

## UC-12 Usar chatbot
- **Actor:** Visitante/app
- **Flujo principal:** Envía mensaje → motor de reglas responde texto y botones sugeridos.
- **Evidencia:** `ChatbotService`. **Estado:** Verificado.