# Manual de Usuario — Wasiyuq

---

## 1. Introducción

**Wasiyuq** (del quechua: *"el que tiene casa"*) es una plataforma web que conecta albergues, municipalidades y ONGs con ciudadanos para facilitar la **adopción responsable de mascotas** en Cusco, Perú.

Este manual explica todas las funcionalidades disponibles para cada tipo de usuario.

---

## 2. Páginas públicas (sin necesidad de registro)

### 2.1. Inicio (`/`)

La página principal muestra:

- **Hero** con buscador rápido de mascotas por raza, especie o ubicación.
- **Filtros por especie**: Perros, Gatos, Conejos, Aves, Otros.
- **Estadísticas animadas**: mascotas adoptadas, entidades verificadas, mascotas disponibles.
- **Especies disponibles**: cards con cantidad de mascotas por especie.
- **Sección "¿Cómo funciona?"**: 3 pasos (Explora → Postula → Adopta).
- **Mascotas recién llegadas**: grid con las últimas mascotas publicadas.
- **Aliados estratégicos**: organizaciones que respaldan la plataforma.
- **Preguntas frecuentes** (FAQ): requisitos, costos, confianza, seguimiento.
- **CTA final**: invita a registrar una entidad.

### 2.2. Mascotas en adopción (`/mascotas`)

Listado completo con:

- **Buscador** por nombre o raza (con debounce).
- **Filtros por especie**: pills con conteo.
- **Filtros**: tamaño (Pequeño/Mediano/Grande), sexo (Hembra/Macho).
- **Ordenamiento**: Más recientes, Más antiguos, Por compatibilidad (requiere inicio de sesión).
- **Paginación**: con números de página.
- **Badge de compatibilidad**: si el usuario inició sesión, muestra qué tan compatible es con cada mascota.
- **Cada tarjeta**: foto, nombre, especie, raza, edad, tamaño, ubicación de la entidad.

### 2.3. Perfil de mascota (`/mascotas/{slug}`)

Página detallada de cada mascota:

- **Galería de fotos** con lightbox: click para ampliar, navegación entre fotos, zoom.
- **Datos**: nombre, especie, raza, edad, tamaño, sexo, color.
- **Estado**: Disponible, En Proceso, Adoptado, Reservado.
- **Descripción** de la mascota.
- **Notas médicas** (si aplica).
- **Organización responsable**: nombre, ubicación, teléfono.
- **Botón "Quiero adoptarlo"**: abre formulario de postulación (requiere inicio de sesión).
- **Formulario de adopción** con secciones:
  - Motivación y vínculo
  - Tu hogar (tipo de vivienda, patio, propiedad)
  - Tu familia (composición, niños, otras mascotas)
  - Estilo de vida (horas solo, experiencia, plan veterinario)
  - Compromiso de adopción responsable

### 2.4. Mascotas perdidas (`/mascotas-perdidas`)

- **Buscador** por nombre, raza o ubicación.
- **Filtros**: especie, estado (Perdido/Encontrado).
- **Botón "Reportar mascota"**: abre formulario para reportar.
- **Formulario de reporte**:
  - Tipo: Perdí / Encontré
  - Especie, nombre, raza, color, tamaño
  - Edad aproximada, fecha, última ubicación
  - Descripción, teléfono, correo de contacto
- **Cada tarjeta**: foto, estado (Perdido/Encontrado), especie, nombre, raza, ubicación, fecha.

### 2.5. Eventos (`/eventos`)

- **Calendario** de campañas de adopción, ferias, talleres y recaudaciones.
- **Buscador** de eventos.
- **Filtro por tipo**: Feria de Adopción, Recaudación, Taller, Campaña.
- **Cada tarjeta**: fecha, título, descripción, ubicación, días restantes.
- **Paginación**.

### 2.6. Blog (`/blog`)

- **Artículos** sobre bienestar animal, adopción, salud, normativas e historias.
- **Buscador** de artículos.
- **Filtro por categoría**: Todas, Adopción, Salud animal, Normativas, Historias.
- **Cada tarjeta**: cover, tiempo de lectura, categoría, título, extracto, autor, fecha.
- **Paginación**.

### 2.7. Sobre nosotros (`/sobre-nosotros`)

Información institucional de Wasiyuq: misión, aliados, equipo.

### 2.8. Contacto (`/contacto`)

- **Formulario de contacto**: nombre, correo, asunto, mensaje.
- **Asuntos**: Adopción, Mi entidad, Reportar un problema, Otro.
- **Información de contacto**: email `info@wasiyuq.pe`, ubicación Cusco, tiempo de respuesta.
- Si se accede desde una mascota, el formulario se precarga con los datos de esa mascota.

---

## 3. Registro e inicio de sesión

### 3.1. Crear cuenta (`/register`)

Campos del formulario:

