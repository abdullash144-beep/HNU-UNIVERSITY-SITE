import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowRight, Moon, Sun, BookOpen, Layers, FileText, Video, Presentation, HelpCircle, Bell, AlertCircle
} from 'lucide-react';

// @ts-ignore
import logoUniversity from '../imports/logo.png'; 

export default function CourseDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement | null>(null);

  // استقبال داتا المادة المنتقل إليها من الـ Dashboard
  const { courseId, courseTitle, courseData } = location.state || {};
  const [currentCourse, setCurrentCourse] = useState<any>(courseData || null);

  // قائمة الإشعارات الحية القادمة من الأدمن
  const [notificationItems, setNotificationItems] = useState<any[]>([]);

  // مزامنة محتويات وخانات المادة لحظياً من الكاش المشترك للأدمن لمنع تعليق الأرقام الافتراضية
  useEffect(() => {
    // جلب الإشعارات التلقائية الحية
    const liveNotifications = JSON.parse(localStorage.getItem('hnu_notifications') || '[]');
    setNotificationItems(liveNotifications);

    if (!courseId) return;

    const syncCourseData = () => {
      const globalCourses = JSON.parse(localStorage.getItem('hnu_global_courses') || '[]');
      const freshCourse = globalCourses.find((c: any) => c.id === courseId);
      if (freshCourse) {
        setCurrentCourse(freshCourse);
      }
    };

    // مزامنة فورية عند التحميل
    syncCourseData();

    // الاستماع لأي تغييرات يقوم بها الأدمن أوفلاين
    window.addEventListener('storage', syncCourseData);
    return () => window.removeEventListener('storage', syncCourseData);
  }, [courseId]);

  // حماية صارمة: لو دخل على الصفحة بدون مادة مبعوتة يرجعه للداش بورد
  if (!courseId || !currentCourse) {
    return (
      <div className="min-h-screen bg-[#060814] flex flex-col items-center justify-center text-white" style={{ fontFamily: "'Cairo', sans-serif" }}>
        <AlertCircle className="w-12 h-12 text-red-400 mb-2 animate-bounce" />
        <p className="text-sm font-bold">لم يتم تحديد المادة الدراسية بشكل صحيح!</p>
        <button onClick={() => navigate('/dashboard')} className="mt-4 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs">العودة للوحة التحكم</button>
      </div>
    );
  }

  // كلاسات الألوان المتناسقة مع تصميمك الداكن والفاتح
  const shellClassName = isDarkMode
    ? 'bg-[#060814] text-gray-200'
    : 'bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900';

  const cardClassName = isDarkMode
    ? 'bg-[#0d1222]/80 border border-white/5 text-gray-200 shadow-2xl'
    : 'bg-white border border-slate-200 text-slate-900 shadow-md hover:border-amber-500/30';

  const textTitleColor = isDarkMode ? 'text-white' : 'text-slate-800';
  const textSubColor = isDarkMode ? 'text-gray-400' : 'text-slate-500';
  const textOrangeColor = isDarkMode ? 'text-amber-500' : 'text-amber-600';

  // 🗂️ التعديل الجوهري: ربط الأعداد بطول مصفوفة الملفات المرفوعة من الأدمن بالملي
  const items = [
    { id: 1, title: 'كتب تفاعلية', key: 'interactiveBooks', count: (currentCourse.interactiveBooks || []).length, icon: <BookOpen className="w-6 h-6 text-emerald-400" /> },
    { id: 2, title: 'مواد تفاعلية', key: 'interactiveMaterials', count: (currentCourse.interactiveMaterials || []).length, icon: <Layers className="w-6 h-6 text-amber-400" /> },
    { id: 3, title: 'مراجع إضافية', key: 'extraReferences', count: (currentCourse.extraReferences || []).length, icon: <FileText className="w-6 h-6 text-blue-400" /> },
    { id: 4, title: 'مقاطع فيديو', key: 'videos', count: (currentCourse.videos || []).length, icon: <Video className="w-6 h-6 text-yellow-400" /> },
    { id: 5, title: 'عروض تقديمية', key: 'presentations', count: (currentCourse.presentations || []).length, icon: <Presentation className="w-6 h-6 text-purple-400" /> },
    { id: 6, title: 'الأسئلة الطلابية', key: 'studentQuestions', count: (currentCourse.studentQuestions || []).length, icon: <HelpCircle className="w-6 h-6 text-cyan-400" /> },
  ];

  // دالة الملاحة وتمرير تفاصيل المستندات المرفوعة إلى الصفحة التالية
  const handleItemClick = (item: any) => {
    const filesArray = currentCourse[item.key] || [];
    navigate('/office-details', { 
      state: { 
        courseId: courseId,
        courseTitle: currentCourse.name, 
        categoryTitle: item.title,
        files: filesArray 
      } 
    });
  };

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, []);

  return (
    <div className={`min-h-screen flex flex-col ${shellClassName}`} style={{ fontFamily: "'Cairo', sans-serif", direction: 'rtl' }}>
      
      {/* الهيدر العلوي المطور */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-white/5 z-30">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 font-medium text-xs hover:bg-purple-600/20 transition-all cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للوحة التحكم</span>
        </button>

        {/* الجزء الأيسر: الشعار، زر الثيم، والجرس التفاعلي */}
        <div ref={notificationsRef} className="flex items-center gap-4 relative" style={{ direction: 'ltr' }}>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="w-9 h-9 rounded-full bg-white p-0.5 flex items-center justify-center border border-white/20 overflow-hidden shadow-md cursor-pointer"
          >
            <img src={logoUniversity} alt="HNU Logo Small" className="w-full h-full object-contain rounded-full" />
          </button>
          
          <div className={`flex items-center rounded-full p-1 gap-1 ${isDarkMode ? 'bg-[#0d122c] border border-white/10' : 'bg-slate-100 border border-slate-200'}`}>
            <button onClick={() => setIsDarkMode(false)} className={`p-1.5 rounded-full transition-all ${!isDarkMode ? 'bg-purple-600 text-white' : 'text-gray-500'}`}><Sun className="w-3.5 h-3.5" /></button>
            <button onClick={() => setIsDarkMode(true)} className={`p-1.5 rounded-full transition-all ${isDarkMode ? 'bg-purple-600 text-white' : 'text-gray-500'}`}><Moon className="w-3.5 h-3.5" /></button>
          </div>

          <button
            type="button"
            onClick={() => setIsNotificationsOpen((open) => !open)}
            className={`p-2 rounded-xl border transition-all relative cursor-pointer ${isDarkMode ? 'bg-[#0d122c] border-white/5 text-gray-400 hover:bg-white/5' : 'bg-slate-100 border border-slate-200 text-slate-500 hover:bg-slate-900'}`}
          >
            <Bell className="w-4 h-4" />
            {notificationItems.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 rounded-full bg-purple-500 text-white text-[10px] leading-5 text-center font-bold shadow-md">
                {notificationItems.length}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className={`absolute top-full mt-3 left-0 z-[999] w-80 rounded-2xl border shadow-2xl overflow-visible text-right animate-in fade-in slide-in-from-top-2 duration-200 ${isDarkMode ? 'bg-[#0b1024] border-white/10 text-gray-200 shadow-black/80' : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/60'}`}>
              <div className={`absolute -top-1.5 left-3.5 w-3 h-3 rotate-45 border-t border-l ${isDarkMode ? 'bg-[#0b1024] border-white/10' : 'bg-white border-slate-200'}`}></div>
              <div className={`px-4 py-3 border-b relative z-10 ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                <h4 className="text-sm font-bold">إشعارات البوابة الأكاديمية</h4>
                <p className={`text-[11px] mt-0.5 ${textSubColor}`}>آخر الملفات والمستندات المضافة حديثاً</p>
              </div>
              <div className="max-h-72 overflow-y-auto p-2 space-y-2 relative z-10">
                {notificationItems.length > 0 ? (
                  notificationItems.map((item) => (
                    <div key={item.id} className={`px-3 py-2.5 text-xs rounded-xl transition-all border border-transparent flex flex-col gap-1 text-right ${isDarkMode ? 'bg-white/[0.02] hover:bg-white/[0.05]' : 'bg-slate-50 hover:bg-slate-100'}`} style={{ direction: 'rtl' }}>
                      <div className="flex items-start gap-1 flex-wrap">
                        <span className="text-purple-400 font-bold">{item.title}:</span>
                        <span className="font-semibold select-all text-gray-300">{item.body}</span>
                      </div>
                      <span className="text-[9px] text-gray-500 block text-left mt-0.5">{item.time}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic text-center py-4">لا توجد إشعارات مسجلة حالياً.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full space-y-10">
        
        <div className="text-center md:text-right space-y-2">
          <h2 className={`text-4xl font-extrabold tracking-wide ${textOrangeColor}`}>
            {currentCourse.name}
          </h2>
          <p className="text-xs text-gray-400 font-medium">الدكتور المحاضر: <span className="text-white font-bold">{currentCourse.doctor}</span> | كود المادة: <span className="font-mono text-purple-400">{currentCourse.code}</span></p>
        </div>

        {/* شبكة عرض كروت المواد الستة المحدثة وديناميكية الأعداد */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            return (
              <div 
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`rounded-3xl p-6 flex flex-col justify-between min-h-[180px] transition-all duration-300 hover:scale-[1.02] cursor-pointer relative overflow-hidden group ${cardClassName}`}
              >
                {/* الخلفية التفاعلية الفخمة */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-0 bg-gradient-to-t from-[#2c1d04] via-[#5c3e08] to-[#8f6412] opacity-0 transition-all duration-500 ease-out z-0 group-hover:h-full group-hover:opacity-100"
                />

                {/* البيانات الداخلية للكرت مقفلة بـ z-10 لتظهر فوق تأثير الصعود */}
                <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-1 text-right order-2">
                    <h3 className={`text-lg font-bold transition-colors duration-300 group-hover:text-[#fcd34d] ${textTitleColor}`}>
                      {item.title}
                    </h3>
                    <p className={`text-xs transition-colors duration-300 group-hover:text-amber-200/80 ${textSubColor}`}>
                      عدد {item.title}: <span className="font-mono font-bold">{item.count}</span>
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl border transition-all duration-300 order-1 bg-white/[0.02] border-white/5 group-hover:bg-amber-500/20 group-hover:border-amber-400/40 group-hover:scale-105`}>
                    {item.icon}
                  </div>
                </div>

                {/* زر وجملة معرفة المزيد السفلي */}
                <div className={`flex items-center gap-1.5 text-xs transition-colors duration-300 pt-4 border-t border-white/[0.02] w-fit relative z-10 group-hover:text-white group-hover:font-bold ${textSubColor}`}>
                  <span>معرفة المزيد</span>
                  <ArrowRight className="w-3.5 h-3.5 rotate-180 transition-transform duration-300 group-hover:translate-x-[-4px] group-hover:text-amber-300" />
                </div>
              </div>
            );
            
          })}
        </div>

      </main>
    </div>
  );
}