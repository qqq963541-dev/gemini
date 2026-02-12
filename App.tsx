
import React, { useState, useRef, useEffect } from 'react';
import { StatusBar } from './components/StatusBar';
import { DialogBubble } from './components/DialogBubble';
import { ControlPanel } from './components/ControlPanel';
import AnimationOverlay from './components/AnimationOverlay';
import { PoetSelector } from './components/PoetSelector';
import { PoetIdentityCard } from './components/PoetIdentityCard';
import { ReportModal } from './components/ReportModal';
import { Message, GameState, PoetId, ReportData } from './types';
import { generatePoetResponse, generateInterviewReport, checkGrammar } from './services/geminiService';
import { POET_PROFILES } from './constants';

const DynamicBackground = ({ poetId }: { poetId: PoetId }) => {
  const profile = POET_PROFILES[poetId];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 transition-all duration-1000" style={{ 
        background: `linear-gradient(to bottom, ${profile.themeColor}22, ${profile.themeColor}11, #f4e4bc)` 
      }}></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-30"></div>
    </div>
  );
};

function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentPoet: 'libai',
    poetMessages: {
      libai: [{ id: 'init-libai', text: "Welcome. Shall we discuss the stars or the wine? 欢迎你。今日我们是谈论繁星，还是共饮美酒？", sender: 'poet', poetId: 'libai', timestamp: Date.now() }],
      dufu: [{ id: 'init-dufu', text: "The mountains stand still. What is on your mind? 锦江春色，万里无云。你在思索什么？", sender: 'poet', poetId: 'dufu', timestamp: Date.now() }],
      liqingzhao: [{ id: 'init-liqingzhao', text: "Let us speak of the rain and the flowers. 且坐。让我们聊聊这窗外的雨，还有那消瘦的绿肥红瘦。", sender: 'poet', poetId: 'liqingzhao', timestamp: Date.now() }],
      shakespeare: [{ id: 'init-ws', text: "Welcome to this great stage of fools. Speak thy mind. 欢迎来到这愚人的舞台。请尽管直抒胸臆。", sender: 'poet', poetId: 'shakespeare', timestamp: Date.now() }],
      tolstoy: [{ id: 'init-lt', text: "To live is to suffer. Tell me, friend, what brings you here? 生活便是受苦。告诉我，朋友，是什么引你至此？", sender: 'poet', poetId: 'tolstoy', timestamp: Date.now() }],
      hugo: [{ id: 'init-vh', text: "The dawn is coming. Let us talk of justice and soul. 曙光将至。让我们谈谈正义与灵魂。", sender: 'poet', poetId: 'hugo', timestamp: Date.now() }]
    },
    brilliantSentences: [],
    grammarNotes: [],
    voiceEnabled: true,
    showAnimation: null,
    sessionMode: 'free',
    classTimer: 45 * 60,
    questionsCount: 0
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBrilliantModal, setShowBrilliantModal] = useState(false);
  const [showGrammarModal, setShowGrammarModal] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gameState.currentPoet, gameState.poetMessages]);

  const handleUpdateMessage = (id: string, updates: Partial<Message>) => {
    const poetId = gameState.currentPoet;
    setGameState(prev => ({
      ...prev,
      poetMessages: {
        ...prev.poetMessages,
        [poetId]: prev.poetMessages[poetId].map(m => m.id === id ? { ...m, ...updates } : m)
      }
    }));
  };

  const handleSend = async (text: string) => {
    setIsProcessing(true);
    const currentPoetId = gameState.currentPoet;
    
    // 语法检测
    const grammarResult = await checkGrammar(text);
    
    const userMsg: Message = { 
      id: Date.now().toString(), 
      text, 
      sender: 'user', 
      timestamp: Date.now(),
      grammarCorrection: grammarResult || undefined
    };

    setGameState(prev => ({
      ...prev,
      poetMessages: { 
        ...prev.poetMessages, 
        [currentPoetId]: [...prev.poetMessages[currentPoetId], userMsg] 
      },
      grammarNotes: grammarResult ? [...prev.grammarNotes, grammarResult] : prev.grammarNotes,
      questionsCount: prev.questionsCount + 1
    }));

    // 获取AI回复
    const chatHistory = gameState.poetMessages[currentPoetId].map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));
    chatHistory.push({ role: 'user', parts: [{ text }] });

    const aiText = await generatePoetResponse(currentPoetId, chatHistory);
    const aiMsg: Message = { id: 'ai-'+Date.now(), text: aiText, sender: 'poet', poetId: currentPoetId, timestamp: Date.now() };

    setGameState(prev => ({
      ...prev,
      poetMessages: { ...prev.poetMessages, [currentPoetId]: [...prev.poetMessages[currentPoetId], aiMsg] }
    }));
    setIsProcessing(false);
  };

  const handleOpenReport = async () => {
    setIsProcessing(true);
    try {
      const report = await generateInterviewReport(
        gameState.poetMessages[gameState.currentPoet], 
        gameState.currentPoet, 
        gameState.brilliantSentences
      );
      setReportData(report);
    } catch (e) {
      console.error("Failed to generate report", e);
    }
    setIsProcessing(false);
  };

  const currentProfile = POET_PROFILES[gameState.currentPoet];
  const currentMessages = gameState.poetMessages[gameState.currentPoet];

  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-[#f4e4bc]">
      <StatusBar state={gameState} onToggleMode={() => setGameState(p => ({ ...p, sessionMode: p.sessionMode === 'free' ? 'class' : 'free' }))} />
      <DynamicBackground poetId={gameState.currentPoet} />

      <div className="flex h-full overflow-hidden relative z-10">
        <div className="hidden lg:block w-80 h-full border-r border-amber-900/10 p-6 bg-white/50 backdrop-blur-md overflow-y-auto">
           <PoetIdentityCard profile={currentProfile} onQuickQuestion={handleSend} />
        </div>

        <div className="flex-1 flex flex-col relative h-full">
          <PoetSelector currentPoet={gameState.currentPoet} onSelect={(id) => setGameState(p => ({ ...p, currentPoet: id }))} />
          
          <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar scroll-smooth">
            <div className="max-w-4xl mx-auto pb-24">
              <div className="text-center mb-12 border-b-2 border-dashed border-amber-900/10 pb-6">
                  <h2 className="font-chinese text-4xl text-amber-950 tracking-[0.2em]">{currentProfile.nameCN} · 访谈录</h2>
                  <p className="text-xs text-gray-500 font-serif-text uppercase tracking-widest mt-2">Bilingual Archive of {currentProfile.nameEN}</p>
              </div>
              
              {currentMessages.map(msg => (
                <DialogBubble 
                  key={msg.id} 
                  message={msg} 
                  currentPoet={gameState.currentPoet} 
                  onCollectSentence={(m) => setGameState(prev => ({ ...prev, brilliantSentences: [...prev.brilliantSentences, m] }))}
                  voiceEnabled={gameState.voiceEnabled} 
                  onUpdateMessage={handleUpdateMessage} 
                />
              ))}
              
              {isProcessing && (
                <div className="flex items-center gap-3 text-amber-900 font-chinese text-2xl animate-pulse pl-16">
                  <span className="animate-spin">🖌️</span>
                  <span>诗人正在构思回复...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <ControlPanel 
            onSend={handleSend} 
            onOpenBrilliant={() => setShowBrilliantModal(true)} 
            onOpenReport={handleOpenReport} 
            onOpenGrammarNotes={() => setShowGrammarModal(true)} 
            disabled={isProcessing} 
            currentPoet={gameState.currentPoet}
            voiceEnabled={gameState.voiceEnabled} 
            onToggleVoice={() => setGameState(p => ({ ...p, voiceEnabled: !p.voiceEnabled }))} 
            sessionMode={gameState.sessionMode}
            onToggleSessionMode={() => setGameState(p => ({ ...p, sessionMode: p.sessionMode === 'free' ? 'class' : 'free' }))} 
            questionsCount={gameState.questionsCount} 
            placeholder="与文豪对话 (支持中英双语 / 语音)..." 
          />
        </div>
      </div>

      {/* 收藏金句弹窗 */}
      {showBrilliantModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-ink">
          <div className="bg-[#fdfbf7] w-full max-w-2xl rounded-sm border-x-[16px] border-[#8c2a2a] shadow-2xl p-10 h-[80vh] flex flex-col bg-ancient-paper relative">
            <button onClick={() => setShowBrilliantModal(false)} className="absolute top-6 right-8 text-4xl text-red-900 hover:scale-110 transition-transform">&times;</button>
            <h2 className="font-chinese text-4xl text-[#8c2a2a] border-b-4 border-double border-[#8c2a2a]/20 pb-6 mb-8 tracking-widest">文翰摘珠 · 收藏夹</h2>
            <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
              {gameState.brilliantSentences.map((m, i) => (
                <div key={i} className="bg-white p-6 border-l-8 border-red-900 shadow-md italic font-serif-text text-lg text-gray-900 leading-relaxed relative group">
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-red-900 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg">
                    {i + 1}
                  </div>
                  "{m.text}"
                  <div className="mt-4 text-right text-xs text-gray-400 font-chinese">—— 摘自与 {POET_PROFILES[m.poetId || gameState.currentPoet].nameCN} 的对话</div>
                </div>
              ))}
              {gameState.brilliantSentences.length === 0 && (
                <div className="text-center py-40 opacity-40">
                  <div className="text-6xl mb-4">🏮</div>
                  <p className="font-chinese text-2xl">暂无收藏佳句</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 语法错题本弹窗 */}
      {showGrammarModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-ink">
          <div className="bg-[#fdfbf7] w-full max-w-3xl rounded-sm border-x-[16px] border-indigo-900 shadow-2xl p-10 h-[80vh] flex flex-col bg-ancient-paper relative">
            <button onClick={() => setShowGrammarModal(false)} className="absolute top-6 right-8 text-4xl text-indigo-900 hover:scale-110 transition-transform">&times;</button>
            <h2 className="font-chinese text-4xl text-indigo-900 border-b-4 border-double border-indigo-900/20 pb-6 mb-8 tracking-widest">语法锦囊 · 错题本</h2>
            <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
              {gameState.grammarNotes.map((note, i) => (
                <div key={i} className="bg-white p-6 border-l-8 border-indigo-800 shadow-lg relative overflow-hidden">
                  <span className="absolute top-2 right-4 text-[10px] px-2 py-0.5 bg-indigo-100 text-indigo-900 rounded-full font-bold uppercase tracking-widest">
                    {note.errorType}
                  </span>
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">学生原句 (Student Original)</p>
                    <p className="text-red-600 font-serif-text text-lg line-through decoration-2">{note.original}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">教师纠正 (Teacher Corrected)</p>
                    <p className="text-green-700 font-serif-text text-xl font-bold">{note.corrected}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-indigo-50">
                    <p className="text-xs text-indigo-900 font-bold mb-1 flex items-center gap-1">
                      <span>💡 详解说明 (Explanation)</span>
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed">{note.explanation}</p>
                  </div>
                </div>
              ))}
              {gameState.grammarNotes.length === 0 && (
                <div className="text-center py-40">
                  <div className="text-6xl mb-4 opacity-30">✨</div>
                  <p className="font-chinese text-2xl text-gray-400">目前文法无误，继续保持！</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 专访报告 */}
      <ReportModal data={reportData} onClose={() => setReportData(null)} />
      
      <AnimationOverlay type={gameState.showAnimation} onComplete={() => setGameState(prev => ({ ...prev, showAnimation: null }))} />
    </div>
  );
}

export default App;