1. **DNI** (opcional): permite autocompletar nombre desde RENIEC.
2. **Nombre completo**.
3. **Correo electrónico**.
4. **WhatsApp** (opcional): para que las organizaciones te contacten.
5. **Contraseña**.
6. **Confirmar contraseña**.

**Registro con Google**: botón "Registrarse con Google" para autenticación social.

### 3.2. Iniciar sesión (`/login`)

- Correo electrónico y contraseña.
- Enlace "Olvidaste tu contraseña".
- **Passkeys / WebAuthn**: si configuraste una llave de acceso, puedes iniciar sesión con tu huella, rostro o PIN del dispositivo.
- **Autenticación en dos pasos (2FA)**: si está habilitada, se solicita un código TOTP después de la contraseña.

### 3.3. Recuperar contraseña

1. Ir a "Olvidaste tu contraseña".
2. Ingresar el correo electrónico.
3. Recibir un enlace para restablecer la contraseña.
4. Crear una nueva contraseña.

---

## 4. Panel del adoptante

Rol: **adopter** — ciudadano que postula a adopciones.

### 4.1. Acceso

Una vez iniciada la sesión, el menú muestra enlace al **Dashboard del adoptante** (`/mi-adopcion`).

### 4.2. Dashboard (`/mi-adopcion`)

- **Mascotas recomendadas**: basadas en compatibilidad.
- **Resumen**: total de postulaciones, pendientes, aprobadas, seguimientos pendientes.
- **Últimas postulaciones**: lista de solicitudes recientes con su estado.
- **Acceso rápido**:
  - Mis Postulaciones
  - Mi Seguimiento
  - Buscar mascotas

### 4.3. Mis postulaciones (`/mi-adopcion/postulaciones`)

- Estadísticas: Total, Pendientes, Aprobadas, Completadas.
- Lista de todas las solicitudes enviadas.
- Cada postulación muestra: foto de la mascota, nombre, especie, fecha, estado (Pendiente/Aprobada/Rechazada/Completada/Cancelada), motivación.

### 4.4. Seguimiento post-adopción (`/mi-adopcion/seguimientos`)

Una vez que la adopción es completada, puedes:

- Ver el historial de seguimientos realizados por la entidad.
- Recibir notificaciones de visitas de seguimiento.
- Reportar novedades sobre la mascota.

---

## 5. Panel de entidades (organizaciones)

Roles: **entity_admin**, **entity_member**, **municipality_admin**.

### 5.1. Dashboard (`/{team}/dashboard`)

- Resumen de métricas de la organización.
- Acceso rápido a todas las secciones de gestión.

### 5.2. Gestión de mascotas (`/{team}/mascotas`)

- **Listado**: todas las mascotas de la entidad con filtros y búsqueda.
- **Crear mascota**: formulario con foto, nombre, especie, raza, edad, tamaño, color, descripción, notas médicas.
- **Editar mascota**: actualizar datos y fotos.
- **Ver perfil**: vista pública de la mascota.
- **Estado**: Disponible, En Proceso, Adoptado, Reservado.

### 5.3. Solicitudes de adopción (`/{team}/adopciones`)

- Lista de postulaciones recibidas.
- **Filtros por estado**: Pendiente, Aprobada, Rechazada, Completada.
- **Ver detalle**: información del postulante y su formulario.
- **Aprobar o rechazar** solicitudes.
- **Completar adopción**: marcar como adoptada y generar certificado.

### 5.4. Seguimiento (`/{team}/seguimientos`)

- **Crear seguimiento**: registrar visitas y novedades de mascotas adoptadas.
- **Historial**: ver todos los seguimientos realizados.
- **Recordatorios**: cada 3 meses durante el primer año.

### 5.5. Eventos (`/{team}/eventos`)

- **Crear evento**: feria de adopción, taller, campaña, recaudación.
- Campos: título, descripción, fecha, ubicación, tipo, imagen de portada.
- **Editar y eliminar** eventos.

### 5.6. Blog (`/{team}/blog`)

- **Crear artículo**: título, contenido, extracto, categoría, tags, imagen de portada.
- **Editar y eliminar** artículos.
- Categorías: Adopción, Salud animal, Normativas, Historias.

### 5.7. Miembros del equipo (`/{team}/members`)

- Invitar nuevos miembros por email.
- Roles disponibles: entity_admin, entity_member.
- Cancelar invitaciones pendientes.
- Eliminar miembros.

---

## 6. Panel de Super Admin

Rol: **super_admin**.

### 6.1. Dashboard (`/admin`)

- Métricas globales de la plataforma: usuarios, mascotas, adopciones, entidades.

### 6.2. Usuarios (`/admin/users`)

- CRUD completo de usuarios.
- Asignación de roles (super_admin, adopter, veterinarian).
- Ver perfil de cada usuario.

