/**
 * PORTAFOLIO PERSONAL DE JHAIRO VENTOCILLA
 * Lógica interactiva:
 * 1. Fondo PS2 con Columnas de Cristal 3D (Seven Wonders) y Nube de Partículas Etéreas con Anime.js
 * 2. Carrusel 3D Coverflow para Lenguajes & Stack Tecnológico (inspirado en ReUI / Kokonut UI)
 * 3. Barra de navegación flotante redondeada (Cambio en el contenedor al hacer scroll)
 * 4. Efecto de escritura, cambio de tema, confeti, validación y filtros.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializar Año Actual en Footer
  const currentYearEl = document.getElementById('current-year');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // 2. Fondo Dinámico PS2 con Anime.js
  initPS2Background();

  // 3. Carrusel 3D Coverflow de Lenguajes
  initTechCoverflow();

  // 4. Efecto de Escritura (Typing Effect)
  initTypingEffect();

  // 5. Modo Oscuro / Claro
  initThemeToggle();

  // 6. Navegación Flotante Redondeada (Cambio en el Contenedor) y Menú Móvil
  initNavigation();

  // 7. Scroll Reveal (Aparición fluida al scrollear)
  initScrollReveal();

  // 8. Filtro de Habilidades
  initSkillFilters();

  // 9. Rotador de Frases Inspiradoras
  initQuoteRotator();

  // 10. Formulario de Contacto y Confeti
  initContactForm();

  // 11. Botón Volver Arriba
  initBackToTop();
});

/* ===================================================================
   1. FONDO PS2 (SEVEN WONDERS & NUBE DE PARTÍCULAS ETÉREAS) CON ANIME.JS
   =================================================================== */
