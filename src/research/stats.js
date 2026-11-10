// สถิติสำหรับงานวิจัยในชั้นเรียน: ค่าเฉลี่ย ส่วนเบี่ยงเบนมาตรฐาน t-test แบบ Dependent E1/E2 ดัชนีประสิทธิผล และการวิเคราะห์ข้อสอบ

export const sum = a => a.reduce((s, x) => s + x, 0);
export const mean = a => (a.length ? sum(a) / a.length : NaN);
export function sd(a) {
  if (a.length < 2) return NaN;
  const m = mean(a);
  return Math.sqrt(sum(a.map(x => (x - m) ** 2)) / (a.length - 1));
}

// ฟังก์ชันบีตาไม่บริบูรณ์แบบปรับมาตรฐาน (Numerical Recipes)
function logGamma(x) {
  const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let y = x, tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015;
  for (const v of c) ser += v / ++y;
  return -tmp + Math.log((2.5066282746310005 * ser) / x);
}
function betacf(a, b, x) {
  const MAXIT = 200, EPS = 3e-14, FPMIN = 1e-300;
  let qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - (qab * x) / qap;
  if (Math.abs(d) < FPMIN) d = FPMIN;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= MAXIT; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d; h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < EPS) break;
  }
  return h;
}
export function betainc(x, a, b) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1) / (a + b + 2) ? (bt * betacf(a, b, x)) / a : 1 - (bt * betacf(b, a, 1 - x)) / b;
}
// ความน่าจะเป็นทางเดียว P(T > t) ของการแจกแจง t ที่ df องศาอิสระ
export function tUpperTail(t, df) {
  const p = 0.5 * betainc(df / (df + t * t), df / 2, 0.5);
  return t >= 0 ? p : 1 - p;
}

// t-test แบบ Dependent Samples สมมติฐานทางเดียว H1: หลังเรียน > ก่อนเรียน
export function pairedT(pre, post) {
  const n = pre.length;
  const d = post.map((v, i) => v - pre[i]);
  const md = mean(d), sdd = sd(d);
  const t = sdd === 0 ? (md > 0 ? Infinity : 0) : md / (sdd / Math.sqrt(n));
  const df = n - 1;
  const p = Number.isFinite(t) ? tUpperTail(t, df) : 0;
  return { n, df, meanDiff: md, sdDiff: sdd, sumD: sum(d), sumD2: sum(d.map(x => x * x)), t, p, dz: sdd ? md / sdd : NaN };
}

// ดัชนีประสิทธิผล (E.I.) = (ผลรวมคะแนนหลังเรียน − ผลรวมคะแนนก่อนเรียน) / (จำนวนผู้เรียน × คะแนนเต็ม − ผลรวมคะแนนก่อนเรียน)
export function effectivenessIndex(pre, post, full) {
  const sp = sum(pre), sq = sum(post), denom = pre.length * full - sp;
  return denom ? (sq - sp) / denom : NaN;
}

// การวิเคราะห์ข้อสอบรายข้อ: ค่าความยากง่าย (p) อำนาจจำแนก (r) แบบกลุ่มสูง–กลุ่มต่ำ 27% และ KR-20
export function itemAnalysis(rows, items) {
  // rows: [{ total, correct: { [itemId]: 0|1 } }]
  const n = rows.length;
  const k = items.length;
  if (n < 2) return null;
  const sorted = [...rows].sort((a, b) => b.total - a.total);
  const g = Math.max(1, Math.round(n * 0.27));
  const upper = sorted.slice(0, g), lower = sorted.slice(-g);
  const perItem = items.map(it => {
    const p = mean(rows.map(r => r.correct[it.id] || 0));
    const ru = sum(upper.map(r => r.correct[it.id] || 0));
    const rl = sum(lower.map(r => r.correct[it.id] || 0));
    const r = (ru - rl) / g;
    return { id: it.id, p, r, q: 1 - p };
  });
  const totals = rows.map(r => r.total);
  const variance = sd(totals) ** 2;
  const pq = sum(perItem.map(x => x.p * x.q));
  const kr20 = variance ? (k / (k - 1)) * (1 - pq / variance) : NaN;
  return { n, groupSize: g, perItem, kr20 };
}

export function interpretLikert(m) {
  if (!Number.isFinite(m)) return '–';
  if (m >= 4.51) return 'มากที่สุด';
  if (m >= 3.51) return 'มาก';
  if (m >= 2.51) return 'ปานกลาง';
  if (m >= 1.51) return 'น้อย';
  return 'น้อยที่สุด';
}

export const fmt = (x, d = 2) => (Number.isFinite(x) ? x.toFixed(d) : '–');
export function fmtP(p) {
  if (!Number.isFinite(p)) return '–';
  return p < 0.001 ? '< .001' : p.toFixed(3).replace(/^0/, '');
}
