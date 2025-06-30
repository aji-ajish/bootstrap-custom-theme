document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.accordion').forEach((accordion) => {
    const alwaysOpen = accordion.dataset.alwaysOpen === 'true';
    
    accordion.querySelectorAll('.accordion-collapse').forEach((collapse) => {
      if (alwaysOpen) {
        collapse.removeAttribute('data-bs-parent');
      } else {
        collapse.setAttribute('data-bs-parent', `#${accordion.id}`);
      }
    });
    // Initialize Bootstrap Collapse for each accordion item
    // accordion.querySelectorAll('[data-bs-toggle="collapse"]').forEach((button) => {
    //   button.addEventListener('click', () => {
    //     const target = button.dataset.bsTarget;
    //     const collapseElement = document.querySelector(target);
        
    //     if (collapseElement) {
    //       new bootstrap.Collapse(collapseElement, {
    //         toggle: true,
    //         parent: alwaysOpen ? null : accordion
    //       });
    //     }
    //   });
    // });
  });
});