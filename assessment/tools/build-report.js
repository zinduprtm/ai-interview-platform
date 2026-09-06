const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const ROOT = '/mnt/d_drive/linuxstorage/Projects/ai-interview-platform';
const A = path.join(ROOT, 'assessment');
const SHOTS = path.join(A, 'screenshots');

const SECTIONS = [
  ['02-context-and-domain.md',   'Step 2 — Product Context & Domain Immersion'],
  ['03-problem-and-gap.md',      'Step 3 — Problem & Gap to Ideal Condition'],
  ['04-strategy-and-tradeoffs.md','Step 4 — Revamp Strategy, Acceptance Criteria & Trade-offs'],
  ['05-execution-proof.md',      'Step 5 — Monozukuri Execution Proof'],
  ['ai-verification-log.md',     'Appendix A — AI Verification Log'],
  ['assumptions.md',             'Appendix B — Assumptions & Ambiguities'],
  ['pull-request-body.md',       'Appendix C — Pull Request Description'],
];

const SHOT_GROUPS = [
  ['Before', [
    ['01-ui-before-fitgap.png',
     'The fit/gap report as shipped. The <b>Required</b> column is empty on all six rows, and no ✏ marker appears anywhere — despite a real assessor override on Communication and a legend that promises one.'],
    ['02-ui-before-portofolio(can\'t choose vacancy when mobile view).png',
     'The portfolio page at phone width. Content is squeezed into a narrow column beside empty space, body text wraps to one or two words per line, and the override control truncates to “Edit ov…”.'],
    ['13-mobile-shell-before-header-fix.png',
     'The application shell at phone width — the actual cause, found only after opening a real browser. Every page inherited it, so patching individual components could not have fixed it (VER-04).'],
  ]],
  ['After', [
    ['10-after-fitgap-desktop.png',
     'Required is populated on every row. Communication shows <s>L2</s> → L3 with the ✏ marker, so the assessor’s correction is visible on the deciding screen. The new <b>Evidence</b> column separates the two “Match” verdicts that previously looked identical: React at <b>High · 3 quotes</b> against Micro-frontend at <b>Low · 1 quote</b>. Testing &amp; Quality Assurance reads “Never probed” on a dashed row rather than a bare dash, and the summary counts it explicitly.'],
    ['14-after-degraded-banner.png',
     'The same page, lower. A failed model call is now announced rather than hidden, and the fallback text appears under “Rule-based Summary” instead of masquerading as a culture assessment. The sentence is also grammatical — it previously read “1 gaps”.'],
    ['11-after-fitgap-mobile.png',
     'The comparison table below the <code>sm</code> breakpoint. Rows become labelled cards using the same <code>data-label</code> attributes the desktop table uses, so there is one DOM rather than a duplicated mobile tree.'],
    ['12-after-empty-state.png',
     'A vacancy with no skills defined. This previously raised <code>RecordInvalid</code>, exhausted the worker’s retries and left the UI polling a report that would never arrive. It now renders an empty state naming the cause. The panel below also shows confidence rendered verbatim — “Medium confidence”, where the old code printed “confirmed”.'],
  ]],
];

const b64 = f => fs.readFileSync(path.join(SHOTS, f)).toString('base64');
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;');

marked.setOptions({ mangle: false, headerIds: true });

