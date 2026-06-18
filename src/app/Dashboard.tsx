import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { 
  LayoutDashboard, MessageSquare, Settings, LogOut, 
  Bell, Moon, Sun, Search, ArrowLeft,
  User, Globe, Brain, Network, Database, BookOpen, Calendar, Camera,
  Volume2, VolumeX, Volume1, Sliders, AlertCircle
} from 'lucide-react';

// @ts-ignore
import logoUniversity from '../imports/logo.png'; 

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement | null>(null);

  // 🛠️ مراجع والتحكم في نافذة الإعدادات العائمة الشاملة
  const [isAudioSettingsOpen, setIsAudioSettingsOpen] = useState(false);
  const audioSettingsRef = useRef<HTMLDivElement | null>(null);

  // 👤 ستيتس بيانات الطالب الحالي
  const [currentStudentName, setCurrentStudentName] = useState('طالب أكاديمي');
  const [currentStudentID, setCurrentStudentID] = useState('9322401409');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentImage, setStudentImage] = useState<string | null>(null);

  // 📚 قائمة المواد الدراسية النشطة المفلترة حسب الأدمن
  const [studentCourses, setStudentCourses] = useState<any[]>([]);
  // 🔔 قائمة الإشعارات الحية القادمة من الأدمن
  const [notificationItems, setNotificationItems] = useState<any[]>([]);
  const [hasNewNotif, setHasNewNotif] = useState(false);

  // ✨ تعريف متغيرات التصميم والألوان بناءً على الـ Dark Mode
  const shellClassName = isDarkMode ? 'bg-[#060814] text-white' : 'bg-slate-50 text-slate-900';
  const sidebarClassName = isDarkMode ? 'bg-[#090d22] border-white/5' : 'bg-white border-slate-200';
  const headerClassName = isDarkMode ? 'bg-[#090d22]/80 border-white/5 backdrop-blur-md' : 'bg-white/80 border-slate-200 backdrop-blur-md';
  const cardClassName = isDarkMode ? 'bg-[#090d22] border-white/5 text-white' : 'bg-white border-slate-200 text-slate-900';
  
  const textTitleColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSubColor = isDarkMode ? 'text-gray-400' : 'text-slate-500';
  const courseTitleColor = isDarkMode ? 'text-amber-400' : 'text-purple-700';

  // 🖱️ دالة الانتقال لصفحة تفاصيل المادة ونقل الداتا المرفوعة معها
  const handleCourseClick = (course: any) => {
    navigate('/course-details', { state: { courseId: course.id, courseTitle: course.name, courseData: course } });
  };

  // 🌐 جلب ومزامنة المنظومة الأكاديمية كاملة لحظياً فور تحميل الصفحة
  useEffect(() => {
    const savedName = localStorage.getItem('current_student_name');
    
    if (savedName) {
      setCurrentStudentName(savedName);

      // دالة موحدة قاطعة لفرز المواد من الكاش المشترك للأدمن لمنع اختفائها بسبب السيرفر
      const filterAndRenderCourses = (targetEmail?: string) => {
        try {
          const localStudents = JSON.parse(localStorage.getItem('hnu_registered_students') || '[]');
          
          // مطابقة دقيقة ومرنة للوصول لكارت الطالب المسجل
          const currentLocal = localStudents.find((s: any) => {
            const sName = (s.fullName || s.name || '').toString().trim().replace(/\s+/g, ' ');
            const tName = savedName.trim().replace(/\s+/g, ' ');
            return sName === tName || (targetEmail && s.email === targetEmail);
          });

          if (currentLocal) {
            // تثبيت البيانات الشخصية الأساسية
            setStudentEmail(currentLocal.email || '');
            setCurrentStudentID(currentLocal.id || "932240109");

            // جلب الصورة المعزولة بالحساب المربوطة بالإيميل
            const savedAvatar = localStorage.getItem(`hnu_student_avatar_${currentLocal.email}`);
            setStudentImage(savedAvatar || null);

            // 🔐 جلب وتثبيت المواد من الكاش الموحد للأدمن (مستحيل تختفي الحين)
            const globalCourses = JSON.parse(localStorage.getItem('hnu_global_courses') || '[]');
            const studentAllowedIds = (currentLocal.enrolledCourseIds || []).map((id: any) => String(id).trim());
            
            const filtered = globalCourses.filter((course: any) => 
              studentAllowedIds.includes(String(course.id).trim())
            );
            setStudentCourses(filtered);
          }
        } catch (e) {
          console.error("خطأ مزامنة:", e);
        }
      };

      // 1. العرض الفوري اللحظي الثابت من الكاش
      filterAndRenderCourses();

      // 2. طلب السيرفر لتحديث الإيميل والـ ID فقط بدون التلاعب بـ مصفوفة عرض المواد
      fetch(`http://localhost:5000/api/get-student?name=${encodeURIComponent(savedName)}`)
        .then(res => res.json())
        .then(data => {
          if (data.student) {
            setStudentEmail(data.student.email || '');
            setCurrentStudentID(data.student.id || "932240109");
            
            const savedAvatar = localStorage.getItem(`hnu_student_avatar_${data.student.email}`);
            setStudentImage(savedAvatar || null);

            // إعادة تشغيل دالة الفرز المعتمدة على داتا الأدمن لضمان التزامن الكامل
            filterAndRenderCourses(data.student.email);
          }
        })
        .catch(() => {
          // Fallback في حالة سقوط الشبكة
          filterAndRenderCourses();
        });

      // 🔔 جلب ومزامنة تنبيهات الإشعارات الحية القادمة من الأدمن
      const liveNotifications = JSON.parse(localStorage.getItem('hnu_notifications') || '[]');
      setNotificationItems(liveNotifications);
      setHasNewNotif(localStorage.getItem('hnu_has_new_notif') === 'true');

    } else {
      navigate('/');
    }
  }, [navigate]);

  // جلب قيم الصوت الحالية من الـ localStorage تلقائياً
  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem('site_volume');
    return saved !== null ? parseFloat(saved) : 0.12; 
  });

  const [isMuted, setIsMuted] = useState<boolean>(() => {
    return localStorage.getItem('site_muted') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('site_volume', volume.toString());
    localStorage.setItem('site_muted', isMuted.toString());
  }, [volume, isMuted]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // رفع الصورة الشخصية وتثبيتها بالإيميل الخاص
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && studentEmail) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setStudentImage(base64String);
        localStorage.setItem(`hnu_student_avatar_${studentEmail}`, base64String); 
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (audioSettingsRef.current && !audioSettingsRef.current.contains(event.target as Node)) {
        setIsAudioSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, []);

  const getSidebarItemClassName = (path: string) => {
    const isActive = location.pathname === path;
    if (isActive) {
      return 'w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 font-medium transition-all text-right cursor-pointer';
    }
    return isDarkMode
      ? 'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-right text-gray-400 hover:bg-white/5 hover:text-white border border-transparent cursor-pointer'
      : 'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-right text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent cursor-pointer';
  };

  const courseIcons = [
    <Brain className="w-8 h-8 text-[#d4af37]" />,
    <Database className="w-8 h-8 text-[#d4af37]" />,
    <Globe className="w-8 h-8 text-[#d4af37]" />,
    <Network className="w-8 h-8 text-[#d4af37]" />,
    <BookOpen className="w-8 h-8 text-[#d4af37]" />
  ];

  const handleOpenNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setHasNewNotif(false);
    localStorage.setItem('hnu_has_new_notif', 'false');
  };

  return (
    <div className={`min-h-screen flex ${shellClassName}`} style={{ fontFamily: "'Cairo', sans-serif", direction: 'rtl' }}>
      
      {/* 1. القائمة الجانبية (Sidebar) */}
      <aside className={`w-64 border-l flex flex-col items-center py-6 hidden md:flex ${sidebarClassName}`}>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          aria-label="العودة إلى لوحة التحكم"
          className={`w-20 h-20 rounded-full bg-white p-1.5 flex items-center justify-center mb-10 shadow-lg overflow-hidden cursor-pointer ${isDarkMode ? 'shadow-purple-500/5' : 'shadow-slate-200'}`}
        >
          <img src={logoUniversity} alt="HNU Logo" className="w-full h-full object-contain rounded-full" />
        </button>

        <nav className="w-full px-4 flex-1 space-y-2 relative">
          <button onClick={() => navigate('/dashboard')} className={getSidebarItemClassName('/dashboard')}>
            <LayoutDashboard className="w-5 h-5" />
            <span>لوحة التحكم</span>
          </button>
          
          <button onClick={() => navigate('/schedule')} className={getSidebarItemClassName('/schedule')}>
            <Calendar className="w-5 h-5" />
            <span>جدول المحاضرات</span>
          </button>

          <button onClick={() => navigate('/notifications')} className={getSidebarItemClassName('/notifications')}>
            <MessageSquare className="w-5 h-5" />
            <span>الرسائل والسجلات</span>
          </button>

          <div className="relative" ref={audioSettingsRef}>
            <button 
              onClick={() => setIsAudioSettingsOpen(!isAudioSettingsOpen)}
              className={isAudioSettingsOpen ? 'w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium transition-all text-right cursor-pointer' : getSidebarItemClassName('/settings')}
            >
              <Settings className="w-5 h-5" />
              <span>الإعدادات</span>
            </button>

            {isAudioSettingsOpen && (
              <div className={`absolute right-full mr-3 top-0 z-[999] w-72 p-4 rounded-2xl border shadow-2xl animate-in fade-in slide-in-from-left-3 duration-200 text-right ${isDarkMode ? 'bg-[#0b1024] border-white/10 text-gray-200 shadow-black/80' : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/40'}`}>
                <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-bold">التحكم في مؤثرات النقر</h4>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center text-[11px] font-medium text-gray-400">
                    <span>حجم الصوت الشامل</span>
                    <span className="text-amber-400 font-mono font-bold">{isMuted ? '0%' : `${Math.round((volume / 0.3) * 100)}%`}</span>
                  </div>

                  <div className="flex items-center gap-2.5 bg-black/20 p-2 rounded-xl border border-white/5">
                    <button 
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className={`p-1.5 rounded-lg transition-all ${isMuted ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'} cursor-pointer`}
                    >
                      {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : volume > 0.15 ? <Volume2 className="w-3.5 h-3.5" /> : <Volume1 className="w-3.5 h-3.5" />}
                    </button>

                    <input 
                      type="range" 
                      min="0" 
                      max="0.3" 
                      step="0.02"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => {
                        setVolume(parseFloat(e.target.value));
                        if (isMuted) setIsMuted(false); 
                      }}
                      className="flex-1 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className={`w-full py-2 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${isMuted ? 'bg-amber-500 text-[#060814]' : 'bg-white/5 text-gray-400'}`}
                  >
                    {isMuted ? <span>تفعيل أصوات النقر</span> : <span>كتم الصوت كلياً 🔇</span>}
                  </button>
                </div>

                <div className="border-t border-white/5 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem('current_student_name');
                      navigate('/');
                    }}
                    className="w-full py-2.5 rounded-xl font-bold text-xs bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>تسجيل الخروج من البوابة</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 flex flex-col relative">
        <header className={`w-full px-6 py-4 border-b flex items-center justify-between z-30 ${headerClassName}`}>
          <div className="relative w-full max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="ابحث عن المواد، الإعلانات، المصادر..." 
              className={`w-full border rounded-xl py-2 pr-10 pl-4 text-sm transition-all focus:outline-none focus:border-purple-500/50 ${isDarkMode ? 'bg-[#0d122c] border-white/10 text-gray-200 placeholder:text-gray-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'}`}
            />
          </div>

          <div ref={notificationsRef} className="flex items-center gap-4 relative" style={{ direction: 'ltr' }}>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              aria-label="العودة إلى لوحة التحكم"
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
              onClick={handleOpenNotifications}
              className={`p-2 rounded-xl border transition-all relative cursor-pointer ${
                hasNewNotif 
                  ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse border-red-500' 
                  : isDarkMode ? 'bg-[#0d122c] border-white/5 text-gray-400 hover:bg-white/5' : 'bg-slate-100 border border-slate-200 text-slate-500'
              }`}
              aria-expanded={isNotificationsOpen}
            >
              <Bell className="w-4 h-4" />
              {notificationItems.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 rounded-full bg-purple-500 text-white text-[10px] leading-5 text-center font-bold shadow-md">
                  {notificationItems.length}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div role="menu" className={`absolute top-full mt-3 left-0 z-[999] w-80 rounded-2xl border shadow-2xl overflow-visible text-right ${isDarkMode ? 'bg-[#0b1024] border-white/10 text-gray-200' : 'bg-white border-slate-200 text-slate-900'}`}>
                <div className={`absolute -top-1.5 left-3.5 w-3 h-3 rotate-45 border-t border-l ${isDarkMode ? 'bg-[#0b1024] border-white/10' : 'bg-white border-slate-200'}`}></div>

                <div className={`px-4 py-3 border-b relative z-10 ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                  <h4 className="text-sm font-bold">إشعارات البوابة الأكاديمية</h4>
                  <p className={`text-[11px] mt-0.5 ${textSubColor}`}>آخر التحديثات والملفات المرفوعة من الأدمن</p>
                </div>

                <div className="max-h-72 overflow-y-auto p-2 space-y-2 relative z-10">
                  {notificationItems.length > 0 ? (
                    notificationItems.map((item) => (
                      <div
                        key={item.id}
                        className={`px-3 py-2.5 text-xs rounded-xl transition-all border border-transparent flex flex-col gap-1 text-right ${isDarkMode ? 'bg-white/[0.02] hover:bg-white/[0.05]' : 'bg-slate-50 hover:bg-slate-100'}`} style={{ direction: 'rtl' }}
                      >
                        <div className="flex items-start gap-1 flex-wrap">
                          <span className="text-amber-400 font-bold">{item.title}:</span>
                          <span className="font-semibold text-gray-300 select-all">{item.body}</span>
                        </div>
                        <span className="text-[9px] text-gray-500 block text-left mt-0.5">{item.time} - {item.date}</span>
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

        <div className="p-6 md:p-8 space-y-8 flex-1 overflow-y-auto">
          
          {/* كارت البروفايل الديناميكي المستقر */}
          <div className={`w-full rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden ${isDarkMode ? 'bg-gradient-to-l from-[#0e1129] to-[#090b1a] border border-purple-500/10' : 'bg-white border border-slate-200/80'}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-right">
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-full p-0.5 bg-gradient-to-tr from-purple-600 to-amber-500 shadow-lg overflow-hidden flex items-center justify-center border border-dashed border-purple-500/40 bg-purple-950/20 cursor-pointer group relative"
              >
                {studentImage ? (
                  <>
                    <img src={studentImage} alt="Student Profile" className="w-full h-full object-cover rounded-full" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center rounded-full">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="text-center p-1 flex flex-col items-center justify-center transition-all group-hover:scale-105">
                    <span className="text-[10px] text-purple-300 font-medium tracking-wide">ارفع صورتك</span>
                  </div>
                )}
              </div>

              <div>
                <span className="text-[10px] tracking-widest text-purple-400 font-bold uppercase block mb-1">ملف الطالب الأكاديمي الحالي</span>
                <h2 className={`text-2xl font-bold mb-1 ${textTitleColor}`}>{currentStudentName}</h2>
                <p className={`text-xs ${textSubColor}`}>تخصص علوم البيانات (Data Science)</p>
                <p className="text-[11px] text-gray-500 mt-2">بناء الحلول.. وتصميم المستقبل.</p>
              </div>
            </div>

            <div className={`rounded-xl px-6 py-4 text-center md:text-left min-w-[200px] ${isDarkMode ? 'bg-[#060814]/80 border border-white/5' : 'bg-slate-50 border border-slate-200'}`}>
              <span className="text-[10px] text-gray-500 block mb-1 uppercase tracking-wider">الرقم الأكاديمي للطالب</span>
              <span className="text-sm font-mono font-bold text-purple-400 tracking-wider">{currentStudentID}</span>
            </div>
          </div>

          {/* قسم المواد الدراسية النشطة المفرزة ديناميكياً */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className={`text-xl font-bold tracking-wide ${textTitleColor}`}>موادي الدراسية النشطة</h3>
              <p className="text-xs text-gray-500">عدد المواد المسجلة: {studentCourses.length}</p>
            </div>

            {studentCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studentCourses.map((course, index) => (
                  <div 
                    key={course.id} 
                    onClick={() => handleCourseClick(course)} 
                    className={`border-2 rounded-[24px] p-6 flex flex-col items-center text-center shadow-2xl relative group hover:border-amber-500/40 transition-all duration-300 min-h-[340px] justify-between cursor-pointer ${cardClassName}`}
                    style={{ boxShadow: isDarkMode ? '0 20px 40px -15px rgba(0,0,0,0.7)' : '0 20px 40px -15px rgba(15,23,42,0.06)' }}
                  >
                    <div className="w-16 h-16 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-all">
                      {courseIcons[index % courseIcons.length]}
                    </div>

                    <div className="space-y-2 flex-1 flex flex-col justify-center">
                      <h4 className={`text-xl font-bold tracking-wide transition-all ${courseTitleColor}`}>
                        {course.name}
                      </h4>
                      <p className={`text-xs px-2 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>الدكتور المحاضر: {course.doctor}</p>
                      <p className={`text-xs font-medium font-mono ${isDarkMode ? 'text-purple-400/70' : 'text-purple-600/80'}`}>كود المادة: {course.code}</p>
                    </div>

                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleCourseClick(course);
                      }}
                      className="mt-5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 font-semibold text-xs px-5 py-2.5 rounded-full transition-all flex items-center gap-2 group-hover:bg-amber-500 group-hover:text-[#060814]"
                    >
                      <span>محتويات المادة</span>
                      <ArrowLeft className="w-3.5 h-3.5 bg-amber-500 text-[#0d1222] rounded-full p-0.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-white/5 rounded-2xl bg-[#090d22]/30 max-w-2xl mx-auto space-y-2">
                <AlertCircle className="w-10 h-10 text-gray-600 mx-auto" />
                <p className="text-sm font-bold text-gray-300">لا توجد مواد مسجلة في جدولك حالياً</p>
                <p className="text-xs text-gray-500">يرجى مراجعة شؤون الطلاب أو قيام الأدمن بتفعيل المواد لـ حسابك عبر لوحة الفحص.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}