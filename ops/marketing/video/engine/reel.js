// Deterministic Reel renderer. Every frame is a pure function of time: window.seek(t).
// No timers, no CSS transitions, no randomness, no state carried from earlier frames,
// so any frame can be drawn alone, in any order, and drawn again identically.
//
//   NODE_PATH=$(npm root -g) node ops/marketing/video/engine/reel.js --post gm-fb-0001 [options]
//
//   --post <id> | --spec <file.json>   campaign data (content.py reel-spec <id>)
//   --format 9x16 | 1x1 | both         default both
//   --check                            determinism + layout checks, no video
//   --stills                           preview PNGs at scene changes, no video
//   --out <dir>                        default ops/marketing/video/engine/out
//
// Needs: node, playwright + Chromium, ffmpeg, python3 (for --post).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn, execFileSync } = require('child_process');
const { chromium } = require('playwright');

const ENGINE_VERSION = '1.0.0';
const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const argv = process.argv.slice(2);
const opt = (k, d) => {
  const i = argv.indexOf('--' + k);
  if (i < 0) return d;
  return argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true;
};
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const dataURI = rel => `data:image/png;base64,${fs.readFileSync(path.join(ROOT, rel)).toString('base64')}`;

function loadSpec() {
  if (opt('spec')) return JSON.parse(fs.readFileSync(opt('spec'), 'utf8'));
  if (!opt('post')) throw new Error('give --post <id> or --spec <file>');
  const out = execFileSync('python3', [path.join(ROOT, 'ops/tools/content.py'), 'reel-spec', opt('post')], { encoding: 'utf8' });
  return JSON.parse(out);
}

// ---- page: one canvas, drawn from scratch by seek(t). No DOM layers, so nothing is cached between frames ----
function pageHTML(spec, W, H) {
  const tall = H / W > 1.5, u = W / 1080;
  const pad = Math.round(88 * u), logoH = Math.round(76 * u);
  const top = Math.round(tall ? H * 0.16 : H * 0.085);       // Reels/Stories UI covers the top 14%
  const bottom = Math.round(tall ? H * 0.36 : H * 0.085);    // and the bottom 35%
  const y0 = top + logoH + Math.round(36 * u);
  const box = { x: pad, y: y0, w: W - 2 * pad, h: H - bottom - y0 };
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600&family=Manrope:wght@700;800&display=block" rel="stylesheet">
<style>html,body{margin:0;background:${spec.brand.paper};overflow:hidden}canvas{display:block}</style></head>
<body><canvas id="c" width="${W}" height="${H}"></canvas><script>
const SPEC = ${JSON.stringify(spec)}, U = ${u}, BOX = ${JSON.stringify(box)}, LOGO = { x: ${pad}, y: ${top}, h: ${logoH} };
const LOGO_SRC = "${dataURI(spec.logo)}";
const cv = document.getElementById('c'), ctx = cv.getContext('2d'), W = cv.width, H = cv.height;
const B = SPEC.brand, S = SPEC.scenes, last = S.length - 1;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const easeOut = x => 1 - Math.pow(1 - clamp(x), 3);
const easeInOut = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
// Closed-form under-damped spring, 0 -> 1. Valid at any t, no frame-to-frame simulation.
function spring(t, k = 170, c = 18, m = 1) {
  if (t <= 0) return 0;
  const w0 = Math.sqrt(k / m), z = c / (2 * Math.sqrt(k * m));
  if (z >= 1) return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
  const wd = w0 * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + (z * w0 / wd) * Math.sin(wd * t));
}
// A value retargeted over time: each change adds its own spring response.
const springSum = (t, changes, k, c) => changes.reduce((v, [at, d]) => v + d * spring(t - at, k, c), 0);

