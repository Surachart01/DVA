"""Build the reviewed, standalone Week 3 Monday cleansing lesson and executable assets."""
from pathlib import Path
import ast,contextlib,csv,io,json,os,shutil,tempfile,zipfile
import pandas as pd
P=Path(__file__).resolve().parents[1]; B=P.parent/'ชุดพร้อมสอน_31901-2012'; PUBLIC=P/'public/ชุดเรียน'; F=B/'เรียนย้อนหลัง_สัปดาห์03'; T=B/'สำหรับครู'; DATA=B/'ชุดข้อมูล'
for d in [F,T,DATA,PUBLIC/'ชุดข้อมูล']:d.mkdir(parents=True,exist_ok=True)
COLS=['order_id','order_date','product_name','quantity','unit_price','payment_method','status']
def rows(n,prefix):
 return [dict(zip(COLS,[f'{prefix}{i:04}',f'2026-11-{(i-1)%5+1:02}', [' สมุด ','ปากกา','แฟ้ม'][i%3],str(i%4+1),['฿1,250','250 บาท','99.00'][i%3],['CASH','โอนเงิน','เงินสด'][i%3],'ขาย'])) for i in range(1,n+1)]
review=rows(22,'R');review[2]['quantity']='';review[4]['product_name']=' แฟ้ม ';review[6]['payment_method']='สด';review[8]['unit_price']='';review += [review[1].copy(),review[12].copy()]
advanced=rows(36,'')
advanced[0]['product_name']='   ';advanced[1]['quantity']='-';advanced[2]['unit_price']='ไม่ระบุ';advanced[3]['payment_method']='N/A';advanced[4]['unit_price']='ฟรี';advanced[5]['unit_price']='สอบถาม';advanced[6]['order_date']='31/02/2026';advanced[7]['order_date']='03/11/2026';advanced[12]['payment_method']='QR';advanced[14]['order_date']='';advanced[18]['quantity']='สอง';advanced[19]['unit_price']=' 2,450 บาท '
advanced += [advanced[20].copy(),advanced[21].copy(),advanced[22].copy(),advanced[23].copy()]
final=rows(16,'F');final[0]['product_name']='ไม่ระบุ';final[1]['unit_price']='-';final[2]['unit_price']='฿2,100';final[3]['order_date']='31/02/2026';final[4]['order_date']='05/11/2026';final[5]['payment_method']='QR';final[7]['quantity']='ไม่ระบุ';final += [final[8].copy(),final[9].copy()]
files=['w03_review_basic.csv','w03_online_orders_dirty.csv','w03_final_orders_dirty.csv']
for name,data in zip(files,[review,advanced,final]):
 with (DATA/name).open('w',encoding='utf-8-sig',newline='') as f:
  w=csv.DictWriter(f,fieldnames=COLS);w.writeheader();w.writerows(data)
 shutil.copy2(DATA/name,PUBLIC/'ชุดข้อมูล'/name);shutil.copy2(DATA/name,F/name)
RULES=['รหัสคำสั่งซื้อเป็นข้อความ ต้องรักษาเลขศูนย์นำหน้า หนึ่ง order_id แทนหนึ่งรายการขาย และชุดฝึกนี้มีเฉพาะแถวซ้ำที่เหมือนกันทุกคอลัมน์', 'ค่าว่างที่บันทึกเป็นข้อความ ได้แก่ ข้อความว่าง ช่องว่าง เครื่องหมาย - คำว่า ไม่ระบุ และ N/A ต้องปรับเป็นค่าว่างมาตรฐาน ไม่เดาราคาหรือจำนวนที่ยังไม่ทราบ', 'ราคาใช้หน่วยบาทและไม่ติดลบ คำว่า ฟรี ได้รับการยืนยันในกติกาชุดฝึกว่าหมายถึงราคา 0 บาท ส่วนคำว่า สอบถาม ยังไม่ทราบราคา', 'วันที่ยอมรับเฉพาะ YYYY-MM-DD และ DD/MM/YYYY ปี ค.ศ. โดย 03/11/2026 หมายถึง 3 พฤศจิกายน 2026 วันที่ไม่มีจริงต้องแยกไว้ตรวจสอบ', 'ข้อมูลในคาบนี้เป็นรายการขายที่จำนวนต้องเป็นจำนวนเต็มบวก คำศัพท์ช่องทางชำระเงินที่พบทั้งหมดมีความหมายตามตารางจับคู่คำที่กำหนด', 'แยกข้อมูลที่มีคอลัมน์จำเป็นครบออกจากรายการที่ยังมีค่าว่างหลังแปลง โดยเก็บทั้งสองชุดและตรวจสอบจำนวนแถวให้ตรงกันก่อนส่งออก']
# Every numbered step has one main transformation and a paired real output.
steps=[]
def S(title,code,meaning,parts,check,caution='ตรวจผลลัพธ์ให้ตรงกับขั้นตอนก่อนเริ่มคำสั่งถัดไป'):
 steps.append(dict(title=title,code=code,meaning=meaning,parts=[dict(token=a,meaning=b) for a,b in parts],checkpoint=check,mistake=caution))
