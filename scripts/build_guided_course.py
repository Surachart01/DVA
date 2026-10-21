"""Build synchronized guided lessons and reference outputs from lesson-specs.
Run with a Python runtime containing pandas, openpyxl and plotly.
"""
import argparse, ast, contextlib, io, json, os, shutil, tempfile
from pathlib import Path
parser=argparse.ArgumentParser();parser.add_argument('--extra-package-dir');parser.add_argument('--weeks',nargs='*',type=int);args=parser.parse_args()
if args.extra_package_dir:
 import sys
 sys.path.insert(0,args.extra_package_dir)
import pandas as pd
import plotly.graph_objects as go
project=Path(__file__).resolve().parents[1];root=project.parent
base=root/'ชุดพร้อมสอน_31901-2012';public=project/'public/ชุดเรียน';examples=base/'ตัวอย่างบทเรียน'
examples.mkdir(exist_ok=True)
source=project/'src/teachingDeck.js';deck=json.loads(source.read_text().split('=',1)[1].strip().rstrip(';'))
resources_file=project/'src/courseResources.js';resources=json.loads(resources_file.read_text().split('=',1)[1].strip().rstrip(';'))
special=json.loads((project/'lesson-specs/special-weeks.json').read_text())
report=[]

def md(text):return {'cell_type':'markdown','metadata':{},'source':text.splitlines(keepends=True)}
def cell(code='',count=None,outputs=None):return {'cell_type':'code','metadata':{},'source':code.splitlines(keepends=True),'execution_count':count,'outputs':outputs or []}
def save_nb(path,cells):
 path.parent.mkdir(exist_ok=True,parents=True)
 path.write_text(json.dumps({'cells':cells,'metadata':{'kernelspec':{'display_name':'Python 3','language':'python','name':'python3'},'language_info':{'name':'python'},'colab':{'provenance':[]}},'nbformat':4,'nbformat_minor':5},ensure_ascii=False,indent=2)+'\n')
def scalar(v):
 if v is None:return 'ว่าง'
 try:
  if pd.isna(v):return 'ว่าง'
 except (TypeError,ValueError):pass
 if hasattr(v,'item'):
  try:v=v.item()
  except (ValueError,AttributeError):pass
 if isinstance(v,(str,int,float,bool)):return v
 return str(v)
def output_md(output):
 if output['kind']=='figure':return 'ผลลัพธ์เป็นกราฟแบบโต้ตอบ ตรวจเทียบใน Notebook ตัวอย่าง หรือเปิดไฟล์ `ตัวอย่าง/'+output['url'].rsplit('/',1)[-1]+'` ในชุดเรียนย้อนหลัง\n'
 if output['kind']=='table':
  return '| '+' | '.join(map(str,output['columns']))+' |\n| '+' | '.join(['---']*len(output['columns']))+' |\n'+''.join('| '+' | '.join(str(x).replace('|','\\|') for x in row)+' |\n' for row in output['rows'])
 return '```text\n'+output['text']+'\n```\n'
def downloads(files,week):
 return [{'label':'ดาวน์โหลด '+f,'url':'ชุดเรียน/ชุดข้อมูล/'+f} for f in files]+[{'label':f'Notebook สำหรับเขียนพร้อมผู้สอน W{week:02}','url':f'ชุดเรียน/Notebook_ฝึกพิมพ์/W{week:02}.ipynb'}]
def content(week,id,title,items,day,**extras):return {'id':f'w{week}-{id}','type':'content','title':title,'items':items,'teachingDays':[day],'speakerNotes':'ผู้สอนอธิบายด้วยตัวอย่างจากไฟล์ฝึก ให้ผู้เรียนตรวจสอบก่อนดำเนินการต่อ',**extras}
def shape_summary(files):
 result=[]
 for f in files:
  p=base/'ชุดข้อมูล'/f
  if p.suffix=='.csv':
   df=pd.read_csv(p);result.append(f'{f}: {len(df)} แถว {len(df.columns)} คอลัมน์ — '+', '.join(df.columns))
  elif p.suffix=='.xlsx':
   book=pd.ExcelFile(p)
   for name in book.sheet_names:
    df=pd.read_excel(book,sheet_name=name);result.append(f'{f} / {name}: {len(df)} แถว {len(df.columns)} คอลัมน์ — '+', '.join(df.columns))
 return result

def figure_output(fig,week,i):
 name=f'W{week:02}_ขั้น{i:02}.html';path=examples/name
 fig.write_html(path,include_plotlyjs='directory',config={'responsive':True})
 public_examples=public/'ตัวอย่าง';public_examples.mkdir(parents=True,exist_ok=True)
 shutil.copy2(path,public_examples/name)
 js=examples/'plotly.min.js'
 if js.exists() and not (public_examples/js.name).exists():shutil.copy2(js,public_examples/js.name)
 return {'kind':'figure','title':f'กราฟอ้างอิงจากคำสั่งขั้นที่ {i}','url':'ชุดเรียน/ตัวอย่าง/'+name,'note':'ตัวอย่างนี้สร้างจากไฟล์ฝึกเดียวกัน ตรวจข้อมูลและข้อความบนกราฟเทียบกับ Notebook'}, {'application/vnd.plotly.v1+json':json.loads(fig.to_json()),'text/plain':'กราฟ Plotly จากข้อมูลฝึก','text/html':fig.to_html(full_html=False,include_plotlyjs='cdn',config={'responsive':True})}

