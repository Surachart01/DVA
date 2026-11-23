"""Synchronize safe learner assets and create weekly/course download archives."""
from pathlib import Path
import json,shutil,zipfile
project=Path(__file__).resolve().parents[1];root=project.parent;base=root/'ชุดพร้อมสอน_31901-2012';public=project/'public/ชุดเรียน'
deck_file=project/'src/teachingDeck.js';deck=json.loads(deck_file.read_text().split('=',1)[1].strip().rstrip(';'))
# Learners see the slides, so a question must never show its answer: drop review-slide answers
# and any "(คำตอบ: ...)" written after a question. Teacher plans and answer notebooks keep them.
import re
answer_note=re.compile(r'\s*\((?:คำตอบ|เฉลย|แนวคำตอบ)\s*[:：][^)]*\)')
for week_data in deck:
 for slide in week_data['slides']:
  for q in slide.get('questions') or []:
   if isinstance(q,dict):q.pop('answer',None)
  for key in ('checkpoint','interpretation','expected'):
   if isinstance(slide.get(key),str):slide[key]=answer_note.sub('',slide[key])
deck_file.write_text('export const teachingDeck = '+json.dumps(deck,ensure_ascii=False,indent=2)+';\n')
resource_file=project/'src/courseResources.js';resources=json.loads(resource_file.read_text().split('=',1)[1].strip().rstrip(';'))
examples=base/'ตัวอย่างบทเรียน';public_examples=public/'ตัวอย่าง';public_examples.mkdir(parents=True,exist_ok=True)
def is_answer(p):
 # Learners can see everything packaged here: leave out complete example notebooks,
 # result files produced by the lesson steps, teacher keys and exam data.
 name=p.name
 return (name.endswith('_ตัวอย่าง.ipynb') or 'Example' in name or 'Answer' in name or 'Teacher' in name
  or 'เฉลย' in name or name.startswith('midterm_') or 'Notebook_ตัวอย่าง' in p.parts
  or (p.parent.name in ('ตัวอย่าง','ตัวอย่างบทเรียน') and p.suffix.lower() in ('.csv','.xlsx','.ipynb')))
for p in examples.iterdir():
 if p.is_file() and not is_answer(p):shutil.copy2(p,public_examples/p.name)
for week in deck:
 n=week['week'];tag=f'W{n:02}';folder=base/f'เรียนย้อนหลัง_สัปดาห์{n:02}';folder.mkdir(exist_ok=True)
 for f in week['files']:
  source=base/'ชุดข้อมูล'/f
  if source.is_file():shutil.copy2(source,folder/f)
 dictionary=base/'ชุดข้อมูล/พจนานุกรมข้อมูล.md';shutil.copy2(dictionary,folder/dictionary.name)
 if n in (8,14,15):
  nb=base/'Notebook_ผู้เรียน'/f'{tag}.ipynb'
  if nb.exists():shutil.copy2(nb,folder/f'{tag}_ผู้เรียน.ipynb')
 samplefiles=[p for p in examples.iterdir() if p.is_file() and p.name.startswith(tag+'_')]
 if samplefiles:
  target=folder/'ตัวอย่าง';target.mkdir(exist_ok=True)
  for p in samplefiles:shutil.copy2(p,target/p.name)
  if any(p.suffix=='.html' for p in samplefiles):shutil.copy2(examples/'plotly.min.js',target/'plotly.min.js')
 archive=base/f'สัปดาห์{n:02}_เรียนย้อนหลัง.zip'
 with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
  for p in sorted(folder.rglob('*')):
   if p.is_file() and p.name!='.DS_Store' and not is_answer(p):z.write(p,folder.name+'/'+str(p.relative_to(folder)))
 target=public/folder.name
 if target.exists():shutil.rmtree(target)
 shutil.copytree(folder,target,ignore=lambda d,names:[n for n in names if (Path(d)/n).is_file() and is_answer(Path(d)/n)])
 shutil.copy2(archive,public/archive.name)
 url='ชุดเรียน/'+archive.name
 if all(f['url']!=url for f in resources[str(n)]['files']):resources[str(n)]['files'].append({'name':f'ชุดเรียนย้อนหลัง สัปดาห์ {n} (รวมทุกไฟล์)','url':url})
resource_file.write_text('export const courseResources = '+json.dumps(resources,ensure_ascii=False,indent=2)+';\n')
# Use an explicit student allowlist. Do not expose teacher exams, answer keys or grade workbooks.
# Complete example notebooks (Notebook_ตัวอย่าง) are answer keys and stay in the teacher pack.
folders=['Notebook_ฝึกพิมพ์','Notebook_ผู้เรียน','ชุดข้อมูล','แผนรายสัปดาห์']
stale=public/'Notebook_ตัวอย่าง'
if stale.exists():shutil.rmtree(stale)
for name in folders:
 target=public/name;target.mkdir(parents=True,exist_ok=True)
 for p in (base/name).iterdir():
  if p.is_file() and p.name!='.DS_Store' and not is_answer(p):shutil.copy2(p,target/p.name)
  elif (target/p.name).exists() and is_answer(p):(target/p.name).unlink()
for p in list(public_examples.iterdir()):
 if p.is_file() and is_answer(p):p.unlink()
for name in ['คู่มือผู้เรียน.md','ตารางสอนแยกรายวัน.md','โครงสร้างรายวิชา.json']:
 shutil.copy2(base/name,public/name)
student=root/'ชุดแจกผู้เรียน_31901-2012.zip'
with zipfile.ZipFile(student,'w',zipfile.ZIP_DEFLATED) as z:
 for name in folders:
  for p in sorted((base/name).rglob('*')):
   if p.is_file() and p.name!='.DS_Store' and not is_answer(p):z.write(p,p.relative_to(base))
 for folder in sorted(base.glob('เรียนย้อนหลัง_สัปดาห์*')):
  for p in sorted(folder.rglob('*')):
   if p.is_file() and p.name!='.DS_Store' and not is_answer(p):z.write(p,p.relative_to(base))
 for p in sorted(examples.iterdir()):
  if p.is_file() and not is_answer(p):z.write(p,'ตัวอย่าง/'+p.name)
 for name in ['คู่มือผู้เรียน.md','ตารางสอนแยกรายวัน.md','โครงสร้างรายวิชา.json']:
  z.write(base/name,name)
 for p in sorted(base.glob('สัปดาห์*_เรียนย้อนหลัง.zip')):z.write(p,p.name)
print('Packaged 15 retrospective archives and safe learner course archive.',flush=True)
