# Catálogo de rutas y APIs

**Fecha:** 2026-11-16  
**Fuente:** `routes/public.php`, `routes/web.php`, `routes/admin.php`, `routes/settings.php`, `bootstrap/app.php`.

> Laravel con Inertia: la mayoría de rutas devuelven respuestas Inertia/HTML o redirecciones; endpoints JSON explícitos se marcan.

## 1. Rutas públicas (`routes/public.php`)

| Método | Ruta | Nombre | Controlador/acción | Notas |
|---|---|---|---|---|
| GET | `/sitemap.xml` | `sitemap` | `Public\SitemapController@index` | XML |
| GET | `/` | `home` | `Public\HomeController@index` | Home |
| GET | `/mascotas` | `pets.index` | `Public\PetController@index` | Catálogo |
| GET | `/mascotas/{slug}` | `pets.show` | `Public\PetController@show` | Detalle |
| GET | `/mascotas-perdidas` | `lost-pets.index` | `Public\LostPetController@index` | Listado |
| GET | `/mascotas-perdidas/{id}` | `lost-pets.show` | `Public\LostPetController@show` | id numérico |
| POST | `/mascotas-perdidas/reportar` | `lost-pets.store` | `Public\LostPetController@store` | Reporte |
| GET | `/eventos` | `events.index` | `Public\EventController@index` | |
| GET | `/eventos/{slug}` | `events.show` | `Public\EventController@show` | |
| GET | `/blog` | `blog.index` | `Public\BlogController@index` | |
| GET | `/blog/{slug}` | `blog.show` | `Public\BlogController@show` | |
| GET | `/sobre-nosotros` | `about.index` | `Public\AboutController@index` | |
| GET | `/contacto` | `contact.index` | `Public\ContactController@index` | |
| POST | `/contacto` | `contact.send` | `Public\ContactController@send` | |
| GET | `/health` | `health` | closure JSON | `{"status":"ok"}` |

## 2. Autenticación, adoptante y utilidades (`routes/web.php`)

### 2.1 OAuth y utilidades
| Método | Ruta | Nombre | Controlador | Auth |
|---|---|---|---|---|
| GET | `/auth/google` | `google.login` | `Auth\SocialLoginController@redirectToGoogle` | no |
| GET | `/auth/google/callback` | `google.callback` | `Auth\SocialLoginController@handleGoogleCallback` | no |
| POST | `/api/chatbot/ask` | `chatbot.ask` | `Public\ChatbotController@ask` | no (público según ruta) |
| POST | `/api/dni/lookup` | `dni.lookup` | `Api\DniController@lookup` | no explícito en ruta |
| GET | `/dashboard` | `dashboard` | closure redirect | `auth`,`verified` |

### 2.2 Área adoptante `/mi-adopcion` (prefijo, `auth`,`verified`, nombre `adopter.*`)
| Método | Ruta | Nombre | Controlador |
|---|---|---|---|
| GET | `/mi-adopcion` | `adopter.dashboard` | `Adopter\DashboardController@index` |
| GET | `/mi-adopcion/inicio` | `adopter.dashboard.index` | `Adopter\DashboardController@index` |
| GET | `/mi-adopcion/postulaciones` | `adopter.applications.index` | `Adopter\ApplicationController@index` |
| GET | `/mi-adopcion/mascotas` | `adopter.pets.index` | `Adopter\PetController@index` |
| GET | `/mi-adopcion/mascotas/publicar` | `adopter.pets.create` | `Adopter\PetController@create` |
| POST | `/mi-adopcion/mascotas` | `adopter.pets.store` | `Adopter\PetController@store` |
| DELETE | `/mi-adopcion/mascotas/{pet}` | `adopter.pets.destroy` | `Adopter\PetController@destroy` |
| GET | `/mi-adopcion/mascotas-perdidas` | `adopter.lost-pets.index` | `Adopter\LostPetController@index` |
| GET | `/mi-adopcion/mascotas-perdidas/{lostPet}/editar` | `adopter.lost-pets.edit` | `Adopter\LostPetController@edit` |
| PUT | `/mi-adopcion/mascotas-perdidas/{lostPet}` | `adopter.lost-pets.update` | `Adopter\LostPetController@update` |
| DELETE | `/mi-adopcion/mascotas-perdidas/{lostPet}` | `adopter.lost-pets.destroy` | `Adopter\LostPetController@destroy` |
| GET | `/mi-adopcion/veterinarias` | `adopter.veterinarians.index` | `Public\VeterinarianController@index` |
| GET | `/mi-adopcion/veterinarias/{id}` | `adopter.veterinarians.show` | `Public\VeterinarianController@show` |
| POST | `/mi-adopcion/veterinarias/agregar` | `adopter.veterinarians.store` | `Public\VeterinarianController@store` |
| POST | `/mi-adopcion/veterinarias/{id}/calificar` | `adopter.veterinarians.rate` | `Public\VeterinarianController@rate` |
| GET | `/mi-adopcion/albergues` | `adopter.albergues.index` | `Public\AlbergueController@index` |
| GET | `/mi-adopcion/albergues/{slug}` | `adopter.albergues.show` | `Public\AlbergueController@show` |
| POST | `/mi-adopcion/albergues/{slug}/calificar` | `adopter.albergues.rate` | `Public\AlbergueController@rate` |
| GET | `/mi-adopcion/seguimientos` | `adopter.follow-ups.index` | `Adopter\FollowUpReportController@index` |
| GET | `/mi-adopcion/seguimientos/{followUp}` | `adopter.follow-ups.show` | `Adopter\FollowUpReportController@show` |
| POST | `/mi-adopcion/seguimientos/{followUp}/reportar` | `adopter.follow-ups.report` | `Adopter\FollowUpReportController@report` |

### 2.3 Postulación e invitaciones
| Método | Ruta | Nombre | Middleware | Controlador |
|---|---|---|---|---|
| POST | `/mascotas/{slug}/postular` | `pets.apply` | `auth`,`verified` | `Adopter\ApplicationController@store` |
| GET | `/invitations/{invitation}/accept` | `invitations.accept` | `auth` | `Teams\TeamInvitationController@accept` |

### 2.4 Panel por equipo `/{current_team}` (`auth`,`verified`,`EnsureTeamMembership`)
| Método | Ruta | Nombre | Controlador/acción |
|---|---|---|---|
| GET | `/{team}/dashboard` | (sin nombre en código mostrado) | closure Inertia `Dashboard` con stats |
| GET | `/{team}/mascotas` | `teams.pets.index` | `Teams\PetController@index` |
| GET | `/{team}/mascotas/crear` | `teams.pets.create` | `Teams\PetController@create` |
| POST | `/{team}/mascotas` | `teams.pets.store` | `Teams\PetController@store` |
| GET | `/{team}/mascotas/{id}` | `teams.pets.show` | `Teams\PetController@show` |
| GET | `/{team}/mascotas/{id}/editar` | `teams.pets.edit` | `Teams\PetController@edit` |
| PUT | `/{team}/mascotas/{id}` | `teams.pets.update` | `Teams\PetController@update` |
| DELETE | `/{team}/mascotas/{id}` | `teams.pets.destroy` | `Teams\PetController@destroy` |
| GET | `/{team}/adopciones` | `teams.adoptions.index` | `Dashboard\AdoptionController@index` |
| GET | `/{team}/adopciones/{adoption}` | `teams.adoptions.show` | `Dashboard\AdoptionController@show` |
| POST | `/{team}/adopciones/{adoption}/aprobar` | `teams.adoptions.approve` | `Dashboard\AdoptionController@approve` |
| POST | `/{team}/adopciones/{adoption}/rechazar` | `teams.adoptions.reject` | `Dashboard\AdoptionController@reject` |
| GET | `/{team}/seguimientos` | `teams.follow-ups.index` | `Dashboard\FollowUpController@index` |
| GET | `/{team}/seguimientos/{followUp}` | `teams.follow-ups.show` | `Dashboard\FollowUpController@show` |
| POST | `/{team}/seguimientos/{followUp}/completar` | `teams.follow-ups.complete` | `Dashboard\FollowUpController@markCompleted` |
| POST | `/{team}/seguimientos/{followUp}/no-realizado` | `teams.follow-ups.missed` | `Dashboard\FollowUpController@markMissed` |
| POST | `/{team}/seguimientos` | `teams.follow-ups.schedule` | `Dashboard\FollowUpController@schedule` |
| GET/POST/GET/GET/PUT/DELETE | `/{team}/blog...` | `teams.blog.*` | `Dashboard\BlogPostController` CRUD |
| GET/POST/GET/GET/PUT/DELETE | `/{team}/eventos...` | `teams.events.*` | `Dashboard\EventController` CRUD |
| GET/PUT | `/{team}/perfil` | `teams.profile.*` | `Teams\TeamProfileController` |
| GET | `/{team}/miembros` | `teams.members.index` | closure Inertia |
| GET/POST/DELETE | `/{team}/veterinarias...` | `teams.veterinarians.*` | `Teams\VeterinarianController` |

## 3. Administración `/admin` (`auth`,`verified`,`admin`)

| Grupo | Rutas principales | Controlador |
|---|---|---|
| Dashboard/Perfil | `/`, `/perfil` | `Admin\DashboardController`, `Admin\ProfileController` |
| Roles | `/roles`, `/roles/{role}` | `Admin\RoleManagementController` |
| Usuarios | CRUD + `role`, `membership` add/remove/update | `Admin\UserController` |
| Mascotas | CRUD | `Admin\PetController` |
| Organizaciones | CRUD | `Admin\OrganizationController` |
| Eventos | CRUD | `Admin\EventController` |
| Blog | CRUD | `Admin\BlogPostController` |
| Adopciones | index/show | `Admin\AdoptionController` |
| Seguimientos | CRUD | `Admin\FollowUpController` |
| Veterinarias | index, toggle verificación, delete | `Admin\VeterinarianController` |
| Albergues | index | `Admin\AlbergueController` |

## 4. Configuración (`routes/settings.php`, `auth` y en parte `verified`)

| Método | Ruta | Nombre | Controlador/acción |
|---|---|---|---|
| GET | `/settings/profile` | `profile.edit` | `Settings\ProfileController@edit` |
| PATCH | `/settings/profile` | `profile.update` | `Settings\ProfileController@update` |
| DELETE | `/settings/profile` | `profile.destroy` | `Settings\ProfileController@destroy` (`verified`) |
| GET | `/settings/security` | `security.edit` | `Settings\SecurityController@edit` (`RequirePassword`) |
| PUT | `/settings/password` | `user-password.update` | `Settings\SecurityController@update` (throttle 6,1) |
| GET | `/settings/appearance` | `appearance.edit` | Inertia `settings/Appearance` |
| GET/POST | `/settings/teams` | `teams.index/store` | `Teams\TeamController` |
| GET/PATCH/DELETE/POST | `/settings/teams/{team}*` | `teams.edit/update/destroy/switch` | `Teams\TeamController` (`EnsureTeamMembership`) |
| PATCH/DELETE | `.../members/{user}` | `teams.members.*` | `Teams\TeamMemberController` |
| POST/DELETE | `.../invitations*` | `teams.invitations.*` | `Teams\TeamInvitationController` |

## 5. Endpoints tipo API/JSON (detectados)

| Endpoint | Formato esperado | Propósito |
|---|---|---|
| `GET /health` | JSON | Estado básico |
| `POST /api/chatbot/ask` | JSON request/response (según frontend `ChatbotWidget`) | Respuesta de chatbot por reglas |
| `POST /api/dni/lookup` | JSON (según servicio/controlador) | Consulta DNI externa |

## 6. Observaciones

- **Route model binding/params mixtos:** equipos por slug en URL `{current_team}`, mascotas de equipo por `{id}` en algunas rutas y por slug en público/postulación; requiere normalización en reconstrucción.
- **Rutas Fortify:** no listadas explícitamente en archivos auditados aquí; se registran por proveedor Fortify (verificar `config/fortify.php`, `FortifyServiceProvider`).
- **Wayfinder:** frontend consume rutas tipadas generadas (`resources/js/routes`, `resources/js/actions`), reflejo del contrato servidor-cliente actual.
