# -*- coding: utf-8 -*-
"""สร้างไฟล์งานวิจัยในชั้นเรียนจาก research_content.py

ผลลัพธ์
- src/research/researchContent.json  เนื้อหาสำหรับหน้าเว็บ (คำนวณผลลัพธ์ของทุกคำสั่งจากข้อมูลจริง)
- lesson-specs/week10.json  บทเรียนสัปดาห์ที่ 10 ชุดเดียวกับหน้าเว็บวิจัย
- public/วิจัย/W10_Modeling_ผู้เรียน.ipynb  Notebook สำหรับ Google Colab
- ../วิจัยในชั้นเรียน_Modeling_สัปดาห์10/02_เครื่องมือวิจัย.md  แบบทดสอบ เฉลย ตารางวิเคราะห์ และแบบประเมิน IOC
"""
import json
import os
from pathlib import Path

import pandas as pd

import research_content as rc
import research_plan

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / 'public' / 'วิจัย'
OUT_JSON = ROOT / 'src' / 'research' / 'researchContent.json'
DOC_DIR = ROOT.parent / 'วิจัยในชั้นเรียน_Modeling_สัปดาห์10'
LETTERS = ['ก', 'ข', 'ค', 'ง']


def run_steps():
    """รันคำสั่งทุกขั้นตามลำดับ แล้วเก็บผลลัพธ์ที่แสดงใน Colab"""
    pd.set_option('display.unicode.east_asian_width', True)
    env = {}
    cwd = os.getcwd()
    os.chdir(DATA)
    try:
        for act in rc.ACTIVITIES:
            for step in act['steps']:
                code = step['code']
                try:
                    compiled = compile(code, '<step>', 'eval')
                except SyntaxError:
                    exec(code, env)
                    step['output'] = ''
                    continue
                value = eval(compiled, env)
                if isinstance(value, pd.DataFrame):
                    step['output'] = value.to_string()
                elif isinstance(value, pd.Series):
                    step['output'] = str(value)
                else:
                    step['output'] = repr(value)
    finally:
        os.chdir(cwd)


def check_content():
    ids = set()
    for item in rc.TEST_ITEMS + [q for a in rc.ACTIVITIES for q in a['quiz']]:
        assert item['id'] not in ids, item['id']
        ids.add(item['id'])
        assert len(item['choices']) == 4 and 0 <= item['answer'] < 4, item['id']
    for act in rc.ACTIVITIES:
        for step in act['steps']:
            assert '____' in step['template'], step['title']
            filled = step['template'].replace('____', step['accept'][0])
            assert filled == step['code'], (filled, step['code'])


def write_json():
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    content = {
        'objectives': rc.OBJECTIVES,
        'test': {'minutes': 25, 'items': rc.TEST_ITEMS},
        'activities': rc.ACTIVITIES,
        'survey': rc.SURVEY,
    }
    OUT_JSON.write_text(json.dumps(content, ensure_ascii=False, indent=1), encoding='utf-8')


