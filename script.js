/* ===================================================================
   SHIVANI TRADERS — Interactive JavaScript
   Features: Preloader, Navigation, Scroll Animations, Counters,
             Testimonial Slider, Lightbox, Particles, Form Handling
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  initPreloader();
  initNavigation();
  initScrollReveal();
  initCounters();
  initTestimonialsSlider();
  initParticles();
  initScrollTop();
  initSmoothScroll();
  initActiveNavHighlight();
});

/* ===================================================================
   PRELOADER
   =================================================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      // Enable scrolling after preloader hides
      document.body.style.overflow = '';
    }, 1800);
  });

  // Prevent scrolling during preload
  document.body.style.overflow = 'hidden';

  // Fallback: hide preloader after 4 seconds regardless
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 4000);
}

/* ===================================================================
   NAVIGATION
   =================================================================== */
function initNavigation() {
  const headerWrapper = document.getElementById('headerWrapper');
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const dropdownTrigger = document.querySelector('.nav-dropdown-trigger');
  const dropdownWrapper = document.querySelector('.nav-dropdown-wrapper');

  // Scroll behavior
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 40) {
      if (headerWrapper) headerWrapper.classList.add('scrolled');
      if (navbar) {
        navbar.classList.add('scrolled');
        navbar.classList.remove('transparent');
      }
    } else {
      if (headerWrapper) headerWrapper.classList.remove('scrolled');
      if (navbar) {
        navbar.classList.remove('scrolled');
        navbar.classList.add('transparent');
      }
    }
  });

  // Mobile toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks?.classList.toggle('open');
      mobileOverlay?.classList.toggle('active');
      document.body.style.overflow = navLinks?.classList.contains('open') ? 'hidden' : '';
    });
  }

  // Mobile dropdown toggle
  if (dropdownTrigger && dropdownWrapper) {
    dropdownTrigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 1080) {
        e.preventDefault();
        dropdownWrapper.classList.toggle('dropdown-open');
      }
    });
  }

  // Close mobile nav on overlay click
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileNav);
  }

  // Close mobile nav on link click
  const navLinkItems = document.querySelectorAll('[data-nav]');
  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      if (link.classList.contains('nav-dropdown-trigger') && window.innerWidth <= 1080) {
        return; // Handled by mobile dropdown toggle
      }
      closeMobileNav();
    });
  });

  function closeMobileNav() {
    navToggle?.classList.remove('active');
    navLinks?.classList.remove('open');
    mobileOverlay?.classList.remove('active');
    dropdownWrapper?.classList.remove('dropdown-open');
    document.body.style.overflow = '';
  }
}

/* ===================================================================
   SCROLL REVEAL ANIMATIONS
   =================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => observer.observe(el));
}

/* ===================================================================
   ANIMATED COUNTERS
   =================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'));
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(easeOut * target);
    
    el.textContent = current.toLocaleString() + (target >= 100 ? '+' : '+');
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString() + '+';
    }
  }

  requestAnimationFrame(update);
}

/* ===================================================================
   TESTIMONIALS SLIDER
   =================================================================== */
function initTestimonialsSlider() {
  const track = document.getElementById('testimonialsTrack');
  const dots = document.querySelectorAll('.testimonial-dot');
  if (!track || dots.length === 0) return;

  let currentSlide = 0;
  const totalSlides = dots.length;
  let autoPlayTimer;

  function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  // Dot navigation
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-index'));
      goToSlide(index);
      resetAutoPlay();
    });
  });

  // Auto-play
  function startAutoPlay() {
    autoPlayTimer = setInterval(() => {
      const nextSlide = (currentSlide + 1) % totalSlides;
      goToSlide(nextSlide);
    }, 5000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const threshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
      } else if (diff < 0 && currentSlide > 0) {
        goToSlide(currentSlide - 1);
      }
      resetAutoPlay();
    }
  }

  startAutoPlay();
}

/* ===================================================================
   HERO PARTICLES
   =================================================================== */
function initParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const particleCount = 25;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
    particle.style.animationDelay = `${Math.random() * 10}s`;
    particle.style.opacity = Math.random() * 0.4 + 0.1;
    
    container.appendChild(particle);
  }
}

/* ===================================================================
   LIGHTBOX
   =================================================================== */
function openLightbox(element) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const img = element.querySelector('img');

  if (lightbox && lightboxImg && img) {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

/* ===================================================================
   SCROLL TO TOP
   =================================================================== */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scrollTop');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===================================================================
   SMOOTH SCROLL
   =================================================================== */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        const headerWrap = document.getElementById('headerWrapper');
        const navHeight = headerWrap ? headerWrap.offsetHeight : (document.getElementById('navbar')?.offsetHeight || 80);
        const targetPosition = target.offsetTop - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ===================================================================
   ACTIVE NAV HIGHLIGHT
   =================================================================== */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('[data-nav]');

  const observerOptions = {
    root: null,
    threshold: 0.3,
    rootMargin: '-80px 0px -50% 0px'
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute('id');
        navItems.forEach(item => {
          item.classList.toggle('active', item.getAttribute('href') === `#${sectionId}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));
}

/* ===================================================================
   CONTACT FORM HANDLING
   =================================================================== */
function handleFormSubmit(event) {
  event.preventDefault();

  const submitBtn = document.getElementById('submitBtn');
  const originalText = submitBtn.textContent;

  // Visual feedback
  submitBtn.textContent = 'Sending...';
  submitBtn.style.opacity = '0.7';
  submitBtn.disabled = true;

  // Simulate form submission (replace with actual API call)
  setTimeout(() => {
    submitBtn.textContent = '✓ Message Sent!';
    submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    submitBtn.style.opacity = '1';

    // Reset form
    document.getElementById('contactForm').reset();

    // Reset button after 3 seconds
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.style.background = '';
      submitBtn.disabled = false;
    }, 3000);
  }, 1500);
}

/* ===================================================================
   PARALLAX EFFECT (subtle, on hero)
   =================================================================== */
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-bg img');
  if (hero) {
    const scrolled = window.scrollY;
    hero.style.transform = `translateY(${scrolled * 0.3}px) scale(1.1)`;
  }
});

/* ===================================================================
   TILT EFFECT on Brand Cards (desktop only)
   =================================================================== */
if (window.matchMedia('(min-width: 768px)').matches) {
  document.querySelectorAll('.brand-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ===================================================================
   INQUIRY HELPER
   =================================================================== */
function selectInquiry(type) {
  const select = document.getElementById('inquiry');
  if (select) {
    select.value = type;
  }
  const messageInput = document.getElementById('message');
  if (messageInput && type === 'broadband') {
    messageInput.placeholder = 'Please mention your locality in Azamgarh and required speed (e.g. 60 Mbps, 150 Mbps, or Leased Line)...';
  }
}
