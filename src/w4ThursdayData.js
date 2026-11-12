// Data catalog for Week 4 Thursday: Pandas Functions, Parameters & Gamified Arena

export const SYNTAX_ANATOMY = [
  {
    id: 'object',
    step: 1,
    token: 'df',
    label: '1. ตัวแปรตารางหรือคอลัมน์ (Object)',
    role: 'ระบุแหล่งข้อมูลตั้งต้นที่ต้องการสั่งงาน เช่น ตารางทั้งใบ (DataFrame: df), คอลัมน์เดียว (Series: df[\'major\']) หรือตัวเรียกไลบรารี (pd)',
    examples: [
      { code: 'pd.read_csv(...)', desc: 'เรียกใช้ฟังก์ชันระดับไลบรารีผ่านชื่อย่อ pd (ใช้เมื่อยังไม่มีตารางในหน่วยความจำ)' },
      { code: 'df.dropna(...)', desc: 'เรียกใช้ฟังก์ชันระดับตาราง (DataFrame) เพื่อจัดการข้อมูลทั้งตาราง df' },
      { code: "df['phone'].str.len()", desc: 'เรียกใช้ฟังก์ชันระดับคอลัมน์ (Series) ผ่านตัวจัดการข้อความ .str' }
    ]
  },
  {
    id: 'function',
    step: 2,
    token: '.drop_duplicates(',
    label: '2. ชื่อฟังก์ชันและวงเล็บเปิด (Function / Method)',
    role: 'ระบุคำกริยาหรือการกระทำที่ต้องการให้โปรแกรมประมวลผล โดยต้องมีเครื่องหมายจุด (.) คั่นหลังชื่อตัวแปร และตามด้วยวงเล็บ () เสมอ',
    examples: [
      { code: 'df.head()', desc: 'มีวงเล็บ () เพราะเป็นฟังก์ชันสั่งให้ดึงข้อมูลตัวอย่าง 5 แถวแรก' },
      { code: 'df.isna()', desc: 'มีวงเล็บ () เพราะเป็นฟังก์ชันสั่งให้ตรวจสอบค่าว่างทุกช่องในตาราง' },
      { code: 'df.shape  (ไม่มีวงเล็บ)', desc: 'ข้อควรระวัง: .shape, .columns, .dtypes เป็นค่าคุณสมบัติ (Attribute) ไม่ใช่ฟังก์ชัน จึงห้ามใส่วงเล็บ ()' }
    ]
  },
  {
    id: 'parameter',
    step: 3,
    token: 'subset=..., keep=...',
    label: '3. ชื่อพารามิเตอร์ (Parameter Name)',
    role: 'ตัวกำหนดเงื่อนไขหรือตัวเลือกเสริมภายในวงเล็บ เพื่อควบคุมให้ฟังก์ชันทำงานตามความต้องการเฉพาะเจาะจง หากไม่ระบุ โปรแกรมจะใช้ค่าเริ่มต้น (Default Value)',
    examples: [
      { code: 'subset=[\'student_id\']', desc: 'พารามิเตอร์กำหนดให้ตรวจสอบเฉพาะคอลัมน์ student_id แทนการตรวจทุกคอลัมน์' },
      { code: 'axis=1', desc: 'พารามิเตอร์กำหนดทิศทางการประมวลผลตามแนวนอน (รายแถว) แทนค่าเริ่มต้น axis=0 (รายคอลัมน์)' },
      { code: 'errors=\'coerce\'', desc: 'พารามิเตอร์กำหนดวิธีรับมือเมื่อพบข้อมูลที่แปลงชนิดไม่ได้ ให้เปลี่ยนเป็นค่าว่างแทนการหยุดทำงาน' }
    ]
  },
  {
    id: 'argument',
    step: 4,
    token: "['student_id'], 'first')",
    label: '4. ค่าที่ส่งให้พารามิเตอร์ (Argument Value)',
    role: 'ค่าข้อมูลที่ผู้เขียนโค้ดกำหนดให้แก่พารามิเตอร์แต่ละตัว ซึ่งมีชนิดข้อมูลแตกต่างกันตามหน้าที่ เช่น ข้อความ รายการ (List) พจนานุกรม (Dict) หรือค่าตรรกะ (True/False)',
    examples: [
      { code: 'index=False', desc: 'ส่งค่าตรรกะ (Boolean: True หรือ False) โดยไม่ต้องใส่เครื่องหมายอัญประกาศครอบคำว่า False' },
      { code: "dtype={'phone': 'string'}", desc: 'ส่งค่าแบบพจนานุกรม (Dictionary) เพื่อระบุคู่ของ ชื่อคอลัมน์: ชนิดข้อมูล' },
      { code: "subset=['age', 'gpa']", desc: 'ส่งค่าแบบรายการ (List ในวงเล็บก้ามปู []) เมื่อต้องการระบุชื่อคอลัมน์ตั้งแต่ 1 คอลัมน์ขึ้นไป' }
    ]
  }
];

export const SYNTAX_GOLDEN_RULES = [
  {
    num: 1,
    title: 'กฎที่ 1: แยกให้ออกระหว่าง Attribute (ไม่มีวงเล็บ) กับ Function (มีวงเล็บ)',
    wrong: 'df.shape()   # ผิด! แจ้ง TypeError',
    right: 'df.shape     # ถูก! ได้ (42, 7)\ndf.head(5)   # ถูก! เป็นฟังก์ชันต้องมี ()',
    desc: 'ค่าคุณสมบัติของตาราง ได้แก่ df.shape, df.columns, df.dtypes และ df.index ใช้ดูข้อมูลโครงสร้างโดยตรงจึงห้ามใส่วงเล็บ ส่วนคำสั่งประมวลผล เช่น .head(), .info(), .isna(), .sum() เป็นฟังก์ชันจึงต้องมีวงเล็บ () เสมอ'
  },
  {
    num: 2,
    title: 'กฎที่ 2: พารามิเตอร์ทุกตัวมีค่าเริ่มต้น (Default) แต่ปรับเปลี่ยนได้ตามโจทย์',
    wrong: "df.to_csv('out.csv')  # ได้คอลัมน์ Unnamed: 0 เกินมา",
    right: "df.to_csv('out.csv', index=False, encoding='utf-8-sig')",
    desc: 'หากเรียกใช้ฟังก์ชันด้วยวงเล็บว่าง เช่น df.head() โปรแกรมจะใช้ค่าเริ่มต้น n=5 อัตโนมัติ แต่หากต้องการควบคุมผลลัพธ์ เช่น ไม่เอาเลขลำดับแถวเมื่อบันทึกไฟล์ ต้องระบุชื่อพารามิเตอร์ index=False เพิ่มเติม'
  },
  {
    num: 3,
    title: 'กฎที่ 3: ฟังก์ชันส่วนใหญ่คืนค่าตารางใหม่ ต้องบันทึกทับตัวแปร (df = ...) จึงจะมีผลถาวร',
    wrong: "df.dropna(subset=['gpa'])  # ตาราง df เดิมยังไม่เปลี่ยน!",
    right: "df_clean = df.dropna(subset=['gpa'])",
    desc: 'เพื่อป้องกันข้อมูลต้นฉบับเสียหาย ฟังก์ชันใน pandas เช่น .dropna(), .fillna(), .drop_duplicates(), .replace() จะสร้างตารางผลลัพธ์ชุดใหม่ขึ้นมาเสมอ ผู้เรียนต้องใช้เครื่องหมาย = เก็บผลลัพธ์ลงในตัวแปรก่อนนำไปใช้งานต่อ'
  },
  {
    num: 4,
    title: 'กฎที่ 4: การเขียนคำสั่งต่อเนื่อง (Method Chaining) ประมวลผลจากซ้ายไปขวา',
    wrong: "df['major'].strip().upper()  # ผิด! ลืมตัวจัดการ .str",
    right: "df['major'] = df['major'].str.strip().str.upper()",
    desc: 'สามารถนำฟังก์ชันมาต่อกันเป็นลูกโซ่จากซ้ายไปขวาได้ เช่น df.isna().sum() (ตรวจค่าว่างก่อน แล้วจึงรวมจำนวน) หรือการใช้ .str.strip().str.upper() (ตัดช่องว่างก่อน แล้วจึงแปลงเป็นตัวพิมพ์ใหญ่)'
  }
];

export const PANDAS_FN_CATEGORIES = [
  { id: 'all', label: 'ทั้งหมด (16 ฟังก์ชันหลัก)' },
  { id: 'io', label: '1. นำเข้าและส่งออกไฟล์ (3)' },
  { id: 'inspect', label: '2. สำรวจและนับความถี่ (4)' },
  { id: 'missing', label: '3. ค่าว่างและข้อมูลซ้ำ (4)' },
  { id: 'transform', label: '4. ข้อความและชนิดข้อมูล (3)' },
  { id: 'filter', label: '5. คัดกรองและจัดกลุ่ม (2)' }
];