def evaluate(code,namespace,week,i):
 tree=ast.parse(code);last=tree.body[-1];printed=io.StringIO();shown=[];value=None
 original_show=go.Figure.show
 go.Figure.show=lambda self,*a,**k:shown.append(go.Figure(self))
 try:
  with contextlib.redirect_stdout(printed):
   if isinstance(last,ast.Expr):
    if len(tree.body)>1:exec(compile(ast.Module(body=tree.body[:-1],type_ignores=[]),'<lesson>','exec'),namespace)
    value=eval(compile(ast.Expression(last.value),'<lesson>','eval'),namespace)
   else:exec(compile(tree,'<lesson>','exec'),namespace)
 finally:go.Figure.show=original_show
 text=printed.getvalue();nb_outputs=[]
 if shown or isinstance(value,go.Figure):
  fig=shown[-1] if shown else value
  preview,data=figure_output(fig,week,i)
  if shown:nb_outputs.append({'output_type':'display_data','metadata':{},'data':data})
  else:nb_outputs.append({'output_type':'execute_result','execution_count':i,'metadata':{},'data':data})
 elif value is not None:
  data={'text/plain':repr(value)}
  if isinstance(value,pd.DataFrame):
   data['text/html']=value._repr_html_();small=value.head(10)
   columns=['ดัชนี']+[str(c) for c in value.columns]
   rows=[[scalar(index),*[scalar(x) for x in row]] for index,row in small.iterrows()]
   preview={'kind':'table','title':'ตัวอย่างผลลัพธ์จากคำสั่งนี้','columns':columns,'rows':rows,'note':f'ผลทั้งหมด {len(value)} แถว {len(value.columns)} คอลัมน์'+(' · แสดงตัวอย่าง 10 แถวแรก' if len(value)>10 else '')+' · ดัชนีด้านซ้ายไม่ใช่คอลัมน์เพิ่มเติมในไฟล์'}
  else:
   display=value.to_string(max_rows=14) if isinstance(value,pd.Series) else repr(value)
   preview={'kind':'text','title':'ตัวอย่างผลลัพธ์จากคำสั่งนี้','text':display}
   if isinstance(value,pd.Series) and len(value)>14:preview['note']=f'แสดงบางรายการจากทั้งหมด {len(value)} รายการเพื่อเปรียบเทียบ'
  nb_outputs.append({'output_type':'execute_result','execution_count':i,'metadata':{},'data':data})
 elif text:
  preview={'kind':'text','title':'ตัวอย่างผลลัพธ์จากคำสั่งนี้','text':text.rstrip()}
 else:
  preview={'kind':'text','title':'ผลลัพธ์เมื่อเซลล์ทำงานเสร็จ','text':'ไม่มีผลลัพธ์แสดงใต้เซลล์ และไม่มีข้อความผิดพลาด'}
 if text:nb_outputs.insert(0,{'output_type':'stream','name':'stdout','text':text})
 return preview,nb_outputs

