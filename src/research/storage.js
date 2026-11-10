// การบันทึกข้อมูลวิจัย: เก็บสำเนาในเครื่องเสมอ และส่งไปยัง Google Apps Script เมื่อกำหนดที่อยู่ระบบแล้ว

const KEY_PROFILE = 'dva_research_profile';
const KEY_RECORDS = 'dva_research_records';
const KEY_PENDING = 'dva_research_pending';
const KEY_API = 'dva_research_api';

function read(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* โหมดส่วนตัวของเบราว์เซอร์ */ }
}

// ที่อยู่ระบบรับข้อมูล: อ่านจากพารามิเตอร์ ?api= ในลิงก์ที่ผู้สอนแจก แล้วจำไว้ในเครื่อง
export function getApiUrl() {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('api');
    if (fromUrl && /^https:\/\/script\.google(usercontent)?\.com\//.test(fromUrl)) {
      write(KEY_API, fromUrl);
      return fromUrl;
    }
  } catch { /* ไม่มีพารามิเตอร์ */ }
  return read(KEY_API, '');
}
export function setApiUrl(url) { write(KEY_API, url || ''); }

export const getProfile = () => read(KEY_PROFILE, null);
export const setProfile = p => write(KEY_PROFILE, p);
export const clearProfile = () => { try { localStorage.removeItem(KEY_PROFILE); } catch { /* */ } };

export function localRecords(code) {
  const all = read(KEY_RECORDS, []);
  return code ? all.filter(r => r.code === code) : all;
}
export const pendingCount = () => read(KEY_PENDING, []).length;

function uid() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

async function post(api, record) {
  // ใช้ text/plain และ no-cors เพื่อหลีกเลี่ยงการตรวจสอบ CORS ของ Google Apps Script
  await fetch(api, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: 'submit', record }) });
}

export async function submitRecord(partial) {
  const record = { id: uid(), ts: new Date().toISOString(), ...partial };
  write(KEY_RECORDS, [...read(KEY_RECORDS, []), record]);
  // ส่งข้อมูลเฉพาะผู้เรียนที่ยินยอมเข้าร่วมการวิจัย
  if (record.consent !== true) return { record, sent: false, reason: 'no-consent' };
  const api = getApiUrl();
  if (!api) return { record, sent: false, reason: 'no-api' };
  try {
    await post(api, record);
    return { record, sent: true };
  } catch {
    write(KEY_PENDING, [...read(KEY_PENDING, []), record]);
    return { record, sent: false, reason: 'network' };
  }
}

export async function retryPending() {
  const api = getApiUrl();
  const pending = read(KEY_PENDING, []);
  if (!api || !pending.length) return pending.length;
  const left = [];
  for (const r of pending) {
    try { await post(api, r); } catch { left.push(r); }
  }
  write(KEY_PENDING, left);
  return left.length;
}

// สำหรับผู้สอน: ดึงข้อมูลทั้งหมดจาก Google Sheets ด้วยรหัสผู้สอน
export async function fetchAllRecords(api, teacherKey) {
  const res = await fetch(api, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: 'list', key: teacherKey }) });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error === 'unauthorized' ? 'รหัสผู้สอนไม่ถูกต้อง' : (data.error || 'ไม่สามารถดึงข้อมูลได้'));
  return data.records;
}