S('นำเข้าไลบรารี pandas', 'import pandas as pd\nprint(pd.__version__)', 'สร้าง Notebook ใหม่ แล้ว import pandas เพื่อใช้จัดการข้อมูลในตาราง', [('import pandas as pd', 'นำเข้าไลบรารีโดยใช้ชื่อย่อ pd')], 'เมื่อเริ่ม Runtime ใหม่ ต้องรันคำสั่งใดก่อนใช้งาน pd', 'เลขรุ่น pandas อาจต่างจากตัวอย่างได้ แต่ต้องนำเข้าไลบรารีสำเร็จก่อนใช้งาน pd')
S('อ่านไฟล์โดยรักษารหัสและค่าว่างในไฟล์ต้นฉบับ', "raw = pd.read_csv('w03_online_orders_dirty.csv',\n    dtype='string', keep_default_na=False)\nprint(raw.shape)\nraw.head()", 'อ่านทุกคอลัมน์เป็นข้อความ และคงข้อความ N/A กับช่องว่างไว้ตรวจสอบเอง', [("dtype='string'", 'รักษารหัสที่มีเลขศูนย์นำหน้า'), ('keep_default_na=False', 'ยังไม่แปลงข้อความค่าว่างแทนผู้ใช้')], 'รหัส 0001 ยังมีเลขศูนย์นำหน้าหรือไม่', 'อัปโหลดไฟล์ w03_online_orders_dirty.csv ก่อนรัน และใช้ตัวพิมพ์ชื่อไฟล์ให้ตรงกัน')
S('สำรวจค่าที่อาจเป็นค่าว่างก่อนแก้ไข', "print(raw.dtypes)\ncolumns_to_check = ['product_name', 'quantity',\n    'unit_price', 'payment_method', 'order_date']\nfor column in columns_to_check:\n    print('\\nคอลัมน์:', column)\n    print(raw[column].value_counts(dropna=False))", "ใช้ value_counts() รวมค่าที่เหมือนกันและนับจำนวน จึงไม่ต้องอ่านข้อมูลทีละแถว แม้มี 10,000 แถว ข้อความว่างและช่องว่างอาจแสดงเป็นบรรทัดที่ไม่มีข้อความ จึงต้องตรวจความหมายก่อนแทนค่า จากผลลัพธ์ให้เลือกค่าที่น่าสงสัย แล้วตรวจความหมายกับเงื่อนไขของชุดข้อมูลก่อนแก้ไข", [('columns_to_check', 'เลือกคอลัมน์ที่ต้องตรวจ ไม่รวมรหัสที่แต่ละรายการมีค่าต่างกัน'), ('for column in columns_to_check:', 'ตรวจทีละคอลัมน์ตามรายชื่อที่กำหนด'), ('.value_counts(dropna=False)', 'นับจำนวนของแต่ละค่า โดยนับรวมค่าว่างที่โปรแกรมรู้จักด้วย'), ('print(...)', 'แสดงค่าที่นับได้โดยตรง ไม่ต้องสร้างตัวแปรเพิ่มเติม')], 'พบข้อความใดที่อาจแทนค่าว่าง ในคอลัมน์ใด และมีจำนวนเท่าใด เหตุใดคำว่า ฟรี กับ สอบถาม จึงยังไม่ควรถูกแทนเป็น pd.NA ทันที', 'รายการที่นับได้เป็นข้อมูลสำหรับตรวจสอบ ไม่ใช่ข้อสรุปว่าค่าใดผิด ชุดนี้ยืนยันว่าข้อความว่าง ช่องว่าง - ไม่ระบุ และ N/A แทนค่าว่าง ส่วน ฟรี หมายถึง 0 บาท และ สอบถาม ยังไม่ทราบราคา หากมีค่าที่ไม่ซ้ำจำนวนมาก ให้ตรวจรูปแบบและเงื่อนไขเฉพาะคอลัมน์เพิ่มเติม เช่น ราคาและวันที่ในขั้นตอนถัดไป ไม่พิจารณาเฉพาะค่าที่พบบ่อย หากผลลัพธ์มี ... แสดงว่ารายการถูกย่อ ไม่ได้แสดงทุกค่า')
S('สร้างสำเนาและตัดช่องว่างทุกคอลัมน์', 'df = raw.copy()\nfor column in df.columns:\n    df[column] = df[column].str.strip()\ndf.head()', 'เก็บ raw ไว้เปรียบเทียบ แล้ววนทำ .str.strip() ให้แต่ละคอลัมน์', [('.copy()', 'แยกตารางที่จะปรับปรุงจากต้นฉบับ'), ('for column in df.columns:', 'ทำคำสั่งกับแต่ละชื่อคอลัมน์'), ('.str.strip()', 'ตัดช่องว่างหัวท้ายข้อความ')], 'หลังดำเนินการ raw เปลี่ยนตาม df หรือไม่', 'บรรทัดภายใน for ต้องเยื้อง 4 ช่อง และอย่าใช้ .strip() ตัดช่องว่างภายในชื่อสินค้าโดยไม่พิจารณาความหมาย')
S('เปลี่ยนข้อความที่แทนค่าว่างเป็น pd.NA', "df = df.replace(['', '-', 'ไม่ระบุ', 'N/A'], pd.NA)\ndf.isna().sum()", 'ใช้ผลสำรวจจากขั้นตอนที่ 3 และเงื่อนไขของชุดข้อมูลยืนยันรายการก่อนแทนค่า: ข้อความว่าง ช่องว่าง - ไม่ระบุ และ N/A หมายถึงไม่มีข้อมูล หลังขั้นตอนที่ 4 ช่องว่างล้วนจะเป็นข้อความว่างแล้ว จึงแทนค่าที่ตกลงไว้ด้วย pd.NA และนับผลอีกครั้ง ไม่เพิ่มคำอื่นในรายการโดยคาดเดา', [('.replace([...], pd.NA)', 'แทนข้อความหลายรูปแบบเป็นค่าว่างมาตรฐาน')], 'คอลัมน์ใดมีค่าว่างเพิ่มขึ้นหลังปรับมาตรฐาน', 'ค่าจำนวน -2 ไม่ใช่ข้อความ - จึงไม่ถูกแทนเป็นค่าว่าง และค่าว่างไม่ได้แปลว่า 0')
S('ปรับชื่อช่องทางชำระเงินให้ตรงกัน', "payment_map = {'CASH': 'เงินสด', 'สด': 'เงินสด',\n    'โอนเงิน': 'พร้อมเพย์', 'โอน': 'พร้อมเพย์', 'QR': 'พร้อมเพย์'}\ndf['payment_method'] = df['payment_method'].replace(payment_map)\nprint(df['payment_method'].value_counts(dropna=False))", 'รวมเฉพาะคำที่กติกาชุดฝึกยืนยันว่ามีความหมายเดียวกัน', [('payment_map', 'Dictionary สำหรับจับคู่ชื่อเดิมกับชื่อใหม่'), ('.replace(payment_map)', 'แทนคำเฉพาะที่ระบุใน Dictionary')], 'หลังปรับชื่อให้ตรงกันเหลือช่องทางชำระเงินกี่รูปแบบ', 'คำที่ไม่ทราบความหมายต้องตรวจสอบ ไม่กำหนดให้เป็นหมวดที่มีอยู่โดยอัตโนมัติ')
S('ตัดสัญลักษณ์และหน่วยออกจากราคา', "price_text = (df['unit_price']\n    .str.replace('฿', '', regex=False)\n    .str.replace('บาท', '', regex=False)\n    .str.replace(',', '', regex=False)\n    .str.strip())\nprice_text.head(10)", 'ตัดเฉพาะเครื่องหมายที่กำหนด โดยยังไม่เดาราคาที่ไม่ทราบ', [('regex=False', 'แทนข้อความตามที่ระบุ โดยไม่ใช้รูปแบบค้นหาพิเศษ'), (".str.replace(',', '')", 'เอาเครื่องหมายคั่นหลักพันออก')], 'ข้อความ ฿1,250 กลายเป็นข้อความใดก่อนแปลงเป็นตัวเลข')
S('แปลงราคาเป็นตัวเลขและตรวจค่าที่แปลงไม่ได้', "price_text = price_text.replace({'ฟรี': '0'})\ndf['unit_price'] = pd.to_numeric(price_text, errors='coerce')\ndf.loc[df['unit_price'].isna(), ['order_id', 'unit_price']]", 'แปลงราคาที่จัดรูปแบบแล้วเป็นตัวเลข ค่าที่แปลงไม่ได้จะเป็นค่าว่าง ให้แยกไว้ตรวจสอบ', [("{'ฟรี': '0'}", 'ในชุดข้อมูลนี้ กำหนดให้คำว่า ฟรี หมายถึง 0 บาท'), ("errors='coerce'", 'เปลี่ยนค่าที่แปลงไม่ได้เป็นค่าว่าง โดยให้โค้ดทำงานต่อได้')], 'คำว่า สอบถาม กลายเป็นราคา 0 หรือค่าว่าง', 'errors=coerce ไม่ได้แก้ข้อมูลให้ถูกต้อง ต้องนับและติดตามรายการที่แปลงไม่ได้ พร้อมเทียบ raw')
S('แปลงจำนวนสินค้าเป็นตัวเลข', "df['quantity'] = pd.to_numeric(df['quantity'], errors='coerce')\ndf[['order_id', 'quantity']].head(20)", 'แปลงข้อความจำนวนเป็นตัวเลข และเก็บค่าที่แปลงไม่ได้เป็นค่าว่างเพื่อแยกตรวจสอบ', [('pd.to_numeric(...)', 'แปลงข้อความจำนวนเป็นตัวเลข')], 'ข้อความจำนวนที่แปลงไม่ได้ควรเติมเป็น 1 ทันทีหรือไม่', 'ชุดฝึกนี้ใช้รายการขายที่มีจำนวนเต็มบวกเท่านั้น และไม่กำหนดให้จำนวนที่ไม่ทราบเท่ากับ 1')
S('แปลงวันที่รูปแบบ YYYY-MM-DD', "df['date_clean'] = pd.to_datetime(df['order_date'],\n    format='%Y-%m-%d', errors='coerce')\ndf[['order_id', 'order_date', 'date_clean']].head(10)", 'แปลงวันที่รูปแบบ YYYY-MM-DD อย่างชัดเจน ค่าที่ไม่ตรงจะเป็น NaT', [("format='%Y-%m-%d'", 'ปี 4 หลัก เดือน และวัน คั่นด้วยขีด'), ('NaT', 'ค่าว่างของข้อมูลวันที่')], 'วันที่ 03/11/2026 ยังแปลงไม่ได้ในขั้นนี้ เพราะเหตุใด')
S('แปลงวันที่รูปแบบ DD/MM/YYYY', "slash_dates = pd.to_datetime(df['order_date'],\n    format='%d/%m/%Y', errors='coerce')\ndf['date_clean'] = df['date_clean'].fillna(slash_dates)\ndf.loc[df['date_clean'].isna(), ['order_id', 'order_date']]", 'ลองรูปแบบ DD/MM/YYYY สำหรับค่าที่ยังแปลงไม่ได้ แล้วเติมจากวันที่ที่แปลงสำเร็จเท่านั้น', [("format='%d/%m/%Y'", 'กำหนดวันก่อนเดือน'), ('.fillna(slash_dates)', 'ใช้ผลแปลงอีกชุดเฉพาะตำแหน่งที่ว่าง')], '31/02/2026 ต้องได้วันที่ใดหรือควรแยกตรวจสอบ', 'ห้ามใช้วันที่วันนี้แทนวันที่ไม่มีจริงโดยไม่มีหลักฐาน และวันที่ 03/11/2026 ของชุดนี้หมายถึง 3 พฤศจิกายน')
S('ลบแถวซ้ำที่เหมือนกันทุกคอลัมน์', "print('แถวซ้ำ:', df.duplicated().sum())\ndf = df.drop_duplicates().copy()\nprint('หลังลบแถวซ้ำ:', df.shape)", 'ตรวจและลบแถวซ้ำที่เหมือนกันทุกคอลัมน์ หลังจัดรูปแบบแล้ว', [('.duplicated().sum()', 'นับแถวซ้ำโดยไม่นับแถวแรก'), ('.drop_duplicates()', 'ลบเฉพาะแถวซ้ำที่เหมือนกันทุกคอลัมน์')], 'จำนวนแถวลดลงเท่าใด และลบแถวซ้ำที่เหมือนกันทุกคอลัมน์หรือไม่')
S('ตรวจคุณภาพและแยกรายการที่ยังมีค่าว่าง', "required = ['order_id', 'date_clean', 'product_name',\n    'quantity', 'unit_price', 'payment_method', 'status']\nprint(df[required].isna().sum())\nready = df.dropna(subset=required)[required].copy()\nreview = df.loc[df[required].isna().any(axis=1)].copy()\nprint('พร้อมใช้งาน:', ready.shape)\nprint('รอตรวจสอบ:', review.shape)", 'ตรวจคอลัมน์จำเป็นหลังแปลงข้อมูล แยกรายการที่ยังไม่ครบไว้ตรวจสอบ และรักษา raw ไว้เปรียบเทียบ', [('required', 'รายชื่อคอลัมน์จำเป็นสำหรับใช้งาน'), ('.dropna(subset=required)', 'เลือกเฉพาะรายการที่มีข้อมูลจำเป็นครบ'), ('.isna().any(axis=1)', 'ตรวจว่าแถวนั้นมีค่าว่างอย่างน้อยหนึ่งคอลัมน์')], 'ready รวมกับ review เท่ากับจำนวนแถวหลังลบแถวซ้ำหรือไม่', 'จำนวนแถวที่ครบไม่ได้ยืนยันความถูกต้องทุกด้าน ชุดฝึกนี้กำหนดว่ารายการที่มีค่าครบจะเป็นไปตามกติกา ส่วนค่าว่างต้องตรวจหลักฐานก่อนเติม')
S('Export ไฟล์ CSV', "ready.to_csv('w03_orders_ready.csv',\n    index=False, encoding='utf-8-sig')\nreview.to_csv('w03_orders_review.csv',\n    index=False, encoding='utf-8-sig')", 'บันทึกข้อมูลเป็นไฟล์ CSV สองไฟล์: ready สำหรับข้อมูลพร้อมใช้งาน และ review สำหรับรายการรอตรวจสอบ จากนั้นดาวน์โหลดผ่านแถบ Files ใน Google Colab', [('ready.to_csv(...)', 'บันทึกตาราง ready เป็นไฟล์ w03_orders_ready.csv'), ('review.to_csv(...)', 'บันทึกตาราง review เป็นไฟล์ w03_orders_review.csv'), ('index=False', 'ไม่บันทึกเลขลำดับแถวเป็นคอลัมน์เพิ่ม'), ("encoding='utf-8-sig'", 'กำหนดการเข้ารหัสไฟล์เพื่อให้ Excel อ่านภาษาไทยได้ถูกต้อง')], 'ไฟล์ใดเก็บข้อมูลพร้อมใช้งาน และไฟล์ใดเก็บรายการรอตรวจสอบ', 'เมื่อรันสำเร็จ คำสั่ง to_csv() จะไม่แสดงตารางผลลัพธ์ ให้กดรีเฟรชที่แถบ Files แล้วดาวน์โหลดไฟล์ CSV ทั้งสองไฟล์')
# Explain row filtering where .loc first appears and where it is reused.
steps[7]['meaning'] = 'เป้าหมายคือค้นหารายการที่ราคายังว่างหลังแปลงเป็นตัวเลข เพื่อทราบว่ารายการใดต้องตรวจสอบต่อ โดย pd.to_numeric() แปลงข้อความเป็นตัวเลข จากนั้น .isna() ตรวจว่าราคาในแต่ละแถวว่างหรือไม่ และ .loc ใช้ผลตรวจนั้นเลือกเฉพาะแถวที่ราคาว่าง พร้อมแสดงรหัสคำสั่งซื้อและราคา ผลลัพธ์เป็นตารางย่อยสำหรับตรวจสอบ ไม่ได้ลบแถวออกจาก df'
steps[7]['parts'] = [
 dict(token="pd.to_numeric(price_text, errors='coerce')", meaning="หน้าที่: แปลงข้อความราคาเป็นตัวเลข เช่น ข้อความ 1250 กลายเป็นตัวเลข 1250 ส่วน errors='coerce' ให้ค่าที่แปลงไม่ได้ เช่น สอบถาม กลายเป็นค่าว่าง เพื่อให้ตรวจสอบต่อได้"),
 dict(token="price_text.replace({'ฟรี': '0'})", meaning='หน้าที่: เปลี่ยนคำว่า ฟรี เป็นข้อความ 0 ก่อนแปลงเป็นตัวเลข ตามเงื่อนไขของชุดข้อมูลนี้'),
 dict(token="df['unit_price'].isna()", meaning='หน้าที่: ตรวจราคาแต่ละแถวว่าเป็นค่าว่างหรือไม่ ผลลัพธ์เป็น True หรือ False ตามลำดับแถว เช่น ราคา 250 ได้ False ส่วนราคาว่างได้ True คำสั่งนี้ตรวจอย่างเดียว ยังไม่ได้เลือกหรือลบแถว'),
 dict(token='df.loc[เงื่อนไขเลือกแถว, รายชื่อคอลัมน์]', meaning='หน้าที่: เลือกข้อมูลบางส่วนจากตาราง df ในตัวอย่างนี้ใช้กรองแถวตามผล True/False จาก .isna() โดยเก็บเฉพาะแถวที่ได้ True แล้วเลือกคอลัมน์ที่ต้องการแสดง ผลที่ได้เป็นตารางย่อย ไม่ได้แก้ไขตารางต้นฉบับ'),
 dict(token="['order_id', 'unit_price']", meaning='หน้าที่: ระบุให้ตารางผลลัพธ์แสดงรหัสคำสั่งซื้อกับราคาเท่านั้น เพื่อระบุได้ว่าราคาที่ว่างเป็นของรายการใด'),
 dict(token="df.loc[df['unit_price'].isna(), ['order_id', 'unit_price']]", meaning='อ่านทั้งบรรทัดว่า: จากตาราง df ให้แสดงรหัสคำสั่งซื้อและราคา เฉพาะรายการที่ราคาว่าง ตัวอย่าง หากราคา 3 แถวเป็น 250, ค่าว่าง, 99 จะได้ผลลัพธ์เฉพาะแถวที่สอง พร้อมรหัสคำสั่งซื้อของแถวนั้น'),
]
steps[7]['checkpoint'] = 'ถ้าเงื่อนไขได้ True, False, True จะเลือกแถวใด และแสดงคอลัมน์ใด คำสั่งนี้ลบแถวออกจาก df หรือไม่'
steps[7]['mistake'] += ' .loc ในบรรทัดนี้ใช้แสดงข้อมูลเท่านั้น ไม่มีการกำหนดค่าด้วย = จึงไม่ได้แก้ไข df และค่าว่างที่พบอาจมีมาตั้งแต่ต้นหรือเกิดจากการแปลงไม่สำเร็จ'
steps[10]['parts'] += [
 dict(token="df.loc[df['date_clean'].isna(), ['order_id', 'order_date']]", meaning='หน้าที่: กรองรายการที่ยังแปลงวันที่ไม่ได้ โดย .isna() ตรวจ date_clean แล้ว .loc เลือกเฉพาะแถวที่ได้ True ผลลัพธ์แสดงรหัสกับวันที่ต้นฉบับ เพื่อค้นหาวันที่ที่ต้องตรวจสอบ เช่น 31/02/2026'),
]
steps[12]['parts'] += [
 dict(token='df.loc[df[required].isna().any(axis=1)]', meaning='หน้าที่: เลือกรายการที่ข้อมูลยังไม่ครบ โดย .isna() ตรวจแต่ละช่อง และ .any(axis=1) รวมผลตามแถว: ถ้ามีค่าว่างอย่างน้อยหนึ่งช่องจะได้ True จากนั้น .loc เลือกแถวนั้นพร้อมทุกคอลัมน์ เพื่อนำไปเก็บใน review'),
 dict(token='review = ... .copy()', meaning='เก็บสำเนาแถวที่เลือกไว้ใน review โดย df ยังมีแถวเหล่านั้นอยู่'),
]
REVIEW_RULES=['ราคาและจำนวนที่ว่างในชุดทบทวนนี้ต้องแยกออกจากชุดพร้อมใช้งาน ไม่เติมเป็น 0 หรือ 1','วันที่ใช้ YYYY-MM-DD ราคาอาจมีเครื่องหมาย ฿ คำว่า บาท และเครื่องหมายคั่นหลักพัน','ลบเฉพาะแถวที่ซ้ำกันทุกคอลัมน์ ช่องทาง CASH และ สด หมายถึง เงินสด ส่วน โอนเงิน หมายถึง พร้อมเพย์']
warm_tasks=[('นำเข้าและสำรวจข้อมูล','สร้าง Notebook ใหม่ อัปโหลด w03_review_basic.csv นำเข้า pandas อ่านไฟล์ และตรวจขนาดตาราง ชนิดข้อมูล กับค่าว่าง'),('ปรับข้อความให้เป็นรูปแบบเดียวกัน','ตัดช่องว่างชื่อสินค้าและช่องทางชำระเงิน รวม CASH และ สด เป็น เงินสด และ โอนเงิน เป็น พร้อมเพย์'),('แปลงราคาและตรวจค่าว่าง','ตัด ฿ คำว่า บาท และเครื่องหมายคั่นหลักพันก่อนแปลงราคาเป็นตัวเลข ตรวจ quantity และ unit_price ที่ว่าง แล้วแยกรายการเหล่านั้นไว้ตรวจสอบ'),('ตรวจและลบแถวซ้ำ','ตรวจว่ามีแถวซ้ำกี่แถว แล้วลบแถวที่ข้อมูลเหมือนกันทุกคอลัมน์ โดยเก็บแถวแรกไว้ จากนั้นแสดงจำนวนแถวที่เหลือ และตรวจว่ายังมีแถวซ้ำหรือไม่'),('ส่งออกและอ่านกลับ','ส่งออก w03_review_basic_clean.csv โดยไม่บันทึก index แล้วอ่านกลับ ตรวจขนาดตารางและรักษา order_id เป็นข้อความ')]
final_tasks=[('นำเข้าข้อมูลใหม่','สร้าง Notebook ใหม่ อัปโหลด w03_final_orders_dirty.csv และอ่านทุกคอลัมน์เป็นข้อความโดยรักษาสัญลักษณ์ค่าว่างไว้ก่อน ตรวจขนาดตารางและตัวอย่างข้อมูล'),('ปรับข้อความและค่าว่างที่บันทึกเป็นข้อความ','ตัดช่องว่างหัวท้าย แทนค่าว่างที่บันทึกเป็นข้อความเป็น pd.NA และรวมคำศัพท์ช่องทางชำระเงินตามกติกาเดียวกับตัวอย่าง'),('แปลงราคาและจำนวนสินค้า','ตัดสัญลักษณ์กับหน่วยราคา แปลงราคาและจำนวนเป็นตัวเลขโดยแยกรายการที่แปลงไม่ได้ไว้ตรวจสอบ'),('ตรวจวันที่และลบแถวซ้ำ','แปลงวันที่ทั้ง 2 รูปแบบ ตรวจวันที่ที่แปลงไม่ได้ และลบแถวซ้ำที่เหมือนกันทุกคอลัมน์ พร้อมระบุจำนวนแถวที่ลดลง'),('แยกผลลัพธ์ ตรวจคุณภาพ และส่งออก','ใช้เงื่อนไขเดียวกับชุดฝึกแยกข้อมูลพร้อมใช้งานกับรายการรอตรวจสอบ ส่งออก w03_final_ready.csv และ w03_final_review.csv โดยไม่บันทึกเลขลำดับแถวเป็นคอลัมน์เพิ่ม')]
def mdcell(t):return dict(cell_type='markdown',metadata={},source=t.splitlines(keepends=True))
def codecell(t='',n=None,outputs=None):return dict(cell_type='code',metadata={},source=t.splitlines(keepends=True),execution_count=n,outputs=outputs or [])
def notebook(path,cells):path.write_text(json.dumps(dict(cells=cells,metadata={'kernelspec':{'display_name':'Python 3','language':'python','name':'python3'}},nbformat=4,nbformat_minor=5),ensure_ascii=False,indent=2)+'\n')
def worksheet(title,tasks,rules,name,graded):
 text=f'# {title}\n\nรายวิชา 31901-2012 การวิเคราะห์และนำเสนอข้อมูล\n\nชื่อและนามสกุล ................................ รหัสนักศึกษา ................................ ชั้นและกลุ่ม ................................\n\n'+('เวลา 30 นาที · 5 ข้อ ข้อละ 2 คะแนน รวม 10 คะแนน\n\n' if graded else 'เวลา 45 นาที · แบบฝึกหัดทบทวน ไม่เก็บคะแนน\n\n')+f'ชุดข้อมูล {name} · เริ่ม Notebook ใหม่และดำเนินการตามลำดับ\n\n## เงื่อนไข\n'+''.join('- '+x+'\n' for x in rules)
 for i,(a,b) in enumerate(tasks,1):text+=f'\n## ข้อที่ {i} {a}\n\n{b}\n\nคำสั่งที่ใช้และผลที่ตรวจสอบได้\n\n................................................................................................\n\nคำอธิบาย\n\n................................................................................................\n'
 text+='\n## การส่งงาน\nส่ง Notebook หรือไฟล์ .ipynb พร้อมคำตอบและไฟล์ CSV ตามชื่อที่กำหนด ใช้ผลจากการรันจริง\n'
 return text
warm_md=worksheet('แบบฝึกหัดทบทวนก่อนเรียนการทำความสะอาดข้อมูล',warm_tasks,REVIEW_RULES,files[0],False);final_md=worksheet('แบบฝึกหัดท้ายคาบการทำความสะอาดข้อมูลขั้นประยุกต์',final_tasks,RULES,files[2],True)
(F/'W03_Review_Worksheet.md').write_text(warm_md);(F/'W03_Final_Worksheet.md').write_text(final_md)
for name,text,tasks in [('W03_Review_Practice.ipynb',warm_md,warm_tasks),('W03_Final_Practice.ipynb',final_md,final_tasks)]:
 cells=[mdcell(text.split('## ข้อที่ 1')[0])]
 for i,(a,b) in enumerate(tasks,1):cells += [mdcell(f'## ข้อที่ {i} {a}\n\n{b}'),codecell(),mdcell('สรุปผลและคำอธิบาย: ................................')]
 notebook(F/name,cells)
slides=[]
def content(id,title,items,downloads=None,module='practice'):
 v=dict(id='w3-advanced-'+id,type='content',title=title,items=items,teachingDays=[0],module=module)
 if downloads:v['downloads']=downloads
 return v
def dl(label,name,data=False):return dict(label=label,url='ชุดเรียน/'+('ชุดข้อมูล/' if data else 'เรียนย้อนหลัง_สัปดาห์03/')+name)
slides.append(dict(id='w3-advanced-review',type='practice-lab',title='แบบฝึกหัดทบทวนก่อนเรียน',intro='เริ่ม Notebook ใหม่ · เวลา 45 นาที · ไม่เก็บคะแนน',questions=[dict(title=a,task=b) for a,b in warm_tasks],rules=REVIEW_RULES,downloads=[dl('ดาวน์โหลดชุดข้อมูลทบทวน',files[0],True),dl('ดาวน์โหลดใบงานทบทวน','W03_Review_Worksheet.md'),dl('ดาวน์โหลด Notebook ทบทวน','W03_Review_Practice.ipynb')],teachingDays=[0],module='review'))
slides.append(content('recall','ตรวจสอบความเข้าใจก่อนเริ่มชุดข้อมูลใหม่',['การตัดช่องว่างกับการแทนค่าคำศัพท์มีหน้าที่ต่างกันอย่างไร','เหตุใดจึงไม่เติมราคาและจำนวนที่ไม่ทราบด้วย 0 ทันที','ลบแถวซ้ำแล้วต้องตรวจจำนวนแถวอย่างไร และ index=False มีหน้าที่ใด'],module='review'))
slides.append(content('files','Get Data: เริ่มจาก Notebook ใหม่',['สร้าง Notebook ใหม่และอัปโหลด w03_online_orders_dirty.csv ผ่านเมนู Files → Upload','ใช้เฉพาะไฟล์ฝึกนี้ เริ่มจาก import pandas as pd และรันคำสั่งทีละเซลล์ตั้งแต่ขั้นตอนที่ 1','ข้อมูลทั้งหมดเป็นข้อมูลสมมติ 40 แถว 7 คอลัมน์ ไม่ต้องใช้ผลจากแบบฝึกหัดก่อนเรียน'],[dl('ดาวน์โหลดชุดข้อมูลฝึกพร้อมกัน',files[1],True),dl('ดาวน์โหลด Notebook สำหรับฝึก','W03_Advanced_Practice.ipynb'),dl('ดาวน์โหลด Notebook ตัวอย่างพร้อมผลลัพธ์','W03_Advanced_Example.ipynb')]))
slides.append(content('rules','ความหมายของข้อมูลและเงื่อนไขก่อนแก้ไข',RULES[:4]))
slides.append(content('decision','รายการที่แก้ได้และรายการที่ต้องตรวจสอบ',RULES[4:]+['ก่อนแก้ไขให้ตรวจค่าต้นทาง หลังแก้ไขให้ตรวจผลและตรวจสอบจำนวนแถวให้ตรงกัน ไม่เปลี่ยนค่าที่ไม่ทราบเป็นค่าที่คาดเดา']))
intro='# การทำความสะอาดข้อมูลขั้นประยุกต์\n\nเริ่ม Notebook ใหม่ อัปโหลด w03_online_orders_dirty.csv แล้วรันทีละขั้นตอน\n\n'+''.join('- '+x+'\n' for x in RULES)
practice=[mdcell(intro)];example=[mdcell(intro)];guide=[intro]; outputs=[]
def run(code,ns,n):
 tree=ast.parse(code);last=tree.body[-1];buf=io.StringIO();value=None
 with contextlib.redirect_stdout(buf):
  if isinstance(last,ast.Expr):
   exec(compile(ast.Module(body=tree.body[:-1],type_ignores=[]),'lesson','exec'),ns);value=eval(compile(ast.Expression(last.value),'lesson','eval'),ns)
  else:exec(compile(tree,'lesson','exec'),ns)
 prefix=buf.getvalue();string=prefix+(value.to_string() if isinstance(value,(pd.DataFrame,pd.Series)) else str(value) if value is not None else '')
 if isinstance(value,pd.DataFrame) and not prefix:
  small=value.head(10);out=dict(kind='table',title='ผลลัพธ์จากการรันคำสั่ง',columns=['ลำดับแถว']+list(map(str,small.columns)),rows=[[str(ix)]+[('ว่าง' if pd.isna(v) else str(v)) for v in row] for ix,row in small.iterrows()],note=f'ตารางผลลัพธ์ทั้งหมด {len(value)} แถว {len(value.columns)} คอลัมน์ · แสดงตัวอย่างไม่เกิน 10 แถว')
 else:out=dict(kind='text',title='ผลลัพธ์จากการรันคำสั่ง',text=string)
 nb=[dict(output_type='stream',name='stdout',text=string.splitlines(keepends=True))] if string else []
 return out,nb,string
old=os.getcwd()
with tempfile.TemporaryDirectory(prefix='dva-advanced-') as work:
 os.chdir(work);shutil.copy2(DATA/files[1],files[1]);ns={}
 try:
  for n,s in enumerate(steps,1):
   out,nb,text=run(s['code'],ns,n)
   if n==14:
    assert Path('w03_orders_ready.csv').is_file() and Path('w03_orders_review.csv').is_file()
    out=dict(kind='text',title='ไฟล์ที่บันทึกแล้ว',text='w03_orders_ready.csv\nw03_orders_review.csv\n\nคำสั่งไม่แสดงผลลัพธ์ในเซลล์ ให้ดาวน์โหลดไฟล์จากแถบ Files')
   outputs.append(text)
   write=dict(id=f'w3-advanced-write-{n}',type='guided',step=n,title=f'ขั้นตอนที่ {n}: {s["title"]}',teachingDays=[0],module='practice',instruction='พิมพ์คำสั่งในเซลล์ใหม่ รันด้วย Shift + Enter และตรวจผลก่อนดำเนินการต่อ',run='วิธีรันคำสั่ง: Shift + Enter',code=s['code'],meaning=s['meaning'],parts=s['parts'])
   check=dict(id=write['id']+'-result',type='guided-check',step=n,title=f'ขั้นตอนที่ {n}: ผลลัพธ์และคำอธิบาย',teachingDays=[0],module='practice',code=s['code'],output=out,interpretation=(s['meaning'] if n in [3,5,8,14] else 'เปรียบเทียบผลลัพธ์กับตัวอย่าง แล้วตอบคำถามด้านล่าง'),mistake=s['mistake'],checkpoint=s['checkpoint'])
   slides.extend([write,check]);desc=f'## ขั้นตอนที่ {n} {s["title"]}\n\n{s["meaning"]}\n\n';result='ผลลัพธ์อ้างอิง\n\n```text\n'+text+'\n```\n\nข้อควรระวัง: '+s['mistake']+'\n\nคำถาม: '+s['checkpoint']
   if n in [8,11,13]: desc += ''.join('- `'+p['token']+'`: '+p['meaning']+'\n' for p in s['parts'])+'\n'
   practice += [mdcell(desc),codecell(),mdcell('คำถามตรวจสอบความเข้าใจ: '+s['checkpoint'])];example += [mdcell(desc),codecell(s['code'],n,nb),mdcell(result)];guide += [desc,'```python\n'+s['code']+'\n```\n',result+'\n']
  ready=ns['ready'];pending=ns['review'];cleaned=ns['df'];original=ns['raw'];exact=len(original)-len(cleaned)
  assert len(ready)+len(pending)+exact==40
  assert ready.isna().sum().sum()==0 and ready['order_id'].is_unique
  assert ready['status'].eq('ขาย').all() and ready['quantity'].gt(0).all()
  assert ready['unit_price'].ge(0).all() and (ready['quantity']%1).eq(0).all()
  assert not set(ready['order_id']) & set(pending['order_id'])
  assert len(steps)==14
  report=dict(raw=40,exact_duplicates=exact,ready=len(ready),review=len(pending),missing_by_column={c:int(pending[c].isna().sum()) for c in ns['required']})
  for name in ['w03_orders_ready.csv','w03_orders_review.csv']:shutil.copy2(name,F/name)
 finally:os.chdir(old)
