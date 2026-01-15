import React, { useState } from 'react';
import { AppView } from './types';
import Explainer from './components/Explainer';
import QuizGen from './components/QuizGen';
import VisualLearner from './components/VisualLearner';
import ResearchAssistant from './components/ResearchAssistant';
import StudyPlanner from './components/StudyPlanner';
import { BookOpen, BrainCircuit, Eye, GraduationCap, LayoutDashboard, Globe, Calendar, Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (view: AppView) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.EXPLAINER:
        return <Explainer />;
      case AppView.QUIZ:
        return <QuizGen />;
      case AppView.VISION:
        return <VisualLearner />;
      case AppView.RESEARCH:
        return <ResearchAssistant />;
      case AppView.PLANNER:
        return <StudyPlanner />;
      case AppView.DASHBOARD:
      default:
        return (
          <div className="max-w-5xl mx-auto">
            <div className="text-center py-8 md:py-16">
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 md:mb-6 tracking-tight">
                EDUMIND
              </h1>
              <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium px-4">
                Minimalist AI-powered study companion. Select a tool to begin.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-4 pb-8">
              <button 
                onClick={() => handleNavClick(AppView.EXPLAINER)}
                className="group bg-white p-6 md:p-8 rounded-lg border-2 border-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-200 text-left shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                <div className="w-12 h-12 border-2 border-slate-900 rounded flex items-center justify-center mb-4 md:mb-6 group-hover:border-white group-hover:bg-white group-hover:text-slate-900 transition-colors">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-lg md:text-xl font-black mb-2 uppercase tracking-wide">Explainer</h3>
                <p className="text-sm font-medium opacity-80 leading-relaxed">
                  Get structured explanations tailored to your level.
                </p>
              </button>

              <button 
                onClick={() => handleNavClick(AppView.QUIZ)}
                className="group bg-white p-6 md:p-8 rounded-lg border-2 border-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-200 text-left shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                <div className="w-12 h-12 border-2 border-slate-900 rounded flex items-center justify-center mb-4 md:mb-6 group-hover:border-white group-hover:bg-white group-hover:text-slate-900 transition-colors">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <h3 className="text-lg md:text-xl font-black mb-2 uppercase tracking-wide">Quiz Gen</h3>
                <p className="text-sm font-medium opacity-80 leading-relaxed">
                  Generate practice quizzes on any subject.
                </p>
              </button>

              <button 
                onClick={() => handleNavClick(AppView.VISION)}
                className="group bg-white p-6 md:p-8 rounded-lg border-2 border-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-200 text-left shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                <div className="w-12 h-12 border-2 border-slate-900 rounded flex items-center justify-center mb-4 md:mb-6 group-hover:border-white group-hover:bg-white group-hover:text-slate-900 transition-colors">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-lg md:text-xl font-black mb-2 uppercase tracking-wide">Visual</h3>
                <p className="text-sm font-medium opacity-80 leading-relaxed">
                  Analyze and explain diagrams or problems.
                </p>
              </button>

              <button 
                onClick={() => handleNavClick(AppView.RESEARCH)}
                className="group bg-white p-6 md:p-8 rounded-lg border-2 border-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-200 text-left shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                <div className="w-12 h-12 border-2 border-slate-900 rounded flex items-center justify-center mb-4 md:mb-6 group-hover:border-white group-hover:bg-white group-hover:text-slate-900 transition-colors">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-lg md:text-xl font-black mb-2 uppercase tracking-wide">Research</h3>
                <p className="text-sm font-medium opacity-80 leading-relaxed">
                  Find credible sources with search grounding.
                </p>
              </button>

              <button 
                onClick={() => handleNavClick(AppView.PLANNER)}
                className="group bg-white p-6 md:p-8 rounded-lg border-2 border-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-200 text-left shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                <div className="w-12 h-12 border-2 border-slate-900 rounded flex items-center justify-center mb-4 md:mb-6 group-hover:border-white group-hover:bg-white group-hover:text-slate-900 transition-colors">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-lg md:text-xl font-black mb-2 uppercase tracking-wide">Planner</h3>
                <p className="text-sm font-medium opacity-80 leading-relaxed">
                  Organize your week with AI schedules.
                </p>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-dvh w-full flex flex-col md:flex-row bg-white text-slate-900 font-sans overflow-hidden">
      
      {/* Mobile Header (Visible when menu is closed) */}
      <div className="md:hidden flex items-center justify-between p-4 border-b-2 border-slate-900 bg-white flex-shrink-0 z-20 relative">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded flex items-center justify-center text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-black text-xl tracking-tighter">EDUMIND</span>
         </div>
         <button 
            onClick={() => setIsMobileMenuOpen(true)} 
            className="p-2 rounded hover:bg-slate-100 transition"
            aria-label="Open menu"
         >
            <Menu className="w-6 h-6" />
         </button>
      </div>

      {/* Sidebar Navigation Drawer */}
      <aside className={`
        fixed inset-0 z-40 bg-white flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:w-80 md:border-r-2 md:border-slate-900
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Mobile Sidebar Header (Visible INSIDE drawer) */}
        <div className="md:hidden p-4 border-b-2 border-slate-900 flex items-center justify-between flex-shrink-0 bg-white">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded flex items-center justify-center text-white">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-black text-xl tracking-tighter">EDUMIND</span>
           </div>
           <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="p-2 rounded hover:bg-slate-100 transition"
              aria-label="Close menu"
           >
              <X className="w-6 h-6" />
           </button>
        </div>

        {/* Desktop Sidebar Header */}
        <div className="hidden md:flex p-8 border-b-2 border-slate-900 items-center gap-4 flex-shrink-0">
          <div className="w-12 h-12 bg-slate-900 rounded flex items-center justify-center text-white">
            <GraduationCap className="w-7 h-7" />
          </div>
          <span className="font-black text-2xl tracking-tighter">EDUMIND</span>
        </div>
        
        <nav className="p-6 space-y-3 overflow-y-auto flex-1">
          <button
            onClick={() => handleNavClick(AppView.DASHBOARD)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-lg font-bold uppercase tracking-wide transition-all ${
              currentView === AppView.DASHBOARD 
                ? 'bg-slate-900 text-white shadow-[4px_4px_0px_0px_rgba(203,213,225,1)]' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>

          <div className="pt-6 pb-2 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">
            Tools
          </div>

          <button
            onClick={() => handleNavClick(AppView.EXPLAINER)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-lg font-bold uppercase tracking-wide transition-all ${
              currentView === AppView.EXPLAINER 
                ? 'bg-slate-900 text-white shadow-[4px_4px_0px_0px_rgba(203,213,225,1)]' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            Explainer
          </button>

          <button
            onClick={() => handleNavClick(AppView.QUIZ)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-lg font-bold uppercase tracking-wide transition-all ${
              currentView === AppView.QUIZ 
                ? 'bg-slate-900 text-white shadow-[4px_4px_0px_0px_rgba(203,213,225,1)]' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BrainCircuit className="w-5 h-5" />
            Quiz Gen
          </button>

          <button
            onClick={() => handleNavClick(AppView.VISION)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-lg font-bold uppercase tracking-wide transition-all ${
              currentView === AppView.VISION 
                ? 'bg-slate-900 text-white shadow-[4px_4px_0px_0px_rgba(203,213,225,1)]' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Eye className="w-5 h-5" />
            Visual
          </button>

          <button
            onClick={() => handleNavClick(AppView.RESEARCH)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-lg font-bold uppercase tracking-wide transition-all ${
              currentView === AppView.RESEARCH 
                ? 'bg-slate-900 text-white shadow-[4px_4px_0px_0px_rgba(203,213,225,1)]' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Globe className="w-5 h-5" />
            Research
          </button>

          <button
            onClick={() => handleNavClick(AppView.PLANNER)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-lg font-bold uppercase tracking-wide transition-all ${
              currentView === AppView.PLANNER 
                ? 'bg-slate-900 text-white shadow-[4px_4px_0px_0px_rgba(203,213,225,1)]' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-5 h-5" />
            Planner
          </button>
        </nav>
        
        <div className="p-8 mt-auto border-t-2 border-slate-900 bg-white flex-shrink-0">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-100"></div>
                <div>
                    <p className="text-sm font-bold text-slate-900">Student User</p>
                    <p className="text-xs font-bold text-slate-400 uppercase">Pro Plan</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-full p-4 md:p-12 relative w-full">
        <div className="max-w-6xl mx-auto pb-20 md:pb-0">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;