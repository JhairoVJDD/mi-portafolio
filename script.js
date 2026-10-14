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
   1. FONDO PS2 REAL CON THREE.JS (WEBGL, MONOLITOS 3D, NIEBLA Y RAYOS DE LUZ)
   Inspirado directamente en la pantalla de inicio y BIOS de PlayStation 2
   =================================================================== */
function initPS2Background() {
  const canvas = document.getElementById('ps2-canvas');
  if (!canvas) return;

  if (typeof THREE === 'undefined') {
    // Si Three.js no ha terminado de cargar, reintentar en 150ms
    setTimeout(initPS2Background, 150);
    return;
  }

  // 1. Escena y Niebla Mística PS2
  const scene = new THREE.Scene();
  const fogColorDark = 0x020512;
  const fogColorLight = 0xf0f4fc;
  scene.fog = new THREE.FogExp2(fogColorDark, 0.0018);

  // 2. Cámara (Vista cenital en picada idéntica a la referencia de PS2)
  const camera = new THREE.PerspectiveCamera(
    52,
    window.innerWidth / window.innerHeight,
    1,
    3000
  );
  camera.position.set(0, 480, 480);
  camera.lookAt(0, -60, 0);

  // 3. Renderizador WebGL
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  // 4. Luces Ambientales y de Relleno
  const ambientLight = new THREE.AmbientLight(0x0a1428, 1.4);
  scene.add(ambientLight);

  // Luz cenital azulada hacia el abismo
  const topLight = new THREE.DirectionalLight(0x4070d0, 1.2);
  topLight.position.set(0, 500, 100);
  scene.add(topLight);

  // 5. Núcleo de Niebla Volumétrica Azul (Centro del abismo PS2)
  const coreCanvas = document.createElement('canvas');
  coreCanvas.width = 256;
  coreCanvas.height = 256;
  const cctx = coreCanvas.getContext('2d');
  const coreGrad = cctx.createRadialGradient(128, 128, 10, 128, 128, 128);
  coreGrad.addColorStop(0, 'rgba(0, 120, 255, 0.9)');
  coreGrad.addColorStop(0.3, 'rgba(30, 40, 200, 0.6)');
  coreGrad.addColorStop(0.65, 'rgba(120, 20, 220, 0.25)');
  coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  cctx.fillStyle = coreGrad;
  cctx.fillRect(0, 0, 256, 256);

  const coreTexture = new THREE.CanvasTexture(coreCanvas);
  const coreMaterial = new THREE.SpriteMaterial({
    map: coreTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    opacity: 0.85
  });
  const coreGlow = new THREE.Sprite(coreMaterial);
  coreGlow.scale.set(700, 700, 1);
  coreGlow.position.set(0, -180, 0);
  scene.add(coreGlow);

  // 6. Generar Texturas Procedurales de Monolito PS2 (Piedra/Granito digital con biseles)
  const stoneCanvas = document.createElement('canvas');
  stoneCanvas.width = 512;
  stoneCanvas.height = 1024;
  const sctx = stoneCanvas.getContext('2d');

  // Base gris/azulada oscura
  sctx.fillStyle = '#222838';
  sctx.fillRect(0, 0, 512, 1024);

  // Ruido de textura de piedra y vetas
  for (let i = 0; i < 45000; i++) {
    const rx = Math.random() * 512;
    const ry = Math.random() * 1024;
    const lum = Math.floor(Math.random() * 60) + 18;
    sctx.fillStyle = `rgb(${lum}, ${lum + 4}, ${lum + 14})`;
    sctx.fillRect(rx, ry, Math.random() * 3 + 1, Math.random() * 5 + 1);
  }

  // Biseles y costuras verticales características del hardware PS2
  sctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  sctx.lineWidth = 4;
  sctx.strokeRect(6, 6, 500, 1012);
  sctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
  sctx.lineWidth = 6;
  sctx.strokeRect(10, 10, 492, 1004);

  const stoneTexture = new THREE.CanvasTexture(stoneCanvas);
  stoneTexture.wrapS = THREE.RepeatWrapping;
  stoneTexture.wrapT = THREE.RepeatWrapping;
  stoneTexture.repeat.set(1, 3);

  // Textura para caras superiores brillantes (Memory card top / Save icon glow)
  const topGlowCanvas = document.createElement('canvas');
  topGlowCanvas.width = 256;
  topGlowCanvas.height = 256;
  const tctx = topGlowCanvas.getContext('2d');
  tctx.fillStyle = '#10182b';
  tctx.fillRect(0, 0, 256, 256);
  tctx.fillStyle = '#e2f1ff';
  tctx.fillRect(16, 16, 224, 224);
  tctx.strokeStyle = '#38bdf8';
  tctx.lineWidth = 14;
  tctx.strokeRect(26, 26, 204, 204);
  const topGlowTexture = new THREE.CanvasTexture(topGlowCanvas);

  // 7. Construcción de Monolitos / Columnas PS2 (Distribución concéntrica como en la imagen)
  const towersGroup = new THREE.Group();
  scene.add(towersGroup);

  const pillarLayout = [
    // Centro
    { x: 0, z: 0, w: 58, d: 58, h: 480, topGlow: true, emissive: 0xa8e6ff },
    { x: -75, z: 45, w: 42, d: 42, h: 410, topGlow: true, emissive: 0x38bdf8 },
    { x: 65, z: -55, w: 38, d: 38, h: 370, topGlow: false },
    { x: 25, z: 85, w: 36, d: 36, h: 320, topGlow: false },
    { x: -90, z: -60, w: 48, d: 48, h: 440, topGlow: false },

    // Anillo Medio
    { x: -160, z: 30, w: 46, d: 46, h: 520, topGlow: false },
    { x: -140, z: 150, w: 36, d: 36, h: 390, topGlow: false },
    { x: 30, z: 180, w: 44, d: 44, h: 460, topGlow: false },
    { x: 160, z: 90, w: 52, d: 52, h: 560, topGlow: false },
    { x: 190, z: -40, w: 40, d: 40, h: 430, topGlow: false },
    { x: 120, z: -160, w: 48, d: 48, h: 490, topGlow: false },
    { x: -40, z: -190, w: 38, d: 38, h: 380, topGlow: false },
    { x: -170, z: -130, w: 42, d: 42, h: 450, topGlow: false },

    // Anillo Exterior / Columnas Perimetrales Altas
    { x: -260, z: 80, w: 56, d: 56, h: 680, topGlow: false },
    { x: -220, z: 230, w: 48, d: 48, h: 580, topGlow: false },
    { x: -70, z: 280, w: 42, d: 42, h: 510, topGlow: false },
    { x: 110, z: 270, w: 50, d: 50, h: 620, topGlow: false },
    { x: 250, z: 190, w: 54, d: 54, h: 690, topGlow: false },
    { x: 280, z: 20, w: 46, d: 46, h: 610, topGlow: false },
    { x: 260, z: -170, w: 52, d: 52, h: 670, topGlow: false },
    { x: 100, z: -280, w: 48, d: 48, h: 590, topGlow: false },
    { x: -90, z: -290, w: 44, d: 44, h: 530, topGlow: false },
    { x: -250, z: -220, w: 50, d: 50, h: 640, topGlow: false },

    // Bloques transparentes de cristal / memoria (icono de memory card como en la imagen)
    { x: -40, z: 220, w: 60, d: 30, h: 320, isCrystal: true },
    { x: 80, z: -20, w: 55, d: 35, h: 360, isCrystal: true }
  ];

  const pillarMeshes = [];

  pillarLayout.forEach((p, idx) => {
    const geo = new THREE.BoxGeometry(p.w, p.h, p.d);

    let mat;
    if (p.isCrystal) {
      // Bloque de cristal semitransparente como las memory cards del PS2
      mat = new THREE.MeshPhysicalMaterial({
        color: 0x1a3360,
        emissive: 0x0a1e3f,
        roughness: 0.15,
        metalness: 0.1,
        transmission: 0.75,
        transparent: true,
        opacity: 0.75,
        ior: 1.45
      });
    } else {
      // Material de columna de piedra digital con cara superior iluminada si corresponde
      const sideMat = new THREE.MeshStandardMaterial({
        map: stoneTexture,
        roughness: 0.55,
        metalness: 0.2,
        color: 0x8898b8
      });

      const topMat = p.topGlow
        ? new THREE.MeshBasicMaterial({
          map: topGlowTexture,
          color: p.emissive || 0xffffff
        })
        : new THREE.MeshStandardMaterial({
          map: stoneTexture,
          roughness: 0.4,
          metalness: 0.3,
          color: 0x485878
        });

      const bottomMat = new THREE.MeshBasicMaterial({ color: 0x020409 });

      mat = [sideMat, sideMat, topMat, bottomMat, sideMat, sideMat];
    }

    const mesh = new THREE.Mesh(geo, mat);
    // Posición Y para que las bases se hundan en el abismo y los topes tengan diferentes alturas
    const yPos = -p.h / 2 + (p.topGlow ? 120 : (Math.sin(idx * 1.5) * 60 + 50));
    mesh.position.set(p.x, yPos, p.z);
    towersGroup.add(mesh);

    // Aristas brillantes características de la geometría de PS2
    const edgeGeo = new THREE.EdgesGeometry(geo);
    const edgeMat = new THREE.LineBasicMaterial({
      color: p.isCrystal ? 0x00f0ff : 0x4f6baf,
      transparent: true,
      opacity: p.isCrystal ? 0.7 : 0.35,
      blending: THREE.AdditiveBlending
    });
    const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
    mesh.add(edgeLines);

    pillarMeshes.push({
      mesh: mesh,
      baseY: yPos,
      phase: idx * 0.45
    });
  });

  // 8. Rayos de Luz en Órbita (Los míticos destellos rojo, verde, magenta y cian de la imagen de PS2)
  const lights = [
    {
      color: 0xff2244, // Rayo Rojo
      trailColor: 0xff1133,
      radiusX: 190,
      radiusZ: 240,
      speed: 0.8,
      heightCenter: 60,
      heightAmp: 110,
      phase: 0
    },
    {
      color: 0x00ff88, // Rayo Verde
      trailColor: 0x00ee77,
      radiusX: 140,
      radiusZ: 170,
      speed: -1.1,
      heightCenter: 0,
      heightAmp: 90,
      phase: 1.8
    },
    {
      color: 0xe024c3, // Rayo Magenta/Púrpura
      trailColor: 0xc010b0,
      radiusX: 230,
      radiusZ: 180,
      speed: 0.7,
      heightCenter: 120,
      heightAmp: 130,
      phase: 3.4
    },
    {
      color: 0x00e5ff, // Luz Central Cian/Blanca
      trailColor: 0x00c8ff,
      radiusX: 90,
      radiusZ: 110,
      speed: -0.6,
      heightCenter: 80,
      heightAmp: 50,
      phase: 5.1
    }
  ];

  const lightObjects = [];

  lights.forEach((l) => {
    // Foco de luz puntual que ilumina las caras de las columnas
    const pLight = new THREE.PointLight(l.color, 2.2, 420);
    scene.add(pLight);

    // Esfera luminosa (Glow core)
    const sphereGeo = new THREE.SphereGeometry(3.5, 12, 12);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      blending: THREE.AdditiveBlending
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    // Estela de luz curvada (Light Trail)
    const maxTrailPoints = 35;
    const trailPositions = new Float32Array(maxTrailPoints * 3);
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));

    const trailMat = new THREE.LineBasicMaterial({
      color: l.trailColor,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      linewidth: 3
    });
    const trailLine = new THREE.Line(trailGeo, trailMat);
    scene.add(trailLine);

    lightObjects.push({
      config: l,
      pointLight: pLight,
      sphere: sphere,
      trailLine: trailLine,
      trailGeo: trailGeo,
      positionsHistory: []
    });
  });

  // 9. Nube de Partículas y Bruma Etérea PS2
  const particleCount = 260;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);

  const colCyan = new THREE.Color(0x06b6d4);
  const colPurple = new THREE.Color(0xa855f7);
  const colWhite = new THREE.Color(0xffffff);

  for (let i = 0; i < particleCount; i++) {
    particlePos[i * 3] = (Math.random() - 0.5) * 800;
    particlePos[i * 3 + 1] = Math.random() * 500 - 250;
    particlePos[i * 3 + 2] = (Math.random() - 0.5) * 800;

    const rChoice = Math.random();
    const c = rChoice < 0.45 ? colCyan : (rChoice < 0.8 ? colPurple : colWhite);
    particleColors[i * 3] = c.r;
    particleColors[i * 3 + 1] = c.g;
    particleColors[i * 3 + 2] = c.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 4,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // 10. Movimiento Suave de Cámara con Parallax e Interacción del Mouse
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // 11. Bucle de Renderizado Principal a 60 FPS
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Suavizado de mouse
    mouse.x += (mouse.targetX - mouse.x) * 0.04;
    mouse.y += (mouse.targetY - mouse.y) * 0.04;

    // Órbita lenta y majestuosa de la cámara alrededor de las torres
    const camAngle = elapsedTime * 0.08 + mouse.x * 0.45;
    const camDist = 520 + mouse.y * 60;
    camera.position.x = Math.sin(camAngle) * camDist;
    camera.position.z = Math.cos(camAngle) * camDist;
    camera.position.y = 440 - mouse.y * 120;
    camera.lookAt(0, -60, 0);

    // Oscilación suave de los monolitos
    pillarMeshes.forEach((item) => {
      item.mesh.position.y = item.baseY + Math.sin(elapsedTime * 0.7 + item.phase) * 8;
    });

    // Movimiento de los rayos de luz en 3D
    lightObjects.forEach((item) => {
      const c = item.config;
      const angle = elapsedTime * c.speed + c.phase;

      const lx = Math.cos(angle) * c.radiusX;
      const lz = Math.sin(angle) * c.radiusZ;
      const ly = c.heightCenter + Math.sin(angle * 1.6) * c.heightAmp;

      item.pointLight.position.set(lx, ly, lz);
      item.sphere.position.set(lx, ly, lz);

      // Actualizar historial de estela
      item.positionsHistory.unshift({ x: lx, y: ly, z: lz });
      if (item.positionsHistory.length > 35) {
        item.positionsHistory.pop();
      }

      const posAttr = item.trailGeo.attributes.position;
      for (let i = 0; i < 35; i++) {
        if (i < item.positionsHistory.length) {
          const p = item.positionsHistory[i];
          posAttr.setXYZ(i, p.x, p.y, p.z);
        } else if (item.positionsHistory.length > 0) {
          const last = item.positionsHistory[item.positionsHistory.length - 1];
          posAttr.setXYZ(i, last.x, last.y, last.z);
        }
      }
      posAttr.needsUpdate = true;
    });

    // Ascenso de partículas cósmicas
    const positions = particleSystem.geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 1] += 0.45; // Subir lentamente
      if (positions[i * 3 + 1] > 300) {
        positions[i * 3 + 1] = -250;
      }
    }
    particleSystem.geometry.attributes.position.needsUpdate = true;

    // Adaptación a modo claro u oscuro
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    scene.fog.color.setHex(isDark ? fogColorDark : fogColorLight);

    renderer.render(scene, camera);
  }

  animate();
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
    'la vida de puros binarios',
    'crear mundos con la lógica pura',
    'crear soluciones con impacto',
    'el desarrollo de software y BD',
    'la tecnología, algoritmos e innovación',
    'aprender y superarme día a día',
    'la estructura que compone el programa'
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
    '"Cada error superado es una lección ganada hacia la maestría."',
    '"La frase más peligrosa del mundo es: Siempre se ha hecho así."'
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
window.openLightbox = function (imgSrc, title, desc) {
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

window.closeLightbox = function (e) {
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