let L = null, logoImg = null;
// Wrap words into lines and shrink the type until the block fits its box.
function layoutText(text, weight, fam, maxPx, minPx, boxW, boxH, lh) {
  const words = text.split(' ').filter(Boolean);
  for (let s = maxPx; ; s -= 2) {
    ctx.font = weight + ' ' + s + 'px ' + fam;
    const sp = ctx.measureText(' ').width, widths = words.map(w => ctx.measureText(w).width);
    const lines = []; let cur = [], x = 0;
    words.forEach((w, i) => {
      if (cur.length && x + sp + widths[i] > boxW) { lines.push(cur); cur = []; x = 0; }
      const px = cur.length ? x + sp : 0; cur.push({ i, text: w, x: px }); x = px + widths[i];
    });
    if (cur.length) lines.push(cur);
    const h = lines.length * s * lh, fits = h <= boxH && Math.max.apply(null, widths) <= boxW;
    if (fits || s <= minPx) return { size: s, lines, lh: s * lh, h, fits, font: ctx.font };
  }
}
function fitLine(text, weight, fam, px, maxW) {
  for (let s = px; s > 12; s -= 2) { ctx.font = weight + ' ' + s + 'px ' + fam; if (ctx.measureText(text).width <= maxW) return { size: s, fits: true, font: ctx.font }; }
  return { size: 12, fits: false, font: ctx.font };
}
window.init = async function () {
  logoImg = new Image(); logoImg.src = LOGO_SRC; await logoImg.decode();
  const problems = [], inner = BOX.w - 128 * U, [hk, an, ct] = S;
  const hook = layoutText(hk.text, 800, 'Manrope', 126 * U, 44 * U, BOX.w, BOX.h, 1.07);
  if (!hook.fits) problems.push('hook text does not fit its box even at the minimum size');
  const kickH = 36 * U, gap1 = 26 * U, gap2 = 40 * U, barH = 9 * U;
  const ans = layoutText(an.text, 700, 'Manrope', 84 * U, 40 * U, BOX.w, BOX.h - kickH - gap1 - gap2 - barH, 1.07);
  if (!ans.fits) problems.push('answer text does not fit its box even at the minimum size');
  const title = layoutText(ct.title, 800, 'Manrope', 104 * U, 46 * U, inner, BOX.h * 0.5, 1.05);
  const sub = fitLine(ct.sub, 600, 'Inter', 46 * U, inner), site = fitLine(ct.site, 500, 'Inter', 34 * U, inner);
  if (!title.fits || !sub.fits || !site.fits) problems.push('call-to-action text does not fit the card');
  const aTotal = kickH + gap1 + ans.h + gap2 + barH;
  const cTotal = title.h + 26 * U + sub.size * 1.2 + 26 * U + site.size * 1.2;
  L = { hook, ans, title, sub, site, problems,
        hookTop: BOX.y + (BOX.h - hook.h) / 2, ansTop: BOX.y + (BOX.h - aTotal) / 2, kickH, gap1, gap2, barH,
        ctaTop: BOX.y + (BOX.h - cTotal) / 2 };
  return problems;
};
window.__overflow = () => L.problems;

function drawWords(block, top, x0, local, a0, step, alpha, dy, springK, springC, color, rise) {
  ctx.font = block.font; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.fillStyle = color;
  block.lines.forEach((line, li) => line.forEach(w => {
    const a = a0 + w.i * step, p = spring(local - a, springK, springC), o = easeOut((local - a) / 0.22) * alpha;
    if (o <= 0) return;
    ctx.globalAlpha = o;
    ctx.fillText(w.text, x0 + w.x, top + li * block.lh + block.lh / 2 + (1 - p) * block.size * rise + dy);
  }));
  ctx.globalAlpha = 1;
}

