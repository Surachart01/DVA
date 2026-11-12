#!/usr/bin/env python3
"""Generate Google Docs / Word editable worksheet (.docx) and teacher key for Week 4 Thursday (Pandas Functions & Parameters)."""

from pathlib import Path
import shutil
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


def set_cell_margins(cell, top=140, bottom=140, left=200, right=200):
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
            tag = (
                f'<w:{edge} {nsdecls("w")} '
                f'w:val="{edge_data.get("val", "single")}" '
                f'w:sz="{edge_data.get("sz", "4")}" '
                f'w:space="{edge_data.get("space", "0")}" '
                f'w:color="{edge_data.get("color", "CBD5E1")}"/>'
            )
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


def add_styled_paragraph(
    doc,
    text="",
    font_name=FONT_NAME,
    size_pt=16,
    bold=False,
    italic=False,
    color_rgb=(15, 23, 42),
    align=WD_ALIGN_PARAGRAPH.LEFT,
    space_before=0,
    space_after=4,
):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15
    if text:
        run = p.add_run(text)
        apply_run_font(run, font_name, size_pt, bold, italic, color_rgb)
    return p


def create_student_info_table(doc):
    table = doc.add_table(rows=2, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    col_widths = [Inches(3.4), Inches(3.4)]
    fields = [
        [("ชื่อ-นามสกุล: ", "................................................................"), ("รหัสนักศึกษา: ", "................................................................")],
        [("ระดับชั้น / กลุ่มเรียน: ", "ปวส.2 เทคโนโลยีสารสนเทศ"), ("กำหนดส่งงาน: ", "ภายในสัปดาห์ที่ 5 (ก่อนเริ่มคาบเรียนถัดไป)")],
    ]
    for row_idx, row in enumerate(table.rows):
        for col_idx, cell in enumerate(row.cells):
            cell.width = col_widths[col_idx]
            set_cell_background(cell, "F8FAFC")
            set_cell_margins(cell, top=100, bottom=100, left=150, right=150)
            set_cell_border(
                cell,
                top=dict(val='single', sz='4', color='CBD5E1'),
                bottom=dict(val='single', sz='4', color='CBD5E1'),
                left=dict(val='single', sz='4', color='CBD5E1'),
                right=dict(val='single', sz='4', color='CBD5E1'),
            )
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.15
            label, dots = fields[row_idx][col_idx]
            r1 = p.add_run(label)
            apply_run_font(r1, bold=True, size_pt=14, color_rgb=(30, 41, 59))
            r2 = p.add_run(dots)
            apply_run_font(r2, bold=False, size_pt=14, color_rgb=(71, 85, 105))


def create_answer_box(doc, title="คำสั่งภาษา Python:", placeholder="", is_code=True, min_height_lines=2):
    add_styled_paragraph(doc, title, size_pt=14, bold=True, color_rgb=(30, 41, 59), space_before=4, space_after=2)

    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    cell = table.rows[0].cells[0]
    cell.width = Inches(6.8)
    bg = "F1F5F9" if is_code else "FFFFFF"
    set_cell_background(cell, bg)
    set_cell_margins(cell, top=120, bottom=120, left=180, right=180)
    set_cell_border(
        cell,
        top=dict(val='single', sz='6', color='94A3B8'),
        bottom=dict(val='single', sz='6', color='94A3B8'),
        left=dict(val='single', sz='12', color='007DA2' if is_code else '10B981'),
        right=dict(val='single', sz='6', color='94A3B8'),
    )

    cell_p = cell.paragraphs[0]
    cell_p.paragraph_format.space_before = Pt(0)
    cell_p.paragraph_format.space_after = Pt(0)
    font_name = "Courier New" if is_code else FONT_NAME
    color_rgb = (30, 41, 59) if is_code else (71, 85, 105)
    r = cell_p.add_run(placeholder + ("\n" * max(0, min_height_lines - 1)))
    apply_run_font(r, font_name=font_name, size_pt=13 if is_code else 14, color_rgb=color_rgb)


QUESTIONS = [
    {
        "section": "ตอนที่ 1: วิเคราะห์ภารกิจและเลือกใช้ Function คู่กับ Parameter ให้ถูกต้อง (3 ข้อ · 3 คะแนน)",
        "num": 1,
        "title": "ข้อที่ 1 (1 คะแนน): การกำหนดชนิดข้อมูลขณะนำเข้าไฟล์ CSV เพื่อรักษาเลข 0 นำหน้า",
        "prompt": "ต้องการนำเข้าไฟล์ customer_orders.csv ลงในตัวแปรตาราง df โดยกำหนดให้คอลัมน์รหัสไปรษณีย์ (zipcode) และหมายเลขโทรศัพท์ (phone) มีชนิดข้อมูลเป็นข้อความ ('string') เพื่อไม่ให้เลข 0 นำหน้าถูกตัดออก จงเขียนคำสั่งและอธิบายหน้าที่ของ Parameter ที่เลือกใช้",
        "hint": "ฟังก์ชันที่เกี่ยวข้อง: pd.read_csv(..., dtype=...)",
        "code_ans": "df = pd.read_csv('customer_orders.csv', dtype={'zipcode': 'string', 'phone': 'string'})",
        "text_ans": "ใช้ฟังก์ชัน pd.read_csv() ร่วมกับพารามิเตอร์ dtype={'zipcode': 'string', 'phone': 'string'} เพื่อบังคับให้ไลบรารี pandas อ่านทั้งสองคอลัมน์เป็นข้อความตั้งแต่ขั้นตอนการนำเข้า ป้องกันการแปลงเป็นจำนวนเต็ม (int64) ที่จะทำให้เลข 0 นำหน้าหายไป",
    },
    {
        "section": None,
        "num": 2,
        "title": "ข้อที่ 2 (1 คะแนน): การนับความถี่ของข้อมูลในคอลัมน์พร้อมแสดงจำนวนค่าว่าง (NaN)",
        "prompt": "ต้องการสำรวจความถี่ของข้อมูลในคอลัมน์ major (สาขาวิชา) ของตาราง df ว่าแต่ละสาขาวิชามีจำนวนกี่แถว และต้องการให้นับจำนวนแถวที่เป็นค่าว่าง (NaN / <NA>) แสดงรวมออกมาในผลลัพธ์ด้วย จงเขียนคำสั่งและระบุ Parameter ที่ต้องตั้งค่า",
        "hint": "ฟังก์ชันที่เกี่ยวข้อง: df['major'].value_counts(dropna=...)",
        "code_ans": "df['major'].value_counts(dropna=False)",
        "text_ans": "ใช้ฟังก์ชัน .value_counts(dropna=False) โดยกำหนดพารามิเตอร์ dropna=False (จากค่าเริ่มต้น True) เพื่อสั่งไม่ให้ตัดค่าว่างทิ้ง ทำให้สามารถเห็นทั้งความถี่ของแต่ละชื่อสาขาวิชาและจำนวนค่าว่างในคราวเดียวกัน",
    },
    {
        "section": None,
        "num": 3,
        "title": "ข้อที่ 3 (1 คะแนน): การลบแถวที่มีค่าว่างเฉพาะคอลัมน์เป้าหมาย (ไม่ลบทั้งตาราง)",
        "prompt": "ตารางข้อมูล df พบค่าว่างในคอลัมน์ gpa จำนวน 2 แถว และคอลัมน์ phone จำนวน 3 แถว หากผู้วิเคราะห์ต้องการลบเฉพาะแถวที่คอลัมน์ gpa เป็นค่าว่างออก (โดยเก็บรักษาแถวที่ว่างเฉพาะคอลัมน์ phone ไว้) แล้วบันทึกในตัวแปร df_clean จงเขียนคำสั่งและอธิบายพารามิเตอร์ที่ใช้",
        "hint": "ฟังก์ชันที่เกี่ยวข้อง: df.dropna(subset=[...])",
        "code_ans": "df_clean = df.dropna(subset=['gpa'])",
        "text_ans": "ใช้ฟังก์ชัน df.dropna() ร่วมกับพารามิเตอร์ subset=['gpa'] เพื่อจำกัดขอบเขตการตรวจสอบค่าว่างเฉพาะคอลัมน์ gpa เท่านั้น หากไม่ระบุ subset คำสั่ง df.dropna() จะลบทุกแถวที่มีค่าว่างในคอลัมน์ใดคอลัมน์หนึ่งออกทั้งหมด",
    },
    {
        "section": "ตอนที่ 2: ตรวจสอบและแก้ไขข้อผิดพลาดของการใช้ Function และ Parameter (4 ข้อ · 4 คะแนน)",
        "num": 4,
        "title": "ข้อที่ 4 (1 คะแนน): แก้ไขข้อผิดพลาดระหว่างค่าคุณสมบัติ (Attribute) กับฟังก์ชัน (Method)",
        "prompt": "ผู้เรียนต้องการตรวจสอบขนาดของตาราง (จำนวนแถว, จำนวนคอลัมน์) จึงพิมพ์คำสั่ง df.shape() และตรวจสอบรายชื่อคอลัมน์ด้วย df.columns() แต่โปรแกรมแจ้งข้อผิดพลาด TypeError จงอธิบายสาเหตุและเขียนคำสั่งที่ถูกต้อง",
        "hint": "สังเกตความแตกต่างระหว่าง Attribute (ไม่มีวงเล็บ) กับ Method (มีวงเล็บ)",
        "code_ans": "df.shape\ndf.columns",
        "text_ans": "เกิดข้อผิดพลาดเนื่องจาก .shape และ .columns เป็นค่าคุณสมบัติของตาราง (Attribute) ที่เก็บค่าขนาดตารางและรายชื่อคอลัมน์ไว้โดยตรง ไม่ใช่ฟังก์ชันการกระทำ (Method) จึงห้ามใส่เครื่องหมายวงเล็บ () ต่อท้าย",
    },
    {
        "section": None,
        "num": 5,
        "title": "ข้อที่ 5 (1 คะแนน): แก้ไขทิศทางการตรวจสอบค่าว่างรายแถวด้วย Parameter axis",
        "prompt": "ผู้เรียนต้องการตรวจสอบว่าแถวใดบ้างในตาราง df ที่มีค่าว่างอย่างน้อย 1 ช่อง จึงเขียนคำสั่ง df.isna().any() แต่ผลลัพธ์กลับแสดงเป็นรายชื่อคอลัมน์ (7 คอลัมน์) แทนที่จะแสดงเป็นรายแถว (42 แถว) จงระบุว่าต้องเพิ่ม Parameter ใด และเขียนคำสั่งให้นับจำนวนแถวที่มีค่าว่างอย่างน้อย 1 ช่อง",
        "hint": "ฟังก์ชันที่เกี่ยวข้อง: df.isna().any(axis=...) และ .sum()",
        "code_ans": "missing_rows = df.isna().any(axis=1)\nmissing_rows.sum()",
        "text_ans": "ต้องกำหนดพารามิเตอร์ axis=1 ในคำสั่ง .any(axis=1) เพื่อสั่งให้ตรวจสอบตามแนวนอน (ข้ามคอลัมน์ในแต่ละแถว) เนื่องจากค่าเริ่มต้นคือ axis=0 ซึ่งเป็นการตรวจสอบตามแนวตั้งรายคอลัมน์",
    },
    {
        "section": None,
        "num": 6,
        "title": "ข้อที่ 6 (1 คะแนน): การแปลงคอลัมน์ตัวเลขที่มีข้อความปะปนโดยไม่ให้โปรแกรมหยุดทำงาน",
        "prompt": "คอลัมน์ age ในตาราง df มีข้อความผิดปกติปะปนอยู่ เช่น '20', '19', 'ไม่ระบุ' เมื่อรันคำสั่ง pd.to_numeric(df['age']) โปรแกรมแจ้ง ValueError ทันที จงเขียนคำสั่งใหม่โดยเพิ่ม Parameter ที่ช่วยเปลี่ยนค่าที่แปลงไม่ได้ให้กลายเป็นค่าว่าง (NaN) อัตโนมัติ",
        "hint": "ฟังก์ชันที่เกี่ยวข้อง: pd.to_numeric(..., errors=...)",
        "code_ans": "df['age'] = pd.to_numeric(df['age'], errors='coerce')",
        "text_ans": "กำหนดพารามิเตอร์ errors='coerce' ในฟังก์ชัน pd.to_numeric() เพื่อสั่งให้ระบบเปลี่ยนข้อมูลที่ไม่สามารถแปลงเป็นตัวเลขได้ (เช่น 'ไม่ระบุ') ให้เป็นค่าว่าง (NaN) แทนการหยุดทำงานและแจ้งข้อผิดพลาด (ค่าเริ่มต้นคือ errors='raise')",
    },
    {
        "section": None,
        "num": 7,
        "title": "ข้อที่ 7 (1 คะแนน): การเลือกใช้ Parameter index=False และ index_label ในการส่งออกไฟล์ CSV",
        "prompt": "จงเปรียบเทียบและเขียนคำสั่งส่งออกไฟล์ CSV สำหรับ 2 กรณีต่อไปนี้ พร้อมระบุให้รองรับภาษาไทยในโปรแกรม Excel:\nกรณี ก) ตาราง df_clean ที่มีคอลัมน์ข้อมูลครบถ้วนแล้วและมีดัชนีเป็นตัวเลข 0, 1, 2...\nกรณี ข) ตารางรายงาน quality ที่รายชื่อคอลัมน์ต้นทางถูกเก็บอยู่ในดัชนี (Index) ด้านซ้ายของตาราง",
        "hint": "ฟังก์ชันที่เกี่ยวข้อง: .to_csv(..., index=..., index_label=..., encoding='utf-8-sig')",
        "code_ans": "# กรณี ก) ปิดการบันทึกตัวเลขลำดับแถว\ndf_clean.to_csv('clean_data.csv', index=False, encoding='utf-8-sig')\n\n# กรณี ข) เก็บดัชนีไว้และตั้งชื่อหัวคอลัมน์ดัชนีว่า column\nquality.to_csv('quality_report.csv', index_label='column', encoding='utf-8-sig')",
        "text_ans": "กรณี ก) ใช้ index=False เพื่อป้องกันไม่ให้ตัวเลขลำดับแถว 0, 1, 2... ถูกสร้างเป็นคอลัมน์ Unnamed: 0 เกินมาในไฟล์ CSV ส่วนกรณี ข) ต้องเก็บดัชนีไว้และใช้ index_label='column' เพื่อตั้งชื่อหัวคอลัมน์ให้แก่รายชื่อคอลัมน์ต้นทางที่อยู่ในดัชนี ร่วมกับ encoding='utf-8-sig' เพื่อให้อ่านภาษาไทยใน Excel ได้ถูกต้อง",
    },
    {
        "section": "ตอนที่ 3: เขียนชุดคำสั่งประยุกต์ใช้ Function และ Parameter จากสถานการณ์จริง (3 ข้อ · 3 คะแนน)",
        "num": 8,
        "title": "ข้อที่ 8 (1 คะแนน): การจัดมาตรฐานข้อความและสกัดตัวเลขจากข้อความ (String Methods)",
        "prompt": "กำหนดให้ตาราง orders มีคอลัมน์ product_code ที่มีช่องว่างด้านหน้า-หลังและตัวพิมพ์เล็กปะปนกัน (เช่น '  it-01 ') และคอลัมน์ price_text ที่เก็บราคาปะปนกับหน่วย (เช่น '1,500 บาท') จงเขียนคำสั่ง:\n1) ตัดช่องว่างและแปลง product_code เป็นตัวพิมพ์ใหญ่ทั้งหมด\n2) ตัดเครื่องหมายลูกน้ำ ',' และคำว่า ' บาท' ออกจาก price_text แล้วแปลงเป็นชนิด float",
        "hint": "ฟังก์ชันที่เกี่ยวข้อง: .str.strip(), .str.upper(), .str.replace(..., regex=False), .astype(float)",
        "code_ans": "orders['product_code'] = orders['product_code'].str.strip().str.upper()\norders['price'] = orders['price_text'].str.replace(',', '', regex=False).str.replace(' บาท', '', regex=False).astype(float)",
        "text_ans": "ใช้ Method Chaining .str.strip().str.upper() เพื่อตัดช่องว่างและแปลงรหัสสินค้าเป็นตัวพิมพ์ใหญ่ และใช้ .str.replace(..., regex=False) ตัดเครื่องหมายลูกน้ำกับหน่วยภาษาไทยออกก่อนแปลงชนิดข้อมูลเป็นทศนิยมด้วย .astype(float)",
    },
    {
        "section": None,
        "num": 9,
        "title": "ข้อที่ 9 (1 คะแนน): การตรวจสอบและลบข้อมูลซ้ำซ้อนด้วย Parameter subset และ keep",
        "prompt": "กำหนดให้ตาราง orders มีรหัสคำสั่งซื้อ (order_id) บันทึกซ้ำซ้อนกัน จงเขียนคำสั่ง:\n1) แสดงแถวที่มีรหัส order_id ซ้ำกันทั้งหมดทุกแถว (แสดงทั้งแถวต้นฉบับและแถวสำเนาเพื่อนำมาเปรียบเทียบกัน)\n2) ลบแถวที่มีรหัส order_id ซ้ำออก โดยเก็บรักษาเฉพาะแถวแรกที่พบไว้",
        "hint": "ฟังก์ชันที่เกี่ยวข้อง: df.duplicated(subset=[...], keep=...) และ df.drop_duplicates(subset=[...], keep=...)",
        "code_ans": "# 1) แสดงแถวที่ order_id ซ้ำกันทั้งหมดทุกแถว\norders[orders.duplicated(subset=['order_id'], keep=False)]\n\n# 2) ลบแถวซ้ำโดยเก็บเฉพาะแถวแรกไว้\norders_unique = orders.drop_duplicates(subset=['order_id'], keep='first')",
        "text_ans": "ในขั้นตอนตรวจสอบใช้ subset=['order_id'] และ keep=False เพื่อให้คืนค่า True ทั้งแถวแรกและแถวที่ซ้ำทุกแถวสำหรับนำมาตรวจสอบเปรียบเทียบ ส่วนขั้นตอนลบข้อมูลซ้ำใช้ drop_duplicates(subset=['order_id'], keep='first') เพื่อรักษาแถวแรกไว้และลบเฉพาะสำเนาที่ซ้ำทิ้ง",
    },
    {
        "section": None,
        "num": 10,
        "title": "ข้อที่ 10 (1 คะแนน): การคัดกรองช่วงข้อมูล การจัดกลุ่ม และการเรียงลำดับผลลัพธ์",
        "prompt": "กำหนดให้ตาราง df มีคอลัมน์ category (หมวดหมู่สินค้า), quantity (จำนวนชิ้น) และ total_price (ยอดขายรวม) จงเขียนคำสั่ง:\n1) คัดกรองเฉพาะแถวที่มีจำนวนชิ้น (quantity) อยู่ระหว่าง 1 ถึง 20 ชิ้น (รวมขอบเขต 1 และ 20)\n2) จัดกลุ่มตามหมวดหมู่สินค้า (category) เพื่อหาผลรวมของยอดขาย (total_price) และเรียงลำดับจากยอดขายรวมมากที่สุดไปน้อยที่สุด",
        "hint": "ฟังก์ชันที่เกี่ยวข้อง: .between(1, 20), .groupby('category')['total_price'].sum(), .sort_values(ascending=False)",
        "code_ans": "valid_df = df[df['quantity'].between(1, 20, inclusive='both')]\nsummary = valid_df.groupby('category')['total_price'].sum().sort_values(ascending=False)\nsummary",
        "text_ans": "ใช้ .between(1, 20, inclusive='both') เพื่อคัดกรองรายการที่จำนวนชิ้นอยู่ในเกณฑ์ 1–20 ชิ้น จากนั้นใช้ .groupby('category')['total_price'].sum() เพื่อรวมยอดขายแยกตามหมวดหมู่ และใช้ .sort_values(ascending=False) เพื่อเรียงลำดับจากยอดขายสูงสุดไปต่ำสุด",
    },
]


def generate_student_worksheet_docx(output_path: Path):
    doc = docx.Document()
    for s in doc.sections:
        s.top_margin = Inches(0.75)
        s.bottom_margin = Inches(0.75)
        s.left_margin = Inches(0.8)
        s.right_margin = Inches(0.8)

    add_styled_paragraph(
        doc,
        "ใบงานภารกิจ: การประยุกต์ใช้ Function และ Parameter ของไลบรารี Pandas",
        size_pt=20,
        bold=True,
        color_rgb=(0, 125, 162),
        align=WD_ALIGN_PARAGRAPH.CENTER,
        space_after=2,
    )
    add_styled_paragraph(
        doc,
        "รายวิชา 31901-2012 การวิเคราะห์และนำเสนอข้อมูล · สัปดาห์ที่ 4 วันพฤหัสบดี (คะแนนเต็ม 10 คะแนน)",
        size_pt=16,
        bold=True,
        color_rgb=(51, 65, 85),
        align=WD_ALIGN_PARAGRAPH.CENTER,
        space_after=2,
    )
    add_styled_paragraph(
        doc,
        "รูปแบบการเรียนออนไลน์เน้นความเข้าใจโครงสร้างคำสั่ง พารามิเตอร์ และการประยุกต์ใช้ (กำหนดส่งภายในสัปดาห์ถัดไป)",
        size_pt=14,
        bold=False,
        italic=True,
        color_rgb=(71, 85, 105),
        align=WD_ALIGN_PARAGRAPH.CENTER,
        space_after=10,
    )

    create_student_info_table(doc)

    # Instructions Box
    add_styled_paragraph(doc, "", space_before=4, space_after=0)
    inst_table = doc.add_table(rows=1, cols=1)
    inst_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    inst_cell = inst_table.rows[0].cells[0]
    inst_cell.width = Inches(6.8)
    set_cell_background(inst_cell, "EFF6FF")
    set_cell_margins(inst_cell, top=100, bottom=100, left=160, right=160)
    set_cell_border(
        inst_cell,
        top=dict(val='single', sz='4', color='BFDBFE'),
        bottom=dict(val='single', sz='4', color='BFDBFE'),
        left=dict(val='single', sz='12', color='007DA2'),
        right=dict(val='single', sz='4', color='BFDBFE'),
    )
    inst_p = inst_cell.paragraphs[0]
    inst_p.paragraph_format.space_before = Pt(0)
    inst_p.paragraph_format.space_after = Pt(0)
    r_inst = inst_p.add_run(
        "คำชี้แจงสำหรับผู้เรียน:\n"
        "1. เอกสารฉบับนี้ใช้ทบทวนและประเมินความเข้าใจเรื่องการเลือกใช้ Function และ Parameter ของไลบรารี pandas (10 ข้อ · 10 คะแนน)\n"
        "2. ผู้เรียนสามารถศึกษาจากสไลด์เชิงโต้ตอบ 'คลัง 16 ฟังก์ชัน & ทดลอง Parameter' และ 'เกมพิชิตภารกิจ Pandas' เพื่อพิมพ์คำตอบลงในเอกสารนี้ได้ทันที\n"
        "3. ส่งไฟล์เอกสารฉบับนี้ (.docx หรือ PDF) ในชั้นเรียนออนไลน์ (Google Classroom) ภายในสัปดาห์ถัดไป"
    )
    apply_run_font(r_inst, size_pt=14, color_rgb=(30, 58, 138))

    for q in QUESTIONS:
        if q["section"]:
            add_styled_paragraph(
                doc,
                q["section"],
                size_pt=17,
                bold=True,
                color_rgb=(0, 125, 162),
                space_before=14,
                space_after=4,
            )
        add_styled_paragraph(
            doc,
            q["title"],
            size_pt=15,
            bold=True,
            color_rgb=(23, 38, 56),
            space_before=8,
            space_after=2,
        )
        add_styled_paragraph(
            doc,
            q["hint"],
            size_pt=13,
            bold=False,
            italic=True,
            color_rgb=(0, 125, 162),
            space_before=0,
            space_after=3,
        )
        add_styled_paragraph(
            doc,
            f"โจทย์: {q['prompt']}",
            size_pt=14,
            bold=False,
            color_rgb=(30, 41, 59),
            space_before=0,
            space_after=4,
        )
        create_answer_box(
            doc,
            "1) คำสั่งภาษา Python ที่เลือกใช้ (ระบุ Function และ Parameter ให้ครบถ้วน):",
            "# พิมพ์คำสั่งภาษา Python ตรงนี้\n",
            is_code=True,
            min_height_lines=2,
        )
        create_answer_box(
            doc,
            "2) คำอธิบายหน้าที่ของ Function และ Parameter ที่ใช้:",
            "[ พิมพ์คำอธิบายเหตุผลและผลลัพธ์ที่ได้ตรงนี้ ]",
            is_code=False,
            min_height_lines=2,
        )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(output_path))
    print(f"Generated student worksheet: {output_path}", flush=True)


