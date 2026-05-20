# 🏨 Hotel El Rincón del Carmen — Sitio Web

Sitio web completo para el Hotel El Rincón del Carmen, desarrollado con HTML5, CSS3 y JavaScript puro como proyecto de aprendizaje.

---

## 📋 Descripción

Sitio web funcional para gestionar la presencia en línea del hotel y permitir a los clientes consultar disponibilidad y realizar reservas de habitaciones. Toda la información se guarda en el `localStorage` del navegador (simulación de base de datos).

---

## 🗂️ Estructura del Proyecto

```
hotel-rincon-del-carmen/
├── index.html          → Página de inicio (Landing Page)
├── reservas.html       → Consulta de disponibilidad y reservas
├── contacto.html       → Ubicación y formas de contacto
├── admin.html          → Panel de administración
├── css/
│   └── styles.css      → Todos los estilos (Mobile First)
└── js/
    ├── storage.js      → Manejo de datos en localStorage
    ├── auth.js         → Autenticación (login/registro)
    ├── main.js         → Lógica de la página de inicio
    ├── reservas.js     → Lógica de la página de reservas
    ├── admin.js        → Lógica del panel de administración
    └── components/
        ├── navbar.js       → Web Component: barra de navegación
        ├── carousel.js     → Web Component: carrusel de imágenes
        ├── room-card.js    → Web Component: tarjeta de habitación
        └── auth-modal.js   → Web Component: modales de login/registro
```

---

## 🚀 Cómo Abrir el Proyecto

1. Clona o descarga el repositorio.
2. Abre el archivo `index.html` en tu navegador.
3. ¡Listo! No necesita servidor ni instalación de dependencias.

> **Nota:** Para que los Web Components funcionen correctamente en algunos navegadores, es recomendable abrir el proyecto con un servidor local (como la extensión **Live Server** de VS Code).

---

## 🧪 Cuentas de Prueba

| Rol          | Email              | Contraseña |
|--------------|--------------------|------------|
| Administrador | admin@hotel.com   | admin123   |
| Cliente       | juan@test.com     | test123    |

---

## 📱 Páginas

### 1. Inicio (`index.html`)
- Carrusel automático de imágenes del hotel
- Estadísticas del hotel (número de habitaciones, años de experiencia, etc.)
- Galería de áreas: piscina, spa, restaurante, jardines, etc.
- Galería de servicios: gastronomía, bienestar, zona húmeda
- Sección de llamado a la acción (CTA)
- Footer con información de contacto

### 2. Reservas (`reservas.html`)
- Formulario de búsqueda: fecha de entrada, fecha de salida, número de personas
- Listado de habitaciones disponibles según los filtros
- Modal de detalle: imagen, descripción, servicios, resumen de precio
- Confirmación de reserva con verificación de disponibilidad
- Sección "Mis Reservas" para ver y cancelar reservas activas

### 3. Contacto (`contacto.html`)
- Información completa: dirección, teléfono, email, horarios
- Mapa de ubicación (placeholder)
- Formulario de contacto simulado
- Tarjetas de contacto rápido (llamada, WhatsApp, email)

### 4. Panel Admin (`admin.html`)
- Protegido: solo accesible para usuarios administradores
- **Habitaciones:** crear, editar y eliminar habitaciones
- **Reservas:** ver todas las reservas y cancelarlas

---

## ⚙️ Funcionalidades Principales

- ✅ Registro de usuarios con: ID, nombre, nacionalidad, email, teléfono, contraseña
- ✅ Autenticación (login/logout)
- ✅ Búsqueda de habitaciones por fechas y número de personas
- ✅ Verificación de disponibilidad en tiempo real (sin solapamiento de reservas)
- ✅ Doble verificación al momento de confirmar la reserva
- ✅ Cancelación de reservas por parte del cliente y del administrador
- ✅ Al cancelar una reserva, la habitación queda disponible automáticamente
- ✅ Panel de administrador para gestionar habitaciones y reservas
- ✅ Diseño responsive (Mobile First)

---

## 🛠️ Tecnologías Utilizadas

- **HTML5:** Estructura semántica del sitio
- **CSS3:** Estilos responsivos con diseño Mobile First, variables CSS, Flexbox y Grid
- **JavaScript ES6+:** Lógica, manipulación del DOM, eventos, módulos
- **Web Components (Vanilla JS):** Componentes reutilizables (`app-navbar`, `app-carrusel`, `tarjeta-habitacion`, `auth-modal`)
- **LocalStorage:** Almacenamiento y simulación de base de datos en el navegador

---

## 💡 Notas de Desarrollo

- El proyecto usa **diseño Mobile First**: los estilos base están pensados para móviles y se amplían para tablets y escritorio con media queries.
- Los **Web Components** se crean con la API nativa del navegador (`customElements.define`), sin librerías externas.
- Las imágenes provienen de [picsum.photos](https://picsum.photos), que genera imágenes de muestra consistentes según una "semilla" (seed).
- Toda la persistencia de datos es local (localStorage). En producción se reemplazaría por una API y base de datos real.
