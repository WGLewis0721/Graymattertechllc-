// Render Gray Matter social ads (PNG, 4 sizes) and print fliers (half-letter PDF + PNG preview).
// Copy lives in ads.json; nothing here invents claims. Run from the repo root:
//   NODE_PATH=$(npm root -g) node ops/marketing/ads/render.js [--only id,id]
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const spec = JSON.parse(fs.readFileSync(path.join(__dirname, 'ads.json'), 'utf8'));
const OUT_ADS = path.join(ROOT, 'assets/gray-matter/ads');
const OUT_PRINT = path.join(ROOT, 'assets/gray-matter/print');
const dataURI = rel => {
  const buf = fs.readFileSync(path.join(ROOT, rel));
  const type = rel.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
  return `data:${type};base64,${buf.toString('base64')}`;
};
const LOGO = dataURI('assets/gray-matter-media-package/brand/approved-reference/gm-logo-horizontal-approved.png');
const ACCENT = { gold: '#F3C969', mint: '#B8E1D0', coral: '#E9785D' };
const only = (process.argv.find(a => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const FONTS = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&display=block" rel="stylesheet">';
const BASE = `:root{--ink:#152238;--paper:#F7F4ED;--blue:#2F64D6;--line:#D5DBE4;--muted:#4A5871}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Inter,Arial,sans-serif;color:var(--ink);background:var(--paper);-webkit-font-smoothing:antialiased}
h1,h2,.offer,.price{font-family:Manrope,Arial,sans-serif}`;

function adHTML(ad, w, h) {
  const wide = w / h > 1.4, tall = h / w > 1.5;
  const u = wide ? h / 560 : w / 1080;          // type scale
  const accent = ACCENT[ad.accent] || ACCENT.mint;
  const band = (wide ? 84 : 120) * u;
  const pts = ad.points.map(p => `<li>${esc(p)}</li>`).join('');
  const price = ad.price ? `<div class="price">${esc(ad.price)}</div>` : '';
  const next = `<div class="next"><b>Free 10-minute check</b><span>Text or call ${esc(spec.contact.phone)}</span></div>`;
  const head = `${wide ? `<img class="logo" src="${LOGO}" alt="Gray Matter">` : ''}<div class="eyebrow">${esc(ad.eyebrow)}</div><h1>${esc(ad.problem)}</h1><div class="offer">${esc(ad.offer)}</div>${price}`;
  const body = wide
    ? `<div class="col">${head}</div><div class="col right"><ul>${pts}</ul>${next}</div>`
    : `<div class="col">${head}<ul>${pts}</ul></div>${next}`;
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${BASE}
html,body{width:${w}px;height:${h}px;overflow:hidden}
.frame{position:relative;width:100%;height:100%;padding:${(wide ? 56 : 160) * u}px ${64 * u}px ${band + 44 * u}px;display:flex;flex-direction:${wide ? 'row' : 'column'};gap:${(wide ? 48 : 40) * u}px;justify-content:space-between}
.blob{position:absolute;right:${-140 * u}px;top:${-160 * u}px;width:${(tall ? 760 : 620) * u}px;height:${(tall ? 760 : 620) * u}px;border-radius:50%;background:${accent};opacity:.55}
.band{position:absolute;left:0;right:0;bottom:0;height:${band}px;background:var(--ink)}
.col{position:relative;z-index:1;display:flex;flex-direction:column;flex:1;justify-content:${wide ? 'flex-start' : 'center'}}
.toplogo{position:absolute;z-index:1;left:${64 * u}px;top:${56 * u}px;height:${56 * u}px}
.right{justify-content:center;gap:${28 * u}px;flex:.9}
.logo{height:${(wide ? 40 : 56) * u}px;align-self:flex-start;margin-bottom:${(tall ? 150 : wide ? 26 : 56) * u}px}
.eyebrow{font-weight:600;font-size:${(wide ? 20 : 26) * u}px;letter-spacing:.12em;text-transform:uppercase;color:var(--blue);margin-bottom:${16 * u}px}
h1{font-weight:800;font-size:${(wide ? 46 : tall ? 92 : 72) * u}px;line-height:1.06;letter-spacing:-.015em;margin-bottom:${(tall ? 40 : 24) * u}px}
.offer{font-weight:700;font-size:${(wide ? 26 : tall ? 40 : 34) * u}px;line-height:1.25;margin-bottom:${14 * u}px}
.price{display:inline-block;font-weight:800;font-size:${(wide ? 32 : tall ? 50 : 42) * u}px;color:#fff;background:var(--blue);padding:${8 * u}px ${22 * u}px;border-radius:${12 * u}px;margin:${6 * u}px 0 ${(tall ? 40 : 26) * u}px;align-self:flex-start}
ul{list-style:none;display:flex;flex-direction:column;gap:${(tall ? 22 : 14) * u}px;margin-top:${ad.price ? 0 : 18 * u}px}
li{font-size:${(wide ? 23 : tall ? 34 : 28) * u}px;line-height:1.3;padding-left:${42 * u}px;position:relative;color:var(--muted)}
li:before{content:'';position:absolute;left:0;top:${(tall ? 11 : 8) * u}px;width:${20 * u}px;height:${11 * u}px;border-left:${4 * u}px solid var(--blue);border-bottom:${4 * u}px solid var(--blue);transform:rotate(-45deg)}
.next{position:relative;z-index:1;display:flex;flex-direction:${wide ? 'column' : 'row'};align-items:${wide ? 'flex-start' : 'center'};justify-content:space-between;gap:${10 * u}px;background:#fff;border:${2 * u}px solid var(--ink);border-radius:${22 * u}px;padding:${(tall ? 34 : 24) * u}px ${30 * u}px}
.next b{font-family:Manrope,Arial,sans-serif;font-weight:800;font-size:${(wide ? 26 : tall ? 40 : 32) * u}px}
.next span{font-size:${(wide ? 22 : tall ? 32 : 26) * u}px;font-weight:600;color:var(--blue)}
.cta{position:absolute;z-index:2;left:${64 * u}px;right:${64 * u}px;bottom:0;height:${band}px;display:flex;align-items:center;justify-content:space-between;gap:${24 * u}px;white-space:nowrap;color:#fff;font-size:${(wide ? 22 : 28) * u}px;font-weight:600}
.cta b{font-family:Manrope,Arial,sans-serif;font-weight:800}
.cta span{opacity:.85}
</style></head><body><div class="frame">
<div class="blob"></div><div class="band"></div>
${wide ? '' : `<img class="toplogo" src="${LOGO}" alt="Gray Matter">`}
${body}
<div class="cta"><b>${esc(spec.contact.site)}</b><span>${esc(spec.contact.place_short)}</span></div>
</div></body></html>`;
}

function flierHTML(f) {
  const qr = fs.readFileSync(path.join(OUT_PRINT, `qr-${f.audience}.svg`), 'utf8').replace(/^<\?xml[^>]*>/, '');
  const ladder = spec.ladder.map(r => `<tr><td class="step">${esc(r.step)}</td><td><b>${esc(r.name)}</b><br><span>${esc(r.detail)}</span></td></tr>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${BASE}
@page{size:5.5in 8.5in;margin:0}
html,body{width:5.5in;height:8.5in}
.page{position:relative;width:5.5in;height:8.5in;padding:.42in .42in .3in;display:flex;flex-direction:column;overflow:hidden}
.blob{position:absolute;right:-.9in;top:-.9in;width:2.9in;height:2.9in;border-radius:50%;background:#B8E1D0;opacity:.6}
.logo{position:relative;height:.36in;align-self:flex-start;margin-bottom:.28in}
.eyebrow{position:relative;font-weight:600;font-size:8.5pt;letter-spacing:.12em;text-transform:uppercase;color:var(--blue);margin-bottom:.08in}
h1{position:relative;font-weight:800;font-size:23pt;line-height:1.08;margin-bottom:.12in}
.lede{font-size:9.6pt;line-height:1.45;color:var(--muted);margin-bottom:.16in}
table{width:100%;border-collapse:collapse;margin-bottom:.14in}
td{padding:.07in 0;border-top:1px solid var(--line);vertical-align:top;font-size:8.8pt;line-height:1.35}
td b{font-family:Manrope,Arial,sans-serif;font-size:10pt}
td span{color:var(--muted)}
.step{width:1.25in;font-family:Manrope,Arial,sans-serif;font-weight:800;color:var(--blue);font-size:10pt;padding-right:.1in}
.bottom{margin-top:auto;display:flex;gap:.2in;align-items:center;background:var(--ink);color:#fff;border-radius:.18in;padding:.18in .2in}
.qr{width:1.15in;height:1.15in;background:#fff;border-radius:.08in;padding:.05in;flex:none}
.qr svg{width:100%;height:100%}
.bottom h2{font-weight:800;font-size:13pt;line-height:1.15;margin-bottom:.06in}
.bottom p{font-size:8.8pt;line-height:1.4;opacity:.9}
.bottom .phone{font-family:Manrope,Arial,sans-serif;font-weight:800;font-size:13pt;opacity:1;margin-top:.04in}
.why{display:grid;grid-template-columns:1fr 1fr 1fr;gap:.12in;margin-bottom:.16in}
.why div{font-size:8pt;line-height:1.35;color:var(--ink);background:#fff;border:1px solid var(--line);border-radius:.1in;padding:.09in .1in}
.foot{font-size:7pt;color:var(--muted);margin-top:.1in;text-align:center}
</style></head><body><div class="page">
<div class="blob"></div>
<img class="logo" src="${LOGO}" alt="Gray Matter">
<div class="eyebrow">${esc(f.eyebrow)}</div>
<h1>${esc(f.headline)}</h1>
<p class="lede">${esc(f.lede)}</p>
<table>${ladder}</table>
<div class="why">${spec.why.map(w => `<div>${esc(w)}</div>`).join('')}</div>
<div class="bottom"><div class="qr">${qr}</div><div>
<h2>Start with a free 10-minute check.</h2>
<p>Scan to build your plan, or text or call:</p>
<p class="phone">${esc(spec.contact.phone)}</p>
<p>${esc(spec.contact.site)}</p></div></div>
<div class="foot">Gray Matter LLC · ${esc(spec.contact.place)} · Prices from graymatterdigitalsolutions.com/pricing</div>
</div></body></html>`;
}

(async () => {
  fs.mkdirSync(OUT_ADS, { recursive: true });
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch({ proxy });
  const made = [];
  for (const ad of spec.ads) {
    if (only.length && !only.includes(ad.id)) continue;
    for (const [size, [w, h]] of Object.entries(spec.sizes)) {
      const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
      await page.setContent(adHTML(ad, w, h), { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(() => {
        const band = document.querySelector('.band').getBoundingClientRect().top;
        return [...document.querySelectorAll('.col, .next, li, h1')].some(e => e.getBoundingClientRect().bottom > band + 1)
          || document.documentElement.scrollWidth > innerWidth;
      });
      const file = path.join(OUT_ADS, `gm-ad-${ad.id}-${size}.png`);
      await page.screenshot({ path: file });
      made.push(path.relative(ROOT, file) + (overflow ? '  ⚠ text overlaps the footer band' : ''));
      await page.close();
    }
  }
  for (const f of spec.fliers) {
    if (only.length && !only.includes(f.id)) continue;
    const page = await browser.newPage({ viewport: { width: 528, height: 816 }, deviceScaleFactor: 2 });
    await page.setContent(flierHTML(f), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const pdf = path.join(OUT_PRINT, `gm-${f.id}-half-letter.pdf`);
    await page.pdf({ path: pdf, width: '5.5in', height: '8.5in', printBackground: true });
    const png = path.join(OUT_PRINT, `gm-${f.id}-preview.png`);
    await page.screenshot({ path: png, fullPage: false });
    made.push(path.relative(ROOT, pdf), path.relative(ROOT, png));
    await page.close();
  }
  await browser.close();
  made.forEach(m => console.log(m));
  console.log(made.length + ' files');
})();
