
import React, { useState } from 'react';
import { Message, PoetId } from '../types';
import { POET_PROFILES } from '../constants';
import { translateToClassical } from '../services/geminiService';

interface Props {
  message: Message;
  currentPoet: PoetId;
  onCollectSentence: (m: Message) => void;
  voiceEnabled: boolean;
  onUpdateMessage: (id: string, updates: Partial<Message>) => void;
}

export const DialogBubble: React.FC<Props> = ({ 
  message, 
  currentPoet, 
  onCollectSentence,
  voiceEnabled,
  onUpdateMessage 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const isUser = message.sender === 'user';
  const profile = POET_PROFILES[message.poetId || currentPoet];

  const handleSpeak = () => {
    if (!voiceEnabled) return;
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(message.text);
    utterance.lang = 'en-US';
    utterance.onend = () => setIsPlaying(false);
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleTranslate = async () => {
    if (showTranslation) {
      setShowTranslation(false);
      return;
    }
    if (!message.classicalChinese) {
      setIsTranslating(true);
      const res = await translateToClassical(message.text, currentPoet);
      onUpdateMessage(message.id, { classicalChinese: res.classical, vernacular: res.modern });
      setIsTranslating(false);
    }
    setShowTranslation(true);
  };

  const handleCollect = () => {
    // 检查划词选中
    const selection = window.getSelection()?.toString().trim();
    
    if (selection && selection.length > 0) {
      // 仅收藏选中的文字
      onCollectSentence({ ...message, text: selection });
    } else {
      // 收藏全文
      onCollectSentence(message);
    }

    // 视觉反馈
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  return (
    <div className={`flex gap-4 mb-8 ${isUser ? 'flex-row-reverse' : ''} animate-fade-in`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className={`w-14 h-14 rounded-lg overflow-hidden border-2 shadow-lg ${isUser ? 'border-gray-500' : 'border-amber-900'}`}>
          <img 
            src={isUser ? "https://preview.qiantucdn.com/58pic/2g/4y/vG/PE/gqsphwx1t07zfyr6bvl5d4ukj89cmnoa_PIC2018.png!w800" : profile.avatar} 
            className="w-full h-full object-cover bg-white" 
            alt="avatar" 
          />
        </div>
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[85%] ${isUser ? 'text-right' : ''}`}>
        <div className={`relative inline-block text-left p-6 rounded-2xl shadow-xl transition-all ${isUser ? 'bg-white border-2 border-gray-300 rounded-tr-none' : 'bg-[#fffdf8] border-l-8 border-amber-900 rounded-tl-none'}`}>
          
          {/* Main Text - Enhanced Contrast */}
          <div className="text-gray-950 text-lg leading-relaxed font-serif-text select-text" style={{ fontWeight: 500 }}>
            {message.text}
          </div>

          {/* Grammar Correction Box (For User Messages) */}
          {isUser && message.grammarCorrection && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-left">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-amber-900">💡 语法纠错 (Grammar Tip)</span>
                <span className="text-[10px] px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full">{message.grammarCorrection.errorType}</span>
              </div>
              <p className="text-sm text-gray-800 mb-1">
                <span className="text-red-600 line-through mr-2">{message.grammarCorrection.original}</span>
                <span className="text-green-700 font-bold">{message.grammarCorrection.corrected}</span>
              </p>
              <p className="text-xs text-gray-600 italic">原因: {message.grammarCorrection.explanation}</p>
            </div>
          )}

          {/* Action Bar */}
          <div className={`flex items-center gap-4 mt-6 pt-4 border-t ${isUser ? 'justify-end border-gray-100' : 'border-amber-100'}`}>
            {!isUser && (
              <>
                <button onClick={handleTranslate} className="text-xs font-bold text-amber-900 hover:text-amber-700 flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full transition-colors border border-amber-200">
                  {isTranslating ? '📜 翻译中...' : '📜 古今转译'}
                </button>
                <div className="relative">
                  <button 
                    onClick={handleCollect} 
                    className="text-xs font-bold text-red-900 hover:text-red-700 flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-full transition-colors border border-red-200"
                    title="选中文字可局部收藏"
                  >
                    ⭐ 收藏
                  </button>
                  {showFeedback && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] py-1 px-2 rounded-full animate-bounce whitespace-nowrap z-50">
                      采集成功!
                    </div>
                  )}
                </div>
              </>
            )}
            <button onClick={handleSpeak} className="text-xs font-bold text-gray-700 hover:text-black flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full transition-colors border border-gray-200">
              {isPlaying ? '⏸ 停止' : '🔊 朗读'}
            </button>
          </div>
        </div>

        {/* Translation Result */}
        {showTranslation && message.classicalChinese && (
          <div className="mt-4 p-6 bg-amber-50/80 backdrop-blur-sm rounded-xl border-2 border-amber-200 shadow-inner animate-slide-down">
            <div className="mb-4">
              <span className="text-[10px] font-bold text-amber-900 uppercase tracking-widest bg-amber-200 px-2 py-0.5 rounded mr-2">简体文言</span>
              <p className="font-chinese text-2xl text-amber-950 mt-2 leading-relaxed">{message.classicalChinese}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest bg-gray-200 px-2 py-0.5 rounded mr-2">简体现代</span>
              <p className="text-sm text-gray-800 mt-2 italic">{message.vernacular}</p>
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div className="mt-2 text-[10px] font-bold text-gray-600 uppercase tracking-wider">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
