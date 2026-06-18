import React, { useEffect, useState } from 'react';
import { 
  Shield, Search, User, BookOpen, Trash2, Plus, Mail, IdCard, 
  FileText, CheckCircle, AlertCircle, ArrowLeft, Layers, 
  Book, Video, Presentation, HelpCircle, FolderPlus, ChevronLeft, Upload, Image 
} from 'lucide-react';

export default function AdminDashboard() {
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [globalCourses, setGlobalCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [searchId, setSearchId] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [activeManageCourse, setActiveManageCourse] = useState<any>(null);

  const [courseName, setCourseName] = useState('');
  const [courseDoctor, setCourseDoctor] = useState('');
  const [courseCode, setCourseCode] = useState('');

  useEffect(() => {
    loadDatabase();
  }, []);

  const loadDatabase = () => {
    setLoading(true);
    
    fetch('http://localhost:5000/api/get-student?name=all')
      .then(res => res.json())
      .then(data => {
        const localStudents = JSON.parse(localStorage.getItem('hnu_registered_students') || '[]');
        const cleanedStudents = (data.students || localStudents).map((s: any) => ({
          ...s,
          enrolledCourseIds: (s.enrolledCourseIds || []).map((id: any) => String(id).trim())
        }));
        setAllStudents(cleanedStudents);
      })
      .catch(() => {
        const localStudents = JSON.parse(localStorage.getItem('hnu_registered_students') || '[]');
        const cleanedStudents = localStudents.map((s: any) => ({
          ...s,
          enrolledCourseIds: (s.enrolledCourseIds || []).map((id: any) => String(id).trim())
        }));
        setAllStudents(cleanedStudents);
      });

    const localCourses = JSON.parse(localStorage.getItem('hnu_global_courses') || '[]');
    setGlobalCourses(localCourses);
    
    setLoading(false);
  };

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3500);
  };

  const createGlobalNotification = (title: string, body: string, targetCourseId?: string) => {
    const existingNotifications = JSON.parse(localStorage.getItem('hnu_notifications') || '[]');
    
    const newNotification = {
      id: Date.now().toString(),
      title: title,
      body: body,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('ar-EG'),
      courseId: targetCourseId || null,
      isUnread: true 
    };

    localStorage.setItem('hnu_notifications', JSON.stringify([newNotification, ...existingNotifications]));
    localStorage.setItem('hnu_has_new_notif', 'true');
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim() || !courseDoctor.trim()) return;

    const newCourse = {
      id: Date.now().toString(),
      name: courseName,
      doctor: courseDoctor,
      code: courseCode || 'HNU-' + Math.floor(100 + Math.random() * 900),
      interactiveBooks: [],
      interactiveMaterials: [],
      extraReferences: [],
      videos: [],
      presentations: [],
      studentQuestions: []
    };

    const updated = [...globalCourses, newCourse];
    setGlobalCourses(updated);
    localStorage.setItem('hnu_global_courses', JSON.stringify(updated));
    
    setCourseName('');
    setCourseDoctor('');
    setCourseCode('');
    showMsg('success', 'تم تسجيل المادة في الكلية بنجاح!');
  };

  const handleDeleteCourseFromCollege = (courseId: string) => {
    if (!window.confirm('⚠️ هل تريد حذف المادة تماماً من عند كل الطلاب المشتركين فيها?')) return;

    const updatedCourses = globalCourses.filter(c => c.id !== courseId);
    setGlobalCourses(updatedCourses);
    localStorage.setItem('hnu_global_courses', JSON.stringify(updatedCourses));

    const updatedStudents = allStudents.map(student => {
      if (student.enrolledCourseIds) {
        return { ...student, enrolledCourseIds: student.enrolledCourseIds.filter((id: string) => String(id) !== String(courseId)) };
      }
      return student;
    });
    setAllStudents(updatedStudents);
    localStorage.setItem('hnu_registered_students', JSON.stringify(updatedStudents));

    if (activeManageCourse?.id === courseId) setActiveManageCourse(null);
    showMsg('success', 'تم حذف المادة نهائياً.');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Data = reader.result as string;

      const fileObject = {
        name: fileName,
        data: base64Data
      };

      const updatedCourses = globalCourses.map(course => {
        if (course.id === activeManageCourse.id) {
          return { ...course, [key]: [...(course[key] || []), fileObject] };
        }
        return course;
      });

      setGlobalCourses(updatedCourses);
      localStorage.setItem('hnu_global_courses', JSON.stringify(updatedCourses));
      
      createGlobalNotification(
        `تحديث جديد في مادة ${activeManageCourse.name}`,
        `قام دكتور المادة برفع مستند جديد [ ${fileName} ] داخل خانات المحاضرات. تفقدها الآن!`,
        activeManageCourse.id
      );

      const current = updatedCourses.find(c => c.id === activeManageCourse.id);
      setActiveManageCourse(current);
      showMsg('success', `تم رفع وتشفير الملف الحقيقي وإرسال تنبيه للطلاب! 🚀`);
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDeleteFileFromSection = (key: string, index: number) => {
    const updatedCourses = globalCourses.map(course => {
      if (course.id === activeManageCourse.id) {
        const filteredDocs = course[key].filter((_: any, i: number) => i !== index);
        return { ...course, [key]: filteredDocs };
      }
      return course;
    });

    setGlobalCourses(updatedCourses);
    localStorage.setItem('hnu_global_courses', JSON.stringify(updatedCourses));

    const current = updatedCourses.find(c => c.id === activeManageCourse.id);
    setActiveManageCourse(current);
    showMsg('success', 'تم حذف الملف بنجاح.');
  };

  const handleSearchStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const student = allStudents.find(s => String(s.id).trim() === searchId.trim());
    if (student) {
      if (!student.enrolledCourseIds) student.enrolledCourseIds = [];
      setSelectedStudent(student);
      showMsg('success', `تم استدعاء كشف الطالب بنجاح.`);
    } else {
      setSelectedStudent(null);
      showMsg('error', 'الرقم الأكاديمي غير مسجل حالياً بالنظام!');
    }
  };

  // 🔄 تكتيك المزامنة الشاملة المصلح لمنع تعليق لوحة الطالب الحين
  const handleToggleCourseEnrollment = (courseId: string) => {
    if (!selectedStudent) return;

    const targetCourse = globalCourses.find(c => c.id === courseId);
    let currentIds = [...(selectedStudent.enrolledCourseIds || [])].map(id => String(id).trim());
    const targetIdStr = String(courseId).trim();
    
    if (currentIds.includes(targetIdStr)) {
      currentIds = currentIds.filter(id => id !== targetIdStr);
      showMsg('success', 'تم فصل وسحب المادة عن واجهة هذا الطالب ❌');
    } else {
      currentIds.push(targetIdStr);
      showMsg('success', 'تم تفعيل وإظهار المادة في واجهة الطالب فوراً! 📚');
      
      createGlobalNotification(
        `تم تسجيل مادة جديدة لك 🎓`,
        `لقد وافق شؤون الطلاب على إضافة مادة [ ${targetCourse?.name} ] مع الدكتور [ ${targetCourse?.doctor} ] إلى لوحتك الأكاديمية الحين.`
      );
    }

    const updatedStudent = { ...selectedStudent, enrolledCourseIds: currentIds };
    setSelectedStudent(updatedStudent);

    // 1. تحديث الكاش العام الكلي فوراً
    const updatedAllStudents = allStudents.map(s => s.id === selectedStudent.id ? updatedStudent : s);
    setAllStudents(updatedAllStudents);
    localStorage.setItem('hnu_registered_students', JSON.stringify(updatedAllStudents));

    // 2. تحديث كاش الطالب النشط الحالي مباشرة لإجبار صفحة الطالب على جلب الداتا فورا
    localStorage.setItem('hnu_current_user', JSON.stringify(updatedStudent));

    // 3. إرسال التحديث للسيرفر لحفظ التعديلات الأكاديمية
    fetch('http://localhost:5000/api/update-student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedStudent)
    })
    .catch(() => {});
  };

  const handleDeleteStudentEntirely = () => {
    if (!selectedStudent || !window.confirm(`هل أنت متأكد من مسح حساب الطالب [ ${selectedStudent.fullName || selectedStudent.name} ] نهائياً من السيرفر؟`)) return;

    fetch('http://localhost:5000/api/delete-student', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedStudent.id, email: selectedStudent.email })
    }).catch(() => {});

    const updated = allStudents.filter(s => s.id !== selectedStudent.id);
    setAllStudents(updated);
    localStorage.setItem('hnu_registered_students', JSON.stringify(updated));
    setSelectedStudent(null);
    setSearchId('');
    showMsg('success', 'تم حذف حساب الطالب نهائياً.');
  };

  const handleResetAllSystemData = () => {
    if (!window.confirm('⚠️ هل أنت متأكد من تصفير ومسح كافة المواد والملفات المسجلة نهائياً للبدء بصفحة بيضاء؟')) return;
    localStorage.removeItem('hnu_global_courses');
    localStorage.removeItem('hnu_notifications');
    localStorage.removeItem('hnu_has_new_notif');
    setGlobalCourses([]);
    setSelectedStudent(null);
    showMsg('success', 'تم تصفير النظام والإشعارات بالكامل! 🌟');
  };

  const getAdminFileName = (fileItem: any) => {
    if (typeof fileItem === 'string') return fileItem;
    return fileItem?.name || 'مستند مرفوع';
  };

  const currentStudentAvatar = selectedStudent ? localStorage.getItem(`hnu_student_avatar_${selectedStudent.email}`) : null;

  return (
    <div className="min-h-screen bg-[#060814] text-white p-4 md:p-10 select-none" style={{ fontFamily: "'Cairo', sans-serif", direction: 'rtl' }}>
      
      <header className="flex flex-col md:flex-row items-center justify-between border-b border-white/10 pb-6 mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/5">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wide">لوحة التحكم الأكاديمية المطلقة (Master Hub)</h1>
            <p className="text-xs text-gray-400">تصفير وعزل تام: تفعيل المواد يرفع إشعاراً فورياً بنقطة حمراء في حساب الطلاب المسجلين</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleResetAllSystemData}
            className="text-xs font-bold text-red-400 hover:text-white bg-red-500/5 border border-red-500/10 hover:border-red-500/40 px-3 py-2 rounded-xl transition-all"
          >
            تصفير النظام والإشعارات 🧹
          </button>
          <a href="/dashboard" className="flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-white bg-white/5 border border-white/10 px-4 py-2 rounded-xl transition-all">
            <span>الخروج لواجهة العرض</span>
            <ArrowLeft className="w-4 h-4" />
          </a>
        </div>
      </header>

      {message && (
        <div className={`fixed top-6 left-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-xl border backdrop-blur-md shadow-2xl transition-all ${
          message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-xs font-bold">{message.text}</span>
        </div>
      )}

      {!activeManageCourse ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="bg-[#090d22] border border-white/5 p-6 rounded-2xl shadow-xl h-fit space-y-4">
              <h2 className="text-sm font-bold text-gray-200 flex items-center gap-2">
                <User className="w-4 h-4 text-amber-500" />
                <span>إدارة حسابات الطلاب (بالرقم الأكاديمي)</span>
              </h2>
              <form onSubmit={handleSearchStudent} className="flex gap-2">
                <input 
                  type="text"
                  value={searchId}
                  onChange={e => setSearchId(e.target.value)}
                  placeholder="أدخل الـ ID واستدعي الملف"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-center font-mono text-white focus:outline-none focus:border-amber-500 transition-all"
                  required
                />
                <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-[#060814] font-bold text-xs px-4 rounded-xl transition-all">
                  استدعاء
                </button>
              </form>

              {selectedStudent ? (
                <div className="bg-white/[0.01] border border-white/5 rounded-xl p-4 space-y-4 animate-fade-in text-xs">
                  
                  <div className="flex flex-col items-center justify-center border-b border-white/5 pb-3 gap-2">
                    <div className="w-16 h-16 rounded-full bg-purple-950/40 border border-purple-500/30 flex items-center justify-center overflow-hidden shadow-md">
                      {currentStudentAvatar ? (
                        <img src={currentStudentAvatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <Image className="w-6 h-6 text-gray-500" />
                      )}
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-white text-sm">{selectedStudent.fullName || selectedStudent.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono mt-0.5">ID: {selectedStudent.id}</p>
                    </div>
                  </div>

                  <p className="text-gray-400 truncate"><span className="text-gray-500">الإيميل:</span> {selectedStudent.email}</p>
                  
                  <div className="space-y-2 pt-2 text-right">
                    <p className="text-[11px] font-bold text-amber-400 mb-2">تفعيل أو سحب مواد الطالب الحالية:</p>
                    {globalCourses.length > 0 ? (
                      globalCourses.map(course => {
                        const isEnrolled = (selectedStudent.enrolledCourseIds || []).map(id => String(id).trim()).includes(String(course.id).trim());
                        return (
                          <div key={course.id} className="flex items-center justify-between bg-white/5 border border-white/5 px-3 py-2 rounded-xl hover:bg-white/10 transition-all group">
                            <div className="flex flex-col">
                              <span className="text-[11px] font-bold text-gray-300 group-hover:text-amber-400 transition-all">{course.name}</span>
                              <span className="text-[9px] text-gray-500">د. {course.doctor}</span>
                            </div>
                            <div>
                              {isEnrolled ? (
                                <button
                                  type="button"
                                  onClick={() => handleToggleCourseEnrollment(course.id)}
                                  className="px-2.5 py-1 bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>حذف</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleToggleCourseEnrollment(course.id)}
                                  className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/30 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>إضافة</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-[10px] text-gray-500 italic text-center py-2">لا توجد مواد بدليل الكلية لتفعيلها. أضف مادة أولاً على اليسار!</p>
                    )}
                  </div>

                  <button 
                    onClick={handleDeleteStudentEntirely}
                    className="w-full bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 py-2 rounded-xl font-bold transition-all text-[10px] flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>تدمير الحساب نهائياً من السيرفر</span>
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-gray-500 text-center py-4 italic">ابحث عن طالب لتخصيص مواده وحذف أو إضافة صلاحياته.</p>
              )}
            </div>

            <div className="lg:col-span-2 bg-[#090d22] border border-white/5 p-6 rounded-2xl shadow-xl h-fit">
              <h2 className="text-sm font-bold text-gray-200 mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                <FolderPlus className="w-4 h-4 text-indigo-400" />
                <span>إدراج مادة دراسية جديدة في دليل الكلية الكلي</span>
              </h2>
              <form onSubmit={handleCreateCourse} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">اسم المادة الأكاديمي:</label>
                  <input 
                    type="text" 
                    value={courseName}
                    onChange={e => setCourseName(e.target.value)}
                    placeholder="مثال: هندسة برمجيات" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">اسم الدكتور المحاضر لها:</label>
                  <input 
                    type="text" 
                    value={courseDoctor}
                    onChange={e => setCourseDoctor(e.target.value)}
                    placeholder="مثال: د. عصام مرسي" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">كود المادة (اختياري):</label>
                  <input 
                    type="text" 
                    value={courseCode}
                    onChange={e => setCourseCode(e.target.value)}
                    placeholder="مثال: SE-301" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button type="submit" className="md:col-span-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/10">
                  تثبيت المادة في قاعدة البيانات العامة
                </button>
              </form>
            </div>
          </div>

          <div className="bg-[#090d22] border border-white/5 p-6 rounded-2xl shadow-xl">
            <h2 className="text-sm font-bold text-gray-200 mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>دليل الكلية الأكاديمي الحالي</span>
            </h2>
            {globalCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {globalCourses.map(course => (
                  <div key={course.id} className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col justify-between hover:border-white/10 transition-all">
                    <div>
                      <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-md inline-block mb-1">{course.code}</span>
                      <h3 className="font-bold text-sm text-white">{course.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">المحاضر: <span className="text-amber-400 font-bold">{course.doctor}</span></p>
                    </div>
                    <div className="flex gap-2 mt-4 border-t border-white/5 pt-3">
                      <button 
                        onClick={() => setActiveManageCourse(course)}
                        className="flex-1 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-600/20 py-2 rounded-xl text-xs font-bold transition-all"
                      >
                        إدارة الخانات والمحتوى ⚙️
                      </button>
                      <button 
                        onClick={() => handleDeleteCourseFromCollege(course.id)}
                        className="p-2 bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 rounded-xl transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 text-center py-8 italic">الدليل فارغ تماماً حالياً. سيظهر هنا فقط ما تقوم بتسجيله وإدراج ملفاته بيدك.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-[#090d22] border border-white/5 p-6 rounded-2xl shadow-xl flex items-center justify-between">
            <div>
              <button 
                onClick={() => setActiveManageCourse(null)}
                className="text-xs text-gray-400 hover:text-white bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5 mb-2 transition-all"
              >
                <ChevronLeft className="w-4 h-4 rotate-180" />
                <span>الرجوع لدليل الكلية</span>
              </button>
              <h2 className="text-xl font-bold text-amber-400">مادة: {activeManageCourse.name}</h2>
              <p className="text-xs text-gray-400 mt-1">الدكتور المحاضر: <span className="text-white font-bold">{activeManageCourse.doctor}</span> | كود المادة: <span className="font-mono text-purple-400">{activeManageCourse.code}</span></p>
            </div>
            <span className="text-[11px] font-bold text-gray-500 bg-white/5 p-3 rounded-xl border border-white/5">الخانات ثابتة عند كل الطلاب المسجلين</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. كتب تفاعلية */}
            <div className="bg-[#090d22] border border-white/5 p-6 rounded-2xl flex flex-col justify-between shadow-xl group hover:border-white/10 transition-all">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-base text-white">كتب تفاعلية</h3>
                    <p className="text-xs text-gray-500 mt-0.5">عدد الكتب التفاعلية: {(activeManageCourse.interactiveBooks || []).length}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400"><Book className="w-5 h-5" /></div>
                </div>
                <div className="space-y-1.5 mb-4 max-h-[120px] overflow-y-auto">
                  {(activeManageCourse.interactiveBooks || []).map((doc: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 p-2 rounded-lg text-xs text-gray-300">
                      <span className="truncate max-w-[160px]" title={getAdminFileName(doc)}>{getAdminFileName(doc)}</span>
                      <button onClick={() => handleDeleteFileFromSection('interactiveBooks', i)} className="text-red-400 text-[10px] hover:underline">حذف</button>
                    </div>
                  ))}
                </div>
              </div>
              <label className="w-full bg-white/5 hover:bg-white/10 text-gray-300 text-xs py-2 rounded-xl border border-white/10 transition-all flex items-center justify-center gap-1 cursor-pointer">
                <Upload className="w-3.5 h-3.5" /> <span>رفع كتاب تفاعلي</span>
                <input type="file" onChange={(e) => handleFileUpload(e, 'interactiveBooks')} className="hidden" />
              </label>
            </div>

            {/* 2. مواد تفاعلية */}
            <div className="bg-[#090d22] border border-white/5 p-6 rounded-2xl flex flex-col justify-between shadow-xl group hover:border-white/10 transition-all">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-base text-white">مواد تفاعلية</h3>
                    <p className="text-xs text-gray-500 mt-0.5">عدد مواد تفاعلية: {(activeManageCourse.interactiveMaterials || []).length}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400"><Layers className="w-5 h-5" /></div>
                </div>
                <div className="space-y-1.5 mb-4 max-h-[120px] overflow-y-auto">
                  {(activeManageCourse.interactiveMaterials || []).map((doc: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 p-2 rounded-lg text-xs text-gray-300">
                      <span className="truncate max-w-[160px]" title={getAdminFileName(doc)}>{getAdminFileName(doc)}</span>
                      <button onClick={() => handleDeleteFileFromSection('interactiveMaterials', i)} className="text-red-400 text-[10px] hover:underline">حذف</button>
                    </div>
                  ))}
                </div>
              </div>
              <label className="w-full bg-white/5 hover:bg-white/10 text-gray-300 text-xs py-2 rounded-xl border border-white/10 transition-all flex items-center justify-center gap-1 cursor-pointer">
                <Upload className="w-3.5 h-3.5" /> <span>رفع مواد تفاعلية</span>
                <input type="file" onChange={(e) => handleFileUpload(e, 'interactiveMaterials')} className="hidden" />
              </label>
            </div>

            {/* 3. مراجع إضافية */}
            <div className="bg-[#090d22] border border-white/5 p-6 rounded-2xl flex flex-col justify-between shadow-xl group hover:border-white/10 transition-all">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-base text-white">مراجع إضافية</h3>
                    <p className="text-xs text-gray-500 mt-0.5">عدد مراجع إيجابية: {(activeManageCourse.extraReferences || []).length}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400"><FileText className="w-5 h-5" /></div>
                </div>
                <div className="space-y-1.5 mb-4 max-h-[120px] overflow-y-auto">
                  {(activeManageCourse.extraReferences || []).map((doc: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 p-2 rounded-lg text-xs text-gray-300">
                      <span className="truncate max-w-[160px]" title={getAdminFileName(doc)}>{getAdminFileName(doc)}</span>
                      <button onClick={() => handleDeleteFileFromSection('extraReferences', i)} className="text-red-400 text-[10px] hover:underline">حذف</button>
                    </div>
                  ))}
                </div>
              </div>
              <label className="w-full bg-white/5 hover:bg-white/10 text-gray-300 text-xs py-2 rounded-xl border border-white/10 transition-all flex items-center justify-center gap-1 cursor-pointer">
                <Upload className="w-3.5 h-3.5" /> <span>رفع مراجع إضافية</span>
                <input type="file" onChange={(e) => handleFileUpload(e, 'extraReferences')} className="hidden" />
              </label>
            </div>

            {/* 4. مقاطع فيديو */}
            <div className="bg-[#090d22] border border-white/5 p-6 rounded-2xl flex flex-col justify-between shadow-xl group hover:border-white/10 transition-all">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-base text-white">مقاطع فيديو</h3>
                    <p className="text-xs text-gray-500 mt-0.5">عدد مقاطع فيديو: {(activeManageCourse.videos || []).length}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400"><Video className="w-5 h-5" /></div>
                </div>
                <div className="space-y-1.5 mb-4 max-h-[120px] overflow-y-auto">
                  {(activeManageCourse.videos || []).map((doc: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 p-2 rounded-lg text-xs text-gray-300">
                      <span className="truncate max-w-[160px]" title={getAdminFileName(doc)}>{getAdminFileName(doc)}</span>
                      <button onClick={() => handleDeleteFileFromSection('videos', i)} className="text-red-400 text-[10px] hover:underline">حذف</button>
                    </div>
                  ))}
                </div>
              </div>
              <label className="w-full bg-white/5 hover:bg-white/10 text-gray-300 text-xs py-2 rounded-xl border border-white/10 transition-all flex items-center justify-center gap-1 cursor-pointer">
                <Upload className="w-3.5 h-3.5" /> <span>رفع مقطع فيديو</span>
                <input type="file" onChange={(e) => handleFileUpload(e, 'videos')} className="hidden" />
              </label>
            </div>

            {/* 5. عروض تقديمية */}
            <div className="bg-[#090d22] border border-white/5 p-6 rounded-2xl flex flex-col justify-between shadow-xl group hover:border-white/10 transition-all">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-base text-white">عروض تقديمية</h3>
                    <p className="text-xs text-gray-500 mt-0.5">عدد عروض تقديمية: {(activeManageCourse.presentations || []).length}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400"><Presentation className="w-5 h-5" /></div>
                </div>
                <div className="space-y-1.5 mb-4 max-h-[120px] overflow-y-auto">
                  {(activeManageCourse.presentations || []).map((doc: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 p-2 rounded-lg text-xs text-gray-300">
                      <span className="truncate max-w-[160px]" title={getAdminFileName(doc)}>{getAdminFileName(doc)}</span>
                      <button onClick={() => handleDeleteFileFromSection('presentations', i)} className="text-red-400 text-[10px] hover:underline">حذف</button>
                    </div>
                  ))}
                </div>
              </div>
              <label className="w-full bg-white/5 hover:bg-white/10 text-gray-300 text-xs py-2 rounded-xl border border-white/10 transition-all flex items-center justify-center gap-1 cursor-pointer">
                <Upload className="w-3.5 h-3.5" /> <span>رفع عروض تقديمية</span>
                <input type="file" onChange={(e) => handleFileUpload(e, 'presentations')} className="hidden" />
              </label>
            </div>

            {/* 6. الأسئلة الطلابية */}
            <div className="bg-[#090d22] border border-white/5 p-6 rounded-2xl flex flex-col justify-between shadow-xl group hover:border-white/10 transition-all">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-base text-white">الأسئلة الطلابية</h3>
                    <p className="text-xs text-gray-500 mt-0.5">عدد الأسئلة الطلابية: {(activeManageCourse.studentQuestions || []).length}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400"><HelpCircle className="w-5 h-5" /></div>
                </div>
                <div className="space-y-1.5 mb-4 max-h-[120px] overflow-y-auto">
                  {(activeManageCourse.studentQuestions || []).map((doc: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 p-2 rounded-lg text-xs text-gray-300">
                      <span className="truncate max-w-[160px]" title={getAdminFileName(doc)}>{getAdminFileName(doc)}</span>
                      <button onClick={() => handleDeleteFileFromSection('studentQuestions', i)} className="text-red-400 text-[10px] hover:underline">حذف</button>
                    </div>
                  ))}
                </div>
              </div>
              <label className="w-full bg-white/5 hover:bg-white/10 text-gray-300 text-xs py-2 rounded-xl border border-white/10 transition-all flex items-center justify-center gap-1 cursor-pointer">
                <Upload className="w-3.5 h-3.5" /> <span>رفع أسئلة طلابية</span>
                <input type="file" onChange={(e) => handleFileUpload(e, 'studentQuestions')} className="hidden" />
              </label>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}