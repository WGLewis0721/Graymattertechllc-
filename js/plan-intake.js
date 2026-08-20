/* =============================================================
   GRAY MATTER — PLAN INTAKE (inquiry form)
   =============================================================
   Receives a plan built in the guided funnel and turns it into
   something a human can read and the inquiry email can carry.

   Input, in priority order:
     1. the query string —
        contact.html?plan=…&opts=…&ans=…&next=…&service=…&goal=…
     2. the funnel's sessionStorage snapshot, for a customer who
        arrived here another way in the same tab

   Output:
     * a plain-language "Your Plan" panel above the form
     * structured hidden fields, so the inquiry email states the
       goal, starting point, options, answers, displayed price
       status, displayed timeline status, and intended next step

   Nothing sensitive is stored or transmitted here: the funnel
   deals in identifiers and labels only. The form's existing
   FormSubmit action, validation, and success/error behaviour are
   untouched.
   ============================================================= */
(function () {
  'use strict';

  const form = document.getElementById('contact-form');
  const mount = document.querySelector('[data-plan-intake]');
  if (!form || !mount || !window.GM_FUNNEL) return;

  const F = window.GM_FUNNEL;

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------------------------------------------------- read input */
  const params = new URLSearchParams(window.location.search);
  let planId = params.get('plan');
  let optionIds = (params.get('opts') || '').split(',').filter(Boolean);
  let answers = {};
  (params.get('ans') || '').split(',').forEach(function (pair) {
    const bits = pair.split(':');
    if (bits.length === 2 && bits[0] && bits[1]) answers[bits[0]] = bits[1];
  });
  const nextStep = params.get('next') === 'review' ? 'review' : 'start';

  if (!planId) {
    try {
      const raw = window.sessionStorage.getItem('gm-funnel-v1');
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && saved.plan) {
          planId = saved.plan;
          optionIds = Array.isArray(saved.options) ? saved.options : [];
          answers = (saved.answers && typeof saved.answers === 'object') ? saved.answers : {};
        }
      }
    } catch (err) { /* no stored plan is a perfectly normal state */ }
  }

  const plan = planId ? F.getPlan(planId) : null;
  if (!plan) return;

  optionIds = optionIds.filter(function (id) { return F.allows(plan.id, id); });
  const outcome = F.getOutcome(plan.goal);
  const money = F.pricing(plan.id, optionIds);
  const optionLabels = optionIds.map(function (id) { return F.getOption(id).label; });

  const answerLines = F.questions.map(function (q) {
    const picked = answers[q.id];
    if (!picked) return null;
    const match = q.options.filter(function (o) { return o.id === picked; })[0];
    return match ? q.label + ' ' + match.label : null;
  }).filter(Boolean);

  /* ------------------------------------------------ visible panel */
  mount.innerHTML =
    '<div class="plan-intake">' +
      '<span class="section-label">From the Solution Menu</span>' +
      '<h2>' + esc(outcome ? outcome.planTitle : 'Your Plan') + '</h2>' +
      '<p class="plan-intake-sub">Nothing starts until you approve the scope, price, and timeline. ' +
        'Add anything we should know below and send it over.</p>' +
      '<dl class="plan-intake-list">' +
        '<div><dt>Your goal</dt><dd>' + esc(outcome ? outcome.title : '—') + '</dd></div>' +
        '<div><dt>Your starting plan</dt><dd>' + esc(plan.name) + '</dd></div>' +
        '<div><dt>What’s included</dt><dd>' + esc(money.includes.join(' · ')) + '</dd></div>' +
        '<div><dt>What you added</dt><dd>' +
          (optionLabels.length ? esc(optionLabels.join(' · ')) : 'Nothing added') + '</dd></div>' +
        '<div><dt>Price</dt><dd>' + esc(money.price.display) + '</dd></div>' +
        '<div><dt>Timeline</dt><dd>' + esc(money.timeline.display) + '</dd></div>' +
      '</dl>' +
      (money.upgradeReason
        ? '<p class="plan-intake-upgrade"><i class="fa-solid fa-circle-info" aria-hidden="true"></i> ' +
          esc(money.upgradeReason) + '</p>'
        : '') +
      '<p class="plan-intake-change"><a href="' + esc((document.body.dataset.root || '') + 'index.html#build-my-plan') +
        '">Change my choices</a></p>' +
    '</div>';
  mount.hidden = false;

  /* ---------------------------------------------- hidden fields */
  function set(name, value) {
    const field = form.querySelector('[name="' + name + '"]');
    if (field) field.value = value;
  }

  set('plan_goal', outcome ? outcome.title : '');
  set('plan_starting_point', plan.name + ' (' + plan.serviceName + ')');
  set('plan_options', optionLabels.length ? optionLabels.join('; ') : 'None');
  set('plan_answers', answerLines.length ? answerLines.join(' | ') : 'Guided questions not used');
  set('plan_price', money.price.display +
    (money.price.status === 'approved' ? ' (published starting price)' : ' (not yet quoted)'));
  set('plan_timeline', money.timeline.display +
    (money.timeline.status === 'approved' ? ' (published typical delivery)' : ' (not yet quoted)'));
  set('plan_next_step', nextStep === 'review'
    ? 'Review it with me before anything is booked'
    : 'Send my plan and confirm scope, price, and timeline');

  /* Pre-fill the free-text field with a sentence the customer can edit,
     never a code they would have to decode. main.js may already have
     filled it from a ?wants= configurator link — that wins. */
  const description = form.querySelector('#description');
  if (description && !description.value) {
    description.value = 'From the solution menu: ' + plan.name +
      (optionLabels.length ? ', plus ' + optionLabels.join(', ') : '') + '.\n\n';
  }

  /* Preselect the service dropdown when the funnel named one. */
  const service = form.querySelector('#service');
  if (service && !service.value && service.querySelector('option[value="' + plan.service + '"]')) {
    service.value = plan.service;
  }
})();
