---
layout: ../../layouts/ArticleLayout.astro
title: "Mejorar el SEO en NextJS"
pubDate: "2024-02-19"
description: "En este breve pero importante artículo te cuento como puedes utilizar las herramientas de NextJS para mejorar el SEO de tu web."
author: "Vicente Jorquera"
authorImage: "https://avatars.githubusercontent.com/u/88851263?v=4"
image:
  url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2944&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  alt: "Mockup representantivo"
category: "SEO"
---

En este artículo te contaré algunos trucos que podemos hacer para mejorar el SEO de nuestras webs de forma fácil gracias a las integraciones propias de NextJS para este cometido. Pero primero veamos una pequeña explicación para quienes aún no entienden del todo que es el SEO y por qué es tan importante.

## ¿Qué es el SEO?

SEO son las siglas en inglés para Search Engine Optimization, que en español sería Optimización de Motores de Búsqueda. La idea y el objetivo detrás del SEO es crear una estrategia que incremente tu posición en los resultados de los motores de búsqueda. En palabras más simples tener un buen SEO significa que tienes mejores posibilidades de que los usuarios te encuentren en internet cuando hagan búsqueda relacionada con lo que puedas ofrecer.

## ¿Por qué es tan importante el SEO?

El SEO como mencioné anteriormente es importante porque le dará más posibilidades de visibilizar tu marca y contenido en internet. En sí, se podría decir que el SEO es la clave para generar confianza en tus usuarios y obtener una posición más convincente a la hora de realizar una búsqueda en Google. Eso sí, es importante destacar que el SEO es parte de las búsquedas orgánicas, es decir, aquellas posiciones que no están patrocinadas por pagos a Google Ads o similares.

## Razones por las que te conviene tener un buen SEO:

Confianza: si apareces en la primera página del buscador cuando usuario crea una búsqueda, crearás una ilusión de confianza sobre tu marca en tus potenciales clientes
Barato: si bien puedes pagar a alguien o a una empresa para que te guíe con el SEO, y mejore tu web, puedes aprender a trabajarlo de forma gratuita con contenido en internet y llevar a cabo esos procedimientos tú mismo sin la necesidad de invertir dinero extra.

## Mejorando el SEO de tu web en NextJS

### Robots.txt

Para comenzar debemos empezar por algo simple, como primer paso vamos a agregar el archivo **robots.txt** a nuestro proyecto. Este archivo en particular se encarga de decirle a los robots que emplean los motores de búsqueda qué rutas pueden seguir y a cuáles no deben entrar.
El archivo robots.txt es un archivo estático que se podemos agregar en la ruta` /public/robots.txt`

A continuación puedes ver un ejemplo de robots.txt donde le decimos a los robot que no pueden acceder a las rutas /api y /dashboard pero permita que revisen cualquier otra ruta sin importar el agente de usuario en ambos casos.

```
	# Bloquea los robots en /api y /dashboard
	User-agent: *
	Disallow: /api
	Disallow: /dashboard

	# Permite el acceso a las siguientes rutas
	User-agent: *
	Allow: /

```

### Mapas de sitio (Sitemap)

Otro archivo importante a la hora de mejorar tu el SEO de tu web es incorporar un **sitemap**. Un sitemap es la forma más simple de comunicarse con Google. Las líneas en estos archivos indican las URLs que pertenecen a tu sitio web, y cuando se actualizan Google y otros motores de búsqueda pueden detectar con facilidad el nuevo contenido y mostrar tu contenido a usuarios potenciales de forma mucho más eficiente.

### ¿Cómo añadimos un sitemap?

Existen 2 formas, primero tenemos la forma manual. Esta es la forma clásica que se realiza creando manualmente un archivo .xml que guardamos en la carpeta public y que tendría un aspecto como este:

```
	<xml version="1.0" encoding="UTF-8">
  	 <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  	   <url>
  	     <loc>http://www.example.com/foo</loc>
  	     <lastmod>2021-06-01</lastmod>
 	    </url>
 	  </urlset>
  	 </xml>
```

En este caso nos encontraremos frente a la forma más simple y fácil de agregar el sitio, pero la más incómoda con el tiempo ya que deberemos agregar manualmente las rutas y la información de modificación. Aquí es donde entra NextJS y nos hace la vida más fácil.

### getServerSideProps

Esta opción nos permite un acceso dinámico, en este caso getServerSideProps generará las rutas del sitemap de forma automática bajo demanda, es decir, si realizamos un cambio, automáticamente lo agregará al archivo y lo comunicará con Google.

En este caso en lugar de dirigirnos a /public/sitemap.xml debemos abrir la carpeta pages y crear un sitemap.xml o si estámos en la última versión de nextJS debemos abrir la carpeta app y crear una nueva carpeta llamada sitemap y ahí dentro una ruta page.tsx o page.jsx y agregar el siguiente código de ejemplo:

```
	const EXTERNAL_DATA_URL = 'https://jsonplaceholder.typicode.com/posts';

    function generateSiteMap(posts) {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <!--We manually set the two URLs we know already-->
        <url>
        <loc>https://jsonplaceholder.typicode.com</loc>
        </url>
        <url>
        <loc>https://jsonplaceholder.typicode.com/guide</loc>
        </url>
        ${posts
        .map(({ id }) => {
            return `
        <url>
            <loc>${`${EXTERNAL_DATA_URL}/${id}`}</loc>
        </url>
        `;
        })
        .join('')}
    </urlset>
    `;
    }

    function SiteMap() {
    // getServerSideProps will do the heavy lifting
    }

    export async function getServerSideProps({ res }) {
    // We make an API call to gather the URLs for our site
    const request = await fetch(EXTERNAL_DATA_URL);
    const posts = await request.json();

    // We generate the XML sitemap with the posts data
    const sitemap = generateSiteMap(posts);

    res.setHeader('Content-Type', 'text/xml');
    // we send the XML to the browser
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
    }

    export default SiteMap;
```

En este caso la primera función se encarga de generar automáticamente las rutas para los posts, agregando la ruta y los ids respectivamente uno a uno, además podemos ver que se agregan manualmente las rutas estáticas que sabemos que no cambiarán como el inicio y acerca de.

Más abajo encontramos la función SiteMap que hará lo que se le indica más abajo en el getServerSideProps.

### Agregar etiquetas canonical

Una URL canonical es la URL de tu página que los motores de búsqueda consideran que representa tu web. Si bien mediante la etiqueta `<link rel='canonical' href='tu_url' />` puedes comunicar de manera manual las URL, Google también puede agrupar varias de estas URL sin que tú se lo indiques. En este caso puede ocurrir si Google encuentra esta URL en diferentes rutas.

Otro caso importante, sucede con los dominios, si se ejecutan dos webs diferentes y se publica el mismo contenido en cada una, los motores de búsqueda van a decidir cuál de los dos dejan primero y cual degradan. En este caso utilizar etiquetas canonical se vuelve muy útil, permitiéndole a Google saber cual es la URL original y cual es la duplicada. Evitando así, que se degrade una web o las dos.

Entonces, las etiquetas canonical son de suma importancia cuando hablamos de mejorar el SEO desde el punto de vista del rendimiento, debido a que tanto usuarios, como herramientas de campañas de marketing pueden crearlas.

A continuación te dejo un código de ejemplo donde se utiliza Head de next/head para modificar la etiqueta canonical específicamente del index en la web:

```
	import Head from 'next/head';

    function IndexPage() {
        return (
            <div>
                <Head>
                    <title>Canonical Tag Example</title>
                    <link
                    rel="canonical"
                    href="https://example.com/blog/original-post"
                    key="canonical"
                    />
                </Head>
                <p>This post exists on two URLs.</p>
            </div>
        );
    }

    export default IndexPage;
```

## Renderizado y ranking

No voy a explicar mucho en esta sección ya que basta con que identifiquemos correctamente que tipo de aplicación o página web estamos construyendo. Solo debemos entender lo siguiente:

## SSG: Generación de sitios web estáticos.

Esto ocurre cuando el HTML se genera en tiempo de compilación. Es perfecta para el SEO porque tienes todo el HTML en la página cuando se pide, además está pre-renderizado, lo que ayuda al rendimiento de la página.

### SSR: Renderizado del lado del servidor.

Esta es otra técnica bastante utilizada, como el SSG la página está prerenderizada, lo que también la convierte en una excelente opción para el SEO, sin embargo esta opción se recomienda más cuando tenemos páginas dinámicas, es decir, contenido que puede o no ser exactamente igual en todos los casos en que se haga una determinada petición.

### ISR: Regeneración estática incremental.

Esto es utilizado cuando tienes muchas páginas, por lo que generarlas todas al momento de la compilación no es factible. NextJS nos permite crear o actualizar páginas estáticas después de construir tu web mediante la estrategia de ISR. En este caso le permite a editores de contenido y a desarrolladores utilizar generación estática por cada página base, sin la necesidad de reconstruir el sitio entero.

Esta técnica es muy recomendable cuando se construyen webs para compartir contenido como blogs o noticieros que necesiten compartir cientos de artículos y deban seguir escalando sus recursos con el tiempo.

### CSR: Renderizado del lado del Cliente

Esta técnica es muy utilizada para crear aplicaciones interactivas desde el lado del cliente, donde existen botones, tablas, inputs y diferentes contenidos que dependen de las acciones del usuario para entregar la información correctamente.

Algunos casos de uso bastante comunes son la creación de dashboards, inicios de sesión interactivos, aplicaciones dedicadas a la administración de negocios, gestión de cuentas, entre muchas otras aplicaciones que interactúen desde el lado del cliente.

## Una estructura clara…

Generar URLs con una estructura clara y definida es parte de una estrategia de SEO. Estas se consideran una buena práctica sin importar el impacto en el ranking.

Tener URLs definidas, que sigan una semántica, patrones lógicos y consistentes, que estén enfocadas en palabras en lugar de números, es una excelente manera de indicar la calidad de tu web y la facilidad que representa a la hora de que un usuario acceda al contenido.

En NextJS es importante recordar la jerarquía del enrutador, entendiendo las carpetas y subcarpetas como páginas padre y páginas hijos de una carpeta primaria.

En el caso de tener páginas dinámicas y tener Ids numéricos o UUIDs en tu base de datos también es recomendable tener un parámetro llamado SLUG que sea de tipo unique, este slug será la forma en palabras humanas para identificar tu artículo o página incluso si tienes un manejo interno por números o UUIDs.

**Por ejemplo:**

supongamos que tu artículo tiene el ID: 1saasj234snnsk (solo es un ejemplo).

sería bastante difícil de recordar por un humano no?

Aquí es donde entra en juego el slug, que nos permitiría asociar una frase como la siguiente:

`como-mejorar-el-seo-en-nextjs-14`

lo que hace que sea mucho más fácil de entender y recordar por los usuarios, sin mencionar que te permitirá organizarte de mejor manera en tus estrategias SEO.

Si fuese una tabla de base de datos debería verse algo así:

```
	CREATE TABLE articulos (
		id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
        slug varchar(250) not null UNIQUE,
        // el resto de parámetros
    );
```

## De vuelta a lo básico

La forma más simple de mejorar tu SEO en tu web es agregando las etiquetas meta correspondiente, que debes de tener siempre en cuenta:

title
description
author
icon
keywords

pero a parte tenemos las etiquetas de og, estas etiquetas están especialmente diseñadas para que puedas compartir tu contenido en redes sociales. ¿Has visto esa mini tarjeta que se abre cuando pones un link en WhatsApp, LinkedIn, Twitter u otras redes sociales?

Estas tarjetas puedes agregarlas con facilidad utilizando las etiquetas og, por suerte NextJS incluye herramientas dedicadas a ayudarnos a la creación de estas etiquetas de forma dinámica y estática.

```
    import Head from 'next/head';

    function IndexPage() {
    return (
        <div>
            <Head>
                <title>Cool Title</title>
                <meta name="description" content="Checkout our cool page" key="desc" />
                <meta property="og:title" content="Social Title for Cool Page" />
                <meta
                        property="og:description"
                        content="And a social description for our cool page"
                        />
                <meta
                        property="og:image"
                        content="https://example.com/images/cool-page.jpg"
                        />
            </Head>
            <h1>Cool Page</h1>
            <p>This is a cool page. It has lots of cool content!</p>
        </div>
    );
    }
    

export default IndexPage;
```

Como podemos ver en el código tomado desde la web de NextJS, podemos ver como nos asigna una descripción, imagen y título para esta tarjeta que será visible a través de las distintas plataformas.

Por experiencia personal es útil utilizar herramientas que te permitan medir o analizar estos atributos por cada una de tus páginas, en mi caso personal utilizo la siguiente herramienta: 
 [opengraph.xyz](https://www.opengraph.xyz/)


Una aplicación web muy útil que encontré navegando por la red, se trata de una aplicación que simplemente poniendo nuestra URL en el input al inicio nos permite analizar nuestras etiquetas OG disponibles en la palabra que buscamos y además nos entrega una previsualización de cómo se vería en las principales plataformas. Y por si esto fuera poco, también es capaz de ayudarnos mostrándonos etiquetas meta generadas en base al contenido e incluso te ofrece imágenes gratuitas y de pago que puedes utilizar como imágenes de OG.

## Estructura de tu web

La estructura de tu web a nivel HTML es de suma importancia para tu SEO, desde utilizar los headings correctos y realizar un correcto manejo de los enlaces harán que los bots de Google y otros buscadores sean capaz de indexarte de mejor manera. Recuerda que los Headings están dedicados a demostrar la importancia que tienen los documentos y los enlaces que se comparten dentro de tu web.

## Headings

Los Headings (encabezados) ayudan a los usuarios a entender la estructura de tu página y que van a leer en los siguientes párrafos. Como mencioné previamente, también ayuda a que los motores de búsqueda sean capaces de entender que partes de la página son más importantes.

Recuerda que los encabezados van del 1 - 6 representando el incremento del valor numérico como la descendencia en el nivel de importancia del encabezado. Siendo así, el h1 muy importante y el h6 poco importante.

Enlaces

Como bien sabemos las etiquetas `<a>` nos permiten agregar enlaces a nuestra web, sin embargo si damos clic en uno de estos links para movernos de una página a otra se recargará la página completa. Por suerte, NextJS nos provee del componente Link que permite transiciones entre las rutas al tener su propio enrutador.

Un ejemplo de uso sería el siguiente:

```
    function NavLink({ href, name }) {
        return (
            <Link href={href}>
            <a>{name}</a>
            </Link>
        );
    }

    export default NavLink;
```

Recuerda que el href es requerido ya que el elemento Link de NextJS se va a renderizar como un elemento `<a>` en HTML y el correcto uso de estas etiquetas es vital para el SEO.

## Conclusiones

Espero que este artículo te haya sido de ayuda mejorando el SEO de tu web, aprovecho esta sección para comentar que en la referencias a continuación encontrarás enlaces a las webs, recursos y documentación que investigué para escribir este artículo.

## Referencias

- **Data-fetching NextJS:**: [https://nextjs.org/docs/app/building-your-application/data-fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

- **NextJS docs:** [https://nextjs.org/docs/getting-started/project-structure](https://nextjs.org/docs/getting-started/project-structure)
- **NextJS Rendering:** [https://nextjs.org/docs/app/building-your-application/rendering](https://nextjs.org/docs/app/building-your-application/rendering)
- **SSR vs SSG VERCEL:** [https://vercel.com/blog/nextjs-server-side-rendering-vs-static-generation](https://vercel.com/blog/nextjs-server-side-rendering-vs-static-generation)
- **NextLink:** [https://nextjs.org/docs/api-reference/next/link](https://nextjs.org/docs/api-reference/next/link)