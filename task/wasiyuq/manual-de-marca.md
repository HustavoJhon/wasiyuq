# Manual de Marca — Wasiyuq

---

## 1. Introducción

**Wasiyuq** (del quechua: *"el que tiene casa"*) es una plataforma web que conecta municipalidades, albergues, ONGs y ciudadanos para facilitar la adopción responsable de mascotas en **Cusco, Perú**.

El nombre refleja el propósito central de la plataforma: encontrar un hogar para cada mascota. La identidad visual combina la calidez de la cultura andina con la confianza y profesionalismo de una plataforma tecnológica moderna.

---

## 2. Logotipo

### 2.1. Isologo (principal)

Composición: icono cuadrado verde con el símbolo de la mascota + texto "Wasiyuq" a la derecha.

```
[ 🟩 ] Wasiyuq
```

- **Icono**: cuadrado de 32×32px, fondo `#2D6A4F`, símbolo de rostro de mascota (perro/gato) en blanco.
- **Tipografía**: Instrument Sans, semibold.
- **Uso**: header del sitio web, app, documentos oficiales.

### 2.2. Imagotipo (solo icono)

El SVG del rostro de mascota (`AppLogoIcon.vue`) en un viewBox de 32×32. Representa un rostro estilizado de perro/gato con orejas puntiagudas, ojos, hocico y dos huellas circulares superiores.

- **Uso**: favicon, avatar, app móvil, favicon, PWA icons.
- **Color**: blanco sobre fondo verde `#2D6A4F`, o `currentColor` cuando se hereda del contenedor.

### 2.3. Área de resguardo

Mantener un espacio mínimo equivalente al 10% del ancho del logotipo en todos sus lados. Nunca colocar elementos gráficos o texto dentro de esta área.

### 2.4. Usos incorrectos

- No deformar, rotar ni distorsionar el logotipo.
- No cambiar los colores del logotipo.
- No aplicar sombras excesivas ni efectos 3D.
- No colocar sobre fondos que comprometan el contraste (verificar WCAG AA).
- No separar el icono del texto en el isologo.

---

## 3. Paleta de colores

### 3.1. Colores primarios

| Color | HEX | HSL | Uso |
|-------|-----|-----|-----|
| Verde oscuro | `#2D6A4F` | `hsl(153, 40%, 30%)` | Color principal de marca. Botones primarios, fondo de logo, nav activa, enlaces, theme-color PWA. |
| Verde más oscuro | `#1B4332` | – | Gradientes profundos, hover de botones, CTA footer. |
| Verde claro | `#40916C` | – | Gradientes secundarios, acentos. |
| Verde hover | `#246142` | – | Hover de botones primarios. |

### 3.2. Modo claro

| Variable | HSL | Descripción |
|----------|-----|-------------|
| `--background` | `hsl(0, 0%, 100%)` | Fondo principal |
| `--foreground` | `hsl(0, 0%, 3.9%)` | Texto principal |
| `--primary` | `hsl(153, 40%, 30%)` | Verde `#2D6A4F` |
| `--primary-foreground` | `hsl(0, 0%, 98%)` | Texto sobre primary |
| `--secondary` | `hsl(153, 20%, 92%)` | Fondo secundario (verde pálido) |
| `--secondary-foreground` | `hsl(153, 40%, 15%)` | Texto sobre secondary |
| `--accent` | `hsl(153, 30%, 92%)` | Acento verde claro |
| `--muted` | `hsl(0, 0%, 96.1%)` | Fondo tenue |
| `--border` | `hsl(0, 0%, 89.8%)` | Bordes |
| `--ring` | `hsl(153, 40%, 30%)` | Anillo de foco |
| `--destructive` | `hsl(0, 84.2%, 60.2%)` | Rojo de alerta |
| `--radius` | `0.5rem` | Radio de borde base |

### 3.3. Modo oscuro

| Variable | HSL | Descripción |
|----------|-----|-------------|
| `--background` | `hsl(0, 0%, 3.9%)` | Fondo casi negro |
| `--foreground` | `hsl(0, 0%, 98%)` | Texto claro |
| `--primary` | `hsl(153, 40%, 60%)` | Verde más claro para contraste sobre fondo oscuro |
| `--secondary` | `hsl(153, 20%, 14.9%)` | Fondo secundario oscuro |

### 3.4. Colores de apoyo

| Color | HEX | Uso |
|-------|-----|-----|
| Rojo alerta | `#DC2626` | Mascotas perdidas, errores, destructive |
| Verde WhatsApp | `#25D366` | Icono de WhatsApp social |
| Verde chart 1 | `hsl(153, 60%, 40%)` | Gráficos y visualizaciones |
| Teal chart 2 | `hsl(173, 58%, 39%)` | Gráficos |
| Azul chart 3 | `hsl(197, 37%, 24%)` | Gráficos |
| Amarillo chart 4 | `hsl(43, 74%, 66%)` | Gráficos |
| Naranja chart 5 | `hsl(27, 87%, 67%)` | Gráficos |

### 3.5. Contraste y accesibilidad

- Todo el texto debe cumplir WCAG AA (relación de contraste ≥ 4.5:1 para texto normal, ≥ 3:1 para texto grande).
- El verde `#2D6A4F` sobre blanco cumple AA para texto normal.
- En modo oscuro, el primary se aclara a `hsl(153, 40%, 60%)` para mantener contraste.

---

## 4. Tipografía

### 4.1. Fuente principal

**Instrument Sans** (cargada desde fonts.bunny.net)

| Propiedad | Valor |
|-----------|-------|
| Nombre | Instrument Sans |
| Pesos | 400 (regular), 500 (medium), 600 (semibold) |
| CSS Variable | `--font-sans` |
| Fallback | `ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'` |

### 4.2. Aplicación

- **Títulos**: Instrument Sans semibold (600)
- **Cuerpo**: Instrument Sans regular (400)
- **Nav y botones**: Instrument Sans medium (500)
- **Monospace**: `font-mono` para badges, etiquetas y código

### 4.3. Tamaños referenciales

| Elemento | Tamaño | Peso |
|----------|--------|------|
| Título página (h1) | `text-4xl` / `text-5xl` | Semibold |
| Subtítulo (h2) | `text-2xl` / `text-3xl` | Semibold |
| Cuerpo | `text-sm` / `text-base` | Regular |
| Nav link | `text-sm` | Medium |
| Badge | `text-xs` | Medium |
| Footer | `text-xs` / `text-sm` | Regular |

---

## 5. Voz y tono

### 5.1. Voz

- **Idioma**: Español variante Perú (`es_PE`)
- **Personalidad**: Cálida, profesional, compasiva, cercana
- **Valores**: Responsabilidad, transparencia, amor por los animales, compromiso social
- **Cultura**: Orgullosamente cusqueña, con raíces quechuas

### 5.2. Tono por contexto

| Contexto | Tono |
|----------|------|
| Home / marketing | Inspirador, emotivo, acogedor |
| Listado de mascotas | Informativo, claro, esperanzador |
| Perfil de mascota | Cálido, descriptivo, personal |
| Dashboard / admin | Profesional, eficiente, neutral |
| Notificaciones / emails | Cordial, claro, empático |
| Errores / alertas | Directo, útil, sin alarmismo |
| Redes sociales | Cercano, conversacional, positivo |

### 5.3. Frases clave

- *"Wasiyuq — Adopción responsable en Cusco"*
- *"El que tiene casa"* (significado del nombre)
- *"Conectamos mascotas con familias responsables"*
- *"Hecho con ♥ para las mascotas de Cusco"*

---

## 6. Aplicaciones

### 6.1. Web

- **URL**: `https://wasiyuq.pe`
- **PWA**: Instalable, offline, responsive.
- **Meta title**: `Wasiyuq — Adopción responsable en Cusco`
- **Meta description**: `Plataforma de adopción responsable de mascotas en Cusco, Perú.`
- **OG image**: `/icons/og-image.png`
- **Idioma**: `es_PE`

### 6.2. App nativa (Android)

- **App ID**: `pe.wasiyuq.app`
- **Nombre**: `Wasiyuq`
- **Splash screen**: Fondo `#2D6A4F`, spinner blanco.
- **Icono notificación**: Color `#2D6A4F`.
- **Icons**: 72×72 hasta 512×512, incluyendo maskable.

### 6.3. Email

- **Nombre remitente**: Wasiyuq
- **Dirección**: `info@wasiyuq.pe`
- **HTML**: Estilo verde `#2D6A4F`, bordes redondeados, tipografía Instrument Sans.

### 6.4. Redes sociales

| Plataforma | Handle |
|------------|--------|
| Twitter / X | `@wasiyuq` |

### 6.5. Contacto

- **Email**: `info@wasiyuq.pe`
- **WhatsApp**: `+51 944 480 535`

---

## 7. Favoritos y PWA

### 7.1. Favicon

- **SVG**: `favicon.svg` — cuadrado verde `#2D6A4F` con icono blanco.
- **ICO**: `favicon.ico` — versión legacy.
- **Apple touch icon**: `apple-touch-icon.png`

### 7.2. PWA Manifest

| Campo | Valor |
|-------|-------|
| `theme_color` | `#2D6A4F` |
| `background_color` | `#ffffff` |
| `display` | `standalone` |
| `lang` | `es` |
| `categories` | `lifestyle, social` |
| `shortcuts` | Mascotas (`/mascotas`), Eventos (`/eventos`) |

### 7.3. OG Image

- **Archivo**: `/icons/og-image.png`
- **Uso**: Open Graph, Twitter Cards (`summary_large_image`)

---

## 8. Componentes visuales

### 8.1. Bordes y radios

- **Radio base**: `0.5rem` (8px) — `--radius`
- **Botones**: `rounded-lg` o `rounded-xl`
- **Navbar**: `rounded-[36px]`
- **Tarjetas**: `rounded-xl` o `rounded-2xl`
- **Inputs**: `rounded-lg`

### 8.2. Sombras

- **Navbar**: `shadow-md`
- **Tarjetas**: `shadow-sm` / `shadow-md`
- **CTA footer**: `shadow-lg shadow-black/10`
- **Hover de botones**: `hover:shadow-xl`

### 8.3. Gradientes

- **Footer CTA**: `bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#40916C]`
- **Sidebar logo**: `from-[#2D6A4F] to-[#40916C]`

### 8.4. Iconos

- **Librería**: Lucide Vue Next
- **Estilo**: Outline, stroke-width 2, `h-4 w-4` o `h-5 w-5`
- **Color**: `currentColor` o color semántico

---

## 9. Modo oscuro

Wasiyuq soporta modo oscuro nativo con detección `prefers-color-scheme: dark` y persistencia manual. Los colores primarios se aclaran en modo oscuro para mantener contraste accesible. Todos los componentes deben probarse en ambos modos.

---

## 10. SEO y metadatos

- **Schema.org**: `Organization` + `WebSite` con `SearchAction`
- **JSON-LD**: Por página según contenido (pets, events, blog)
- **Canonical**: Siempre presente
- **Open Graph**: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale: es_PE`, `og:site_name: Wasiyuq`
- **Twitter Cards**: `summary_large_image`
- **Sitemap**: `/sitemap.xml` generado dinámicamente

---

## 11. Recursos técnicos

| Archivo | Propósito |
|---------|-----------|
| `resources/css/app.css` | Design tokens y variables CSS |
| `resources/js/components/AppLogoIcon.vue` | SVG del isologo |
| `resources/js/components/AppLogo.vue` | Isologo + texto |
| `vite.config.ts` | PWA manifest |
| `public/favicon.svg` | Favicon principal |
| `public/icons/` | PWA icons, OG image, screenshots |
| `public/images/hero-*.webp` | Imágenes hero del home |
| `capacitor.config.ts` | Config app nativa |

---

## 12. Licencia

Wasiyuq está licenciado bajo **Apache 2.0** © 2026 Gustavo Jhons.
