import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, LogIn, Search, Sun, User, IdCard } from 'lucide-react';

// @ts-ignore
import bgImage from "../imports/bg.jpg"; 

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('abdullash144@gmail.com');
  const [password, setPassword] = useState('********');
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginTab, setIsLoginTab] = useState(true);

  // 🛠️ دالة التعامل مع الـ Form وإرسال وجلب البيانات من السيرفر تلقائياً
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoginTab) {
      // 🔑 أولاً: حالة تسجيل الدخول (Login)
      try {
        // نطلب من السيرفر التحقق وجلب بيانات الطالب بناءً على الاسم أو الإيميل
        // في مشروعك الحالي، لتسهيل الدخول السريع بالاسم:
        const loginName = fullName || "عبدالله محمد عبدالرازق"; // اسم افتراضي لحسابك الجاهز أو اكتب اسمك في الحقل
        
        localStorage.setItem('current_student_name', loginName);
        navigate("/dashboard");
      } catch (error) {
        console.error("خطأ في تسجيل الدخول:", error);
        alert("تعذر تسجيل الدخول، تأكد من تشغيل السيرفر");
      }
    } else {
      // 📝 ثانياً: حالة إنشاء حساب طالب جديد (Sign Up)
      const studentData = {
        fullName: fullName,
        id: studentId,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
      };

      try {
        const response = await fetch('http://localhost:5000/api/save-student', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(studentData),
        });

        if (response.ok) {
          // 🌟 حفظ الاسم في المتصفح فوراً لكي تراه صفحة الداشبورد وتقبله
          localStorage.setItem('current_student_name', fullName);
          
          // حفظ الحساب في قائمة الطلاب المحلية مؤقتاً لمساعدة الـ عزل الديناميكي
          const localStudents = JSON.parse(localStorage.getItem('hnu_registered_students') || '[]');
          localStudents.push(studentData);
          localStorage.setItem('hnu_registered_students', JSON.stringify(localStudents));

          alert("تم إنشاء حسابك وحفظه في السيرفر بنجاح! جاري توجيهك...");
          navigate("/dashboard");
        } else {
          alert("فشل السيرفر في حفظ الحساب الأكاديمي.");
        }
      } catch (error) {
        console.error("Error connected to server:", error);
        alert("تعذر الاتصال بالسيرفر! يرجى تشغيل ملف server.js أولاً.");
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative text-white selection:bg-purple-500/30" style={{ fontFamily: "'Cairo', sans-serif", direction: 'rtl' }}>
      
      {/* الخلفية السينمائية */}
      <div className="fixed inset-0 z-0">
        <img 
          src={bgImage} 
          alt="Helwan National University" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* الـ Header العلوي */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-white/5 bg-[#0d1125]/20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/30">
            <span className="text-xl">🎓</span>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-wide text-white">جامعة حلوان الأهلية</h1>
            <p className="text-xs text-gray-400">منصة تعلم متكاملة لدعم طلاب الجامعات</p>
          </div>
        </div>

        <div className="hidden md:flex items-center relative w-96">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="ابحث عن المحاضرات، المفاهيم، أو المواد الدراسية..." 
            className="w-full bg-[#161b33]/40 border border-white/10 rounded-xl py-2 pr-10 pl-4 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50 transition-all backdrop-blur-sm"
          />
        </div>

        <button className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
          <Sun className="w-5 h-5 text-gray-300" />
        </button>
      </header>

      {/* محتوى الصفحة الرئيسي */}
      <main className="flex-1 flex items-center justify-center relative z-10 p-4 md:p-8 my-auto min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-[480px] bg-white/[0.03] border border-white/15 rounded-[24px] p-6 md:p-8 backdrop-blur-[4px] shadow-2xl shadow-black/80 flex flex-col my-4 transition-all duration-300">
          
          {/* أزرار التبديل */}
          <div className="grid grid-cols-2 bg-black/40 p-1 rounded-xl border border-white/5 mb-6">
            <button 
              type="button"
              onClick={() => setIsLoginTab(true)}
              className={`py-2.5 text-sm font-semibold rounded-lg transition-all ${isLoginTab ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-gray-400 hover:text-white'}`}
            >
              تسجيل الدخول
            </button>
            <button 
              type="button"
              onClick={() => setIsLoginTab(false)}
              className={`py-2.5 text-sm font-semibold rounded-lg transition-all ${!isLoginTab ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-gray-400 hover:text-white'}`}
            >
              إنشاء حساب
            </button>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-white drop-shadow-md">
            {isLoginTab ? "تسجيل الدخول" : "إنشاء حساب طالب جديد"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* في حال تسجيل الدخول أو إنشاء الحساب نطلب الحقول المطلوبة لربط الداتا */}
            <div className="relative">
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pr-12 pl-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-gray-500"
                placeholder="الاسم كامل (ثلاثي أو رباعي)"
                required
              />
            </div>

            {!isLoginTab && (
              <div className="relative">
                <IdCard className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pr-12 pl-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-gray-500"
                  placeholder="الرقم الأكاديمي المقترح (ID)"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pr-12 pl-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-gray-500"
                placeholder="البريد الإلكتروني"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pr-12 pl-12 text-sm text-white focus:outline-none focus:border-purple-500 transition-all tracking-wide placeholder:text-gray-500"
                placeholder="كلمة المرور"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-all"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {isLoginTab && (
              <div className="text-right">
                <a href="#forgot" className="text-xs text-purple-400 hover:text-purple-300 transition-all">نسيت كلمة المرور؟</a>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-500 active:scale-[0.98] text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 text-base"
            >
              <LogIn className="w-5 h-5" />
              {isLoginTab ? "تسجيل الدخول" : "إنشاء حساب الآن"}
            </button>
          </form>

          {/* الخط الفاصل */}
          <div className="relative flex py-4 items-center my-1">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-xs text-gray-500">أو</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          {/* أزرار السوشيال ميديا */}
          <div className="grid grid-cols-2 gap-4">
            <button type="button" className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-black/50 border border-white/10 hover:bg-white/5 transition-all text-sm font-medium text-gray-200">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.56 14.96 1 12 1 7.36 1 3.4 3.68 1.4 7.6l3.8 2.96c.88-2.68 3.4-4.52 6.8-4.52z"/>
                <path fill="#4285F4" d="M23.52 12.3c0-.8-.08-1.56-.2-2.3H12v4.4h6.48c-.28 1.48-1.12 2.72-2.36 3.56l3.64 2.84c2.12-1.96 3.36-4.84 3.36-8.5z"/>
                <path fill="#FBBC05" d="M5.2 14.92c-.24-.72-.36-1.48-.36-2.28s.12-1.56.36-2.28L1.4 7.4C.52 9.16 0 11.04 0 13s.52 3.84 1.4 5.6l3.8-2.68z"/>
                <path fill="#34A853" d="M12 23c3.24 0 5.96-1.08 7.96-2.92l-3.64-2.84c-1.04.68-2.36 1.12-4.32 1.12-3.4 0-5.92-1.84-6.8-4.52L1.4 16.48C3.4 20.32 7.36 23 12 23z"/>
              </svg>
              Google
            </button>
            <button type="button" className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-black/50 border border-white/10 hover:bg-white/5 transition-all text-sm font-medium text-gray-200">
              <svg className="w-4 h-4" viewBox="0 0 23 23">
                <path fill="#f35325" d="M0 0h11v11H0z"/>
                <path fill="#81bc06" d="M12 0h11v11H12z"/>
                <path fill="#05a6f0" d="M0 12h11v11H0z"/>
                <path fill="#ffba08" d="M12 12h11v11H12z"/>
              </svg>
              Microsoft
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-5">
            {isLoginTab ? "ليس لديك حساب؟ " : "لديك حساب بالفعل؟ "}
            <button 
              type="button" 
              onClick={() => setIsLoginTab(!isLoginTab)} 
              className="text-purple-400 font-semibold hover:text-purple-300 transition-all inline-block bg-transparent border-none p-0 cursor-pointer"
            >
              {isLoginTab ? "إنشاء حساب الآن" : "تسجيل الدخول"}
            </button>
          </p>

        </div>
      </main>
    </div>
  );
}