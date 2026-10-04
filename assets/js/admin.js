/* ==========================================================
   NGL — Panel de administración
   Edita data/content.json y sube fotos directamente al
   repositorio de GitHub usando la API (sin servidor propio).
   Cada "Publicar" crea un único commit; GitHub Pages
   actualiza el sitio en 1–2 minutos.
   ========================================================== */
(function () {
  "use strict";

  const CFG = window.NGL_CONFIG;
  const API = "https://api.github.com";
  const TOKEN_KEY = "ngl_admin_token";

  /* ---------- Esquema del formulario ---------- */
  const ICON_OPTIONS = [
    ["music", "Nota musical"], ["users", "Personas"], ["heart", "Corazón"],
    ["star", "Estrella"], ["drum", "Tambor"], ["trophy", "Trofeo"],
    ["calendar", "Calendario"], ["sparkles", "Destellos"]
  ];

  const TABS = [
    {
      id: "general", label: "General", intro: "Datos de contacto y redes sociales que aparecen en todo el sitio.",
      root: (c) => c.site,
      fields: [
        { key: "name", label: "Nombre completo" },
        { key: "shortName", label: "Nombre corto (cabecera)" },
        { key: "description", label: "Descripción (pie de página y buscadores)", type: "textarea" },
        { key: "logo", label: "Logo", type: "image" },
        { key: "location", label: "Ubicación" },
        { key: "rehearsals", label: "Horario de ensayos", help: "Ej: Martes y jueves 5:00 p.m. · Polideportivo …" },
        { key: "whatsapp", label: "WhatsApp", help: "Con indicativo, solo números. Ej: 573001234567. Si lo llenas aparece el botón flotante." },
        { key: "email", label: "Correo electrónico" },
        { key: "instagram", label: "Enlace de Instagram", type: "url" },
        { key: "tiktok", label: "Enlace de TikTok", type: "url" }
      ]
    },
    {
      id: "portada", label: "Portada", intro: "Lo primero que ve la gente al entrar.",
      root: (c) => c,
      fields: [
        { type: "group", key: "hero", label: "Encabezado", fields: [
          { key: "eyebrow", label: "Texto pequeño superior" },
          { key: "title", label: "Título" },
          { key: "tagline", label: "Lema" },
          { key: "text", label: "Texto", type: "textarea" },
          { key: "images", label: "Fotos del collage (3)", type: "strings", of: "image", max: 3 }
        ] },
        { key: "marquee", label: "Cinta dorada en movimiento", type: "strings", of: "text", help: "Frases cortas que pasan en la cinta." },
        { key: "stats", label: "Cifras destacadas", type: "list", itemTitle: (it) => `${it.value} · ${it.label}`,
          newItem: { value: "", label: "" },
          fields: [{ key: "value", label: "Cifra" }, { key: "label", label: "Descripción" }], cols: 2 }
      ]
    },
    {
      id: "nosotros", label: "Nosotros", intro: "La historia y propósito del proyecto.",
      root: (c) => c.about,
      fields: [
        { key: "title", label: "Título" },
        { key: "text", label: "Texto", type: "textarea", help: "Deja una línea en blanco para separar párrafos." },
        { key: "image", label: "Foto principal", type: "image" },
        { key: "image2", label: "Foto secundaria", type: "image" },
        { key: "pillars", label: "Pilares", type: "list", itemTitle: (it) => it.title,
          newItem: { icon: "star", title: "", text: "" },
          fields: [
            { key: "icon", label: "Ícono", type: "select", options: ICON_OPTIONS },
            { key: "title", label: "Título" },
            { key: "text", label: "Texto", type: "textarea" }
          ] }
      ]
    },
    {
      id: "secciones", label: "Secciones", intro: "Windline, Drumline, Latina Line…",
      root: (c) => c,
      fields: [
        { key: "sections", label: "Secciones de la banda", type: "list", itemTitle: (it) => it.name,
          newItem: { name: "", image: "", text: "" },
          fields: [
            { key: "name", label: "Nombre" },
            { key: "image", label: "Imagen (redonda)", type: "image" },
            { key: "text", label: "Descripción", type: "textarea" }
          ] }
      ]
    },
    {
      id: "sinfonico", label: "Sinfónico", intro: "Anuncio del proyecto sinfónico en la página de inicio.",
      root: (c) => { if (!c.symphonic) c.symphonic = { show: false, highlights: [] }; return c.symphonic; },
      fields: [
        { key: "show", label: "Mostrar esta sección en el sitio", type: "checkbox" },
        { key: "badge", label: "Etiqueta", help: "Ej: Próximamente, ¡Inscripciones abiertas!, ¡Ya empezamos!" },
        { key: "eyebrow", label: "Texto pequeño superior" },
        { key: "title", label: "Título" },
        { key: "text", label: "Texto", type: "textarea", help: "Deja una línea en blanco para separar párrafos." },
        { key: "image", label: "Foto", type: "image" },
        { key: "highlights", label: "Puntos destacados", type: "list", itemTitle: (it) => it.title,
          newItem: { icon: "music", title: "", text: "" },
          fields: [
            { key: "icon", label: "Ícono", type: "select", options: ICON_OPTIONS },
            { key: "title", label: "Título" },
            { key: "text", label: "Texto" }
          ] },
        { key: "cta", label: "Texto del botón", help: "Lleva a WhatsApp (o a Instagram si no hay WhatsApp). Déjalo vacío para ocultar el botón." }
      ]
    },
    {
      id: "galeria", label: "Galería", intro: "Fotos de ensayos y presentaciones. Puedes enlazar cada una a su publicación de Instagram o TikTok.",
      root: (c) => c,
      fields: [
        { key: "gallery", label: "Fotos", type: "list", grid: true, itemTitle: (it) => it.caption,
          newItem: { image: "", caption: "", link: "", video: false }, addFirst: true,
          fields: [
            { key: "image", label: "Foto", type: "image" },
            { key: "caption", label: "Descripción" },
            { key: "link", label: "Enlace a la publicación (opcional)", type: "url" },
            { key: "video", label: "Es un video (muestra ícono ▶)", type: "checkbox" }
          ] }
      ]
    },
    {
      id: "staff", label: "Staff", intro: "Director, profesores y estudiante del mes.",
      root: (c) => c.staff,
      fields: [
        { key: "intro", label: "Texto de introducción", type: "textarea" },
        { type: "group", key: "studentOfMonth", label: "★ Estudiante del mes", help: "Aparece en la portada y en la página de staff. Deja el nombre vacío para ocultarlo.", fields: [
          { key: "month", label: "Mes", help: "Ej: Noviembre 2026" },
          { key: "name", label: "Nombre" },
          { key: "instrument", label: "Instrumento / sección" },
          { key: "photo", label: "Foto", type: "image" },
          { key: "text", label: "¿Por qué fue elegido?", type: "textarea" }
        ] },
        { type: "group", key: "director", label: "Director", fields: [
          { key: "name", label: "Nombre" },
          { key: "role", label: "Cargo" },
          { key: "photo", label: "Foto", type: "image" },
          { key: "bio", label: "Biografía", type: "textarea" },
          { key: "instagram", label: "Instagram (opcional)", type: "url" }
        ] },
        { key: "teachers", label: "Profesores e instructores", type: "list", itemTitle: (it) => `${it.name} — ${it.role}`,
          newItem: { name: "", role: "", photo: "", bio: "" },
          fields: [
            { key: "name", label: "Nombre" },
            { key: "role", label: "Cargo" },
            { key: "photo", label: "Foto", type: "image" },
            { key: "bio", label: "Descripción", type: "textarea" }
          ] }
      ]
    },
    {
      id: "donar", label: "Donaciones", intro: "Cuentas, enlaces de pago y en qué se usan las donaciones.",
      root: (c) => c.donate,
      fields: [
        { key: "title", label: "Título" },
        { key: "text", label: "Texto", type: "textarea" },
        { key: "methods", label: "Medios de donación", type: "list", itemTitle: (it) => it.name,
          newItem: { name: "", value: "", holder: "", link: "", qr: "" },
          fields: [
            { key: "name", label: "Nombre (Nequi, Bancolombia, PayPal…)" },
            { key: "value", label: "Número de cuenta / celular", help: "Se muestra con botón de copiar. Déjalo vacío si solo usas enlace." },
            { key: "holder", label: "Titular" },
            { key: "link", label: "Enlace de pago en línea (opcional)", type: "url", help: "Ej: enlace de Vaki, PayPal, Bold o botón Bancolombia." },
            { key: "qr", label: "Código QR (opcional)", type: "image" }
          ] },
        { key: "uses", label: "¿En qué se usa tu aporte?", type: "list", itemTitle: (it) => `${it.amount} · ${it.label}`,
          newItem: { amount: "", label: "" },
          fields: [{ key: "amount", label: "Monto" }, { key: "label", label: "Qué se compra" }], cols: 2 },
        { key: "inKind", label: "Donaciones en especie", type: "textarea" }
      ]
    }
  ];

  /* ---------- Estado ---------- */
  let token = null;
  let content = null;       // copia de trabajo
  let loadedSha = null;     // sha del content.json cargado
  let dirty = false;
  let currentTab = TABS[0].id;
  const pendingUploads = new Map(); // ruta -> base64
  const previews = new Map();       // ruta -> objectURL

  const $ = (s, el = document) => el.querySelector(s);
  const h = (tag, attrs = {}, ...children) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else if (k in el && k !== "list") el[k] = v;
      else el.setAttribute(k, v);
    }
    for (const c of children.flat()) if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(c));
    return el;
  };

  /* ---------- UTF-8 <-> base64 ---------- */
  function toBase64Utf8(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = "";
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }
  function fromBase64Utf8(b64) {
    const bin = atob(b64.replace(/\s/g, ""));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  /* ---------- API de GitHub ---------- */
  async function gh(path, opts = {}) {
    const res = await fetch(API + path, {
      ...opts,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        ...(opts.body ? { "Content-Type": "application/json" } : {})
      },
      cache: "no-store"
    });
    if (!res.ok) {
      let msg = "";
      try { msg = (await res.json()).message; } catch (_) {}
      const err = new Error(msg || res.statusText);
      err.status = res.status;
      throw err;
    }
    return res.status === 204 ? null : res.json();
  }
  const repoPath = `/repos/${CFG.owner}/${CFG.repo}`;

  function explain(err) {
    if (err.status === 401) return "La clave no es válida o expiró.";
    if (err.status === 403) return "La clave no tiene permiso para escribir en el repositorio (Contents: Read and write).";
    if (err.status === 404) return `La clave no tiene acceso al repositorio ${CFG.owner}/${CFG.repo}, o la rama "${CFG.branch}" no existe.`;
    if (err.status === 409 || err.status === 422) return "Alguien más publicó cambios al mismo tiempo. Intenta de nuevo.";
    return "Error: " + err.message;
  }

  /* ---------- Sesión ---------- */
  async function login(t, remember) {
    token = t.trim();
    const [user, repo] = await Promise.all([gh("/user").catch(() => null), gh(repoPath)]);
    if (repo.permissions && repo.permissions.push === false) {
      const e = new Error("sin permiso"); e.status = 403; throw e;
    }
    (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
    $("#user-name").textContent = user ? `Sesión: ${user.login}` : "";
    await loadContent();
    $("#login").classList.add("hidden");
    $("#editor").classList.remove("hidden");
    renderTabs();
    renderPanel();
  }

  function logout() {
    if (dirty && !confirm("Tienes cambios sin publicar. ¿Salir de todas formas?")) return;
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    dirty = false;
    location.reload();
  }

  async function loadContent() {
    const file = await gh(`${repoPath}/contents/${CFG.contentPath}?ref=${encodeURIComponent(CFG.branch)}`);
    loadedSha = file.sha;
    content = JSON.parse(fromBase64Utf8(file.content));
  }

  /* ---------- Publicar (un solo commit) ---------- */
  async function publish() {
    const btn = $("#publish");
    btn.disabled = true;
    setStatus("Publicando…");
    try {
      const latest = await gh(`${repoPath}/contents/${CFG.contentPath}?ref=${encodeURIComponent(CFG.branch)}`);
      if (latest.sha !== loadedSha &&
          !confirm("El contenido fue modificado desde otro dispositivo después de que abriste el panel. ¿Reemplazarlo con tu versión?")) {
        setStatus("Publicación cancelada");
        btn.disabled = false;
        return;
      }
      const ref = await gh(`${repoPath}/git/ref/heads/${encodeURIComponent(CFG.branch)}`);
      const baseCommit = await gh(`${repoPath}/git/commits/${ref.object.sha}`);

      const files = [...pendingUploads.entries()].map(([path, b64]) => ({ path, b64 }));
      files.push({ path: CFG.contentPath, b64: toBase64Utf8(JSON.stringify(content, null, 2) + "\n") });

      const tree = [];
      for (const f of files) {
        const blob = await gh(`${repoPath}/git/blobs`, { method: "POST", body: JSON.stringify({ content: f.b64, encoding: "base64" }) });
        tree.push({ path: f.path, mode: "100644", type: "blob", sha: blob.sha });
        if (f.path === CFG.contentPath) loadedSha = blob.sha;
      }
      const newTree = await gh(`${repoPath}/git/trees`, { method: "POST", body: JSON.stringify({ base_tree: baseCommit.tree.sha, tree }) });
      const n = pendingUploads.size;
      const commit = await gh(`${repoPath}/git/commits`, {
        method: "POST",
        body: JSON.stringify({
          message: `Actualizar contenido desde el panel${n ? ` (+${n} imagen${n > 1 ? "es" : ""})` : ""}`,
          tree: newTree.sha,
          parents: [ref.object.sha]
        })
      });
      await gh(`${repoPath}/git/refs/heads/${encodeURIComponent(CFG.branch)}`, { method: "PATCH", body: JSON.stringify({ sha: commit.sha }) });

      pendingUploads.clear();
      setDirty(false);
      setStatus("Publicado ✓");
      toast("¡Publicado! El sitio se actualizará en 1–2 minutos.");
      renderPanel();
    } catch (err) {
      console.error(err);
      setStatus("Error al publicar");
      toast(explain(err), true);
      btn.disabled = false;
    }
  }

  /* ---------- Imágenes ---------- */
  const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "imagen";

  function readAsBase64(blob) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result).split(",")[1]);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
  }

  async function prepareImage(file) {
    const MAX = 1600;
    const keepOriginal = /image\/(png|gif|svg\+xml|webp)/.test(file.type) && file.size < 600 * 1024;
    if (keepOriginal) {
      const ext = { "image/png": "png", "image/gif": "gif", "image/svg+xml": "svg", "image/webp": "webp" }[file.type];
      return { blob: file, ext };
    }
    const bitmap = await createImageBitmap(file).catch(() => null);
    if (!bitmap) {
      const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(file); });
      return drawToJpeg(img, img.naturalWidth, img.naturalHeight, MAX);
    }
    return drawToJpeg(bitmap, bitmap.width, bitmap.height, MAX);
  }
  function drawToJpeg(src, w, hgt, max) {
    const scale = Math.min(1, max / Math.max(w, hgt));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(hgt * scale);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(src, 0, 0, canvas.width, canvas.height);
    return new Promise((resolve) => canvas.toBlob((blob) => resolve({ blob, ext: "jpg" }), "image/jpeg", 0.85));
  }

  async function handleUpload(file) {
    if (!file || !file.type.startsWith("image/")) { toast("Selecciona un archivo de imagen.", true); return null; }
    const { blob, ext } = await prepareImage(file);
    const name = slug(file.name.replace(/\.[^.]+$/, ""));
    const path = `${CFG.uploadsDir}/${Date.now()}-${name}.${ext}`;
    pendingUploads.set(path, await readAsBase64(blob));
    previews.set(path, URL.createObjectURL(blob));
    return path;
  }

  const previewUrl = (path) => previews.get(path) || path;

  /* ---------- Constructor de formularios ---------- */
  function setDirty(v) {
    dirty = v;
    $("#publish").disabled = !v;
    setStatus(v ? "Cambios sin publicar" : "");
  }
  function setStatus(text) {
    const s = $("#status");
    s.textContent = text;
    s.classList.toggle("dirty", dirty);
  }
  function changed() { if (!dirty) setDirty(true); }

  function field(obj, def) {
    const type = def.type || "text";
    const help = def.help ? h("small", {}, def.help) : null;

    if (type === "group") {
      if (!obj[def.key]) obj[def.key] = {};
      return h("div", { class: "group" },
        h("h3", {}, def.label),
        def.help ? h("p", { class: "help-text" }, def.help) : null,
        def.fields.map((f) => field(obj[def.key], f)));
    }
    if (type === "list") return listField(obj, def);
    if (type === "strings") return stringsField(obj, def);
    if (type === "image") return imageField(obj, def.key, def.label, help);

    if (type === "checkbox") {
      return h("label", { class: "check" },
        h("input", { type: "checkbox", checked: !!obj[def.key], onchange: (e) => { obj[def.key] = e.target.checked; changed(); } }),
        def.label);
    }
    let input;
    if (type === "textarea") {
      input = h("textarea", { value: obj[def.key] || "", oninput: (e) => { obj[def.key] = e.target.value; changed(); } });
    } else if (type === "select") {
      input = h("select", { onchange: (e) => { obj[def.key] = e.target.value; changed(); } },
        def.options.map(([v, l]) => h("option", { value: v, selected: obj[def.key] === v }, l)));
    } else {
      input = h("input", { type: type === "url" ? "url" : "text", value: obj[def.key] || "", placeholder: type === "url" ? "https://…" : "",
        oninput: (e) => { obj[def.key] = e.target.value; changed(); } });
    }
    return h("label", { class: "field" }, h("span", {}, def.label), input, help);
  }

  function imageField(obj, key, label, help) {
    const preview = h("div", { class: "image-preview" });
    const pathEl = h("div", { class: "path" });
    const update = () => {
      const v = obj[key];
      preview.style.backgroundImage = v ? `url("${previewUrl(v)}")` : "";
      preview.textContent = v ? "" : "Sin imagen";
      pathEl.textContent = v ? (pendingUploads.has(v) ? "Nueva imagen (se sube al publicar)" : v) : "";
      pathEl.classList.toggle("pending", pendingUploads.has(v));
    };
    const fileInput = h("input", {
      type: "file", accept: "image/*",
      onchange: async (e) => {
        const f = e.target.files[0];
        e.target.value = "";
        if (!f) return;
        setStatus("Procesando imagen…");
        const path = await handleUpload(f);
        if (path) { obj[key] = path; changed(); update(); }
        setStatus(dirty ? "Cambios sin publicar" : "");
      }
    });
    update();
    return h("div", { class: "field" },
      h("span", {}, label),
      h("div", { class: "image-field" }, preview,
        h("div", { class: "image-controls" },
          h("div", { class: "row" },
            h("span", { class: "btn btn-outline btn-sm file-btn" }, "Subir foto", fileInput),
            h("button", { type: "button", class: "btn btn-ghost btn-sm", onclick: () => { obj[key] = ""; changed(); update(); } }, "Quitar")),
          pathEl)),
      help);
  }

  function itemTools(arr, i, rerender) {
    const move = (d) => { const [x] = arr.splice(i, 1); arr.splice(i + d, 0, x); changed(); rerender(); };
    return h("div", { class: "item-tools" },
      h("button", { type: "button", class: "icon-btn", title: "Subir", "aria-label": "Mover arriba", disabled: i === 0, onclick: () => move(-1) }, "↑"),
      h("button", { type: "button", class: "icon-btn", title: "Bajar", "aria-label": "Mover abajo", disabled: i === arr.length - 1, onclick: () => move(1) }, "↓"),
      h("button", { type: "button", class: "icon-btn danger", title: "Eliminar", "aria-label": "Eliminar",
        onclick: () => { if (confirm("¿Eliminar este elemento?")) { arr.splice(i, 1); changed(); rerender(); } } }, "✕"));
  }

  function listField(obj, def) {
    if (!Array.isArray(obj[def.key])) obj[def.key] = [];
    const arr = obj[def.key];
    const wrap = h("div", { class: "group" });
    const render = () => {
      wrap.replaceChildren(
        h("h3", {}, def.label),
        def.help ? h("p", { class: "help-text" }, def.help) : null,
        def.addFirst ? addButton() : null,
        h("div", { class: "list-items" + (def.grid ? " gallery-list" : "") },
          arr.map((item, i) => h("div", { class: "list-item" },
            h("div", { class: "list-item-head" }, h("strong", {}, (def.itemTitle && def.itemTitle(item)) || `#${i + 1}`), itemTools(arr, i, render)),
            h("div", { class: def.cols === 2 ? "grid-2" : "" }, def.fields.map((f) => field(item, f)))))),
        def.addFirst ? null : addButton());
    };
    const addButton = () => h("button", { type: "button", class: "btn btn-outline btn-sm add-btn",
      onclick: () => { const it = JSON.parse(JSON.stringify(def.newItem)); def.addFirst ? arr.unshift(it) : arr.push(it); changed(); render(); } }, "+ Agregar");
    render();
    return wrap;
  }

  function stringsField(obj, def) {
    if (!Array.isArray(obj[def.key])) obj[def.key] = [];
    const arr = obj[def.key];
    const wrap = h("div", { class: "group" });
    const render = () => {
      wrap.replaceChildren(
        h("h3", {}, def.label),
        def.help ? h("p", { class: "help-text" }, def.help) : null,
        h("div", { class: "list-items" },
          arr.map((_, i) => h("div", { class: "list-item" },
            h("div", { class: "list-item-head" }, h("strong", {}, `#${i + 1}`), itemTools(arr, i, render)),
            def.of === "image"
              ? imageField(arr, i, "Imagen")
              : h("label", { class: "field" }, h("input", { type: "text", value: arr[i] || "", oninput: (e) => { arr[i] = e.target.value; changed(); } }))))),
        def.max && arr.length >= def.max ? null :
          h("button", { type: "button", class: "btn btn-outline btn-sm add-btn", onclick: () => { arr.push(""); changed(); render(); } }, "+ Agregar"));
    };
    render();
    return wrap;
  }

  /* ---------- Pestañas ---------- */
  function renderTabs() {
    const nav = $("#tabs");
    nav.setAttribute("role", "tablist");
    nav.replaceChildren(...TABS.map((t) => h("button", {
      type: "button", role: "tab", "aria-selected": String(t.id === currentTab),
      onclick: () => { currentTab = t.id; renderTabs(); renderPanel(); window.scrollTo({ top: 0 }); }
    }, t.label)));
  }

  function renderPanel() {
    const tab = TABS.find((t) => t.id === currentTab);
    const root = tab.root(content);
    $("#panel").replaceChildren(
      h("h2", { class: "gold-text" }, tab.label),
      h("p", { class: "intro" }, tab.intro),
      ...tab.fields.map((f) => field(root, f)));
  }

  /* ---------- Avisos ---------- */
  let toastTimer;
  function toast(msg, isError) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.toggle("error", !!isError);
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), isError ? 7000 : 4500);
  }

  /* ---------- Arranque ---------- */
  $("#repo-name").textContent = `${CFG.owner}/${CFG.repo}`;
  $("#login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = $("#login-btn");
    btn.disabled = true;
    btn.textContent = "Verificando…";
    $("#login-error").textContent = "";
    try {
      await login($("#token").value, $("#remember").checked);
    } catch (err) {
      console.error(err);
      token = null;
      $("#login-error").textContent = explain(err);
    } finally {
      btn.disabled = false;
      btn.textContent = "Entrar";
    }
  });
  $("#publish").addEventListener("click", publish);
  $("#logout").addEventListener("click", logout);
  window.addEventListener("beforeunload", (e) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } });

  const saved = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  if (saved) {
    login(saved, !!localStorage.getItem(TOKEN_KEY)).catch((err) => {
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      token = null;
      $("#login-error").textContent = explain(err);
    });
  }
})();
