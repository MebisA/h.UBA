# h.UBA — Prototipo web responsive 2026

**Patricia Retamozo** · **Introducción al Conocimiento Proyectual 2**

h.UBA es una aplicación web académica independiente para acompañar a estudiantes de la Universidad de Buenos Aires. **No es una aplicación oficial de la UBA**. Funciona desde un navegador moderno en celulares Android, iPhone, tablets y computadoras, y puede publicarse gratis con GitHub Pages. **No requiere APK ni Android Studio**.

## Novedad de la versión 0.3 — Alejandría

En **Buscador → Alejandría** se quitaron los enlaces anteriores y se incorporaron **ocho bibliotecas y repositorios digitales**. Los enlaces abren en pestañas externas; no se incluye un buscador interno de esos sitios.

1. Open Library — https://openlibrary.org/?lang=es
2. Redalyc — https://www.redalyc.org/
3. Biblioteca FADU · UBA — https://biblioteca.fadu.uba.ar/tiki/tiki-read_article.php?articleId=894
4. Biblioteca Digital Mundial — https://www.loc.gov/collections/world-digital-library/about-this-collection/
5. Project Gutenberg — https://www.gutenberg.org/
6. Biblioteca Virtual Miguel de Cervantes — https://www.cervantesvirtual.com/
7. Europeana — https://www.europeana.eu/es
8. Internet Archive — https://archive.org/

**Códice / Parciales y PDF por materia no se modificaron.** El asistente ahora indica que Alejandría cuenta con estos recursos.

## Contenidos de versiones anteriores conservados

- Imagen del robot aportada para el prototipo e identidad visual adaptable a móviles.
- Pantalla **Acerca de** con la autoría de Patricia Retamozo.
- Accesos a SIU Guaraní, campus UBA XXI y CBC, trámites y sedes, y orientación vocacional.
- Carreras de FADU y enlaces a sus planes de estudio.
- Ocho documentos PDF asociados a ICP1, ICP2, IPC e ICSE en `web/materiales/`.
- Ejemplos de parciales en Altillo, en la pestaña **Códice / Parciales**.
- Calendario académico UBA XXI 2026 y los eventos de cursada comunicados para noviembre 2026.
- Plan personal de estudio, notas y recordatorios, guardados en el almacenamiento local del navegador.
- Aplicación web instalable (PWA) con caché sin conexión para archivos propios; los recursos externos requieren internet.

## Probar en Windows con Visual Studio Code

1. Descomprimí el ZIP y abrí la carpeta `huba-android-mvp` en VS Code (**File → Open Folder**).
2. Abrí **Terminal → New Terminal** desde esa carpeta.
3. Ejecutá:

   ```powershell
   py -m http.server 8080 --directory web
   ```

4. Abrí **http://localhost:8080**.
5. Para emular el tamaño de pantalla de un celular, presioná `F12` y luego `Ctrl + Shift + M` en Chrome o Edge.
6. Entrá a **Buscador → Alejandría**. Si ya probaste una versión anterior, refrescá con `Ctrl + Shift + R`; las PWA instaladas pueden necesitar cerrarse y abrirse para aplicar la actualización.

Como alternativa, podés usar la extensión **Live Server** con `web/index.html`.

## Comprobaciones

Si tenés Node.js instalado, ejecutá desde la raíz:

```powershell
node --check web/app.js
node tests/smoke.cjs
```

Las pruebas incluyen la presencia y cantidad exacta de enlaces de Alejandría, las pantallas principales, las fechas y los ocho documentos PDF.

## Publicar gratis en GitHub Pages y generar el QR

1. Creá un repositorio **público** en tu cuenta GitHub, por ejemplo `huba-android-mvp`.
2. Desde la raíz del proyecto en VS Code, ejecutá (reemplazá `TU_USUARIO`):

   ```powershell
   git init
   git branch -M main
   git add .
   git commit -m "Actualización de Alejandría en h.UBA"
   git remote add origin https://github.com/TU_USUARIO/huba-android-mvp.git
   git push -u origin main
   ```

   **Si el repositorio ya existe y está configurado**, solo usá `git add .`, `git commit -m "Actualización de Alejandría"` y `git push`. No vuelvas a hacer `git init` ni `git remote add origin`.

3. En GitHub: **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. El workflow `Publicar PWA y generar QR` publica **únicamente `web/`** en GitHub Pages y genera `qr.png` con la dirección pública real.
5. Abrí `https://TU_USUARIO.github.io/huba-android-mvp/` o usá el QR en `https://TU_USUARIO.github.io/huba-android-mvp/qr.png` una vez finalizado el despliegue.

El hosting gratuito requiere que el repositorio sea público. Revisá los derechos de distribución de los documentos PDF antes de publicarlos; los PDF adjuntos se incluyen en la web pública. El proyecto no solicita credenciales universitarias y no sincroniza datos entre equipos.

## Estructura

```text
huba-android-mvp/
├── web/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   ├── sw.js
│   ├── manifest.webmanifest
│   ├── assets/
│   └── materiales/              8 documentos PDF
├── .github/workflows/pages.yml  Despliegue GitHub Pages
├── scripts/build_qr.py         Generador del código QR
├── tests/smoke.cjs             Pruebas automatizadas
├── docs/                       Referencias del proyecto
└── README.md
```
