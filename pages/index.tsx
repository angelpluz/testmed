import { useState } from 'react';

export default function HomePage() {
  const [message] = useState('ยินดีต้อนรับสู่แบบสอบถามของเรา');

  return (
    <div>
      <h1>{message}</h1>
      <p>กรุณาเลือกแบบสอบถามที่คุณต้องการทำ:</p>

      {/* ลิงก์ไปยังหน้าแบบสอบถาม */}
      <ul>
        <li><a href="/forms">ไปที่แบบสอบถาม</a></li>
      </ul>
    </div>
  );
}
