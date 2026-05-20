// ============================================================
// RESERVAS.JS — Lógica de la página de consulta y reservas
// ============================================================


// Variable global: habitación que el usuario seleccionó para reservar
var habitacionSeleccionada = null;

// Variables globales: fechas y personas de la búsqueda actual
var checkInActual    = '';
var checkOutActual   = '';
var personasActual   = 1;


// Cuando la página termine de cargar, ejecutar estas funciones
document.addEventListener('DOMContentLoaded', function() {
  inicializarAuth();   // Datos, navbar y formularios de login/registro
  configurarFechas();
  cargarMisReservas(); // Mostrar las reservas del usuario si tiene sesión
});


// ============================================================
// CONFIGURAR FECHAS DEL FORMULARIO DE BÚSQUEDA
// ============================================================

function configurarFechas() {
  var hoy    = new Date();
  var manana = new Date();
  manana.setDate(manana.getDate() + 1); // setDate suma días a la fecha

  // Convertir a formato "AAAA-MM-DD" que entiende el input type="date"
  var hoyTexto    = hoy.toISOString().split('T')[0];
  var mananaTexto = manana.toISOString().split('T')[0];

  var inputEntrada = document.getElementById('checkIn');
  var inputSalida  = document.getElementById('checkOut');

  // Establecer el mínimo (no se pueden seleccionar fechas pasadas)
  inputEntrada.min   = hoyTexto;
  inputEntrada.value = hoyTexto;

  inputSalida.min   = mananaTexto;
  inputSalida.value = mananaTexto;

  // Cuando cambie la fecha de entrada, actualizar el mínimo de salida
  inputEntrada.addEventListener('change', function() {
    // La salida no puede ser el mismo día ni antes de la entrada
    var entradaDate = new Date(inputEntrada.value + 'T00:00:00');
    entradaDate.setDate(entradaDate.getDate() + 1);
    var nuevoMinimo = entradaDate.toISOString().split('T')[0];

    inputSalida.min = nuevoMinimo;

    // Si la salida actual es menor al nuevo mínimo, actualizarla
    if (inputSalida.value <= inputEntrada.value) {
      inputSalida.value = nuevoMinimo;
    }
  });
}


// ============================================================
// BÚSQUEDA DE HABITACIONES DISPONIBLES
// ============================================================

function buscarHabitaciones() {
  // Leer los valores del formulario
  checkInActual  = document.getElementById('checkIn').value;
  checkOutActual = document.getElementById('checkOut').value;
  personasActual = document.getElementById('personas').value;

  // Validar que las fechas estén completas
  if (checkInActual === '' || checkOutActual === '') {
    mostrarAlerta('alerta-busqueda', 'Por favor ingresa las fechas de entrada y salida.', 'error');
    return; // Salir de la función si hay error
  }

  // Validar que la salida sea después de la entrada
  if (new Date(checkOutActual) <= new Date(checkInActual)) {
    mostrarAlerta('alerta-busqueda', 'La fecha de salida debe ser después de la entrada.', 'error');
    return;
  }

  // Limpiar la alerta si todo está bien
  document.getElementById('alerta-busqueda').innerHTML = '';

  // Buscar habitaciones disponibles con esos filtros
  var disponibles = obtenerHabitacionesDisponibles(checkInActual, checkOutActual, personasActual);

  // Mostrar los resultados en la página
  mostrarResultados(disponibles);
}


// Dibujar las tarjetas de habitaciones disponibles en la pantalla
function mostrarResultados(habitaciones) {
  var contenedor = document.getElementById('resultados');
  var noches     = calcularNoches(checkInActual, checkOutActual);

  // Si no hay habitaciones disponibles
  if (habitaciones.length === 0) {
    contenedor.innerHTML =
      '<div class="sin-resultados">' +
        '<div class="icono">🔍</div>' +
        '<h3>No hay habitaciones disponibles</h3>' +
        '<p>Intenta con otras fechas o menos personas.</p>' +
      '</div>';
    return;
  }

  // Título con el resumen de la búsqueda
  var html = '<p class="resultados-info">Se encontraron <strong>' + habitaciones.length +
             '</strong> habitaciones para <strong>' + noches + '</strong> noche(s)</p>';

  html += '<div class="grid-habitaciones">';

  // Crear una tarjeta por cada habitación
  for (var i = 0; i < habitaciones.length; i++) {
    var h        = habitaciones[i];
    var total    = h.precioPorNoche * noches;

    // Crear las etiquetas de servicios
    var serviciosHtml = '';
    for (var j = 0; j < h.servicios.length; j++) {
      serviciosHtml += '<span class="servicio-tag">' + h.servicios[j] + '</span>';
    }

    // Construir el HTML de la tarjeta
    // NOTA: Las comillas dentro del onclick usan comillas simples para no confundir con las dobles de afuera
    html +=
      '<div class="card habitacion-card">' +
        '<div class="habitacion-imagen-contenedor">' +
          '<img src="' + h.imagen + '" alt="' + h.nombre + '" loading="lazy">' +
        '</div>' +
        '<div class="habitacion-info">' +
          '<h3>' + h.nombre + '</h3>' +
          '<p class="habitacion-descripcion">' + h.descripcion + '</p>' +
          '<div class="habitacion-detalles">' +
            '<span>🛏️ ' + h.camas + ' cama(s)</span>' +
            '<span>👥 Máx. ' + h.maxPersonas + ' personas</span>' +
          '</div>' +
          '<div class="habitacion-servicios">' + serviciosHtml + '</div>' +
          '<div class="habitacion-precio">' +
            '<span class="precio-valor">' + formatearPrecio(h.precioPorNoche) + '</span>' +
            '<span class="precio-texto"> / noche</span>' +
          '</div>' +
          '<p style="color:var(--dorado); font-weight:bold; margin-bottom:0.8rem">' +
            'Total ' + noches + ' noche(s): ' + formatearPrecio(total) +
          '</p>' +
          '<button class="btn btn-primario" style="width:100%" ' +
            'onclick="verDetalleHabitacion(' + h.id + ')">' +
            'Ver Detalle y Reservar' +
          '</button>' +
        '</div>' +
      '</div>';
  }

  html += '</div>';
  contenedor.innerHTML = html;
}


