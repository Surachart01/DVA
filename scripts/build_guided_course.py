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
 return [{'label':'ดาวน์โหลดไฟล์ข้อมูล '+f,'url':'ชุดเรียน/ชุดข้อมูล/'+f} for f in files]+[{'label':f'ดาวน์โหลดไฟล์ Notebook สำหรับฝึกปฏิบัติ (W{week:02}.ipynb)','url':f'ชุดเรียน/Notebook_ฝึกพิมพ์/W{week:02}.ipynb'}]
def content(week,id,title,items,day,**extras):return {'id':f'w{week}-{id}','type':'content','title':title,'items':items,'teachingDays':[day],'speakerNotes':'ผู้สอนอธิบายด้วยตัวอย่างจากไฟล์ฝึก ให้ผู้เรียนตรวจสอบก่อนดำเนินการต่อ',**extras}
def shape_summary(files):
 result=[]
 for f in files:
  p=base/'ชุดข้อมูล'/f
  if p.suffix=='.csv':
   df=pd.read_csv(p);result.append(f'ไฟล์ {f}: จำนวน {len(df)} แถว {len(df.columns)} คอลัมน์ ได้แก่ '+', '.join(df.columns))
  elif p.suffix=='.xlsx':
   book=pd.ExcelFile(p)
   for name in book.sheet_names:
    df=pd.read_excel(book,sheet_name=name);result.append(f'ไฟล์ {f} (ชีต {name}): จำนวน {len(df)} แถว {len(df.columns)} คอลัมน์ ได้แก่ '+', '.join(df.columns))
 return result

def figure_output(fig,week,i):
 name=f'W{week:02}_ขั้น{i:02}.html';path=examples/name
 fig.write_html(path,include_plotlyjs='directory',config={'responsive':True})
 public_examples=public/'ตัวอย่าง';public_examples.mkdir(parents=True,exist_ok=True)
 shutil.copy2(path,public_examples/name)
 js=examples/'plotly.min.js'
 if js.exists() and not (public_examples/js.name).exists():shutil.copy2(js,public_examples/js.name)
 return {'kind':'figure','title':f'แผนภูมิจากคำสั่งขั้นตอนที่ {i}','url':'ชุดเรียน/ตัวอย่าง/'+name,'note':'แผนภูมินี้สร้างจากชุดข้อมูลเดียวกัน สามารถเปรียบเทียบผลลัพธ์กับในไฟล์ Notebook ได้'}, {'application/vnd.plotly.v1+json':json.loads(fig.to_json()),'text/plain':'แผนภูมิ Plotly จากชุดข้อมูลฝึกปฏิบัติ','text/html':fig.to_html(full_html=False,include_plotlyjs='cdn',config={'responsive':True})}

