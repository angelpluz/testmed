import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';  // เพิ่มการ import path

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const data = req.body;
      console.log("Received data:", data);

      // สร้างข้อมูล CSV จาก evaluations
      const evaluationsALines = data.evaluationsA.map((evaluation: any, index: number) => {
        return `User ${index + 1},${evaluation.packaging},${evaluation.sharpness},${evaluation.flexibility},${evaluation.strength},${evaluation.totalScore}`;
      }).join('\n');

      const evaluationsBLines = data.evaluationsB.map((evaluation: any, index: number) => {
        return `User ${index + 1},${evaluation.packaging},${evaluation.sharpness},${evaluation.flexibility},${evaluation.strength},${evaluation.totalScore}`;
      }).join('\n');

      // เก็บคะแนนรวมราคาและคะแนนประเมิน
      const finalScoresLine = `,Price A:${data.priceA},Price B:${data.priceB},Final Score A:${data.finalScoreA},Final Score B:${data.finalScoreB}`;

      // เขียนข้อมูลลงไฟล์ CSV
      const filePath = path.join(process.cwd(), 'data', 'responses.csv');
      const header = 'User,Packaging,Sharpness,Flexibility,Strength,Total Score\n';
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, header);
      }
      fs.appendFileSync(filePath, `${evaluationsALines}\n${evaluationsBLines}\n${finalScoresLine}\n`);

      res.status(200).json({ message: 'Data saved successfully!' });
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ message: 'Error saving data', error: (error as Error).message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
