// === NAVBAR SCROLL + HAMBURGER ===
(function() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('open');
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(!isOpen));
    });

    // Close mobile nav when a link is clicked
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Set active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// === INTERSECTION OBSERVER FADE-INS ===
(function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
})();

// === PORTFOLIO FILTER ===
(function() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

// === FAQ ACCORDION ===
(function() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
})();

// === CONTACT FORM ===
(function() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const requiredFields = form.querySelectorAll('[required]');
  const successMsg = document.getElementById('form-success');

  // Preselect the service dropdown when linked from a service page (?service=slug)
  const serviceField = form.querySelector('#service');
  const preselect = new URLSearchParams(window.location.search).get('service');
  if (serviceField && preselect && serviceField.querySelector(`option[value="${preselect}"]`)) {
    serviceField.value = preselect;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    requiredFields.forEach(field => {
      const group = field.closest('.form-group');
      if (!field.value.trim()) {
        valid = false;
        field.classList.add('error');
        group.classList.add('has-error');
      } else {
        field.classList.remove('error');
        group.classList.remove('has-error');
      }
    });

    // Email validation
    const emailField = form.querySelector('#email');
    if (emailField && emailField.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailField.value)) {
        valid = false;
        emailField.classList.add('error');
        emailField.closest('.form-group').classList.add('has-error');
      }
    }

    if (valid) {
      form.style.display = 'none';
      successMsg.classList.add('show');
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  // Remove error state on input
  requiredFields.forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('error');
      field.closest('.form-group').classList.remove('has-error');
    });
  });
})();

// === SWIPE-FIRST CARD ROWS: dot indicators + deck depth effect ===
// Interaction priority on mobile is swipe > vertical scroll > tap. No touch
// events are hijacked here (no preventDefault, no gesture library) — the
// browser's native overflow-x scrolling + CSS scroll-snap does the work, so
// the page still scrolls vertically the moment a swipe isn't horizontal.
(function() {
  const mobileQuery = window.matchMedia('(max-width: 767px)');
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const rows = document.querySelectorAll('.swipe-row, .deck-row');
  if (!rows.length) return;

  rows.forEach(row => {
    const items = Array.from(row.children);
    if (items.length < 2) return;

    const isDeck = row.classList.contains('deck-row');

    const dots = document.createElement('div');
    dots.className = 'swipe-dots';
    dots.setAttribute('role', 'tablist');
    dots.setAttribute('aria-label', 'Slide navigation');

    items.forEach((item, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to slide ${i + 1} of ${items.length}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        item.scrollIntoView({
          behavior: reduceMotionQuery.matches ? 'auto' : 'smooth',
          inline: isDeck ? 'center' : 'start',
          block: 'nearest'
        });
      });
      dots.appendChild(dot);
    });

    row.insertAdjacentElement('afterend', dots);
    const dotButtons = dots.querySelectorAll('button');

    // Returns each item's signed distance from the row's horizontal center,
    // normalized to roughly [-1, 1] per card width. Used both to pick the
    // "active" dot and, for deck rows, to drive the peek/scale/opacity.
    const measure = () => {
      const rowRect = row.getBoundingClientRect();
      const rowCenter = rowRect.left + rowRect.width / 2;
      return items.map(item => {
        const r = item.getBoundingClientRect();
        const itemCenter = r.left + r.width / 2;
        return { offset: itemCenter - rowCenter, width: r.width || 1 };
      });
    };

    const applyDeckStyle = (measurements) => {
      if (!isDeck) return;
      if (!mobileQuery.matches) {
        // Off the mobile breakpoint: let the desktop grid CSS take over.
        items.forEach(item => {
          item.style.transform = '';
          item.style.opacity = '';
          item.style.zIndex = '';
        });
        return;
      }
      measurements.forEach((m, i) => {
        const norm = m.offset / m.width;
        const abs = Math.min(Math.abs(norm), 1.6);
        const scale = Math.max(1 - abs * 0.16, 0.78);
        const opacity = Math.max(1 - abs * 0.4, 0.4);
        const lift = Math.min(abs * 10, 14);
        items[i].style.transform = `translateY(${lift}px) scale(${scale})`;
        items[i].style.opacity = String(opacity);
        items[i].style.zIndex = String(Math.round(100 - abs * 10));
      });
    };

    const updateActive = () => {
      const measurements = measure();
      let closestIndex = 0;
      let closestDist = Infinity;
      measurements.forEach((m, i) => {
        const dist = Math.abs(m.offset);
        if (dist < closestDist) {
          closestDist = dist;
          closestIndex = i;
        }
      });
      dotButtons.forEach((dot, i) => dot.classList.toggle('active', i === closestIndex));
      applyDeckStyle(measurements);
      ticking = false;
    };

    let ticking = false;
    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateActive);
    };

    row.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });

    // Paint the initial state (first card active / full-size) before any
    // scroll or resize has fired.
    requestUpdate();
  });
})();
