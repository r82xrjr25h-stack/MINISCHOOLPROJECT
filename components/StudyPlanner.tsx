import React, { useState } from 'react';
import { GeminiService } from '../services/geminiService';
import { Calendar, Clock, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { StudyPlan } from '../types';

const StudyPlanner: React.FC = () => {
  const [subjects, setSubjects] = useState('');
  const [days, setDays] = useState(5);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<StudyPlan | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjects.trim()) return;

    setLoading(true);
    setPlan(null);
    try {
      const data = await GeminiService.generateStudyPlan(subjects, days);
      setPlan(data);
    } catch (err) {
      alert("Could not generate plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-lg border-2 border-slate-900 p-6 md:p-8 mb-8 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4 flex items-center gap-3">
          <Calendar className="w-6 h-6 md:w-8 md:h-8 stroke-[1.5]" />
          STUDY PLANNER
        </h2>
        <p className="text-slate-600 mb-8 text-lg">
          Tell me your subjects and exam timeline. I'll build a structured schedule for you.
        </p>

        <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="flex-1">
            <label className="block text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">Subjects</label>
            <input
              type="text"
              value={subjects}
              onChange={(e) => setSubjects(e.target.value)}
              placeholder="e.g., Calculus, European History..."
              className="w-full px-4 py-4 rounded-lg border-2 border-slate-200 focus:border-slate-900 outline-none transition text-lg placeholder:text-slate-400"
            />
          </div>
          <div className="w-full md:w-32">
            <label className="block text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">Days</label>
            <input
              type="number"
              min="1"
              max="14"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="w-full px-4 py-4 rounded-lg border-2 border-slate-200 focus:border-slate-900 outline-none transition text-lg"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading || !subjects}
              className="w-full md:w-auto bg-slate-900 hover:bg-black disabled:bg-slate-200 disabled:text-slate-400 text-white px-8 py-4 rounded-lg font-bold uppercase tracking-wide transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              GENERATE
            </button>
          </div>
        </form>
      </div>

      {plan && (
        <div className="animate-fade-in">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">{plan.title}</h2>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {plan.tips.map((tip, i) => (
                <span key={i} className="inline-block px-3 py-1 md:px-4 md:py-2 bg-white border-2 border-slate-900 text-slate-900 rounded font-bold text-xs md:text-sm shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  {tip}
                </span>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plan.schedule.map((day, idx) => (
              <div key={idx} className="bg-white rounded-lg border-2 border-slate-900 overflow-hidden hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all duration-200">
                <div className="bg-slate-900 p-4 border-b-2 border-slate-900 text-white">
                  <h3 className="font-black text-lg uppercase tracking-wide">{day.day}</h3>
                  <p className="text-sm font-medium text-slate-300 mt-1">{day.focus}</p>
                </div>
                <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                  {day.tasks.map((task, tIdx) => (
                    <div key={tIdx} className="flex gap-4">
                      <div className="mt-0.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">{task.time}</p>
                        <p className="text-slate-700 font-medium leading-relaxed text-sm md:text-base">{task.activity}</p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t-2 border-slate-100 mt-4">
                    <button className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition w-full justify-center uppercase tracking-wide">
                        <CheckCircle2 className="w-4 h-4" />
                        Complete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlanner;