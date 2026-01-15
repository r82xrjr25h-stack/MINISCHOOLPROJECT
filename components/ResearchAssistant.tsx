import React, { useState } from 'react';
import { GeminiService } from '../services/geminiService';
import { Globe, Search, Loader2, ExternalLink } from 'lucide-react';
import MarkdownView from './MarkdownView';
import { ResearchResult } from '../types';

const ResearchAssistant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const data = await GeminiService.performResearch(query);
      setResult(data);
    } catch (err) {
      alert("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg border-2 border-slate-900 p-6 md:p-8 mb-8 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4 flex items-center gap-3">
          <Globe className="w-6 h-6 md:w-8 md:h-8 stroke-[1.5]" />
          RESEARCH ASSISTANT
        </h2>
        <p className="text-slate-600 mb-8 text-lg">
          Ask complex questions. I'll search the web and summarize credible sources for you.
        </p>

        <form onSubmit={handleSearch} className="relative flex flex-col sm:block">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Impact of AI on education..."
            className="w-full pl-4 pr-4 sm:pl-6 sm:pr-36 py-4 md:py-5 rounded-lg border-2 border-slate-900 shadow-sm focus:bg-slate-50 outline-none text-base md:text-lg font-medium placeholder:text-slate-400 transition mb-3 sm:mb-0"
          />
          <button
            type="submit"
            disabled={loading || !query}
            className="w-full sm:w-auto sm:absolute sm:right-3 sm:top-3 sm:bottom-3 bg-slate-900 hover:bg-black disabled:bg-slate-200 text-white px-6 py-3 sm:py-0 rounded font-bold uppercase tracking-wide transition flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            SEARCH
          </button>
        </form>
      </div>

      {result && (
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 bg-white rounded-lg border-2 border-slate-900 p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <h3 className="text-lg font-black text-slate-900 mb-6 border-b-2 border-slate-100 pb-2 uppercase tracking-wide">Synthesis</h3>
            <MarkdownView content={result.content} />
          </div>

          {/* Sources Sidebar */}
          <div className="bg-white rounded-lg border-2 border-slate-200 p-6 h-fit">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Sources</h3>
            {result.sources.length > 0 ? (
              <ul className="space-y-4">
                {result.sources.map((source, idx) => (
                  <li key={idx}>
                    <a 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block p-4 bg-white border-2 border-slate-100 rounded hover:border-slate-900 transition group"
                    >
                      <p className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:underline decoration-2">
                        {source.title}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 font-medium">
                        <ExternalLink className="w-3 h-3" />
                        <span className="truncate max-w-[150px]">{new URL(source.uri).hostname}</span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400 italic">No external sources cited.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchAssistant;