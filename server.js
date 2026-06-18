import express from 'express';
import fs from 'fs';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

app.use(cors());
app.use(express.json());

// 🛠️ توليد الـ __dirname بشكل سليم ليتوافق مع نظام الـ ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// تأكد من وجود مجلد data تلقائياً حتى لا يحدث خطأ أثناء الحفظ
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)){
    fs.mkdirSync(dataDir);
}

const filePath = path.join(dataDir, 'students.json');

// 1️⃣ الـ API الأولاني: الخاص باستقبال بيانات الطلاب وحفظها عند التسجيل
app.post('/api/save-student', (req, res) => {
  const newStudent = req.body;
  let students = [];
  
  if (fs.existsSync(filePath)) {
    try {
      const fileData = fs.readFileSync(filePath, 'utf8');
      students = fileData ? JSON.parse(fileData) : [];
    } catch (e) {
      students = [];
    }
  }

  students.push(newStudent);
  fs.writeFileSync(filePath, JSON.stringify(students, null, 2), 'utf8');
  
  res.status(200).json({ message: 'تم حفظ الطالب في ملف data/students.json بنجاح!' });
});

// 2️⃣ الـ API الثاني: بياخد اسم الطالب ويروح يفتش عليه في ملف data/students.json ويرده للـ Dashboard
app.get('/api/get-student', (req, res) => {
  const studentName = req.query.name;

  if (fs.existsSync(filePath)) {
    try {
      const fileData = fs.readFileSync(filePath, 'utf8');
      const students = fileData ? JSON.parse(fileData) : [];
      
      // البحث عن الطالب جوه مصفوفة الملف
      const matchedStudent = students.find(s => s.fullName === studentName || s.name === studentName);
      
      if (matchedStudent) {
        return res.status(200).json({ student: matchedStudent });
      }
    } catch (e) {
      console.error("خطأ في قراءة ملف الطلاب:", e);
    }
  }
  res.status(404).json({ message: 'الطالب غير موجود في ملف البيانات حتى الآن' });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 السيرفر شغال ومستعد لحفظ وجلب الطلاب من مجلد data!`));