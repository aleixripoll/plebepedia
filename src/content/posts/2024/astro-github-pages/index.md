---
title: "Astro en GitHub Pages"
slug: astro-github-pages
description: "Cómo cambiar de base URL sin morir en el intento."
authors: ["Dra. Valina"]
image: "./pexels-khizar-hayat-1114703.jpg"
categories: ["tecnología"]
tags: ["astro", "github pages", "deployment"]
draft: false
date: 2024-02-20T07:00:00Z
---

<span class="attribution">Foto de Khizar Hayat en [Pexels](https://www.pexels.com/photo/gray-keypad-1114703/)</span>

Entrada un poco meta, vamos a hablar de algunos problemillas que encontré desplegando este sitio en Github Pages.

Este blog ha sido generado con [Astro](https://astro.build/). Existe una guía oficial para [desplegar en Github Pages](https://docs.astro.build/en/guides/deploy/github/), pero, al contrario que otros SSG como **Jekyll** o **Hugo**, no es trivial mover el sitio entre el root repo (`usuario.github.io`) y uno non-root (`usuario.github.io/repo`). En mi caso, usar un non-root me generaba un montón de enlaces rotos, así que inicialmente lo dejé en el root y más tarde seguí este proceso para moverlo al non-root:

1. Editar `base` en `astro.config.mjs` para indicar que el root del sitio está ahora en un subpath:

```
export default defineConfig(
  site: "https://usuario.github.io",
  base: "/repo",
  ...
}
```

2. Actualizar todos los enlaces para incluir el prefijo, accesible en la variable de entorno `import.meta.env.BASE_URL`. Puede ser bastante tedioso encontrarlos y cambiarlos todos, quedaría algo así:
```
<a href={`${import.meta.env.BASE_URL}/${post.slug}`} ... />
```

El problema viene si quieres que tu sitio pueda moverse entre root y non-root: con un repo root Astro setea `base: "/"`, en el ejemplo anterior el enlace ahora quedaría como `//${post.slug}` (doble barra), lo cual rompe la generación de enlaces en Astro.

Para solucionarlo tuve que:

3. Añadir trailing slash a `base`, por ejemplo `/repo/`. Ahora tanto en root como en non-root, nuestro `base` acaba en barra.

4. Quitar la barra después de `base` en todos los enlaces:
```
<a href={`${import.meta.env.BASE_URL}${post.slug}`} ... />
```

5. Utilizar `trailingSlash: "ignore"`. Con `"never"`, quitará nuestro trailing slash de `base` y no quedará ninguno, rompiendo la generación de enlaces otra vez. Con `"always"`, todos los enlaces que no acaben en barra devolverán un 404.


Ahora ya podemos mover nuestro sitio cambiando sólo `base`.

Otro detalle a tener en cuenta: si tenemos contenido en `/public` también debemos cambiar esos enlaces; por ejemplo si tenemos `/public/images/logo.webp` podemos acceder a esa imagen con `/images/logo.webp` en un root repo, pero debemos usar `/repo/images/logo.webp` en uno non-root. Para minimizar este problema lo ideal es usar rutas relativas con [Content Collections](https://docs.astro.build/en/guides/images/#images-in-content-collections).
