import React from 'react';
import { SpaceSection } from '../types';
import { Copy, Terminal, Database, Tag, MessageSquare } from 'lucide-react';

interface SectionCardProps {
  section: SpaceSection;
  onCopy: (text: string) => void;
  isActive: boolean;
  onClick: () => void;
}

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'json': return <Database size={14} />;
    case 'meta': return <Terminal size={14} />;
    case 'tag': return <Tag size={14} />;
    case 'persona': return <MessageSquare size={14} />;
    default: return <Terminal size={14} />;
  }
};

const SectionCard: React.FC<SectionCardProps> = ({ section, onCopy, isActive, onClick }) => {
  const isJson = section.type === 'json';
  
  let prettyContent = section.content;
  let isJsonValid = false;

  if (isJson) {
      try {
          prettyContent = JSON.stringify(JSON.parse(section.content), null, 2);
          isJsonValid = true;
      } catch (e) {
          // keep original if invalid
      }
  }

  return (
    <div 
      className={`
        group relative mb-4 border rounded-none p-0 transition-all duration-200 cursor-pointer
        ${isActive 
            ? 'border-console-accent bg-console-accent/5 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
            : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
        }
      `}
      onClick={onClick}
    >
      {/* Header Bar */}
      <div className={`
        flex items-center justify-between px-3 py-1.5 border-b font-mono text-xs select-none
        ${isActive ? 'border-console-accent/30 bg-console-accent/10 text-console-accent' : 'border-zinc-800 bg-zinc-900 text-zinc-500 group-hover:text-zinc-400'}
      `}>
        <div className="flex items-center gap-2">
            <span className="opacity-70">⫻</span>
            <span className="font-bold">{section.name}</span>
            <span className="opacity-40">/</span>
            <span className="text-blue-400">{section.type}</span>
            <span className="opacity-40">:</span>
            <span className="text-yellow-600">{section.place}</span>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {getTypeIcon(section.type)}
            <button 
                onClick={(e) => { e.stopPropagation(); onCopy(section.content); }}
                className="hover:text-white transition-colors"
                title="Copy Content"
            >
                <Copy size={12} />
            </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3 overflow-x-auto">
        <pre className={`
            font-mono text-sm leading-relaxed whitespace-pre-wrap break-all
            ${isJson && isJsonValid ? 'text-amber-200' : 'text-zinc-300'}
        `}>
            {prettyContent}
        </pre>
      </div>
      
      {/* Active Indicator (The << THIS >> metaphor) */}
      {isActive && (
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-console-accent animate-pulse" />
      )}
    </div>
  );
};

export default SectionCard;