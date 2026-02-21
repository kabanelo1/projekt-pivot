// Scroll-triggered animation system
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Add animation class
      entry.target.style.animation = 'none';
      // Trigger reflow
      void entry.target.offsetWidth;
      // Restart animation
      entry.target.style.animation = null;
      
      // Stop observing after animation triggers
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Mouse glow effect
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // Update body glow position
  const body = document.body;
  body.style.setProperty('--x', `${(mouseX / window.innerWidth) * 100}%`);
  body.style.setProperty('--y', `${(mouseY / window.innerHeight) * 100}%`);
});

// Observe all animated elements
document.addEventListener('DOMContentLoaded', () => {
  // Observe cards
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    observer.observe(card);
  });

  // Observe sections
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    observer.observe(section);
  });

  // Observe stats
  const stats = document.querySelectorAll('.stat');
  stats.forEach((stat, index) => {
    stat.style.animationDelay = `${index * 0.1}s`;
    observer.observe(stat);
  });

  // Add counter animation for stats
  const statCounters = document.querySelectorAll('.stat[data-target]');
  
  function animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const startTime = Date.now();

    function update() {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + (target - start) * progress);
      
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        const stat = entry.target;
        const target = parseInt(stat.dataset.target);
        const counterElement = stat.querySelector('.stat-counter');
        
        if (counterElement) {
          stat.dataset.animated = 'true';
          animateCounter(counterElement, target);
          counterObserver.unobserve(stat);
        }
      }
    });
  }, { threshold: 0.3 });

  statCounters.forEach(stat => {
    counterObserver.observe(stat);
  });

  // Add parallax effect on scroll
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  if (parallaxElements.length > 0) {
    window.addEventListener('scroll', () => {
      parallaxElements.forEach(element => {
        const speed = element.dataset.parallax || 0.5;
        const scrolled = window.pageYOffset;
        element.style.transform = `translateY(${scrolled * speed}px)`;
      });
    });
  }

  // Enhanced button ripple effect
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      // Remove existing ripples
      const existing = this.querySelector('.ripple');
      if (existing) existing.remove();
      
      this.appendChild(ripple);
    });

    // Add hover glow effect
    button.addEventListener('mouseenter', function() {
      this.style.filter = 'brightness(1.1)';
    });

    button.addEventListener('mouseleave', function() {
      this.style.filter = 'brightness(1)';
    });
  });

  // Stagger animations for elements in cards
  const cardElements = document.querySelectorAll('.card h2, .card h3, .card p');
  cardElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.animation = `fadeInUp 0.6s ease-out forwards`;
    el.style.animationDelay = `${(index % 3) * 0.1}s`;
  });

  // Add floating animation on stats
  const statElements = document.querySelectorAll('.stat');
  statElements.forEach((stat, index) => {
    stat.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite`;
  });
});

// Add scroll reveal feature for elements with reveal class
const revealElements = document.querySelectorAll('[data-reveal]');
if (revealElements.length > 0) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));
}

// Smooth animation on page load
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});
