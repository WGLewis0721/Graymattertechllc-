// Meta tag + JSON-LD LocalBusiness schema builder, consumed by
// BaseLayout.astro. Keeps SEO/structured-data logic out of the layout
// markup so the layout stays readable and the schema shape stays typed.

import type { Content } from './content';

export interface MetaTags {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage?: string;
}

export function buildMeta(content: Content, canonicalUrl: string): MetaTags {
  return {
    title: content.seo.title,
    description: content.seo.description,
    canonicalUrl,
    ogImage: content.seo.ogImage,
  };
}

/**
 * Builds a schema.org LocalBusiness JSON-LD object. Returned as a plain
 * object; BaseLayout serializes it into a <script type="application/ld+json">
 * tag. `@type` is deliberately the generic LocalBusiness rather than a
 * vertical-specific subtype (BarberShop, LegalService, etc.) at the shared
 * layer — a vertical template may pass a more specific `businessType` if
 * it needs one, since schema.org subtypes are valid drop-in replacements.
 */
export function buildLocalBusinessSchema(
  content: Content,
  canonicalUrl: string,
  businessType: string = 'LocalBusiness'
): Record<string, unknown> {
  const { business, hours, seo } = content;

  const openingHours = hours
    .filter((h) => h.open && h.close)
    .map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.day,
      opens: h.open,
      closes: h.close,
    }));

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': businessType,
    name: business.name,
    description: seo.description,
    url: canonicalUrl,
    telephone: business.phone,
  };

  if (business.email) schema.email = business.email;
  if (business.address) schema.address = business.address;
  if (business.serviceArea) schema.areaServed = business.serviceArea;
  if (openingHours.length > 0) schema.openingHoursSpecification = openingHours;
  if (seo.ogImage) schema.image = seo.ogImage;

  return schema;
}
