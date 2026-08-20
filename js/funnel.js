/* =============================================================
   GRAY MATTER — GUIDED MENU FUNNEL
   =============================================================
   Swipe to explore. Tap to choose. Toggle to customize. Pay when
   ready.

   All business copy lives in js/funnel-data.js (window.GM_FUNNEL).
   This file only renders it and owns the state machine.

   State model
   -----------
     step     'outcome' | 'plans' | 'customize' | 'browse'
              | 'questions' | 'recommendation'
     goal     outcome id, or null
     plan     starting-point id, or null
     options  array of enabled option ids (always filtered to the
              options the current plan actually allows)
     answers  { result, frustration, mode } from the guided path
     why      the sentence explaining the current recommendation

   The state is mirrored into sessionStorage (non-sensitive: ids
   only) and into the URL query string, so a customer who navigates
   back or reloads keeps their progress. Nothing here reloads the
   page.
   ============================================================= */
(function () {
  'use strict';

  const root = document.querySelector('[data-funnel]');
  if (!root || !window.GM_FUNNEL) return;

  const F = window.GM_FUNNEL;
  const stage = root.querySelector('[data-funnel-stage]');
  const bar = root.querySelector('[data-funnel-bar]');
  const drawer = document.querySelector('[data-plan-drawer]');
  const live = root.querySelector('[data-funnel-live]');
  if (!stage) return;

  const STORAGE_KEY = 'gm-funnel-v1';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const siteRoot = (document.body && document.body.dataset.root) || '';

  /* --------------------------------------------------------------
     Small helpers
  ---------------------------------------------------------------- */
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function url(path) {
    return siteRoot + path;
  }

  function announce(message) {
    if (!live) return;
    live.textContent = '';
    // A changed string is what triggers the announcement; the reset
    // above makes a repeated message announce again.
    window.setTimeout(function () { live.textContent = message; }, 40);
  }

  function scrollBehavior() {
    return reduceMotion.matches ? 'auto' : 'smooth';
  }

  /* --------------------------------------------------------------
     State
  ---------------------------------------------------------------- */
  const state = {
    step: 'outcome',
    goal: null,
    plan: null,
    options: [],
    answers: {},
    why: ''
  };

  function enabledOptions() {
    if (!state.plan) return [];
    return state.options.filter(function (id) { return F.allows(state.plan, id); });
  }

  function save() {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        step: state.step, goal: state.goal, plan: state.plan,
        options: state.options, answers: state.answers, why: state.why
      }));
    } catch (err) { /* private mode: the funnel still works, it just forgets */ }
  }

  function restoreFromStorage() {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      return applySnapshot(JSON.parse(raw));
    } catch (err) { return false; }
  }

  function applySnapshot(data) {
    if (!data || typeof data !== 'object') return false;
    const plan = data.plan && F.getPlan(data.plan) ? data.plan : null;
    const goal = data.goal && F.getOutcome(data.goal) ? data.goal
               : (plan ? F.getPlan(plan).goal : null);
    state.goal = goal;
    state.plan = plan;
    state.options = Array.isArray(data.options)
      ? data.options.filter(function (id) { return plan && F.allows(plan, id); })
      : [];
    state.answers = (data.answers && typeof data.answers === 'object') ? data.answers : {};
    state.why = typeof data.why === 'string' ? data.why : '';
    const steps = ['outcome', 'plans', 'customize', 'browse', 'questions', 'recommendation'];
    state.step = steps.indexOf(data.step) > -1 ? data.step : 'outcome';
    if (state.step === 'plans' && !state.goal) state.step = 'outcome';
    if ((state.step === 'customize' || state.step === 'recommendation') && !state.plan) {
      state.step = state.goal ? 'plans' : 'outcome';
    }
    // The recommendation step is derived from the answers, and a URL carries
    // the answers but not the sentence. Recompute rather than show a stub.
    if (state.step === 'recommendation' && !state.why) {
      const again = F.recommend(state.answers);
      state.plan = again.plan.id;
      state.goal = again.plan.goal;
      state.why = again.why;
      state.options = [];
    }
    return true;
  }

  /* URL <-> state. Kept short and readable: ?goal=&plan=&opts=&step= */
  function toQuery() {
    const params = new URLSearchParams(window.location.search);
    ['goal', 'plan', 'opts', 'step', 'ans'].forEach(function (k) { params.delete(k); });
    if (state.goal) params.set('goal', state.goal);
    if (state.plan) params.set('plan', state.plan);
    const on = enabledOptions();
    if (on.length) params.set('opts', on.join(','));
    if (state.step !== 'outcome') params.set('step', state.step);
    const answerKeys = Object.keys(state.answers).filter(function (k) { return state.answers[k]; });
    if (answerKeys.length) {
      params.set('ans', answerKeys.map(function (k) { return k + ':' + state.answers[k]; }).join(','));
    }
    const qs = params.toString();
    return window.location.pathname + (qs ? '?' + qs : '') + '#' + root.id;
  }

  function readQuery() {
    const params = new URLSearchParams(window.location.search);
    if (!params.get('goal') && !params.get('plan') && !params.get('step')) return false;
    const answers = {};
    (params.get('ans') || '').split(',').forEach(function (pair) {
      const bits = pair.split(':');
      if (bits.length === 2 && bits[0] && bits[1]) answers[bits[0]] = bits[1];
    });
    return applySnapshot({
      step: params.get('step') || (params.get('plan') ? 'customize' : 'plans'),
      goal: params.get('goal'),
      plan: params.get('plan'),
      options: (params.get('opts') || '').split(',').filter(Boolean),
      answers: answers,
      why: ''
    });
  }

  let suppressHistory = false;
  function syncHistory(push) {
    if (suppressHistory || !window.history || !window.history.replaceState) return;
    const next = toQuery();
    try {
      if (push) window.history.pushState({ gmFunnel: true }, '', next);
      else window.history.replaceState({ gmFunnel: true }, '', next);
    } catch (err) { /* file:// and some embedded views disallow this */ }
  }

  /* --------------------------------------------------------------
     Rendering
  ---------------------------------------------------------------- */
  function stepLabel(n) {
    return '<span class="funnel-step-label">Step ' + n + ' of 3</span>';
  }

  function backButton(target, label) {
    return '<button type="button" class="funnel-back" data-go="' + esc(target) + '">' +
      '<i class="fa-solid fa-arrow-left" aria-hidden="true"></i> ' + esc(label) + '</button>';
  }

  function railOpen(label) {
    return '<div class="rail" data-rail>' +
      '<button type="button" class="rail-nav rail-prev" data-rail-prev aria-label="Show previous ' + esc(label) + '">' +
        '<i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>' +
      '<div class="rail-track" data-rail-track role="group" aria-label="' + esc(label) + '">';
  }

  function railClose(label) {
    return '</div>' +
      '<button type="button" class="rail-nav rail-next" data-rail-next aria-label="Show next ' + esc(label) + '">' +
        '<i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>' +
    '</div>';
  }

  /* ---------------------------------------------------- step 1 */
  function renderOutcomes() {
    return '<div class="funnel-step" data-step="outcome">' +
      '<div class="funnel-step-head">' +
        stepLabel(1) +
        '<h3 tabindex="-1" data-step-heading>' + esc(F.copy.step1Heading) + '</h3>' +
        '<p>' + esc(F.copy.step1Sub) + '</p>' +
      '</div>' +
      railOpen('goals') +
        F.outcomes.map(function (o) {
          return '<article class="menu-card outcome-card">' +
            '<span class="menu-icon"><i class="fa-solid ' + esc(o.icon) + '" aria-hidden="true"></i></span>' +
            '<h4>' + esc(o.title) + '</h4>' +
            '<p>' + esc(o.description) + '</p>' +
            '<button type="button" class="btn btn-primary menu-action" data-goal="' + esc(o.id) + '">' +
              esc(o.cta) + ' <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>' +
          '</article>';
        }).join('') +
      railClose('goals') +
      '<div class="funnel-alt">' +
        '<div>' +
          '<h4>Not sure what will help most?</h4>' +
          '<p>Answer three quick questions. We’ll recommend the best place to start.</p>' +
        '</div>' +
        '<button type="button" class="btn btn-outline" data-go="questions">Recommend It for Me</button>' +
      '</div>' +
    '</div>';
  }

  /* ---------------------------------------------------- step 2 */
  function planCard(plan, opts) {
    opts = opts || {};
    const money = F.pricing(plan.id, []);
    const canCustomize = F.optionsFor(plan.id).length > 0;
    return '<article class="menu-card plan-card"' + (opts.wide ? ' data-wide="true"' : '') + '>' +
      '<div class="plan-card-top">' +
        '<span class="menu-icon"><i class="fa-solid ' + esc(plan.icon) + '" aria-hidden="true"></i></span>' +
        (plan.badge ? '<span class="menu-badge">' + esc(plan.badge) + '</span>' : '') +
      '</div>' +
      '<h4>' + esc(plan.name) + '</h4>' +
      '<p class="plan-result">' + esc(plan.result) + '</p>' +
      '<dl class="plan-facts">' +
        '<div><dt>Price</dt><dd' + (money.price.status === 'fit-check' ? ' class="is-soft"' : '') + '>' +
          esc(money.price.display) + '</dd></div>' +
        '<div><dt>Time</dt><dd' + (money.timeline.status === 'fit-check' ? ' class="is-soft"' : '') + '>' +
          esc(money.timeline.display) + '</dd></div>' +
      '</dl>' +
      '<ul class="plan-includes">' +
        plan.includes.slice(0, 3).map(function (item) {
          return '<li><i class="fa-solid fa-check" aria-hidden="true"></i>' + esc(item) + '</li>';
        }).join('') +
      '</ul>' +
      '<div class="menu-actions">' +
        '<button type="button" class="btn btn-primary" data-start="' + esc(plan.id) + '">Start Now</button>' +
        (canCustomize
          ? '<button type="button" class="btn btn-outline" data-customize="' + esc(plan.id) + '">Customize</button>'
          : '') +
      '</div>' +
      '<a class="menu-detail-link" href="' + esc(url(plan.detailUrl)) + '">' +
        'Full details on ' + esc(plan.serviceName) + ' <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>' +
    '</article>';
  }

  function renderPlans() {
    const outcome = F.getOutcome(state.goal);
    if (!outcome) { state.step = 'outcome'; return renderOutcomes(); }
    const list = F.plansFor(outcome.id);
    return '<div class="funnel-step" data-step="plans">' +
      '<div class="funnel-step-head">' +
        backButton('outcome', 'Choose a different goal') +
        stepLabel(2) +
        '<h3 tabindex="-1" data-step-heading>Where We’d Start: ' + esc(outcome.title) + '</h3>' +
        '<p>Pick the one that sounds like your business. You can start now or customize first.</p>' +
      '</div>' +
      railOpen('starting points') +
        list.map(function (plan) { return planCard(plan); }).join('') +
      railClose('starting points') +
    '</div>';
  }

  /* ---------------------------------------------------- step 3 */
  function toggleRow(option, on) {
    return '<li class="switch-row">' +
      '<button type="button" role="switch" class="switch" aria-checked="' + (on ? 'true' : 'false') + '"' +
        ' data-option="' + esc(option.id) + '" id="opt-' + esc(option.id) + '">' +
        '<span class="switch-track" aria-hidden="true"><span class="switch-thumb"></span></span>' +
        '<span class="switch-text">' +
          '<span class="switch-label">' + esc(option.label) + '</span>' +
          '<span class="switch-detail">' + esc(option.detail) + '</span>' +
          (option.priceNote ? '<span class="switch-note">' + esc(option.priceNote) + '</span>' : '') +
        '</span>' +
      '</button>' +
      (option.guide ? '<span class="switch-guide">' + esc(option.guide) + '</span>' : '') +
    '</li>';
  }

  function renderCustomize() {
    const plan = F.getPlan(state.plan);
    if (!plan) { state.step = state.goal ? 'plans' : 'outcome'; return render(); }
    const list = F.optionsFor(plan.id);
    const on = enabledOptions();
    return '<div class="funnel-step" data-step="customize">' +
      '<div class="funnel-step-head">' +
        backButton('plans', 'Back to starting points') +
        stepLabel(3) +
        '<h3 tabindex="-1" data-step-heading>Customize ' + esc(plan.name) + '</h3>' +
        '<p>Only the options that fit this plan. Turn on what you need — your plan updates as you go.</p>' +
        (plan.excludes ? '<p class="funnel-bounds"><i class="fa-solid fa-circle-info" aria-hidden="true"></i> ' +
          esc(plan.excludes) + '</p>' : '') +
      '</div>' +
      '<div class="customize-layout">' +
        '<ul class="switch-list">' +
          (list.length
            ? list.map(function (o) { return toggleRow(o, on.indexOf(o.id) > -1); }).join('')
            : '<li class="switch-empty">This plan is delivered as one fixed piece of work — there is nothing to add.</li>') +
        '</ul>' +
        '<aside class="plan-mini" data-plan-mini aria-label="Your plan so far">' + planMini() + '</aside>' +
      '</div>' +
      '<div class="funnel-actions">' +
        '<button type="button" class="btn btn-primary" data-open-drawer>Start Now <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>' +
        '<button type="button" class="btn btn-outline" data-go="plans">Change My Choices</button>' +
      '</div>' +
    '</div>';
  }

  /* Compact summary shown beside the toggles. */
  function planMini() {
    const plan = F.getPlan(state.plan);
    if (!plan) return '';
    const on = enabledOptions();
    const money = F.pricing(plan.id, on);
    return '<h4>' + esc(F.copy.planTitle) + '</h4>' +
      '<p class="plan-mini-name">' + esc(plan.name) + '</p>' +
      '<p class="plan-mini-line' + (money.price.status === 'fit-check' ? ' is-soft' : '') + '">' +
        '<i class="fa-solid fa-tag" aria-hidden="true"></i> ' + esc(money.price.display) + '</p>' +
      '<p class="plan-mini-line' + (money.timeline.status === 'fit-check' ? ' is-soft' : '') + '">' +
        '<i class="fa-solid fa-clock" aria-hidden="true"></i> ' + esc(money.timeline.display) + '</p>' +
      (money.upgradeReason ? '<p class="plan-mini-upgrade">' + esc(money.upgradeReason) + '</p>' : '') +
      '<p class="plan-mini-count">' + (on.length
        ? esc(on.length) + ' option' + (on.length === 1 ? '' : 's') + ' added'
        : 'No options added yet') + '</p>' +
      '<p class="plan-mini-note">' + esc(F.copy.planNote) + '</p>';
  }

  /* ------------------------------------------- fast lane: browse */
  function renderBrowse() {
    return '<div class="funnel-step" data-step="browse">' +
      '<div class="funnel-step-head">' +
        backButton('outcome', 'Back to the menu') +
        '<h3 tabindex="-1" data-step-heading>I Know What I Need</h3>' +
        '<p>Every standard starting point, grouped by what it does for your business.</p>' +
        '<div class="browse-search">' +
          '<label for="funnel-search">Search starting points</label>' +
          '<input type="search" id="funnel-search" data-browse-search placeholder="e.g. website, backup, automation" autocomplete="off" />' +
        '</div>' +
      '</div>' +
      '<div data-browse-results>' + browseGroups('') + '</div>' +
    '</div>';
  }

  function browseGroups(term) {
    term = (term || '').trim().toLowerCase();
    const matches = function (plan) {
      if (!term) return true;
      return (plan.name + ' ' + plan.result + ' ' + plan.serviceName + ' ' + plan.includes.join(' '))
        .toLowerCase().indexOf(term) > -1;
    };
    const html = F.outcomes.map(function (outcome) {
      const list = F.plansFor(outcome.id).filter(matches);
      if (!list.length) return '';
      return '<section class="browse-group">' +
        '<h4>' + esc(outcome.title) + '</h4>' +
        '<ul class="browse-list">' +
          list.map(function (plan) {
            const money = F.pricing(plan.id, []);
            return '<li>' +
              '<div class="browse-item-main">' +
                '<p class="browse-item-name">' + esc(plan.name) +
                  (plan.badge ? ' <span class="menu-badge is-inline">' + esc(plan.badge) + '</span>' : '') + '</p>' +
                '<p class="browse-item-result">' + esc(plan.result) + '</p>' +
                '<p class="browse-item-facts' + (money.price.status === 'fit-check' ? ' is-soft' : '') + '">' +
                  esc(money.price.display) + ' &middot; ' + esc(money.timeline.display) + '</p>' +
              '</div>' +
              '<div class="browse-item-actions">' +
                '<button type="button" class="btn btn-primary btn-sm" data-start="' + esc(plan.id) + '">Start Now</button>' +
                (F.optionsFor(plan.id).length
                  ? '<button type="button" class="btn btn-outline btn-sm" data-customize="' + esc(plan.id) + '">Customize</button>'
                  : '') +
              '</div>' +
            '</li>';
          }).join('') +
        '</ul>' +
      '</section>';
    }).join('');
    return html || '<p class="browse-empty">Nothing matches that word. Try “website”, “backup”, “automation”, or clear the search.</p>';
  }

  /* -------------------------------------- fast lane: questions */
  function renderQuestions() {
    return '<div class="funnel-step" data-step="questions">' +
      '<div class="funnel-step-head">' +
        backButton('outcome', 'Back to the menu') +
        '<h3 tabindex="-1" data-step-heading>Recommend It for Me</h3>' +
        '<p>Three quick questions. We’ll name one place to start and tell you why.</p>' +
      '</div>' +
      F.questions.map(function (q) {
        return '<fieldset class="funnel-q">' +
          '<legend>' + esc(q.label) + '</legend>' +
          '<div class="chip-set">' +
            q.options.map(function (o) {
              return '<button type="button" class="chip" data-q="' + esc(q.id) + '" data-a="' + esc(o.id) + '"' +
                ' aria-pressed="' + (state.answers[q.id] === o.id ? 'true' : 'false') + '">' +
                '<i class="fa-solid fa-check chip-check" aria-hidden="true"></i>' +
                '<span>' + esc(o.label) + '</span></button>';
            }).join('') +
          '</div>' +
        '</fieldset>';
      }).join('') +
      '<div class="funnel-actions">' +
        '<button type="button" class="btn btn-primary" data-see-reco>Show My Recommendation <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>' +
        '<button type="button" class="btn btn-outline" data-go="outcome">Choose It Myself</button>' +
      '</div>' +
    '</div>';
  }

  function renderRecommendation() {
    const plan = F.getPlan(state.plan);
    if (!plan) { state.step = 'questions'; return renderQuestions(); }
    return '<div class="funnel-step" data-step="recommendation">' +
      '<div class="funnel-step-head">' +
        backButton('questions', 'Change my answers') +
        '<h3 tabindex="-1" data-step-heading>We recommend: ' + esc(plan.name) + '</h3>' +
        '<p class="reco-because">This fits because ' + esc(state.why) + '</p>' +
      '</div>' +
      '<div class="reco-single">' + planCard(plan, { wide: true }) + '</div>' +
      '<div class="funnel-actions">' +
        '<button type="button" class="btn btn-primary" data-open-drawer>Start With This Plan</button>' +
        (F.optionsFor(plan.id).length
          ? '<button type="button" class="btn btn-outline" data-customize="' + esc(plan.id) + '">Adjust the Options</button>'
          : '') +
        '<a class="btn btn-outline" href="' + esc(inquiryHref('review')) + '">Talk It Through</a>' +
      '</div>' +
    '</div>';
  }

  function render() {
    let html;
    if (state.step === 'plans') html = renderPlans();
    else if (state.step === 'customize') html = renderCustomize();
    else if (state.step === 'browse') html = renderBrowse();
    else if (state.step === 'questions') html = renderQuestions();
    else if (state.step === 'recommendation') html = renderRecommendation();
    else html = renderOutcomes();

    stage.innerHTML = html;
    stage.querySelectorAll('[data-rail]').forEach(mountRail);
    renderBar();
    if (drawer && drawer.dataset.open === 'true') renderDrawer();
    return html;
  }

  function focusStepHeading() {
    const heading = stage.querySelector('[data-step-heading]');
    if (!heading) return;
    heading.focus({ preventScroll: true });
    const rect = root.getBoundingClientRect();
    if (rect.top < 0 || rect.top > window.innerHeight * 0.5) {
      root.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    }
  }

  function goTo(step, opts) {
    opts = opts || {};
    state.step = step;
    render();
    save();
    syncHistory(opts.push !== false);
    if (opts.focus !== false) focusStepHeading();
  }

  /* --------------------------------------------------------------
     Persistent action bar
  ---------------------------------------------------------------- */
  function renderBar() {
    if (!bar) return;
    const count = enabledOptions().length;
    const planName = state.plan ? F.getPlan(state.plan).name : '';
    bar.innerHTML =
      '<button type="button" class="funnel-bar-btn" data-go="browse">' +
        '<i class="fa-solid fa-list" aria-hidden="true"></i> I Know What I Need</button>' +
      '<button type="button" class="funnel-bar-btn" data-go="questions">' +
        '<i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i> Recommend It for Me</button>' +
      '<button type="button" class="funnel-bar-btn is-plan" data-open-drawer>' +
        '<i class="fa-solid fa-clipboard-list" aria-hidden="true"></i> My Plan' +
        (state.plan ? '<span class="funnel-bar-count">' + (count ? count + ' added' : 'ready') + '</span>' : '') +
      '</button>' +
      '<button type="button" class="funnel-bar-btn is-start" data-start-now>' +
        'Start Now <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>';
    if (planName) bar.setAttribute('aria-label', 'Your plan: ' + planName);
    else bar.setAttribute('aria-label', 'Plan shortcuts');
    renderMobileBar();
  }

  /* On phones the section bar scrolls away, so the site's existing sticky
     bottom bar takes over the two actions that must always be reachable.
     Untouched until a plan exists, so its default CTA still applies. */
  const mobileBar = document.querySelector('.mobile-cta-bar');
  const mobileBarDefault = mobileBar ? mobileBar.innerHTML : '';
  function renderMobileBar() {
    if (!mobileBar) return;
    if (!state.plan) {
      if (mobileBar.innerHTML !== mobileBarDefault) mobileBar.innerHTML = mobileBarDefault;
      return;
    }
    const count = enabledOptions().length;
    mobileBar.innerHTML =
      '<button type="button" class="btn btn-outline" data-open-drawer>' +
        '<i class="fa-solid fa-clipboard-list" aria-hidden="true"></i> My Plan' +
        (count ? ' <span class="funnel-bar-count">' + count + '</span>' : '') + '</button>' +
      '<button type="button" class="btn btn-primary" data-open-drawer>' +
        'Start Now <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>';
  }

  if (mobileBar) {
    mobileBar.addEventListener('click', function (event) {
      if (event.target.closest('[data-open-drawer]')) openDrawer();
    });
  }

  /* --------------------------------------------------------------
     Plan drawer / bottom sheet — the full confirmation state
  ---------------------------------------------------------------- */
  let lastFocused = null;

  function inquiryHref(nextStep) {
    const plan = state.plan ? F.getPlan(state.plan) : null;
    const outcome = plan ? F.getOutcome(plan.goal) : (state.goal ? F.getOutcome(state.goal) : null);
    const params = new URLSearchParams();
    if (plan) {
      params.set('service', plan.service);
      params.set('plan', plan.id);
    }
    if (outcome) params.set('goal', outcome.legacyGoal || outcome.id);
    const on = enabledOptions();
    if (on.length) params.set('opts', on.join(','));
    const answerKeys = Object.keys(state.answers).filter(function (k) { return state.answers[k]; });
    if (answerKeys.length) {
      params.set('ans', answerKeys.map(function (k) { return k + ':' + state.answers[k]; }).join(','));
    }
    params.set('next', nextStep || 'start');
    return url('contact.html') + '?' + params.toString();
  }

  function drawerBody() {
    const plan = state.plan ? F.getPlan(state.plan) : null;
    if (!plan) {
      return '<div class="drawer-empty">' +
        '<h2 id="plan-drawer-title" tabindex="-1">' + esc(F.copy.planTitle) + '</h2>' +
        '<p>You haven’t chosen anything yet. Pick the result you want first — it takes one tap.</p>' +
        '<button type="button" class="btn btn-primary" data-go="outcome" data-close-drawer>Choose Your Goal</button>' +
      '</div>';
    }

    const outcome = F.getOutcome(plan.goal);
    const on = enabledOptions();
    const money = F.pricing(plan.id, on);
    const action = F.resolveAction(plan.id);
    const nextStepText = action.kind === 'checkout'
      ? esc(action.note)
      : 'You send this plan. We confirm the exact scope, price, and timeline in writing. Nothing starts until you approve it.';

    return '<h2 id="plan-drawer-title" tabindex="-1">' + esc(outcome ? outcome.planTitle : F.copy.planTitle) + '</h2>' +
      '<p class="drawer-sub">' + esc(F.copy.confirmSub) + '</p>' +
      '<dl class="drawer-list">' +
        '<div><dt>Your goal</dt><dd>' + esc(outcome ? outcome.title : '—') + '</dd></div>' +
        '<div><dt>Your starting plan</dt><dd>' + esc(plan.name) + '</dd></div>' +
        '<div><dt>What’s included</dt><dd><ul>' +
          money.includes.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') +
        '</ul>' +
        (plan.excludes ? '<span class="drawer-note">' + esc(plan.excludes) + '</span>' : '') +
        '</dd></div>' +
        '<div><dt>What you added</dt><dd>' +
          (on.length
            ? '<ul>' + on.map(function (id) {
                const opt = F.getOption(id);
                return '<li>' + esc(opt.label) +
                  (opt.priceNote ? ' <span class="drawer-note">' + esc(opt.priceNote) + '</span>' : '') + '</li>';
              }).join('') + '</ul>'
            : 'Nothing added — the plan above as it stands.') +
        '</dd></div>' +
        '<div><dt>Price</dt><dd' + (money.price.status === 'fit-check' ? ' class="is-soft"' : '') + '>' +
          esc(money.price.display) +
          (money.addonNotes.length ? '<span class="drawer-note">Add-ons are priced separately, as listed above.</span>' : '') +
        '</dd></div>' +
        '<div><dt>Timeline</dt><dd' + (money.timeline.status === 'fit-check' ? ' class="is-soft"' : '') + '>' +
          esc(money.timeline.display) + '</dd></div>' +
        '<div><dt>What happens next</dt><dd class="is-prose">' + nextStepText + '</dd></div>' +
      '</dl>' +
      (money.upgradeReason ? '<p class="drawer-upgrade"><i class="fa-solid fa-circle-info" aria-hidden="true"></i> ' +
        esc(money.upgradeReason) + '</p>' : '') +
      '<aside class="drawer-reassure">' +
        '<h3>' + esc(F.copy.reassuranceTitle) + '</h3>' +
        '<ul>' + F.copy.reassurance.map(function (line) {
          return '<li><i class="fa-solid fa-check" aria-hidden="true"></i>' + esc(line) + '</li>';
        }).join('') + '</ul>' +
      '</aside>' +
      '<div class="drawer-actions">' +
        (action.kind === 'checkout'
          ? '<a class="btn btn-primary" href="' + esc(action.href) + '" target="_blank" rel="noopener">' +
              esc(action.label) + ' <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a>'
          : '<a class="btn btn-primary" href="' + esc(inquiryHref('start')) + '">' + esc(action.label) +
              ' <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>') +
        '<a class="btn btn-outline" href="' + esc(inquiryHref('review')) + '">Review It With Me</a>' +
        '<button type="button" class="btn btn-outline" data-change-choices>Change My Choices</button>' +
      '</div>' +
      '<p class="drawer-terms">Work is carried out under the ' +
        '<a href="' + esc(url('agreement.html')) + '">client agreement</a>. Sending a plan is a request, not a signature.</p>';
  }

  function renderDrawer() {
    if (!drawer) return;
    const panel = drawer.querySelector('[data-drawer-body]');
    if (panel) panel.innerHTML = drawerBody();
  }

  function openDrawer() {
    if (!drawer) return;
    lastFocused = document.activeElement;
    renderDrawer();
    drawer.hidden = false;
    // Force a frame so the transition runs from the closed position.
    window.requestAnimationFrame(function () { drawer.dataset.open = 'true'; });
    document.body.classList.add('drawer-open');
    const title = drawer.querySelector('#plan-drawer-title');
    if (title) title.focus({ preventScroll: true });
  }

  function closeDrawer() {
    if (!drawer || drawer.dataset.open !== 'true') return;
    drawer.dataset.open = 'false';
    document.body.classList.remove('drawer-open');
    const finish = function () { drawer.hidden = true; };
    if (reduceMotion.matches) finish();
    else window.setTimeout(finish, 220);
    if (lastFocused && document.contains(lastFocused)) lastFocused.focus({ preventScroll: true });
  }

  /* The drawer is modal (it has a backdrop and covers the page), so a
     focus loop here is the correct behaviour, not a trap to avoid. */
  function trapFocus(event) {
    if (!drawer || drawer.dataset.open !== 'true' || event.key !== 'Tab') return;
    const focusables = drawer.querySelectorAll(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  /* --------------------------------------------------------------
     Horizontal rails — native scroll-snap plus arrows and keys
  ---------------------------------------------------------------- */
  function mountRail(rail) {
    const track = rail.querySelector('[data-rail-track]');
    const prev = rail.querySelector('[data-rail-prev]');
    const next = rail.querySelector('[data-rail-next]');
    if (!track) return;
    const items = Array.from(track.children);
    if (!items.length) return;

    const step = function () {
      const first = items[0].getBoundingClientRect();
      return first.width + 16;
    };

    const update = function () {
      const max = track.scrollWidth - track.clientWidth - 2;
      const atStart = track.scrollLeft <= 2;
      const atEnd = track.scrollLeft >= max;
      const still = max <= 0;
      if (prev) prev.disabled = still || atStart;
      if (next) next.disabled = still || atEnd;
      rail.dataset.scrollable = String(!still);
    };

    const nudge = function (dir) {
      track.scrollBy({ left: dir * step(), behavior: scrollBehavior() });
    };

    if (prev) prev.addEventListener('click', function () { nudge(-1); });
    if (next) next.addEventListener('click', function () { nudge(1); });

    // Arrow keys move focus between cards, which scrolls them into view
    // natively. Everything stays reachable by Tab as well.
    track.addEventListener('keydown', function (event) {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      const card = event.target.closest('.menu-card');
      if (!card) return;
      const index = items.indexOf(card);
      const target = items[index + (event.key === 'ArrowRight' ? 1 : -1)];
      if (!target) return;
      event.preventDefault();
      const focusable = target.querySelector('button, a');
      if (focusable) focusable.focus();
      target.scrollIntoView({ behavior: scrollBehavior(), inline: 'nearest', block: 'nearest' });
    });

    let ticking = false;
    track.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { update(); ticking = false; });
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  /* --------------------------------------------------------------
     Actions
  ---------------------------------------------------------------- */
  function chooseGoal(goalId) {
    if (!F.getOutcome(goalId)) return;
    state.goal = goalId;
    if (state.plan && F.getPlan(state.plan).goal !== goalId) {
      state.plan = null;
      state.options = [];
    }
    goTo('plans');
    announce(F.getOutcome(goalId).title + ' selected. Showing starting points.');
  }

  function choosePlan(planId, step) {
    const plan = F.getPlan(planId);
    if (!plan) return;
    if (state.plan !== planId) state.options = [];
    state.plan = planId;
    state.goal = plan.goal;
    if (step) goTo(step);
    else { render(); save(); syncHistory(true); }
    announce(plan.name + ' selected. Your plan is ready to review.');
  }

  function toggleOption(button) {
    const id = button.dataset.option;
    if (!state.plan || !F.allows(state.plan, id)) return;
    const at = state.options.indexOf(id);
    const on = at === -1;
    if (on) state.options.push(id);
    else state.options.splice(at, 1);
    button.setAttribute('aria-checked', String(on));

    const mini = stage.querySelector('[data-plan-mini]');
    if (mini) mini.innerHTML = planMini();
    renderBar();
    if (drawer && drawer.dataset.open === 'true') renderDrawer();
    save();
    syncHistory(false);

    const option = F.getOption(id);
    const total = enabledOptions().length;
    const money = F.pricing(state.plan, enabledOptions());
    announce(option.label + (on ? ' added to your plan. ' : ' removed from your plan. ') +
      (total === 0 ? 'No options added. ' : total + ' option' + (total === 1 ? '' : 's') + ' added. ') +
      money.price.display + '.');
  }

  root.addEventListener('click', function (event) {
    const goalBtn = event.target.closest('[data-goal]');
    if (goalBtn && root.contains(goalBtn)) { chooseGoal(goalBtn.dataset.goal); return; }

    const startBtn = event.target.closest('[data-start]');
    if (startBtn) { choosePlan(startBtn.dataset.start); openDrawer(); return; }

    const customizeBtn = event.target.closest('[data-customize]');
    if (customizeBtn) { choosePlan(customizeBtn.dataset.customize, 'customize'); return; }

    const switchBtn = event.target.closest('[role="switch"][data-option]');
    if (switchBtn) { toggleOption(switchBtn); return; }

    const chip = event.target.closest('.chip[data-q]');
    if (chip) {
      const q = chip.dataset.q;
      const same = state.answers[q] === chip.dataset.a;
      state.answers[q] = same ? '' : chip.dataset.a;
      stage.querySelectorAll('.chip[data-q="' + CSS.escape(q) + '"]').forEach(function (c) {
        c.setAttribute('aria-pressed', String(!same && c === chip));
      });
      save();
      syncHistory(false);
      return;
    }

    if (event.target.closest('[data-see-reco]')) {
      const result = F.recommend(state.answers);
      state.plan = result.plan.id;
      state.goal = result.plan.goal;
      state.options = [];
      state.why = result.why;
      goTo('recommendation');
      announce('We recommend ' + result.plan.name + '.');
      return;
    }

    if (event.target.closest('[data-start-now]')) {
      if (state.plan) openDrawer();
      else goTo(state.goal ? 'plans' : 'outcome');
      return;
    }

    if (event.target.closest('[data-open-drawer]')) { openDrawer(); return; }

    const goBtn = event.target.closest('[data-go]');
    if (goBtn) { goTo(goBtn.dataset.go); }
  });

  root.addEventListener('input', function (event) {
    const search = event.target.closest('[data-browse-search]');
    if (!search) return;
    const results = stage.querySelector('[data-browse-results]');
    if (results) results.innerHTML = browseGroups(search.value);
  });

  if (drawer) {
    drawer.addEventListener('click', function (event) {
      if (event.target.closest('[data-close-drawer]') || event.target.hasAttribute('data-drawer-backdrop')) {
        const go = event.target.closest('[data-go]');
        closeDrawer();
        if (go) goTo(go.dataset.go);
        return;
      }
      if (event.target.closest('[data-change-choices]')) {
        closeDrawer();
        goTo(state.plan && F.optionsFor(state.plan).length ? 'customize' : 'plans');
      }
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeDrawer();
      trapFocus(event);
    });
  }

  window.addEventListener('popstate', function () {
    suppressHistory = true;
    if (!readQuery()) {
      state.step = 'outcome';
      state.goal = null;
      state.plan = null;
      state.options = [];
    }
    render();
    save();
    suppressHistory = false;
  });

  /* --------------------------------------------------------------
     Boot
  ---------------------------------------------------------------- */
  const fromUrl = readQuery();
  if (!fromUrl) restoreFromStorage();
  render();
  if (fromUrl) syncHistory(false);
  if (window.location.hash === '#' + root.id && state.step !== 'outcome') {
    focusStepHeading();
  }
})();