notebook(F/'W03_Advanced_Practice.ipynb',practice);notebook(F/'W03_Advanced_Example.ipynb',example);(F/'W03_Advanced_Guide.md').write_text('\n'.join(guide))
# Run the identical demonstrated pipeline against the unseen final dataset.
with tempfile.TemporaryDirectory(prefix='dva-final-') as work:
 os.chdir(work);shutil.copy2(DATA/files[2],files[1]);ns={}
 try:
  for n,s in enumerate(steps,1):run(s['code'],ns,n)
  assert len(ns['ready'])+len(ns['review'])+ns['raw'].duplicated().sum()==18
  assert ns['ready'].isna().sum().sum()==0 and ns['ready']['order_id'].is_unique
  final_report=dict(raw=18,exact_duplicates=18-len(ns['df']),ready=len(ns['ready']),review=len(ns['review']))
  final_code='\n\n'.join(s['code'] for s in steps).replace(files[1],files[2]).replace('w03_orders_ready.csv','w03_final_ready.csv').replace('w03_orders_review.csv','w03_final_review.csv')
  notebook(T/'W03_Final_Answer.ipynb',[mdcell('# เฉลยแบบฝึกหัดท้ายคาบสำหรับผู้สอน'),codecell(final_code)])
 finally:os.chdir(old)
# Execute and verify the basic review with only previously taught operations.
review_code="""import pandas as pd
basic = pd.read_csv('w03_review_basic.csv', dtype={'order_id': 'string'})
basic['product_name'] = basic['product_name'].str.strip()
basic['payment_method'] = basic['payment_method'].str.strip().replace({'CASH':'เงินสด','สด':'เงินสด','โอนเงิน':'พร้อมเพย์'})
basic['unit_price'] = basic['unit_price'].str.replace('฿','',regex=False).str.replace('บาท','',regex=False).str.replace(',','',regex=False).str.strip().astype(float)
basic = basic.drop_duplicates().copy()
basic_review = basic.loc[basic[['quantity','unit_price']].isna().any(axis=1)].copy()
basic_clean = basic.dropna(subset=['quantity','unit_price']).copy()
basic_clean.to_csv('w03_review_basic_clean.csv',index=False,encoding='utf-8-sig')
print(basic_clean.shape)
print('รอตรวจสอบ:',len(basic_review))
"""
with tempfile.TemporaryDirectory() as work:
 os.chdir(work);shutil.copy2(DATA/files[0],files[0]);ns={}
 try:
  run(review_code,ns,1);assert len(ns['basic_clean'])+len(ns['basic_review'])+2==24
  warm_report=dict(raw=24,exact_duplicates=2,ready=len(ns['basic_clean']),review=len(ns['basic_review']))
 finally:os.chdir(old)
