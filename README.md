# h.UBA · Aplicación web responsive

**Prototipo académico de Patricia Retamozo** para la materia **Introducción al Conocimiento Proyectual 2**.

La aplicación reúne accesos universitarios, materiales académicos, herramientas para organizar materias, calendarios, recordatorios y un asistente de respuestas predefinidas. Es un **prototipo independiente y no oficial de la Universidad de Buenos Aires**.

## Versión 0.6 · Nuevo diseño

- Inicio renovado con identidad h.UBA, robot ilustrado y accesos rápidos.
- Interfaz adaptable a celulares, tabletas y pantallas de escritorio.
- Navegación móvil inferior con cinco accesos: Inicio, Buscador, Calendario, Recordatorios y Más.
- Tarjetas, formularios, calendario, buscador, asistente, Mis cosas y configuración con estilo visual unificado.
- Mejoras de foco, zonas táctiles y adaptación de contenidos a pantallas pequeñas.
- Conserva las funciones y los materiales académicos de la versión 0.4.

## Estructura

```
.github/workflows/pages.yml   Publicación del sitio y QR
scripts/build_qr.py           Generador del QR
web/index.html                Entrada de la aplicación
web/app.js                    Navegación, contenidos y funcionalidad
web/styles.css                Estilos base
web/styles-v6.css             Rediseño de la interfaz
web/sw.js                     Servicio de caché
web/manifest.webmanifest      Configuración de PWA
web/assets/                  Robot e íconos
web/materiales/               Ocho PDF académicos
tests/smoke.cjs               Pruebas automatizadas
docs/                         Referencias y estructura de contenidos
```

**No es necesario compilar ni generar un APK.** El sitio funciona desde cualquier navegador web moderno, con diseño adaptativo para Android, iOS y escritorio.

## Publicación en tu repositorio

Repositorio: https://github.com/MebisA/h.UBA

1. Descomprimí el ZIP. Los directorios `web`, `scripts`, `tests`, `.github` y `docs` tienen que quedar directamente en la raíz del repositorio.
2. Abrí esa carpeta en Visual Studio Code.
3. Actualizá la rama `main` con los archivos del paquete.
4. En GitHub, abrí **Settings → Pages** y dejá seleccionado **Source: GitHub Actions**.
5. En **Actions**, comprobá que el flujo **Publicar PWA y generar QR** finalice correctamente.

Si tenés el repositorio clonado y ya reemplazaste los archivos, ejecutá:

```powershell
git add .
git commit -m "Actualización de interfaz h.UBA v0.6"
git push origin main
```

La aplicación se publica en:

- Sitio web: https://mebisa.github.io/h.UBA/
- QR: https://mebisa.github.io/h.UBA/qr.png

El QR se genera durante el despliegue y apunta a la dirección pública, sin parámetros de seguimiento.

**Nota:** si tu repositorio ya contiene otro workflow creado manualmente para publicar Pages, mantené solo uno de publicación para evitar despliegues simultáneos. El que incluye este paquete publica el contenido de `web/` en la raíz del sitio.

## Ejecución local en Windows

Desde la raíz del proyecto, en la terminal de VS Code:

```powershell
py -m http.server 8080 --directory web
```

Abrí http://localhost:8080 y, para simular un teléfono, utilizá Chrome o Edge con `F12` y `Ctrl + Shift + M`.

Si la web se muestra con el diseño anterior, refrescá con `Ctrl + Shift + R` y, si la habías instalado, cerrá y reabrí la aplicación para permitir la actualización del Service Worker.

## Pruebas

Requieren Node.js; no se necesitan paquetes de NPM:

```powershell
node --check web/app.js
node tests/smoke.cjs
```

El proyecto conserva:

- Las fechas de evaluación de noviembre de 2026 y el calendario académico UBA XXI 2026.
- Los recursos de Alejandría y Códice.
- Los ocho PDF asociados a ICP1, ICP2, IPC e ICSE.
- Los enlaces oficiales de UBA, CBC, UBA XXI y FADU.
- Los formularios de materias, notas, calendario y recordatorios, con persistencia en LocalStorage.
- Configuración de modo oscuro, alto contraste y tamaño de letra.
- El enlace de Compartir sin parámetros de seguimiento.

## Alcance

La información personal se guarda en cada navegador; no se sincroniza entre equipos ni se envía a un servidor propio. La app no permite iniciar sesión en servicios institucionales, no envía notificaciones con el navegador cerrado ni ofrece un asistente conectado a modelos externos. Los servicios universitarios y las bibliotecas externas requieren conexión a Internet.

Antes de publicar una distribución pública, verificá que contás con autorización para redistribuir los PDF incluidos.
