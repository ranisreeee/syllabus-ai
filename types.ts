
export interface SyllabusTopic {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface TeachingSession {
  topic: string;
  explanation: string;
  analogies: string[];
  keyConcepts: string[];
  examples: { title: string; detail: string }[];
  quiz: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export type AppState = 'IDLE' | 'PARSING' | 'LEARNING' | 'TEACHING';