def generate_teacher_key_docx(output_path: Path):
    doc = docx.Document()
    for s in doc.sections:
        s.top_margin = Inches(0.75)
        s.bottom_margin = Inches(0.75)
        s.left_margin = Inches(0.8)
        s.right_margin = Inches(0.8)

    add_styled_paragraph(
        doc,
        "เฉลยใบงานภารกิจ: การประยุกต์ใช้ Function และ Parameter ของไลบรารี Pandas (สำหรับผู้สอน)",
        size_pt=20,
        bold=True,
        color_rgb=(180, 83, 9),
        align=WD_ALIGN_PARAGRAPH.CENTER,
        space_after=2,
    )
    add_styled_paragraph(
        doc,
        "รายวิชา 31901-2012 การวิเคราะห์และนำเสนอข้อมูล · สัปดาห์ที่ 4 วันพฤหัสบดี (10 คะแนน)",
        size_pt=16,
        bold=True,
        color_rgb=(51, 65, 85),
        align=WD_ALIGN_PARAGRAPH.CENTER,
        space_after=10,
    )

    for q in QUESTIONS:
        if q["section"]:
            add_styled_paragraph(
                doc,
                q["section"],
                size_pt=17,
                bold=True,
                color_rgb=(180, 83, 9),
                space_before=14,
                space_after=4,
            )
        add_styled_paragraph(
            doc,
            q["title"],
            size_pt=15,
            bold=True,
            color_rgb=(23, 38, 56),
            space_before=6,
            space_after=2,
        )
        add_styled_paragraph(
            doc,
            f"โจทย์: {q['prompt']}",
            size_pt=14,
            bold=False,
            color_rgb=(51, 65, 85),
            space_before=0,
            space_after=4,
        )
        create_answer_box(doc, "คำสั่งเฉลยภาษา Python:", q["code_ans"], is_code=True, min_height_lines=1)
        create_answer_box(doc, "แนวคำตอบและเกณฑ์การตรวจ (1 คะแนน):", q["text_ans"], is_code=False, min_height_lines=1)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(output_path))
    print(f"Generated teacher key docx: {output_path}", flush=True)