// ============================================================
// MODAL DE DETALLE DE HABITACIÓN
// ============================================================

// Abrir el modal con los detalles de la habitación seleccionada
function verDetalleHabitacion(habitacionId) {
  // Guardar la habitación seleccionada en la variable global
  habitacionSeleccionada = obtenerHabitacionPorId(habitacionId);

  if (habitacionSeleccionada === null) {
    return; // Si no la encontramos, no hacer nada
  }

  var h      = habitacionSeleccionada;
  var noches = calcularNoches(checkInActual, checkOutActual);
  var total  = h.precioPorNoche * noches;

  // Crear el HTML de los servicios
  var serviciosHtml = '';
  for (var i = 0; i < h.servicios.length; i++) {
    serviciosHtml += '<span class="servicio-tag">' + h.servicios[i] + '</span>';
  }

  // Llenar el modal con la información de la habitación
  document.getElementById('modal-detalle-titulo').textContent = h.nombre;
  document.getElementById('modal-detalle-cuerpo').innerHTML =
    '<img src="' + h.imagen + '" alt="' + h.nombre + '" ' +
         'style="width:100%; border-radius:8px; margin-bottom:1rem; max-height:240px; object-fit:cover">' +
    '<p style="color:var(--gris); margin-bottom:1rem">' + h.descripcion + '</p>' +

    '<div class="detalle-grid">' +
      '<div class="detalle-item">🛏️ ' + h.camas + ' cama(s)</div>' +
      '<div class="detalle-item">👥 Máx. ' + h.maxPersonas + ' personas</div>' +
      '<div class="detalle-item">📅 Entrada: ' + formatearFecha(checkInActual) + '</div>' +
      '<div class="detalle-item">📅 Salida: '  + formatearFecha(checkOutActual) + '</div>' +
      '<div class="detalle-item">🌙 Noches: '  + noches + '</div>' +
      '<div class="detalle-item">👤 Personas: ' + personasActual + '</div>' +
    '</div>' +

    '<div class="habitacion-servicios" style="margin:1rem 0">' + serviciosHtml + '</div>' +

    '<div class="precio-resumen">' +
      '<div class="precio-linea">' +
        '<span>' + formatearPrecio(h.precioPorNoche) + ' × ' + noches + ' noche(s)</span>' +
        '<span>' + formatearPrecio(total) + '</span>' +
      '</div>' +
      '<div class="precio-total">' +
        '<span>Total a pagar</span>' +
        '<span>' + formatearPrecio(total) + '</span>' +
      '</div>' +
    '</div>' +

    '<div id="msg-reserva" style="margin-top:1rem"></div>';

  // Restaurar el botón de reservar (por si estaba desactivado de una reserva anterior)
  var btnReservar = document.getElementById('btn-confirmar-reserva');
  btnReservar.disabled    = false;
  btnReservar.textContent = 'Confirmar Reserva';

  // Abrir el modal
  controlarModal('modal-detalle', 'abrir');
}


// ============================================================
// CONFIRMAR RESERVA
// ============================================================

