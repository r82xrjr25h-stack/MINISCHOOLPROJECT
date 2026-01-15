import React, { useState, useEffect } from 'react';
import { GeminiService } from '../services/geminiService';
import { BookOpen, Send, Sparkles, Loader2, Volume2, StopCircle } from 'lucide-react';
import MarkdownView from './MarkdownView';

const Explainer: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<'simple' | 'detailed'>('detailed');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const sourceNodeRef = React.useRef<AudioBufferSourceNode | null>(null);

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleExplain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setResult(null);
    stopAudio();
    try {
      const explanation = await GeminiService.explainConcept(topic, level);
      setResult(explanation);
    } catch (err) {
      setResult("Sorry, I encountered an error while trying to explain that topic.");
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = async () => {
    if (!result) return;
    
    if (isPlaying) {
      stopAudio();
      return;
    }

    setLoadingAudio(true);
    try {
      const audioBuffer = await GeminiService.speakText(result);
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const decodedBuffer = await audioContextRef.current.decodeAudioData(audioBuffer);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = decodedBuffer;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => {
        setIsPlaying(false);
        sourceNodeRef.current = null;
      };

      sourceNodeRef.current = source;
      source.start();
      setIsPlaying(true);
    } catch (error) {
      console.error("Audio error", error);
    } finally {
      setLoadingAudio(false);
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg border-2 border-slate-900 p-6 md:p-8 mb-8 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4 flex items-center gap-3">
          <BookOpen className="w-6 h-6 md:w-8 md:h-8 stroke-[1.5]" />
          CONCEPT EXPLAINER
        </h2>
        <p className="text-slate-600 mb-8 text-lg">
          Enter any complex topic, and I'll break it down for you.
        </p>

        <form onSubmit={handleExplain} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">Topic</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Photosynthesis, The Cold War..."
                className="flex-1 px-4 py-4 rounded-lg border-2 border-slate-200 focus:border-slate-900 outline-none transition-colors text-lg placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={loading || !topic}
                className="bg-slate-900 hover:bg-black disabled:bg-slate-200 disabled:text-slate-400 text-white px-8 py-3 sm:py-0 rounded-lg font-bold transition flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                EXPLAIN
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <label className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg cursor-pointer border-2 transition-all ${level === 'simple' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'}`}>
              <input
                type="radio"
                name="level"
                value="simple"
                checked={level === 'simple'}
                onChange={() => setLevel('simple')}
                className="hidden"
              />
              <span className="font-bold">Simple</span>
            </label>
            <label className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg cursor-pointer border-2 transition-all ${level === 'detailed' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'}`}>
              <input
                type="radio"
                name="level"
                value="detailed"
                checked={level === 'detailed'}
                onChange={() => setLevel('detailed')}
                className="hidden"
              />
              <span className="font-bold">Academic</span>
            </label>
          </div>
        </form>
      </div>

      {result && (
        <div className="bg-white rounded-lg border-2 border-slate-900 p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] animate-fade-in relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b-2 border-slate-100 pb-4 gap-4">
            <div className="flex items-center gap-2 text-slate-900">
              <Sparkles className="w-5 h-5" />
              <span className="font-bold uppercase tracking-wider">Result</span>
            </div>
            
            <button
              onClick={handleSpeak}
              disabled={loadingAudio}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${isPlaying ? 'bg-black text-white border-black' : 'bg-white text-slate-900 border-slate-200 hover:border-black'}`}
            >
              {loadingAudio ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isPlaying ? (
                <>
                  <StopCircle className="w-4 h-4" />
                  STOP
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  LISTEN
                </>
              )}
            </button>
          </div>
          <MarkdownView content={result} />
        </div>
      )}
    </div>
  );
};

export default Explainer;