notebook(T/'W03_Review_Answer.ipynb',[mdcell('# เฉลยแบบฝึกหัดทบทวนสำหรับผู้สอน'),codecell(review_code)])
key='# แนวเฉลยและเกณฑ์ประเมินสัปดาห์ที่ 3 วันจันทร์\n\nสำหรับผู้สอนเท่านั้น\n\n## ทบทวนก่อนเรียน\n'+json.dumps(warm_report,ensure_ascii=False,indent=2)+'\n\n```python\n'+review_code+'\n```\n\n## ชุดฝึกพร้อมกัน\n'+json.dumps(report,ensure_ascii=False,indent=2)+'\n\n## แบบฝึกหัดท้ายคาบ\n'+json.dumps(final_report,ensure_ascii=False,indent=2)+'\n\n'+''.join(f'ข้อที่ {i}: 2 คะแนน — คำสั่งถูกต้อง 1 คะแนน และผลลัพธ์พร้อมคำอธิบายตรงตามเงื่อนไข 1 คะแนน\n\n' for i in range(1,6))+'\nยอมรับวิธีที่แตกต่างแต่ให้ผลตามเกณฑ์เดียวกัน ไม่หักคะแนนซ้ำจากข้อผิดพลาดเดิมโดยไม่พิจารณาวิธีทำของข้อปัจจุบัน\n\n```python\n'+final_code+'\n```\n'
(T/'W03_Advanced_Teacher_Key.md').write_text(key);(T/'W03_Advanced_Validation.json').write_text(json.dumps(dict(review=warm_report,advanced=report,final=final_report),ensure_ascii=False,indent=2))
slides.append(dict(id='w3-advanced-final',type='practice-lab',title='แบบฝึกหัดท้ายคาบการทำความสะอาดข้อมูล',intro='เริ่ม Notebook ใหม่ · เวลา 30 นาที · 5 ข้อ ข้อละ 2 คะแนน รวม 10 คะแนน · ใช้ตัวอย่างใน Notebook ที่เรียนประกอบได้',questions=[dict(title=a,task=b) for a,b in final_tasks],rules=RULES,downloads=[dl('ดาวน์โหลดชุดข้อมูลท้ายคาบ',files[2],True),dl('ดาวน์โหลดใบงานท้ายคาบ','W03_Final_Worksheet.md'),dl('ดาวน์โหลด Notebook ท้ายคาบ','W03_Final_Practice.ipynb')],teachingDays=[0],module='final'))
slides.append(dict(id='w3-advanced-summary',type='knowledge-check',title='สรุปการทำความสะอาดข้อมูลและส่งออกไฟล์',questions=[dict(question='คำว่า สอบถาม ในคอลัมน์ราคาควรเปลี่ยนเป็น 0 หรือไม่',answer='ไม่ควร เพราะยังไม่ทราบราคา ต้องแยกรายการไว้ตรวจสอบ ส่วนคำว่า ฟรี ของชุดฝึกได้รับการยืนยันว่าหมายถึง 0 บาท'),dict(question='วันที่ 31/02/2026 ต้องแก้เป็นวันใดทันทีหรือไม่',answer='ไม่ควรเดาวันที่ ต้องเก็บรายการที่แปลงไม่ได้ไว้ตรวจสอบต้นทาง'),dict(question='ตรวจสอบจำนวนแถวให้ตรงกันอย่างไร',answer='ต้นฉบับเท่ากับแถวซ้ำที่ลบออก บวกข้อมูลพร้อมใช้งาน บวกรายการรอตรวจสอบ')],teachingDays=[0],module='final'))
# Package Monday's ready data as the Excel input for Thursday.
ready.to_excel(F/'w03_orders_ready.xlsx', sheet_name='Orders', index=False)
thursday = []
def thu_slide(id, type, title, module, **fields):
 return dict(id='w3-thursday-'+id, type=type, title=title, module=module, teachingDays=[1], **fields)

