import React, { useState, useEffect } from 'react';
import { QuestionCard } from './QuestionCard';
import { ExamData } from '../types';
import { ClockCircleOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'motion/react';

interface ExamContainerProps {
  examData: ExamData;
  onFinish: (score: number, total: number) => void;
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

export const ExamContainer: React.FC<ExamContainerProps> = ({ examData, onFinish, isDarkMode, toggleDarkMode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string | string[]>>({});
  const [timeRemaining, setTimeRemaining] = useState(examData.timeLimit);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentQuestion = examData.questions[currentIndex];
  const totalQuestions = examData.questions.length;
  const progressPercent = ((currentIndex) / totalQuestions) * 100;

  // Timer logic
  useEffect(() => {
    if (timeRemaining <= 0) {
      handleFinish();
      return;
    }
    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (answer: string | string[]) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };

  const checkCorrectness = (answer: string | string[], correct: string | string[]) => {
    if (Array.isArray(answer) && Array.isArray(correct)) {
      return JSON.stringify(answer) === JSON.stringify(correct);
    }
    
    // Normalize string answers for comparison
    const normAnswer = typeof answer === 'string' ? answer.trim().toLowerCase() : answer;
    const normCorrect = typeof correct === 'string' ? correct.trim().toLowerCase() : correct;
    
    return normAnswer === normCorrect;
  };

  const handleSubmit = () => {
    const answer = userAnswers[currentQuestion.id];
    const correct = checkCorrectness(answer, currentQuestion.correctAnswer);
    setIsCorrect(correct);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    let score = 0;
    examData.questions.forEach(q => {
      const uAnswer = userAnswers[q.id];
      if (uAnswer && checkCorrectness(uAnswer, q.correctAnswer)) {
        score++;
      }
    });
    onFinish(score, totalQuestions);
  };

  return (
    <div className="text-slate-800 dark:text-slate-200 flex flex-col h-screen overflow-hidden font-sans bg-slate-50 dark:bg-slate-900 transition-colors">
      <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 flex items-center justify-between z-10 shrink-0 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-xl">K</span>
          </div>
          <div>
            <h1 className="font-bold text-slate-900 dark:text-slate-100 leading-tight text-sm">KATA EDU PLATFORM</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{examData.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          {toggleDarkMode && (
            <button 
              onClick={toggleDarkMode} 
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          )}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700">
            <ClockCircleOutlined className="text-indigo-600 dark:text-indigo-400" />
            <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">{formatTime(timeRemaining)}</span>
          </div>
          <button 
            onClick={handleFinish}
            className="px-4 py-1.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-md text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors"
          >
            NỘP BÀI
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside className="w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shrink-0 transition-colors">
          <div className="p-5 flex-1 overflow-y-auto">
            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tiến độ làm bài</span>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{currentIndex + 1}/{totalQuestions}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 dark:bg-indigo-400 h-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Danh sách câu hỏi</div>
            <div className="grid grid-cols-5 gap-2">
              {examData.questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isSelected = !!userAnswers[q.id] && (!Array.isArray(userAnswers[q.id]) || (userAnswers[q.id] as string[]).length > 0);
                
                let itemClass = "w-9 h-9 flex items-center justify-center rounded-lg text-[13px] font-medium border transition-colors cursor-pointer";
                if (isCurrent) {
                  itemClass += " border-2 border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-bold";
                } else if (isSelected) {
                  itemClass += " bg-emerald-500 text-white border-emerald-500 dark:bg-emerald-600 dark:border-emerald-600";
                } else {
                  itemClass += " border-slate-200 text-slate-600 dark:border-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50";
                }

                return (
                  <div 
                    key={q.id} 
                    className={itemClass}
                    onClick={() => !showFeedback && setCurrentIndex(idx)}
                  >
                    {idx + 1}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <div className="text-[10px] text-slate-400 dark:text-slate-500 italic mb-2 text-center underline uppercase">Chú thích:</div>
            <div className="flex justify-center gap-4 text-[10px] dark:text-slate-400">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-600"></div>Đã làm
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400"></div>Đang làm
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 border border-slate-300 dark:border-slate-600 rounded-sm"></div>Trống
              </div>
            </div>
          </div>
        </aside>

        <section className="flex-1 bg-slate-50 dark:bg-slate-900 p-6 md:p-8 pt-10 flex flex-col items-center justify-center overflow-hidden relative transition-colors">
          <div className={`w-full ${currentQuestion.passage || (currentQuestion.media && (Array.isArray(currentQuestion.media) ? currentQuestion.media.some(m => m.type === 'image') : currentQuestion.media.type === 'image')) ? 'max-w-6xl' : 'max-w-3xl'} h-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-700/80 relative flex flex-col transition-all duration-500`}>
            <div className="absolute -top-3.5 left-6 bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider z-20 shadow-md">
              CÂU HỎI {currentIndex + 1}
            </div>
            
            <div className="flex-1 w-full h-full rounded-2xl overflow-hidden flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col flex-1 h-full w-full overflow-hidden"
                >
                  <QuestionCard 
                    question={currentQuestion}
                    currentAnswer={userAnswers[currentQuestion.id]}
                    onAnswerChange={handleAnswerChange}
                    onSubmit={handleSubmit}
                    isCorrect={isCorrect}
                    showFeedback={showFeedback}
                    onNext={handleNext}
                    isLastQuestion={currentIndex === totalQuestions - 1}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