for spec_file in sorted((project/'lesson-specs').glob('week[0-9][0-9].json')):
 spec=json.loads(spec_file.read_text());week=spec['week']
 if args.weeks and week not in args.weeks:continue
 tag=f'W{week:02}';old=deck[week-1]
 assert week not in (1,8,14,15)
 assert spec['steps'] and all(s['day'] in (0,1) and s['parts'] for s in spec['steps'])
 for f in spec['files']:assert (base/'ชุดข้อมูล'/f).exists(),f
 folder=base/f'เรียนย้อนหลัง_สัปดาห์{week:02}';folder.mkdir(exist_ok=True)
 slides=[content(week,'goals','เป้าหมายการเรียนรู้',spec['goals'],0),content(week,'files','ไฟล์และ Notebook สำหรับฝึกปฏิบัติ',[
  'ผู้สอนและผู้เรียนดาวน์โหลดไฟล์เดียวกันก่อนเริ่มฝึก',
  'เปิด Notebook ใน Google Colab แล้วอัปโหลดข้อมูลผ่านแถบ Files → Upload',
  'ตรวจชื่อไฟล์ และเริ่มเรียกใช้เซลล์จากด้านบนลงด้านล่าง'],0,downloads=downloads(spec['files'],week)),
  content(week,'data','โครงสร้างและความหมายของข้อมูล',shape_summary(spec['files'])+['ใช้พจนานุกรมข้อมูลตรวจความหมาย หน่วย และข้อจำกัดของแต่ละคอลัมน์ก่อนคำนวณ'],0),
  content(week,'procedure','ลำดับการปฏิบัติพร้อมผู้สอน',['อธิบายหน้าที่ → เขียนคำสั่ง → เรียกใช้ → เปรียบเทียบผล → อธิบายความหมาย','ใช้หนึ่งเซลล์ต่อหนึ่งขั้น และตรวจข้อผิดพลาดก่อนเริ่มขั้นถัดไป','คำสั่งกำหนดตัวแปรมักไม่แสดงข้อมูล ให้ตรวจในขั้นแสดงผลที่ตามมา'],0)]
 concepts={day:[content(week,f'concept-{day}-{i}',c['title'],c['items'],day) for i,c in enumerate(spec['concepts']) if c['day']==day] for day in (0,1)}
 slides.extend(concepts[0]);switch=False
 intro=f'# {tag} — {old["title"]}\n\n## เป้าหมาย\n'+''.join('- '+g+'\n' for g in spec['goals'])+'\n## เตรียมไฟล์\n'+''.join('- '+f+'\n' for f in spec['files'])+'\nอัปโหลดไฟล์ผ่าน Files ใน Colab ผู้สอนและผู้เรียนเขียนคำสั่งพร้อมกันทีละขั้น ใช้หนึ่งเซลล์ต่อขั้น และตรวจผลก่อนทำต่อ\n\n'
 intro+='## โครงสร้างข้อมูล\n'+''.join('- '+x+'\n' for x in shape_summary(spec['files']))
 learners=[md(intro)];references=[md(intro)];reader=[intro];teacher=[intro];namespace={};previous=os.getcwd();exports=[]
 with tempfile.TemporaryDirectory(prefix='dva-lessons-') as work:
  workdir=Path(work)
  for f in spec['files']:shutil.copy2(base/'ชุดข้อมูล'/f,workdir/f)
  os.chdir(workdir)
  try:
   for i,s in enumerate(spec['steps'],1):
    if s['day']==1 and not switch:
     slides.append(content(week,'tuesday','การเตรียมก่อนเริ่มวันอังคาร',['เปิด Notebook ที่บันทึกจากวันจันทร์ และตรวจไฟล์ข้อมูลใน Files','หาก Runtime เริ่มใหม่ ให้อัปโหลดข้อมูลและเรียกใช้เซลล์วันจันทร์ตามลำดับ','หากต้องทบทวน ใช้ Notebook ตัวอย่างและหน้าผลลัพธ์ของวันจันทร์ก่อนเริ่มคำสั่งใหม่'],1))
     slides.extend(concepts[1]);switch=True
     learners.append(md('## วันอังคาร\n\nตรวจไฟล์ใน Runtime และเรียกใช้เซลล์วันจันทร์ก่อนเพิ่มคำสั่งใหม่\n'));references.append(md('## วันอังคาร\n'));reader.append('\n# วันอังคาร\n')
    preview,nb_outputs=evaluate(s['code'],namespace,week,i)
    before=set(exports)
    for f in workdir.iterdir():
     if f.is_file() and f.name not in spec['files'] and f.name not in exports:exports.append(f.name)
    created=[f for f in exports if f not in before]
    links=[]
    for f in created:
     copy_name=f'{tag}_{f}' if not f.startswith(tag) else f
     shutil.copy2(workdir/f,examples/copy_name)
     p=public/'ตัวอย่าง'/copy_name;p.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(workdir/f,p)
     links.append({'label':'ดาวน์โหลดไฟล์ตัวอย่าง '+f,'url':'ชุดเรียน/ตัวอย่าง/'+copy_name})
    identifier=f'w{week}-write-{i}'
    write={'id':identifier,'type':'guided','flow':'write-then-check','step':i,'title':f'ขั้นที่ {i}: {s["title"]}','teachingDays':[s['day']],
      'instruction':'ผู้สอนและผู้เรียนเขียนคำสั่งเดียวกันทีละขั้นใน Google Colab','code':s['code'],'meaning':s['meaning'],'parts':s['parts'],
      'teacherAction':'อธิบายหน้าที่และส่วนประกอบ จากนั้นเขียนคำสั่งให้ผู้เรียนปฏิบัติพร้อมกัน',
      'studentAction':'เขียนคำสั่งในเซลล์ของตนเอง เรียกใช้ และตรวจผลในหน้าถัดไป','run':'เขียนลงเซลล์โค้ดใหม่ แล้วกด Shift + Enter',
      'speakerNotes':'สาธิตและอธิบายส่วนประกอบทีละรายการ รอให้ผู้เรียนเขียนและตรวจผลก่อนเริ่มคำสั่งถัดไป'}
    check={'id':identifier+'-result','type':'guided-check','step':i,'title':f'ขั้นที่ {i}: ผลลัพธ์และการแปลความหมาย','teachingDays':[s['day']],
      'code':s['code'],'output':preview,'expected':s['interpretation'],'interpretation':s['interpretation'],'mistake':s['mistake'],'checkpoint':s['checkpoint'],
      'speakerNotes':'เปรียบเทียบผลจากไฟล์เดียวกัน ให้ผู้เรียนอธิบายความหมายโดยใช้หน่วยและข้อจำกัด ตรวจและช่วยแก้ก่อนดำเนินการต่อ'}
    if links:check['downloads']=links
    slides.extend([write,check])
    description=f'## ขั้นที่ {i}: {s["title"]}\n\n{s["meaning"]}\n\n```python\n{s["code"]}\n```\n\n'+''.join(f'- `{p["token"]}`: {p["meaning"]}\n' for p in s['parts'])+'\nเขียนคำสั่งและกด Shift + Enter ก่อนอ่านผลด้านล่าง\n'
    checktext='### การตรวจผล\n\n'+output_md(preview)+'\n'+s['interpretation']+'\n\n**เมื่อเกิดข้อผิดพลาด:** '+s['mistake']+'\n\n**ตรวจความเข้าใจ:** '+s['checkpoint']+'\n'
    learners.extend([md(description),cell(),md(checktext)]);references.extend([md(description),cell(s['code'],i,nb_outputs),md(checktext)])
    reader.extend([description,checktext]);teacher.extend([description,checktext])
   # Validate both filter options against the actual Dashboard data.
   if week==12:
    figure=namespace['fig'];buttons=figure.layout.updatemenus[0].buttons
    assert len(figure.data)==3 and len(buttons)==2
    assert buttons[0].args[0]['value'][0]==4885 and buttons[1].args[0]['value'][0]==1540
    for button in buttons:
     changes=button.args[0]
     assert sum(changes['y'][1])==changes['value'][0]
     assert sum(changes['y'][2])==changes['value'][0]
  finally:os.chdir(previous)
 summary=content(week,'summary','สรุปและตรวจสอบความเข้าใจ',spec['goals']+['อธิบายหน้าที่ของคำสั่งและผลจากข้อมูลตัวอย่างได้','บันทึก Notebook และใช้ผลลัพธ์อ้างอิงทบทวนตามลำดับ'],1);summary['type']='summary';slides.append(summary)
 old['slides']=slides;old['files']=spec['files']
 end=md('## สรุป\n\nอธิบายคำสั่ง ผลลัพธ์ หน่วย และข้อจำกัด บันทึก Notebook สำหรับทบทวน\n')
 learners.append(end);references.append(end)
 for path in [base/'Notebook_ฝึกพิมพ์'/f'{tag}.ipynb',base/'Notebook_ผู้เรียน'/f'{tag}.ipynb',folder/f'{tag}_ฝึกพิมพ์.ipynb']:save_nb(path,learners)
 for path in [base/'สำหรับครู'/f'{tag}_แนวเฉลย.ipynb',base/'Notebook_ตัวอย่าง'/f'{tag}.ipynb',folder/f'{tag}_ตัวอย่าง.ipynb']:save_nb(path,references)
 for file,body in [(folder/'เริ่มเรียนตรงนี้.md',intro+'\nทำตามสไลด์ทีละขั้น ใช้ Notebook ฝึกพิมพ์และเทียบ Notebook ตัวอย่าง เมื่อ Runtime เริ่มใหม่ให้อัปโหลดข้อมูลและเรียกใช้เซลล์ก่อนหน้าทั้งหมด\n'),(folder/f'บทเรียนสัปดาห์{week:02}_อ่านตามสไลด์.md','\n'.join(reader)),(base/'สำหรับครู'/f'{tag}_ลำดับฝึกเขียน.md','\n'.join(teacher))]:file.write_text(body)
 # Synchronize weekly ready-to-teach plans while retaining the incumbent assessment rubric.
 plan=next((base/'แผนรายสัปดาห์').glob(f'สัปดาห์ที่{week:02}_*.md'))
 original=plan.read_text();marker='## เกณฑ์การประเมินเดิม'
 original=original.split(marker)[-1] if marker in original else original
 rubric_start=original.find('## 8.')
 rubric=original[rubric_start:] if rubric_start>=0 else ''
 plantext=f'# แผนการจัดการเรียนรู้ สัปดาห์ที่ {week}\n\n31901-2012 {old["title"]}\n\nวันจันทร์ 180 นาที: แนวคิดและตัวอย่าง 60 นาที เขียนพร้อมผู้สอน 120 นาที\nวันอังคาร 120 นาที: ทบทวน เขียนคำสั่งต่อ และตรวจผล\n\n## เป้าหมาย\n'+''.join('- '+g+'\n' for g in spec['goals'])+'\n## การเตรียม\n'+''.join('- '+f+'\n' for f in spec['files'])+'\n## วิธีจัดการเรียนรู้\nแจกไฟล์ข้อมูล → อัปโหลดเข้า Colab → อธิบายคำสั่ง → เขียนพร้อมกัน → เรียกใช้ → ตรวจผลและความเข้าใจ ก่อนดำเนินการถัดไป ไม่แยก Lab ในคาบปกติ\n\n'
 for day,label in [(0,'วันจันทร์'),(1,'วันอังคาร')]:
  plantext+='## '+label+'\n'+''.join(f'- {i}. {s["title"]}: `{s["code"]}`\n' for i,s in enumerate(spec['steps'],1) if s['day']==day)
 plantext+='\n## หลักฐานและการประเมินระหว่างเรียน\nNotebook ที่เขียนในคาบ การตรวจผลกับตัวอย่าง และการอธิบายหน้าที่/ข้อจำกัดของคำสั่ง ให้ผลย้อนกลับและทบทวนจุดที่ยังไม่ผ่าน โดยใช้เกณฑ์ประเมินประจำสัปดาห์เดิม\n'
 if rubric:plantext+='\n## เกณฑ์การประเมินเดิม\n'+rubric
 plan.write_text(plantext)
 # Resources link sample solutions for instruction only, not exam solutions.
 resource=resources[str(week)];resource['notebook']=f'ชุดเรียน/Notebook_ฝึกพิมพ์/{tag}.ipynb';resource['practice']=True
 resource['assessment']='ประเมินการปฏิบัติในคาบเรียน 10 คะแนนดิบ × 0.25 = 2.5 คะแนนเก็บ'
 resource['files']=[{'name':f,'url':'ชุดเรียน/ชุดข้อมูล/'+f} for f in spec['files']]+[
  {'name':'Notebook ตัวอย่างพร้อมผลลัพธ์ '+tag,'url':f'ชุดเรียน/Notebook_ตัวอย่าง/{tag}.ipynb'},
  {'name':f'บทเรียนอ่านตามสไลด์ สัปดาห์ {week}','url':f'ชุดเรียน/เรียนย้อนหลัง_สัปดาห์{week:02}/บทเรียนสัปดาห์{week:02}_อ่านตามสไลด์.md'},
  {'name':f'ชุดเรียนย้อนหลัง สัปดาห์ {week} (รวมข้อมูลและ Notebook)','url':f'ชุดเรียน/สัปดาห์{week:02}_เรียนย้อนหลัง.zip'}]
 report.append({'week':week,'commands':len(spec['steps']),'slides':len(slides),'status':'executed','exports':exports})
 print(f'{tag}: {len(spec["steps"])} command cells executed; {len(slides)} slides',flush=True)