function confirmarReserva() {
  // Si no hay sesión, pedirle al usuario que inicie sesión
  if (!hayUsuarioActivo()) {
    controlarModal('modal-detalle', 'cerrar');
    abrirLogin();
    return;
  }

  var usuario = obtenerUsuarioActual();
  var h       = habitacionSeleccionada;
  var noches  = calcularNoches(checkInActual, checkOutActual);
  var total   = h.precioPorNoche * noches;

  // Verificar disponibilidad una vez más antes de guardar
  // (puede que alguien más haya reservado mientras el usuario decidía)
  if (!estaDisponible(h.id, checkInActual, checkOutActual)) {
    document.getElementById('msg-reserva').innerHTML =
      '<div class="alerta alerta-error">' +
        '❌ Esta habitación ya no está disponible. Por favor busca de nuevo.' +
      '</div>';
    buscarHabitaciones(); // Actualizar los resultados
    return;
  }

  // Crear el objeto de la nueva reserva
  var nuevaReserva = {
    habitacionId:     h.id,
    nombreHabitacion: h.nombre,
    usuarioId:        usuario.id,
    nombreUsuario:    usuario.nombre,
    checkIn:          checkInActual,
    checkOut:         checkOutActual,
    personas:         personasActual,
    precioPorNoche:   h.precioPorNoche,
    noches:           noches,
    total:            total
    // estado y fechaCreacion se asignan dentro de guardarReserva()
  };

  // Guardar la reserva en el localStorage
  var reservaGuardada = guardarReserva(nuevaReserva);

  // Mostrar mensaje de éxito
  document.getElementById('msg-reserva').innerHTML =
    '<div class="alerta alerta-exito">' +
      '✅ <strong>¡Reserva confirmada!</strong><br>' +
      'Tu código de reserva es: <strong>' + reservaGuardada.id + '</strong>' +
    '</div>';

  // Desactivar el botón para que no haga clic dos veces
  var btn = document.getElementById('btn-confirmar-reserva');
  btn.disabled    = true;
  btn.textContent = '✅ Reserva Confirmada';

  // Después de 3 segundos, cerrar el modal y actualizar la lista de reservas
  setTimeout(function() {
    controlarModal('modal-detalle', 'cerrar');
    cargarMisReservas();
    buscarHabitaciones(); // Actualizar resultados (la habitación ya no estará)
  }, 3000);
}


// ============================================================
// MIS RESERVAS
// Mostrar las reservas del usuario que tiene sesión activa
// ============================================================

function cargarMisReservas() {
  var seccion = document.getElementById('mis-reservas');
  if (seccion === null) {
    return; // Si no existe el elemento, salir
  }

  // Si no hay sesión, ocultar la sección
  if (!hayUsuarioActivo()) {
    seccion.style.display = 'none';
    return;
  }

  // Mostrar la sección
  seccion.style.display = 'block';

  var usuario = obtenerUsuarioActual();
  var reservas = obtenerReservasDeUsuario(usuario.id);
  var lista   = document.getElementById('lista-mis-reservas');

  // Si no tiene reservas
  if (reservas.length === 0) {
    lista.innerHTML = '<p style="color:var(--gris)">Todavía no tienes reservas.</p>';
    return;
  }

  var html = '';

  // Mostrar primero las activas, luego las canceladas
  for (var i = 0; i < reservas.length; i++) {
    var r = reservas[i];

    // Botón de cancelar (solo para reservas activas)
    var botonCancelar = '';
    if (r.estado === 'activa') {
      botonCancelar = '<button class="btn btn-peligro btn-sm" ' +
                      'onclick="cancelarMiReserva(\'' + r.id + '\')">Cancelar Reserva</button>';
    } else {
      botonCancelar = '<span class="badge badge-cancelado">CANCELADA</span>';
    }

    html +=
      '<div class="reserva-item ' + r.estado + '">' +
        '<div class="reserva-info">' +
          '<h4>' + r.nombreHabitacion + '</h4>' +
          '<p>📅 ' + formatearFecha(r.checkIn) + ' → ' + formatearFecha(r.checkOut) + '</p>' +
          '<p>👥 ' + r.personas + ' persona(s) &nbsp;|&nbsp; 🌙 ' + r.noches + ' noche(s)</p>' +
          '<p>💰 Total: <strong>' + formatearPrecio(r.total) + '</strong></p>' +
          '<p style="font-size:0.78rem; color:var(--gris)">Código: ' + r.id + '</p>' +
        '</div>' +
        '<div>' + botonCancelar + '</div>' +
      '</div>';
  }

  lista.innerHTML = html;
}

// Cancelar una reserva del usuario
function cancelarMiReserva(reservaId) {
  // confirm() muestra una ventana de confirmación y devuelve true o false
  var confirmado = confirm('¿Seguro que deseas cancelar esta reserva?');
  if (!confirmado) {
    return; // El usuario dijo que no, salir sin hacer nada
  }

  cancelarReserva(reservaId);
  cargarMisReservas(); // Actualizar la lista

  // Si hay una búsqueda activa, actualizarla también
  if (checkInActual !== '' && checkOutActual !== '') {
    buscarHabitaciones();
  }
}


// ============================================================
// FUNCIÓN AUXILIAR: Mostrar un mensaje de alerta
// ============================================================

function mostrarAlerta(idElemento, texto, tipo) {
  var elemento = document.getElementById(idElemento);
  if (elemento === null) {
    return;
  }
  elemento.innerHTML = '<div class="alerta alerta-' + tipo + '">' + texto + '</div>';
}
