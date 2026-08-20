/* =============================================================
   GRAY MATTER — GUIDED MENU FUNNEL CONFIGURATION
   =============================================================
   Single source of truth for the guided funnel:

     outcome  →  starting point  →  compatible options  →  plan

   Everything the funnel shows a customer is declared here —
   labels, mappings, inclusions, displayed prices, displayed
   timelines, guidance labels, and checkout URLs. js/funnel.js
   renders it and owns no business copy of its own.

   -------------------------------------------------------------
   PRICING RULES (do not break these)
   -------------------------------------------------------------
   * A price or timeline may only appear here if it is already
     published and approved elsewhere on this site
     (pricing.html). Everything else uses status 'fit-check',
     which renders the approved fallback wording.
   * Never total add-ons into a single number. Add-on prices are
     shown per option, exactly as pricing.html states them.
   * No popularity, performance, or testimonial claims.

   -------------------------------------------------------------
   PAYMENT LINKS — READ BEFORE EDITING
   -------------------------------------------------------------
   CHECKOUT.links below is the ONLY place a real payment or
   deposit URL belongs. Every value ships empty on purpose. While
   a value is empty the plan's primary action stays "Send My Plan"
   and submits through the existing inquiry form — no fake
   checkout is ever shown. Paste a real, verified URL (for
   example a Stripe Payment Link) to switch that one plan to a
   real payment handoff.
   ============================================================= */
