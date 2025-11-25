import React, { useState, useEffect, useRef } from 'react';
import { parseSpaceFormat } from './utils/parser';
import { generateSpaceContent } from './services/geminiService';
import { SpaceSection, LogEntry } from './types';
import SectionCard from './components/SectionCard';
import { Terminal as TerminalIcon, Play, RefreshCw, Eraser, Command, Clipboard, ChevronsRight } from 'lucide-react';

const INITIAL_TEMPLATE = `⫻content/meta-template-examples:0
Templates for ⫻ sections in the Space format are structured to ensure clarity.

⫻const/json:store
{"key":"value", "other_parameter":123}

⫻context/tag:meta
{explanatory note, context-setting, or system-reminder}`;

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>(INITIAL_TEMPLATE);
  const [parsedSections, setParsedSections] = useState<SpaceSection[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [aiPrompt, setAiPrompt] = useState('');
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Parse effect
  useEffect(() => {
    const { sections } = parseSpaceFormat(inputText);
    setParsedSections(sections);
    
    // Auto-focus logic: If sections changed and we don't have a valid active one, default to first or stay null
    if (sections.length > 0 && !activeSectionId) {
        // Optional: setActiveSectionId(sections[0].id);
    }
  }, [inputText]);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev.slice(-4), { timestamp: new Date().toLocaleTimeString(), message, type }]);
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsLoading(true);
    addLog(`CMD >> ${aiPrompt}`, 'info');
    
    try {
      const generatedText = await generateSpaceContent(aiPrompt, inputText);
      // Append generated text or replace? The persona is "console tool".
      // Usually console tools output to stream. We will append to input area.
      setInputText(prev => `${prev.trim()}\n\n${generatedText.trim()}`);
      addLog('Generated content received', 'success');
      setAiPrompt('');
      
      // Scroll to bottom after render
      setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (e) {
      addLog('Generation failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addLog('Copied to buffer', 'success');
  };

  return (
    <div className="flex flex-col h-screen bg-console-bg text-console-fg font-mono overflow-hidden selection:bg-console-accent/30 selection:text-white">
      
      {/* Header / Status Bar */}
      <header className="h-10 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900/50">
        <div className="flex items-center gap-2 text-console-accent">
          <TerminalIcon size={16} />
          <span className="font-bold tracking-tighter text-sm">SPACE_FORMAT_CONSOLE_v1.0</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-zinc-500">
           <span className="flex items-center gap-1">
             <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
             {isLoading ? 'PROCESSING' : 'IDLE'}
           </span>
           <span>SECTIONS: {parsedSections.length}</span>
           <span>CHARS: {inputText.length}</span>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT: Raw Input (The Editor) */}
        <div className="w-1/2 flex flex-col border-r border-zinc-800">
          <div className="flex items-center justify-between p-2 border-b border-zinc-800 bg-zinc-900/30 text-xs">
            <span className="text-zinc-400 font-bold">INPUT_STREAM</span>
            <div className="flex gap-2">
                <button onClick={() => setInputText('')} className="hover:text-red-400" title="Clear All"><Eraser size={14} /></button>
                <button onClick={() => setInputText(INITIAL_TEMPLATE)} className="hover:text-console-accent" title="Reset Template"><RefreshCw size={14} /></button>
            </div>
          </div>
          <textarea
            className="flex-1 w-full bg-transparent p-4 resize-none focus:outline-none text-sm leading-relaxed text-zinc-300 font-mono placeholder-zinc-700"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            spellCheck={false}
            placeholder="// Enter ⫻ sections here..."
          />
        </div>

        {/* RIGHT: Visualizer (The Viewer) */}
        <div className="w-1/2 flex flex-col bg-zinc-900/20">
          <div className="flex items-center justify-between p-2 border-b border-zinc-800 bg-zinc-900/30 text-xs">
            <span className="text-zinc-400 font-bold">PARSED_OBJECTS</span>
            <div className="flex gap-1 text-console-accent opacity-50">
                <ChevronsRight size={14} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
            {parsedSections.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-700 text-sm">
                    <Command size={48} className="mb-4 opacity-20" />
                    <p>NO VALID SECTIONS FOUND</p>
                    <p className="text-xs mt-2 opacity-50">Start line with ⫻name/type:place</p>
                </div>
            ) : (
                parsedSections.map(section => (
                    <SectionCard
                        key={section.id}
                        section={section}
                        isActive={activeSectionId === section.id}
                        onClick={() => setActiveSectionId(section.id)}
                        onCopy={copyToClipboard}
                    />
                ))
            )}
            <div ref={bottomRef} />
          </div>
        </div>
      </div>

      {/* Footer: AI Command Line */}
      <div className="h-auto min-h-[60px] border-t border-zinc-800 bg-zinc-900/80 backdrop-blur flex flex-col">
        {/* Log Area */}
        {logs.length > 0 && (
            <div className="px-4 py-1 text-[10px] flex gap-4 font-mono border-b border-zinc-800/50">
                {logs.map((log, i) => (
                    <span key={i} className={`${log.type === 'error' ? 'text-red-500' : log.type === 'success' ? 'text-green-500' : 'text-zinc-500'}`}>
                        [{log.timestamp}] {log.message}
                    </span>
                ))}
            </div>
        )}
        
        {/* Command Input */}
        <div className="flex items-center p-2 gap-2">
            <div className="text-console-accent pl-2 font-bold select-none">{'>'}</div>
            <input
                type="text"
                className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-zinc-100 font-mono text-sm h-10"
                placeholder="Enter instruction (e.g., 'Summary of context', 'Add new json store')..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        handleAiGenerate();
                    }
                }}
            />
            <button 
                onClick={handleAiGenerate}
                disabled={isLoading || !aiPrompt.trim()}
                className={`
                    px-4 py-2 text-xs font-bold border border-zinc-700 rounded-sm transition-all
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-console-accent hover:text-console-accent hover:bg-console-accent/10 active:scale-95'}
                `}
            >
                {isLoading ? 'EXEC...' : 'EXECUTE'}
            </button>
        </div>
      </div>

    </div>
  );
};

export default App;