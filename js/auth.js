// ============================================================
// AUTH.JS — Autenticación de usuarios
// Maneja el login, logout y registro de nuevos usuarios.
// También crea los modales (ventanas emergentes) de login
// y registro que se usan en todas las páginas.
// ============================================================


// ============================================================
// FUNCIONES DE SESIÓN
// ============================================================

// Obtener el usuario que está usando el sitio en este momento
// Devuelve el objeto usuario, o null si nadie ha iniciado sesión
function obtenerUsuarioActual() {
  var datos = localStorage.getItem(GUARDADO.sesion);
  if (datos === null) {
    return null; // No hay sesión activa
  }
  return JSON.parse(datos);
}

// Verificar si hay alguien que haya iniciado sesión
function hayUsuarioActivo() {
  return obtenerUsuarioActual() !== null;
}

// Verificar si el usuario actual es administrador
function esAdministrador() {
  var usuario = obtenerUsuarioActual();
  if (usuario === null) {
    return false;
  }
  return usuario.esAdmin === true;
}

// Iniciar sesión: buscar el usuario con ese email y contraseña
function iniciarSesion(email, contrasena) {
  var todos   = obtenerUsuarios();
  var usuario = null;

  // Buscar en la lista el que tenga ese email y contraseña
  for (var i = 0; i < todos.length; i++) {
    if (todos[i].email === email && todos[i].contrasena === contrasena) {
      usuario = todos[i];
      break;
    }
  }

  // Si no lo encontramos, devolver error
  if (usuario === null) {
    return { exito: false, mensaje: 'El email o la contraseña son incorrectos.' };
  }

  // Guardar el usuario en sesión (sin la contraseña, por seguridad)
  var usuarioSesion = {
    id:           usuario.id,
    nombre:       usuario.nombre,
    nacionalidad: usuario.nacionalidad,
    email:        usuario.email,
    telefono:     usuario.telefono,
    esAdmin:      usuario.esAdmin
  };
  localStorage.setItem(GUARDADO.sesion, JSON.stringify(usuarioSesion));

  return { exito: true, usuario: usuarioSesion };
}

// Cerrar sesión: borrar los datos de sesión y volver al inicio
function cerrarSesion() {
  localStorage.removeItem(GUARDADO.sesion);
  window.location.href = 'index.html'; // Redirigir al inicio
}

// Registrar un nuevo usuario
function registrarUsuario(datos) {
  // Verificar que todos los campos tienen texto
  if (!datos.id || !datos.nombre || !datos.nacionalidad ||
      !datos.email || !datos.telefono || !datos.contrasena) {
    return { exito: false, mensaje: 'Por favor completa todos los campos.' };
  }

  // La contraseña debe tener al menos 6 caracteres
  if (datos.contrasena.length < 6) {
    return { exito: false, mensaje: 'La contraseña debe tener mínimo 6 caracteres.' };
  }

  // Verificar que el número de identificación no esté ya registrado
  if (buscarUsuarioPorId(datos.id) !== null) {
    return { exito: false, mensaje: 'Ya hay una cuenta con ese número de identificación.' };
  }

  // Verificar que el email no esté ya registrado
  if (buscarUsuarioPorEmail(datos.email) !== null) {
    return { exito: false, mensaje: 'Ya hay una cuenta con ese email.' };
  }

  // Crear el objeto del nuevo usuario
  var nuevoUsuario = {
    id:           datos.id,
    nombre:       datos.nombre,
    nacionalidad: datos.nacionalidad,
    email:        datos.email,
    telefono:     datos.telefono,
    contrasena:   datos.contrasena,
    esAdmin:      false // Los usuarios que se registran son clientes, no admins
  };

  guardarUsuario(nuevoUsuario);

  // Iniciar sesión automáticamente después de registrarse
  var usuarioSesion = {
    id:           nuevoUsuario.id,
    nombre:       nuevoUsuario.nombre,
    nacionalidad: nuevoUsuario.nacionalidad,
    email:        nuevoUsuario.email,
    telefono:     nuevoUsuario.telefono,
    esAdmin:      false
  };
  localStorage.setItem(GUARDADO.sesion, JSON.stringify(usuarioSesion));

  return { exito: true, usuario: usuarioSesion };
}


// ============================================================
// ACTUALIZAR LA BARRA DE NAVEGACIÓN
// Cambia los botones según si hay sesión iniciada o no.
// Se llama en cada página después de cargar el navbar.
// ============================================================

