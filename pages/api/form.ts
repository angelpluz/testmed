import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // รับข้อมูลจากฟอร์ม
    const data = req.body;
    const csvLine = `${data.name},${data.email},${data.feedback},${data.question1},${data.question2},${data.question3},${data.question4},${data.question5}\n`;

    // ระบุตำแหน่งไฟล์ CSV ที่ต้องการบันทึก
    const filePath = path.join(process.cwd(), 'data', 'responses.csv');

    // ตรวจสอบว่าไฟล์มีอยู่หรือไม่ ถ้าไม่มีให้สร้างไฟล์พร้อมกับ header
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, 'Name,Email,Feedback,Question1,Question2,Question3,Question4,Question5\n');
    }

    // เพิ่มข้อมูลใหม่ลงในไฟล์ CSV
    fs.appendFileSync(filePath, csvLine);

    res.status(200).json({ message: 'Data saved successfully!' });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