### 6.3. Mascotas (`/admin/pets`)

- Listado global de todas las mascotas de la plataforma.
- Crear, editar y eliminar mascotas de cualquier entidad.

### 6.4. Entidades / Organizaciones (`/admin/organizations`)

- Verificar nuevas entidades.
- Editar información de entidades.
- Aprobar o rechazar solicitudes de registro.

### 6.5. Adopciones (`/admin/adoptions`)

- Listado global de todas las solicitudes de adopción.
- Ver detalle y estado.

### 6.6. Seguimientos (`/admin/follow-ups`)

- Gestión global de seguimientos post-adopción.
- Crear, editar seguimientos.

### 6.7. Roles (`/admin/roles`)

- Gestión de roles y permisos del sistema.

### 6.8. Eventos (`/admin/events`)

- CRUD global de eventos de todas las entidades.

### 6.9. Blog (`/admin/blog`)

- CRUD global de artículos de todas las entidades.

### 6.10. Perfil de admin (`/admin/profile`)

- Configuración de perfil del super admin.

---

## 7. Asistente virtual (Chatbot)

En todas las páginas públicas, un botón flotante abre un **asistente virtual** que puede responder preguntas sobre:

- Proceso de adopción
- Requisitos necesarios
- Costos de la plataforma
- Cómo registrar una organización
- Soporte técnico

El chatbot se conecta a un backend de IA para dar respuestas contextuales.

---

## 8. Configuración de la cuenta

### 8.1. Perfil (`/settings/profile`)

- Editar nombre, correo, WhatsApp.
- Verificar correo electrónico.

### 8.2. Seguridad (`/settings/security`)

- **Cambiar contraseña**.
- **Autenticación en dos pasos (2FA / TOTP)**: habilitar/deshabilitar, generar códigos de recuperación.
- **Passkeys / WebAuthn**: registrar llaves de acceso (huella, rostro, PIN del dispositivo).

### 8.3. Apariencia (`/settings/appearance`)

- **Modo claro**: tema por defecto.
- **Modo oscuro**: interfaz con colores invertidos.
- **Modo sistema**: sigue la configuración del dispositivo.

---

## 9. Mascotas perdidas — Reportar

Desde `/mascotas-perdidas`, cualquier persona (sin registro) puede reportar una mascota como:

- **Perdí una mascota**: se escapó o desapareció.
- **Encontré una mascota**: está en la calle o perdida.

El formulario pide: especie, nombre, raza, color, tamaño, edad, fecha, ubicación, descripción, contacto. Una vez publicado, el reporte aparece en el listado público para que otros puedan ayudar.

---

## 10. PWA (Progressive Web App)

Wasiyuq se puede **instalar como una app** en el celular o computadora:

1. Abrir `wasiyuq.pe` en Chrome, Edge o Safari.
2. Esperar que aparezca el banner de instalación, o ir a:
   - **Android**: Menú → "Instalar app".
   - **iOS**: Compartir → "Agregar a pantalla de inicio".
3. La app funciona **offline** para contenido estático.
4. Recibe **notificaciones push** de actualizaciones.

---

## 11. Roles y permisos

| Rol | Descripción |
|-----|-------------|
| `super_admin` | Administra toda la plataforma, verifica entidades, gestiona usuarios. |
| `municipality_admin` | Gestiona mascotas y eventos de su municipalidad. |
| `entity_admin` | Gestiona mascotas, adopciones, eventos y blog de su albergue/ONG. |
| `entity_member` | Miembro de entidad con permisos limitados. |
| `adopter` | Ciudadano que postula a adopciones y da seguimiento. |
| `veterinarian` | Profesional que valida registros médicos. |

---

## 12. Preguntas frecuentes

**¿Cuáles son los requisitos para adoptar?**
Ser mayor de edad, contar con DNI vigente, tener espacio adecuado para la mascota y firmar un compromiso de adopción responsable.

**¿La plataforma tiene algún costo?**
Wasiyuq es completamente gratuito para adoptantes. Las entidades pueden publicar mascotas sin costo.

**¿Cómo sé que una entidad es confiable?**
Todas las entidades pasan por un proceso de verificación documental y de campo.

**¿Qué pasa si la adopción no funciona?**
Wasiyuq realiza seguimiento durante los primeros 12 meses. El equipo de soporte guía para encontrar la mejor solución.

**¿Puedo adoptar si vivo fuera de Cusco?**
Sí, siempre que puedas trasladarte a Cusco para conocer a la mascota y completar el proceso.

---

## 13. Contacto y soporte

- **Correo**: info@wasiyuq.pe
- **WhatsApp**: +51 944 480 535
- **Twitter / X**: @wasiyuq
- **Web**: https://wasiyuq.pe
- **Tiempo de respuesta**: 24 a 48 horas hábiles.
