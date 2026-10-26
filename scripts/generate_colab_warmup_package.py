#!/usr/bin/env python3
"""Generate Google Colab hands-on worksheet (.docx) and teacher key for Week 2 Warmup (10 Data Exploration Questions)."""

from pathlib import Path
import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

FONT_NAME = "TH Sarabun New"

def set_cell_background(cell, hex_color):
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def set_cell_margins(cell, top=120, bottom=120, left=160, right=160):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def set_cell_border(cell, **kwargs):
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = parse_xml(f'<w:tcBorders {nsdecls("w")}/>')
    for edge in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
        edge_data = kwargs.get(edge)
        if edge_data:
            tag = f'<w:{edge} {nsdecls("w")} w:val="{edge_data.get("val", "single")}" w:sz="{edge_data.get("sz", "4")}" w:space="{edge_data.get("space", "0")}" w:color="{edge_data.get("color", "CBD5E1")}"/>'
            tcBorders.append(parse_xml(tag))
        else:
            tag = f'<w:{edge} {nsdecls("w")} w:val="none"/>'
            tcBorders.append(parse_xml(tag))
    tcPr.append(tcBorders)

def apply_run_font(run, font_name=FONT_NAME, size_pt=16, bold=False, italic=False, color_rgb=(15, 23, 42)):
    run.font.name = font_name
    run.font.size = Pt(size_pt)
    run.bold = bold
    run.italic = italic
    run.font.color.rgb = RGBColor(*color_rgb)
    rPr = run._r.get_or_add_rPr()
    rFonts = parse_xml(f'<w:rFonts {nsdecls("w")} w:ascii="{font_name}" w:hAnsi="{font_name}" w:cs="{font_name}"/>')
    rPr.append(rFonts)

def add_p(doc, text="", font_name=FONT_NAME, size_pt=16, bold=False, italic=False, color_rgb=(15, 23, 42), align=WD_ALIGN_PARAGRAPH.LEFT, space_before=0, space_after=3):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15
    if text:
        run = p.add_run(text)
        apply_run_font(run, font_name, size_pt, bold, italic, color_rgb)
    return p

def add_code_box(doc, placeholder="# เขียนคำสั่งภาษา Python ในเซลล์ Google Colab แล้วคัดลอกมาวางในกรอบนี้\n\n"):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    cell = table.rows[0].cells[0]
    cell.width = Inches(6.8)
    set_cell_background(cell, "F1F5F9")
    set_cell_margins(cell, top=140, bottom=140, left=180, right=180)
    set_cell_border(cell, top=dict(val='single', sz='4', color='94A3B8'),
                          bottom=dict(val='single', sz='4', color='94A3B8'),
                          left=dict(val='single', sz='12', color='0284C7'),
                          right=dict(val='single', sz='4', color='94A3B8'))
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run(placeholder)
    apply_run_font(r, font_name="Courier New", size_pt=13, color_rgb=(51, 65, 85))

def add_answer_box(doc, placeholder="[ พิมพ์ผลลัพธ์หรือคำอธิบายที่ได้จากหน้าจอ Google Colab ลงในกรอบนี้ ]\n"):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    cell = table.rows[0].cells[0]
    cell.width = Inches(6.8)
    set_cell_background(cell, "FAFAFA")
    set_cell_margins(cell, top=140, bottom=140, left=180, right=180)
    set_cell_border(cell, top=dict(val='single', sz='4', color='CBD5E1'),
                          bottom=dict(val='single', sz='4', color='CBD5E1'),
                          left=dict(val='single', sz='12', color='10B981'),
                          right=dict(val='single', sz='4', color='CBD5E1'))
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run(placeholder)
    apply_run_font(r, font_name=FONT_NAME, size_pt=15, color_rgb=(71, 85, 105))

def add_teacher_code_box(doc, code_text):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    cell = table.rows[0].cells[0]
    cell.width = Inches(6.8)
    set_cell_background(cell, "F8FAFC")
    set_cell_margins(cell, top=120, bottom=120, left=160, right=160)
    set_cell_border(cell, top=dict(val='single', sz='4', color='94A3B8'),
                          bottom=dict(val='single', sz='4', color='94A3B8'),
                          left=dict(val='single', sz='14', color='2563EB'),
                          right=dict(val='single', sz='4', color='94A3B8'))
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run(code_text)
    apply_run_font(r, font_name="Courier New", size_pt=13, color_rgb=(15, 23, 42))

def add_teacher_answer_box(doc, ans_text):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    cell = table.rows[0].cells[0]
    cell.width = Inches(6.8)
    set_cell_background(cell, "F0FDF4")
    set_cell_margins(cell, top=120, bottom=120, left=160, right=160)
    set_cell_border(cell, top=dict(val='single', sz='4', color='BBF7D0'),
                          bottom=dict(val='single', sz='4', color='BBF7D0'),
                          left=dict(val='single', sz='14', color='16A34A'),
                          right=dict(val='single', sz='4', color='BBF7D0'))
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run(ans_text)
    apply_run_font(r, font_name=FONT_NAME, size_pt=15, color_rgb=(20, 83, 45))

