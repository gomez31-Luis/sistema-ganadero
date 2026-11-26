/**
 * ARCHIVO: menu.js
 * PROPÓSITO: Maneja la lógica de la interfaz del menú principal ('menu.html').
 * Controla el desplazamiento horizontal del carrusel de tarjetas y aplica un efecto
 * dinámico de enfoque a la tarjeta central usando IntersectionObserver.
 */
function scrollMenu(direction) {
  const carousel = document.getElementById('menuCarousel');
  const scrollAmount = 360; // Ajustado al nuevo ancho + gap
  carousel.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
}

// Lógica profesional para enfocar la tarjeta central
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('menuCarousel');
  const cards = document.querySelectorAll('.menu-card');
  
  if (carousel && cards.length > 0) {
    const observerOptions = {
      root: carousel,
      threshold: 0.7 // La tarjeta debe estar al menos al 70% visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('focused');
        } else {
          entry.target.classList.remove('focused');
        }
      });
    }, observerOptions);

    cards.forEach(card => observer.observe(card));
  }
});
