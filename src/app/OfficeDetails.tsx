import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowRight, Moon, Sun, Paperclip, Link, 
  FileText, Presentation, FileSpreadsheet, Bookmark, AlertCircle, ExternalLink
} from 'lucide-react';

export default function OfficeDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(true);

  const { courseId, courseTitle, categoryTitle, files } = location.state || {};
  const [uploadedFiles, setUploadedFiles] = useState<any[]>(files || []);

  useEffect(() => {
    if (!courseId || !categoryTitle) return;

    const syncOfficeFiles = () => {
      const globalCourses = JSON.parse(localStorage.getItem('hnu_global_courses') || '[]');
      const currentCourse = globalCourses.find((c: any) => c.id === courseId);
      
      if (currentCourse) {
        let key = '';
        if (categoryTitle === 'كتب تفاعلية') key = 'interactiveBooks';
        else if (categoryTitle === 'مواد تفاعلية') key = 'interactiveMaterials';
        else if (categoryTitle === 'مراجع إضافية') key = 'extraReferences';
        else if (categoryTitle === 'مقاطع فيديو') key = 'videos';
        else if (categoryTitle === 'عروض تقديمية') key = 'presentations';
        else if (categoryTitle === 'الأسئلة الطلابية') key = 'studentQuestions';

        if (key && currentCourse[key]) {
          setUploadedFiles(currentCourse[key]);
        }
      }
    };

    window.addEventListener('storage', syncOfficeFiles);
    return () => window.removeEventListener('storage', syncOfficeFiles);
  }, [courseId, categoryTitle]);

  // 🛠️ الحل السحري: دالة Blob لفتح الملفات في المتصفح مباشرة
  const handleOpenFile = (fileItem: any) => {
    if (fileItem && fileItem.data) {
      try {
        // فك تشفير Base64 إلى بيانات ثنائية
        const byteCharacters = atob(fileItem.data.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        
        // إنشاء Blob وعرضه في تبويب جديد
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
      } catch (error) {
        console.error("خطأ في فتح الملف:", error);
        alert("حدث خطأ أثناء محاولة فتح الملف.");
      }
    } else {
      alert("عذراً، هذا الملف لا يحتوي على بيانات للعرض.");
    }
  };

  const getFileName = (fileItem: any) => {
    if (typeof fileItem === 'string') return fileItem;
    return fileItem?.name || 'مستند بدون اسم';
  };

  const getFileIcon = (fileName: string) => {
    const nameLower = fileName.toLowerCase();
    if (nameLower.endsWith('.pptx') || nameLower.endsWith('.ppt')) return <Presentation className="w-6 h-6 text-orange-500" />;
    if (nameLower.endsWith('.xlsx') || nameLower.endsWith('.xls') || nameLower.endsWith('.csv')) return <FileSpreadsheet className="w-6 h-6 text-emerald-500" />;
    if (nameLower.endsWith('.docx') || nameLower.endsWith('.doc') || nameLower.endsWith('.pdf')) return <FileText className="w-6 h-6 text-blue-500" />;
    return <Bookmark className="w-6 h-6 text-purple-500" />;
  };

  if (!courseTitle || !categoryTitle) {
    return (
      <div className="min-h-screen bg-[#060814] flex flex-col items-center justify-center text-white" style={{ fontFamily: "'Cairo', sans-serif" }}>
        <AlertCircle className="w-12 h-12 text-red-400 mb-2 animate-bounce" />
        <p className="text-sm font-bold">عذراً، لم يتم الوصول للقسم بشكل صحيح.</p>
        <button onClick={() => navigate('/dashboard')} className="mt-4 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs">العودة للوحة التحكم</button>
      </div>
    );
  }

  const shellClassName = isDarkMode ? 'bg-[#060814] text-gray-200' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900';
  const cardClassName = isDarkMode ? 'bg-[#0d1222] border-white/5 text-gray-200 shadow-2xl' : 'bg-white border-slate-200 text-slate-900 shadow-md';
  const textTitleColor = isDarkMode ? 'text-white' : 'text-slate-800';

  return (
    <div className={`min-h-screen flex flex-col ${shellClassName}`} style={{ fontFamily: "'Cairo', sans-serif", direction: 'rtl' }}>
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-white/5 z-30">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 font-medium text-xs hover:bg-purple-600/20 transition-all cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الرجوع للخلف</span>
        </button>

        <div className={`flex items-center rounded-full p-1 gap-1 ${isDarkMode ? 'bg-[#0d122c] border border-white/10' : 'bg-slate-100 border border-slate-200'}`}>
          <button onClick={() => setIsDarkMode(false)} className={`p-1.5 rounded-full transition-all ${!isDarkMode ? 'bg-purple-600 text-white' : 'text-gray-500'}`}><Sun className="w-3.5 h-3.5" /></button>
          <button onClick={() => setIsDarkMode(true)} className={`p-1.5 rounded-full transition-all ${isDarkMode ? 'bg-purple-600 text-white' : 'text-gray-500'}`}><Moon className="w-3.5 h-3.5" /></button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <div className="border-b border-purple-500/10 pb-4">
          <h3 className={`text-2xl font-bold tracking-wide ${textTitleColor}`}>{courseTitle} - ملفات {categoryTitle}</h3>
          <p className="text-xs text-gray-500 mt-1">اضغط على أي ملف لفتحه واستعراضه مباشرة داخل الويب</p>
        </div>

        {uploadedFiles && uploadedFiles.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
            {uploadedFiles.map((fileItem, index) => {
              const fileName = getFileName(fileItem);
              return (
                <div key={index} className={`rounded-[28px] p-6 border-2 flex flex-col justify-between space-y-6 transition-all duration-300 hover:scale-[1.005] ${cardClassName}`}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 border-b border-purple-500/5 pb-3">
                      <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">{getFileIcon(fileName)}</div>
                      <h4 className={`text-base font-bold tracking-wide truncate select-all ${textTitleColor}`} title={fileName}>{fileName}</h4>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-400 dark:text-gray-300 text-justify">
                      مستند أكاديمي مرفوع ومزامَن تلقائياً. اضغط أدناه لفتح الملف في المتصفح.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full">
                    <button 
                      onClick={() => handleOpenFile(fileItem)}
                      className="w-full sm:w-1/2 px-5 py-2.5 rounded-full font-bold text-xs bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center gap-2 hover:bg-cyan-600/30 transition-all text-center cursor-pointer"
                    >
                      <Paperclip className="w-4 h-4" />
                      <span>عرض وتصفح المستند</span>
                    </button>
                    <button 
                      onClick={() => handleOpenFile(fileItem)}
                      className="w-full sm:w-1/2 px-5 py-2.5 rounded-full font-bold text-xs bg-purple-600 text-white border border-purple-500/50 flex items-center justify-center gap-2 hover:bg-purple-700 shadow-lg transition-all text-center cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>تحميل المستند</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-white/5 rounded-3xl bg-[#090d22]/20 max-w-xl mx-auto space-y-3">
            <AlertCircle className="w-12 h-12 text-gray-600 mx-auto" />
            <p className="text-sm font-bold text-gray-300">لا توجد ملفات مرفوعة في هذه الخانة حالياً</p>
          </div>
        )}
      </main>
    </div>
  );
}