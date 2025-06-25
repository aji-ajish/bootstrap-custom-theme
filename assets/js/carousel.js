document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('.carousel');
  
  carousels.forEach((carousel) => {
    // Initialize each carousel with Bootstrap
    const bsCarousel = new bootstrap.Carousel(carousel, {
      interval: carousel.dataset.bsInterval || 5000,
      ride: carousel.dataset.bsRide || false,
      pause: carousel.dataset.bsPause || 'hover',
      wrap: true
    });

    // Handle autoplay if enabled
    if (carousel.dataset.bsRide === 'carousel') {
      bsCarousel.cycle();
    }
  });
});