def clean_repr(val):
 if hasattr(val,'item') and not isinstance(val,(pd.Series,pd.DataFrame)):
  try:return repr(val.item())
  except Exception:pass
 if isinstance(val,tuple):
  return '('+', '.join(clean_repr(x) for x in val)+')'
 return repr(val)

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
  data={'text/plain':clean_repr(value)}
  if isinstance(value,pd.DataFrame):
   data['text/html']=value._repr_html_();small=value.head(10)
   columns=['ลำดับแถว']+[str(c) for c in value.columns]
   rows=[[scalar(index),*[scalar(x) for x in row]] for index,row in small.iterrows()]
   preview={'kind':'table','title':'ผลลัพธ์จากการรันคำสั่ง','columns':columns,'rows':rows,'note':f'ตารางข้อมูลมีทั้งหมด {len(value)} แถว {len(value.columns)} คอลัมน์'+(' (แสดงตัวอย่าง 10 แถวแรก)' if len(value)>10 else '')+' · ลำดับแถวด้านซ้ายสุดสร้างโดยโปรแกรม ไม่ใช่คอลัมน์ในไฟล์ข้อมูล'}
  else:
   display=value.to_string(max_rows=14) if isinstance(value,pd.Series) else clean_repr(value)
   preview={'kind':'text','title':'ผลลัพธ์จากการรันคำสั่ง','text':display}
   if isinstance(value,pd.Series) and len(value)>14:preview['note']=f'แสดงตัวอย่างบางส่วนจากข้อมูลทั้งหมด {len(value)} รายการ'
  nb_outputs.append({'output_type':'execute_result','execution_count':i,'metadata':{},'data':data})
 elif text:
  preview={'kind':'text','title':'ผลลัพธ์จากการรันคำสั่ง','text':text.rstrip()}
 else:
  preview={'kind':'text','title':'สถานะการรันคำสั่ง','text':'รันคำสั่งสำเร็จ (ไม่มีข้อความแจ้งข้อผิดพลาด)'}
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
 slides=[content(week,'goals','จุดประสงค์การเรียนรู้ประจำสัปดาห์',spec['goals'],0),content(week,'files','การเตรียมไฟล์ข้อมูลและไฟล์ Notebook สำหรับฝึกปฏิบัติ',[
  'ดาวน์โหลดไฟล์ชุดข้อมูลและไฟล์ Notebook จากลิงก์ด้านล่างเพื่อเตรียมฝึกปฏิบัติ',
  'เปิดไฟล์ Notebook ในโปรแกรม Google Colab จากนั้นอัปโหลดไฟล์ชุดข้อมูลผ่านเมนู Files → Upload',
  'ตรวจสอบชื่อไฟล์ชุดข้อมูลให้ถูกต้อง และรันคำสั่งในเซลล์ตามลำดับตั้งแต่เซลล์แรกเป็นต้นไป'],0,downloads=downloads(spec['files'],week)),
  content(week,'data','ลักษณะและโครงสร้างของชุดข้อมูลที่ใช้ฝึกปฏิบัติ',shape_summary(spec['files'])+['ศึกษารายชื่อคอลัมน์ ความหมายของข้อมูล และหน่วยวัดของแต่ละตัวแปรให้เข้าใจก่อนเริ่มวิเคราะห์ข้อมูล'],0),
  content(week,'procedure','แนวทางการฝึกปฏิบัติเขียนคำสั่งภาษา Python',['ลำดับการเรียนรู้: ศึกษาหน้าที่ของคำสั่ง → พิมพ์คำสั่งใน Google Colab → รันคำสั่ง → ตรวจสอบและแปลความหมายของผลลัพธ์','พิมพ์คำสั่งแยกเป็นขั้นตอนละ 1 เซลล์ และตรวจสอบความถูกต้องของผลลัพธ์ก่อนเริ่มขั้นตอนถัดไป','คำสั่งที่เป็นการกำหนดค่าให้ตัวแปรจะไม่แสดงผลลัพธ์ทันที ผู้เรียนสามารถตรวจสอบผลลัพธ์ได้จากคำสั่งแสดงผลในขั้นตอนถัดไป'],0)]
 concepts={day:[content(week,f'concept-{day}-{i}',c['title'],c['items'],day) for i,c in enumerate(spec['concepts']) if c['day']==day] for day in (0,1)}
 if week==2:
  slides.append({'id':'w2-warmup','type':'warmup-drill','title':'ส่วนที่ 1: แบบฝึกหัดทบทวนก่อนเรียน (ทบทวนการสำรวจและวิเคราะห์ข้อมูล 9 ข้อ · เวลา 30 นาที)','teachingDays':[0],'speakerNotes':'ให้ผู้เรียนเปิด Google Colab เขียนคำสั่งวิเคราะห์สำรวจข้อมูลทั้ง 9 ข้อด้วยตนเอง แล้วบันทึกผลลงในใบงาน Google Docs เมื่อครบเวลาแล้วผู้สอนจึงสรุปผลการวิเคราะห์ร่วมกัน'})
 slides.extend(concepts[0])
 if week==2:
  slides.append({'id':'w2-etl-theory','type':'w2-etl-theory','title':'แผนภาพจำลองกระบวนการ ETL และกรณีศึกษาการแก้ไขปัญหาคุณภาพข้อมูล 4 รูปแบบ','teachingDays':[0],'speakerNotes':'ผู้สอนใช้แผนภาพนี้สรุปกระบวนการ Extract → Transform → Load และคลิกเปรียบเทียบตารางข้อมูลก่อนและหลังการแก้ไขปัญหาทั้ง 4 รูปแบบให้ผู้เรียนเข้าใจแนวคิดก่อนเริ่มเขียนคำสั่ง'})
  slides.append({'id':'w2-etl-explorer','type':'w2-etl-explorer','title':'สรุปคำสั่งการจัดเตรียมข้อมูล (ETL) ทั้ง 10 ขั้นตอน','teachingDays':[0],'speakerNotes':'ผู้สอนใช้หน้านี้แนะนำภาพรวมคำสั่งทั้ง 10 ขั้นตอนก่อนเริ่มพาผู้เรียนพิมพ์ทีละขั้นตอน'})
 switch=False
 intro=f'# {tag} — {old["title"]}\n\n## จุดประสงค์การเรียนรู้\n'+''.join('- '+g+'\n' for g in spec['goals'])+'\n## การเตรียมไฟล์ข้อมูล\n'+''.join('- '+f+'\n' for f in spec['files'])+'\nอัปโหลดไฟล์ข้อมูลผ่านเมนู Files ในโปรแกรม Google Colab แล้วพิมพ์คำสั่งและรันผลลัพธ์ตามลำดับทีละขั้นตอน\n\n'
 intro+='## โครงสร้างชุดข้อมูล\n'+''.join('- '+x+'\n' for x in shape_summary(spec['files']))
 learners=[md(intro)];references=[md(intro)];reader=[intro];teacher=[intro];namespace={};previous=os.getcwd();exports=[]
 with tempfile.TemporaryDirectory(prefix='dva-lessons-') as work:
  workdir=Path(work)
  for f in spec['files']:shutil.copy2(base/'ชุดข้อมูล'/f,workdir/f)
  os.chdir(workdir)
  try:
   if week==2:
    w2_rev_header='---\n\n# ส่วนที่ 1: แบบฝึกหัดทบทวนก่อนเรียน (ทบทวนคำสั่งพื้นฐานจากสัปดาห์ที่ 1 · เวลา 30 นาที)\n\nคำชี้แจง: ให้ผู้เรียนเขียนคำสั่งทบทวนการนำเข้าและสำรวจข้อมูล `nvc_tech_store.csv` ลงในเซลล์โค้ดทั้ง 3 ข้อด้านล่างก่อนเริ่มเรียนเนื้อหาใหม่\n'
    learners.append(md(w2_rev_header));references.append(md(w2_rev_header));reader.append(w2_rev_header);teacher.append(w2_rev_header)
    w2_rev_items=[
     ('ข้อที่ 1: ทบทวนการนำเข้าข้อมูลและกำหนดชนิดข้อมูลหมายเลขโทรศัพท์','เขียนคำสั่งนำเข้าไลบรารี `pandas` และอ่านไฟล์ `nvc_tech_store.csv` ลงในตัวแปร `df` โดยกำหนดชนิดข้อมูลของคอลัมน์ `customer_phone` เป็น `string` จากนั้นแสดงข้อมูลตัวอย่าง 3 แถวแรก',"import pandas as pd\ndf = pd.read_csv('nvc_tech_store.csv', dtype={'customer_phone': 'string'})\ndf.head(3)",'นำเข้าตารางข้อมูลขนาด 36 แถว 7 คอลัมน์ โดยหมายเลขโทรศัพท์ยังคงแสดงเลข 08 นำหน้าครบถ้วน'),
     ('ข้อที่ 2: ทบทวนการสำรวจขนาดตารางและรายชื่อคอลัมน์','เขียนคำสั่งตรวจสอบขนาดของตารางด้วยคำสั่ง `df.shape` และแสดงรายชื่อคอลัมน์ทั้งหมดด้วยคำสั่ง `df.columns`','df.shape, df.columns.tolist()','ตารางข้อมูลต้นฉบับมีขนาด (36, 7) คือ 36 แถว 7 คอลัมน์'),
     ('ข้อที่ 3: ทบทวนการตรวจสอบจำนวนค่าว่างและค่าสถิติพื้นฐาน','เขียนคำสั่งนับจำนวนค่าว่างแยกตามรายคอลัมน์ด้วยคำสั่ง `df.isna().sum()` และคำนวณค่าสถิติพื้นฐานด้วยคำสั่ง `df.describe()`','df.isna().sum()\ndf.describe()','พบค่าว่างรวม 5 จุด และพบค่าผิดปกติในคอลัมน์ quantity (-2 ชิ้น) และ total_price (99,000 บาท)')
    ]
    for r_idx,(r_title,r_prompt,r_code,r_ans) in enumerate(w2_rev_items,1):
     r_preview,r_outputs=evaluate(r_code,namespace,week,r_idx)
     r_md=f'## {r_title}\n\n**โจทย์:** {r_prompt}\n'
     r_chk=f'### แนวคำตอบทบทวน\n\n'+output_md(r_preview)+f'\n**สรุปผล:** {r_ans}\n'
     learners.extend([md(r_md),cell()]);references.extend([md(r_md),cell(r_code,r_idx,r_outputs),md(r_chk)]);reader.extend([r_md,r_chk]);teacher.extend([r_md,r_chk])
    w2_theory_md='---\n\n# ส่วนที่ 2: ทฤษฎีและหลักการจัดเตรียมข้อมูล (ETL)\n\n'+'\n'.join('## '+c['title']+'\n'+''.join('- '+item+'\n' for item in c['items']) for c in spec['concepts'] if c['day']==0)+'\n---\n\n# ส่วนที่ 3: การฝึกปฏิบัติการจัดเตรียมข้อมูลด้วยกระบวนการ ETL (ขั้นตอนที่ 1–10)\n'
    learners.append(md(w2_theory_md));references.append(md(w2_theory_md));reader.append(w2_theory_md);teacher.append(w2_theory_md)
   for i,s in enumerate(spec['steps'],1):
    if s['day']==1 and not switch:
     if week==2:
      w2_ex_questions=[
       ('ข้อที่ 1 (2 คะแนน): เปรียบเทียบขนาดของตารางข้อมูลก่อนและหลังทำ ETL','เขียนคำสั่งแสดงขนาดของตาราง `df.shape` เปรียบเทียบกับ `df_clean.shape` และระบุว่ามีแถวข้อมูลที่มีปัญหาถูกคัดกรองออกไปทั้งหมดกี่แถว','df.shape, df_clean.shape','ตารางข้อมูลต้นฉบับมี 36 แถว และตารางข้อมูลที่ผ่านการจัดเตรียมแล้วเหลือ 29 แถว แสดงว่ามีแถวข้อมูลที่มีปัญหาถูกคัดกรองออกไปทั้งหมด 7 แถว'),
       ('ข้อที่ 2 (2 คะแนน): ตรวจสอบจำนวนค่าว่างคงเหลือในตาราง df_clean','เขียนคำสั่งตรวจสอบจำนวนค่าว่างคงเหลือด้วยคำสั่ง `df_clean.isna().sum()` และระบุว่าคอลัมน์ใดที่ยังคงมีค่าว่างเหลืออยู่ และเหลืออยู่กี่แถว พร้อมอธิบายเหตุผล','df_clean.isna().sum()','คอลัมน์ customer_phone ยังคงมีค่าว่างเหลืออยู่ 2 แถว เนื่องจากเป็นรายการที่มีมูลค่าการซื้อขายครบถ้วนแต่ไม่ได้ระบุหมายเลขโทรศัพท์'),
       ('ข้อที่ 3 (2 คะแนน): สรุปจำนวนรายการสินค้าแยกตามหมวดหมู่ภายหลังการจัดเตรียมข้อมูล','เขียนคำสั่งนับจำนวนรายการสินค้าแต่ละหมวดหมู่ด้วยคำสั่ง `df_clean[\'category\'].value_counts()` และระบุจำนวนรายการของทั้ง 3 หมวดหมู่',"df_clean['category'].value_counts()",'หมวดหมู่ อุปกรณ์ต่อพ่วง มี 12 รายการ, สายและหน่วยความจำ มี 11 รายการ และ อุปกรณ์เสียง มี 6 รายการ (รวม 29 รายการ)'),
       ('ข้อที่ 4 (2 คะแนน): ตรวจสอบค่าสถิติพื้นฐานของตาราง df_clean','เขียนคำสั่งคำนวณค่าสถิติพื้นฐานด้วยคำสั่ง `df_clean.describe()` และระบุค่าเฉลี่ย (`mean`) ค่าต่ำสุด (`min`) และค่าสูงสุด (`max`) ของคอลัมน์ `total_price`','df_clean.describe()','ภายหลังการทำ ETL คอลัมน์ total_price มีค่าเฉลี่ย (mean) เท่ากับ 754.83 บาท, ค่าต่ำสุด (min) เท่ากับ 180.00 บาท และค่าสูงสุด (max) เท่ากับ 2,580.00 บาท'),
       ('ข้อที่ 5 (2 คะแนน): ตรวจสอบความถูกต้องของไฟล์ CSV ที่บันทึกออก','เขียนคำสั่งอ่านไฟล์ `nvc_tech_store_clean.csv` ขึ้นมาแสดงข้อมูลตัวอย่าง 5 แถวแรกด้วยคำสั่ง `pd.read_csv(\'nvc_tech_store_clean.csv\').head()` เพื่อยืนยันความถูกต้องของไฟล์',"pd.read_csv('nvc_tech_store_clean.csv').head()",'ไฟล์ nvc_tech_store_clean.csv สามารถอ่านกลับมาใช้งานได้ถูกต้อง มี 7 คอลัมน์มาตรฐานโดยไม่มีคอลัมน์ Unnamed: 0 เพิ่มขึ้นมา')
      ]
      w2_ex_header='---\n\n# ส่วนที่ 3: แบบฝึกหัดปฏิบัติการท้ายคาบเรียนวันจันทร์ (เวลา 40 นาที · 10 คะแนน)\n\nคำชี้แจง: ให้ผู้เรียนเขียนคำสั่งภาษา Python ลงในเซลล์ว่างด้านล่างของแต่ละข้อ และพิมพ์สรุปคำตอบที่ได้จากตารางข้อมูล `df_clean`\n'
      learners.append(md(w2_ex_header));references.append(md(w2_ex_header));reader.append(w2_ex_header);teacher.append(w2_ex_header)
      for q_idx,(q_title,q_prompt,q_code,q_ans) in enumerate(w2_ex_questions,1):
       q_preview,q_outputs=evaluate(q_code,namespace,week,100+q_idx)
       q_md=f'## {q_title}\n\n**โจทย์:** {q_prompt}\n'
       a_student_md='**คำตอบของผู้เรียน:** (พิมพ์คำตอบที่สรุปได้จากผลลัพธ์ตรงนี้)\n'
       a_teacher_md=f'### แนวคำตอบและผลลัพธ์ (สำหรับผู้สอน)\n\n'+output_md(q_preview)+f'\n**สรุปคำตอบ:** {q_ans}\n'
       learners.extend([md(q_md),cell(),md(a_student_md)])
       references.extend([md(q_md),cell(q_code,100+q_idx,q_outputs),md(a_teacher_md)])
       reader.append(q_md+'\n'+a_student_md);teacher.append(q_md+'\n'+a_teacher_md)
      for ex_idx,ex in enumerate(spec.get('exercises',[])):
       if ex.get('day',0)==0:
        if ex_idx==0:
         slides.append({'id':'w2-closing-lab','type':'w2-closing-lab','title':ex['title'],'teachingDays':[0],'speakerNotes':'ให้ผู้เรียนลงมือทำแบบฝึกหัดท้ายคาบทั้ง 5 ข้อในส่วนท้ายของไฟล์ W02.ipynb (เวลา 40 นาที · 10 คะแนน) สามารถคลิกเลือกดูโจทย์แต่ละข้อบนหน้าจอได้'})
        else:
         slides.append(content(week,f'exercise-0-{ex_idx}',ex['title'],ex['items'],0))
      w2_sheet_student='# ใบงานทบทวนก่อนเรียนและแบบฝึกหัดปฏิบัติการท้ายคาบเรียน (สัปดาห์ที่ 2 วันจันทร์ · 3 ชั่วโมง)\n**รายวิชา:** 31901-2012 การวิเคราะห์และนำเสนอข้อมูล\n**ชุดข้อมูลที่ใช้:** `nvc_tech_store.csv`\n\n---\n\n# ส่วนที่ 1: แบบฝึกหัดทบทวนก่อนเรียน (เวลา 30 นาที)\n\n'+'\n'.join(f'## {rt}\n- **โจทย์:** {rp}\n- **คำสั่งที่ใช้:** `............................................................`\n' for rt,rp,_,_ in w2_rev_items)+'\n---\n\n# ส่วนที่ 2: แบบฝึกหัดปฏิบัติการท้ายคาบเรียนวันจันทร์ (เวลา 40 นาที · 10 คะแนน)\n\n'+'\n'.join(f'## {qt}\n- **โจทย์:** {qp}\n- **คำสั่งที่ใช้:** `............................................................`\n- **สรุปคำตอบจากผลลัพธ์:** `............................................................`\n' for qt,qp,_,_ in w2_ex_questions)
      w2_sheet_teacher='# เฉลยใบงานทบทวนก่อนเรียนและแบบฝึกหัดปฏิบัติการท้ายคาบเรียน (สัปดาห์ที่ 2 วันจันทร์ · สำหรับผู้สอน)\n**รายวิชา:** 31901-2012 การวิเคราะห์และนำเสนอข้อมูล\n**ชุดข้อมูลที่ใช้:** `nvc_tech_store.csv`\n\n---\n\n# ส่วนที่ 1: เฉลยแบบฝึกหัดทบทวนก่อนเรียน (30 นาที)\n\n'+'\n'.join(f'## {rt}\n- **โจทย์:** {rp}\n- **คำสั่งเฉลย:**\n```python\n{rc}\n```\n- **สรุปผล:** {ra}\n' for rt,rp,rc,ra in w2_rev_items)+'\n---\n\n# ส่วนที่ 2: เฉลยแบบฝึกหัดปฏิบัติการท้ายคาบเรียนวันจันทร์ (10 คะแนน)\n\n'+'\n'.join(f'## {qt}\n- **โจทย์:** {qp}\n- **คำสั่งเฉลย:**\n```python\n{qc}\n```\n- **แนวคำตอบ (2 คะแนน):** {qa}\n' for qt,qp,qc,qa in w2_ex_questions)
      (folder/'แบบฝึกหัดท้ายคาบ_สัปดาห์02_จันทร์.md').write_text(w2_sheet_student)
      (base/'สำหรับครู/เฉลยแบบฝึกหัดท้ายคาบ_สัปดาห์02_จันทร์.md').write_text(w2_sheet_teacher)
     slides.append(content(week,'tuesday','การเตรียมความพร้อมก่อนเริ่มเรียนวันอังคาร',['เปิดไฟล์ Notebook ที่บันทึกไว้จากวันจันทร์ และตรวจสอบไฟล์ชุดข้อมูลในเมนู Files','หากระบบเริ่มต้นสภาพแวดล้อมการทำงาน (Runtime) ใหม่ ให้อัปโหลดไฟล์ข้อมูลและรันเซลล์คำสั่งของวันจันทร์ตามลำดับ','ตรวจสอบความถูกต้องของผลลัพธ์ก่อนเริ่มเรียนคำสั่งใหม่ในวันอังคาร'],1))
     slides.extend(concepts[1]);switch=True
     learners.append(md('---\n\n# วันอังคาร\n\nตรวจสอบไฟล์ชุดข้อมูลและรันคำสั่งจากวันจันทร์ให้ครบถ้วนก่อนเริ่มคำสั่งใหม่\n'));references.append(md('---\n\n# วันอังคาร\n'));reader.append('\n# วันอังคาร\n')
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
     links.append({'label':'ดาวน์โหลดไฟล์ '+f,'url':'ชุดเรียน/ตัวอย่าง/'+copy_name})
    identifier=f'w{week}-write-{i}'
    write={'id':identifier,'type':'guided','flow':'write-then-check','step':i,'title':f'ขั้นตอนที่ {i}: {s["title"]}','teachingDays':[s['day']],
      'instruction':'ให้ผู้เรียนพิมพ์คำสั่งภาษา Python ด้านล่างลงในเซลล์ของโปรแกรม Google Colab และรันคำสั่งเพื่อตรวจสอบผลลัพธ์','code':s['code'],'meaning':s['meaning'],'parts':s['parts'],
      'teacherAction':'อธิบายหน้าที่และส่วนประกอบของคำสั่ง จากนั้นสาธิตการรันคำสั่งให้ผู้เรียนปฏิบัติตาม',
      'studentAction':'พิมพ์คำสั่งลงในเซลล์โค้ด รันคำสั่ง และตรวจสอบผลลัพธ์','run':'วิธีรันคำสั่ง: พิมพ์คำสั่งลงในเซลล์โค้ด แล้วกดปุ่ม Shift + Enter',
      'speakerNotes':'สาธิตและอธิบายส่วนประกอบทีละรายการ รอให้ผู้เรียนเขียนและตรวจผลก่อนเริ่มคำสั่งถัดไป'}
    check={'id':identifier+'-result','type':'guided-check','step':i,'title':f'ขั้นตอนที่ {i}: ผลลัพธ์จากการรันคำสั่งและคำอธิบาย','teachingDays':[s['day']],
      'code':s['code'],'output':preview,'expected':s['interpretation'],'interpretation':s['interpretation'],'mistake':s['mistake'],'checkpoint':s['checkpoint'],
      'speakerNotes':'เปรียบเทียบผลจากไฟล์เดียวกัน ให้ผู้เรียนอธิบายความหมายโดยใช้หน่วยและข้อจำกัด ตรวจและช่วยแก้ก่อนดำเนินการต่อ'}
    if links:check['downloads']=links
    slides.extend([write,check])
    description=f'## ขั้นตอนที่ {i}: {s["title"]}\n\n{s["meaning"]}\n\n```python\n{s["code"]}\n```\n\n'+''.join(f'- `{p["token"]}`: {p["meaning"]}\n' for p in s['parts'])+'\nพิมพ์คำสั่งและกดปุ่ม Shift + Enter เพื่อรันคำสั่งและตรวจสอบผลลัพธ์\n'
    checktext='### ผลลัพธ์และคำอธิบาย\n\n'+output_md(preview)+'\n'+s['interpretation']+'\n\n**ข้อควรระวังในการเขียนคำสั่ง:** '+s['mistake']+'\n\n**คำถามตรวจสอบความเข้าใจ:** '+s['checkpoint']+'\n'
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
 resource['files']=[{'name':f,'url':'ชุดเรียน/ชุดข้อมูล/'+f} for f in spec['files']]+([
  {'name':'ใบงานปฏิบัติการทบทวนก่อนเรียน 9 ข้อ (Google Docs .docx)','url':'ชุดเรียน/เรียนย้อนหลัง_สัปดาห์02/ใบงานปฏิบัติการ_ทบทวนก่อนเรียน_GoogleDocs.docx'},
  {'name':'ใบงานปฏิบัติการรวมวันจันทร์สำหรับ Google Docs / Word (.docx)','url':'ชุดเรียน/เรียนย้อนหลัง_สัปดาห์02/ใบงานปฏิบัติการ_สัปดาห์ที่02_จันทร์_GoogleDocs.docx'},
  {'name':'ใบงานทบทวนก่อนเรียนและแบบฝึกหัดท้ายคาบวันจันทร์ (.md)','url':'ชุดเรียน/เรียนย้อนหลัง_สัปดาห์02/แบบฝึกหัดท้ายคาบ_สัปดาห์02_จันทร์.md'}
 ] if week==2 else [])+[
  {'name':'Notebook ตัวอย่างพร้อมผลลัพธ์ '+tag,'url':f'ชุดเรียน/Notebook_ตัวอย่าง/{tag}.ipynb'},
  {'name':f'บทเรียนอ่านตามสไลด์ สัปดาห์ {week}','url':f'ชุดเรียน/เรียนย้อนหลัง_สัปดาห์{week:02}/บทเรียนสัปดาห์{week:02}_อ่านตามสไลด์.md'},
  {'name':f'ชุดเรียนย้อนหลัง สัปดาห์ {week} (รวมข้อมูลและ Notebook)','url':f'ชุดเรียน/สัปดาห์{week:02}_เรียนย้อนหลัง.zip'}]
 report.append({'week':week,'commands':len(spec['steps']),'slides':len(slides),'status':'executed','exports':exports})
 print(f'{tag}: {len(spec["steps"])} command cells executed; {len(slides)} slides',flush=True)

