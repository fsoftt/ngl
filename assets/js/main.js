/* ==========================================================
   NGL — pinta el sitio a partir de data/content.json
   El contenido se edita desde admin.html
   ========================================================== */
(function () {
  "use strict";

  const ICONS = {
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    prev: '<path d="M15 18l-6-6 6-6"/>',
    next: '<path d="M9 18l6-6-6-6"/>',
    play: '<path d="M7 4v16l13-8z" fill="currentColor" stroke="none"/>',
    heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
    music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    star: '<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
    drum: '<ellipse cx="12" cy="7" rx="9" ry="3"/><path d="M3 7v8c0 1.7 4 3 9 3s9-1.3 9-3V7M7 2l5 5M17 2l-5 5"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.7V17c0 .6-.5 1-1 1.2-1.2.5-2 2-2 3.8M14 14.7V17c0 .6.5 1 1 1.2 1.2.5 2 2 2 3.8M18 2H6v7a6 6 0 0 0 12 0z"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    sparkles: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 3v4M17 5h4M5 17v4M3 19h4"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>',
    tiktok: '<path d="M16 3c.4 2.6 2.1 4.3 5 4.6v3.3c-1.8 0-3.5-.5-5-1.5V16a6 6 0 1 1-6-6c.3 0 .7 0 1 .1v3.4a2.7 2.7 0 1 0 1.8 2.5V3z" fill="currentColor" stroke="none"/>',
    whatsapp: '<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.3-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.5-.6-2.7-1.2-4.4-3.9-4.6-4.1-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 1-2.3.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.1.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 2 1.1 1 2 1.3 2.3 1.4.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3z" fill="currentColor" stroke="none"/>'
  };
  const icon = (name) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.star}</svg>`;

  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const paragraphs = (s) =>
    String(s || "").split(/\n\s*\n/).filter(Boolean).map((p) => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`).join("");
  const initials = (name) =>
    String(name || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  const photo = (src, name, cls = "") =>
    src
      ? `<img src="${esc(src)}" alt="${esc(name)}" loading="lazy" class="${cls}">`
      : `<div class="avatar ${cls}" role="img" aria-label="${esc(name)}">${esc(initials(name))}</div>`;
  const waLink = (num, text) =>
    num ? `https://wa.me/${String(num).replace(/\D/g, "")}${text ? "?text=" + encodeURIComponent(text) : ""}` : "";

  /* ---------- Cabecera y pie compartidos ---------- */
  function renderHeader(c, page) {
    const links = [
      ["index.html", "Inicio", "home"],
      ["index.html#nosotros", "Nosotros", ""],
      ...(c.symphonic && c.symphonic.show ? [["index.html#sinfonico", "Sinfónico", ""]] : []),
      ["index.html#galeria", "Galería", ""],
      ["staff.html", "Staff", "staff"]
    ];
    const el = document.getElementById("site-header");
    el.className = "site-header";
    el.innerHTML = `
      <div class="container">
        <a class="brand" href="index.html" aria-label="${esc(c.site.name)} — inicio">
          <img src="${esc(c.site.logo)}" alt="" width="48" height="48">
          <span class="brand-text"><strong class="gold-text">${esc(c.site.shortName)}</strong><span>${esc(c.site.name)}</span></span>
        </a>
        <button class="menu-toggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="nav">${icon("menu")}</button>
        <nav class="nav" id="nav" aria-label="Principal">
          ${links.map(([href, label, id]) => `<a href="${href}"${id && id === page ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
          <a class="btn btn-gold btn-sm" href="donar.html"${page === "donar" ? ' aria-current="page"' : ""}>${icon("heart")} Donar</a>
        </nav>
      </div>`;
    const toggle = el.querySelector(".menu-toggle");
    const nav = el.querySelector(".nav");
    const setOpen = (open) => {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      toggle.innerHTML = icon(open ? "close" : "menu");
    };
    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  }

  function socialLinks(s) {
    const items = [];
    if (s.instagram) items.push(`<a href="${esc(s.instagram)}" target="_blank" rel="noopener" aria-label="Instagram">${icon("instagram")}</a>`);
    if (s.tiktok) items.push(`<a href="${esc(s.tiktok)}" target="_blank" rel="noopener" aria-label="TikTok">${icon("tiktok")}</a>`);
    if (s.whatsapp) items.push(`<a href="${esc(waLink(s.whatsapp))}" target="_blank" rel="noopener" aria-label="WhatsApp">${icon("whatsapp")}</a>`);
    if (s.email) items.push(`<a href="mailto:${esc(s.email)}" aria-label="Correo">${icon("mail")}</a>`);
    return `<div class="social">${items.join("")}</div>`;
  }

  function renderFooter(c) {
    const s = c.site;
    const el = document.getElementById("site-footer");
    el.className = "site-footer";
    el.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div>
            <a class="brand" href="index.html"><img src="${esc(s.logo)}" alt="" width="48" height="48">
              <span class="brand-text"><strong class="gold-text">${esc(s.shortName)}</strong><span>${esc(s.name)}</span></span></a>
            <p style="margin-top:16px">${esc(c.site.description)}</p>
            ${socialLinks(s)}
          </div>
          <div>
            <h4>Explora</h4>
            <ul>
              <li><a href="index.html#nosotros">Nosotros</a></li>
              <li><a href="index.html#secciones">Secciones</a></li>
              ${c.symphonic && c.symphonic.show ? `<li><a href="index.html#sinfonico">Proyecto sinfónico</a></li>` : ""}
              <li><a href="index.html#galeria">Galería</a></li>
              <li><a href="staff.html">Staff</a></li>
              <li><a href="donar.html">Donar</a></li>
            </ul>
          </div>
          <div>
            <h4>Encuéntranos</h4>
            <ul>
              <li>${esc(s.location)}</li>
              ${s.rehearsals ? `<li>${esc(s.rehearsals)}</li>` : ""}
              ${s.whatsapp ? `<li><a href="${esc(waLink(s.whatsapp))}" target="_blank" rel="noopener">WhatsApp: ${esc(s.whatsapp)}</a></li>` : ""}
              ${s.email ? `<li><a href="mailto:${esc(s.email)}">${esc(s.email)}</a></li>` : ""}
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} ${esc(s.name)}. Hecho con 💙 en Dosquebradas.</span>
          <a href="admin.html">Administrar contenido</a>
        </div>
      </div>`;
    if (s.whatsapp) {
      const wa = document.createElement("a");
      wa.className = "wa-float";
      wa.href = waLink(s.whatsapp, "¡Hola NGL! Quiero más información.");
      wa.target = "_blank";
      wa.rel = "noopener";
      wa.setAttribute("aria-label", "Escríbenos por WhatsApp");
      wa.innerHTML = icon("whatsapp");
      document.body.appendChild(wa);
    }
  }

  /* ---------- Página de inicio ---------- */
  function renderHome(c) {
    const h = c.hero;
    const imgs = h.images || [];
    const marquee = (c.marquee || []).map((t) => `<span>${esc(t)}</span>`).join("");
    const som = c.staff.studentOfMonth;
    return `
      <section class="hero">
        <div class="container hero-grid">
          <div class="hero-text">
            <span class="eyebrow">${esc(h.eyebrow)}</span>
            <h1 class="gold-text">${esc(h.title)}</h1>
            <p class="tagline">${esc(h.tagline)}</p>
            <p class="lead">${esc(h.text)}</p>
            <div class="hero-actions">
              <a class="btn btn-gold" href="donar.html">${icon("heart")} Apoya a la banda</a>
              <a class="btn btn-outline" href="#nosotros">Conócenos</a>
            </div>
            <div class="hero-social">${socialLinks(c.site)}</div>
          </div>
          <div class="hero-visual" aria-hidden="true">
            <div class="hero-ring"></div><div class="hero-ring r2"></div>
            ${imgs[0] ? `<img class="hero-photo p1" src="${esc(imgs[0])}" alt="">` : ""}
            ${imgs[1] ? `<img class="hero-photo p2" src="${esc(imgs[1])}" alt="">` : ""}
            ${imgs[2] ? `<img class="hero-photo p3" src="${esc(imgs[2])}" alt="">` : ""}
            <img class="hero-logo" src="${esc(c.site.logo)}" alt="">
          </div>
        </div>
      </section>

      ${marquee ? `<div class="marquee" aria-hidden="true"><div class="marquee-track">${marquee}${marquee}${marquee}${marquee}</div></div>` : ""}

      <section class="section" aria-label="En cifras">
        <div class="container stats">
          ${(c.stats || []).map((s) => `<div class="stat reveal"><strong class="gold-text">${esc(s.value)}</strong><span>${esc(s.label)}</span></div>`).join("")}
        </div>
      </section>

      <section class="section section-alt" id="nosotros">
        <div class="container about-grid">
          <div class="about-media reveal">
            ${c.about.image ? `<img src="${esc(c.about.image)}" alt="Integrantes de la banda" loading="lazy">` : ""}
            ${c.about.image2 ? `<img class="second" src="${esc(c.about.image2)}" alt="" loading="lazy">` : ""}
          </div>
          <div class="about-text reveal">
            <span class="eyebrow">Quiénes somos</span>
            <h2>${esc(c.about.title)}</h2>
            <div class="body">${paragraphs(c.about.text)}</div>
            <div class="pillars">
              ${(c.about.pillars || []).map((p) => `
                <div class="pillar">
                  <div class="pillar-icon">${icon(p.icon)}</div>
                  <div><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></div>
                </div>`).join("")}
            </div>
          </div>
        </div>
      </section>

      <section class="section" id="secciones">
        <div class="container">
          <div class="section-head center reveal">
            <span class="eyebrow">Nuestra banda</span>
            <h2>Secciones <span class="gold-text">NGL</span></h2>
            <p>Cada integrante encuentra su lugar: vientos, percusión o danza.</p>
          </div>
          <div class="band-sections">
            ${(c.sections || []).map((s) => `
              <article class="band-card reveal">
                ${s.image ? `<img src="${esc(s.image)}" alt="" loading="lazy">` : ""}
                <h3 class="gold-text">${esc(s.name)}</h3>
                <p>${esc(s.text)}</p>
              </article>`).join("")}
          </div>
        </div>
      </section>

      ${renderSymphonic(c)}

      <section class="section section-alt" id="galeria">
        <div class="container">
          <div class="section-head center reveal">
            <span class="eyebrow">Galería</span>
            <h2>Así suena <span class="gold-text">NGL</span></h2>
            <p>Ensayos, desfiles y los momentos que nos hacen familia.</p>
          </div>
          <div class="gallery">
            ${(c.gallery || []).map((g, i) => `
              <button class="gallery-item reveal" data-index="${i}" aria-label="Ver: ${esc(g.caption)}">
                <img src="${esc(g.image)}" alt="${esc(g.caption)}" loading="lazy">
                ${g.video ? `<span class="play">${icon("play")}</span>` : ""}
                ${g.caption ? `<span class="cap">${esc(g.caption)}</span>` : ""}
              </button>`).join("")}
          </div>
          ${c.site.instagram ? `<div class="gallery-more"><a class="btn btn-outline" href="${esc(c.site.instagram)}" target="_blank" rel="noopener">${icon("instagram")} Ver más en Instagram</a></div>` : ""}
        </div>
      </section>

      ${som && som.name ? `
      <section class="section" id="estudiante-del-mes">
        <div class="container">
          <div class="spotlight reveal">
            <div class="spotlight-photo">${photo(som.photo, som.name)}<span class="spotlight-badge">★ Estudiante del mes</span></div>
            <div>
              <span class="eyebrow">${esc(som.month)}</span>
              <h2>${esc(som.name)}</h2>
              <div class="meta">${esc(som.instrument)}</div>
              ${paragraphs(som.text)}
              <a class="btn btn-gold" href="staff.html">Conoce a nuestro staff</a>
            </div>
          </div>
        </div>
      </section>` : ""}

      <section class="section" style="padding-top:0">
        <div class="container">
          <div class="cta-band reveal">
            <div>
              <h2>${esc(c.donate.title)}</h2>
              <p>${esc(c.donate.text)}</p>
            </div>
            <a class="btn btn-dark" href="donar.html">${icon("heart")} Quiero donar</a>
          </div>
        </div>
      </section>`;
  }

  function renderSymphonic(c) {
    const s = c.symphonic;
    if (!s || !s.show) return "";
    const link = c.site.whatsapp
      ? waLink(c.site.whatsapp, "¡Hola NGL! Quiero información sobre el proyecto sinfónico.")
      : c.site.instagram;
    return `
      <section class="section symphonic" id="sinfonico">
        <div class="staff-lines" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>
        <div class="container symphonic-grid">
          <div class="symphonic-text reveal">
            ${s.badge ? `<span class="soon-badge">${icon("sparkles")} ${esc(s.badge)}</span>` : ""}
            <span class="eyebrow">${esc(s.eyebrow)}</span>
            <h2>${esc(s.title)}</h2>
            <div class="body">${paragraphs(s.text)}</div>
            <ul class="symphonic-highlights">
              ${(s.highlights || []).map((hl) => `
                <li><span class="hl-icon">${icon(hl.icon)}</span><div><strong>${esc(hl.title)}</strong><span>${esc(hl.text)}</span></div></li>`).join("")}
            </ul>
            ${s.cta && link ? `<a class="btn btn-dark" href="${esc(link)}" target="_blank" rel="noopener">${icon("music")} ${esc(s.cta)}</a>` : ""}
          </div>
          ${s.image ? `
          <div class="symphonic-media reveal">
            <div class="frame"><img src="${esc(s.image)}" alt="${esc(s.title)}" loading="lazy"></div>
            <span class="clef" aria-hidden="true">𝄞</span>
          </div>` : ""}
        </div>
      </section>`;
  }

  /* ---------- Staff ---------- */
  function renderStaff(c) {
    const st = c.staff;
    const d = st.director;
    const som = st.studentOfMonth;
    return `
      <section class="page-hero">
        <div class="container">
          <span class="eyebrow">Nuestro equipo</span>
          <h1 class="gold-text">Staff NGL</h1>
          <p>${esc(st.intro)}</p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <article class="director reveal">
            <div class="director-photo">${photo(d.photo, d.name)}</div>
            <div>
              <span class="role-tag">${esc(d.role)}</span>
              <h2>${esc(d.name)}</h2>
              ${paragraphs(d.bio)}
              ${d.instagram ? `<a class="btn btn-outline" href="${esc(d.instagram)}" target="_blank" rel="noopener">${icon("instagram")} Seguir en Instagram</a>` : ""}
            </div>
          </article>
        </div>
      </section>

      ${som && som.name ? `
      <section class="section section-alt" id="estudiante-del-mes">
        <div class="container">
          <div class="section-head center reveal">
            <span class="eyebrow">Reconocimiento</span>
            <h2>Estudiante <span class="gold-text">del mes</span></h2>
          </div>
          <div class="spotlight reveal">
            <div class="spotlight-photo">${photo(som.photo, som.name)}<span class="spotlight-badge">★ ${esc(som.month)}</span></div>
            <div>
              <h2>${esc(som.name)}</h2>
              <div class="meta">${esc(som.instrument)}</div>
              ${paragraphs(som.text)}
            </div>
          </div>
        </div>
      </section>` : ""}

      <section class="section">
        <div class="container">
          <div class="section-head center reveal">
            <span class="eyebrow">Formadores</span>
            <h2>Profesores e <span class="gold-text">instructores</span></h2>
          </div>
          <div class="team">
            ${(st.teachers || []).map((t) => `
              <article class="member reveal">
                ${photo(t.photo, t.name)}
                <div class="member-body">
                  <h3>${esc(t.name)}</h3>
                  <div class="role">${esc(t.role)}</div>
                  <p>${esc(t.bio)}</p>
                </div>
              </article>`).join("")}
          </div>
        </div>
      </section>

      <section class="section" style="padding-top:0">
        <div class="container">
          <div class="cta-band reveal">
            <div>
              <h2>¿Quieres sumarte?</h2>
              <p>Si eres músico, instructor o quieres ser voluntario, escríbenos. También puedes apoyar con una donación.</p>
            </div>
            <a class="btn btn-dark" href="${c.site.whatsapp ? esc(waLink(c.site.whatsapp, "¡Hola NGL! Quiero sumarme como voluntario.")) : esc(c.site.instagram)}" target="_blank" rel="noopener">Escríbenos</a>
          </div>
        </div>
      </section>`;
  }

  /* ---------- Donar ---------- */
  function renderDonate(c) {
    const d = c.donate;
    const contact = c.site.whatsapp ? waLink(c.site.whatsapp, "¡Hola NGL! Quiero donar un instrumento o materiales.") : c.site.instagram;
    return `
      <section class="page-hero">
        <div class="container">
          <span class="eyebrow">Apoya el proyecto</span>
          <h1 class="gold-text">${esc(d.title)}</h1>
          <p>${esc(d.text)}</p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head center reveal">
            <span class="eyebrow">Tu impacto</span>
            <h2>¿En qué se <span class="gold-text">usa tu aporte?</span></h2>
          </div>
          <div class="uses">
            ${(d.uses || []).map((u) => `<div class="use reveal"><strong class="gold-text">${esc(u.amount)}</strong><span>${esc(u.label)}</span></div>`).join("")}
          </div>
        </div>
      </section>

      <section class="section section-alt" id="metodos">
        <div class="container">
          <div class="section-head center reveal">
            <span class="eyebrow">Cómo donar</span>
            <h2>Medios de <span class="gold-text">donación</span></h2>
            <p>Cualquier monto suma. Si quieres un comprobante o contarnos tu donación, escríbenos.</p>
          </div>
          <div class="methods">
            ${(d.methods || []).map((m) => `
              <article class="method reveal">
                <h3>${esc(m.name)}</h3>
                ${m.qr ? `<img class="qr" src="${esc(m.qr)}" alt="Código QR ${esc(m.name)}" loading="lazy">` : ""}
                ${m.value ? `<div class="value">${esc(m.value)}</div>` : ""}
                ${m.holder ? `<div class="holder">${esc(m.holder)}</div>` : ""}
                <div class="actions">
                  ${m.value ? `<button class="btn btn-sm btn-copy" data-copy="${esc(m.value)}">${icon("copy")} Copiar</button>` : ""}
                  ${m.link ? `<a class="btn btn-sm btn-gold" href="${esc(m.link)}" target="_blank" rel="noopener">${icon("link")} Donar en línea</a>` : ""}
                </div>
              </article>`).join("")}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="inkind reveal">
            <div class="icon">${icon("gift")}</div>
            <div><h3>Donaciones en especie</h3><p>${esc(d.inKind)}</p></div>
            <a class="btn btn-gold" href="${esc(contact)}" target="_blank" rel="noopener">Escríbenos</a>
          </div>
        </div>
      </section>`;
  }

  /* ---------- Interacciones ---------- */
  function setupLightbox(items) {
    const grid = document.querySelector(".gallery");
    if (!grid) return;
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.innerHTML = `
      <button class="lightbox-btn lightbox-close" aria-label="Cerrar">${icon("close")}</button>
      <button class="lightbox-btn lightbox-prev" aria-label="Anterior">${icon("prev")}</button>
      <figure><img alt=""><figcaption></figcaption></figure>
      <button class="lightbox-btn lightbox-next" aria-label="Siguiente">${icon("next")}</button>`;
    document.body.appendChild(lb);
    let idx = 0, lastFocus = null;
    const show = (i) => {
      idx = (i + items.length) % items.length;
      const g = items[idx];
      lb.querySelector("img").src = g.image;
      lb.querySelector("img").alt = g.caption || "";
      lb.querySelector("figcaption").innerHTML = esc(g.caption) +
        (g.link ? `<br><a href="${esc(g.link)}" target="_blank" rel="noopener">Ver publicación ${g.video ? "(video)" : ""} →</a>` : "");
    };
    const open = (i) => { lastFocus = document.activeElement; show(i); lb.classList.add("open"); lb.querySelector(".lightbox-close").focus(); document.body.style.overflow = "hidden"; };
    const close = () => { lb.classList.remove("open"); document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); };
    grid.addEventListener("click", (e) => { const b = e.target.closest(".gallery-item"); if (b) open(+b.dataset.index); });
    lb.querySelector(".lightbox-close").onclick = close;
    lb.querySelector(".lightbox-prev").onclick = () => show(idx - 1);
    lb.querySelector(".lightbox-next").onclick = () => show(idx + 1);
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
    let x0 = null;
    lb.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }

  function setupCopy() {
    document.addEventListener("click", async (e) => {
      const b = e.target.closest("[data-copy]");
      if (!b) return;
      const text = b.dataset.copy.replace(/\s/g, "");
      try {
        await navigator.clipboard.writeText(text);
      } catch (_) {
        const t = document.createElement("textarea");
        t.value = text; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove();
      }
      const old = b.innerHTML;
      b.classList.add("copied");
      b.textContent = "¡Copiado!";
      setTimeout(() => { b.classList.remove("copied"); b.innerHTML = old; }, 1800);
    });
  }

  function setupReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("visible")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    els.forEach((e) => io.observe(e));
  }

  /* ---------- Arranque ---------- */
  const RENDERERS = { home: renderHome, staff: renderStaff, donar: renderDonate };

  async function init() {
    const page = document.body.dataset.page;
    const main = document.getElementById("main");
    let content;
    try {
      const res = await fetch("data/content.json", { cache: "no-cache" });
      if (!res.ok) throw new Error(res.status);
      content = await res.json();
    } catch (err) {
      main.innerHTML = `<div class="loading"><p>No se pudo cargar el contenido. Recarga la página.</p></div>`;
      return;
    }
    renderHeader(content, page);
    main.innerHTML = RENDERERS[page](content);
    renderFooter(content);
    if (page === "home") setupLightbox(content.gallery || []);
    setupCopy();
    setupReveal();
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) target.scrollIntoView();
    }
  }

  init();
})();
