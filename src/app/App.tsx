import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 🎓 جميع الملفات متواجدة في نفس مجلد app (مستدعاة بنقطة واحدة وصحيحة بالملي)
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import CourseDetails from './CourseDetails'; 
import NotificationsPage from './NotificationsPage';
import OfficeDetails from './OfficeDetails'; 
import SchedulePage from './components/SchedulePage'; 

// 🔐 تصحيح الحروف الكابيتال والسمول لتطابق أسماء الملفات تماماً وتصفير الأخطاء
import AdminDashboard from './AdminDashboard'; 
import StudentAIAssistant from './StudentAIAssistant'; 
import StudyTimer from './StudyTimer'; 

export default function App() {

  useEffect(() => {
    // 🎵 مؤثر النقر الصوتي الرقمي
    const playSyntheticClick = () => {
      try {
        const isMuted = localStorage.getItem('site_muted') === 'true';
        const savedVolume = localStorage.getItem('site_volume');
        
        if (isMuted) return;

        const volumeLevel = savedVolume !== null ? parseFloat(savedVolume) : 0.12;
        if (volumeLevel === 0) return;

        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine'; 
        osc.frequency.setValueAtTime(1000, ctx.currentTime); 
        osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.06); 
        
        gain.gain.setValueAtTime(volumeLevel, ctx.currentTime); 
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06); 
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.06); 
      } catch (e) {
        console.log("Web Audio API interface exception:", e);
      }
    };

    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      const isButton = target.closest('button');
      const isLink = target.closest('a');
      const isInteractive = target.closest('.cursor-pointer') || target.closest('[role="button"]');

      if (isButton || isLink || isInteractive) {
        playSyntheticClick(); 
      }
    };

    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  return (
    <Router>
      <StudentAIAssistant />
      <StudyTimer /> 

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course-details" element={<CourseDetails />} />
        <Route path="/office-details" element={<OfficeDetails />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        
        {/* 🔐 رابط الأدمن السري والمعزول */}
        <Route path="/admin-portal-hnu-2026" element={<AdminDashboard />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}