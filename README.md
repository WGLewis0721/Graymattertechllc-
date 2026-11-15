# AI Video Unified

Best of the top AI video tools compiled into one code-owned pipeline for your business.

## Core Stack

| Tool | Strength Taken | How Used Here |
|------|----------------|---------------|
| **Remotion** | Programmatic composition, React components, deterministic rendering, timelines, branding | Assembly & final render layer. Code is source of truth. |
| **Kie.ai** | Cheap pay-as-you-go access to Seedance 2.5, Kling 4.0, Veo 3.1, MiniMax, Wan, etc. One API key. | Primary generation backend for clips. |
| **Higgsfield** | Cinematic presets, camera control, Soul character consistency, multi-model polish, editor ideas | Patterns & selective API/MCP calls for high-quality directed shots. |

## Pipeline

1. Generate raw clips via Kie.ai API (or Higgsfield when needed for presets/Soul).
2. Feed clips + assets into Remotion compositions.
3. Render final branded, captioned, timed videos.
4. Optional: Higgsfield MCP for agent-driven creative direction.

## Quick Start

```bash
# Install Remotion
npm create video@latest
# or existing project: npm install remotion @remotion/cli

# Env
cp .env.example .env
# Add KIE_API_KEY and optional HIGGSFIELD keys
```

See `/docs` for integration examples and best practices from each platform.

## Top Models via Kie.ai (2026)

- Seedance 2.5 — Best overall, up to 30s, native audio, references
- Kling 4.0 — Strong motion, multi-shot, budget-friendly
- Veo 3.1 — Cinematic polish, native audio
- MiniMax H3 — Great value, 2K, dialogue

All accessible behind one Kie.ai key. Higgsfield hosts the same plus its own tools.

## License

Private business use. Respect provider ToS for generated content.
