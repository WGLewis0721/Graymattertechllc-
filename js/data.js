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
      goal: 'get-found',
      title: 'Get Found',
      icon: 'fa-magnifying-glass-location',
      description: 'Show up when people search for what you do.',
      lead: 'Here’s how Gray Matter helps customers find you',
      services: ['business-websites', 'business-technology-checkup'],
      cta: 'Help Me Get Found'
    },
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
      services: ['workflow-automation', 'business-websites', 'technology-partner'],
      cta: 'Help Me Save Time'
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
      goal: 'not-sure',
      title: 'I Don’t Know What I Need',
      icon: 'fa-circle-question',
      description: 'Describe the problem in your own words. We’ll sort out the technology.',
      lead: 'Start here — no technical answers required',
      services: ['business-technology-checkup', 'technology-partner'],
      cta: 'Help Me Figure It Out'
    },
    {
      goal: 'handle-it-for-me',
      title: 'Handle It For Me',
      icon: 'fa-handshake-angle',
      description: 'You don’t want to manage technology. You want someone who does.',
      lead: 'Here’s what handing it off looks like',
      services: ['technology-partner', 'business-technology-checkup'],
      cta: 'Talk About Ongoing Support'
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

  /* Add-ons every recommended setup starts from. */
  var websiteBaseAddons = ['Mobile-friendly design', 'Contact form', 'Google Business Profile setup'];

  /* --- WORKFLOW AUTOMATION OPTIONS ------------------------------ */
  var automationTasks = [
    { id: 'confirmations', label: 'Sending confirmations', icon: 'fa-envelope-circle-check', summary: 'Confirmations send themselves' },
    { id: 'follow-up', label: 'Following up', icon: 'fa-reply', summary: 'Follow-ups go out on time' },
    { id: 'copying', label: 'Copying customer information', icon: 'fa-copy', summary: 'Customer details land where they belong' },
    { id: 'spreadsheets', label: 'Updating spreadsheets', icon: 'fa-table', summary: 'Records update themselves' },
    { id: 'scheduling', label: 'Scheduling', icon: 'fa-calendar-days', summary: 'Customers book their own slot' },
    { id: 'reminders', label: 'Sending reminders', icon: 'fa-bell', summary: 'Reminders go out before appointments' },
    { id: 'reviews', label: 'Requesting reviews', icon: 'fa-star', summary: 'Review requests send after the job' },
    { id: 'reports', label: 'Creating reports', icon: 'fa-chart-column', summary: 'Reports build themselves' }
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
      price: '$250 – $350',
      forWho: 'I need a professional website.',
      outcome: 'Customers can find you, understand what you do, and get in touch.',
      features: ['Up to 3 pages', 'Mobile-friendly design', 'Contact form', 'Social links', 'Basic search setup', 'Delivered in 5–7 days'],
      featured: false
    },
    {
      id: 'business',
      tier: 'Business',
      name: 'Business Site',
      price: '$500 – $800',
      forWho: 'I want customers to contact or book me.',
      outcome: 'Customers can browse services, see pricing, and book without calling.',
      features: ['Up to 6 custom pages', 'Online booking', 'Inquiry form', 'Services and pricing', 'Photo gallery', 'Search and analytics setup', 'Delivered in 7–14 days'],
      featured: true
    },
    {
      id: 'growth',
      tier: 'Growth',
      name: 'Full Platform',
      price: '$1,000+',
      forWho: 'I want my website connected to how my business runs.',
      outcome: 'The website feeds the rest of your business instead of sitting beside it.',
      features: ['Unlimited pages', 'Booking and payments', 'Online store or digital products', 'Follow-up automation', 'Lead capture', 'Analytics and conversion tracking', 'Delivered in 2–4 weeks'],
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

  function getOutcome(goal) {
    for (var i = 0; i < outcomes.length; i++) {
      if (outcomes[i].goal === goal) return outcomes[i];
    }
    return null;
  }

  /* Deep-link into the shared inquiry form carrying the visitor's
     context, e.g. contact.html?service=workflow-automation&goal=save-time */
  function inquiryUrl(serviceSlug, goal) {
    var qs = [];
    if (serviceSlug) qs.push('service=' + encodeURIComponent(serviceSlug));
    if (goal) qs.push('goal=' + encodeURIComponent(goal));
    return url('contact.html') + (qs.length ? '?' + qs.join('&') : '');
  }

  global.GM_DATA = {
    services: services,
    outcomes: outcomes,
    websiteActions: websiteActions,
    websiteBaseAddons: websiteBaseAddons,
    automationTasks: automationTasks,
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
    inquiryUrl: inquiryUrl
  };
})(window);