function initPS2Background() {
  const canvas = document.getElementById('ps2-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Interacción suave con el cursor (Inspirado en el joystick de PS2)
  const camera = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    rotY: 0,
    wavePhase: 0
  };

  window.addEventListener('mousemove', (e) => {
    camera.targetX = (e.clientX - width / 2) * 0.0004;
    camera.targetY = (e.clientY - height / 2) * 0.0003;
  });

  // Usar Anime.js para generar ondulación orgánica y respiración cósmica
  if (window.anime) {
    anime({
      targets: camera,
      wavePhase: Math.PI * 2,
      duration: 14000,
      easing: 'linear',
      loop: true
    });
  }

  // 7 Monolitos / Columnas de Cristal 3D (The PS2 Seven Wonders)
  const towers = [
    { x: -280, z: 320, w: 38, h: 220, baseH: 220, rot: 0.1 },
    { x: -140, z: 460, w: 46, h: 280, baseH: 280, rot: -0.2 },
    { x: 0,    z: 520, w: 54, h: 340, baseH: 340, rot: 0.05 },
    { x: 150,  z: 440, w: 44, h: 260, baseH: 260, rot: 0.25 },
    { x: 290,  z: 340, w: 36, h: 210, baseH: 210, rot: -0.15 },
    { x: -200, z: 620, w: 50, h: 310, baseH: 310, rot: 0.3 },
    { x: 210,  z: 600, w: 48, h: 290, baseH: 290, rot: -0.3 }
  ];

  // ~140 Partículas flotantes que ascienden en espiral y niebla etérea
  const particles = [];
  const particleCount = Math.min(Math.floor(width / 14), 140);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: (Math.random() - 0.5) * width * 1.5,
      y: (Math.random() - 0.5) * height * 1.6,
      z: Math.random() * 800 + 100,
      size: Math.random() * 2.4 + 0.8,
      speedY: Math.random() * 0.45 + 0.15,
      driftAngle: Math.random() * Math.PI * 2,
      colorType: Math.random() > 0.4 ? 'cyan' : (Math.random() > 0.5 ? 'purple' : 'white'),
      opacity: Math.random() * 0.7 + 0.2
    });
  }

  // Proyección perspectiva 3D
  function project(x, y, z) {
    const fov = 420;
    const scale = fov / (z + fov);
    return {
      x: width / 2 + x * scale,
      y: height / 2 + y * scale,
      scale: scale
    };
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Inercia de la cámara tipo PS2
    camera.x += (camera.targetX - camera.x) * 0.05;
    camera.y += (camera.targetY - camera.y) * 0.05;
    camera.rotY += 0.0018;

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    // 1. Dibujar Torres de Cristal 3D (PS2 Monoliths)
    towers.forEach((tower, idx) => {
      // Oscilación suave en altura y rotación con la fase de onda
      const bob = Math.sin(camera.wavePhase + idx * 0.9) * 20;
      const currentH = tower.baseH + Math.sin(camera.wavePhase * 1.5 + idx) * 15;

      // Rotación circular en torno al eje Y
      const cosR = Math.cos(camera.rotY * 0.6 + idx * 0.85);
      const sinR = Math.sin(camera.rotY * 0.6 + idx * 0.85);
      const worldX = tower.x * cosR - tower.z * sinR;
      const worldZ = tower.x * sinR + tower.z * cosR + 380;
      const worldY = 90 + bob + camera.y * 300;

      if (worldZ <= 20) return;

      const pBottom = project(worldX + camera.x * 200, worldY, worldZ);
      const pTop = project(worldX + camera.x * 200, worldY - currentH, worldZ);
      const halfW = (tower.w * pBottom.scale) / 2;

      // Colores de cristal PS2 (Cyan / Púrpura semitransparente)
      const grad = ctx.createLinearGradient(pTop.x, pTop.y, pBottom.x, pBottom.y);
      if (isDark) {
        grad.addColorStop(0, 'rgba(6, 182, 212, 0.22)');
        grad.addColorStop(0.5, 'rgba(99, 102, 241, 0.16)');
        grad.addColorStop(1, 'rgba(168, 85, 247, 0.04)');
      } else {
        grad.addColorStop(0, 'rgba(79, 70, 229, 0.16)');
        grad.addColorStop(1, 'rgba(6, 182, 212, 0.04)');
      }

      ctx.save();
      // Cara de la columna
      ctx.beginPath();
      ctx.rect(pTop.x - halfW, pTop.y, halfW * 2, pBottom.y - pTop.y);
      ctx.fillStyle = grad;
      ctx.fill();

      // Borde brillante de cristal
      ctx.strokeStyle = isDark ? 'rgba(6, 182, 212, 0.45)' : 'rgba(99, 102, 241, 0.35)';
      ctx.lineWidth = Math.max(1, 1.4 * pBottom.scale);
      ctx.stroke();

      // Línea central de arista de cristal
      ctx.beginPath();
      ctx.moveTo(pTop.x, pTop.y);
      ctx.lineTo(pBottom.x, pBottom.y);
      ctx.strokeStyle = isDark ? 'rgba(168, 85, 247, 0.4)' : 'rgba(99, 102, 241, 0.25)';
      ctx.stroke();
      ctx.restore();
    });

    // 2. Dibujar Nube de Partículas PS2 (Ethereal Dust Streams)
    particles.forEach(p => {
      p.y -= p.speedY;
      p.driftAngle += 0.02;
      const driftX = Math.sin(p.driftAngle + camera.wavePhase) * 0.8;

      if (p.y < -height / 1.5) {
        p.y = height / 1.5;
        p.x = (Math.random() - 0.5) * width * 1.5;
      }

      const pProj = project(p.x + driftX * 40 + camera.x * 250, p.y + camera.y * 200, p.z);

      if (pProj.x > 0 && pProj.x < width && pProj.y > 0 && pProj.y < height) {
        ctx.beginPath();
        const rad = Math.max(0.6, p.size * pProj.scale);
        ctx.arc(pProj.x, pProj.y, rad, 0, Math.PI * 2);

        let colorStr = '255, 255, 255';
        if (p.colorType === 'cyan') colorStr = '6, 182, 212';
        else if (p.colorType === 'purple') colorStr = '168, 85, 247';

        const alpha = p.opacity * Math.min(1, pProj.scale * 1.8);
        ctx.fillStyle = `rgba(${colorStr}, ${alpha})`;
        ctx.fill();

        // Resplandor difuso para partículas más cercanas
        if (p.size > 1.8 && isDark) {
          ctx.beginPath();
          ctx.arc(pProj.x, pProj.y, rad * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${colorStr}, ${alpha * 0.25})`;
          ctx.fill();
        }
      }
    });

    requestAnimationFrame(render);
  }

  render();
}

/* ===================================================================
   2. CARRUSEL 3D COVERFLOW PARA LENGUAJES & TECH STACK
   (Inspirado en ReUI, Kokonut UI, UI Inspo y animado con Anime.js)
   =================================================================== */
function initTechCoverflow() {
  const stage = document.getElementById('coverflow-stage');
  const prevBtn = document.getElementById('cf-prev-btn');
  const nextBtn = document.getElementById('cf-next-btn');
  const dotsContainer = document.getElementById('coverflow-dots');
  const filterBtns = document.querySelectorAll('.cf-filter-btn');

  if (!stage) return;

  // Datos de los Lenguajes y Tecnologías de Jhairo
  const techItems = [
    {
      id: 'sql',
      name: 'SQL Server & T-SQL',
      subtitle: 'Bases de Datos • SSMS • Relacional',
      category: 'datos',
      categoryLabel: 'DATABASE',
      rating: '9.5 ★',
      iconClass: 'fa-solid fa-database text-purple',
      glowColor: 'rgba(168, 85, 247, 0.45)',
      desc: 'Diseño relacional, modelado entidad-relación, consultas complejas, procedimientos almacenados y optimización con SQL Server Management Studio.',
      tags: ['T-SQL', 'SSMS', 'Stored Procedures', 'Normalización']
    },
    {
      id: 'java',
      name: 'Java',
      subtitle: 'Backend • POO • Spring Boot',
      category: 'lenguajes',
      categoryLabel: 'BACKEND',
      rating: '9.2 ★',
      iconClass: 'fa-brands fa-java text-cyan',
      glowColor: 'rgba(6, 182, 212, 0.45)',
      desc: 'Dominio de Programación Orientada a Objetos, lógica estructurada de algoritmos, arquitectura modular, colecciones y APIs con Spring Boot.',
      tags: ['POO', 'Spring Boot', 'APIs REST', 'Clean Code']
    },
    {
      id: 'python',
      name: 'Python',
      subtitle: 'Automatización • Data • Lógica',
      category: 'lenguajes',
      categoryLabel: 'DATA & DEV',
      rating: '9.0 ★',
      iconClass: 'fa-brands fa-python text-yellow',
      glowColor: 'rgba(245, 158, 11, 0.45)',
      desc: 'Desarrollo de scripts ágiles, automatización de procesos, manejo de librerías modernas para estructuración de datos y algoritmos de resolución.',
      tags: ['Scripts', 'Pandas', 'Automatización', 'Lógica']
    },
    {
      id: 'javascript',
      name: 'JavaScript (ES6+)',
      subtitle: 'Frontend • Async • Web Moderna',
      category: 'lenguajes',
      categoryLabel: 'FULLSTACK',
      rating: '9.1 ★',
      iconClass: 'fa-brands fa-js text-yellow',
      glowColor: 'rgba(251, 191, 36, 0.45)',
      desc: 'Interactividad dinámica de interfaz, manipulación fluida del DOM, promesas asíncronas, consumo de APIs y desarrollo de interfaces reactivas.',
      tags: ['ES6+', 'Async / Await', 'DOM', 'Fetch API']
    },
    {
      id: 'csharp',
      name: 'C# .NET',
      subtitle: 'Desktop • Arquitectura • POO',
      category: 'web',
      categoryLabel: 'SOFTWARE',
      rating: '8.9 ★',
      iconClass: 'fa-solid fa-cubes text-pink',
      glowColor: 'rgba(236, 72, 153, 0.45)',
      desc: 'Creación de soluciones de software en ecosistema .NET, aplicaciones de escritorio, patrones de diseño y conexión con bases de datos SQL.',
      tags: ['.NET', 'Desktop', 'POO', 'Visual Studio']
    },
    {
      id: 'powerbi',
      name: 'Power BI & DAX',
      subtitle: 'Business Intelligence • Métricas',
      category: 'datos',
      categoryLabel: 'ANALYTICS',
      rating: '8.7 ★',
      iconClass: 'fa-solid fa-chart-column text-yellow',
      glowColor: 'rgba(245, 158, 11, 0.45)',
      desc: 'Transformación de datos con Power Query, formulación de métricas con DAX y desarrollo de tableros ejecutivos interactivos para toma de decisiones.',
      tags: ['DAX', 'Power Query', 'Dashboards', 'KPIs']
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      subtitle: 'Tipado Seguro • Escalabilidad',
      category: 'lenguajes',
      categoryLabel: 'DEV TOOL',
      rating: '8.8 ★',
      iconClass: 'fa-solid fa-file-code text-blue',
      glowColor: 'rgba(59, 130, 246, 0.45)',
      desc: 'Refactorización y arquitectura con tipado estático, interfaces rigurosas y detección temprana de errores para proyectos web de gran envergadura.',
      tags: ['Interfaces', 'Types', 'Escalabilidad', 'Clean Code']
    },
    {
      id: 'htmlcss',
      name: 'HTML5 & CSS3 Avanzado',
      subtitle: 'UI / UX • Glassmorphism • Grid',
      category: 'web',
      categoryLabel: 'UI / UX',
      rating: '9.6 ★',
      iconClass: 'fa-brands fa-html5 text-cyan',
      glowColor: 'rgba(6, 182, 212, 0.45)',
      desc: 'Diseño responsivo de vanguardia, maquetación semántica, efectos glassmorphism, micro-animaciones fluidas y sistemas de diseño con CSS Grid y Flexbox.',
      tags: ['Glassmorphism', 'CSS Grid', 'Flexbox', 'Responsive']
    }
  ];

  let currentCategory = 'all';
  let filteredItems = [...techItems];
  let activeIndex = 0;
  let cardElements = [];

  // Función para construir el carrusel en el DOM
  function renderCoverflowDOM() {
    stage.innerHTML = '';
    dotsContainer.innerHTML = '';
    cardElements = [];

    filteredItems.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'cf-card';
      card.setAttribute('data-index', index);

      card.innerHTML = `
        <div class="cf-card-header">
          <span class="cf-badge-category">${item.categoryLabel}</span>
          <span class="cf-rating-pill"><i class="fa-solid fa-star"></i> ${item.rating}</span>
        </div>
        <div class="cf-card-banner">
          <div class="cf-card-banner-glow" style="background: ${item.glowColor};"></div>
          <i class="${item.iconClass} cf-card-icon"></i>
        </div>
        <div class="cf-card-body">
          <div class="cf-card-title-wrap">
            <h3 class="cf-card-title">${item.name}</h3>
            <span class="cf-card-subtitle">${item.subtitle}</span>
          </div>
          <p class="cf-card-desc">${item.desc}</p>
          <div class="cf-card-tags">
            ${item.tags.map(t => `<span class="cf-tag">${t}</span>`).join('')}
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        if (activeIndex !== index) {
          goToIndex(index);
        }
      });

      stage.appendChild(card);
      cardElements.push(card);

      // Dot indicador
      const dot = document.createElement('button');
      dot.className = `cf-dot ${index === activeIndex ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Ir a tarjeta ${index + 1}`);
      dot.addEventListener('click', () => goToIndex(index));
      dotsContainer.appendChild(dot);
    });

    updateCards3D(false);
  }

  // Actualizar posiciones 3D de las tarjetas (Perspectiva Coverflow)
  function updateCards3D(useAnimation = true) {
    const isMobile = window.innerWidth <= 768;
    const spacingX = isMobile ? 180 : 230;

    cardElements.forEach((card, index) => {
      const offset = index - activeIndex;
      const absOffset = Math.abs(offset);

      let tx = offset * spacingX;
      let tz = -absOffset * (isMobile ? 70 : 90);
      let rotY = offset * -28;
      let scale = 1 - absOffset * 0.12;
      let opacity = 1;
      let zIndex = 20 - absOffset;

      if (offset === 0) {
        // Tarjeta central activa
        tx = 0;
        tz = isMobile ? 60 : 100;
        rotY = 0;
        scale = isMobile ? 1.02 : 1.08;
        opacity = 1;
        card.classList.add('active');
      } else {
        card.classList.remove('active');
        if (absOffset > 2) {
          opacity = 0; // Ocultar tarjetas lejanas para rendimiento
        } else {
          opacity = 0.85 - absOffset * 0.25;
        }
      }

      card.style.zIndex = zIndex;

      if (window.anime && useAnimation) {
        anime.remove(card);
        anime({
          targets: card,
          translateX: tx,
          translateZ: tz,
          rotateY: rotY,
          scale: scale,
          opacity: opacity,
          duration: 520,
          easing: 'cubicBezier(0.16, 1, 0.3, 1)'
        });
      } else {
        card.style.transform = `translateX(${tx}px) translateZ(${tz}px) rotateY(${rotY}deg) scale(${scale})`;
        card.style.opacity = opacity;
      }
    });

    // Actualizar dots
    const dots = dotsContainer.querySelectorAll('.cf-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeIndex);
    });
  }

  function goToIndex(index) {
    if (filteredItems.length === 0) return;
    activeIndex = (index + filteredItems.length) % filteredItems.length;
    updateCards3D(true);
  }

  // Controles Prev y Next
  if (prevBtn) {
    prevBtn.addEventListener('click', () => goToIndex(activeIndex - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => goToIndex(activeIndex + 1));
  }

  // Soporte de Teclado (Flechas Izquierda / Derecha)
  window.addEventListener('keydown', (e) => {
    const coverflowEl = document.getElementById('lenguajes');
    if (!coverflowEl) return;
    const rect = coverflowEl.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      if (e.key === 'ArrowLeft') goToIndex(activeIndex - 1);
      if (e.key === 'ArrowRight') goToIndex(activeIndex + 1);
    }
  });

  // Soporte de Swipe táctil en móviles
  let touchStartX = 0;
  stage.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  stage.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 40) {
      goToIndex(activeIndex + 1);
    } else if (touchEndX > touchStartX + 40) {
      goToIndex(activeIndex - 1);
    }
  }, { passive: true });

  // Filtrado por categoría
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      currentCategory = filter;

      if (filter === 'all') {
        filteredItems = [...techItems];
      } else {
        filteredItems = techItems.filter(item => item.category === filter);
      }

      activeIndex = 0;
      renderCoverflowDOM();
    });
  });

  // Inicializar render inicial
  renderCoverflowDOM();
}

