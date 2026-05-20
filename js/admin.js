// ============================================================
// ADMIN.JS — Lógica del panel de administración
// ============================================================


// Variable global: guarda la habitación que se está editando
// (null significa que estamos creando una nueva)
var habitacionEditando = null;


// Cuando la página termine de cargar
document.addEventListener('DOMContentLoaded', function() {
  inicializarDatos(); // Cargar datos del localStorage
  verificarAccesoAdmin();
  cargarTablaHabitaciones(); // Mostrar habitaciones al entrar

  // Eventos de los botones de las tabs
  var tabs = document.querySelectorAll('.admin-tab');
  for (var i = 0; i < tabs.length; i++) {
    // Guardar referencia en una variable para usar dentro del evento
    var tab = tabs[i];
    tab.addEventListener('click', function() {
      cambiarTab(this.dataset.panel); // 'this' es el botón que se hizo clic
    });
  }

  // Botón para abrir el formulario de nueva habitación
  document.getElementById('btn-nueva-habitacion').addEventListener('click', function() {
    abrirFormularioHabitacion(null); // null = nueva habitación
  });

  // Formulario de habitación: al hacer clic en Guardar
  document.getElementById('form-habitacion').addEventListener('submit', function(e) {
    e.preventDefault(); // Evitar que recargue la página
    guardarFormularioHabitacion();
  });

  // Cerrar modal de habitación
  document.getElementById('modal-habitacion').addEventListener('click', function(e) {
    if (e.target === this) { // Si se hizo clic en el fondo oscuro
      controlarModal('modal-habitacion', 'cerrar');
    }
  });
});


// ============================================================
// CONTROL DE ACCESO
// Solo los administradores pueden ver esta página
// ============================================================

function verificarAccesoAdmin() {
  if (!hayUsuarioActivo() || !esAdministrador()) {
    alert('⛔ Acceso denegado. Esta página es solo para administradores.');
    window.location.href = 'index.html';
  }
}


// ============================================================
// TABS (pestañas de navegación)
// ============================================================

function cambiarTab(nombrePanel) {
  // Desactivar todas las tabs y ocultar todos los paneles
  var tabs   = document.querySelectorAll('.admin-tab');
  var panels = document.querySelectorAll('.admin-panel');

  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove('activo');
  }
  for (var i = 0; i < panels.length; i++) {
    panels[i].classList.remove('activo');
  }

  // Activar la tab y el panel seleccionados
  document.querySelector('[data-panel="' + nombrePanel + '"]').classList.add('activo');
  document.getElementById('panel-' + nombrePanel).classList.add('activo');

  // Cargar los datos del panel que se activó
  if (nombrePanel === 'habitaciones') {
    cargarTablaHabitaciones();
  }
  if (nombrePanel === 'reservas') {
    cargarTablaReservas();
  }
}


// ============================================================
// GESTIÓN DE HABITACIONES
// ============================================================

// Llenar la tabla de habitaciones con los datos del localStorage
function cargarTablaHabitaciones() {
  var habitaciones = obtenerHabitaciones();
  var tbody        = document.getElementById('tbody-habitaciones');

  if (habitaciones.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" style="text-align:center; color:var(--gris)">No hay habitaciones.</td></tr>';
    return;
  }

  var html = '';

  for (var i = 0; i < habitaciones.length; i++) {
    var h             = habitaciones[i];
    var serviciosTexto = h.servicios.join(', '); // Unir la lista con comas

    html +=
      '<tr>' +
        '<td><strong>' + h.nombre + '</strong></td>' +
        '<td>' + h.camas + '</td>' +
        '<td>' + h.maxPersonas + '</td>' +
        '<td>' + formatearPrecio(h.precioPorNoche) + '</td>' +
        '<td style="font-size:0.85rem">' + serviciosTexto + '</td>' +
        '<td>' +
          '<button class="btn btn-secundario btn-sm" ' +
            'onclick="abrirFormularioHabitacion(' + h.id + ')">Editar</button> ' +
          '<button class="btn btn-peligro btn-sm" ' +
            'onclick="eliminarHabitacionAdmin(' + h.id + ')">Eliminar</button>' +
        '</td>' +
      '</tr>';
  }

  tbody.innerHTML = html;
}

// Abrir el formulario para crear o editar una habitación
// Si id es null → crear nueva. Si id es un número → editar esa habitación.
function abrirFormularioHabitacion(id) {
  // Limpiar el formulario y los mensajes anteriores
  document.getElementById('form-habitacion').reset();
  document.getElementById('msg-form-hab').innerHTML = '';

  // Desmarcar todos los checkboxes de servicios
  var checkboxes = document.querySelectorAll('.check-servicio');
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = false;
  }

  if (id !== null) {
    // MODO EDICIÓN: cargar los datos de la habitación existente
    habitacionEditando = obtenerHabitacionPorId(id);

    if (habitacionEditando === null) {
      return; // No se encontró la habitación
    }

    document.getElementById('modal-hab-titulo').textContent = 'Editar Habitación';

    // Llenar los campos del formulario con los datos actuales
    document.getElementById('hab-nombre').value     = habitacionEditando.nombre;
    document.getElementById('hab-descripcion').value = habitacionEditando.descripcion;
    document.getElementById('hab-camas').value      = habitacionEditando.camas;
    document.getElementById('hab-personas').value   = habitacionEditando.maxPersonas;
    document.getElementById('hab-precio').value     = habitacionEditando.precioPorNoche;
    document.getElementById('hab-imagen').value     = habitacionEditando.imagen;

    // Marcar los checkboxes de los servicios que tiene la habitación
    for (var j = 0; j < habitacionEditando.servicios.length; j++) {
      var servicio = habitacionEditando.servicios[j];
      // Buscar el checkbox que tenga ese valor y marcarlo
      var checkboxesAll = document.querySelectorAll('.check-servicio');
      for (var k = 0; k < checkboxesAll.length; k++) {
        if (checkboxesAll[k].value === servicio) {
          checkboxesAll[k].checked = true;
        }
      }
    }

  } else {
    // MODO CREACIÓN: limpiar todo
    habitacionEditando = null;
    document.getElementById('modal-hab-titulo').textContent = 'Nueva Habitación';
  }

  controlarModal('modal-habitacion', 'abrir');
}

