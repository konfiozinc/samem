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
  var data = { title: 'SAMEM · Seguridad electrónica', text: 'CCTV, alarmas, control de acceso y ascensores. Atención 24 horas.', url: CONFIG.url };
  if (navigator.share) {
    navigator.share(data).catch(function () {});
  } else if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(CONFIG.url).then(function () { alert('✅ Enlace copiado'); }).catch(function () { prompt('Copia el enlace:', CONFIG.url); });
  } else {
    prompt('Copia el enlace:', CONFIG.url);
  }
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
  // Año
  $('anio').textContent = new Date().getFullYear();
  // Service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('service-worker.js').catch(function () {}); });
  }
});
