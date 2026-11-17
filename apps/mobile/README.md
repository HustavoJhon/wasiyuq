# @wasiyuq/mobile

Workspace preparado para React Native + Expo. La implementación funcional móvil se realizará en fases posteriores.

## Autenticación (planificada)

La app usará la misma API y las mismas sesiones que la web, sin cambios de autorización:

- Cliente `better-auth` en la **misma versión fijada que el servidor (1.7.15)** con el plugin oficial `@better-auth/expo`
  (sesión en `expo-secure-store`, OAuth por deep link con el `scheme` de la app añadido a `AUTH_TRUSTED_ORIGINS`).
- Las peticiones de la app no llevan `Origin` de navegador: se habilitará un canal explícito (plugin `bearer`,
  cabecera `Authorization`) para no relajar la protección CSRF de la web.
- Contratos y cliente tipado compartidos: `@wasiyuq/validation` y `@wasiyuq/api-client`.

Detalle: `docs/technical/AUTHENTICATION.md` §6.
