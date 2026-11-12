import { useState } from 'react';
import {
  Code2,
  Sparkles,
  CheckCircle2,
  Circle,
  Download,
  FileText,
  RotateCcw,
  HelpCircle,
  Trophy,
  Flame,
  Target,
  AlertTriangle,
  Sliders,
  Layers,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import {
  SYNTAX_ANATOMY,
  SYNTAX_GOLDEN_RULES,
  PANDAS_FN_CATEGORIES,
  PANDAS_FN_CATALOG,
  PANDAS_GAME_STAGES,
  PANDAS_GAME_QUESTIONS,
  W4_THU_ASSIGNMENT_ITEMS
} from './w4ThursdayData';

function CodePanel({ code, label = 'คำสั่งภาษา Python (ตัวอย่างโครงสร้างคำสั่ง)' }) {
  return (
    <div className="code-block" style={{ userSelect: 'none' }}>
      <div className="code-toolbar">
        <span><Code2 size={15} /> {label}</span>
        <span>สังเกตชื่อฟังก์ชันและพารามิเตอร์ในวงเล็บ</span>
      </div>
      <pre style={{ userSelect: 'none' }}><code>{code}</code></pre>
    </div>
  );
}

export function W4SyntaxVisualizerDemo() {
  const [activeId, setActiveId] = useState('parameter');
  const [activeRule, setActiveRule] = useState(1);
  const currentPart = SYNTAX_ANATOMY.find(p => p.id === activeId) ?? SYNTAX_ANATOMY[0];
  const currentRule = SYNTAX_GOLDEN_RULES.find(r => r.num === activeRule) ?? SYNTAX_GOLDEN_RULES[0];

  return (
    <section className="demo fn-explorer">
      <p className="demo-caption">
        คลิกเลือกแต่ละส่วนของคำสั่งด้านล่างเพื่อศึกษาหน้าที่ของ <strong>Object</strong>, <strong>Function</strong>, <strong>Parameter</strong> และ <strong>Argument</strong>
      </p>

      <div className="w4-syntax-banner" role="group" aria-label="โครงสร้างคำสั่ง Pandas">
        <span className="w4-syntax-assign">df_clean = </span>
        {SYNTAX_ANATOMY.map(part => (
          <button
            key={part.id}
            type="button"
            className={`w4-syntax-chip ${activeId === part.id ? 'selected' : ''}`}
            onClick={() => setActiveId(part.id)}
            aria-pressed={activeId === part.id}
          >
            <small>ส่วนที่ {part.step}</small>
            <code>{part.token}</code>
          </button>
        ))}
      </div>

      <div className="fn-detail" aria-live="polite">
        <div className="fn-detail-head">
          <h3>{currentPart.label}: <code>{currentPart.token}</code></h3>
          <span>ส่วนประกอบที่ {currentPart.step} จาก 4</span>
        </div>
        <p className="concept-body" style={{ marginTop: 10 }}>{currentPart.role}</p>
        <div className="fn-meta-grid" style={{ marginTop: 14 }}>
          {currentPart.examples.map((ex, idx) => (
            <div key={idx}>
              <h4>ตัวอย่างที่ {idx + 1}</h4>
              <code style={{ display: 'block', marginBottom: 6, color: 'var(--accent)', fontWeight: 700 }}>{ex.code}</code>
              <p>{ex.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <h2 style={{ marginTop: 26, marginBottom: 10 }}>4 กฎเหล็กในการเรียกใช้ Function และ Parameter ไม่ให้เกิดบั๊ก</h2>
      <div className="choice-row">
        {SYNTAX_GOLDEN_RULES.map(r => (
          <button
            key={r.num}
            type="button"
            className={activeRule === r.num ? 'selected' : ''}
            onClick={() => setActiveRule(r.num)}
            aria-pressed={activeRule === r.num}
          >
            กฎข้อที่ {r.num}
          </button>
        ))}
      </div>

      <div className="fn-detail" aria-live="polite">
        <div className="fn-detail-head">
          <h3>{currentRule.title}</h3>
          <span>หลักการสำคัญข้อที่ {currentRule.num}/4</span>
        </div>
        <p style={{ margin: '10px 0 14px' }}>{currentRule.desc}</p>
        <div className="etl-impact-grid">
          <div>
            <span>ตัวอย่างที่มักเขียนผิด (ควรหลีกเลี่ยง)</span>
            <strong><code>{currentRule.wrong}</code></strong>
            <small>ทำให้เกิดข้อผิดพลาดหรือได้ผลลัพธ์ไม่ตรงตามต้องการ</small>
          </div>
          <div>
            <span>ตัวอย่างการเขียนที่ถูกต้อง (มาตรฐาน)</span>
            <strong><code>{currentRule.right}</code></strong>
            <small>ระบุวงเล็บ พารามิเตอร์ และตัวแปรรับค่าอย่างครบถ้วน</small>
          </div>
        </div>
      </div>
    </section>
  );
}

export function W4FunctionLabDemo() {
  const [cat, setCat] = useState('all');
  const [selectedId, setSelectedId] = useState('read_csv');
  const [simIdx, setSimIdx] = useState(0);

  const visibleFns = cat === 'all' ? PANDAS_FN_CATALOG : PANDAS_FN_CATALOG.filter(f => f.category === cat);
  const activeFn = visibleFns.find(f => f.id === selectedId) ?? visibleFns[0];
  const activeSim = activeFn.simulators[simIdx] ?? activeFn.simulators[0];

  function handleSelectCategory(newCat) {
    setCat(newCat);
    const list = newCat === 'all' ? PANDAS_FN_CATALOG : PANDAS_FN_CATALOG.filter(f => f.category === newCat);
    if (list[0]) {
      setSelectedId(list[0].id);
      setSimIdx(0);
    }
  }

  function handleSelectFn(fnId) {
    setSelectedId(fnId);
    setSimIdx(0);
  }

  return (
    <section className="demo fn-explorer">
      <p className="demo-caption">
        คลังรวม 16 ฟังก์ชันหลักของไลบรารี <code>pandas</code> แยกตามหมวดหมู่ · คลิกเลือกฟังก์ชันเพื่อดูหน้าที่ รายละเอียดของแต่ละ <strong>Parameter</strong> และกดปุ่ม <strong>ทดลองสลับ Parameter</strong> เพื่อเปรียบเทียบตารางผลลัพธ์
      </p>

      <div className="choice-row" role="tablist" aria-label="หมวดหมู่ฟังก์ชัน Pandas">
        {PANDAS_FN_CATEGORIES.map(c => (
          <button
            key={c.id}
            type="button"
            className={cat === c.id ? 'selected' : ''}
            onClick={() => handleSelectCategory(c.id)}
            aria-pressed={cat === c.id}
          >
            <Layers size={15} /> {c.label}
          </button>
        ))}
      </div>

      <div className="fn-grid" role="list">
        {visibleFns.map(item => (
          <button
            key={item.id}
            type="button"
            className={activeFn.id === item.id ? 'selected' : ''}
            onClick={() => handleSelectFn(item.id)}
            aria-pressed={activeFn.id === item.id}
          >
            <span>ฟังก์ชันที่ {item.num}/16</span>
            <code>{item.token}</code>
          </button>
        ))}
      </div>

      <div className="fn-detail" aria-live="polite">
        <div className="fn-detail-head">
          <h3>ฟังก์ชันที่ {activeFn.num}: <code>{activeFn.token}</code></h3>
          <span>{activeFn.categoryLabel}</span>
        </div>

        <div className="checked-command-bar" style={{ marginTop: 12, marginBottom: 14 }}>
          <span>รูปแบบไวยากรณ์ (Syntax):</span>
          <code>{activeFn.signature}</code>
        </div>

        <div className="fn-meta-grid">
          <div>
            <h4>หน้าที่หลักของฟังก์ชัน</h4>
            <p>{activeFn.purpose}</p>
          </div>
          <div>
            <h4>เลือกใช้เมื่อใด</h4>
            <p>{activeFn.whenToUse}</p>
          </div>
          <div className="fn-caution">
            <h4>ข้อควรระวังในการกำหนด Parameter</h4>
            <p>{activeFn.caution}</p>
          </div>
        </div>

        <h4 style={{ margin: '18px 0 8px', color: 'var(--ink)' }}>
          ตารางเจาะลึก Parameter ที่สำคัญของ <code>{activeFn.token}</code>
        </h4>
        <div className="table-scroll">
          <table style={{ margin: 0 }}>
            <thead>
              <tr>
                <th style={{ width: '24%' }}>ชื่อ Parameter</th>
                <th style={{ width: '22%' }}>ค่าเริ่มต้น (Default)</th>
                <th>หน้าที่และผลกระทบต่อข้อมูล</th>
              </tr>
            </thead>
            <tbody>
              {activeFn.params.map(p => (
                <tr key={p.name}>
                  <td><code style={{ color: 'var(--accent)', fontWeight: 700 }}>{p.name}</code></td>
                  <td><code>{p.defaultVal}</code></td>
                  <td>{p.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w4-simulator-box">
          <div className="w4-simulator-head">
            <strong><Sliders size={17} /> ห้องทดลองสลับค่า Parameter (คลิกเพื่อดูความเปลี่ยนแปลงของผลลัพธ์)</strong>
            <span>มี {activeFn.simulators.length} รูปแบบให้เปรียบเทียบ</span>
          </div>

          <div className="choice-row" style={{ margin: '10px 0 14px' }}>
            {activeFn.simulators.map((sim, idx) => (
              <button
                key={sim.label}
                type="button"
                className={simIdx === idx ? 'selected' : ''}
                onClick={() => setSimIdx(idx)}
                aria-pressed={simIdx === idx}
              >
                {sim.label}
              </button>
            ))}
          </div>

          <CodePanel code={activeSim.code} label={`คำสั่งเมื่อเลือก: ${activeSim.label}`} />

          <div className="table-scroll">
            <table style={{ margin: '10px 0' }}>
              <thead>
                <tr>
                  {activeSim.cols.map((col, i) => (
                    <th key={i}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeSim.rows.map((row, rIdx) => (
                  <tr key={rIdx} className={activeSim.highlightProblem ? 'problem-row' : ''}>
                    {row.map((val, cIdx) => (
                      <td key={cIdx}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="demo-result" style={{ marginTop: 10, fontSize: '1rem' }}>
            คำอธิบายผลลัพธ์: {activeSim.note}
          </p>
        </div>
      </div>
    </section>
  );
}

export function W4PandasGameDemo() {
  const [stageId, setStageId] = useState('hunter');
  const [qId, setQId] = useState(1);
  const [answers, setAnswers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dva_w4_pandas_game') || '{}');
    } catch {
      return {};
    }
  });
  const [showHint, setShowHint] = useState(false);

  const stageQuestions = PANDAS_GAME_QUESTIONS.filter(q => q.stage === stageId);
  const currentQ = PANDAS_GAME_QUESTIONS.find(q => q.id === qId) ?? stageQuestions[0];
  const selectedOpt = answers[currentQ.id];
  const isAnswered = selectedOpt !== undefined;
  const isCorrect = selectedOpt === currentQ.correctIndex;

  // Compute live game stats
  let totalXp = 0;
  let correctCount = 0;
  let currentStreak = 0;
  let maxStreak = 0;
  PANDAS_GAME_QUESTIONS.forEach(q => {
    if (answers[q.id] !== undefined) {
      if (answers[q.id] === q.correctIndex) {
        totalXp += q.xp;
        correctCount += 1;
        currentStreak += 1;
        if (currentStreak > maxStreak) maxStreak = currentStreak;
      } else {
        currentStreak = 0;
      }
    }
  });

  const rankTitle =
    correctCount >= 13
      ? 'ระดับยศ: Pandas Grandmaster (ปรมาจารย์ข้อมูล)'
      : correctCount >= 9
      ? 'ระดับยศ: Parameter Specialist (มือปราบพารามิเตอร์)'
      : correctCount >= 5
      ? 'ระดับยศ: Data Explorer (นักสำรวจตาราง)'
      : 'ระดับยศ: Junior Analyst (นักวิเคราะห์ฝึกหัด)';

  function handleSelectStage(newStageId) {
    setStageId(newStageId);
    const firstQ = PANDAS_GAME_QUESTIONS.find(q => q.stage === newStageId);
    if (firstQ) setQId(firstQ.id);
    setShowHint(false);
  }

  function handleChooseOption(optIdx) {
    const next = { ...answers, [currentQ.id]: optIdx };
    setAnswers(next);
    try {
      localStorage.setItem('dva_w4_pandas_game', JSON.stringify(next));
    } catch {}
  }

  function handleResetGame() {
    setAnswers({});
    setShowHint(false);
    setStageId('hunter');
    setQId(1);
    try {
      localStorage.removeItem('dva_w4_pandas_game');
    } catch {}
  }

  function goQuestion(delta) {
    const idx = PANDAS_GAME_QUESTIONS.findIndex(q => q.id === currentQ.id);
    const target = PANDAS_GAME_QUESTIONS[idx + delta];
    if (target) {
      setStageId(target.stage);
      setQId(target.id);
      setShowHint(false);
    }
  }

  return (
    <section className="demo fn-explorer">
      <div className="w4-game-scoreboard" role="region" aria-label="กระดานคะแนนเกม Pandas Master Arena">
        <div className="w4-score-item">
          <Trophy size={20} />
          <div>
            <small>คะแนนสะสม (XP)</small>
            <strong>{totalXp} / 2,250 XP</strong>
          </div>
        </div>
        <div className="w4-score-item">
          <Target size={20} />
          <div>
            <small>ภารกิจที่ตอบถูก</small>
            <strong>{correctCount} / {PANDAS_GAME_QUESTIONS.length} ข้อ</strong>
          </div>
        </div>
        <div className="w4-score-item">
          <Flame size={20} />
          <div>
            <small>คอมโบสูงสุด</small>
            <strong>{maxStreak} ข้อรวด</strong>
          </div>
        </div>
        <div className="w4-score-rank">
          <span>{rankTitle}</span>
          <button type="button" onClick={handleResetGame} title="เริ่มเล่นใหม่ทั้งหมด">
            <RotateCcw size={15} /> เริ่มเกมใหม่
          </button>
        </div>
      </div>

      <div className="choice-row" role="tablist" aria-label="เลือกด่านของเกม">
        {PANDAS_GAME_STAGES.map(st => {
          const stQs = PANDAS_GAME_QUESTIONS.filter(q => q.stage === st.id);
          const stDone = stQs.filter(q => answers[q.id] === q.correctIndex).length;
          return (
            <button
              key={st.id}
              type="button"
              className={stageId === st.id ? 'selected' : ''}
              onClick={() => handleSelectStage(st.id)}
              aria-pressed={stageId === st.id}
            >
              {st.title} ({stDone}/{stQs.length})
            </button>
          );
        })}
      </div>

      <div className="interactive-question-cards five-cols">
        {stageQuestions.map(q => {
          const ans = answers[q.id];
          const answered = ans !== undefined;
          const right = ans === q.correctIndex;
          return (
            <button
              key={q.id}
              type="button"
              className={`q-card ${currentQ.id === q.id ? 'selected' : ''} ${answered && right ? 'is-done' : ''}`}
              onClick={() => {
                setQId(q.id);
                setShowHint(false);
              }}
              aria-pressed={currentQ.id === q.id}
            >
              <div className="q-card-top">
                <span className="q-badge">ภารกิจที่ {q.id} (+{q.xp} XP)</span>
                {answered ? (
                  right ? (
                    <CheckCircle2 size={18} className="done-icon" />
                  ) : (
                    <AlertTriangle size={18} style={{ color: '#b45309' }} />
                  )
                ) : (
                  <Circle size={18} className="todo-icon" />
                )}
              </div>
              <strong>{q.missionTitle.replace(/^ภารกิจที่ \d+: /, '')}</strong>
            </button>
          );
        })}
      </div>

      <div className="fn-detail" aria-live="polite">
        <div className="fn-detail-head">
          <h3>{currentQ.missionTitle}</h3>
          <div className="fn-detail-actions">
            <span>ค่าประสบการณ์ +{currentQ.xp} XP</span>
            <button
              type="button"
              className="check-done-btn"
              onClick={() => setShowHint(h => !h)}
              aria-expanded={showHint}
            >
              <HelpCircle size={15} /> {showHint ? 'ซ่อนคำใบ้' : 'ดูคำใบ้ (Hint)'}
            </button>
          </div>
        </div>

        <p className="concept-body" style={{ marginTop: 10 }}>{currentQ.scenario}</p>

        {currentQ.sampleTable && (
          <div className="table-scroll">
            <table style={{ margin: '10px 0' }}>
              <caption>{currentQ.sampleTable.caption}</caption>
              <thead>
                <tr>
                  {currentQ.sampleTable.cols.map((c, i) => (
                    <th key={i}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentQ.sampleTable.rows.map((r, rIdx) => (
                  <tr key={rIdx}>
                    {r.map((v, cIdx) => (
                      <td key={cIdx}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <CodePanel code={currentQ.codeContext} label="โจทย์คำสั่งภาษา Python ที่ต้องวิเคราะห์" />

        {showHint && (
          <aside className="decision-rule" style={{ marginTop: 12 }}>
            <strong>คำใบ้สำหรับภารกิจนี้ (Hint):</strong>
            <p>{currentQ.hint}</p>
          </aside>
        )}

        <h4 style={{ margin: '16px 0 10px', color: 'var(--ink)' }}>
          คลิกเลือกคำตอบที่ถูกต้องที่สุด (สามารถเปลี่ยนคำตอบเพื่อเรียนรู้ได้):
        </h4>
        <div className="w4-game-options">
          {currentQ.options.map((opt, idx) => {
            const isThisSelected = selectedOpt === idx;
            const isThisCorrect = idx === currentQ.correctIndex;
            let statusClass = '';
            if (isAnswered) {
              if (isThisCorrect) statusClass = 'is-correct';
              else if (isThisSelected) statusClass = 'is-wrong';
            }
            return (
              <button
                key={idx}
                type="button"
                className={`w4-game-option-btn ${isThisSelected ? 'selected' : ''} ${statusClass}`}
                onClick={() => handleChooseOption(idx)}
                aria-pressed={isThisSelected}
              >
                <span className="w4-opt-letter">{['A', 'B', 'C', 'D'][idx]}</span>
                <code>{opt}</code>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className={`w4-game-feedback ${isCorrect ? 'correct' : 'wrong'}`} role="status">
            <strong>
              {isCorrect
                ? `ภารกิจสำเร็จ! (+${currentQ.xp} XP)`
                : 'ยังไม่ตรงตามกลไกของพารามิเตอร์ ลองดูคำอธิบายด้านล่างแล้วเลือกใหม่อีกครั้ง:'}
            </strong>
            <p>{currentQ.explanation}</p>
          </div>
        )}

        <div className="w4-game-nav">
          <button
            type="button"
            onClick={() => goQuestion(-1)}
            disabled={currentQ.id === 1}
          >
            <ChevronLeft size={16} /> ภารกิจก่อนหน้า
          </button>
          <span>ภารกิจที่ {currentQ.id} จาก {PANDAS_GAME_QUESTIONS.length}</span>
          <button
            type="button"
            className="jump-step-btn"
            onClick={() => goQuestion(1)}
            disabled={currentQ.id === PANDAS_GAME_QUESTIONS.length}
          >
            ภารกิจถัดไป <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

export function W4ThursdayAssignmentDemo({ doneMap, onToggleDone }) {
  const [activeId, setActiveId] = useState(1);
  const currentQ = W4_THU_ASSIGNMENT_ITEMS.find(x => x.id === activeId) ?? W4_THU_ASSIGNMENT_ITEMS[0];
  const doneKey = `w4thu-hw-${currentQ.id}`;
  const isDone = Boolean(doneMap?.[doneKey]);
  const completedCount = W4_THU_ASSIGNMENT_ITEMS.filter(x => doneMap?.[`w4thu-hw-${x.id}`]).length;

  return (
    <section className="demo fn-explorer">
      <div className="exercise-header-bar">
        <p className="demo-caption">
          ใบงานภารกิจประจำสัปดาห์ที่ 4 วันพฤหัสบดี · คะแนนเต็ม 10 คะแนน (10 ข้อ ข้อละ 1 คะแนน) · <strong>กำหนดส่งภายในสัปดาห์ถัดไป</strong>
        </p>
        <span className="progress-pill">ความคืบหน้า: {completedCount}/10 ข้อ</span>
      </div>

      <div className="google-docs-callout" style={{ marginTop: 8, marginBottom: 18 }}>
        <div className="google-docs-callout-info">
          <FileText size={28} />
          <div>
            <strong>ดาวน์โหลดเอกสารใบงานภารกิจ: ฟังก์ชันและพารามิเตอร์ของ Pandas (ส่งสัปดาห์ถัดไป · 10 คะแนน)</strong>
            <p>
              ผู้เรียนสามารถเปิดไฟล์ <code>.docx</code> ด้วย Google Docs หรือ Microsoft Word แล้วพิมพ์คำสั่งและคำอธิบายหน้าที่ของ Parameter ส่งใน Google Classroom ภายในสัปดาห์หน้า
            </p>
          </div>
        </div>
        <div className="google-docs-callout-actions">
          <a
            className="google-docs-callout-btn"
            href="ชุดเรียน/เรียนย้อนหลัง_สัปดาห์04/ใบงานภารกิจ_ฟังก์ชันและพารามิเตอร์_Pandas_สัปดาห์04.docx"
            download
          >
            <Download size={16} /> ดาวน์โหลดใบงานภารกิจ 10 ข้อ (.docx)
          </a>
        </div>
      </div>

      <div className="interactive-question-cards five-cols">
        {W4_THU_ASSIGNMENT_ITEMS.map(item => {
          const k = `w4thu-hw-${item.id}`;
          const checked = Boolean(doneMap?.[k]);
          return (
            <button
              key={item.id}
              type="button"
              className={`q-card ${activeId === item.id ? 'selected' : ''} ${checked ? 'is-done' : ''}`}
              onClick={() => setActiveId(item.id)}
              aria-pressed={activeId === item.id}
            >
              <div className="q-card-top">
                <span className="q-badge">ข้อที่ {item.id} ({item.score})</span>
                {checked ? (
                  <CheckCircle2 size={18} className="done-icon" />
                ) : (
                  <Circle size={18} className="todo-icon" />
                )}
              </div>
              <strong>{item.title.replace(/^ข้อที่ \d+: /, '')}</strong>
            </button>
          );
        })}
      </div>

      <div className="fn-detail" aria-live="polite">
        <div className="fn-detail-head">
          <h3>{currentQ.title}</h3>
          <div className="fn-detail-actions">
            <span>{currentQ.part}</span>
            {onToggleDone && (
              <button
                type="button"
                className={'check-done-btn ' + (isDone ? 'is-done' : '')}
                onClick={() => onToggleDone(doneKey)}
              >
                {isDone ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                {isDone ? 'สถานะ: บันทึกคำตอบแล้ว' : 'ทำเครื่องหมายว่าทำข้อนี้แล้ว'}
              </button>
            )}
          </div>
        </div>

        <p className="concept-body" style={{ marginTop: 12 }}>{currentQ.task}</p>

        <div className="fn-meta-grid" style={{ marginTop: 14 }}>
          <div>
            <h4>คำใบ้แนวทางการเลือกใช้ Function & Parameter</h4>
            <code>{currentQ.hint}</code>
          </div>
          <div>
            <h4>สิ่งที่ต้องระบุในใบงาน (.docx)</h4>
            <p>1) คำสั่งภาษา Python ที่ระบุชื่อฟังก์ชันและพารามิเตอร์ครบถ้วน  2) คำอธิบายเหตุผลที่เลือกใช้พารามิเตอร์ดังกล่าว</p>
          </div>
          <div className="fn-caution">
            <h4>กำหนดการส่งงาน</h4>
            <p>ส่งไฟล์เอกสารใบงาน (.docx หรือ PDF) ใน Google Classroom ก่อนเริ่มคาบเรียนสัปดาห์ที่ 5</p>
          </div>
        </div>
      </div>
    </section>
  );
}
