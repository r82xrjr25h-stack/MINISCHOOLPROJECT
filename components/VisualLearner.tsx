import React, { useState, useRef } from 'react';
import { GeminiService } from '../services/geminiService';
import { Eye, Upload, Image as ImageIcon, X, Loader2, Sparkles } from 'lucide-react';
import MarkdownView from './MarkdownView';

const VisualLearner: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Reset result when new image is loaded
      setResult(null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;

    setLoading(true);
    try {
      const analysis = await GeminiService.analyzeImage(imagePreview, prompt);
      setResult(analysis);
    } catch (error) {
      setResult("I couldn't analyze the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg border-2 border-slate-900 p-6 md:p-8 mb-8 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4 flex items-center gap-3">
          <Eye className="w-6 h-6 md:w-8 md:h-8 stroke-[1.5]" />
          VISUAL HELPER
        </h2>
        <p className="text-slate-600 mb-8 text-lg">
          Upload a photo of a diagram, math problem, or chart, and I'll help you understand it.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column: Upload */}
          <div className="space-y-6">
            <div 
                className={`border-2 border-dashed rounded-lg h-48 md:h-64 flex flex-col items-center justify-center relative transition-colors ${imagePreview ? 'border-slate-900 bg-slate-50' : 'border-slate-300 hover:border-slate-900 hover:bg-slate-50'}`}
            >
                {!imagePreview ? (
                    <>
                        <div className="w-12 h-12 md:w-16 md:h-16 border-2 border-slate-200 rounded-full flex items-center justify-center mb-4">
                            <Upload className="w-5 h-5 md:w-6 md:h-6 text-slate-400" />
                        </div>
                        <p className="text-slate-900 font-bold text-sm md:text-base">CLICK TO UPLOAD</p>
                        <p className="text-slate-400 text-xs mt-2 uppercase tracking-wide">JPG, PNG SUPPORT</p>
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </>
                ) : (
                    <div className="relative w-full h-full p-2">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded" />
                        <button 
                            onClick={handleRemoveImage}
                            className="absolute top-4 right-4 bg-black text-white p-2 rounded-full shadow-lg hover:bg-slate-800 transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Any specific questions? (e.g., 'Solve for x')"
                className="w-full p-4 rounded-lg border-2 border-slate-200 focus:border-slate-900 outline-none resize-none h-32 text-slate-900 placeholder:text-slate-400 transition-colors"
            />

            <button
                onClick={handleAnalyze}
                disabled={!imagePreview || loading}
                className="w-full bg-slate-900 hover:bg-black disabled:bg-slate-200 disabled:text-slate-400 text-white py-4 rounded-lg font-bold uppercase tracking-wider transition flex items-center justify-center gap-3"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                ANALYZE IMAGE
            </button>
          </div>

          {/* Right Column: Result */}
          <div className="border-2 border-slate-200 rounded-lg bg-white p-6 md:p-8 min-h-[400px]">
            {result ? (
                <div className="animate-fade-in">
                    <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-wide border-b-2 border-slate-100 pb-4">
                        <Sparkles className="w-5 h-5" />
                        Analysis Result
                    </h3>
                    <div className="prose prose-sm prose-slate max-w-none">
                         <MarkdownView content={result} />
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                    {loading ? (
                        <>
                            <Loader2 className="w-8 h-8 animate-spin mb-4 text-slate-900" />
                            <p className="font-medium uppercase tracking-widest text-xs">Analyzing...</p>
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 border-2 border-slate-100 rounded-full mb-4 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-slate-300" />
                            </div>
                            <p className="text-sm font-medium">Results will appear here.</p>
                        </>
                    )}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualLearner;