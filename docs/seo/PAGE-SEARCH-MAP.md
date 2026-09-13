# Page Search Map — Gray Matter Digital Solutions

Inventory of every public, indexable URL on graymatterdigitalsolutions.com. URLs are the clean canonical form fixed in `ROUND-1-TECHNICAL-AUDIT.md` (Phase 1). `portfolio.html` and `client-demos/*` are excluded — both intentionally `noindex` (see Phase 1 audit, Findings 3 and 6).

## Priority pages (detailed)

### Homepage — `/`
- **Purpose:** Brand entry point and goal-first funnel. Visitor picks an outcome, gets a starting point, builds a plan, and is routed to Contact.
- **Primary search intent:** Digital and technology solutions in Montgomery, Alabama (broad brand + location query; the visitor may not know which specific service they need yet).
- **Title:** `Small Business Technology Solutions in Montgomery, AL | Gray Matter LLC`
- **Meta description:** `Tell us what needs to change — we figure out the technology. Choose your goal, build a plan, and approve it before we start. Montgomery, Alabama and nationwide.`
- **H1:** `Tell us what needs to change. We figure out the technology.`
- **Canonical:** `https://graymatterdigitalsolutions.com/`
- **Intended internal links:** → Services (catalog), → each of the 10 service pages (via the funnel and mega-menu), → Industries, → Pricing, → About, → Contact, → Cloud Consulting (technical-buyer path). All present.

### Services (catalog) — `/services`
- **Purpose:** Hub page listing all ten productized services as problem → outcome cards. Exists for visitors who already know they want to browse options, and as the internal-linking hub search engines use to reach every service page.
- **Primary search intent:** Browsing all available technology services (comparison / catalog intent) — distinct from the homepage's broader, goal-first brand intent.
- **Title:** `Browse All Technology Services | Gray Matter LLC — Montgomery, AL` *(changed this round — see below)*
- **Meta description:** `Ten productized technology services for small businesses: websites, automation, backups, security, remote access, cost cleanup, and ongoing IT support.`
- **H1:** `Everything Gray Matter Can Build For You`
- **Canonical:** `https://graymatterdigitalsolutions.com/services`
- **Intended internal links:** → all 10 service pages, → Contact. Already carries `Service` `ItemList` and `BreadcrumbList` JSON-LD.
- **Change made:** the previous title (`Small Business Technology Services | Gray Matter LLC — Montgomery, AL`) and `og:title` (`Services | Small Business Technology Solutions | Gray Matter LLC`) were near-duplicates of the homepage title and risked keyword cannibalization on the same "small business technology [solutions/services] Montgomery" query. Retitled around the catalog/browse intent instead, and trimmed the meta description from 244 to 151 characters.

### Business Websites — `/services/business-websites`
- **Purpose:** Sell the website-design service.
- **Primary search intent:** Small business website design in Montgomery, AL.
- **Title:** `Small Business Website Design in Montgomery, AL | Gray Matter LLC`
- **Meta description:** `Small business website design with online booking, quote requests, payments, galleries, and Google setup. Serving Montgomery, Alabama and remote clients nationwide.`
- **H1:** `Your Website Should Do More Than Look Good`
- **Canonical:** `https://graymatterdigitalsolutions.com/services/business-websites`
- **Intended internal links:** → Contact (pre-filled), → Workflow Automation (a site that takes bookings/quotes benefits from automated follow-up — not yet linked in body, added in Phase 3), → Pricing, → All Services.

### Workflow Automation — `/services/workflow-automation`
- **Purpose:** Sell the automation service (intake, scheduling, follow-up, notifications, data entry, reporting).
- **Primary search intent:** Business workflow automation for small businesses.
- **Title:** `Workflow Automation for Small Business | Gray Matter LLC`
- **Meta description:** `Workflow automation for small business — order tracking, follow-up, social media orders, and an AI Command Center for the AI tools you already use. Montgomery, AL and remote.`
- **H1:** `What Are You Tired of Doing Over and Over?`
- **Canonical:** `https://graymatterdigitalsolutions.com/services/workflow-automation`
- **Intended internal links:** → Contact (pre-filled), → Business Websites (a site is often the source of the leads/bookings being automated — added in Phase 3), → All Services.

### Cloud Consulting — `/cloud-consulting`
- **Purpose:** The separate technical-buyer path — AWS, infrastructure, DevOps, cloud security, contract/1099 engagements — distinct from the small-business menu.
- **Primary search intent:** Cloud consulting / AWS / DevOps / security contractor.
- **Title:** `Cloud Consulting | AWS, DevOps & Security Contractor | Gray Matter LLC`
- **Meta description:** `AWS cloud infrastructure, DevOps automation, cloud security, logging, and technology consulting for 1099 and project-based engagements — remote, nationwide.`
- **H1:** `Cloud Consulting & 1099 Services`
- **Canonical:** `https://graymatterdigitalsolutions.com/cloud-consulting`
- **Intended internal links:** → Backup & Recovery (cloud reliability pairs directly with backup — added in Phase 3), → Business Security, → Contact.

