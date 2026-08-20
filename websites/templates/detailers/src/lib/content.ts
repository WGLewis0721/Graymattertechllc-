// Typed loader + build-time validator for a client's content.json.
//
// Every page imports its own content.json and passes it through
// `loadContent()` before using it. Validation runs against
// src/schemas/content.schema.json — the same contract documented in
// docs/ARCHITECTURE.md. A missing alt text, a missing phone number, or
// any other schema violation throws during the Astro build, which fails
// the build. That is intentional: a broken content.json should never
// reach a deployed site. See docs/ENGINEERING.md, definition of done.

import Ajv2020, { type ErrorObject } from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import schema from '../schemas/content.schema.json';

export interface BusinessHours {
  day: string;
  open: string | null;
  close: string | null;
}

export interface Service {
  name: string;
  price: string;
  duration?: string;
  description?: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
}

export interface ThemeColors {
  primary?: string;
  accent?: string;
  surface?: string;
  ink?: string;
}

export interface Theme {
  fontPairing: string;
  colorScheme: string;
  colors?: ThemeColors;
}

export interface MapInfo {
  embedUrl: string;
  title: string;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  google?: string;
  yelp?: string;
}

export interface SeoInfo {
  title: string;
  description: string;
  ogImage?: string;
}

export interface Business {
  name: string;
  tagline?: string;
  phone: string;
  email?: string;
  address?: string;
  serviceArea?: string;
}

export interface Hero {
  image: string;
  alt: string;
  ctaLabel?: string;
  ctaHref?: string;
}

/** This vertical's own extension — one detailing tier priced per vehicle size, see VehicleSizeTable.astro. */
export interface VehicleTier {
  name: string;
  description?: string;
  duration?: string;
  /** One price per entry in `vehicleSizes`, in the same order. */
  prices: string[];
  includes: string[];
}

/** This vertical's own extension — the shop's outbound scheduler, see index.astro. */
export interface BookingInfo {
  provider: string;
  href: string;
  note?: string;
}

/** This vertical's own extension — one before/after pair, see the shared BeforeAfterSlider. */
export interface BeforeAfterPair {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  label?: string;
}

export interface Content {
  business: Business;
  hero: Hero;
  hours: BusinessHours[];
  services: Service[];
  gallery: GalleryImage[];
  testimonials?: Testimonial[];
  theme: Theme;
  formEndpoint: string;
  map?: MapInfo;
  social?: SocialLinks;
  seo: SeoInfo;
  /** Always present after loadContent() — ajv fills in `false` when absent. */
  launched: boolean;
  site?: string;
  base?: string;
  /** detailers-only field, see VehicleSizeTable.astro — the price matrix column headers. */
  vehicleSizes?: string[];
  /** detailers-only field, see VehicleSizeTable.astro. */
  vehicleTiers?: VehicleTier[];
  /** detailers-only field, see index.astro — outbound scheduler link. */
  booking?: BookingInfo;
  /** detailers-only field, see the shared BeforeAfterSlider. */
  beforeAfter?: BeforeAfterPair[];
}

// strictRequired is off because business.anyOf legitimately requires
// "address" / "serviceArea" without redeclaring them in each branch's
// own properties block (they're declared once, on the parent object).
// useDefaults fills in `launched: false` when the field is absent, so
// every caller of loadContent() gets a real boolean, never undefined —
// see docs/DEPLOYMENT.md and the "launched" property in the schema.
const ajv = new Ajv2020({ allErrors: true, strict: true, strictRequired: false, useDefaults: true });
addFormats(ajv);
const validate = ajv.compile<Content>(schema);

function formatErrors(errors: ErrorObject[] | null | undefined): string {
  if (!errors || errors.length === 0) return 'unknown validation error';
  return errors
    .map((err) => `  - ${err.instancePath || '(root)'} ${err.message ?? ''}`.trimEnd())
    .join('\n');
}

/**
 * Validate raw JSON against content.schema.json and return it typed.
 * Throws (failing the build) on any schema violation.
 */
export function loadContent(raw: unknown): Content {
  if (!validate(raw)) {
    throw new Error(
      `content.json failed schema validation:\n${formatErrors(validate.errors)}`
    );
  }
  return raw as Content;
}