def generate_student_worksheet(output_path: Path):
    doc = docx.Document()
    for s in doc.sections:
        s.top_margin = Inches(0.7)
        s.bottom_margin = Inches(0.7)
        s.left_margin = Inches(0.85)
        s.right_margin = Inches(0.85)

    # Header
    add_p(doc, "ใบงานปฏิบัติการใน Google Colab (Google Docs Worksheet)", size_pt=20, bold=True, color_rgb=(14, 116, 144), align=WD_ALIGN_PARAGRAPH.CENTER, space_after=2)
    add_p(doc, "รายวิชา 31901-2012 การวิเคราะห์และนำเสนอข้อมูล · สัปดาห์ที่ 2 วันจันทร์", size_pt=16, bold=True, color_rgb=(51, 65, 85), align=WD_ALIGN_PARAGRAPH.CENTER, space_after=2)
    add_p(doc, "หัวข้อ: การทดลองรันคำสั่งบน Google Colab และบันทึกผลการสำรวจและวิเคราะห์ข้อมูล 9 ข้อ (เวลา 30 นาที · 10 คะแนน)", size_pt=14, bold=False, italic=True, color_rgb=(71, 85, 105), align=WD_ALIGN_PARAGRAPH.CENTER, space_after=8)

    # Student Info Table
    info_table = doc.add_table(rows=2, cols=2)
    info_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    info_table.autofit = False
    col_w = [Inches(3.4), Inches(3.4)]
    fields = [
        [("ชื่อ-นามสกุล: ", "................................................................"), ("รหัสนักศึกษา: ", "................................................................")],
        [("ระดับชั้น / สาขาวิชา: ", "สสส.2 / เทคโนโลยีสารสนเทศ"), ("วันที่ปฏิบัติงาน: ", "................................................................")]
    ]
    for r_idx, row in enumerate(info_table.rows):
        for c_idx, cell in enumerate(row.cells):
            cell.width = col_w[c_idx]
            set_cell_background(cell, "F8FAFC")
            set_cell_margins(cell, top=80, bottom=80, left=140, right=140)
            set_cell_border(cell, top=dict(val='single', sz='4', color='CBD5E1'),
                                  bottom=dict(val='single', sz='4', color='CBD5E1'),
                                  left=dict(val='single', sz='4', color='CBD5E1'),
                                  right=dict(val='single', sz='4', color='CBD5E1'))
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            lbl, dots = fields[r_idx][c_idx]
            r1 = p.add_run(lbl)
            apply_run_font(r1, bold=True, size_pt=14, color_rgb=(30, 41, 59))
            r2 = p.add_run(dots)
            apply_run_font(r2, bold=False, size_pt=14, color_rgb=(71, 85, 105))

    add_p(doc, "", space_after=4)

    # Instructions Box
    guide_table = doc.add_table(rows=1, cols=1)
    guide_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    guide_table.autofit = False
    g_cell = guide_table.rows[0].cells[0]
    g_cell.width = Inches(6.8)
    set_cell_background(g_cell, "EFF6FF")
    set_cell_margins(g_cell, top=100, bottom=100, left=160, right=160)
    set_cell_border(g_cell, top=dict(val='single', sz='4', color='BFDBFE'),
                            bottom=dict(val='single', sz='4', color='BFDBFE'),
                            left=dict(val='single', sz='12', color='2563EB'),
                            right=dict(val='single', sz='4', color='BFDBFE'))
    gp = g_cell.paragraphs[0]
    gp.paragraph_format.space_before = Pt(0)
    gp.paragraph_format.space_after = Pt(0)
    r_g = gp.add_run(
        "ขั้นตอนการปฏิบัติการ (Google Colab → Google Docs):\n"
        "1. ดาวน์โหลดไฟล์ชุดข้อมูล nvc_tech_store.csv จากระบบการสอนประจำสัปดาห์ที่ 2\n"
        "2. เปิดโปรแกรม Google Colab (https://colab.research.google.com) สร้างสมุดงานใหม่ แล้วอัปโหลดไฟล์ nvc_tech_store.csv ทางเมนู Files ด้านซ้าย\n"
        "3. เขียนคำสั่งภาษา Python ด้วยตนเองตามโจทย์ข้อที่ 1 ถึง 9 แล้วกดปุ่ม Shift + Enter เพื่อรันคำสั่งในแต่ละขั้นตอน\n"
        "4. คัดลอกคำสั่งภาษา Python ที่รันสำเร็จลงในกรอบโค้ด และอ่านค่าผลลัพธ์ที่ปรากฏจริงบนหน้าจอ Colab มาพิมพ์ตอบลงในเอกสารนี้"
    )
    apply_run_font(r_g, size_pt=14, color_rgb=(30, 58, 138))

    # Dataset Schema Table
    add_p(doc, "โครงสร้างตารางข้อมูลต้นฉบับ: nvc_tech_store.csv", size_pt=15, bold=True, color_rgb=(15, 23, 42), space_before=8, space_after=3)
    ds_table = doc.add_table(rows=8, cols=3)
    ds_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    ds_table.autofit = False
    headers = ["ชื่อคอลัมน์", "ชนิดข้อมูล", "ความหมายของข้อมูล"]
    col_w_ds = [Inches(1.8), Inches(1.3), Inches(3.7)]
    for c_i, h in enumerate(headers):
        cell = ds_table.rows[0].cells[c_i]
        cell.width = col_w_ds[c_i]
        set_cell_background(cell, "E2E8F0")
        set_cell_margins(cell, top=70, bottom=70, left=100, right=100)
        set_cell_border(cell, top=dict(val='single', sz='4', color='94A3B8'),
                              bottom=dict(val='single', sz='4', color='94A3B8'),
                              left=dict(val='single', sz='4', color='94A3B8'),
                              right=dict(val='single', sz='4', color='94A3B8'))
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h)
        apply_run_font(r, bold=True, size_pt=13, color_rgb=(30, 41, 59))

    rows_data = [
        ("order_id", "string", "รหัสคำสั่งซื้อ (เช่น ORD-101)"),
        ("customer_phone", "string", "หมายเลขโทรศัพท์ลูกค้า (ขึ้นต้นด้วยเลข 0)"),
        ("product_name", "string", "ชื่อสินค้าอุปกรณ์เทคโนโลยี"),
        ("category", "string", "หมวดหมู่สินค้า"),
        ("quantity", "float64", "จำนวนชิ้นสินค้าที่สั่งซื้อ"),
        ("total_price", "float64", "ยอดเงินรวมต่อรายการคำสั่งซื้อ (บาท)"),
        ("payment_status", "string", "สถานะการชำระเงิน (ชำระแล้ว, รอชำระ, คืนเงิน)")
    ]
    for r_i, data in enumerate(rows_data, 1):
        for c_i, val in enumerate(data):
            cell = ds_table.rows[r_i].cells[c_i]
            cell.width = col_w_ds[c_i]
            set_cell_background(cell, "FFFFFF" if r_i % 2 == 1 else "F8FAFC")
            set_cell_margins(cell, top=60, bottom=60, left=100, right=100)
            set_cell_border(cell, top=dict(val='single', sz='2', color='E2E8F0'),
                                  bottom=dict(val='single', sz='2', color='E2E8F0'),
                                  left=dict(val='single', sz='2', color='E2E8F0'),
                                  right=dict(val='single', sz='2', color='E2E8F0'))
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            apply_run_font(r, font_name="Courier New" if c_i == 0 else FONT_NAME, size_pt=13, color_rgb=(51, 65, 85))

    add_p(doc, "", space_after=6)

    # -------------------------------------------------------------
    # Question 1: Import & Read with Dtype
    # -------------------------------------------------------------
    add_p(doc, "ข้อที่ 1: การนำเข้าไลบรารี Pandas และการกำหนดชนิดข้อมูลหมายเลขโทรศัพท์ (1 คะแนน)", size_pt=16, bold=True, color_rgb=(14, 116, 144), space_before=8, space_after=2)
    add_p(doc, "คำชี้แจง: ให้ผู้เรียนเขียนคำสั่งนำเข้าไลบรารี pandas ในชื่อย่อ pd จากนั้นอ่านไฟล์ nvc_tech_store.csv เข้าสู่ตัวแปรตาราง df โดยกำหนดให้คอลัมน์ customer_phone มีชนิดข้อมูลเป็นข้อความ (string)", size_pt=14, color_rgb=(51, 65, 85), space_after=3)
    add_p(doc, "1.1 คำสั่งภาษา Python ที่รันสำเร็จใน Google Colab:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=2, space_after=2)
    add_code_box(doc, "# ข้อ 1.1: พิมพ์คำสั่งนำเข้า pandas และอ่านไฟล์ nvc_tech_store.csv ตรงนี้\n\n")
    add_p(doc, "1.2 คำถามตรวจสอบความเข้าใจ:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=3, space_after=2)
    add_p(doc, "• เพราะเหตุใดจึงต้องระบุพารามิเตอร์ dtype={'customer_phone': 'string'} แทนการปล่อยให้โปรแกรมกำหนดชนิดข้อมูลเป็นตัวเลขตามค่าเริ่มต้น? (อธิบายผลกระทบต่อเลข 0 นำหน้า)", size_pt=14, space_after=2)
    add_answer_box(doc, "ตอบ: ............................................................................................................................................................................................................................................................................\n")

    # -------------------------------------------------------------
    # Question 2: Shape
    # -------------------------------------------------------------
    add_p(doc, "ข้อที่ 2: การตรวจสอบขนาดมิติของตารางข้อมูล (df.shape) (1 คะแนน)", size_pt=16, bold=True, color_rgb=(14, 116, 144), space_before=8, space_after=2)
    add_p(doc, "คำชี้แจง: ให้ผู้เรียนเขียนคำสั่งตรวจสอบขนาดมิติของตาราง df เพื่อทราบจำนวนแถวและจำนวนคอลัมน์ทั้งหมดของตารางข้อมูลต้นฉบับ", size_pt=14, color_rgb=(51, 65, 85), space_after=3)
    add_p(doc, "2.1 คำสั่งภาษา Python ที่รันสำเร็จใน Google Colab:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=2, space_after=2)
    add_code_box(doc, "# ข้อ 2.1: พิมพ์คำสั่งตรวจสอบขนาดมิติของตาราง df ตรงนี้\n\n")
    add_p(doc, "2.2 บันทึกผลลัพธ์และสรุปความหมาย:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=3, space_after=2)
    add_p(doc, "• ค่าคู่ลำดับ (Tuple) ที่ปรากฏบนจอ Google Colab คือ: ( ........................................ , ........................................ )", size_pt=14, space_after=2)
    add_p(doc, "• สรุปความหมาย: ตารางข้อมูลต้นฉบับนี้มีจำนวนแถวทั้งหมด ................... แถว และมีคอลัมน์ทั้งหมด ................... คอลัมน์", size_pt=14, space_after=4)

    # -------------------------------------------------------------
    # Question 3: Head
    # -------------------------------------------------------------
    add_p(doc, "ข้อที่ 3: การแสดงและตรวจสอบข้อมูลตัวอย่าง 5 แถวแรก (df.head) (1 คะแนน)", size_pt=16, bold=True, color_rgb=(14, 116, 144), space_before=8, space_after=2)
    add_p(doc, "คำชี้แจง: ให้ผู้เรียนเขียนคำสั่งแสดงข้อมูลตัวอย่าง 5 แถวแรกของตาราง df เพื่อสังเกตรูปแบบการบันทึกข้อมูลและตรวจสอบค่าว่างเบื้องต้น", size_pt=14, color_rgb=(51, 65, 85), space_after=3)
    add_p(doc, "3.1 คำสั่งภาษา Python ที่รันสำเร็จใน Google Colab:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=2, space_after=2)
    add_code_box(doc, "# ข้อ 3.1: พิมพ์คำสั่งแสดงข้อมูลตัวอย่าง 5 แถวแรกตรงนี้\n\n")
    add_p(doc, "3.2 บันทึกข้อมูลรหัสคำสั่งซื้อ (order_id) ของ 5 แถวแรก:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=3, space_after=2)
    add_p(doc, "• แถวดัชนี 0: ........................................ | แถวดัชนี 1: ........................................ | แถวดัชนี 2: ........................................", size_pt=14, space_after=2)
    add_p(doc, "• แถวดัชนี 3: ........................................ | แถวดัชนี 4: ........................................", size_pt=14, space_after=3)
    add_p(doc, "3.3 จากการสังเกตแถวดัชนี 3 (รหัส ORD-104) คอลัมน์ customer_phone แสดงผลลัพธ์ว่าอย่างไร และหมายถึงอะไร?", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=2, space_after=2)
    add_answer_box(doc, "ตอบ: ............................................................................................................................................................................................................................................................................\n")

    # -------------------------------------------------------------
    # Question 4: Tail
    # -------------------------------------------------------------
    add_p(doc, "ข้อที่ 4: การแสดงและตรวจสอบข้อมูลตัวอย่าง 5 แถวสุดท้าย (df.tail) (1 คะแนน)", size_pt=16, bold=True, color_rgb=(14, 116, 144), space_before=8, space_after=2)
    add_p(doc, "คำชี้แจง: ให้ผู้เรียนเขียนคำสั่งแสดงข้อมูลตัวอย่าง 5 แถวสุดท้ายของตาราง df เพื่อตรวจสอบความสมบูรณ์ของข้อมูลที่ส่วนท้ายตาราง", size_pt=14, color_rgb=(51, 65, 85), space_after=3)
    add_p(doc, "4.1 คำสั่งภาษา Python ที่รันสำเร็จใน Google Colab:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=2, space_after=2)
    add_code_box(doc, "# ข้อ 4.1: พิมพ์คำสั่งแสดงข้อมูลตัวอย่าง 5 แถวสุดท้ายตรงนี้\n\n")
    add_p(doc, "4.2 บันทึกผลลัพธ์จากแถวสุดท้ายของตาราง:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=3, space_after=2)
    add_p(doc, "• หมายเลขดัชนี (Index) ของแถวสุดท้ายคือ: ...................", size_pt=14, space_after=2)
    add_p(doc, "• รหัสคำสั่งซื้อ (order_id) ในแถวสุดท้ายคือ: ...................", size_pt=14, space_after=2)
    add_p(doc, "• ชื่อสินค้า (product_name) และยอดเงินรวม (total_price) ในแถวสุดท้ายคือ: ....................................................................................................", size_pt=14, space_after=3)
    add_p(doc, "4.3 คำถามตรวจสอบความเข้าใจ: เหตุใดตารางที่มี 36 แถว จึงมีดัชนีของแถวสุดท้ายเป็นหมายเลข 35?", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=2, space_after=2)
    add_answer_box(doc, "ตอบ: ............................................................................................................................................................................................................................................................................\n")

    # -------------------------------------------------------------
    # Question 5: Columns
    # -------------------------------------------------------------
    add_p(doc, "ข้อที่ 5: การสำรวจรายชื่อคอลัมน์และการจำแนกบทบาทของข้อมูล (df.columns) (1 คะแนน)", size_pt=16, bold=True, color_rgb=(14, 116, 144), space_before=8, space_after=2)
    add_p(doc, "คำชี้แจง: ให้ผู้เรียนเขียนคำสั่งแสดงรายชื่อคอลัมน์ทั้งหมดของตาราง df ด้วยคำสั่ง df.columns.tolist() และจัดหมวดหมู่คอลัมน์ตามลักษณะการใช้งาน", size_pt=14, color_rgb=(51, 65, 85), space_after=3)
    add_p(doc, "5.1 คำสั่งภาษา Python ที่รันสำเร็จใน Google Colab:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=2, space_after=2)
    add_code_box(doc, "# ข้อ 5.1: พิมพ์คำสั่งแสดงรายชื่อคอลัมน์ทั้งหมดตรงนี้\n\n")
    add_p(doc, "5.2 พิมพ์รายชื่อคอลัมน์ทั้ง 7 คอลัมน์ที่อ่านได้จาก Colab:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=3, space_after=2)
    add_answer_box(doc, "1) ........................................   2) ........................................   3) ........................................\n4) ........................................   5) ........................................   6) ........................................\n7) ........................................")
    add_p(doc, "5.3 จำแนกประเภทของคอลัมน์ตามบทบาทของข้อมูล:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=3, space_after=2)
    add_p(doc, "• คอลัมน์ที่เป็นรหัสระบุตัวตน (Identifier): ....................................................................................................................................", size_pt=14, space_after=2)
    add_p(doc, "• คอลัมน์ที่เป็นข้อมูลเชิงตัวเลข/การคำนวณมูลค่า (Numeric): .....................................................................................................................", size_pt=14, space_after=2)
    add_p(doc, "• คอลัมน์ที่เป็นข้อมูลเชิงข้อความ/จัดกลุ่ม (Categorical): ........................................................................................................................", size_pt=14, space_after=4)

    # -------------------------------------------------------------
    # Question 6: Dtypes
    # -------------------------------------------------------------
    add_p(doc, "ข้อที่ 6: การตรวจสอบชนิดข้อมูลของแต่ละคอลัมน์ (df.dtypes) (1 คะแนน)", size_pt=16, bold=True, color_rgb=(14, 116, 144), space_before=8, space_after=2)
    add_p(doc, "คำชี้แจง: ให้ผู้เรียนเขียนคำสั่งตรวจสอบชนิดข้อมูลของทุกคอลัมน์ในตาราง df ด้วยคำสั่ง df.dtypes เพื่อตรวจความพร้อมก่อนการคำนวณ", size_pt=14, color_rgb=(51, 65, 85), space_after=3)
    add_p(doc, "6.1 คำสั่งภาษา Python ที่รันสำเร็จใน Google Colab:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=2, space_after=2)
    add_code_box(doc, "# ข้อ 6.1: พิมพ์คำสั่งตรวจสอบชนิดข้อมูลตรงนี้\n\n")
    add_p(doc, "6.2 บันทึกชนิดข้อมูลของคอลัมน์ต่อไปนี้:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=3, space_after=2)
    add_p(doc, "• คอลัมน์ quantity มีชนิดข้อมูลคือ: ........................................ | คอลัมน์ total_price มีชนิดข้อมูลคือ: ........................................", size_pt=14, space_after=2)
    add_p(doc, "• คอลัมน์ customer_phone มีชนิดข้อมูลคือ: ........................................", size_pt=14, space_after=3)
    add_p(doc, "6.3 คำถามวิเคราะห์: เหตุใดคอลัมน์ quantity (จำนวนชิ้นสินค้า) จึงแสดงชนิดข้อมูลเป็น float64 (ทศนิยม) แทนที่จะเป็น int64 (จำนวนเต็ม)?", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=2, space_after=2)
    add_answer_box(doc, "ตอบ: ............................................................................................................................................................................................................................................................................\n")

    # -------------------------------------------------------------
    # Question 7: Info
    # -------------------------------------------------------------
    add_p(doc, "ข้อที่ 7: การตรวจสอบโครงสร้างตารางและความสมบูรณ์ของข้อมูล (df.info) (1 คะแนน)", size_pt=16, bold=True, color_rgb=(14, 116, 144), space_before=8, space_after=2)
    add_p(doc, "คำชี้แจง: ให้ผู้เรียนเขียนคำสั่งตรวจสอบโครงสร้างภาพรวมของตาราง df ด้วยคำสั่ง df.info() เพื่อดูภาพรวมหน่วยความจำและจำนวนข้อมูลที่ไม่เป็นค่าว่าง", size_pt=14, color_rgb=(51, 65, 85), space_after=3)
    add_p(doc, "7.1 คำสั่งภาษา Python ที่รันสำเร็จใน Google Colab:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=2, space_after=2)
    add_code_box(doc, "# ข้อ 7.1: พิมพ์คำสั่งตรวจสอบโครงสร้างตาราง df.info() ตรงนี้\n\n")
    add_p(doc, "7.2 บันทึกจำนวน Non-Null Count (จำนวนข้อมูลที่ไม่ใช่ค่าว่าง) ของคอลัมน์ต่อไปนี้:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=3, space_after=2)
    add_p(doc, "• คอลัมน์ order_id มีจำนวน: ................... non-null | คอลัมน์ customer_phone มีจำนวน: ................... non-null", size_pt=14, space_after=2)
    add_p(doc, "• คอลัมน์ quantity มีจำนวน: ................... non-null | คอลัมน์ total_price มีจำนวน: ................... non-null", size_pt=14, space_after=3)
    add_p(doc, "7.3 สรุปผลการตรวจสอบ: มีคอลัมน์ใดบ้างที่มีจำนวนข้อมูลไม่ครบ 36 รายการตามขนาดตาราง?", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=2, space_after=2)
    add_answer_box(doc, "ตอบ: ............................................................................................................................................................................................................................................................................\n")

    # -------------------------------------------------------------
    # Question 8: Missing Values
    # -------------------------------------------------------------
    add_p(doc, "ข้อที่ 8: การตรวจนับจำนวนข้อมูลสูญหายแยกตามรายคอลัมน์ (df.isna().sum) (1 คะแนน)", size_pt=16, bold=True, color_rgb=(14, 116, 144), space_before=8, space_after=2)
    add_p(doc, "คำชี้แจง: ให้ผู้เรียนเขียนคำสั่งนับจำนวนข้อมูลสูญหาย (ค่าว่าง / Missing Values) แยกตามรายคอลัมน์ด้วยคำสั่ง df.isna().sum()", size_pt=14, color_rgb=(51, 65, 85), space_after=3)
    add_p(doc, "8.1 คำสั่งภาษา Python ที่รันสำเร็จใน Google Colab:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=2, space_after=2)
    add_code_box(doc, "# ข้อ 8.1: พิมพ์คำสั่งนับจำนวนข้อมูลสูญหายตรงนี้\n\n")
    add_p(doc, "8.2 บันทึกจำนวนข้อมูลสูญหายที่ตรวจพบในแต่ละคอลัมน์:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=3, space_after=2)
    add_p(doc, "• customer_phone มีข้อมูลสูญหาย: ................... ค่า | quantity มีข้อมูลสูญหาย: ................... ค่า", size_pt=14, space_after=2)
    add_p(doc, "• total_price มีข้อมูลสูญหาย: ................... ค่า | รวมจำนวนข้อมูลสูญหายทั้งสิ้นในตาราง: ................... ตำแหน่ง", size_pt=14, space_after=3)
    add_p(doc, "8.3 วิเคราะห์ผลกระทบ: หากมีข้อมูลสูญหายในคอลัมน์ quantity และ total_price จะส่งผลต่อการคำนวณยอดขายรวมอย่างไร?", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=2, space_after=2)
    add_answer_box(doc, "ตอบ: ............................................................................................................................................................................................................................................................................\n")

    # -------------------------------------------------------------
    # Question 9: Describe & Outliers
    # -------------------------------------------------------------
    add_p(doc, "ข้อที่ 9: การคำนวณค่าสถิติเชิงพรรณนาและการตรวจจับค่าผิดปกติ (df.describe) (2 คะแนน)", size_pt=16, bold=True, color_rgb=(14, 116, 144), space_before=8, space_after=2)
    add_p(doc, "คำชี้แจง: ให้ผู้เรียนเขียนคำสั่งคำนวณค่าสถิติพื้นฐานของคอลัมน์ตัวเลขด้วยคำสั่ง df.describe() และวิเคราะห์หาค่าผิดปกติ (Outlier)", size_pt=14, color_rgb=(51, 65, 85), space_after=3)
    add_p(doc, "9.1 คำสั่งภาษา Python ที่รันสำเร็จใน Google Colab:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=2, space_after=2)
    add_code_box(doc, "# ข้อ 9.1: พิมพ์คำสั่งคำนวณค่าสถิติพื้นฐาน df.describe() ตรงนี้\n\n")
    add_p(doc, "9.2 บันทึกค่าสถิติที่อ่านได้จาก Colab:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=3, space_after=2)
    add_p(doc, "• คอลัมน์ quantity: ค่าต่ำสุด (min) = ................... | ค่าสูงสุด (max) = ................... | ค่าเฉลี่ย (mean) = ...................", size_pt=14, space_after=2)
    add_p(doc, "• คอลัมน์ total_price: ค่าต่ำสุด (min) = ................... | ค่าสูงสุด (max) = ................... | ค่าเฉลี่ย (mean) = ...................", size_pt=14, space_after=3)
    add_p(doc, "9.3 การวิเคราะห์ค่าผิดปกติ (Outlier):", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=2, space_after=2)
    add_p(doc, "• ในคอลัมน์ quantity พบค่าที่ผิดปกติคือค่าใด และมีความผิดปกติอย่างไร?\n  ตอบ: ........................................................................................................................................................................................................", size_pt=14, space_after=2)
    add_p(doc, "• ในคอลัมน์ total_price พบค่าที่ผิดปกติคือค่าใด และส่งผลให้ค่าเฉลี่ยคลาดเคลื่อนจากความเป็นจริงอย่างไร?\n  ตอบ: ........................................................................................................................................................................................................", size_pt=14, space_after=6)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(output_path))
    print(f"Generated student worksheet: {output_path}", flush=True)

def generate_teacher_key(output_path: Path):
    doc = docx.Document()
    for s in doc.sections:
        s.top_margin = Inches(0.7)
        s.bottom_margin = Inches(0.7)
        s.left_margin = Inches(0.85)
        s.right_margin = Inches(0.85)

    # Header
    add_p(doc, "คู่มือเฉลยใบงานปฏิบัติการใน Google Colab (สำหรับผู้สอน)", size_pt=20, bold=True, color_rgb=(180, 83, 9), align=WD_ALIGN_PARAGRAPH.CENTER, space_after=2)
    add_p(doc, "รายวิชา 31901-2012 การวิเคราะห์และนำเสนอข้อมูล · สัปดาห์ที่ 2 วันจันทร์", size_pt=16, bold=True, color_rgb=(51, 65, 85), align=WD_ALIGN_PARAGRAPH.CENTER, space_after=2)
    add_p(doc, "เฉลยแบบฝึกหัดทบทวนการวิเคราะห์และสำรวจตารางข้อมูลต้นฉบับ 9 ข้อ (เต็ม 10 คะแนน)", size_pt=14, bold=False, italic=True, color_rgb=(100, 116, 139), align=WD_ALIGN_PARAGRAPH.CENTER, space_after=8)

    # Teacher notice box
    notice_table = doc.add_table(rows=1, cols=1)
    notice_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    notice_table.autofit = False
    n_cell = notice_table.rows[0].cells[0]
    n_cell.width = Inches(6.8)
    set_cell_background(n_cell, "FEF3C7")
    set_cell_margins(n_cell, top=100, bottom=100, left=160, right=160)
    set_cell_border(n_cell, top=dict(val='single', sz='4', color='FDE68A'),
                            bottom=dict(val='single', sz='4', color='FDE68A'),
                            left=dict(val='single', sz='12', color='D97706'),
                            right=dict(val='single', sz='4', color='FDE68A'))
    np = n_cell.paragraphs[0]
    np.paragraph_format.space_before = Pt(0)
    np.paragraph_format.space_after = Pt(0)
    r_n = np.add_run(
        "เอกสารลับเฉพาะสำหรับผู้สอน (Teacher Only):\n"
        "เอกสารฉบับนี้จัดทำขึ้นเพื่อเป็นแนวทางการตรวจและให้คะแนนการปฏิบัติการของผู้เรียนทั้ง 9 ข้อ (รวม 10 คะแนนดิบ: ข้อ 1–8 ข้อละ 1 คะแนน, ข้อ 9 วิเคราะห์ค่าผิดปกติ 2 คะแนน โดยแบ่งเป็นคะแนนความถูกต้องของคำสั่งโค้ดและผลลัพธ์พร้อมคำอธิบายเชิงวิเคราะห์) ห้ามเผยแพร่ไฟล์นี้ให้ผู้เรียนก่อนทำแบบฝึกหัดเสร็จสิ้น"
    )
    apply_run_font(r_n, size_pt=14, color_rgb=(146, 64, 14))

    add_p(doc, "", space_after=4)

    # -------------------------------------------------------------
    # Sol 1
    # -------------------------------------------------------------
    add_p(doc, "เฉลยข้อที่ 1: การนำเข้าไลบรารี Pandas และการกำหนดชนิดข้อมูลหมายเลขโทรศัพท์ (1 คะแนน)", size_pt=15, bold=True, color_rgb=(180, 83, 9), space_before=8, space_after=2)
    add_p(doc, "1.1 คำสั่งภาษา Python ที่ถูกต้อง:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_after=2)
    add_teacher_code_box(doc, "import pandas as pd\ndf = pd.read_csv('nvc_tech_store.csv', dtype={'customer_phone': 'string'})\ndf.head(3)")
    add_p(doc, "1.2 แนวคำตอบคำถามตรวจสอบความเข้าใจ:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=3, space_after=2)
    add_teacher_answer_box(doc, "แนวคำตอบ: ต้องกำหนด dtype={'customer_phone': 'string'} เพื่อป้องกันไม่ให้โปรแกรมมองหมายเลขโทรศัพท์เป็นตัวเลขจำนวนเต็ม ซึ่งจะทำให้เลขศูนย์นำหน้า (Leading Zero) ถูกตัดทิ้งไป เช่น จาก '0812345601' จะกลายเป็น '812345601' ทำให้ข้อมูลผิดเพี้ยน อีกทั้งหมายเลขโทรศัพท์มีลักษณะเป็นข้อมูลระบุตัวตน (Identifier) ไม่นำไปคำนวณทางคณิตศาสตร์ จึงต้องจัดเก็บในรูปแบบข้อความ (string)")

    # -------------------------------------------------------------
    # Sol 2
    # -------------------------------------------------------------
    add_p(doc, "เฉลยข้อที่ 2: การตรวจสอบขนาดมิติของตารางข้อมูล (1 คะแนน)", size_pt=15, bold=True, color_rgb=(180, 83, 9), space_before=8, space_after=2)
    add_p(doc, "2.1 คำสั่งภาษา Python ที่ถูกต้อง:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_after=2)
    add_teacher_code_box(doc, "df.shape")
    add_p(doc, "2.2 ผลลัพธ์และคำอธิบาย:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=3, space_after=2)
    add_teacher_answer_box(doc, "ผลลัพธ์: (36, 7)\nคำอธิบาย: ตารางข้อมูลต้นฉบับนี้มีจำนวนแถวทั้งหมด 36 แถว (ดัชนี 0 ถึง 35) และมีจำนวนคอลัมน์ทั้งหมด 7 คอลัมน์")

    # -------------------------------------------------------------
    # Sol 3
    # -------------------------------------------------------------
    add_p(doc, "เฉลยข้อที่ 3: การแสดงและตรวจสอบข้อมูลตัวอย่าง 5 แถวแรก (1 คะแนน)", size_pt=15, bold=True, color_rgb=(180, 83, 9), space_before=8, space_after=2)
    add_p(doc, "3.1 คำสั่งภาษา Python ที่ถูกต้อง:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_after=2)
    add_teacher_code_box(doc, "df.head(5)")
    add_p(doc, "3.2 ผลลัพธ์และคำอธิบาย:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=3, space_after=2)
    add_teacher_answer_box(doc, "ผลลัพธ์รหัสคำสั่งซื้อ:\nแถวดัชนี 0: ORD-101 | แถวดัชนี 1: ORD-102 | แถวดัชนี 2: ORD-103 | แถวดัชนี 3: ORD-104 | แถวดัชนี 4: ORD-105\n\nการวิเคราะห์แถวดัชนี 3 (ORD-104):\nคอลัมน์ customer_phone แสดงค่าเป็น <NA> ซึ่งหมายถึงเป็นข้อมูลสูญหาย (Missing Value) หรือค่าว่าง โดยไม่มีการบันทึกหมายเลขโทรศัพท์ของลูกค้าในรายการนี้")

    # -------------------------------------------------------------
    # Sol 4
    # -------------------------------------------------------------
    add_p(doc, "เฉลยข้อที่ 4: การแสดงและตรวจสอบข้อมูลตัวอย่าง 5 แถวสุดท้าย (1 คะแนน)", size_pt=15, bold=True, color_rgb=(180, 83, 9), space_before=8, space_after=2)
    add_p(doc, "4.1 คำสั่งภาษา Python ที่ถูกต้อง:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_after=2)
    add_teacher_code_box(doc, "df.tail(5)")
    add_p(doc, "4.2 ผลลัพธ์และคำอธิบาย:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=3, space_after=2)
    add_teacher_answer_box(doc, "ผลลัพธ์:\n- หมายเลขดัชนี (Index) แถวสุดท้ายคือ: 35\n- รหัสคำสั่งซื้อ (order_id) คือ: ORD-134\n- ชื่อสินค้าและยอดเงินรวม: สายชาร์จ Type-C ยอดเงินรวม 220.0 บาท\n\nคำอธิบายดัชนี:\nภาษา Python เริ่มต้นนับตำแหน่งดัชนี (Zero-based Index) จาก 0 ดังนั้นตารางที่มี 36 แถว จึงมีดัชนีเริ่มต้นที่ 0 และสิ้นสุดที่ 35")

    # -------------------------------------------------------------
    # Sol 5
    # -------------------------------------------------------------
    add_p(doc, "เฉลยข้อที่ 5: การสำรวจรายชื่อคอลัมน์และการจำแนกบทบาทของข้อมูล (1 คะแนน)", size_pt=15, bold=True, color_rgb=(180, 83, 9), space_before=8, space_after=2)
    add_p(doc, "5.1 คำสั่งภาษา Python ที่ถูกต้อง:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_after=2)
    add_teacher_code_box(doc, "df.columns.tolist()")
    add_p(doc, "5.2 ผลลัพธ์และคำอธิบาย:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=3, space_after=2)
    add_teacher_answer_box(doc, "รายชื่อคอลัมน์ทั้ง 7 คอลัมน์:\n['order_id', 'customer_phone', 'product_name', 'category', 'quantity', 'total_price', 'payment_status']\n\nการจำแนกประเภทข้อมูล:\n- รหัสระบุตัวตน (Identifier): order_id (และ customer_phone ในแง่ข้อมูลติดต่อลูกค้า)\n- ข้อมูลเชิงตัวเลข/คำนวณมูลค่า (Numeric): quantity, total_price\n- ข้อมูลเชิงข้อความ/จัดกลุ่ม (Categorical): product_name, category, payment_status")

    # -------------------------------------------------------------
    # Sol 6
    # -------------------------------------------------------------
    add_p(doc, "เฉลยข้อที่ 6: การตรวจสอบชนิดข้อมูลของแต่ละคอลัมน์ (1 คะแนน)", size_pt=15, bold=True, color_rgb=(180, 83, 9), space_before=8, space_after=2)
    add_p(doc, "6.1 คำสั่งภาษา Python ที่ถูกต้อง:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_after=2)
    add_teacher_code_box(doc, "df.dtypes")
    add_p(doc, "6.2 ผลลัพธ์และคำอธิบาย:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=3, space_after=2)
    add_teacher_answer_box(doc, "ผลลัพธ์:\n- quantity: float64 | total_price: float64 | customer_phone: string[python]\n- order_id, product_name, category, payment_status: object\n\nคำอธิบายทำไม quantity เป็น float64:\nเนื่องจากในคอลัมน์ quantity มีข้อมูลสูญหาย (NaN) ปะปนอยู่ ในไลบรารี Pandas หากคอลัมน์จำนวนเต็มมีค่า NaN ระบบจะเลื่อนระดับชนิดข้อมูล (Type Promotion) ให้กลายเป็น float64 โดยอัตโนมัติ เพื่อให้สามารถแทนค่า NaN ได้")

    # -------------------------------------------------------------
    # Sol 7
    # -------------------------------------------------------------
    add_p(doc, "เฉลยข้อที่ 7: การตรวจสอบโครงสร้างตารางและความสมบูรณ์ของข้อมูล (1 คะแนน)", size_pt=15, bold=True, color_rgb=(180, 83, 9), space_before=8, space_after=2)
    add_p(doc, "7.1 คำสั่งภาษา Python ที่ถูกต้อง:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_after=2)
    add_teacher_code_box(doc, "df.info()")
    add_p(doc, "7.2 ผลลัพธ์และคำอธิบาย:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=3, space_after=2)
    add_teacher_answer_box(doc, "ผลลัพธ์ Non-Null Count:\n- order_id: 36 non-null\n- customer_phone: 34 non-null\n- quantity: 35 non-null\n- total_price: 34 non-null\n\nสรุปผล: คอลัมน์ที่มีข้อมูลไม่ครบ 36 รายการ ได้แก่ customer_phone (ขาด 2 รายการ), total_price (ขาด 2 รายการ) และ quantity (ขาด 1 รายการ)")

    # -------------------------------------------------------------
    # Sol 8
    # -------------------------------------------------------------
    add_p(doc, "เฉลยข้อที่ 8: การตรวจนับจำนวนข้อมูลสูญหายแยกตามรายคอลัมน์ (1 คะแนน)", size_pt=15, bold=True, color_rgb=(180, 83, 9), space_before=8, space_after=2)
    add_p(doc, "8.1 คำสั่งภาษา Python ที่ถูกต้อง:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_after=2)
    add_teacher_code_box(doc, "df.isna().sum()")
    add_p(doc, "8.2 ผลลัพธ์และคำอธิบาย:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=3, space_after=2)
    add_teacher_answer_box(doc, "ผลลัพธ์:\n- customer_phone: 2 ค่าว่าง\n- quantity: 1 ค่าว่าง\n- total_price: 2 ค่าว่าง\n- รวมทั้งตาราง: 5 จุด\n\nการวิเคราะห์ผลกระทบ:\nหากข้อมูลในคอลัมน์ quantity หรือ total_price เป็นค่าว่าง เมื่อนำไปหาผลรวมหรือค่าเฉลี่ย จะทำให้ยอดขายรวมของร้านคลาดเคลื่อนจากความเป็นจริง ดังนั้นในขั้นตอน ETL จึงจำเป็นต้องตัดแถวที่ขาดข้อมูลสำคัญเหล่านี้ออกด้วยคำสั่ง dropna(subset=['quantity', 'total_price'])")

    # -------------------------------------------------------------
    # Sol 9
    # -------------------------------------------------------------
    add_p(doc, "เฉลยข้อที่ 9: การคำนวณค่าสถิติเชิงพรรณนาและการตรวจจับค่าผิดปกติ (2 คะแนน)", size_pt=15, bold=True, color_rgb=(180, 83, 9), space_before=8, space_after=2)
    add_p(doc, "9.1 คำสั่งภาษา Python ที่ถูกต้อง:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_after=2)
    add_teacher_code_box(doc, "df.describe()")
    add_p(doc, "9.2 ผลลัพธ์และคำอธิบาย:", size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=3, space_after=2)
    add_teacher_answer_box(doc, "ผลลัพธ์ค่าสถิติ:\n- quantity: min = -2.0, max = 5.0, mean = 1.63\n- total_price: min = 180.0, max = 99,000.0, mean = 3,613.82\n\nการวิเคราะห์ค่าผิดปกติ (Outlier):\n1. quantity พบค่าต่ำสุดเป็น -2.0 ชิ้น ซึ่งเป็นไปไม่ได้ในการซื้อขายปกติ (เกิดจากการบันทึกรายการคืนสินค้าหรือคีย์ผิด)\n2. total_price พบค่าสูงสุดสูงถึง 99,000.0 บาท (รหัส ORD-120 ซื้อคีย์บอร์ดบลูทูธ) ซึ่งเป็นค่าผิดปกติที่สูงเกินจริง ส่งผลให้ค่าเฉลี่ยพุ่งสูงขึ้นไปอยู่ที่ 3,613.82 บาท (ทั้งที่ค่ามัธยฐาน 50% อยู่ที่เพียง 620.0 บาท) ในขั้นตอน ETL จึงต้องตัดค่าที่อยู่นอกเกณฑ์นี้ออก")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(output_path))
    print(f"Generated teacher key: {output_path}", flush=True)

if __name__ == "__main__":
    base = Path("/Users/surachartlimrattanaphun/Desktop/Teaching_NVC")
    dva = base / "วิชาการวิเคราะห์และนำเสนอข้อมูล"
    w2_retro = dva / "ชุดพร้อมสอน_31901-2012/เรียนย้อนหลัง_สัปดาห์02"
    public_w2 = dva / "dva-slides/public/ชุดเรียน/เรียนย้อนหลัง_สัปดาห์02"
    dist_w2 = dva / "dva-slides/dist/ชุดเรียน/เรียนย้อนหลัง_สัปดาห์02"
    web_pub_w2 = dva / "ชุดพร้อมสอน_31901-2012/เว็บสำหรับเผยแพร่/ชุดเรียน/เรียนย้อนหลัง_สัปดาห์02"
    teacher_dir = dva / "ชุดพร้อมสอน_31901-2012/สำหรับครู"
    deliverables = base / "deliverables"

    # Remove student-facing Colab notebook spoilers from all locations
    spoilers = [
        w2_retro / "W02_ทบทวนก่อนเรียน.ipynb",
        public_w2 / "W02_ทบทวนก่อนเรียน.ipynb",
        dist_w2 / "W02_ทบทวนก่อนเรียน.ipynb",
        web_pub_w2 / "W02_ทบทวนก่อนเรียน.ipynb",
        deliverables / "W02_ทบทวนก่อนเรียน.ipynb"
    ]
    for sp in spoilers:
        if sp.exists():
            sp.unlink()
            print(f"Removed spoiler notebook: {sp}", flush=True)

    # Generate 9-question student worksheet
    for d in [w2_retro, public_w2, deliverables]:
        generate_student_worksheet(d / "ใบงานปฏิบัติการ_ทบทวนก่อนเรียน_GoogleDocs.docx")

    # Generate 9-question teacher answer key (stored only in teacher directories)
    generate_teacher_key(teacher_dir / "เฉลยใบงานปฏิบัติการ_ทบทวนก่อนเรียน_สำหรับผู้สอน.docx")
    generate_teacher_key(deliverables / "เฉลยใบงานปฏิบัติการ_ทบทวนก่อนเรียน_สำหรับผู้สอน.docx")
    print("All 9-question Colab package files generated successfully.")
