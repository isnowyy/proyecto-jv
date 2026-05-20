// ============================================================
// DATOS.JS — Manejo de información guardada en el navegador
//
// El localStorage es como una "caja de guardar datos" del
// navegador. Los datos se mantienen aunque cierres la página.
// Solo se borran si limpias el historial del navegador.
// ============================================================


// Nombres de las "cajas" donde guardamos cada tipo de dato
var GUARDADO = {
  usuarios:     'hotel_usuarios',
  habitaciones: 'hotel_habitaciones',
  reservas:     'hotel_reservas',
  sesion:       'hotel_sesion'
};


// ============================================================
// DATOS INICIALES
// Estas son las habitaciones y usuarios que aparecen la
// primera vez que alguien abre el sitio.
// ============================================================

var habitacionesIniciales = [
  {
    id: 1,
    nombre: 'Habitación Estándar',
    descripcion: 'Cómoda habitación con todos los servicios básicos para una estadía placentera.',
    camas: 1,
    maxPersonas: 2,
    precioPorNoche: 150000,
    servicios: ['WiFi', 'TV', 'Aire Acondicionado'],
    imagen: 'https://picsum.photos/seed/hab-estandar-rc/800/500'
  },
  {
    id: 2,
    nombre: 'Habitación Doble',
    descripcion: 'Espaciosa habitación con dos camas, ideal para familias o grupos.',
    camas: 2,
    maxPersonas: 4,
    precioPorNoche: 230000,
    servicios: ['WiFi', 'TV', 'Aire Acondicionado', 'Minibar'],
    imagen: 'https://picsum.photos/seed/hab-doble-rc/800/500'
  },
  {
    id: 3,
    nombre: 'Suite Junior',
    descripcion: 'Suite elegante con jacuzzi privado. Perfecta para parejas que buscan un momento especial.',
    camas: 1,
    maxPersonas: 2,
    precioPorNoche: 320000,
    servicios: ['WiFi', 'TV', 'Aire Acondicionado', 'Minibar', 'Jacuzzi'],
    imagen: 'https://picsum.photos/seed/suite-junior-rc/800/500'
  },
  {
    id: 4,
    nombre: 'Suite Presidencial',
    descripcion: 'Nuestra suite más lujosa: sala de estar, jacuzzi y las mejores vistas del hotel.',
    camas: 2,
    maxPersonas: 4,
    precioPorNoche: 550000,
    servicios: ['WiFi', 'TV', 'Aire Acondicionado', 'Minibar', 'Jacuzzi', 'Sala de Estar'],
    imagen: 'https://picsum.photos/seed/suite-presid-rc/800/500'
  },
  {
    id: 5,
    nombre: 'Habitación Familiar',
    descripcion: 'Perfecta para familias grandes. Tres camas y mucho espacio para estar cómodos.',
    camas: 3,
    maxPersonas: 6,
    precioPorNoche: 400000,
    servicios: ['WiFi', 'TV', 'Aire Acondicionado', 'Minibar'],
    imagen: 'https://picsum.photos/seed/hab-familiar-rc/800/500'
  },
  {
    id: 6,
    nombre: 'Cabaña Romántica',
    descripcion: 'Cabaña independiente con terraza y jacuzzi privado, rodeada de naturaleza.',
    camas: 1,
    maxPersonas: 2,
    precioPorNoche: 280000,
    servicios: ['WiFi', 'TV', 'Jacuzzi', 'Terraza'],
    imagen: 'https://picsum.photos/seed/cabana-roman-rc/800/500'
  }
];

// Usuarios que vienen por defecto al abrir el sitio
var usuariosIniciales = [
  {
    id: 'ADMIN001',
    nombre: 'Administrador Hotel',
    nacionalidad: 'Colombiana',
    email: 'admin@hotel.com',
    telefono: '3001234567',
    contrasena: 'admin123',
    esAdmin: true   // Este usuario puede acceder al panel de administración
  },
  {
    id: '12345678',
    nombre: 'Juan Pérez',
    nacionalidad: 'Colombiana',
    email: 'juan@test.com',
    telefono: '3009876543',
    contrasena: 'test123',
    esAdmin: false  // Este es un cliente normal
  }
];


// ============================================================
// INICIALIZAR DATOS
// Se llama al abrir cualquier página del sitio.
// Solo crea los datos si no existen aún en el localStorage.
// ============================================================