// Guardar los datos del formulario (crear o actualizar habitación)
function guardarFormularioHabitacion() {
  // Leer los valores del formulario
  var nombre      = document.getElementById('hab-nombre').value.trim();
  var descripcion = document.getElementById('hab-descripcion').value.trim();
  var camas       = parseInt(document.getElementById('hab-camas').value);
  var maxPersonas = parseInt(document.getElementById('hab-personas').value);
  var precio      = parseInt(document.getElementById('hab-precio').value);
  var imagen      = document.getElementById('hab-imagen').value.trim();

  // Si no pusieron imagen, usar una por defecto
  if (imagen === '') {
    imagen = 'https://picsum.photos/seed/hab-nueva-' + Date.now() + '/800/500';
  }

  // Recoger los servicios que están marcados con checkbox
  var servicios  = [];
  var checkboxes = document.querySelectorAll('.check-servicio');
  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      servicios.push(checkboxes[i].value);
    }
  }

  // Armar el objeto con los datos
  var datos = {
    nombre:         nombre,
    descripcion:    descripcion,
    camas:          camas,
    maxPersonas:    maxPersonas,
    precioPorNoche: precio,
    servicios:      servicios,
    imagen:         imagen
  };

  if (habitacionEditando !== null) {
    // ACTUALIZAR habitación existente
    actualizarHabitacion(habitacionEditando.id, datos);
    document.getElementById('msg-form-hab').innerHTML =
      '<div class="alerta alerta-exito">✅ Habitación actualizada.</div>';
  } else {
    // CREAR nueva habitación
    agregarHabitacion(datos);
    document.getElementById('msg-form-hab').innerHTML =
      '<div class="alerta alerta-exito">✅ Habitación creada.</div>';
  }

  // Esperar un momento y cerrar el modal
  setTimeout(function() {
    controlarModal('modal-habitacion', 'cerrar');
    cargarTablaHabitaciones(); // Actualizar la tabla
  }, 1500);
}

// Eliminar una habitación
function eliminarHabitacionAdmin(id) {
  var hab = obtenerHabitacionPorId(id);
  if (hab === null) {
    return;
  }

  var confirmado = confirm('¿Seguro que deseas eliminar "' + hab.nombre + '"? Esto no se puede deshacer.');
  if (!confirmado) {
    return;
  }

  eliminarHabitacion(id);
  cargarTablaHabitaciones(); // Actualizar la tabla
}


// ============================================================
// GESTIÓN DE RESERVAS
// ============================================================

// Llenar la tabla de reservas con todos los registros
function cargarTablaReservas() {
  var reservas = obtenerReservas();
  var tbody    = document.getElementById('tbody-reservas');

  if (reservas.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="7" style="text-align:center; color:var(--gris)">No hay reservas.</td></tr>';
    return;
  }

  // Ordenar de más reciente a más antigua usando la fecha de creación
  reservas.sort(function(a, b) {
    return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
  });

  var html = '';

  for (var i = 0; i < reservas.length; i++) {
    var r = reservas[i];

    // Botón de cancelar (solo si la reserva está activa)
    var accion = '';
    if (r.estado === 'activa') {
      accion = '<button class="btn btn-peligro btn-sm" ' +
               'onclick="cancelarReservaAdmin(\'' + r.id + '\')">Cancelar</button>';
    } else {
      accion = '<span class="badge badge-cancelado">CANCELADA</span>';
    }

    html +=
      '<tr>' +
        '<td style="font-size:0.78rem; color:var(--gris)">' + r.id + '</td>' +
        '<td>' + (r.nombreUsuario || r.usuarioId) + '</td>' +
        '<td>' + (r.nombreHabitacion || 'N/A') + '</td>' +
        '<td>' + formatearFecha(r.checkIn) + '</td>' +
        '<td>' + formatearFecha(r.checkOut) + '</td>' +
        '<td>' + formatearPrecio(r.total) + '</td>' +
        '<td>' + accion + '</td>' +
      '</tr>';
  }

  tbody.innerHTML = html;
}

// Cancelar una reserva desde el panel de administración
function cancelarReservaAdmin(reservaId) {
  var reserva = buscarReservaPorId(reservaId);
  if (reserva === null) {
    return;
  }

  var confirmado = confirm(
    '¿Cancelar la reserva ' + reservaId + '\nCliente: ' + reserva.nombreUsuario + '?'
  );
  if (!confirmado) {
    return;
  }

  cancelarReserva(reservaId);
  cargarTablaReservas(); // Actualizar la tabla
}
