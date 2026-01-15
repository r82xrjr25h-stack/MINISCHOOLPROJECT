import React, { useState } from 'react';
import { GeminiService } from '../services/geminiService';
import { BrainCircuit, CheckCircle, XCircle, ArrowRight, RefreshCw, Loader2 } from 'lucide-react';
import { QuizData } from '../types';

const QuizGen: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const generateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setQuizData(null);
    setQuizFinished(false);
    setCurrentQuestionIdx(0);
    setScore(0);
    
    try {
      const data = await GeminiService.generateQuiz(topic);
      setQuizData(data);
    } catch (err) {
      alert("Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (showExplanation) return;
    setSelectedOption(index);
    setShowExplanation(true);
    
    if (quizData && index === quizData.questions[currentQuestionIdx].correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (!quizData) return;
    
    if (currentQuestionIdx < quizData.questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setQuizData(null);
    setTopic('');
    setQuizFinished(false);
    setScore(0);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-900 px-4 text-center">
        <Loader2 className="w-12 h-12 animate-spin mb-6" />
        <p className="text-xl font-bold uppercase tracking-widest">Generating Quiz</p>
        <p className="text-slate-500 mt-2">Crafting questions about "{topic}"...</p>
      </div>
    );
  }

  if (quizFinished && quizData) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg border-2 border-slate-900 p-6 md:p-12 text-center shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
        <div className="w-24 h-24 border-2 border-slate-900 rounded-full flex items-center justify-center mx-auto mb-8">
          <BrainCircuit className="w-12 h-12 text-slate-900" />
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 uppercase">Quiz Complete</h2>
        
        <div className="text-6xl md:text-7xl font-black text-slate-900 mb-2">
          {score}/{quizData.questions.length}
        </div>
        <p className="text-slate-500 mb-10 font-medium uppercase tracking-widest">Final Score</p>

        <button 
            onClick={resetQuiz}
            className="w-full md:w-auto bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-lg font-bold transition flex items-center justify-center gap-3 mx-auto"
        >
            <RefreshCw className="w-5 h-5" />
            CREATE NEW QUIZ
        </button>
      </div>
    );
  }

  if (quizData) {
    const question = quizData.questions[currentQuestionIdx];
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg border-2 border-slate-900 overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
          {/* Header */}
          <div className="bg-white p-4 md:p-6 border-b-2 border-slate-900 flex justify-between items-center">
            <div>
                <h2 className="text-lg md:text-xl font-black uppercase tracking-wide text-slate-900 truncate max-w-[200px] md:max-w-none">{quizData.title}</h2>
                <p className="text-xs md:text-sm font-bold text-slate-400 mt-1">Q {currentQuestionIdx + 1} / {quizData.questions.length}</p>
            </div>
            <div className="text-xs md:text-sm font-black bg-slate-900 text-white px-3 py-1 md:px-4 md:py-2 rounded whitespace-nowrap">
                SCORE: {score}
            </div>
          </div>

          {/* Question Body */}
          <div className="p-5 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 md:mb-8 leading-snug">
              {question.question}
            </h3>

            <div className="space-y-4">
              {question.options.map((option, idx) => {
                let btnClass = "w-full text-left p-4 md:p-5 rounded-lg border-2 transition-all duration-200 relative font-medium ";
                
                if (showExplanation) {
                   if (idx === question.correctAnswerIndex) {
                       // Correct
                       btnClass += "border-slate-900 bg-slate-900 text-white";
                   } else if (idx === selectedOption) {
                       // Wrong
                       btnClass += "border-slate-900 bg-slate-100 text-slate-400 line-through";
                   } else {
                       // Neutral/Unselected
                       btnClass += "border-slate-100 text-slate-300";
                   }
                } else {
                    btnClass += "border-slate-200 hover:border-slate-900 text-slate-800";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={showExplanation}
                    className={btnClass}
                  >
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-sm md:text-base">{option}</span>
                        {showExplanation && idx === question.correctAnswerIndex && <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-white flex-shrink-0" />}
                        {showExplanation && idx === selectedOption && idx !== question.correctAnswerIndex && <XCircle className="w-5 h-5 md:w-6 md:h-6 text-slate-500 flex-shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation Area */}
            {showExplanation && (
              <div className="mt-8 animate-fade-in border-t-2 border-slate-100 pt-8">
                <div className="bg-slate-50 rounded-lg p-5 md:p-6 border border-slate-200 mb-6">
                    <h4 className="font-bold text-slate-900 mb-2 uppercase text-sm tracking-wider">Explanation</h4>
                    <p className="text-slate-700 leading-relaxed text-sm md:text-base">{question.explanation}</p>
                </div>
                <div className="flex justify-end">
                    <button 
                        onClick={nextQuestion}
                        className="w-full md:w-auto bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-lg font-bold transition flex items-center justify-center gap-3"
                    >
                        {currentQuestionIdx === quizData.questions.length - 1 ? "FINISH QUIZ" : "NEXT QUESTION"}
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
       <div className="bg-white rounded-lg border-2 border-slate-900 p-6 md:p-12 text-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
         <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <BrainCircuit className="w-8 h-8 md:w-10 md:h-10 text-slate-900" />
         </div>
         <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 uppercase">Quiz Master</h2>
         <p className="text-slate-600 mb-10 text-base md:text-lg max-w-lg mx-auto">
            Test your knowledge. Enter a subject, and I'll generate a custom multiple-choice quiz just for you.
         </p>

         <form onSubmit={generateQuiz} className="max-w-md mx-auto relative flex flex-col sm:block">
            <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Subject (e.g., Solar System)"
                className="w-full pl-4 pr-4 sm:pl-6 sm:pr-32 py-4 rounded-lg border-2 border-slate-900 outline-none text-lg font-medium placeholder:text-slate-400 focus:bg-slate-50 transition mb-3 sm:mb-0"
            />
            <button
                type="submit"
                disabled={!topic.trim()}
                className="w-full sm:w-auto sm:absolute sm:right-2 sm:top-2 sm:bottom-2 bg-slate-900 hover:bg-black disabled:bg-slate-200 text-white px-6 py-4 sm:py-0 rounded font-bold uppercase tracking-wide transition"
            >
                Start
            </button>
         </form>

         <div className="mt-8 flex flex-wrap justify-center gap-2 md:gap-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="px-3 py-1 border border-slate-200 rounded">History</span>
            <span className="px-3 py-1 border border-slate-200 rounded">Science</span>
            <span className="px-3 py-1 border border-slate-200 rounded">Art</span>
         </div>
       </div>
    </div>
  );
};

export default QuizGen;