function inicializarDatos() {
  // Si no hay habitaciones guardadas, guardar las que vienen por defecto
  if (localStorage.getItem(GUARDADO.habitaciones) === null) {
    localStorage.setItem(GUARDADO.habitaciones, JSON.stringify(habitacionesIniciales));
  }

  // Si no hay usuarios guardados, guardar los que vienen por defecto
  if (localStorage.getItem(GUARDADO.usuarios) === null) {
    localStorage.setItem(GUARDADO.usuarios, JSON.stringify(usuariosIniciales));
  }

  // Si no hay reservas guardadas, guardar una lista vacía
  if (localStorage.getItem(GUARDADO.reservas) === null) {
    localStorage.setItem(GUARDADO.reservas, JSON.stringify([]));
  }
}


// ============================================================
// FUNCIONES DE HABITACIONES
// ============================================================

// Obtener todas las habitaciones guardadas
function obtenerHabitaciones() {
  // JSON.parse convierte el texto del localStorage en un objeto de JavaScript
  return JSON.parse(localStorage.getItem(GUARDADO.habitaciones));
}

// Buscar una habitación por su ID (número de identificación)
function obtenerHabitacionPorId(id) {
  var todas = obtenerHabitaciones();

  for (var i = 0; i < todas.length; i++) {
    if (todas[i].id === id) {
      return todas[i]; // La encontramos, devolver
    }
  }
  return null; // No la encontró
}

// Agregar una nueva habitación
function agregarHabitacion(habitacion) {
  var todas = obtenerHabitaciones();

  // Calcular el próximo ID (el más alto existente + 1)
  var maxId = 0;
  for (var i = 0; i < todas.length; i++) {
    if (todas[i].id > maxId) {
      maxId = todas[i].id;
    }
  }
  habitacion.id = maxId + 1;

  todas.push(habitacion); // push() agrega un elemento al final del array
  // JSON.stringify convierte el objeto de vuelta a texto para guardarlo
  localStorage.setItem(GUARDADO.habitaciones, JSON.stringify(todas));
  return habitacion;
}

// Actualizar los datos de una habitación existente
function actualizarHabitacion(id, nuevosDatos) {
  var todas = obtenerHabitaciones();

  for (var i = 0; i < todas.length; i++) {
    if (todas[i].id === id) {
      // Reemplazar campo por campo con los nuevos datos
      todas[i].nombre         = nuevosDatos.nombre;
      todas[i].descripcion    = nuevosDatos.descripcion;
      todas[i].camas          = nuevosDatos.camas;
      todas[i].maxPersonas    = nuevosDatos.maxPersonas;
      todas[i].precioPorNoche = nuevosDatos.precioPorNoche;
      todas[i].servicios      = nuevosDatos.servicios;
      todas[i].imagen         = nuevosDatos.imagen;
      break; // break sale del ciclo cuando ya terminamos
    }
  }

  localStorage.setItem(GUARDADO.habitaciones, JSON.stringify(todas));
}

// Eliminar una habitación
function eliminarHabitacion(id) {
  var todas = obtenerHabitaciones();
  var sinEsta = [];

  // Copiar todas las habitaciones excepto la que queremos eliminar
  for (var i = 0; i < todas.length; i++) {
    if (todas[i].id !== id) {
      sinEsta.push(todas[i]);
    }
  }

  localStorage.setItem(GUARDADO.habitaciones, JSON.stringify(sinEsta));
}


// ============================================================
// FUNCIONES DE USUARIOS
// ============================================================

// Obtener todos los usuarios guardados
function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem(GUARDADO.usuarios));
}

// Buscar un usuario por su email
function buscarUsuarioPorEmail(email) {
  var todos = obtenerUsuarios();
  for (var i = 0; i < todos.length; i++) {
    if (todos[i].email === email) {
      return todos[i];
    }
  }
  return null; // No encontrado
}

// Buscar un usuario por su número de identificación
function buscarUsuarioPorId(id) {
  var todos = obtenerUsuarios();
  for (var i = 0; i < todos.length; i++) {
    if (todos[i].id === id) {
      return todos[i];
    }
  }
  return null;
}

// Guardar un nuevo usuario en la lista
function guardarUsuario(nuevoUsuario) {
  var todos = obtenerUsuarios();
  todos.push(nuevoUsuario);
  localStorage.setItem(GUARDADO.usuarios, JSON.stringify(todos));
}


// ============================================================
// FUNCIONES DE RESERVAS
// ============================================================

// Obtener todas las reservas guardadas
function obtenerReservas() {
  return JSON.parse(localStorage.getItem(GUARDADO.reservas));
}

// Obtener solo las reservas de un usuario específico
function obtenerReservasDeUsuario(usuarioId) {
  var todas = obtenerReservas();
  var delUsuario = [];

  for (var i = 0; i < todas.length; i++) {
    if (todas[i].usuarioId === usuarioId) {
      delUsuario.push(todas[i]);
    }
  }

  return delUsuario;
}

