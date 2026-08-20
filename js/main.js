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
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const rows = document.querySelectorAll('.swipe-row');
  if (!rows.length) return;

  rows.forEach(row => {
    const items = Array.from(row.children);
    if (items.length < 2) return;


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
          inline: 'start',
          block: 'nearest'
        });
      });
      dots.appendChild(dot);
    });

    row.insertAdjacentElement('afterend', dots);
    const dotButtons = dots.querySelectorAll('button');

    // Returns each item's signed distance from the row's horizontal center.
    // Used to pick which dot reads as "active".
    const measure = () => {
      const rowRect = row.getBoundingClientRect();
      const rowCenter = rowRect.left + rowRect.width / 2;
      return items.map(item => {
        const r = item.getBoundingClientRect();
        const itemCenter = r.left + r.width / 2;
        return { offset: itemCenter - rowCenter, width: r.width || 1 };
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

/* =============================================================
   OUTCOME-DRIVEN BEHAVIOURS
   =============================================================
   All of the below reads from js/data.js (window.GM_DATA), so the
   markup never repeats business copy. Every component degrades to
   readable static HTML if JS never runs — the interactive pieces
   are progressive enhancement on top of content that already
   exists in the page or is supplementary to it.
   ============================================================= */

// Small escape helper. The data is ours, but rendering through
// innerHTML deserves it anyway.
function gmEscape(str) {
  return String(str).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

// === SOLUTIONS MEGA MENU (desktop) ===
(function() {
  const toggle = document.querySelector('.mega-toggle');
  const panel = document.querySelector('.mega-panel');
  if (!toggle || !panel) return;

  const wrap = toggle.closest('.has-mega');
  let hoverTimer = null;
  // "locked" = opened deliberately by click or keyboard. Without this, a click
  // on a menu the pointer had already opened would read as "close".
  let locked = false;

  const open = (state) => {
    panel.dataset.open = String(state);
    toggle.setAttribute('aria-expanded', String(state));
  };

  const close = () => { locked = false; open(false); };

  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    locked = !locked;
    open(locked);
  });

  // Pointer users get hover; the click/keyboard path above still works.
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    wrap.addEventListener('mouseenter', () => { clearTimeout(hoverTimer); open(true); });
    wrap.addEventListener('mouseleave', () => {
      hoverTimer = setTimeout(() => { if (!locked) open(false); }, 120);
    });
  }

  wrap.addEventListener('focusout', () => {
    // Close once focus leaves the whole menu, not while tabbing inside it.
    setTimeout(() => { if (!wrap.contains(document.activeElement)) close(); }, 0);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.dataset.open === 'true') { close(); toggle.focus(); }
  });

  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) close();
  });
})();

// === MOBILE NAV: COLLAPSIBLE SOLUTION GROUPS ===
(function() {
  document.querySelectorAll('.mnav-toggle').forEach(btn => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    btn.addEventListener('click', () => {
      const next = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(next));
      panel.dataset.open = String(next);
    });
  });
})();

