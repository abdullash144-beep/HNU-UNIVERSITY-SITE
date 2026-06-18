import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Plus, Trash2, X, Moon, Sun, ArrowRight, Clock, MapPin } from 'lucide-react';

// @ts-ignore
import logoUniversity from '../../imports/logo.png';

interface ScheduleSlot {
  time: string;
  room: string;
}

export default function SchedulePage() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // الأيام المطلوبة (ما عدا الجمعة)
  const days = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
  
  // المواد الستة الخاصة بك في الصف العلوي
  const courses = ['جبر خطي', 'تكنولوجيا الإنترنت', 'البرمجة المتقدمة', 'الذكاء الاصطناعي', 'تحليل وتصميم النظم', 'هياكل البيانات'];

  // State لتخزين المواعيد المضافة في الـ 36 خانة (مفتاح فريد يربط اليوم بالمادة)
  const [scheduleData, setScheduleData] = useState<Record<string, ScheduleSlot>>({});
  
  // State للتحكم في فتح النافذة المنبثقة لإضافة موعد
  const [activeSlot, setActiveSlot] = useState<{ day: string; course: string } | null>(null);
  const [inputTime, setInputTime] = useState('');
  const [inputRoom, setInputRoom] = useState('');

  // كلاسات تنسيق الألوان الديناميكية
  const shellClassName = isDarkMode ? 'bg-[#060814] text-gray-200' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900';
  const sidebarClassName = isDarkMode ? 'bg-[#090d1f] border-white/5' : 'bg-white border-slate-200';
  const textTitleColor = isDarkMode ? 'text-white' : 'text-slate-800';
  const tableHeaderBg = isDarkMode ? 'bg-[#0d122c] border-white/10' : 'bg-slate-100 border-slate-200';
  const gridCellBg = isDarkMode ? 'bg-[#0a0d20]/50 border-white/5 hover:bg-[#0f1430]' : 'bg-white border-slate-200 hover:bg-slate-50';

  // حفظ الموعد داخل الخانة المحددة
  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSlot || !inputTime) return;

    const slotKey = `${activeSlot.day}-${activeSlot.course}`;
    setScheduleData(prev => ({
      ...prev,
      [slotKey]: { time: inputTime, room: inputRoom }
    }));

    // إعادة تعيين الحقول وإغلاق المودال
    setInputTime('');
    setInputRoom('');
    setActiveSlot(null);
  };

  // حذف موعد من الخانة
  const handleDeleteSlot = (day: string, course: string, e: React.MouseEvent) => {
    e.stopPropagation(); // منع فتح المودال عند الضغط على الحذف
    const slotKey = `${day}-${course}`;
    setScheduleData(prev => {
      const updated = { ...prev };
      delete updated[slotKey];
      return updated;
    });
  };

  return (
    <div className={`min-h-screen flex ${shellClassName}`} style={{ fontFamily: "'Cairo', sans-serif", direction: 'rtl' }}>
      
      {/* القائمة الجانبية (Sidebar) */}
      <aside className={`w-64 border-l flex flex-col items-center py-6 hidden md:flex ${sidebarClassName}`}>
        <div className="w-20 h-20 rounded-full bg-white p-1.5 flex items-center justify-center mb-10 shadow-lg overflow-hidden">
          <img src={logoUniversity} alt="HNU Logo" className="w-full h-full object-contain rounded-full" />
        </div>
        <nav className="w-full px-4 flex-1 space-y-2">
          <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-right text-gray-400 hover:bg-white/5">
            <LayoutDashboard className="w-5 h-5" />
            <span>لوحة التحكم</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-right bg-purple-600/10 border border-purple-500/20 text-purple-400">
            <Calendar className="w-5 h-5" />
            <span>جدول المحاضرات التفاعلي</span>
          </button>
        </nav>
      </aside>

      {/* المحتوى الرئيسي للجدول */}
      <main className="flex-1 flex flex-col p-6 md:p-8 space-y-6 overflow-x-auto">
        
        {/* هيدر الصفحة العلوي */}
        <div className="flex items-center justify-between border-b border-purple-500/10 pb-4 min-w-[800px]">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-[#0d122c] border-white/5 text-gray-400 hover:text-white' : 'bg-white border-slate-200 text-slate-700'}`}>
              <ArrowRight className="w-5 h-5" />
            </button>
            <div>
              <h3 className={`text-xl font-bold tracking-wide ${textTitleColor}`}>منظم جدول المحاضرات الشخصي</h3>
              <p className="text-xs text-gray-500 mt-1">اضغط على علامة (+) في أي خانة لإضافة وتعديل مواعيد محاضراتك وسكاشنك يدوياً</p>
            </div>
          </div>
          <div className={`flex items-center rounded-full p-1 gap-1 ${isDarkMode ? 'bg-[#0d122c] border border-white/10' : 'bg-slate-100 border border-slate-200'}`}>
            <button onClick={() => setIsDarkMode(false)} className={`p-1.5 rounded-full transition-all ${!isDarkMode ? 'bg-purple-600 text-white' : 'text-gray-500'}`}><Sun className="w-3.5 h-3.5" /></button>
            <button onClick={() => setIsDarkMode(true)} className={`p-1.5 rounded-full transition-all ${isDarkMode ? 'bg-purple-600 text-white' : 'text-gray-500'}`}><Moon className="w-3.5 h-3.5" /></button>
          </div>
        </div>

        {/* شبكة الجدول الكبيرة التفاعلية (6 مواد × 6 أيام = 36 خانة) */}
        <div className="w-full overflow-x-auto border border-purple-500/10 rounded-2xl shadow-xl min-w-[900px]">
          <table className="w-full border-collapse text-right table-fixed">
            <thead>
              <tr className={tableHeaderBg}>
                {/* الخانة الفارغة في الزاوية اليمنى العليا */}
                <th className="p-4 w-32 border-b border-l border-inherit font-bold text-sm text-purple-400">اليوم \ المادة</th>
                {courses.map((course, idx) => (
                  <th key={idx} className="p-4 border-b border-l border-inherit text-center font-bold text-sm text-gray-200 dark:text-inherit">
                    {course}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day, dayIdx) => (
                <tr key={dayIdx} className={dayIdx !== days.length - 1 ? (isDarkMode ? 'border-b border-white/5' : 'border-b border-slate-200') : ''}>
                  {/* عمود أيام الأسبوع الأيمن */}
                  <td className={`p-4 border-l font-bold text-sm text-center ${isDarkMode ? 'bg-[#090d1f]/60 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                    {day}
                  </td>
                  
                  {/* إنتاج الـ 36 خانة البرمجية المربعة بدقة متناهية */}
                  {courses.map((course, courseIdx) => {
                    const slotKey = `${day}-${course}`;
                    const hasData = scheduleData[slotKey];

                    return (
                      <td 
                        key={courseIdx} 
                        onClick={() => !hasData && setActiveSlot({ day, course })}
                        className={`p-3 border-l border-inherit transition-all duration-200 min-h-[110px] relative group cursor-pointer ${gridCellBg}`}
                      >
                        {hasData ? (
                          /* كارت عرض الموعد المضاف داخل الخانة المربعة */
                          <div className="p-2.5 rounded-xl bg-purple-600/10 border border-purple-500/30 text-right space-y-1.5 animate-in zoom-in-95 duration-150 relative">
                            <button 
                              onClick={(e) => handleDeleteSlot(day, course, e)}
                              className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-all p-1 rounded-md hover:bg-red-500/10"
                              title="حذف الموعد"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <div className="flex items-center gap-1.5 text-[11px] text-purple-300 font-medium">
                              <Clock className="w-3 h-3" />
                              <span className="font-mono">{hasData.time}</span>
                            </div>
                            {hasData.room && (
                              <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                                <MapPin className="w-3 h-3 text-amber-500" />
                                <span>{hasData.room}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* زر علامة الزائد (+) الافتراضي للخانة الفارغة */
                          <div className="w-full h-12 flex items-center justify-center text-gray-500 group-hover:text-purple-500 transition-all">
                            <Plus className="w-5 h-5 bg-purple-500/5 group-hover:bg-purple-500/20 border border-dashed border-gray-600/30 group-hover:border-purple-500/50 rounded-full p-1 transition-all" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* النافذة المنبثقة (Modal) لإدخال تفاصيل الموعد */}
        {activeSlot && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200">
            <form 
              onSubmit={handleSaveSlot}
              className={`w-full max-w-md rounded-2xl p-6 border shadow-2xl space-y-4 text-right relative animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-[#0d122c] border-white/10 text-gray-200' : 'bg-white border-slate-200 text-slate-900'}`}
            >
              <button 
                type="button" 
                onClick={() => setActiveSlot(null)}
                className="absolute top-4 left-4 text-gray-500 hover:text-gray-300 p-1"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div>
                <h4 className="text-base font-bold text-purple-400">إضافة موعد محاضرة جديد</h4>
                <p className="text-xs text-gray-500 mt-1">يوم {activeSlot.day} - مادة ({activeSlot.course})</p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold block mb-1.5 text-gray-400">توقيت المحاضرة (مثال: 09:00 AM - 11:00 AM)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="اكتب وقت المحاضرة بالظبط..." 
                    value={inputTime}
                    onChange={(e) => setInputTime(e.target.value)}
                    className={`w-full border rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-purple-500 ${isDarkMode ? 'bg-[#060814] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1.5 text-gray-400">مكان المحاضرة (مثال: مدرج 302 / معمل 4)</label>
                  <input 
                    type="text" 
                    placeholder="اكتب رقم المدرج أو القاعة..." 
                    value={inputRoom}
                    onChange={(e) => setInputRoom(e.target.value)}
                    className={`w-full border rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-purple-500 ${isDarkMode ? 'bg-[#060814] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold transition-all">
                  تأكيد الحفظ في الجدول
                </button>
                <button type="button" onClick={() => setActiveSlot(null)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${isDarkMode ? 'border-white/10 text-gray-400 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}