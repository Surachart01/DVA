import { useMemo, useState } from 'react';
import { BookOpen, Cloud, Upload, FlaskConical, Copy, Check, X, Download, Database, TriangleAlert, Info } from 'lucide-react';
import content from './researchContent.json';
import { getApiUrl, setApiUrl, fetchAllRecords } from './storage.js';
import { mean, sd, sum, pairedT, effectivenessIndex, itemAnalysis, interpretLikert, fmt, fmtP } from './stats.js';

const TEST_TOTAL = content.test.items.length;
const ACTS = content.activities;
const ACT_TOTAL = sum(ACTS.map(a => a.quiz.length));
const SURVEY_ITEMS = content.survey.aspects.flatMap(a => a.items.map(it => ({ ...it, aspect: a.name })));

// เลือกบันทึกครั้งแรกของผู้เรียนแต่ละคนในแต่ละรายการ (ใช้ผลครั้งแรกเป็นข้อมูลวิจัย)
function organize(records) {
  const seen = new Set();
  const uniq = records.filter(r => r && r.code && r.kind && !seen.has(r.id) && seen.add(r.id));
  uniq.sort((a, b) => String(a.ts).localeCompare(String(b.ts)));
  const by = {};
  const attempts = {};
  for (const r of uniq) {
    by[r.code] ??= {};
    attempts[`${r.code}|${r.kind}`] = (attempts[`${r.code}|${r.kind}`] || 0) + 1;
    if (!by[r.code][r.kind]) by[r.code][r.kind] = r;
  }
  const codes = Object.keys(by).filter(c => by[c].consent || Object.values(by[c]).some(r => r.consent === true)).sort((a, b) => a.localeCompare(b, 'th', { numeric: true }));
  const repeats = Object.entries(attempts).filter(([, n]) => n > 1).map(([k, n]) => `${k.replace('|', ' · ')} (${n} ครั้ง)`);
  return { by, codes, repeats, totalRecords: uniq.length };
}