// === STICKY MOBILE CTA ===
// Appears once the visitor is past the hero, retreats over the footer so it
// never sits on top of the closing call to action.
(function() {
  const bar = document.querySelector('.mobile-cta-bar');
  if (!bar) return;
  const footer = document.querySelector('footer');

  let ticking = false;
  const update = () => {
    const pastHero = window.scrollY > window.innerHeight * 0.6;
    let overFooter = false;
    if (footer) {
      const rect = footer.getBoundingClientRect();
      overFooter = rect.top < window.innerHeight - 40;
    }
    bar.dataset.visible = String(pastHero && !overFooter);
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
  update();
})();

// === HERO FLOW: ROTATING BUSINESS GOAL ===
// One line changes every few seconds to show the same pipeline serving
// different goals. Nothing moves position; only the text cross-fades.
(function() {
  const root = document.querySelector('[data-hero-flow]');
  if (!root) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const goalEl = root.querySelector('[data-flow-goal]');
  const solutionEl = root.querySelector('[data-flow-solution]');
  const resultEl = root.querySelector('[data-flow-result]');
  if (!goalEl || !solutionEl || !resultEl) return;

  const scenes = [
    { goal: '“I need more bookings.”', solution: 'Website + Booking + Reminders', result: '“Customers book themselves.”' },
    { goal: '“I’m buried in admin work.”', solution: 'Workflow Automation', result: '“The busywork runs itself.”' },
    { goal: '“Everything is on one laptop.”', solution: 'Backup + Remote Access', result: '“My files are safe and reachable.”' },
    { goal: '“Nobody can find my business.”', solution: 'Website + Google Setup', result: '“Customers find me first.”' }
  ];

  let i = 0;
  setInterval(() => {
    i = (i + 1) % scenes.length;
    const scene = scenes[i];
    [goalEl, solutionEl, resultEl].forEach(el => { el.dataset.fading = 'true'; });
    setTimeout(() => {
      goalEl.textContent = scene.goal;
      solutionEl.textContent = scene.solution;
      resultEl.textContent = scene.result;
      [goalEl, solutionEl, resultEl].forEach(el => { el.dataset.fading = 'false'; });
    }, 320);
  }, 4200);
})();

// === OUTCOME CHOOSER + RECOMMENDATION PANEL ===
// Selecting a goal reveals matching services in place — it never throws the
// visitor onto another page. The panel is supplementary content; the same
// services are already linked from the static service menu below it.
(function() {
  const grid = document.querySelector('[data-outcome-grid]');
  const panel = document.querySelector('[data-reco-panel]');
  if (!grid || !panel || !window.GM_DATA) return;

  const D = window.GM_DATA;

  // Render the goal cards from data so a new outcome needs no markup.
  grid.innerHTML = D.outcomes.map(o => (
    '<button type="button" class="goal-card" data-goal="' + gmEscape(o.goal) + '" aria-pressed="false" aria-controls="recommendation-panel">' +
      '<span class="goal-icon"><i class="fa-solid ' + gmEscape(o.icon) + '" aria-hidden="true"></i></span>' +
      '<span class="goal-title">' + gmEscape(o.title) + '</span>' +
      '<span class="goal-desc">' + gmEscape(o.description) + '</span>' +
      '<span class="goal-hint">Show me how <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>' +
    '</button>'
  )).join('');

  const cards = grid.querySelectorAll('.goal-card');

  const renderService = (service, primaryCta, goal) => (
    '<article class="reco-card">' +
      '<div class="card-icon"><i class="fa-solid ' + gmEscape(service.icon) + '" aria-hidden="true"></i></div>' +
      '<h4>' + gmEscape(service.name) + '</h4>' +
      '<p>' + gmEscape(service.outcome) + '</p>' +
      '<span class="reco-helps-label">Helps you</span>' +
      '<ul>' + service.helps.map(h => '<li><i class="fa-solid fa-check" aria-hidden="true"></i>' + gmEscape(h) + '</li>').join('') + '</ul>' +
      '<div class="reco-actions">' +
        '<a class="btn btn-primary" href="' + gmEscape(D.inquiryUrl(service.slug, goal)) + '">' + gmEscape(primaryCta) + '</a>' +
        '<a class="btn btn-outline" href="' + gmEscape(D.url(service.url)) + '">See ' + gmEscape(service.short) + '</a>' +
      '</div>' +
    '</article>'
  );

  const show = (goal) => {
    const outcome = D.getOutcome(goal);
    if (!outcome) return;
    const list = outcome.services.map(D.getService).filter(Boolean);

    panel.innerHTML =
      '<div class="reco-head">' +
        '<span class="section-label">Your Best Starting Points</span>' +
        '<h3 tabindex="-1" data-reco-heading>' + gmEscape(outcome.lead) + '</h3>' +
        '<p>Pick the one that sounds like your situation. Not sure? Start the conversation and we’ll tell you which fits.</p>' +
      '</div>' +
      '<div class="reco-grid' + (list.length > 2 ? ' is-three' : '') + '">' +
        list.map((s, idx) => renderService(s, idx === 0 ? outcome.cta : s.cta, goal)).join('') +
      '</div>' +
      '<div class="reco-foot">' +
        '<a class="btn btn-primary" href="' + gmEscape(D.inquiryUrl(list[0] ? list[0].slug : '', goal)) + '">' + gmEscape(outcome.cta) + ' <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>' +
        '<a class="btn btn-outline" href="' + gmEscape(D.url('process.html')) + '">See How It Works</a>' +
      '</div>';

    panel.hidden = false;
    panel.classList.remove('is-entering');
    void panel.offsetWidth; // restart the reveal animation
    panel.classList.add('is-entering');

    const heading = panel.querySelector('[data-reco-heading]');
    if (heading) heading.focus({ preventScroll: true });

    const rect = panel.getBoundingClientRect();
    if (rect.bottom > window.innerHeight) {
      panel.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'nearest'
      });
    }
  };

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const wasSelected = card.getAttribute('aria-pressed') === 'true';
      cards.forEach(c => c.setAttribute('aria-pressed', 'false'));
      if (wasSelected) { panel.hidden = true; return; }
      card.setAttribute('aria-pressed', 'true');
      show(card.dataset.goal);
    });
  });

  // Deep link: index.html?goal=save-time opens that recommendation directly.
  const preset = new URLSearchParams(window.location.search).get('goal');
  if (preset) {
    const match = grid.querySelector('.goal-card[data-goal="' + CSS.escape(preset) + '"]');
    if (match) { match.setAttribute('aria-pressed', 'true'); show(preset); }
  }
})();

