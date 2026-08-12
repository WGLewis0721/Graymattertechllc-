// Named font pairings and color schemes a client picks from during
// intake (docs/INTAKE.md: "3-4 named pairings/palettes with a preview").
// This is the one place those named presets resolve to concrete values —
// deliberately kept out of any .astro file, since the rule for
// components and layouts is zero hardcoded colors or fonts (see
// components/shared/README.md and docs/ENGINEERING.md, principle 1).
// BaseLayout calls resolveThemeVars() and injects the result as a
// :root override; it never sees a raw hex value itself.

import type { Theme } from './content';

interface FontPairing {
  heading: string;
  body: string;
}

interface ColorScheme {
  primary: string;
  accent: string;
  surface: string;
  ink: string;
}

export const FONT_PAIRINGS: Record<string, FontPairing> = {
  'modern-sans': {
    heading: "'Inter', -apple-system, sans-serif",
    body: "-apple-system, 'Inter', sans-serif",
  },
  'classic-serif': {
    heading: "'Georgia', 'Iowan Old Style', serif",
    body: "-apple-system, BlinkMacSystemFont, sans-serif",
  },
  'bold-display': {
    heading: "'Archivo Black', 'Arial Black', sans-serif",
    body: "-apple-system, BlinkMacSystemFont, sans-serif",
  },
  'sans-serif-bold': {
    heading: "-apple-system, 'Helvetica Neue', sans-serif",
    body: "-apple-system, BlinkMacSystemFont, sans-serif",
  },
};

export const COLOR_SCHEMES: Record<string, ColorScheme> = {
  'warm-neutral': { primary: '#7c2d12', accent: '#b45309', surface: '#fdfaf6', ink: '#2b2420' },
  'cool-professional': { primary: '#1e3a8a', accent: '#0369a1', surface: '#f8fafc', ink: '#0f172a' },
  'bold-accent': { primary: '#111827', accent: '#dc2626', surface: '#ffffff', ink: '#111827' },
};

const HEX_PATTERN = /^#[0-9a-fA-F]{3,8}$/;

function safeHex(value: string | undefined): string | undefined {
  return value && HEX_PATTERN.test(value) ? value : undefined;
}

/**
 * Resolves a client's theme.fontPairing / theme.colorScheme / theme.colors
 * into a flat map of CSS custom property overrides. Unknown preset keys
 * are silently skipped — a bad theme key degrades to the tokens.css
 * defaults, it never breaks the build.
 */
export function resolveThemeVars(theme: Theme): Record<string, string> {
  const vars: Record<string, string> = {};
  const fonts = FONT_PAIRINGS[theme.fontPairing];
  const scheme = COLOR_SCHEMES[theme.colorScheme];
  const overrides = theme.colors ?? {};

  if (fonts) {
    vars['--font-heading'] = fonts.heading;
    vars['--font-body'] = fonts.body;
  }

  const primary = safeHex(overrides.primary) ?? scheme?.primary;
  const accent = safeHex(overrides.accent) ?? scheme?.accent;
  const surface = safeHex(overrides.surface) ?? scheme?.surface;
  const ink = safeHex(overrides.ink) ?? scheme?.ink;

  if (primary) vars['--color-primary'] = primary;
  if (accent) vars['--color-accent'] = accent;
  if (surface) vars['--color-surface'] = surface;
  if (ink) vars['--color-ink'] = ink;

  return vars;
}
