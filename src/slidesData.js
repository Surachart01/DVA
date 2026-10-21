// Generated from โครงสร้างรายวิชา.json; synchronized teaching edition 2026-10-07
export const weeksData = [
  {
    "weekId": 1,
    "title": "สัปดาห์ที่ 1: ปฐมนิเทศและก้าวแรกกับข้อมูล",
    "unit": "หน่วยที่ 1",
    "slides": [
      {
        "id": "w1-orientation",
        "stepType": "theory",
        "stepBadge": "ปฐมนิเทศ",
        "title": "เรียนอะไร ส่งอะไร และประเมินอย่างไร",
        "subtitle": "15 สัปดาห์ 75 ชั่วโมง | 1-4-3 | ภาคเรียน 2/2569",
        "concept": {
          "analogy": "ใช้ข้อมูลหนึ่งโจทย์ต่อกลุ่มตั้งแต่เก็บข้อมูลจนถึงเสนอการตัดสินใจ",
          "before": {
            "title": "เริ่มจากคำถาม",
            "desc": "เลือกผู้ชมและข้อมูลที่ได้รับอนุญาตให้ใช้",
            "status": "สำรวจพื้นฐานก่อนเรียน"
          },
          "after": {
            "title": "จบด้วยผลงาน",
            "desc": "Notebook + Dashboard + สไลด์ + คำอธิบายรายบุคคล",
            "status": "ตรวจสมรรถนะจากหลักฐาน"
          }
        },
        "keyPoints": [
          "ใบงาน 12 ครั้ง × 2.5 = 30 | กลางภาค 15 | โครงงาน 20 | คุณลักษณะ 15 | ปลายภาค 20",
          "ใช้ AI ช่วยได้ตามข้อตกลงครู ต้องเปิดเผยและอธิบายงานของตนเองได้ ไม่ใช้ในการสอบที่ห้าม",
          "เวลาเรียนบันทึกตามจริง การพิจารณากรณีพิเศษเป็นหน้าที่วิทยาลัย"
        ]
      },
      {
        "stepType": "theory",
        "title": "ปฐมนิเทศและก้าวแรกกับข้อมูล",
        "subtitle": "เป้าหมาย: แยกข้อมูลกับสารสนเทศและระบุคำถามวิเคราะห์ได้",
        "concept": {
          "analogy": "ข้อมูลดิบต้องผ่านคำถาม การตรวจสอบ วิเคราะห์ และสื่อสารก่อนใช้ตัดสินใจ",
          "before": {
            "title": "ก่อนเรียน",
            "desc": "สำรวจพื้นฐานและตั้งคำถามจากข้อมูล",
            "status": "ยังต้องตรวจสอบหลักฐาน"
          },
          "after": {
            "title": "หลักฐานที่ต้องทำได้",
            "desc": "Notebook แสดงข้อมูลและอธิบาย Data/Information พร้อมคำถามกลุ่ม",
            "status": "อธิบายผลและข้อจำกัดด้วยตนเอง"
          }
        },
        "keyPoints": [
          "ข้อมูลดิบต้องผ่านคำถาม การตรวจสอบ วิเคราะห์ และสื่อสารก่อนใช้ตัดสินใจ",
          "วงจรงาน 6 ขั้น กับ Pipeline 4 ขั้นเป็นคนละระดับการอธิบายที่ใช้ร่วมกันได้",
          "เริ่มจากรัน เปลี่ยนค่า และอธิบายผล ไม่ต้องเขียนโปรแกรมยาว"
        ],
        "id": "w1-1",
        "stepBadge": "1. แนวคิด"
      },
      {
        "stepType": "syntax",
        "title": "คำสั่งหรือหลักปฏิบัติสำคัญ",
        "subtitle": "เปิด Colab อ่านตารางและตรวจขนาดได้",
        "syntax": "import pandas as pd",
        "breakdown": [
          {
            "token": "import",
            "role": "ส่วนสำคัญของคำสั่ง",
            "desc": "เริ่มจากรัน เปลี่ยนค่า และอธิบายผล ไม่ต้องเขียนโปรแกรมยาว",
            "color": "text-sky-400"
          }
        ],
        "tip": "ใช้ Notebook W01 แล้วรันจากบนลงล่าง ตรวจหน่วยและความหมายคอลัมน์ก่อนคำนวณ",
        "id": "w1-2",
        "stepBadge": "2. คำสั่ง"
      },
      {
        "stepType": "usage",
        "title": "ตัวอย่างพร้อมใช้ใน Colab",
        "subtitle": "ไฟล์ประกอบ: students.csv",
        "codeSnippet": "import pandas as pd\ndf = pd.read_csv('students.csv')\ndisplay(df.head())\nprint('ขนาด:', df.shape)\nprint('คะแนนเฉลี่ย:', round(df['score'].mean(), 2))\ndisplay(df['major'].value_counts())",
        "outputTable": {
          "headers": [
            "สิ่งที่ตรวจ",
            "หลักฐาน"
          ],
          "rows": [
            [
              "ผลลัพธ์",
              "Notebook แสดงข้อมูลและอธิบาย Data/Information พร้อมคำถามกลุ่ม"
            ],
            [
              "เหตุผล",
              "เปลี่ยนจากคะแนนเฉลี่ยเป็นคะแนนสูงสุด และตั้งคำถามจากข้อมูลอีกหนึ่งข้อ"
            ]
          ]
        },
        "explanation": "ตัวอย่างใช้ชุดข้อมูลฉบับพร้อมสอน วันที่เป็น ค.ศ. และรักษาเบอร์โทรเป็นข้อความ",
        "id": "w1-3",
        "stepBadge": "3. ตัวอย่าง"
      },
      {
        "stepType": "step",
        "title": "กิจกรรมสองวันและจุดที่ต้องตรวจ",
        "subtitle": "วันที่หนึ่ง 3 คาบ วันที่สอง 2 คาบ คาบละ 60 นาที",
        "steps": [
          {
            "num": "1",
            "title": "วันที่หนึ่ง: แนวคิดและส่วน A",
            "desc": "อภิปราย/ความรู้ 60 นาที แล้วทำตัวอย่างและใบงาน 120 นาที"
          },
          {
            "num": "2",
            "title": "วันที่สอง: ส่วน B",
            "desc": "เปลี่ยนจากคะแนนเฉลี่ยเป็นคะแนนสูงสุด และตั้งคำถามจากข้อมูลอีกหนึ่งข้อ"
          },
          {
            "num": "3",
            "title": "ตรวจและส่งหลักฐาน",
            "desc": "Notebook แสดงข้อมูลและอธิบาย Data/Information พร้อมคำถามกลุ่ม"
          }
        ],
        "traps": [
          {
            "error": "FileNotFoundError",
            "cause": "ยังไม่ได้อัปโหลดชุดข้อมูลที่ระบุ",
            "solution": "ดาวน์โหลดไฟล์ในแถบชุดเรียน แล้วอัปโหลดลง Colab"
          },
          {
            "error": "ผลคำนวณไม่ตรงความหมายข้อมูล",
            "cause": "ใช้ราคาต่อหน่วยแทนยอดรวม หรือไม่ตรวจชนิดข้อมูล",
            "solution": "เริ่มจากรัน เปลี่ยนค่า และอธิบายผล ไม่ต้องเขียนโปรแกรมยาว"
          }
        ],
        "id": "w1-4",
        "stepBadge": "4. ขั้นตอน"
      },
      {
        "stepType": "challenge",
        "title": "ตรวจความเข้าใจและต่อยอด",
        "subtitle": "เปลี่ยนจากคะแนนเฉลี่ยเป็นคะแนนสูงสุด และตั้งคำถามจากข้อมูลอีกหนึ่งข้อ",
        "challengeType": "fill_blank",
        "question": "เติมส่วนที่ขาดให้คำสั่งถูกต้อง แล้วอธิบายว่าจะตรวจผลอย่างไร",
        "codeTemplate": "______ pandas as pd",
        "answers": [
          "import"
        ],
        "hints": "ย้อนดูหน้าคำสั่งสำคัญ และตรวจตัวพิมพ์กับวงเล็บ",
        "fullSolution": "import pandas as pd",
        "colabTask": "เปลี่ยนจากคะแนนเฉลี่ยเป็นคะแนนสูงสุด และตั้งคำถามจากข้อมูลอีกหนึ่งข้อ",
        "id": "w1-5",
        "stepBadge": "5. ฝึกและอธิบาย"
      }
    ]
  },
  {
    "weekId": 2,
    "title": "สัปดาห์ที่ 2: Get Data การรวบรวมและนำเข้าข้อมูล",
    "unit": "หน่วยที่ 2",
    "slides": [
      {
        "stepType": "theory",
        "title": "Get Data การรวบรวมและนำเข้าข้อมูล",
        "subtitle": "เป้าหมาย: นำเข้า CSV และ Excel พร้อมระบุที่มาข้อมูลได้",
        "concept": {
          "analogy": "ตรวจเจ้าของข้อมูล ที่มา วันที่ปรับปรุง เงื่อนไขใช้และความหมายคอลัมน์",
          "before": {
            "title": "ก่อนเรียน",
            "desc": "สำรวจพื้นฐานและตั้งคำถามจากข้อมูล",
            "status": "ยังต้องตรวจสอบหลักฐาน"
          },
          "after": {
            "title": "หลักฐานที่ต้องทำได้",
            "desc": "Notebook นำเข้า CSV/Excel และ Data Dictionary/แหล่งข้อมูลกลุ่ม",
            "status": "อธิบายผลและข้อจำกัดด้วยตนเอง"
          }
        },
        "keyPoints": [
          "ตรวจเจ้าของข้อมูล ที่มา วันที่ปรับปรุง เงื่อนไขใช้และความหมายคอลัมน์",
          "CSV เป็นตารางเดียว Excel มีหลายแผ่นงาน ต้องเลือก sheet_name",
          "ไม่เผยแพร่ข้อมูลระบุตัวบุคคลจริงของผู้เรียน"
        ],
        "id": "w2-1",
        "stepBadge": "1. แนวคิด"
      },
      {
        "stepType": "syntax",
        "title": "คำสั่งหรือหลักปฏิบัติสำคัญ",
        "subtitle": "จัดทำ Data Dictionary และเลือกข้อมูลโครงงานได้",
        "syntax": "pd.read_excel('nvc_store_sales.xlsx', sheet_name='Products')",
        "breakdown": [
          {
            "token": "read_excel",
            "role": "ส่วนสำคัญของคำสั่ง",
            "desc": "ไม่เผยแพร่ข้อมูลระบุตัวบุคคลจริงของผู้เรียน",
            "color": "text-sky-400"
          }
        ],
        "tip": "ใช้ Notebook W02 แล้วรันจากบนลงล่าง ตรวจหน่วยและความหมายคอลัมน์ก่อนคำนวณ",
        "id": "w2-2",
        "stepBadge": "2. คำสั่ง"
      },
      {
        "stepType": "usage",
        "title": "ตัวอย่างพร้อมใช้ใน Colab",
        "subtitle": "ไฟล์ประกอบ: students.csv, nvc_store_sales.xlsx",
        "codeSnippet": "import pandas as pd\nstudents = pd.read_csv('students.csv')\nproducts = pd.read_excel('nvc_store_sales.xlsx', sheet_name='Products')\nsales = pd.read_excel('nvc_store_sales.xlsx', sheet_name='Daily_Sales')\nprint(students.shape, products.shape, sales.shape)\ndisplay(products.head())\ndisplay(sales.head())",
        "outputTable": {
          "headers": [
            "สิ่งที่ตรวจ",
            "หลักฐาน"
          ],
          "rows": [
            [
              "ผลลัพธ์",
              "Notebook นำเข้า CSV/Excel และ Data Dictionary/แหล่งข้อมูลกลุ่ม"
            ],
            [
              "เหตุผล",
              "สร้างตารางพจนานุกรมอย่างน้อยห้าคอลัมน์ และระบุผู้ชมกับคำถามของโครงงาน"
            ]
          ]
        },
        "explanation": "ตัวอย่างใช้ชุดข้อมูลฉบับพร้อมสอน วันที่เป็น ค.ศ. และรักษาเบอร์โทรเป็นข้อความ",
        "id": "w2-3",
        "stepBadge": "3. ตัวอย่าง"
      },
      {
        "stepType": "step",
        "title": "กิจกรรมสองวันและจุดที่ต้องตรวจ",
        "subtitle": "วันที่หนึ่ง 3 คาบ วันที่สอง 2 คาบ คาบละ 60 นาที",
        "steps": [
          {
            "num": "1",
            "title": "วันที่หนึ่ง: แนวคิดและส่วน A",
            "desc": "อภิปราย/ความรู้ 60 นาที แล้วทำตัวอย่างและใบงาน 120 นาที"
          },
          {
            "num": "2",
            "title": "วันที่สอง: ส่วน B",
            "desc": "สร้างตารางพจนานุกรมอย่างน้อยห้าคอลัมน์ และระบุผู้ชมกับคำถามของโครงงาน"
          },
          {
            "num": "3",
            "title": "ตรวจและส่งหลักฐาน",
            "desc": "Notebook นำเข้า CSV/Excel และ Data Dictionary/แหล่งข้อมูลกลุ่ม"
          }
        ],
        "traps": [
          {
            "error": "FileNotFoundError",
            "cause": "ยังไม่ได้อัปโหลดชุดข้อมูลที่ระบุ",
            "solution": "ดาวน์โหลดไฟล์ในแถบชุดเรียน แล้วอัปโหลดลง Colab"
          },
          {
            "error": "ผลคำนวณไม่ตรงความหมายข้อมูล",
            "cause": "ใช้ราคาต่อหน่วยแทนยอดรวม หรือไม่ตรวจชนิดข้อมูล",
            "solution": "ไม่เผยแพร่ข้อมูลระบุตัวบุคคลจริงของผู้เรียน"
          }
        ],
        "id": "w2-4",
        "stepBadge": "4. ขั้นตอน"
      },
      {
        "stepType": "challenge",
        "title": "ตรวจความเข้าใจและต่อยอด",
        "subtitle": "สร้างตารางพจนานุกรมอย่างน้อยห้าคอลัมน์ และระบุผู้ชมกับคำถามของโครงงาน",
        "challengeType": "fill_blank",
        "question": "เติมส่วนที่ขาดให้คำสั่งถูกต้อง แล้วอธิบายว่าจะตรวจผลอย่างไร",
        "codeTemplate": "pd.______('nvc_store_sales.xlsx', sheet_name='Products')",
        "answers": [
          "read_excel"
        ],
        "hints": "ย้อนดูหน้าคำสั่งสำคัญ และตรวจตัวพิมพ์กับวงเล็บ",
        "fullSolution": "pd.read_excel('nvc_store_sales.xlsx', sheet_name='Products')",
        "colabTask": "สร้างตารางพจนานุกรมอย่างน้อยห้าคอลัมน์ และระบุผู้ชมกับคำถามของโครงงาน",
        "id": "w2-5",
        "stepBadge": "5. ฝึกและอธิบาย"
      }
    ]
  },
  {
    "weekId": 3,
    "title": "สัปดาห์ที่ 3: ETL ตรวจคุณภาพข้อมูล",
    "unit": "หน่วยที่ 3",
    "slides": [
      {
        "stepType": "theory",
        "title": "ETL ตรวจคุณภาพข้อมูล",
        "subtitle": "เป้าหมาย: ตรวจ Missing Duplicate ช่วงค่าและวันที่ได้",
        "concept": {
          "analogy": "Completeness Accuracy Consistency Timeliness และ Uniqueness",
          "before": {
            "title": "ก่อนเรียน",
            "desc": "สำรวจพื้นฐานและตั้งคำถามจากข้อมูล",
            "status": "ยังต้องตรวจสอบหลักฐาน"
          },
          "after": {
            "title": "หลักฐานที่ต้องทำได้",
            "desc": "Checklist คุณภาพพร้อมจำนวนปัญหาและหลักฐานจากตาราง",
            "status": "อธิบายผลและข้อจำกัดด้วยตนเอง"
          }
        },
        "keyPoints": [
          "Completeness Accuracy Consistency Timeliness และ Uniqueness",
          "Outlier เป็นสัญญาณให้ตรวจ ไม่ใช่คำสั่งให้ลบทันที",
          "phone เป็นข้อความ รักษาเลขศูนย์นำหน้า"
        ],
        "id": "w3-1",
        "stepBadge": "1. แนวคิด"
      },
      {
        "stepType": "syntax",
        "title": "คำสั่งหรือหลักปฏิบัติสำคัญ",
        "subtitle": "แยกปัญหาคุณภาพจากค่าจริงที่พบได้น้อยได้",
        "syntax": "df.isna().sum()",
        "breakdown": [
          {
            "token": "isna",
            "role": "ส่วนสำคัญของคำสั่ง",
            "desc": "phone เป็นข้อความ รักษาเลขศูนย์นำหน้า",
            "color": "text-sky-400"
          }
        ],
        "tip": "ใช้ Notebook W03 แล้วรันจากบนลงล่าง ตรวจหน่วยและความหมายคอลัมน์ก่อนคำนวณ",
        "id": "w3-2",
        "stepBadge": "2. คำสั่ง"
      },
      {
        "stepType": "usage",
        "title": "ตัวอย่างพร้อมใช้ใน Colab",
        "subtitle": "ไฟล์ประกอบ: student_register_dirty.csv",
        "codeSnippet": "import pandas as pd\ndf = pd.read_csv('student_register_dirty.csv', dtype={'phone': 'string'})\ndf.info()\ndisplay(df.isna().sum())\nprint('แถวซ้ำทั้งแถว:', int(df.duplicated().sum()))\ndisplay(df.loc[(df['age'] < 15) | (df['age'] > 60)])\ndisplay(df.loc[(df['gpa'] < 0) | (df['gpa'] > 4)])\nprint('วันที่ไม่ผ่าน:', pd.to_datetime(df['updated_date'], errors='coerce').isna().sum())",
        "outputTable": {
          "headers": [
            "สิ่งที่ตรวจ",
            "หลักฐาน"
          ],
          "rows": [
            [
              "ผลลัพธ์",
              "Checklist คุณภาพพร้อมจำนวนปัญหาและหลักฐานจากตาราง"
            ],
            [
              "เหตุผล",
              "กำหนดกฎตรวจที่อิงความหมายข้อมูลสามข้อ และระบุว่าปัญหาใดต้องถามเจ้าของข้อมูล"
            ]
          ]
        },
        "explanation": "ตัวอย่างใช้ชุดข้อมูลฉบับพร้อมสอน วันที่เป็น ค.ศ. และรักษาเบอร์โทรเป็นข้อความ",
        "id": "w3-3",
        "stepBadge": "3. ตัวอย่าง"
      },
      {
        "stepType": "step",
        "title": "กิจกรรมสองวันและจุดที่ต้องตรวจ",
        "subtitle": "วันที่หนึ่ง 3 คาบ วันที่สอง 2 คาบ คาบละ 60 นาที",
        "steps": [
          {
            "num": "1",
            "title": "วันที่หนึ่ง: แนวคิดและส่วน A",
            "desc": "อภิปราย/ความรู้ 60 นาที แล้วทำตัวอย่างและใบงาน 120 นาที"
          },
          {
            "num": "2",
            "title": "วันที่สอง: ส่วน B",
            "desc": "กำหนดกฎตรวจที่อิงความหมายข้อมูลสามข้อ และระบุว่าปัญหาใดต้องถามเจ้าของข้อมูล"
          },
          {
            "num": "3",
            "title": "ตรวจและส่งหลักฐาน",
            "desc": "Checklist คุณภาพพร้อมจำนวนปัญหาและหลักฐานจากตาราง"
          }
        ],
        "traps": [
          {
            "error": "FileNotFoundError",
            "cause": "ยังไม่ได้อัปโหลดชุดข้อมูลที่ระบุ",
            "solution": "ดาวน์โหลดไฟล์ในแถบชุดเรียน แล้วอัปโหลดลง Colab"
          },
          {
            "error": "ผลคำนวณไม่ตรงความหมายข้อมูล",
            "cause": "ใช้ราคาต่อหน่วยแทนยอดรวม หรือไม่ตรวจชนิดข้อมูล",
            "solution": "phone เป็นข้อความ รักษาเลขศูนย์นำหน้า"
          }
        ],
        "id": "w3-4",
        "stepBadge": "4. ขั้นตอน"
      },
      {
        "stepType": "challenge",
        "title": "ตรวจความเข้าใจและต่อยอด",
        "subtitle": "กำหนดกฎตรวจที่อิงความหมายข้อมูลสามข้อ และระบุว่าปัญหาใดต้องถามเจ้าของข้อมูล",
        "challengeType": "fill_blank",
        "question": "เติมส่วนที่ขาดให้คำสั่งถูกต้อง แล้วอธิบายว่าจะตรวจผลอย่างไร",
        "codeTemplate": "df.______().sum()",
        "answers": [
          "isna"
        ],
        "hints": "ย้อนดูหน้าคำสั่งสำคัญ และตรวจตัวพิมพ์กับวงเล็บ",
        "fullSolution": "df.isna().sum()",
        "colabTask": "กำหนดกฎตรวจที่อิงความหมายข้อมูลสามข้อ และระบุว่าปัญหาใดต้องถามเจ้าของข้อมูล",
        "id": "w3-5",
        "stepBadge": "5. ฝึกและอธิบาย"
      }
    ]
  },
  {
    "weekId": 4,
    "title": "สัปดาห์ที่ 4: ETL รายงานผลการตรวจสอบคุณภาพข้อมูล",
    "unit": "หน่วยที่ 3",
    "slides": [
      {
        "stepType": "theory",
        "title": "ETL รายงานผลการตรวจสอบคุณภาพข้อมูล",
        "subtitle": "เป้าหมาย: คำนวณจำนวนและร้อยละปัญหาได้",
        "concept": {
          "analogy": "รายงานมีข้อมูลทั่วไป ความหมายคอลัมน์ ผลตรวจ แนวทางแก้ และบทสรุปผู้บริหาร",
          "before": {
            "title": "ก่อนเรียน",
            "desc": "สำรวจพื้นฐานและตั้งคำถามจากข้อมูล",
            "status": "ยังต้องตรวจสอบหลักฐาน"
          },
          "after": {
            "title": "หลักฐานที่ต้องทำได้",
            "desc": "Data Quality Report ห้าส่วนของชุดข้อมูลฝึกและชุดข้อมูลกลุ่ม",
            "status": "อธิบายผลและข้อจำกัดด้วยตนเอง"
          }
        },
        "keyPoints": [
          "รายงานมีข้อมูลทั่วไป ความหมายคอลัมน์ ผลตรวจ แนวทางแก้ และบทสรุปผู้บริหาร",
          "ระบุทั้งจำนวน ร้อยละ ตัวหาร และข้อจำกัด",
          "ร้อยละหลายปัญหาอาจซ้อนกัน ห้ามบวกเป็นจำนวนคนทันที"
        ],
        "id": "w4-1",
        "stepBadge": "1. แนวคิด"
      },
      {
        "stepType": "syntax",
        "title": "คำสั่งหรือหลักปฏิบัติสำคัญ",
        "subtitle": "เขียนรายงานคุณภาพห้าส่วนพร้อมข้อเสนอแนะได้",
        "syntax": "df.isna().mean() * 100",
        "breakdown": [
          {
            "token": "mean",
            "role": "ส่วนสำคัญของคำสั่ง",
            "desc": "ร้อยละหลายปัญหาอาจซ้อนกัน ห้ามบวกเป็นจำนวนคนทันที",
            "color": "text-sky-400"
          }
        ],
        "tip": "ใช้ Notebook W04 แล้วรันจากบนลงล่าง ตรวจหน่วยและความหมายคอลัมน์ก่อนคำนวณ",
        "id": "w4-2",
        "stepBadge": "2. คำสั่ง"
      },
      {
        "stepType": "usage",
        "title": "ตัวอย่างพร้อมใช้ใน Colab",
        "subtitle": "ไฟล์ประกอบ: student_register_dirty.csv",
        "codeSnippet": "import pandas as pd\ndf = pd.read_csv('student_register_dirty.csv', dtype={'phone': 'string'})\nquality = pd.DataFrame({'missing_count': df.isna().sum(), 'missing_percent': df.isna().mean()*100})\ndisplay(quality.round(2))\nprint('จำนวนทั้งหมด:', len(df), 'แถวซ้ำ:', df.duplicated().sum())\nprint('อายุผิดช่วง:', (~df['age'].between(15,60) & df['age'].notna()).sum())\nprint('GPA ผิดช่วง:', (~df['gpa'].between(0,4) & df['gpa'].notna()).sum())\nquality.to_csv('quality_report.csv', encoding='utf-8-sig')",
        "outputTable": {
          "headers": [
            "สิ่งที่ตรวจ",
            "หลักฐาน"
          ],
          "rows": [
            [
              "ผลลัพธ์",
              "Data Quality Report ห้าส่วนของชุดข้อมูลฝึกและชุดข้อมูลกลุ่ม"
            ],
            [
              "เหตุผล",
              "จัดลำดับปัญหาตามผลกระทบและเขียนสรุปผู้บริหารไม่เกินห้าประโยค"
            ]
          ]
        },
        "explanation": "ตัวอย่างใช้ชุดข้อมูลฉบับพร้อมสอน วันที่เป็น ค.ศ. และรักษาเบอร์โทรเป็นข้อความ",
        "id": "w4-3",
        "stepBadge": "3. ตัวอย่าง"
      },
      {
        "stepType": "step",
        "title": "กิจกรรมสองวันและจุดที่ต้องตรวจ",
        "subtitle": "วันที่หนึ่ง 3 คาบ วันที่สอง 2 คาบ คาบละ 60 นาที",
        "steps": [
          {
            "num": "1",
            "title": "วันที่หนึ่ง: แนวคิดและส่วน A",
            "desc": "อภิปราย/ความรู้ 60 นาที แล้วทำตัวอย่างและใบงาน 120 นาที"
          },
          {
            "num": "2",
            "title": "วันที่สอง: ส่วน B",
            "desc": "จัดลำดับปัญหาตามผลกระทบและเขียนสรุปผู้บริหารไม่เกินห้าประโยค"
          },
          {
            "num": "3",
            "title": "ตรวจและส่งหลักฐาน",
            "desc": "Data Quality Report ห้าส่วนของชุดข้อมูลฝึกและชุดข้อมูลกลุ่ม"
          }
        ],
        "traps": [
          {
            "error": "FileNotFoundError",
            "cause": "ยังไม่ได้อัปโหลดชุดข้อมูลที่ระบุ",
            "solution": "ดาวน์โหลดไฟล์ในแถบชุดเรียน แล้วอัปโหลดลง Colab"
          },
          {
            "error": "ผลคำนวณไม่ตรงความหมายข้อมูล",
            "cause": "ใช้ราคาต่อหน่วยแทนยอดรวม หรือไม่ตรวจชนิดข้อมูล",
            "solution": "ร้อยละหลายปัญหาอาจซ้อนกัน ห้ามบวกเป็นจำนวนคนทันที"
          }
        ],
        "id": "w4-4",
        "stepBadge": "4. ขั้นตอน"
      },
      {
        "stepType": "challenge",
        "title": "ตรวจความเข้าใจและต่อยอด",
        "subtitle": "จัดลำดับปัญหาตามผลกระทบและเขียนสรุปผู้บริหารไม่เกินห้าประโยค",
        "challengeType": "fill_blank",
        "question": "เติมส่วนที่ขาดให้คำสั่งถูกต้อง แล้วอธิบายว่าจะตรวจผลอย่างไร",
        "codeTemplate": "df.isna().______() * 100",
        "answers": [
          "mean"
        ],
        "hints": "ย้อนดูหน้าคำสั่งสำคัญ และตรวจตัวพิมพ์กับวงเล็บ",
        "fullSolution": "df.isna().mean() * 100",
        "colabTask": "จัดลำดับปัญหาตามผลกระทบและเขียนสรุปผู้บริหารไม่เกินห้าประโยค",
        "id": "w4-5",
        "stepBadge": "5. ฝึกและอธิบาย"
      }
    ]
  },
  {
    "weekId": 5,
    "title": "สัปดาห์ที่ 5: ETL ทำความสะอาดและลดความเสี่ยงข้อมูล",
    "unit": "หน่วยที่ 3",
    "slides": [
      {
        "stepType": "theory",
        "title": "ETL ทำความสะอาดและลดความเสี่ยงข้อมูล",
        "subtitle": "เป้าหมาย: เลือกวิธี Cleaning และบันทึกเหตุผลได้",
        "concept": {
          "analogy": "ค่าว่างและค่าผิดช่วงต้องเลือกวิธีตามบริบทพร้อมบันทึกการเปลี่ยน",
          "before": {
            "title": "ก่อนเรียน",
            "desc": "สำรวจพื้นฐานและตั้งคำถามจากข้อมูล",
            "status": "ยังต้องตรวจสอบหลักฐาน"
          },
          "after": {
            "title": "หลักฐานที่ต้องทำได้",
            "desc": "Clean Dataset, Cleaning Log และรายการตรวจความเสี่ยงก่อนเผยแพร่",
            "status": "อธิบายผลและข้อจำกัดด้วยตนเอง"
          }
        },
        "keyPoints": [
          "ค่าว่างและค่าผิดช่วงต้องเลือกวิธีตามบริบทพร้อมบันทึกการเปลี่ยน",
          "Masking ช่วยลดความเสี่ยง แต่ยังอาจระบุตัวบุคคลได้ ไม่เท่ากับทำตามกฎหมายครบทุกข้อ",
          "ใช้ชุดข้อมูลสมมติ จำกัดสิทธิ์ และเผยแพร่เฉพาะข้อมูลที่จำเป็น"
        ],
        "id": "w5-1",
        "stepBadge": "1. แนวคิด"
      },
      {
        "stepType": "syntax",
        "title": "คำสั่งหรือหลักปฏิบัติสำคัญ",
        "subtitle": "สร้างข้อมูลเผยแพร่โดยลดข้อมูลระบุตัวบุคคลได้",
        "syntax": "pd.read_csv('student_register_dirty.csv', dtype={'phone':'string'})",
        "breakdown": [
          {
            "token": "string",
            "role": "ส่วนสำคัญของคำสั่ง",
            "desc": "ใช้ชุดข้อมูลสมมติ จำกัดสิทธิ์ และเผยแพร่เฉพาะข้อมูลที่จำเป็น",
            "color": "text-sky-400"
          }
        ],
        "tip": "ใช้ Notebook W05 แล้วรันจากบนลงล่าง ตรวจหน่วยและความหมายคอลัมน์ก่อนคำนวณ",
        "id": "w5-2",
        "stepBadge": "2. คำสั่ง"
      },
      {
        "stepType": "usage",
        "title": "ตัวอย่างพร้อมใช้ใน Colab",
        "subtitle": "ไฟล์ประกอบ: student_register_dirty.csv",
        "codeSnippet": "import pandas as pd\ndf = pd.read_csv('student_register_dirty.csv', dtype={'phone': 'string'})\nclean = df.drop_duplicates().copy()\nclean['major'] = clean['major'].str.strip().replace({'IT':'เทคโนโลยีสารสนเทศ','เทคโนโลยี สารสนเทศ':'เทคโนโลยีสารสนเทศ'}).fillna('ไม่ระบุ')\nfor col, lo, hi in [('age',15,60),('gpa',0,4)]:\n    clean[col] = pd.to_numeric(clean[col], errors='coerce')\n    clean.loc[~clean[col].between(lo,hi),col] = float('nan')\n    clean[col] = clean[col].fillna(clean[col].median())\nclean['updated_date'] = pd.to_datetime(clean['updated_date'], errors='coerce')\n# ตัวอย่าง Masking ในข้อมูลสำหรับครู ไม่ใช้เป็นหลักฐานว่าข้อมูลไม่ระบุตัวบุคคล\nclean['phone_masked'] = clean['phone'].str.replace(r'\\d{4}$', 'xxxx', regex=True)\n# ข้อมูลเผยแพร่สำหรับฝึก: ตัดตัวระบุโดยตรงออก และตรวจความเสี่ยงซ้ำก่อนแชร์\npublic = clean.drop(columns=['phone','name','student_id','phone_masked'])\npublic.to_csv('clean_public.csv', index=False, encoding='utf-8-sig')\nprint('ก่อน/หลัง:', len(df), len(clean))\ndisplay(public.head())",
        "outputTable": {
          "headers": [
            "สิ่งที่ตรวจ",
            "หลักฐาน"
          ],
          "rows": [
            [
              "ผลลัพธ์",
              "Clean Dataset, Cleaning Log และรายการตรวจความเสี่ยงก่อนเผยแพร่"
            ],
            [
              "เหตุผล",
              "เปรียบเทียบ Mean กับ Median และเขียน Cleaning Log ว่าเปลี่ยนค่าใดด้วยเหตุผลอะไร"
            ]
          ]
        },
        "explanation": "ตัวอย่างใช้ชุดข้อมูลฉบับพร้อมสอน วันที่เป็น ค.ศ. และรักษาเบอร์โทรเป็นข้อความ",
        "id": "w5-3",
        "stepBadge": "3. ตัวอย่าง"
      },
      {
        "stepType": "step",
        "title": "กิจกรรมสองวันและจุดที่ต้องตรวจ",
        "subtitle": "วันที่หนึ่ง 3 คาบ วันที่สอง 2 คาบ คาบละ 60 นาที",
        "steps": [
          {
            "num": "1",
            "title": "วันที่หนึ่ง: แนวคิดและส่วน A",
            "desc": "อภิปราย/ความรู้ 60 นาที แล้วทำตัวอย่างและใบงาน 120 นาที"
          },
          {
            "num": "2",
            "title": "วันที่สอง: ส่วน B",
            "desc": "เปรียบเทียบ Mean กับ Median และเขียน Cleaning Log ว่าเปลี่ยนค่าใดด้วยเหตุผลอะไร"
          },
          {
            "num": "3",
            "title": "ตรวจและส่งหลักฐาน",
            "desc": "Clean Dataset, Cleaning Log และรายการตรวจความเสี่ยงก่อนเผยแพร่"
          }
        ],
        "traps": [
          {
            "error": "FileNotFoundError",
            "cause": "ยังไม่ได้อัปโหลดชุดข้อมูลที่ระบุ",
            "solution": "ดาวน์โหลดไฟล์ในแถบชุดเรียน แล้วอัปโหลดลง Colab"
          },
          {
            "error": "ผลคำนวณไม่ตรงความหมายข้อมูล",
            "cause": "ใช้ราคาต่อหน่วยแทนยอดรวม หรือไม่ตรวจชนิดข้อมูล",
            "solution": "ใช้ชุดข้อมูลสมมติ จำกัดสิทธิ์ และเผยแพร่เฉพาะข้อมูลที่จำเป็น"
          }
        ],
        "id": "w5-4",
        "stepBadge": "4. ขั้นตอน"
      },
      {
        "stepType": "challenge",
        "title": "ตรวจความเข้าใจและต่อยอด",
        "subtitle": "เปรียบเทียบ Mean กับ Median และเขียน Cleaning Log ว่าเปลี่ยนค่าใดด้วยเหตุผลอะไร",
        "challengeType": "fill_blank",
        "question": "เติมส่วนที่ขาดให้คำสั่งถูกต้อง แล้วอธิบายว่าจะตรวจผลอย่างไร",
        "codeTemplate": "pd.read_csv('student_register_dirty.csv', dtype={'phone':'______'})",
        "answers": [
          "string"
        ],
        "hints": "ย้อนดูหน้าคำสั่งสำคัญ และตรวจตัวพิมพ์กับวงเล็บ",
        "fullSolution": "pd.read_csv('student_register_dirty.csv', dtype={'phone':'string'})",
        "colabTask": "เปรียบเทียบ Mean กับ Median และเขียน Cleaning Log ว่าเปลี่ยนค่าใดด้วยเหตุผลอะไร",
        "id": "w5-5",
        "stepBadge": "5. ฝึกและอธิบาย"
      }
    ]
  },
  {
    "weekId": 6,
    "title": "สัปดาห์ที่ 6: Data Model โครงสร้างและการเชื่อมโยงตาราง",
    "unit": "หน่วยที่ 4",
    "slides": [
      {
        "stepType": "theory",
        "title": "Data Model โครงสร้างและการเชื่อมโยงตาราง",
        "subtitle": "เป้าหมาย: แยก Fact/Dimension และ Primary/Foreign Key ได้",
        "concept": {
          "analogy": "Products เป็น Dimension ยอดขายเป็น Fact ตามระดับรายละเอียดของหนึ่งแถว",
          "before": {
            "title": "ก่อนเรียน",
            "desc": "สำรวจพื้นฐานและตั้งคำถามจากข้อมูล",
            "status": "ยังต้องตรวจสอบหลักฐาน"
          },
          "after": {
            "title": "หลักฐานที่ต้องทำได้",
            "desc": "แผนภาพความสัมพันธ์ตารางและ Notebook Merge พร้อมตรวจคุณภาพหลังเชื่อม",
            "status": "อธิบายผลและข้อจำกัดด้วยตนเอง"
          }
        },
        "keyPoints": [
          "Products เป็น Dimension ยอดขายเป็น Fact ตามระดับรายละเอียดของหนึ่งแถว",
          "กำหนด grain ก่อนคำนวณ: ในชุดนี้ order_id เป็นรหัสรายการที่ไม่ซ้ำ",
          "Left Join รักษาแถวขาย และ validate ตรวจความสัมพันธ์"
        ],
        "id": "w6-1",
        "stepBadge": "1. แนวคิด"
      },
      {
        "stepType": "syntax",
        "title": "คำสั่งหรือหลักปฏิบัติสำคัญ",
        "subtitle": "ใช้ Left Join และตรวจรหัสที่เชื่อมไม่สำเร็จได้",
        "syntax": "sales.merge(products, on='product_id', how='left', validate='many_to_one')",
        "breakdown": [
          {
            "token": "merge",
            "role": "ส่วนสำคัญของคำสั่ง",
            "desc": "Left Join รักษาแถวขาย และ validate ตรวจความสัมพันธ์",
            "color": "text-sky-400"
          }
        ],
        "tip": "ใช้ Notebook W06 แล้วรันจากบนลงล่าง ตรวจหน่วยและความหมายคอลัมน์ก่อนคำนวณ",
        "id": "w6-2",
        "stepBadge": "2. คำสั่ง"
      },
      {
        "stepType": "usage",
        "title": "ตัวอย่างพร้อมใช้ใน Colab",
        "subtitle": "ไฟล์ประกอบ: nvc_store_sales.xlsx",
        "codeSnippet": "import pandas as pd\nproducts = pd.read_excel('nvc_store_sales.xlsx', sheet_name='Products')\nsales = pd.read_excel('nvc_store_sales.xlsx', sheet_name='Daily_Sales')\nassert products['product_id'].is_unique\nmerged = sales.merge(products, on='product_id', how='left', validate='many_to_one', indicator=True)\ndisplay(merged.head())\nprint('รหัสเชื่อมไม่สำเร็จ:', (merged['_merge']=='left_only').sum())\nmerged['total_amount'] = merged['quantity'] * merged['selling_price']\nmerged['total_profit'] = merged['quantity'] * (merged['selling_price']-merged['cost_price'])",
        "outputTable": {
          "headers": [
            "สิ่งที่ตรวจ",
            "หลักฐาน"
          ],
          "rows": [
            [
              "ผลลัพธ์",
              "แผนภาพความสัมพันธ์ตารางและ Notebook Merge พร้อมตรวจคุณภาพหลังเชื่อม"
            ],
            [
              "เหตุผล",
              "เพิ่มรหัสสินค้า P999 แล้วเปรียบเทียบ Inner กับ Left Join โดยไม่คิดยอดที่ราคายังไม่ทราบ"
            ]
          ]
        },
        "explanation": "ตัวอย่างใช้ชุดข้อมูลฉบับพร้อมสอน วันที่เป็น ค.ศ. และรักษาเบอร์โทรเป็นข้อความ",
        "id": "w6-3",
        "stepBadge": "3. ตัวอย่าง"
      },
      {
        "stepType": "step",
        "title": "กิจกรรมสองวันและจุดที่ต้องตรวจ",
        "subtitle": "วันที่หนึ่ง 3 คาบ วันที่สอง 2 คาบ คาบละ 60 นาที",
        "steps": [
          {
            "num": "1",
            "title": "วันที่หนึ่ง: แนวคิดและส่วน A",
            "desc": "อภิปราย/ความรู้ 60 นาที แล้วทำตัวอย่างและใบงาน 120 นาที"
          },
          {
            "num": "2",
            "title": "วันที่สอง: ส่วน B",
            "desc": "เพิ่มรหัสสินค้า P999 แล้วเปรียบเทียบ Inner กับ Left Join โดยไม่คิดยอดที่ราคายังไม่ทราบ"
          },
          {
            "num": "3",
            "title": "ตรวจและส่งหลักฐาน",
            "desc": "แผนภาพความสัมพันธ์ตารางและ Notebook Merge พร้อมตรวจคุณภาพหลังเชื่อม"
          }
        ],
        "traps": [
          {
            "error": "FileNotFoundError",
            "cause": "ยังไม่ได้อัปโหลดชุดข้อมูลที่ระบุ",
            "solution": "ดาวน์โหลดไฟล์ในแถบชุดเรียน แล้วอัปโหลดลง Colab"
          },
          {
            "error": "ผลคำนวณไม่ตรงความหมายข้อมูล",
            "cause": "ใช้ราคาต่อหน่วยแทนยอดรวม หรือไม่ตรวจชนิดข้อมูล",
            "solution": "Left Join รักษาแถวขาย และ validate ตรวจความสัมพันธ์"
          }
        ],
        "id": "w6-4",
        "stepBadge": "4. ขั้นตอน"
      },
      {
        "stepType": "challenge",
        "title": "ตรวจความเข้าใจและต่อยอด",
        "subtitle": "เพิ่มรหัสสินค้า P999 แล้วเปรียบเทียบ Inner กับ Left Join โดยไม่คิดยอดที่ราคายังไม่ทราบ",
        "challengeType": "fill_blank",
        "question": "เติมส่วนที่ขาดให้คำสั่งถูกต้อง แล้วอธิบายว่าจะตรวจผลอย่างไร",
        "codeTemplate": "sales.______(products, on='product_id', how='left', validate='many_to_one')",
        "answers": [
          "merge"
        ],
        "hints": "ย้อนดูหน้าคำสั่งสำคัญ และตรวจตัวพิมพ์กับวงเล็บ",
        "fullSolution": "sales.merge(products, on='product_id', how='left', validate='many_to_one')",
        "colabTask": "เพิ่มรหัสสินค้า P999 แล้วเปรียบเทียบ Inner กับ Left Join โดยไม่คิดยอดที่ราคายังไม่ทราบ",
        "id": "w6-5",
        "stepBadge": "5. ฝึกและอธิบาย"
      }
    ]
  },
  {
    "weekId": 7,
    "title": "สัปดาห์ที่ 7: Data Model สถิติ ตัวชี้วัด และ GroupBy",
    "unit": "หน่วยที่ 4",
    "slides": [
      {
        "stepType": "theory",
        "title": "Data Model สถิติ ตัวชี้วัด และ GroupBy",
        "subtitle": "เป้าหมาย: คำนวณยอดขาย กำไร และ KPI พร้อมระบุหน่วยได้",
        "concept": {
          "analogy": "แยกยอดเงินรวม จำนวนรายการ จำนวนหน่วย และมูลค่าต่อรายการ",
          "before": {
            "title": "ก่อนเรียน",
            "desc": "สำรวจพื้นฐานและตั้งคำถามจากข้อมูล",
            "status": "ยังต้องตรวจสอบหลักฐาน"
          },
          "after": {
            "title": "หลักฐานที่ต้องทำได้",
            "desc": "ตาราง KPI พร้อมสูตร หน่วย ตัวหาร และข้อเสนอแนะจากข้อมูล",
            "status": "อธิบายผลและข้อจำกัดด้วยตนเอง"
          }
        },
        "keyPoints": [
          "แยกยอดเงินรวม จำนวนรายการ จำนวนหน่วย และมูลค่าต่อรายการ",
          "ถ้าหนึ่งบิลมีหลายแถวต้องรวมระดับบิลก่อนหาค่าเฉลี่ย",
          "Insight ต้องอ้างตัวเลขพร้อมข้อจำกัด"
        ],
        "id": "w7-1",
        "stepBadge": "1. แนวคิด"
      },
      {
        "stepType": "syntax",
        "title": "คำสั่งหรือหลักปฏิบัติสำคัญ",
        "subtitle": "สรุป GroupBy/Pivot และแปลผลเพื่อตอบคำถามได้",
        "syntax": "merged.groupby('category')['total_amount'].sum()",
        "breakdown": [
          {
            "token": "groupby",
            "role": "ส่วนสำคัญของคำสั่ง",
            "desc": "Insight ต้องอ้างตัวเลขพร้อมข้อจำกัด",
            "color": "text-sky-400"
          }
        ],
        "tip": "ใช้ Notebook W07 แล้วรันจากบนลงล่าง ตรวจหน่วยและความหมายคอลัมน์ก่อนคำนวณ",
        "id": "w7-2",
        "stepBadge": "2. คำสั่ง"
      },
      {
        "stepType": "usage",
        "title": "ตัวอย่างพร้อมใช้ใน Colab",
        "subtitle": "ไฟล์ประกอบ: nvc_store_sales.xlsx",
        "codeSnippet": "import pandas as pd\nproducts = pd.read_excel('nvc_store_sales.xlsx', sheet_name='Products')\nsales = pd.read_excel('nvc_store_sales.xlsx', sheet_name='Daily_Sales')\nmerged = sales.merge(products,on='product_id',how='left',validate='many_to_one')\nmerged['total_amount'] = merged.quantity*merged.selling_price\nmerged['total_profit'] = merged.quantity*(merged.selling_price-merged.cost_price)\nprint('ยอดขาย:', merged.total_amount.sum(), 'กำไร:', merged.total_profit.sum())\nprint('เฉลี่ยต่อรายการ:', merged.groupby('order_id').total_amount.sum().mean())\ndisplay(merged.groupby('category')[['total_amount','total_profit']].sum())\ndisplay(merged.pivot_table(index='sale_date',columns='category',values='total_amount',aggfunc='sum',fill_value=0))",
        "outputTable": {
          "headers": [
            "สิ่งที่ตรวจ",
            "หลักฐาน"
          ],
          "rows": [
            [
              "ผลลัพธ์",
              "ตาราง KPI พร้อมสูตร หน่วย ตัวหาร และข้อเสนอแนะจากข้อมูล"
            ],
            [
              "เหตุผล",
              "เลือก KPI สามตัวที่ตอบคำถามของกลุ่ม และอธิบายว่าทำไมไม่นับจำนวนแถวเป็นจำนวนลูกค้า"
            ]
          ]
        },
        "explanation": "ตัวอย่างใช้ชุดข้อมูลฉบับพร้อมสอน วันที่เป็น ค.ศ. และรักษาเบอร์โทรเป็นข้อความ",
        "id": "w7-3",
        "stepBadge": "3. ตัวอย่าง"
      },
      {
        "stepType": "step",
        "title": "กิจกรรมสองวันและจุดที่ต้องตรวจ",
        "subtitle": "วันที่หนึ่ง 3 คาบ วันที่สอง 2 คาบ คาบละ 60 นาที",
        "steps": [
          {
            "num": "1",
            "title": "วันที่หนึ่ง: แนวคิดและส่วน A",
            "desc": "อภิปราย/ความรู้ 60 นาที แล้วทำตัวอย่างและใบงาน 120 นาที"
          },
          {
            "num": "2",
            "title": "วันที่สอง: ส่วน B",
            "desc": "เลือก KPI สามตัวที่ตอบคำถามของกลุ่ม และอธิบายว่าทำไมไม่นับจำนวนแถวเป็นจำนวนลูกค้า"
          },
          {
            "num": "3",
            "title": "ตรวจและส่งหลักฐาน",
            "desc": "ตาราง KPI พร้อมสูตร หน่วย ตัวหาร และข้อเสนอแนะจากข้อมูล"
          }
        ],
        "traps": [
          {
            "error": "FileNotFoundError",
            "cause": "ยังไม่ได้อัปโหลดชุดข้อมูลที่ระบุ",
            "solution": "ดาวน์โหลดไฟล์ในแถบชุดเรียน แล้วอัปโหลดลง Colab"
          },
          {
            "error": "ผลคำนวณไม่ตรงความหมายข้อมูล",
            "cause": "ใช้ราคาต่อหน่วยแทนยอดรวม หรือไม่ตรวจชนิดข้อมูล",
            "solution": "Insight ต้องอ้างตัวเลขพร้อมข้อจำกัด"
          }
        ],
        "id": "w7-4",
        "stepBadge": "4. ขั้นตอน"
      },
      {
        "stepType": "challenge",
        "title": "ตรวจความเข้าใจและต่อยอด",
        "subtitle": "เลือก KPI สามตัวที่ตอบคำถามของกลุ่ม และอธิบายว่าทำไมไม่นับจำนวนแถวเป็นจำนวนลูกค้า",
        "challengeType": "fill_blank",
        "question": "เติมส่วนที่ขาดให้คำสั่งถูกต้อง แล้วอธิบายว่าจะตรวจผลอย่างไร",
        "codeTemplate": "merged.______('category')['total_amount'].sum()",
        "answers": [
          "groupby"
        ],
        "hints": "ย้อนดูหน้าคำสั่งสำคัญ และตรวจตัวพิมพ์กับวงเล็บ",
        "fullSolution": "merged.groupby('category')['total_amount'].sum()",
        "colabTask": "เลือก KPI สามตัวที่ตอบคำถามของกลุ่ม และอธิบายว่าทำไมไม่นับจำนวนแถวเป็นจำนวนลูกค้า",
        "id": "w7-5",
        "stepBadge": "5. ฝึกและอธิบาย"
      }
    ]
  },
  {
    "weekId": 8,
    "title": "สัปดาห์ที่ 8: สอบกลางภาคและประเมินสมรรถนะ",
    "unit": "หน่วยที่ 8",
    "slides": [
      {
        "stepType": "theory",
        "title": "สอบกลางภาคและประเมินสมรรถนะ",
        "subtitle": "เป้าหมาย: นำเข้า ตรวจ ทำความสะอาด เชื่อม และคำนวณข้อมูลรายบุคคลได้",
        "concept": {
          "analogy": "กลางภาค 15 คะแนน: ความรู้ 5 และปฏิบัติ 10",
          "before": {
            "title": "ก่อนเรียน",
            "desc": "สำรวจพื้นฐานและตั้งคำถามจากข้อมูล",
            "status": "ยังต้องตรวจสอบหลักฐาน"
          },
          "after": {
            "title": "หลักฐานที่ต้องทำได้",
            "desc": "ข้อสอบความรู้และ Notebook สอบกลางภาครายบุคคล",
            "status": "อธิบายผลและข้อจำกัดด้วยตนเอง"
          }
        },
        "keyPoints": [
          "กลางภาค 15 คะแนน: ความรู้ 5 และปฏิบัติ 10",
          "ใช้ข้อมูลสมมติ ขอบเขตสัปดาห์ 1–7 อธิบายวิธีคิดด้วยตนเอง",
          "หลังสอบให้ผลย้อนกลับรายจุดและกิจกรรมซ่อมเสริม"
        ],
        "id": "w8-1",
        "stepBadge": "1. แนวคิด"
      },
      {
        "stepType": "syntax",
        "title": "คำสั่งหรือหลักปฏิบัติสำคัญ",
        "subtitle": "นำเข้า ตรวจ ทำความสะอาด เชื่อม และคำนวณข้อมูลรายบุคคลได้",
        "syntax": "print(\"อ่านคำชี้แจงก่อนสอบ\")",
        "breakdown": [
          {
            "token": "print",
            "role": "ส่วนสำคัญของคำสั่ง",
            "desc": "หลังสอบให้ผลย้อนกลับรายจุดและกิจกรรมซ่อมเสริม",
            "color": "text-sky-400"
          }
        ],
        "tip": "ใช้ Notebook W08 แล้วรันจากบนลงล่าง ตรวจหน่วยและความหมายคอลัมน์ก่อนคำนวณ",
        "id": "w8-2",
        "stepBadge": "2. คำสั่ง"
      },
      {
        "stepType": "usage",
        "title": "ตัวอย่างพร้อมใช้ใน Colab",
        "subtitle": "ไฟล์ประกอบ: midterm_sales.csv, midterm_products.csv",
        "codeSnippet": "print(\"ใช้ข้อสอบฉบับผู้เรียนที่ครูแจก และทำรายบุคคล\")",
        "outputTable": {
          "headers": [
            "สิ่งที่ตรวจ",
            "หลักฐาน"
          ],
          "rows": [
            [
              "ผลลัพธ์",
              "ข้อสอบความรู้และ Notebook สอบกลางภาครายบุคคล"
            ],
            [
              "เหตุผล",
              "ปฏิบัติรายบุคคล: นำเข้า ตรวจปัญหา Cleaning Merge KPI ตามรูบริก และตอบข้อเขียนสั้นห้าข้อ"
            ]
          ]
        },
        "explanation": "ตัวอย่างใช้ชุดข้อมูลฉบับพร้อมสอน วันที่เป็น ค.ศ. และรักษาเบอร์โทรเป็นข้อความ",
        "id": "w8-3",
        "stepBadge": "3. ตัวอย่าง"
      },
      {
        "stepType": "step",
        "title": "กิจกรรมสองวันและจุดที่ต้องตรวจ",
        "subtitle": "วันที่หนึ่ง 3 คาบ วันที่สอง 2 คาบ คาบละ 60 นาที",
        "steps": [
          {
            "num": "1",
            "title": "วันที่หนึ่ง: แนวคิดและส่วน A",
            "desc": "อภิปราย/ความรู้ 60 นาที แล้วทำตัวอย่างและใบงาน 120 นาที"
          },
          {
            "num": "2",
            "title": "วันที่สอง: ส่วน B",
            "desc": "ปฏิบัติรายบุคคล: นำเข้า ตรวจปัญหา Cleaning Merge KPI ตามรูบริก และตอบข้อเขียนสั้นห้าข้อ"
          },
          {
            "num": "3",
            "title": "ตรวจและส่งหลักฐาน",
            "desc": "ข้อสอบความรู้และ Notebook สอบกลางภาครายบุคคล"
          }
        ],
        "traps": [
          {
            "error": "FileNotFoundError",
            "cause": "ยังไม่ได้อัปโหลดชุดข้อมูลที่ระบุ",
            "solution": "ดาวน์โหลดไฟล์ในแถบชุดเรียน แล้วอัปโหลดลง Colab"
          },
          {
            "error": "ผลคำนวณไม่ตรงความหมายข้อมูล",
            "cause": "ใช้ราคาต่อหน่วยแทนยอดรวม หรือไม่ตรวจชนิดข้อมูล",
            "solution": "หลังสอบให้ผลย้อนกลับรายจุดและกิจกรรมซ่อมเสริม"
          }
        ],
        "id": "w8-4",
        "stepBadge": "4. ขั้นตอน"
      },
      {
        "stepType": "challenge",
        "title": "ตรวจความเข้าใจและต่อยอด",
        "subtitle": "ปฏิบัติรายบุคคล: นำเข้า ตรวจปัญหา Cleaning Merge KPI ตามรูบริก และตอบข้อเขียนสั้นห้าข้อ",
        "challengeType": "fill_blank",
        "question": "เติมส่วนที่ขาดให้คำสั่งถูกต้อง แล้วอธิบายว่าจะตรวจผลอย่างไร",
        "codeTemplate": "______(\"อ่านคำชี้แจงก่อนสอบ\")",
        "answers": [
          "print"
        ],
        "hints": "ย้อนดูหน้าคำสั่งสำคัญ และตรวจตัวพิมพ์กับวงเล็บ",
        "fullSolution": "print(\"อ่านคำชี้แจงก่อนสอบ\")",
        "colabTask": "ปฏิบัติรายบุคคล: นำเข้า ตรวจปัญหา Cleaning Merge KPI ตามรูบริก และตอบข้อเขียนสั้นห้าข้อ",
        "id": "w8-5",
        "stepBadge": "5. ฝึกและอธิบาย"
      }
    ]
  },
  {
    "weekId": 9,
    "title": "สัปดาห์ที่ 9: Data Model อนุกรมเวลาและการคาดการณ์",
    "unit": "หน่วยที่ 4",
    "slides": [
      {
        "stepType": "theory",
        "title": "Data Model อนุกรมเวลาและการคาดการณ์",
        "subtitle": "เป้าหมาย: แปลง DateTime และจัดลำดับเวลาได้",
        "concept": {
          "analogy": "ไฟล์พร้อมสอนใช้ปี ค.ศ. ส่วนวันที่ พ.ศ. ต้องลบปี 543 ก่อนแปลง",
          "before": {
            "title": "ก่อนเรียน",
            "desc": "สำรวจพื้นฐานและตั้งคำถามจากข้อมูล",
            "status": "ยังต้องตรวจสอบหลักฐาน"
          },
          "after": {
            "title": "หลักฐานที่ต้องทำได้",
            "desc": "ตาราง/กราฟแนวโน้ม ค่าคาดการณ์ วิธีคิด และข้อจำกัด",
            "status": "อธิบายผลและข้อจำกัดด้วยตนเอง"
          }
        },
        "keyPoints": [
          "ไฟล์พร้อมสอนใช้ปี ค.ศ. ส่วนวันที่ พ.ศ. ต้องลบปี 543 ก่อนแปลง",
          "price ในไฟล์นี้คือยอดรวมรายการ ห้ามคูณ cups ซ้ำ",
          "rolling(3) หมายถึงสามแถว หากวันขาดต้องระบุว่าเป็นสามวันมีข้อมูล ไม่ใช่สามวันปฏิทินเสมอ"
        ],
        "id": "w9-1",
        "stepBadge": "1. แนวคิด"
      },
      {
        "stepType": "syntax",
        "title": "คำสั่งหรือหลักปฏิบัติสำคัญ",
        "subtitle": "คำนวณ Moving Average และอธิบายข้อจำกัดการคาดการณ์ได้",
        "syntax": "daily.revenue.rolling(3).mean()",
        "breakdown": [
          {
            "token": "rolling",
            "role": "ส่วนสำคัญของคำสั่ง",
            "desc": "rolling(3) หมายถึงสามแถว หากวันขาดต้องระบุว่าเป็นสามวันมีข้อมูล ไม่ใช่สามวันปฏิทินเสมอ",
            "color": "text-sky-400"
          }
        ],
        "tip": "ใช้ Notebook W09 แล้วรันจากบนลงล่าง ตรวจหน่วยและความหมายคอลัมน์ก่อนคำนวณ",
        "id": "w9-2",
        "stepBadge": "2. คำสั่ง"
      },
      {
        "stepType": "usage",
        "title": "ตัวอย่างพร้อมใช้ใน Colab",
        "subtitle": "ไฟล์ประกอบ: drinks_shop.csv",
        "codeSnippet": "import pandas as pd\ndf = pd.read_csv('drinks_shop.csv')\ndf['date'] = pd.to_datetime(df.date)\ndaily = df.groupby('date').price.sum().sort_index().rename('revenue').to_frame()\ndaily['MA_3observations'] = daily.revenue.rolling(3).mean()\ndisplay(daily)\nforecast = daily.revenue.tail(3).mean()\nprint('คาดการณ์วันมีข้อมูลถัดไปแบบฐาน:', round(forecast,2))\nprint('เป็น baseline จากข้อมูลระยะสั้น ไม่ใช่คำรับรองยอดขายจริง')",
        "outputTable": {
          "headers": [
            "สิ่งที่ตรวจ",
            "หลักฐาน"
          ],
          "rows": [
            [
              "ผลลัพธ์",
              "ตาราง/กราฟแนวโน้ม ค่าคาดการณ์ วิธีคิด และข้อจำกัด"
            ],
            [
              "เหตุผล",
              "เปรียบเทียบหน้าต่างสามกับห้ารายการ และแยกวันที่ไม่มีบันทึกออกจากวันที่ยอดขายเป็นศูนย์"
            ]
          ]
        },
        "explanation": "ตัวอย่างใช้ชุดข้อมูลฉบับพร้อมสอน วันที่เป็น ค.ศ. และรักษาเบอร์โทรเป็นข้อความ",
        "id": "w9-3",
        "stepBadge": "3. ตัวอย่าง"
      },
      {
        "stepType": "step",
        "title": "กิจกรรมสองวันและจุดที่ต้องตรวจ",
        "subtitle": "วันที่หนึ่ง 3 คาบ วันที่สอง 2 คาบ คาบละ 60 นาที",
        "steps": [
          {
            "num": "1",
            "title": "วันที่หนึ่ง: แนวคิดและส่วน A",
            "desc": "อภิปราย/ความรู้ 60 นาที แล้วทำตัวอย่างและใบงาน 120 นาที"
          },
          {
            "num": "2",
            "title": "วันที่สอง: ส่วน B",
            "desc": "เปรียบเทียบหน้าต่างสามกับห้ารายการ และแยกวันที่ไม่มีบันทึกออกจากวันที่ยอดขายเป็นศูนย์"
          },
          {
            "num": "3",
            "title": "ตรวจและส่งหลักฐาน",
            "desc": "ตาราง/กราฟแนวโน้ม ค่าคาดการณ์ วิธีคิด และข้อจำกัด"
          }
        ],
        "traps": [
          {
            "error": "FileNotFoundError",
            "cause": "ยังไม่ได้อัปโหลดชุดข้อมูลที่ระบุ",
            "solution": "ดาวน์โหลดไฟล์ในแถบชุดเรียน แล้วอัปโหลดลง Colab"
          },
          {
            "error": "ผลคำนวณไม่ตรงความหมายข้อมูล",
            "cause": "ใช้ราคาต่อหน่วยแทนยอดรวม หรือไม่ตรวจชนิดข้อมูล",
            "solution": "rolling(3) หมายถึงสามแถว หากวันขาดต้องระบุว่าเป็นสามวันมีข้อมูล ไม่ใช่สามวันปฏิทินเสมอ"
          }
        ],
        "id": "w9-4",
        "stepBadge": "4. ขั้นตอน"
      },
      {
        "stepType": "challenge",
        "title": "ตรวจความเข้าใจและต่อยอด",
        "subtitle": "เปรียบเทียบหน้าต่างสามกับห้ารายการ และแยกวันที่ไม่มีบันทึกออกจากวันที่ยอดขายเป็นศูนย์",
        "challengeType": "fill_blank",
        "question": "เติมส่วนที่ขาดให้คำสั่งถูกต้อง แล้วอธิบายว่าจะตรวจผลอย่างไร",
        "codeTemplate": "daily.revenue.______(3).mean()",
        "answers": [
          "rolling"
        ],
        "hints": "ย้อนดูหน้าคำสั่งสำคัญ และตรวจตัวพิมพ์กับวงเล็บ",
        "fullSolution": "daily.revenue.rolling(3).mean()",
        "colabTask": "เปรียบเทียบหน้าต่างสามกับห้ารายการ และแยกวันที่ไม่มีบันทึกออกจากวันที่ยอดขายเป็นศูนย์",
        "id": "w9-5",
        "stepBadge": "5. ฝึกและอธิบาย"
      }
    ]
  },
  {
    "weekId": 10,
    "title": "สัปดาห์ที่ 10: Visualization ผู้ชม การเลือกกราฟ และ Storyboard",
    "unit": "หน่วยที่ 5",
    "slides": [
      {
        "stepType": "theory",
        "title": "Visualization ผู้ชม การเลือกกราฟ และ Storyboard",
        "subtitle": "เป้าหมาย: ระบุผู้ชมกับการตัดสินใจที่ต้องการได้",
        "concept": {
          "analogy": "ผู้ชมและคำถามมาก่อนกราฟ",
          "before": {
            "title": "ก่อนเรียน",
            "desc": "สำรวจพื้นฐานและตั้งคำถามจากข้อมูล",
            "status": "ยังต้องตรวจสอบหลักฐาน"
          },
          "after": {
            "title": "หลักฐานที่ต้องทำได้",
            "desc": "Persona คำถาม KPI และ Storyboard พร้อมคำอธิบายชนิดกราฟ",
            "status": "อธิบายผลและข้อจำกัดด้วยตนเอง"
          }
        },
        "keyPoints": [
          "ผู้ชมและคำถามมาก่อนกราฟ",
          "เปรียบเทียบใช้ Bar แนวโน้มใช้ Line ความสัมพันธ์ใช้ Scatter",
          "Storyboard ต้องระบุตำแหน่ง KPI กราฟ ตัวกรอง แหล่งข้อมูลและข้อจำกัด"
        ],
        "id": "w10-1",
        "stepBadge": "1. แนวคิด"
      },
      {
        "stepType": "syntax",
        "title": "คำสั่งหรือหลักปฏิบัติสำคัญ",
        "subtitle": "เลือกกราฟและร่าง Dashboard พร้อมทดสอบคำถามได้",
        "syntax": "print(\"ระบุผู้ชมและคำถามก่อนเลือกกราฟ\")",
        "breakdown": [
          {
            "token": "print",
            "role": "ส่วนสำคัญของคำสั่ง",
            "desc": "Storyboard ต้องระบุตำแหน่ง KPI กราฟ ตัวกรอง แหล่งข้อมูลและข้อจำกัด",
            "color": "text-sky-400"
          }
        ],
        "tip": "ใช้ Notebook W10 แล้วรันจากบนลงล่าง ตรวจหน่วยและความหมายคอลัมน์ก่อนคำนวณ",
        "id": "w10-2",
        "stepBadge": "2. คำสั่ง"
      },
      {
        "stepType": "usage",
        "title": "ตัวอย่างพร้อมใช้ใน Colab",
        "subtitle": "ไฟล์ประกอบ: drinks_shop.csv",
        "codeSnippet": "import pandas as pd\ndf = pd.read_csv('drinks_shop.csv')\nsummary = df.groupby('menu').agg(cups=('cups','sum'),revenue=('price','sum')).sort_values('revenue',ascending=False)\ndisplay(summary)\nprint('ผู้ชม: ผู้จัดการร้าน | คำถาม: ควรเตรียมเมนูใดเพิ่ม?')",
        "outputTable": {
          "headers": [
            "สิ่งที่ตรวจ",
            "หลักฐาน"
          ],
          "rows": [
            [
              "ผลลัพธ์",
              "Persona คำถาม KPI และ Storyboard พร้อมคำอธิบายชนิดกราฟ"
            ],
            [
              "เหตุผล",
              "ร่างหนึ่งหน้าให้ผู้จัดการร้านและอธิบายว่าตัวกรองช่วยตอบคำถามใด"
            ]
          ]
        },
        "explanation": "ตัวอย่างใช้ชุดข้อมูลฉบับพร้อมสอน วันที่เป็น ค.ศ. และรักษาเบอร์โทรเป็นข้อความ",
        "id": "w10-3",
        "stepBadge": "3. ตัวอย่าง"
      },
      {
        "stepType": "step",
        "title": "กิจกรรมสองวันและจุดที่ต้องตรวจ",
        "subtitle": "วันที่หนึ่ง 3 คาบ วันที่สอง 2 คาบ คาบละ 60 นาที",
        "steps": [
          {
            "num": "1",
            "title": "วันที่หนึ่ง: แนวคิดและส่วน A",
            "desc": "อภิปราย/ความรู้ 60 นาที แล้วทำตัวอย่างและใบงาน 120 นาที"
          },
          {
            "num": "2",
            "title": "วันที่สอง: ส่วน B",
            "desc": "ร่างหนึ่งหน้าให้ผู้จัดการร้านและอธิบายว่าตัวกรองช่วยตอบคำถามใด"
          },
          {
            "num": "3",
            "title": "ตรวจและส่งหลักฐาน",
            "desc": "Persona คำถาม KPI และ Storyboard พร้อมคำอธิบายชนิดกราฟ"
          }
        ],
        "traps": [
          {
            "error": "FileNotFoundError",
            "cause": "ยังไม่ได้อัปโหลดชุดข้อมูลที่ระบุ",
            "solution": "ดาวน์โหลดไฟล์ในแถบชุดเรียน แล้วอัปโหลดลง Colab"
          },
          {
            "error": "ผลคำนวณไม่ตรงความหมายข้อมูล",
            "cause": "ใช้ราคาต่อหน่วยแทนยอดรวม หรือไม่ตรวจชนิดข้อมูล",
            "solution": "Storyboard ต้องระบุตำแหน่ง KPI กราฟ ตัวกรอง แหล่งข้อมูลและข้อจำกัด"
          }
        ],
        "id": "w10-4",
        "stepBadge": "4. ขั้นตอน"
      },
      {
        "stepType": "challenge",
        "title": "ตรวจความเข้าใจและต่อยอด",
        "subtitle": "ร่างหนึ่งหน้าให้ผู้จัดการร้านและอธิบายว่าตัวกรองช่วยตอบคำถามใด",
        "challengeType": "fill_blank",
        "question": "เติมส่วนที่ขาดให้คำสั่งถูกต้อง แล้วอธิบายว่าจะตรวจผลอย่างไร",
        "codeTemplate": "______(\"ระบุผู้ชมและคำถามก่อนเลือกกราฟ\")",
        "answers": [
          "print"
        ],
        "hints": "ย้อนดูหน้าคำสั่งสำคัญ และตรวจตัวพิมพ์กับวงเล็บ",
        "fullSolution": "print(\"ระบุผู้ชมและคำถามก่อนเลือกกราฟ\")",
        "colabTask": "ร่างหนึ่งหน้าให้ผู้จัดการร้านและอธิบายว่าตัวกรองช่วยตอบคำถามใด",
        "id": "w10-5",
        "stepBadge": "5. ฝึกและอธิบาย"
      }
    ]
  },
  {
    "weekId": 11,
    "title": "สัปดาห์ที่ 11: Visualization สร้างภาพข้อมูล",
    "unit": "หน่วยที่ 5",
    "slides": [
      {
        "stepType": "theory",
        "title": "Visualization สร้างภาพข้อมูล",
        "subtitle": "เป้าหมาย: สร้างกราฟและตั้งชื่อแกน หน่วย แหล่งข้อมูลได้",
        "concept": {
          "analogy": "เลือกสเกลให้ตีความไม่ผิด ระบุหน่วยและช่วงเวลา",
          "before": {
            "title": "ก่อนเรียน",
            "desc": "สำรวจพื้นฐานและตั้งคำถามจากข้อมูล",
            "status": "ยังต้องตรวจสอบหลักฐาน"
          },
          "after": {
            "title": "หลักฐานที่ต้องทำได้",
            "desc": "กราฟอย่างน้อยสามชนิดที่ตอบคำถามจริง พร้อมคำอธิบาย",
            "status": "อธิบายผลและข้อจำกัดด้วยตนเอง"
          }
        },
        "keyPoints": [
          "เลือกสเกลให้ตีความไม่ผิด ระบุหน่วยและช่วงเวลา",
          "Plotly ใช้การแสดงผลภาษาไทยของเบราว์เซอร์",
          "Matplotlib ใช้ฟอนต์ไทยที่แนบกับชุดสอน ไม่ต้องติดตั้งฟอนต์ทั้งเครื่อง"
        ],
        "id": "w11-1",
        "stepBadge": "1. แนวคิด"
      },
      {
        "stepType": "syntax",
        "title": "คำสั่งหรือหลักปฏิบัติสำคัญ",
        "subtitle": "ตรวจสเกล สี ฟอนต์ และความหมายก่อนเผยแพร่ได้",
        "syntax": "fig.show()",
        "breakdown": [
          {
            "token": "show",
            "role": "ส่วนสำคัญของคำสั่ง",
            "desc": "Matplotlib ใช้ฟอนต์ไทยที่แนบกับชุดสอน ไม่ต้องติดตั้งฟอนต์ทั้งเครื่อง",
            "color": "text-sky-400"
          }
        ],
        "tip": "ใช้ Notebook W11 แล้วรันจากบนลงล่าง ตรวจหน่วยและความหมายคอลัมน์ก่อนคำนวณ",
        "id": "w11-2",
        "stepBadge": "2. คำสั่ง"
      },
      {
        "stepType": "usage",
        "title": "ตัวอย่างพร้อมใช้ใน Colab",
        "subtitle": "ไฟล์ประกอบ: drinks_shop.csv",
        "codeSnippet": "import pandas as pd\nimport plotly.express as px\nimport matplotlib.pyplot as plt\nfrom matplotlib.font_manager import FontProperties\nfrom pathlib import Path\ndf = pd.read_csv('drinks_shop.csv')\nsummary = df.groupby('menu',as_index=False).price.sum()\nfig = px.bar(summary,x='menu',y='price',title='ยอดขายรวมแยกตามเมนู',labels={'menu':'เมนู','price':'ยอดขาย (บาท)'})\nfig.show()\nfont_path = Path('THSarabun.ttf')\nfont = FontProperties(fname=str(font_path)) if font_path.exists() else None\nplt.bar(range(len(summary)),summary.price)\nplt.xticks(range(len(summary)),summary.menu,fontproperties=font)\nplt.ylabel('Revenue (THB)')\nplt.tight_layout()\nplt.savefig('menu_sales.png',dpi=160)\nplt.show()",
        "outputTable": {
          "headers": [
            "สิ่งที่ตรวจ",
            "หลักฐาน"
          ],
          "rows": [
            [
              "ผลลัพธ์",
              "กราฟอย่างน้อยสามชนิดที่ตอบคำถามจริง พร้อมคำอธิบาย"
            ],
            [
              "เหตุผล",
              "ตรวจกราฟเพื่อนด้วยรายการตรวจเรื่องชนิดกราฟ หน่วย สเกล สี และแหล่งข้อมูล"
            ]
          ]
        },
        "explanation": "ตัวอย่างใช้ชุดข้อมูลฉบับพร้อมสอน วันที่เป็น ค.ศ. และรักษาเบอร์โทรเป็นข้อความ",
        "id": "w11-3",
        "stepBadge": "3. ตัวอย่าง"
      },
      {
        "stepType": "step",
        "title": "กิจกรรมสองวันและจุดที่ต้องตรวจ",
        "subtitle": "วันที่หนึ่ง 3 คาบ วันที่สอง 2 คาบ คาบละ 60 นาที",
        "steps": [
          {
            "num": "1",
            "title": "วันที่หนึ่ง: แนวคิดและส่วน A",
            "desc": "อภิปราย/ความรู้ 60 นาที แล้วทำตัวอย่างและใบงาน 120 นาที"
          },
          {
            "num": "2",
            "title": "วันที่สอง: ส่วน B",
            "desc": "ตรวจกราฟเพื่อนด้วยรายการตรวจเรื่องชนิดกราฟ หน่วย สเกล สี และแหล่งข้อมูล"
          },
          {
            "num": "3",
            "title": "ตรวจและส่งหลักฐาน",
            "desc": "กราฟอย่างน้อยสามชนิดที่ตอบคำถามจริง พร้อมคำอธิบาย"
          }
        ],
        "traps": [
          {
            "error": "FileNotFoundError",
            "cause": "ยังไม่ได้อัปโหลดชุดข้อมูลที่ระบุ",
            "solution": "ดาวน์โหลดไฟล์ในแถบชุดเรียน แล้วอัปโหลดลง Colab"
          },
          {
            "error": "ผลคำนวณไม่ตรงความหมายข้อมูล",
            "cause": "ใช้ราคาต่อหน่วยแทนยอดรวม หรือไม่ตรวจชนิดข้อมูล",
            "solution": "Matplotlib ใช้ฟอนต์ไทยที่แนบกับชุดสอน ไม่ต้องติดตั้งฟอนต์ทั้งเครื่อง"
          }
        ],
        "id": "w11-4",
        "stepBadge": "4. ขั้นตอน"
      },
      {
        "stepType": "challenge",
        "title": "ตรวจความเข้าใจและต่อยอด",
        "subtitle": "ตรวจกราฟเพื่อนด้วยรายการตรวจเรื่องชนิดกราฟ หน่วย สเกล สี และแหล่งข้อมูล",
        "challengeType": "fill_blank",
        "question": "เติมส่วนที่ขาดให้คำสั่งถูกต้อง แล้วอธิบายว่าจะตรวจผลอย่างไร",
        "codeTemplate": "fig.______()",
        "answers": [
          "show"
        ],
        "hints": "ย้อนดูหน้าคำสั่งสำคัญ และตรวจตัวพิมพ์กับวงเล็บ",
        "fullSolution": "fig.show()",
        "colabTask": "ตรวจกราฟเพื่อนด้วยรายการตรวจเรื่องชนิดกราฟ หน่วย สเกล สี และแหล่งข้อมูล",
        "id": "w11-5",
        "stepBadge": "5. ฝึกและอธิบาย"
      }
    ]
  },
  {
    "weekId": 12,
    "title": "สัปดาห์ที่ 12: Visualization Dashboard และการทดสอบ UX",
    "unit": "หน่วยที่ 5",
    "slides": [
      {
        "stepType": "theory",
        "title": "Visualization Dashboard และการทดสอบ UX",
        "subtitle": "เป้าหมาย: ประกอบ KPI และหลายกราฟพร้อมตัวกรองที่เปลี่ยนข้อมูลทุกส่วนได้",
        "concept": {
          "analogy": "กราฟโต้ตอบหนึ่งภาพยังไม่ใช่ Dashboard ที่ครอบคลุมแผนนี้",
          "before": {
            "title": "ก่อนเรียน",
            "desc": "สำรวจพื้นฐานและตั้งคำถามจากข้อมูล",
            "status": "ยังต้องตรวจสอบหลักฐาน"
          },
          "after": {
            "title": "หลักฐานที่ต้องทำได้",
            "desc": "dashboard.html พร้อมตัวกรอง ผลทดสอบ UX และบันทึกก่อน/หลังปรับ",
            "status": "อธิบายผลและข้อจำกัดด้วยตนเอง"
          }
        },
        "keyPoints": [
          "กราฟโต้ตอบหนึ่งภาพยังไม่ใช่ Dashboard ที่ครอบคลุมแผนนี้",
          "ตัวกรองเมนูต้องอัปเดตทั้งยอดรวม กราฟเวลา และกราฟเปรียบเทียบ",
          "ให้เพื่อนหาคำตอบจากแดชบอร์ด บันทึกเวลาหรือขั้นตอนและข้อผิดพลาด"
        ],
        "id": "w12-1",
        "stepBadge": "1. แนวคิด"
      },
      {
        "stepType": "syntax",
        "title": "คำสั่งหรือหลักปฏิบัติสำคัญ",
        "subtitle": "ทดสอบงานผู้ใช้และปรับปรุงจากหลักฐานได้",
        "syntax": "fig.write_html(\"dashboard.html\", include_plotlyjs=True)",
        "breakdown": [
          {
            "token": "write_html",
            "role": "ส่วนสำคัญของคำสั่ง",
            "desc": "ให้เพื่อนหาคำตอบจากแดชบอร์ด บันทึกเวลาหรือขั้นตอนและข้อผิดพลาด",
            "color": "text-sky-400"
          }
        ],
        "tip": "ใช้ Notebook W12 แล้วรันจากบนลงล่าง ตรวจหน่วยและความหมายคอลัมน์ก่อนคำนวณ",
        "id": "w12-2",
        "stepBadge": "2. คำสั่ง"
      },
      {
        "stepType": "usage",
        "title": "ตัวอย่างพร้อมใช้ใน Colab",
        "subtitle": "ไฟล์ประกอบ: drinks_shop.csv",
        "codeSnippet": "import pandas as pd\nimport plotly.graph_objects as go\nfrom plotly.subplots import make_subplots\ndf = pd.read_csv('drinks_shop.csv')\ndef dashboard_traces(sub):\n    daily = sub.groupby('date',as_index=False).price.sum()\n    menu = sub.groupby('menu',as_index=False).price.sum()\n    return [go.Indicator(mode='number',value=float(sub.price.sum()),title={'text':'ยอดขาย (บาท)'}),go.Bar(x=menu.menu,y=menu.price),go.Scatter(x=daily.date,y=daily.price,mode='lines+markers')]\nfig = make_subplots(rows=2,cols=2,specs=[[{'type':'indicator'}, {'type':'xy'}],[{'type':'xy','colspan':2},None]],subplot_titles=['','ยอดขายแยกเมนู','แนวโน้มยอดขาย'])\nfor trace,row,col in zip(dashboard_traces(df),[1,1,2],[1,2,1]): fig.add_trace(trace,row=row,col=col)\nbuttons=[]\nfor name in ['ทั้งหมด']+sorted(df.menu.unique().tolist()):\n    sub=df if name=='ทั้งหมด' else df.loc[df.menu==name]\n    traces=dashboard_traces(sub)\n    buttons.append(dict(label=name,method='update',args=[{'value':[float(sub.price.sum()),None,None],'x':[None,traces[1].x,traces[2].x],'y':[None,traces[1].y,traces[2].y]}, {'title':'ยอดขายร้านเครื่องดื่ม: '+name}]))\nfig.update_layout(title='ยอดขายร้านเครื่องดื่ม: ทั้งหมด',height=650,updatemenus=[dict(buttons=buttons,x=0,y=1.18)],showlegend=False)\nfig.write_html('dashboard.html',include_plotlyjs=True)\nfig.show()",
        "outputTable": {
          "headers": [
            "สิ่งที่ตรวจ",
            "หลักฐาน"
          ],
          "rows": [
            [
              "ผลลัพธ์",
              "dashboard.html พร้อมตัวกรอง ผลทดสอบ UX และบันทึกก่อน/หลังปรับ"
            ],
            [
              "เหตุผล",
              "ทดสอบสามงาน: ยอดขายทั้งหมด เมนูที่เลือก และวันที่ยอดสูงสุด บันทึกข้อเสนอแนะและแก้หนึ่งจุด"
            ]
          ]
        },
        "explanation": "ตัวอย่างใช้ชุดข้อมูลฉบับพร้อมสอน วันที่เป็น ค.ศ. และรักษาเบอร์โทรเป็นข้อความ",
        "id": "w12-3",
        "stepBadge": "3. ตัวอย่าง"
      },
      {
        "stepType": "step",
        "title": "กิจกรรมสองวันและจุดที่ต้องตรวจ",
        "subtitle": "วันที่หนึ่ง 3 คาบ วันที่สอง 2 คาบ คาบละ 60 นาที",
        "steps": [
          {
            "num": "1",
            "title": "วันที่หนึ่ง: แนวคิดและส่วน A",
            "desc": "อภิปราย/ความรู้ 60 นาที แล้วทำตัวอย่างและใบงาน 120 นาที"
          },
          {
            "num": "2",
            "title": "วันที่สอง: ส่วน B",
            "desc": "ทดสอบสามงาน: ยอดขายทั้งหมด เมนูที่เลือก และวันที่ยอดสูงสุด บันทึกข้อเสนอแนะและแก้หนึ่งจุด"
          },
          {
            "num": "3",
            "title": "ตรวจและส่งหลักฐาน",
            "desc": "dashboard.html พร้อมตัวกรอง ผลทดสอบ UX และบันทึกก่อน/หลังปรับ"
          }
        ],
        "traps": [
          {
            "error": "FileNotFoundError",
            "cause": "ยังไม่ได้อัปโหลดชุดข้อมูลที่ระบุ",
            "solution": "ดาวน์โหลดไฟล์ในแถบชุดเรียน แล้วอัปโหลดลง Colab"
          },
          {
            "error": "ผลคำนวณไม่ตรงความหมายข้อมูล",
            "cause": "ใช้ราคาต่อหน่วยแทนยอดรวม หรือไม่ตรวจชนิดข้อมูล",
            "solution": "ให้เพื่อนหาคำตอบจากแดชบอร์ด บันทึกเวลาหรือขั้นตอนและข้อผิดพลาด"
          }
        ],
        "id": "w12-4",
        "stepBadge": "4. ขั้นตอน"
      },
      {
        "stepType": "challenge",
        "title": "ตรวจความเข้าใจและต่อยอด",
        "subtitle": "ทดสอบสามงาน: ยอดขายทั้งหมด เมนูที่เลือก และวันที่ยอดสูงสุด บันทึกข้อเสนอแนะและแก้หนึ่งจุด",
        "challengeType": "fill_blank",
        "question": "เติมส่วนที่ขาดให้คำสั่งถูกต้อง แล้วอธิบายว่าจะตรวจผลอย่างไร",
        "codeTemplate": "fig.______(\"dashboard.html\", include_plotlyjs=True)",
        "answers": [
          "write_html"
        ],
        "hints": "ย้อนดูหน้าคำสั่งสำคัญ และตรวจตัวพิมพ์กับวงเล็บ",
        "fullSolution": "fig.write_html(\"dashboard.html\", include_plotlyjs=True)",
        "colabTask": "ทดสอบสามงาน: ยอดขายทั้งหมด เมนูที่เลือก และวันที่ยอดสูงสุด บันทึกข้อเสนอแนะและแก้หนึ่งจุด",
        "id": "w12-5",
        "stepBadge": "5. ฝึกและอธิบาย"
      }
    ]
  },
  {
    "weekId": 13,
    "title": "สัปดาห์ที่ 13: Data Storytelling และการนำเสนอเพื่อตัดสินใจ",
    "unit": "หน่วยที่ 6",
    "slides": [
      {
        "stepType": "theory",
        "title": "Data Storytelling และการนำเสนอเพื่อตัดสินใจ",
        "subtitle": "เป้าหมาย: เชื่อม Insight กับข้อเสนอแนะและข้อจำกัดได้",
        "concept": {
          "analogy": "แยกสิ่งที่ข้อมูลบอก สมมติฐาน และคำแนะนำ",
          "before": {
            "title": "ก่อนเรียน",
            "desc": "สำรวจพื้นฐานและตั้งคำถามจากข้อมูล",
            "status": "ยังต้องตรวจสอบหลักฐาน"
          },
          "after": {
            "title": "หลักฐานที่ต้องทำได้",
            "desc": "สไลด์ห้าหน้า บทพูด และผลซ้อมนำเสนอ",
            "status": "อธิบายผลและข้อจำกัดด้วยตนเอง"
          }
        },
        "keyPoints": [
          "แยกสิ่งที่ข้อมูลบอก สมมติฐาน และคำแนะนำ",
          "Action Title ต้องมีตัวเลขที่ตรวจสอบย้อนกลับได้",
          "หลีกเลี่ยงสรุปสาเหตุจากความสัมพันธ์หรือข้อมูลช่วงสั้น"
        ],
        "id": "w13-1",
        "stepBadge": "1. แนวคิด"
      },
      {
        "stepType": "syntax",
        "title": "คำสั่งหรือหลักปฏิบัติสำคัญ",
        "subtitle": "จัดทำสไลด์และซ้อมตอบคำถามได้",
        "syntax": "summary.idxmax()",
        "breakdown": [
          {
            "token": "idxmax",
            "role": "ส่วนสำคัญของคำสั่ง",
            "desc": "หลีกเลี่ยงสรุปสาเหตุจากความสัมพันธ์หรือข้อมูลช่วงสั้น",
            "color": "text-sky-400"
          }
        ],
        "tip": "ใช้ Notebook W13 แล้วรันจากบนลงล่าง ตรวจหน่วยและความหมายคอลัมน์ก่อนคำนวณ",
        "id": "w13-2",
        "stepBadge": "2. คำสั่ง"
      },
      {
        "stepType": "usage",
        "title": "ตัวอย่างพร้อมใช้ใน Colab",
        "subtitle": "ไฟล์ประกอบ: drinks_shop.csv",
        "codeSnippet": "import pandas as pd\ndf = pd.read_csv('drinks_shop.csv')\nsummary = df.groupby('menu').price.sum()\ntop = summary.idxmax()\nshare = summary.max()/summary.sum()*100\nprint(f'{top} มียอดขาย {summary.max():,.0f} บาท คิดเป็น {share:.1f}% ของยอดรวมในข้อมูลฝึก')\nprint('ข้อเสนอแนะ: ตรวจสต็อกเมนูนี้ก่อนวางแผนเพิ่ม พร้อมติดตามข้อมูลหลายสัปดาห์')\nprint('ข้อจำกัด: ข้อมูลตัวอย่างระยะสั้นและไม่ทราบอุปสงค์ที่ขายไม่ได้')",
        "outputTable": {
          "headers": [
            "สิ่งที่ตรวจ",
            "หลักฐาน"
          ],
          "rows": [
            [
              "ผลลัพธ์",
              "สไลด์ห้าหน้า บทพูด และผลซ้อมนำเสนอ"
            ],
            [
              "เหตุผล",
              "สร้างสไลด์ห้าหน้า: คำถาม ข้อมูล/คุณภาพ ผลวิเคราะห์ Dashboard และข้อเสนอแนะพร้อมข้อจำกัด"
            ]
          ]
        },
        "explanation": "ตัวอย่างใช้ชุดข้อมูลฉบับพร้อมสอน วันที่เป็น ค.ศ. และรักษาเบอร์โทรเป็นข้อความ",
        "id": "w13-3",
        "stepBadge": "3. ตัวอย่าง"
      },
      {
        "stepType": "step",
        "title": "กิจกรรมสองวันและจุดที่ต้องตรวจ",
        "subtitle": "วันที่หนึ่ง 3 คาบ วันที่สอง 2 คาบ คาบละ 60 นาที",
        "steps": [
          {
            "num": "1",
            "title": "วันที่หนึ่ง: แนวคิดและส่วน A",
            "desc": "อภิปราย/ความรู้ 60 นาที แล้วทำตัวอย่างและใบงาน 120 นาที"
          },
          {
            "num": "2",
            "title": "วันที่สอง: ส่วน B",
            "desc": "สร้างสไลด์ห้าหน้า: คำถาม ข้อมูล/คุณภาพ ผลวิเคราะห์ Dashboard และข้อเสนอแนะพร้อมข้อจำกัด"
          },
          {
            "num": "3",
            "title": "ตรวจและส่งหลักฐาน",
            "desc": "สไลด์ห้าหน้า บทพูด และผลซ้อมนำเสนอ"
          }
        ],
        "traps": [
          {
            "error": "FileNotFoundError",
            "cause": "ยังไม่ได้อัปโหลดชุดข้อมูลที่ระบุ",
            "solution": "ดาวน์โหลดไฟล์ในแถบชุดเรียน แล้วอัปโหลดลง Colab"
          },
          {
            "error": "ผลคำนวณไม่ตรงความหมายข้อมูล",
            "cause": "ใช้ราคาต่อหน่วยแทนยอดรวม หรือไม่ตรวจชนิดข้อมูล",
            "solution": "หลีกเลี่ยงสรุปสาเหตุจากความสัมพันธ์หรือข้อมูลช่วงสั้น"
          }
        ],
        "id": "w13-4",
        "stepBadge": "4. ขั้นตอน"
      },
      {
        "stepType": "challenge",
        "title": "ตรวจความเข้าใจและต่อยอด",
        "subtitle": "สร้างสไลด์ห้าหน้า: คำถาม ข้อมูล/คุณภาพ ผลวิเคราะห์ Dashboard และข้อเสนอแนะพร้อมข้อจำกัด",
        "challengeType": "fill_blank",
        "question": "เติมส่วนที่ขาดให้คำสั่งถูกต้อง แล้วอธิบายว่าจะตรวจผลอย่างไร",
        "codeTemplate": "summary.______()",
        "answers": [
          "idxmax"
        ],
        "hints": "ย้อนดูหน้าคำสั่งสำคัญ และตรวจตัวพิมพ์กับวงเล็บ",
        "fullSolution": "summary.idxmax()",
        "colabTask": "สร้างสไลด์ห้าหน้า: คำถาม ข้อมูล/คุณภาพ ผลวิเคราะห์ Dashboard และข้อเสนอแนะพร้อมข้อจำกัด",
        "id": "w13-5",
        "stepBadge": "5. ฝึกและอธิบาย"
      }
    ]
  },
  {
    "weekId": 14,
    "title": "สัปดาห์ที่ 14: นำเสนอโครงงานบูรณาการ",
    "unit": "หน่วยที่ 7",
    "slides": [
      {
        "stepType": "theory",
        "title": "นำเสนอโครงงานบูรณาการ",
        "subtitle": "เป้าหมาย: สาธิต Pipeline ครบวงจรและตอบคำถามรายบุคคลได้",
        "concept": {
          "analogy": "นำเสนอกลุ่มละ 12 นาทีและตอบคำถาม 5 นาที ปรับจำนวนกลุ่มตามชั้นเรียนจริง",
          "before": {
            "title": "ก่อนเรียน",
            "desc": "สำรวจพื้นฐานและตั้งคำถามจากข้อมูล",
            "status": "ยังต้องตรวจสอบหลักฐาน"
          },
          "after": {
            "title": "หลักฐานที่ต้องทำได้",
            "desc": "แฟ้มโครงงานและแบบประเมินรายบุคคล",
            "status": "อธิบายผลและข้อจำกัดด้วยตนเอง"
          }
        },
        "keyPoints": [
          "นำเสนอกลุ่มละ 12 นาทีและตอบคำถาม 5 นาที ปรับจำนวนกลุ่มตามชั้นเรียนจริง",
          "โครงงาน 20 คะแนน ใช้รูบริกเดียวกันและตรวจบทบาทสมาชิก",
          "ส่งข้อมูลที่เผยแพร่ได้ Notebook Dashboard สไลด์ และบันทึกแบ่งงาน"
        ],
        "id": "w14-1",
        "stepBadge": "1. แนวคิด"
      },
      {
        "stepType": "syntax",
        "title": "คำสั่งหรือหลักปฏิบัติสำคัญ",
        "subtitle": "นำเสนอ Dashboard กับข้อเสนอแนะที่มีหลักฐานได้",
        "syntax": "print(\"ตรวจหลักฐานและนำเสนอโครงงาน\")",
        "breakdown": [
          {
            "token": "print",
            "role": "ส่วนสำคัญของคำสั่ง",
            "desc": "ส่งข้อมูลที่เผยแพร่ได้ Notebook Dashboard สไลด์ และบันทึกแบ่งงาน",
            "color": "text-sky-400"
          }
        ],
        "tip": "ใช้ Notebook W14 แล้วรันจากบนลงล่าง ตรวจหน่วยและความหมายคอลัมน์ก่อนคำนวณ",
        "id": "w14-2",
        "stepBadge": "2. คำสั่ง"
      },
      {
        "stepType": "usage",
        "title": "ตัวอย่างพร้อมใช้ใน Colab",
        "subtitle": "ไฟล์ประกอบ: เอกสารที่ครูแจก",
        "codeSnippet": "print('รายการส่งโครงงาน: ข้อมูลพร้อมคำอธิบาย + Notebook + Dashboard + สไลด์ + บันทึกบทบาท')\nprint('ครูตรวจคำอธิบายรายบุคคลและบันทึกหลักฐานตามรูบริก')",
        "outputTable": {
          "headers": [
            "สิ่งที่ตรวจ",
            "หลักฐาน"
          ],
          "rows": [
            [
              "ผลลัพธ์",
              "แฟ้มโครงงานและแบบประเมินรายบุคคล"
            ],
            [
              "เหตุผล",
              "สาธิตผลจากข้อมูลจริงของกลุ่ม ตอบคำถามวิธี Cleaning สูตร KPI และข้อจำกัด"
            ]
          ]
        },
        "explanation": "ตัวอย่างใช้ชุดข้อมูลฉบับพร้อมสอน วันที่เป็น ค.ศ. และรักษาเบอร์โทรเป็นข้อความ",
        "id": "w14-3",
        "stepBadge": "3. ตัวอย่าง"
      },
      {
        "stepType": "step",
        "title": "กิจกรรมสองวันและจุดที่ต้องตรวจ",
        "subtitle": "วันที่หนึ่ง 3 คาบ วันที่สอง 2 คาบ คาบละ 60 นาที",
        "steps": [
          {
            "num": "1",
            "title": "วันที่หนึ่ง: แนวคิดและส่วน A",
            "desc": "อภิปราย/ความรู้ 60 นาที แล้วทำตัวอย่างและใบงาน 120 นาที"
          },
          {
            "num": "2",
            "title": "วันที่สอง: ส่วน B",
            "desc": "สาธิตผลจากข้อมูลจริงของกลุ่ม ตอบคำถามวิธี Cleaning สูตร KPI และข้อจำกัด"
          },
          {
            "num": "3",
            "title": "ตรวจและส่งหลักฐาน",
            "desc": "แฟ้มโครงงานและแบบประเมินรายบุคคล"
          }
        ],
        "traps": [
          {
            "error": "FileNotFoundError",
            "cause": "ยังไม่ได้อัปโหลดชุดข้อมูลที่ระบุ",
            "solution": "ดาวน์โหลดไฟล์ในแถบชุดเรียน แล้วอัปโหลดลง Colab"
          },
          {
            "error": "ผลคำนวณไม่ตรงความหมายข้อมูล",
            "cause": "ใช้ราคาต่อหน่วยแทนยอดรวม หรือไม่ตรวจชนิดข้อมูล",
            "solution": "ส่งข้อมูลที่เผยแพร่ได้ Notebook Dashboard สไลด์ และบันทึกแบ่งงาน"
          }
        ],
        "id": "w14-4",
        "stepBadge": "4. ขั้นตอน"
      },
      {
        "stepType": "challenge",
        "title": "ตรวจความเข้าใจและต่อยอด",
        "subtitle": "สาธิตผลจากข้อมูลจริงของกลุ่ม ตอบคำถามวิธี Cleaning สูตร KPI และข้อจำกัด",
        "challengeType": "fill_blank",
        "question": "เติมส่วนที่ขาดให้คำสั่งถูกต้อง แล้วอธิบายว่าจะตรวจผลอย่างไร",
        "codeTemplate": "______(\"ตรวจหลักฐานและนำเสนอโครงงาน\")",
        "answers": [
          "print"
        ],
        "hints": "ย้อนดูหน้าคำสั่งสำคัญ และตรวจตัวพิมพ์กับวงเล็บ",
        "fullSolution": "print(\"ตรวจหลักฐานและนำเสนอโครงงาน\")",
        "colabTask": "สาธิตผลจากข้อมูลจริงของกลุ่ม ตอบคำถามวิธี Cleaning สูตร KPI และข้อจำกัด",
        "id": "w14-5",
        "stepBadge": "5. ฝึกและอธิบาย"
      }
    ]
  },
  {
    "weekId": 15,
    "title": "สัปดาห์ที่ 15: สอบปลายภาคและสรุปผลการเรียนรู้",
    "unit": "หน่วยที่ 8",
    "slides": [
      {
        "stepType": "theory",
        "title": "สอบปลายภาคและสรุปผลการเรียนรู้",
        "subtitle": "เป้าหมาย: แสดงความรู้และการประยุกต์ใช้ตามสมรรถนะรายวิชาได้",
        "concept": {
          "analogy": "ปลายภาค 20 คะแนน: ปรนัย 40 ข้อ 10 คะแนน และอัตนัยสองข้อ 10 คะแนน เวลา 120 นาที",
          "before": {
            "title": "ก่อนเรียน",
            "desc": "สำรวจพื้นฐานและตั้งคำถามจากข้อมูล",
            "status": "ยังต้องตรวจสอบหลักฐาน"
          },
          "after": {
            "title": "หลักฐานที่ต้องทำได้",
            "desc": "กระดาษคำตอบปลายภาคและ Reflection",
            "status": "อธิบายผลและข้อจำกัดด้วยตนเอง"
          }
        },
        "keyPoints": [
          "ปลายภาค 20 คะแนน: ปรนัย 40 ข้อ 10 คะแนน และอัตนัยสองข้อ 10 คะแนน เวลา 120 นาที",
          "ข้อสอบเป็นข้อสอบรายวิชาที่ครูจัดทำ ไม่ใช่ข้อสอบรับรองมาตรฐานวิชาชีพจากส่วนกลาง",
          "ตรวจเวลาเรียนและกรณีพิเศษตามระเบียบสถานศึกษาก่อนตัดสินผล"
        ],
        "id": "w15-1",
        "stepBadge": "1. แนวคิด"
      },
      {
        "stepType": "syntax",
        "title": "คำสั่งหรือหลักปฏิบัติสำคัญ",
        "subtitle": "ตรวจแฟ้มหลักฐานและสะท้อนการเรียนรู้ได้",
        "syntax": "print(\"ทบทวนก่อนสอบและสะท้อนการเรียนรู้หลังสอบ\")",
        "breakdown": [
          {
            "token": "print",
            "role": "ส่วนสำคัญของคำสั่ง",
            "desc": "ตรวจเวลาเรียนและกรณีพิเศษตามระเบียบสถานศึกษาก่อนตัดสินผล",
            "color": "text-sky-400"
          }
        ],
        "tip": "ใช้ Notebook W15 แล้วรันจากบนลงล่าง ตรวจหน่วยและความหมายคอลัมน์ก่อนคำนวณ",
        "id": "w15-2",
        "stepBadge": "2. คำสั่ง"
      },
      {
        "stepType": "usage",
        "title": "ตัวอย่างพร้อมใช้ใน Colab",
        "subtitle": "ไฟล์ประกอบ: เอกสารที่ครูแจก",
        "codeSnippet": "print(\"ใช้ข้อสอบฉบับผู้เรียนที่ครูแจก และทำรายบุคคล\")",
        "outputTable": {
          "headers": [
            "สิ่งที่ตรวจ",
            "หลักฐาน"
          ],
          "rows": [
            [
              "ผลลัพธ์",
              "กระดาษคำตอบปลายภาคและ Reflection"
            ],
            [
              "เหตุผล",
              "ทำข้อสอบรายบุคคลและเขียน Reflection สามข้อหลังสอบ"
            ]
          ]
        },
        "explanation": "ตัวอย่างใช้ชุดข้อมูลฉบับพร้อมสอน วันที่เป็น ค.ศ. และรักษาเบอร์โทรเป็นข้อความ",
        "id": "w15-3",
        "stepBadge": "3. ตัวอย่าง"
      },
      {
        "stepType": "step",
        "title": "กิจกรรมสองวันและจุดที่ต้องตรวจ",
        "subtitle": "วันที่หนึ่ง 3 คาบ วันที่สอง 2 คาบ คาบละ 60 นาที",
        "steps": [
          {
            "num": "1",
            "title": "วันที่หนึ่ง: แนวคิดและส่วน A",
            "desc": "อภิปราย/ความรู้ 60 นาที แล้วทำตัวอย่างและใบงาน 120 นาที"
          },
          {
            "num": "2",
            "title": "วันที่สอง: ส่วน B",
            "desc": "ทำข้อสอบรายบุคคลและเขียน Reflection สามข้อหลังสอบ"
          },
          {
            "num": "3",
            "title": "ตรวจและส่งหลักฐาน",
            "desc": "กระดาษคำตอบปลายภาคและ Reflection"
          }
        ],
        "traps": [
          {
            "error": "FileNotFoundError",
            "cause": "ยังไม่ได้อัปโหลดชุดข้อมูลที่ระบุ",
            "solution": "ดาวน์โหลดไฟล์ในแถบชุดเรียน แล้วอัปโหลดลง Colab"
          },
          {
            "error": "ผลคำนวณไม่ตรงความหมายข้อมูล",
            "cause": "ใช้ราคาต่อหน่วยแทนยอดรวม หรือไม่ตรวจชนิดข้อมูล",
            "solution": "ตรวจเวลาเรียนและกรณีพิเศษตามระเบียบสถานศึกษาก่อนตัดสินผล"
          }
        ],
        "id": "w15-4",
        "stepBadge": "4. ขั้นตอน"
      },
      {
        "stepType": "challenge",
        "title": "ตรวจความเข้าใจและต่อยอด",
        "subtitle": "ทำข้อสอบรายบุคคลและเขียน Reflection สามข้อหลังสอบ",
        "challengeType": "fill_blank",
        "question": "เติมส่วนที่ขาดให้คำสั่งถูกต้อง แล้วอธิบายว่าจะตรวจผลอย่างไร",
        "codeTemplate": "______(\"ทบทวนก่อนสอบและสะท้อนการเรียนรู้หลังสอบ\")",
        "answers": [
          "print"
        ],
        "hints": "ย้อนดูหน้าคำสั่งสำคัญ และตรวจตัวพิมพ์กับวงเล็บ",
        "fullSolution": "print(\"ทบทวนก่อนสอบและสะท้อนการเรียนรู้หลังสอบ\")",
        "colabTask": "ทำข้อสอบรายบุคคลและเขียน Reflection สามข้อหลังสอบ",
        "id": "w15-5",
        "stepBadge": "5. ฝึกและอธิบาย"
      }
    ]
  }
];