w1_spec_file=project/'lesson-specs/week01_tuesday.json'
if w1_spec_file.exists() and (not args.weeks or 1 in args.weeks):
 w1_spec=json.loads(w1_spec_file.read_text());old1=deck[0];folder1=base/'เรียนย้อนหลัง_สัปดาห์01';folder1.mkdir(exist_ok=True)
 monday_slides=[s for s in old1['slides'] if s.get('teachingDays')==[0]]
 tuesday_slides=[content(1,'tuesday','การเตรียมความพร้อมก่อนเริ่มการจัดการเรียนรู้ 2 คาบ (120 นาที)',[
  'ดาวน์โหลดไฟล์ข้อมูล nvc_tech_store.csv และไฟล์ Notebook สำหรับฝึกปฏิบัติจากลิงก์ด้านล่าง',
  'เปิดโปรแกรม Google Colab และอัปโหลดไฟล์ nvc_tech_store.csv ผ่านแถบเครื่องมือ Files → Upload',
  'ช่วงที่ 1 (90 นาที): ปฏิบัติการเขียนคำสั่งพร้อมผู้สอนทีละฟังก์ชัน (ขั้นที่ 1–9) เพื่อทบทวน Get Data และสำรวจคุณภาพข้อมูลเบื้องต้น',
  'ช่วงที่ 2 (30 นาที): ทำแบบฝึกหัดปฏิบัติการท้ายคาบ 5 ข้อ (10 คะแนน) ในส่วนท้ายของไฟล์ Notebook และส่งหลักฐานการเรียนรู้'],1,downloads=[
  {'label':'ดาวน์โหลดไฟล์ข้อมูล nvc_tech_store.csv','url':'ชุดเรียน/ชุดข้อมูล/nvc_tech_store.csv'},
  {'label':'ดาวน์โหลด Notebook สำหรับฝึกปฏิบัติ (9 ขั้นตอน + แบบฝึกหัด 5 ข้อ)','url':'ชุดเรียน/Notebook_ฝึกพิมพ์/W01.ipynb'},
  {'label':'ดาวน์โหลดใบงานแบบฝึกหัดท้ายคาบ 30 นาที (.md)','url':'ชุดเรียน/เรียนย้อนหลัง_สัปดาห์01/แบบฝึกหัดท้ายคาบ_สัปดาห์01_อังคาร.md'}])]
 for idx,c in enumerate(w1_spec['concepts']):
  tuesday_slides.append(content(1,f'concept-1-{idx}',c['title'],c['items'],1))
 tuesday_slides.append({'id':'w1-function-explorer','type':'function-explorer','title':'สารบบคำสั่ง 9 ฟังก์ชัน: ทบทวน Get Data และการสำรวจคุณภาพข้อมูลเบื้องต้น','teachingDays':[1],'speakerNotes':'ผู้สอนใช้หน้านี้แสดงภาพรวมของ 9 ฟังก์ชันที่จะปฏิบัติการในวันนี้ (90 นาที) ก่อนทำแบบฝึกหัดท้ายคาบ (30 นาที)'})
 w1_intro='# W01 วันอังคาร (2 คาบ 120 นาที) — ทบทวนกระบวนการ Get Data และการสำรวจคุณภาพข้อมูลเบื้องต้น (ส่วนที่ 1: ขั้นที่ 1–9 + แบบฝึกหัดท้ายคาบ 30 นาที)\n\n## เป้าหมายการเรียนรู้\n'+''.join('- '+g+'\n' for g in w1_spec['goals'])+'\n## ชุดข้อมูลสำหรับการฝึกปฏิบัติ\n- `nvc_tech_store.csv` (ข้อมูลรายการคำสั่งซื้อร้านอุปกรณ์ไอที NVC Tech Store: 36 แถว 7 คอลัมน์)\n\nอัปโหลดไฟล์ `nvc_tech_store.csv` เข้าสู่ Google Colab ปฏิบัติการเขียนคำสั่งพร้อมผู้สอนทีละขั้นตอน (ขั้นที่ 1–9 ใช้เวลา 90 นาที) และทำแบบฝึกหัดปฏิบัติการท้ายคาบ 5 ข้อ (ใช้เวลา 30 นาที)\n'
 w1_learners=[md(w1_intro)];w1_refs=[md(w1_intro)];w1_reader=[w1_intro];w1_codes=[];w1_ns={};w1_exports=[];prev1=os.getcwd()
 w1_ex_questions=[
  ('ข้อที่ 1 (2 คะแนน): การแสดงข้อมูลตัวอย่างส่วนต้นและส่วนท้ายตาราง','เขียนคำสั่งแสดงข้อมูลตัวอย่าง 8 แถวแรก ด้วย `df.head(8)` และแสดงข้อมูล 3 แถวสุดท้าย ด้วย `df.tail(3)` พร้อมระบุรหัสคำสั่งซื้อ (`order_id`) ของแถวที่ดัชนี 7','df.head(8)\ndf.tail(3)','รหัสคำสั่งซื้อ (order_id) ของแถวที่ดัชนี 7 คือ ORD-107 (เว็บแคม Full HD)'),
  ('ข้อที่ 2 (2 คะแนน): การตรวจสอบชนิดข้อมูลของทุกคอลัมน์','เขียนคำสั่งตรวจสอบชนิดข้อมูลของทุกคอลัมน์ด้วย `df.dtypes` พร้อมอธิบายเหตุผลที่ต้องกำหนดให้คอลัมน์ `customer_phone` มีชนิดข้อมูลเป็น `string`','df.dtypes','ต้องกำหนดให้ customer_phone เป็นชนิดข้อมูลข้อความ (string) เพื่อรักษาเลข 0 นำหน้าหมายเลขโทรศัพท์ และเนื่องจากหมายเลขโทรศัพท์เป็นรหัสอ้างอิงที่ไม่ได้นำไปคำนวณทางคณิตศาสตร์'),
  ('ข้อที่ 3 (2 คะแนน): การนับจำนวนค่าว่างแยกตามรายคอลัมน์','เขียนคำสั่งนับจำนวนค่าว่างรวมของแต่ละคอลัมน์ด้วย `df.isna().sum()` และระบุว่าตารางนี้มีค่าว่างรวมกันทุกคอลัมน์ทั้งหมดกี่จุด','df.isna().sum()','พบค่าว่างในคอลัมน์ customer_phone จำนวน 2 จุด, quantity จำนวน 1 จุด และ total_price จำนวน 2 จุด รวมทั้งตารางมีค่าว่างทั้งหมด 5 จุด'),
  ('ข้อที่ 4 (2 คะแนน): การตรวจสอบค่าสถิติพื้นฐานเพื่อค้นหาค่าผิดปกติ (Outlier)','เขียนคำสั่งคำนวณค่าสถิติพื้นฐานด้วย `df.describe()` และระบุค่าเฉลี่ย (`mean`) ค่าต่ำสุด (`min`) และค่าสูงสุด (`max`) ของคอลัมน์ `total_price`','df.describe()','คอลัมน์ total_price มีค่าเฉลี่ย (mean) เท่ากับ 3,677.94 บาท, ค่าต่ำสุด (min) เท่ากับ 120.00 บาท และค่าสูงสุด (max) เท่ากับ 99,000.00 บาท (ซึ่งเป็นค่าผิดปกติที่ต้องจัดการในสัปดาห์ที่ 2)'),
  ('ข้อที่ 5 (2 คะแนน): การสำรวจความถี่ของสถานะการชำระเงิน','เขียนคำสั่งนับจำนวนความถี่ของสถานะการชำระเงินด้วย `df[\'payment_status\'].value_counts()` และระบุจำนวนรายการของแต่ละสถานะ',"df['payment_status'].value_counts()",'สถานะ ชำระแล้ว มีจำนวน 30 รายการ, รอชำระ มีจำนวน 4 รายการ และ ยกเลิก มีจำนวน 2 รายการ')
 ]
 with tempfile.TemporaryDirectory(prefix='dva-w1-') as work1:
  workdir1=Path(work1)
  for f in w1_spec['files']:shutil.copy2(base/'ชุดข้อมูล'/f,workdir1/f)
  os.chdir(workdir1)
  try:
   for i,s in enumerate(w1_spec['steps'],1):
    preview,nb_outputs=evaluate(s['code'],w1_ns,1,i)
    before=set(w1_exports)
    for f in workdir1.iterdir():
     if f.is_file() and f.name not in w1_spec['files'] and f.name not in w1_exports:w1_exports.append(f.name)
    created=[f for f in w1_exports if f not in before]
    links=[]
    for f in created:
     copy_name=f'W01_{f}' if not f.startswith('W01') else f
     shutil.copy2(workdir1/f,examples/copy_name)
     p=public/'ตัวอย่าง'/copy_name;p.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(workdir1/f,p)
     links.append({'label':'ดาวน์โหลดไฟล์ตัวอย่าง '+f,'url':'ชุดเรียน/ตัวอย่าง/'+copy_name})
    w1_codes.append(s['code']);identifier=f'w1-write-{i}'
    write={'id':identifier,'type':'guided','flow':'write-then-check','step':i,'title':f'ขั้นที่ {i}: {s["title"]}','teachingDays':[1],
     'instruction':'ผู้สอนและผู้เรียนเขียนคำสั่งเดียวกันทีละขั้นใน Google Colab','code':s['code'],'meaning':s['meaning'],'parts':s['parts'],
     'teacherAction':'อธิบายหน้าที่และส่วนประกอบ จากนั้นเขียนคำสั่งให้ผู้เรียนปฏิบัติพร้อมกัน',
     'studentAction':'เขียนคำสั่งในเซลล์ของตนเอง เรียกใช้ และตรวจผลในหน้าถัดไป','run':'เขียนลงเซลล์โค้ดใหม่ แล้วกด Shift + Enter',
     'completeCode':'\n'.join(w1_codes),
     'speakerNotes':'สาธิตและอธิบายส่วนประกอบทีละรายการ รอให้ผู้เรียนเขียนและตรวจผลก่อนเริ่มคำสั่งถัดไป'}
    check={'id':identifier+'-result','type':'guided-check','step':i,'title':f'ขั้นที่ {i}: ผลลัพธ์และการแปลความหมาย','teachingDays':[1],
     'code':s['code'],'output':preview,'expected':s['interpretation'],'interpretation':s['interpretation'],'mistake':s['mistake'],'checkpoint':s['checkpoint'],
     'speakerNotes':'เปรียบเทียบผลจากไฟล์เดียวกัน ให้ผู้เรียนอธิบายความหมายโดยใช้หน่วยและข้อจำกัด ตรวจและช่วยแก้ก่อนดำเนินการต่อ'}
    if links:check['downloads']=links
    tuesday_slides.extend([write,check])
    desc=f'## ขั้นที่ {i}: {s["title"]}\n\n{s["meaning"]}\n\n```python\n{s["code"]}\n```\n\n'+''.join(f'- `{p["token"]}`: {p["meaning"]}\n' for p in s['parts'])+'\nเขียนคำสั่งและกด Shift + Enter ก่อนอ่านผลด้านล่าง\n'
    chk='### การตรวจผล\n\n'+output_md(preview)+'\n'+s['interpretation']+'\n\n**เมื่อเกิดข้อผิดพลาด:** '+s['mistake']+'\n\n**ตรวจความเข้าใจ:** '+s['checkpoint']+'\n'
    w1_learners.extend([md(desc),cell(),md(chk)]);w1_refs.extend([md(desc),cell(s['code'],i,nb_outputs),md(chk)]);w1_reader.extend([desc,chk])
   ex_header='---\n\n# ส่วนที่ 2: แบบฝึกหัดปฏิบัติการท้ายคาบ (เวลา 30 นาที · 10 คะแนน)\n\nคำชี้แจง: ให้ผู้เรียนเขียนคำสั่งภาษา Python ในเซลล์ว่างด้านล่างของแต่ละข้อ และพิมพ์คำตอบสรุปผลลัพธ์จากตารางข้อมูล `df` (`nvc_tech_store.csv`)\n'
   w1_learners.append(md(ex_header));w1_refs.append(md(ex_header));w1_reader.append(ex_header)
   for q_idx,(q_title,q_prompt,q_code,q_ans) in enumerate(w1_ex_questions,1):
    q_preview,q_outputs=evaluate(q_code,w1_ns,1,len(w1_spec['steps'])+q_idx)
    q_md=f'## {q_title}\n\n**โจทย์:** {q_prompt}\n'
    a_student_md='**บันทึกคำตอบของผู้เรียน:** (พิมพ์คำตอบที่อ่านได้จากผลลัพธ์ตรงนี้)\n'
    a_teacher_md=f'### แนวคำตอบและผลลัพธ์ (สำหรับผู้สอน)\n\n'+output_md(q_preview)+f'\n**สรุปคำตอบ:** {q_ans}\n'
    w1_learners.extend([md(q_md),cell(),md(a_student_md)])
    w1_refs.extend([md(q_md),cell(q_code,len(w1_spec['steps'])+q_idx,q_outputs),md(a_teacher_md)])
    w1_reader.append(q_md+'\n'+a_student_md)
  finally:os.chdir(prev1)
 for ex_idx,ex in enumerate(w1_spec.get('exercises',[])):
  ex_slide=content(1,f'exercise-1-{ex_idx}',ex['title'],ex['items'],1,downloads=[
   {'label':'ดาวน์โหลดใบงานแบบฝึกหัดท้ายคาบ 30 นาที (.md)','url':'ชุดเรียน/เรียนย้อนหลัง_สัปดาห์01/แบบฝึกหัดท้ายคาบ_สัปดาห์01_อังคาร.md'},
   {'label':'ดาวน์โหลด Notebook สำหรับทำแบบฝึกหัด (W01.ipynb)','url':'ชุดเรียน/Notebook_ฝึกพิมพ์/W01.ipynb'}] if ex_idx==0 else None)
  tuesday_slides.append(ex_slide)
 w1_summary=content(1,'summary','สรุปผลการเรียนรู้สัปดาห์ที่ 1 และเตรียมเรียนต่อสัปดาห์ที่ 2',w1_spec['goals']+['ทำแบบฝึกหัดปฏิบัติการท้ายคาบ 5 ข้อ (30 นาที) และบันทึกไฟล์ Notebook ส่งเป็นหลักฐานการเรียนรู้','สัปดาห์ที่ 2: เรียนต่อส่วนที่ 2 (ขั้นที่ 10–18) เพื่อคัดกรองและจัดการปัญหาข้อมูลด้วยกระบวนการ ETL'],1);w1_summary['type']='summary';tuesday_slides.append(w1_summary)
 old1['slides']=monday_slides+tuesday_slides;old1['files']=w1_spec['files']
 end1=md('## สรุปและส่งงาน\n\nตรวจสอบว่าประมวลผลครบทั้ง 9 ขั้นตอน และทำแบบฝึกหัดท้ายคาบครบทั้ง 5 ข้อ จากนั้นบันทึกไฟล์ Notebook (`.ipynb`) ส่งตามช่องทางที่ผู้สอนกำหนด\n')
 w1_learners.append(end1);w1_refs.append(end1)
 ex_sheet_student='# ใบงานแบบฝึกหัดปฏิบัติการท้ายคาบ (เวลา 30 นาที · 10 คะแนน)\n**รายวิชา:** 31901-2012 การวิเคราะห์และนำเสนอข้อมูล · **สัปดาห์ที่ 1 วันอังคาร**\n**ชุดข้อมูลที่ใช้:** `nvc_tech_store.csv` (ตารางข้อมูล `df`)\n\n---\n\n'+'\n'.join(f'## {qt}\n- **โจทย์:** {qp}\n- **คำสั่งที่ใช้:** `............................................................`\n- **คำตอบที่อ่านได้จากผลลัพธ์:** `............................................................`\n' for qt,qp,_,_ in w1_ex_questions)
 ex_sheet_teacher='# เฉลยใบงานแบบฝึกหัดปฏิบัติการท้ายคาบ (เวลา 30 นาที · 10 คะแนน)\n**รายวิชา:** 31901-2012 การวิเคราะห์และนำเสนอข้อมูล · **สัปดาห์ที่ 1 วันอังคาร (สำหรับผู้สอน)**\n**ชุดข้อมูลที่ใช้:** `nvc_tech_store.csv` (ตารางข้อมูล `df`)\n\n---\n\n'+'\n'.join(f'## {qt}\n- **โจทย์:** {qp}\n- **คำสั่งเฉลย:**\n```python\n{qc}\n```\n- **แนวคำตอบ (2 คะแนน):** {qa}\n' for qt,qp,qc,qa in w1_ex_questions)
 (folder1/'แบบฝึกหัดท้ายคาบ_สัปดาห์01_อังคาร.md').write_text(ex_sheet_student)
 (base/'สำหรับครู/เฉลยแบบฝึกหัดท้ายคาบ_สัปดาห์01_อังคาร.md').write_text(ex_sheet_teacher)
 for path in [base/'Notebook_ฝึกพิมพ์/W01.ipynb',base/'Notebook_ผู้เรียน/W01.ipynb',folder1/'W01_อังคาร_ฝึกเอง.ipynb']:save_nb(path,w1_learners)
 for path in [base/'สำหรับครู/W01_แนวเฉลย.ipynb',base/'Notebook_ตัวอย่าง/W01.ipynb',folder1/'W01_อังคาร_ตัวอย่าง.ipynb']:save_nb(path,w1_refs)
 (folder1/'บทเรียนสัปดาห์01_อ่านตามสไลด์.md').write_text('\n'.join(w1_reader))
 resources['1']['notebook']='ชุดเรียน/Notebook_ฝึกพิมพ์/W01.ipynb';resources['1']['practice']=True
 resources['1']['assessment']='ปฏิบัติการในคาบเรียน 9 ขั้นตอน (90 นาที) + แบบฝึกหัดท้ายคาบ 5 ข้อ (30 นาที · 10 คะแนนดิบ)'
 resources['1']['files']=[
  {'name':'nvc_tech_store.csv — ชุดข้อมูลฝึกปฏิบัติวันอังคาร (36 แถว 7 คอลัมน์)','url':'ชุดเรียน/ชุดข้อมูล/nvc_tech_store.csv'},
  {'name':'ใบงานแบบฝึกหัดปฏิบัติการท้ายคาบ 30 นาที (5 ข้อ 10 คะแนน)','url':'ชุดเรียน/เรียนย้อนหลัง_สัปดาห์01/แบบฝึกหัดท้ายคาบ_สัปดาห์01_อังคาร.md'},
  {'name':'Notebook วันอังคาร สำหรับฝึกปฏิบัติ (9 ขั้นตอน + แบบฝึกหัด 5 ข้อ)','url':'ชุดเรียน/เรียนย้อนหลัง_สัปดาห์01/W01_อังคาร_ฝึกเอง.ipynb'},
  {'name':'Notebook ตัวอย่างพร้อมผลลัพธ์ วันอังคาร','url':'ชุดเรียน/เรียนย้อนหลัง_สัปดาห์01/W01_อังคาร_ตัวอย่าง.ipynb'},
  {'name':'students.csv — ชุดข้อมูลตัวอย่างวันจันทร์ (30 แถว)','url':'ชุดเรียน/ชุดข้อมูล/students.csv'},
  {'name':'คำอธิบายชุดข้อมูลและคอลัมน์ (พจนานุกรมข้อมูล)','url':'ชุดเรียน/ชุดข้อมูล/พจนานุกรมข้อมูล.md'},
  {'name':'บทเรียนวันอังคาร อ่านตามสไลด์','url':'ชุดเรียน/เรียนย้อนหลัง_สัปดาห์01/บทเรียนสัปดาห์01_อ่านตามสไลด์.md'},
  {'name':'ชุดเรียนย้อนหลังสัปดาห์ 1 (รวมทุกไฟล์).zip','url':'ชุดเรียน/สัปดาห์01_เรียนย้อนหลัง.zip'}
 ]
 print(f'W01: {len(w1_spec["steps"])} command cells executed + 5 exercises; {len(old1["slides"])} slides',flush=True)