def write_week_spec():
    """สร้าง lesson-specs/week10.json จากกิจกรรมเดียวกับหน้าเว็บวิจัย เพื่อให้สไลด์และเว็บตรงกันเสมอ"""
    steps = []
    details = iter(rc.STEP_DETAILS)
    for act in rc.ACTIVITIES:
        day = rc.WEEK10['day_of_activity'][act['id']]
        for st in act['steps']:
            d = next(details)
            steps.append({
                'day': day, 'title': st['title'], 'code': st['code'], 'meaning': st['meaning'],
                'parts': [{'token': t, 'meaning': m} for t, m in d['parts']],
                'interpretation': st['interpretation'], 'mistake': d['mistake'], 'checkpoint': d['checkpoint'],
            })
    assert next(details, None) is None, 'STEP_DETAILS มีจำนวนไม่ตรงกับขั้นตอน'
    spec = {'week': 10, 'goals': rc.WEEK10['goals'], 'files': ['menu.csv', 'sales.csv'],
            'concepts': rc.WEEK10['concepts'], 'steps': steps}
    (ROOT / 'lesson-specs' / 'week10.json').write_text(json.dumps(spec, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def write_week_plan():
    spec = json.loads((ROOT / 'lesson-specs' / 'week10.json').read_text(encoding='utf-8'))
    DOC_DIR.mkdir(exist_ok=True)
    (DOC_DIR / research_plan.SOURCE_FILENAME).write_text(research_plan.render(spec, rc.OBJECTIVES), encoding='utf-8')


def write_notebook():
    cells = [{
        'cell_type': 'markdown', 'metadata': {},
        'source': ['# สัปดาห์ที่ 10 การสร้างแบบจำลองข้อมูล (Data Modeling)\n',
                   '\n',
                   'อัปโหลดไฟล์ `menu.csv` และ `sales.csv` ไปยังพื้นที่ทำงานของ Google Colab ก่อนเริ่มกิจกรรม\n',
                   '\n',
                   'แต่ละขั้นมีคำสั่งที่เว้นช่องว่าง `____` ให้ผู้เรียนเติมคำสั่งให้ครบ แล้วรันเซลล์และตรวจสอบผลลัพธ์กับหน้าเว็บกิจกรรม'],
    }]
    for act in rc.ACTIVITIES:
        cells.append({'cell_type': 'markdown', 'metadata': {},
                      'source': [f"## {act['title']}\n", '\n', f"เป้าหมาย: {act['goal']}"]})
        for i, step in enumerate(act['steps'], 1):
            cells.append({'cell_type': 'markdown', 'metadata': {},
                          'source': [f"### ขั้นที่ {i} {step['title']}\n", '\n', step['meaning']]})
            cells.append({'cell_type': 'code', 'metadata': {}, 'execution_count': None,
                          'outputs': [], 'source': [step['template']]})
    nb = {'cells': cells, 'metadata': {'kernelspec': {'display_name': 'Python 3', 'language': 'python', 'name': 'python3'},
                                        'language_info': {'name': 'python'}},
          'nbformat': 4, 'nbformat_minor': 5}
    (DATA / 'W10_Modeling_ผู้เรียน.ipynb').write_text(json.dumps(nb, ensure_ascii=False, indent=1), encoding='utf-8')


def write_instruments():
    DOC_DIR.mkdir(exist_ok=True)
    L = []
    L.append('# เครื่องมือที่ใช้ในการวิจัย')
    L.append('')
    L.append('เรื่อง การสร้างแบบจำลองข้อมูล (Data Modeling) รายวิชา 31901-2012 การวิเคราะห์และนำเสนอข้อมูล')
    L.append('')
    L.append('> เอกสารนี้สร้างจากไฟล์ `dva-slides/scripts/research_content.py` ซึ่งเป็นต้นฉบับเดียวกับหน้าเว็บ หากแก้ไขข้อสอบให้แก้ไขที่ไฟล์ดังกล่าวแล้วรัน `python3 scripts/build_research.py`')
    L.append('')
    L.append('## 1. จุดประสงค์เชิงพฤติกรรม')
    L.append('')
    for o in rc.OBJECTIVES:
        L.append(f"- **{o['id']}** {o['text']}")
    L.append('')

    # ตารางวิเคราะห์ข้อสอบ
    levels = ['จำ', 'เข้าใจ', 'นำไปใช้', 'วิเคราะห์']
    L.append('## 2. ตารางวิเคราะห์ข้อสอบ (Table of Specifications)')
    L.append('')
    L.append('| จุดประสงค์ | ' + ' | '.join(levels) + ' | รวม |')
    L.append('|---|' + '---|' * (len(levels) + 1))
    totals = [0] * len(levels)
    for o in rc.OBJECTIVES:
        row = []
        for j, lv in enumerate(levels):
            n = [it['id'] for it in rc.TEST_ITEMS if it['objective'] == o['id'] and it['level'] == lv]
            totals[j] += len(n)
            row.append(f"{len(n)} ({', '.join(x[1:] for x in n)})" if n else '–')
        count = sum(1 for it in rc.TEST_ITEMS if it['objective'] == o['id'])
        L.append(f"| {o['id']} | " + ' | '.join(row) + f' | {count} |')
    L.append('| **รวม** | ' + ' | '.join(str(t) for t in totals) + f' | **{len(rc.TEST_ITEMS)}** |')
    L.append('')
    L.append('ตัวเลขในวงเล็บคือหมายเลขข้อสอบ')
    L.append('')

    L.append('## 3. แบบทดสอบวัดผลสัมฤทธิ์ทางการเรียน (ก่อนเรียนและหลังเรียน)')
    L.append('')
    L.append(f'แบบปรนัย 4 ตัวเลือก จำนวน {len(rc.TEST_ITEMS)} ข้อ ข้อละ 1 คะแนน เวลา 25 นาที ใช้ชุดเดียวกันทั้งก่อนเรียนและหลังเรียน โดยระบบสลับลำดับข้อของผู้เรียนแต่ละคน')
    L.append('')
    for n, it in enumerate(rc.TEST_ITEMS, 1):
        L.append(f"**{n}. {it['stem']}**")
        L.append('')
        for k, c in enumerate(it['choices']):
            L.append(f"{LETTERS[k]}. {c}  ")
        L.append('')
    L.append('### เฉลยแบบทดสอบ')
    L.append('')
    L.append('| ข้อ | เฉลย | จุดประสงค์ | ระดับพฤติกรรม | คำอธิบาย |')
    L.append('|---|---|---|---|---|')
    for n, it in enumerate(rc.TEST_ITEMS, 1):
        L.append(f"| {n} | {LETTERS[it['answer']]} | {it['objective']} | {it['level']} | {it['explain']} |")
    L.append('')

    L.append('## 4. แบบฝึกระหว่างเรียน (ใช้คำนวณประสิทธิภาพของกระบวนการ E1)')
    L.append('')
    for act in rc.ACTIVITIES:
        L.append(f"### {act['title']} ({len(act['quiz'])} คะแนน)")
        L.append('')
        for n, q in enumerate(act['quiz'], 1):
            L.append(f"**{n}. {q['stem']}**")
            L.append('')
            for k, c in enumerate(q['choices']):
                L.append(f"{LETTERS[k]}. {c}  ")
            L.append('')
        L.append('เฉลย: ' + ', '.join(f"{n}) {LETTERS[q['answer']]}" for n, q in enumerate(act['quiz'], 1)))
        L.append('')

    L.append('## 5. แบบประเมินความพึงพอใจ')
    L.append('')
    L.append('มาตราส่วนประมาณค่า 5 ระดับ: 5 = มากที่สุด, 4 = มาก, 3 = ปานกลาง, 2 = น้อย, 1 = น้อยที่สุด')
    L.append('')
    L.append('| ข้อ | รายการประเมิน | 5 | 4 | 3 | 2 | 1 |')
    L.append('|---|---|---|---|---|---|---|')
    n = 0
    for asp in rc.SURVEY['aspects']:
        L.append(f"| | **{asp['name']}** | | | | | |")
        for it in asp['items']:
            n += 1
            L.append(f"| {n} | {it['text']} | | | | | |")
    L.append('')
    L.append(f"ตอนที่ 2 {rc.SURVEY['open']} ......................................................")
    L.append('')
    L.append('เกณฑ์การแปลความหมายค่าเฉลี่ย: 4.51–5.00 มากที่สุด, 3.51–4.50 มาก, 2.51–3.50 ปานกลาง, 1.51–2.50 น้อย, 1.00–1.50 น้อยที่สุด')
    L.append('')

    L.append('## 6. แบบประเมินความสอดคล้อง (IOC) สำหรับผู้เชี่ยวชาญ')
    L.append('')
    L.append('ให้ผู้เชี่ยวชาญพิจารณาความสอดคล้องระหว่างข้อสอบกับจุดประสงค์ +1 = สอดคล้อง, 0 = ไม่แน่ใจ, −1 = ไม่สอดคล้อง')
    L.append('เกณฑ์: ข้อที่มีค่า IOC ตั้งแต่ 0.50 ขึ้นไปนำไปใช้ได้ (IOC = ΣR / N)')
    L.append('')
    L.append('| ข้อ | จุดประสงค์ | +1 | 0 | −1 | ข้อเสนอแนะ |')
    L.append('|---|---|---|---|---|---|')
    for n, it in enumerate(rc.TEST_ITEMS, 1):
        L.append(f"| {n} | {it['objective']} | | | | |")
    L.append('')
    L.append('ลงชื่อ ........................................ ผู้เชี่ยวชาญ  ')
    L.append('(........................................)  ')
    L.append('ตำแหน่ง ........................................')
    L.append('')
    (DOC_DIR / '02_เครื่องมือวิจัย.md').write_text('\n'.join(L), encoding='utf-8')


if __name__ == '__main__':
    check_content()
    run_steps()
    write_json()
    write_week_spec()
    write_week_plan()
    write_notebook()
    write_instruments()
    print('สร้างไฟล์งานวิจัยเรียบร้อย:', OUT_JSON.relative_to(ROOT), '| Notebook | เครื่องมือวิจัย')
