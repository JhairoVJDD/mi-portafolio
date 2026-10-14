# 🌟 Portafolio Personal de Jhairo Ventocilla

¡Bienvenido a mi sitio web y portafolio personal! Este proyecto fue diseñado y estructurado especialmente para dar a conocer mi historia de vida, mis valores, mis habilidades en Ingeniería de Sistemas, mis lenguajes de programación con carrusel 3D, mis momentos favoritos y mis metas futuras.

---

## 🛠️ CAMBIO EN EL CONTENEDOR (Navegación Flotante Redondeada)

> **Apartado para modificar el contenedor y bordados de la barra de navegación**

Se implementó una barra de navegación tipo **isla flotante (dock pill)** inspirada en componentes modernos de ReUI, Kokonut UI y UI Inspo:
- **Comportamiento dinámico**: Al hacer scroll hacia abajo, la barra de navegación se separa con elegancia de los bordes superiores y laterales de la pantalla, transformándose en una cápsula suave con **bordes totalmente redondeados (`border-radius: 9999px`)**, eliminando cualquier aspecto plano o recto.
- **Efectos visuales**: Cuenta con desenfoque de cristal (*glassmorphism*), borde sutil reflectante con resplandor (*glow*) y sombra profunda para destacar sobre el contenido.

### 📝 ¿Dónde cambiar este código?

1. **En `styles.css`**:
   Busca la sección destacada con el comentario:
   ```css
   /* ===================================================================
      CAMBIO EN EL CONTENEDOR: NAVEGACIÓN FLOTANTE REDONDEADA (ISLA / PILL)
      =================================================================== */
   ```
   Allí puedes cambiar:
   - `border-radius`: Ajusta la curvatura de los bordados (ejemplo: `9999px` para cápsula ovalada o `24px` para esquinas redondeadas rectangulares).
   - `max-width`: Ancho máximo de la isla flotante (actualmente `1080px`).
   - `background`: Transparencia y color del cristal (`rgba(10, 15, 28, 0.85)`).
   - `box-shadow`: Intensidad del resplandor y sombra al flotar.

2. **En `index.html`**:
   Busca el encabezado:
   ```html
   <!-- CAMBIO EN EL CONTENEDOR: BARRA DE NAVEGACIÓN FLOTANTE Y REDONDEADA -->
   <header class="navbar-header" id="navbar">
   ```

---

## 🚀 Nuevas Características Incluidas

### 1. 🎮 Fondo Dinámico Inspirado en PlayStation 2 (PS2) con Anime.js
- **Siete Maravillas (Seven Wonders)**: Monolitos y columnas de cristal 3D que flotan en el espacio celestial con rotación y oscilación suave.
- **Nube de partículas etéreas**: Más de 100 partículas luminosas en tonos cian y púrpura que ascienden con ondulaciones senoidales.
- **Inercia con el ratón**: Al mover el cursor, la cámara se desplaza suavemente simulando la navegación con el joystick de PS2.

### 2. 🎴 Carrusel 3D Coverflow de Lenguajes de Programación (ReUI / Kokonut UI)
- Carrusel con perspectiva 3D profunda (`perspective: 1200px`) donde la tarjeta activa se sitúa en el centro con aumento de escala y resplandor, mientras las tarjetas laterales rotan en ángulo.
- **Anime.js integrado**: Transiciones con curvas de animación ultra-fluidas.
- **Interactividad total**: Haz clic en cualquier tarjeta para centrarla, usa las flechas laterales, navega con las teclas de flecha del teclado o desliza en tu teléfono móvil.
- **Filtros por categoría**: *Todos*, *Lenguajes*, *Bases de Datos & BI* y *Frontend & Software*.
- Tecnologías destacadas: **Java**, **Python**, **SQL Server & T-SQL**, **JavaScript (ES6+)**, **TypeScript**, **C# .NET**, **Power BI & DAX**, **HTML5 & CSS3**.

### 3. 🌓 Modo Oscuro y Modo Claro
- Alternador de tema en la barra de navegación que recuerda tu preferencia en el almacenamiento local.

### 4. 💌 Formulario con Celebración de Confeti
- Validación en tiempo real y animación de confeti festivo en pantalla al enviar.

---

## 📁 Estructura del Repositorio

```text
mi-portafolio/
├── index.html            # Estructura semántica, menú, carrusel 3D y secciones
├── styles.css            # Estilos: Glassmorphism, contenedor flotante redondeado y 3D
├── script.js             # Motor interactivo: PS2 Canvas con Anime.js, Coverflow 3D y filtros
├── assets/
│   └── images/           # Tus fotografías y recursos
│       ├── profile.jpg       # Foto de perfil principal
│       ├── workspace.jpg     # Foto de tu espacio de trabajo
│       ├── adventure.jpg     # Foto de paisajes y horizontes
│       ├── foto_terno.png    # Fotografía formal con terno
│       └── perfil_github.jpg # Fotografía de tu perfil GitHub
└── README.md             # Esta guía de uso y personalización
```

---

¡Listo para seguir creciendo y sumando nuevos proyectos y tecnologías a tu portafolio! 🚀✨