function actualizarNavbar() {
  var zonaAuth = document.getElementById('zona-auth');
  if (zonaAuth === null) {
    return; // Si no existe el elemento, salir
  }

  var usuario = obtenerUsuarioActual();

  if (usuario !== null) {
    // Hay sesión: mostrar nombre del usuario y botón de salir
    var nombreCorto = usuario.nombre.split(' ')[0]; // Solo el primer nombre
    var htmlAdmin   = '';

    // Si es admin, mostrar también el enlace al panel
    if (usuario.esAdmin) {
      htmlAdmin = '<a href="admin.html" class="btn btn-secundario btn-sm">Panel Admin</a>';
    }

    zonaAuth.innerHTML =
      '<span class="navbar-saludo">Hola, ' + nombreCorto + ' 👋</span>' +
      htmlAdmin +
      '<button class="btn btn-primario btn-sm" onclick="cerrarSesion()">Salir</button>';

  } else {
    // No hay sesión: mostrar botones de login y registro
    zonaAuth.innerHTML =
      '<button class="btn btn-secundario btn-sm" onclick="abrirLogin()">Iniciar Sesión</button>' +
      '<button class="btn btn-primario btn-sm" onclick="abrirRegistro()">Registrarse</button>';
  }
}


// ============================================================
// MODALES DE LOGIN Y REGISTRO
// Estas funciones abren, cierran y manejan las ventanas
// emergentes de inicio de sesión y registro.
// ============================================================

function abrirLogin() {
  // Cerrar el modal de registro por si estaba abierto
  controlarModal('modal-registro', 'cerrar');
  controlarModal('modal-login', 'abrir');
  // Limpiar mensajes de intentos anteriores
  document.getElementById('msg-login').innerHTML = '';
}

function abrirRegistro() {
  controlarModal('modal-login', 'cerrar');
  controlarModal('modal-registro', 'abrir');
  document.getElementById('msg-registro').innerHTML = '';
}

function cerrarLogin() {
  controlarModal('modal-login', 'cerrar');
  document.getElementById('form-login').reset(); // Limpiar el formulario
}

function cerrarRegistro() {
  controlarModal('modal-registro', 'cerrar');
  document.getElementById('form-registro').reset();
}

// Manejar el envío del formulario de login
function manejarLogin(evento) {
  // preventDefault evita que la página se recargue al enviar el formulario
  evento.preventDefault();

  var email     = document.getElementById('login-email').value.trim();
  var contrasena = document.getElementById('login-contrasena').value;

  var resultado = iniciarSesion(email, contrasena);

  if (resultado.exito) {
    document.getElementById('msg-login').innerHTML =
      '<div class="alerta alerta-exito">✅ ¡Sesión iniciada! Actualizando...</div>';
    // Esperar 1 segundo y recargar la página para mostrar los cambios
    setTimeout(function() {
      window.location.reload();
    }, 1200);
  } else {
    document.getElementById('msg-login').innerHTML =
      '<div class="alerta alerta-error">❌ ' + resultado.mensaje + '</div>';
  }
}

// Manejar el envío del formulario de registro
function manejarRegistro(evento) {
  evento.preventDefault();

  // Recoger los datos del formulario
  var datos = {
    id:           document.getElementById('reg-id').value.trim(),
    nombre:       document.getElementById('reg-nombre').value.trim(),
    nacionalidad: document.getElementById('reg-nacionalidad').value.trim(),
    email:        document.getElementById('reg-email').value.trim(),
    telefono:     document.getElementById('reg-telefono').value.trim(),
    contrasena:   document.getElementById('reg-contrasena').value
  };

  var resultado = registrarUsuario(datos);

  if (resultado.exito) {
    document.getElementById('msg-registro').innerHTML =
      '<div class="alerta alerta-exito">✅ ¡Cuenta creada! Actualizando...</div>';
    setTimeout(function() {
      window.location.reload();
    }, 1200);
  } else {
    document.getElementById('msg-registro').innerHTML =
      '<div class="alerta alerta-error">❌ ' + resultado.mensaje + '</div>';
  }
}

// Agregar los eventos a los formularios de auth cuando la página cargue
// Esto se llama desde el HTML de cada página
function inicializarAuth() {
  inicializarDatos();
  actualizarNavbar();

  // Si existen los formularios en esta página, agregarles eventos
  var formLogin = document.getElementById('form-login');
  if (formLogin !== null) {
    formLogin.addEventListener('submit', manejarLogin);
  }

  var formRegistro = document.getElementById('form-registro');
  if (formRegistro !== null) {
    formRegistro.addEventListener('submit', manejarRegistro);
  }

  // Cerrar modal al hacer clic en el fondo oscuro
  var fondos = document.querySelectorAll('.modal-fondo');
  for (var i = 0; i < fondos.length; i++) {
    // Usamos una función inmediata para capturar el valor de 'fondo' en cada iteración
    (function(fondo) {
      fondo.addEventListener('click', function(e) {
        // e.target es el elemento en el que se hizo clic
        // Si se hizo clic en el fondo (no en el modal), cerrarlo
        if (e.target === fondo) {
          fondo.style.display = 'none';
        }
      });
    })(fondos[i]);
  }
}
