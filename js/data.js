/* =============================================================
   GRAY MATTER — CONTENT ARCHITECTURE
   =============================================================
   Single source of truth for the business information that is
   reused across pages: services, customer outcomes, industries,
   packages, roadmap steps, transformations, and case studies.

   Nothing here is page-specific markup. Components in main.js
   read from these objects, so a new outcome/service/industry can
   be added by editing this file alone.

   Link paths are written relative to the site root. Pages in a
   subdirectory declare <body data-root="../">, and GM_DATA.url()
   prefixes accordingly.
   ============================================================= */
(function (global) {
  'use strict';

  /* --- SERVICES -------------------------------------------------
     problem  = the sentence a customer would say out loud
     outcome  = plain-language result, no implementation detail
     helps    = 2–4 things it lets a customer or owner do
     cta      = button copy, phrased as the customer's goal
     interest = value passed to the inquiry form (?service=)
  ---------------------------------------------------------------- */
  var services = [
    {
      slug: 'business-technology-checkup',
      name: 'Business Technology Checkup',
      short: 'Technology Checkup',
      icon: 'fa-clipboard-check',
      art: 'assets/gray-matter/services/gm-service-tech-checkup.svg',
      problem: 'I don’t know what I actually need.',
      outcome: 'Get a plain-language review of what’s working, what’s risky, and what to fix first.',
      helps: ['See what you already have', 'Spot what’s at risk', 'Find wasted spend', 'Get a first-things-first plan'],
      cta: 'Review My Technology',
      url: 'services/business-technology-checkup.html',
      interest: 'business-technology-checkup'
    },
    {
      slug: 'business-websites',
      name: 'Business Websites',
      short: 'Business Website',
      icon: 'fa-desktop',
      art: 'assets/gray-matter/services/gm-service-business-websites.svg',
      problem: 'I need customers to find me and take action.',
      outcome: 'Give customers one professional place to understand your business and take the next step.',
      helps: ['View your services', 'See pricing', 'Book an appointment', 'Request a quote'],
      cta: 'Build My Website',
      url: 'services/business-websites.html',
      interest: 'business-websites'
    },
    {
      slug: 'workflow-automation',
      name: 'Workflow Automation',
      short: 'Automation',
      icon: 'fa-diagram-project',
      art: 'assets/gray-matter/services/gm-service-workflow-automation.svg',
      problem: 'I keep doing the same tasks over and over.',
      outcome: 'Let the routine parts of your business happen without you.',
      helps: ['Send confirmations', 'Move customer information', 'Trigger follow-ups', 'Send reminders'],
      cta: 'Help Me Save Time',
      url: 'services/workflow-automation.html',
      interest: 'workflow-automation'
    },
    {
      slug: 'process-documentation',
      name: 'Process & Documentation Systems',
      short: 'Documentation',
      icon: 'fa-folder-tree',
      art: 'assets/gray-matter/services/gm-service-technology-partner.svg',
      problem: 'Everything important is in someone\u2019s head.',
      outcome: 'Turn scattered procedures into one system people can actually use.',
      helps: ['Train new people faster', 'Delegate without re-explaining', 'Keep results consistent', 'Stop depending on one person'],
      cta: 'Organize My Documentation',
      url: 'services/process-documentation.html',
      interest: 'process-documentation'
    },
    {
      slug: 'backup-recovery',
      name: 'Backup & Recovery',
      short: 'Backup',
      icon: 'fa-hard-drive',
      art: 'assets/gray-matter/services/gm-service-backup-recovery.svg',
      problem: 'Everything important lives on one computer.',
      outcome: 'Keep a protected copy of what your business can’t afford to lose.',
      helps: ['Protect customer records', 'Protect contracts and photos', 'Recover after a device fails', 'Keep working after a bad day'],
      cta: 'Protect My Files',
      url: 'services/backup-recovery.html',
      interest: 'backup-recovery'
    },
    {
      slug: 'business-security',
      name: 'Business Security',
      short: 'Security',
      icon: 'fa-lock',
      art: 'assets/gray-matter/services/gm-service-business-security.svg',
      problem: 'I’m not sure who still has access to my business.',
      outcome: 'Lock down the accounts, devices, and information that matter.',
      helps: ['Remove access people shouldn’t have', 'Stop shared passwords', 'Protect business email', 'Protect customer information'],
      cta: 'Protect My Business',
      url: 'services/business-security.html',
      interest: 'business-security'
    },
    {
      slug: 'work-from-anywhere',
      name: 'Work From Anywhere',
      short: 'Remote Access',
      icon: 'fa-location-dot',
      art: 'assets/gray-matter/services/gm-service-work-anywhere.svg',
      problem: 'My business only works from one computer.',
      outcome: 'Reach your files, email, and tools from the office, home, or the road.',
      helps: ['Get to your files anywhere', 'Work securely off-site', 'Share with employees', 'Stop depending on one machine'],
      cta: 'Work From Anywhere',
      url: 'services/work-from-anywhere.html',
      interest: 'work-from-anywhere'
    },
    {
      slug: 'technology-cost-cleanup',
      name: 'Technology Cost Cleanup',
      short: 'Cost Cleanup',
      icon: 'fa-receipt',
      art: 'assets/gray-matter/services/gm-service-cost-cleanup.svg',
      problem: 'I’m paying for things nobody uses.',
      outcome: 'See what you’re paying for, and stop paying for what you don’t use.',
      helps: ['List every subscription', 'Find duplicates', 'Close old accounts', 'Right-size what you keep'],
      cta: 'Review My Technology Costs',
      url: 'services/technology-cost-cleanup.html',
      interest: 'technology-cost-cleanup'
    },
    {
      slug: 'technology-partner',
      name: 'Technology Partner',
      short: 'Ongoing Support',
      icon: 'fa-headset',
      art: 'assets/gray-matter/services/gm-service-technology-partner.svg',
      problem: 'I need a technology person, not a technology department.',
      outcome: 'Have one place to call when technology gets in the way.',
      helps: ['Handle day-to-day issues', 'Keep accounts and backups healthy', 'Make technology decisions with you', 'Plan what’s next'],
      cta: 'Talk About Ongoing Support',
      url: 'services/technology-partner.html',
      interest: 'technology-partner'
    },
    {
      slug: 'business-opportunity-finder',
      name: 'Business Opportunity Finder',
      short: 'Opportunity Finder',
      icon: 'fa-bullseye',
      art: 'assets/gray-matter/services/gm-service-opportunity-finder.svg',
      problem: 'I don’t know who to call next.',
      outcome: 'Get a researched list of businesses and opportunities worth pursuing.',
      helps: ['Target the right businesses', 'Focus on your service area', 'Find contract opportunities', 'Know who to contact'],
      cta: 'Find Opportunities',
      url: 'services/business-opportunity-finder.html',
      interest: 'business-opportunity-finder'
    }
  ];

  /* --- CUSTOMER OUTCOMES ----------------------------------------
     The goal → solution mapping that drives the outcome chooser on
     the homepage and the goal chips on the inquiry form.
  ---------------------------------------------------------------- */
  var outcomes = [
    {
      goal: 'get-more-customers',
      title: 'Get More Customers',
      icon: 'fa-arrow-trend-up',
      description: 'Make it easier for people to find, contact, book, or buy from you.',
      lead: 'Here’s how Gray Matter helps you win more customers',
      services: ['business-websites', 'workflow-automation', 'business-opportunity-finder'],
      cta: 'Help Me Get More Customers'
    },
    {
      goal: 'save-time',
      title: 'Save Time',
      icon: 'fa-clock',
      description: 'Stop repeating the same manual work every single week.',
      lead: 'Here are the ways Gray Matter can help you save time',
      services: ['workflow-automation', 'process-documentation', 'business-websites'],
      cta: 'Help Me Save Time'
    },
    {
      goal: 'organize-my-business',
      title: 'Organize My Business',
      icon: 'fa-folder-tree',
      description: 'Get what\u2019s in your head into a system other people can run.',
      lead: 'Here\u2019s how Gray Matter gets it out of your head',
      services: ['process-documentation', 'workflow-automation', 'technology-partner'],
      cta: 'Organize My Business'
    },
    {
      goal: 'protect-my-business',
      title: 'Protect My Business',
      icon: 'fa-shield-halved',
      description: 'Guard your accounts, devices, files, and customer information.',
      lead: 'Here’s how Gray Matter helps you protect the business',
      services: ['business-security', 'backup-recovery'],
      cta: 'Protect My Business'
    },
    {
      goal: 'work-from-anywhere',
      title: 'Work From Anywhere',
      icon: 'fa-tower-broadcast',
      description: 'Run the business from the shop, the house, or the road.',
      lead: 'Here’s how Gray Matter unties you from one computer',
      services: ['work-from-anywhere', 'backup-recovery'],
      cta: 'Help Me Work From Anywhere'
    },
    {
      goal: 'save-money',
      title: 'Save Money',
      icon: 'fa-piggy-bank',
      description: 'Stop paying for software, accounts, and licenses nobody uses.',
      lead: 'Here’s how Gray Matter helps you cut technology waste',
      services: ['technology-cost-cleanup', 'workflow-automation'],
      cta: 'Help Me Cut Costs'
    },
    {
      goal: 'handle-it-for-me',
      title: 'Handle It For Me',
      icon: 'fa-handshake-angle',
      description: 'You don’t want to manage technology. You want someone who does.',
      lead: 'Here’s what handing it off looks like',
      services: ['technology-partner', 'business-technology-checkup'],
      cta: 'Talk About Ongoing Support'
    },
    {
      // Always last: it's the card for people none of the others fit.
      goal: 'not-sure',
      title: 'Not Sure What I Need',
      icon: 'fa-circle-question',
      description: 'Describe the problem in your own words. We’ll sort out the technology.',
      lead: 'Start here — no technical answers required',
      services: ['business-technology-checkup', 'technology-partner'],
      cta: 'Help Me Figure It Out'
    }
  ];

  /* --- WEBSITE CONFIGURATOR OPTIONS -----------------------------
     "What should customers be able to do?" — each option maps to a
     plain-language summary line and the add-ons it implies.
  ---------------------------------------------------------------- */
  var websiteActions = [
    { id: 'call', label: 'Call', icon: 'fa-phone', summary: 'Call you in one tap', addons: [] },
    { id: 'book', label: 'Book', icon: 'fa-calendar-check', summary: 'Book an appointment', addons: ['Online booking'] },
    { id: 'quote', label: 'Request a Quote', icon: 'fa-file-invoice', summary: 'Request a quote', addons: ['Quote request form'] },
    { id: 'directions', label: 'Get Directions', icon: 'fa-map-location-dot', summary: 'Find your location', addons: ['Google Business Profile setup'] },
    { id: 'services', label: 'View Services', icon: 'fa-list-check', summary: 'Understand what you offer', addons: [] },
    { id: 'pricing', label: 'See Pricing', icon: 'fa-tag', summary: 'See what things cost', addons: [] },
    { id: 'pay', label: 'Pay', icon: 'fa-credit-card', summary: 'Pay you online', addons: ['Online payments'] },
    { id: 'buy', label: 'Buy', icon: 'fa-cart-shopping', summary: 'Buy products or packages', addons: ['Online store'] },
    { id: 'apply', label: 'Apply', icon: 'fa-pen-to-square', summary: 'Apply or sign up', addons: ['Application form'] },
    { id: 'upload', label: 'Upload Information', icon: 'fa-cloud-arrow-up', summary: 'Send you documents or photos', addons: ['File upload form'] },
    { id: 'staff', label: 'Choose a Team Member', icon: 'fa-user-group', summary: 'Pick who they work with', addons: ['Team profiles', 'Online booking'] },
    { id: 'work', label: 'View Your Work', icon: 'fa-images', summary: 'See examples of your work', addons: ['Photo gallery'] }
  ];

  /* What every website build starts from. Kept identical to the Starter
     package on pricing.html: booking, payments, stores, and Google Business
     Profile setup are separate scope, never universal inclusions. */
  var websiteBaseAddons = ['Mobile-friendly design', 'Contact form', 'Basic on-page SEO setup'];

  /* --- WORKFLOW AUTOMATION OPTIONS ------------------------------ */
  var automationTasks = [
    { id: 'confirmations', label: 'Sending confirmations', icon: 'fa-envelope-circle-check', summary: 'Confirmations send themselves' },
    { id: 'follow-up', label: 'Following up', icon: 'fa-reply', summary: 'Follow-ups go out on time' },
    { id: 'social-orders', label: 'Taking orders in Facebook or Instagram messages', icon: 'fa-comments', summary: 'Orders from social media land in one tracked list' },
    { id: 'order-status', label: 'Keeping track of order status', icon: 'fa-list-check', summary: 'Every order shows where it stands, start to finish' },
    { id: 'copying', label: 'Copying customer information', icon: 'fa-copy', summary: 'Customer details land where they belong' },
    { id: 'spreadsheets', label: 'Updating spreadsheets', icon: 'fa-table', summary: 'Records update themselves' },
    { id: 'scheduling', label: 'Scheduling', icon: 'fa-calendar-days', summary: 'Customers book their own slot' },
    { id: 'reminders', label: 'Sending reminders', icon: 'fa-bell', summary: 'Reminders go out before appointments' },
    { id: 'reviews', label: 'Requesting reviews', icon: 'fa-star', summary: 'Review requests send after the job' },
    { id: 'reports', label: 'Creating reports', icon: 'fa-chart-column', summary: 'Reports build themselves' },
    { id: 'ai-tools', label: 'Juggling too many AI tools', icon: 'fa-robot', summary: 'Your AI tools land in one organized system' },
    { id: 'ai-routing', label: 'Knowing which AI to use for what', icon: 'fa-route', summary: 'Each job goes to the AI that’s actually good at it' }
  ];

  /* --- OPPORTUNITY FINDER OPTIONS ------------------------------- */
  var opportunityTargets = [
    { id: 'new-customers', label: 'New Customers', icon: 'fa-user-plus' },
    { id: 'business-clients', label: 'Business Clients', icon: 'fa-building' },
    { id: 'government', label: 'Government Opportunities', icon: 'fa-landmark' },
    { id: 'corporate', label: 'Corporate Opportunities', icon: 'fa-city' },
    { id: 'subcontracting', label: 'Subcontracting Work', icon: 'fa-helmet-safety' },
    { id: 'contractors', label: 'Contractors', icon: 'fa-screwdriver-wrench' },
    { id: 'partnerships', label: 'Partnerships', icon: 'fa-handshake' }
  ];

  var opportunityAreas = [
    { id: 'local', label: 'Local', icon: 'fa-location-crosshairs' },
    { id: 'alabama', label: 'Alabama', icon: 'fa-map' },
    { id: 'southeast', label: 'Southeast', icon: 'fa-compass' },
    { id: 'nationwide', label: 'Nationwide', icon: 'fa-globe' },
    { id: 'custom', label: 'A Custom Area', icon: 'fa-draw-polygon' }
  ];


  /* --- SERVICE-PAGE OPTION SETS -------------------------------
     Part 2 standard: every service page lets the visitor say which
     part of the problem is theirs, and carries that into the inquiry
     form. Same chip + summary components as the website and automation
     configurators — one interaction model across the whole site.
  ---------------------------------------------------------------- */
  var checkupConcerns = [
    { id: 'website', label: 'My website', icon: 'fa-desktop', summary: 'Whether your website is doing its job' },
    { id: 'backups', label: 'My backups', icon: 'fa-hard-drive', summary: 'Whether your files are actually protected' },
    { id: 'security', label: 'Who has access', icon: 'fa-lock', summary: 'Who can reach your accounts and information' },
    { id: 'manual-work', label: 'Repetitive work', icon: 'fa-diagram-project', summary: 'Which routine tasks could run themselves' },
    { id: 'costs', label: 'What I\u2019m paying', icon: 'fa-receipt', summary: 'What you\u2019re spending and what you could stop' },
    { id: 'everything', label: 'Honestly, all of it', icon: 'fa-circle-question', summary: 'A full review, since nothing has been looked at' }
  ];

  var backupAssets = [
    { id: 'customers', label: 'Customer records', icon: 'fa-address-book', summary: 'Customer records kept safe' },
    { id: 'photos', label: 'Photos of my work', icon: 'fa-images', summary: 'Work photos kept safe' },
    { id: 'contracts', label: 'Contracts', icon: 'fa-file-signature', summary: 'Signed contracts kept safe' },
    { id: 'financial', label: 'Financial documents', icon: 'fa-file-invoice-dollar', summary: 'Invoices and tax records kept safe' },
    { id: 'files', label: 'Business files', icon: 'fa-folder-open', summary: 'Quotes, templates, and working files kept safe' },
    { id: 'email', label: 'Email history', icon: 'fa-envelope', summary: 'Your email paper trail kept safe' }
  ];

  var securityRisks = [
    { id: 'former-staff', label: 'A former employee still has access', icon: 'fa-user-slash', summary: 'Old access removed' },
    { id: 'shared-password', label: 'Everyone shares one password', icon: 'fa-key', summary: 'Shared logins replaced with individual access' },
    { id: 'email', label: 'My business email isn\u2019t protected', icon: 'fa-envelope-open', summary: 'Business email locked down' },
    { id: 'device', label: 'A laptop or phone could go missing', icon: 'fa-laptop', summary: 'Lost devices stop being a crisis' },
    { id: 'customer-data', label: 'Customer information is lying around', icon: 'fa-address-card', summary: 'Customer information kept where it belongs' },
    { id: 'social', label: 'Business social accounts', icon: 'fa-hashtag', summary: 'Business accounts recoverable and controlled' }
  ];

  var remoteNeeds = [
    { id: 'files', label: 'Get to my files', icon: 'fa-folder-open', summary: 'Your files reachable from anywhere' },
    { id: 'email', label: 'Get to my email', icon: 'fa-envelope', summary: 'Email on whatever device you have' },
    { id: 'apps', label: 'Use my business tools', icon: 'fa-toolbox', summary: 'Your business tools available off-site' },
    { id: 'team', label: 'Share with my team', icon: 'fa-user-group', summary: 'Employees get what they need, and only that' },
    { id: 'jobsite', label: 'Work from job sites', icon: 'fa-truck', summary: 'The job site works like the office' },
    { id: 'travel', label: 'Work while traveling', icon: 'fa-plane', summary: 'Travel stops pausing the business' }
  ];

  var costAreas = [
    { id: 'software', label: 'Software subscriptions', icon: 'fa-cubes', summary: 'Every subscription listed and checked' },
    { id: 'hosting', label: 'Website and domains', icon: 'fa-globe', summary: 'Hosting and domains reviewed' },
    { id: 'storage', label: 'Cloud storage', icon: 'fa-cloud', summary: 'Storage plans right-sized' },
    { id: 'phone', label: 'Phone and internet', icon: 'fa-phone', summary: 'Phone and internet plans reviewed' },
    { id: 'old-accounts', label: 'Old accounts nobody uses', icon: 'fa-ghost', summary: 'Forgotten accounts closed' },
    { id: 'unknown', label: 'I genuinely don\u2019t know', icon: 'fa-circle-question', summary: 'A full list of what leaves your account each month' }
  ];

  var partnerTasks = [
    { id: 'website', label: 'Website updates', icon: 'fa-desktop', summary: 'Website changes handled' },
    { id: 'accounts', label: 'Account and email problems', icon: 'fa-user-lock', summary: 'Account and email problems handled' },
    { id: 'onboarding', label: 'Setting up new employees', icon: 'fa-user-plus', summary: 'New employee setup handled' },
    { id: 'backups', label: 'Keeping backups working', icon: 'fa-hard-drive', summary: 'Backups checked so you don\u2019t have to' },
    { id: 'security', label: 'Security questions', icon: 'fa-lock', summary: 'Someone to answer the security questions' },
    { id: 'decisions', label: 'Choosing new tools', icon: 'fa-compass-drafting', summary: 'A second opinion before you buy' }
  ];


  /* --- QUICK PERSONALIZATION ------------------------------------
     After a goal is picked we ask 1-3 plain business questions, never
     technical ones, then turn the answers into one recommended starting
     point. Two or three taps, no typing, and every question is skippable.
  ---------------------------------------------------------------- */
  var BUSINESS_TYPES = [
    { id: 'salon', label: 'Salon or barber' },
    { id: 'trades', label: 'Contractor or home services' },
    { id: 'professional', label: 'Professional services' },
    { id: 'local', label: 'Another local service business' },
    { id: 'online', label: 'Online or product business' },
    { id: 'other', label: 'Something else' }
  ];

  function businessQuestion() {
    return { id: 'business', label: 'What kind of business do you run?', options: BUSINESS_TYPES };
  }

  var personalization = {
    'get-more-customers': [
      businessQuestion(),
      { id: 'contact', label: 'How do customers reach you now?', options: [
        { id: 'dm', label: 'Social media messages' },
        { id: 'phone', label: 'Phone calls' },
        { id: 'booking', label: 'A booking app' },
        { id: 'website', label: 'My website' },
        { id: 'walkin', label: 'They just show up' }
      ]},
      { id: 'improve', label: 'What would you most like to improve?', options: [
        { id: 'bookings', label: 'More bookings' },
        { id: 'quotes', label: 'More quote requests' },
        { id: 'professional', label: 'Look more established' },
        { id: 'easier', label: 'Make booking easier' }
      ]}
    ],
    'save-time': [
      businessQuestion(),
      { id: 'repeat', label: 'What do you repeat most often?', options: [
        { id: 'confirmations', label: 'Sending confirmations' },
        { id: 'followup', label: 'Chasing follow-ups' },
        { id: 'dataentry', label: 'Copying the same information twice' },
        { id: 'scheduling', label: 'Scheduling back and forth' },
        { id: 'reports', label: 'Building the same report' }
      ]},
      { id: 'written', label: 'Is the process written down anywhere?', options: [
        { id: 'no', label: 'No, it’s in my head' },
        { id: 'partly', label: 'Partly, and out of date' },
        { id: 'yes', label: 'Yes, it’s documented' }
      ]}
    ],
    'organize-my-business': [
      businessQuestion(),
      { id: 'where', label: 'Where do your procedures live now?', options: [
        { id: 'heads', label: 'In people’s heads' },
        { id: 'scattered', label: 'Scattered files and screenshots' },
        { id: 'stale', label: 'Written down but out of date' },
        { id: 'none', label: 'Nowhere yet' }
      ]},
      { id: 'why', label: 'What are you trying to make possible?', options: [
        { id: 'delegate', label: 'Hand work to someone else' },
        { id: 'consistency', label: 'Get consistent results' },
        { id: 'continuity', label: 'Stop depending on one person' },
        { id: 'scale', label: 'Prepare to grow' }
      ]}
    ],
    'protect-my-business': [
      businessQuestion(),
      { id: 'worry', label: 'What worries you most?', options: [
        { id: 'access', label: 'Who still has access' },
        { id: 'files', label: 'Losing files' },
        { id: 'email', label: 'Someone getting into my email' },
        { id: 'unsure', label: 'Not sure, just uneasy' }
      ]}
    ],
    'work-from-anywhere': [
      businessQuestion(),
      { id: 'where', label: 'Where do you need to work from?', options: [
        { id: 'home', label: 'Home' },
        { id: 'jobsite', label: 'Job sites' },
        { id: 'travel', label: 'On the road' },
        { id: 'multi', label: 'More than one location' }
      ]}
    ],
    'save-money': [
      businessQuestion(),
      { id: 'suspect', label: 'What do you suspect is happening?', options: [
        { id: 'unused', label: 'Paying for things nobody uses' },
        { id: 'duplicate', label: 'Two tools doing one job' },
        { id: 'unknown', label: 'I don’t know what I pay for' }
      ]}
    ],
    'handle-it-for-me': [
      businessQuestion(),
      { id: 'who', label: 'Who handles technology today?', options: [
        { id: 'me', label: 'Me, on top of everything else' },
        { id: 'employee', label: 'An employee, unofficially' },
        { id: 'nobody', label: 'Nobody, really' },
        { id: 'mixed', label: 'Different people, different things' }
      ]}
    ],
    'not-sure': [
      businessQuestion(),
      { id: 'friction', label: 'What’s the most annoying part right now?', options: [
        { id: 'customers', label: 'Not enough customers' },
        { id: 'admin', label: 'Too much admin work' },
        { id: 'messy', label: 'Nothing is written down' },
        { id: 'breaking', label: 'Things keep breaking' },
        { id: 'unsure', label: 'Genuinely not sure' }
      ]}
    ]
  };

  /* --- RECOMMENDATION RULES -------------------------------------
     First matching rule wins, so put the specific ones first. `when` is
     matched against the answers; a rule with no `when` is the goal's
     default. `why` is one sentence, in the customer's own terms.
  ---------------------------------------------------------------- */
  var recommendationRules = [
    { goal: 'get-more-customers', when: { contact: 'dm' }, service: 'business-websites',
      addons: ['Online booking', 'Follow-up automation'],
      why: 'Customers currently have to message you to ask about services, prices, and availability, so the fastest win is a place that answers all three and takes the booking.' },
    { goal: 'get-more-customers', when: { improve: 'quotes' }, service: 'business-websites',
      addons: ['Quote request form', 'Photo gallery', 'Follow-up automation'],
      why: 'Quote requests convert best when someone can see your past work and send you the job details in one go, instead of starting with a phone call.' },
    { goal: 'get-more-customers', when: { contact: 'walkin' }, service: 'business-websites',
      addons: ['Google Business Profile setup', 'Online booking'],
      why: 'If people mostly find you by walking past, the missing piece is being findable by everyone who does not.' },
    { goal: 'get-more-customers', service: 'business-websites',
      addons: ['Online booking', 'Quote request form'],
      why: 'One place that explains what you do and lets people act on it is the shortest path to more customers.' },

    { goal: 'save-time', when: { written: 'no' }, service: 'process-documentation',
      addons: ['Workflow Automation once the steps are clear'],
      why: 'The steps live in your head right now, and automating something undefined just makes the mess run faster — so we write it down first, simplify it, then automate the right parts.' },
    { goal: 'save-time', service: 'workflow-automation',
      addons: ['Forms and notifications', 'Follow-up automation'],
      why: 'The repetitive parts of the job are already well defined, which makes them the easiest thing to hand to a system.' },

    { goal: 'organize-my-business', when: { where: 'heads' }, service: 'process-documentation',
      addons: ['SOPs and checklists', 'Workflow Automation later'],
      why: 'Nothing can be delegated while it only exists in someone’s memory, so the first job is getting it out and into a form other people can follow.' },
    { goal: 'organize-my-business', service: 'process-documentation',
      addons: ['Document cleanup', 'One current version of everything'],
      why: 'You have the material already — it just needs to become one organized, current system instead of scattered files.' },

    { goal: 'protect-my-business', when: { worry: 'files' }, service: 'backup-recovery',
      addons: ['Tested restores', 'Business Security review'],
      why: 'Losing files is the risk you named, and a backup nobody has tested is the one that fails on the day it matters.' },
    { goal: 'protect-my-business', service: 'business-security',
      addons: ['Access review', 'Backup & Recovery'],
      why: 'Most small business incidents start with access someone still has and nobody remembered to remove.' },

    { goal: 'work-from-anywhere', service: 'work-from-anywhere',
      addons: ['Secure remote access', 'Backup & Recovery'],
      why: 'Getting to your files from anywhere is straightforward; doing it safely is the part worth setting up properly.' },

    { goal: 'save-money', service: 'technology-cost-cleanup',
      addons: ['Subscription review', 'Consolidation plan'],
      why: 'You cannot cut what you cannot see, so this starts with a full list of what actually leaves your account each month.' },

    { goal: 'handle-it-for-me', when: { who: 'me' }, service: 'technology-partner',
      addons: ['Business Technology Checkup first'],
      why: 'You are the technology department right now, so the first step is a checkup that tells us what you have been carrying.' },
    { goal: 'handle-it-for-me', service: 'technology-partner',
      addons: ['Business Technology Checkup first'],
      why: 'One place to call works best once someone has actually looked at what you are running.' },

    { goal: 'not-sure', when: { friction: 'customers' }, service: 'business-websites',
      addons: ['Business Technology Checkup'],
      why: 'You named customers as the problem, so we would start where customers actually meet your business.' },
    { goal: 'not-sure', when: { friction: 'admin' }, service: 'workflow-automation',
      addons: ['Business Technology Checkup'],
      why: 'Admin work is the friction you named, and it is usually the easiest thing to measurably reduce.' },
    { goal: 'not-sure', when: { friction: 'messy' }, service: 'process-documentation',
      addons: ['Business Technology Checkup'],
      why: 'Nothing being written down is the constraint under most of the other problems, so it is the right place to begin.' },
    { goal: 'not-sure', service: 'business-technology-checkup',
      addons: ['A prioritized list of what to fix first'],
      why: 'When nothing stands out as the obvious problem, a checkup is the cheapest way to find out what actually is.' }
  ];

  /* --- PRODUCT LADDER -------------------------------------------
     How far the visitor wants to go, not what it costs. No prices are
     stated anywhere because none have been set; each level routes into
     the inquiry flow carrying the visitor's chosen level of commitment.
  ---------------------------------------------------------------- */
  var ladder = [
    { id: 'plan', title: 'Start Small', quote: 'Show me what I should do.',
      description: 'A written recommendation you could act on yourself.', cta: 'Get My Plan', icon: 'fa-map' },
    { id: 'build', title: 'Have Us Build It', quote: 'Set this up for me.',
      description: 'We implement the recommended solution end to end.', cta: 'Build It For Me', icon: 'fa-hammer' },
    { id: 'custom', title: 'Build Something Custom', quote: 'My business needs something specific.',
      description: 'Scoped around how your business actually runs.', cta: 'Talk About My Business', icon: 'fa-compass-drafting' },
    { id: 'ongoing', title: 'Have Us Manage It', quote: 'Help me keep it working.',
      description: 'Ongoing support so technology stops landing on you.', cta: 'Handle This For Me', icon: 'fa-headset' }
  ];

  /* --- HOMEPAGE SHORTLISTS ---------------------------------------
     The homepage routes; the All Services page owns the full catalog.
  ---------------------------------------------------------------- */
  var homeSolutions = ['business-websites', 'workflow-automation', 'process-documentation',
                       'business-technology-checkup', 'business-opportunity-finder', 'technology-partner'];

  var audienceGroups = [
    { id: 'local', title: 'Local Service Businesses', icon: 'fa-store',
      members: ['Barbers & salons', 'Detailers', 'Contractors', 'Home services', 'Cleaning & turnover'],
      industries: ['barbers-salons', 'detailers', 'contractors', 'cleaning-services'] },
    { id: 'professional', title: 'Professional & Appointment Businesses', icon: 'fa-briefcase',
      members: ['Real estate', 'Consultants', 'Clinics & studios', 'Professional services'],
      industries: ['real-estate', 'appointment-businesses', 'professional-services'] },
    { id: 'growing', title: 'Owners & Growing Businesses', icon: 'fa-seedling',
      members: ['Solo founders', 'Food trucks & mobile', 'Teams outgrowing their tools'],
      industries: ['entrepreneurs', 'food-trucks'] }
  ];

  /* --- LOW-TICKET DIGITAL PRODUCTS -------------------------------
     Intentionally empty. The card and page architecture reads from this
     list, but no product ships until a real price and a real deliverable
     exist. Shape:
     { slug, name, forWho, problem, deliverable, outcome, price, service }
  ---------------------------------------------------------------- */
  var products = [];


  var docNeeds = [
    { id: 'onboarding', label: 'Training new people', icon: 'fa-user-plus', summary: 'New people can get productive without shadowing you' },
    { id: 'delegate', label: 'Handing work off', icon: 'fa-share-nodes', summary: 'Work can be delegated without re-explaining it' },
    { id: 'consistency', label: 'Everyone doing it differently', icon: 'fa-arrows-to-dot', summary: 'The same job gets done the same way' },
    { id: 'scattered', label: 'Files scattered everywhere', icon: 'fa-folder-open', summary: 'One current version, one place' },
    { id: 'keyperson', label: 'One person knows everything', icon: 'fa-user-shield', summary: 'The business stops depending on one memory' },
    { id: 'compliance', label: 'Proving how we do things', icon: 'fa-clipboard-list', summary: 'Written procedures you can show someone' }
  ];

  /* --- TRANSFORMATIONS (before → after) -------------------------
     Generic transformations, not client results. Every one of these
     describes a category of change, never a measured outcome.
  ---------------------------------------------------------------- */
  var transformations = [
    {
      id: 'website',
      title: 'Your Online Presence',
      label: 'Invisible → Found',
      service: 'business-websites',
      before: ['Scattered social links', 'No clear pricing', 'Customers DM to book'],
      after: ['One professional website', 'Clear services and pricing', 'Easy online booking'],
      result: 'Customers can find you and take action without messaging you first.'
    },
    {
      id: 'automation',
      title: 'Your Weekly Admin Work',
      label: 'Manual → Automatic',
      service: 'workflow-automation',
      before: ['Copy', 'Paste', 'Email', 'Remember', 'Follow up manually'],
      after: ['Customer submits information', 'Systems update', 'Notifications send', 'Follow-up happens'],
      result: 'The routine parts of the job stop needing you.'
    },
    {
      id: 'backup',
      title: 'Your Business Files',
      label: 'Vulnerable → Protected',
      service: 'backup-recovery',
      before: ['One computer holds everything'],
      after: ['Important business data is protected and recoverable'],
      result: 'A dead laptop becomes an inconvenience instead of a disaster.'
    },
    {
      id: 'opportunities',
      title: 'Your Sales Pipeline',
      label: 'Guessing → Targeted',
      service: 'business-opportunity-finder',
      before: ['I don’t know who to call'],
      after: ['I have a targeted list of businesses worth pursuing'],
      result: 'Outreach starts from research instead of a blank page.'
    }
  ];

  /* --- TECH FIT TO COMPLETION ----------------------------------- */
  var roadmapPreview = [
    { n: 1, title: 'Tell Us', text: 'Describe the problem in your own words.' },
    { n: 2, title: 'Fit Check', text: 'We confirm we’re the right people for it.' },
    { n: 3, title: 'Recommend', text: 'You get a plain-language recommendation.' },
    { n: 4, title: 'Build', text: 'We scope it, build it, and test it.' },
    { n: 5, title: 'Launch', text: 'It goes live — and we’re still here.' }
  ];

  /* --- INDUSTRIES ------------------------------------------------ */
  var industries = [
    {
      slug: 'barbers-salons',
      name: 'Barbers & Salons',
      icon: 'fa-scissors',
      need: 'Find the shop, see the work, book a chair.',
      url: 'industries/barbers-salons.html',
      services: ['business-websites', 'workflow-automation']
    },
    {
      slug: 'detailers',
      name: 'Detailers',
      icon: 'fa-car',
      need: 'See packages, understand pricing, book a slot.',
      url: 'industries/detailers.html',
      services: ['business-websites', 'workflow-automation']
    },
    {
      slug: 'contractors',
      name: 'Contractors & Home Services',
      icon: 'fa-helmet-safety',
      need: 'See past work, trust the crew, request a quote.',
      url: 'industries/contractors.html',
      services: ['business-websites', 'workflow-automation', 'business-opportunity-finder']
    },
    {
      slug: 'real-estate',
      name: 'Real Estate Professionals',
      icon: 'fa-house',
      need: 'Find you, trust you, and reach you fast.',
      url: 'industries/real-estate.html',
      services: ['business-websites', 'workflow-automation']
    },
    {
      slug: 'appointment-businesses',
      name: 'Appointment Businesses',
      icon: 'fa-calendar-check',
      need: 'Pick a service, pick a time, get a reminder.',
      url: 'industries/appointment-businesses.html',
      services: ['business-websites', 'workflow-automation', 'technology-partner']
    },
    {
      slug: 'entrepreneurs',
      name: 'Entrepreneurs & Solo Founders',
      icon: 'fa-rocket',
      need: 'Explain the offer, build trust, and let people act on it.',
      url: 'industries/entrepreneurs.html',
      services: ['business-websites', 'workflow-automation', 'business-opportunity-finder']
    },
    {
      slug: 'food-trucks',
      name: 'Food Trucks & Mobile Food',
      icon: 'fa-truck',
      need: 'Find today’s location, read the menu, book catering.',
      url: 'industries/food-trucks.html',
      services: ['business-websites', 'workflow-automation', 'technology-partner']
    },
    {
      slug: 'cleaning-services',
      name: 'Cleaning & Turnover Services',
      icon: 'fa-spray-can-sparkles',
      need: 'See what’s included, trust the result, request a quote.',
      url: 'industries/cleaning-services.html',
      services: ['business-websites', 'workflow-automation', 'business-security']
    },
    {
      slug: 'professional-services',
      name: 'Professional Services',
      icon: 'fa-briefcase',
      need: 'Understand the service, share documents, get started.',
      url: 'industries/professional-services.html',
      services: ['business-websites', 'business-security', 'backup-recovery']
    }
  ];

  /* --- CASE STUDIES ---------------------------------------------
     Intentionally empty until real, approved client work is
     supplied. Nothing here is invented. The shape below documents
     the fields the case-study card and detail template read, so a
     real project can be added without touching any component.

     {
       slug, client, industry, problem, goal,
       before: [], built: [], after: [],
       result, services: [slugs], image, imageAlt,
       testimonial: { quote, attribution }
     }
  ---------------------------------------------------------------- */
  var caseStudies = [];

  /* --- WEBSITE PACKAGES -----------------------------------------
     Mirrors the published pricing on pricing.html. Prices are the
     business's own; none are invented here.
  ---------------------------------------------------------------- */
  var packages = [
    {
      id: 'starter',
      tier: 'Starter',
      name: 'Essential Site',
      price: 'From $750',
      forWho: 'I need a professional website.',
      outcome: 'Customers can find you, understand what you do, and get in touch.',
      features: ['Up to 3 pages', 'Mobile-friendly design', 'Contact form', 'Social links', 'Basic search setup', 'Delivered in 7–10 business days'],
      featured: false
    },
    {
      id: 'business',
      tier: 'Business',
      name: 'Business Site',
      price: 'From $1,500',
      forWho: 'I want customers to contact or book me.',
      outcome: 'Customers can browse services, see pricing, and book without calling.',
      features: ['Up to 5 customized pages', 'Online booking', 'Inquiry form', 'Services and pricing', 'Photo gallery', 'Search and analytics setup', 'Delivered in 2–3 weeks'],
      featured: true
    },
    {
      id: 'growth',
      tier: 'Growth',
      name: 'Full Platform',
      price: 'From $3,000',
      forWho: 'I want my website connected to how my business runs.',
      outcome: 'The website feeds the rest of your business instead of sitting beside it.',
      features: ['Up to 8 pages', 'Booking and payments', 'Defined e-commerce or digital-product scope', 'One core automation integration', 'Lead capture', 'Analytics and conversion tracking', 'Delivered in 4–6 weeks'],
      featured: false
    }
  ];

  /* --- HELPERS --------------------------------------------------- */
  function root() {
    return (document.body && document.body.dataset.root) || '';
  }

  function url(path) {
    return root() + path;
  }

  function getService(slug) {
    for (var i = 0; i < services.length; i++) {
      if (services[i].slug === slug) return services[i];
    }
    return null;
  }

  // 'get-found' was merged into 'get-more-customers'; old links still resolve.
  var GOAL_ALIASES = { 'get-found': 'get-more-customers' };

  function getOutcome(goal) {
    goal = GOAL_ALIASES[goal] || goal;
    for (var i = 0; i < outcomes.length; i++) {
      if (outcomes[i].goal === goal) return outcomes[i];
    }
    return null;
  }

  /* Deep-link into the shared inquiry form carrying the visitor's
     context, e.g. contact.html?service=workflow-automation&goal=save-time */
  /** Pick the first matching recommendation rule for a goal + answers. */
  function recommend(goal, answers) {
    goal = GOAL_ALIASES[goal] || goal;
    answers = answers || {};
    var fallback = null;
    for (var i = 0; i < recommendationRules.length; i++) {
      var r = recommendationRules[i];
      if (r.goal !== goal) continue;
      if (!r.when) { if (!fallback) fallback = r; continue; }
      var ok = true;
      for (var k in r.when) { if (answers[k] !== r.when[k]) { ok = false; break; } }
      if (ok) return r;
    }
    return fallback;
  }

  function inquiryUrl(serviceSlug, goal) {
    var qs = [];
    if (serviceSlug) qs.push('service=' + encodeURIComponent(serviceSlug));
    if (goal) qs.push('goal=' + encodeURIComponent(goal));
    return url('contact.html') + (qs.length ? '?' + qs.join('&') : '');
  }

  global.GM_DATA = {
    services: services,
    outcomes: outcomes,
    personalization: personalization,
    recommendationRules: recommendationRules,
    ladder: ladder,
    homeSolutions: homeSolutions,
    audienceGroups: audienceGroups,
    products: products,
    websiteActions: websiteActions,
    websiteBaseAddons: websiteBaseAddons,
    automationTasks: automationTasks,
    checkupConcerns: checkupConcerns,
    backupAssets: backupAssets,
    securityRisks: securityRisks,
    remoteNeeds: remoteNeeds,
    costAreas: costAreas,
    partnerTasks: partnerTasks,
    docNeeds: docNeeds,
    opportunityTargets: opportunityTargets,
    opportunityAreas: opportunityAreas,
    transformations: transformations,
    roadmapPreview: roadmapPreview,
    industries: industries,
    caseStudies: caseStudies,
    packages: packages,
    root: root,
    url: url,
    getService: getService,
    getOutcome: getOutcome,
    recommend: recommend,
    inquiryUrl: inquiryUrl
  };
})(window);
