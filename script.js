/* ═══════════════════════════════════════════════════════════════════
   PORTFOLIO — SCRIPT.JS
   Interactive features: typewriter, counters, tilt, scroll bar,
   back-to-top, cursor spotlight, nav highlight, mobile menu
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── 1. AUTO COPYRIGHT YEAR ──────────────────────────────────── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ─── 2. SCROLL PROGRESS BAR ──────────────────────────────────── */
  var progressBar = document.getElementById('scroll-progress');

  function updateProgress() {
    var scrollTop  = window.scrollY;
    var docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    var pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }

  /* ─── 3. NAVBAR SHADOW ON SCROLL ─────────────────────────────── */
  var navbar    = document.getElementById('navbar');
  var backToTop = document.getElementById('back-to-top');

  function handleScroll() {
    var y = window.scrollY;

    // Navbar shadow
    if (navbar) navbar.classList.toggle('scrolled', y > 50);

    // Back to top visibility
    if (backToTop) backToTop.classList.toggle('visible', y > 400);

    // Progress bar
    updateProgress();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ─── 4. BACK TO TOP ──────────────────────────────────────────── */
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── 5. CURSOR SPOTLIGHT ─────────────────────────────────────── */
  var spotlight = document.getElementById('cursor-spotlight');
  var spotlightVisible = false;

  document.addEventListener('mousemove', function (e) {
    if (!spotlight) return;
    spotlight.style.left = e.clientX + 'px';
    spotlight.style.top  = e.clientY + 'px';
    if (!spotlightVisible) {
      spotlight.style.opacity = '1';
      spotlightVisible = true;
    }
  });

  document.addEventListener('mouseleave', function () {
    if (spotlight) spotlight.style.opacity = '0';
    spotlightVisible = false;
  });

  /* ─── 6. TYPEWRITER EFFECT ────────────────────────────────────── */
  var typewriterEl = document.getElementById('typewriter');
  var roles = [
    'Duck Creek Developer',
    'Insurance Platform Engineer',
    'Angular & React Developer',
    '.NET API Developer',
    'Agentic AI Enthusiast',
    'Software Engineer @ CHUBB'
  ];
  var roleIndex    = 0;
  var charIndex    = 0;
  var isDeleting   = false;
  var typeDelay    = 100;

  function type() {
    if (!typewriterEl) return;
    var currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typeDelay = 50;
    } else {
      typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typeDelay = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at end before deleting
      isDeleting = true;
      typeDelay  = 1800;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex  = (roleIndex + 1) % roles.length;
      typeDelay  = 400;
    }

    setTimeout(type, typeDelay);
  }

  // Start typewriter after initial page animation
  setTimeout(type, 1200);

  /* ─── 7. ANIMATED STAT COUNTERS ───────────────────────────────── */
  var statNumbers = document.querySelectorAll('.stat-number');

  function animateCounter(el) {
    var target   = parseInt(el.getAttribute('data-target'), 10);
    var duration = 1500;
    var start    = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      // Ease out cubic
      var eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(function (el) {
      counterObserver.observe(el);
    });
  } else {
    statNumbers.forEach(function (el) {
      el.textContent = el.getAttribute('data-target');
    });
  }

  /* ─── 8. SCROLL ANIMATIONS (IntersectionObserver) ────────────── */
  var fadeEls = document.querySelectorAll('.fade-in-up');

  if ('IntersectionObserver' in window) {
    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(function (el) { fadeObserver.observe(el); });
  } else {
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ─── 9. ACTIVE NAV HIGHLIGHT ─────────────────────────────────── */
  var sections   = document.querySelectorAll('section[id]');
  var navLinkMap = {};

  document.querySelectorAll('.nav-link').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.startsWith('#')) navLinkMap[href.slice(1)] = link;
  });

  function setActiveLink(id) {
    Object.values(navLinkMap).forEach(function (l) { l.classList.remove('active'); });
    if (navLinkMap[id]) navLinkMap[id].classList.add('active');
  }

  if ('IntersectionObserver' in window && sections.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActiveLink(entry.target.id);
      });
    }, { rootMargin: '-64px 0px -60% 0px', threshold: 0 });

    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ─── 10. MOBILE HAMBURGER MENU ───────────────────────────────── */
  var hamburger  = document.getElementById('hamburger');
  var navLinks   = document.getElementById('nav-links');
  var navLinkEls = navLinks ? navLinks.querySelectorAll('a') : [];

  function openMenu() {
    navLinks.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', function () {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });

  navLinkEls.forEach(function (link) { link.addEventListener('click', closeMenu); });

  document.addEventListener('click', function (e) {
    if (
      navLinks && navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) && e.target !== hamburger &&
      !hamburger.contains(e.target)
    ) closeMenu();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
      closeMenu();
      if (hamburger) hamburger.focus();
    }
  });

  /* ─── 11. SMOOTH SCROLL POLYFILL ─────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      var navH    = navbar ? navbar.offsetHeight : 0;
      var top     = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ─── 12. 3D TILT ON CARDS ────────────────────────────────────── */
  var tiltCards = document.querySelectorAll('.project-card, .skill-card, .stat-card');

  tiltCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect    = card.getBoundingClientRect();
      var x       = e.clientX - rect.left;
      var y       = e.clientY - rect.top;
      var cx      = rect.width  / 2;
      var cy      = rect.height / 2;
      var tiltX   = ((y - cy) / cy) * -8;   // max 8deg
      var tiltY   = ((x - cx) / cx) *  8;
      card.style.transform = 'perspective(600px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) translateY(-6px)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

})();
