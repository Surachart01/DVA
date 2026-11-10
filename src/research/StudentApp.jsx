import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen, CheckCircle2, Circle, ArrowLeft, ArrowRight, Download, Lock, Eye, ClipboardList,
  ListChecks, MessageSquare, Code2, CloudOff, Cloud, TriangleAlert, Check, X, LogOut, ShieldCheck, Lightbulb,
} from 'lucide-react';
import content from './researchContent.json';
import { getApiUrl, getProfile, setProfile, clearProfile, localRecords, submitRecord, retryPending, pendingCount } from './storage.js';

const LETTERS = ['ก', 'ข', 'ค', 'ง'];
const TEST_TOTAL = content.test.items.length;

// สุ่มลำดับข้อแบบกำหนดค่าเริ่มต้นจากรหัสผู้เรียน เพื่อให้ลำดับเดิมเมื่อโหลดหน้าใหม่
function seeded(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
  return () => { h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
}
function shuffled(list, seed) {
  const rnd = seeded(seed); const a = [...list];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const normalize = s => s.trim().replace(/\s+/g, '').replace(/"/g, "'");

const PHASES = [
  { name: 'ก่อนเรียน', note: 'วัดความรู้เดิมก่อนเริ่มกิจกรรม', tasks: [
    { kind: 'pretest', label: 'แบบทดสอบก่อนเรียน', meta: `${TEST_TOTAL} ข้อ · ${content.test.minutes} นาที`, icon: ClipboardList, once: true },
  ] },
  { name: 'ระหว่างเรียน', note: 'เขียนคำสั่งทีละขั้น ตรวจสอบทันที แล้วรันใน Google Colab', tasks: content.activities.map(a => ({
    kind: a.id, label: a.title.replace(/^กิจกรรมที่ \d+ /, ''), number: a.title.match(/กิจกรรมที่ \d+/)?.[0],
    meta: `${a.steps.length} ขั้นตอน · แบบฝึก ${a.quiz.length} ข้อ · ${a.minutes} นาที`, icon: Code2,
  })) },
  { name: 'หลังเรียน', note: 'วัดผลหลังจบกิจกรรมที่ 3', tasks: [
    { kind: 'posttest', label: 'แบบทดสอบหลังเรียน', meta: `${TEST_TOTAL} ข้อ · ${content.test.minutes} นาที`, icon: ListChecks, once: true },
    { kind: 'survey', label: 'แบบประเมินความพึงพอใจ', meta: '12 ข้อ · 5 นาที', icon: MessageSquare, once: true },
  ] },
];
const ALL_TASKS = PHASES.flatMap(p => p.tasks);

function TopBar({ profile, onLogout }) {
  return (
    <header className="r-bar">
      <div className="r-bar-inner">
        <a className="r-brand" href="./research.html">
          <span className="r-brand-mark"><BookOpen size={18} aria-hidden="true" /></span>
          <span><strong>31901-2012</strong><small>การวิเคราะห์และนำเสนอข้อมูล</small></span>
        </a>
        {profile && (
          <div className="r-bar-user">
            <span className="r-chip"><span className="r-chip-label">รหัส</span>{profile.code}{profile.group ? <span className="r-chip-group">{profile.group}</span> : null}</span>
            {onLogout && <button className="r-ghost" onClick={onLogout} aria-label="เปลี่ยนรหัสผู้เรียน"><LogOut size={16} aria-hidden="true" /><span className="r-hide-sm">เปลี่ยนรหัส</span></button>}
          </div>
        )}
      </div>
    </header>
  );
}

function Login({ onLogin }) {
  const [code, setCode] = useState('');
  const [group, setGroup] = useState('');
  const [touched, setTouched] = useState(false);
  const valid = /^[A-Za-z0-9-]{2,15}$/.test(code.trim());
  return (
    <>
      <TopBar />
      <main className="r-page r-login">
        <section className="r-login-intro">
          <h1>การสร้างแบบจำลองข้อมูล</h1>
          <p className="r-lead">ชุดกิจกรรมสัปดาห์ที่ 10 ทบทวนและต่อยอดการตรวจสอบคีย์ การเชื่อมตาราง และการคำนวณตัวชี้วัด ด้วยข้อมูลร้านเครื่องดื่มชุดใหม่</p>
          <ol className="r-login-steps">
            <li><ClipboardList size={20} aria-hidden="true" /><span><strong>แบบทดสอบก่อนเรียน</strong>20 ข้อ วัดความรู้เดิม</span></li>
            <li><Code2 size={20} aria-hidden="true" /><span><strong>กิจกรรม 3 ชุด</strong>เขียนคำสั่งในช่องว่าง ระบบตรวจสอบทันที แล้วรันใน Colab</span></li>
            <li><ListChecks size={20} aria-hidden="true" /><span><strong>แบบทดสอบหลังเรียนและแบบประเมิน</strong>วัดผลหลังจบกิจกรรม</span></li>
          </ol>
        </section>
        <form className="r-panel r-login-form" noValidate onSubmit={e => { e.preventDefault(); setTouched(true); if (valid) onLogin({ code: code.trim().toUpperCase(), group: group.trim() }); }}>
          <h2>เข้าสู่กิจกรรม</h2>
          <label className="r-field">
            <span>รหัสผู้เรียน</span>
            <input value={code} onChange={e => setCode(e.target.value)} placeholder="เช่น 01 หรือ IT2-05" autoComplete="off" aria-invalid={touched && !valid} aria-describedby="code-help" />
            <small id="code-help" className={touched && !valid ? 'is-error' : ''}>
              {touched && !valid ? 'กรอกรหัส 2–15 ตัวอักษร ใช้ตัวอักษรภาษาอังกฤษ ตัวเลข หรือขีดกลางเท่านั้น' : 'ใช้รหัสที่ผู้สอนกำหนด ห้ามใช้เลขประจำตัวประชาชนหรือหมายเลขโทรศัพท์'}
            </small>
          </label>
          <label className="r-field">
            <span>กลุ่มเรียน <em>(ไม่บังคับ)</em></span>
            <input value={group} onChange={e => setGroup(e.target.value)} placeholder="เช่น ปวส.2/1" autoComplete="off" />
          </label>
          <button className="r-primary r-block">เข้าสู่กิจกรรม<ArrowRight size={18} aria-hidden="true" /></button>
        </form>
      </main>
    </>
  );
}

function Consent({ profile, onAnswer, onLogout }) {
  const [busy, setBusy] = useState(false);
  const answer = async agree => { setBusy(true); await onAnswer(agree); };
  return (
    <>
      <TopBar profile={profile} onLogout={onLogout} />
      <main className="r-page r-read">
        <ShieldCheck className="r-hero-icon" size={36} aria-hidden="true" />
        <h1>เอกสารชี้แจงและขอความยินยอมเข้าร่วมการวิจัย</h1>
        <p className="r-lead">ผู้สอนกำลังศึกษาผลของสื่อการเรียนรู้บนเว็บเรื่องการสร้างแบบจำลองข้อมูล เพื่อพัฒนาการจัดการเรียนการสอนในรายวิชานี้</p>
        <dl className="r-terms">
          <div><dt>ข้อมูลที่บันทึก</dt><dd>คะแนนแบบทดสอบก่อนเรียนและหลังเรียน คะแนนแบบฝึกระหว่างเรียน ระยะเวลาที่ใช้ และแบบประเมินความพึงพอใจ</dd></div>
          <div><dt>การระบุตัวตน</dt><dd>ระบบใช้รหัสผู้เรียนแทนชื่อ และรายงานผลการวิจัยในภาพรวมเท่านั้น</dd></div>
          <div><dt>การจัดเก็บ</dt><dd>ข้อมูลจัดเก็บในพื้นที่ที่ผู้สอนดูแล และใช้เพื่อการวิจัยครั้งนี้เท่านั้น</dd></div>
          <div><dt>ความสมัครใจ</dt><dd>ผู้เรียนที่ไม่ยินยอมยังใช้กิจกรรมการเรียนรู้ได้ตามปกติ โดยระบบจะไม่ส่งข้อมูลไปยังผู้สอน</dd></div>
        </dl>
        <div className="r-actions">
          <button className="r-primary" disabled={busy} onClick={() => answer(true)}><Check size={18} aria-hidden="true" />ยินยอมเข้าร่วมการวิจัย</button>
          <button disabled={busy} onClick={() => answer(false)}>ไม่ยินยอม และเรียนตามปกติ</button>
        </div>
      </main>
    </>
  );
}

function SendStatus({ sent, reason, consent }) {
  if (!consent) return <p className="r-status"><CloudOff size={18} aria-hidden="true" />ผู้เรียนไม่ได้ยินยอมเข้าร่วมการวิจัย ระบบบันทึกผลไว้ในเครื่องนี้เท่านั้น</p>;
  if (sent) return <p className="r-status is-ok"><Cloud size={18} aria-hidden="true" />ส่งข้อมูลถึงผู้สอนเรียบร้อยแล้ว</p>;
  if (reason === 'no-api') return <p className="r-status is-warn"><TriangleAlert size={18} aria-hidden="true" />ยังไม่ได้ตั้งค่าระบบรับข้อมูล ข้อมูลถูกเก็บไว้ในเครื่องนี้ ให้เปิดหน้าเว็บจากลิงก์ที่ผู้สอนแจก</p>;
  return <p className="r-status is-warn"><TriangleAlert size={18} aria-hidden="true" />ส่งข้อมูลไม่สำเร็จ ข้อมูลถูกเก็บไว้ในเครื่องนี้ กดส่งข้อมูลซ้ำได้ที่หน้ารายการกิจกรรม</p>;
}

function Home({ profile, records, onOpen, onLogout, onRetry, pending }) {
  const done = new Set(records.map(r => r.kind));
  const next = ALL_TASKS.find(t => !done.has(t.kind));
  const doneCount = ALL_TASKS.filter(t => done.has(t.kind)).length;
  return (
    <>
      <TopBar profile={profile} onLogout={onLogout} />
      <main className="r-page r-home">
        <div className="r-home-main">
          <h1>การสร้างแบบจำลองข้อมูล</h1>
          <div className="r-progress-line">
            <span>ทำแล้ว <strong>{doneCount}</strong> จาก {ALL_TASKS.length} รายการ</span>
            <div className="r-meter" role="progressbar" aria-valuemin={0} aria-valuemax={ALL_TASKS.length} aria-valuenow={doneCount}><span style={{ transform: `scaleX(${doneCount / ALL_TASKS.length})` }} /></div>
          </div>
          {!profile.consent && <p className="r-status"><CloudOff size={18} aria-hidden="true" />ผู้เรียนเลือกไม่เข้าร่วมการวิจัย ผลการทำกิจกรรมจะบันทึกไว้ในเครื่องนี้เท่านั้น</p>}
          {pending > 0 && <p className="r-status is-warn"><TriangleAlert size={18} aria-hidden="true" />มีข้อมูลที่ยังส่งไม่สำเร็จ {pending} รายการ<button className="r-inline-btn" onClick={onRetry}>ส่งข้อมูลซ้ำ</button></p>}

          <ol className="r-journey">
            {PHASES.map(phase => (
              <li key={phase.name} className="r-phase">
                <div className="r-phase-head"><h2>{phase.name}</h2><p>{phase.note}</p></div>
                <ul className="r-tasks">
                  {phase.tasks.map(t => {
                    const isDone = done.has(t.kind);
                    const isNext = next?.kind === t.kind;
                    const Icon = t.icon;
                    return (
                      <li key={t.kind} className={`r-task ${isDone ? 'is-done' : ''} ${isNext ? 'is-next' : ''}`}>
                        <span className="r-task-icon" aria-hidden="true">{isDone ? <CheckCircle2 size={22} /> : <Icon size={20} />}</span>
                        <div className="r-task-text">
                          {t.number && <span className="r-task-number">{t.number}</span>}
                          <strong>{t.label}</strong>
                          <small>{isDone && !t.once ? 'ทำแล้ว ทบทวนได้' : t.meta}</small>
                        </div>
                        {isDone && t.once
                          ? <span className="r-done-tag"><Check size={16} aria-hidden="true" />ส่งแล้ว</span>
                          : <button className={isNext ? 'r-primary' : ''} onClick={() => onOpen(t.kind)}>{isDone ? 'ทบทวน' : isNext ? 'เริ่มทำ' : 'เปิด'}{!isDone && <ArrowRight size={16} aria-hidden="true" />}</button>}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ol>
        </div>

        <aside className="r-home-side">
          <section>
            <h2>ไฟล์สำหรับกิจกรรม</h2>
            <p>อัปโหลดไฟล์ CSV ทั้งสองไฟล์เข้า Google Colab ก่อนเริ่มกิจกรรมที่ 1</p>
            <ul className="r-files">
              <li><a href="วิจัย/menu.csv" download><Download size={18} aria-hidden="true" /><span><strong>menu.csv</strong><small>ตารางมิติ · 5 เมนู</small></span></a></li>
              <li><a href="วิจัย/sales.csv" download><Download size={18} aria-hidden="true" /><span><strong>sales.csv</strong><small>ตารางข้อเท็จจริง · 20 รายการขาย</small></span></a></li>
              <li><a href="วิจัย/W10_Modeling_ผู้เรียน.ipynb" download><Download size={18} aria-hidden="true" /><span><strong>W10_Modeling_ผู้เรียน.ipynb</strong><small>Notebook สำหรับ Google Colab</small></span></a></li>
            </ul>
          </section>
          <section>
            <h2>วิธีทำกิจกรรม</h2>
            <ol className="r-howto">
              <li>เติมคำสั่งในช่องว่างบนหน้านี้ แล้วกดตรวจสอบ</li>
              <li>เมื่อถูกต้อง ให้พิมพ์คำสั่งเดียวกันใน Colab หนึ่งเซลล์ต่อหนึ่งขั้น</li>
              <li>เปรียบเทียบผลลัพธ์ใน Colab กับผลลัพธ์ที่ควรได้</li>
              <li>ทำแบบฝึกท้ายกิจกรรมด้วยตนเอง</li>
            </ol>
          </section>
        </aside>
      </main>
    </>
  );
}

function ChoiceList({ name, choices, value, onChange, reveal }) {
  return (
    <div className="r-choices" role="radiogroup">
      {choices.map((c, k) => {
        let state = '';
        if (reveal) state = k === reveal.answer ? 'is-right' : (value === k ? 'is-wrong' : 'is-locked');
        return (
          <label key={k} className={`r-choice ${value === k ? 'is-checked' : ''} ${state}`}>
            <input type="radio" name={name} checked={value === k} onChange={() => onChange(k)} disabled={!!reveal} />
            <span className="r-letter" aria-hidden="true">{LETTERS[k]}</span>
            <span className={`r-choice-text ${/^[a-z_]+[[.(]|^df\[/.test(c) ? 'is-code' : ''}`}>{c}</span>
            {reveal && k === reveal.answer && <Check className="r-choice-mark" size={18} aria-label="คำตอบที่ถูกต้อง" />}
            {reveal && value === k && k !== reveal.answer && <X className="r-choice-mark" size={18} aria-label="คำตอบที่เลือก" />}
          </label>
        );
      })}
    </div>
  );
}

function Test({ kind, profile, onBack, onSaved }) {
  const items = useMemo(() => shuffled(content.test.items, `${profile.code}-${kind}`), [profile.code, kind]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [started] = useState(() => Date.now());
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const answered = Object.keys(answers).length;
  const unanswered = items.map((it, i) => (answers[it.id] === undefined ? i + 1 : null)).filter(Boolean);
  const title = kind === 'pretest' ? 'แบบทดสอบก่อนเรียน' : 'แบบทดสอบหลังเรียน';
  const it = items[current];

  async function submit() {
    if (unanswered.length && !confirming) { setConfirming(true); return; }
    setBusy(true);
    const score = content.test.items.filter(x => answers[x.id] === x.answer).length;
    const res = await submitRecord({ code: profile.code, group: profile.group, kind, score, total: TEST_TOTAL, answers, durationSec: Math.round((Date.now() - started) / 1000), consent: profile.consent });
    setBusy(false);
    setResult({ score, sent: res.sent, reason: res.reason });
    onSaved();
  }

  if (result) {
    return (
      <>
        <TopBar profile={profile} />
        <main className="r-page r-read r-center">
          <CheckCircle2 className="r-hero-icon is-ok" size={44} aria-hidden="true" />
          <h1>ส่ง{title}เรียบร้อยแล้ว</h1>
          {kind === 'posttest'
            ? <p className="r-score"><strong>{result.score}</strong><span>จาก {TEST_TOTAL} คะแนน</span></p>
            : <p className="r-lead">ผู้สอนจะแจ้งผลแบบทดสอบก่อนเรียนหลังจบกิจกรรม ขั้นต่อไปคือกิจกรรมที่ 1</p>}
          <SendStatus sent={result.sent} reason={result.reason} consent={profile.consent} />
          <button className="r-primary" onClick={onBack}>กลับหน้ารายการกิจกรรม<ArrowRight size={18} aria-hidden="true" /></button>
        </main>
      </>
    );
  }
  return (
    <>
      <TopBar profile={profile} />
      <main className="r-page r-test">
        <div className="r-test-main">
          <button className="r-back" onClick={onBack}><ArrowLeft size={18} aria-hidden="true" />รายการกิจกรรม</button>
          <h1>{title}</h1>
          <p className="r-lead">เลือกคำตอบที่ถูกต้องที่สุดเพียงข้อเดียว ทำด้วยตนเองโดยไม่เปิดเอกสารประกอบ</p>
          <article className="r-question" aria-live="polite">
            <p className="r-q-count">ข้อ {current + 1} จาก {items.length}</p>
            <h2 className="r-stem">{it.stem}</h2>
            <ChoiceList name={`${kind}-${it.id}`} choices={it.choices} value={answers[it.id]} onChange={k => { setAnswers(a => ({ ...a, [it.id]: k })); setConfirming(false); }} />
          </article>
          <div className="r-pager">
            <button onClick={() => setCurrent(c => c - 1)} disabled={current === 0}><ArrowLeft size={18} aria-hidden="true" />ข้อก่อนหน้า</button>
            {current < items.length - 1
              ? <button className="r-primary" onClick={() => setCurrent(c => c + 1)}>ข้อถัดไป<ArrowRight size={18} aria-hidden="true" /></button>
              : <button className="r-primary" onClick={submit} disabled={busy}>{busy ? 'กำลังบันทึก…' : 'ส่งคำตอบ'}</button>}
          </div>
        </div>
        <aside className="r-test-nav" aria-label="เลือกข้อ">
          <p><strong>{answered}</strong> / {items.length} ข้อที่ตอบแล้ว</p>
          <div className="r-qgrid">
            {items.map((q, i) => (
              <button key={q.id} className={`${answers[q.id] !== undefined ? 'is-answered' : ''} ${i === current ? 'is-current' : ''}`} onClick={() => setCurrent(i)} aria-label={`ข้อ ${i + 1}${answers[q.id] !== undefined ? ' ตอบแล้ว' : ' ยังไม่ตอบ'}`} aria-current={i === current ? 'step' : undefined}>{i + 1}</button>
            ))}
          </div>
          {confirming && <p className="r-status is-warn"><TriangleAlert size={18} aria-hidden="true" />ยังไม่ได้ตอบข้อ {unanswered.join(', ')} กดส่งอีกครั้งเพื่อยืนยัน</p>}
          <button className="r-primary r-block" onClick={submit} disabled={busy}>{busy ? 'กำลังบันทึก…' : confirming ? 'ยืนยันการส่งคำตอบ' : 'ส่งคำตอบ'}</button>
        </aside>
      </main>
    </>
  );
}

function StepView({ step, index, total, state, onState }) {
  const [value, setValue] = useState('');
  const [tries, setTries] = useState(0);
  const [before, after] = step.template.split('____');
  const done = state === 'correct' || state === 'revealed';
  function check() {
    if (!value.trim()) return;
    const ok = step.accept.some(a => normalize(a) === normalize(value));
    setTries(t => t + 1);
    onState(ok ? 'correct' : 'wrong', tries === 0 && ok);
  }
  return (
    <article className="r-step">
      <p className="r-q-count">ขั้นที่ {index + 1} จาก {total}</p>
      <h2>{step.title}</h2>
      <p className="r-step-meaning">{step.meaning}</p>

      <div className="r-write">
        <div className="r-write-bar"><Code2 size={16} aria-hidden="true" />เขียน: เติมคำสั่งในช่องว่าง</div>
        <div className="r-code-line">
          <code>{before}</code>
          {done ? <code className="r-fill">{step.accept[0]}</code> : (
            <input aria-label={`คำสั่งที่ต้องเติมในขั้นที่ ${index + 1}`} value={value} autoFocus
              onChange={e => { setValue(e.target.value); if (state === 'wrong') onState(undefined, false); }}
              onKeyDown={e => { if (e.key === 'Enter') check(); }}
              size={Math.max(4, step.accept[0].length + 2)} spellCheck={false} autoCapitalize="off" autoComplete="off" />
          )}
          <code>{after}</code>
        </div>
      </div>

      {!done && (
        <div className="r-actions">
          <button className="r-primary" onClick={check} disabled={!value.trim()}><Check size={18} aria-hidden="true" />ตรวจสอบ</button>
          {tries >= 2 && <button onClick={() => onState('revealed', false)}><Eye size={18} aria-hidden="true" />แสดงเฉลย</button>}
        </div>
      )}
      {state === 'wrong' && <p className="r-status is-error" role="alert"><X size={18} aria-hidden="true" />ยังไม่ถูกต้อง ตรวจสอบตัวสะกด ตัวพิมพ์เล็กพิมพ์ใหญ่ และเครื่องหมาย แล้วลองอีกครั้ง{tries >= 2 ? ' หรือกดแสดงเฉลย' : ''}</p>}

      {done && (
        <section className="r-check" aria-live="polite">
          <p className={`r-status ${state === 'correct' ? 'is-ok' : ''}`}>
            {state === 'correct' ? <><CheckCircle2 size={18} aria-hidden="true" />ถูกต้อง พิมพ์คำสั่งนี้ใน Google Colab แล้วรันเซลล์</> : <><Eye size={18} aria-hidden="true" />เฉลยคำสั่ง พิมพ์คำสั่งนี้ใน Google Colab แล้วรันเซลล์</>}
          </p>
          <h3>ผลลัพธ์ที่ควรได้ใน Colab</h3>
          {step.table ? (
            <div className="table-scroll r-output-table"><table>
              <thead><tr><th>{step.table.index}</th>{step.table.columns.map(c => <th key={c}>{c}</th>)}</tr></thead>
              <tbody>{step.table.rows.map((r, i) => <tr key={i}>{r.map((v, j) => j === 0 ? <th key={j} scope="row">{v}</th> : <td key={j} className={/^-?[\d.]+$/.test(v) ? 'num' : ''}>{v}</td>)}</tr>)}</tbody>
            </table></div>
          ) : <pre className="r-output">{step.output || 'ไม่มีผลลัพธ์แสดง เมื่อรันสำเร็จจะไม่มีข้อความแจ้งข้อผิดพลาด'}</pre>}
          <p className="r-interpret"><Lightbulb size={18} aria-hidden="true" /><span>{step.interpretation}</span></p>
        </section>
      )}
    </article>
  );
}

function Activity({ activity, profile, onBack, onSaved }) {
  const total = activity.steps.length;
  const [current, setCurrent] = useState(0);
  const [states, setStates] = useState({});
  const [firstTry, setFirstTry] = useState({});
  const [started] = useState(() => Date.now());
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const isDone = i => states[i] === 'correct' || states[i] === 'revealed';
  const unlocked = i => i === 0 || isDone(i - 1);
  const allDone = activity.steps.every((_, i) => isDone(i));
  const onQuiz = current === total;
  const number = activity.title.match(/กิจกรรมที่ \d+/)?.[0];

  useEffect(() => { window.scrollTo(0, 0); }, [current]);

  async function submitQuiz() {
    const score = activity.quiz.filter(q => answers[q.id] === q.answer).length;
    const extra = { stepsFirstTry: Object.values(firstTry).filter(Boolean).length, stepsRevealed: Object.values(states).filter(s => s === 'revealed').length, steps: total };
    const res = await submitRecord({ code: profile.code, group: profile.group, kind: activity.id, score, total: activity.quiz.length, answers, durationSec: Math.round((Date.now() - started) / 1000), extra, consent: profile.consent });
    setResult({ score, sent: res.sent, reason: res.reason });
    onSaved();
  }

  return (
    <>
      <TopBar profile={profile} />
      <main className="r-page r-activity">
        <button className="r-back" onClick={onBack}><ArrowLeft size={18} aria-hidden="true" />รายการกิจกรรม</button>
        <header className="r-activity-head">
          <h1><span>{number}</span>{activity.title.replace(/^กิจกรรมที่ \d+ /, '')}</h1>
          <p className="r-lead">{activity.goal}</p>
        </header>

        <nav className="r-rail" aria-label="ขั้นตอนของกิจกรรม">
          <ol>
            {activity.steps.map((s, i) => (
              <li key={i}>
                <button className={`${isDone(i) ? 'is-done' : ''} ${current === i ? 'is-current' : ''}`} disabled={!unlocked(i)} onClick={() => setCurrent(i)} aria-current={current === i ? 'step' : undefined} aria-label={`ขั้นที่ ${i + 1} ${s.title}${isDone(i) ? ' เสร็จแล้ว' : ''}`}>
                  {isDone(i) ? <Check size={16} aria-hidden="true" /> : unlocked(i) ? i + 1 : <Lock size={14} aria-hidden="true" />}
                </button>
              </li>
            ))}
            <li className="r-rail-quiz">
              <button className={`${result ? 'is-done' : ''} ${onQuiz ? 'is-current' : ''}`} disabled={!allDone} onClick={() => setCurrent(total)} aria-current={onQuiz ? 'step' : undefined}>
                {allDone ? <ListChecks size={16} aria-hidden="true" /> : <Lock size={14} aria-hidden="true" />}<span>แบบฝึก</span>
              </button>
            </li>
          </ol>
        </nav>

        {!onQuiz && (
          <>
            <StepView key={current} step={activity.steps[current]} index={current} total={total} state={states[current]}
              onState={(st, first) => { setStates(x => ({ ...x, [current]: st })); if (st === 'correct') setFirstTry(x => ({ ...x, [current]: first })); }} />
            <div className="r-pager">
              <button onClick={() => setCurrent(c => c - 1)} disabled={current === 0}><ArrowLeft size={18} aria-hidden="true" />ขั้นก่อนหน้า</button>
              <button className="r-primary" disabled={!isDone(current)} onClick={() => setCurrent(c => c + 1)}>
                {current === total - 1 ? 'ไปทำแบบฝึกท้ายกิจกรรม' : 'ขั้นถัดไป'}<ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </>
        )}

        {onQuiz && (
          <section className="r-quiz">
            <h2>แบบฝึกท้ายกิจกรรม</h2>
            <p className="r-lead">{activity.quiz.length} ข้อ ตอบด้วยตนเอง เมื่อส่งแล้วระบบจะแสดงเฉลยพร้อมคำอธิบาย</p>
            {result && (
              <div className="r-quiz-result">
                <p className="r-score"><strong>{result.score}</strong><span>จาก {activity.quiz.length} คะแนน</span></p>
                <SendStatus sent={result.sent} reason={result.reason} consent={profile.consent} />
              </div>
            )}
            <ol className="r-quiz-list">
              {activity.quiz.map((q, n) => (
                <li key={q.id}>
                  <h3 className="r-stem"><span>{n + 1}.</span>{q.stem}</h3>
                  <ChoiceList name={q.id} choices={q.choices} value={answers[q.id]} onChange={k => setAnswers(a => ({ ...a, [q.id]: k }))} reveal={result ? { answer: q.answer } : null} />
                  {result && <p className="r-explain"><Lightbulb size={16} aria-hidden="true" /><span>{q.explain}</span></p>}
                </li>
              ))}
            </ol>
            <div className="r-pager">
              <button onClick={() => setCurrent(total - 1)}><ArrowLeft size={18} aria-hidden="true" />ทบทวนขั้นตอน</button>
              {result
                ? <button className="r-primary" onClick={onBack}>กลับหน้ารายการกิจกรรม<ArrowRight size={18} aria-hidden="true" /></button>
                : <button className="r-primary" disabled={Object.keys(answers).length < activity.quiz.length} onClick={submitQuiz}>ส่งคำตอบแบบฝึก ({Object.keys(answers).length}/{activity.quiz.length})</button>}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

function Survey({ profile, onBack, onSaved }) {
  const [answers, setAnswers] = useState({});
  const [comment, setComment] = useState('');
  const [sent, setSent] = useState(null);
  const [reason, setReason] = useState('');
  const all = content.survey.aspects.flatMap(a => a.items);
  const count = all.filter(it => answers[it.id]).length;
  let n = 0;
  async function submit() {
    const res = await submitRecord({ code: profile.code, group: profile.group, kind: 'survey', answers, extra: { comment: comment.trim() }, consent: profile.consent });
    setReason(res.reason); setSent(res.sent); onSaved();
  }
  if (sent !== null) return (
    <>
      <TopBar profile={profile} />
      <main className="r-page r-read r-center">
        <CheckCircle2 className="r-hero-icon is-ok" size={44} aria-hidden="true" />
        <h1>ขอบคุณที่ตอบแบบประเมิน</h1>
        <p className="r-lead">ผู้เรียนทำกิจกรรมครบทุกรายการแล้ว</p>
        <SendStatus sent={sent} reason={reason} consent={profile.consent} />
        <button className="r-primary" onClick={onBack}>กลับหน้ารายการกิจกรรม</button>
      </main>
    </>
  );
  return (
    <>
      <TopBar profile={profile} />
      <main className="r-page r-read r-survey">
        <button className="r-back" onClick={onBack}><ArrowLeft size={18} aria-hidden="true" />รายการกิจกรรม</button>
        <h1>แบบประเมินความพึงพอใจต่อสื่อการเรียนรู้</h1>
        <p className="r-lead">เลือกระดับที่ตรงกับความคิดเห็นของผู้เรียน คำตอบไม่มีผลต่อคะแนน</p>
        <div className="r-scale-key" aria-hidden="true">{[5, 4, 3, 2, 1].map(v => <span key={v}><b>{v}</b>{content.survey.scale[v - 1]}</span>)}</div>
        {content.survey.aspects.map(asp => (
          <section key={asp.name} className="r-aspect">
            <h2>{asp.name}</h2>
            {asp.items.map(it => { n += 1; return (
              <fieldset key={it.id}>
                <legend><span>{n}.</span>{it.text}</legend>
                <div className="r-scale">
                  {[5, 4, 3, 2, 1].map(v => (
                    <label key={v} className={answers[it.id] === v ? 'is-checked' : ''}>
                      <input type="radio" name={it.id} checked={answers[it.id] === v} onChange={() => setAnswers(a => ({ ...a, [it.id]: v }))} />
                      <b>{v}</b><small>{content.survey.scale[v - 1]}</small>
                    </label>
                  ))}
                </div>
              </fieldset>
            ); })}
          </section>
        ))}
        <label className="r-field r-comment"><span>{content.survey.open} <em>(ไม่บังคับ)</em></span><textarea rows={4} value={comment} onChange={e => setComment(e.target.value)} /></label>
        <div className="r-sticky">
          <span>ตอบแล้ว <strong>{count}</strong> / {all.length} ข้อ</span>
          <button className="r-primary" disabled={count < all.length} onClick={submit}>ส่งแบบประเมิน</button>
        </div>
      </main>
    </>
  );
}

export default function StudentApp() {
  const [profile, setP] = useState(getProfile);
  const [view, setView] = useState('home');
  const [tick, setTick] = useState(0);
  const [pending, setPending] = useState(pendingCount);
  const records = useMemo(() => (profile ? localRecords(profile.code) : []), [profile, tick]);
  useEffect(() => { getApiUrl(); }, []);
  useEffect(() => { window.scrollTo(0, 0); }, [view]);

  function save(p) { setProfile(p); setP(p); }
  const refresh = () => { setTick(t => t + 1); setPending(pendingCount()); };
  const back = () => setView('home');
  const logout = () => { if (window.confirm('ต้องการเปลี่ยนรหัสผู้เรียนหรือไม่')) { clearProfile(); setP(null); setView('home'); } };

  if (!profile) return <Login onLogin={p => save({ ...p, consent: null })} />;
  if (profile.consent === null || profile.consent === undefined) {
    return <Consent profile={profile} onLogout={logout} onAnswer={async agree => {
      const p = { ...profile, consent: agree }; save(p);
      if (agree) await submitRecord({ code: p.code, group: p.group, kind: 'consent', consent: true });
      refresh();
    }} />;
  }
  if (view === 'pretest' || view === 'posttest') return <Test kind={view} profile={profile} onBack={back} onSaved={refresh} />;
  if (view === 'survey') return <Survey profile={profile} onBack={back} onSaved={refresh} />;
  const act = content.activities.find(a => a.id === view);
  if (act) return <Activity key={act.id} activity={act} profile={profile} onBack={back} onSaved={refresh} />;
  return <Home profile={profile} records={records} pending={pending} onOpen={setView} onLogout={logout}
    onRetry={async () => { await retryPending(); refresh(); }} />;
}
