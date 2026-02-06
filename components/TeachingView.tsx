
import React, { useState } from 'react';
import { TeachingSession } from '../types';
import { Button } from './Button';
import { ArrowLeft, Lightbulb, Brain, CheckCircle2, AlertCircle, RefreshCw, BookOpen, Star, Zap, ChevronRight } from 'lucide-react';

interface TeachingViewProps {
  session: TeachingSession;
  onBack: () => void;
  onComplete: () => void;
}

export const TeachingView: React.FC<TeachingViewProps> = ({ session, onBack, onComplete }) => {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const handleAnswer = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    if (option === session.quiz[currentQuizIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuizIndex < session.quiz.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowSummary(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="p-3 bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl transition-all shadow-sm group"
          >
            <ArrowLeft className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-md uppercase tracking-wide">In Progress</span>
              <h1 className="text-3xl font-bold text-slate-900">{session.topic}</h1>
            </div>
            <p className="text-slate-500 font-medium">Let's make this topic easy to understand together.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Core Lesson Content */}
        <div className="lg:col-span-8 space-y-10">
          <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50" />
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg"><BookOpen className="w-6 h-6 text-indigo-600" /></div>
              The Big Picture
            </h3>
            <div className="prose prose-indigo max-w-none text-slate-600 leading-relaxed text-lg">
              {session.explanation}
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3 px-4">
              <Lightbulb className="w-6 h-6 text-amber-500" /> 
              Think of it like this...
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {session.analogies.map((analogy, i) => (
                <div key={i} className="bg-amber-50/40 p-8 rounded-[2rem] border border-amber-100/50 hover:bg-amber-50 transition-colors">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold mb-4">
                    {i + 1}
                  </div>
                  <p className="text-amber-900 leading-relaxed font-medium italic">"{analogy}"</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-emerald-50/40 p-10 rounded-[2.5rem] border border-emerald-100">
            <h3 className="text-2xl font-bold text-emerald-900 mb-8 flex items-center gap-3">
              <Zap className="w-6 h-6 text-emerald-500" /> Real-World Use Cases
            </h3>
            <div className="grid gap-8">
              {session.examples?.map((ex, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-emerald-100 text-emerald-600">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-emerald-900 mb-1">{ex.title}</h4>
                    <p className="text-emerald-800/80 leading-relaxed">{ex.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar: Cheat Sheet & Progress */}
        <div className="lg:col-span-4 space-y-8">
          <div className="sticky top-28 space-y-8">
            <section className="bg-slate-900 p-8 rounded-[2rem] shadow-xl text-white">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Brain className="w-6 h-6 text-indigo-400" /> Key Takeaways
              </h3>
              <ul className="space-y-5">
                {session.keyConcepts.map((concept, i) => (
                  <li key={i} className="flex gap-4 group cursor-default">
                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs group-hover:bg-indigo-500 group-hover:text-white transition-all">
                      {i + 1}
                    </div>
                    <span className="text-slate-300 group-hover:text-white transition-colors font-medium">{concept}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-indigo-50 rounded-full">
                  <CheckCircle2 className="w-10 h-10 text-indigo-600" />
                </div>
              </div>
              <h4 className="font-bold text-slate-800">Ready to test yourself?</h4>
              <p className="text-sm text-slate-500">Complete the quick quiz below to master this topic.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Quiz Section */}
      <section id="quiz-section" className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 scroll-mt-24">
        {!showSummary ? (
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div className="space-y-1">
                <span className="text-indigo-600 font-bold text-sm tracking-widest uppercase">Quick Challenge</span>
                <h2 className="text-3xl font-bold text-slate-900">Test Your Knowledge</h2>
              </div>
              <div className="flex gap-2">
                {session.quiz.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 w-12 rounded-full transition-all duration-500 ${
                      i < currentQuizIndex ? 'bg-indigo-600' : i === currentQuizIndex ? 'bg-indigo-300 scale-x-110' : 'bg-slate-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                <p className="text-xl font-bold text-slate-800 leading-relaxed">
                  {session.quiz[currentQuizIndex].question}
                </p>
              </div>

              <div className="grid gap-4">
                {session.quiz[currentQuizIndex].options.map((option, i) => {
                  const isCorrect = option === session.quiz[currentQuizIndex].correctAnswer;
                  const isSelected = option === selectedOption;
                  
                  let buttonStyle = "bg-white hover:border-indigo-400 hover:bg-indigo-50/30 border-slate-200 text-slate-700";
                  if (isAnswered) {
                    if (isCorrect) buttonStyle = "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md shadow-emerald-100";
                    else if (isSelected) buttonStyle = "bg-rose-50 border-rose-500 text-rose-700";
                    else buttonStyle = "opacity-40 grayscale";
                  }

                  return (
                    <button
                      key={i}
                      disabled={isAnswered}
                      onClick={() => handleAnswer(option)}
                      className={`group p-6 rounded-2xl border-2 transition-all text-left flex items-center justify-between gap-4 font-semibold text-lg ${buttonStyle}`}
                    >
                      <span className="flex-1">{option}</span>
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isAnswered && isCorrect ? 'bg-emerald-500 border-emerald-500 text-white' : 
                        isAnswered && isSelected && !isCorrect ? 'bg-rose-500 border-rose-500 text-white' : 
                        'border-slate-200 group-hover:border-indigo-400'
                      }`}>
                        {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5" />}
                        {isAnswered && isSelected && !isCorrect && <AlertCircle className="w-5 h-5" />}
                        {!isAnswered && <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="bg-indigo-50 p-8 rounded-[2rem] border border-indigo-100 space-y-6 animate-in slide-in-from-top-4 duration-300">
                  <div className="flex gap-4">
                    <div className="p-2 bg-white rounded-xl shadow-sm h-fit">
                      <Sparkles className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-indigo-900">Great Insight!</p>
                      <p className="text-indigo-800 leading-relaxed font-medium">
                        {session.quiz[currentQuizIndex].explanation}
                      </p>
                    </div>
                  </div>
                  <Button variant="primary" onClick={nextQuestion} className="w-full py-5 rounded-2xl text-lg">
                    {currentQuizIndex < session.quiz.length - 1 ? 'Next Challenge' : 'See Results'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto text-center py-10 space-y-8">
            <div className="relative inline-flex mb-4">
              <div className="w-32 h-32 rounded-full bg-emerald-100 flex items-center justify-center">
                <Star className="w-16 h-16 text-emerald-600 fill-current" />
              </div>
              <div className="absolute -top-2 -right-2 bg-indigo-600 text-white px-4 py-1 rounded-full font-bold text-sm shadow-lg">
                +{score * 10} XP
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-4xl font-extrabold text-slate-900">Boom! Mastery Achieved.</h2>
              <p className="text-slate-500 font-medium text-lg px-6">
                You've crushed it! You got {score} out of {session.quiz.length} correctly.
              </p>
            </div>

            <div className="pt-6 grid gap-4">
              <Button variant="primary" onClick={onComplete} className="w-full py-4 text-lg rounded-2xl">
                Finish & Save Progress
              </Button>
              <Button variant="ghost" onClick={() => {
                setShowSummary(false);
                setCurrentQuizIndex(0);
                setSelectedOption(null);
                setIsAnswered(false);
                setScore(0);
              }} className="w-full py-4 font-bold text-slate-500">
                <RefreshCw className="w-5 h-5 mr-2" /> Retake to perfect
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

const Sparkles: React.FC<{className?: string}> = ({className}) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
);