/* ===================================================================
   3. EFECTO DE ESCRITURA (TYPEWRITER)
   =================================================================== */
function initTypingEffect() {
  const typingEl = document.getElementById('typing-text');
  if (!typingEl) return;

  const phrases = [
    'la Ingeniería de Sistemas',
    'crear soluciones con impacto',
    'el desarrollo de software y bases de datos',
    'la tecnología, algoritmos e innovación',
    'aprender y superarme día a día'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 70;
  const deleteSpeed = 35;
  const delayBetweenPhrases = 2000;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      setTimeout(() => { isDeleting = true; type(); }, delayBetweenPhrases);
      return;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(type, 300);
      return;
    }

    setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
  }

  type();
}

/* ===================================================================
   4. MODO OSCURO / CLARO
   =================================================================== */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;

  const savedTheme = localStorage.getItem('jhairo-theme') || 'dark';
  root.setAttribute('data-theme', savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', newTheme);
      localStorage.setItem('jhairo-theme', newTheme);
      showToast(newTheme === 'dark' ? '🌙 Modo Oscuro Activado' : '☀️ Modo Claro Activado');
    });
  }
}

/* ===================================================================
   5. NAVEGACIÓN FLOTANTE REDONDEADA (CAMBIO EN EL CONTENEDOR) Y MENÚ MÓVIL
   =================================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Al hacer scroll, añadir clase .scrolled que activa la cápsula con bordes redondeados
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Toggle menú en móviles
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Resaltar enlace activo según la sección visible
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetLink.classList.add('active');
        } else {
          targetLink.classList.remove('active');
        }
      }
    });
  });
}

/* ===================================================================
   6. SCROLL REVEAL (INTERSECTION OBSERVER)
   =================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ===================================================================
   7. FILTRADO DE HABILIDADES
   =================================================================== */
