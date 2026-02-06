
import React, { useState, useEffect, useRef } from 'react';
import { SyllabusTopic, AppState, TeachingSession } from './types';
import { parseSyllabus, teachTopic } from './services/geminiService';
import { FileUploader } from './components/FileUploader';
import { LearningDashboard } from './components/LearningDashboard';
import { TeachingView } from './components/TeachingView';
import { BreakModal } from './components/BreakModal';
import { GraduationCap, BookOpen, Layers, Zap, CheckCircle, Timer } from 'lucide-react';

const FOCUS_DURATION = 30 * 60; // 30 minutes

export default function App() {
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [topics, setTopics] = useState<SyllabusTopic[]>([]);
  const [activeSession, setActiveSession] = useState<TeachingSession | null>(null);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Study Timer Logic
  const [studySeconds, setStudySeconds] = useState(0);
  const [showBreak, setShowBreak] = useState(false);
  const timerRef = useRef<number | null>(null);

  // The timer now only runs when a lesson is actively being viewed (TEACHING state and session loaded)
  useEffect(() => {
    const isLearningActive = appState === 'TEACHING' && activeSession !== null;
    
    if (isLearningActive && !showBreak) {
      timerRef.current = window.setInterval(() => {
        setStudySeconds(prev => {
          if (prev >= FOCUS_DURATION - 1) {
            setShowBreak(true);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [appState, activeSession, showBreak]);

  const handleFileUpload = async (file: File) => {
    try {
      setAppState('PARSING');
      setError(null);
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        try {
          const extractedTopics = await parseSyllabus(base64, file.type);
          setTopics(extractedTopics);
          setAppState('LEARNING');
          setStudySeconds(0);
        } catch (err) {
          setError("Failed to parse syllabus. Please try again with a clear image or text file.");
          setAppState('IDLE');
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("An unexpected error occurred.");
      setAppState('IDLE');
    }
  };

  const handleSelectTopic = async (topic: SyllabusTopic) => {
    try {
      setAppState('TEACHING');
      setActiveTopicId(topic.id);
      setActiveSession(null); // Reset session to ensure timer only starts after new one loads
      const context = topics.map(t => t.title).join(", ");
      const session = await teachTopic(topic.title, context);
      setActiveSession(session);
    } catch (err) {
      setError("Could not generate teaching session. Please check your connection.");
      setAppState('LEARNING');
    }
  };

  const handleToggleComplete = (id: string) => {
    setTopics(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleCompleteTopic = () => {
    if (activeTopicId) {
      handleToggleComplete(activeTopicId);
    }
    setAppState('LEARNING');
    setActiveSession(null);
    setActiveTopicId(null);
  };

  const remainingSeconds = FOCUS_DURATION - studySeconds;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeDisplay = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {showBreak && <BreakModal onFinish={() => setShowBreak(false)} />}
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setAppState('IDLE')}
          >
            <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform shadow-sm">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400">
              SyllabusAI
            </span>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Countdown Timer - Visible when a session is active */}
            {appState === 'TEACHING' && activeSession && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full border border-indigo-100 shadow-sm animate-in fade-in zoom-in duration-300">
                <Timer className="w-4 h-4 text-indigo-600 animate-pulse" />
                <div className="flex flex-col leading-none">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">Focus Mode</span>
                  <span className="text-sm font-black text-indigo-700 font-mono">
                    {timeDisplay}
                  </span>
                </div>
              </div>
            )}
            
            <div className="hidden sm:flex items-center gap-6">
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">Resources</a>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">Pricing</a>
            </div>

            {appState !== 'IDLE' && (
              <button 
                onClick={() => {
                  if(confirm("Start a new study plan? Current progress will be reset.")) {
                    setAppState('IDLE');
                    setTopics([]);
                    setStudySeconds(0);
                  }
                }}
                className="text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50/50 px-3 py-1.5 rounded-lg border border-indigo-100/50 transition-all"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Notification */}
        {error && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <Zap className="w-5 h-5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Home Page / IDLE State */}
        {appState === 'IDLE' && (
          <div className="text-center space-y-12 max-w-4xl mx-auto pt-10">
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Master any syllabus <br />
                <span className="text-indigo-600">with your personal AI tutor.</span>
              </h1>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Upload your syllabus, curriculum, or even just a list of topics. We'll break it down into manageable lessons, analogies, and quizzes tailored just for you.
              </p>
            </div>

            <FileUploader onFileSelect={handleFileUpload} isLoading={false} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 text-left">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                <div className="bg-indigo-50 w-10 h-10 rounded-xl flex items-center justify-center text-indigo-600">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800">Smart Extraction</h3>
                <p className="text-sm text-slate-500 leading-relaxed">Automatically identifies topics and learning goals from your uploaded documents.</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                <div className="bg-emerald-50 w-10 h-10 rounded-xl flex items-center justify-center text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800">Relatable Learning</h3>
                <p className="text-sm text-slate-500 leading-relaxed">Uses real-world analogies and simple language to make complex topics easy to grasp.</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                <div className="bg-amber-50 w-10 h-10 rounded-xl flex items-center justify-center text-amber-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800">Mastery Checks</h3>
                <p className="text-sm text-slate-500 leading-relaxed">Integrated quizzes at the end of every session to ensure you truly understand the material.</p>
              </div>
            </div>
          </div>
        )}

        {/* Parsing State */}
        {appState === 'PARSING' && (
          <div className="flex flex-col items-center justify-center py-32 space-y-6 text-center">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-slate-200 rounded-full border-t-indigo-600 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-indigo-400" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-800">Scanning Your Syllabus...</h2>
              <p className="text-slate-500">Gemini AI is identifying core topics and learning objectives.</p>
            </div>
          </div>
        )}

        {/* Dashboard State */}
        {appState === 'LEARNING' && (
          <LearningDashboard 
            topics={topics} 
            onSelectTopic={handleSelectTopic} 
            onToggleComplete={handleToggleComplete}
          />
        )}

        {/* Teaching State */}
        {appState === 'TEACHING' && (
          activeSession ? (
            <TeachingView 
              session={activeSession} 
              onBack={() => {
                setAppState('LEARNING');
                setActiveSession(null);
                setActiveTopicId(null);
              }}
              onComplete={handleCompleteTopic}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-32 space-y-6 text-center">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-indigo-100 rounded-full border-t-indigo-600 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="w-8 h-8 text-indigo-500 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-800">Preparing Your Lesson...</h2>
                <p className="text-slate-500 italic">"Teaching is the highest form of understanding."</p>
              </div>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-100 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="text-slate-400 w-6 h-6" />
            <span className="font-bold text-slate-400">SyllabusAI</span>
          </div>
          <p className="text-sm text-slate-400">© 2024 SyllabusAI. Built with Gemini AI and standard-grade excellence.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">Terms</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const Brain: React.FC<{className?: string}> = ({className}) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54Z"/></svg>
);
