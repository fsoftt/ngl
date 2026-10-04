# Nueva Generación Latina — sitio web

Sitio de la **Banda Músico Marcial Nueva Generación Latina** (Dosquebradas, Risaralda), publicado con GitHub Pages.

- `index.html`: inicio (portada, nosotros, secciones, proyecto sinfónico, formulario de inscripción, galería, estudiante del mes y llamado a donar)
- `staff.html`: director, estudiante del mes y profesores
- `donar.html`: medios de donación con botón de copiar y donaciones en especie
- `admin.html`: **panel para editar el contenido** sin tocar código

Todo el contenido vive en [`data/content.json`](data/content.json). Las páginas lo leen al cargar.

## 1. Publicar en GitHub Pages (una sola vez)

1. Asegúrate de que estos archivos estén en la rama `main`.
2. En GitHub, abre el repositorio y ve a **Settings → Pages**.
3. En *Build and deployment* elige **Source: Deploy from a branch**, rama **`main`** y carpeta **`/ (root)`**. Guarda.
4. En 1 o 2 minutos el sitio queda en `https://fsoftt.github.io/ngl/`.

> ¿Dominio propio (por ejemplo `bandangl.com`)? Configúralo en la misma pantalla, en *Custom domain*.

## 2. Editar el contenido desde la página

1. Entra a `https://fsoftt.github.io/ngl/admin.html`. También está el enlace *Administrar contenido* en el pie de página.
2. Inicia sesión con una **clave de GitHub (token)**:
   - La persona debe tener una cuenta de GitHub con acceso de escritura al repositorio. Para agregar a alguien: *Settings → Collaborators → Add people*.
   - Crea la clave en <https://github.com/settings/personal-access-tokens/new>:
     - *Repository access*: **Only select repositories** y elige `ngl`.
     - *Repository permissions*: **Contents: Read and write**.
   - Copia la clave y pégala en el panel. Puedes marcar *Recordar en este dispositivo*.
3. Edita textos, sube fotos, agrega o quita elementos y pulsa **Publicar cambios**.
4. El sitio se actualiza solo en 1 o 2 minutos.

Las fotos que subas se reducen a un máximo de 1600 px y se guardan en `assets/uploads/`. Cada publicación queda como un commit, así que todo cambio se puede deshacer desde el historial de GitHub.

> La clave da acceso al repositorio: no la compartas. Si se pierde o se filtra, bórrala en GitHub y crea otra.

## 3. Pendientes (contenido provisional)

Las imágenes de `assets/img/posts/`, `assets/img/secciones/` y `assets/img/logo.png` son recortes de capturas de Instagram. Conviene reemplazarlas por los archivos originales desde el panel.

Además, revisa estos datos:

- [ ] Logo en buena resolución (PNG con fondo transparente)
- [ ] Fotos del director, los profesores y el estudiante del mes
- [ ] Nombres y descripciones de los profesores
- [ ] Números de cuenta reales (Nequi, Bancolombia, Daviplata) y, si existe, un enlace de pago en línea
- [ ] WhatsApp y correo de contacto. Al poner el WhatsApp aparece el botón flotante.
- [ ] Horario y lugar de ensayos
- [ ] Enlaces de cada publicación de la galería a Instagram o TikTok

## Formulario de inscripción

El formulario de la página de inicio no guarda datos en ningún servidor. Al enviarlo, abre un chat de WhatsApp con el número configurado (hoy +57 302 3163683) y deja el mensaje escrito con el nombre, teléfono, instrumento y observaciones. La persona solo tiene que pulsar *Enviar*.

El número, las opciones de instrumento y los textos se cambian en el panel, pestaña **Inscripción**.

## Estructura

```
index.html, staff.html, donar.html, admin.html
data/content.json        ← todo el contenido editable
assets/css/styles.css    ← estilos del sitio
assets/css/admin.css     ← estilos del panel
assets/js/main.js        ← pinta las páginas a partir del JSON
assets/js/admin.js       ← panel de edición (usa la API de GitHub)
assets/js/config.js      ← repositorio y rama que edita el panel
assets/img/              ← logo e imágenes provisionales
assets/uploads/          ← fotos subidas desde el panel
```

Para verlo en tu computador: `python3 -m http.server` en esta carpeta y abre <http://localhost:8000>. Abrir el HTML con doble clic no funciona, porque el navegador bloquea la lectura del JSON.