function initSkillFilters() {
  const tabs = document.querySelectorAll('.category-tabs .tab-btn');
  const cards = document.querySelectorAll('.skills-grid .skill-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-tab');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ===================================================================
   8. ROTADOR DE FRASES INSPIRADORAS
   =================================================================== */
function initQuoteRotator() {
  const quoteEl = document.getElementById('daily-quote');
  const nextBtn = document.getElementById('btn-next-quote');
  if (!quoteEl || !nextBtn) return;

  const quotes = [
    '"El éxito es la suma de pequeños esfuerzos repetidos día tras día."',
    '"Lo único imposible es aquello que no intentas con todo el corazón."',
    '"La constancia y la disciplina siempre superan a la motivación pasajera."',
    '"No cuentes los días, haz que cada día cuente."',
    '"Sé el arquitecto de tus propios sueños y no el espectador de los ajenos."',
    '"Cada error superado es una lección ganada hacia la maestría."'
  ];

  let currentIdx = 0;

  nextBtn.addEventListener('click', () => {
    quoteEl.style.opacity = '0';
    quoteEl.style.transform = 'translateX(-10px)';

    setTimeout(() => {
      currentIdx = (currentIdx + 1) % quotes.length;
      quoteEl.textContent = quotes[currentIdx];
      quoteEl.style.opacity = '1';
      quoteEl.style.transform = 'translateX(0)';
    }, 250);
  });
}

/* ===================================================================
   9. LIGHTBOX PARA FOTOS DE GALERÍA
   =================================================================== */
window.openLightbox = function(imgSrc, title, desc) {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalTitle = document.getElementById('lightbox-title');
  const modalDesc = document.getElementById('lightbox-desc');

  if (!modal) return;

  modalImg.src = imgSrc;
  modalTitle.textContent = title;
  modalDesc.textContent = desc;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeLightbox = function(e) {
  const modal = document.getElementById('lightbox-modal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
};

// Cerrar con Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
  }
});