// === OPTION SELECTOR + LIVE SUMMARY (configurators) ===
// Drives the website, automation, and opportunity configurators from one
// implementation. A chip set names a GM_DATA collection; the summary panel
// declares how to render the selections.
(function() {
  const sets = document.querySelectorAll('[data-chipset]');
  if (!sets.length || !window.GM_DATA) return;

  const D = window.GM_DATA;
  const state = {}; // { chipsetName: [ids] }

  const collectionFor = (name) => D[name] || [];

  sets.forEach(set => {
    const name = set.dataset.chipset;
    state[name] = [];
    set.innerHTML = collectionFor(name).map(opt => (
      '<button type="button" class="chip" data-option="' + gmEscape(opt.id) + '" aria-pressed="false">' +
        '<i class="fa-solid ' + gmEscape(opt.icon) + ' chip-icon" aria-hidden="true"></i>' +
        '<i class="fa-solid fa-check chip-check" aria-hidden="true"></i>' +
        '<span>' + gmEscape(opt.label) + '</span>' +
      '</button>'
    )).join('');

    set.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip || !set.contains(chip)) return;
      const on = chip.getAttribute('aria-pressed') !== 'true';
      chip.setAttribute('aria-pressed', String(on));
      const id = chip.dataset.option;
      const list = state[name];
      if (on) { if (list.indexOf(id) === -1) list.push(id); }
      else { const at = list.indexOf(id); if (at > -1) list.splice(at, 1); }
      renderSummaries();
    });
  });

  const summaries = document.querySelectorAll('[data-summary-for]');

  function renderSummaries() {
    summaries.forEach(box => {
      const names = box.dataset.summaryFor.split(',').map(s => s.trim());
      const mode = box.dataset.summaryMode || 'list';
      const listEl = box.querySelector('[data-summary-list]');
      const emptyEl = box.querySelector('[data-summary-empty]');
      const setupEl = box.querySelector('[data-summary-setup]');
      const addonEl = box.querySelector('[data-summary-addons]');
      const ctaEl = box.querySelector('[data-summary-cta]');

      const picked = [];
      names.forEach(n => {
        collectionFor(n).forEach(opt => {
          if (state[n] && state[n].indexOf(opt.id) > -1) picked.push(opt);
        });
      });

      if (listEl) {
        listEl.innerHTML = picked.map(p => (
          '<li><i class="fa-solid fa-check" aria-hidden="true"></i>' + gmEscape(p.summary || p.label) + '</li>'
        )).join('');
        listEl.hidden = picked.length === 0;
      }
      if (emptyEl) emptyEl.hidden = picked.length > 0;
      if (setupEl) setupEl.hidden = picked.length === 0;

      if (addonEl && mode === 'website') {
        const addons = D.websiteBaseAddons.slice();
        picked.forEach(p => (p.addons || []).forEach(a => {
          if (addons.indexOf(a) === -1) addons.push(a);
        }));
        addonEl.innerHTML = addons.map(a => '<li>' + gmEscape(a) + '</li>').join('');
      }

      if (ctaEl) {
        const base = ctaEl.dataset.baseHref || ctaEl.getAttribute('href');
        if (!ctaEl.dataset.baseHref) ctaEl.dataset.baseHref = base;
        const ids = picked.map(p => p.id).join(',');
        ctaEl.setAttribute('href', ids ? base + (base.indexOf('?') > -1 ? '&' : '?') + 'wants=' + encodeURIComponent(ids) : base);
      }
    });
  }

  renderSummaries();
})();

// === BEFORE / AFTER TOGGLE ===
// Optional compact mode. The default (side-by-side) markup stays in the page,
// so nothing is hidden from search engines or from a no-JS visitor.
(function() {
  document.querySelectorAll('[data-ba-switch]').forEach(sw => {
    const block = sw.closest('[data-ba-block]');
    if (!block) return;
    const before = block.querySelector('.ba-before');
    const after = block.querySelector('.ba-after');
    const arrow = block.querySelector('.ba-arrow');
    if (!before || !after) return;

    sw.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const which = btn.dataset.baShow;
        sw.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
        if (which === 'both') {
          before.hidden = false; after.hidden = false; if (arrow) arrow.hidden = false;
        } else {
          before.hidden = which !== 'before';
          after.hidden = which !== 'after';
          if (arrow) arrow.hidden = true;
        }
      });
    });
  });
})();

// === INQUIRY FORM: GOAL CHIPS + INCOMING CONTEXT ===
// A CTA anywhere on the site can hand the form its context:
//   contact.html?service=workflow-automation&goal=save-time&wants=book,quote
(function() {
  const form = document.getElementById('contact-form');
  if (!form || !window.GM_DATA) return;

  const D = window.GM_DATA;
  const params = new URLSearchParams(window.location.search);
  const chipSet = form.querySelector('[data-goal-chips]');
  const goalField = form.querySelector('#goal');

  if (chipSet) {
    chipSet.innerHTML = D.outcomes.map(o => (
      '<button type="button" class="chip" data-goal="' + gmEscape(o.goal) + '" aria-pressed="false">' +
        '<i class="fa-solid ' + gmEscape(o.icon) + ' chip-icon" aria-hidden="true"></i>' +
        '<i class="fa-solid fa-check chip-check" aria-hidden="true"></i>' +
        '<span>' + gmEscape(o.title) + '</span>' +
      '</button>'
    )).join('');

    chipSet.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      const on = chip.getAttribute('aria-pressed') !== 'true';
      chipSet.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', 'false'));
      chip.setAttribute('aria-pressed', String(on));
      if (goalField) goalField.value = on ? chip.dataset.goal : '';
    });

    // Preselect from the CTA the visitor arrived on.
    const goal = params.get('goal');
    if (goal) {
      const match = chipSet.querySelector('.chip[data-goal="' + CSS.escape(goal) + '"]');
      if (match) {
        match.setAttribute('aria-pressed', 'true');
        if (goalField) goalField.value = goal;
      }
    }
  }

  // Configurator selections arrive as ?wants=book,quote — turn them back into
  // a sentence the visitor can edit rather than a code they'd have to decode.
  const wants = params.get('wants');
  const description = form.querySelector('#description');
  if (wants && description && !description.value) {
    const labels = [];
    ['websiteActions', 'automationTasks', 'opportunityTargets', 'opportunityAreas',
     'checkupConcerns', 'backupAssets', 'securityRisks', 'remoteNeeds',
     'costAreas', 'partnerTasks'].forEach(key => {
      (D[key] || []).forEach(opt => {
        if (wants.split(',').indexOf(opt.id) > -1 && labels.indexOf(opt.label) === -1) labels.push(opt.label);
      });
    });
    if (labels.length) {
      description.value = 'From the website: I picked ' + labels.join(', ') + '.\n\n';
    }
  }
})();

// === CASE STUDIES ===
// Renders whatever is in GM_DATA.caseStudies. While that list is empty the
// honest empty state in the markup stays visible — no placeholder projects.
(function() {
  const grid = document.querySelector('[data-case-studies]');
  const empty = document.querySelector('[data-case-studies-empty]');
  if (!grid || !window.GM_DATA) return;

  const D = window.GM_DATA;
  const studies = D.caseStudies || [];

  if (!studies.length) {
    grid.hidden = true;
    return;
  }
  if (empty) empty.hidden = true;

  grid.innerHTML = studies.map(cs => (
    '<article class="cs-card">' +
      (cs.image
        ? '<img src="' + gmEscape(D.url(cs.image)) + '" alt="' + gmEscape(cs.imageAlt || '') + '" loading="lazy" />'
        : '') +
      '<div class="cs-body">' +
        '<span class="cs-industry">' + gmEscape(cs.industry || '') + '</span>' +
        '<h3>' + gmEscape(cs.client || '') + '</h3>' +
        '<dl>' +
          '<div><dt>Problem</dt><dd>' + gmEscape(cs.problem || '') + '</dd></div>' +
          '<div><dt>Built</dt><dd>' + (cs.built || []).map(gmEscape).join(', ') + '</dd></div>' +
          '<div><dt>Result</dt><dd class="cs-result">' + gmEscape(cs.result || '') + '</dd></div>' +
        '</dl>' +
      '</div>' +
    '</article>'
  )).join('');
})();
