---
layout: ../../layouts/ArticleLayout.astro
title: "Como desplegar tu app de NextJS en tu propio servidor Linux"
pubDate: "2024-02-19"
description: "En este artículo te comento como hacer un despliegue de tu aplicación de NextJS en tu propio servidor de GNU/Linux. Sin importar si estás utilizando Ubuntu o Rhel."
author: "Vicente Jorquera"
authorImage: "https://avatars.githubusercontent.com/u/88851263?v=4"
image:
  url: "https://blog-vicente-jorquera.s3.amazonaws.com/instalar-nextjs-en-tu-servidor-linux/shot-so-large.webp"
  alt: "Mockup representativo."
category: "Despliegue en Linux"
highlight: true
---

En este artículo te cuento como desplegar tu aplicación de NextJS 14 o superior (igualmente funciona para versiones previas con pages router) en tu propio servidor de GNU/Linux. Cabe mencionar que este procedimiento funcionará tanto para distribuciones basadas en Debiando como Ubuntu server y distribuciones basadas en RHEL como Rocky Linux por ejemplo. De todas formas este proceso es el mismo tanto si se lleva en un entorno local con máquinas virtuales como si se lleva a cabo en un entorno cloud de **AWS, Azure o Google Cloud**.

## Prerequisitos

Antes de comenzar el despliegue necesitaremos de lo siguiente:

- **Servidor Linux** - En este caso en particular llevaré a cabo este proceso en [Ubuntu Server](https://ubuntu.com/download/server). Sin embargo, como he mencionado previamente puedes llevarlo a cabo en el servidor Linux de tu preferencia.
- **NodeJS** - Como nuestra app de NextJS debe ejecutarse sobre NodeJS debemos asegurarnos de que la versión de NodeJS que instalemos en nuestro servidor la igual o superior a la versión que tenemos instalada en el entorno de desarrollo. Lamentablemente muchas distribuciones vienen con repositorios desactualizados en cuanto a NodeJS y NPM se refiere, por eso aquí abajo te dejo dos enlaces donde puedes encontrar la versión más reciente de NodeJS acorde a tu distribución.

  - [Web oficial](https://nodejs.org/en)
  - [NodeSource](https://github.com/nodesource/distributions)

- **PM2** - Para asegurarnos de que nuestro proyecto se inicialice como servicio, es decir, que arranque a penas el servidor enciende y además nos ofrezca monitoreo gratuito (o más detallado mediante una suscripción) utilizaremos [PM2](https://www.npmjs.com/package/pm2) un manejador de procesos avanzado para **NodeJS**.
- **Web Server** - Para permitir el tráfico externo hacia nuestra web, utilizaremos un servicio adicional que nos permitirá levantar un servidor web que redireccione a nuestro puerto 3000 o el que se haya seleccionado para que se ejecute nuestra aplicación de NextJS. Cabe mencionar que al añadir este webserver tendremos más ventajas como la de configurar un balanceador de carga para redirigir el tráfico o configurar varios servidores de NodeJS en el mismo físico y redirigir estas peticiones a través de nuestro web server. Para este proyecto en concreto estaré utilizando **Nginx**, también existen otras opciones como **httpd** o **apache2** (mismo paquete, diferente nombre entre Debian / RHEL). Puedes descargar tu servidor web de preferencia en tu distro de la siguiente manera:

  - **Distribuciones basadas en Debian:**

  ```
    sudo apt update && sudo apt upgrade -y

    sudo apt install nginx
  ```

  - **Distribuciones basadas en RHEL**

  ```
    sudo dnf update -y // o con yum

    sudo yum update -y

    sudo dnf install nginx
  ```

- **(Opcional) Cuenta de AWS / Azure / Google Cloud** - Como mencioné previamente, el contenido de este artículo será válido para cualquiera de las nubes grandes, así también con tu propio servidor por esto este prerequisito es opcional. Sin embargo, con el fin de asegurar la disponibilidad de nuestra aplicación sería una buena inversión contratar los servicios de AWS, Azure o Google cloud.

## Paso 1: Instalación de paquetes y dependencias

Como con cualquier instalación de paquetes en cualquier distribución GNU/Linux es importante tener el caché del repositorio y las dependencias actualizadas, en esta ocación con **Ubuntu** se hace de la siguiente manera:

```
sudo apt update && sudo apt upgrade -y
```

El comando anterior se encargará de refrescar los repositorios en caso de que tengamos paquetes nuevos por instalar y el segundo se encargará de descargar e instalar dichos paquetes, al agregar **-y** le decimos que queremos confirmar automáticamente la instalación de dicha paquetería.

### Una vez con toda la paquetería actualizada, procedemos con la instalación del web server:

```
sudo apt install nginx -y
```

### Una vez que el paquete termine de instalarse debemos inicializarlo, para esto ejectutamos los siguientes comandos:

```
sudo systemctl start nginx

sudo systemctl enable nginx

sudo systemctl status nginx
```

### Los comandos hacen lo siguiente:

1. **sudo systemctl start nginx** Inicializa el servicio de Nginx.
2. **sudo systemctl enable nginx** Carga el servicio en el arranque para que se ejecute a penas la máquina inicia.
3. **sudo systemctl status nginx** Muestra el estado del servicio, en este caso permitiéndonos saber el estado de nginx.

### Finalmente deberíamos ver que el atributo **loaded** y **active** están correctos, tal como se ve en la siguiente imagen:

![Estado de Nginx](https://blog-vicente-jorquera.s3.amazonaws.com/instalar-nextjs-en-tu-servidor-linux/status_nginx.webp)

Una vez tengamos instalado y funcionando NGINX podremos ver su web de ejemplo que viene precargada de forma automática una vez instalemos el servicio, para hacer esto tenemos varias formas, una podría ser utilizando **curl** dentro de la misma terminal al localhost, sin embargo, lo que nos interesa es compartir nuestra aplicación con el mundo, por esto debemos asegurarnos de buscar por ahora la **IP PÚBLICA** de la máquina en el navegador, obviamente en este punto es necesario habilitar una regla en el firewall del servidor y/o del servicio cloud, por ejemplo, en **AWS** es necesario agregar una regla de entrada **(inbound rule)** ya sea desde nuestra IP o cualquier IP al puerto 80 **(HTTP)** o el puerto 443 **(HTTPS)** si planeas agregar un certificado SSL al servidor.

Si todo ha ido como se espera, a este punto deberíamos ser capaces de buscar la IP pública de nuestra máquina en un navegador web y ver la siguiente pantalla de NGINX.

![NGINX HOME PAGE](https://blog-vicente-jorquera.s3.amazonaws.com/instalar-nextjs-en-tu-servidor-linux/nginx_running_on_ip.webp)

### A continuación debemos preparar nuestro entorno de ejecución para nuestro código, para esto debemos descargar NodeJS, NPM y Git si tenemos un repositorio con el código.

1. **Instalación de Git**

   ```
    sudo apt install git -y
   ```

2. **Instalación de NodeJS**

   Como dije anteriormente necesitamos utilizar una fuente externa para descargarnos versiones recientes de NodeJS y en este caso instalaré la versión 20 LTS desde [Node Source](https://github.com/nodesource/distributions) con los siguientes comandos aunque es recomendable que vayas a su [Github](https://github.com/nodesource/distributions) para que encuentres los comandos actualizados.

   ```
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - &&\
    sudo apt-get install -y nodejs
   ```

   Cuando terminen de ejecutarse los comandos anteriores, tendremos la versión seleccionada de NodeJS y la última versión disponible de NPM que se empaqueta junto a NodeJS.

   Para visualizar la versión actual instalada en nuestro sistema podemos hacerlo con los siguientes comandos:

   ```
    node -v

    npm -v
   ```

   Dichos comandos nos mostraran una salida como la siguiente:

   ```
    ubuntu@ubuntu:~$ node -v
    v20.11.1
    ubuntu@ubuntu:~$ npm -v
    10.4.0
    ubuntu@ubuntu:~$
   ```

3. **Instalación de PM2**

   Una vez tengamos instalado NodeJS bastará con ejectuar el comando:

   ```
    sudo npm i -g pm2
   ```

   Es importante que utilicemos sudo ya que al menos **Ubuntu Server** evitará que utilicemos el comando npm como un usuario normal y corriente, adicionalmente necesitaremos la banderilla `-g` (global) que nos permitirá utilizar pm2 desde cualquier lugar del sistema operativo.

## Paso 2: Clonar y compilar el proyecto en nuestro servidor

En mi caso personal utilizo y recomiendo utilizar Git para llevar de forma fácil la última versión de nuestro código al servidor. Sin embargo, esto es opcional, ya que si gustas puedes copiar y pegar la carpeta del proyecto desde tu pc en el servidor, ya sea con **Filezilla** o por ssh, en este punto lo importante es que definamos una ruta donde vamos a almacenar nuestro código.

En este caso cree una carpeta llamada **proyecto** y ahí dentro cloné mi app de NextJS desde Github quedando de la siguiente manera:

```
./proyecto/
└── app-ejemplo
```

Bien, con esto listo podemos asegurarnos de instalas los **node_modules** y las dependencias que sean requeridas según el proyecto. En este caso estoy utilizando una aplicación extremadamente simple que solo muestra un **Hola mundo de NextJS** cuando se ejecuta.

Con todo esto listo, debemos crear una compilación de nuestra aplicación con el comando:

```
sudo npm run build

// o podemos usar (ambos hacen lo mismo)

sudo npm next build
```

Esto comenzará el proceso de compilación de nuestra aplicación y si finalmente todo sale como se espera dentro del mismo directorio tendremos disponible la versión compilada del proyecto.

Una vez completado el proceso de buildeo de nuestra app deberíamos ver lo siguiente:

```
   ▲ Next.js 14.1.0

   Creating an optimized production build ...
 ✓ Compiled successfully
 ✓ Linting and checking validity of types
 ✓ Collecting page data
 ✓ Generating static pages (5/5)
 ✓ Collecting build traces
 ✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    137 B          84.3 kB
└ ○ /_not-found                          882 B            85 kB
+ First Load JS shared by all            84.1 kB
  ├ chunks/69-1b6d135f94ac0e36.js        28.9 kB
  ├ chunks/fd9d1056-cc48c28d170fddc2.js  53.4 kB
  └ other shared chunks (total)          1.87 kB


○  (Static)  prerendered as static content
```

Evidentemente según el tamaño de la aplicación que se esté compilando y la cantidad de rutas que se tengan puede tardar más tiempo en compilar y a su vez mostrar más datos en la terminal.

## Paso 3: Inicializar el proyecto como servicio con PM2

A continuación debemos asegurarnos de que nuestro proyecto se ejecute automáticamente nada más encender el servidor, para lograr esto necesitamos ejecutar los siguientes comandos:

Lo primero es situarse en la ruta donde raíz de nuestro proyecto, en mi caso en esta ruta:

```
cd ./proyecto/app-ejemplo
```

Una vez ubicados en la ruta raíz procedemos a ejecutar el siguiente comando:

```
pm2 start npm --name 'my-app' -- start
```

El comando anterior se encargará de ejecutar nuestra aplicación de NextJS compilada y le asignará el nombre de **my-app** al gestor de procesos **pm2**, otro de los beneficios agregados de **PM2** es que nuestra aplicación se reiniciará automáticamente si se crashea en producción.

Una vez hayamos ejecutado el comando previo y tengamos éxito veremos la siguiente salida:

```
[PM2] Starting /usr/bin/npm in fork_mode (1 instance)
[PM2] Done.
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ my-app             │ fork     │ 0    │ online    │ 0%       │ 7.6mb    │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
```

## Paso 4: Configurar NGINX para que dirija las peticiones en el puerto 80 a nuestra app

Esto nos permitirá tener un despliegue escalable, ya que cuando aumenten las instancias de nuestra aplicación o tengamos diferentes servicios basados en la región desde donde se está haciendo la petición (por ejemplo) podremos configurarlo con mucha facilidad en nuestro servidor NGINX, por ahora, vamos a redireccionar las peticiones del puerto 80 al 3000 de la siguiente manera:

```
sudo nano /etc/nginx/sites-available/my-app.com
```

Con el comando anterior abriremos un nuevo archivo llamado **my-app.com** en la ruta **/etc/nginx/sites-available/** en el editor **nano**, si no tienes nano instalado, puedes reemplazar nano por **vi** y seguro que funcionará en tu distribución. Continuando con la explicación, se recomienda que reemplaces **my-app-com** por el nombre de tu aplicación o el dominio de tu web, esto no es estrictamente necesario pero es una práctica común en servidores de NGINX para diferenciar los sitios que existen dentro de **NGINX**.

A continuación debemos pegar el siguiente código en el archivo que acabamos de crear: (UTILIZANDO LA IP)

```
server {
    listen 80;
    location / {
        proxy_pass http://localhost:3000;
    }
}
```

En caso de tener un dominio personalizado se debe agregar este código:

```
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Esto le dice a NGINX que escuche en el puerto 80 y cuando reciba una petición internamente la redirija al puerto 3000 abierto en el localhost, de esta manera bastará con cargar la IP pública para acceder a nuestra aplicación.

Es posible que en algunos casos la configuración por default de NGINX nos impida visualizar nuestra web como queremos, en estos casos podemos modificar el archivo default ubicado en la ruta **/etc/nginx/sites-available** o directamente como suelo hacer yo, eliminarlo para que quede nuestro nuevo archivo, solo con la configuración que hayamos definido manualmente.

Algo importante a tener en cuenta es que para que NGINX funcione correctamente debemos tener agregar un archivo a la carpeta **/etc/nginx/sites-enabled**, este archivo debe ser un link simbólico de nuestro archivo original que está en la carpeta sites-available. Esto lo comento porque también eliminar el archivo default desde la carpeta **sites-enabled**, esto lo hacemos la siguiente manera:

```
sudo rm -rf /etc/nginx/sites-available/default

sudo rm -rf /etc/nginx/sites-enabled/default
```

Una vez tengamos dichos archivos eliminados, debemos agregar un link simbólico a nuestro propio archivo de configuración, y esto lo logramos de la siguiente manera:

```
sudo ln -s /etc/nginx/sites-available/my-app.com /etc/nginx/sites-enabled/
```

el comando anterior creará un link simbólico en la carpeta sites-enabled para el archivo my-app.com (la configuración que acabamos de escribir manualmente).

Finalmente debemos ejecutar el comando para reiniciar el servidor y ver el estado actual de NGINX:

```
sudo systemctl restart nginx && sudo systemctl status nginx
```

En este momento ya deberíamos tener nuestra aplicación funcionando y visible a través de NGINX como podemos ver en la siguiente imagen:

## Paso 5: Configurando nuestra app de PM2 como servicio

Como mencioné al inicio de este artículo, una funcionalidad específica de esta guía era hacer que nuestra aplicación sea accesible por el mundo nada más encendamos el servidor, sin la necesidad de estar manualmente encendiendo la app con pm2. El proceso es bastante simple y se realiza con el siguiente comando:

```
pm2 startup systemd
```

Esto nos arrojará el siguiente resultado:

```
ubuntu@ubuntu:~/proyecto/app-ejemplo$ pm2 startup systemd
[PM2] Init System found: systemd
[PM2] To setup the Startup Script, copy/paste the following command:
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

Finalmente copiamos la última línea y la ejecutamos en nuestra terminal. Volvemos a ejecutar **pm2 save**

Luego nos queda inicializar nuestro servicio con systemd (Es importante considerar que **ubuntu** se refiere al usuario en la máquina):

```
sudo systemctl start pm2-ubuntu && sudo systemctl status pm2-ubuntu
```

En caso de que nos arroje un error, solo debemos reiniciar el servidor y posteriormente volver a ejecutar únicamente el comando previo con el que iniciamos el proceso.

Felicidades, si llegaste a este punto ya tienes tu aplicación de NEXTJS ejecutándose en tu servidor web con NGINX y PM2.

![Imagen final](https://blog-vicente-jorquera.s3.amazonaws.com/instalar-nextjs-en-tu-servidor-linux/shot-so-large.webp)

## Referencias

- **Cómo correr un servidor de nodejs con nginx:** [https://blog.logrocket.com/how-to-run-a-node-js-server-with-nginx/](https://blog.logrocket.com/how-to-run-a-node-js-server-with-nginx/)

- **Cómo usar PM2 para configurar un entorno de producción con PM2:** [https://www.digitalocean.com/community/tutorials/how-to-use-pm2-to-setup-a-node-js-production-environment-on-an-ubuntu-vps](https://www.digitalocean.com/community/tutorials/how-to-use-pm2-to-setup-a-node-js-production-environment-on-an-ubuntu-vps)

- **Despliegue de NextJS manualmente**: [https://nextjs.org/docs/app/building-your-application/deploying](https://nextjs.org/docs/app/building-your-application/deploying)