### Contact — `/contact`
- **Purpose:** Goal-first inquiry form; receives plans built in the homepage funnel and pre-filled CTAs from every service/industry page.
- **Primary search intent:** Navigational — visitors who already decided to reach out.
- **Title:** `Tell Us What You Need | Gray Matter LLC — Montgomery, AL`
- **Meta description:** `Tell Gray Matter what needs to change. Nothing starts until you approve the scope, price, and timeline. Montgomery, Alabama and remote clients welcome.`
- **H1:** `Tell Us What You're Trying to Accomplish`
- **Canonical:** `https://graymatterdigitalsolutions.com/contact`
- **Intended internal links:** ← every page links here (primary conversion target); → Agreement (client terms), → homepage funnel anchor.

## All other indexable pages

| URL | Search intent | Title |
|---|---|---|
| `/about` | Founder-led credibility, who you're working with | About Gray Matter LLC \| Founder-Led Technology in Montgomery, AL |
| `/process` | How the engagement actually runs, step by step | How We Work: Tech Fit to Completion \| Gray Matter LLC |
| `/pricing` | Website package pricing and what's included | Small Business Website Pricing \| Gray Matter LLC — Montgomery, AL |
| `/industries` | Browsing by business type/vertical | Who We Help \| Small Business Technology by Industry \| Gray Matter LLC |
| `/agreement` | Reading the actual contract terms before committing | Client Service Agreement \| Gray Matter LLC |
| `/sops` | Process transparency (documented SOPs) | Standard Operating Procedures \| Gray Matter LLC |
| `/services/business-technology-checkup` | "I don't know what I need" — plain-language technology review | Small Business Technology Consultant in Montgomery, AL \| Gray Matter LLC |
| `/services/process-documentation` | Written procedures / documentation systems | Process & Documentation Systems \| Montgomery, AL \| Gray Matter LLC |
| `/services/backup-recovery` | Business backup and file recovery | Business Backup & File Recovery Services \| Gray Matter LLC |
| `/services/business-security` | Small business cybersecurity / account protection | Small Business Cybersecurity & Account Protection \| Gray Matter LLC |
| `/services/work-from-anywhere` | Secure remote access setup | Remote Access Setup for Small Business \| Gray Matter LLC |
| `/services/technology-cost-cleanup` | Cutting wasted software/subscription spend | Cut Small Business Software & Subscription Costs \| Gray Matter LLC |
| `/services/technology-partner` | Ongoing IT support without a full-time hire | Small Business IT Support in Montgomery, AL \| Gray Matter LLC |
| `/services/business-opportunity-finder` | Prospect / contract-opportunity research | Business Prospect & Contract Opportunity Research \| Gray Matter LLC |
| `/industries/barbers-salons` | Websites/booking for barbers and salons | Websites & Online Booking for Barbers and Salons \| Gray Matter LLC |
| `/industries/detailers` | Websites/booking for auto detailers | Websites & Booking for Auto Detailers \| Gray Matter LLC |
| `/industries/contractors` | Websites/quote requests for contractors | Websites & Quote Requests for Contractors \| Gray Matter LLC |
| `/industries/real-estate` | Websites for real estate agents/brokers | Websites for Real Estate Agents & Brokers \| Gray Matter LLC |
| `/industries/appointment-businesses` | Online booking for appointment-based businesses | Online Booking Websites for Appointment Businesses \| Gray Matter LLC |
| `/industries/entrepreneurs` | Websites for solo founders | Websites for Solo Founders & Entrepreneurs \| Gray Matter LLC |
| `/industries/food-trucks` | Websites for food trucks/mobile food | Websites for Food Trucks & Mobile Food Businesses \| Gray Matter LLC |
| `/industries/cleaning-services` | Websites for cleaning/Airbnb turnover | Websites for Cleaning & Airbnb Turnover Services \| Gray Matter LLC |
| `/industries/professional-services` | Websites for professional services firms | Websites for Professional Services Firms \| Gray Matter LLC |

Every page in this table has a unique title, unique meta description, exactly one `<h1>`, and a correct self-referencing canonical (verified programmatically — see the checks in `ROUND-1-TECHNICAL-AUDIT.md`).

## Findings

- **No duplicated search intent** across pages — each service page owns one problem/outcome pair, each industry page owns one vertical, and Homepage vs. Services (catalog) are now differentiated (see the Services entry above).
- **Metadata matches visible content** on every page checked — titles and descriptions describe what the page actually contains, no bait-and-switch.
- **Title/description lengths:** most titles run 55–72 characters and most descriptions run 140–186 characters. Google's snippet limits are pixel-based, not strict character counts, and will still generate its own snippet from page content when needed, so this isn't a defect — but the three most-visited priority pages (Home, Services, Contact) had descriptions running 210–259 characters, well past where truncation is likely; those three were trimmed to ~150–160 characters this round. The remaining pages in the 160–190 character range are reasonable and are noted here as optional Round 2 polish, not a fix required this round.
- **Intended internal links not yet in body copy:** the "related service" links called out above (Business Websites ↔ Workflow Automation, Cloud Consulting → Backup & Recovery) exist today only in the shared nav/footer, not as contextual in-content links. Added as part of Phase 3's service-page rewrites.
