/* ═══════════════════════════════════════════════════════════════════
   PORTFOLIO — SCRIPT.JS
   Scroll animations, nav highlight, hamburger, auto year
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── 1. AUTO COPYRIGHT YEAR ──────────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ─── 2. NAVBAR SHADOW ON SCROLL ─────────────────────────────── */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // run on load in case page is already scrolled

  /* ─── 3. MOBILE HAMBURGER MENU ────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const navLinks   = document.getElementById('nav-links');
  const navLinkEls = navLinks ? navLinks.querySelectorAll('a') : [];

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

  function toggleMenu() {
    if (navLinks.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  // Close menu when a nav link is clicked
  navLinkEls.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (e) {
    if (
      navLinks &&
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      e.target !== hamburger &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });

  /* ─── 4. SMOOTH SCROLL POLYFILL ───────────────────────────────── */
  // Handles "#section" href clicks for browsers without native smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight  = navbar ? navbar.offsetHeight : 0;
      const targetTop  = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  /* ─── 5. SCROLL ANIMATIONS (IntersectionObserver) ────────────── */
  const fadeEls = document.querySelectorAll('.fade-in-up');

  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target); // fire only once
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    fadeEls.forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else {
    // Fallback: show all elements immediately
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ─── 6. ACTIVE NAV HIGHLIGHT ─────────────────────────────────── */
  const sections    = document.querySelectorAll('section[id]');
  const navLinkMap  = {};

  document.querySelectorAll('.nav-link').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      navLinkMap[href.slice(1)] = link;
    }
  });

  function setActiveLink(id) {
    Object.values(navLinkMap).forEach(function (link) {
      link.classList.remove('active');
    });
    if (navLinkMap[id]) {
      navLinkMap[id].classList.add('active');
    }
  }

  if ('IntersectionObserver' in window && sections.length > 0) {
    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      {
        // Trigger when a section is ~30% in view, offset for navbar height
        rootMargin: '-64px 0px -60% 0px',
        threshold: 0,
      }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* ─── 7. KEYBOARD ACCESSIBILITY ──────────────────────────────── */
  // Close mobile menu with Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
      closeMenu();
      if (hamburger) hamburger.focus();
    }
  });

})();