w1_spec_file=project/'lesson-specs/week01_tuesday.json'
if w1_spec_file.exists() and (not args.weeks or 1 in args.weeks):
 w1_spec=json.loads(w1_spec_file.read_text());old1=deck[0];folder1=base/'เรียนย้อนหลัง_สัปดาห์01';folder1.mkdir(exist_ok=True)
 monday_slides=[
  {'id':'w1-intro-1','type':'content','title':'แนะนำรายวิชาการวิเคราะห์และนำเสนอข้อมูล','items':[
   'รหัสวิชา: 31901-2012 รายวิชาการวิเคราะห์และนำเสนอข้อมูล (Data Analysis and Visualization)',
   'ขอบเขตเนื้อหา: ศึกษาหลักการรวบรวม ตรวจสอบ จัดเตรียม วิเคราะห์ และนำเสนอข้อมูล เพื่อใช้สนับสนุนการตัดสินใจอย่างเป็นระบบ',
   'กรณีศึกษาตัวอย่าง: การวิเคราะห์ข้อมูลยอดขายของร้านค้าเพื่อค้นหาสินค้าขายดีและสรุปผลให้ผู้บริหารตัดสินใจ',
   'ความสำคัญของข้อมูล: การนำข้อมูลราคา ยอดขาย และความคิดเห็นของลูกค้ามาพิจารณาช่วยให้การตัดสินใจมีความแม่นยำและตรวจสอบได้'
  ],'teachingDays':[0],'orientationMinutes':10},
  {'id':'w1-intro-2','type':'content','title':'จุดประสงค์รายวิชา','items':[
   'ด้านความรู้: เข้าใจหลักการวิเคราะห์ข้อมูล การสร้างแผนภูมิและทัศนภาพข้อมูล ตลอดจนการนำเสนอข้อมูลด้วยเทคโนโลยีดิจิทัล',
   'ด้านทักษะ: มีทักษะในการตรวจสอบ จัดเตรียม วิเคราะห์ และนำเสนอข้อมูล รวมถึงการออกแบบสื่อนำเสนอที่เข้าใจง่าย',
   'ด้านคุณลักษณะ: ปฏิบัติงานด้วยความละเอียด รอบคอบ มีความรับผิดชอบ และสามารถทำงานร่วมกับผู้อื่นได้อย่างมีประสิทธิภาพ',
   'ด้านการประยุกต์ใช้: ประยุกต์ใช้การคำนวณทางสถิติและการวิเคราะห์ข้อมูลเพื่อสนับสนุนการตัดสินใจในการปฏิบัติงาน'
  ],'teachingDays':[0],'orientationMinutes':6},
  {'id':'w1-intro-competency','type':'content','title':'สมรรถนะรายวิชาและผลลัพธ์การเรียนรู้','items':[
   'การรวบรวมข้อมูล: รวบรวมข้อมูลที่สอดคล้องกับประเด็นปัญหาและระบุแหล่งที่มาของข้อมูลได้อย่างถูกต้อง',
   'การจัดเตรียมข้อมูล: ตรวจสอบคุณภาพของข้อมูลและจัดเตรียมข้อมูลให้พร้อมก่อนนำไปวิเคราะห์',
   'การวิเคราะห์ข้อมูล: จัดโครงสร้างตารางข้อมูล คำนวณค่าสถิติ และสรุปผลการวิเคราะห์ข้อมูลได้',
   'การนำเสนอข้อมูล: เลือกรูปแบบแผนภูมิและวิธีการนำเสนอข้อมูลให้เหมาะสมกับกลุ่มผู้รับสาร',
   'การสรุปผล: อธิบายขั้นตอนการดำเนินงานและระบุหลักฐานจากข้อมูลที่ใช้ประกอบการตัดสินใจได้'
  ],'teachingDays':[0],'orientationMinutes':6},
  {'id':'w1-intro-7','type':'content','title':'กระบวนการวิเคราะห์และนำเสนอข้อมูล 4 ขั้นตอน','items':[
   'ลำดับขั้นตอนหลัก: Get Data → ETL → Modeling → Visualization',
   'ความหมายของทั้ง 4 ขั้นตอน: การรวบรวมข้อมูล → การจัดเตรียมข้อมูล → การจัดโครงสร้างและวิเคราะห์ข้อมูล → การนำเสนอข้อมูลด้วยภาพ',
   'ตัวอย่างการดำเนินงานจริง: รวบรวมข้อมูลการขาย → ตรวจสอบและทำความสะอาดตารางข้อมูล → เชื่อมโยงข้อมูลสินค้าเพื่อสรุปยอดขาย → สร้างแผนภูมิเปรียบเทียบยอดขาย'
  ],'teachingDays':[0],'orientationMinutes':4,'animation':{
   'kind':'pipeline',
   'label':'กระบวนการทำงานตั้งแต่ต้นทางถึงการนำเสนอข้อมูล',
   'steps':[
    {'title':'1. Get Data','input':'ประเด็นคำถาม: สินค้าใดมียอดขายสูงสุด','action':'รวบรวมไฟล์ข้อมูลรายการขายและข้อมูลสินค้า','output':'ไฟล์ข้อมูลต้นฉบับ'},
    {'title':'2. ETL','input':'ไฟล์ข้อมูลต้นฉบับ','action':'ตรวจสอบค่าว่าง ข้อมูลซ้ำซ้อน และจัดรูปแบบให้ถูกต้อง','output':'ตารางข้อมูลที่ผ่านการจัดเตรียมแล้ว'},
    {'title':'3. Modeling','input':'ตารางรายการขายและตารางสินค้า','action':'เชื่อมโยงตารางด้วยรหัสสินค้าและคำนวณยอดขายรวม','output':'ตารางสรุปยอดขายแยกตามรายการสินค้า'},
    {'title':'4. Visualization','input':'ตารางสรุปยอดขาย','action':'สร้างแผนภูมิแท่งเปรียบเทียบยอดขายแต่ละรายการ','output':'แผนภูมิพร้อมข้อเสนอแนะเพื่อประกอบการตัดสินใจ'}
   ]
  }},
  {'id':'w1-intro-8','type':'content','title':'ขั้นตอนที่ 1: การรวบรวมและนำเข้าข้อมูล (Get Data)','items':[
   'หน้าที่หลัก: รวบรวมและนำเข้าชุดข้อมูลที่เกี่ยวข้องกับประเด็นคำถามที่ต้องการศึกษา',
   'การตรวจสอบเบื้องต้น: พิจารณาแหล่งที่มาของข้อมูล ความหมายของแต่ละคอลัมน์ และชนิดของข้อมูลก่อนนำไปใช้งาน',
   'ตัวอย่างการปฏิบัติ: การนำเข้าไฟล์ข้อมูลรายการคำสั่งซื้อ (CSV) และไฟล์ข้อมูลรายละเอียดสินค้า (Excel) เข้าสู่โปรแกรม'
  ],'teachingDays':[0],'orientationMinutes':8},
  {'id':'w1-intro-9','type':'content','title':'ขั้นตอนที่ 2: การจัดเตรียมและทำความสะอาดข้อมูล (ETL)','items':[
   'Extract (การดึงข้อมูล): นำข้อมูลจากแหล่งต้นทางเข้าสู่ระบบประมวลผลเพื่อเตรียมตรวจสอบ',
   'Transform (การแปลงและทำความสะอาดข้อมูล): ตรวจสอบค่าว่าง ข้อมูลซ้ำซ้อน และปรับปรุงรูปแบบข้อมูลให้ถูกต้องตามมาตรฐาน',
   'Load (การบันทึกข้อมูล): จัดเก็บตารางข้อมูลที่ผ่านการจัดเตรียมแล้วเพื่อนำไปใช้ในการวิเคราะห์ขั้นตอนถัดไป'
  ],'teachingDays':[0],'orientationMinutes':9},
  {'id':'w1-intro-10','type':'content','title':'ขั้นตอนที่ 3: การจัดโครงสร้างและวิเคราะห์ข้อมูล (Modeling)','items':[
   'การจัดโครงสร้างข้อมูล: กำหนดความสัมพันธ์และเชื่อมโยงข้อมูลระหว่างตารางที่เกี่ยวข้องกัน',
   'การคำนวณตัวชี้วัด: กำหนดวิธีการคำนวณค่าสถิติและตัวชี้วัด (KPI) ให้สอดคล้องกับประเด็นคำถาม',
   'ตัวอย่างการปฏิบัติ: การเชื่อมโยงตารางรายการขายกับตารางสินค้า เพื่อสรุปยอดขายรวมแยกตามหมวดหมู่สินค้า'
  ],'teachingDays':[0],'orientationMinutes':9},
  {'id':'w1-intro-11','type':'content','title':'ขั้นตอนที่ 4: การนำเสนอข้อมูลด้วยภาพ (Visualization)','items':[
   'การสร้างสื่อนำเสนอ: นำผลการวิเคราะห์ข้อมูลมาแสดงในรูปแบบแผนภูมิหรือ Dashboard ที่เข้าใจง่าย',
   'การเลือกประเภทแผนภูมิ: เลือกรูปแบบแผนภูมิให้เหมาะสมกับลักษณะของข้อมูลและกลุ่มเป้าหมาย',
   'ตัวอย่างการปฏิบัติ: การใช้แผนภูมิแท่งเปรียบเทียบยอดขายรายสินค้า พร้อมสรุปข้อค้นพบเพื่อประกอบการตัดสินใจ'
  ],'teachingDays':[0],'orientationMinutes':8},
  {'id':'w1-intro-bridge','type':'content','title':'แนวทางการเรียนและการฝึกปฏิบัติในรายวิชา','items':[
   'รูปแบบการเรียน: ศึกษาแนวคิดและหลักการทำงานของแต่ละขั้นตอนควบคู่กับการลงมือปฏิบัติจริงในชั้นเรียน',
   'การฝึกเขียนคำสั่ง: ใช้ภาษา Python และไลบรารี pandas ในโปรแกรม Google Colab ตามลำดับขั้นตอน',
   'ขั้นตอนการฝึกปฏิบัติ: ศึกษาหน้าที่ของคำสั่ง → พิมพ์คำสั่งและรันผลลัพธ์ → ตรวจสอบและแปลความหมายของผลลัพธ์'
  ],'teachingDays':[0],'orientationMinutes':4},
  {'id':'w1-intro-12','type':'content','title':'เครื่องมือและโปรแกรมที่ใช้ในการเรียน','items':[
   'Google Colab: โปรแกรมสำหรับเขียนและรันคำสั่งภาษา Python บนเว็บเบราว์เซอร์โดยไม่ต้องติดตั้งโปรแกรมลงในเครื่อง',
   'Python: ภาษาคอมพิวเตอร์มาตรฐานที่ใช้ในการประมวลผลและวิเคราะห์ข้อมูล',
   'pandas: ไลบรารีในภาษา Python สำหรับการอ่าน จัดเตรียม คัดกรอง และสรุปผลข้อมูลตาราง',
   'Matplotlib และ Plotly: ไลบรารีสำหรับสร้างแผนภูมิและ Dashboard นำเสนอข้อมูล',
   'CSV และ Excel: รูปแบบไฟล์ตารางข้อมูลที่ใช้ในการฝึกปฏิบัติตลอดรายวิชา'
  ],'teachingDays':[0],'orientationMinutes':6}
 ]
 tuesday_slides=[content(1,'tuesday','การเตรียมความพร้อมก่อนเริ่มเรียนปฏิบัติการ (เวลา 120 นาที)',[
  'การเตรียมไฟล์: ดาวน์โหลดไฟล์ชุดข้อมูล nvc_tech_store.csv และไฟล์ Notebook (W01.ipynb) จากลิงก์ด้านล่าง',
  'การอัปโหลดข้อมูล: เปิดโปรแกรม Google Colab และอัปโหลดไฟล์ nvc_tech_store.csv ผ่านเมนู Files → Upload',
  'ส่วนที่ 1 การฝึกปฏิบัติ (90 นาที): ฝึกเขียนคำสั่งพื้นฐาน 9 คำสั่ง (ขั้นตอนที่ 1–9) เพื่อนำเข้าข้อมูลและสำรวจโครงสร้างตาราง',
  'ส่วนที่ 2 แบบฝึกหัดท้ายคาบเรียน (30 นาที): ทำแบบฝึกหัดทบทวนความเข้าใจจำนวน 5 ข้อ (10 คะแนน) ในส่วนท้ายของไฟล์ Notebook'],1,downloads=[
  {'label':'ดาวน์โหลดไฟล์ข้อมูล nvc_tech_store.csv','url':'ชุดเรียน/ชุดข้อมูล/nvc_tech_store.csv'},
  {'label':'ดาวน์โหลดไฟล์ Notebook สำหรับฝึกปฏิบัติ (W01.ipynb)','url':'ชุดเรียน/Notebook_ฝึกพิมพ์/W01.ipynb'},
  {'label':'ดาวน์โหลดใบงานแบบฝึกหัดท้ายคาบเรียน (.md)','url':'ชุดเรียน/เรียนย้อนหลัง_สัปดาห์01/แบบฝึกหัดท้ายคาบ_สัปดาห์01_อังคาร.md'}])]
 for idx,c in enumerate(w1_spec['concepts']):
  tuesday_slides.append(content(1,f'concept-1-{idx}',c['title'],c['items'],1))
 tuesday_slides.append({'id':'w1-function-explorer','type':'function-explorer','title':'สรุปคำสั่งพื้นฐานทั้ง 9 คำสั่งสำหรับการนำเข้าและสำรวจข้อมูลตาราง','teachingDays':[1],'speakerNotes':'ผู้สอนใช้หน้านี้แสดงภาพรวมของ 9 ฟังก์ชันที่จะปฏิบัติการในวันนี้ (90 นาที) ก่อนทำแบบฝึกหัดท้ายคาบ (30 นาที)'})
 w1_intro='# W01 วันอังคาร (2 คาบ 120 นาที) — การนำเข้าข้อมูลและการสำรวจโครงสร้างตารางเบื้องต้น (ขั้นตอนที่ 1–9 และแบบฝึกหัดท้ายคาบ)\n\n## จุดประสงค์การเรียนรู้\n'+''.join('- '+g+'\n' for g in w1_spec['goals'])+'\n## ชุดข้อมูลสำหรับการฝึกปฏิบัติ\n- `nvc_tech_store.csv` (ข้อมูลรายการคำสั่งซื้อร้านอุปกรณ์ไอที NVC Tech Store จำนวน 36 แถว 7 คอลัมน์)\n\nอัปโหลดไฟล์ `nvc_tech_store.csv` เข้าสู่โปรแกรม Google Colab จากนั้นฝึกเขียนคำสั่งตามลำดับ (ขั้นตอนที่ 1–9 ใช้เวลา 90 นาที) และทำแบบฝึกหัดท้ายคาบเรียนจำนวน 5 ข้อ (ใช้เวลา 30 นาที)\n'
 w1_learners=[md(w1_intro)];w1_refs=[md(w1_intro)];w1_reader=[w1_intro];w1_codes=[];w1_ns={};w1_exports=[];prev1=os.getcwd()
 w1_ex_questions=[
  ('ข้อที่ 1 (2 คะแนน): การแสดงข้อมูลตัวอย่างส่วนต้นและส่วนท้ายของตาราง','เขียนคำสั่งแสดงข้อมูลตัวอย่าง 8 แถวแรกด้วยคำสั่ง `df.head(8)` และแสดงข้อมูล 3 แถวสุดท้ายด้วยคำสั่ง `df.tail(3)` พร้อมระบุรหัสคำสั่งซื้อ (`order_id`) ของแถวที่ลำดับแถว 7','df.head(8)\ndf.tail(3)','รหัสคำสั่งซื้อ (order_id) ของแถวที่ลำดับแถว 7 คือ ORD-107 (เว็บแคม Full HD)'),
  ('ข้อที่ 2 (2 คะแนน): การตรวจสอบชนิดข้อมูลของทุกคอลัมน์','เขียนคำสั่งตรวจสอบชนิดข้อมูลของทุกคอลัมน์ด้วยคำสั่ง `df.dtypes` พร้อมอธิบายเหตุผลที่ต้องกำหนดให้คอลัมน์ `customer_phone` มีชนิดข้อมูลเป็นข้อความ (`string`)','df.dtypes','ต้องกำหนดให้ customer_phone เป็นชนิดข้อมูลข้อความ (string) เพื่อรักษาเลข 0 นำหน้าหมายเลขโทรศัพท์ และเนื่องจากหมายเลขโทรศัพท์เป็นรหัสอ้างอิงที่ไม่ได้นำไปคำนวณทางคณิตศาสตร์'),
  ('ข้อที่ 3 (2 คะแนน): การนับจำนวนค่าว่างแยกตามรายคอลัมน์','เขียนคำสั่งนับจำนวนค่าว่างรวมของแต่ละคอลัมน์ด้วยคำสั่ง `df.isna().sum()` และระบุว่าตารางนี้มีค่าว่างรวมกันทุกคอลัมน์ทั้งหมดกี่จุด','df.isna().sum()','พบค่าว่างในคอลัมน์ customer_phone จำนวน 2 จุด, quantity จำนวน 1 จุด และ total_price จำนวน 2 จุด รวมทั้งตารางมีค่าว่างทั้งหมด 5 จุด'),
  ('ข้อที่ 4 (2 คะแนน): การตรวจสอบค่าสถิติพื้นฐานเพื่อค้นหาค่าผิดปกติ (Outlier)','เขียนคำสั่งคำนวณค่าสถิติพื้นฐานด้วยคำสั่ง `df.describe()` และระบุค่าเฉลี่ย (`mean`) ค่าต่ำสุด (`min`) และค่าสูงสุด (`max`) ของคอลัมน์ `total_price`','df.describe()','คอลัมน์ total_price มีค่าเฉลี่ย (mean) เท่ากับ 3,613.82 บาท, ค่าต่ำสุด (min) เท่ากับ 180.00 บาท และค่าสูงสุด (max) เท่ากับ 99,000.00 บาท (ซึ่งเป็นค่าผิดปกติที่ต้องจัดการในสัปดาห์ที่ 2)'),
  ('ข้อที่ 5 (2 คะแนน): การสำรวจความถี่ของสถานะการชำระเงิน','เขียนคำสั่งนับจำนวนรายการแยกตามสถานะการชำระเงินด้วยคำสั่ง `df[\'payment_status\'].value_counts()` และระบุจำนวนรายการของแต่ละสถานะ',"df['payment_status'].value_counts()",'สถานะ ชำระแล้ว มีจำนวน 30 รายการ, รอชำระ มีจำนวน 4 รายการ และ ยกเลิก มีจำนวน 2 รายการ')
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
     links.append({'label':'ดาวน์โหลดไฟล์ '+f,'url':'ชุดเรียน/ตัวอย่าง/'+copy_name})
    w1_codes.append(s['code']);identifier=f'w1-write-{i}'
    write={'id':identifier,'type':'guided','flow':'write-then-check','step':i,'title':f'ขั้นตอนที่ {i}: {s["title"]}','teachingDays':[1],
     'instruction':'ให้ผู้เรียนพิมพ์คำสั่งภาษา Python ด้านล่างลงในเซลล์ของโปรแกรม Google Colab และรันคำสั่งเพื่อตรวจสอบผลลัพธ์','code':s['code'],'meaning':s['meaning'],'parts':s['parts'],
     'teacherAction':'อธิบายหน้าที่และส่วนประกอบของคำสั่ง จากนั้นสาธิตการรันคำสั่งให้ผู้เรียนปฏิบัติตาม',
     'studentAction':'พิมพ์คำสั่งลงในเซลล์โค้ด รันคำสั่ง และตรวจสอบผลลัพธ์','run':'วิธีรันคำสั่ง: พิมพ์คำสั่งลงในเซลล์โค้ด แล้วกดปุ่ม Shift + Enter',
     'completeCode':'\n'.join(w1_codes),
     'speakerNotes':'สาธิตและอธิบายส่วนประกอบทีละรายการ รอให้ผู้เรียนเขียนและตรวจผลก่อนเริ่มคำสั่งถัดไป'}
    check={'id':identifier+'-result','type':'guided-check','step':i,'title':f'ขั้นตอนที่ {i}: ผลลัพธ์จากการรันคำสั่งและคำอธิบาย','teachingDays':[1],
     'code':s['code'],'output':preview,'expected':s['interpretation'],'interpretation':s['interpretation'],'mistake':s['mistake'],'checkpoint':s['checkpoint'],
     'speakerNotes':'เปรียบเทียบผลจากไฟล์เดียวกัน ให้ผู้เรียนอธิบายความหมายโดยใช้หน่วยและข้อจำกัด ตรวจและช่วยแก้ก่อนดำเนินการต่อ'}
    if links:check['downloads']=links
    tuesday_slides.extend([write,check])
    desc=f'## ขั้นตอนที่ {i}: {s["title"]}\n\n{s["meaning"]}\n\n```python\n{s["code"]}\n```\n\n'+''.join(f'- `{p["token"]}`: {p["meaning"]}\n' for p in s['parts'])+'\nพิมพ์คำสั่งและกดปุ่ม Shift + Enter เพื่อรันคำสั่งและตรวจสอบผลลัพธ์\n'
    chk='### ผลลัพธ์และคำอธิบาย\n\n'+output_md(preview)+'\n'+s['interpretation']+'\n\n**ข้อควรระวังในการเขียนคำสั่ง:** '+s['mistake']+'\n\n**คำถามตรวจสอบความเข้าใจ:** '+s['checkpoint']+'\n'
    w1_learners.extend([md(desc),cell(),md(chk)]);w1_refs.extend([md(desc),cell(s['code'],i,nb_outputs),md(chk)]);w1_reader.extend([desc,chk])
   ex_header='---\n\n# ส่วนที่ 2: แบบฝึกหัดปฏิบัติการท้ายคาบเรียน (เวลา 30 นาที · 10 คะแนน)\n\nคำชี้แจง: ให้ผู้เรียนเขียนคำสั่งภาษา Python ลงในเซลล์ว่างด้านล่างของแต่ละข้อ และพิมพ์สรุปคำตอบที่ได้จากตารางข้อมูล `df` (`nvc_tech_store.csv`)\n'
   w1_learners.append(md(ex_header));w1_refs.append(md(ex_header));w1_reader.append(ex_header)
   for q_idx,(q_title,q_prompt,q_code,q_ans) in enumerate(w1_ex_questions,1):
    q_preview,q_outputs=evaluate(q_code,w1_ns,1,len(w1_spec['steps'])+q_idx)
    q_md=f'## {q_title}\n\n**โจทย์:** {q_prompt}\n'
    a_student_md='**คำตอบของผู้เรียน:** (พิมพ์คำตอบที่สรุปได้จากผลลัพธ์ตรงนี้)\n'
    a_teacher_md=f'### แนวคำตอบและผลลัพธ์ (สำหรับผู้สอน)\n\n'+output_md(q_preview)+f'\n**สรุปคำตอบ:** {q_ans}\n'
    w1_learners.extend([md(q_md),cell(),md(a_student_md)])
    w1_refs.extend([md(q_md),cell(q_code,len(w1_spec['steps'])+q_idx,q_outputs),md(a_teacher_md)])
    w1_reader.append(q_md+'\n'+a_student_md)
  finally:os.chdir(prev1)
 for ex_idx,ex in enumerate(w1_spec.get('exercises',[])):
  ex_slide=content(1,f'exercise-1-{ex_idx}',ex['title'],ex['items'],1)
  tuesday_slides.append(ex_slide)
 w1_summary=content(1,'summary','สรุปผลการเรียนรู้ประจำสัปดาห์ที่ 1',w1_spec['goals']+['ทำแบบฝึกหัดปฏิบัติการท้ายคาบเรียนครบทั้ง 5 ข้อ (30 นาที) และบันทึกไฟล์ Notebook ส่งตามช่องทางที่ผู้สอนกำหนด','เตรียมความพร้อมสำหรับสัปดาห์ที่ 2: การคัดกรองและจัดเตรียมข้อมูลด้วยกระบวนการ ETL'],1);w1_summary['type']='summary';tuesday_slides.append(w1_summary)
 old1['slides']=monday_slides+tuesday_slides;old1['files']=w1_spec['files']
 end1=md('## สรุปและส่งงาน\n\nตรวจสอบว่าได้รันคำสั่งครบทั้ง 9 ขั้นตอน และทำแบบฝึกหัดท้ายคาบครบทั้ง 5 ข้อ จากนั้นบันทึกไฟล์ Notebook (`.ipynb`) ส่งตามช่องทางที่ผู้สอนกำหนด\n')
 w1_learners.append(end1);w1_refs.append(end1)
 ex_sheet_student='# ใบงานแบบฝึกหัดปฏิบัติการท้ายคาบเรียน (เวลา 30 นาที · 10 คะแนน)\n**รายวิชา:** 31901-2012 การวิเคราะห์และนำเสนอข้อมูล · **สัปดาห์ที่ 1 วันอังคาร**\n**ชุดข้อมูลที่ใช้:** `nvc_tech_store.csv` (ตารางข้อมูล `df`)\n\n---\n\n'+'\n'.join(f'## {qt}\n- **โจทย์:** {qp}\n- **คำสั่งที่ใช้:** `............................................................`\n- **สรุปคำตอบจากผลลัพธ์:** `............................................................`\n' for qt,qp,_,_ in w1_ex_questions)
 ex_sheet_teacher='# เฉลยใบงานแบบฝึกหัดปฏิบัติการท้ายคาบเรียน (เวลา 30 นาที · 10 คะแนน)\n**รายวิชา:** 31901-2012 การวิเคราะห์และนำเสนอข้อมูล · **สัปดาห์ที่ 1 วันอังคาร (สำหรับผู้สอน)**\n**ชุดข้อมูลที่ใช้:** `nvc_tech_store.csv` (ตารางข้อมูล `df`)\n\n---\n\n'+'\n'.join(f'## {qt}\n- **โจทย์:** {qp}\n- **คำสั่งเฉลย:**\n```python\n{qc}\n```\n- **แนวคำตอบ (2 คะแนน):** {qa}\n' for qt,qp,qc,qa in w1_ex_questions)
 (folder1/'แบบฝึกหัดท้ายคาบ_สัปดาห์01_อังคาร.md').write_text(ex_sheet_student)
 (base/'สำหรับครู/เฉลยแบบฝึกหัดท้ายคาบ_สัปดาห์01_อังคาร.md').write_text(ex_sheet_teacher)
 for path in [base/'Notebook_ฝึกพิมพ์/W01.ipynb',base/'Notebook_ผู้เรียน/W01.ipynb',folder1/'W01_อังคาร_ฝึกเอง.ipynb']:save_nb(path,w1_learners)
 for path in [base/'สำหรับครู/W01_แนวเฉลย.ipynb',base/'Notebook_ตัวอย่าง/W01.ipynb',folder1/'W01_อังคาร_ตัวอย่าง.ipynb']:save_nb(path,w1_refs)
 (folder1/'บทเรียนสัปดาห์01_อ่านตามสไลด์.md').write_text('\n'.join(w1_reader))
 resources['1']['notebook']='ชุดเรียน/Notebook_ฝึกพิมพ์/W01.ipynb';resources['1']['practice']=True
 resources['1']['assessment']='การฝึกปฏิบัติในชั้นเรียน 9 ขั้นตอน (90 นาที) และแบบฝึกหัดท้ายคาบเรียน 5 ข้อ (30 นาที · 10 คะแนน)'
 resources['1']['files']=[
  {'name':'ไฟล์ชุดข้อมูล nvc_tech_store.csv (36 แถว 7 คอลัมน์)','url':'ชุดเรียน/ชุดข้อมูล/nvc_tech_store.csv'},
  {'name':'ใบงานแบบฝึกหัดปฏิบัติการท้ายคาบเรียน (5 ข้อ 10 คะแนน)','url':'ชุดเรียน/เรียนย้อนหลัง_สัปดาห์01/แบบฝึกหัดท้ายคาบ_สัปดาห์01_อังคาร.md'},
  {'name':'ไฟล์ Notebook สำหรับฝึกปฏิบัติ (W01.ipynb)','url':'ชุดเรียน/เรียนย้อนหลัง_สัปดาห์01/W01_อังคาร_ฝึกเอง.ipynb'},
  {'name':'ไฟล์ชุดข้อมูลตัวอย่าง students.csv (30 แถว)','url':'ชุดเรียน/ชุดข้อมูล/students.csv'},
  {'name':'เอกสารพจนานุกรมข้อมูล (คำอธิบายชุดข้อมูลและคอลัมน์)','url':'ชุดเรียน/ชุดข้อมูล/พจนานุกรมข้อมูล.md'},
  {'name':'เอกสารสรุปเนื้อหาประจำสัปดาห์ที่ 1','url':'ชุดเรียน/เรียนย้อนหลัง_สัปดาห์01/บทเรียนสัปดาห์01_อ่านตามสไลด์.md'}
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
