# Workflow: Remotion Templates + Higgsfield + Kie.ai + Claude/ChatGPT

## 1. Choose & Fork Base

- **Best overall for product promos:** [EveryInc/product-launch-video](https://github.com/EveryInc/product-launch-video)
- **Fastest prop-driven start:** [AleBrito124356/remotion-video-templates](https://github.com/AleBrito124356/remotion-video-templates)

```bash
git clone <repo-url>
cd <repo>
npm install
```

## 2. Claude / ChatGPT for Intelligence

- In Claude Code: use the product-launch skill (if present) or Remotion Agent Skills.
- Give it: brief, brand colors, logo path, screenshots, copy, target length (15-30s).
- Ask it to generate/refine compositions, props, and scene order.

**Sample prompt starter:**
```
Using the Remotion template structure, create a 20s product launch video for [Product].
Include: kinetic intro text, logo reveal, 3 UI mockup scenes, feature callouts, CTA.
Brand color: #XXXXXX. Logo: /public/logo.png. Screenshots: /public/screenshots/.
Match clean Atlas-style motion.
```

## 3. Generate Assets with Higgsfield or Kie.ai

- **Higgsfield** (recommended for quality/presets): Use web app or MCP (`https://mcp.higgsfield.ai/mcp`) for cinematic clips, lifestyle footage, product environments. Soul for character consistency if needed.
- **Kie.ai** (recommended for cost/automation): Call API for Seedance 2.5, Kling 4.0, Veo 3.1, etc. One key, pay-as-you-go.

Drop resulting videos/images into `public/` or the assets folder of your Remotion project.

## 4. Assemble & Render in Remotion

- Wire generated clips into compositions (use `<Video>` or `<OffthreadVideo>`).
- Adjust timing, text, overlays with Claude help if needed.
- `npx remotion studio` for preview.
- Render with CLI or `@remotion/renderer`.

## 5. Iterate Minimally

Most structure is already in the template. Focus on brand assets, script, and swapping generative clips.

## Env Notes

Copy `.env.example` if using API generation. Not required for pure Remotion + Higgsfield web workflow.