export const PANDAS_FN_CATALOG = [
  {
    id: 'read_csv',
    num: 1,
    category: 'io',
    categoryLabel: 'หมวดที่ 1: นำเข้าและส่งออกไฟล์ (I/O)',
    token: 'pd.read_csv()',
    signature: "pd.read_csv(filepath_or_buffer, dtype=None, usecols=None, encoding='utf-8')",
    purpose: 'อ่านข้อมูลจากไฟล์ CSV เข้าสู่โปรแกรมเพื่อสร้างเป็นตาราง DataFrame',
    whenToUse: 'ใช้เป็นขั้นตอนแรกเสมอเมื่อได้รับไฟล์ข้อมูลนามสกุล .csv โดยควรตรวจสอบคอลัมน์รหัสหรือหมายเลขโทรศัพท์ที่ขึ้นต้นด้วยเลข 0 ก่อนเสมอ',
    caution: 'หากไม่กำหนด dtype ให้แก่คอลัมน์หมายเลขโทรศัพท์หรือรหัสไปรษณีย์ โปรแกรมจะแปลงเป็นตัวเลขจำนวนเต็ม (int64) และตัดเลข 0 นำหน้าออกทันที',
    params: [
      { name: 'filepath_or_buffer', defaultVal: '(จำเป็นต้องระบุ)', role: 'ชื่อไฟล์หรือที่อยู่ของไฟล์ CSV ที่ต้องการอ่าน เช่น \'student_register_dirty.csv\'' },
      { name: 'dtype', defaultVal: 'None (เดาอัตโนมัติ)', role: 'กำหนดชนิดข้อมูลของคอลัมน์ล่วงหน้า เช่น dtype={\'phone\': \'string\'} เพื่อรักษาเลข 0 นำหน้า' },
      { name: 'usecols', defaultVal: 'None (อ่านทุกคอลัมน์)', role: 'เลือกอ่านเฉพาะบางคอลัมน์ที่ต้องการใช้งาน เช่น usecols=[\'student_id\', \'gpa\']' },
      { name: 'encoding', defaultVal: "'utf-8'", role: 'กำหนดรหัสอักขระของไฟล์ เช่น \'utf-8\' หรือ \'cp874\' สำหรับไฟล์ภาษาไทยรุ่นเก่า' }
    ],
    simulators: [
      {
        label: '1) ค่าเริ่มต้น (ไม่ระบุ dtype)',
        code: "df = pd.read_csv('students.csv')\ndf.head(2)",
        cols: ['student_id', 'phone (int64)', 'gpa'],
        rows: [
          ['S001', '812345678  (เลข 0 หาย!)', '3.25'],
          ['S002', '898765432  (เลข 0 หาย!)', '2.80']
        ],
        highlightProblem: true,
        note: 'เมื่อไม่ระบุพารามิเตอร์ dtype โปรแกรมจะเห็นตัวเลขล้วนจึงแปลง phone เป็น int64 ทำให้เลข 0 นำหน้าหายไป เหลือเพียง 9 หลัก'
      },
      {
        label: "2) กำหนด dtype={'phone': 'string'}",
        code: "df = pd.read_csv('students.csv', dtype={'phone': 'string'})\ndf.head(2)",
        cols: ['student_id', 'phone (string)', 'gpa'],
        rows: [
          ['S001', '0812345678  (ครบ 10 หลัก)', '3.25'],
          ['S002', '0898765432  (ครบ 10 หลัก)', '2.80']
        ],
        highlightProblem: false,
        note: 'การระบุ dtype={\'phone\': \'string\'} สั่งให้เก็บหมายเลขโทรศัพท์เป็นข้อความตั้งแต่วินาทีแรกที่อ่านไฟล์ เลข 0 นำหน้าจึงอยู่ครบถ้วน'
      },
      {
        label: "3) กำหนด usecols=['student_id', 'gpa']",
        code: "df = pd.read_csv('students.csv', usecols=['student_id', 'gpa'])\ndf.head(2)",
        cols: ['student_id', 'gpa'],
        rows: [
          ['S001', '3.25'],
          ['S002', '2.80']
        ],
        highlightProblem: false,
        note: 'พารามิเตอร์ usecols ช่วยดึงเฉพาะคอลัมน์ที่ต้องการวิเคราะห์เข้าสู่หน่วยความจำ ช่วยลดขนาดตารางเมื่อไฟล์ต้นฉบับมีหลายสิบคอลัมน์'
      }
    ]
  },
  {
    id: 'read_excel',
    num: 2,
    category: 'io',
    categoryLabel: 'หมวดที่ 1: นำเข้าและส่งออกไฟล์ (I/O)',
    token: 'pd.ExcelFile() & pd.read_excel()',
    signature: "pd.read_excel(io, sheet_name=0, dtype=None)",
    purpose: 'สำรวจรายชื่อแผ่นงาน (Sheet) ทั้งหมดในสมุดงาน Excel และเลือกอ่านแผ่นงานเป้าหมายเข้าสู่ DataFrame',
    whenToUse: 'ใช้เมื่อไฟล์ข้อมูลเป็นนามสกุล .xlsx ซึ่งมักมีหลายแผ่นงานรวมอยู่ในไฟล์เดียว (เช่น แผ่นงานยอดขาย แผ่นงานสินค้า และแผ่นงานสรุป)',
    caution: 'หากเรียก pd.read_excel() โดยไม่ระบุพารามิเตอร์ sheet_name โปรแกรมจะอ่านเฉพาะแผ่นงานแรกสุด (ลำดับที่ 0) เท่านั้น',
    params: [
      { name: 'io', defaultVal: '(จำเป็นต้องระบุ)', role: 'ชื่อไฟล์ Excel เช่น \'nvc_store_sales.xlsx\'' },
      { name: 'sheet_name', defaultVal: '0 (แผ่นงานแรกสุด)', role: 'ระบุชื่อแผ่นงานที่ต้องการอ่าน เช่น sheet_name=\'Branch_Orders_Dirty\' หรือลำดับแผ่นงาน' },
      { name: 'dtype', defaultVal: 'None', role: 'กำหนดชนิดข้อมูลของคอลัมน์ เช่นเดียวกับ read_csv()' }
    ],
    simulators: [
      {
        label: '1) สำรวจชื่อแผ่นงานด้วย ExcelFile()',
        code: "excel = pd.ExcelFile('nvc_store_sales.xlsx')\nexcel.sheet_names",
        cols: ['ลำดับแผ่นงาน', 'ชื่อแผ่นงานที่พบในไฟล์ (sheet_names)'],
        rows: [
          ['0 (แผ่นงานแรก)', "'Summary_Dashboard'"],
          ['1 (แผ่นงานที่สอง)', "'Branch_Orders_Dirty'"],
          ['2 (แผ่นงานที่สาม)', "'Product_Master'"]
        ],
        highlightProblem: false,
        note: 'ใช้ pd.ExcelFile(...).sheet_names เพื่อตรวจสอบว่าในไฟล์ Excel มีแผ่นงานใดบ้างและสะกดอย่างไรก่อนเลือกอ่าน'
      },
      {
        label: '2) ไม่ระบุ sheet_name (ค่าเริ่มต้น = 0)',
        code: "df = pd.read_excel('nvc_store_sales.xlsx')\n# ได้แผ่นงานแรกสุด ซึ่งอาจไม่ใช่แผ่นงานข้อมูลดิบ!",
        cols: ['แผ่นงานที่ถูกอ่านเข้ามา', 'ลักษณะข้อมูลที่ได้'],
        rows: [
          ['Summary_Dashboard (แผ่นงานที่ 0)', 'ได้ตารางสรุปยอด ไม่ใช่ตารางรายการสั่งซื้อที่ต้องการทำความสะอาด']
        ],
        highlightProblem: true,
        note: 'หากลืมระบุ sheet_name โปรแกรมจะดึงแผ่นงานที่ 0 มาให้อัตโนมัติ ซึ่งอาจเป็นหน้าปกหรือหน้าสรุป ไม่ใช่ข้อมูลที่ต้องใช้จริง'
      },
      {
        label: "3) ระบุ sheet_name='Branch_Orders_Dirty'",
        code: "df = pd.read_excel('nvc_store_sales.xlsx', sheet_name='Branch_Orders_Dirty')",
        cols: ['order_id', 'branch', 'product_code', 'qty'],
        rows: [
          ['ORD-201', 'สาขาเมือง', '  it-01 ', '2'],
          ['ORD-202', 'สาขาเหนือ', 'IT-02', '-1']
        ],
        highlightProblem: false,
        note: 'การระบุชื่อแผ่นงานในพารามิเตอร์ sheet_name ช่วยให้ดึงตารางเป้าหมายได้ตรงจุดแม่นยำ'
      }
    ]
  },
  {
    id: 'to_csv',
    num: 3,
    category: 'io',
    categoryLabel: 'หมวดที่ 1: นำเข้าและส่งออกไฟล์ (I/O)',
    token: 'df.to_csv()',
    signature: "df.to_csv(path_or_buf, index=True, index_label=None, encoding='utf-8')",
    purpose: 'บันทึกและส่งออกตาราง DataFrame จากหน่วยความจำออกเป็นไฟล์ CSV เพื่อนำไปส่งงานหรือใช้งานต่อ',
    whenToUse: 'ใช้ในขั้นตอนสุดท้ายหลังทำความสะอาดข้อมูลเสร็จสิ้น หรือเมื่อต้องการส่งออกตารางรายงานคุณภาพข้อมูลเป็นไฟล์ CSV',
    caution: 'ต้องตรวจสอบว่าดัชนี (Index) ของตารางเป็นตัวเลขลำดับแถวทั่วไป หรือเป็นชื่อรายการสำคัญ เพื่อเลือกใช้ index=False หรือ index_label ให้ถูกต้อง',
    params: [
      { name: 'path_or_buf', defaultVal: 'None', role: 'ตั้งชื่อไฟล์ CSV ปลายทางที่ต้องการบันทึก เช่น \'clean_data.csv\'' },
      { name: 'index', defaultVal: 'True (บันทึกดัชนีด้วย)', role: 'กำหนดเป็น False เมื่อไม่ต้องการให้ตัวเลขลำดับแถว (0, 1, 2...) ถูกสร้างเป็นคอลัมน์เกินมา' },
      { name: 'index_label', defaultVal: 'None', role: 'ตั้งชื่อหัวคอลัมน์ให้แก่ดัชนี (ใช้เมื่อ index=True และดัชนีเก็บชื่อรายการสำคัญ เช่น index_label=\'column\')' },
      { name: 'encoding', defaultVal: "'utf-8'", role: "กำหนดเป็น 'utf-8-sig' เพื่อให้เปิดไฟล์ CSV ที่มีภาษาไทยในโปรแกรม Microsoft Excel ได้โดยไม่เป็นภาษาต่างดาว" }
    ],
    simulators: [
      {
        label: '1) ค่าเริ่มต้น (index=True โดยไม่ตั้งชื่อ)',
        code: "df_clean.to_csv('output.csv')\npd.read_csv('output.csv').head(2)",
        cols: ['Unnamed: 0 (คอลัมน์เกิน!)', 'student_id', 'gpa'],
        rows: [
          ['0', 'S001', '3.25'],
          ['1', 'S002', '2.80']
        ],
        highlightProblem: true,
        note: 'เมื่อไม่ระบุ index=False โปรแกรมจะนำตัวเลขดัชนี 0, 1, 2... ไปบันทึกเป็นคอลัมน์แรก ทำให้เกิดคอลัมน์ Unnamed: 0 เกินมาเมื่ออ่านไฟล์กลับ'
      },
      {
        label: '2) กำหนด index=False (ตารางข้อมูลทั่วไป)',
        code: "df_clean.to_csv('output.csv', index=False, encoding='utf-8-sig')\npd.read_csv('output.csv').head(2)",
        cols: ['student_id', 'gpa'],
        rows: [
          ['S001', '3.25'],
          ['S002', '2.80']
        ],
        highlightProblem: false,
        note: 'เมื่อข้อมูลทุกอย่างอยู่ในคอลัมน์ปกติแล้ว การใช้ index=False จะตัดเลขลำดับแถวออก ได้ไฟล์ CSV ที่สะอาดพร้อมใช้งาน'
      },
      {
        label: "3) กำหนด index_label='column' (ตารางรายงานที่ดัชนีเก็บชื่อคอลัมน์)",
        code: "quality.to_csv('quality_report.csv', index_label='column', encoding='utf-8-sig')\npd.read_csv('quality_report.csv').head(3)",
        cols: ['column (มาจาก Index)', 'missing_count', 'missing_percent'],
        rows: [
          ['student_id', '0', '0.00'],
          ['age', '1', '2.38'],
          ['gpa', '2', '4.76']
        ],
        highlightProblem: false,
        note: 'กรณีตารางสรุปที่ชื่อรายการอยู่ตรงดัชนี (Index) ห้ามใช้ index=False แต่ให้ใช้ index_label=\'column\' เพื่อตั้งชื่อหัวคอลัมน์ให้ดัชนีอย่างชัดเจน'
      }
    ]
  },
  {
    id: 'head_tail',
    num: 4,
    category: 'inspect',
    categoryLabel: 'หมวดที่ 2: สำรวจโครงสร้างและนับความถี่ (Inspection)',
    token: 'df.head() & df.tail()',
    signature: 'df.head(n=5)  /  df.tail(n=5)',
    purpose: 'แสดงข้อมูลตัวอย่างส่วนต้นตาราง (head) หรือส่วนท้ายตาราง (tail) ตามจำนวนแถวที่กำหนด',
    whenToUse: 'ใช้ตรวจสอบความถูกต้องหลังนำเข้าข้อมูล และตรวจดูส่วนท้ายตารางว่ามีบรรทัดสรุปยอดรวม (Total) หรือบรรทัดว่างติดมาหรือไม่',
    caution: 'ต้องใส่วงเล็บ () เสมอ หากไม่ใส่ตัวเลขในวงเล็บ ค่าเริ่มต้นคือ n=5 แถว',
    params: [
      { name: 'n', defaultVal: '5', role: 'จำนวนแถวที่ต้องการแสดงผล เช่น df.head(3) แสดง 3 แถวแรก หรือ df.tail(2) แสดง 2 แถวสุดท้าย' }
    ],
    simulators: [
      {
        label: '1) df.head() — ค่าเริ่มต้น n=5',
        code: 'df.head()',
        cols: ['ลำดับดัชนี', 'student_id', 'major', 'gpa'],
        rows: [
          ['0', 'S001', 'เทคโนโลยีสารสนเทศ', '3.25'],
          ['1', 'S002', 'คอมพิวเตอร์ธุรกิจ', '2.80'],
          ['2', 'S003', 'การตลาด', '3.50'],
          ['3', 'S004', 'เทคโนโลยีสารสนเทศ', '<NA>'],
          ['4', 'S005', 'การตลาด', '2.95']
        ],
        highlightProblem: false,
        note: 'เมื่อไม่ระบุตัวเลขในวงเล็บ โปรแกรมจะใช้ค่าเริ่มต้น n=5 แสดงแถวดัชนีที่ 0 ถึง 4'
      },
      {
        label: '2) df.head(2) — ระบุจำนวนแถว n=2',
        code: 'df.head(2)',
        cols: ['ลำดับดัชนี', 'student_id', 'major', 'gpa'],
        rows: [
          ['0', 'S001', 'เทคโนโลยีสารสนเทศ', '3.25'],
          ['1', 'S002', 'คอมพิวเตอร์ธุรกิจ', '2.80']
        ],
        highlightProblem: false,
        note: 'สามารถส่งตัวเลขจำนวนเต็มเข้าสู่วงเล็บเพื่อขอดูเฉพาะจำนวนแถวที่ต้องการ เช่น 2 แถวแรก'
      },
      {
        label: '3) df.tail(2) — สำรวจ 2 แถวสุดท้าย',
        code: 'df.tail(2)',
        cols: ['ลำดับดัชนี', 'student_id', 'major', 'gpa'],
        rows: [
          ['40', 'S040', 'คอมพิวเตอร์ธุรกิจ', '3.10'],
          ['41', 'S040 (แถวซ้ำท้ายไฟล์)', 'คอมพิวเตอร์ธุรกิจ', '3.10']
        ],
        highlightProblem: false,
        note: 'df.tail(2) ช่วยให้เห็นแถวสุดท้ายของตาราง ทำให้สังเกตเห็นรหัสสุดท้ายและตรวจสอบแถวซ้ำหรือแถวสรุปยอดท้ายตารางได้'
      }
    ]
  },
  {
    id: 'shape_cols_dtypes',
    num: 5,
    category: 'inspect',
    categoryLabel: 'หมวดที่ 2: สำรวจโครงสร้างและนับความถี่ (Inspection)',
    token: 'df.shape / df.columns / df.dtypes',
    signature: 'df.shape  ·  df.columns  ·  df.dtypes   (Attribute ไม่มีวงเล็บ)',
    purpose: 'ตรวจสอบขนาดตาราง (แถว, คอลัมน์), รายชื่อคอลัมน์ทั้งหมด และชนิดข้อมูลของแต่ละคอลัมน์',
    whenToUse: 'ใช้สำรวจโครงสร้างตารางก่อนเริ่มเขียนคำสั่งคัดกรอง เพื่อป้องกันการสะกดชื่อคอลัมน์ผิดและตรวจสอบว่าคอลัมน์ตัวเลข/ข้อความมีชนิดถูกต้องหรือไม่',
    caution: 'ทั้ง 3 คำสั่งนี้เป็น Attribute (ค่าคุณสมบัติของตาราง) ห้ามใส่เครื่องหมายวงเล็บ () ต่อท้ายโดยเด็ดขาด',
    params: [
      { name: '(ไม่มีพารามิเตอร์)', defaultVal: 'ไม่ต้องใส่วงเล็บ ()', role: 'เรียกใช้งานผ่านจุดได้เลย เช่น df.shape[0] เพื่อดึงเฉพาะจำนวนแถว หรือ df.columns.tolist() เพื่อแปลงรายชื่อคอลัมน์เป็น List' }
    ],
    simulators: [
      {
        label: '1) df.shape — ดูขนาด (แถว, คอลัมน์)',
        code: 'df.shape\n# หรือใช้ len(df) เพื่อดูเฉพาะจำนวนแถว = 42',
        cols: ['คำสั่งที่รัน', 'ผลลัพธ์ที่ได้', 'ความหมาย'],
        rows: [
          ['df.shape', '(42, 7)', 'ตารางมี 42 แถว และ 7 คอลัมน์'],
          ['df.shape[0] หรือ len(df)', '42', 'ดึงเฉพาะจำนวนแถวทั้งหมด (ใช้เป็นตัวหารร้อยละ)']
        ],
        highlightProblem: false,
        note: 'df.shape คืนค่าเป็น Tuple (จำนวนแถว, จำนวนคอลัมน์) เสมอ'
      },
      {
        label: '2) df.columns — ดูรายชื่อคอลัมน์ทั้งหมด',
        code: 'df.columns',
        cols: ['ลำดับคอลัมน์', 'ชื่อคอลัมน์ในตาราง (ต้องสะกดตัวพิมพ์เล็ก-ใหญ่ให้ตรงกัน)'],
        rows: [
          ['0–3', "'student_id', 'full_name', 'major', 'age'"],
          ['4–6', "'gpa', 'phone', 'updated_date'"]
        ],
        highlightProblem: false,
        note: 'ช่วยให้เห็นชื่อคอลัมน์ที่แท้จริงในไฟล์ เช่น ใช้ phone ไม่ใช่ customer_phone'
      },
      {
        label: '3) df.dtypes — ตรวจชนิดข้อมูลรายคอลัมน์',
        code: 'df.dtypes',
        cols: ['ชื่อคอลัมน์', 'ชนิดข้อมูล (dtype)', 'สถานะการนำไปใช้งาน'],
        rows: [
          ['age, gpa', 'float64', 'พร้อมคำนวณทางคณิตศาสตร์และสถิติ'],
          ['phone', 'string', 'ถูกต้อง! รักษาเลข 0 นำหน้าและใช้ .str.len() ได้'],
          ['updated_date', 'object (ข้อความ)', 'ต้องแปลงด้วย pd.to_datetime() ก่อนเปรียบเทียบวันที่']
        ],
        highlightProblem: false,
        note: 'คอลัมน์วันที่ที่เพิ่งอ่านมาจากไฟล์ CSV มักมีชนิดเป็น object (ข้อความ) จึงต้องตรวจสอบด้วย df.dtypes เสมอ'
      }
    ]
  },
  {
    id: 'info_describe',
    num: 6,
    category: 'inspect',
    categoryLabel: 'หมวดที่ 2: สำรวจโครงสร้างและนับความถี่ (Inspection)',
    token: 'df.info() & df.describe()',
    signature: 'df.info()  /  df.describe(include=None)',
    purpose: 'df.info() สรุปจำนวนข้อมูลที่ไม่ว่าง (Non-Null) และชนิดข้อมูล ส่วน df.describe() คำนวณค่าสถิติพื้นฐานเพื่อหาค่าผิดปกติ (Outliers)',
    whenToUse: 'ใช้ตรวจสุขภาพของตารางในภาพรวม โดยดูค่า min และ max จาก df.describe() ว่ามีค่าติดลบหรือสูงผิดปกติปะปนอยู่หรือไม่',
    caution: 'ค่าเริ่มต้นของ df.describe() จะคำนวณเฉพาะคอลัมน์ที่เป็นตัวเลข (int/float) เท่านั้น หากต้องการดูคอลัมน์ข้อความด้วยต้องระบุ include=\'all\'',
    params: [
      { name: 'include (ใน describe)', defaultVal: 'None (เฉพาะตัวเลข)', role: "กำหนดเป็น 'all' หรือ ['object', 'string'] เมื่อต้องการดูสถิติของคอลัมน์ข้อความ (เช่น ค่าที่พบบ่อยที่สุด top และความถี่ freq)" },
      { name: 'percentiles (ใน describe)', defaultVal: '[.25, .5, .75]', role: 'กำหนดควอไทล์หรือเปอร์เซ็นไทล์ที่ต้องการแสดงผล' }
    ],
    simulators: [
      {
        label: '1) df.describe() — ค่าเริ่มต้น (เฉพาะตัวเลข)',
        code: 'df.describe()',
        cols: ['ค่าสถิติ', 'age (อายุ)', 'gpa (เกรดเฉลี่ย)'],
        rows: [
          ['count (จำนวนที่ไม่ว่าง)', '41.00', '40.00'],
          ['mean (ค่าเฉลี่ย)', '21.85', '3.18'],
          ['min (ค่าต่ำสุด)', '-5.00 (ผิดปกติ!)', '1.95'],
          ['max (ค่าสูงสุด)', '99.00 (ผิดปกติ!)', '4.50 (เกิน 4.00!)']
        ],
        highlightProblem: true,
        note: 'การดูค่า min และ max ใน df.describe() ช่วยจับผิดค่าที่เป็นไปไม่ได้ทันที เช่น อายุ -5 ปี หรือเกรดเฉลี่ย 4.50'
      },
      {
        label: "2) df.describe(include='all') — รวมคอลัมน์ข้อความ",
        code: "df.describe(include='all')",
        cols: ['ค่าสถิติ', 'major (ข้อความ)', 'gpa (ตัวเลข)'],
        rows: [
          ['count', '42', '40.00'],
          ['unique (จำนวนค่าที่ไม่ซ้ำ)', '5 รูปแบบ', '—'],
          ['top (ค่าที่พบบ่อยที่สุด)', 'เทคโนโลยีสารสนเทศ (15 ครั้ง)', '—'],
          ['mean / min / max', '—', '3.18 / 1.95 / 4.50']
        ],
        highlightProblem: false,
        note: 'พารามิเตอร์ include=\'all\' ช่วยให้เห็นจำนวนรูปแบบที่ไม่ซ้ำ (unique) และค่าฐานนิยม (top) ของคอลัมน์ข้อความด้วย'
      },
      {
        label: '3) df.info() — ตรวจ Non-Null Count เทียบจำนวนแถว',
        code: 'df.info()',
        cols: ['คอลัมน์', 'Non-Null Count (จาก 42 แถว)', 'ชนิดข้อมูล (Dtype)'],
        rows: [
          ['student_id', '42 non-null (ครบ)', 'object'],
          ['age', '41 non-null (ว่าง 1)', 'float64'],
          ['gpa', '40 non-null (ว่าง 2)', 'float64'],
          ['phone', '41 non-null (ว่าง 1)', 'string']
        ],
        highlightProblem: false,
        note: 'คอลัมน์ใดที่มี Non-Null Count น้อยกว่าจำนวนแถวทั้งหมด (42 แถว) แสดงว่าคอลัมน์นั้นมีข้อมูลสูญหาย (Missing Values)'
      }
    ]
  },
  {
    id: 'value_counts',
    num: 7,
    category: 'inspect',
    categoryLabel: 'หมวดที่ 2: สำรวจโครงสร้างและนับความถี่ (Inspection)',
    token: "df['col'].value_counts()",
    signature: "df['col'].value_counts(dropna=True, normalize=False, ascending=False)",
    purpose: 'นับจำนวนความถี่ของข้อมูลแต่ละรายการในคอลัมน์ เพื่อสำรวจการกระจายตัวและค้นหาคำที่สะกดไม่เป็นมาตรฐานเดียวกัน',
    whenToUse: 'ใช้ตรวจสอบความสม่ำเสมอของข้อมูล (Consistency) เช่น ตรวจชื่อสาขาวิชา ชื่อหมวดหมู่สินค้า หรือสถานะการชำระเงิน',
    caution: 'ค่าเริ่มต้น dropna=True จะไม่นำค่าว่าง (NaN) มานับแสดงผล หากต้องการเห็นจำนวนค่าว่างในผลลัพธ์ด้วย ต้องตั้งค่า dropna=False',
    params: [
      { name: 'dropna', defaultVal: 'True (ไม่นับค่าว่าง)', role: 'กำหนดเป็น False เมื่อต้องการให้นับจำนวนแถวที่เป็นค่าว่าง (NaN / <NA>) แสดงในตารางผลลัพธ์ด้วย' },
      { name: 'normalize', defaultVal: 'False (แสดงจำนวนนับ)', role: 'กำหนดเป็น True เมื่อต้องการให้คำนวณเป็นสัดส่วน (0.0–1.0) แทนจำนวนนับ (คูณ 100 จะได้ค่าร้อยละ)' },
      { name: 'ascending', defaultVal: 'False (มากไปน้อย)', role: 'กำหนดเป็น True เมื่อต้องการเรียงลำดับจากค่าที่พบน้อยที่สุดไปมากที่สุด' }
    ],
    simulators: [
      {
        label: '1) ค่าเริ่มต้น (dropna=True, เรียงมากไปน้อย)',
        code: "df['major'].value_counts()",
        cols: ['ค่าในคอลัมน์ major', 'จำนวนแถวที่พบ (count)'],
        rows: [
          ['เทคโนโลยีสารสนเทศ', '15'],
          ['คอมพิวเตอร์ธุรกิจ', '14'],
          ['การตลาด', '11'],
          ['IT  (สะกดไม่ตรงมาตรฐาน!)', '1'],
          ['เทคโนโลยี สารสนเทศ  (มีวรรคกลางคำ!)', '1']
        ],
        highlightProblem: true,
        note: 'ช่วยให้เห็นทันทีว่ามีชื่อสาขาวิชาที่สะกดต่างจากมาตรฐาน 2 รูปแบบ คือ IT และ เทคโนโลยี สารสนเทศ'
      },
      {
        label: '2) กำหนด dropna=False (นับรวมค่าว่างด้วย)',
        code: "df['gpa_grade'].value_counts(dropna=False)",
        cols: ['เกรดเฉลี่ย (gpa_grade)', 'จำนวนแถวที่พบ (รวมค่าว่าง)'],
        rows: [
          ['เกรดดี (3.00 ขึ้นไป)', '26'],
          ['เกรดปกติ (2.00–2.99)', '14'],
          ['NaN (ข้อมูลสูญหาย)', '2  (แสดงค่าว่างออกมาด้วย!)']
        ],
        highlightProblem: false,
        note: 'การตั้งค่า dropna=False มีประโยชน์มากในการทำรายงานคุณภาพข้อมูล เพราะแสดงทั้งค่าปกติและจำนวนค่าว่างครบทุกแถว'
      },
      {
        label: '3) กำหนด normalize=True (คิดเป็นสัดส่วน/ร้อยละ)',
        code: "df['major'].value_counts(normalize=True) * 100",
        cols: ['ค่าในคอลัมน์ major', 'ร้อยละของทั้งหมด (%)'],
        rows: [
          ['เทคโนโลยีสารสนเทศ', '35.71%'],
          ['คอมพิวเตอร์ธุรกิจ', '33.33%'],
          ['การตลาด', '26.19%'],
          ['IT / เทคโนโลยี สารสนเทศ', '2.38% / 2.38%']
        ],
        highlightProblem: false,
        note: 'เมื่อระบุ normalize=True แล้วคูณด้วย 100 จะได้สัดส่วนร้อยละของแต่ละหมวดหมู่ทันที'
      }
    ]
  },
  {
    id: 'isna_sum_any',
    num: 8,
    category: 'missing',
    categoryLabel: 'หมวดที่ 3: จัดการค่าว่างและข้อมูลซ้ำ (Missing & Duplicates)',
    token: 'df.isna() / .notna() & .sum() / .any()',
    signature: 'df.isna().sum(axis=0)  /  df.isna().any(axis=1)',
    purpose: 'ตรวจสอบตำแหน่งข้อมูลสูญหาย (isna คืนค่า True เมื่อว่าง, notna คืนค่า True เมื่อมีข้อมูล) พร้อมสรุปจำนวนรายคอลัมน์หรือรายแถว',
    whenToUse: 'ใช้ตรวจสอบความสมบูรณ์ของข้อมูล (Completeness) ทั้งการนับค่าว่างแยกตามรายคอลัมน์ และการนับจำนวนแถวที่มีค่าว่างอย่างน้อย 1 ช่อง',
    caution: 'ต้องระวังพารามิเตอร์ axis! ค่าเริ่มต้น axis=0 คือการรวมตามแนวตั้ง (ได้ผลรายคอลัมน์) ส่วน axis=1 คือการตรวจตามแนวนอน (ได้ผลรายแถว)',
    params: [
      { name: 'axis (ใน .sum() / .any())', defaultVal: '0 (สรุปรายคอลัมน์)', role: 'กำหนด axis=0 เพื่อสรุปผลแยกตามรายคอลัมน์ หรือกำหนด axis=1 เพื่อตรวจสอบข้ามคอลัมน์ในแต่ละแถว' }
    ],
    simulators: [
      {
        label: '1) df.isna().sum() — นับค่าว่างรายคอลัมน์ (axis=0)',
        code: 'missing_count = df.isna().sum()\nmissing_count',
        cols: ['ชื่อคอลัมน์ (Index)', 'จำนวนค่าว่าง (missing_count)'],
        rows: [
          ['student_id / full_name / major', '0'],
          ['age', '1'],
          ['gpa', '2'],
          ['phone', '1']
        ],
        highlightProblem: false,
        note: 'ค่าเริ่มต้น axis=0 จะบวกค่า True ลงมาตามแนวตั้ง ทำให้ทราบว่าแต่ละคอลัมน์มีค่าว่างกี่จุด'
      },
      {
        label: '2) df.isna().any(axis=1) — ตรวจแถวที่มีค่าว่างอย่างน้อย 1 ช่อง',
        code: 'missing_rows = df.isna().any(axis=1)\nmissing_rows.sum()',
        cols: ['รหัสผู้เรียน', 'age', 'gpa', 'phone', 'ผลลัพธ์ .any(axis=1)'],
        rows: [
          ['S001', '20', '3.25', '0812345678', 'False (ข้อมูลครบทุกช่อง)'],
          ['S004', '19', '<NA>', '0891112222', 'True (พบค่าว่างอย่างน้อย 1 ช่อง)'],
          ['S016', '<NA>', '<NA>', '0863334444', 'True (ว่าง 2 ช่อง นับเป็น 1 แถวที่ไม่สมบูรณ์)']
        ],
        highlightProblem: true,
        note: 'การใช้ .any(axis=1) ตรวจในแนวนอนทีละแถว เมื่อต่อด้วย .sum() จะได้จำนวนแถวที่มีข้อมูลไม่สมบูรณ์ (4 แถว)'
      },
      {
        label: '3) ใช้ .notna() ร่วมกับการกรองข้อมูล',
        code: "phone_bad = (df['phone'].str.len() != 10) & df['phone'].notna()\ndf.loc[phone_bad, ['student_id', 'phone']]",
        cols: ['student_id', 'phone', 'ความยาว (.str.len())', 'เหตุผลที่ต้องใช้ .notna()'],
        rows: [
          ['S026', "'0812'", '4 หลัก (ผิดรูปแบบ)', 'มีข้อมูลแต่ไม่ครบ 10 หลัก (นับเป็นปัญหาความถูกต้อง)'],
          ['S023', '<NA>', 'ค่าว่าง', 'ถูกตัดออกด้วย .notna() เพื่อไม่ให้นับซ้ำกับมิติความสมบูรณ์']
        ],
        highlightProblem: false,
        note: 'การใช้ & df[\'phone\'].notna() ช่วยแยกแยะปัญหา "กรอกข้อมูลผิดรูปแบบ" ออกจากปัญหา "ไม่ได้กรอกข้อมูล (ค่าว่าง)"'
      }
    ]
  },
  {
    id: 'dropna',
    num: 9,
    category: 'missing',
    categoryLabel: 'หมวดที่ 3: จัดการค่าว่างและข้อมูลซ้ำ (Missing & Duplicates)',
    token: 'df.dropna()',
    signature: "df.dropna(axis=0, how='any', subset=None)",
    purpose: 'คัดกรองแถว (หรือคอลัมน์) ที่มีข้อมูลสูญหายออกจากตารางตามเงื่อนไขคอลัมน์ที่กำหนด',
    whenToUse: 'ใช้เมื่อค่าว่างเกิดขึ้นในคอลัมน์สำคัญที่ไม่สามารถคาดเดาหรือเติมค่าแทนได้ เช่น ยอดขายรวม (total_price) หรือเกรดเฉลี่ยที่ต้องใช้คำนวณโดยตรง',
    caution: 'ห้ามรัน df.dropna() โดยไม่ระบุ subset หากในตารางมีคอลัมน์รอง (เช่น หมายเลขโทรศัพท์หรือหมายเหตุ) ที่อนุญาตให้ว่างได้ เพราะจะทำให้แถวข้อมูลสำคัญถูกลบไปด้วย',
    params: [
      { name: 'subset', defaultVal: 'None (ตรวจทุกคอลัมน์)', role: 'ระบุรายชื่อคอลัมน์เป้าหมายที่ต้องการตรวจค่าว่าง เช่น subset=[\'quantity\', \'total_price\']' },
      { name: 'how', defaultVal: "'any' (ว่างเพียง 1 ช่องก็ลบ)", role: "กำหนด 'any' เพื่อลบเมื่อพบค่าว่างอย่างน้อย 1 คอลัมน์ หรือ 'all' เพื่อลบเฉพาะแถวที่ว่างทุกคอลัมน์" },
      { name: 'axis', defaultVal: '0 (ลบแถว)', role: '0 สำหรับลบแถวที่มีค่าว่าง และ 1 สำหรับลบคอลัมน์ที่มีค่าว่าง' }
    ],
    simulators: [
      {
        label: '1) ตารางก่อนลบค่าว่าง (4 แถวตัวอย่าง)',
        code: '# ตารางข้อมูลก่อนใช้คำสั่ง dropna()',
        cols: ['order_id', 'customer_phone (คอลัมน์รอง)', 'total_price (คอลัมน์หลัก)'],
        rows: [
          ['ORD-101', '0812345678', '590.0'],
          ['ORD-102', '<NA> (ลูกค้าไม่แจ้งเบอร์)', '1250.0 (มียอดขายจริง!)'],
          ['ORD-103', '0891112222', '<NA> (ยอดขายหาย!)'],
          ['ORD-104', '<NA>', '<NA>']
        ],
        highlightProblem: true,
        note: 'สังเกตว่า ORD-102 มียอดขายจริง 1,250 บาท เพียงแค่ไม่มีเบอร์โทรศัพท์ ส่วน ORD-103 และ ORD-104 ไม่มียอดขาย'
      },
      {
        label: '2) ไม่ระบุ subset: df.dropna() (ลบเหมาเข่ง!)',
        code: 'df.dropna()  # อันตราย! ลบแถวที่ว่างในคอลัมน์ใดก็ได้',
        cols: ['order_id', 'customer_phone', 'total_price'],
        rows: [
          ['ORD-101', '0812345678', '590.0']
        ],
        highlightProblem: true,
        note: 'หากไม่ระบุ subset คำสั่ง df.dropna() จะลบ ORD-102 ทิ้งไปด้วย ทั้งที่มียอดขาย 1,250 บาท ทำให้ยอดขายรวมของร้านค้าหายไป!'
      },
      {
        label: "3) ระบุ subset=['total_price'] (ลบเฉพาะคอลัมน์สำคัญ)",
        code: "df_clean = df.dropna(subset=['total_price'])",
        cols: ['order_id', 'customer_phone', 'total_price'],
        rows: [
          ['ORD-101', '0812345678', '590.0'],
          ['ORD-102', '<NA> (เก็บรักษาแถวนี้ไว้ได้!)', '1250.0']
        ],
        highlightProblem: false,
        note: 'การระบุ subset=[\'total_price\'] ช่วยลบเฉพาะแถวที่ยอดขายว่าง (ORD-103, ORD-104) และรักษา ORD-102 ไว้คำนวณยอดขายได้อย่างถูกต้อง'
      }
    ]
  },
  {
    id: 'fillna',
    num: 10,
    category: 'missing',
    categoryLabel: 'หมวดที่ 3: จัดการค่าว่างและข้อมูลซ้ำ (Missing & Duplicates)',
    token: 'df.fillna()',
    signature: 'df.fillna(value=None)',
    purpose: 'เติมค่าที่กำหนดลงไปแทนที่ตำแหน่งที่เป็นค่าว่าง (NaN / <NA>) โดยไม่ต้องลบแถวข้อมูลทิ้ง',
    whenToUse: 'ใช้เมื่อทราบความหมายตามบริบทของค่าว่างอย่างชัดเจน เช่น ค่าจัดส่งที่ว่างหมายถึงส่งฟรี (เติม 0) หรือหมายเลขโทรศัพท์ที่ว่างให้ระบุว่า \'ไม่ระบุ\'',
    caution: 'ไม่ควรเติมค่า 0 ลงในคอลัมน์เกรดเฉลี่ย (gpa) หรืออายุ (age) โดยพลการ เพราะจะดึงค่าเฉลี่ยของกลุ่มให้ต่ำลงอย่างผิดเพี้ยน',
    params: [
      { name: 'value', defaultVal: '(จำเป็นต้องระบุ)', role: 'ค่าที่ต้องการนำไปเติมแทนค่าว่าง อาจเป็นค่าเดี่ยว เช่น 0, \'ไม่ระบุ\' หรือส่งเป็น Dictionary เพื่อเติมแต่ละคอลัมน์ด้วยค่าที่ต่างกัน' }
    ],
    simulators: [
      {
        label: "1) เติมข้อความในคอลัมน์เดียว: .fillna('ไม่ระบุ')",
        code: "df['phone'] = df['phone'].fillna('ไม่ระบุ')",
        cols: ['student_id', 'phone (ก่อนเติม)', 'phone (หลังรัน .fillna(\'ไม่ระบุ\'))'],
        rows: [
          ['S001', '0812345678', '0812345678'],
          ['S023', '<NA>', "'ไม่ระบุ' (ไม่มีค่าว่างค้างอยู่)"]
        ],
        highlightProblem: false,
        note: 'เหมาะสำหรับคอลัมน์ข้อความหรือข้อมูลติดต่อ เพื่อแสดงสถานะชัดเจนแทนการปล่อยเป็นช่องว่าง'
      },
      {
        label: "2) เติมค่าเริ่มต้นก่อนแปลงชนิดข้อมูล: .fillna('0 บาท')",
        code: "orders['shipping_fee'] = orders['shipping_fee_text'].fillna('0 บาท').str.replace(' บาท', '', regex=False).astype(float)",
        cols: ['order_id', 'shipping_fee_text (เดิม)', 'shipping_fee (ผลลัพธ์ float)'],
        rows: [
          ['ORD-201', "'40 บาท'", '40.0'],
          ['ORD-202', '<NA> (โปรโมชันส่งฟรี)', '0.0']
        ],
        highlightProblem: false,
        note: 'เติม \'0 บาท\' แทนค่าว่างก่อนตัดคำว่า \' บาท\' และแปลงเป็น float ทำให้คำนวณค่าจัดส่งรวมได้ครบทุกแถว'
      },
      {
        label: '3) เติมหลายคอลัมน์พร้อมกันด้วย Dictionary',
        code: "df = df.fillna({'phone': 'ไม่ระบุ', 'discount': 0})",
        cols: ['คอลัมน์ที่ถูกเติมค่า', 'ค่าที่นำไปเติมแทน NaN', 'ผลลัพธ์'],
        rows: [
          ['phone', "'ไม่ระบุ'", 'คอลัมน์ข้อความถูกเติมด้วยคำว่า ไม่ระบุ'],
          ['discount', '0', 'คอลัมน์ส่วนลดที่ว่างถูกเติมด้วยเลข 0 บาท']
        ],
        highlightProblem: false,
        note: 'การส่ง Dictionary เข้าไปใน value ของ df.fillna({...}) ช่วยกำหนดค่าที่จะเติมแยกตามรายคอลัมน์ได้ในคำสั่งเดียว'
      }
    ]
  },
  {
    id: 'duplicated_drop',
    num: 11,
    category: 'missing',
    categoryLabel: 'หมวดที่ 3: จัดการค่าว่างและข้อมูลซ้ำ (Missing & Duplicates)',
    token: 'df.duplicated() & df.drop_duplicates()',
    signature: "df.duplicated(subset=None, keep='first')  /  df.drop_duplicates(subset=None, keep='first')",
    purpose: 'ตรวจสอบแถวข้อมูลที่บันทึกซ้ำซ้อน (duplicated) และลบแถวที่ซ้ำออกโดยเก็บแถวหลักไว้ (drop_duplicates)',
    whenToUse: 'ใช้ป้องกันการนับจำนวนคนหรือยอดขายซ้ำสองครั้งจากข้อมูลที่ถูกกดบันทึกซ้ำ',
    caution: 'พารามิเตอร์ keep=\'first\' (ค่าเริ่มต้น) จะให้แถวแรกเป็น False และแถวที่ซ้ำตามมาเป็น True แต่ถ้าต้องการดึงทั้งแถวแรกและแถวที่ซ้ำมาดูเปรียบเทียบกัน ต้องใช้ keep=False',
    params: [
      { name: 'subset', defaultVal: 'None (ต้องซ้ำกันทุกคอลัมน์)', role: "ระบุคอลัมน์คีย์หลักที่ใช้ตัดสินความซ้ำ เช่น subset=['order_id'] หรือ subset=['student_id']" },
      { name: 'keep', defaultVal: "'first'", role: "'first' = เก็บแถวแรกไว้ (มองว่าแถวถัดไปซ้ำ), 'last' = เก็บแถวสุดท้ายไว้, False = ระบุว่าทุกแถวที่ซ้ำกันเป็น True ทั้งหมด" }
    ],
    simulators: [
      {
        label: "1) df.duplicated(keep='first') — ค่าเริ่มต้น",
        code: "df.duplicated(subset=['student_id'], keep='first')",
        cols: ['ลำดับแถว', 'student_id', 'gpa', "ผลลัพธ์ keep='first'"],
        rows: [
          ['แถวที่ 10', 'S010', '3.10', 'False (ถือเป็นแถวต้นฉบับแถวแรก)'],
          ['แถวที่ 11', 'S010', '3.10', 'True (ถือเป็นสำเนาที่ซ้ำ!)']
        ],
        highlightProblem: false,
        note: 'เมื่อใช้ keep=\'first\' แล้วต่อด้วย .sum() จะได้จำนวนสำเนาที่เกิดซ้ำเกินมา (เช่น พบซ้ำ 2 แถว)'
      },
      {
        label: '2) df.duplicated(keep=False) — แสดงคู่ที่ซ้ำทั้งหมด',
        code: "df[df.duplicated(subset=['student_id'], keep=False)]",
        cols: ['ลำดับแถว', 'student_id', 'gpa', 'ผลลัพธ์ keep=False'],
        rows: [
          ['แถวที่ 10', 'S010', '3.10', 'True (แสดงออกมาเพื่อเปรียบเทียบ)'],
          ['แถวที่ 11', 'S010', '3.10', 'True (แสดงออกมาคู่กัน)']
        ],
        highlightProblem: true,
        note: 'การตั้งค่า keep=False เหมาะอย่างยิ่งเมื่อผู้วิเคราะห์ต้องการดึงทั้งแถวต้นฉบับและแถวที่ซ้ำมาวางเทียบกันบนหน้าจอ'
      },
      {
        label: "3) df.drop_duplicates(subset=['student_id'], keep='first')",
        code: "df_unique = df.drop_duplicates(subset=['student_id'], keep='first')",
        cols: ['ลำดับแถวที่เหลืออยู่', 'student_id', 'gpa', 'สถานะ'],
        rows: [
          ['แถวที่ 10', 'S010', '3.10', 'เก็บรักษาแถวแรกไว้ และลบแถวที่ 11 ออกเรียบร้อย']
        ],
        highlightProblem: false,
        note: 'ลบสำเนาที่ซ้ำออก เหลือรหัส S010 เพียง 1 แถวเดียว'
      }
    ]
  },
  {
    id: 'str_methods',
    num: 12,
    category: 'transform',
    categoryLabel: 'หมวดที่ 4: จัดการข้อความและแปลงชนิดข้อมูล (String & Types)',
    token: '.str.strip() / .str.upper() / .str.lower() / .str.len()',
    signature: "df['col'].str.strip()  ·  .str.upper()  ·  .str.lower()  ·  .str.len()",
    purpose: 'จัดการข้อมูลข้อความในคอลัมน์ทีละแถว ได้แก่ ตัดช่องว่างส่วนเกิน แปลงตัวพิมพ์ใหญ่/เล็ก และนับจำนวนตัวอักษร',
    whenToUse: 'ใช้จัดมาตรฐานรหัสสินค้า ชื่อหมวดหมู่ หรือตรวจสอบความยาวของหมายเลขโทรศัพท์ (10 หลัก) และรหัสไปรษณีย์ (5 หลัก)',
    caution: 'ต้องเรียกผ่านตัวจัดการ .str เสมอ (เช่น df[\'code\'].str.strip()) หากพิมพ์ df[\'code\'].strip() โดยไม่มี .str โปรแกรมจะแจ้ง AttributeError ทันที',
    params: [
      { name: 'to_strip (ใน .str.strip())', defaultVal: 'None (ตัดช่องว่างและแท็บ)', role: 'หากไม่ระบุจะตัดช่องว่าง (Space) ด้านหน้าสุดและด้านหลังสุดของข้อความออกอัตโนมัติ (ไม่ตัดช่องว่างตรงกลางคำ)' }
    ],
    simulators: [
      {
        label: '1) ก่อนจัดรูปแบบข้อความ (ปัญหาช่องว่างและตัวพิมพ์)',
        code: "df['book_id'].value_counts()",
        cols: ['ค่าในคอลัมน์ book_id (เดิม)', 'จำนวนที่นับได้', 'ปัญหาที่เกิดขึ้น'],
        rows: [
          ["'BK-101'", '5', 'รหัสมาตรฐาน'],
          ["'  bk-101 '", '2', 'มีช่องว่างหน้า-หลังและเป็นตัวพิมพ์เล็ก จึงถูกนับแยกเป็นคนละรหัส!']
        ],
        highlightProblem: true,
        note: 'คอมพิวเตอร์มองว่า \'BK-101\' กับ \'  bk-101 \' เป็นคนละค่ากัน ทำให้ยอดรวมของรหัส BK-101 ไม่ครบ 7 รายการ'
      },
      {
        label: '2) ใช้ Method Chaining: .str.strip().str.upper()',
        code: "df['book_id'] = df['book_id'].str.strip().str.upper()\ndf['book_id'].value_counts()",
        cols: ['ค่าในคอลัมน์ book_id (หลังจัดมาตรฐาน)', 'จำนวนที่นับได้รวมกัน'],
        rows: [
          ["'BK-101'", '7  (รวมกันครบถ้วนถูกต้อง!)']
        ],
        highlightProblem: false,
        note: '.str.strip() ตัดช่องว่างซ้าย-ขวาออกก่อน แล้วส่งต่อให้ .str.upper() แปลงเป็นตัวพิมพ์ใหญ่ทั้งหมด'
      },
      {
        label: '3) นับความยาวตัวอักษรด้วย .str.len()',
        code: "phone_len = df['phone'].str.len()\ndf.loc[phone_len != 10, ['student_id', 'phone']]",
        cols: ['student_id', 'phone (string)', 'ผลลัพธ์จาก .str.len()', 'ผลการตรวจสอบ'],
        rows: [
          ['S001', "'0812345678'", '10', 'ปกติ (ครบ 10 หลัก)'],
          ['S026', "'0812'", '4', 'ผิดปกติ! (ไม่เท่ากับ 10 หลัก)']
        ],
        highlightProblem: false,
        note: '.str.len() คืนค่าจำนวนตัวอักษรของแต่ละแถว ใช้ตรวจสอบความถูกต้องของรหัสหรือหมายเลขโทรศัพท์ได้รวดเร็ว'
      }
    ]
  },
  {
    id: 'replace_methods',
    num: 13,
    category: 'transform',
    categoryLabel: 'หมวดที่ 4: จัดการข้อความและแปลงชนิดข้อมูล (String & Types)',
    token: '.str.replace() & .replace()',
    signature: "df['col'].str.replace(pat, repl, regex=False)  /  df['col'].replace(to_replace_dict)",
    purpose: '.str.replace() ใช้แทนที่หรือตัดอักขระบางส่วนภายในข้อความ ส่วน .replace({...}) ใช้จับคู่เปลี่ยนคำทั้งคำตามพจนานุกรมมาตรฐาน',
    whenToUse: 'ใช้ .str.replace() เมื่อต้องการตัดหน่วยเงิน (\' บาท\') หรือลูกน้ำ (\',\') ออกจากตัวเลข และใช้ .replace(dict) เมื่อต้องการรวมชื่อหมวดหมู่ที่เรียกต่างกันให้เป็นชื่อมาตรฐานเดียว',
    caution: 'อย่าสับสนระหว่าง 2 คำสั่งนี้! หากต้องการเปลี่ยนเฉพาะบางส่วนของข้อความ (เช่น ตัดคำว่า \' บาท\' ทิ้ง) ต้องมี .str นำหน้าเป็น .str.replace()',
    params: [
      { name: 'pat, repl (ใน .str.replace)', defaultVal: '(จำเป็นต้องระบุ)', role: "ระบุข้อความเดิมที่ต้องการค้นหา (pat) และข้อความใหม่ที่ต้องการใส่แทน (repl) หากต้องการตัดทิ้งให้ใส่ '' (ข้อความว่าง)" },
      { name: 'regex (ใน .str.replace)', defaultVal: 'False / True', role: 'กำหนด regex=False เมื่อต้องการค้นหาและแทนที่ตามตัวอักษรตรงตัว (ปลอดภัยและทำงานเร็วกว่า)' },
      { name: 'to_replace (ใน .replace)', defaultVal: '(จำเป็นต้องระบุ)', role: "ส่ง Dictionary จับคู่ {'คำเดิมที่ผิด': 'คำมาตรฐานใหม่'} เพื่อเปลี่ยนค่าที่ตรงกันทั้งช่อง" }
    ],
    simulators: [
      {
        label: "1) ตัดหน่วยและลูกน้ำด้วย .str.replace(..., '', regex=False)",
        code: "df['price_clean'] = df['price_text'].str.replace(',', '', regex=False).str.replace(' บาท', '', regex=False)",
        cols: ['ค่าเดิม (price_text)', "หลังตัด ','", "หลังตัด ' บาท' (พร้อมแปลงเป็นตัวเลข)"],
        rows: [
          ["'1,250 บาท'", "'1250 บาท'", "'1250'"],
          ["'590 บาท'", "'590 บาท'", "'590'"]
        ],
        highlightProblem: false,
        note: 'ใช้ .str.replace() แทนที่ลูกน้ำและหน่วยภาษาไทยด้วยข้อความว่าง \'\' เพื่อเตรียมแปลงเป็น float ในขั้นถัดไป'
      },
      {
        label: '2) จัดกลุ่มคำเรียกที่หลากหลายด้วย .replace(dict)',
        code: "major_map = {'IT': 'เทคโนโลยีสารสนเทศ', 'เทคโนโลยี สารสนเทศ': 'เทคโนโลยีสารสนเทศ'}\ndf['major'] = df['major'].replace(major_map)",
        cols: ['ค่าเดิมในคอลัมน์ major', 'ค่าหลังใช้ .replace(major_map)'],
        rows: [
          ["'IT'", "'เทคโนโลยีสารสนเทศ'"],
          ["'เทคโนโลยี สารสนเทศ'", "'เทคโนโลยีสารสนเทศ'"],
          ["'การตลาด' (ไม่อยู่ใน Dict)", "'การตลาด' (คงเดิมไม่เปลี่ยนแปลง)"]
        ],
        highlightProblem: false,
        note: 'คำสั่ง .replace(dict) จะเปลี่ยนเฉพาะค่าที่ตรงกับคีย์ใน Dictionary เท่านั้น ส่วนค่าอื่นที่ถูกต้องอยู่แล้วจะคงเดิม'
      }
    ]
  },
  {
    id: 'type_conversion',
    num: 14,
    category: 'transform',
    categoryLabel: 'หมวดที่ 4: จัดการข้อความและแปลงชนิดข้อมูล (String & Types)',
    token: 'pd.to_numeric() / .astype() / pd.to_datetime()',
    signature: "pd.to_numeric(arg, errors='raise')  ·  df['col'].astype(dtype)  ·  pd.to_datetime(arg, format=None, errors='raise')",
    purpose: 'แปลงชนิดข้อมูลของคอลัมน์ให้เป็นตัวเลข (to_numeric / astype) หรือเป็นชนิดข้อมูลวันที่และเวลา (to_datetime)',
    whenToUse: 'ใช้หลังจากทำความสะอาดข้อความเสร็จแล้ว หรือเมื่อต้องการแปลงคอลัมน์วันที่เพื่อนำไปเปรียบเทียบช่วงเวลา',
    caution: 'หากข้อมูลในคอลัมน์ยังมีข้อความผิดปกติหลงเหลืออยู่ (เช่น \'ไม่ระบุ\' หรือ \'N/A\') การใช้ .astype(float) หรือค่าเริ่มต้น errors=\'raise\' จะทำให้โปรแกรมหยุดทำงานทันที ต้องใช้ errors=\'coerce\' เพื่อเปลี่ยนค่าที่แปลงไม่ได้เป็น NaN',
    params: [
      { name: 'errors', defaultVal: "'raise' (หยุดและแจ้งผิดพลาด)", role: "กำหนดเป็น 'coerce' เพื่อบังคับให้แปลงค่าที่ผิดรูปแบบกลายเป็นค่าว่าง (NaN / NaT) โดยไม่ทำให้โปรแกรมหยุดทำงาน" },
      { name: 'format (ใน to_datetime)', defaultVal: 'None', role: "ระบุรูปแบบของวันที่ต้นทาง เช่น format='%Y-%m-%d' (ปี-เดือน-วัน) เพื่อให้แปลงวันที่ได้แม่นยำและรวดเร็ว" },
      { name: 'dtype (ใน .astype)', defaultVal: '(จำเป็นต้องระบุ)', role: "ระบุชนิดข้อมูลปลายทาง เช่น .astype(float), .astype(int) หรือ .astype('string')" }
    ],
    simulators: [
      {
        label: "1) ค่าเริ่มต้น errors='raise' (เมื่อเจอข้อความปะปน)",
        code: "pd.to_numeric(df['age_text'])  # ค่าเริ่มต้น errors='raise'",
        cols: ['ข้อมูลใน age_text', 'ผลลัพธ์จากการรันคำสั่ง'],
        rows: [
          ["'20', '19', 'ไม่ระบุ'", "ValueError: Unable to parse string 'ไม่ระบุ' (โปรแกรมหยุดทำงานทันที!)"]
        ],
        highlightProblem: true,
        note: 'เมื่อมีคำว่า \'ไม่ระบุ\' ปนอยู่ในคอลัมน์ตัวเลข ค่าเริ่มต้น errors=\'raise\' จะแจ้งข้อผิดพลาดและหยุดการทำงานทันที'
      },
      {
        label: "2) กำหนด errors='coerce' (เปลี่ยนค่าผิดเป็น NaN)",
        code: "df['age'] = pd.to_numeric(df['age_text'], errors='coerce')",
        cols: ['ข้อมูลเดิม (age_text)', "ผลลัพธ์หลังใช้ errors='coerce' (float64)"],
        rows: [
          ["'20'", '20.0'],
          ["'19'", '19.0'],
          ["'ไม่ระบุ'", 'NaN (แปลงเป็นค่าว่างอัตโนมัติ ไม่เกิด Error!)']
        ],
        highlightProblem: false,
        note: 'พารามิเตอร์ errors=\'coerce\' คือตัวช่วยสำคัญที่สุดในการแปลงข้อมูลจริงที่มีข้อความแปลกปลอมปะปน'
      },
      {
        label: "3) แปลงวันที่ด้วย pd.to_datetime(..., format='%Y-%m-%d')",
        code: "updated = pd.to_datetime(df['updated_date'], format='%Y-%m-%d', errors='coerce')\nold_record = updated < '2026-01-01'",
        cols: ['student_id', 'updated_date (datetime64)', "ผลการเปรียบเทียบ < '2026-01-01'"],
        rows: [
          ['S001', '2026-06-10', 'False (ข้อมูลเป็นปัจจุบันในปี 2026)'],
          ['S031', '2020-06-05', 'True (ข้อมูลเก่าก่อนปี 2026!)']
        ],
        highlightProblem: false,
        note: 'เมื่อแปลงเป็นชนิด datetime64 แล้ว จะสามารถใช้เครื่องหมาย < หรือ > เปรียบเทียบกับเกณฑ์วันที่ได้ทันที'
      }
    ]
  },
  {
    id: 'filter_loc_between_clip',
    num: 15,
    category: 'filter',
    categoryLabel: 'หมวดที่ 5: คัดกรอง จัดกลุ่ม และสร้างตารางรายงาน (Filter & Group)',
    token: 'df.loc[] / .isin() / .between() / .clip()',
    signature: "df.loc[row_condition, col_list]  ·  .isin(values)  ·  .between(left, right, inclusive='both')  ·  .clip(lower=None, upper=None)",
    purpose: 'คัดกรองแถวและคอลัมน์ตามเงื่อนไข (loc), ตรวจสมาชิกในรายการมาตรฐาน (isin), ตรวจช่วงค่าตัวเลข (between) และจำกัดขอบเขตค่าต่ำสุด-สูงสุด (clip)',
    whenToUse: 'ใช้เมื่อต้องการดึงเฉพาะแถวที่พบปัญหาออกมาตรวจสอบ หรือคัดกรองเฉพาะข้อมูลที่อยู่ในเกณฑ์มาตรฐานไปวิเคราะห์ต่อ',
    caution: 'ในคำสั่ง df.loc[แถว, คอลัมน์] ใช้เครื่องหมายวงเล็บก้ามปู [] ไม่ใช่วงเล็บโค้ง () และหากใช้หลายเงื่อนไขร่วมกันต้องใส่วงเล็บครอบแต่ละเงื่อนไขแล้วเชื่อมด้วย & (และ) หรือ | (หรือ)',
    params: [
      { name: 'row_indexer, col_indexer (ใน .loc[])', defaultVal: '(ระบุใน [])', role: 'ส่วนหน้าเครื่องหมายลูกน้ำคือเงื่อนไขเลือกแถว ส่วนหลังลูกน้ำคือรายชื่อคอลัมน์ที่ต้องการแสดง' },
      { name: 'values (ใน .isin())', defaultVal: '(จำเป็นต้องระบุ List)', role: 'รายการค่ามาตรฐานที่ต้องการตรวจสอบ เช่น [\'เทคโนโลยีสารสนเทศ\', \'การตลาด\'] (ใส่ ~ ข้างหน้าเพื่อหาค่าที่ไม่อยู่ในรายการ)' },
      { name: 'left, right, inclusive (ใน .between())', defaultVal: "inclusive='both'", role: 'กำหนดค่าต่ำสุด (left) และสูงสุด (right) โดย inclusive=\'both\' หมายถึงรวมค่าขอบทั้งสองฝั่งด้วย' },
      { name: 'lower, upper (ใน .clip())', defaultVal: 'None', role: 'กำหนดเพดานต่ำสุด (lower) และเพดานสูงสุด (upper) ค่าที่เกินเพดานจะถูกปรับให้เท่ากับค่าเพดาน' }
    ],
    simulators: [
      {
        label: '1) คัดกรองแถวและเลือกคอลัมน์ด้วย df.loc[เงื่อนไข, คอลัมน์]',
        code: "major_ok = df['major'].isin(['เทคโนโลยีสารสนเทศ', 'คอมพิวเตอร์ธุรกิจ', 'การตลาด'])\ndf.loc[~major_ok, ['student_id', 'major']]",
        cols: ['student_id', 'major (เฉพาะแถวที่ไม่ตรงมาตรฐาน ~major_ok)'],
        rows: [
          ['S013', 'IT'],
          ['S028', 'เทคโนโลยี สารสนเทศ']
        ],
        highlightProblem: true,
        note: 'เครื่องหมาย ~ (Tilde) หน้า major_ok แปลว่า "ไม่ (NOT)" จึงดึงเฉพาะแถวที่ไม่อยู่ในรายชื่อมาตรฐาน และเลือกแสดงเฉพาะ 2 คอลัมน์'
      },
      {
        label: '2) ตรวจช่วงค่าด้วย .between(0, 4)',
        code: "gpa_valid = df['gpa'].between(0, 4, inclusive='both')\ndf.loc[~gpa_valid & df['gpa'].notna(), ['student_id', 'gpa']]",
        cols: ['student_id', 'gpa', 'ผลการตรวจช่วง 0.00–4.00'],
        rows: [
          ['S019', '4.50', 'ไม่อยู่ในช่วง 0–4 (เป็นค่าผิดปกติที่ต้องตรวจสอบต้นทาง)']
        ],
        highlightProblem: true,
        note: '.between(0, 4) คืนค่า True สำหรับเกรดที่อยู่ตั้งแต่ 0 ถึง 4 เมื่อใส่ ~ ร่วมกับ .notna() จึงพบแถวที่เกรดเกิน 4.00 ทันที'
      },
      {
        label: '3) จำกัดเพดานค่าสูงสุดด้วย .clip(lower=1, upper=10)',
        code: "orders['qty_clean'] = orders['qty'].abs().clip(lower=1, upper=10)",
        cols: ['ค่าเดิม (qty)', 'หลังใช้ .abs()', 'หลังใช้ .clip(lower=1, upper=10)'],
        rows: [
          ['-2', '2', '2 (อยู่ในเกณฑ์ 1–10)'],
          ['50 (เกินเพดาน)', '50', '10 (ถูกปรับลงมาเท่ากับเพดานสูงสุด upper=10)']
        ],
        highlightProblem: false,
        note: '.clip(upper=10) ช่วยจำกัดไม่ให้ค่าเกินเพดานที่กำหนดตามกติกาของชุดข้อมูล'
      }
    ]
  },
  {
    id: 'groupby_sort_dataframe',
    num: 16,
    category: 'filter',
    categoryLabel: 'หมวดที่ 5: คัดกรอง จัดกลุ่ม และสร้างตารางรายงาน (Filter & Group)',
    token: 'df.groupby() / .sort_values() / pd.DataFrame()',
    signature: "df.groupby(by)['col'].sum()  ·  .sort_values(by=..., ascending=True)  ·  pd.DataFrame(data_dict)",
    purpose: 'จัดกลุ่มข้อมูลเพื่อคำนวณค่าสถิติแยกตามหมวดหมู่ (groupby), เรียงลำดับข้อมูล (sort_values) และสร้างตารางสรุปรายงานใหม่ (pd.DataFrame)',
    whenToUse: 'ใช้เมื่อต้องการสรุปยอดขายหรือจำนวนรายการแยกตามหมวดหมู่ เรียงลำดับจากมากไปน้อย และสร้างตารางรายงานคุณภาพข้อมูลเพื่อส่งออก',
    caution: 'ค่าเริ่มต้นของ .sort_values() คือ ascending=True (เรียงจากน้อยไปมาก) หากต้องการจัดอันดับจากมากไปน้อยต้องกำหนด ascending=False เสมอ',
    params: [
      { name: 'by (ใน groupby / sort_values)', defaultVal: '(จำเป็นต้องระบุ)', role: 'ระบุชื่อคอลัมน์ที่ใช้จัดกลุ่ม (ใน groupby) หรือคอลัมน์ที่ใช้เป็นเกณฑ์เรียงลำดับ (ใน sort_values)' },
      { name: 'ascending (ใน sort_values)', defaultVal: 'True (น้อยไปมาก)', role: 'กำหนดเป็น False เมื่อต้องการเรียงลำดับจากค่ามากที่สุดไปน้อยที่สุด' },
      { name: 'data (ใน pd.DataFrame)', defaultVal: 'None', role: "ส่ง Dictionary ในรูปแบบ {'ชื่อคอลัมน์ใหม่': รายการข้อมูลหรือ Series} โดยทุกคอลัมน์ต้องมีจำนวนแถวเท่ากัน" }
    ],
    simulators: [
      {
        label: '1) จัดกลุ่มและเรียงจากมากไปน้อย (ascending=False)',
        code: "df_clean.groupby('category')['total_price'].sum().sort_values(ascending=False)",
        cols: ['หมวดหมู่สินค้า (category)', 'ยอดขายรวม (total_price) เรียงมากไปน้อย'],
        rows: [
          ['อุปกรณ์ต่อพ่วง', '11,420.0 บาท (อันดับ 1)'],
          ['สายและหน่วยความจำ', '6,150.0 บาท (อันดับ 2)'],
          ['อุปกรณ์เสียง', '4,320.0 บาท (อันดับ 3)']
        ],
        highlightProblem: false,
        note: 'groupby(\'category\') จัดกลุ่มตามหมวดหมู่ ต่อด้วย [\'total_price\'].sum() เพื่อรวมยอดเงิน และ .sort_values(ascending=False) เพื่อเรียงอันดับสูงสุดขึ้นก่อน'
      },
      {
        label: '2) สร้างตารางรายงานด้วย pd.DataFrame({...})',
        code: "quality = pd.DataFrame({\n    'missing_count': missing_count,\n    'missing_percent': missing_percent\n})",
        cols: ['Index (ชื่อคอลัมน์ต้นทาง)', 'missing_count', 'missing_percent'],
        rows: [
          ['student_id', '0', '0.000000'],
          ['age', '1', '2.380952'],
          ['gpa', '2', '4.761905']
        ],
        highlightProblem: false,
        note: 'เมื่อนำ Series ที่มี Index เดียวกันมารวมด้วย pd.DataFrame({...}) โปรแกรมจะจับคู่แถวตาม Index ให้ตรงกันโดยอัตโนมัติ'
      },
      {
        label: '3) สร้างตารางสรุป 4 มิติพร้อมกำหนดตัวหารคงที่',
        code: "dimension_report = pd.DataFrame({\n    'dimension': ['ความสมบูรณ์', 'ความสม่ำเสมอ', 'ความถูกต้อง', 'ความเป็นปัจจุบัน'],\n    'count': [4, 2, 1, 2],\n    'denominator': row_count\n})",
        cols: ['dimension', 'count', 'denominator (ใช้ค่า 42 ทุกแถวอัตโนมัติ)'],
        rows: [
          ['ความสมบูรณ์', '4', '42'],
          ['ความสม่ำเสมอ', '2', '42'],
          ['ความถูกต้อง', '1', '42'],
          ['ความเป็นปัจจุบัน', '2', '42']
        ],
        highlightProblem: false,
        note: 'หากส่งค่าเดี่ยว (เช่น row_count = 42) เข้าไปคู่กับคอลัมน์ที่เป็น List โปรแกรมจะคัดลอกค่า 42 ให้ครบทุกแถวโดยอัตโนมัติ'
      }
    ]
  }
];

