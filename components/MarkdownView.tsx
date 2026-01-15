import React from 'react';

const MarkdownView: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  
  return (
    <div className="space-y-4 text-slate-900 leading-relaxed font-normal">
      {lines.map((line, idx) => {
        // Headers - High contrast, bold
        if (line.startsWith('### ')) return <h3 key={idx} className="text-lg font-extrabold text-black mt-6 uppercase tracking-wide">{line.replace('### ', '')}</h3>;
        if (line.startsWith('## ')) return <h2 key={idx} className="text-xl font-extrabold text-black mt-8 border-b-2 border-black pb-2">{line.replace('## ', '')}</h2>;
        if (line.startsWith('# ')) return <h1 key={idx} className="text-3xl font-extrabold text-black mt-8">{line.replace('# ', '')}</h1>;
        
        // Lists
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
             return (
                <div key={idx} className="flex gap-3 ml-2">
                    <span className="text-black font-bold mt-1.5 w-1.5 h-1.5 bg-black rounded-full flex-shrink-0"></span>
                    <p>{parseInline(line.replace(/^[\-\*]\s/, ''))}</p>
                </div>
             )
        }
        
        // Empty lines
        if (line.trim() === '') return <div key={idx} className="h-2"></div>;

        return <p key={idx}>{parseInline(line)}</p>;
      })}
    </div>
  );
};

const parseInline = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-extrabold text-black bg-slate-100 px-1 rounded">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="bg-slate-100 text-black border border-slate-300 px-1.5 py-0.5 rounded font-mono text-sm">{part.slice(1, -1)}</code>;
    }
    return part;
  });
};

export default MarkdownView;