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

// ฟังก์ชันการแจกแจงปกติมาตรฐาน: Φ(z) และฟังก์ชันผกผัน (Wichura AS241)
function erfc(x) {
  const z = Math.abs(x), t = 1 / (1 + 0.5 * z);
  const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
  return x >= 0 ? r : 2 - r;
}
export const normCdf = z => 0.5 * erfc(-z / Math.SQRT2);
export function normInv(p) {
  const q = p - 0.5;
  if (Math.abs(q) <= 0.425) {
    const r = 0.180625 - q * q;
    return q * (((((((2509.0809287301226727 * r + 33430.575583588128105) * r + 67265.770927008700853) * r + 45921.953931549871457) * r + 13731.693765509461125) * r + 1971.5909503065514427) * r + 133.14166789178437745) * r + 3.387132872796366608)
      / (((((((5226.495278852545925 * r + 28729.085735721942674) * r + 39307.89580009271061) * r + 21213.794301586595867) * r + 5394.1960214247511077) * r + 687.1870074920579083) * r + 42.313330701600911252) * r + 1);
  }
  let r = q < 0 ? p : 1 - p;
  r = Math.sqrt(-Math.log(r));
  let v;
  if (r <= 5) {
    r -= 1.6;
    v = (((((((7.7454501427834140764e-4 * r + 0.0227238449892691845833) * r + 0.24178072517745061177) * r + 1.27045825245236838258) * r + 3.64784832476320460504) * r + 5.7694972214606914055) * r + 4.6303378461565452959) * r + 1.42343711074968357734)
      / (((((((1.05075007164441684324e-9 * r + 5.475938084995344946e-4) * r + 0.0151986665636164571966) * r + 0.14810397642748007459) * r + 0.68976733498510000455) * r + 1.6763848301838038494) * r + 2.05319162663775882187) * r + 1);
  } else {
    r -= 5;
    v = (((((((2.01033439929228813265e-7 * r + 2.71155556874348757815e-5) * r + 0.0012426609473880784386) * r + 0.026532189526576123093) * r + 0.29656057182850489123) * r + 1.7848265399172913358) * r + 5.4637849111641143699) * r + 6.6579046435011037772)
      / (((((((2.04426310338993978564e-15 * r + 1.4215117583164458887e-7) * r + 1.8463183175100546818e-5) * r + 7.868691311456132591e-4) * r + 0.0148753612908506148525) * r + 0.13692988092273580531) * r + 0.59983220655588793769) * r + 1);
  }
  return q < 0 ? -v : v;
}

// การทดสอบการแจกแจงปกติแบบ Shapiro–Wilk (Royston 1995, AS R94) ใช้ได้เมื่อ 3 ≤ n ≤ 5000
export function shapiroWilk(values) {
  const x = [...values].filter(Number.isFinite).sort((a, b) => a - b);
  const n = x.length;
  if (n < 3 || x[n - 1] - x[0] < 1e-19) return null;
  const poly = (c, v) => c.reduce((s, ci, i) => s + ci * v ** i, 0);
  const nn2 = Math.floor(n / 2);
  const a = new Array(nn2 + 1).fill(0); // a[1..nn2]
  if (n === 3) a[1] = Math.SQRT1_2;
  else {
    const m = [0];
    let summ2 = 0;
    for (let i = 1; i <= nn2; i++) { m[i] = normInv((i - 0.375) / (n + 0.25)); summ2 += m[i] ** 2; }
    summ2 *= 2;
    const ssumm2 = Math.sqrt(summ2), rsn = 1 / Math.sqrt(n);
    const a1 = poly([0, 0.221157, -0.147981, -2.07119, 4.434685, -2.706056], rsn) - m[1] / ssumm2;
    let i1, fac;
    if (n > 5) {
      i1 = 3;
      const a2 = -m[2] / ssumm2 + poly([0, 0.042981, -0.293762, -1.752461, 5.682633, -3.582633], rsn);
      fac = Math.sqrt((summ2 - 2 * m[1] ** 2 - 2 * m[2] ** 2) / (1 - 2 * a1 ** 2 - 2 * a2 ** 2));
      a[2] = a2;
    } else {
      i1 = 2;
      fac = Math.sqrt((summ2 - 2 * m[1] ** 2) / (1 - 2 * a1 ** 2));
    }
    a[1] = a1;
    for (let i = i1; i <= nn2; i++) a[i] = -m[i] / fac;
  }
  const xm = mean(x);
  const ssq = sum(x.map(v => (v - xm) ** 2));
  let b = 0;
  for (let i = 1; i <= nn2; i++) b += a[i] * (x[n - i] - x[i - 1]);
  const w = Math.min(1, (b * b) / ssq);
  let p;
  if (n === 3) {
    p = Math.max(0, (6 / Math.PI) * (Math.asin(Math.sqrt(w)) - Math.PI / 3));
  } else {
    let y = Math.log(1 - w), mu, s;
    if (n <= 11) {
      const gamma = -2.273 + 0.459 * n;
      if (y >= gamma) return { n, w, p: 1e-99 };
      y = -Math.log(gamma - y);
      mu = poly([0.544, -0.39978, 0.025054, -6.714e-4], n);
      s = Math.exp(poly([1.3822, -0.77857, 0.062767, -0.0020322], n));
    } else {
      const ln = Math.log(n);
      mu = poly([-1.5861, -0.31082, -0.083751, 0.0038915], ln);
      s = Math.exp(poly([-0.4803, -0.082676, 0.0030302], ln));
    }
    p = 1 - normCdf((y - mu) / s);
  }
  return { n, w, p };
}

// Wilcoxon Signed-Rank Test สมมติฐานทางเดียว H1: หลังเรียน > ก่อนเรียน
// ตัดคู่ที่ผลต่างเป็นศูนย์ ใช้อันดับเฉลี่ยเมื่อมีค่าซ้ำ
// p แบบประมาณค่า: Z ปรับค่าซ้ำ ไม่ปรับความต่อเนื่อง (ตรงกับ SPSS) · p แบบแม่นตรง: นับการจัดเครื่องหมายทุกแบบ
export function wilcoxonSignedRank(pre, post) {
  const d = post.map((v, i) => v - pre[i]).filter(v => v !== 0);
  const n = d.length;
  if (n < 1) return null;
  const order = d.map((v, i) => ({ a: Math.abs(v), i })).sort((p, q) => p.a - q.a);
  const rank = new Array(n);
  let tie = 0;
  for (let i = 0; i < n;) {
    let j = i;
    while (j + 1 < n && order[j + 1].a === order[i].a) j++;
    const r = (i + j + 2) / 2, t = j - i + 1;
    for (let k = i; k <= j; k++) rank[order[k].i] = r;
    tie += t ** 3 - t;
    i = j + 1;
  }
  const wPlus = sum(d.map((v, i) => (v > 0 ? rank[i] : 0)));
  const wMinus = n * (n + 1) / 2 - wPlus;
  const mu = n * (n + 1) / 4;
  const sigma = Math.sqrt(n * (n + 1) * (2 * n + 1) / 24 - tie / 48);
  const z = sigma ? (wPlus - mu) / sigma : NaN;
  const pApprox = Number.isFinite(z) ? 1 - normCdf(z) : NaN;
  // การแจกแจงแม่นตรงแบบมีเงื่อนไข: ใช้อันดับคูณ 2 ให้เป็นจำนวนเต็ม แล้วนับผลรวมทุกแบบ
  let pExact = NaN;
  if (n <= 60) {
    const r2 = rank.map(r => Math.round(r * 2));
    const total = sum(r2);
    let dist = new Float64Array(total + 1); dist[0] = 1;
    for (const r of r2) { const next = new Float64Array(total + 1); for (let s = 0; s <= total; s++) if (dist[s]) { next[s] += dist[s] / 2; next[s + r] += dist[s] / 2; } dist = next; }
    const obs = Math.round(wPlus * 2);
    pExact = 0; for (let s = obs; s <= total; s++) pExact += dist[s];
    pExact = Math.min(1, pExact);
  }
  return { n, nPos: d.filter(v => v > 0).length, nNeg: d.filter(v => v < 0).length, nZero: post.length - n, wPlus, wMinus, z, pApprox, pExact, r: Number.isFinite(z) ? z / Math.sqrt(n) : NaN };
}
