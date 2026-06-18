import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, Clock } from 'lucide-react';

export default function StudyTimer() {
  // 1. جلب الوقت المخزن وحالة التشغيل من الـ localStorage لضمان ثبات العداد عبر المسارات
  const [time, setTime] = useState<number>(() => {
    const savedTime = localStorage.getItem('hnu_study_time');
    return savedTime ? parseInt(savedTime, 10) : 0;
  });

  const [isRunning, setIsRunning] = useState<boolean>(() => {
    return localStorage.getItem('hnu_study_running') === 'true';
  });

  const [isExpanded, setIsExpanded] = useState<boolean>(false); // لفتح وقفل الواجهة
  
// السطر الجديد السليم 100% في مشاريع الـ Vite:
const timerRef = useRef<any>(null);
  // 2. مزامنة حالة التشغيل وإدارة الـ Interval مع حفظ كل ثانية تعدي
  useEffect(() => {
    localStorage.setItem('hnu_study_running', isRunning.toString());
    
    if (isRunning) {
      // تخزين التوقيت الحالي بالملي ثانية لحساب أي فارق زمني عند تنقل الصفحات
      localStorage.setItem('hnu_last_pulse', Date.now().toString());

      timerRef.current = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;
          localStorage.setItem('hnu_study_time', newTime.toString());
          localStorage.setItem('hnu_last_pulse', Date.now().toString()); // تحديث النبضة الأخيرة
          return newTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  // 3. معالجة حساب الوقت الفائت (Delta Time) أثناء عملية تحميل أو تغيير الصفحة
  useEffect(() => {
    if (isRunning) {
      const lastPulse = localStorage.getItem('hnu_last_pulse');
      if (lastPulse) {
        const elapsedSeconds = Math.floor((Date.now() - parseInt(lastPulse, 10)) / 1000);
        if (elapsedSeconds > 0) {
          setTime((prevTime) => {
            const updatedTime = prevTime + elapsedSeconds;
            localStorage.setItem('hnu_study_time', updatedTime.toString());
            return updatedTime;
          });
        }
      }
    }
  }, []);

  // دالة تحويل الثواني إلى صيغة رقمية فخمة (ساعة:دقيقة:ثانية)
  const formatTime = () => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
    localStorage.setItem('hnu_study_time', '0');
    localStorage.setItem('hnu_study_running', 'false');
    localStorage.removeItem('hnu_last_pulse');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-start font-sans" style={{ fontFamily: "'Cairo', sans-serif", direction: 'rtl' }}>
      
      {/* واجهة التحكم بالتايمر الكاملة */}
      {isExpanded && (
        <div className="bg-[#050714]/95 border border-amber-500/20 p-4 rounded-3xl shadow-2xl flex flex-col items-center mb-3 animate-in fade-in slide-in-from-bottom-4 duration-200 backdrop-blur-xl w-60 text-center">
          <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-2 w-full justify-center">
            <Timer className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-white">عداد وقت المذاكرة</span>
          </div>

          {/* الوقت الرقمي السينمائي الكبير */}
          <div className="text-2xl font-mono font-black text-amber-400 tracking-widest my-3 bg-black/40 px-4 py-2 rounded-2xl border border-white/5 shadow-inner select-none">
            {formatTime()}
          </div>

          {/* أزرار التحكم الفورية */}
          <div className="flex items-center gap-3 mt-1">
            {/* زر التشغيل والإيقاف المؤقت */}
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`p-2.5 rounded-xl transition-all cursor-pointer shadow-md ${
                isRunning 
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' 
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
              }`}
              title={isRunning ? 'إيقاف مؤقت' : 'بدء المذاكرة'}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* زر التصفير (Reset) */}
            <button
              onClick={resetTimer}
              className="p-2.5 rounded-xl bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white transition-all cursor-pointer shadow-md"
              title="إعادة ضبط"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* زر التصغير */}
            <button
              onClick={() => setIsExpanded(false)}
              className="text-[11px] px-3 py-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold hover:bg-amber-500 hover:text-[#060814] transition-all cursor-pointer"
            >
              إخفاء
            </button>
          </div>
        </div>
      )}

      {/* الكبسولة العائمة الصغيرة والثابتة (عند تصغير العداد) */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-full border font-bold text-xs shadow-2xl hover:scale-105 transition-all cursor-pointer group active:scale-95 ${
            isRunning 
              ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white border-emerald-400/30' 
              : 'bg-gradient-to-r from-gray-900 to-[#090d1f] text-gray-300 border-white/10'
          }`}
          style={{ boxShadow: isRunning ? '0 0 25px 2px rgba(16, 185, 129, 0.2)' : 'none' }}
        >
          <Clock className={`w-4 h-4 ${isRunning ? 'text-white animate-spin' : 'text-amber-400'}`} style={{ animationDuration: isRunning ? '4s' : '0s' }} />
          <span>{isRunning ? `جاري المذاكرة.. (${formatTime()})` : 'ابدأ مؤقت المذاكرة'}</span>
        </button>
      )}

    </div>
  );
}