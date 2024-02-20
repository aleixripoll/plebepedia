---
title: "Astro site en GitHub Pages"
slug: astro-github-pages
description: "Como gestionar deployments con y sin base URL."
authors: ["Dra. Valina"]
image: "./pexels-markus-spiske-965345.jpg"
categories: ["tecnología", "desarrollo"]
tags: ["astro", "github pages", "deployment"]
draft: false
date: 2024-02-20T07:00:00Z
---

Entrada un poco meta, vamos a hablar de algunos problemillas que encontré desplegando esta web en Github Pages y al mismo tiempo me autodocumento para mi yo del futuro.

Este blog ha sido generado con [Astro](https://astro.build/). No entraremos en un versus, Astro tiene algunas cosas mejores y otras peores que otros SSGs (Static Site Generators), pero digamos que en el pasado había utilizado **Jekyll** y **Hugo** y nunca tuve problemas para mover un blog de GitHub Pages entre un repo root (`usuario.github.io`) y un repo non-root (`usuario.github.io/repo`). 

Existe una guía oficial para [desplegar en Github Pages](https://docs.astro.build/en/guides/deploy/github/) pero las cosas no son tan simples. Este sería el proceso si queremos mover un sitio a un repo non-root:

1. Editar `base` en `astro.config.mjs` para indicar que el root del sitio está ahora en un subpath:

```
export default defineConfig(
  site: "https://usuario.github.io",
  base: "/repo",
  ...
}
```

2. Actualizar **todos los enlaces** para incluir el prefijo. Esto se puede hacer añadiendo la variable de entorno `import.meta.env.BASE_URL`, puede ser bastante tedioso encontrarlos y cambiarlos todos, pero es lo que hay. Quedaría algo así:
```
<a href={`${import.meta.env.BASE_URL}/${post.slug}`} ... />
```

El problema viene si quieres que tu sitio pueda moverse entre uno y otro modificando `base`. Simplemente no puedes, porque si usas un repo root, Astro usa `base: "/"`, y con nuestro cambio estamos añadiendo un segundo slash, lo cual rompe los enlaces y no se generan correctamente.

Para solucionarlo tuve que:

3. Añadir trailing slash a `base`, por ejemplo `/repo/`. Ahora tanto en root como en non-root, nuestro `base` acaba en slash.

4. Quitar el slash después de `base` de **todos los enlaces**:
```
<a href={`${import.meta.env.BASE_URL}${post.slug}`} ... />
```

5. Utilizar `trailingSlash: "ignore"`. Con `"never"`, quitará nuestro trailing slash de `base` y no quedará ninguno, rompiendo la generación de enlaces otra vez. Con `"always"`, todos los enlaces que no acaben en slash devolverán un 404.


Ahora ya podemos mover nuestro sitio cambiando sólo `base`.

Hay otro detalle a tener en cuenta: si tenemos contenido en `/public` debemos añadir el subpath; por ejemplo, si tenemos `/public/images/logo.webp` podemos acceder a esa imagen con `/images/logo.webp`, si usamos un subpath debemos cambiar el enlace a `/repo/images/logo.webp`.

Esta es la mejor solución que he encontrado para desplegar en GitHub Pages con cierta flexibilidad, si alguien tiene un sistema mejor soy todo oídos.


---

*Foto de Markus Spiske en [Pexels](https://www.pexels.com/photo/coding-script-965345/)*
