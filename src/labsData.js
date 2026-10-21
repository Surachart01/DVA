export const labsData = [
  {
    "weekId": 2,
    "labNo": 2,
    "title": "Get Data การรวบรวมและนำเข้าข้อมูล",
    "duration": "กิจกรรมฝึกสองวันรวม 4 ชั่วโมง (240 นาที): วันที่หนึ่ง 2 คาบ + วันที่สอง 2 คาบ",
    "totalScore": 10,
    "unit": "หน่วยที่ 2",
    "objective": [
      "นำเข้า CSV และ Excel พร้อมระบุที่มาข้อมูลได้",
      "จัดทำ Data Dictionary และเลือกข้อมูลโครงงานได้"
    ],
    "scenario": "ไฟล์: students.csv, nvc_store_sales.xlsx | ตรวจเจ้าของข้อมูล ที่มา วันที่ปรับปรุง เงื่อนไขใช้และความหมายคอลัมน์",
    "tasks": [
      {
        "step": 1,
        "title": "ส่วน A เตรียมข้อมูลและฝึกตามตัวอย่าง",
        "desc": "นำเข้า CSV และ Excel พร้อมระบุที่มาข้อมูลได้",
        "codeSnippet": "import pandas as pd\nstudents = pd.read_csv('students.csv')\nproducts = pd.read_excel('nvc_store_sales.xlsx', sheet_name='Products')\nsales = pd.read_excel('nvc_store_sales.xlsx', sheet_name='Daily_Sales')\nprint(students.shape, products.shape, sales.shape)\ndisplay(products.head())\ndisplay(sales.head())"
      },
      {
        "step": 2,
        "title": "ส่วน B ประยุกต์และอธิบาย",
        "desc": "สร้างตารางพจนานุกรมอย่างน้อยห้าคอลัมน์ และระบุผู้ชมกับคำถามของโครงงาน",
        "codeSnippet": "# เขียนคำตอบของตนเองใน Notebook และระบุเหตุผล"
      },
      {
        "step": 3,
        "title": "ตรวจหลักฐานก่อนส่ง",
        "desc": "Notebook นำเข้า CSV/Excel และ Data Dictionary/แหล่งข้อมูลกลุ่ม",
        "codeSnippet": "# ตรวจหน่วย ความหมายคอลัมน์ ที่มา และข้อจำกัดก่อนส่ง"
      }
    ],
    "expectedOutput": "Notebook นำเข้า CSV/Excel และ Data Dictionary/แหล่งข้อมูลกลุ่ม | คะแนนดิบ 10 × 0.25 = 2.5 คะแนนเก็บ",
    "rubric": [
      {
        "item": "คำสั่งถูกต้อง: คะแนนสูงสุด 91 หญิง 15 ชาย 15",
        "score": 4
      },
      {
        "item": "อธิบายข้อมูลดิบและความหมายของผลด้วยคำตนเอง",
        "score": 3
      },
      {
        "item": "มีคำตอบครบและส่ง Notebook .ipynb",
        "score": 3
      }
    ],
    "teacherKey": {
      "solutionCode": "import pandas as pd\nstudents = pd.read_csv('students.csv')\nproducts = pd.read_excel('nvc_store_sales.xlsx', sheet_name='Products')\nsales = pd.read_excel('nvc_store_sales.xlsx', sheet_name='Daily_Sales')\nprint(students.shape, products.shape, sales.shape)\ndisplay(products.head())\ndisplay(sales.head())",
      "teachingNotes": "ยอมรับวิธีที่ให้ผลถูกต้องและมีเหตุผล ตรวจคำอธิบายรายบุคคล ข้อสอบกลางภาค/ปลายภาคใช้ฉบับครูแยก"
    }
  },
  {
    "weekId": 3,
    "labNo": 3,
    "title": "ETL ตรวจคุณภาพข้อมูล",
    "duration": "กิจกรรมฝึกสองวันรวม 4 ชั่วโมง (240 นาที): วันที่หนึ่ง 2 คาบ + วันที่สอง 2 คาบ",
    "totalScore": 10,
    "unit": "หน่วยที่ 3",
    "objective": [
      "ตรวจ Missing Duplicate ช่วงค่าและวันที่ได้",
      "แยกปัญหาคุณภาพจากค่าจริงที่พบได้น้อยได้"
    ],
    "scenario": "ไฟล์: student_register_dirty.csv | Completeness Accuracy Consistency Timeliness และ Uniqueness",
    "tasks": [
      {
        "step": 1,
        "title": "ส่วน A เตรียมข้อมูลและฝึกตามตัวอย่าง",
        "desc": "ตรวจ Missing Duplicate ช่วงค่าและวันที่ได้",
        "codeSnippet": "import pandas as pd\ndf = pd.read_csv('student_register_dirty.csv', dtype={'phone': 'string'})\ndf.info()\ndisplay(df.isna().sum())\nprint('แถวซ้ำทั้งแถว:', int(df.duplicated().sum()))\ndisplay(df.loc[(df['age'] < 15) | (df['age'] > 60)])\ndisplay(df.loc[(df['gpa'] < 0) | (df['gpa'] > 4)])\nprint('วันที่ไม่ผ่าน:', pd.to_datetime(df['updated_date'], errors='coerce').isna().sum())\ndates = pd.to_datetime(df['updated_date'], errors='coerce')\nas_of = pd.Timestamp('2026-06-10')  # วันอ้างอิงสมมติสำหรับโจทย์นี้\nprint('เก่ากว่า 365 วัน:', int((as_of-dates).dt.days.gt(365).sum()))"
      },
      {
        "step": 2,
        "title": "ส่วน B ประยุกต์และอธิบาย",
        "desc": "กำหนดกฎตรวจที่อิงความหมายข้อมูลสามข้อ และระบุว่าปัญหาใดต้องถามเจ้าของข้อมูล",
        "codeSnippet": "# เขียนคำตอบของตนเองใน Notebook และระบุเหตุผล"
      },
      {
        "step": 3,
        "title": "ตรวจหลักฐานก่อนส่ง",
        "desc": "Checklist คุณภาพพร้อมจำนวนปัญหาและหลักฐานจากตาราง",
        "codeSnippet": "# ตรวจหน่วย ความหมายคอลัมน์ ที่มา และข้อจำกัดก่อนส่ง"
      }
    ],
    "expectedOutput": "Checklist คุณภาพพร้อมจำนวนปัญหาและหลักฐานจากตาราง | คะแนนดิบ 10 × 0.25 = 2.5 คะแนนเก็บ",
    "rubric": [
      {
        "item": "ความถูกต้องของชิ้นงาน",
        "score": 4
      },
      {
        "item": "อธิบายเหตุผลและตรวจสอบผล",
        "score": 3
      },
      {
        "item": "ประยุกต์กับข้อมูลกลุ่มและส่งหลักฐาน",
        "score": 3
      }
    ],
    "teacherKey": {
      "solutionCode": "import pandas as pd\ndf = pd.read_csv('student_register_dirty.csv', dtype={'phone': 'string'})\ndf.info()\ndisplay(df.isna().sum())\nprint('แถวซ้ำทั้งแถว:', int(df.duplicated().sum()))\ndisplay(df.loc[(df['age'] < 15) | (df['age'] > 60)])\ndisplay(df.loc[(df['gpa'] < 0) | (df['gpa'] > 4)])\nprint('วันที่ไม่ผ่าน:', pd.to_datetime(df['updated_date'], errors='coerce').isna().sum())\ndates = pd.to_datetime(df['updated_date'], errors='coerce')\nas_of = pd.Timestamp('2026-06-10')  # วันอ้างอิงสมมติสำหรับโจทย์นี้\nprint('เก่ากว่า 365 วัน:', int((as_of-dates).dt.days.gt(365).sum()))",
      "teachingNotes": "ยอมรับวิธีที่ให้ผลถูกต้องและมีเหตุผล ตรวจคำอธิบายรายบุคคล ข้อสอบกลางภาค/ปลายภาคใช้ฉบับครูแยก"
    }
  },
  {
    "weekId": 4,
    "labNo": 4,
    "title": "ETL รายงานผลการตรวจสอบคุณภาพข้อมูล",
    "duration": "กิจกรรมฝึกสองวันรวม 4 ชั่วโมง (240 นาที): วันที่หนึ่ง 2 คาบ + วันที่สอง 2 คาบ",
    "totalScore": 10,
    "unit": "หน่วยที่ 3",
    "objective": [
      "คำนวณจำนวนและร้อยละปัญหาได้",
      "เขียนรายงานคุณภาพห้าส่วนพร้อมข้อเสนอแนะได้"
    ],
    "scenario": "ไฟล์: student_register_dirty.csv | รายงานมีข้อมูลทั่วไป ความหมายคอลัมน์ ผลตรวจ แนวทางแก้ และบทสรุปผู้บริหาร",
    "tasks": [
      {
        "step": 1,
        "title": "ส่วน A เตรียมข้อมูลและฝึกตามตัวอย่าง",
        "desc": "คำนวณจำนวนและร้อยละปัญหาได้",
        "codeSnippet": "import pandas as pd\ndf = pd.read_csv('student_register_dirty.csv', dtype={'phone': 'string'})\nquality = pd.DataFrame({'missing_count': df.isna().sum(), 'missing_percent': df.isna().mean()*100})\ndisplay(quality.round(2))\nprint('จำนวนทั้งหมด:', len(df), 'แถวซ้ำ:', df.duplicated().sum())\nprint('อายุผิดช่วง:', (~df['age'].between(15,60) & df['age'].notna()).sum())\nprint('GPA ผิดช่วง:', (~df['gpa'].between(0,4) & df['gpa'].notna()).sum())\nquality.to_csv('quality_report.csv', encoding='utf-8-sig')"
      },
      {
        "step": 2,
        "title": "ส่วน B ประยุกต์และอธิบาย",
        "desc": "จัดลำดับปัญหาตามผลกระทบและเขียนสรุปผู้บริหารไม่เกินห้าประโยค",
        "codeSnippet": "# เขียนคำตอบของตนเองใน Notebook และระบุเหตุผล"
      },
      {
        "step": 3,
        "title": "ตรวจหลักฐานก่อนส่ง",
        "desc": "Data Quality Report ห้าส่วนของชุดข้อมูลฝึกและชุดข้อมูลกลุ่ม",
        "codeSnippet": "# ตรวจหน่วย ความหมายคอลัมน์ ที่มา และข้อจำกัดก่อนส่ง"
      }
    ],
    "expectedOutput": "Data Quality Report ห้าส่วนของชุดข้อมูลฝึกและชุดข้อมูลกลุ่ม | คะแนนดิบ 10 × 0.25 = 2.5 คะแนนเก็บ",
    "rubric": [
      {
        "item": "ความถูกต้องของชิ้นงาน",
        "score": 4
      },
      {
        "item": "อธิบายเหตุผลและตรวจสอบผล",
        "score": 3
      },
      {
        "item": "ประยุกต์กับข้อมูลกลุ่มและส่งหลักฐาน",
        "score": 3
      }
    ],
    "teacherKey": {
      "solutionCode": "import pandas as pd\ndf = pd.read_csv('student_register_dirty.csv', dtype={'phone': 'string'})\nquality = pd.DataFrame({'missing_count': df.isna().sum(), 'missing_percent': df.isna().mean()*100})\ndisplay(quality.round(2))\nprint('จำนวนทั้งหมด:', len(df), 'แถวซ้ำ:', df.duplicated().sum())\nprint('อายุผิดช่วง:', (~df['age'].between(15,60) & df['age'].notna()).sum())\nprint('GPA ผิดช่วง:', (~df['gpa'].between(0,4) & df['gpa'].notna()).sum())\nquality.to_csv('quality_report.csv', encoding='utf-8-sig')",
      "teachingNotes": "ยอมรับวิธีที่ให้ผลถูกต้องและมีเหตุผล ตรวจคำอธิบายรายบุคคล ข้อสอบกลางภาค/ปลายภาคใช้ฉบับครูแยก"
    }
  },
  {
    "weekId": 5,
    "labNo": 5,
    "title": "ETL ทำความสะอาดและลดความเสี่ยงข้อมูล",
    "duration": "กิจกรรมฝึกสองวันรวม 4 ชั่วโมง (240 นาที): วันที่หนึ่ง 2 คาบ + วันที่สอง 2 คาบ",
    "totalScore": 10,
    "unit": "หน่วยที่ 3",
    "objective": [
      "เลือกวิธี Cleaning และบันทึกเหตุผลได้",
      "สร้างข้อมูลเผยแพร่โดยลดข้อมูลระบุตัวบุคคลได้"
    ],
    "scenario": "ไฟล์: student_register_dirty.csv | ค่าว่างและค่าผิดช่วงต้องเลือกวิธีตามบริบทพร้อมบันทึกการเปลี่ยน",
    "tasks": [
      {
        "step": 1,
        "title": "ส่วน A เตรียมข้อมูลและฝึกตามตัวอย่าง",
        "desc": "เลือกวิธี Cleaning และบันทึกเหตุผลได้",
        "codeSnippet": "import pandas as pd\ndf = pd.read_csv('student_register_dirty.csv', dtype={'phone': 'string'})\nclean = df.drop_duplicates().copy()\nclean['major'] = clean['major'].str.strip().replace({'IT':'เทคโนโลยีสารสนเทศ','เทคโนโลยี สารสนเทศ':'เทคโนโลยีสารสนเทศ'}).fillna('ไม่ระบุ')\nfor col, lo, hi in [('age',15,60),('gpa',0,4)]:\n    clean[col] = pd.to_numeric(clean[col], errors='coerce')\n    clean.loc[~clean[col].between(lo,hi),col] = float('nan')\n    clean[col] = clean[col].fillna(clean[col].median())\nclean['updated_date'] = pd.to_datetime(clean['updated_date'], errors='coerce')\n# ตัวอย่าง Masking ในข้อมูลสำหรับครู ไม่ใช้เป็นหลักฐานว่าข้อมูลไม่ระบุตัวบุคคล\nclean['phone_masked'] = clean['phone'].str.replace(r'\\d{4}$', 'xxxx', regex=True)\n# ข้อมูลเผยแพร่สำหรับฝึก: ตัดตัวระบุโดยตรงออก และตรวจความเสี่ยงซ้ำก่อนแชร์\npublic = clean.drop(columns=['phone','name','student_id','phone_masked'])\npublic.to_csv('clean_public.csv', index=False, encoding='utf-8-sig')\nprint('ก่อน/หลัง:', len(df), len(clean))\ndisplay(public.head())"
      },
      {
        "step": 2,
        "title": "ส่วน B ประยุกต์และอธิบาย",
        "desc": "เปรียบเทียบ Mean กับ Median และเขียน Cleaning Log ว่าเปลี่ยนค่าใดด้วยเหตุผลอะไร",
        "codeSnippet": "# เขียนคำตอบของตนเองใน Notebook และระบุเหตุผล"
      },
      {
        "step": 3,
        "title": "ตรวจหลักฐานก่อนส่ง",
        "desc": "Clean Dataset, Cleaning Log และรายการตรวจความเสี่ยงก่อนเผยแพร่",
        "codeSnippet": "# ตรวจหน่วย ความหมายคอลัมน์ ที่มา และข้อจำกัดก่อนส่ง"
      }
    ],
    "expectedOutput": "Clean Dataset, Cleaning Log และรายการตรวจความเสี่ยงก่อนเผยแพร่ | คะแนนดิบ 10 × 0.25 = 2.5 คะแนนเก็บ",
    "rubric": [
      {
        "item": "ความถูกต้องของชิ้นงาน",
        "score": 4
      },
      {
        "item": "อธิบายเหตุผลและตรวจสอบผล",
        "score": 3
      },
      {
        "item": "ประยุกต์กับข้อมูลกลุ่มและส่งหลักฐาน",
        "score": 3
      }
    ],
    "teacherKey": {
      "solutionCode": "import pandas as pd\ndf = pd.read_csv('student_register_dirty.csv', dtype={'phone': 'string'})\nclean = df.drop_duplicates().copy()\nclean['major'] = clean['major'].str.strip().replace({'IT':'เทคโนโลยีสารสนเทศ','เทคโนโลยี สารสนเทศ':'เทคโนโลยีสารสนเทศ'}).fillna('ไม่ระบุ')\nfor col, lo, hi in [('age',15,60),('gpa',0,4)]:\n    clean[col] = pd.to_numeric(clean[col], errors='coerce')\n    clean.loc[~clean[col].between(lo,hi),col] = float('nan')\n    clean[col] = clean[col].fillna(clean[col].median())\nclean['updated_date'] = pd.to_datetime(clean['updated_date'], errors='coerce')\n# ตัวอย่าง Masking ในข้อมูลสำหรับครู ไม่ใช้เป็นหลักฐานว่าข้อมูลไม่ระบุตัวบุคคล\nclean['phone_masked'] = clean['phone'].str.replace(r'\\d{4}$', 'xxxx', regex=True)\n# ข้อมูลเผยแพร่สำหรับฝึก: ตัดตัวระบุโดยตรงออก และตรวจความเสี่ยงซ้ำก่อนแชร์\npublic = clean.drop(columns=['phone','name','student_id','phone_masked'])\npublic.to_csv('clean_public.csv', index=False, encoding='utf-8-sig')\nprint('ก่อน/หลัง:', len(df), len(clean))\ndisplay(public.head())",
      "teachingNotes": "ยอมรับวิธีที่ให้ผลถูกต้องและมีเหตุผล ตรวจคำอธิบายรายบุคคล ข้อสอบกลางภาค/ปลายภาคใช้ฉบับครูแยก"
    }
  },
  {
    "weekId": 6,
    "labNo": 6,
    "title": "Data Model โครงสร้างและการเชื่อมโยงตาราง",
    "duration": "กิจกรรมฝึกสองวันรวม 4 ชั่วโมง (240 นาที): วันที่หนึ่ง 2 คาบ + วันที่สอง 2 คาบ",
    "totalScore": 10,
    "unit": "หน่วยที่ 4",
    "objective": [
      "แยก Fact/Dimension และ Primary/Foreign Key ได้",
      "ใช้ Left Join และตรวจรหัสที่เชื่อมไม่สำเร็จได้"
    ],
    "scenario": "ไฟล์: nvc_store_sales.xlsx | Products เป็น Dimension ยอดขายเป็น Fact ตามระดับรายละเอียดของหนึ่งแถว",
    "tasks": [
      {
        "step": 1,
        "title": "ส่วน A เตรียมข้อมูลและฝึกตามตัวอย่าง",
        "desc": "แยก Fact/Dimension และ Primary/Foreign Key ได้",
        "codeSnippet": "import pandas as pd\nproducts = pd.read_excel('nvc_store_sales.xlsx', sheet_name='Products')\nsales = pd.read_excel('nvc_store_sales.xlsx', sheet_name='Daily_Sales')\nassert products['product_id'].is_unique\nmerged = sales.merge(products, on='product_id', how='left', validate='many_to_one', indicator=True)\ndisplay(merged.head())\nprint('รหัสเชื่อมไม่สำเร็จ:', (merged['_merge']=='left_only').sum())\nmerged['total_amount'] = merged['quantity'] * merged['selling_price']\nmerged['total_profit'] = merged['quantity'] * (merged['selling_price']-merged['cost_price'])"
      },
      {
        "step": 2,
        "title": "ส่วน B ประยุกต์และอธิบาย",
        "desc": "เพิ่มรหัสสินค้า P999 แล้วเปรียบเทียบ Inner กับ Left Join โดยไม่คิดยอดที่ราคายังไม่ทราบ",
        "codeSnippet": "# เขียนคำตอบของตนเองใน Notebook และระบุเหตุผล"
      },
      {
        "step": 3,
        "title": "ตรวจหลักฐานก่อนส่ง",
        "desc": "แผนภาพความสัมพันธ์ตารางและ Notebook Merge พร้อมตรวจคุณภาพหลังเชื่อม",
        "codeSnippet": "# ตรวจหน่วย ความหมายคอลัมน์ ที่มา และข้อจำกัดก่อนส่ง"
      }
    ],
    "expectedOutput": "แผนภาพความสัมพันธ์ตารางและ Notebook Merge พร้อมตรวจคุณภาพหลังเชื่อม | คะแนนดิบ 10 × 0.25 = 2.5 คะแนนเก็บ",
    "rubric": [
      {
        "item": "ความถูกต้องของชิ้นงาน",
        "score": 4
      },
      {
        "item": "อธิบายเหตุผลและตรวจสอบผล",
        "score": 3
      },
      {
        "item": "ประยุกต์กับข้อมูลกลุ่มและส่งหลักฐาน",
        "score": 3
      }
    ],
    "teacherKey": {
      "solutionCode": "import pandas as pd\nproducts = pd.read_excel('nvc_store_sales.xlsx', sheet_name='Products')\nsales = pd.read_excel('nvc_store_sales.xlsx', sheet_name='Daily_Sales')\nassert products['product_id'].is_unique\nmerged = sales.merge(products, on='product_id', how='left', validate='many_to_one', indicator=True)\ndisplay(merged.head())\nprint('รหัสเชื่อมไม่สำเร็จ:', (merged['_merge']=='left_only').sum())\nmerged['total_amount'] = merged['quantity'] * merged['selling_price']\nmerged['total_profit'] = merged['quantity'] * (merged['selling_price']-merged['cost_price'])",
      "teachingNotes": "ยอมรับวิธีที่ให้ผลถูกต้องและมีเหตุผล ตรวจคำอธิบายรายบุคคล ข้อสอบกลางภาค/ปลายภาคใช้ฉบับครูแยก"
    }
  },
  {
    "weekId": 7,
    "labNo": 7,
    "title": "Data Model สถิติ ตัวชี้วัด และ GroupBy",
    "duration": "กิจกรรมฝึกสองวันรวม 4 ชั่วโมง (240 นาที): วันที่หนึ่ง 2 คาบ + วันที่สอง 2 คาบ",
    "totalScore": 10,
    "unit": "หน่วยที่ 4",
    "objective": [
      "คำนวณยอดขาย กำไร และ KPI พร้อมระบุหน่วยได้",
      "สรุป GroupBy/Pivot และแปลผลเพื่อตอบคำถามได้"
    ],
    "scenario": "ไฟล์: nvc_store_sales.xlsx | แยกยอดเงินรวม จำนวนรายการ จำนวนหน่วย และมูลค่าต่อรายการ",
    "tasks": [
      {
        "step": 1,
        "title": "ส่วน A เตรียมข้อมูลและฝึกตามตัวอย่าง",
        "desc": "คำนวณยอดขาย กำไร และ KPI พร้อมระบุหน่วยได้",
        "codeSnippet": "import pandas as pd\nproducts = pd.read_excel('nvc_store_sales.xlsx', sheet_name='Products')\nsales = pd.read_excel('nvc_store_sales.xlsx', sheet_name='Daily_Sales')\nmerged = sales.merge(products,on='product_id',how='left',validate='many_to_one')\nmerged['total_amount'] = merged.quantity*merged.selling_price\nmerged['total_profit'] = merged.quantity*(merged.selling_price-merged.cost_price)\nprint('ยอดขาย:', merged.total_amount.sum(), 'กำไร:', merged.total_profit.sum())\nprint('เฉลี่ยต่อรายการ:', merged.groupby('order_id').total_amount.sum().mean())\ndisplay(merged.groupby('category')[['total_amount','total_profit']].sum())\ndisplay(merged.pivot_table(index='sale_date',columns='category',values='total_amount',aggfunc='sum',fill_value=0))"
      },
      {
        "step": 2,
        "title": "ส่วน B ประยุกต์และอธิบาย",
        "desc": "เลือก KPI สามตัวที่ตอบคำถามของกลุ่ม และอธิบายว่าทำไมไม่นับจำนวนแถวเป็นจำนวนลูกค้า",
        "codeSnippet": "# เขียนคำตอบของตนเองใน Notebook และระบุเหตุผล"
      },
      {
        "step": 3,
        "title": "ตรวจหลักฐานก่อนส่ง",
        "desc": "ตาราง KPI พร้อมสูตร หน่วย ตัวหาร และข้อเสนอแนะจากข้อมูล",
        "codeSnippet": "# ตรวจหน่วย ความหมายคอลัมน์ ที่มา และข้อจำกัดก่อนส่ง"
      }
    ],
    "expectedOutput": "ตาราง KPI พร้อมสูตร หน่วย ตัวหาร และข้อเสนอแนะจากข้อมูล | คะแนนดิบ 10 × 0.25 = 2.5 คะแนนเก็บ",
    "rubric": [
      {
        "item": "ความถูกต้องของชิ้นงาน",
        "score": 4
      },
      {
        "item": "อธิบายเหตุผลและตรวจสอบผล",
        "score": 3
      },
      {
        "item": "ประยุกต์กับข้อมูลกลุ่มและส่งหลักฐาน",
        "score": 3
      }
    ],
    "teacherKey": {
      "solutionCode": "import pandas as pd\nproducts = pd.read_excel('nvc_store_sales.xlsx', sheet_name='Products')\nsales = pd.read_excel('nvc_store_sales.xlsx', sheet_name='Daily_Sales')\nmerged = sales.merge(products,on='product_id',how='left',validate='many_to_one')\nmerged['total_amount'] = merged.quantity*merged.selling_price\nmerged['total_profit'] = merged.quantity*(merged.selling_price-merged.cost_price)\nprint('ยอดขาย:', merged.total_amount.sum(), 'กำไร:', merged.total_profit.sum())\nprint('เฉลี่ยต่อรายการ:', merged.groupby('order_id').total_amount.sum().mean())\ndisplay(merged.groupby('category')[['total_amount','total_profit']].sum())\ndisplay(merged.pivot_table(index='sale_date',columns='category',values='total_amount',aggfunc='sum',fill_value=0))",
      "teachingNotes": "ยอมรับวิธีที่ให้ผลถูกต้องและมีเหตุผล ตรวจคำอธิบายรายบุคคล ข้อสอบกลางภาค/ปลายภาคใช้ฉบับครูแยก"
    }
  },
  {
    "weekId": 8,
    "labNo": 8,
    "title": "สอบกลางภาคและประเมินสมรรถนะ",
    "duration": "กิจกรรมประเมินตามแผน 5 ชั่วโมง",
    "totalScore": 10.0,
    "unit": "หน่วยที่ 8",
    "objective": [
      "นำเข้า ตรวจ ทำความสะอาด เชื่อม และคำนวณข้อมูลรายบุคคลได้"
    ],
    "scenario": "ไฟล์: midterm_sales.csv, midterm_products.csv | กลางภาค 15 คะแนน: ความรู้ 5 และปฏิบัติ 10",
    "tasks": [
      {
        "step": 1,
        "title": "ส่วน A เตรียมข้อมูลและฝึกตามตัวอย่าง",
        "desc": "นำเข้า ตรวจ ทำความสะอาด เชื่อม และคำนวณข้อมูลรายบุคคลได้",
        "codeSnippet": "print(\"ใช้ข้อสอบฉบับผู้เรียนที่ครูแจก และทำรายบุคคล\")"
      },
      {
        "step": 2,
        "title": "ส่วน B ประยุกต์และอธิบาย",
        "desc": "ปฏิบัติรายบุคคล: นำเข้า ตรวจปัญหา Cleaning Merge KPI ตามรูบริก และตอบข้อเขียนสั้นห้าข้อ",
        "codeSnippet": "# เขียนคำตอบของตนเองใน Notebook และระบุเหตุผล"
      },
      {
        "step": 3,
        "title": "ตรวจหลักฐานก่อนส่ง",
        "desc": "ข้อสอบความรู้และ Notebook สอบกลางภาครายบุคคล",
        "codeSnippet": "# ตรวจหน่วย ความหมายคอลัมน์ ที่มา และข้อจำกัดก่อนส่ง"
      }
    ],
    "expectedOutput": "ข้อสอบความรู้และ Notebook สอบกลางภาครายบุคคล | ประเมินในหมวดเฉพาะ ไม่คิดใบงานซ้ำ",
    "rubric": [
      {
        "item": "Get Data",
        "score": 2
      },
      {
        "item": "ETL พร้อมเหตุผล",
        "score": 3
      },
      {
        "item": "Merge และคำนวณ",
        "score": 2.5
      },
      {
        "item": "KPI และแปลผล",
        "score": 2.5
      }
    ],
    "teacherKey": {
      "solutionCode": "# เฉลยสอบอยู่ในคู่มือครู ไม่เผยแพร่ในเว็บผู้เรียน",
      "teachingNotes": "ยอมรับวิธีที่ให้ผลถูกต้องและมีเหตุผล ตรวจคำอธิบายรายบุคคล ข้อสอบกลางภาค/ปลายภาคใช้ฉบับครูแยก"
    }
  },
  {
    "weekId": 9,
    "labNo": 9,
    "title": "Data Model อนุกรมเวลาและการคาดการณ์",
    "duration": "กิจกรรมฝึกสองวันรวม 4 ชั่วโมง (240 นาที): วันที่หนึ่ง 2 คาบ + วันที่สอง 2 คาบ",
    "totalScore": 10,
    "unit": "หน่วยที่ 4",
    "objective": [
      "แปลง DateTime และจัดลำดับเวลาได้",
      "คำนวณ Moving Average และอธิบายข้อจำกัดการคาดการณ์ได้"
    ],
    "scenario": "ไฟล์: drinks_shop.csv | ไฟล์พร้อมสอนใช้ปี ค.ศ. ส่วนวันที่ พ.ศ. ต้องลบปี 543 ก่อนแปลง",
    "tasks": [
      {
        "step": 1,
        "title": "ส่วน A เตรียมข้อมูลและฝึกตามตัวอย่าง",
        "desc": "แปลง DateTime และจัดลำดับเวลาได้",
        "codeSnippet": "import pandas as pd\ndf = pd.read_csv('drinks_shop.csv')\ndf['date'] = pd.to_datetime(df.date)\ndaily = df.groupby('date').price.sum().sort_index().rename('revenue').to_frame()\ndaily['MA_3observations'] = daily.revenue.rolling(3).mean()\ndisplay(daily)\nforecast = daily.revenue.tail(3).mean()\nprint('คาดการณ์วันมีข้อมูลถัดไปแบบฐาน:', round(forecast,2))\nprint('เป็น baseline จากข้อมูลระยะสั้น ไม่ใช่คำรับรองยอดขายจริง')"
      },
      {
        "step": 2,
        "title": "ส่วน B ประยุกต์และอธิบาย",
        "desc": "เปรียบเทียบหน้าต่างสามกับห้ารายการ และแยกวันที่ไม่มีบันทึกออกจากวันที่ยอดขายเป็นศูนย์",
        "codeSnippet": "# เขียนคำตอบของตนเองใน Notebook และระบุเหตุผล"
      },
      {
        "step": 3,
        "title": "ตรวจหลักฐานก่อนส่ง",
        "desc": "ตาราง/กราฟแนวโน้ม ค่าคาดการณ์ วิธีคิด และข้อจำกัด",
        "codeSnippet": "# ตรวจหน่วย ความหมายคอลัมน์ ที่มา และข้อจำกัดก่อนส่ง"
      }
    ],
    "expectedOutput": "ตาราง/กราฟแนวโน้ม ค่าคาดการณ์ วิธีคิด และข้อจำกัด | คะแนนดิบ 10 × 0.25 = 2.5 คะแนนเก็บ",
    "rubric": [
      {
        "item": "ความถูกต้องของชิ้นงาน",
        "score": 4
      },
      {
        "item": "อธิบายเหตุผลและตรวจสอบผล",
        "score": 3
      },
      {
        "item": "ประยุกต์กับข้อมูลกลุ่มและส่งหลักฐาน",
        "score": 3
      }
    ],
    "teacherKey": {
      "solutionCode": "import pandas as pd\ndf = pd.read_csv('drinks_shop.csv')\ndf['date'] = pd.to_datetime(df.date)\ndaily = df.groupby('date').price.sum().sort_index().rename('revenue').to_frame()\ndaily['MA_3observations'] = daily.revenue.rolling(3).mean()\ndisplay(daily)\nforecast = daily.revenue.tail(3).mean()\nprint('คาดการณ์วันมีข้อมูลถัดไปแบบฐาน:', round(forecast,2))\nprint('เป็น baseline จากข้อมูลระยะสั้น ไม่ใช่คำรับรองยอดขายจริง')",
      "teachingNotes": "ยอมรับวิธีที่ให้ผลถูกต้องและมีเหตุผล ตรวจคำอธิบายรายบุคคล ข้อสอบกลางภาค/ปลายภาคใช้ฉบับครูแยก"
    }
  },
  {
    "weekId": 10,
    "labNo": 10,
    "title": "Visualization ผู้ชม การเลือกกราฟ และ Storyboard",
    "duration": "กิจกรรมฝึกสองวันรวม 4 ชั่วโมง (240 นาที): วันที่หนึ่ง 2 คาบ + วันที่สอง 2 คาบ",
    "totalScore": 10,
    "unit": "หน่วยที่ 5",
    "objective": [
      "ระบุผู้ชมกับการตัดสินใจที่ต้องการได้",
      "เลือกกราฟและร่าง Dashboard พร้อมทดสอบคำถามได้"
    ],
    "scenario": "ไฟล์: drinks_shop.csv | ผู้ชมและคำถามมาก่อนกราฟ",
    "tasks": [
      {
        "step": 1,
        "title": "ส่วน A เตรียมข้อมูลและฝึกตามตัวอย่าง",
        "desc": "ระบุผู้ชมกับการตัดสินใจที่ต้องการได้",
        "codeSnippet": "import pandas as pd\ndf = pd.read_csv('drinks_shop.csv')\nsummary = df.groupby('menu').agg(cups=('cups','sum'),revenue=('price','sum')).sort_values('revenue',ascending=False)\ndisplay(summary)\nprint('ผู้ชม: ผู้จัดการร้าน | คำถาม: ควรเตรียมเมนูใดเพิ่ม?')"
      },
      {
        "step": 2,
        "title": "ส่วน B ประยุกต์และอธิบาย",
        "desc": "ร่างหนึ่งหน้าให้ผู้จัดการร้านและอธิบายว่าตัวกรองช่วยตอบคำถามใด",
        "codeSnippet": "# เขียนคำตอบของตนเองใน Notebook และระบุเหตุผล"
      },
      {
        "step": 3,
        "title": "ตรวจหลักฐานก่อนส่ง",
        "desc": "Persona คำถาม KPI และ Storyboard พร้อมคำอธิบายชนิดกราฟ",
        "codeSnippet": "# ตรวจหน่วย ความหมายคอลัมน์ ที่มา และข้อจำกัดก่อนส่ง"
      }
    ],
    "expectedOutput": "Persona คำถาม KPI และ Storyboard พร้อมคำอธิบายชนิดกราฟ | คะแนนดิบ 10 × 0.25 = 2.5 คะแนนเก็บ",
    "rubric": [
      {
        "item": "ความถูกต้องของชิ้นงาน",
        "score": 4
      },
      {
        "item": "อธิบายเหตุผลและตรวจสอบผล",
        "score": 3
      },
      {
        "item": "ประยุกต์กับข้อมูลกลุ่มและส่งหลักฐาน",
        "score": 3
      }
    ],
    "teacherKey": {
      "solutionCode": "import pandas as pd\ndf = pd.read_csv('drinks_shop.csv')\nsummary = df.groupby('menu').agg(cups=('cups','sum'),revenue=('price','sum')).sort_values('revenue',ascending=False)\ndisplay(summary)\nprint('ผู้ชม: ผู้จัดการร้าน | คำถาม: ควรเตรียมเมนูใดเพิ่ม?')",
      "teachingNotes": "ยอมรับวิธีที่ให้ผลถูกต้องและมีเหตุผล ตรวจคำอธิบายรายบุคคล ข้อสอบกลางภาค/ปลายภาคใช้ฉบับครูแยก"
    }
  },
  {
    "weekId": 11,
    "labNo": 11,
    "title": "Visualization สร้างภาพข้อมูล",
    "duration": "กิจกรรมฝึกสองวันรวม 4 ชั่วโมง (240 นาที): วันที่หนึ่ง 2 คาบ + วันที่สอง 2 คาบ",
    "totalScore": 10,
    "unit": "หน่วยที่ 5",
    "objective": [
      "สร้างกราฟและตั้งชื่อแกน หน่วย แหล่งข้อมูลได้",
      "ตรวจสเกล สี ฟอนต์ และความหมายก่อนเผยแพร่ได้"
    ],
    "scenario": "ไฟล์: drinks_shop.csv | เลือกสเกลให้ตีความไม่ผิด ระบุหน่วยและช่วงเวลา",
    "tasks": [
      {
        "step": 1,
        "title": "ส่วน A เตรียมข้อมูลและฝึกตามตัวอย่าง",
        "desc": "สร้างกราฟและตั้งชื่อแกน หน่วย แหล่งข้อมูลได้",
        "codeSnippet": "import pandas as pd\nimport plotly.express as px\nimport matplotlib.pyplot as plt\nfrom matplotlib.font_manager import FontProperties\nfrom pathlib import Path\ndf = pd.read_csv('drinks_shop.csv')\nsummary = df.groupby('menu',as_index=False).price.sum()\nfig = px.bar(summary,x='menu',y='price',title='ยอดขายรวมแยกตามเมนู',labels={'menu':'เมนู','price':'ยอดขาย (บาท)'})\nfig.show()\nfont_path = Path('THSarabun.ttf')\nfont = FontProperties(fname=str(font_path)) if font_path.exists() else None\nplt.bar(range(len(summary)),summary.price)\nplt.xticks(range(len(summary)),summary.menu,fontproperties=font)\nplt.ylabel('Revenue (THB)')\nplt.tight_layout()\nplt.savefig('menu_sales.png',dpi=160)\nplt.show()"
      },
      {
        "step": 2,
        "title": "ส่วน B ประยุกต์และอธิบาย",
        "desc": "ตรวจกราฟเพื่อนด้วยรายการตรวจเรื่องชนิดกราฟ หน่วย สเกล สี และแหล่งข้อมูล",
        "codeSnippet": "# เขียนคำตอบของตนเองใน Notebook และระบุเหตุผล"
      },
      {
        "step": 3,
        "title": "ตรวจหลักฐานก่อนส่ง",
        "desc": "กราฟอย่างน้อยสามชนิดที่ตอบคำถามจริง พร้อมคำอธิบาย",
        "codeSnippet": "# ตรวจหน่วย ความหมายคอลัมน์ ที่มา และข้อจำกัดก่อนส่ง"
      }
    ],
    "expectedOutput": "กราฟอย่างน้อยสามชนิดที่ตอบคำถามจริง พร้อมคำอธิบาย | คะแนนดิบ 10 × 0.25 = 2.5 คะแนนเก็บ",
    "rubric": [
      {
        "item": "ความถูกต้องของชิ้นงาน",
        "score": 4
      },
      {
        "item": "อธิบายเหตุผลและตรวจสอบผล",
        "score": 3
      },
      {
        "item": "ประยุกต์กับข้อมูลกลุ่มและส่งหลักฐาน",
        "score": 3
      }
    ],
    "teacherKey": {
      "solutionCode": "import pandas as pd\nimport plotly.express as px\nimport matplotlib.pyplot as plt\nfrom matplotlib.font_manager import FontProperties\nfrom pathlib import Path\ndf = pd.read_csv('drinks_shop.csv')\nsummary = df.groupby('menu',as_index=False).price.sum()\nfig = px.bar(summary,x='menu',y='price',title='ยอดขายรวมแยกตามเมนู',labels={'menu':'เมนู','price':'ยอดขาย (บาท)'})\nfig.show()\nfont_path = Path('THSarabun.ttf')\nfont = FontProperties(fname=str(font_path)) if font_path.exists() else None\nplt.bar(range(len(summary)),summary.price)\nplt.xticks(range(len(summary)),summary.menu,fontproperties=font)\nplt.ylabel('Revenue (THB)')\nplt.tight_layout()\nplt.savefig('menu_sales.png',dpi=160)\nplt.show()",
      "teachingNotes": "ยอมรับวิธีที่ให้ผลถูกต้องและมีเหตุผล ตรวจคำอธิบายรายบุคคล ข้อสอบกลางภาค/ปลายภาคใช้ฉบับครูแยก"
    }
  },
  {
    "weekId": 12,
    "labNo": 12,
    "title": "Visualization Dashboard และการทดสอบ UX",
    "duration": "กิจกรรมฝึกสองวันรวม 4 ชั่วโมง (240 นาที): วันที่หนึ่ง 2 คาบ + วันที่สอง 2 คาบ",
    "totalScore": 10,
    "unit": "หน่วยที่ 5",
    "objective": [
      "ประกอบ KPI และหลายกราฟพร้อมตัวกรองที่เปลี่ยนข้อมูลทุกส่วนได้",
      "ทดสอบงานผู้ใช้และปรับปรุงจากหลักฐานได้"
    ],
    "scenario": "ไฟล์: drinks_shop.csv | กราฟโต้ตอบหนึ่งภาพยังไม่ใช่ Dashboard ที่ครอบคลุมแผนนี้",
    "tasks": [
      {
        "step": 1,
        "title": "ส่วน A เตรียมข้อมูลและฝึกตามตัวอย่าง",
        "desc": "ประกอบ KPI และหลายกราฟพร้อมตัวกรองที่เปลี่ยนข้อมูลทุกส่วนได้",
        "codeSnippet": "import pandas as pd\nimport plotly.graph_objects as go\nfrom plotly.subplots import make_subplots\ndf = pd.read_csv('drinks_shop.csv')\ndef dashboard_traces(sub):\n    daily = sub.groupby('date',as_index=False).price.sum()\n    menu = sub.groupby('menu',as_index=False).price.sum()\n    return [go.Indicator(mode='number',number={'valueformat':',.0f'},value=float(sub.price.sum()),title={'text':'ยอดขาย (บาท)'}),go.Bar(x=menu.menu,y=menu.price),go.Scatter(x=daily.date,y=daily.price,mode='lines+markers')]\nfig = make_subplots(rows=2,cols=2,specs=[[{'type':'indicator'}, {'type':'xy'}],[{'type':'xy','colspan':2},None]],subplot_titles=['','ยอดขายแยกเมนู','แนวโน้มยอดขาย'])\nfor trace,row,col in zip(dashboard_traces(df),[1,1,2],[1,2,1]): fig.add_trace(trace,row=row,col=col)\nbuttons=[]\nfor name in ['ทั้งหมด']+sorted(df.menu.unique().tolist()):\n    sub=df if name=='ทั้งหมด' else df.loc[df.menu==name]\n    traces=dashboard_traces(sub)\n    buttons.append(dict(label=name,method='update',args=[{'value':[float(sub.price.sum()),None,None],'x':[None,traces[1].x,traces[2].x],'y':[None,traces[1].y,traces[2].y]}, {'title.text':'ยอดขายร้านเครื่องดื่ม: '+name}]))\nfig.update_layout(title='ยอดขายร้านเครื่องดื่ม: ทั้งหมด',height=650,updatemenus=[dict(buttons=buttons,x=0,y=1.18)],showlegend=False)\nfig.write_html('dashboard.html',include_plotlyjs=True)\nfig.show()"
      },
      {
        "step": 2,
        "title": "ส่วน B ประยุกต์และอธิบาย",
        "desc": "ทดสอบสามงาน: ยอดขายทั้งหมด เมนูที่เลือก และวันที่ยอดสูงสุด บันทึกข้อเสนอแนะและแก้หนึ่งจุด",
        "codeSnippet": "# เขียนคำตอบของตนเองใน Notebook และระบุเหตุผล"
      },
      {
        "step": 3,
        "title": "ตรวจหลักฐานก่อนส่ง",
        "desc": "dashboard.html พร้อมตัวกรอง ผลทดสอบ UX และบันทึกก่อน/หลังปรับ",
        "codeSnippet": "# ตรวจหน่วย ความหมายคอลัมน์ ที่มา และข้อจำกัดก่อนส่ง"
      }
    ],
    "expectedOutput": "dashboard.html พร้อมตัวกรอง ผลทดสอบ UX และบันทึกก่อน/หลังปรับ | คะแนนดิบ 10 × 0.25 = 2.5 คะแนนเก็บ",
    "rubric": [
      {
        "item": "ความถูกต้องของชิ้นงาน",
        "score": 4
      },
      {
        "item": "อธิบายเหตุผลและตรวจสอบผล",
        "score": 3
      },
      {
        "item": "ประยุกต์กับข้อมูลกลุ่มและส่งหลักฐาน",
        "score": 3
      }
    ],
    "teacherKey": {
      "solutionCode": "import pandas as pd\nimport plotly.graph_objects as go\nfrom plotly.subplots import make_subplots\ndf = pd.read_csv('drinks_shop.csv')\ndef dashboard_traces(sub):\n    daily = sub.groupby('date',as_index=False).price.sum()\n    menu = sub.groupby('menu',as_index=False).price.sum()\n    return [go.Indicator(mode='number',number={'valueformat':',.0f'},value=float(sub.price.sum()),title={'text':'ยอดขาย (บาท)'}),go.Bar(x=menu.menu,y=menu.price),go.Scatter(x=daily.date,y=daily.price,mode='lines+markers')]\nfig = make_subplots(rows=2,cols=2,specs=[[{'type':'indicator'}, {'type':'xy'}],[{'type':'xy','colspan':2},None]],subplot_titles=['','ยอดขายแยกเมนู','แนวโน้มยอดขาย'])\nfor trace,row,col in zip(dashboard_traces(df),[1,1,2],[1,2,1]): fig.add_trace(trace,row=row,col=col)\nbuttons=[]\nfor name in ['ทั้งหมด']+sorted(df.menu.unique().tolist()):\n    sub=df if name=='ทั้งหมด' else df.loc[df.menu==name]\n    traces=dashboard_traces(sub)\n    buttons.append(dict(label=name,method='update',args=[{'value':[float(sub.price.sum()),None,None],'x':[None,traces[1].x,traces[2].x],'y':[None,traces[1].y,traces[2].y]}, {'title.text':'ยอดขายร้านเครื่องดื่ม: '+name}]))\nfig.update_layout(title='ยอดขายร้านเครื่องดื่ม: ทั้งหมด',height=650,updatemenus=[dict(buttons=buttons,x=0,y=1.18)],showlegend=False)\nfig.write_html('dashboard.html',include_plotlyjs=True)\nfig.show()",
      "teachingNotes": "ยอมรับวิธีที่ให้ผลถูกต้องและมีเหตุผล ตรวจคำอธิบายรายบุคคล ข้อสอบกลางภาค/ปลายภาคใช้ฉบับครูแยก"
    }
  },
  {
    "weekId": 13,
    "labNo": 13,
    "title": "Data Storytelling และการนำเสนอเพื่อตัดสินใจ",
    "duration": "กิจกรรมฝึกสองวันรวม 4 ชั่วโมง (240 นาที): วันที่หนึ่ง 2 คาบ + วันที่สอง 2 คาบ",
    "totalScore": 10,
    "unit": "หน่วยที่ 6",
    "objective": [
      "เชื่อม Insight กับข้อเสนอแนะและข้อจำกัดได้",
      "จัดทำสไลด์และซ้อมตอบคำถามได้"
    ],
    "scenario": "ไฟล์: drinks_shop.csv | แยกสิ่งที่ข้อมูลบอก สมมติฐาน และคำแนะนำ",
    "tasks": [
      {
        "step": 1,
        "title": "ส่วน A เตรียมข้อมูลและฝึกตามตัวอย่าง",
        "desc": "เชื่อม Insight กับข้อเสนอแนะและข้อจำกัดได้",
        "codeSnippet": "import pandas as pd\ndf = pd.read_csv('drinks_shop.csv')\nsummary = df.groupby('menu').price.sum()\ntop = summary.idxmax()\nshare = summary.max()/summary.sum()*100\nprint(f'{top} มียอดขาย {summary.max():,.0f} บาท คิดเป็น {share:.1f}% ของยอดรวมในข้อมูลฝึก')\nprint('ข้อเสนอแนะ: ตรวจสต็อกเมนูนี้ก่อนวางแผนเพิ่ม พร้อมติดตามข้อมูลหลายสัปดาห์')\nprint('ข้อจำกัด: ข้อมูลตัวอย่างระยะสั้นและไม่ทราบอุปสงค์ที่ขายไม่ได้')"
      },
      {
        "step": 2,
        "title": "ส่วน B ประยุกต์และอธิบาย",
        "desc": "สร้างสไลด์ห้าหน้า: คำถาม ข้อมูล/คุณภาพ ผลวิเคราะห์ Dashboard และข้อเสนอแนะพร้อมข้อจำกัด",
        "codeSnippet": "# เขียนคำตอบของตนเองใน Notebook และระบุเหตุผล"
      },
      {
        "step": 3,
        "title": "ตรวจหลักฐานก่อนส่ง",
        "desc": "สไลด์ห้าหน้า บทพูด และผลซ้อมนำเสนอ",
        "codeSnippet": "# ตรวจหน่วย ความหมายคอลัมน์ ที่มา และข้อจำกัดก่อนส่ง"
      }
    ],
    "expectedOutput": "สไลด์ห้าหน้า บทพูด และผลซ้อมนำเสนอ | คะแนนดิบ 10 × 0.25 = 2.5 คะแนนเก็บ",
    "rubric": [
      {
        "item": "ความถูกต้องของชิ้นงาน",
        "score": 4
      },
      {
        "item": "อธิบายเหตุผลและตรวจสอบผล",
        "score": 3
      },
      {
        "item": "ประยุกต์กับข้อมูลกลุ่มและส่งหลักฐาน",
        "score": 3
      }
    ],
    "teacherKey": {
      "solutionCode": "import pandas as pd\ndf = pd.read_csv('drinks_shop.csv')\nsummary = df.groupby('menu').price.sum()\ntop = summary.idxmax()\nshare = summary.max()/summary.sum()*100\nprint(f'{top} มียอดขาย {summary.max():,.0f} บาท คิดเป็น {share:.1f}% ของยอดรวมในข้อมูลฝึก')\nprint('ข้อเสนอแนะ: ตรวจสต็อกเมนูนี้ก่อนวางแผนเพิ่ม พร้อมติดตามข้อมูลหลายสัปดาห์')\nprint('ข้อจำกัด: ข้อมูลตัวอย่างระยะสั้นและไม่ทราบอุปสงค์ที่ขายไม่ได้')",
      "teachingNotes": "ยอมรับวิธีที่ให้ผลถูกต้องและมีเหตุผล ตรวจคำอธิบายรายบุคคล ข้อสอบกลางภาค/ปลายภาคใช้ฉบับครูแยก"
    }
  },
  {
    "weekId": 14,
    "labNo": 14,
    "title": "นำเสนอโครงงานบูรณาการ",
    "duration": "กิจกรรมประเมินตามแผน 5 ชั่วโมง",
    "totalScore": 20,
    "unit": "หน่วยที่ 7",
    "objective": [
      "สาธิต Pipeline ครบวงจรและตอบคำถามรายบุคคลได้",
      "นำเสนอ Dashboard กับข้อเสนอแนะที่มีหลักฐานได้"
    ],
    "scenario": "ไฟล์: เอกสารที่ครูแจก | นำเสนอกลุ่มละ 12 นาทีและตอบคำถาม 5 นาที ปรับจำนวนกลุ่มตามชั้นเรียนจริง",
    "tasks": [
      {
        "step": 1,
        "title": "ส่วน A เตรียมข้อมูลและฝึกตามตัวอย่าง",
        "desc": "สาธิต Pipeline ครบวงจรและตอบคำถามรายบุคคลได้",
        "codeSnippet": "print('รายการส่งโครงงาน: ข้อมูลพร้อมคำอธิบาย + Notebook + Dashboard + สไลด์ + บันทึกบทบาท')\nprint('ครูตรวจคำอธิบายรายบุคคลและบันทึกหลักฐานตามรูบริก')"
      },
      {
        "step": 2,
        "title": "ส่วน B ประยุกต์และอธิบาย",
        "desc": "สาธิตผลจากข้อมูลจริงของกลุ่ม ตอบคำถามวิธี Cleaning สูตร KPI และข้อจำกัด",
        "codeSnippet": "# เขียนคำตอบของตนเองใน Notebook และระบุเหตุผล"
      },
      {
        "step": 3,
        "title": "ตรวจหลักฐานก่อนส่ง",
        "desc": "แฟ้มโครงงานและแบบประเมินรายบุคคล",
        "codeSnippet": "# ตรวจหน่วย ความหมายคอลัมน์ ที่มา และข้อจำกัดก่อนส่ง"
      }
    ],
    "expectedOutput": "แฟ้มโครงงานและแบบประเมินรายบุคคล | ประเมินในหมวดเฉพาะ ไม่คิดใบงานซ้ำ",
    "rubric": [
      {
        "item": "ข้อมูล คุณภาพ และความปลอดภัย",
        "score": 4
      },
      {
        "item": "แบบจำลอง การคำนวณ และการตรวจผล",
        "score": 4
      },
      {
        "item": "Dashboard และหลักฐาน UX",
        "score": 4
      },
      {
        "item": "Insight การตัดสินใจ และข้อจำกัด",
        "score": 4
      },
      {
        "item": "นำเสนอ ตอบคำถาม และบทบาทสมาชิก",
        "score": 4
      }
    ],
    "teacherKey": {
      "solutionCode": "print('รายการส่งโครงงาน: ข้อมูลพร้อมคำอธิบาย + Notebook + Dashboard + สไลด์ + บันทึกบทบาท')\nprint('ครูตรวจคำอธิบายรายบุคคลและบันทึกหลักฐานตามรูบริก')",
      "teachingNotes": "ยอมรับวิธีที่ให้ผลถูกต้องและมีเหตุผล ตรวจคำอธิบายรายบุคคล ข้อสอบกลางภาค/ปลายภาคใช้ฉบับครูแยก"
    }
  },
  {
    "weekId": 15,
    "labNo": 15,
    "title": "สอบปลายภาคและสรุปผลการเรียนรู้",
    "duration": "กิจกรรมประเมินตามแผน 5 ชั่วโมง",
    "totalScore": 20,
    "unit": "หน่วยที่ 8",
    "objective": [
      "แสดงความรู้และการประยุกต์ใช้ตามสมรรถนะรายวิชาได้",
      "ตรวจแฟ้มหลักฐานและสะท้อนการเรียนรู้ได้"
    ],
    "scenario": "ไฟล์: เอกสารที่ครูแจก | ปลายภาค 20 คะแนน: ปรนัย 40 ข้อ 10 คะแนน และอัตนัยสองข้อ 10 คะแนน เวลา 120 นาที",
    "tasks": [
      {
        "step": 1,
        "title": "ส่วน A เตรียมข้อมูลและฝึกตามตัวอย่าง",
        "desc": "แสดงความรู้และการประยุกต์ใช้ตามสมรรถนะรายวิชาได้",
        "codeSnippet": "print(\"ใช้ข้อสอบฉบับผู้เรียนที่ครูแจก และทำรายบุคคล\")"
      },
      {
        "step": 2,
        "title": "ส่วน B ประยุกต์และอธิบาย",
        "desc": "ทำข้อสอบรายบุคคลและเขียน Reflection สามข้อหลังสอบ",
        "codeSnippet": "# เขียนคำตอบของตนเองใน Notebook และระบุเหตุผล"
      },
      {
        "step": 3,
        "title": "ตรวจหลักฐานก่อนส่ง",
        "desc": "กระดาษคำตอบปลายภาคและ Reflection",
        "codeSnippet": "# ตรวจหน่วย ความหมายคอลัมน์ ที่มา และข้อจำกัดก่อนส่ง"
      }
    ],
    "expectedOutput": "กระดาษคำตอบปลายภาคและ Reflection | ประเมินในหมวดเฉพาะ ไม่คิดใบงานซ้ำ",
    "rubric": [
      {
        "item": "ปรนัย 40 ข้อ",
        "score": 10
      },
      {
        "item": "อัตนัยสองข้อ",
        "score": 10
      }
    ],
    "teacherKey": {
      "solutionCode": "# เฉลยสอบอยู่ในคู่มือครู ไม่เผยแพร่ในเว็บผู้เรียน",
      "teachingNotes": "ยอมรับวิธีที่ให้ผลถูกต้องและมีเหตุผล ตรวจคำอธิบายรายบุคคล ข้อสอบกลางภาค/ปลายภาคใช้ฉบับครูแยก"
    }
  }
];
