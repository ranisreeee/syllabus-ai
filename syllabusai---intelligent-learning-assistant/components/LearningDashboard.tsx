
import React from 'react';
import { SyllabusTopic } from '../types';
import { CheckCircle2, Circle, PlayCircle, BookOpen, Layout } from 'lucide-react';
import { Button } from './Button';

interface LearningDashboardProps {
  topics: SyllabusTopic[];
  onSelectTopic: (topic: SyllabusTopic) => void;
  onToggleComplete: (id: string) => void;
}

export const LearningDashboard: React.FC<LearningDashboardProps> = ({ 
  topics, 
  onSelectTopic, 
  onToggleComplete 
}) => {
  const completedCount = topics.filter(t => t.completed).length;
  const progress = Math.round((completedCount / topics.length) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Progress Card */}
      <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold uppercase tracking-wider">
              <Layout className="w-3 h-3" /> Learning Overview
            </div>
            <h2 className="text-4xl font-extrabold text-white leading-tight">Your Personal <br /><span className="text-indigo-400">Mastery Path</span></h2>
            <p className="text-slate-400 text-lg">We've structured {topics.length} custom lessons for you.</p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                <circle 
                  cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                  className="text-indigo-500 transition-all duration-1000 ease-out"
                  strokeDasharray={58 * 2 * Math.PI}
                  strokeDashoffset={58 * 2 * Math.PI * (1 - progress / 100)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{progress}%</span>
              </div>
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">Completed</p>
          </div>
        </div>
      </div>

      {/* Topic List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
        {topics.map((topic, index) => (
          <div 
            key={topic.id}
            className={`group bg-white p-6 md:p-8 rounded-[2rem] border-2 transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6 ${
              topic.completed 
                ? 'border-emerald-100 bg-emerald-50/20' 
                : 'border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:-translate-y-1'
            }`}
          >
            <div className="flex items-center gap-6 flex-1 w-full">
              <button 
                onClick={() => onToggleComplete(topic.id)}
                className={`flex-shrink-0 transition-all transform hover:scale-110 ${topic.completed ? 'text-emerald-500' : 'text-slate-200 hover:text-indigo-400'}`}
              >
                {topic.completed ? (
                  <div className="bg-emerald-100 p-2 rounded-xl"><CheckCircle2 className="w-10 h-10" /></div>
                ) : (
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100"><Circle className="w-10 h-10" /></div>
                )}
              </button>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">UNIT {index + 1}</span>
                  {topic.completed && <span className="text-[10px] font-black bg-emerald-500 text-white px-1.5 py-0.5 rounded">DONE</span>}
                </div>
                <h3 className={`font-bold text-xl leading-tight ${topic.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                  {topic.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{topic.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Button 
                variant={topic.completed ? "outline" : "primary"}
                onClick={() => onSelectTopic(topic)}
                className="w-full md:w-auto px-10 py-4 rounded-2xl font-bold text-base"
              >
                <PlayCircle className={`w-5 h-5 ${topic.completed ? 'text-indigo-600' : 'text-white'}`} />
                {topic.completed ? "Review" : "Teach Me"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