for special_week in special:
 week=special_week['week']
 if args.weeks and week not in args.weeks:continue
 deck[week-1]['slides']=special_week['slides']
 folder=base/f'เรียนย้อนหลัง_สัปดาห์{week:02}';folder.mkdir(exist_ok=True)
 text=f'# สัปดาห์ที่ {week} — {deck[week-1]["title"]}\n\n'
 for s in special_week['slides']:text+='## '+('วันจันทร์' if s['teachingDays']==[0] else 'วันอังคาร')+' — '+s['title']+'\n'+''.join('- '+x+'\n' for x in s['items'])+'\n'
 (folder/'เริ่มเรียนตรงนี้.md').write_text(text)
 (folder/f'บทเรียนสัปดาห์{week:02}_อ่านตามสไลด์.md').write_text(text)
 plan=next((base/'แผนรายสัปดาห์').glob(f'สัปดาห์ที่{week:02}_*.md'))
 existing=plan.read_text();tail=existing[existing.find('## 8.'):] if '## 8.' in existing else ''
 plan.write_text(text+'\n## วิธีจัดกิจกรรม\nทบทวนและสาธิตด้วยตัวอย่างเดิมก่อนกิจกรรมประเมิน ไม่เผยแพร่เฉลยข้อสอบแก่ผู้เรียน การสอบและโครงงานใช้คะแนนตามแผนเดิม\n'+tail)
 resource=resources[str(week)];resource['files']=[f for f in resource['files'] if 'ตัวอย่าง' not in f['name']]+[{'name':f'แนวทางเรียน สัปดาห์ {week}','url':f'ชุดเรียน/เรียนย้อนหลัง_สัปดาห์{week:02}/เริ่มเรียนตรงนี้.md'}]
 report.append({'week':week,'commands':0,'slides':len(special_week['slides']),'status':'assessment/project'})