export const PANDAS_GAME_STAGES = [
  {
    id: 'hunter',
    num: 1,
    title: 'ด่านที่ 1: เลือกฟังก์ชันให้ตรงภารกิจ (Function Hunter)',
    subtitle: 'วิเคราะห์สถานการณ์แล้วเลือกคำสั่ง Pandas ที่เหมาะสมที่สุด (ข้อ 1–5 · ข้อละ 100 XP)'
  },
  {
    id: 'debugger',
    num: 2,
    title: 'ด่านที่ 2: ปลดชนวนบั๊กด้วย Parameter (Parameter Debugger)',
    subtitle: 'ค้นหาสาเหตุที่โค้ดทำงานผิดพลาด และเลือก Parameter ที่ช่วยแก้ปัญหาได้ถูกต้อง (ข้อ 6–10 · ข้อละ 150 XP)'
  },
  {
    id: 'predictor',
    num: 3,
    title: 'ด่านที่ 3: อ่านโค้ดทายผลลัพธ์จากตาราง (Output Predictor)',
    subtitle: 'พิจารณารูปแบบตารางข้อมูลและพารามิเตอร์ที่กำหนด แล้วทายผลลัพธ์ที่ได้จากการรันคำสั่ง (ข้อ 11–15 · ข้อละ 200 XP)'
  }
];