window.seek = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = B.paper; ctx.fillRect(0, 0, W, H);
  // background shape: retargeted spring + slow drift, all a function of t
  const sc = 1 + 0.04 * (t / SPEC.duration) + springSum(t, [[S[1].start, 0.22], [S[2].start, 0.22]], 60, 13);
  const R = 0.36 * W;
  ctx.save(); ctx.translate(0.86 * W - t * 2 * U, -0.1 * H + R + t * 1.5 * U); ctx.scale(sc, sc);
  ctx.globalAlpha = 0.5; ctx.fillStyle = B.accent; ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  ctx.drawImage(logoImg, LOGO.x, LOGO.y, logoImg.naturalWidth * LOGO.h / logoImg.naturalHeight, LOGO.h);
  S.forEach((s, i) => {
    const local = t - s.start;
    if (!(t >= s.start - 1e-6 && (i === last || t < s.end))) return;
    // leave before the next scene starts: text out first, then the next container moves
    const out = i === last ? 0 : easeInOut((t - (s.end - 0.34)) / 0.3), alpha = 1 - out, dy = -out * 40 * U;
    if (i === 0) drawWords(L.hook, L.hookTop, BOX.x, local, -1.5 * s.stagger, s.stagger, alpha, dy, 240, 24, B.ink, 0.45);
    if (i === 1) {
      const kk = easeOut((local - 0.04) / 0.3);
      ctx.font = '600 ' + (30 * U) + 'px Inter'; ctx.letterSpacing = (0.12 * 30 * U) + 'px'; ctx.textBaseline = 'middle'; ctx.fillStyle = B.blue;
      ctx.globalAlpha = kk * alpha; ctx.fillText(s.kicker, BOX.x, L.ansTop + L.kickH / 2 + (1 - kk) * 20 * U + dy);
      ctx.letterSpacing = '0px'; ctx.globalAlpha = 1;
      const textTop = L.ansTop + L.kickH + L.gap1;
      drawWords(L.ans, textTop, BOX.x, local, 0.12, 0.045, alpha, dy, 220, 24, B.ink, 0.4);
      const bw = BOX.w * 0.34 * easeOut((local - 0.9) / 0.7);
      if (bw > 0) { ctx.globalAlpha = alpha; ctx.fillStyle = B.blue; ctx.beginPath(); ctx.roundRect(BOX.x, textTop + L.ans.h + L.gap2 + dy, bw, L.barH, 6 * U); ctx.fill(); ctx.globalAlpha = 1; }
    }
    if (i === 2) {
      const wipe = easeInOut(local / 0.5);                   // container first, text after
      if (wipe > 0) {
        ctx.save(); ctx.beginPath(); ctx.roundRect(BOX.x, BOX.y, BOX.w, BOX.h, 38 * U); ctx.clip();
        ctx.beginPath(); ctx.rect(BOX.x, BOX.y + (1 - wipe) * BOX.h, BOX.w, BOX.h); ctx.clip();
        ctx.fillStyle = B.ink; ctx.fillRect(BOX.x, BOX.y, BOX.w, BOX.h);
        const x0 = BOX.x + 64 * U, rows = [
          [L.title, 0.4, null], [L.sub, 0.7, s.sub, B.mint], [L.site, 0.95, s.site, '#FFFFFF']];
        let y = L.ctaTop;
        rows.forEach(([blk, at, text, color]) => {
          const p = spring(local - at, 200, 22), o = easeOut((local - at) / 0.25), yo = (1 - p) * 36 * U;
          ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
          if (!text) {                                          // the title block, several lines
            ctx.font = blk.font; ctx.fillStyle = '#FFFFFF'; ctx.globalAlpha = o;
            blk.lines.forEach((line, li) => ctx.fillText(line.map(w => w.text).join(' '), x0, y + li * blk.lh + blk.lh / 2 + yo));
            y += blk.h + 26 * U;
          } else {
            ctx.font = blk.font; ctx.fillStyle = color; ctx.globalAlpha = (text === s.site ? 0.88 : 1) * o;
            ctx.fillText(text, x0, y + blk.size * 0.6 + yo); y += blk.size * 1.2 + 26 * U;
          }
          ctx.globalAlpha = 1;
        });
        ctx.restore();
      }
    }
  });
};
</script></body></html>`;
}

async function open(browser, spec, W, H) {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.setContent(pageHTML(spec, W, H), { waitUntil: 'networkidle' });
  await page.evaluate(() => Promise.all([document.fonts.load('800 40px Manrope'), document.fonts.load('700 40px Manrope'), document.fonts.load('600 40px Inter'), document.fonts.ready]));
  const fonts = await page.evaluate(() => ['800 40px Manrope', '700 40px Manrope', '600 40px Inter'].every(f => document.fonts.check(f)));
  if (!fonts) throw new Error('Brand fonts (Manrope, Inter) did not load. Check the network/proxy: a fallback font would change every frame.');
  await page.evaluate(() => window.init());
  return page;
}
// Read the canvas bitmap directly: no browser compositor or layer cache sits between seek(t) and the pixels.
const frameAt = async (page, t) => {
  const url = await page.evaluate(x => { window.seek(x); return document.getElementById('c').toDataURL('image/png'); }, t);
  return Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
};

async function check(browser, spec, fmt, [W, H]) {
  const page = await open(browser, spec, W, H);
  const T = [...new Set(spec.scenes.flatMap(s => [s.start, s.start + 0.2, (s.start + s.end) / 2, s.end - 0.45, s.end - 0.2]).concat([0, 0.05, spec.duration - 0.04].map(Number)))]
    .filter(t => t >= 0 && t < spec.duration).map(t => +t.toFixed(3)).sort((a, b) => a - b);
  const pass1 = {}, problems = [];
  for (const t of T) pass1[t] = sha(await frameAt(page, t));
  for (const t of [...T].reverse()) if (sha(await frameAt(page, t)) !== pass1[t]) problems.push(`frame at ${t}s changed when drawn in reverse order`);
  for (const t of T) { await page.evaluate(x => window.seek(x), spec.duration - 0.03); if (sha(await frameAt(page, t)) !== pass1[t]) problems.push(`frame at ${t}s depends on the previous frame`); }
  const anims = await page.evaluate(() => document.getAnimations().length);
  if (anims) problems.push(`${anims} CSS animation(s) are running; rendering must not depend on the page clock`);
  for (const s of spec.scenes) {
    await page.evaluate(x => window.seek(x), s.end - 0.45);
    (await page.evaluate(() => window.__overflow())).forEach(m => problems.push(`${s.id}: ${m}`));
  }
  await page.close();
  console.log(`${fmt}: ${T.length} timestamps drawn forward, reversed and out of order; ${problems.length ? 'FAIL' : 'all identical, text fits'}`);
  problems.forEach(p => console.log('  ✗ ' + p));
  return problems.length === 0;
}

async function stills(browser, spec, fmt, [W, H], outDir) {
  const page = await open(browser, spec, W, H);
  const dir = path.join(outDir, `${spec.id}-${fmt}-stills`); fs.mkdirSync(dir, { recursive: true });
  const T = spec.scenes.flatMap(s => [s.start + 0.1, (s.start + s.end) / 2, s.end - 0.45]).concat([0, spec.duration - 0.04]);
  for (const t of T) fs.writeFileSync(path.join(dir, `t${t.toFixed(2).padStart(5, '0')}.png`), await frameAt(page, Math.max(0, t)));
  await page.close();
  console.log(`${fmt}: ${T.length} preview stills -> ${path.relative(ROOT, dir)}`);
}

async function render(browser, spec, fmt, [W, H], outDir) {
  const page = await open(browser, spec, W, H);
  const base = path.join(outDir, `${spec.id}-${fmt}`), mp4 = base + '.mp4';
  const frames = Math.round(spec.duration * spec.fps);
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(spec.fps), '-i', '-',
    '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-t', String(frames / spec.fps),
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', mp4], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', c => (c === 0 ? res() : rej(new Error('ffmpeg exited ' + c)))));
  for (let f = 0; f < frames; f++) {
    const png = await frameAt(page, f / spec.fps);
    if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await done; await page.close();
  const manifest = {
    engine_version: ENGINE_VERSION, post: spec.id, format: fmt, size: [W, H], fps: spec.fps, frames, duration: spec.duration,
    spec_sha256: sha(JSON.stringify(spec)), logo_sha256: sha(fs.readFileSync(path.join(ROOT, spec.logo))),
    fonts: ['Manrope 700/800', 'Inter 500/600 (Google Fonts)'], audio: 'silent track; captions are burned in',
    output_sha256: sha(fs.readFileSync(mp4)), rendered: new Date().toISOString().slice(0, 10),
  };
  fs.writeFileSync(base + '.manifest.json', JSON.stringify(manifest, null, 2) + '\n');
  fs.writeFileSync(path.join(outDir, `${spec.id}.spec.json`), JSON.stringify(spec, null, 2) + '\n');
  console.log(`${fmt}: ${path.relative(ROOT, mp4)}  ${frames} frames, ${spec.duration}s`);
}

(async () => {
  const spec = loadSpec();
  const outDir = path.resolve(opt('out', path.join(__dirname, 'out'))); fs.mkdirSync(outDir, { recursive: true });
  const want = opt('format', 'both');
  const formats = Object.entries(spec.formats).filter(([k]) => want === 'both' || want === k);
  if (!formats.length) throw new Error('unknown --format ' + want);
  const browser = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined });
  let ok = true;
  try {
    for (const [fmt, size] of formats) {
      if (opt('check')) ok = (await check(browser, spec, fmt, size)) && ok;
      else if (opt('stills')) await stills(browser, spec, fmt, size, outDir);
      else {
        if (!(await check(browser, spec, fmt, size))) throw new Error(`${fmt}: checks failed, not rendering`);
        await render(browser, spec, fmt, size, outDir);
      }
    }
  } finally { await browser.close(); }
  process.exit(ok ? 0 : 1);
})().catch(e => { console.error('✗ ' + e.message); process.exit(1); });
