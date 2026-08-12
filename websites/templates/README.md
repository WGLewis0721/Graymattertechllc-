# templates/

Empty on purpose. One folder per vertical (barber, lawyer, contractor, coach, real-estate, solo) goes here, each a complete standalone Astro project built from `src/components/shared/` plus whatever it needs from `parts/`, with its own `.github/workflows/deploy.yml`, `public/.nojekyll`, and `astro.config.mjs`. See `docs/ARCHITECTURE.md` for the intended shape of a vertical template and `scripts/new-client.sh` for how a template gets turned into a client project.

Scaffolding the shared frame comes first; the first vertical template is a separate pass.