export const PANDAS_GAME_QUESTIONS = [
  // Stage 1: Function Hunter (1-5)
  {
    id: 1,
    stage: 'hunter',
    xp: 100,
    missionTitle: 'ภารกิจที่ 1: สำรวจรายชื่อแผ่นงานในไฟล์ Excel ก่อนนำเข้าข้อมูล',
    scenario: 'ผู้วิเคราะห์ได้รับไฟล์สมุดงาน `nvc_store_sales.xlsx` ซึ่งมีหลายแผ่นงานอยู่ภายใน แต่ยังไม่ทราบว่าแผ่นงานที่เก็บข้อมูลรายการขายสะกดชื่อว่าอย่างไร ควรใช้คำสั่งใดเพื่อดูรายชื่อแผ่นงานทั้งหมดก่อน?',
    codeContext: "# ต้องการแสดงรายชื่อแผ่นงาน (Sheet) ทั้งหมดในไฟล์ nvc_store_sales.xlsx",
    hint: 'ใช้ฟังก์ชันสำหรับเปิดสมุดงาน Excel แล้วเรียกดูค่าคุณสมบัติ .sheet_names',
    options: [
      "pd.read_csv('nvc_store_sales.xlsx').columns",
      "pd.ExcelFile('nvc_store_sales.xlsx').sheet_names",
      "pd.read_excel('nvc_store_sales.xlsx').head()",
      "df.describe(include='all')"
    ],
    correctIndex: 1,
    explanation: "ถูกต้อง! คำสั่ง pd.ExcelFile('nvc_store_sales.xlsx').sheet_names ใช้ตรวจสอบรายชื่อแผ่นงานทั้งหมดในไฟล์ Excel ก่อนนำไประบุในพารามิเตอร์ sheet_name ของ pd.read_excel()"
  },
  {
    id: 2,
    stage: 'hunter',
    xp: 100,
    missionTitle: 'ภารกิจที่ 2: ตรวจสอบชื่อสาขาวิชาที่สะกดไม่ตรงมาตรฐาน',
    scenario: 'ในตาราง `df` มีคอลัมน์ `major` (สาขาวิชา) ผู้วิเคราะห์ต้องการทราบว่ามีชื่อสาขาวิชาอะไรปรากฏอยู่บ้าง และแต่ละชื่อมีจำนวนกี่แถว เพื่อค้นหาชื่อที่สะกดผิดหรือเขียนย่อ (เช่น `IT`) ควรใช้คำสั่งใด?',
    codeContext: "# ต้องการนับความถี่ของข้อมูลแต่ละค่าในคอลัมน์ major",
    hint: 'เป็นฟังก์ชันระดับคอลัมน์ (Series) ที่นับจำนวนความถี่ของแต่ละค่าแล้วเรียงจากมากไปน้อย',
    options: [
      "df['major'].value_counts()",
      "df['major'].isna().sum()",
      "df['major'].str.len()",
      "df.shape"
    ],
    correctIndex: 0,
    explanation: "ถูกต้อง! df['major'].value_counts() จะนับความถี่ของแต่ละค่าในคอลัมน์ major ทำให้เห็นทันทีว่ามีคำว่า 'IT' หรือ 'เทคโนโลยี สารสนเทศ' แยกออกมาจากชื่อมาตรฐานกี่แถว"
  },
  {
    id: 3,
    stage: 'hunter',
    xp: 100,
    missionTitle: 'ภารกิจที่ 3: จัดมาตรฐานรหัสสินค้าที่มีช่องว่างและตัวพิมพ์เล็กปะปน',
    scenario: 'คอลัมน์ `product_code` มีข้อมูลเช่น `\'  bk-101 \'` และ `\'BK-101\'` ปะปนกัน หากต้องการตัดช่องว่างด้านหน้า-ด้านหลังออก และแปลงตัวอักษรให้เป็นตัวพิมพ์ใหญ่ทั้งหมดในคำสั่งเดียว ควรใช้คำสั่งใด?',
    codeContext: "# จัดมาตรฐานคอลัมน์ product_code ให้เป็น 'BK-101' เหมือนกันทั้งหมด",
    hint: 'การจัดการข้อความใน Series ต้องเรียกผ่านตัวจัดการ .str เสมอ และสามารถเขียนต่อกัน (Method Chaining) ได้',
    options: [
      "df['product_code'] = df['product_code'].strip().upper()",
      "df['product_code'] = df['product_code'].str.strip().str.upper()",
      "df['product_code'] = df['product_code'].str.len().str.lower()",
      "df['product_code'] = pd.to_numeric(df['product_code'])"
    ],
    correctIndex: 1,
    explanation: "ถูกต้อง! ต้องเรียกผ่านตัวจัดการ .str ทั้งสองจุด คือ .str.strip() เพื่อตัดช่องว่างซ้าย-ขวา แล้วต่อด้วย .str.upper() เพื่อแปลงเป็นตัวพิมพ์ใหญ่"
  },
  {
    id: 4,
    stage: 'hunter',
    xp: 100,
    missionTitle: 'ภารกิจที่ 4: ค้นหาแถวที่ชื่อสาขาวิชาไม่อยู่ในรายชื่อมาตรฐาน 3 สาขา',
    scenario: 'กำหนดให้รายชื่อสาขาวิชามาตรฐานมี 3 สาขา ได้แก่ `[\'เทคโนโลยีสารสนเทศ\', \'คอมพิวเตอร์ธุรกิจ\', \'การตลาด\']` หากต้องการสร้างตัวแปรตรรกะที่ตรวจสอบว่าแต่ละแถวอยู่ในรายชื่อมาตรฐานนี้หรือไม่ ต้องใช้ฟังก์ชันใด?',
    codeContext: "standard_majors = ['เทคโนโลยีสารสนเทศ', 'คอมพิวเตอร์ธุรกิจ', 'การตลาด']\n# ตรวจสอบว่า df['major'] อยู่ในรายการ standard_majors หรือไม่",
    hint: 'ชื่อฟังก์ชันสื่อความหมายตรงตัวว่า "อยู่ใน (is in)" รายการที่กำหนดหรือไม่',
    options: [
      "df['major'].between(standard_majors)",
      "df['major'].fillna(standard_majors)",
      "df['major'].isin(standard_majors)",
      "df['major'].clip(standard_majors)"
    ],
    correctIndex: 2,
    explanation: "ถูกต้อง! df['major'].isin(standard_majors) ใช้ตรวจสอบว่าค่าในแต่ละแถวตรงกับสมาชิกตัวใดตัวหนึ่งในรายการที่กำหนดหรือไม่ (และใช้เครื่องหมาย ~ ข้างหน้าเมื่อต้องการหาแถวที่ไม่ตรงมาตรฐาน)"
  },
  {
    id: 5,
    stage: 'hunter',
    xp: 100,
    missionTitle: 'ภารกิจที่ 5: ตรวจสอบความยาวหมายเลขโทรศัพท์ที่ไม่ครบ 10 หลัก (โดยไม่นับค่าว่าง)',
    scenario: 'คอลัมน์ `phone` ถูกอ่านเข้ามาเป็นชนิดข้อความ (`string`) เรียบร้อยแล้ว ผู้วิเคราะห์ต้องการคัดกรองเฉพาะแถวที่มีจำนวนตัวอักษรไม่เท่ากับ 10 หลัก และต้องไม่ใช่แถวที่เป็นค่าว่าง ควรใช้เงื่อนไขในข้อใด?',
    codeContext: "# ค้นหาแถวที่หมายเลขโทรศัพท์ไม่ครบ 10 หลัก โดยไม่รวมแถวที่เป็นค่าว่าง",
    hint: 'ใช้นับความยาวข้อความ .str.len() != 10 เชื่อมด้วย & กับฟังก์ชันตรวจสอบว่าไม่เป็นค่าว่าง (.notna())',
    options: [
      "(df['phone'].str.len() != 10) & df['phone'].notna()",
      "(df['phone'].len() != 10) | df['phone'].isna()",
      "df['phone'].between(1, 10)",
      "df['phone'].duplicated(keep=False)"
    ],
    correctIndex: 0,
    explanation: "ถูกต้อง! ใช้ df['phone'].str.len() != 10 เพื่อตรวจจำนวนหลัก และเชื่อมด้วย & df['phone'].notna() เพื่อแยกแถวที่เป็นค่าว่างออกไปไม่ให้นับซ้ำกับมิติความสมบูรณ์"
  },

  // Stage 2: Parameter Debugger (6-10)
  {
    id: 6,
    stage: 'debugger',
    xp: 150,
    missionTitle: 'ภารกิจที่ 6: แก้บั๊กเลข 0 นำหน้าหมายเลขโทรศัพท์หายหลังอ่านไฟล์ CSV',
    scenario: 'ผู้เรียนรันคำสั่งด้านล่างแล้วพบว่าหมายเลขโทรศัพท์จากเดิม `0812345678` กลายเป็นตัวเลข `812345678` (เลข 0 หายไป) ต้องเพิ่ม Parameter ใดลงใน `pd.read_csv()` เพื่อแก้ปัญหานี้ตั้งแต่ต้นทาง?',
    codeContext: "# โค้ดที่มีปัญหา:\ndf = pd.read_csv('student_register_dirty.csv')\n# ผลลัพธ์: คอลัมน์ phone กลายเป็นชนิด int64 และเลข 0 นำหน้าหายไป!",
    hint: 'ต้องระบุพารามิเตอร์ที่บังคับชนิดข้อมูลของคอลัมน์ phone ให้เป็นข้อความ (\'string\')',
    options: [
      "pd.read_csv('student_register_dirty.csv', index=False)",
      "pd.read_csv('student_register_dirty.csv', dtype={'phone': 'string'})",
      "pd.read_csv('student_register_dirty.csv', errors='coerce')",
      "pd.read_csv('student_register_dirty.csv', subset=['phone'])"
    ],
    correctIndex: 1,
    explanation: "ถูกต้อง! พารามิเตอร์ dtype={'phone': 'string'} สั่งให้ pandas เก็บคอลัมน์ phone เป็นข้อความตั้งแต่วินาทีแรกที่อ่านไฟล์ จึงรักษาเลข 0 นำหน้าไว้ได้ครบถ้วน"
  },
  {
    id: 7,
    stage: 'debugger',
    xp: 150,
    missionTitle: 'ภารกิจที่ 7: แก้บั๊กคำสั่ง df.dropna() ลบข้อมูลสำคัญทิ้งเกินความจำเป็น',
    scenario: 'ตาราง `orders` มีค่าว่างในคอลัมน์ `customer_phone` 10 แถว (แต่มีข้อมูลยอดขายครบ) และมีค่าว่างในคอลัมน์ `total_price` 2 แถว เมื่อผู้เรียนรัน `orders.dropna()` ปรากฏว่าข้อมูลหายไปถึง 12 แถว! หากต้องการลบเฉพาะแถวที่ `total_price` ว่างเท่านั้น ต้องกำหนด Parameter อย่างไร?',
    codeContext: "# โค้ดที่มีปัญหา:\norders_clean = orders.dropna()\n# ผลลัพธ์: แถวที่มียอดขายแต่ไม่มีเบอร์โทรศัพท์ถูกลบทิ้งไปด้วย!",
    hint: 'ใช้พารามิเตอร์ที่ระบุรายชื่อคอลัมน์เป้าหมายในการตรวจค่าว่าง',
    options: [
      "orders.dropna(keep='first')",
      "orders.dropna(axis=1)",
      "orders.dropna(subset=['total_price'])",
      "orders.dropna(normalize=True)"
    ],
    correctIndex: 2,
    explanation: "ถูกต้อง! การกำหนด subset=['total_price'] จะจำกัดให้ .dropna() ตรวจสอบค่าว่างเฉพาะในคอลัมน์ total_price เท่านั้น จึงลบออกไปเพียง 2 แถว และรักษาอีก 10 แถวที่มียอดขายไว้ได้"
  },
  {
    id: 8,
    stage: 'debugger',
    xp: 150,
    missionTitle: 'ภารกิจที่ 8: แก้บั๊กการนับแถวที่มีค่าว่างอย่างน้อย 1 ช่อง',
    scenario: 'ผู้เรียนต้องการนับว่ามีผู้เรียนกี่แถวที่มีข้อมูลไม่สมบูรณ์ (มีค่าว่างอย่างน้อย 1 คอลัมน์ในแถวนั้น) จึงเขียนคำสั่ง `df.isna().any().sum()` แต่ผลลัพธ์กลับได้เลข `3` (ซึ่งคือจำนวนคอลัมน์ที่มีค่าว่าง ไม่ใช่จำนวนแถว) ต้องแก้ไข Parameter ใน `.any()` อย่างไร?',
    codeContext: "# โค้ดที่มีปัญหา:\nmissing_rows = df.isna().any()   # ค่าเริ่มต้นคือ axis=0 (ตรวจรายคอลัมน์)\nmissing_rows.sum()               # ได้ 3 คอลัมน์ แทนที่จะได้ 4 แถว!",
    hint: 'เปลี่ยนทิศทางการตรวจสอบของ .any() จากแนวตั้ง (รายคอลัมน์) เป็นแนวนอน (รายแถว)',
    options: [
      "df.isna().any(axis=1).sum()",
      "df.isna().any(dropna=False).sum()",
      "df.isna().any(index=False).sum()",
      "df.isna().any(ascending=False).sum()"
    ],
    correctIndex: 0,
    explanation: "ถูกต้อง! การระบุ axis=1 ใน df.isna().any(axis=1) สั่งให้ตรวจสอบตามแนวนอนทีละแถวว่ามีค่าว่างอย่างน้อย 1 ช่องหรือไม่ เมื่อรวมด้วย .sum() จึงได้จำนวนแถวที่มีค่าว่างอย่างถูกต้อง"
  },
  {
    id: 9,
    stage: 'debugger',
    xp: 150,
    missionTitle: 'ภารกิจที่ 9: แก้บั๊กรายชื่อคอลัมน์ต้นทางหายไปเมื่อส่งออกตารางรายงาน CSV',
    scenario: 'ในตารางรายงาน `quality` รายชื่อคอลัมน์ต้นทาง (`student_id`, `age`, `gpa`, ...) ถูกเก็บอยู่ในดัชนี (Index) ด้านซ้ายของตาราง เมื่อผู้เรียนรันคำสั่ง `quality.to_csv(\'quality_report.csv\', index=False)` ทำให้ชื่อคอลัมน์ต้นทางหายไปทั้งหมด! ควรแก้ไข Parameter อย่างไร?',
    codeContext: "# โค้ดที่มีปัญหา:\nquality.to_csv('quality_report.csv', index=False)\n# ผลลัพธ์: เหลือแต่ตัวเลข missing_count และ missing_percent ไม่ทราบว่าเป็นของคอลัมน์ใด!",
    hint: 'ต้องเก็บดัชนีไว้ (ไม่ใส่ index=False) และตั้งชื่อหัวคอลัมน์ให้ดัชนีด้วย index_label',
    options: [
      "quality.to_csv('quality_report.csv', index_label='column', encoding='utf-8-sig')",
      "quality.to_csv('quality_report.csv', subset=['column'])",
      "quality.to_csv('quality_report.csv', keep='first')",
      "quality.to_csv('quality_report.csv', dropna=False)"
    ],
    correctIndex: 0,
    explanation: "ถูกต้อง! เมื่อข้อมูลสำคัญอยู่ใน Index ต้องปล่อยให้ index=True (ค่าเริ่มต้น) และระบุ index_label='column' เพื่อตั้งชื่อหัวคอลัมน์ให้แก่ดัชนี"
  },
  {
    id: 10,
    stage: 'debugger',
    xp: 150,
    missionTitle: 'ภารกิจที่ 10: แก้บั๊ก ValueError เมื่อแปลงคอลัมน์ตัวเลขที่มีข้อความปะปน',
    scenario: 'คอลัมน์ `quantity` มีข้อมูล `[\'2\', \'5\', \'ขอยกเลิก\']` เมื่อรันคำสั่ง `pd.to_numeric(df[\'quantity\'])` โปรแกรมหยุดทำงานและแจ้ง `ValueError: Unable to parse string "ขอยกเลิก"` ทันที ต้องเพิ่ม Parameter ใดเพื่อให้เปลี่ยนคำที่แปลงไม่ได้เป็น `NaN` อัตโนมัติ?',
    codeContext: "# โค้ดที่มีปัญหา:\ndf['quantity'] = pd.to_numeric(df['quantity'])\n# ValueError: Unable to parse string 'ขอยกเลิก'",
    hint: 'ใช้พารามิเตอร์ควบคุมการจัดการข้อผิดพลาด (errors) ให้บังคับแปลงเป็นค่าว่าง',
    options: [
      "pd.to_numeric(df['quantity'], regex=False)",
      "pd.to_numeric(df['quantity'], errors='coerce')",
      "pd.to_numeric(df['quantity'], how='any')",
      "pd.to_numeric(df['quantity'], inclusive='both')"
    ],
    correctIndex: 1,
    explanation: "ถูกต้อง! พารามิเตอร์ errors='coerce' สั่งให้ pd.to_numeric() เปลี่ยนข้อมูลที่ไม่สามารถแปลงเป็นตัวเลขได้ให้กลายเป็น NaN โดยไม่ทำให้โปรแกรมหยุดทำงาน"
  },

  // Stage 3: Output Predictor (11-15)
  {
    id: 11,
    stage: 'predictor',
    xp: 200,
    missionTitle: 'ภารกิจที่ 11: ทายผลลัพธ์ของ .duplicated() เมื่อกำหนดพารามิเตอร์ keep ต่างกัน',
    scenario: 'พิจารณาตาราง `df_sample` จำนวน 4 แถวด้านล่าง หากรันคำสั่ง `df_sample.duplicated(subset=[\'id\'], keep=False).sum()` จะได้ผลลัพธ์เป็นตัวเลขเท่าใด?',
    sampleTable: {
      caption: 'ตารางข้อมูลจำลอง df_sample (4 แถว)',
      cols: ['ลำดับแถว', 'id', 'name'],
      rows: [
        ['0', 'A01', 'สมชาย'],
        ['1', 'A02', 'สมหญิง'],
        ['2', 'A01', 'สมชาย (บันทึกซ้ำ)'],
        ['3', 'A03', 'สมปอง']
      ]
    },
    codeContext: "df_sample.duplicated(subset=['id'], keep=False).sum()",
    hint: 'ระวัง! พารามิเตอร์ keep=False จะให้ค่า True แก่ "ทุกแถว" ที่มีรหัสซ้ำกัน (ทั้งแถวต้นฉบับที่ดัชนี 0 และแถวซ้ำที่ดัชนี 2)',
    options: [
      'ได้ผลลัพธ์เท่ากับ 1 (นับเฉพาะแถวดัชนีที่ 2)',
      'ได้ผลลัพธ์เท่ากับ 2 (นับทั้งแถวดัชนีที่ 0 และแถวดัชนีที่ 2 ที่ใช้รหัส A01 ซ้ำกัน)',
      'ได้ผลลัพธ์เท่ากับ 3 (จำนวนรหัสที่ไม่ซ้ำกัน)',
      'ได้ผลลัพธ์เท่ากับ 4 (จำนวนแถวทั้งหมด)'
    ],
    correctIndex: 1,
    explanation: "ถูกต้อง! เพราะกำหนดพารามิเตอร์ keep=False โปรแกรมจึงตีตรา True ให้แก่รหัส A01 ทั้งแถวแรก (ดัชนี 0) และแถวที่ซ้ำ (ดัชนี 2) รวมเป็น 2 แถว (หากใช้ค่าเริ่มต้น keep='first' จึงจะได้ 1)"
  },
  {
    id: 12,
    stage: 'predictor',
    xp: 200,
    missionTitle: 'ภารกิจที่ 12: ทายจำนวนแถวที่เหลือหลังรัน .dropna(subset=...)',
    scenario: 'พิจารณาตาราง `df_sample` จำนวน 4 แถวด้านล่าง หากรันคำสั่ง `df_sample.dropna(subset=[\'gpa\']).shape[0]` จะเหลือจำนวนแถวกี่แถว?',
    sampleTable: {
      caption: 'ตารางข้อมูลจำลอง df_sample (4 แถว)',
      cols: ['student_id', 'gpa', 'phone'],
      rows: [
        ['S01', '3.50', '<NA>'],
        ['S02', '<NA>', '0812345678'],
        ['S03', '2.75', '<NA>'],
        ['S04', '3.10', '0899998888']
      ]
    },
    codeContext: "df_sample.dropna(subset=['gpa']).shape[0]",
    hint: 'พารามิเตอร์ subset=[\'gpa\'] สั่งให้ตรวจเฉพาะคอลัมน์ gpa เท่านั้น (ไม่สนใจว่า phone จะว่างหรือไม่)',
    options: [
      'เหลือ 1 แถว (เฉพาะ S04 ที่ข้อมูลครบทุกคอลัมน์)',
      'เหลือ 2 แถว (S02 และ S04)',
      'เหลือ 3 แถว (S01, S03 และ S04 เพราะมีเฉพาะ S02 แถวเดียวที่ gpa เป็นค่าว่าง)',
      'เหลือ 4 แถวเท่าเดิม'
    ],
    correctIndex: 2,
    explanation: "ถูกต้อง! เนื่องจากกำหนด subset=['gpa'] โปรแกรมจึงลบเฉพาะแถวที่คอลัมน์ gpa ว่าง (คือ S02 เพียง 1 แถว) ส่วน S01 และ S03 แม้ phone จะว่างแต่มีค่า gpa ครบถ้วนจึงไม่ถูกลบ เหลือ 3 แถว"
  },
  {
    id: 13,
    stage: 'predictor',
    xp: 200,
    missionTitle: 'ภารกิจที่ 13: ทายผลลัพธ์ของ .value_counts(dropna=False)',
    scenario: 'พิจารณาตาราง `df_sample` จำนวน 5 แถวด้านล่าง หากรันคำสั่ง `df_sample[\'status\'].value_counts(dropna=False)` จะแสดงผลลัพธ์ตรงกับข้อใด?',
    sampleTable: {
      caption: 'ตารางข้อมูลจำลอง df_sample (5 แถว)',
      cols: ['order_id', 'status'],
      rows: [
        ['O01', 'ชำระแล้ว'],
        ['O02', '<NA>'],
        ['O03', 'ชำระแล้ว'],
        ['O04', 'รอชำระ'],
        ['O05', '<NA>']
      ]
    },
    codeContext: "df_sample['status'].value_counts(dropna=False)",
    hint: 'พารามิเตอร์ dropna=False สั่งให้นับจำนวนแถวที่เป็นค่าว่าง (<NA>) แสดงในผลลัพธ์ด้วย',
    options: [
      'ชำระแล้ว: 2, รอชำระ: 1 (รวม 3 รายการ เพราะตัดค่าว่างทิ้ง)',
      'ชำระแล้ว: 2, <NA>: 2, รอชำระ: 1 (แสดงครบทั้ง 3 กลุ่มรวมค่าว่าง)',
      'ชำระแล้ว: 4, รอชำระ: 1 (นำค่าว่างไปรวมกับค่าที่พบบ่อยที่สุด)',
      'แจ้งข้อผิดพลาด ValueError เนื่องจากมีค่าว่างในคอลัมน์'
    ],
    correctIndex: 1,
    explanation: "ถูกต้อง! การตั้งค่า dropna=False ทำให้ .value_counts() นับความถี่ของค่าว่าง (<NA> จำนวน 2 แถว) แสดงผลควบคู่กับ ชำระแล้ว (2 แถว) และ รอชำระ (1 แถว)"
  },
  {
    id: 14,
    stage: 'predictor',
    xp: 200,
    missionTitle: 'ภารกิจที่ 14: ทายผลลัพธ์ของการจัดการตัวเลขด้วย .abs().clip(upper=10)',
    scenario: 'พิจารณาตาราง `df_sample` ด้านล่าง หากรันคำสั่ง `df_sample[\'qty\'].abs().clip(upper=10).sum()` ผลรวมที่ได้จะมีค่าเท่ากับเท่าใด?',
    sampleTable: {
      caption: 'ตารางข้อมูลจำลอง df_sample (3 แถว)',
      cols: ['item', 'qty (จำนวนเดิม)'],
      rows: [
        ['เมาส์ไร้สาย', '-3'],
        ['คีย์บอร์ด', '5'],
        ['สายชาร์จ', '25']
      ]
    },
    codeContext: "df_sample['qty'].abs().clip(upper=10).sum()",
    hint: 'คิดทีละขั้นจากซ้ายไปขวา: 1) .abs() เปลี่ยน -3 เป็น 3  2) .clip(upper=10) ปรับค่าที่เกิน 10 ลงมาเป็น 10  3) .sum() บวกตัวเลขทั้ง 3 แถวเข้าด้วยกัน',
    options: [
      'ได้ผลรวมเท่ากับ 12 (มาจาก 3 + 5 + 4)',
      'ได้ผลรวมเท่ากับ 18 (มาจาก 3 + 5 + 10)',
      'ได้ผลรวมเท่ากับ 27 (มาจาก -3 + 5 + 25)',
      'ได้ผลรวมเท่ากับ 33 (มาจาก 3 + 5 + 25)'
    ],
    correctIndex: 1,
    explanation: "ถูกต้อง! ขั้นแรก .abs() เปลี่ยน [-3, 5, 25] เป็น [3, 5, 25] ขั้นที่สอง .clip(upper=10) จำกัดเพดานสูงสุดไม่เกิน 10 จึงกลายเป็น [3, 5, 10] เมื่อรวมกันด้วย .sum() จึงได้ 3 + 5 + 10 = 18"
  },
  {
    id: 15,
    stage: 'predictor',
    xp: 200,
    missionTitle: 'ภารกิจที่ 15: ทายผลลัพธ์ของการจัดกลุ่มและเรียงลำดับ .groupby().sum().sort_values()',
    scenario: 'พิจารณาตาราง `df_sample` ด้านล่าง หากรันคำสั่งจัดกลุ่มและเรียงลำดับด้านล่าง แถวแรกสุดของผลลัพธ์จะเป็นหมวดหมู่ใดและมียอดรวมเท่าใด?',
    sampleTable: {
      caption: 'ตารางข้อมูลจำลอง df_sample (4 แถว)',
      cols: ['order_id', 'category', 'sales'],
      rows: [
        ['O01', 'เครื่องดื่ม', '120'],
        ['O02', 'เบเกอรี', '250'],
        ['O03', 'เครื่องดื่ม', '180'],
        ['O04', 'เบเกอรี', '100']
      ]
    },
    codeContext: "df_sample.groupby('category')['sales'].sum().sort_values(ascending=False)",
    hint: 'รวมยอด sales แยกตาม category ก่อน (เครื่องดื่ม = 120+180, เบเกอรี = 250+100) แล้วดูพารามิเตอร์ ascending=False ว่าเรียงจากมากไปน้อยหรือน้อยไปมาก',
    options: [
      'แถวแรกคือ เครื่องดื่ม มียอดรวม 300 บาท',
      'แถวแรกคือ เบเกอรี มียอดรวม 350 บาท',
      'แถวแรกคือ เบเกอรี มียอดรวม 250 บาท',
      'แถวแรกคือ เครื่องดื่ม มียอดรวม 120 บาท'
    ],
    correctIndex: 1,
    explanation: "ถูกต้อง! เมื่อรวมยอดขายตามหมวดหมู่จะได้ เบเกอรี = 250 + 100 = 350 บาท และ เครื่องดื่ม = 120 + 180 = 300 บาท เมื่อเรียงด้วย .sort_values(ascending=False) (มากไปน้อย) แถวแรกจึงเป็น เบเกอรี (350 บาท)"
  }
];

