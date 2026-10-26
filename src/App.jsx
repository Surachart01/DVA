import { useEffect, useMemo, useState } from 'react';
import { Menu, ChevronLeft, ChevronRight, Maximize, Minimize, Download, X, RotateCcw, BookOpen, FlaskConical, FileText, ArrowRight, Check, CheckCircle2, Circle, Layers, Code2, Eye, Sparkles, Compass } from 'lucide-react';
import { teachingDeck } from './teachingDeck';
import { labsData } from './labsData';
import { courseResources } from './courseResources';
import { sessionsFor } from './teachingSessions';

const unitNames={1:'พื้นฐานและการปฐมนิเทศรายวิชา',2:'การนำเข้าข้อมูลและการจัดเตรียมข้อมูล'};
const healthRows=[{id:'S01',age:20,gpa:3.2},{id:'S02',age:19,gpa:null},{id:'S03',age:150,gpa:4.75},{id:'S04',age:null,gpa:2.8},{id:'S05',age:21,gpa:3.5},{id:'S05',age:21,gpa:3.5}];
function QualityDemo(){
 const[check,setCheck]=useState('all');
 const duplicate=(r,i)=>healthRows.findIndex(x=>JSON.stringify(x)===JSON.stringify(r))!==i;
 const problem=(r,i)=>check==='missing'?(r.age===null||r.gpa===null):check==='duplicate'?duplicate(r,i):check==='range'?(r.age>60||r.gpa>4):false;
 const count=healthRows.filter((r,i)=>problem(r,i)).length;
 return <section className="demo"><p className="demo-caption">ข้อมูลสมมติ 6 แถว · เลือกมิติแล้วสังเกตแถวที่พบปัญหา</p><div className="choice-row">{[['all','ดูทั้งหมด'],['missing','ค่าว่าง'],['duplicate','แถวซ้ำ'],['range','ค่าผิดช่วง']].map(([id,label])=><button key={id} className={check===id?'selected':''} onClick={()=>setCheck(id)} aria-pressed={check===id}>{label}</button>)}</div><div className="table-scroll"><table><thead><tr><th>รหัส</th><th>อายุ</th><th>GPA</th><th>ผลตรวจ</th></tr></thead><tbody>{healthRows.map((r,i)=><tr key={i} className={problem(r,i)?'problem-row':''}><td>{r.id}</td><td>{r.age??'ว่าง'}</td><td>{r.gpa??'ว่าง'}</td><td>{problem(r,i)?'ต้องตรวจสอบ':'—'}</td></tr>)}</tbody></table></div><p className="demo-result">{check==='all'?'เริ่มจากกำหนดกฎการตรวจ แล้วคาดการณ์จำนวนปัญหา':`พบ ${count} แถวจาก 6 แถว (${(count/6*100).toFixed(1)}%)`}</p><p className="fine-print">ค่าที่ผิดช่วงต้องตรวจบริบทและแหล่งข้อมูล แถวหนึ่งอาจมีหลายปัญหา อย่าบวกร้อยละเป็นจำนวนคนทันที</p></section>;
}
function MergeDemo(){
 const[join,setJoin]=useState('left');const[ghost,setGhost]=useState(false);
 const products=[{id:'P01',name:'ชาไทย',price:30},{id:'P02',name:'กาแฟ',price:35}];
 const sales=[{id:'O01',product:'P01',qty:2},{id:'O02',product:'P02',qty:1},...(ghost?[{id:'O03',product:'P99',qty:3}]:[])];
 const result=sales.map(s=>({...s,p:products.find(p=>p.id===s.product)})).filter(s=>join==='left'||s.p);
 return <section className="demo"><p className="demo-caption">ข้อมูลสมมติ · ยอดขายอยู่ซ้าย สินค้าอยู่ขวา · เชื่อมด้วยรหัสสินค้า</p><div className="choice-row"><button className={join==='left'?'selected':''} onClick={()=>setJoin('left')} aria-pressed={join==='left'}>Left Join</button><button className={join==='inner'?'selected':''} onClick={()=>setJoin('inner')} aria-pressed={join==='inner'}>Inner Join</button><button onClick={()=>setGhost(!ghost)} aria-pressed={ghost}>{ghost?'เอารหัส P99 ออก':'เพิ่มรหัส P99 ที่ไม่มีคู่'}</button></div><div className="merge-source"><div><h3>ยอดขาย</h3>{sales.map(s=><p key={s.id}>{s.id} · {s.product} · {s.qty} หน่วย</p>)}</div><ArrowRight aria-hidden="true"/><div><h3>สินค้า</h3>{products.map(p=><p key={p.id}>{p.id} · {p.name} · {p.price} บาท/หน่วย</p>)}</div></div><div className="table-scroll"><table><thead><tr><th>รายการ</th><th>สินค้า</th><th>จำนวน</th><th>ราคา/หน่วย</th><th>ยอดเงิน</th></tr></thead><tbody>{result.map(s=><tr key={s.id} className={!s.p?'problem-row':''}><td>{s.id}</td><td>{s.p?.name??'ไม่พบคู่'}</td><td>{s.qty}</td><td>{s.p?.price??'NaN'}</td><td>{s.p?s.qty*s.p.price:'ยังคำนวณไม่ได้'}</td></tr>)}</tbody></table></div><p className="demo-result">ก่อนเชื่อม {sales.length} แถว → หลัง {join==='left'?'Left':'Inner'} Join {result.length} แถว</p><p className="fine-print">ข้อมูลที่ยังไม่ทราบราคาไม่ใช่ยอดขายศูนย์ ต้องตรวจต้นทางก่อนรวมเป็นรายงาน</p></section>;
}
function ForecastDemo(){
 const[window,setWindow]=useState(3);const values=[120,190,140,250,175,310,260,330,240,360];const avg=values.map((_,i)=>i<window-1?null:values.slice(i-window+1,i+1).reduce((a,b)=>a+b,0)/window);
 const point=(v,i)=>`${30+i*60},${260-v*.55}`;const path=values.map(point).join(' ');const trend=avg.map((v,i)=>v===null?null:point(v,i)).filter(Boolean).join(' ');
 return <section className="demo"><p className="demo-caption">ยอดขายสมมติ 10 วันที่มีข้อมูล · หน้าต่าง {window} รายการ</p><div className="choice-row">{[3,5].map(n=><button key={n} className={window===n?'selected':''} onClick={()=>setWindow(n)} aria-pressed={window===n}>{n} รายการล่าสุด</button>)}</div><svg className="trend-chart" viewBox="0 0 610 290" role="img" aria-label={`กราฟยอดขายและค่าเฉลี่ยเคลื่อนที่ ${window} รายการ`}><line x1="30" y1="265" x2="590" y2="265" stroke="#cbd5e1"/><polyline points={path} fill="none" stroke="#8c9bac" strokeWidth="2"/><polyline points={trend} fill="none" stroke="#0284a8" strokeWidth="4"/>{values.map((v,i)=><g key={i}><circle cx={30+i*60} cy={260-v*.55} r="4" fill="#8c9bac"/><text x={30+i*60} y="285" textAnchor="middle" fontSize="11" fill="#536375">{i+1}</text></g>)}</svg><p className="chart-legend">เส้นเทา = ยอดจริงในตัวอย่าง · เส้นฟ้า = ค่าเฉลี่ยเคลื่อนที่</p><p className="demo-result">ค่าฐานสำหรับรายการถัดไป: {avg.at(-1).toFixed(1)} บาท</p><p className="fine-print">ค่าเฉลี่ยนี้ช่วยดูแนวโน้มและเป็น baseline ต้องตรวจวันขาดและทดสอบกับข้อมูลย้อนหลัง ไม่ใช่คำรับรองอนาคต</p></section>;
}
function ChartDemo(){const[question,setQuestion]=useState('compare');const m={compare:['เปรียบเทียบยอดจำหน่ายแต่ละรายการ','กราฟแท่ง','ความยาวของแท่งกราฟช่วยเปรียบเทียบปริมาณได้อย่างชัดเจน'],trend:['วิเคราะห์แนวโน้มยอดจำหน่ายตามลำดับเวลา','กราฟเส้น','แสดงลำดับเวลาและทิศทางการเปลี่ยนแปลงของข้อมูลได้อย่างต่อเนื่อง'],relation:['วิเคราะห์ความสัมพันธ์ระหว่างราคาและจำนวนที่จำหน่าย','กราฟกระจาย','แสดงความสัมพันธ์ของตัวแปรเชิงปริมาณสองตัวแปร โดยไม่สรุปความเป็นเหตุเป็นผลโดยตรง']};return <section className="demo"><p className="demo-caption">เลือกประเด็นคำถามและพิจารณาเหตุผลก่อนเลือกประเภทแผนภูมิ</p><div className="choice-row">{Object.entries(m).map(([key,v])=><button key={key} className={question===key?'selected':''} onClick={()=>setQuestion(key)} aria-pressed={question===key}>{v[0]}</button>)}</div><h3 className="chart-answer">{m[question][1]}</h3><p>{m[question][2]}</p></section>}
function StepMotion({config}){
 const[active,setActive]=useState(0);const steps=config.steps;const current=steps[active];
 useEffect(()=>setActive(0),[config]);
 return <section className="step-motion" aria-label={config.label}>
  <p className="demo-caption">{config.label} · เลือกขั้นตอนเพื่อศึกษาการทำงานตามลำดับ</p>
  <div className="motion-track" aria-hidden="true"><svg viewBox="0 0 480 56" preserveAspectRatio="none"><path d="M60 28 H420"/></svg><span className="motion-marker" style={{'--step':active}}><i/></span></div>
  <div className="motion-stages">{steps.map((step,i)=><button key={step.title} className={i===active?'active':''} aria-current={i===active?'step':undefined} onClick={()=>setActive(i)}><span>{i+1}</span>{step.title}</button>)}</div>
  <div className="motion-scene" key={`${config.kind}-${active}`} aria-live="polite">
   {config.kind==='pipeline'?<><div className="motion-data"><span>{current.input}</span><b aria-hidden="true">→</b><span>{current.action}</span><b aria-hidden="true">→</b><span>{current.output}</span></div><p className="demo-result">ผลลัพธ์ที่ได้: {current.output}</p></>:<><div className="colab-motion-cell"><div className="colab-motion-toolbar"><span>เซลล์คำสั่งใน Google Colab</span><span className={'colab-motion-run '+(current.visual==='running'?'is-running':'')} aria-label={current.visual==='running'?'กำลังประมวลผล':'ปุ่มประมวลผล'}>▶</span></div>{current.code?<pre>{current.code}</pre>:<div className="colab-motion-empty">{current.visual==='empty'?'ระบุคำสั่งในเซลล์นี้':''}</div>}{current.visual==='result'&&<div className="colab-motion-output"><small>ผลลัพธ์</small><strong>{current.result}</strong></div>}{current.visual==='running'&&<p className="colab-motion-status">กำลังประมวลผลคำสั่ง…</p>}</div><p className="demo-result">{current.caption}</p></>}
  </div>
  <div className="motion-controls"><button onClick={()=>setActive(i=>Math.max(0,i-1))} disabled={active===0}>ย้อนหนึ่งขั้น</button><span>ขั้นที่ {active+1} จาก {steps.length}</span><button onClick={()=>setActive(i=>Math.min(steps.length-1,i+1))} disabled={active===steps.length-1}>ขั้นถัดไป</button></div>
 </section>
}
function Pipeline(){const[active,setActive]=useState(0);const stages=[['Get Data','กำหนดคำถาม กลุ่มเป้าหมาย แหล่งที่มา และสิทธิ์การใช้งานข้อมูล พร้อมนำเข้าไฟล์ CSV/Excel'],['ETL','ตรวจสอบคุณภาพข้อมูล รายงานปัญหา เลือกวิธีจัดการข้อมูล และบันทึก Cleaning Log'],['Data Model','กำหนดความสัมพันธ์ของตาราง เชื่อมโยงข้อมูล คำนวณตัวชี้วัด (KPI) และระบุข้อจำกัด'],['Visualization','ออกแบบทัศนภาพข้อมูลตามกลุ่มเป้าหมาย สร้างแผนภูมิและ Dashboard พร้อมประเมินการใช้งาน'],['Decision','สรุปข้อค้นพบ (Insight) และข้อเสนอแนะที่สามารถตรวจสอบย้อนกลับไปยังข้อมูลต้นทางได้']];return <section className="demo"><div className="pipeline">{stages.map(([name],i)=><button key={name} className={active===i?'selected':''} onClick={()=>setActive(i)} aria-pressed={active===i}><span>{i+1}</span>{name}</button>)}</div><p className="demo-result">{stages[active][1]}</p><p className="fine-print">เลือกแต่ละขั้นตอนเพื่อดูหลักฐานการปฏิบัติงาน โดยในกระบวนการจริงสามารถย้อนกลับไปปรับปรุงข้อมูลในขั้นตอนก่อนหน้าได้</p></section>}
const fnCatalog=[
 {step:1,group:'extract',period:'ขั้นตอนที่ 1 จาก 9 · การนำเข้าข้อมูล',token:'import pandas as pd',code:'import pandas as pd',purpose:'นำเข้าไลบรารี pandas โดยกำหนดชื่อย่อเป็น pd เพื่อใช้งานคำสั่งสำหรับจัดการข้อมูลตาราง',result:'ระบบพร้อมสำหรับการเรียกใช้คำสั่ง pd.read_csv() และคำสั่งจัดการตาราง DataFrame',caution:'ต้องรันคำสั่งนี้ใหม่ทุกครั้งเมื่อเริ่มต้นสภาพแวดล้อมการทำงาน (Runtime) ใหม่ใน Google Colab'},
 {step:2,group:'extract',period:'ขั้นตอนที่ 2 จาก 9 · การนำเข้าข้อมูล',token:"pd.read_csv(..., dtype=...)",code:"df = pd.read_csv('nvc_tech_store.csv', dtype={'customer_phone': 'string'})\ndf",purpose:'อ่านข้อมูลจากไฟล์ CSV เข้าสู่ตัวแปรตาราง df พร้อมกำหนดชนิดข้อมูลหมายเลขโทรศัพท์ให้เป็นข้อความ',result:'ได้ตารางขนาด 36 แถว 7 คอลัมน์ โดยหมายเลขโทรศัพท์ยังคงแสดงเลข 08 นำหน้าครบถ้วน',caution:'หากไม่กำหนดพารามิเตอร์ dtype ระบบจะแปลงหมายเลขโทรศัพท์เป็นตัวเลขและตัดเลข 0 นำหน้าออก'},
 {step:3,group:'inspect',period:'ขั้นตอนที่ 3 จาก 9 · การสำรวจโครงสร้างตาราง',token:'df.head()',code:'df.head()',purpose:'แสดงข้อมูลตัวอย่าง 5 แถวแรกของตารางเพื่อตรวจสอบความถูกต้องของการนำเข้าข้อมูล',result:'แสดงแถวลำดับที่ 0–4 (รหัส ORD-101 ถึง ORD-105) และพบค่าว่างในรายการ ORD-104',caution:'ต้องระบุเครื่องหมายวงเล็บ () ต่อท้ายชื่อคำสั่ง head เสมอ'},
 {step:4,group:'inspect',period:'ขั้นตอนที่ 4 จาก 9 · การสำรวจโครงสร้างตาราง',token:'df.tail()',code:'df.tail()',purpose:'แสดงข้อมูลตัวอย่าง 5 แถวสุดท้ายเพื่อตรวจสอบความครบถ้วนของข้อมูลส่วนท้ายตาราง',result:'แสดงแถวลำดับที่ 31–35 (รหัส ORD-130 ถึง ORD-134)',caution:'ใช้ตรวจสอบว่าส่วนท้ายของไฟล์ไม่มีแถวสรุปยอดรวมหรือบรรทัดว่างปะปนมากับรายการข้อมูล'},
 {step:5,group:'inspect',period:'ขั้นตอนที่ 5 จาก 9 · การสำรวจโครงสร้างตาราง',token:'df.shape',code:'df.shape',purpose:'ตรวจสอบขนาดของตารางในรูปแบบคู่ลำดับ (จำนวนแถวทั้งหมด, จำนวนคอลัมน์ทั้งหมด)',result:'(36, 7) หมายถึง ตารางข้อมูลต้นฉบับมีจำนวน 36 แถว และ 7 คอลัมน์',caution:'ไม่ต้องใส่เครื่องหมายวงเล็บ () ต่อท้าย เนื่องจาก shape เป็นค่าคุณสมบัติของตาราง'},
 {step:6,group:'inspect',period:'ขั้นตอนที่ 6 จาก 9 · การสำรวจโครงสร้างตาราง',token:'df.columns',code:'df.columns',purpose:'แสดงรายชื่อคอลัมน์ทั้งหมดของตาราง เพื่อใช้ตรวจสอบการสะกดชื่อคอลัมน์ก่อนเขียนคำสั่งคัดกรองข้อมูล',result:"Index(['order_id', 'customer_phone', 'product_name', 'category', 'quantity', 'total_price', 'payment_status'])",caution:'การอ้างอิงชื่อคอลัมน์ต้องสะกดตัวพิมพ์เล็ก-ใหญ่ให้ตรงตามรายชื่อที่ปรากฏทุกตัวอักษร'},
 {step:7,group:'diagnose',period:'ขั้นตอนที่ 7 จาก 9 · การตรวจสอบคุณภาพข้อมูล',token:'df.info()',code:'df.info()',purpose:'ตรวจสอบโครงสร้างตาราง ชนิดข้อมูลของแต่ละคอลัมน์ และจำนวนข้อมูลที่ไม่เป็นค่าว่าง (Non-Null Count)',result:'พบว่าคอลัมน์ customer_phone (34 แถว), quantity (35 แถว) และ total_price (34 แถว) มีข้อมูลไม่ครบ 36 แถว',caution:'ควรเปรียบเทียบค่า Non-Null Count กับจำนวนแถวทั้งหมดเสมอ เพื่อระบุคอลัมน์ที่มีข้อมูลสูญหาย'},
 {step:8,group:'diagnose',period:'ขั้นตอนที่ 8 จาก 9 · การตรวจสอบคุณภาพข้อมูล',token:'df.describe()',code:'df.describe()',purpose:'คำนวณค่าสถิติพื้นฐาน (ค่าเฉลี่ย ค่าต่ำสุด ค่าสูงสุด ฯลฯ) ของคอลัมน์ตัวเลขเพื่อค้นหาค่าผิดปกติ (Outlier)',result:'พบคอลัมน์ quantity มีค่าต่ำสุด -2 ชิ้น และ total_price มีค่าสูงสุด 99,000 บาท ส่งผลให้ค่าเฉลี่ยคลาดเคลื่อนจากความเป็นจริงไปอยู่ที่ 3,613.82 บาท',caution:'ไม่ควรนำค่าเฉลี่ยไปสรุปผลทันทีโดยไม่ตรวจสอบค่าต่ำสุด (min) และค่าสูงสุด (max) ก่อน'},
 {step:9,group:'diagnose',period:'ขั้นตอนที่ 9 จาก 9 · การตรวจสอบคุณภาพข้อมูล',token:'df.isna().sum()',code:'df.isna().sum()',purpose:'นับจำนวนข้อมูลสูญหาย (Missing Values) แยกตามรายคอลัมน์ ก่อนทำแบบฝึกหัดท้ายคาบเรียน',result:'คอลัมน์ customer_phone มีค่าว่าง 2 แถว, quantity 1 แถว และ total_price 2 แถว (รวม 5 จุด)',caution:'ต้องระบุคำสั่ง .sum() ต่อท้ายเพื่อให้ระบบรวมจำนวนค่าว่างแสดงผลเป็นรายคอลัมน์'}
];
function FunctionExplorerDemo({onJumpStep}){
 const[group,setGroup]=useState('all');const[selectedStep,setSelectedStep]=useState(1);
 const groups=[['all','ทั้งหมดในคาบเรียน (9 ขั้นตอน)'],['extract','1. การนำเข้าข้อมูล (2 ขั้นตอน)'],['inspect','2. การสำรวจโครงสร้างตาราง (4 ขั้นตอน)'],['diagnose','3. การตรวจสอบคุณภาพข้อมูล (3 ขั้นตอน)']];
 const visible=group==='all'?fnCatalog:fnCatalog.filter(f=>f.group===group);
 const active=visible.find(f=>f.step===selectedStep)??visible[0];
 return <section className="demo fn-explorer">
  <p className="demo-caption">สรุปคำสั่งทั้ง 9 ขั้นตอนสำหรับฝึกปฏิบัติในคาบเรียน (90 นาที) บนชุดข้อมูล <code>nvc_tech_store.csv</code> ก่อนทำแบบฝึกหัดท้ายคาบเรียน (30 นาที)</p>
  <div className="choice-row">{groups.map(([id,label])=><button key={id} className={group===id?'selected':''} onClick={()=>{setGroup(id);const first=(id==='all'?fnCatalog:fnCatalog.filter(f=>f.group===id))[0];if(first)setSelectedStep(first.step)}} aria-pressed={group===id}>{label}</button>)}</div>
  <div className="fn-grid" role="list">{visible.map(item=><button key={item.step} className={active.step===item.step?'selected':''} onClick={()=>setSelectedStep(item.step)} aria-pressed={active.step===item.step}><span>ขั้นตอนที่ {item.step}</span><code>{item.token}</code></button>)}</div>
  <div className="fn-detail" aria-live="polite">
   <div className="fn-detail-head"><h3>ขั้นตอนที่ {active.step}: <code>{active.token}</code></h3><div className="fn-detail-actions"><span>{active.period}</span>{onJumpStep&&<button type="button" className="jump-step-btn" onClick={()=>onJumpStep(active.step)}>ไปที่หน้าฝึกปฏิบัติขั้นตอนที่ {active.step} <ArrowRight size={15}/></button>}</div></div>
   <Code code={active.code}/>
   <div className="fn-meta-grid">
    <div><h4>หน้าที่ของคำสั่ง</h4><p>{active.purpose}</p></div>
    <div><h4>ผลลัพธ์จากการรันคำสั่ง</h4><p>{active.result}</p></div>
    <div className="fn-caution"><h4>ข้อควรระวังในการเขียนคำสั่ง</h4><p>{active.caution}</p></div>
   </div>
  </div>
  <div className="etl-impact-grid">
   <div><span>ช่วงที่ 1: ฝึกปฏิบัติเขียนคำสั่ง (90 นาที)</span><strong>ฝึกเขียนคำสั่ง 9 ขั้นตอน (ขั้นตอนที่ 1–9)</strong><small>นำเข้าข้อมูล กำหนดชนิดข้อมูล สำรวจโครงสร้างตาราง และตรวจสอบข้อมูลสูญหายและค่าผิดปกติ</small></div>
   <div><span>ช่วงที่ 2: แบบฝึกหัดท้ายคาบเรียน (30 นาที)</span><strong>ทำแบบฝึกหัดรายบุคคล 5 ข้อ (10 คะแนน)</strong><small>สรุปผลการสำรวจข้อมูลจากตาราง df ลงในส่วนท้ายของไฟล์ Notebook (W01.ipynb)</small></div>
  </div>
 </section>;
}
const w2WarmupItems=[
 {id:1,title:'ข้อที่ 1: การนำเข้าไลบรารี Pandas และการกำหนดชนิดข้อมูลหมายเลขโทรศัพท์',prompt:'ให้ผู้เรียนเขียนคำสั่งนำเข้าไลบรารี pandas ในชื่อย่อ pd และอ่านไฟล์ nvc_tech_store.csv เข้าสู่ตัวแปรตาราง df โดยกำหนดให้คอลัมน์ customer_phone มีชนิดข้อมูลเป็นข้อความ (string) พร้อมทั้งอธิบายเหตุผลที่ต้องกำหนดเป็นข้อความ',functions:['import pandas as pd',"pd.read_csv(..., dtype={'customer_phone': 'string'})"]},
 {id:2,title:'ข้อที่ 2: การตรวจสอบขนาดมิติของตารางข้อมูล (df.shape)',prompt:'ให้ผู้เรียนเขียนคำสั่งตรวจสอบขนาดมิติของตาราง df เพื่อตรวจนับจำนวนแถวและจำนวนคอลัมน์ทั้งหมดของตารางข้อมูลต้นฉบับ',functions:['df.shape']},
 {id:3,title:'ข้อที่ 3: การแสดงและตรวจสอบข้อมูลตัวอย่าง 5 แถวแรก (df.head)',prompt:'ให้ผู้เรียนเขียนคำสั่งแสดงข้อมูลตัวอย่าง 5 แถวแรกของตาราง df สังเกตรหัสคำสั่งซื้อ และตรวจสอบค่าผิดปกติหรือค่าว่างในคอลัมน์ customer_phone ที่แถวดัชนี 3',functions:['df.head(5)']},
 {id:4,title:'ข้อที่ 4: การแสดงและตรวจสอบข้อมูลตัวอย่าง 5 แถวสุดท้าย (df.tail)',prompt:'ให้ผู้เรียนเขียนคำสั่งแสดงข้อมูลตัวอย่าง 5 แถวสุดท้ายของตาราง df สังเกตหมายเลขดัชนีและรหัสคำสั่งซื้อในแถวสุดท้าย และอธิบายหลักการนับดัชนีเริ่มต้นจาก 0 ของ Python',functions:['df.tail(5)']},
 {id:5,title:'ข้อที่ 5: การสำรวจรายชื่อคอลัมน์และการจำแนกบทบาทของข้อมูล (df.columns)',prompt:'ให้ผู้เรียนเขียนคำสั่งแสดงรายชื่อคอลัมน์ทั้งหมดของตาราง df และจำแนกประเภทข้อมูลออกเป็น 3 กลุ่ม: รหัสระบุตัวตน (Identifier), ข้อมูลตัวเลข (Numeric) และข้อมูลข้อความ/จัดกลุ่ม (Categorical)',functions:['df.columns.tolist()']},
 {id:6,title:'ข้อที่ 6: การตรวจสอบชนิดข้อมูลของแต่ละคอลัมน์ (df.dtypes)',prompt:'ให้ผู้เรียนเขียนคำสั่งตรวจสอบชนิดข้อมูลของทุกคอลัมน์ในตาราง df และวิเคราะห์สาเหตุที่คอลัมน์ quantity แสดงชนิดข้อมูลเป็น float64 แทน int64',functions:['df.dtypes']},
 {id:7,title:'ข้อที่ 7: การตรวจสอบโครงสร้างตารางและความครบถ้วนของข้อมูล (df.info)',prompt:'ให้ผู้เรียนเขียนคำสั่งตรวจสอบโครงสร้างภาพรวมของตาราง df สังเกต Non-Null Count และระบุคอลัมน์ที่มีข้อมูลไม่ครบ 36 รายการ',functions:['df.info()']},
 {id:8,title:'ข้อที่ 8: การตรวจนับจำนวนข้อมูลสูญหายแยกตามรายคอลัมน์ (df.isna().sum)',prompt:'ให้ผู้เรียนเขียนคำสั่งตรวจนับจำนวนค่าว่าง (Missing Values) ในแต่ละคอลัมน์ สรุปจำนวนค่าว่างทั้งหมด และวิเคราะห์ผลกระทบต่อการคำนวณยอดขาย',functions:['df.isna().sum()']},
 {id:9,title:'ข้อที่ 9: การคำนวณค่าสถิติเชิงพรรณนาและการตรวจจับค่าผิดปกติ (df.describe)',prompt:'ให้ผู้เรียนเขียนคำสั่งคำนวณค่าสถิติพื้นฐานของคอลัมน์ตัวเลข สำรวจค่าต่ำสุด สูงสุด และค่าเฉลี่ย พร้อมทั้งวิเคราะห์ค่าผิดปกติ (Outlier) ทั้งจำนวนชิ้นติดลบและยอดเงินที่สูงผิดปกติ',functions:['df.describe()']}
];
function WarmupDrillDemo({doneMap,onToggleDone}){
 const[activeId,setActiveId]=useState(1);
 const item=w2WarmupItems.find(x=>x.id===activeId)??w2WarmupItems[0];
 const doneKey=`warmup-${item.id}`;
 const isDone=Boolean(doneMap?.[doneKey]);
 return <section className="demo fn-explorer">
  <p className="demo-caption">เปิดโปรแกรม Google Colab (สร้างสมุดงานใหม่ด้วยตนเอง) แล้วเขียนคำสั่งวิเคราะห์สำรวจข้อมูลทั้ง 9 ข้อ เพื่อทบทวนฟังก์ชันที่เรียนเมื่อสัปดาห์ที่ 1 นำโค้ดและผลลัพธ์ที่ได้ไปพิมพ์ตอบในเอกสารใบงาน Google Docs</p>
  <div className="interactive-question-cards">{w2WarmupItems.map(x=>{const k=`warmup-${x.id}`;const checked=Boolean(doneMap?.[k]);return <button key={x.id} className={`q-card ${activeId===x.id?'selected':''} ${checked?'is-done':''}`} onClick={()=>setActiveId(x.id)} aria-pressed={activeId===x.id}><div className="q-card-top"><span className="q-badge">ทบทวนข้อที่ {x.id}</span>{checked?<CheckCircle2 size={18} className="done-icon"/>:<Circle size={18} className="todo-icon"/>}</div><strong>{x.title.replace(/^ข้อที่ \d+: /,'')}</strong><small>{x.functions.join(' · ')}</small></button>})}</div>
  <div className="fn-detail" aria-live="polite">
   <div className="fn-detail-head"><h3>{item.title}</h3><div className="fn-detail-actions"><span>คำสั่งที่ทบทวน: {item.functions.join(' · ')}</span>{onToggleDone&&<button type="button" className={'check-done-btn '+(isDone?'is-done':'')} onClick={()=>onToggleDone(doneKey)}>{isDone?<CheckCircle2 size={16}/>:<Circle size={16}/>}{isDone?'สถานะ: ดำเนินการเสร็จแล้ว':'บันทึกว่าดำเนินการเสร็จแล้ว'}</button>}</div></div>
   <p className="concept-body">{item.prompt}</p>
   <div className="fn-meta-grid">
    <div><h4>ชุดข้อมูลที่ใช้</h4><p>ไฟล์ <code>nvc_tech_store.csv</code> (อัปโหลดเข้าสู่โปรแกรม Google Colab)</p></div>
    <div><h4>พื้นที่ปฏิบัติงาน</h4><p>เปิด Google Colab สร้างสมุดงานใหม่ (New Notebook) เขียนคำสั่งภาษา Python ด้วยตนเอง</p></div>
    <div><h4>การบันทึกผลงาน</h4><p>คัดลอกคำสั่งที่รันสำเร็จและผลลัพธ์ นำไปพิมพ์ตอบลงในใบงาน Google Docs (9 ข้อ · 10 คะแนน)</p></div>
   </div>
  </div>
  <div className="google-docs-callout">
   <div className="google-docs-callout-info">
    <FileText size={28}/>
    <div>
     <strong>ชุดแบบฝึกหัดปฏิบัติการวิเคราะห์ข้อมูล 9 ข้อ (Google Colab → Google Docs)</strong>
     <p>1) ดาวน์โหลด Dataset นำไปเขียนโค้ดวิเคราะห์ใน Google Colab  2) นำผลลัพธ์มาพิมพ์ตอบในใบงาน Google Docs</p>
    </div>
   </div>
   <div className="google-docs-callout-actions">
    <a className="google-docs-callout-btn" href="ชุดเรียน/ชุดข้อมูล/nvc_tech_store.csv" download>
     <Download size={15}/> 1. ดาวน์โหลด Dataset (.csv)
    </a>
    <a className="google-docs-callout-btn secondary" href="ชุดเรียน/เรียนย้อนหลัง_สัปดาห์02/ใบงานปฏิบัติการ_ทบทวนก่อนเรียน_GoogleDocs.docx" download>
     <FileText size={15}/> 2. ดาวน์โหลดใบงานแบบฝึกหัด 9 ข้อ (Google Docs .docx)
    </a>
   </div>
  </div>
 </section>;
}
const w2EtlCatalog=[
 {step:1,group:'diagnose',period:'ขั้นตอนที่ 1 จาก 10 · การเตรียมตารางข้อมูลต้นฉบับ',token:'pd.read_csv(..., dtype=...)',code:"import pandas as pd\ndf = pd.read_csv('nvc_tech_store.csv', dtype={'customer_phone': 'string'})\ndf.shape",purpose:'นำเข้าตารางข้อมูลต้นฉบับ df ขนาด (36, 7) พร้อมกำหนดชนิดข้อมูลหมายเลขโทรศัพท์ให้พร้อมสำหรับกระบวนการ ETL',result:'(36, 7) หมายถึง ตารางข้อมูลต้นฉบับมี 36 แถว 7 คอลัมน์ พร้อมสำหรับการคัดกรองและจัดเตรียมข้อมูล',caution:'ตรวจสอบว่าได้อัปโหลดไฟล์ nvc_tech_store.csv เข้าสู่โปรแกรม Google Colab เรียบร้อยแล้ว'},
 {step:2,group:'diagnose',period:'ขั้นตอนที่ 2 จาก 10 · การคัดกรองแถวที่มีปัญหา',token:"df[df['total_price'].isna()]",code:"df[df['total_price'].isna()]",purpose:'คัดกรองเฉพาะแถวที่มีค่าว่างในคอลัมน์ยอดเงินรวม (total_price) ออกมาแสดงผลเพื่อตรวจสอบรายการที่มีปัญหา',result:'พบ 2 รายการ ได้แก่ รหัส ORD-107 (เว็บแคม Full HD) และรหัส ORD-125 (สายแลน Cat6)',caution:'ต้องระบุเครื่องหมายวงเล็บเหลี่ยมให้ครบทั้งส่วนการคัดกรองตาราง df[...] และการอ้างอิงชื่อคอลัมน์'},
 {step:3,group:'diagnose',period:'ขั้นตอนที่ 3 จาก 10 · การตรวจสอบข้อมูลซ้ำซ้อน',token:'df.duplicated().sum()',code:'df.duplicated().sum()',purpose:'นับจำนวนแถวที่มีการบันทึกข้อมูลซ้ำซ้อนกับแถวก่อนหน้าในทุกคอลัมน์',result:'พบข้อมูลที่บันทึกซ้ำซ้อนเกินจำนวนจริง 2 แถว',caution:'หากไม่ลบแถวที่บันทึกข้อมูลซ้ำซ้อน จะทำให้การคำนวณยอดจำหน่ายรวมและจำนวนคำสั่งซื้อนับซ้ำซ้อนเกินจำนวนจริง'},
 {step:4,group:'diagnose',period:'ขั้นตอนที่ 4 จาก 10 · การตรวจสอบข้อมูลซ้ำซ้อน',token:'df[df.duplicated(keep=False)]',code:'df[df.duplicated(keep=False)]',purpose:'แสดงแถวที่มีการบันทึกข้อมูลซ้ำซ้อนทั้งหมด (ทั้งแถวต้นฉบับและแถวที่ซ้ำ) เพื่อเปรียบเทียบความถูกต้องก่อนลบข้อมูล',result:'แสดงรายการที่บันทึกข้อมูลซ้ำซ้อนรวม 4 แถว (2 คู่รายการ) ได้แก่ รหัส ORD-105 และรหัส ORD-118',caution:'การกำหนดพารามิเตอร์ keep=False ช่วยให้แสดงทั้งแถวแรกและแถวที่ซ้ำควบคู่กันเพื่อตรวจสอบเปรียบเทียบ'},
 {step:5,group:'diagnose',period:'ขั้นตอนที่ 5 จาก 10 · การตรวจสอบความสม่ำเสมอของข้อความ',token:"df['category'].value_counts()",code:"df['category'].value_counts()",purpose:'นับจำนวนรายการในแต่ละหมวดหมู่สินค้าเพื่อตรวจสอบความสม่ำเสมอของข้อความและอักขระช่องว่างส่วนเกิน',result:"พบหมวดหมู่ 'อุปกรณ์ต่อพ่วง' (13 รายการ) แยกจาก 'อุปกรณ์ต่อพ่วง ' ที่มีอักขระช่องว่างต่อท้ายข้อความ (2 รายการ)",caution:'อักขระช่องว่างต่อท้ายข้อความทำให้โปรแกรมแยกนับข้อมูลเป็นคนละหมวดหมู่'},
 {step:6,group:'transform',period:'ขั้นตอนที่ 6 จาก 10 · การปรับรูปแบบและการทำความสะอาดข้อมูล',token:'.str.strip()',code:"df['category'] = df['category'].str.strip()\ndf['category'].value_counts()",purpose:'ลบอักขระช่องว่างส่วนเกินบริเวณด้านหน้าและด้านหลังของข้อความในคอลัมน์ category',result:"หมวดหมู่ 'อุปกรณ์ต่อพ่วง' ถูกรวมเป็นหมวดหมู่เดียวกันจำนวน 15 รายการ ครบ 3 หมวดหมู่มาตรฐาน",caution:"ต้องระบุคำสั่งกำหนดค่ากลับเข้าสู่คอลัมน์เดิม (df['category'] = ...) เพื่อให้ข้อมูลที่แก้ไขแล้วถูกบันทึกทับในตาราง"},
 {step:7,group:'transform',period:'ขั้นตอนที่ 7 จาก 10 · การปรับรูปแบบและการทำความสะอาดข้อมูล',token:'.drop_duplicates()',code:'df_clean = df.drop_duplicates().copy()\ndf_clean.shape',purpose:'ลบแถวที่มีการบันทึกข้อมูลซ้ำซ้อนออกและจัดเก็บลงในตัวแปรตารางใหม่ชื่อ df_clean',result:'ขนาดของตารางลดลงจาก (36, 7) เหลือ (34, 7)',caution:'ควรจัดเก็บในตัวแปรตารางใหม่เพื่อรักษาตารางข้อมูลต้นฉบับ (df) ไว้สำหรับการตรวจสอบเปรียบเทียบ'},
 {step:8,group:'transform',period:'ขั้นตอนที่ 8 จาก 10 · การปรับรูปแบบและการทำความสะอาดข้อมูล',token:'.dropna(subset=...)',code:"df_clean = df_clean.dropna(subset=['quantity', 'total_price'])\ndf_clean.shape",purpose:'ลบเฉพาะแถวที่มีค่าว่างในคอลัมน์จำนวนชิ้นหรือยอดเงินรวม โดยยังคงเก็บรักษาแถวที่ขาดเฉพาะหมายเลขโทรศัพท์ไว้',result:'ขนาดของตารางลดลงจาก (34, 7) เหลือ (31, 7)',caution:'หากไม่ระบุพารามิเตอร์ subset ระบบจะลบรายการที่มีมูลค่าการซื้อขายจริงแต่ไม่ได้ระบุหมายเลขโทรศัพท์ออกไปด้วย'},
 {step:9,group:'transform',period:'ขั้นตอนที่ 9 จาก 10 · การคัดกรองค่าที่อยู่นอกเกณฑ์ที่กำหนด',token:'.between(1, 20)',code:"df_clean = df_clean[df_clean['quantity'].between(1, 20) & (df_clean['total_price'] <= 10000)]\nround(df['total_price'].mean(), 2), round(df_clean['total_price'].mean(), 2)",purpose:'คัดกรองเฉพาะรายการที่มีจำนวนชิ้น 1–20 ชิ้น และยอดเงินรวมไม่เกิน 10,000 บาท พร้อมเปรียบเทียบค่าเฉลี่ยก่อนและหลังการจัดเตรียมข้อมูล',result:'ได้ตารางข้อมูลที่ผ่านการจัดเตรียมแล้วจำนวน 29 แถว โดยค่าเฉลี่ยปรับจาก 3,613.82 บาท เป็น 754.83 บาท',caution:'การเชื่อมหลายเงื่อนไขในไลบรารี pandas ต้องใช้เครื่องหมาย & และใส่วงเล็บครอบแต่ละเงื่อนไขย่อยเสมอ'},
 {step:10,group:'load',period:'ขั้นตอนที่ 10 จาก 10 · การส่งออกข้อมูลที่ผ่านการจัดเตรียมแล้ว',token:'.to_csv(..., index=False)',code:"df_clean.to_csv('nvc_tech_store_clean.csv', index=False)\ndf_clean.head()",purpose:'บันทึกตารางข้อมูลที่ผ่านการจัดเตรียมแล้ว (df_clean) ออกเป็นไฟล์ CSV ใหม่',result:'ได้ไฟล์ nvc_tech_store_clean.csv (ขนาด 29 แถว 7 คอลัมน์) พร้อมสำหรับการวิเคราะห์และนำเสนอข้อมูล',caution:'ต้องระบุพารามิเตอร์ index=False เพื่อไม่ให้ระบบบันทึกลำดับแถวเป็นคอลัมน์เกินมาในไฟล์ CSV'}
];
const etlTheoryStages=[
 {id:'E',badge:'ขั้นตอนที่ 1: Extract (E)',title:'Extract — การดึงและนำเข้าข้อมูลจากแหล่งต้นทาง',desc:'การรวบรวมและอ่านข้อมูลจากแหล่งจัดเก็บข้อมูลต้นทาง (เช่น ไฟล์ CSV, ไฟล์ Excel หรือระบบฐานข้อมูล) เข้าสู่โปรแกรมประมวลผลในรูปแบบตารางข้อมูล (DataFrame) พร้อมกำหนดชนิดข้อมูลเบื้องต้นให้เหมาะสม',input:'ไฟล์ข้อมูลต้นฉบับ nvc_tech_store.csv (36 แถว 7 คอลัมน์)',process:'อ่านไฟล์ด้วยคำสั่ง pd.read_csv() และกำหนดชนิดข้อมูลหมายเลขโทรศัพท์ให้เป็นข้อความ (string)',output:'ตารางข้อมูลต้นฉบับ df ในหน่วยความจำ พร้อมสำหรับการตรวจสอบคุณภาพข้อมูล',commands:['import pandas as pd',"pd.read_csv('nvc_tech_store.csv', dtype={'customer_phone': 'string'})",'df.shape']},
 {id:'T',badge:'ขั้นตอนที่ 2: Transform (T)',title:'Transform — การปรับรูปแบบและทำความสะอาดข้อมูล',desc:'ขั้นตอนสำคัญที่สุดในการตรวจสอบ คัดกรอง และแก้ไขข้อผิดพลาดของข้อมูล 4 รูปแบบ ได้แก่ การตัดอักขระช่องว่างส่วนเกิน การลบข้อมูลที่บันทึกซ้ำซ้อน การจัดการข้อมูลสูญหาย และการคัดกรองค่าที่อยู่นอกเกณฑ์ที่กำหนด',input:'ตารางข้อมูลต้นฉบับ df (36 แถว · มีข้อมูลซ้ำ ค่าว่าง ช่องว่างส่วนเกิน และค่าผิดปกติ)',process:'ตรวจสอบแถวที่มีปัญหาและปรับปรุงข้อมูลทีละประเด็น โดยแยกจัดเก็บในตัวแปรตาราง df_clean',output:'ตารางข้อมูลที่ผ่านการจัดเตรียมแล้ว df_clean (29 แถว · ข้อมูลถูกต้องตามเกณฑ์มาตรฐาน)',commands:["df['category'].str.strip()",'.drop_duplicates()',".dropna(subset=['quantity', 'total_price'])",".between(1, 20) & (df_clean['total_price'] <= 10000)"]},
 {id:'L',badge:'ขั้นตอนที่ 3: Load (L)',title:'Load — การจัดเก็บและส่งออกข้อมูลที่พร้อมใช้งาน',desc:'การนำตารางข้อมูลที่ผ่านการปรับรูปแบบและทำความสะอาดเรียบร้อยแล้ว ไปจัดเก็บเป็นไฟล์ข้อมูลชุดใหม่ที่มีความน่าเชื่อถือ พร้อมสำหรับนำไปคำนวณสถิติหรือสร้างแผนภูมินำเสนอข้อมูล',input:'ตารางข้อมูลที่ผ่านการจัดเตรียมแล้ว df_clean (29 แถว 7 คอลัมน์)',process:'บันทึกออกเป็นไฟล์ CSV ใหม่โดยกำหนดพารามิเตอร์ index=False เพื่อไม่ให้มีคอลัมน์ลำดับแถวเกินมา',output:'ไฟล์ข้อมูล nvc_tech_store_clean.csv ที่พร้อมนำไปใช้วิเคราะห์และสรุปรายงาน',commands:["df_clean.to_csv('nvc_tech_store_clean.csv', index=False)",'df_clean.head()']}
];
const etlIssueCases=[
 {id:'text',label:'1. อักขระช่องว่างส่วนเกินในข้อความ',problemTitle:'ปัญหา: ข้อความมีอักขระช่องว่างต่อท้าย',beforeExample:"'อุปกรณ์ต่อพ่วง' (13 รายการ) แยกจาก 'อุปกรณ์ต่อพ่วง ' (2 รายการ)",impact:'โปรแกรมมองว่าเป็นคนละหมวดหมู่กัน ทำให้สรุปจำนวนหมวดหมู่สินค้าเป็น 4 หมวดหมู่ (จากที่ควรมี 3 หมวดหมู่)',solution:'ใช้คำสั่ง .str.strip() ตัดอักขระช่องว่างส่วนเกินด้านหน้าและด้านหลังข้อความ',afterExample:"รวมเป็นหมวดหมู่ 'อุปกรณ์ต่อพ่วง' เดียวกันจำนวน 15 รายการ ครบ 3 หมวดหมู่มาตรฐาน"},
 {id:'dup',label:'2. การบันทึกข้อมูลซ้ำซ้อน',problemTitle:'ปัญหา: รายการคำสั่งซื้อถูกบันทึกซ้ำทั้งแถว',beforeExample:'รหัส ORD-105 บันทึกซ้ำ 2 แถว และรหัส ORD-118 บันทึกซ้ำ 2 แถว (รวม 36 แถว)',impact:'การนับจำนวนคำสั่งซื้อและยอดจำหน่ายรวมจะนับซ้ำซ้อนเกินจำนวนจริงไป 2 รายการ',solution:'ตรวจสอบแถวซ้ำด้วย df[df.duplicated(keep=False)] แล้วลบแถวที่ซ้ำด้วย .drop_duplicates()',afterExample:'เหลือเฉพาะรายการคำสั่งซื้อที่ไม่ซ้ำกันจำนวน 34 แถว ในตาราง df_clean'},
 {id:'missing',label:'3. ข้อมูลสูญหายหรือค่าว่าง',problemTitle:'ปัญหา: มีค่าว่าง (NaN) ในคอลัมน์ข้อมูล',beforeExample:'ขาดยอดเงินรวม (total_price) 2 แถว, ขาดจำนวนชิ้น (quantity) 1 แถว และขาดหมายเลขโทรศัพท์ 2 แถว',impact:'แถวที่ขาดจำนวนชิ้นหรือยอดเงินรวมไม่สามารถนำไปคำนวณยอดขายได้ แต่แถวที่ขาดเพียงหมายเลขโทรศัพท์ยังมีข้อมูลยอดขายครบถ้วน',solution:"ใช้คำสั่ง .dropna(subset=['quantity', 'total_price']) เพื่อลบเฉพาะแถวที่ขาดข้อมูลสำคัญ",afterExample:'ตัดเฉพาะ 3 แถวที่ขาดจำนวนชิ้นหรือยอดเงินรวม เหลือ 31 แถว (ยังคงเก็บรักษารายการที่ขาดเฉพาะหมายเลขโทรศัพท์ไว้)'},
 {id:'outlier',label:'4. ค่าผิดปกติที่อยู่นอกเกณฑ์ที่กำหนด',problemTitle:'ปัญหา: ตัวเลขติดลบหรือสูงผิดปกติจากการบันทึกผิดพลาด',beforeExample:'พบจำนวนชิ้นเท่ากับ -2 ชิ้น (รหัส ORD-114) และยอดเงินรวมสูงถึง 99,000 บาท (รหัส ORD-122)',impact:'ส่งผลให้ค่าเฉลี่ยยอดสั่งซื้อคลาดเคลื่อนจากความเป็นจริงไปอยู่ที่ 3,613.82 บาทต่อรายการ',solution:'คัดกรองเฉพาะรายการที่มีจำนวนชิ้น 1–20 ชิ้น และยอดเงินรวมไม่เกิน 10,000 บาท',afterExample:'เหลือข้อมูลที่ถูกต้องสมบูรณ์ 29 แถว และค่าเฉลี่ยยอดสั่งซื้อกลับมาอยู่ที่ 754.83 บาทต่อรายการ ตามมูลค่าจริง'}
];
function W2EtlTheoryDemo(){
 const[stageId,setStageId]=useState('E');
 const[issueId,setIssueId]=useState('text');
 const stage=etlTheoryStages.find(s=>s.id===stageId)??etlTheoryStages[0];
 const issue=etlIssueCases.find(c=>c.id===issueId)??etlIssueCases[0];
 return <section className="demo fn-explorer">
  <p className="demo-caption">ส่วนที่ 1: คลิกเลือกแต่ละองค์ประกอบของกระบวนการ ETL (Extract → Transform → Load) เพื่อศึกษาหลักการทำงานตามลำดับ</p>
  <div className="interactive-question-cards">
   {etlTheoryStages.map((s,idx)=>(
    <button key={s.id} type="button" className={'q-card '+(stageId===s.id?'selected':'')} onClick={()=>setStageId(s.id)} aria-pressed={stageId===s.id}>
     <div className="q-card-top"><span className="q-badge">{s.badge}</span></div>
     <strong>{s.title}</strong>
     <small>{s.commands.join(' · ')}</small>
    </button>
   ))}
  </div>
  <div className="fn-detail" aria-live="polite">
   <div className="fn-detail-head"><h3>{stage.title}</h3><span>คำสั่งที่ใช้: {stage.commands.join(' · ')}</span></div>
   <p className="concept-body">{stage.desc}</p>
   <div className="fn-meta-grid">
    <div><h4>ข้อมูลขาเข้า (Input)</h4><p>{stage.input}</p></div>
    <div><h4>การดำเนินการ (Process)</h4><p>{stage.process}</p></div>
    <div><h4>ผลลัพธ์ที่ได้ (Output)</h4><p>{stage.output}</p></div>
   </div>
  </div>
  <p className="demo-caption" style={{marginTop:'18px'}}>ส่วนที่ 2: คลิกเลือกกรณีศึกษาปัญหาคุณภาพข้อมูลทั้ง 4 รูปแบบ เพื่อเปรียบเทียบผลกระทบและแนวทางการแก้ไขในชุดข้อมูลจริง</p>
  <div className="choice-row">
   {etlIssueCases.map(c=>(
    <button key={c.id} type="button" className={issueId===c.id?'selected':''} onClick={()=>setIssueId(c.id)} aria-pressed={issueId===c.id}>{c.label}</button>
   ))}
  </div>
  <div className="fn-detail" aria-live="polite">
   <div className="fn-detail-head"><h3>{issue.problemTitle}</h3></div>
   <div className="fn-meta-grid">
    <div><h4>ลักษณะข้อมูลก่อนทำ ETL</h4><p>{issue.beforeExample}</p></div>
    <div className="fn-caution"><h4>ผลกระทบหากไม่จัดเตรียมข้อมูล</h4><p>{issue.impact}</p></div>
    <div><h4>แนวทางแก้ไขและผลลัพธ์หลังทำ ETL</h4><p><strong>วิธีแก้ไข:</strong> {issue.solution}<br/><strong>ผลลัพธ์:</strong> {issue.afterExample}</p></div>
   </div>
  </div>
 </section>;
}
function W2EtlExplorerDemo({onJumpStep}){
 const[group,setGroup]=useState('all');const[selectedStep,setSelectedStep]=useState(1);
 const groups=[['all','ทั้งหมดในคาบเรียน (10 ขั้นตอน)'],['diagnose','1. การคัดกรองและระบุปัญหา (5 ขั้นตอน)'],['transform','2. การปรับรูปแบบและทำความสะอาดข้อมูล (4 ขั้นตอน)'],['load','3. การส่งออกไฟล์ข้อมูล (1 ขั้นตอน)']];
 const visible=group==='all'?w2EtlCatalog:w2EtlCatalog.filter(f=>f.group===group);
 const active=visible.find(f=>f.step===selectedStep)??visible[0];
 return <section className="demo fn-explorer">
  <p className="demo-caption">สรุปคำสั่งทั้ง 10 ขั้นตอนในกระบวนการจัดเตรียมข้อมูล (ETL) บนชุดข้อมูล <code>nvc_tech_store.csv</code> · คลิกเลือกแต่ละขั้นตอนเพื่อดูคำอธิบายหรือเข้าสู่หน้าฝึกปฏิบัติ</p>
  <div className="choice-row">{groups.map(([id,label])=><button key={id} className={group===id?'selected':''} onClick={()=>{setGroup(id);const first=(id==='all'?w2EtlCatalog:w2EtlCatalog.filter(f=>f.group===id))[0];if(first)setSelectedStep(first.step)}} aria-pressed={group===id}>{label}</button>)}</div>
  <div className="fn-grid" role="list">{visible.map(item=><button key={item.step} className={active.step===item.step?'selected':''} onClick={()=>setSelectedStep(item.step)} aria-pressed={active.step===item.step}><span>ขั้นตอนที่ {item.step}</span><code>{item.token}</code></button>)}</div>
  <div className="fn-detail" aria-live="polite">
   <div className="fn-detail-head"><h3>ขั้นตอนที่ {active.step}: <code>{active.token}</code></h3><div className="fn-detail-actions"><span>{active.period}</span>{onJumpStep&&<button type="button" className="jump-step-btn" onClick={()=>onJumpStep(active.step)}>ไปที่หน้าฝึกปฏิบัติขั้นตอนที่ {active.step} <ArrowRight size={15}/></button>}</div></div>
   <Code code={active.code}/>
   <div className="fn-meta-grid">
    <div><h4>หน้าที่ของคำสั่ง</h4><p>{active.purpose}</p></div>
    <div><h4>ผลลัพธ์จากการรันคำสั่ง</h4><p>{active.result}</p></div>
    <div className="fn-caution"><h4>ข้อควรระวังในการเขียนคำสั่ง</h4><p>{active.caution}</p></div>
   </div>
  </div>
  <div className="etl-impact-grid">
   <div><span>ตารางข้อมูลต้นฉบับก่อนทำ ETL (df)</span><strong>จำนวน 36 แถว · ค่าเฉลี่ย 3,613.82 บาท/รายการ</strong><small>มีแถวบันทึกข้อมูลซ้ำซ้อน 2 คู่ · หมวดหมู่มีอักขระช่องว่างต่อท้ายข้อความ · มีค่าผิดปกติ 99,000 บาท</small></div>
   <div><span>ตารางข้อมูลที่ผ่านการจัดเตรียมแล้ว (df_clean)</span><strong>จำนวน 29 แถว · ค่าเฉลี่ย 754.83 บาท/รายการ</strong><small>ส่งออกเป็นไฟล์ nvc_tech_store_clean.csv พร้อมสำหรับทำแบบฝึกหัดท้ายคาบเรียน</small></div>
  </div>
 </section>;
}
const w2ClosingQuestions=[
 {id:1,score:'2 คะแนน',title:'ข้อที่ 1: เปรียบเทียบขนาดของตารางก่อนและหลังการจัดเตรียมข้อมูล',task:'เขียนคำสั่งตรวจสอบขนาดของตารางข้อมูลต้นฉบับ (df.shape) เปรียบเทียบกับตารางข้อมูลที่ผ่านการจัดเตรียมแล้ว (df_clean.shape) พร้อมระบุว่ามีแถวข้อมูลที่ถูกคัดกรองออกไปทั้งหมดกี่แถว'},
 {id:2,score:'2 คะแนน',title:'ข้อที่ 2: ตรวจสอบจำนวนข้อมูลสูญหายที่คงเหลือในตาราง df_clean',task:'เขียนคำสั่งตรวจสอบจำนวนค่าว่างคงเหลือด้วยคำสั่ง df_clean.isna().sum() และระบุว่าคอลัมน์ใดที่ยังคงมีค่าว่างเหลืออยู่ จำนวนกี่แถว พร้อมอธิบายเหตุผลที่ไม่ลบแถวดังกล่าวออก'},
 {id:3,score:'2 คะแนน',title:'ข้อที่ 3: สรุปจำนวนรายการแยกตามหมวดหมู่สินค้าหลังทำความสะอาดข้อมูล',task:"เขียนคำสั่งนับจำนวนรายการสินค้าแต่ละหมวดหมู่ด้วยคำสั่ง df_clean['category'].value_counts() และระบุจำนวนรายการของทั้ง 3 หมวดหมู่"},
 {id:4,score:'2 คะแนน',title:'ข้อที่ 4: ตรวจสอบค่าสถิติพื้นฐานของตารางข้อมูลที่ผ่านการจัดเตรียมแล้ว',task:'เขียนคำสั่งคำนวณค่าสถิติพื้นฐานด้วยคำสั่ง df_clean.describe() และระบุค่าเฉลี่ย (mean) ค่าต่ำสุด (min) และค่าสูงสุด (max) ของคอลัมน์ total_price ภายหลังการจัดเตรียมข้อมูล'},
 {id:5,score:'2 คะแนน',title:'ข้อที่ 5: ตรวจสอบความถูกต้องของไฟล์ CSV ที่ส่งออก',task:"เขียนคำสั่งอ่านไฟล์ CSV ที่ส่งออกไว้ขึ้นมาแสดงข้อมูลตัวอย่าง 5 แถวแรก ด้วยคำสั่ง pd.read_csv('nvc_tech_store_clean.csv').head() เพื่อยืนยันว่าไฟล์มี 7 คอลัมน์ครบถ้วน"}
];
function W2ClosingLabDemo({doneMap,onToggleDone}){
 const[activeQ,setActiveQ]=useState(1);
 const q=w2ClosingQuestions.find(x=>x.id===activeQ)??w2ClosingQuestions[0];
 const doneKey=`w2lab-${q.id}`;
 const isDone=Boolean(doneMap?.[doneKey]);
 const completedCount=w2ClosingQuestions.filter(x=>doneMap?.[`w2lab-${x.id}`]).length;
 return <section className="demo fn-explorer">
  <div className="exercise-header-bar"><p className="demo-caption">เวลาทำแบบฝึกหัด 40 นาที · คะแนนเต็ม 10 คะแนน (5 ข้อ ข้อละ 2 คะแนน) · พิมพ์คำสั่งและบันทึกคำตอบลงในส่วนท้ายของไฟล์ <code>W02.ipynb</code></p><span className="progress-pill">ความคืบหน้า: {completedCount}/5 ข้อ</span></div>
  <div className="interactive-question-cards five-cols">{w2ClosingQuestions.map(x=>{const k=`w2lab-${x.id}`;const checked=Boolean(doneMap?.[k]);return <button key={x.id} className={`q-card ${activeQ===x.id?'selected':''} ${checked?'is-done':''}`} onClick={()=>setActiveQ(x.id)} aria-pressed={activeQ===x.id}><div className="q-card-top"><span className="q-badge">ข้อที่ {x.id} ({x.score})</span>{checked?<CheckCircle2 size={18} className="done-icon"/>:<Circle size={18} className="todo-icon"/>}</div><strong>{x.title.replace(/^ข้อที่ \d+: /,'')}</strong></button>})}</div>
  <div className="fn-detail" aria-live="polite">
   <div className="fn-detail-head"><h3>{q.title}</h3><div className="fn-detail-actions"><span>คะแนน {q.score}</span>{onToggleDone&&<button type="button" className={'check-done-btn '+(isDone?'is-done':'')} onClick={()=>onToggleDone(doneKey)}>{isDone?<CheckCircle2 size={16}/>:<Circle size={16}/>}{isDone?'สถานะ: ดำเนินการเสร็จแล้ว':'บันทึกว่าดำเนินการเสร็จแล้ว'}</button>}</div></div>
   <p className="concept-body">{q.task}</p>
   <div className="fn-meta-grid">
    <div><h4>ตารางข้อมูลที่ใช้</h4><p>ใช้ตารางข้อมูล <code>df_clean</code> และไฟล์ <code>nvc_tech_store_clean.csv</code> ที่ได้จากการฝึกปฏิบัติขั้นตอนที่ 1–10</p></div>
    <div><h4>สิ่งที่ต้องบันทึกในไฟล์ Notebook</h4><p>1) คำสั่งภาษา Python ที่รันผลลัพธ์เรียบร้อยแล้ว และ 2) คำตอบสรุปผลลัพธ์ที่ได้จากตารางข้อมูล</p></div>
   </div>
  </div>
  <div className="google-docs-callout">
   <div className="google-docs-callout-info">
    <FileText size={26}/>
    <div>
     <strong>เอกสารแบบฝึกหัดสำหรับ Google Docs / Microsoft Word (.docx)</strong>
     <p>เปิดใช้งานใน Google Docs เพื่อให้นักศึกษาพิมพ์คำสั่งและคำตอบแบบฝึกหัดท้ายคาบ 5 ข้อ (10 คะแนน)</p>
    </div>
   </div>
   <div className="google-docs-callout-actions">
    <a className="google-docs-callout-btn" href="ชุดเรียน/เรียนย้อนหลัง_สัปดาห์02/ใบงานปฏิบัติการ_สัปดาห์ที่02_จันทร์_GoogleDocs.docx" download>
     <Download size={15}/> ดาวน์โหลดใบงานแบบฝึกหัดท้ายคาบ (.docx)
    </a>
   </div>
  </div>
 </section>;
}
function Code({code}){const[copied,setCopied]=useState(false);const[error,setError]=useState('');async function copy(){try{await navigator.clipboard.writeText(code);setCopied(true);setError('');setTimeout(()=>setCopied(false),2200)}catch{setError('คัดลอกอัตโนมัติไม่ได้ ให้เลือกข้อความในกรอบแล้วคัดลอก')}}return <div className="code-block"><div className="code-toolbar"><span><Code2 size={15}/> Python · Google Colab</span><button onClick={copy}>{copied?<Check size={14}/>:<FileText size={14}/>} {copied?'คัดลอกแล้ว':'คัดลอกคำสั่ง'}</button></div><pre><code>{code}</code></pre>{error&&<p role="status">{error}</p>}</div>}
function LessonOutput({output}){
 if(!output)return null;
 return <section className="lesson-output" aria-label={output.title??'ผลลัพธ์อ้างอิง'}>
  {output.kind==='figure'?<><p className="output-caption">{output.title}</p><iframe className="lesson-figure" title={output.title} src={output.url} loading="lazy"/><a href={output.url} target="_blank" rel="noreferrer">เปิดตัวอย่างกราฟในหน้าต่างแยก</a></>:output.kind==='table'?<div className="table-scroll" tabIndex={0}><table><caption>{output.title??'ตัวอย่างผลลัพธ์จาก students.csv'}</caption><thead><tr>{output.columns.map((c,i)=><th key={i} scope="col">{c}</th>)}</tr></thead><tbody>{output.rows.map((row,i)=><tr key={i}>{row.map((value,j)=><td key={j}>{value}</td>)}</tr>)}</tbody></table></div>:<><p className="output-caption">{output.title??'ตัวอย่างผลลัพธ์จาก students.csv'}</p><pre tabIndex={0}>{output.text}</pre></>}
  {output.note&&<p className="fine-print">{output.note}</p>}
 </section>;
}
function LessonDownloads({files}){
 if(!files?.length)return null;
 return <div className="lesson-downloads">{files.map(file=><a className="resource-file" key={file.url} href={file.url} download><Download size={18}/><span>{file.label}</span></a>)}</div>;
}
function InteractiveContentSlide({slide,doneMap,onToggleDone}){
 const isExercise=slide.id==='w1-exercise-1-0';
 const[activeEx,setActiveEx]=useState(1);
 const[activeCard,setActiveCard]=useState(0);
 if(isExercise&&slide.items?.length>1){
  const intro=slide.items[0];
  const questions=slide.items.slice(1);
  const currentText=questions[activeEx-1]??questions[0];
  const doneKey=`w1ex-${activeEx}`;
  const isDone=Boolean(doneMap?.[doneKey]);
  const completedCount=questions.filter((_,idx)=>doneMap?.[`w1ex-${idx+1}`]).length;
  return <>
   <h1>{slide.title}</h1>
   <div className="exercise-header-bar"><p className="demo-caption">{intro}</p><span className="progress-pill">ความคืบหน้า: {completedCount}/{questions.length} ข้อ</span></div>
   <div className="interactive-question-cards five-cols">
    {questions.map((qText,idx)=>{
     const qNum=idx+1;
     const checked=Boolean(doneMap?.[`w1ex-${qNum}`]);
     return <button key={qNum} type="button" className={`q-card ${activeEx===qNum?'selected':''} ${checked?'is-done':''}`} onClick={()=>setActiveEx(qNum)} aria-pressed={activeEx===qNum}>
      <div className="q-card-top"><span className="q-badge">ข้อที่ {qNum} (2 คะแนน)</span>{checked?<CheckCircle2 size={18} className="done-icon"/>:<Circle size={18} className="todo-icon"/>}</div>
      <strong>ข้อที่ {qNum}</strong>
     </button>;
    })}
   </div>
   <div className="fn-detail" aria-live="polite">
    <div className="fn-detail-head"><h3>โจทย์ข้อที่ {activeEx}</h3><div className="fn-detail-actions">{onToggleDone&&<button type="button" className={'check-done-btn '+(isDone?'is-done':'')} onClick={()=>onToggleDone(doneKey)}>{isDone?<CheckCircle2 size={16}/>:<Circle size={16}/>}{isDone?'สถานะ: ดำเนินการเสร็จแล้ว':'บันทึกว่าดำเนินการเสร็จแล้ว'}</button>}</div></div>
    <p className="concept-body">{currentText}</p>
   </div>
   <LessonDownloads files={slide.downloads}/>
  </>;
 }
 return <>
  <h1>{slide.title}</h1>
  <div className="interactive-topic-grid">
   {slide.items.map((item,i)=>{
    const colonIdx=item.indexOf(':');
    const hasHeading=colonIdx>0&&colonIdx<56;
    const heading=hasHeading?item.slice(0,colonIdx):null;
    const body=hasHeading?item.slice(colonIdx+1).trim():item;
    return <div key={i} className={'topic-card '+(activeCard===i?'is-focused':'')} onClick={()=>setActiveCard(i)} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==='Enter'||e.key===' ')setActiveCard(i)}}>
     {heading?(
      <>
       <div className="topic-card-head"><span className="topic-num">{i+1}</span><strong>{heading}</strong></div>
       <p>{body}</p>
      </>
     ):(
      <div className="topic-card-head"><span className="topic-num">{i+1}</span><p style={{margin:0}}>{body}</p></div>
     )}
    </div>;
   })}
  </div>
  <LessonDownloads files={slide.downloads}/>
  <LessonOutput output={slide.output}/>
  {slide.animation&&<StepMotion config={slide.animation}/>}
 </>;
}
function InteractiveStepStudio({slide,pairSlide,onSwitchTab,doneMap,onToggleDone}){
 const isCheckView=slide.type==='guided-check';
 const writeSlide=isCheckView?(pairSlide??slide):slide;
 const checkSlide=isCheckView?slide:pairSlide;
 const[activePart,setActivePart]=useState(0);
 const stepKey=`step-${writeSlide.id}`;
 const isDone=Boolean(doneMap?.[stepKey]);
 useEffect(()=>setActivePart(0),[writeSlide.id]);
 return <>
  <h1>{writeSlide.title}</h1>
  <div className="step-studio">
   <div className="step-studio-top">
    <div className="step-badge-row">
     <span className="step-pill"><Sparkles size={14}/> ขั้นตอนที่ {slide.step}</span>
     {checkSlide&&<div className="studio-view-tabs" role="tablist" aria-label="สลับมุมมองคำสั่งและผลลัพธ์">
      <button type="button" role="tab" aria-selected={!isCheckView} className={!isCheckView?'active':''} onClick={()=>onSwitchTab('write')}><Code2 size={16}/> 1. คำสั่งและคำอธิบาย</button>
      <button type="button" role="tab" aria-selected={isCheckView} className={isCheckView?'active':''} onClick={()=>onSwitchTab('check')}><Eye size={16}/> 2. ผลลัพธ์จากการรันคำสั่ง</button>
     </div>}
     {onToggleDone&&<button type="button" className={'check-done-btn '+(isDone?'is-done':'')} onClick={()=>onToggleDone(stepKey)}>{isDone?<CheckCircle2 size={16}/>:<Circle size={16}/>}{isDone?'สถานะ: ดำเนินการเสร็จแล้ว':'บันทึกว่าดำเนินการเสร็จแล้ว'}</button>}
    </div>
   </div>

   {!isCheckView?(
    <div className="studio-workspace">
     <div className="studio-main-col">
      <div className="studio-instruction-banner">
       <div><strong>การปฏิบัติ:</strong> {writeSlide.instruction}</div>
       <span className="run-badge">{writeSlide.run}</span>
      </div>
      <Code code={writeSlide.code}/>
      {writeSlide.parts?.length>0&&(
       <section className="interactive-parts-box">
        <div className="parts-header"><h2><Compass size={18}/> คลิกเลือกส่วนประกอบของคำสั่งเพื่อดูคำอธิบาย</h2><span>{writeSlide.parts.length} ส่วนประกอบ</span></div>
        <div className="parts-token-pills">
         {writeSlide.parts.map((part,i)=>(
          <button key={part.token} type="button" className={activePart===i?'selected':''} onClick={()=>setActivePart(i)}>
           <code>{part.token}</code>
          </button>
         ))}
        </div>
        <div className="parts-meaning-card">
         <code>{writeSlide.parts[activePart]?.token}</code>
         <p>{writeSlide.parts[activePart]?.meaning}</p>
        </div>
        <dl className="command-breakdown">
         {writeSlide.parts.map((part,i)=>(
          <div key={part.token} className={activePart===i?'is-active-row':''} onClick={()=>setActivePart(i)}>
           <dt><code>{part.token}</code></dt>
           <dd>{part.meaning}</dd>
          </div>
         ))}
        </dl>
       </section>
      )}
     </div>
     <div className="studio-side-col">
      <section className="studio-card meaning-card">
       <h2>หน้าที่ของคำสั่ง</h2>
       <p>{writeSlide.meaning}</p>
      </section>
      {checkSlide&&(
       <div className="studio-next-prompt">
        <p>เมื่อพิมพ์คำสั่งในโปรแกรม Google Colab และกดปุ่ม <code>Shift + Enter</code> เรียบร้อยแล้ว สามารถคลิกดูผลลัพธ์เพื่อเปรียบเทียบได้ทันที</p>
        <button type="button" className="primary-switch-btn" onClick={()=>onSwitchTab('check')}>
         <Eye size={18}/> ดูผลลัพธ์และคำอธิบายของขั้นตอนที่ {slide.step} <ArrowRight size={16}/>
        </button>
       </div>
      )}
      {writeSlide.completeCode&&(
       <details className="complete-command">
        <summary>แสดงคำสั่งทั้งหมดตั้งแต่ขั้นตอนที่ 1 ถึงขั้นตอนปัจจุบัน</summary>
        <Code code={writeSlide.completeCode}/>
       </details>
      )}
     </div>
    </div>
   ):(
    <div className="studio-workspace">
     <div className="studio-main-col">
      {slide.code&&<div className="checked-command-bar"><span>คำสั่งที่ใช้:</span><code>{slide.code}</code></div>}
      <LessonOutput output={slide.output}/>
      <LessonDownloads files={slide.downloads}/>
     </div>
     <div className="studio-side-col">
      <section className="studio-card result-card">
       <h2>คำอธิบายผลลัพธ์</h2>
       <p>{slide.interpretation??slide.expected}</p>
      </section>
      <section className="studio-card caution-card">
       <h2>ข้อควรระวังในการเขียนคำสั่ง</h2>
       <p>{slide.mistake}</p>
      </section>
      <section className="studio-card checkpoint-card">
       <h2>ประเด็นตรวจสอบความถูกต้อง</h2>
       <p>{slide.checkpoint??'เปรียบเทียบผลลัพธ์ในไฟล์ Notebook กับตัวอย่างด้านซ้ายมือ หากผลลัพธ์ยังไม่ตรงกัน ให้กลับไปตรวจสอบการสะกดคำสั่งอีกครั้ง'}</p>
      </section>
      <button type="button" className="secondary-switch-btn" onClick={()=>onSwitchTab('write')}>
       <ChevronLeft size={16}/> กลับไปดูคำสั่งและคำอธิบายของขั้นตอนที่ {slide.step}
      </button>
     </div>
    </div>
   )}
  </div>
 </>;
}
function Slide({slide,pairSlide,onSwitchTab,onJumpStep,doneMap,onToggleDone}){
 switch(slide.type){
 case 'cover':return <div className="cover-slide"><BookOpen size={42} strokeWidth={1.4}/><h1>{slide.title}</h1><p className="cover-subtitle">{slide.subtitle}</p><p>{slide.body}</p></div>;
 case 'content':case 'summary':return <InteractiveContentSlide slide={slide} doneMap={doneMap} onToggleDone={onToggleDone}/>;
 case 'concept':return <><h1>{slide.title}</h1><p className="concept-body">{slide.body}</p><div className="think-prompt"><h2>คำถามชวนคิดก่อนลงมือปฏิบัติ</h2><p>{slide.question}</p></div></>;
 case 'command':return <><h1>{slide.title}</h1><Code code={slide.command}/><div className="syntax-parts">{slide.parts.map(p=><div key={p.token}><code>{p.token}</code><p>{p.meaning}</p></div>)}</div><div className="think-prompt"><h2>ข้อควรระวังก่อนรันคำสั่ง</h2><p>{slide.caution}</p></div></>;
 case 'guided':case 'guided-check':return <InteractiveStepStudio slide={slide} pairSlide={pairSlide} onSwitchTab={onSwitchTab} doneMap={doneMap} onToggleDone={onToggleDone}/>;
 case 'code':return <><h1>{slide.title}</h1><p>อัปโหลดไฟล์ {slide.files.join(', ')||'ข้อมูลของกลุ่ม'} เข้าสู่โปรแกรม Google Colab แล้วรันคำสั่งตามลำดับ</p><Code code={slide.code}/><p className="fine-print">ตัวอย่างนี้ใช้สำหรับฝึกปฏิบัติ ผู้เรียนสามารถปรับเงื่อนไขให้สอดคล้องกับข้อมูลของตนเองได้</p></>;
 case 'lab':return <><h1>{slide.title}</h1><p className="lab-task">{slide.task}</p><h2>ผลงานที่ต้องส่ง</h2><p>{slide.deliverable}</p><div className="table-scroll"><table><thead><tr><th>เกณฑ์การประเมิน</th><th>คะแนน</th></tr></thead><tbody>{slide.rubric.map(([label,score])=><tr key={label}><td>{label}</td><td>{score}</td></tr>)}</tbody></table></div></>;
 case 'pipeline':return <><h1>{slide.title}</h1><Pipeline/></>;
 case 'function-explorer':return <><h1>{slide.title}</h1><FunctionExplorerDemo onJumpStep={onJumpStep}/></>;
 case 'warmup-drill':return <><h1>{slide.title}</h1><WarmupDrillDemo doneMap={doneMap} onToggleDone={onToggleDone}/></>;
 case 'w2-etl-theory':return <><h1>{slide.title}</h1><W2EtlTheoryDemo/></>;
 case 'w2-etl-explorer':return <><h1>{slide.title}</h1><W2EtlExplorerDemo onJumpStep={onJumpStep}/></>;
 case 'w2-closing-lab':return <><h1>{slide.title}</h1><W2ClosingLabDemo doneMap={doneMap} onToggleDone={onToggleDone}/></>;
 case 'quality':return <><h1>{slide.title}</h1><QualityDemo/></>;
 case 'merge':return <><h1>{slide.title}</h1><MergeDemo/></>;
 case 'forecast':return <><h1>{slide.title}</h1><ForecastDemo/></>;
 case 'chart':return <><h1>{slide.title}</h1><ChartDemo/></>;
 case 'dashboard':return <><h1>{slide.title}</h1><p>ผลลัพธ์จากไฟล์ Notebook สัปดาห์ที่ 12 · เลือกเงื่อนไขบนตัวกรองข้อมูลเพื่อตรวจสอบการแสดงผล</p><iframe title="ตัวอย่าง Dashboard ร้านเครื่องดื่มพร้อมตัวกรอง" className="dashboard-frame" src="ชุดเรียน/ตัวอย่าง/dashboard.html"/><a href="ชุดเรียน/ตัวอย่าง/dashboard.html" target="_blank" rel="noreferrer">เปิด Dashboard ในหน้าต่างใหม่</a></>;
 default:return <p>ไม่พบเนื้อหา กรุณาเลือกหัวข้อจากสารบัญด้านซ้าย</p>;
 }
}
function buildSessionModules(slides,weekNum,dayNum){
 if(weekNum===2&&dayNum===0){
  return [
   {id:'prep',label:'ส่วนที่ 1: เตรียมความพร้อมและทบทวนก่อนเรียน',sub:'จุดประสงค์ ไฟล์ข้อมูล และแบบฝึกหัดทบทวน 9 ข้อ',match:(_,s)=>['w2-goals','w2-files','w2-data','w2-procedure','w2-warmup'].includes(s.id)},
   {id:'concept',label:'ส่วนที่ 2: ทฤษฎีและภาพรวมคำสั่ง ETL',sub:'ความหมาย ความสำคัญ ปัญหาข้อมูล 4 รูปแบบ และสรุปคำสั่ง 10 ขั้นตอน',match:(_,s)=>s.id.startsWith('w2-concept-0-')||['w2-etl-theory','w2-etl-explorer'].includes(s.id)},
   {id:'practice',label:'ส่วนที่ 3: ฝึกปฏิบัติเขียนคำสั่ง (ขั้นตอนที่ 1–10)',sub:'เขียนคำสั่งและตรวจสอบผลลัพธ์ทีละขั้นตอน',match:(_,s)=>s.type==='guided'||s.type==='guided-check'},
   {id:'lab',label:'ส่วนที่ 4: แบบฝึกหัดท้ายคาบเรียน (10 คะแนน)',sub:'ทำแบบฝึกหัดรายบุคคล 5 ข้อ และบันทึกไฟล์ส่งงาน',match:(_,s)=>['w2-closing-lab','w2-exercise-0-1'].includes(s.id)}
  ].map(m=>{
   const indices=slides.map((s,i)=>m.match(i,s)?i:-1).filter(i=>i!==-1);
   return {...m,indices,firstIndex:indices[0]??0};
  }).filter(m=>m.indices.length>0);
 }
 if(weekNum===1&&dayNum===1){
  return [
   {id:'prep',label:'ส่วนที่ 1: เตรียมความพร้อมและภาพรวมคำสั่ง',sub:'ดาวน์โหลดไฟล์ข้อมูลและดูสรุปคำสั่ง 9 ขั้นตอน',match:(_,s)=>['w1-tuesday','w1-concept-1-0','w1-concept-1-1','w1-function-explorer'].includes(s.id)},
   {id:'practice',label:'ส่วนที่ 2: ฝึกปฏิบัติเขียนคำสั่ง (ขั้นตอนที่ 1–9)',sub:'เขียนคำสั่งและตรวจสอบผลลัพธ์ทีละขั้นตอน',match:(_,s)=>s.type==='guided'||s.type==='guided-check'},
   {id:'lab',label:'ส่วนที่ 3: แบบฝึกหัดท้ายคาบเรียนและสรุปบทเรียน',sub:'แบบฝึกหัดรายบุคคล 5 ข้อ (30 นาที)',match:(_,s)=>['w1-exercise-1-0','w1-exercise-1-1','w1-summary'].includes(s.id)}
  ].map(m=>{
   const indices=slides.map((s,i)=>m.match(i,s)?i:-1).filter(i=>i!==-1);
   return {...m,indices,firstIndex:indices[0]??0};
  }).filter(m=>m.indices.length>0);
 }
 return [
  {id:'overview',label:'ส่วนที่ 1: แนะนำรายวิชาและจุดประสงค์รายวิชา',sub:'ความสำคัญ จุดประสงค์ และสมรรถนะรายวิชา',match:(i)=>i<=2},
  {id:'pipeline',label:'ส่วนที่ 2: กระบวนการวิเคราะห์ข้อมูล 4 ขั้นตอน',sub:'การนำเข้าข้อมูล การจัดเตรียมข้อมูล การวิเคราะห์ และการนำเสนอ',match:(i)=>i>=3&&i<=7},
  {id:'tools',label:'ส่วนที่ 3: เครื่องมือที่ใช้และการเริ่มต้นใช้งาน',sub:'การใช้งานโปรแกรม Google Colab ภาษา Python และไลบรารี pandas',match:(i)=>i>=8}
 ].map(m=>{
  const indices=slides.map((s,i)=>m.match(i,s)?i:-1).filter(i=>i!==-1);
  return {...m,indices,firstIndex:indices[0]??0};
 }).filter(m=>m.indices.length>0);
}
export default function App(){
 const[weekIndex,setWeekIndex]=useState(1);const[day,setDay]=useState(0);const[index,setIndex]=useState(0);const[mode,setMode]=useState('slides');const[sidebar,setSidebar]=useState(false);const[full,setFull]=useState(false);const[notice,setNotice]=useState('');
 const[doneMap,setDoneMap]=useState(()=>{try{return JSON.parse(localStorage.getItem('dva_interactive_done')||'{}')}catch{return {}}});
 function toggleDone(key){setDoneMap(prev=>{const next={...prev,[key]:!prev[key]};try{localStorage.setItem('dva_interactive_done',JSON.stringify(next))}catch{}return next})}
 const week=teachingDeck[weekIndex];const session=sessionsFor(week)[day];const slides=session.slides;const slide=slides[index]??slides[0];const lab=labsData.find(l=>l.weekId===week.week);const resource=courseResources[week.week];const preparationOnly=(week.week===8&&day===1)||(week.week===15&&day===0);
 const modules=useMemo(()=>buildSessionModules(slides,week.week,day),[slides,week.week,day]);
 const activeModule=modules.find(m=>m.indices.includes(index))??modules[0];
 const guidedSteps=useMemo(()=>{
  const map=new Map();
  slides.forEach((s,idx)=>{
   if((s.type==='guided'||s.type==='guided-check')&&s.step!=null){
    if(!map.has(s.step))map.set(s.step,{step:s.step,title:s.title,writeIdx:idx,checkIdx:null,writeId:s.id});
    const entry=map.get(s.step);
    if(s.type==='guided'){entry.writeIdx=idx;entry.title=s.title;entry.writeId=s.id;}
    if(s.type==='guided-check'){entry.checkIdx=idx;}
   }
  });
  return Array.from(map.values());
 },[slides]);
 const pairSlide=useMemo(()=>{
  if(slide.type==='guided'){const st=guidedSteps.find(g=>g.step===slide.step);return st?.checkIdx!=null?slides[st.checkIdx]:null;}
  if(slide.type==='guided-check'){const st=guidedSteps.find(g=>g.step===slide.step);return st?.writeIdx!=null?slides[st.writeIdx]:null;}
  return null;
 },[slide,guidedSteps,slides]);
 function handleSwitchStudioTab(target){
  const st=guidedSteps.find(g=>g.step===slide.step);
  if(!st)return;
  if(target==='write'&&st.writeIdx!=null)setIndex(st.writeIdx);
  if(target==='check'&&st.checkIdx!=null)setIndex(st.checkIdx);
 }
 function jumpToStep(stepNum){
  const st=guidedSteps.find(g=>g.step===stepNum);
  if(st?.writeIdx!=null){setIndex(st.writeIdx);setMode('slides');}
 }
 useEffect(()=>{document.getElementById('lesson-content')?.scrollTo({top:0})},[weekIndex,day,index,mode]);
 useEffect(()=>{if(week.week===1&&mode==='lab')setMode('slides')},[week.week,mode]);
 const go=(delta)=>setIndex(i=>Math.max(0,Math.min(slides.length-1,i+delta)));
 function selectSession(i,d){setWeekIndex(i);setDay(d);setIndex(0);setMode('slides');setSidebar(false)}
 async function toggleFull(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{setNotice('เบราว์เซอร์นี้ไม่รองรับการแสดงผลเต็มหน้าจอ สามารถปรับขยายขนาดหน้าต่างเบราว์เซอร์แทนได้')}}
 useEffect(()=>{function change(){setFull(Boolean(document.fullscreenElement))}document.addEventListener('fullscreenchange',change);return()=>document.removeEventListener('fullscreenchange',change)},[]);
 useEffect(()=>{function keys(e){if(e.target.closest('input, textarea, button, a, select, [contenteditable="true"]'))return;if(e.key==='Escape')setSidebar(false);if(mode==='slides'&&['ArrowRight','ArrowLeft',' ','PageDown','PageUp'].includes(e.key)){e.preventDefault();go(['ArrowRight',' ','PageDown'].includes(e.key)?1:-1)}if(e.key.toLowerCase()==='f')toggleFull()}window.addEventListener('keydown',keys);return()=>window.removeEventListener('keydown',keys)},[weekIndex,day,mode,slides.length]);
 const isPracticeSlide=slide.type==='guided'||slide.type==='guided-check';
 return <div className="teaching-app"><a className="skip-link" href="#lesson-content">ข้ามไปยังเนื้อหาบทเรียน</a><button className="mobile-menu icon-button" onClick={()=>setSidebar(true)} aria-label="เปิดสารบัญบทเรียน"><Menu/></button>{sidebar&&<button className="sidebar-backdrop" aria-label="ปิดสารบัญ" onClick={()=>setSidebar(false)}/>}
 <aside className={'lesson-sidebar '+(sidebar?'open':'')} aria-label="สารบัญบทเรียน"><div className="sidebar-brand"><BookOpen size={29}/><div><strong>รหัสวิชา 31901-2012</strong><span>การวิเคราะห์และนำเสนอข้อมูล</span></div><button className="sidebar-close icon-button" onClick={()=>setSidebar(false)} aria-label="ปิดสารบัญ"><X size={18}/></button></div><nav>{Object.entries(unitNames).map(([unit,name])=><details key={unit} open={week.unit===Number(unit)}><summary>หน่วยที่ {unit}: {name}</summary>{teachingDeck.map((w,i)=>w.unit===Number(unit)&&<details className="week-group" key={w.week} open={i===weekIndex}><summary className={i===weekIndex?'active':''}><span>สัปดาห์ที่ {w.week}</span><strong>{w.title}</strong></summary><div className="day-links">{sessionsFor(w).filter(d=>!(w.week===2&&d.day===1)).map(d=><button key={d.day} className={'day-button '+(i===weekIndex&&day===d.day?'active':'')} aria-label={`สัปดาห์ที่ ${w.week} ${d.label}: ${d.title}`} onClick={()=>selectSession(i,d.day)} aria-current={i===weekIndex&&day===d.day?'page':undefined}><strong>{d.label} · {d.periods} ชั่วโมง</strong><span>{d.title}</span></button>)}</div></details>)}</details>)}</nav><div className="sidebar-progress">สัปดาห์ที่ {week.week} · {session.label} · หัวข้อที่ {index+1} จาก {slides.length}<progress value={index+1} max={slides.length}/></div></aside>
 <main className="lesson-main"><header className="lesson-header"><div className="header-title"><span>หน่วยที่ {week.unit} · สัปดาห์ที่ {week.week} · {session.label}</span><strong>{week.title}</strong></div><div className="header-controls"><div className="mode-Seg"><button onClick={()=>setMode('slides')} className={mode==='slides'?'active':''} aria-pressed={mode==='slides'}><Layers size={15}/> เนื้อหาบทเรียนและฝึกปฏิบัติ</button><button onClick={()=>setMode('resources')} className={mode==='resources'?'active':''} aria-pressed={mode==='resources'}><Download size={15}/> เอกสารและไฟล์ประกอบการเรียน</button></div><button className="icon-button" onClick={toggleFull} aria-label={full?'ออกจากโหมดเต็มหน้าจอ':'แสดงผลเต็มหน้าจอ'}>{full?<Minimize/>:<Maximize/>}</button></div></header>
 {mode==='slides'&&(
  <div className="interactive-module-bar" aria-label="ส่วนของเนื้อหาในคาบเรียน">
   <div className="module-tabs">
    {modules.map(m=>(
     <button key={m.id} type="button" className={'module-tab '+(activeModule?.id===m.id?'active':'')} onClick={()=>setIndex(m.firstIndex)}>
      <strong>{m.label}</strong>
      <small>{m.sub}</small>
     </button>
    ))}
   </div>
   {!isPracticeSlide&&activeModule?.indices.length>1&&(
    <div className="subtopic-pills" aria-label="หัวข้อย่อยในส่วนนี้">
     {activeModule.indices.map((sIdx,pos)=>{
      const s=slides[sIdx];
      return <button key={s.id} type="button" className={'subtopic-pill '+(index===sIdx?'active':'')} onClick={()=>setIndex(sIdx)}>
       <span>{pos+1}. {s.title}</span>
      </button>;
     })}
    </div>
   )}
   {isPracticeSlide&&guidedSteps.length>0&&(
    <div className="step-Interactive-strip" aria-label="ตัวเลือกขั้นตอนการฝึกปฏิบัติ">
     <span className="strip-label">เลือกขั้นตอนการฝึกปฏิบัติ:</span>
     <div className="step-Direct-buttons">
      {guidedSteps.map(g=>{
       const active=slide.step===g.step;
       const done=Boolean(doneMap[`step-${g.writeId}`]);
       return <button key={g.step} type="button" className={`step-num-btn ${active?'active':''} ${done?'is-done':''}`} onClick={()=>setIndex(g.writeIdx)} title={g.title}>
        {done&&<Check size={12}/>} ขั้นตอนที่ {g.step}
       </button>;
      })}
     </div>
    </div>
   )}
  </div>
 )}
 {notice&&<p role="status" className="notice">{notice}<button onClick={()=>setNotice('')} aria-label="ปิดข้อความ"><X size={16}/></button></p>}
 <div className="lesson-scroll" id="lesson-content" tabIndex={-1}>
 {week.week===8&&day===1&&<p className="session-note">คาบเรียนนี้ใช้ผลการประเมินเดิมเพื่อให้ข้อเสนอแนะและฝึกซ่อมเสริม โดยไม่มีการสอบหรือเก็บคะแนนซ้ำ</p>}
 {week.week===15&&day===0&&<p className="session-note">คาบเรียนนี้เป็นการทบทวนเนื้อหาและตรวจสอบความพร้อม ส่วนการสอบปลายภาค (120 นาที) จะจัดสอบในวันอังคาร</p>}
 {mode==='slides'&&<article className={'slide-paper '+(slide.type==='cover'?'is-cover':isPracticeSlide?'is-studio':'')} key={slide.id}><Slide slide={slide} pairSlide={pairSlide} onSwitchTab={handleSwitchStudioTab} onJumpStep={jumpToStep} doneMap={doneMap} onToggleDone={toggleDone}/></article>}
 {mode==='lab'&&week.week===1&&<article className="slide-paper"><h1>การฝึกปฏิบัติประจำสัปดาห์</h1><p>เลือกหัวข้อเนื้อหาบทเรียนด้านบนเพื่อพิมพ์คำสั่งตามลำดับขั้นตอน และบันทึกไฟล์ Notebook สำหรับส่งงาน</p></article>}
 {mode==='lab'&&preparationOnly&&<article className="slide-paper"><h1>{session.title}</h1><p>{session.allocation}</p><ul className="teaching-list">{(week.week===8?['ทบทวนผลการประเมินและคำอธิบายรายบุคคลตามข้อเสนอแนะของผู้สอน','ฝึกปฏิบัติเพิ่มเติมเฉพาะประเด็นที่ยังไม่ผ่านเกณฑ์ พร้อมอธิบายหลักการ','บันทึกสิ่งที่ปรับปรุงและส่งหลักฐานการซ่อมเสริมตามที่ผู้สอนกำหนด']:['ทบทวนกระบวนการวิเคราะห์ข้อมูลและเลือกอธิบายหลักฐานจากโครงงาน','ตรวจสอบไฟล์ Notebook แฟ้มสะสมผลงาน และเวลาเรียนร่วมกับผู้สอน','เตรียมความพร้อมสำหรับการสอบปลายภาครายบุคคลในวันอังคาร (เวลา 120 นาที)']).map(x=><li key={x}>{x}</li>)}</ul><p>กิจกรรมในคาบเรียนนี้ไม่มีการคิดคะแนนใบงานเพิ่มเติม</p></article>}
 {mode==='lab'&&[8,14,15].includes(week.week)&&!preparationOnly&&<article className="slide-paper"><h1>{session.title}</h1><p>{session.allocation}</p><p>{resource.assessment}</p><h2>ขั้นตอนการเตรียมความพร้อมและการปฏิบัติ</h2><ul className="teaching-list">{(week.week===8?['ทบทวนเนื้อหาจากไฟล์ฝึกปฏิบัติและไฟล์ Notebook ที่เรียนก่อนเริ่มสอบ','ทำข้อสอบวัดผลกลางภาครายบุคคลตามฉบับที่ผู้สอนกำหนด ใช้เวลา 120 นาที','ส่งไฟล์หลักฐานตามคำชี้แจง และรับฟังข้อเสนอแนะในวันอังคาร']:week.week===14?['ตรวจสอบไฟล์ข้อมูล ไฟล์ Notebook กระดานสรุปผลข้อมูล (Dashboard) สไลด์นำเสนอ และหน้าที่ของสมาชิกในกลุ่ม','นำเสนอโครงงานกลุ่มละ 12 นาที และตอบคำถาม 5 นาทีตามลำดับที่ผู้สอนกำหนด','อธิบายวิธีการจัดเตรียมข้อมูล การคำนวณตัวชี้วัด และข้อจำกัดของข้อมูลโดยอ้างอิงหลักฐานจากตาราง']:['ทำข้อสอบวัดผลปลายภาครายบุคคล ใช้เวลา 120 นาที','ปฏิบัติตามคำชี้แจงและส่งไฟล์งานตามช่องทางที่ผู้สอนกำหนด','สรุปสิ่งที่ได้เรียนรู้ภายหลังการประเมิน']).map(item=><li key={item}>{item}</li>)}</ul><h2>เกณฑ์การให้คะแนน</h2><table><thead><tr><th scope="col">รายการประเมิน</th><th scope="col">คะแนน</th></tr></thead><tbody>{week.week===8&&<tr><td>แบบทดสอบความรู้</td><td>5</td></tr>}{lab.rubric.map(r=><tr key={r.item}><td>{r.item}</td><td>{r.score}</td></tr>)}</tbody></table><a className="download-action" href={resource.notebook} download><Download size={18}/>ดาวน์โหลดไฟล์ Notebook สัปดาห์ที่ {String(week.week).padStart(2,'0')}</a></article>}
 {mode==='resources'&&<article className="slide-paper"><h1>เอกสารและไฟล์ประกอบการเรียน สัปดาห์ที่ {week.week}</h1><p>{week.week===1?'ดาวน์โหลดไฟล์ข้อมูลและไฟล์ Notebook สำหรับฝึกปฏิบัติเขียนคำสั่งภาษา Python และไลบรารี pandas ตามลำดับขั้นตอน':'ดาวน์โหลดไฟล์ข้อมูลและไฟล์ Notebook เพื่อเปิดใช้งานในโปรแกรม Google Colab และฝึกปฏิบัติเขียนคำสั่งตามลำดับขั้นตอน'}</p><a className="resource-file" href={resource.notebook} download><FileText/>ไฟล์ Notebook สำหรับฝึกปฏิบัติ (W{String(week.week).padStart(2,'0')}.ipynb)<Download size={18}/></a>{resource.files.filter(f=>!f.name.includes('ตัวอย่าง')).map(f=><a className="resource-file" key={f.name} href={f.url} download><FileText/>{f.name}<Download size={18}/></a>)}<a className="resource-file" href="ชุดเรียน/ชุดข้อมูล/พจนานุกรมข้อมูล.md" download><FileText/>เอกสารคำอธิบายชุดข้อมูลและโครงสร้างคอลัมน์ (Data Dictionary)<Download size={18}/></a></article>}
 </div>
 <footer className="lesson-footer"><div className="footer-navigation"><span className="keyboard-hint">คลิกเลือกส่วนของเนื้อหาและขั้นตอนด้านบน หรือใช้ปุ่มลูกศร ← → บนแป้นพิมพ์เพื่อเปลี่ยนหน้า</span><button onClick={()=>go(-1)} disabled={index===0||mode!=='slides'}><ChevronLeft size={18}/>หน้าที่แล้ว</button><label className="slide-jump">หัวข้อที่<select aria-label="เลือกหัวข้อ" value={index} onChange={e=>{setIndex(Number(e.target.value));setMode('slides')}}>{slides.map((s,i)=><option key={s.id} value={i}>{i+1}. {s.title}</option>)}</select></label><button onClick={()=>go(1)} disabled={index===slides.length-1||mode!=='slides'}>หน้าถัดไป<ChevronRight size={18}/></button><button className="icon-button" onClick={()=>setIndex(0)} aria-label="กลับไปยังหัวข้อแรก"><RotateCcw size={17}/></button></div></footer></main></div>
}
