---
title: "Astro blog en GitHub Pages"
slug: astro-github-pages
description: "Como gestionar deployments con y sin base URL."
authors: ["Dra. Valina"]
image: "./pexels-markus-spiske-965345.jpg"
categories: ["tecnología", "desarrollo"]
tags: ["astro", "github", "deployment"]
draft: true
date: 2024-02-20T07:00:00Z
---

Entrada un poco meta, vamos a hablar de algunos problemillas que encontré desplegando esta web en Github Pages y al mismo tiempo me autodocumento para mi yo del futuro.

Este blog, almenos al momento de escribir este post, ha sido generado con [Astro](https://astro.build/). No entraremos en un versus, Astro tiene algunas cosas mejores y otras peores que otros SSGs (Static Site Generators), pero digamos que en el pasado había utilizado Jekyll y Hugo y nunca tuve problemas para mover un blog de GitHub Pages entre un repo root (`usuario.github.io`) y un repo no-root (`usuario.github.io/repo`). 

Existe una guía oficial para [desplegar en Github Pages](https://docs.astro.build/en/guides/deploy/github/) pero las cosas no son tan simples. Para empezar, hay que cambiar el parámetro [`base`](https://docs.astro.build/en/reference/configuration-reference/#base) para indicar que el root del sitio está ahora en un subpath, pero tienes que actualizar **todos los enlaces** manualmente para incluir el prefijo. Esto se puede hacer añadiendo la variable de entorno `import.meta.env.BASE_URL`, es bastante tedioso encontrar y cambiar todos los enlaces, cosa que nunca tuve que hacer con otros SSG, pero hasta aquí digamos que más o menos bien.

El problema viene si quieres que tu web/blog pueda moverse entre uno y otro simplemente modificando `base`. Simplemente no puedes, porque si usas un repo root, Astro añade a `base`un slash, pero no añade ese trailing slash si usas un no-root, por ejemplo `/repo`. Esto provoca que tengas que:

- **Opción A:** Añadir o quitar el trailing slash de **todos los enlaces** cuando cambias entre ambos, o
- **Opción B:** Activar `trailingSlash: "always"`, lo cual obliga a referenciar absolutamente todas las páginas de tu sitio con un slash al final o te devuelve un 404, por lo tanto tienes que editar todos tus enlaces internos **otra vez**.

En mi caso he optado por la opción A, si quiero mover mi blog de root a non-root tengo que:

1. Editar `base` en `astro.config.mjs`:

```
export default defineConfig(
  site: "https://usuario.github.io",
  base: "/repo",
  ...
}
```

2. Añadir `base` en todas los enlaces: 

```
<a href={`${import.meta.env.BASE_URL}/${post.slug}`} ... />
```

Si más tarde quisiera volver al root repo, no me sirve cambiar sólo el valor de `base`, ya que habrá un slash extra que rompe la generación de los enlaces, así que o me cargo todos los cambios anteriores, o hago un *search & replace* para quitar ese slash que ahora me sobra:

```
<a href={`${import.meta.env.BASE_URL}${post.slug}`} ... />
```

Si alguien conoce una solución mejor que no implique tener que picar javascript para algo que otros SSG hacen de serie, soy todo oídos.

---

*Foto de Markus Spiske en [Pexels](https://www.pexels.com/photo/coding-script-965345/)*
