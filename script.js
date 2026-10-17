/* =========================================================
   Universidad Libre — Rediseño de inicio
   JavaScript sin dependencias. Todo el contenido funciona sin JS
   salvo las listas generadas (facultades, seccional activa, noticias).
   ========================================================= */
(function () {
  'use strict';

  const BASE = 'https://www.unilibre.edu.co';
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------------------------------------------------------
     Datos (verificados en unilibre.edu.co, octubre de 2026)
     --------------------------------------------------------- */
  const CITIES = {
    bogota: 'Bogotá', barranquilla: 'Barranquilla', cali: 'Cali', pereira: 'Pereira',
    cucuta: 'Cúcuta', cartagena: 'Cartagena', socorro: 'El Socorro'
  };

  // Fuente: /facultades
  const FACULTIES = [
    { name: 'Derecho, Ciencias Políticas y Sociales', slug: 'facultad-de-derecho-ciencias-politicas-y-sociales',
      cities: ['bogota', 'barranquilla', 'cali', 'pereira', 'cucuta', 'cartagena', 'socorro'] },
    { name: 'Ciencias Económicas, Administrativas y Contables', slug: 'facultad-de-ciencias-economicas-administrativas-y-contables',
      cities: ['bogota', 'barranquilla', 'cali', 'pereira', 'cucuta', 'cartagena', 'socorro'] },
    { name: 'Ingeniería', slug: 'facultad-de-ingenieria',
      cities: ['bogota', 'barranquilla', 'cali', 'pereira', 'cucuta', 'socorro'] },
    { name: 'Ciencias de la Salud', slug: 'facultad-de-ciencias-de-la-salud',
      cities: ['barranquilla', 'cali', 'pereira'] },
    { name: 'Ciencias de la Educación', slug: 'facultad-de-ciencias-de-la-educacion',
      cities: ['bogota', 'socorro'] },
    { name: 'Filosofía y Ciencias Humanas', slug: 'facultad-de-filosofia-y-ciencias-humanas',
      cities: ['bogota'] }
  ];

  // Fuente: /sobre-la-universidad-libre
  const CAMPUSES = {
    bogota: { year: 1923, text: 'Sede fundacional. Abrió el 13 de febrero de 1923 con Derecho y Ciencias Políticas, Ingeniería, Literatura y Filosofía, y las escuelas de Comercio, Artes y Oficios y Preparatoria. Hoy funciona en los campus La Candelaria y El Bosque Popular.' },
    barranquilla: { year: 1956, text: 'Primera seccional fuera de Bogotá, impulsada por egresados de la Universidad. Comenzó ofreciendo el programa de Derecho.' },
    pereira: { year: 1971, text: 'Llegó para acompañar el desarrollo regional del Eje Cafetero.' },
    cucuta: { year: 1973, text: 'Inició con el programa de Derecho, el primero de la región.' },
    cali: { year: 1973, text: 'Abrió con Derecho y luego sumó las facultades de Administración y Contaduría.' },
    socorro: { year: 1974, text: 'En la tierra de la revolución comunera empezó con Ciencias de la Educación en Física y Matemáticas, Filología e Idiomas, y Ciencias Sociales.' },
    cartagena: { year: 1996, text: 'Allí funcionaba desde años atrás el Colegio de Bachillerato Universidad Libre; en 1996 se convirtió en sede por extensión de programas de otras seccionales.' }
  };

  // Fuente: portada de unilibre.edu.co (15 y 16 de octubre de 2026)
  const NEWS = [
    { date: '2026-10-16', type: 'Noticia', cities: ['bogota'], title: 'Se acerca el simulacro nacional de emergencias',
      text: 'Una oportunidad para reconocer las rutas de evacuación y seguir las indicaciones de la brigada.',
      url: '/noticias/cuidarnos-tambien-es-un-compromiso-en-equipo-se-aproxima-el-simulacro-nacional-de-emergencias/' },
    { date: '2026-10-16', type: 'Noticia', cities: ['bogota'], title: 'Nuestra formación trasciende el aula',
      text: 'Los egresados de la seccional Bogotá registran un 79 % de inserción laboral en los últimos cinco años.',
      url: '/noticias/nuestra-formacion-que-trasciende-el-aula/' },
    { date: '2026-10-15', type: 'Evento', cities: ['bogota'], title: '¡Hablemos del futuro de nuestros humedales!',
      text: 'Conversatorio sobre gobernanza de los humedales, organizado con la Secretaría de Ambiente de Bogotá.',
      url: '/eventos/hablemos-del-futuro-de-nuestros-humedales/' },
    { date: '2026-10-15', type: 'Noticia', cities: ['bogota'], title: 'Solicitudes al área de Admisiones',
      text: 'Consulta qué trámites puedes hacer con Admisiones y tenlos a la mano durante el semestre.',
      url: '/noticias/solicitudes-al-area-de-admisiones/' },
    { date: '2026-10-15', type: 'Evento', cities: ['bogota'], title: 'Trae un libro, comparte historias',
      text: 'El 19 de octubre, una jornada de literatura, cine y reflexión sobre el español.',
      url: '/eventos/trae-un-libro-comparte-historias-y-descubre-nuevas-miradas/' },
    { date: '2026-10-15', type: 'Noticia', cities: ['bogota'], title: 'Tu bienestar también es parte de nuestra excelencia',
      text: 'Desde 2021, Bienestar Universitario ha realizado más de 98.060 intervenciones.',
      url: '/noticias/tu-bienestar-tambien-es-parte-de-nuestra-excelencia/' },
    { date: '2026-10-15', type: 'Evento', cities: ['cali'], title: 'El cuerpo también cuenta historias',
      text: 'Cuarta sesión de la Cátedra Gerardo Molina 2026-2, sobre literatura, género y reconocimiento.',
      url: '/noticias/el-cuerpo-tambien-cuenta-historias-catedra-gerardo-molina/' },
    { date: '2026-10-15', type: 'Noticia', cities: ['cali'], title: 'Aviso importante: alerta de fraude',
      text: 'La Universidad advierte sobre una cuenta de correo falsa que se hace pasar por la oficina de egresados.',
      url: '/noticias/aviso-importante-alerta-de-fraude/' }
  ];

  // Índice para la búsqueda rápida
  const SEARCH_INDEX = [
    ['Pregrados', 'Estudia', '/pregrados/'], ['Posgrados', 'Estudia', '/posgrados/'],
    ['Programas virtuales', 'Estudia', '/programas-virtuales/'], ['Educación continua', 'Estudia', '/educacion-continua/'],
    ['Inscripciones', 'Aspirantes', '/aspirantes/'], ['Financiación', 'Aspirantes', '/financiacion'],
    ['Derechos pecuniarios (valores de matrícula)', 'Aspirantes', '/derechos-pecuniarios/'],
    ['Admisiones y registro', 'Servicios', '/admisiones-y-registro/'],
    ['Bienestar universitario', 'Servicios', '/bienestar-universitario/'],
    ['Biblioteca', 'Servicios', '/biblioteca'], ['Servicios TIC', 'Servicios', '/servicios-tic/'],
    ['Consultorio jurídico y unidades de proyección social', 'Servicios', '/consultorios-y-unidades-de-proyeccion-social/'],
    ['SIUL (sistema académico)', 'Plataformas', 'https://siul.unilibre.edu.co/sinugwt/'],
    ['Campus virtual', 'Plataformas', '/campus-virtual/'], ['Pagos en línea PSE', 'Plataformas', '/pasarelas-de-pago-pse/'],
    ['Correo institucional', 'Plataformas', 'https://outlook.office.com'],
    ['Facultades', 'La Universidad', '/facultades'], ['Historia', 'La Universidad', '/sobre-la-universidad-libre/'],
    ['Directorio institucional', 'La Universidad', '/directorio-institucional/'], ['Normativa', 'La Universidad', '/normativas/'],
    ['Centro de Lenguas Extranjeras (CLEUL)', 'La Universidad', '/cleul/'],
    ['Investigación', 'Investigación', '/investigacion'], ['Revistas', 'Investigación', 'https://revistas.unilibre.edu.co/'],
    ['Grupos de investigación', 'Investigación', 'https://inv-centenario.unilibre.edu.co/PGrupos/'],
    ['Internacionalización', 'Vida universitaria', '/internacionalizacion/'],
    ['Emisora Centenario', 'Vida universitaria', '/emisora-centenario/'],
    ['Noticias', 'Actualidad', '/noticias'], ['Eventos', 'Actualidad', '/eventos/'],
    ['PQRSF', 'Atención', 'https://www.kawak.com.co/unilibre/pqrs/pqrs_index.php'],
    ['Transparencia', 'Atención', '/transparencia-y-acceso-a-la-informacion-publica/'],
    ['Convocatorias CNSC', 'Servicios', '/convocatorias-cnsc/'],
    ['Colegio Universidad Libre', 'Estudia', '/colegio/']
  ].concat(Object.keys(CITIES).map(k => [`Seccional ${CITIES[k]}`, 'Seccionales', `/${k}`]));

  const abs = url => (url.startsWith('http') ? url : BASE + url);
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  /* ---------------------------------------------------------
     Preferencias de accesibilidad (persisten si hay storage)
     --------------------------------------------------------- */
  const store = {
    get(k) { try { return localStorage.getItem('ul-' + k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem('ul-' + k, v); } catch (e) { /* sin storage */ } },
    del(k) { try { localStorage.removeItem('ul-' + k); } catch (e) { /* sin storage */ } }
  };
  const root = document.documentElement;

  function applyPrefs() {
    const font = store.get('font') || '0';
    root.dataset.font = font;
    $$('.segmented [data-font]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.font === font)));

    const toggles = { contrast: ['opt-contrast', 'high'], motion: ['opt-motion', 'reduce'], links: ['opt-links', 'underline'] };
    Object.entries(toggles).forEach(([key, [id, val]]) => {
      const on = store.get(key) === val;
      if (on) root.dataset[key] = val; else delete root.dataset[key];
      const input = document.getElementById(id);
      if (input) input.checked = on;
    });
  }

  function initA11yPanel() {
    const btn = $('.utility__a11y');
    const panel = $('#a11y-panel');
    if (!btn || !panel) return;

    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
      if (!open) panel.querySelector('button, input').focus();
    });

    $$('.segmented [data-font]').forEach(b => b.addEventListener('click', () => {
      store.set('font', b.dataset.font); applyPrefs(); setNavTop();
    }));

    [['opt-contrast', 'contrast', 'high'], ['opt-motion', 'motion', 'reduce'], ['opt-links', 'links', 'underline']]
      .forEach(([id, key, val]) => {
        const input = document.getElementById(id);
        input && input.addEventListener('change', () => {
          input.checked ? store.set(key, val) : store.del(key);
          applyPrefs();
        });
      });

    $('#a11y-reset').addEventListener('click', () => {
      ['font', 'contrast', 'motion', 'links'].forEach(store.del);
      applyPrefs(); setNavTop();
    });
  }

  /* ---------------------------------------------------------
     Navegación principal: mega menús + menú móvil
     --------------------------------------------------------- */
  const header = $('.site-header');
  const nav = $('#main-nav');
  const menuToggle = $('.menu-toggle');
  const triggers = $$('.main-nav__trigger');
  const isMobile = () => window.matchMedia('(max-width: 1080px)').matches;

  function setNavTop() {
    if (!header) return;
    const rect = header.getBoundingClientRect();
    root.style.setProperty('--nav-top', Math.max(rect.bottom, 0) + 'px');
  }

  function closeAllMega(except) {
    triggers.forEach(t => {
      if (t === except) return;
      t.setAttribute('aria-expanded', 'false');
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = true;
    });
  }

  function toggleMega(trigger, force) {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    const open = force !== undefined ? force : trigger.getAttribute('aria-expanded') !== 'true';
    closeAllMega(trigger);
    trigger.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
  }

  function initNav() {
    triggers.forEach(t => {
      t.addEventListener('click', () => toggleMega(t));
      t.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown') {
          e.preventDefault(); toggleMega(t, true);
          const first = document.getElementById(t.getAttribute('aria-controls')).querySelector('a');
          first && first.focus();
        }
      });
    });

    // Cerrar con Escape devolviendo el foco
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      const open = triggers.find(t => t.getAttribute('aria-expanded') === 'true');
      if (open) { toggleMega(open, false); open.focus(); return; }
      if (nav.classList.contains('is-open')) { setMobileMenu(false); menuToggle.focus(); }
    });

    // Cerrar al hacer clic fuera (escritorio)
    document.addEventListener('click', e => {
      if (!isMobile() && !e.target.closest('.has-mega')) closeAllMega();
    });

    // Cerrar al salir el foco del menú (escritorio)
    $$('.has-mega').forEach(li => li.addEventListener('focusout', e => {
      if (!isMobile() && !li.contains(e.relatedTarget)) closeAllMega();
    }));

    menuToggle.addEventListener('click', () => setMobileMenu(!nav.classList.contains('is-open')));

    // Enlaces de ancla en el menú móvil cierran el menú
    $$('.main-nav__link').forEach(a => a.addEventListener('click', () => setMobileMenu(false)));

    window.addEventListener('resize', () => {
      setNavTop();
      if (!isMobile()) setMobileMenu(false);
    });
    window.addEventListener('scroll', setNavTop, { passive: true });
    setNavTop();
  }

  function setMobileMenu(open) {
    setNavTop();
    nav.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.querySelector('span').textContent = open ? 'Cerrar' : 'Menú';
    document.body.classList.toggle('nav-open', open);
    if (!open) closeAllMega();
  }

  /* ---------------------------------------------------------
     Búsqueda con accesos directos
     --------------------------------------------------------- */
  function initSearch() {
    const dialog = $('#search-dialog');
    const input = $('#search-input');
    const results = $('#search-results');
    const openBtn = $('#open-search');
    if (!dialog || typeof dialog.showModal !== 'function') {
      // Navegadores sin <dialog>: ir al buscador del sitio
      openBtn && openBtn.addEventListener('click', () => { window.location.href = BASE + '/?s='; });
      return;
    }

    openBtn.addEventListener('click', () => {
      dialog.showModal(); input.value = ''; render(''); input.focus();
    });
    $('#close-search').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => openBtn.focus());

    // Atajo: "/" abre la búsqueda
    document.addEventListener('keydown', e => {
      const typing = /input|textarea|select/i.test(document.activeElement.tagName);
      if (e.key === '/' && !typing && !dialog.open) { e.preventDefault(); openBtn.click(); }
    });

    function render(q) {
      const nq = norm(q.trim());
      const items = nq
        ? SEARCH_INDEX.filter(([label, cat]) => norm(label).includes(nq) || norm(cat).includes(nq)).slice(0, 8)
        : SEARCH_INDEX.filter(([l]) => ['Inscripciones', 'SIUL (sistema académico)', 'Pagos en línea PSE', 'Campus virtual', 'Admisiones y registro'].includes(l));

      results.innerHTML = '';
      if (!items.length) {
        const li = document.createElement('li');
        li.className = 'search-dialog__hint';
        li.textContent = `Sin accesos directos para “${q}”. Presiona Buscar para consultar todo el sitio.`;
        results.appendChild(li);
        return;
      }
      items.forEach(([label, cat, url]) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = abs(url);
        a.innerHTML = `<span></span><small></small>`;
        a.firstChild.textContent = label;
        a.lastChild.textContent = cat;
        li.appendChild(a);
        results.appendChild(li);
      });
    }
    input.addEventListener('input', () => render(input.value));

    // Flechas para moverse entre resultados
    dialog.addEventListener('keydown', e => {
      if (!['ArrowDown', 'ArrowUp'].includes(e.key)) return;
      const links = $$('a', results);
      if (!links.length) return;
      e.preventDefault();
      const i = links.indexOf(document.activeElement);
      const next = e.key === 'ArrowDown' ? (i + 1) % links.length : (i <= 0 ? links.length - 1 : i - 1);
      links[next].focus();
    });
  }

  /* ---------------------------------------------------------
     Buscador de programas (hero)
     --------------------------------------------------------- */
  function initFinder() {
    const form = $('#finder');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const nivel = $('#f-nivel').value;
      const city = $('#f-seccional').value;
      const area = $('#f-area').value.trim();
      let url;
      if (area) url = `${BASE}/?s=${encodeURIComponent(area + (city ? ' ' + CITIES[city] : ''))}`;
      else if (city) url = `${BASE}/${city}/`;
      else url = `${BASE}/${nivel}/`;
      $('#finder-note').textContent = 'Abriendo resultados…';
      window.location.href = url;
    });
  }

  /* ---------------------------------------------------------
     Pestañas accesibles (patrón WAI-ARIA, activación automática)
     --------------------------------------------------------- */
  function initTabs() {
    $$('[data-tabs]').forEach(wrap => {
      const tabs = $$('[role="tab"]', wrap);
      const select = tab => {
        tabs.forEach(t => {
          const on = t === tab;
          t.setAttribute('aria-selected', String(on));
          t.tabIndex = on ? 0 : -1;
          document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
        });
      };
      tabs.forEach((t, i) => {
        t.addEventListener('click', () => select(t));
        t.addEventListener('keydown', e => {
          let j = null;
          if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
          if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
          if (e.key === 'Home') j = 0;
          if (e.key === 'End') j = tabs.length - 1;
          if (j !== null) { e.preventDefault(); tabs[j].focus(); select(tabs[j]); }
        });
      });
    });
  }

  /* ---------------------------------------------------------
     Facultades × seccionales
     --------------------------------------------------------- */
  function initFaculties() {
    const list = $('#fac-list');
    const status = $('#fac-status');
    if (!list) return;

    list.innerHTML = FACULTIES.map(f => `
      <li class="fac" data-cities="${f.cities.join(' ')}">
        <h3 class="fac__name">Facultad de ${f.name}
          <span class="fac__count">${f.cities.length === 7 ? 'En las siete seccionales' : `En ${f.cities.length} ${f.cities.length === 1 ? 'seccional' : 'seccionales'}`}</span>
        </h3>
        <div class="fac__cities">
          ${f.cities.map(c => `<a href="${BASE}/${c}/${f.slug}/" data-city="${c}" aria-label="${f.name}, seccional ${CITIES[c]}">${CITIES[c]}</a>`).join('')}
        </div>
      </li>`).join('');

    $$('.fac-filter .chip').forEach(chip => chip.addEventListener('click', () => {
      const city = chip.dataset.city;
      $$('.fac-filter .chip').forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
      let shown = 0;
      $$('.fac', list).forEach(li => {
        const match = city === 'todas' || li.dataset.cities.split(' ').includes(city);
        li.hidden = !match;
        if (match) shown++;
        $$('.fac__cities a', li).forEach(a => a.classList.toggle('is-match', a.dataset.city === city));
      });
      status.textContent = city === 'todas'
        ? 'Mostrando las seis facultades.'
        : `${shown} ${shown === 1 ? 'facultad' : 'facultades'} en ${CITIES[city]}.`;
    }));
  }

  /* ---------------------------------------------------------
     Línea de tiempo de seccionales
     --------------------------------------------------------- */
  function initTimeline() {
    const items = $$('.timeline__item');
    const card = $('#campus-card');
    if (!items.length || !card) return;

    const show = key => {
      const c = CAMPUSES[key];
      const facs = FACULTIES.filter(f => f.cities.includes(key));
      card.innerHTML = `
        <div>
          <h3>Seccional ${CITIES[key]}, desde ${c.year}</h3>
          <p>${c.text}</p>
          <a class="btn btn--ghost" href="${BASE}/${key}/">Ir a la seccional ${CITIES[key]}</a>
        </div>
        <div class="campus-card__fac">
          <strong>Facultades en ${CITIES[key]}</strong>
          <ul>${facs.map(f => `<li>${f.name}</li>`).join('')}</ul>
        </div>`;
      items.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.campus === key)));
    };

    items.forEach((b, i) => {
      b.addEventListener('click', () => show(b.dataset.campus));
      b.addEventListener('keydown', e => {
        const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!dir) return;
        e.preventDefault();
        const next = items[(i + dir + items.length) % items.length];
        next.focus(); show(next.dataset.campus);
      });
    });
    show('bogota');
  }

  /* ---------------------------------------------------------
     Noticias con filtro por seccional
     --------------------------------------------------------- */
  function initNews() {
    const list = $('#news-list');
    const filter = $('#news-filter');
    if (!list) return;
    const fmt = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

    list.innerHTML = NEWS.map(n => `
      <li class="news-item" data-cities="${n.cities.join(' ')}">
        <div class="news-item__meta">
          <time datetime="${n.date}">${fmt.format(new Date(n.date + 'T00:00:00Z'))}</time>
          <span class="tag ${n.type === 'Evento' ? 'tag--event' : ''}">${n.type}</span>
          <span>${n.cities.map(c => CITIES[c]).join(', ')}</span>
        </div>
        <h3><a href="${abs(n.url)}">${n.title}</a></h3>
        <p>${n.text}</p>
      </li>`).join('');

    filter && filter.addEventListener('change', () => {
      const v = filter.value;
      $$('.news-item', list).forEach(li => { li.hidden = v !== 'todas' && !li.dataset.cities.split(' ').includes(v); });
    });
  }

  /* ---------------------------------------------------------
     Botón "volver arriba"
     --------------------------------------------------------- */
  function initToTop() {
    const btn = $('#to-top');
    if (!btn) return;
    const onScroll = () => { btn.hidden = window.scrollY < 900; };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    btn.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: root.dataset.motion === 'reduce' ? 'auto' : 'smooth' });
      $('.skip-link').focus({ preventScroll: true });
    });
  }

  /* --------------------------------------------------------- */
  applyPrefs();
  document.addEventListener('DOMContentLoaded', () => {
    initA11yPanel();
    initNav();
    initSearch();
    initFinder();
    initTabs();
    initFaculties();
    initTimeline();
    initNews();
    initToTop();
  });
})();
