'use strict';

var CONFIG = {
  whatsapp: '573225288034',
  telefono: '573225288024',
  email: 'samemsoluciones@gmail.com',
  instagram: 'https://www.instagram.com/samemsoluciones',
  url: 'https://konfiozinc.github.io/samem/'
};

var SERVICIOS = {
  cctv: {
    titulo: 'CCTV / Cámaras de Seguridad',
    img: 'assets/img/servicio-cctv.webp',
    descripcion: 'Sistemas de videovigilancia profesional para casa, empresa e industria. Especialistas en cámaras en riel móvil.',
    puntos: ['Cámaras domo y bullet', 'Cámaras en riel móvil', 'Monitoreo remoto', 'Instalación profesional']
  },
  alarma: {
    titulo: 'Sistemas de Alarmas',
    img: 'assets/img/servicio-alarma.webp',
    descripcion: 'Instalación de paneles de alarma, sensores de movimiento y sirenas para proteger tu hogar o negocio.',
    puntos: ['Paneles de alarma', 'Sensores de movimiento PIR', 'Sirenas', 'Configuración y pruebas']
  },
  acceso: {
    titulo: 'Controles de Acceso',
    img: 'assets/img/servicio-acceso.webp',
    descripcion: 'Sistemas biométricos, lectores de tarjeta y control de ingreso para empresas y conjuntos.',
    puntos: ['Lectores biométricos', 'Lectores de tarjeta', 'Control de ingreso', 'Integración con portería']
  },
  portero: {
    titulo: 'Video Porteros e Intercomunicadores',
    img: 'assets/img/servicio-portero.webp',
    descripcion: 'Videoporteros para hogares, conjuntos residenciales y edificios empresariales.',
    puntos: ['Videoporteros', 'Intercomunicadores', 'Instalación en conjuntos', 'Soporte y mantenimiento']
  },
  ascensor: {
    titulo: 'Mantenimiento de Equipos de Elevación Vertical',
    img: null,
    descripcion: 'Mantenimiento preventivo y correctivo de ascensores y montacargas.',
    puntos: ['Mantenimiento preventivo', 'Mantenimiento correctivo', 'Ascensores y montacargas', 'Diagnóstico técnico']
  }
};

function $(id) { return document.getElementById(id); }
function escapar(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function abrirModal() { $('overlay').classList.add('activo'); document.body.style.overflow = 'hidden'; }
function cerrarModal() { $('overlay').classList.remove('activo'); document.body.style.overflow = ''; }

function abrirServicio(key) {
  var s = SERVICIOS[key];
  if (!s) return;
  var msg = 'Hola Johnatan, quiero información sobre ' + s.titulo;
  var puntos = s.puntos.map(function (p) { return '<li>' + escapar(p) + '</li>'; }).join('');
  var imgHtml = s.img ? '<img class="modal-img" src="' + s.img + '" alt="' + escapar(s.titulo) + '" loading="lazy">' : '';
  $('modalBody').innerHTML =
    '<h3>' + escapar(s.titulo) + '</h3>' + imgHtml +
    '<p class="desc">' + escapar(s.descripcion) + '</p>' +
    '<ul class="puntos">' + puntos + '</ul>' +
    '<a class="boton-wa" href="https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(msg) + '" target="_blank" rel="noopener">💬 Consultar por WhatsApp</a>';
  abrirModal();
  $('btnCerrar').focus();
}

function compartir() {
  var data = { title: 'SAMEM · Empresa de seguridad en el hogar', text: 'Instalación, mantenimiento y reparación de cámaras, alarmas y plataformas de elevación vertical. Atención 24/7.', url: CONFIG.url };
  if (navigator.share) {
    navigator.share(data).catch(function () {});
  } else if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(CONFIG.url).then(function () { alert('✅ Enlace copiado'); }).catch(function () { prompt('Copia el enlace:', CONFIG.url); });
  } else {
    prompt('Copia el enlace:', CONFIG.url);
  }
}

/* ── Carrusel dinámico (galería + servicios) ── */
function initCarrusel() {
  document.querySelectorAll('[data-carrusel]').forEach(function (root) {
    var track = root.querySelector('[data-track]');
    var dotsWrap = root.querySelector('[data-dots]');
    var prev = root.querySelector('[data-prev]');
    var next = root.querySelector('[data-next]');
    if (!track) return;
    var slides = Array.prototype.slice.call(track.children);
    if (!slides.length) return;
    var label = root.getAttribute('data-label') || 'elemento';
    var auto = root.hasAttribute('data-autoplay');

    var dots = [];
    var current = 0;
    var autoTimer = null;

    function goTo(i) {
      var n = slides.length;
      current = ((i % n) + n) % n;
      var left = slides[current].offsetLeft - track.offsetLeft - (track.clientWidth - slides[current].clientWidth) / 2;
      track.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
      dots.forEach(function (d, idx) { d.classList.toggle('active', idx === current); });
    }
    function startAuto() {
      if (!auto) return;
      stopAuto();
      autoTimer = setInterval(function () { goTo(current + 1); }, 4000);
    }
    function stopAuto() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }

    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      slides.forEach(function (_, idx) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'dot' + (idx === 0 ? ' active' : '');
        var pre = label === 'imagen' ? 'a la imagen' : (label === 'servicio' ? 'al servicio' : 'al ' + label);
        b.setAttribute('aria-label', 'Ir ' + pre + ' ' + (idx + 1));
        b.addEventListener('click', function () { goTo(idx); startAuto(); });
        dotsWrap.appendChild(b);
        dots.push(b);
      });
    }
    if (prev) prev.addEventListener('click', function () { goTo(current - 1); startAuto(); });
    if (next) next.addEventListener('click', function () { goTo(current + 1); startAuto(); });

    if (auto) {
      root.addEventListener('mouseenter', stopAuto);
      root.addEventListener('mouseleave', startAuto);
      root.addEventListener('touchstart', stopAuto, { passive: true });
      root.addEventListener('touchend', startAuto, { passive: true });

      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) { if (en.isIntersecting) startAuto(); else stopAuto(); });
        }, { threshold: 0.3 });
        io.observe(root);
      } else { startAuto(); }
    }

    var ticking = false;
    track.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var mid = track.scrollLeft + track.clientWidth / 2;
        var best = 0, bestDist = Infinity;
        slides.forEach(function (s, idx) {
          var c = s.offsetLeft - track.offsetLeft + s.clientWidth / 2;
          var d = Math.abs(c - mid);
          if (d < bestDist) { bestDist = d; best = idx; }
        });
        current = best;
        dots.forEach(function (d, idx) { d.classList.toggle('active', idx === best); });
        ticking = false;
      });
    }, { passive: true });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  // Botones de servicio
  document.querySelectorAll('.servicio').forEach(function (btn) {
    btn.addEventListener('click', function () { abrirServicio(btn.getAttribute('data-servicio')); });
  });
  // Cierre de modal
  $('btnCerrar').addEventListener('click', cerrarModal);
  $('overlay').addEventListener('click', function (e) { if (e.target === this) cerrarModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrarModal(); });
  // Carrusel
  initCarrusel();
  // Año
  $('anio').textContent = new Date().getFullYear();
  // Service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('service-worker.js').catch(function () {}); });
  }
});
