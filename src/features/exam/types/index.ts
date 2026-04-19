export type QuestionType =
  | 'multiple-choice'
  | 'listening'
  | 'word-ordering'
  | 'true-false'
  | 'fill-in-the-blank'
  | 'matching';

export interface ExamMedia {
  type: 'image' | 'audio';
  url: string;
}

export interface ExamQuestion {
  id: string;
  type: QuestionType;
  passage?: string;
  questionContent: string;
  media?: ExamMedia | ExamMedia[];
  options?: string[]; // For multiple choice, true/false, word ordering
  correctAnswer: string | string[]; // Can be an array of correct ordered words or a single string
  explanation: string;
}

export interface ExamData {
  id: string;
  title: string;
  timeLimit: number; // in seconds
  questions: ExamQuestion[];
}

export interface ExamState {
  currentQuestionIndex: number;
  userAnswers: Record<string, string | string[]>;
  isFinished: boolean;
  timeRemaining: number;
  showFeedback: boolean;
}