/* ===================================================================
   10. FORMULARIO DE CONTACTO, VALIDACIÓN Y CONFETI
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    let isValid = true;

    // Validación Nombre
    if (!nameInput.value.trim()) {
      showError('name-error', 'Por favor ingresa tu nombre.');
      isValid = false;
    } else {
      clearError('name-error');
    }

    // Validación Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showError('email-error', 'Ingresa un correo electrónico válido.');
      isValid = false;
    } else {
      clearError('email-error');
    }

    // Validación Mensaje
    if (!messageInput.value.trim() || messageInput.value.trim().length < 6) {
      showError('message-error', 'Por favor escribe un mensaje de al menos 6 caracteres.');
      isValid = false;
    } else {
      clearError('message-error');
    }

    if (isValid) {
      const submitBtn = document.getElementById('btn-submit');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
        form.reset();

        showToast('🎉 ¡Mensaje enviado con éxito! Gracias por escribir, Jhairo te responderá pronto.');
        triggerConfetti();
      }, 1200);
    }
  });

  function showError(elementId, msg) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) errorEl.textContent = msg;
  }

  function clearError(elementId) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) errorEl.textContent = '';
  }
}

/* ===================================================================
   EFECTO DE CONFETI LIVIANO (CANVAS NATIVO)
   =================================================================== */
function triggerConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ['#6366f1', '#a855f7', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'];

  for (let i = 0; i < 90; i++) {
    pieces.push({
      x: canvas.width / 2,
      y: canvas.height * 0.7,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      velX: (Math.random() - 0.5) * 14,
      velY: -(Math.random() * 12 + 6),
      gravity: 0.35,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10
    });
  }

  let frames = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(p => {
      p.x += p.velX;
      p.y += p.velY;
      p.velY += p.gravity;
      p.rotation += p.rotSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    frames++;
    if (frames < 120) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }

  animate();
}

/* ===================================================================
   TOAST NOTIFICATIONS
   =================================================================== */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    toast.style.transition = 'all 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

/* ===================================================================
   11. BOTÓN VOLVER ARRIBA
   =================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