# Preserve week one and add a common example Notebook download without changing its reviewed lessons.
week1_example=base/'เรียนย้อนหลัง_สัปดาห์01/W01_อังคาร_ตัวอย่าง.ipynb';(base/'Notebook_ตัวอย่าง').mkdir(exist_ok=True);shutil.copy2(week1_example,base/'Notebook_ตัวอย่าง/W01.ipynb')
source.write_text('export const teachingDeck = '+json.dumps(deck,ensure_ascii=False,indent=2)+';\n')
resources_file.write_text('export const courseResources = '+json.dumps(resources,ensure_ascii=False,indent=2)+';\n')
report_path=base/'สำหรับครู/ผลตรวจบทเรียน15สัปดาห์.json'
if args.weeks and report_path.exists():
 current=json.loads(report_path.read_text());changed={x['week'] for x in report}
 report=[x for x in current if x['week'] not in changed]+report
report_path.write_text(json.dumps(sorted(report,key=lambda x:x['week']),ensure_ascii=False,indent=2)+'\n')
# Student assets contain no teacher exam solutions.
for sub in ['Notebook_ฝึกพิมพ์','Notebook_ผู้เรียน','Notebook_ตัวอย่าง','แผนรายสัปดาห์']:
 for p in (base/sub).glob('*'):
  if p.is_file():target=public/sub/p.name;target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,target)
for week in range(1,16):
 folder=base/f'เรียนย้อนหลัง_สัปดาห์{week:02}'
 if not folder.exists():continue
 for p in folder.iterdir():
  if p.is_file():target=public/folder.name/p.name;target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,target)
print('Completed course content, notebooks, guides and learner assets.',flush=True)

plan_sync=project/'scripts/sync_guided_plans.py'
if plan_sync.exists():
 import subprocess,sys
 subprocess.run([sys.executable,str(plan_sync)],check=True)