function toCsv(rows) {
  const esc = v => { const s = v === null || v === undefined ? '' : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  return '﻿' + rows.map(r => r.map(esc).join(',')).join('\n');
}
function download(name, text, type = 'text/csv;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a'); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ข้อมูลจำลองสำหรับทดลองระบบเท่านั้น ห้ามใช้ในรายงานวิจัย
function demoRecords() {
  let s = 42; const rnd = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
  const norm = () => Math.sqrt(-2 * Math.log(rnd() + 1e-9)) * Math.cos(2 * Math.PI * rnd());
  const out = []; let t = Date.parse('2026-11-16T08:00:00Z');
  const rec = (code, kind, extra) => out.push({ id: `${code}-${kind}`, ts: new Date(t += 60000).toISOString(), code, group: 'ข้อมูลจำลอง', kind, consent: true, ...extra });
  const diff = Object.fromEntries(content.test.items.map((it, i) => [it.id, -1 + (i % 7) * 0.35]));
  for (let i = 1; i <= 30; i++) {
    const code = `DEMO${String(i).padStart(2, '0')}`; const ability = norm();
    const answerTest = shift => {
      const answers = {}; let score = 0;
      for (const it of content.test.items) {
        const p = 1 / (1 + Math.exp(-(ability + shift - diff[it.id])));
        const ok = rnd() < p; answers[it.id] = ok ? it.answer : (it.answer + 1 + Math.floor(rnd() * 3)) % 4; score += ok;
      }
      return { answers, score, total: TEST_TOTAL, durationSec: 900 + Math.floor(rnd() * 600) };
    };
    rec(code, 'consent');
    rec(code, 'pretest', answerTest(-0.9));
    for (const a of ACTS) {
      const answers = {}; let score = 0;
      for (const q of a.quiz) { const ok = rnd() < 1 / (1 + Math.exp(-(ability + 1.9))); answers[q.id] = ok ? q.answer : (q.answer + 1) % 4; score += ok; }
      rec(code, a.id, { answers, score, total: a.quiz.length, durationSec: 2400 });
    }
    rec(code, 'posttest', answerTest(1.6));
    const answers = Object.fromEntries(SURVEY_ITEMS.map(it => [it.id, Math.max(1, Math.min(5, Math.round(4.3 + 0.6 * norm())))]));
    rec(code, 'survey', { answers, extra: { comment: i % 6 === 0 ? 'ต้องการตัวอย่างเพิ่มเติมในขั้นการเชื่อมตาราง' : '' } });
  }
  return out;
}


export default function TeacherDashboard() {
  const [api, setApi] = useState(getApiUrl);
  const [key, setKey] = useState('');
  const [records, setRecords] = useState([]);
  const [source, setSource] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [itemTest, setItemTest] = useState('posttest');
  const [tab, setTab] = useState('summary');
  const [copied, setCopied] = useState(false);

  async function load() {
    setError(''); setLoading(true);
    try { setApiUrl(api.trim()); const r = await fetchAllRecords(api.trim(), key); setRecords(r); setSource(`Google Sheets · ${new Date().toLocaleString('th-TH')}`); }
    catch (e) { setError(e.message || 'ไม่สามารถเชื่อมต่อระบบได้'); }
    finally { setLoading(false); }
  }
  async function importFile(file) {
    setError('');
    try { const data = JSON.parse(await file.text()); const r = Array.isArray(data) ? data : data.records; if (!Array.isArray(r)) throw new Error(); setRecords(r); setSource(`ไฟล์ ${file.name}`); }
    catch { setError('ไฟล์ไม่ถูกต้อง ใช้ไฟล์ JSON ที่ส่งออกจากหน้านี้'); }
  }

  const data = useMemo(() => organize(records), [records]);
  const studentLink = api.trim() ? `${window.location.origin}${window.location.pathname}?api=${encodeURIComponent(api.trim())}` : '';

  const analysis = useMemo(() => {
    const { by, codes } = data;
    const rows = codes.map(c => {
      const r = by[c]; const acts = ACTS.map(a => r[a.id]?.score);
      return { code: c, group: Object.values(r)[0]?.group || '', pre: r.pretest?.score, acts, post: r.posttest?.score, survey: !!r.survey };
    });
    const paired = rows.filter(r => Number.isFinite(r.pre) && Number.isFinite(r.post));
    const pre = paired.map(r => r.pre), post = paired.map(r => r.post);
    const t = paired.length >= 2 ? pairedT(pre, post) : null;
    const actComplete = rows.filter(r => r.acts.every(Number.isFinite));
    const actSums = actComplete.map(r => sum(r.acts));
    const e1 = actComplete.length ? (mean(actSums) / ACT_TOTAL) * 100 : NaN;
    const e2Rows = rows.filter(r => Number.isFinite(r.post));
    const e2 = e2Rows.length ? (mean(e2Rows.map(r => r.post)) / TEST_TOTAL) * 100 : NaN;
    const ei = paired.length ? effectivenessIndex(pre, post, TEST_TOTAL) : NaN;
    const perActivity = ACTS.map((a, i) => { const v = rows.map(r => r.acts[i]).filter(Number.isFinite); return { a, n: v.length, m: mean(v), s: sd(v), pct: (mean(v) / a.quiz.length) * 100 }; });

    const itemRows = codes.map(c => by[c][itemTest]).filter(Boolean).map(r => ({
      total: r.score, correct: Object.fromEntries(content.test.items.map(it => [it.id, r.answers?.[it.id] === it.answer ? 1 : 0])),
    }));
    const items = itemAnalysis(itemRows, content.test.items);

    const surveyRecs = codes.map(c => by[c].survey).filter(Boolean);
    const surveyStats = SURVEY_ITEMS.map(it => { const v = surveyRecs.map(r => Number(r.answers?.[it.id])).filter(Number.isFinite); return { ...it, n: v.length, m: mean(v), s: sd(v) }; });
    const aspectStats = content.survey.aspects.map(asp => {
      const v = surveyRecs.flatMap(r => asp.items.map(it => Number(r.answers?.[it.id]))).filter(Number.isFinite);
      return { name: asp.name, m: mean(v), s: sd(v) };
    });
    const allSurvey = surveyRecs.flatMap(r => SURVEY_ITEMS.map(it => Number(r.answers?.[it.id]))).filter(Number.isFinite);
    const comments = surveyRecs.map(r => r.extra?.comment).filter(Boolean);
    return { rows, paired, pre, post, t, actComplete, e1, e2, e2n: e2Rows.length, ei, perActivity, items, itemN: itemRows.length, surveyStats, aspectStats, surveyAll: { m: mean(allSurvey), s: sd(allSurvey), n: surveyRecs.length }, comments };
  }, [data, itemTest]);

  function exportScores() {
    const head = ['รหัสผู้เรียน', 'กลุ่มเรียน', `ก่อนเรียน (${TEST_TOTAL})`, ...ACTS.map(a => `${a.id} (${a.quiz.length})`), `รวมระหว่างเรียน (${ACT_TOTAL})`, `หลังเรียน (${TEST_TOTAL})`, 'ผลต่าง', 'ตอบแบบประเมิน'];
    const body = analysis.rows.map(r => [r.code, r.group, r.pre ?? '', ...r.acts.map(x => x ?? ''), r.acts.every(Number.isFinite) ? sum(r.acts) : '', r.post ?? '', Number.isFinite(r.pre) && Number.isFinite(r.post) ? r.post - r.pre : '', r.survey ? 'ใช่' : '']);
    download('คะแนนรายบุคคล_Modeling.csv', toCsv([head, ...body]));
  }
  function exportItems() {
    const head = ['รหัสผู้เรียน', 'แบบทดสอบ', ...content.test.items.map((_, i) => `ข้อ ${i + 1}`), 'คะแนนรวม'];
    const body = [];
    for (const c of data.codes) for (const kind of ['pretest', 'posttest']) {
      const r = data.by[c][kind]; if (!r) continue;
      body.push([c, kind === 'pretest' ? 'ก่อนเรียน' : 'หลังเรียน', ...content.test.items.map(it => (r.answers?.[it.id] === it.answer ? 1 : 0)), r.score]);
    }
    download('คำตอบรายข้อ_Modeling.csv', toCsv([head, ...body]));
  }
  function exportSurvey() {
    const head = ['รหัสผู้เรียน', ...SURVEY_ITEMS.map((_, i) => `ข้อ ${i + 1}`), 'ข้อเสนอแนะ'];
    const body = data.codes.map(c => data.by[c].survey).filter(Boolean).map(r => [r.code, ...SURVEY_ITEMS.map(it => r.answers?.[it.id] ?? ''), r.extra?.comment || '']);
    download('ความพึงพอใจ_Modeling.csv', toCsv([head, ...body]));
  }

  const A = analysis; const isDemo = source.startsWith('ข้อมูลจำลอง');
  const verdict = (ok, pending) => pending
    ? <span className="r-verdict is-pending">รอข้อมูล</span>
    : ok ? <span className="r-verdict is-pass"><Check size={16} aria-hidden="true" />เป็นไปตามสมมติฐาน</span>
      : <span className="r-verdict is-fail"><X size={16} aria-hidden="true" />ไม่เป็นไปตามสมมติฐาน</span>;
  const e1e2Pending = !Number.isFinite(A.e1) || !Number.isFinite(A.e2);
  const TABS = [['summary', 'ผลตามสมมติฐาน'], ['scores', 'คะแนนรายบุคคล'], ['items', 'วิเคราะห์ข้อสอบ'], ['survey', 'ความพึงพอใจ'], ['export', 'ส่งออกข้อมูล']];

  return (
    <>
      <header className="r-bar">
        <div className="r-bar-inner">
          <a className="r-brand" href="./research.html#teacher">
            <span className="r-brand-mark"><BookOpen size={18} aria-hidden="true" /></span>
            <span><strong>31901-2012</strong><small>หน้าผู้สอน · วิจัยในชั้นเรียน</small></span>
          </a>
        </div>
      </header>
      <main className="r-page r-wide">
        <h1>ผลการวิจัยเรื่องการสร้างแบบจำลองข้อมูล</h1>

        <details className="r-source" open={!records.length}>
          <summary><Database size={18} aria-hidden="true" />แหล่งข้อมูล{records.length > 0 && <span className="r-source-now">{source} · ผู้เรียนที่ยินยอม {data.codes.length} คน</span>}</summary>
          <div className="r-source-body">
            <div className="r-form-grid">
              <label className="r-field"><span>ที่อยู่ระบบรับข้อมูล (Google Apps Script Web App URL)</span><input value={api} onChange={e => setApi(e.target.value)} placeholder="https://script.google.com/macros/s/…/exec" spellCheck={false} /></label>
              <label className="r-field"><span>รหัสผู้สอน (TEACHER_KEY)</span><input type="password" value={key} onChange={e => setKey(e.target.value)} autoComplete="off" /></label>
            </div>
            <div className="r-actions">
              <button className="r-primary" onClick={load} disabled={!api.trim() || !key || loading}><Cloud size={18} aria-hidden="true" />{loading ? 'กำลังดึงข้อมูล…' : 'ดึงข้อมูลจาก Google Sheets'}</button>
              <label className="r-file-button"><Upload size={18} aria-hidden="true" />นำเข้าไฟล์ JSON<input type="file" accept="application/json,.json" onChange={e => e.target.files[0] && importFile(e.target.files[0])} /></label>
              <button onClick={() => { setRecords(demoRecords()); setSource('ข้อมูลจำลอง 30 คน'); }}><FlaskConical size={18} aria-hidden="true" />ทดลองด้วยข้อมูลจำลอง</button>
            </div>
            {error && <p className="r-status is-error" role="alert"><TriangleAlert size={18} aria-hidden="true" />{error}</p>}
            {studentLink && (
              <div className="r-link">
                <span>ลิงก์สำหรับผู้เรียน</span>
                <code>{studentLink}</code>
                <button onClick={() => { navigator.clipboard?.writeText(studentLink); setCopied(true); setTimeout(() => setCopied(false), 1600); }}>{copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</button>
              </div>
            )}
          </div>
        </details>

        {!records.length && (
          <section className="r-empty">
            <Info size={24} aria-hidden="true" />
            <div>
              <h2>ยังไม่มีข้อมูล</h2>
              <p>ตั้งค่าระบบรับข้อมูลตามคู่มือ <code>03_คู่มือติดตั้งระบบเก็บข้อมูล.md</code> แล้วกดดึงข้อมูล หรือกด <strong>ทดลองด้วยข้อมูลจำลอง</strong> เพื่อฝึกอ่านผลก่อนเก็บข้อมูลจริง</p>
            </div>
          </section>
        )}

        {records.length > 0 && (
          <>
            {isDemo && <p className="r-status is-warn"><TriangleAlert size={18} aria-hidden="true" />กำลังแสดงข้อมูลจำลอง ใช้ฝึกอ่านผลเท่านั้น ห้ามนำไปรายงาน</p>}
            {data.repeats.length > 0 && <p className="r-status"><Info size={18} aria-hidden="true" />ระบบใช้ผลครั้งแรกในการวิเคราะห์ รายการที่ทำมากกว่าหนึ่งครั้ง: {data.repeats.join(', ')}</p>}

            <div className="r-tabs" role="tablist">
              {TABS.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'is-active' : ''} onClick={() => setTab(k)}>{l}</button>)}
            </div>

            {tab === 'summary' && (
              <section className="r-tabpanel">
                <ol className="r-hypotheses">
                  <li>
                    <div className="r-hyp-text"><h3>สมมติฐานที่ 1 ประสิทธิภาพของสื่อตามเกณฑ์ 80/80</h3><p>E1 จากแบบฝึกระหว่างเรียน และ E2 จากแบบทดสอบหลังเรียน</p></div>
                    <p className="r-hyp-value tabular">{fmt(A.e1)}/{fmt(A.e2)}</p>
                    {verdict(A.e1 >= 80 && A.e2 >= 80, e1e2Pending)}
                  </li>
                  <li>
                    <div className="r-hyp-text"><h3>สมมติฐานที่ 2 ผลสัมฤทธิ์หลังเรียนสูงกว่าก่อนเรียน</h3><p>t-test แบบ Dependent ทางเดียว n = {A.paired.length} · ดัชนีประสิทธิผล {fmt(A.ei, 4)}</p></div>
                    <p className="r-hyp-value tabular">{A.t ? <>t = {fmt(A.t.t)}<small>p {fmtP(A.t.p).startsWith('<') ? '' : '= '}{fmtP(A.t.p)}</small></> : '–'}</p>
                    {verdict(A.t && A.t.p < 0.05 && A.t.meanDiff > 0, !A.t)}
                  </li>
                  <li>
                    <div className="r-hyp-text"><h3>สมมติฐานที่ 3 ความพึงพอใจระดับมากขึ้นไป</h3><p>ค่าเฉลี่ยตั้งแต่ 3.51 · n = {A.surveyAll.n}</p></div>
                    <p className="r-hyp-value tabular">{fmt(A.surveyAll.m)}<small>ระดับ{interpretLikert(A.surveyAll.m)}</small></p>
                    {verdict(A.surveyAll.m >= 3.51, !A.surveyAll.n)}
                  </li>
                </ol>

                <h2>ตารางที่ 1 ประสิทธิภาพของสื่อการเรียนรู้ตามเกณฑ์ 80/80</h2>
                <div className="table-scroll"><table>
                  <thead><tr><th>คะแนน</th><th className="num">n</th><th className="num">คะแนนเต็ม</th><th className="num">x̄</th><th className="num">S.D.</th><th className="num">ร้อยละ</th></tr></thead>
                  <tbody>
                    {A.perActivity.map(p => <tr key={p.a.id}><td>{p.a.title}</td><td className="num">{p.n}</td><td className="num">{p.a.quiz.length}</td><td className="num">{fmt(p.m)}</td><td className="num">{fmt(p.s)}</td><td className="num">{fmt(p.pct)}</td></tr>)}
                    <tr className="r-total"><td>ระหว่างเรียนรวม (E1)</td><td className="num">{A.actComplete.length}</td><td className="num">{ACT_TOTAL}</td><td className="num">{fmt(mean(A.actComplete.map(r => sum(r.acts))))}</td><td className="num">{fmt(sd(A.actComplete.map(r => sum(r.acts))))}</td><td className="num">{fmt(A.e1)}</td></tr>
                    <tr className="r-total"><td>แบบทดสอบหลังเรียน (E2)</td><td className="num">{A.e2n}</td><td className="num">{TEST_TOTAL}</td><td className="num">{fmt(mean(A.rows.map(r => r.post).filter(Number.isFinite)))}</td><td className="num">{fmt(sd(A.rows.map(r => r.post).filter(Number.isFinite)))}</td><td className="num">{fmt(A.e2)}</td></tr>
                  </tbody>
                </table></div>

                <h2>ตารางที่ 2 เปรียบเทียบผลสัมฤทธิ์ทางการเรียนก่อนเรียนและหลังเรียน</h2>
                <div className="table-scroll"><table>
                  <thead><tr><th>การทดสอบ</th><th className="num">n</th><th className="num">คะแนนเต็ม</th><th className="num">x̄</th><th className="num">S.D.</th><th className="num">ΣD</th><th className="num">ΣD²</th><th className="num">t</th><th className="num">p (ทางเดียว)</th></tr></thead>
                  <tbody>
                    <tr><td>ก่อนเรียน</td><td className="num">{A.paired.length}</td><td className="num">{TEST_TOTAL}</td><td className="num">{fmt(mean(A.pre))}</td><td className="num">{fmt(sd(A.pre))}</td><td className="num" rowSpan={2}>{A.t ? A.t.sumD : '–'}</td><td className="num" rowSpan={2}>{A.t ? A.t.sumD2 : '–'}</td><td className="num" rowSpan={2}>{A.t ? `${fmt(A.t.t)}${A.t.p < 0.05 ? '*' : ''}` : '–'}</td><td className="num" rowSpan={2}>{A.t ? fmtP(A.t.p) : '–'}</td></tr>
                    <tr><td>หลังเรียน</td><td className="num">{A.paired.length}</td><td className="num">{TEST_TOTAL}</td><td className="num">{fmt(mean(A.post))}</td><td className="num">{fmt(sd(A.post))}</td></tr>
                  </tbody>
                </table></div>
                <p className="r-note">* มีนัยสำคัญทางสถิติที่ระดับ .05 · ใช้เฉพาะผู้เรียนที่มีคะแนนทั้งก่อนเรียนและหลังเรียน · ขนาดอิทธิพล Cohen's d<sub>z</sub> = {A.t ? fmt(A.t.dz) : '–'}</p>
              </section>
            )}

            {tab === 'scores' && (
              <section className="r-tabpanel">
                <h2>ตารางที่ 3 คะแนนรายบุคคล</h2>
                <div className="table-scroll"><table>
                  <thead><tr><th>รหัส</th><th className="num">ก่อนเรียน</th>{ACTS.map(a => <th key={a.id} className="num">{a.id}</th>)}<th className="num">หลังเรียน</th><th className="num">ผลต่าง</th><th>แบบประเมิน</th></tr></thead>
                  <tbody>{A.rows.map(r => <tr key={r.code}><td>{r.code}</td><td className="num">{r.pre ?? '–'}</td>{r.acts.map((x, i) => <td key={i} className="num">{x ?? '–'}</td>)}<td className="num">{r.post ?? '–'}</td><td className="num">{Number.isFinite(r.pre) && Number.isFinite(r.post) ? (r.post - r.pre > 0 ? '+' : '') + (r.post - r.pre) : '–'}</td><td>{r.survey ? 'ตอบแล้ว' : 'ยังไม่ตอบ'}</td></tr>)}</tbody>
                </table></div>
              </section>
            )}

            {tab === 'items' && (
              <section className="r-tabpanel">
                <h2>ตารางที่ 4 การวิเคราะห์ข้อสอบรายข้อ</h2>
                <div className="r-segmented" role="group" aria-label="เลือกแบบทดสอบ">
                  {[['posttest', 'แบบทดสอบหลังเรียน'], ['pretest', 'แบบทดสอบก่อนเรียน']].map(([k, l]) => <button key={k} className={itemTest === k ? 'is-active' : ''} aria-pressed={itemTest === k} onClick={() => setItemTest(k)}>{l}</button>)}
                </div>
                <p className="r-note">สำหรับการทดลองใช้เครื่องมือ (Try-out) ให้ใช้ผลจากกลุ่มทดลองใช้ที่ไม่ใช่กลุ่มตัวอย่าง · เกณฑ์ค่าความยากง่าย .20–.80 และค่าอำนาจจำแนกตั้งแต่ .20 ขึ้นไป</p>
                {A.items ? (
                  <>
                    <p>ค่าความเชื่อมั่น KR-20 = <strong className="tabular">{fmt(A.items.kr20)}</strong> (n = {A.items.n}, กลุ่มสูงและกลุ่มต่ำกลุ่มละ {A.items.groupSize} คน)</p>
                    <div className="table-scroll"><table>
                      <thead><tr><th className="num">ข้อ</th><th>จุดประสงค์</th><th className="num">ความยากง่าย (p)</th><th className="num">อำนาจจำแนก (r)</th><th>ผลการพิจารณา</th></tr></thead>
                      <tbody>{A.items.perItem.map((x, i) => { const it = content.test.items[i]; const ok = x.p >= 0.2 && x.p <= 0.8 && x.r >= 0.2; return <tr key={x.id} className={ok ? '' : 'problem-row'}><td className="num">{i + 1}</td><td>{it.objective}</td><td className="num">{fmt(x.p)}</td><td className="num">{fmt(x.r)}</td><td>{ok ? 'ใช้ได้' : 'ควรปรับปรุง'}</td></tr>; })}</tbody>
                    </table></div>
                  </>
                ) : <p className="r-status"><Info size={18} aria-hidden="true" />ต้องมีผลแบบทดสอบอย่างน้อย 2 คน (n ปัจจุบัน = {A.itemN})</p>}
              </section>
            )}

            {tab === 'survey' && (
              <section className="r-tabpanel">
                <h2>ตารางที่ 5 ความพึงพอใจของผู้เรียนต่อสื่อการเรียนรู้ (n = {A.surveyAll.n})</h2>
                <div className="table-scroll"><table>
                  <thead><tr><th>รายการประเมิน</th><th className="num">x̄</th><th className="num">S.D.</th><th>ระดับ</th></tr></thead>
                  <tbody>
                    {content.survey.aspects.map((asp, ai) => [
                      <tr key={asp.name} className="r-total"><td>{asp.name}</td><td className="num">{fmt(A.aspectStats[ai].m)}</td><td className="num">{fmt(A.aspectStats[ai].s)}</td><td>{interpretLikert(A.aspectStats[ai].m)}</td></tr>,
                      ...A.surveyStats.filter(x => x.aspect === asp.name).map(x => <tr key={x.id}><td className="r-indent">{SURVEY_ITEMS.findIndex(y => y.id === x.id) + 1}. {x.text}</td><td className="num">{fmt(x.m)}</td><td className="num">{fmt(x.s)}</td><td>{interpretLikert(x.m)}</td></tr>),
                    ])}
                    <tr className="r-total"><td>ภาพรวม</td><td className="num">{fmt(A.surveyAll.m)}</td><td className="num">{fmt(A.surveyAll.s)}</td><td>{interpretLikert(A.surveyAll.m)}</td></tr>
                  </tbody>
                </table></div>
                {A.comments.length > 0 && <><h3>ข้อเสนอแนะจากผู้เรียน</h3><ul className="r-comments">{A.comments.map((c, i) => <li key={i}>{c}</li>)}</ul></>}
              </section>
            )}

            {tab === 'export' && (
              <section className="r-tabpanel">
                <h2>ส่งออกข้อมูล</h2>
                <p className="r-note">ไฟล์ CSV เปิดด้วย Excel หรือ Google Sheets ได้ทันที ควรสำรองข้อมูลทั้งหมดเป็น JSON ทุกครั้งหลังเก็บข้อมูล</p>
                <ul className="r-export">
                  <li><div><strong>คะแนนรายบุคคล</strong><small>ก่อนเรียน กิจกรรม 1–3 หลังเรียน และผลต่าง</small></div><button onClick={exportScores}><Download size={18} aria-hidden="true" />CSV</button></li>
                  <li><div><strong>คำตอบรายข้อ</strong><small>ถูก 1 ผิด 0 ทุกข้อ สำหรับวิเคราะห์ข้อสอบด้วยโปรแกรมอื่น</small></div><button onClick={exportItems}><Download size={18} aria-hidden="true" />CSV</button></li>
                  <li><div><strong>ความพึงพอใจ</strong><small>คะแนน 1–5 รายข้อ และข้อเสนอแนะ</small></div><button onClick={exportSurvey}><Download size={18} aria-hidden="true" />CSV</button></li>
                  <li><div><strong>สำรองข้อมูลทั้งหมด</strong><small>นำกลับเข้าหน้านี้ได้ด้วยปุ่มนำเข้าไฟล์ JSON</small></div><button onClick={() => download('ข้อมูลวิจัย_Modeling.json', JSON.stringify({ records }, null, 1), 'application/json')}><Download size={18} aria-hidden="true" />JSON</button></li>
                </ul>
              </section>
            )}
          </>
        )}
      </main>
    </>
  );
}
