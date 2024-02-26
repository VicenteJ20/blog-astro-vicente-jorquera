---
layout: ../../layouts/ArticleLayout.astro
title: 'Persistir scripts entre ViewTransitions con Astro'
pubDate: '2024-02-25'
description: 'Si te ha pasado como a mi, que he agregado scripts a mis proyectos de Astro y las ViewTransitions hacen que el código quede inútil, en este artículo te muestro como solucionarlo.'
author: 'Vicente Jorquera'
authorImage: 'https://avatars.githubusercontent.com/u/88851263?v=4'
image:
    url: 'https://blog-vicente-jorquera.s3.amazonaws.com/persisitir-scripts-en-astro/home-bg-large.webp'
    alt: 'Mockup representativo.'
category: 'Astro'
highlight: false
---

Si te ha ocurrido como a mi, que he agregado scripts en las páginas `.astro` y estos quedan inutilizables luego de cambiar de página posterior a haber habilitado las **Viewtransitions**, este artículo es para ti, aquí te contaré brevemente como he solucionado este pequeño pero molesto problema.

## ¿Por qué ocurre este problema?

Primero vamos a entender el problema, por defecto cuando usamos Astro trabajamos varias páginas, en forma de **MPA (Multi Page Application)**, el comportamiento estándar de una web estática. Sin embargo, por temas estéticos puede resultar tentador utilizar las `<ViewTransitions  />` pero muchas veces no se comprende realmente lo que ocurre. En este caso al agregar estas ViewTransitions, cambiamos el comportamiento de MPA a una SPA, es decir, una **Single Page Application** o Aplicaciones de una sola línea que tiene ventajas como desventajas. 

Para comenzar agrega transiciones agradables a la vista y que sirven para dar más personalidad a tu web, pero por contra envían más JavaScript (nada alarmante) además de modificar ligeramente como se comporta nuestra web.

## Mi problema con las ViewTransitions

En este caso estaba construyendo mi blog personal, coincidentemente es la web en que la estás leyendo este artículo [blog.vicentejorquera.dev](blog.vicentejorquera.dev), como sabrás una forma fácil de construir webs estáticas es mediante la implementación de archivos markdown que luego se renderizan como HTML, en este caso mis artículos son archivos`.astro` y para estandarizar el contenido, he desarrollado un Layout para estos artículos.


## El código en cuestión se ve la siguiente manera:

```
    <GeneralLayout title={frontmatter.title} frontmatter={frontmatter}>
        <article
            class="text-slate-700 dark:text-slate-200 article-md max-w-screen-lg mx-auto">
            <slot />
        </article>
        <AuthorCard />
    </GeneralLayout>
```

Para mejorar la legibilidad he reducido el texto interno de mi componente, sin embargo si quieres ver la versión completa del mismo la encuentras en mi [Github](https://www.github.com/VicenteJ20). Como sabemos podemos agregar scripts a nuestros componentes de astro para dar interactividad o para programar acciones específicas, en mi caso particular, estaba utilizando la última de estas.

En sí había agregado el siguiente script:

```
    <script>
        const links = document.querySelectorAll(".article-md a");

        links.forEach((item) => {
            item.setAttribute("target", "_blank");
            item.setAttribute("rel", "noopener noreferrer");
        });
    </script>
```

Como puedes observar estaba seleccionando todos los elementos a que se encuentran dentro de mi clase `.article-md` (es decir, solo los elementos a que se encuentran dentro del article que se genera con markdown) y a continuación con un bucle forEach recorría cada uno de estos elementos asignando los atributos de `target='_blank'` y `rel='noopener noreferrer'` respectivamente.

El problema con este código y las **ViewTransitions** es que mi script se está cargando cada que se carga la página y al ser una SPA solo funciona una vez por ende al intercambiar entre páginas pierde su funcionalidad.

## Solución al problema

Para solucionar este problema estuve investigando bastante en la documentación oficial, en **stackoverflow** y en otras plataformas que me mostraban los resultados de búsqueda de duckduckgo. Al final me encontré con lo siguiente:

```
    <script transition:persist>
        const links = document.querySelectorAll(".article-md a");

        links.forEach((item) => {
            item.setAttribute("target", "_blank");
            item.setAttribute("rel", "noopener noreferrer");
        });
    </script>
```

Como puedes observar de momento el código está igual al anterior, la única diferencia es el atributo`transition:persist`, que tal como su nombre lo dice le a las **ViewTransitions** que se encargue de persistir el script. 

Hasta este punto estamos a medio camino, debido a que como indiqué más arriba ahora el script persiste, por lo que si declaramos `const links  = document.querySelectorAll(“.article-md a”);` la consola nos mostrará un error debido a que `const links` ya se ha declarado previamente.

Entonces la solución final a esto, es utilizar el objeto window de JavaScript en lugar de const. Como bien sabemos el **objeto window** representa a la ventana que contiene un documento en DOM, por ende, el script está cargado pero funciona entre cada ventana de las ViewTransitions. Entonces, nuestro quedaría de la siguiente manera:

```
    <script transition:persist>
        window.links = document.querySelectorAll(".article-md a");

        window.links.forEach((item) => {
            item.setAttribute("target", "_blank");
            item.setAttribute("rel", "noopener noreferrer");
        });
    </script>
```

 Como puedes observar en lugar de utilizar const links, estoy utilizando window.links lo que significa que estoy utilizando el objeto window y asignándole la variable links con el contenido de querySelectorAll. La única diferencia visible a nivel escritura de código es utilizar window en cada momento que se quiera hacer referencia a la propiedad de los links que creamos previamente.

## Conclusiones

Como podemos ver, Astro es un framework muy versatil que se adapta a diferentes librerías de Frontend, pero no las necesita ya que aún sin estar siendo trabajado junto a una de estas como React por ejemplo, ofrece una excelente calidad en cuanto a sus características y como bonus, nos encontramos con la facilidad de desarrollo si venimos de otros frameworks como NextJS.

Espero que te haya sido de ayuda el contenido y que te atrevas a utilizar Astro con más frecuencia en tus próximos proyectos. A continuación te dejo un listado con las referencias que utilicé para llegar a esta solución.

## Referencias

- **Objeto Window en MDN:** [https://developer.mozilla.org/es/docs/Web/API/Window](https://developer.mozilla.org/es/docs/Web/API/Window)

- **ViewTransitions Astro docs:** [https://docs.astro.build/en/guides/view-transitions/](https://docs.astro.build/en/guides/view-transitions/)