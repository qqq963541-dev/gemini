
import React, { useState, useRef, useEffect } from 'react';
import { PoetId } from '../types';
import { POET_PROFILES } from '../constants';

interface Props {
  onSend: (text: string) => void;
  onOpenBrilliant: () => void;
  onOpenReport: () => void;
  onOpenGrammarNotes: () => void;
  disabled: boolean;
  currentPoet: PoetId;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  sessionMode: 'free' | 'class';
  onToggleSessionMode: () => void;
  questionsCount: number;
  placeholder: string;
}

export const ControlPanel: React.FC<Props> = ({
  onSend,
  onOpenBrilliant,
  onOpenReport,
  onOpenGrammarNotes,
  disabled,
  currentPoet,
  voiceEnabled,
  onToggleVoice,
  sessionMode,
  onToggleSessionMode,
  questionsCount,
  placeholder
}) => {
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'vocab' | 'patterns'>('vocab');
  const [selectedLevel, setSelectedLevel] = useState<'Elementary' | 'Junior' | 'Senior'>('Elementary');
  const [isScaffoldingExpanded, setIsScaffoldingExpanded] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const profile = POET_PROFILES[currentPoet];

  useEffect(() => {
    // 初始化语音识别
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'zh-CN'; // 默认设为中文，API 通常能自动识别中英

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev + transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => setIsRecording(false);
      recognitionRef.current.onend = () => setIsRecording(false);
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      setIsRecording(true);
      recognitionRef.current?.start();
    }
  };

  const handleSend = () => {
    if (!inputText.trim() || disabled) return;
    onSend(inputText.trim());
    setInputText('');
  };

  const insertText = (text: string) => {
    setInputText(prev => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + text + ' ');
    inputRef.current?.focus();
  };

  const currentPatterns = profile.sentencePatterns.filter(p => p.level === selectedLevel);

  return (
    <div className="bg-[#fdfbf7] border-t-2 border-amber-900/20 p-4 md:p-6 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')]">
      
      {/* Educational Scaffolding Tabs & Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsScaffoldingExpanded(!isScaffoldingExpanded)}
            className={`p-2 rounded-lg transition-all border-2 ${isScaffoldingExpanded ? 'bg-amber-900 text-white border-amber-950' : 'bg-white text-amber-900 border-amber-200 shadow-sm'}`}
            title={isScaffoldingExpanded ? "隐藏学习支架" : "显示学习支架"}
          >
            {isScaffoldingExpanded ? '📖 隐藏' : '📚 提示'}
          </button>
          
          {isScaffoldingExpanded && (
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 border border-gray-200 animate-fade-in">
              <button
                onClick={() => setActiveTab('vocab')}
                className={`px-4 md:px-6 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'vocab' ? 'bg-white text-amber-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                词汇
              </button>
              <button
                onClick={() => setActiveTab('patterns')}
                className={`px-4 md:px-6 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'patterns' ? 'bg-white text-amber-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                句式
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={onOpenGrammarNotes} 
            className="px-3 py-1.5 md:px-4 md:py-2 bg-indigo-900 text-white rounded-lg text-xs md:text-sm font-bold hover:bg-indigo-950 transition-all shadow-md flex items-center gap-1"
          >
            📝 错题本
          </button>
          <button onClick={onOpenBrilliant} className="px-3 py-1.5 md:px-4 md:py-2 bg-amber-900 text-white rounded-lg text-xs md:text-sm font-bold hover:bg-amber-950 transition-all shadow-md">
            ⭐ 收藏
          </button>
          <button onClick={onOpenReport} className={`px-3 py-1.5 md:px-4 md:py-2 text-white rounded-lg text-xs md:text-sm font-bold transition-all shadow-md ${sessionMode === 'class' && questionsCount < 5 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#102b4e] hover:bg-[#1a3a5c]'}`}>
            📄 报告
          </button>
          <button onClick={onToggleVoice} className={`p-2 rounded-full transition-all border ${voiceEnabled ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
            {voiceEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </div>

      {/* Scaffolding Content Area (Collapsible) */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isScaffoldingExpanded ? 'max-height-200 mb-4 opacity-100' : 'max-height-0 mb-0 opacity-0'}`}
        style={{ maxHeight: isScaffoldingExpanded ? '132px' : '0px' }}
      >
        <div className="h-32 overflow-y-auto bg-white/60 rounded-xl p-4 border-2 border-amber-900/5 custom-scrollbar">
          {activeTab === 'vocab' ? (
            <div className="flex flex-wrap gap-2">
              {profile.vocabulary.map((word) => (
                <button
                  key={word.word}
                  onClick={() => insertText(word.word)}
                  className="group relative px-4 py-2 bg-white border-2 border-gray-100 rounded-lg hover:border-amber-400 hover:shadow-md transition-all text-left"
                >
                  <span className="font-bold text-gray-900">{word.word}</span>
                  <span className="text-xs text-gray-500 ml-2">({word.meaningCN})</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2">
                {(['Elementary', 'Junior', 'Senior'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border-2 ${selectedLevel === level ? 'bg-amber-900 text-white border-amber-900 shadow-md' : 'bg-transparent text-gray-500 border-gray-200 hover:border-amber-900/30'}`}
                  >
                    {level === 'Elementary' ? '基础' : level === 'Junior' ? '进阶' : '深度'}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {currentPatterns.map((pattern, idx) => (
                  <button
                    key={idx}
                    onClick={() => insertText(pattern.template.replace(/______/g, ''))}
                    className="px-4 py-2 bg-white border-2 border-gray-100 rounded-lg hover:border-amber-400 hover:shadow-md transition-all text-left group"
                  >
                    <p className="font-bold text-gray-900 text-sm">{pattern.structure}</p>
                    <p className="text-[10px] text-gray-500 line-clamp-1">{pattern.example}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex gap-4">
        <div className="flex-1 relative flex gap-2">
          {/* 语音按钮 */}
          <button
            onClick={toggleRecording}
            className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 border-red-700 animate-pulse text-white shadow-lg' : 'bg-white border-gray-200 text-gray-400 hover:border-amber-500 hover:text-amber-600'}`}
            title="点击录音"
          >
            {isRecording ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 013 3v10a3 3 0 01-3 3 3 3 0 01-3-3V3a3 3 0 013-3z"/></svg>
            )}
          </button>

          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder={isRecording ? "正在倾听..." : placeholder}
            disabled={disabled}
            className={`w-full ${isScaffoldingExpanded ? 'h-24' : 'h-32'} p-5 bg-white border-2 border-amber-900/20 rounded-2xl resize-none focus:outline-none focus:border-amber-600 transition-all text-lg font-serif-text text-gray-950 placeholder:text-gray-400 shadow-inner`}
          />
        </div>
        
        <button
          onClick={handleSend}
          disabled={!inputText.trim() || disabled}
          className="px-6 md:px-10 bg-gradient-to-b from-amber-800 to-amber-950 text-white rounded-2xl font-chinese text-xl md:text-2xl tracking-[0.2em] shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center group"
        >
          {disabled ? '构思...' : '落笔'}
        </button>
      </div>
    </div>
  );
};