let toc = '', body = '';
SECTIONS.forEach(([file, title], i) => {
  const id = 's' + i;
  toc += `<li><a href="#${id}">${title}</a></li>`;
  let md = fs.readFileSync(path.join(A, file), 'utf8');
  md = md.replace(/^#\s+.*\n/, '');               // drop the file's own H1
  body += `<section id="${id}"><h1>${title}</h1>${marked(md)}</section>`;
});

let shots = '<section id="shots"><h1>Appendix D — Screenshots</h1>';
SHOT_GROUPS.forEach(([group, items]) => {
  shots += `<h2>${group}</h2>`;
  items.forEach(([f, cap]) => {
    if (!fs.existsSync(path.join(SHOTS, f))) return;
    shots += `<figure><img src="data:image/png;base64,${b64(f)}"><figcaption>${cap}</figcaption></figure>`;
  });
});
shots += '</section>';
toc += '<li><a href="#shots">Appendix D — Screenshots</a></li>';

const html = `<!doctype html><html><head><meta charset="utf-8"><title>Rakamin Case Study — Fullstack Product Engineer</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body { font: 10.5pt/1.55 "Inter","Helvetica Neue",Arial,sans-serif; color:#18181b; margin:0; }
  h1 { font-size:19pt; line-height:1.25; margin:0 0 .8em; letter-spacing:-.01em; }
  h2 { font-size:14pt; margin:1.6em 0 .5em; letter-spacing:-.01em; border-bottom:1px solid #e4e4e7; padding-bottom:.25em; }
  h3 { font-size:11.5pt; margin:1.3em 0 .4em; }
  p, li { orphans:3; widows:3; }
  code { font:9.5pt "JetBrains Mono",Consolas,monospace; background:#f4f4f5; padding:.1em .3em; border-radius:3px; }
  pre { background:#fafafa; border:1px solid #e4e4e7; border-radius:6px; padding:.7em .9em; overflow:hidden;
        white-space:pre-wrap; word-break:break-word; page-break-inside:avoid; }
  pre code { background:none; padding:0; font-size:8.6pt; line-height:1.45; }
  table { border-collapse:collapse; width:100%; margin:.9em 0; font-size:9pt; page-break-inside:avoid; }
  th,td { border:1px solid #e4e4e7; padding:.42em .6em; text-align:left; vertical-align:top; }
  th { background:#f4f4f5; font-weight:600; }
  blockquote { margin:1em 0; padding:.6em 1em; border-left:3px solid #a1a1aa; background:#fafafa;
               font-style:italic; page-break-inside:avoid; }
  section { page-break-before:always; }
  section:first-of-type { page-break-before:avoid; }
  figure { margin:1.4em 0; page-break-inside:avoid; }
  figure img { width:100%; border:1px solid #d4d4d8; border-radius:6px; }
  figcaption { font-size:8.8pt; color:#52525b; margin-top:.5em; line-height:1.45; }
  .cover { page-break-after:always; padding-top:52mm; }
  .cover h1 { font-size:27pt; margin-bottom:.15em; }
  .cover .sub { font-size:13pt; color:#52525b; margin-bottom:2.6em; }
  .cover .thesis { border-left:3px solid #18181b; padding:.8em 1.2em; font-size:11.5pt; background:#fafafa; margin-bottom:2.2em; }
  .cover dl { display:grid; grid-template-columns:34mm 1fr; gap:.45em 1em; font-size:10pt; }
  .cover dt { color:#71717a; }
  .cover dd { margin:0; }
  nav { page-break-after:always; }
  nav ol { padding-left:1.2em; line-height:2; }
  a { color:#18181b; }
</style></head><body>

<div class="cover">
  <h1>Evidence-Aware Fit/Gap</h1>
  <div class="sub">Rakamin Case Study &middot; Fullstack Product Engineer</div>
  <div class="thesis">This system measures how much evidence stands behind each judgement, and then discards that measurement at the exact moment a human uses it to decide.</div>
  <dl>
    <dt>Candidate</dt><dd>Zindu Pratama</dd>
    <dt>Submitted</dt><dd>7 September 2026</dd>
    <dt>Pull request</dt><dd>github.com/rakamindev/ai-interview-platform/pull/116<br><span style="color:#71717a">open, not merged</span></dd>
    <dt>Video</dt><dd>${process.env.VIDEO_LINK || '__PASTE_VIDEO_LINK_HERE__'}</dd>
    <dt>Result</dt><dd>13 findings documented, 11 fixed, 3 P0 closed &middot; 0 &rarr; 52 automated tests &middot; CI from nothing</dd>
  </dl>
</div>

<nav><h1>Contents</h1><ol>${toc}</ol></nav>
${body}${shots}
</body></html>`;

const out = path.join(SHOTS, '..', '..', 'report.html');
fs.writeFileSync(out, html);
console.log('written:', out, (html.length/1024/1024).toFixed(1)+' MB');
