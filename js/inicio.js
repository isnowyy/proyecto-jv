// ============================================================
// INICIO.JS — Lógica exclusiva de la página de inicio
// Solo maneja el carrusel de imágenes.
// ============================================================


// Variable global: guarda cuál slide se está mostrando ahora
var slideActual = 0;

// Variable global: guarda el intervalo del avance automático
// (necesitamos guardarla para poder reiniciarla cuando el usuario
// hace clic en los botones)
var intervaloCarrusel = null;


// Iniciar el carrusel cuando la página termina de cargar
document.addEventListener('DOMContentLoaded', function() {
  iniciarCarrusel();
});


// Configurar el carrusel y empezar el avance automático
function iniciarCarrusel() {
  // Mostrar el primer slide
  mostrarSlide(0);

  // Avanzar automáticamente cada 5000 milisegundos (5 segundos)
  intervaloCarrusel = setInterval(function() {
    siguienteSlide();
  }, 5000);
}


// Mostrar un slide específico según su número
function mostrarSlide(numero) {
  // Obtener todos los slides de la página
  var slides = document.querySelectorAll('.slide');
  var puntos  = document.querySelectorAll('.punto-slide');

  // Ocultar todos los slides y desactivar todos los puntos
  for (var i = 0; i < slides.length; i++) {
    slides[i].classList.remove('activo');
    puntos[i].classList.remove('activo');
  }

  // Mostrar solo el slide pedido y activar su punto
  slides[numero].classList.add('activo');
  puntos[numero].classList.add('activo');

  // Actualizar la variable global
  slideActual = numero;
}


// Ir al siguiente slide (se llama automáticamente y con el botón ❯)
function siguienteSlide() {
  var slides     = document.querySelectorAll('.slide');
  var totalSlides = slides.length;

  // Calcular el próximo número
  var proximo = slideActual + 1;

  // Si llegamos al final, volver al primero
  if (proximo >= totalSlides) {
    proximo = 0;
  }

  mostrarSlide(proximo);
}


// Ir al slide anterior (se llama con el botón ❮)
function anteriorSlide() {
  var slides     = document.querySelectorAll('.slide');
  var totalSlides = slides.length;

  var anterior = slideActual - 1;

  // Si estamos en el primero, ir al último
  if (anterior < 0) {
    anterior = totalSlides - 1;
  }

  mostrarSlide(anterior);
  reiniciarIntervalo();
}


// Ir a un slide específico al hacer clic en los puntos
function irASlide(numero) {
  mostrarSlide(numero);
  reiniciarIntervalo();
}


// Reiniciar el intervalo para que no salte dos veces
// cuando el usuario hace clic en los botones
function reiniciarIntervalo() {
  // Borrar el intervalo actual
  clearInterval(intervaloCarrusel);

  // Crear uno nuevo
  intervaloCarrusel = setInterval(function() {
    siguienteSlide();
  }, 5000);
}
