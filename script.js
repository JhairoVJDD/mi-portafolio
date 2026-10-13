/**
 * PORTAFOLIO PERSONAL DE JHAIRO
 * Lógica interactiva: Animaciones, partículas sutiles, cambio de tema, confeti y filtrado.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializar Año Actual en Footer
  const currentYearEl = document.getElementById('current-year');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // 2. Efecto de Escritura (Typing Effect)
  initTypingEffect();

  // 3. Partículas Sutiles en Canvas
  initBackgroundCanvas();

  // 4. Modo Oscuro / Claro
  initThemeToggle();

  // 5. Navegación Móvil y Scroll de Navbar
  initNavigation();

  // 6. Scroll Reveal (Aparición fluida al scrollear)
  initScrollReveal();

  // 7. Filtro de Habilidades
  initSkillFilters();

  // 8. Rotador de Frases Inspiradoras
  initQuoteRotator();

  // 9. Formulario de Contacto y Confeti
  initContactForm();

  // 10. Botón Volver Arriba
  initBackToTop();
});

/* ===================================================================
   1. EFECTO DE ESCRITURA (TYPEWRITER)
   =================================================================== */
function initTypingEffect() {
  const typingEl = document.getElementById('typing-text');
  if (!typingEl) return;

  const phrases = [
    'crear soluciones con impacto',
    'la tecnología y la innovación',
    'aprender y superarme día a día',
    'explorar nuevos caminos y metas',
    'vivir con pasión y autenticidad'
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
   2. CANVAS DE PARTÍCULAS SUTILES
   =================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 25), 50);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.4 + 0.1
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const color = isDark ? '99, 102, 241' : '79, 70, 229';

    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  render();
}

/* ===================================================================
   3. MODO OSCURO / CLARO
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
   4. NAVEGACIÓN Y MENÚ MÓVIL
   =================================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sombra en Navbar al scrollear
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
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
   5. SCROLL REVEAL (INTERSECTION OBSERVER)
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
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ===================================================================
   6. FILTRADO DE HABILIDADES
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
   7. ROTADOR DE FRASES INSPIRADORAS
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
   8. LIGHTBOX PARA FOTOS DE GALERÍA
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
   9. FORMULARIO DE CONTACTO, VALIDACIÓN Y CONFETI
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
        // Éxito simulado
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
   10. BOTÓN VOLVER ARRIBA
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
