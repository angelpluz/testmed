import { useState } from 'react';

interface Evaluation {
  packaging: string;
  sharpness: string;
  flexibility: string;
  strength: string;
  totalScore: number;
}

export default function EvaluationPage() {
  const [currentUser, setCurrentUser] = useState(1); // นับผู้ใช้คนปัจจุบัน
  const [evaluationsA, setEvaluationsA] = useState<Evaluation[]>([]); // เก็บข้อมูลของผู้ใช้ทั้งหมดสำหรับชุด A
  const [evaluationsB, setEvaluationsB] = useState<Evaluation[]>([]); // เก็บข้อมูลของผู้ใช้ทั้งหมดสำหรับชุด B
  const [currentEvaluation, setCurrentEvaluation] = useState<Evaluation>({
    packaging: '',
    sharpness: '',
    flexibility: '',
    strength: '',
    totalScore: 0,
  });
  const [group, setGroup] = useState('A'); // ระบุว่ากำลังประเมินชุดไหน A หรือ B

  const [averageScoreA, setAverageScoreA] = useState<number | null>(null); // correct type
  const [averageScoreB, setAverageScoreB] = useState<number | null>(null); // correct type

  const [priceA, setPriceA] = useState(''); // ราคา บริษัท A
  const [priceB, setPriceB] = useState(''); // ราคา บริษัท B
  const [finalScoreA, setFinalScoreA] = useState<number | null>(null); // Allow number or null
  const [finalScoreB, setFinalScoreB] = useState<number | null>(null); // Allow number or null

  const [priceScoreA, setPriceScoreA] = useState<number | null>(null); // Allow number or null
  const [priceScoreB, setPriceScoreB] = useState<number | null>(null); // Allow number or null
  const saveDataToCSV = async () => {
    console.log({
      evaluationsA,
      evaluationsB,
      priceA,
      priceB,
      finalScoreA,  // ลองดูค่าที่ได้ที่นี่
      finalScoreB   // ลองดูค่าที่ได้ที่นี่
    });
    
  
    const response = await fetch('/api/form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        evaluationsA,
        evaluationsB,
        priceA,
        priceB,
        finalScoreA: finalScoreA || 0,
        finalScoreB: finalScoreB || 0,
      }),
    });
  
    if (response.ok) {
      alert('Data saved successfully!');
    } else {
      alert('Failed to save data!');
    }
  };
  const handleEvaluationChange = (field: string, value: number) => {
    setCurrentEvaluation({ ...currentEvaluation, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    
    // คำนวณคะแนนรวมสำหรับผู้ใช้ปัจจุบัน
    const totalScore =
      Number(currentEvaluation.packaging) +
      Number(currentEvaluation.sharpness) +
      Number(currentEvaluation.flexibility) +
      Number(currentEvaluation.strength);

    if (group === 'A') {
      // บันทึกข้อมูลผู้ใช้สำหรับชุด A
      setEvaluationsA([...evaluationsA, { ...currentEvaluation, totalScore }]);
    } else {
      // บันทึกข้อมูลผู้ใช้สำหรับชุด B
      setEvaluationsB([...evaluationsB, { ...currentEvaluation, totalScore }]);
    }

    // รีเซ็ตข้อมูลสำหรับผู้ใช้ถัดไป
    setCurrentEvaluation({
      packaging: '',
      sharpness: '',
      flexibility: '',
      strength: '',
      totalScore: 0, // Reset totalScore to 0 or another default value
    });

    // ไปยังผู้ใช้ถัดไป
    if (currentUser < 5) {
      setCurrentUser(currentUser + 1);
    } else {
      if (group === 'A') {
        calculateAverage(evaluationsA, setAverageScoreA); // คำนวณคะแนนเฉลี่ยสำหรับชุด A
        setGroup('B'); // เปลี่ยนเป็นประเมินชุด B
      } else {
        calculateAverage(evaluationsB, setAverageScoreB); // คำนวณคะแนนเฉลี่ยสำหรับชุด B
      }
      setCurrentUser(1); // เริ่มที่ผู้ใช้คนแรกอีกครั้งสำหรับชุดใหม่
    }
  };

  const calculateAverage = (evaluations: Evaluation[], setAverageScore: React.Dispatch<React.SetStateAction<number | null>>) => {
    // คำนวณค่าเฉลี่ยจากคะแนนรวมของผู้ใช้ทั้งหมด
    const totalScores = evaluations.reduce((acc, evalObj) => acc + evalObj.totalScore, 0);
    const avgScore = totalScores / evaluations.length;

    // เก็บค่าเฉลี่ยลงใน state
    setAverageScore(avgScore);
  };

  const calculatePriceScore = () => {
    // คำนวณคะแนนจากราคา
    const priceAVal = Number(priceA);
    const priceBVal = Number(priceB);

    let scoreA, scoreB;

    if (priceAVal < priceBVal) {
      scoreA = 100;
      scoreB = 100 - ((priceBVal - priceAVal) / priceAVal) * 100;
    } else {
      scoreB = 100;
      scoreA = 100 - ((priceAVal - priceBVal) / priceBVal) * 100;
    }

    setPriceScoreA((scoreA / 100) * 40); // แปลงคะแนนเป็น 40%
    setPriceScoreB((scoreB / 100) * 40); // แปลงคะแนนเป็น 40%
  };

  const calculateFinalScore = (priceScore: number, avgScore: number) => {
    const productScore = (avgScore / 100) * 60; // แปลงคะแนนผลิตภัณฑ์เป็น 60%
    return productScore + priceScore; // รวมคะแนนราคากับคะแนนผลิตภัณฑ์
  };
  const handleFinalCalculation = () => {
    // เรียกใช้ calculatePriceScore เพื่อคำนวณคะแนนราคา
    calculatePriceScore();

    if (averageScoreA && priceScoreA !== null) {
      setFinalScoreA(calculateFinalScore(priceScoreA, averageScoreA)); // Now it's safe to call
    }
    if (averageScoreB && priceScoreB !== null) {
      setFinalScoreB(calculateFinalScore(priceScoreB, averageScoreB)); // Now it's safe to call
    }

    // หลังจากคำนวณเสร็จ ให้บันทึกข้อมูลลง CSV
    saveDataToCSV();
  };
  

  return (
    <div>
      <h1>แบบประเมินการใช้งานสำหรับผู้ใช้ลำดับ {currentUser} ชุด {group}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ภาชนะบรรจุภัณฑ์ (10 คะแนน):</label>
          <input
            type="number"
            value={currentEvaluation.packaging}
            onChange={(e) => handleEvaluationChange('packaging', Number(e.target.value))}
          />
        </div>
        <div>
          <label>ความคมของเข็ม (30 คะแนน):</label>
          <input
            type="number"
            value={currentEvaluation.sharpness}
            onChange={(e) => handleEvaluationChange('sharpness', Number(e.target.value))}
          />
        </div>
        <div>
          <label>ความเหนียวและลื่นของเส้นไหม (30 คะแนน):</label>
          <input
            type="number"
            value={currentEvaluation.flexibility}
            onChange={(e) => handleEvaluationChange('flexibility', Number(e.target.value))}
          />
        </div>
        <div>
          <label>ความแข็งแรงระหว่างเข็มกับไหม (30 คะแนน):</label>
          <input
            type="number"
            value={currentEvaluation.strength}
            onChange={(e) => handleEvaluationChange('strength', Number(e.target.value))}
          />
        </div>

        <button type="submit">บันทึกการประเมินผู้ใช้ลำดับ {currentUser}</button>
      </form>

      {/* รับราคาจากผู้ใช้ */}
      <div>
        <h3>ประเมินราคาสินค้า</h3>
        <label>ราคาสินค้า บริษัท A:</label>
        <input type="number" value={priceA} onChange={(e) => setPriceA(e.target.value)} />
        <label>ราคาสินค้า บริษัท B:</label>
        <input type="number" value={priceB} onChange={(e) => setPriceB(e.target.value)} />
      </div>

      {/* แสดงข้อมูลของผู้ใช้ทั้งหมดเมื่อกรอกครบ 5 คนสำหรับชุด A */}
      {averageScoreA && (
        <div>
          <h2>ผลการประเมินจากชุด A</h2>
          <h3>คะแนนเฉลี่ยชุด A: {averageScoreA.toFixed(2)}</h3>
          <h3>คะแนนสุดท้ายจากการประเมิน (คิดเป็น 60%): {(averageScoreA / 100 * 60).toFixed(2)}</h3>
        </div>
      )}

      {/* แสดงข้อมูลของผู้ใช้ทั้งหมดเมื่อกรอกครบ 5 คนสำหรับชุด B */}
      {averageScoreB && (
        <div>
          <h2>ผลการประเมินจากชุด B</h2>
          <h3>คะแนนเฉลี่ยชุด B: {averageScoreB.toFixed(2)}</h3>
          <h3>คะแนนสุดท้ายจากการประเมิน (คิดเป็น 60%): {(averageScoreB / 100 * 60).toFixed(2)}</h3>
        </div>
      )}

      {/* แสดงข้อมูลของผู้ใช้แต่ละคน */}
      {evaluationsA.length > 0 && (
        <div>
          <h2>ผลการประเมินจากชุด A แต่ละคน</h2>
          {evaluationsA.map((evalObj, index) => (
            <p key={index}>ผู้ใช้ลำดับ {index + 1}: {evalObj.totalScore} คะแนน</p>
          ))}
        </div>
      )}

      {evaluationsB.length > 0 && (
        <div>
          <h2>ผลการประเมินจากชุด B แต่ละคน</h2>
          {evaluationsB.map((evalObj, index) => (
            <p key={index}>ผู้ใช้ลำดับ {index + 1}: {evalObj.totalScore} คะแนน</p>
          ))}
        </div>
      )}

      {/* คำนวณคะแนนรวมสุดท้ายเมื่อมีราคาทั้ง A และ B */}
      {priceA && priceB && (
        
        <button onClick={handleFinalCalculation}>คำนวณคะแนนรวมสุดท้ายและบันทึกข้อมูล</button>
      )}

      {/* แสดงคะแนนรวมสุดท้าย */}
      {finalScoreA && (
        <div>
          <h3>คะแนนรวมสุดท้ายสำหรับ A: {finalScoreA.toFixed(2)}</h3>
          <p>คะแนนจากราคา (คิดเป็น 40%): {priceScoreA?.toFixed(2)}%</p>
          <p>คะแนนจากการประเมิน (คิดเป็น 60%): {(averageScoreA ? (averageScoreA / 100 * 60).toFixed(2) : '0.00')}%</p>
          <p>คะแนนร่วม (ราคา + ประเมิน): {((priceScoreA !== null ? parseFloat(priceScoreA.toFixed(2)) : 0) +
            (averageScoreA !== null ? parseFloat((averageScoreA / 100 * 60).toFixed(2)) : 0)).toFixed(2)}%</p>
        </div>
      )}

      {finalScoreB && (
        <div>
          <h3>คะแนนรวมสุดท้ายสำหรับ B: {finalScoreB !== null ? finalScoreB.toFixed(2) : 'N/A'}</h3>
          <p>คะแนนจากราคา (คิดเป็น 40%): {priceScoreB !== null ? priceScoreB.toFixed(2) : 'N/A'}%</p>
          <p>คะแนนจากการประเมิน (คิดเป็น 60%): {averageScoreB !== null ? (averageScoreB / 100 * 60).toFixed(2) : 'N/A'}%</p>
          <p>คะแนนร่วม (ราคา + ประเมิน): {(
            (priceScoreB !== null ? parseFloat(priceScoreB.toFixed(2)) : 0) +
            (averageScoreB !== null ? parseFloat((averageScoreB / 100 * 60).toFixed(2)) : 0)
          ).toFixed(2)}%</p>
        </div>
      )}

    </div>
  );
}