thursday.extend([
 thu_slide('start','content','เตรียมไฟล์สำหรับวิเคราะห์ข้อมูล','prep',items=[
  'ดาวน์โหลดไฟล์ w03_orders_ready.xlsx จากลิงก์ด้านล่าง',
  'สร้าง Notebook ใหม่ใน Google Colab',
  'เปิดแถบ Files แล้วอัปโหลดไฟล์ w03_orders_ready.xlsx',
 ],downloads=[dl('ดาวน์โหลด w03_orders_ready.xlsx','w03_orders_ready.xlsx')]),
])
analysis_steps = [
 ('นำเข้า pandas และเปิดไฟล์ Excel',
  """import pandas as pd
df = pd.read_excel('w03_orders_ready.xlsx', sheet_name='Orders', dtype={'order_id': 'string'})
print(df.columns.tolist())""",
  'นำเข้า pandas อ่านไฟล์ และแสดงรายชื่อคอลัมน์สำหรับเลือกใช้ในการวิเคราะห์',
  'ตรวจว่าตารางมี product_name, quantity และ payment_method ก่อนดำเนินการต่อ',
  'อัปโหลดไฟล์ก่อนรันและกำหนดให้ order_id เป็นข้อความเพื่อรักษาเลขศูนย์นำหน้า',
  'คอลัมน์ใดระบุช่องทางชำระเงิน?',
  [('import pandas as pd','นำเข้า pandas'),('pd.read_excel()','อ่านไฟล์ Excel'),('sheet_name','เลือกแผ่นงาน Orders'),
   ('df.columns.tolist()','แสดงรายชื่อคอลัมน์')]),
 ('สำรวจตารางและนับรายการตามชื่อสินค้า',
  """print(df.head())
print('ขนาดตาราง:', df.shape)
print(df['product_name'].value_counts())""",
  'แสดงข้อมูลห้าแถวแรก ตรวจขนาดตาราง และนับจำนวนรายการแยกตามชื่อสินค้าในเซลล์เดียว',
  'อ่านผลตามลำดับ: ตัวอย่างห้าแถว ขนาดตาราง 28 แถว 7 คอลัมน์ และจำนวนรายการของสินค้าแต่ละชนิด',
  'ใช้ print() เพื่อแสดงผลทั้งสามส่วนในเซลล์เดียว ค่า shape แสดงจำนวนแถวก่อนจำนวนคอลัมน์',
  'สินค้าใดปรากฏมากที่สุด และมีกี่รายการ?',
  [('head()','แสดงข้อมูลห้าแถวแรก'),('shape','แสดงจำนวนแถวและจำนวนคอลัมน์'),
   ('value_counts()','นับจำนวนครั้งที่ชื่อสินค้าแต่ละชื่อปรากฏ')]),
 ('จัดกลุ่มสินค้าและรวมจำนวนชิ้น',
  """product_groups = df.groupby('product_name')
units_per_product = product_groups['quantity'].sum()
print(units_per_product)""",
  'จัดกลุ่มตามชื่อสินค้า รวมจำนวนชิ้นของแต่ละกลุ่ม แล้วแสดงผลรวม',
  'แต่ละบรรทัดระบุชื่อสินค้าและจำนวนชิ้นรวมของสินค้านั้น',
  'เลือก quantity สำหรับการรวมจำนวนชิ้น',
  'ผลรวมจำนวนชิ้นต่างจากการนับรายการอย่างไร?',
  [('groupby()','จัดกลุ่มตามชื่อสินค้า'),('sum()','รวมจำนวนชิ้นภายในกลุ่ม')]),
]
analysis_steps.extend([
 ('เรียงจำนวนชิ้นรวมจากมากไปน้อย',"""ranked_units = units_per_product.sort_values(ascending=False)
print(ranked_units)
print('จำนวนชิ้นสูงสุด:', ranked_units.max())""",
  'เรียงผลรวมเพื่อเปรียบเทียบจำนวนชิ้นของสินค้าแต่ละชนิด',
  'แถวบนสุดมีจำนวนชิ้นรวมสูงสุด หากผลรวมเท่ากัน สินค้าเหล่านั้นมีอันดับร่วมกัน',
  'ตรวจชื่อคอลัมน์ที่นำมารวมก่อนอ่านอันดับ เพราะการเรียงจำนวนรายการอาจให้ผลต่างกัน',
  'สินค้าใดมีจำนวนชิ้นรวมสูงสุด และมีจำนวนเท่าใด?',
  [('sort_values()','เรียงตามค่าผลรวม'),('ascending=False','เรียงจากมากไปน้อย'),('max()','แสดงจำนวนชิ้นสูงสุด')]),
 ('เปรียบเทียบสองหน่วยในตารางเดียว',"""product_summary = product_groups['quantity'].agg(orders='size', units='sum')
product_summary""",
  'สร้างตารางสรุปที่มีจำนวนรายการและจำนวนชิ้นรวมของสินค้าแต่ละชนิด',
  'orders แสดงจำนวนแถวของสินค้าแต่ละชนิด ส่วน units แสดงผลรวมค่า quantity',
  'อ่านชื่อคอลัมน์ก่อนสรุปว่าสินค้าใดมีค่าสูงสุด เพราะแต่ละคอลัมน์ตอบคนละคำถาม',
  'เลือกสินค้าหนึ่งชนิด แล้วอ่านผลทั้งสองคอลัมน์พร้อมระบุหน่วย',
  [('agg()','คำนวณผลสรุปหลายแบบจากกลุ่มเดียวกัน'),("orders='size'",'นับจำนวนแถวในกลุ่ม'),("units='sum'",'รวมจำนวนชิ้นในกลุ่ม')]),
 ('ตรวจสอบผลรวมกับข้อมูลต้นทาง',"""source_total = df['quantity'].sum()
group_total = product_summary['units'].sum()
print('รวมจากข้อมูลต้นทาง:', source_total)
print('รวมจากตารางสรุป:', group_total)
print('ผลรวมตรงกัน:', source_total == group_total)""",
  'คำนวณผลรวมสองทางและเปรียบเทียบว่าตรงกันหรือไม่' ,
  'True หมายถึงผลรวมจำนวนชิ้นจากตารางสรุปตรงกับผลรวมจากข้อมูลต้นทาง',
  'เปรียบเทียบผลรวมที่ใช้หน่วยเดียวกัน โดยตรวจว่ารวมจากตารางชุดเดียวกัน',
  'ถ้าผลรวมจากทุกกลุ่มต่างจากผลรวมของตารางต้นทาง ควรตรวจอะไร?',
  [("df['quantity']",'เลือกจำนวนชิ้นของทุกแถว'),('sum()','รวมจำนวนชิ้นของแต่ละตาราง'),('==','เปรียบเทียบผลรวมทั้งสองค่า')]),
 ('เลือกเฉพาะรายการปากกา',"pens = df.loc[df['product_name'] == 'ปากกา']\nprint('จำนวนรายการปากกา:', len(pens))\nprint(pens[['order_id', 'product_name', 'quantity']])",
  'เลือกเฉพาะแถวที่ชื่อสินค้าเป็นปากกา แล้วแสดงตารางที่ได้',
  'ตรวจว่าค่าในคอลัมน์ product_name ของทุกแถวที่แสดงเป็นปากกา',
  'ใช้ == เพื่อเปรียบเทียบชื่อสินค้า และใช้ = เพื่อเก็บตารางผลลัพธ์ในตัวแปร pens',
  'หากต้องการเลือกเฉพาะรายการสมุด ต้องเปลี่ยนค่าใดในคำสั่ง?',
  [("df['product_name'] == 'ปากกา'",'สร้างเงื่อนไขเลือกแถว'),('df.loc[...]','เลือกแถวที่ตรงเงื่อนไข'),('len(pens)','นับจำนวนแถวที่เลือก'),('print()','แสดงรหัส ชื่อสินค้า และจำนวนชิ้น')]),
 ('รวมจำนวนด้ามของปากกา',"""pen_orders = len(pens)
pen_units = pens['quantity'].sum()
print(f'ปากกาปรากฏ {pen_orders} รายการ รวม {pen_units} ด้าม')""",
  'รวมจำนวนด้ามจากรายการปากกาที่เลือกในขั้นตอนก่อนหน้า',
  'นำจำนวนรายการปากกาจากขั้นตอนที่ 2 มาเขียนคู่กับผลรวมหน่วยด้ามของขั้นตอนนี้',
  'ใช้ pens เพื่อรวมเฉพาะปากกา หากใช้ df จะรวมสินค้าทุกชนิด',
  'เติมข้อความให้สมบูรณ์ ปากกาปรากฏ ___ รายการ รวม ___ ด้าม',
  [("pens['quantity']",'เลือกจำนวนด้ามในแต่ละรายการปากกา'),('sum()','รวมจำนวนด้ามทั้งหมด')]),
 ('สรุปจำนวนชิ้นแยกตามวันที่',
  """daily_units = df.groupby('date_clean')['quantity'].sum()
daily_units = daily_units.sort_index()
print(daily_units)
print('จำนวนวันที่มีรายการขาย:', len(daily_units))""",
  'จัดกลุ่มตามวันที่ รวมจำนวนชิ้นในแต่ละวัน และแสดงผลตามลำดับวันที่',
  'แต่ละบรรทัดคือจำนวนชิ้นรวมของวันนั้น และบรรทัดสุดท้ายคือจำนวนวันที่ปรากฏในข้อมูล',
  'อ่านผลจาก date_clean ซึ่งเป็นวันที่ที่ผ่านการจัดเตรียมแล้ว',
  'วันแรกในตารางมีจำนวนชิ้นรวมเท่าใด?',
  [('groupby()','จัดกลุ่มตามวันที่'),('sum()','รวมจำนวนชิ้นของแต่ละวัน'),('sort_index()','เรียงตามวันที่'),('len()','นับจำนวนวันที่มีรายการ')]),
 ('คำนวณสัดส่วนของวันที่ขายได้มากที่สุด',
  """peak_units = daily_units.max()
peak_days = daily_units.loc[daily_units == peak_units]
peak_share = peak_units / source_total * 100
print(peak_days)
print(f'สัดส่วนต่อจำนวนชิ้นทั้งหมด: {peak_share:.1f}%')""",
  'หาจำนวนชิ้นสูงสุด เลือกทุกวันที่ได้ค่าสูงสุด แล้วคิดเป็นร้อยละของจำนวนชิ้นทั้งหมด',
  'ร้อยละที่แสดงเป็นสัดส่วนของแต่ละวันที่ได้ค่าสูงสุดเมื่อเทียบกับจำนวนชิ้นทั้งหมด',
  'ใช้จำนวนชิ้นทั้งหมดเป็นตัวหารเพื่อให้ตัวตั้งและตัวหารมีหน่วยเดียวกัน',
  'วันใดมีจำนวนชิ้นสูงสุด และคิดเป็นกี่เปอร์เซ็นต์ของจำนวนชิ้นทั้งหมด?',
  [('max()','หาจำนวนชิ้นสูงสุดต่อวัน'),('loc[]','เลือกทุกวันที่ได้ค่าสูงสุด'),('/ source_total * 100','คำนวณร้อยละ'),(':.1f','แสดงทศนิยมหนึ่งตำแหน่ง')]),
 ('สร้างกราฟแท่งแสดงจำนวนชิ้นที่ขายได้รายวัน',
  """import matplotlib.pyplot as plt

dates = daily_units.index.strftime('%d/%m/%Y')
fig, ax = plt.subplots(figsize=(8, 4))
bars = ax.bar(dates, daily_units.values)
ax.set_title('Daily units sold')
ax.set_xlabel('Date')
ax.set_ylabel('Units sold')
fig.tight_layout()
plt.show()""",
  'นำผลรวมรายวันจากขั้นตอนที่ 9 มาสร้างกราฟแท่งและแสดงผล',
  'แกน X คือวันที่ แกน Y คือจำนวนชิ้นที่ขายได้ วันที่ 1 และ 5 พฤศจิกายน 2026 มีแท่งสูงสุดเท่ากันที่ 15 ชิ้น',
  'ใช้ค่าจาก daily_units เพื่อให้หนึ่งแท่งแทนจำนวนชิ้นรวมของหนึ่งวัน',
  'วันใดมีแท่งสูงสุดเท่ากัน และขายได้วันละกี่ชิ้น?',
  [('plt.subplots(figsize=(8, 4))','สร้างรูปขนาดกว้าง 8 นิ้ว สูง 4 นิ้ว และคืนค่า fig กับ ax'),
   ('fig','Figure คือรูปทั้งรูป เปรียบได้กับกระดาษหนึ่งแผ่นที่มีพื้นที่วาดกราฟอยู่ภายใน'),
   ('ax','Axes คือพื้นที่วาดกราฟหนึ่งช่องภายใน fig ซึ่งมีแกน X และแกน Y'),
   ('ax.bar()','วาดแท่งจากวันที่และจำนวนชิ้นลงในพื้นที่ ax'),
   ('ax.set_title()','กำหนดชื่อกราฟ'),('ax.set_xlabel() และ ax.set_ylabel()','กำหนดชื่อแกน'),
   ('fig.tight_layout()','ปรับระยะขอบและการจัดวางในรูปให้ชื่อกราฟและข้อความบนแกนมีพื้นที่เพียงพอ'),
   ('plt.show()','แสดงกราฟ')]),
])
scope = {}
complete = []
for n,(title,code,meaning,interpretation,mistake,checkpoint,parts) in enumerate(analysis_steps,1):
 complete.append(code)
 if n == 1:
  load_code = code.replace("'w03_orders_ready.xlsx'",repr(str(F/'w03_orders_ready.xlsx')))
 else:
  load_code = code
 is_chart = n == len(analysis_steps)
 if is_chart:
  run(load_code.removesuffix('plt.show()'),scope,n)
  assert [bar.get_height() for bar in scope['bars']] == scope['daily_units'].tolist()
  chart_file = PUBLIC/'ตัวอย่าง'/'W03_Thursday_Daily_Units.html'
  chart_file.parent.mkdir(parents=True, exist_ok=True)
  svg = io.StringIO()
  scope['fig'].savefig(svg, format='svg')
  scope['plt'].close(scope['fig'])
  svg_content = svg.getvalue().split('<svg',1)[1]
  chart_file.write_text(
   '<!doctype html><html lang="th"><meta charset="utf-8">'
   '<title>กราฟแท่งจำนวนชิ้นรายวัน</title>'
   '<style>body{margin:0}svg{display:block;width:100%;height:auto}</style>'
   '<svg'+svg_content+'</html>', encoding='utf-8')
  output = dict(kind='figure',title='กราฟแท่งจากไฟล์ Excel ของบทเรียน',url='ชุดเรียน/ตัวอย่าง/'+chart_file.name)
 else:
  output,_,result = run(load_code,scope,n)
 if not is_chart and not result:
  output = dict(kind='text',title='ผลลัพธ์ที่คาดว่าจะพบ',text='เซลล์นี้ทำงานโดยไม่แสดงผลลัพธ์')
 thursday.extend([
  thu_slide(f'write-{n}','guided',f'ขั้นตอนที่ {n}: {title}','practice',step=n,flow='write-then-check',
   instruction='พิมพ์คำสั่งในเซลล์ใหม่และรันด้วย Shift + Enter',run='วิธีรันคำสั่ง: Shift + Enter',
   code=code,meaning=meaning,parts=[dict(token=token,meaning=detail) for token,detail in parts],
   teacherAction='อธิบายคำสั่งทีละส่วนและรันพร้อมผู้เรียน',studentAction='พิมพ์คำสั่งและตรวจผลลัพธ์ด้วยตนเอง',
   completeCode='\n\n'.join(complete)),
  thu_slide(f'write-{n}-result','guided-check',f'ขั้นตอนที่ {n}: ผลลัพธ์และคำอธิบาย','practice',
   step=n,code=code,output=output,interpretation=interpretation,mistake=mistake,checkpoint=checkpoint),
 ])