def generate_teacher_key_md(output_path: Path):
    lines = [
        "# เฉลยใบงานภารกิจ: การประยุกต์ใช้ Function และ Parameter ของไลบรารี Pandas (สำหรับผู้สอน)",
        "**รายวิชา:** 31901-2012 การวิเคราะห์และนำเสนอข้อมูล · **สัปดาห์ที่ 4 วันพฤหัสบดี**",
        "**คะแนนเต็ม:** 10 คะแนน (10 ข้อ ข้อละ 1 คะแนน) · **กำหนดส่ง:** สัปดาห์ถัดไป",
        "",
        "---",
        "",
    ]
    for q in QUESTIONS:
        if q["section"]:
            lines.append(f"## {q['section']}\n")
        lines.append(f"### {q['title']}")
        lines.append(f"- **โจทย์:** {q['prompt']}")
        lines.append(f"- **คำสั่งเฉลย:**\n```python\n{q['code_ans']}\n```")
        lines.append(f"- **แนวคำตอบ (1 คะแนน):** {q['text_ans']}\n")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"Generated teacher key md: {output_path}", flush=True)


if __name__ == "__main__":
    dva = Path("/Users/surachartlimrattanaphun/Desktop/Teaching_NVC/วิชาการวิเคราะห์และนำเสนอข้อมูล")
    w4_retro = dva / "ชุดพร้อมสอน_31901-2012/เรียนย้อนหลัง_สัปดาห์04"
    public_w4 = dva / "dva-slides/public/ชุดเรียน/เรียนย้อนหลัง_สัปดาห์04"
    teacher_dir = dva / "ชุดพร้อมสอน_31901-2012/สำหรับครู"

    student_filename = "ใบงานภารกิจ_ฟังก์ชันและพารามิเตอร์_Pandas_สัปดาห์04.docx"
    legacy_filename = "งานทบทวนประจำคาบ_สัปดาห์04_พฤหัสบดี.docx"

    out_student = w4_retro / student_filename
    generate_student_worksheet_docx(out_student)

    # Sync to public and legacy filename so all references work
    public_w4.mkdir(parents=True, exist_ok=True)
    shutil.copy2(out_student, public_w4 / student_filename)
    shutil.copy2(out_student, w4_retro / legacy_filename)
    shutil.copy2(out_student, public_w4 / legacy_filename)

    generate_teacher_key_docx(teacher_dir / "เฉลยใบงานภารกิจ_ฟังก์ชันและพารามิเตอร์_Pandas_สัปดาห์04.docx")
    generate_teacher_key_md(teacher_dir / "เฉลยใบงานภารกิจ_ฟังก์ชันและพารามิเตอร์_Pandas_สัปดาห์04.md")
