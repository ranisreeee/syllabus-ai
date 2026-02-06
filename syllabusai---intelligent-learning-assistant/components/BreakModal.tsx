
import React, { useState, useEffect } from 'react';
import { Coffee, Play } from 'lucide-react';
import { Button } from './Button';

interface BreakModalProps {
  onFinish: () => void;
}

export const BreakModal: React.FC<BreakModalProps> = ({ onFinish }) => {
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 minutes
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      setIsDone(true);
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl p-10 text-center space-y-6 shadow-2xl">
        <div className="inline-flex p-4 bg-indigo-50 rounded-full text-indigo-600 animate-bounce">
          <Coffee className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">Time for a break!</h2>
          <p className="text-slate-500">
            You've been focused for 30 minutes. Let your brain rest for a moment to better absorb what you've learned.
          </p>
        </div>
        <div className="text-6xl font-black text-indigo-600 font-mono">
          {formatTime(secondsLeft)}
        </div>
        <div className="pt-4">
          <Button 
            variant={isDone ? 'primary' : 'outline'} 
            onClick={onFinish}
            className="w-full py-4 rounded-2xl"
          >
            {isDone ? 'Resume Learning' : 'Skip Break'}
            {isDone && <Play className="w-4 h-4 ml-2 fill-current" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