pd.testing.assert_frame_equal(scope['df'], pd.read_csv(F/'w03_orders_ready.csv', dtype={'order_id': 'string'}, parse_dates=['date_clean']), check_dtype=False)
thursday.append(
 thu_slide('exercise','content','ใบงานท้ายคาบ: วิเคราะห์ข้อมูลการขาย','final',items=[
  'ทำรายบุคคล 30 นาที · 5 ข้อ ข้อละ 2 คะแนน · ตอบและส่งใน Google Docs',
  'ใช้ไฟล์ w03_orders_ready.xlsx แผ่นงาน Orders วิเคราะห์ใน Colab แล้วเขียนคำตอบเป็นประโยค พร้อมตัวเลขและหน่วยประกอบ',
  'ข้อ 1 — สินค้าชนิดใดปรากฏในรายการขายบ่อยที่สุด และสินค้าชนิดใดขายได้จำนวนชิ้นรวมสูงสุด? ระบุค่าทั้งสองและอธิบายว่าทำไมสองตัวเลขจึงตอบคนละคำถาม',
  'ข้อ 2 — ช่องทางชำระเงินใดมีจำนวนรายการมากที่สุด และช่องทางใดมีจำนวนชิ้นรวมสูงสุด? แนบตารางที่มีทั้งสองตัวเลขแยกตามช่องทาง แล้วสรุปว่าอันดับแรกตรงกันหรือไม่ หากค่าสูงสุดเท่ากันให้ระบุทุกช่องทางที่ได้ค่านั้น',
  'ข้อ 3 — วันใดขายได้จำนวนชิ้นสูงสุด? แนบกราฟแท่งจำนวนชิ้นรายวัน แล้วระบุทุกวันที่ได้ค่าสูงสุดพร้อมจำนวนชิ้น',
  'ข้อ 4 — เลือกหนึ่งวันที่ได้ค่าสูงสุดจากข้อ 3 แล้วคำนวณว่าวันนั้นคิดเป็นกี่เปอร์เซ็นต์ของจำนวนชิ้นทั้งหมด แสดงตัวตั้ง ตัวหาร และผลลัพธ์เป็นทศนิยมหนึ่งตำแหน่ง',
  'ข้อ 5 — ผู้จัดการจะเลือกสินค้าหนึ่งชนิดไปตรวจสต็อกก่อน โดยให้ความสำคัญกับจำนวนชิ้นที่ขายได้ คุณจะเลือกสินค้าใด? อ้างตัวเลขจากข้อมูล และระบุข้อมูลเพิ่มเติมหนึ่งอย่างที่ต้องทราบก่อนตัดสินใจสั่งเพิ่ม',
 ]))

deck_path=P/'src/teachingDeck.js';deck=json.loads(deck_path.read_text().split('=',1)[1].strip().rstrip(';'));w=deck[2];w['title']='การทำความสะอาดข้อมูลขั้นประยุกต์';w['slides']=slides+thursday;w['files']=list(dict.fromkeys(w['files']+files));deck_path.write_text('export const teachingDeck = '+json.dumps(deck,ensure_ascii=False,indent=2)+';\n')
rpath=P/'src/courseResources.js';resources=json.loads(rpath.read_text().split('=',1)[1].strip().rstrip(';'));resources['3']['files']=[f for f in resources['3']['files'] if 'Advanced' not in f['url'] and not any(name in f['url'] for name in files)]+[dict(name=f,url='ชุดเรียน/ชุดข้อมูล/'+f) for f in files]+[dict(name='Notebook ฝึก Cleansing ขั้นประยุกต์จากศูนย์',url='ชุดเรียน/เรียนย้อนหลัง_สัปดาห์03/W03_Advanced_Practice.ipynb'),dict(name='Notebook ตัวอย่างพร้อมผลลัพธ์',url='ชุดเรียน/เรียนย้อนหลัง_สัปดาห์03/W03_Advanced_Example.ipynb')];rpath.write_text('export const courseResources = '+json.dumps(resources,ensure_ascii=False,indent=2)+';\n')
(T/'W03_Monday_Teaching_Plan.md').write_text('# แผนการสอนวันจันทร์ 180 นาที\n\nทบทวน 45 นาที ตรวจคำตอบ 15 นาที ฝึกพร้อมกัน 90 นาที แบบฝึกหัดท้ายคาบ 30 นาที\n\n14 ขั้นตอนฝึกในช่วง 90 นาที ตรวจผลทุกขั้นก่อนดำเนินการต่อ หากมีปัญหาให้ใช้ Notebook ตัวอย่างประกอบ เพื่อรักษาเวลาประเมินท้ายคาบ\n\n'+key.split('## แบบฝึกหัดท้ายคาบ')[0])
for f in F.iterdir():
 if f.is_file():shutil.copy2(f,PUBLIC/'เรียนย้อนหลัง_สัปดาห์03'/f.name)
print('Advanced cleansing ready:',json.dumps(dict(slides=len(slides),review=warm_report,advanced=report,final=final_report),ensure_ascii=False),flush=True)

# Rebuild the same teacher pack whenever lesson assets change.
pack=B/'W03_Advanced_Cleansing_Teacher_Pack.zip'
student_files=['w03_review_basic.csv','w03_online_orders_dirty.csv','w03_final_orders_dirty.csv','W03_Review_Worksheet.md','W03_Final_Worksheet.md','W03_Review_Practice.ipynb','W03_Advanced_Practice.ipynb','W03_Advanced_Example.ipynb','W03_Final_Practice.ipynb','W03_Advanced_Guide.md']
teacher_files=['W03_Advanced_Teacher_Key.md','W03_Advanced_Validation.json','W03_Review_Answer.ipynb','W03_Final_Answer.ipynb','W03_Monday_Teaching_Plan.md']
with zipfile.ZipFile(pack,'w',zipfile.ZIP_DEFLATED) as z:
 z.writestr('README.txt','ชุดสอนสัปดาห์ที่ 3 วันจันทร์ 3 ชั่วโมง\n\nทบทวน 45 นาที ตรวจคำตอบ 15 นาที ฝึก Cleansing จากศูนย์ 14 ขั้นตอน 90 นาที และแบบฝึกหัดท้ายคาบ 30 นาที\n\nstudent: ชุดข้อมูล ใบงานข้อความ และ Notebook สำหรับ Google Colab\nteacher: เฉลยและเกณฑ์คะแนนท้ายคาบ 10 คะแนน\n\nชุดฝึกพร้อมกัน: 40 แถว แยกเป็นแถวซ้ำ 4 แถว พร้อมใช้งาน 28 แถว และรอตรวจสอบ 8 แถว\nท้ายคาบ: 18 แถว แยกเป็นแถวซ้ำ 2 แถว พร้อมใช้งาน 12 แถว และรอตรวจสอบ 4 แถว\n')
 for name in student_files:z.write(F/name,'student/'+name)
 for name in teacher_files:z.write(T/name,'teacher/'+name)
 assert z.testzip() is None