export const W4_THU_ASSIGNMENT_ITEMS = [
  {
    id: 1,
    part: 'ตอนที่ 1: วิเคราะห์ภารกิจและเลือกใช้ Function คู่กับ Parameter (3 คะแนน)',
    score: '1 คะแนน',
    title: 'ข้อที่ 1: การกำหนดชนิดข้อมูลขณะนำเข้าไฟล์ CSV เพื่อรักษาเลข 0 นำหน้า',
    task: "ต้องการนำเข้าไฟล์ customer_orders.csv ลงในตัวแปรตาราง df โดยกำหนดให้คอลัมน์รหัสไปรษณีย์ (zipcode) และหมายเลขโทรศัพท์ (phone) มีชนิดข้อมูลเป็นข้อความ ('string') เพื่อไม่ให้เลข 0 นำหน้าถูกตัดออก จงเขียนคำสั่งและอธิบายหน้าที่ของ Parameter ที่เลือกใช้",
    hint: 'ทบทวนฟังก์ชันที่ 1 ในคลังฟังก์ชัน: pd.read_csv(..., dtype=...)'
  },
  {
    id: 2,
    part: 'ตอนที่ 1: วิเคราะห์ภารกิจและเลือกใช้ Function คู่กับ Parameter (3 คะแนน)',
    score: '1 คะแนน',
    title: 'ข้อที่ 2: การนับความถี่ของข้อมูลในคอลัมน์พร้อมแสดงจำนวนค่าว่าง (NaN)',
    task: 'ต้องการสำรวจความถี่ของข้อมูลในคอลัมน์ major (สาขาวิชา) ของตาราง df ว่าแต่ละสาขาวิชามีจำนวนกี่แถว และต้องการให้นับจำนวนแถวที่เป็นค่าว่าง (NaN / <NA>) แสดงรวมออกมาในผลลัพธ์ด้วย จงเขียนคำสั่งและระบุ Parameter ที่ต้องตั้งค่า',
    hint: "ทบทวนฟังก์ชันที่ 7 ในคลังฟังก์ชัน: df['major'].value_counts(dropna=...)"
  },
  {
    id: 3,
    part: 'ตอนที่ 1: วิเคราะห์ภารกิจและเลือกใช้ Function คู่กับ Parameter (3 คะแนน)',
    score: '1 คะแนน',
    title: 'ข้อที่ 3: การลบแถวที่มีค่าว่างเฉพาะคอลัมน์เป้าหมาย (ไม่ลบทั้งตาราง)',
    task: 'ตารางข้อมูล df พบค่าว่างในคอลัมน์ gpa จำนวน 2 แถว และคอลัมน์ phone จำนวน 3 แถว หากผู้วิเคราะห์ต้องการลบเฉพาะแถวที่คอลัมน์ gpa เป็นค่าว่างออก (โดยเก็บรักษาแถวที่ว่างเฉพาะคอลัมน์ phone ไว้) แล้วบันทึกในตัวแปร df_clean จงเขียนคำสั่งและอธิบายพารามิเตอร์ที่ใช้',
    hint: 'ทบทวนฟังก์ชันที่ 9 ในคลังฟังก์ชัน: df.dropna(subset=[...])'
  },
  {
    id: 4,
    part: 'ตอนที่ 2: ตรวจสอบและแก้ไขข้อผิดพลาดของการใช้ Parameter (4 คะแนน)',
    score: '1 คะแนน',
    title: 'ข้อที่ 4: แก้ไขข้อผิดพลาดระหว่างค่าคุณสมบัติ (Attribute) กับฟังก์ชัน (Method)',
    task: 'ผู้เรียนต้องการตรวจสอบขนาดของตาราง (จำนวนแถว, จำนวนคอลัมน์) จึงพิมพ์คำสั่ง df.shape() และตรวจสอบรายชื่อคอลัมน์ด้วย df.columns() แต่โปรแกรมแจ้งข้อผิดพลาด TypeError จงอธิบายสาเหตุและเขียนคำสั่งที่ถูกต้อง',
    hint: 'ทบทวนกฎเหล็กข้อที่ 1 และฟังก์ชันที่ 5: ความแตกต่างระหว่าง Attribute (ไม่มีวงเล็บ) กับ Method (มีวงเล็บ)'
  },
  {
    id: 5,
    part: 'ตอนที่ 2: ตรวจสอบและแก้ไขข้อผิดพลาดของการใช้ Parameter (4 คะแนน)',
    score: '1 คะแนน',
    title: 'ข้อที่ 5: แก้ไขทิศทางการตรวจสอบค่าว่างรายแถวด้วย Parameter axis',
    task: 'ผู้เรียนต้องการตรวจสอบว่าแถวใดบ้างในตาราง df ที่มีค่าว่างอย่างน้อย 1 ช่อง จึงเขียนคำสั่ง df.isna().any() แต่ผลลัพธ์กลับแสดงเป็นรายชื่อคอลัมน์ (7 คอลัมน์) แทนที่จะแสดงเป็นรายแถว (42 แถว) จงระบุว่าต้องเพิ่ม Parameter ใด และเขียนคำสั่งให้นับจำนวนแถวที่มีค่าว่างอย่างน้อย 1 ช่อง',
    hint: 'ทบทวนฟังก์ชันที่ 8 ในคลังฟังก์ชัน: df.isna().any(axis=...) และ .sum()'
  },
  {
    id: 6,
    part: 'ตอนที่ 2: ตรวจสอบและแก้ไขข้อผิดพลาดของการใช้ Parameter (4 คะแนน)',
    score: '1 คะแนน',
    title: 'ข้อที่ 6: การแปลงคอลัมน์ตัวเลขที่มีข้อความปะปนโดยไม่ให้โปรแกรมหยุดทำงาน',
    task: "คอลัมน์ age ในตาราง df มีข้อความผิดปกติปะปนอยู่ เช่น '20', '19', 'ไม่ระบุ' เมื่อรันคำสั่ง pd.to_numeric(df['age']) โปรแกรมแจ้ง ValueError ทันที จงเขียนคำสั่งใหม่โดยเพิ่ม Parameter ที่ช่วยเปลี่ยนค่าที่แปลงไม่ได้ให้กลายเป็นค่าว่าง (NaN) อัตโนมัติ",
    hint: 'ทบทวนฟังก์ชันที่ 14 ในคลังฟังก์ชัน: pd.to_numeric(..., errors=...)'
  },
  {
    id: 7,
    part: 'ตอนที่ 2: ตรวจสอบและแก้ไขข้อผิดพลาดของการใช้ Parameter (4 คะแนน)',
    score: '1 คะแนน',
    title: 'ข้อที่ 7: การเลือกใช้ Parameter index=False และ index_label ในการส่งออกไฟล์ CSV',
    task: 'จงเปรียบเทียบและเขียนคำสั่งส่งออกไฟล์ CSV สำหรับ 2 กรณีต่อไปนี้ พร้อมระบุให้รองรับภาษาไทยในโปรแกรม Excel: กรณี ก) ตาราง df_clean ที่มีคอลัมน์ข้อมูลครบถ้วนแล้ว และ กรณี ข) ตารางรายงาน quality ที่รายชื่อคอลัมน์ต้นทางถูกเก็บอยู่ในดัชนี (Index) ด้านซ้ายของตาราง',
    hint: "ทบทวนฟังก์ชันที่ 3 ในคลังฟังก์ชัน: .to_csv(..., index=..., index_label=..., encoding='utf-8-sig')"
  },
  {
    id: 8,
    part: 'ตอนที่ 3: เขียนชุดคำสั่งประยุกต์ใช้ Function และ Parameter จากสถานการณ์จริง (3 คะแนน)',
    score: '1 คะแนน',
    title: 'ข้อที่ 8: การจัดมาตรฐานข้อความและสกัดตัวเลขจากข้อความ (String Methods)',
    task: "กำหนดให้ตาราง orders มีคอลัมน์ product_code ที่มีช่องว่างด้านหน้า-หลังและตัวพิมพ์เล็กปะปนกัน (เช่น '  it-01 ') และคอลัมน์ price_text ที่เก็บราคาปะปนกับหน่วย (เช่น '1,500 บาท') จงเขียนคำสั่ง: 1) ตัดช่องว่างและแปลง product_code เป็นตัวพิมพ์ใหญ่ทั้งหมด และ 2) ตัดเครื่องหมายลูกน้ำ ',' และคำว่า ' บาท' ออกจาก price_text แล้วแปลงเป็นชนิด float",
    hint: 'ทบทวนฟังก์ชันที่ 12 และ 13: .str.strip(), .str.upper(), .str.replace(..., regex=False), .astype(float)'
  },
  {
    id: 9,
    part: 'ตอนที่ 3: เขียนชุดคำสั่งประยุกต์ใช้ Function และ Parameter จากสถานการณ์จริง (3 คะแนน)',
    score: '1 คะแนน',
    title: 'ข้อที่ 9: การตรวจสอบและลบข้อมูลซ้ำซ้อนด้วย Parameter subset และ keep',
    task: 'กำหนดให้ตาราง orders มีรหัสคำสั่งซื้อ (order_id) บันทึกซ้ำซ้อนกัน จงเขียนคำสั่ง: 1) แสดงแถวที่มีรหัส order_id ซ้ำกันทั้งหมดทุกแถว (แสดงทั้งแถวต้นฉบับและแถวสำเนาเพื่อนำมาเปรียบเทียบกัน) และ 2) ลบแถวที่มีรหัส order_id ซ้ำออก โดยเก็บรักษาเฉพาะแถวแรกที่พบไว้',
    hint: 'ทบทวนฟังก์ชันที่ 11: df.duplicated(subset=[...], keep=...) และ df.drop_duplicates(subset=[...], keep=...)'
  },
  {
    id: 10,
    part: 'ตอนที่ 3: เขียนชุดคำสั่งประยุกต์ใช้ Function และ Parameter จากสถานการณ์จริง (3 คะแนน)',
    score: '1 คะแนน',
    title: 'ข้อที่ 10: การคัดกรองช่วงข้อมูล การจัดกลุ่ม และการเรียงลำดับผลลัพธ์',
    task: 'กำหนดให้ตาราง df มีคอลัมน์ category (หมวดหมู่สินค้า), quantity (จำนวนชิ้น) และ total_price (ยอดขายรวม) จงเขียนคำสั่ง: 1) คัดกรองเฉพาะแถวที่มีจำนวนชิ้น (quantity) อยู่ระหว่าง 1 ถึง 20 ชิ้น (รวมขอบเขต 1 และ 20) และ 2) จัดกลุ่มตามหมวดหมู่สินค้า (category) เพื่อหาผลรวมของยอดขาย (total_price) และเรียงลำดับจากยอดขายรวมมากที่สุดไปน้อยที่สุด',
    hint: "ทบทวนฟังก์ชันที่ 15 และ 16: .between(1, 20, inclusive='both'), .groupby('category')['total_price'].sum(), .sort_values(ascending=False)"
  }
];