(function (global) {
  'use strict';

  /* ---------------------------------------------------------------
     CHECKOUT CONFIGURATION
     ---------------------------------------------------------------
     links[planId] — a real external checkout / deposit URL, or ''.
       '' (the shipped default) => the plan's primary action is
       "Send My Plan" and the configured plan is submitted through
       the inquiry form on contact.html.
       A real https:// URL => the primary action becomes the plan's
       reserve label and opens that URL in a new tab.

     Only plans with checkoutMode 'deposit' may ever use a link.
     Plans with checkoutMode 'fit-check' need technical validation
     first, so they never take a payment — a link set on one of
     them is ignored by design (see resolveAction below).
  ---------------------------------------------------------------- */
  var CHECKOUT = {
    links: {
      'online-presence': '',
      'customer-actions': '',
      'opportunity-list': '',
      'workflow-time-saver': '',
      'process-system': '',
      'work-anywhere': '',
      'cost-cleanup': '',
      'security-setup': '',
      'backup-setup': '',
      'complete-protection': '',
      'business-checkup': '',
      'technology-partner': ''
    },
    /* Shown next to a real checkout button only. */
    depositNote: 'Secure checkout opens in a new tab. Your written scope and price are confirmed before any work begins.'
  };

  /* ---------------------------------------------------------------
     SHARED WORDING
  ---------------------------------------------------------------- */
  var COPY = {
    promise: 'Choose your goal. Build your plan. Approve before we start.',
    headline: 'Tell us what needs to change. We figure out the technology.',
    support: 'Grow. Save. Protect. Get it handled.',
    step1Heading: 'What Do You Want to Fix First?',
    step1Sub: 'Choose the result that would help your business most right now.',
    planTitle: 'Your Plan',
    planNote: 'We’ll confirm the exact scope, price, and timeline before anything starts.',
    confirmSub: 'Review your choices. Nothing starts until you approve the scope, price, and timeline.',
    reassuranceTitle: 'Nothing Starts Until You Approve',
    reassurance: [
      'You see exactly what is included.',
      'You know the full price.',
      'You approve the timeline.',
      'Then the work begins.'
    ],
    priceFallback: 'Price confirmed after a quick fit check',
    timelineFallback: 'Timeline confirmed after a quick fit check'
  };

  var FIT_PRICE = { display: COPY.priceFallback, status: 'fit-check' };
  var FIT_TIME = { display: COPY.timelineFallback, status: 'fit-check' };

  /* ---------------------------------------------------------------
     STEP 1 — OUTCOMES
  ---------------------------------------------------------------- */
  var outcomes = [
    {
      id: 'grow',
      legacyGoal: 'get-more-customers',
      title: 'Get More Customers',
      description: 'Help people find you, trust you, and take action.',
      cta: 'Help Me Grow',
      icon: 'fa-arrow-trend-up',
      planTitle: 'Your Plan to Grow Your Business',
      shortGoal: 'Get more customers'
    },
    {
      id: 'operate',
      legacyGoal: 'save-time',
      title: 'Save Time and Money',
      description: 'Cut repetitive work, confusion, and unnecessary technology costs.',
      cta: 'Help Me Save',
      icon: 'fa-clock',
      planTitle: 'Your Plan to Save Time and Money',
      shortGoal: 'Save time and money'
    },
    {
      id: 'protect',
      legacyGoal: 'protect-my-business',
      title: 'Protect My Business',
      description: 'Keep your accounts, devices, and important files safe.',
      cta: 'Protect What Matters',
      icon: 'fa-shield-halved',
      planTitle: 'Your Plan to Protect Your Business',
      shortGoal: 'Protect my business'
    },
    {
      id: 'support',
      legacyGoal: 'handle-it-for-me',
      title: 'Handle My Technology',
      description: 'Get a clear plan or reliable ongoing help.',
      cta: 'Handle It for Me',
      icon: 'fa-handshake-angle',
      planTitle: 'Your Technology Support Plan',
      shortGoal: 'Handle my technology'
    }
  ];

  /* ---------------------------------------------------------------
     OPTIONS
     ---------------------------------------------------------------
     Every option here adds separate scope, extra volume, ongoing
     labour, or another system. Nothing that a plan already
     includes is offered as an option.

     label    — what the customer gains, in their words
     detail   — one short sentence of explanation
     guide    — restrained guidance label, or omitted
     priceNote— an add-on price already published on pricing.html
     upgrade  — this option moves the build to a larger published
                package; rank picks the largest when several are on
  ---------------------------------------------------------------- */
  var options = {
    /* --- website options ---------------------------------------- */
    'web-booking': {
      label: 'Let Customers Book Online',
      detail: 'Customers pick a time themselves instead of calling or messaging you.',
      guide: 'Recommended for appointment businesses',
      upgrade: {
        rank: 2,
        price: { display: 'Starting at $1,500', status: 'approved' },
        timeline: { display: 'Typically 2–3 weeks', status: 'approved' },
        includes: ['Up to 5 customized pages', 'Online booking or quote requests', 'Services and pricing'],
        why: 'Online booking is part of the Professional website package, so the plan moves up to that build.'
      }
    },
    'web-payments': {
      label: 'Take Payments Online',
      detail: 'Customers pay you from the website instead of chasing an invoice.',
      upgrade: {
        rank: 3,
        price: { display: 'Starting at $3,000', status: 'approved' },
        timeline: { display: 'Typically 4–6 weeks', status: 'approved' },
        includes: ['Up to 8 pages', 'Booking and payments', 'One core CRM or automation integration'],
        why: 'Online payments are part of the Premium / Full Platform build, so the plan moves up to that build.'
      }
    },
    'web-store': {
      label: 'Sell Products Online',
      detail: 'A defined online store or digital-product scope, agreed in writing first.',
      upgrade: {
        rank: 3,
        price: { display: 'Starting at $3,000', status: 'approved' },
        timeline: { display: 'Typically 4–6 weeks', status: 'approved' },
        includes: ['Up to 8 pages', 'A defined store or digital-product scope', 'Booking and payments'],
        why: 'An online store is part of the Premium / Full Platform build, so the plan moves up to that build.'
      }
    },
    'web-copy': {
      label: 'Write the Words for Me',
      detail: 'We write the homepage, about, and services copy instead of you supplying it.',
      priceNote: 'Add-on: +$400 – $900'
    },
    'web-google': {
      label: 'Help People Find Me on Google',
      detail: 'Keyword research, meta tags, sitemap, and Google Search Console setup.',
      priceNote: 'Add-on: +$350 – $750'
    },
    'web-email-marketing': {
      label: 'Stay in Touch by Email',
      detail: 'Email list setup, a welcome sequence, and a sign-up form on your site.',
      priceNote: 'Add-on: +$300 – $600'
    },
    'web-care': {
      label: 'Keep It Updated Every Month',
      detail: 'Monthly updates, backups, and small content changes handled for you.',
      guide: 'Optional ongoing protection',
      priceNote: 'Add-on: $149 – $299 / month'
    },

    /* --- opportunity finder -------------------------------------- */
    'opp-wider-area': {
      label: 'Search a Wider Area',
      detail: 'Look beyond your local area for businesses worth contacting.'
    },
    'opp-contracts': {
      label: 'Include Contract Opportunities',
      detail: 'Add government, corporate, and subcontracting opportunities to the search.'
    },
    'opp-recurring': {
      label: 'Send Me a New List Each Month',
      detail: 'Recurring research so the list does not go stale.',
      guide: 'Optional ongoing protection'
    },

    /* --- workflow automation ------------------------------------- */
    'flow-confirmations': {
      label: 'Send Confirmations for Me',
      detail: 'Appointment confirmations and reminders go out without you touching them.'
    },
    'flow-followups': {
      label: 'Chase Follow-Ups for Me',
      detail: 'Quote and lead follow-ups send on time, every time.'
    },
    'flow-reviews': {
      label: 'Ask for Reviews After the Job',
      detail: 'A review request goes out once the work is finished.'
    },
    'flow-records': {
      label: 'Stop Double-Entering Customer Details',
      detail: 'Customer information moves between your tools by itself.'
    },
    'flow-invoices': {
      label: 'Send Invoices Without Me',
      detail: 'Invoicing and scheduling steps run on their own schedule.'
    },

    /* --- process & documentation --------------------------------- */
    'doc-checklists': {
      label: 'Add Job Checklists',
      detail: 'Short checklists your team can follow on an actual job.',
      guide: 'Good for teams'
    },
    'doc-runbooks': {
      label: 'Add Runbooks for What Goes Wrong',
      detail: 'Written steps for the problems that keep interrupting you.'
    },
    'doc-training': {
      label: 'Train My Team on the New System',
      detail: 'A working session so people actually use what we wrote.',
      guide: 'Good for teams'
    },
    'doc-upkeep': {
      label: 'Keep It Current for Me',
      detail: 'Scheduled reviews so the procedures do not go out of date.',
      guide: 'Optional ongoing protection'
    },

    /* --- work from anywhere -------------------------------------- */
    'remote-devices': {
      label: 'Set Up More Devices',
      detail: 'Additional laptops, phones, or tablets beyond the first one.'
    },
    'remote-team': {
      label: 'Give My Team Their Own Access',
      detail: 'Each person gets what they need, and only what they need.',
      guide: 'Good for teams'
    },
    'remote-backup': {
      label: 'Keep My Files Safely Backed Up',
      detail: 'Add a protected copy of the files you would hate to lose.',
      guide: 'Best for important files'
    },

    /* --- technology cost cleanup --------------------------------- */
    'cost-cancel': {
      label: 'Cancel and Consolidate for Me',
      detail: 'We handle the cancellations and downgrades instead of handing you a list.'
    },
    'cost-recheck': {
      label: 'Check My Costs Again Each Quarter',
      detail: 'A repeat review so the waste does not creep back.',
      guide: 'Optional ongoing protection'
    },

    /* --- protection ---------------------------------------------- */
    'prot-accounts': {
      label: 'Secure Our Business Accounts',
      detail: 'Lock down business email and logins, and remove access people no longer need.',
      guide: 'Recommended for your plan'
    },
    'prot-devices': {
      label: 'Protect More Devices',
      detail: 'Cover the extra laptops, phones, and tablets your business runs on.'
    },
    'prot-backup': {
      label: 'Keep My Files Safely Backed Up',
      detail: 'Automatic backup of the records, photos, and documents you cannot replace.',
      guide: 'Best for important files'
    },
    'prot-restore-test': {
      label: 'Make Sure Recovery Works',
      detail: 'Test your backup so you know your files can actually be restored.',
      guide: 'Recommended for your plan'
    },
    'prot-training': {
      label: 'Teach My Team What to Avoid',
      detail: 'A short session on the scams and mistakes that cause most incidents.',
      guide: 'Good for teams'
    },
    'prot-monitoring': {
      label: 'Watch for Problems Each Month',
      detail: 'A monthly check that backups ran and nothing has quietly broken.',
      guide: 'Optional ongoing protection'
    },

    /* --- ongoing support ----------------------------------------- */
    'partner-people': {
      label: 'Cover More People and Devices',
      detail: 'Support for a bigger team than a single owner-operator.'
    },
    'partner-website': {
      label: 'Include My Website Updates',
      detail: 'Content and page changes handled as part of the same arrangement.'
    },
    'partner-backups': {
      label: 'Watch My Backups Too',
      detail: 'Backups get checked on a schedule instead of when someone remembers.',
      guide: 'Best for important files'
    }
  };

  /* ---------------------------------------------------------------
     STEP 2 — STARTING POINTS
     ---------------------------------------------------------------
     checkoutMode:
       'deposit'   — a defined, published package. May use a real
                     checkout link when one is configured.
       'fit-check' — needs technical validation before any money
                     changes hands. Never takes a payment.
  ---------------------------------------------------------------- */
  var plans = [
    /* ---------------- GET MORE CUSTOMERS ----------------------- */
    {
      id: 'online-presence',
      goal: 'grow',
      name: 'Professional Online Presence',
      result: 'Give customers one professional place to find you, trust you, and contact you.',
      icon: 'fa-desktop',
      service: 'business-websites',
      serviceName: 'Business Websites',
      detailUrl: 'services/business-websites.html',
      price: { display: 'Starting at $750', status: 'approved' },
      timeline: { display: 'Typically 7–10 business days', status: 'approved' },
      includes: ['Up to 3 pages', 'Mobile-friendly design', 'Contact form'],
      excludes: 'Online booking, payments, and stores are separate scope — turn one on below and the plan updates.',
      options: ['web-booking', 'web-copy', 'web-google', 'web-care'],
      checkoutMode: 'deposit',
      reserveLabel: 'Reserve My Project',
      rank: 1
    },
    {
      id: 'customer-actions',
      goal: 'grow',
      name: 'Customer Action System',
      result: 'Let customers book, request a quote, register, or pay online.',
      icon: 'fa-calendar-check',
      service: 'business-websites',
      serviceName: 'Business Websites',
      detailUrl: 'services/business-websites.html',
      price: { display: 'Starting at $1,500', status: 'approved' },
      timeline: { display: 'Typically 2–3 weeks', status: 'approved' },
      includes: ['Up to 5 customized pages', 'Online booking or quote requests', 'Services and pricing'],
      excludes: 'One customer action is set up in this plan. Online payments and online stores are part of the larger Full Platform build.',
      options: ['web-payments', 'web-store', 'web-email-marketing', 'web-copy', 'web-google', 'web-care'],
      checkoutMode: 'deposit',
      reserveLabel: 'Reserve My Project',
      rank: 2
    },
    {
      id: 'opportunity-list',
      goal: 'grow',
      name: 'Opportunity Finder',
      result: 'Receive a focused list of customers, contracts, or opportunities worth pursuing.',
      icon: 'fa-bullseye',
      service: 'business-opportunity-finder',
      serviceName: 'Business Opportunity Finder',
      detailUrl: 'services/business-opportunity-finder.html',
      price: FIT_PRICE,
      timeline: FIT_TIME,
      includes: ['Researched list of businesses that fit', 'Contact details where publicly available', 'Fit scoring so you know who to call first'],
      excludes: 'You receive the research and the list. Making the outreach stays with you.',
      options: ['opp-wider-area', 'opp-contracts', 'opp-recurring'],
      checkoutMode: 'fit-check'
    },

    /* ---------------- SAVE TIME AND MONEY ---------------------- */
    {
      id: 'workflow-time-saver',
      goal: 'operate',
      name: 'Workflow Time-Saver',
      result: 'Automate repetitive administrative work.',
      icon: 'fa-diagram-project',
      service: 'workflow-automation',
      serviceName: 'Workflow Automation',
      detailUrl: 'services/workflow-automation.html',
      price: FIT_PRICE,
      timeline: FIT_TIME,
      includes: ['We map the repeat work first', 'One routine handed to a system', 'Connected to the tools you already use'],
      options: ['flow-confirmations', 'flow-followups', 'flow-reviews', 'flow-records', 'flow-invoices'],
      checkoutMode: 'fit-check'
    },
    {
      id: 'process-system',
      goal: 'operate',
      name: 'Business Process System',
      result: 'Turn scattered procedures into one organized system.',
      icon: 'fa-folder-tree',
      service: 'process-documentation',
      serviceName: 'Process & Documentation Systems',
      detailUrl: 'services/process-documentation.html',
      price: FIT_PRICE,
      timeline: FIT_TIME,
      includes: ['Written steps for the work you repeat', 'One current version, one place', 'Kept in tools you already pay for'],
      options: ['doc-checklists', 'doc-runbooks', 'doc-training', 'doc-upkeep'],
      checkoutMode: 'fit-check'
    },
    {
      id: 'work-anywhere',
      goal: 'operate',
      name: 'Work From Anywhere Setup',
      result: 'Securely reach business tools and files from wherever work happens.',
      icon: 'fa-location-dot',
      service: 'work-from-anywhere',
      serviceName: 'Work From Anywhere',
      detailUrl: 'services/work-from-anywhere.html',
      price: FIT_PRICE,
      timeline: FIT_TIME,
      includes: ['Secure access to files and shared folders', 'Email and apps on the device you have', 'Safer remote login'],
      options: ['remote-devices', 'remote-team', 'remote-backup'],
      checkoutMode: 'fit-check'
    },
    {
      id: 'cost-cleanup',
      goal: 'operate',
      name: 'Technology Cost Cleanup',
      result: 'Find unused, duplicated, or unnecessarily expensive technology.',
      icon: 'fa-receipt',
      service: 'technology-cost-cleanup',
      serviceName: 'Technology Cost Cleanup',
      detailUrl: 'services/technology-cost-cleanup.html',
      price: FIT_PRICE,
      timeline: FIT_TIME,
      includes: ['Every subscription listed', 'Duplicates and unused accounts flagged', 'Plain-numbers savings estimate'],
      options: ['cost-cancel', 'cost-recheck'],
      checkoutMode: 'fit-check'
    },

    /* ---------------- PROTECT MY BUSINESS ---------------------- */
    {
      id: 'security-setup',
      goal: 'protect',
      name: 'Business Security Setup',
      result: 'Strengthen accounts, devices, access, and everyday security practices.',
      icon: 'fa-lock',
      service: 'business-security',
      serviceName: 'Business Security',
      detailUrl: 'services/business-security.html',
      price: FIT_PRICE,
      timeline: FIT_TIME,
      includes: ['Business email and logins protected', 'Access reviewed and old access removed', 'Plain-English explanation of the risks'],
      options: ['prot-devices', 'prot-training', 'prot-backup', 'prot-monitoring'],
      checkoutMode: 'fit-check'
    },
    {
      id: 'backup-setup',
      goal: 'protect',
      name: 'Backup & Recovery Setup',
      result: 'Protect essential files and establish a tested recovery process.',
      icon: 'fa-hard-drive',
      service: 'backup-recovery',
      serviceName: 'Backup & Recovery',
      detailUrl: 'services/backup-recovery.html',
      price: FIT_PRICE,
      timeline: FIT_TIME,
      includes: ['Automatic backup of important business files', 'A written recovery plan', 'Protection against deletion and device failure'],
      options: ['prot-restore-test', 'prot-devices', 'prot-accounts', 'prot-monitoring'],
      checkoutMode: 'fit-check'
    },
    {
      id: 'complete-protection',
      goal: 'protect',
      name: 'Complete Protection Package',
      badge: 'Most Complete',
      result: 'Security and backup combined into one coordinated setup.',
      icon: 'fa-shield-halved',
      service: 'business-security',
      serviceName: 'Business Security + Backup & Recovery',
      detailUrl: 'services/business-security.html',
      alsoUrl: 'services/backup-recovery.html',
      alsoName: 'Backup & Recovery',
      price: FIT_PRICE,
      timeline: FIT_TIME,
      includes: ['Accounts, devices, and access secured', 'Important files backed up automatically', 'One coordinated plan instead of two'],
      options: ['prot-devices', 'prot-backup', 'prot-restore-test', 'prot-training', 'prot-monitoring', 'prot-accounts'],
      checkoutMode: 'fit-check'
    },

    /* ---------------- HANDLE MY TECHNOLOGY --------------------- */
    {
      id: 'business-checkup',
      goal: 'support',
      name: 'Business Technology Checkup',
      badge: 'One-Time',
      result: 'We review what you have, identify what matters, and give you a prioritized action plan.',
      icon: 'fa-clipboard-check',
      service: 'business-technology-checkup',
      serviceName: 'Business Technology Checkup',
      detailUrl: 'services/business-technology-checkup.html',
      price: FIT_PRICE,
      timeline: FIT_TIME,
      includes: ['Review of your software, systems, and accounts', 'Security, backup, and cost gaps identified', 'A prioritized plan you are free to act on yourself'],
      excludes: 'This is the review and the plan. There is no obligation to have us do the work afterwards.',
      options: [],
      checkoutMode: 'fit-check'
    },
    {
      id: 'technology-partner',
      goal: 'support',
      name: 'Technology Partner',
      badge: 'Ongoing',
      result: 'Ongoing guidance, maintenance, coordination, and support without hiring full-time technology staff.',
      icon: 'fa-headset',
      service: 'technology-partner',
      serviceName: 'Technology Partner',
      detailUrl: 'services/technology-partner.html',
      price: FIT_PRICE,
      timeline: FIT_TIME,
      includes: ['One place to call when technology gets in the way', 'Maintenance and monitoring handled', 'A second opinion before you buy anything'],
      excludes: 'Ongoing support is arranged monthly, with what it covers written down before it starts.',
      options: ['partner-people', 'partner-website', 'partner-backups'],
      checkoutMode: 'fit-check'
    }
  ];

  /* ---------------------------------------------------------------
     GUIDED RECOMMENDATION — three questions, one answer
  ---------------------------------------------------------------- */
  var questions = [
    {
      id: 'result',
      label: 'What result would help most right now?',
      options: [
        { id: 'grow', label: 'Get more customers' },
        { id: 'operate', label: 'Save time and money' },
        { id: 'protect', label: 'Protect my business' },
        { id: 'support', label: 'Just handle my technology' }
      ]
    },
    {
      id: 'frustration',
      label: 'What is causing the most frustration?',
      options: [
        { id: 'find-me', label: 'People can’t find me or book me' },
        { id: 'who-to-call', label: 'I don’t know who to call next' },
        { id: 'busywork', label: 'The same work eats my week' },
        { id: 'nothing-written', label: 'Nothing is written down' },
        { id: 'costs', label: 'I’m paying for things nobody uses' },
        { id: 'risk', label: 'I could lose files or get hacked' },
        { id: 'lands-on-me', label: 'Technology keeps landing on me' }
      ]
    },
    {
      id: 'mode',
      label: 'Do you want a one-time solution or ongoing help?',
      options: [
        { id: 'once', label: 'One time — fix it and hand it over' },
        { id: 'ongoing', label: 'Ongoing — keep it working for me' },
        { id: 'unsure', label: 'Not sure yet' }
      ]
    }
  ];

  /* First matching rule wins, so the specific ones come first.
     `why` is one plain sentence built from what the customer said. */
  var rules = [
    { when: { result: 'support', mode: 'ongoing' }, plan: 'technology-partner',
      why: 'you want technology handled for you on an ongoing basis, not one job at a time.' },
    { when: { result: 'support' }, plan: 'business-checkup',
      why: 'you want technology handled, and the cheapest way to hand it over is to find out what you actually have first.' },
    { when: { frustration: 'lands-on-me', mode: 'ongoing' }, plan: 'technology-partner',
      why: 'technology keeps landing on you, and you want someone to keep it working instead of a one-time fix.' },

    { when: { result: 'protect', frustration: 'risk' }, plan: 'complete-protection',
      why: 'losing files and getting hacked are two halves of the same problem, so they are worth solving together.' },
    { when: { result: 'protect', mode: 'ongoing' }, plan: 'complete-protection',
      why: 'you want protection that keeps working, and security and backup are easiest to keep working as one plan.' },
    { when: { result: 'protect' }, plan: 'security-setup',
      why: 'most small-business incidents start with account access someone forgot to remove.' },
    { when: { frustration: 'risk' }, plan: 'complete-protection',
      why: 'you named losing files or getting hacked as the worry, and those two are worth solving together.' },

    { when: { result: 'grow', frustration: 'who-to-call' }, plan: 'opportunity-list',
      why: 'you want more customers but not knowing who to contact is the thing stopping you.' },
    { when: { result: 'grow', frustration: 'find-me' }, plan: 'customer-actions',
      why: 'people cannot find you or book you, so the fastest change is one place that answers their questions and takes the booking.' },
    { when: { result: 'grow', mode: 'ongoing' }, plan: 'customer-actions',
      why: 'you want more customers arriving without you chasing them, which is what letting people book themselves does.' },
    { when: { result: 'grow' }, plan: 'online-presence',
      why: 'one professional place people can find and trust is the shortest path to more customers.' },
    { when: { frustration: 'find-me' }, plan: 'online-presence',
      why: 'people cannot find you, so being findable comes before anything else.' },
    { when: { frustration: 'who-to-call' }, plan: 'opportunity-list',
      why: 'not knowing who to contact is the thing slowing you down.' },

    { when: { result: 'operate', frustration: 'nothing-written' }, plan: 'process-system',
      why: 'automating something that only exists in your head just makes the mess run faster, so it gets written down first.' },
    { when: { result: 'operate', frustration: 'costs' }, plan: 'cost-cleanup',
      why: 'you suspect you are paying for things nobody uses, and you cannot cut what you cannot see.' },
    { when: { result: 'operate' }, plan: 'workflow-time-saver',
      why: 'the repetitive parts of your week are the easiest thing to hand to a system.' },
    { when: { frustration: 'nothing-written' }, plan: 'process-system',
      why: 'nothing being written down sits underneath most of the other problems.' },
    { when: { frustration: 'costs' }, plan: 'cost-cleanup',
      why: 'you are paying for things nobody uses, and that is money you can stop spending this month.' },
    { when: { frustration: 'busywork' }, plan: 'workflow-time-saver',
      why: 'the same work eating your week is the easiest thing to measurably reduce.' },
    { when: { frustration: 'lands-on-me' }, plan: 'business-checkup',
      why: 'technology keeps landing on you, so the first step is a clear picture of what you have been carrying.' },
    { when: {}, plan: 'business-checkup',
      why: 'when nothing stands out as the obvious problem, a checkup is the cheapest way to find out what is.' }
  ];

  /* ---------------------------------------------------------------
     HELPERS
  ---------------------------------------------------------------- */
  function getOutcome(id) {
    for (var i = 0; i < outcomes.length; i++) if (outcomes[i].id === id) return outcomes[i];
    return null;
  }

  function getPlan(id) {
    for (var i = 0; i < plans.length; i++) if (plans[i].id === id) return plans[i];
    return null;
  }

  function plansFor(goal) {
    return plans.filter(function (p) { return p.goal === goal; });
  }

  function getOption(id) {
    var o = options[id];
    if (!o) return null;
    return { id: id, label: o.label, detail: o.detail, guide: o.guide, priceNote: o.priceNote, upgrade: o.upgrade };
  }

  /** Options a plan is allowed to show. Never returns anything from
      another plan, so website options can't appear under backup. */
  function optionsFor(planId) {
    var plan = getPlan(planId);
    if (!plan) return [];
    return (plan.options || []).map(getOption).filter(Boolean);
  }

  /** True when an option id is compatible with the given plan. */
  function allows(planId, optionId) {
    var plan = getPlan(planId);
    return !!(plan && (plan.options || []).indexOf(optionId) > -1);
  }

  /**
   * Displayed price and timeline for a plan plus its enabled options.
   * Add-on prices are never summed — they are listed individually.
   */
  function pricing(planId, enabled) {
    var plan = getPlan(planId);
    if (!plan) return null;
    var price = plan.price;
    var timeline = plan.timeline;
    var includes = plan.includes;
    var rank = plan.rank || 0;
    var reason = '';

    (enabled || []).forEach(function (id) {
      var opt = options[id];
      if (!opt || !opt.upgrade || !allows(planId, id)) return;
      if (opt.upgrade.rank > rank) {
        rank = opt.upgrade.rank;
        price = opt.upgrade.price;
        timeline = opt.upgrade.timeline;
        // The inclusions have to move with the price, or the plan would
        // claim a bigger build's price against a smaller build's scope.
        includes = opt.upgrade.includes || includes;
        reason = opt.upgrade.why;
      }
    });

    var addonNotes = (enabled || []).map(function (id) {
      var opt = options[id];
      return opt && opt.priceNote && allows(planId, id)
        ? { label: opt.label, note: opt.priceNote }
        : null;
    }).filter(Boolean);

    return { price: price, timeline: timeline, includes: includes, upgradeReason: reason, addonNotes: addonNotes };
  }

  /** One primary recommendation. Never a grid of competing ones. */
  function recommend(answers) {
    answers = answers || {};
    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i];
      var ok = true;
      for (var key in rule.when) {
        if (answers[key] !== rule.when[key]) { ok = false; break; }
      }
      if (ok) return { plan: getPlan(rule.plan), why: rule.why };
    }
    return { plan: getPlan('business-checkup'), why: rules[rules.length - 1].why };
  }

  /**
   * What the plan's primary action should be.
   * A checkout link is honoured only for a 'deposit' plan with a real
   * absolute URL configured. Anything else falls back to the inquiry
   * form, so a missing link can never render a fake checkout.
   */
  function resolveAction(planId) {
    var plan = getPlan(planId);
    if (!plan) return { kind: 'inquiry', label: 'Send My Plan' };
    var link = CHECKOUT.links[planId];
    var usable = plan.checkoutMode === 'deposit' &&
                 typeof link === 'string' && /^https:\/\/\S+$/.test(link.trim());
    if (usable) {
      return { kind: 'checkout', label: plan.reserveLabel || 'Reserve My Project', href: link.trim(), note: CHECKOUT.depositNote };
    }
    return { kind: 'inquiry', label: 'Send My Plan' };
  }

  global.GM_FUNNEL = {
    copy: COPY,
    checkout: CHECKOUT,
    outcomes: outcomes,
    plans: plans,
    options: options,
    questions: questions,
    rules: rules,
    getOutcome: getOutcome,
    getPlan: getPlan,
    plansFor: plansFor,
    getOption: getOption,
    optionsFor: optionsFor,
    allows: allows,
    pricing: pricing,
    recommend: recommend,
    resolveAction: resolveAction
  };
})(window);
