import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Sparkles, X, Send, User, BookOpen, HelpCircle, FileText, 
  Code, Lightbulb, GraduationCap, CheckCircle2, Zap, Activity, Brain
} from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'ai' | 'student';
}

export default function StudentAIAssistant() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'explain' | 'questions' | 'summary'>('explain');
  const [currentContext, setCurrentContext] = useState('العامة');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (location.state?.courseTitle) {
      setCurrentContext(location.state.courseTitle);
    } else if (location.pathname.includes('dashboard')) {
      setCurrentContext('لوحة التحكم العامة');
    }
  }, [location]);

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setMessages([
      { 
        id: Date.now(), 
        text: `أهلاً بك يا فنان! 🤖 أنا المساعد الأكاديمي الذكي الخاص بك. اسألني عن أي شيء في الشرح، الملخصات، أو حلول الأسئلة لمادة [${currentContext}].`, 
        sender: 'ai' 
      }
    ]);
  }, [currentContext]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // دالة تشغيل القدرات والكبسولات السريعة
  const handleCapabilityTrigger = (type: string) => {
    let promptText = '';
    let aiResponseText = '';

    if (activeTab === 'explain') {
      if (type === 'simple') {
        promptText = `اشرح لي المفهوم الحالي في ${currentContext} كأني طفل عمره 10 سنوات.`;
        aiResponseText = `حاضر يا بطل! تخيل أن مادة ${currentContext} عبارة عن صندوق ألعاب ذكي، عندما نضع فيه المقادير يعطينا نتائج مدهشة وسحرية أوتوماتيكياً!`;
      } else if (type === 'code') {
        promptText = `أريد مثال عملي كود يوضح فكرة مادة ${currentContext}.`;
        aiResponseText = `إليك كود تطبيقي يعكس الجانب العملي لمادة ${currentContext}:\n\n\`\`\`python\nimport numpy as np\n# خوارزمية تحليل البيانات\nmatrix = np.array([[1, 2], [3, 4]])\nprint("تحليل المصفوفة:", np.linalg.det(matrix))\n\`\`\``;
      } else {
        promptText = `ما هي أهمية مادة ${currentContext} في سوق العمل؟`;
        aiResponseText = `تُثبت مفاهيم ${currentContext} كفاءتها في كبرى الشركات البرمجية لبناء خوارزميات الذكاء الاصطناعي، وتوجيه حركات الروبوتات وتحليل البيانات الضخمة.`;
      }
    } else if (activeTab === 'questions') {
      if (type === 'gen_mcq') {
        promptText = `توليد سؤال اختبار MCQ سريع لتقييم مستواي في ${currentContext}.`;
        aiResponseText = `إليك سؤال الامتحان التفاعلي المخصص:\n\n**س:** ما هو العنصر الأساسي لمعالجة المعادلات والبيانات في ${currentContext}؟\n\n1) Linear Transformation\n2) Static Array\n\n*اكتب إجابتك (1 أو 2) لتصحيحها فوراً!*`;
      } else {
        promptText = `أعطني تلميحاً ذكياً لحل التكليفات للمادة.`;
        aiResponseText = `قم دائمًا بتفكيك المصفوفة أو المشكلة البرمجية المعقدة إلى أجزاء صغيرة (Sub-problems)، وتأكد من شروط التحقق الأولية قبل كتابة الأسطر النهائية.`;
      }
    } else {
      if (type === 'mindmap') {
        promptText = `توليد خريطة ذهنية نصية لشباتر مادة ${currentContext}.`;
        aiResponseText = `📌 **الخريطة الذهنية لمادة ${currentContext}:**\n\n🔹 المحور الأول: التأسيس والمفاهيم الأولية\n🔹 المحور الثاني: التطبيق البرمجي والأوتوميشن\n🔹 المحور الثالث: الرؤية الحاسوبية واتخاذ القرار الأكاديمي.`;
      } else {
        promptText = `توليد كبسولة المراجعة السريعة لليلة الامتحان.`;
        aiResponseText = `🚀 **كبسولة الامتحان السريعة - ${currentContext}:**\n\n✅ ركز جداً على التعقيد الزمني الزمني الأمثل للخوارزمية.\n✅ تذكر: إذا كان المحدد يساوي صفر، فإن النظام البرمجي ليس له حل وحيد.`;
      }
    }

    setMessages(prev => [
      ...prev,
      { id: Date.now(), text: promptText, sender: 'student' },
      { id: Date.now() + 1, text: aiResponseText, sender: 'ai' }
    ]);
  };

  // دالة الإرسال الذكية المحدثة بمحرك الكلمات المفتاحية الذكي
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const userMsg: Message = { id: Date.now(), text: userText, sender: 'student' };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    // محرك الردود الذكي المطور لفهم الرسائل البسيطة والأكاديمية
    setTimeout(() => {
      let aiResponseText = '';
      const lowerText = userText.toLowerCase();

      // 1. معالجة التحية والترحيب
      if (lowerText === 'ازيك' || lowerText === 'أزيك' || lowerText === 'هلا' || lowerText === 'مرحبا' || lowerText === 'سلام عليكم' || lowerText === 'السلام عليكم') {
        aiResponseText = `الحمد لله يا بشمهندس! أنا بخير وفي كامل جاهزيتي الأكاديمية. كيف يمكنني مساعدتك اليوم في مادة [${currentContext}]؟ 🎯`;
      } 
      // 2. معالجة الإجابة على امتحان الـ MCQ
      else if (lowerText === '1' || lowerText.includes('linear')) {
        aiResponseText = `🎉 إجابة صحيحة وممتازة بالملي! الـ Linear Transformation هو الأساس الرياضي والبرمجي الفعلي لهندسة الحلول هنا. أحسنت يا مهندس! 🏆`;
      } else if (lowerText === '2' || lowerText.includes('static')) {
        aiResponseText = `❌ إجابة غير دقيقة يا غالي. الـ Static Array لا يعالج التحويلات الحركية المتقدمة. الإجابة الصحيحة هي (1) Linear Transformation. حاول مجدداً! 💪`;
      }
      // 3. طلب الشرح
      else if (lowerText.includes('اشرح') || lowerText.includes('فهم')) {
        aiResponseText = `بالتأكيد! لشرح أي مفهوم في مادة ${currentContext}، يمكنك كتابة المصطلح البرمجي هنا مباشرة، أو استخدام كبسولة "بسط المفهوم 👶" بالأعلى لتلقي شرح تفاعلي فوري ومبسط بالكامل.`;
      }
      // 4. طلب الملخص
      else if (lowerText.includes('ملخص') || lowerText.includes('خص') || lowerText.includes('لم المنهج')) {
        aiResponseText = `من عيوني! لقد قمت بإعداد كبسولة ليلة الامتحان وملخص شامل لمادة ${currentContext}. اضغط على زر "التلخيص الفائق" بالأعلى ثم اختر الكبسولة لتظهر لك فوراً على شكل نقاط ذهبية! 🚀`;
      }
      // 5. رد افتراضي ذكي في حال لم تطابق الكلمات المفتاحية
      else {
        aiResponseText = `لقد قمت بتحليل سؤالك بذكاء حول موضوع: "${userText}". بناءً على خطة تدريس مادة [${currentContext}] بجامعة حلوان الأهلية، إليك التفصيل والشرح الأكاديمي الدقيق لحل هذه النقطة برمجياً...`;
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: aiResponseText, sender: 'ai' }]);
    }, 600);
  };

  if (location.pathname === '/') return null;

  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex flex-col items-end" style={{ fontFamily: "'Cairo', sans-serif", direction: 'rtl' }}>
      
      {isOpen && (
        <div className="w-[400px] h-[580px] bg-[#050714]/98 border border-amber-500/20 rounded-[30px] shadow-2xl flex flex-col overflow-hidden mb-4 animate-in fade-in slide-in-from-bottom-4 duration-300 backdrop-blur-2xl text-right">
          
          {/* هيدر الشات */}
          <div className="p-4 bg-gradient-to-l from-[#0c0f26] to-[#060814] border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Brain className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>مساعد الذكاء الاصطناعي</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold">PRO</span>
                </h4>
                <p className="text-[11px] text-gray-400">سياقك الحالي: <span className="text-amber-500 font-bold">{currentContext}</span></p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* التبويبات */}
          <div className="grid grid-cols-3 gap-1 p-2 bg-black/30 border-b border-white/5 text-xs font-bold">
            <button 
              onClick={() => setActiveTab('explain')}
              className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${activeTab === 'explain' ? 'bg-amber-500 text-[#060814] shadow-lg font-extrabold' : 'text-gray-400 hover:bg-white/5'}`}
            >
              <BookOpen className="w-3.5 h-3.5" /><span>شرح</span>
            </button>
            <button 
              onClick={() => setActiveTab('questions')}
              className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${activeTab === 'questions' ? 'bg-amber-500 text-[#060814] shadow-lg font-extrabold' : 'text-gray-400 hover:bg-white/5'}`}
            >
              <HelpCircle className="w-3.5 h-3.5" /><span>أسئلة</span>
            </button>
            <button 
              onClick={() => setActiveTab('summary')}
              className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${activeTab === 'summary' ? 'bg-amber-500 text-[#060814] shadow-lg font-extrabold' : 'text-gray-400 hover:bg-white/5'}`}
            >
              <FileText className="w-3.5 h-3.5" /><span>ملخص</span>
            </button>
          </div>

          {/* أزرار الاختصارات السريعة */}
          <div className="p-2 bg-white/[0.01] border-b border-white/5 flex gap-2 overflow-x-auto justify-start select-none">
            {activeTab === 'explain' && (
              <>
                <button onClick={() => handleCapabilityTrigger('simple')} className="px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-300 text-[10px] font-bold flex items-center gap-1 shrink-0 hover:bg-amber-500/20 transition-all"><Lightbulb className="w-3" /><span>بسط المفهوم 👶</span></button>
                <button onClick={() => handleCapabilityTrigger('code')} className="px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-300 text-[10px] font-bold flex items-center gap-1 shrink-0 hover:bg-amber-500/20 transition-all"><Code className="w-3" /><span>مثال كود 💻</span></button>
                <button onClick={() => handleCapabilityTrigger('work')} className="px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-300 text-[10px] font-bold flex items-center gap-1 shrink-0 hover:bg-amber-500/20 transition-all"><GraduationCap className="w-3" /><span>سوق العمل 💼</span></button>
              </>
            )}
            {activeTab === 'questions' && (
              <>
                <button onClick={() => handleCapabilityTrigger('gen_mcq')} className="px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-300 text-[10px] font-bold flex items-center gap-1 shrink-0 hover:bg-amber-500/20 transition-all"><CheckCircle2 className="w-3" /><span>توليد سؤال MCQ 📝</span></button>
                <button onClick={() => handleCapabilityTrigger('hint')} className="px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-300 text-[10px] font-bold flex items-center gap-1 shrink-0 hover:bg-amber-500/20 transition-all"><Zap className="w-3" /><span>تلميح الشيتات 🎯</span></button>
              </>
            )}
            {activeTab === 'summary' && (
              <>
                <button onClick={() => handleCapabilityTrigger('mindmap')} className="px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-300 text-[10px] font-bold flex items-center gap-1 shrink-0 hover:bg-amber-500/20 transition-all"><Activity className="w-3" /><span>خريطة ذهنية 🗺️</span></button>
                <button onClick={() => handleCapabilityTrigger('cheat')} className="px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-300 text-[10px] font-bold flex items-center gap-1 shrink-0 hover:bg-amber-500/20 transition-all"><FileText className="w-3" /><span>ليلة الامتحان 🚀</span></button>
              </>
            )}
          </div>

          {/* منطقة عرض الرسائل المحاذاة بدقة لليسار واليمين */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
            {messages.map((msg) => {
              const isStudent = msg.sender === 'student';
              return (
                <div 
                  key={msg.id} 
                  className={`flex gap-2.5 max-w-[85%] ${isStudent ? 'self-left flex-row' : 'self-right flex-row-reverse'}`}
                >
                  {/* صندوق نص الرسالة */}
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow-lg ${
                    isStudent 
                      ? 'bg-amber-500 text-[#060814] rounded-tl-none font-bold text-left' 
                      : 'bg-[#0b0e22] text-gray-200 border border-white/5 rounded-tr-none text-right'
                  }`}>
                    {msg.text}
                  </div>

                  {/* الأيقونة الجانبية التابعة للمرسل */}
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-md text-xs font-bold ${
                    isStudent ? 'bg-amber-500 text-[#060814]' : 'bg-[#1a150b] border border-amber-500/30 text-amber-400'
                  }`}>
                    {isStudent ? <User className="w-4 h-4" /> : <Sparkles className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* حقل الإدخال والإرسال */}
          <form onSubmit={handleSendMessage} className="p-3 bg-[#03050f] border-t border-white/5 flex items-center gap-2">
            <input 
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`اسألني في ${activeTab === 'explain' ? 'الشرح' : activeTab === 'questions' ? 'الأسئلة' : 'الملخص'}...`}
              className="flex-1 bg-[#090b1f] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-500/40"
            />
            <button 
              type="submit"
              className="p-2.5 rounded-xl bg-amber-500 text-[#060814] hover:bg-amber-400 transition-all flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* الزر العائم الخارجي */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-[#060814] border border-amber-400/40 font-black text-xs shadow-2xl hover:scale-105 transition-all cursor-pointer group active:scale-95 animate-bounce"
          style={{ boxShadow: '0 0 30px 4px rgba(245, 158, 11, 0.25)' }}
        >
          <Sparkles className="w-4 h-4 text-white animate-pulse" />
          <span>مساعد الذكاء الاصطناعي (Pro AI)</span>
        </button>
      )}

    </div>
  );
}