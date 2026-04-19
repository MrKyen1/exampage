import React, { useState, useEffect } from 'react';
import { ExamContainer } from '../features/exam/components/ExamContainer';
import { examService } from '../services/examService';
import { ExamData } from '../features/exam/types';
import { Button, Spin } from 'antd';
import { CheckCircleFilled, WarningFilled, BugOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';

interface ExamPageProps {
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

export const ExamPage: React.FC<ExamPageProps> = ({ isDarkMode, toggleDarkMode }) => {
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await examService.fetchExamData();
        setExamData(data);
      } catch (err) {
        setError('Không thể tải dữ liệu đề thi. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const startExam = () => setIsStarted(true);
  
  const handleFinish = (finalScore: number, totalQuestions: number) => {
    setScore(finalScore);
    setTotal(totalQuestions);
    setIsFinished(true);
  };

  const restartExam = () => {
    setIsStarted(false);
    setIsFinished(false);
    setScore(0);
    setTotal(0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !examData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center text-red-500">
          <BugOutlined className="text-4xl mb-4" />
          <p>{error || 'Lỗi tải đề thi'}</p>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const isPass = score / total >= 0.5;
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-10 shadow-xl max-w-lg w-full text-center border-t-8 border-indigo-500"
        >
          <div className="mb-6">
            {isPass ? (
              <CheckCircleFilled className="text-6xl text-emerald-500" />
            ) : (
              <WarningFilled className="text-6xl text-amber-500" />
            )}
          </div>
          <h2 className="text-3xl font-bold mb-4 text-slate-800 dark:text-slate-100">
            {isPass ? 'Chúc mừng bạn đã hoàn thành!' : 'Cố gắng lên nhé!'}
          </h2>
          <div className="text-xl mb-8 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-600">
            Bạn trả lời đúng: <br />
            <span className={`font-black text-5xl inline-block mt-2 ${isPass ? 'text-emerald-500' : 'text-amber-500'}`}>
              {score}/{total}
            </span>
          </div>
          <Button 
            type="primary" 
            size="large" 
            onClick={restartExam} 
            className="w-full h-14 rounded-xl font-bold text-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-md shadow-indigo-500/30 border-none"
          >
            Làm lại bài thi
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors relative">
        {toggleDarkMode && (
          <button 
            onClick={toggleDarkMode} 
            className="absolute top-6 right-6 p-3 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        )}

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-md w-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden p-8 text-center border border-slate-200/80 dark:border-slate-700/80"
        >
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">{examData.title}</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
            Bài thi bao gồm <b>{examData.questions.length}</b> câu hỏi. Thời gian làm bài là <b>{Math.floor(examData.timeLimit / 60)} phút</b>.
          </p>
          
          <Button 
            type="primary" 
            size="large" 
            onClick={startExam}
            className="w-full h-14 text-lg font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-lg shadow-indigo-500/30 border-none"
          >
            Bắt đầu làm bài
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <ExamContainer 
      examData={examData} 
      onFinish={handleFinish} 
      isDarkMode={isDarkMode} 
      toggleDarkMode={toggleDarkMode} 
    />
  );
};

