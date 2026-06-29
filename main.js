// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = mobileMenuToggle?.querySelector('.material-symbols-outlined');

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      if (menuIcon) {
        menuIcon.textContent = mobileMenu.classList.contains('hidden') ? 'menu' : 'close';
      }
    });

    mobileMenu.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        if (menuIcon) menuIcon.textContent = 'menu';
      });
    });
  }

  // Active navigation link based on current page
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === 'index.html' && href === '/')) {
      link.classList.add('text-secondary', 'font-semibold');
      link.classList.remove('text-on-surface/80', 'font-medium');
      link.setAttribute('aria-current', 'page');
    }
  });

  // Testimonial carousel (present only on pages that include it)
  const testimonialEl = document.getElementById('testimonial-text');
  if (testimonialEl) {
    const testimonials = [
      {
        quote: "The standard for hospitality in Niger State. Impeccable service.",
        author: "Guest Experience"
      },
      {
        quote: "A true home away from home. The staff anticipate your every need.",
        author: "Loyal Patron"
      },
      {
        quote: "From the restaurant to the conference facilities, everything is world‑class.",
        author: "Business Traveller"
      }
    ];
    let index = 0;

    function rotate() {
      index = (index + 1) % testimonials.length;
      const { quote, author } = testimonials[index];
      testimonialEl.style.opacity = '0';
      setTimeout(() => {
        testimonialEl.innerHTML = `
          <p class="font-headline-md text-headline-md text-primary italic mb-4">"${quote}"</p>
          <p class="text-sm text-on-surface-variant uppercase tracking-widest">${author}</p>
        `;
        testimonialEl.style.opacity = '1';
      }, 300);
    }

    setInterval(rotate, 5000);
  }
});