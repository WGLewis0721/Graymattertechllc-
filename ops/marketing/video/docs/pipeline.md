# Unified Pipeline Details

## Generation (Kie.ai first)

Use `/api/v1/jobs/createTask` with models like:
- `kling-3.0/video` or `kling-4.0/...`
- Seedance variants
- Veo via dedicated or market endpoints

Poll or webhook for results. Store clips locally or in S3.

## Higgsfield Patterns

- Camera presets / Cinema Studio logic → encode as Remotion spring/easing params or prompt templates.
- Soul ID / character consistency → use reference images/videos in Kie or Higgsfield calls.
- Selective Higgsfield API for models or features Kie lacks.

## Remotion Assembly

- `src/compositions/` — sequences, overlays, captions, branding.
- `<Video>` or `<OffthreadVideo>` for generated clips.
- Parameterize via `inputProps` for data-driven variants.
- Render with `@remotion/renderer` or CLI.

## Cost Notes

- Kie.ai: pay-per-second, credits never expire, best for volume.
- Higgsfield: subscription + credits for interactive/creative work; API separate.
- Remotion: free for individuals and companies of up to 3 people (everyone counts, contractors included); beyond that, paid licenses. Not needed for the Reel engine in `engine/`, which uses only Playwright + ffmpeg.
