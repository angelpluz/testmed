import { useState } from 'react';
import Link from 'next/link'; // import Link

export default function HomePage() {
  const [message] = useState('ยินดีต้อนรับสู่แบบสอบถามของเรา');

  return (
    <div>
      <h1>{message}</h1>
      <p>กรุณาเลือกแบบสอบถามที่คุณต้องการทำ:</p>

      {/* ลิงก์ไปยังหน้าแบบสอบถาม */}
      <ul>
        <li>
          <Link href="/forms">
            <a>ไปที่แบบสอบถาม</a>
          </Link>
        </li>
      </ul>
    </div>
  );
}