// Buscar una reserva por su ID
function buscarReservaPorId(reservaId) {
  var todas = obtenerReservas();
  for (var i = 0; i < todas.length; i++) {
    if (todas[i].id === reservaId) {
      return todas[i];
    }
  }
  return null;
}

// Guardar una nueva reserva
function guardarReserva(reserva) {
  var todas = obtenerReservas();

  // Generar un ID único usando la hora actual (en milisegundos)
  // Date.now() devuelve un número como: 1718000000000
  reserva.id            = 'RES-' + Date.now();
  reserva.fechaCreacion = new Date().toISOString();
  reserva.estado        = 'activa';

  todas.push(reserva);
  localStorage.setItem(GUARDADO.reservas, JSON.stringify(todas));
  return reserva;
}

// Cambiar el estado de una reserva a 'cancelada'
function cancelarReserva(reservaId) {
  var todas = obtenerReservas();

  for (var i = 0; i < todas.length; i++) {
    if (todas[i].id === reservaId) {
      todas[i].estado = 'cancelada';
      break;
    }
  }

  localStorage.setItem(GUARDADO.reservas, JSON.stringify(todas));
}


// ============================================================
// VERIFICAR DISPONIBILIDAD
// Revisa si una habitación está libre para las fechas pedidas.
// Devuelve true si está disponible, false si no lo está.
// ============================================================

function estaDisponible(habitacionId, fechaEntrada, fechaSalida) {
  var todas  = obtenerReservas();
  var entrada = new Date(fechaEntrada); // Convertir texto a fecha
  var salida  = new Date(fechaSalida);

  for (var i = 0; i < todas.length; i++) {
    var r = todas[i];

    // Saltar las reservas canceladas (no ocupan espacio)
    if (r.estado === 'cancelada') {
      continue; // continue salta a la siguiente iteración del ciclo
    }

    // Saltar las reservas de otras habitaciones
    if (r.habitacionId !== habitacionId) {
      continue;
    }

    // Convertir las fechas de esta reserva a objetos Date
    var rEntrada = new Date(r.checkIn);
    var rSalida  = new Date(r.checkOut);

    // Hay solapamiento (choque de fechas) si:
    // la nueva entrada es ANTES de la salida existente
    // Y la nueva salida es DESPUÉS de la entrada existente
    if (entrada < rSalida && salida > rEntrada) {
      return false; // Sí hay choque, no está disponible
    }
  }

  return true; // No hubo choque, está disponible
}

// Obtener la lista de habitaciones que sí están disponibles
function obtenerHabitacionesDisponibles(fechaEntrada, fechaSalida, personas) {
  var todas       = obtenerHabitaciones();
  var disponibles = [];

  for (var i = 0; i < todas.length; i++) {
    var hab = todas[i];

    // Saltar si no tiene capacidad suficiente para las personas
    if (hab.maxPersonas < parseInt(personas)) {
      continue;
    }

    // Saltar si no está disponible en las fechas
    if (!estaDisponible(hab.id, fechaEntrada, fechaSalida)) {
      continue;
    }

    disponibles.push(hab);
  }

  return disponibles;
}


// ============================================================
// FUNCIONES ÚTILES (se usan en varias páginas)
// ============================================================

// Calcular cuántas noches hay entre dos fechas
function calcularNoches(fechaEntrada, fechaSalida) {
  var entrada      = new Date(fechaEntrada);
  var salida       = new Date(fechaSalida);
  var diferencia   = salida - entrada; // Diferencia en milisegundos
  var milisXDia    = 1000 * 60 * 60 * 24; // Cuántos milisegundos tiene un día
  return Math.round(diferencia / milisXDia);
}

// Dar formato de precio colombiano
// Ejemplo: 150000 → "$150.000"
function formatearPrecio(numero) {
  return '$' + numero.toLocaleString('es-CO');
}

// Convertir una fecha de "2025-06-15" a "15 de junio de 2025"
function formatearFecha(fechaTexto) {
  // Agregamos 'T00:00:00' para evitar que JavaScript cambie el día por la zona horaria
  var fecha   = new Date(fechaTexto + 'T00:00:00');
  var opciones = { day: 'numeric', month: 'long', year: 'numeric' };
  return fecha.toLocaleDateString('es-CO', opciones);
}

// Mostrar u ocultar un modal (ventana emergente)
// accion puede ser 'abrir' o 'cerrar'
function controlarModal(idModal, accion) {
  var modal = document.getElementById(idModal);
  if (accion === 'abrir') {
    modal.style.display = 'flex';
  } else {
    modal.style.display = 'none';
  }
}
