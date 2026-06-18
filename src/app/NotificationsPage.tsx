import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, MessageSquare, Settings, LogOut, 
  Moon, Sun, ArrowRight, Clock, FileText
} from 'lucide-react';

// @ts-ignore
import logoUniversity from '../imports/logo.png'; 

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);

  // كلاسات الألوان المتناسقة
  const shellClassName = isDarkMode
    ? 'bg-[#060814] text-gray-200'
    : 'bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900';

  const sidebarClassName = isDarkMode
    ? 'bg-[#090d1f] border-white/5'
    : 'bg-white border-slate-200';

  const textTitleColor = isDarkMode ? 'text-white' : 'text-slate-800';
  const textSubColor = isDarkMode ? 'text-gray-400' : 'text-slate-500';

  // سجل التحديثات المضافة بالتاريخ الدقيق
  const notificationItems = [
    { id: 1, file: 'ملخص الشابتر الأول.pdf', category: 'مواد تفاعلية', courseTitle: 'البرمجة المتقدمة', date: '17 يونيو 2026', time: '02:15 AM' },
    { id: 2, file: 'شيت الجبر الخطّي - الجزء الثاني.pdf', category: 'مواد تفاعلية', courseTitle: 'جبر خطي', date: '16 يونيو 2026', time: '11:30 PM' },
    { id: 3, file: 'محاضرة مقدمة الشبكات.pptx', category: 'مصادر خارجية', courseTitle: 'تكنولوجيا الإنترنت', date: '15 يونيو 2026', time: '04:00 PM' },
  ];

  return (
    <div className={`min-h-screen flex ${shellClassName}`} style={{ fontFamily: "'Cairo', sans-serif", direction: 'rtl' }}>
      
      {/* القائمة الجانبية (Sidebar) */}
      <aside className={`w-64 border-l flex flex-col items-center py-6 hidden md:flex ${sidebarClassName}`}>
        <div className={`w-20 h-20 rounded-full bg-white p-1.5 flex items-center justify-center mb-10 shadow-lg overflow-hidden ${isDarkMode ? 'shadow-purple-500/5' : 'shadow-slate-200'}`}>
          <img src={logoUniversity} alt="HNU Logo" className="w-full h-full object-contain rounded-full" />
        </div>

        <nav className="w-full px-4 flex-1 space-y-2">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-right text-gray-400 hover:bg-white/5"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>لوحة التحكم</span>
          </button>
          
          <button 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-right bg-purple-600/10 border border-purple-500/20 text-purple-400"
          >
            <MessageSquare className="w-5 h-5" />
            <span>الرسائل والسجلات</span>
          </button>

          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-right ${isDarkMode ? 'text-gray-400 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100'}`}>
            <Settings className="w-5 h-5" />
            <span>الإعدادات</span>
          </button>
        </nav>

        <div className={`w-full px-4 border-t pt-4 ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-right">
            <LogOut className="w-5 h-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* المحتوى الرئيسي للتايم لاين */}
      <main className="flex-1 flex flex-col p-6 md:p-8 space-y-6 overflow-y-auto">
        
        {/* العلوى هيدر مصغر لتغيير التيم والرجوع */}
        <div className="flex items-center justify-between border-b border-purple-500/10 pb-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-[#0d122c] border-white/5 text-gray-400 hover:text-white' : 'bg-white border-slate-200 text-slate-700'}`}
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div>
              <h3 className={`text-xl font-bold tracking-wide ${textTitleColor}`}>سجل التحديثات والإشعارات الأكاديمية</h3>
              <p className={`text-xs mt-1 ${textSubColor}`}>متابعة زمنية حية لكل الملفات والمصادر المرفوعة</p>
            </div>
          </div>

          <div className={`flex items-center rounded-full p-1 gap-1 ${isDarkMode ? 'bg-[#0d122c] border border-white/10' : 'bg-slate-100 border border-slate-200'}`}>
            <button onClick={() => setIsDarkMode(false)} className={`p-1.5 rounded-full transition-all ${!isDarkMode ? 'bg-purple-600 text-white' : 'text-gray-500'}`}>
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setIsDarkMode(true)} className={`p-1.5 rounded-full transition-all ${isDarkMode ? 'bg-purple-600 text-white' : 'text-gray-500'}`}>
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* التايم لاين الزمنى */}
        <div className="relative border-r-2 border-purple-500/20 pr-6 mr-4 space-y-8 flex-1">
          {notificationItems.map((item) => (
            <div key={item.id} className="relative group">
              <div className="absolute -right-[31px] top-1 w-3.5 h-3.5 rounded-full bg-purple-600 border-4 border-[#060814] group-hover:bg-amber-500 transition-all"></div>
              
              <div className={`p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${isDarkMode ? 'bg-[#0d1222]/60 border-white/5 hover:border-purple-500/30' : 'bg-white border-slate-200 shadow-sm hover:border-purple-500/30'}`}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-semibold">{item.category}</span>
                      <span className={`text-xs font-medium ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>في ({item.courseTitle})</span>
                    </div>
                    <h4 className={`text-base font-bold ${textTitleColor}`}>{item.file}</h4>
                    <p className="text-xs text-gray-500">تم الرفع بنجاح ومتاح الآن للتحميل والمعاينة المباشرة.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/[0.02] px-3 py-1.5 rounded-xl border border-white/5">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>{item.date}</span>
                  <span className="text-purple-500 font-mono">•</span>
                  <span className="font-mono">{item.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}