// Runs after `vite build` (see package.json). Learners can open the published web,
// so dist/ keeps only the files the slides actually link to, and the build fails if
// anything that looks like an answer key would be published.
import { readFileSync, readdirSync, rmSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const learnerRoots = ['ชุดเรียน', 'วิจัย'];
const answerLike = /(Notebook_ตัวอย่าง|Notebook_ฝึกพิมพ์|_ฝึกพิมพ์\.ipynb|_ตัวอย่าง\.ipynb|Example|Answer|Teacher|เฉลย|สำหรับครู|คะแนน|midterm_|final_exam|แผนรายสัปดาห์)/i;

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

// 1. Collect every learner file referenced by the built pages and scripts.
const builtText = walk(dist)
  .filter(p => /\.(html|js)$/.test(p) && !learnerRoots.some(r => relative(dist, p).startsWith(r)))
  .map(p => readFileSync(p, 'utf8'))
  .join('\n');
const referenced = new Set();
for (const root of learnerRoots) {
  for (const m of builtText.matchAll(new RegExp(`${root}/[^'"\`\\s)<>{}\\\\]+`, 'g'))) {
    let ref = m[0];
    try { ref = decodeURIComponent(ref); } catch { /* keep as written */ }
    if (!ref.endsWith('/') && !ref.includes('$')) referenced.add(ref);
  }
}
// Chart pages load Plotly from the same folder.
if ([...referenced].some(r => r.startsWith('ชุดเรียน/ตัวอย่าง/') && r.endsWith('.html'))) {
  referenced.add('ชุดเรียน/ตัวอย่าง/plotly.min.js');
}

// 2a. A question on a slide must not show its answer.
for (const marker of ['(คำตอบ:', 'แสดงแนวคำตอบ']) {
  if (builtText.includes(marker)) {
    console.error(`ไม่เผยแพร่: สไลด์ยังแสดงคำตอบ ("${marker}") ให้ลบคำตอบออกจากต้นฉบับก่อน build`);
    process.exit(1);
  }
}

// 2b. Refuse to publish answer-like files even if a slide links to them.
const blocked = [...referenced].filter(r => answerLike.test(r));
if (blocked.length) {
  console.error('ไม่เผยแพร่ไฟล์ที่อาจเป็นเฉลย: สไลด์ยังลิงก์ไปยังไฟล์ต่อไปนี้ ให้ลบลิงก์ออกจากต้นฉบับก่อน build');
  blocked.forEach(b => console.error('  - ' + b));
  process.exit(1);
}

// 3. Delete every learner file that no slide links to.
let removed = 0;
for (const root of learnerRoots) {
  for (const path of walk(join(dist, root))) {
    const rel = relative(dist, path).split('\\').join('/');
    if (!referenced.has(rel)) { rmSync(path); removed += 1; }
  }
}
// Remove folders left empty.
function pruneEmpty(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) pruneEmpty(path);
  }
  if (readdirSync(dir).length === 0) rmSync(dir, { recursive: true });
}
learnerRoots.forEach(r => pruneEmpty(join(dist, r)));

const missing = [...referenced].filter(r => !existsSync(join(dist, r)));
console.log(`prune-dist: kept ${referenced.size - missing.length} linked learner files, removed ${removed} unlinked files`);
if (missing.length) {
  console.warn('prune-dist: slides link to files that do not exist:');
  missing.forEach(m => console.warn('  - ' + m));
}
