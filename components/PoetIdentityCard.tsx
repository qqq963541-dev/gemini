import React, { useState } from 'react';
import { PoetProfile, PoetId } from '../types';
import { POET_PROFILES } from '../constants';

interface Props {
  profile: PoetProfile;
  onViewDetails?: () => void;
  onQuickQuestion?: (question: string) => void;
}

// 诗人专属配色
const POET_THEMES: Record<PoetId, {
  primary: string;
  secondary: string;
  accent: string;
  bgGradient: string;
  pattern: string;
}> = {
  libai: {
    primary: '#d4af37',
    secondary: '#8c2a2a',
    accent: '#ffd700',
    bgGradient: 'from-amber-50 via-yellow-50 to-orange-50',
    pattern: 'radial-gradient(circle at 20% 80%, rgba(212,175,55,0.1) 0%, transparent 50%)'
  },
  dufu: {
    primary: '#4a5568',
    secondary: '#2d3748',
    accent: '#718096',
    bgGradient: 'from-gray-100 via-slate-100 to-stone-100',
    pattern: 'radial-gradient(circle at 80% 20%, rgba(74,85,104,0.1) 0%, transparent 50%)'
  },
  liqingzhao: {
    primary: '#c2185b',
    secondary: '#880e4f',
    accent: '#f48fb1',
    bgGradient: 'from-pink-50 via-rose-50 to-purple-50',
    pattern: 'radial-gradient(circle at 50% 50%, rgba(194,24,88,0.08) 0%, transparent 70%)'
  },
  // Fix: Added missing western poets to POET_THEMES
  shakespeare: {
    primary: '#6d4c41',
    secondary: '#3e2723',
    accent: '#ffb300',
    bgGradient: 'from-orange-50 via-amber-50 to-yellow-50',
    pattern: 'radial-gradient(circle at 30% 30%, rgba(109,76,65,0.1) 0%, transparent 50%)'
  },
  tolstoy: {
    primary: '#263238',
    secondary: '#000000',
    accent: '#cfd8dc',
    bgGradient: 'from-slate-100 via-zinc-200 to-gray-100',
    pattern: 'radial-gradient(circle at 70% 70%, rgba(38,50,56,0.1) 0%, transparent 50%)'
  },
  hugo: {
    primary: '#1a237e',
    secondary: '#0d47a1',
    accent: '#ffeb3b',
    bgGradient: 'from-blue-50 via-indigo-50 to-cyan-50',
    pattern: 'radial-gradient(circle at 40% 60%, rgba(26,35,126,0.1) 0%, transparent 50%)'
  }
};

// 快捷问题模板
const QUICK_QUESTIONS: Record<PoetId, string[]> = {
  libai: [
    '你最爱的酒是什么？',
    '月亮对你意味着什么？',
    '为什么喜欢漫游？'
  ],
  dufu: [
    '你如何看待战争？',
    '最难忘的经历是什么？',
    '为什么关心百姓疾苦？'
  ],
  liqingzhao: [
    '你最喜欢的花是什么？',
    '如何面对离别？',
    '作词时的心情如何？'
  ],
  // Fix: Added missing western poets to QUICK_QUESTIONS
  shakespeare: [
    'To be or not to be?',
    'What inspired your sonnets?',
    'How do you view tragedy?'
  ],
  tolstoy: [
    'What is true happiness?',
    'Why did you write War and Peace?',
    'How can one live a moral life?'
  ],
  hugo: [
    'What is justice to you?',
    'Why write about the miserable?',
    'How does revolution change souls?'
  ]
};

export const PoetIdentityCard: React.FC<Props> = ({ 
  profile, 
  onViewDetails,
  onQuickQuestion 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(false);
  const [copiedPoem, setCopiedPoem] = useState(false);
  
  const theme = POET_THEMES[profile.id];
  const quickQuestions = QUICK_QUESTIONS[profile.id];

  // 复制诗句
  const copyPoem = () => {
    navigator.clipboard.writeText(profile.representativePoem);
    setCopiedPoem(true);
    setTimeout(() => setCopiedPoem(false), 2000);
  };

  return (
    <div className="flex flex-col animate-fade-in">
      
      {/* 头部区域 - 诗人形象 */}
      <div 
        className="relative overflow-hidden rounded-xl border-2 shadow-xl mb-6 group"
        style={{ 
          borderColor: theme.primary,
          background: `linear-gradient(135deg, ${theme.bgGradient})`
        }}
      >
        {/* 背景装饰 */}
        <div 
          className="absolute inset-0 opacity-50"
          style={{ background: theme.pattern }}
        ></div>
        
        {/* 顶部装饰条 */}
        <div 
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)` }}
        ></div>

        <div className="relative p-6 flex flex-col items-center">
          {/* 头像容器 */}
          <div className="relative mb-4">
            {/* 外圈光环 */}
            <div 
              className="absolute -inset-3 rounded-full opacity-30 blur-md transition-opacity group-hover:opacity-50"
              style={{ background: theme.primary }}
            ></div>
            
            {/* 头像边框 */}
            <div 
              className="relative w-28 h-28 rounded-full p-1.5"
              style={{ 
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` 
              }}
            >
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-white">
                <img 
                  src={profile.avatar} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={profile.nameCN}
                />
              </div>
            </div>

            {/* 朝代徽章 */}
            <div 
              className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-white text-xs font-bold shadow-lg border-2 border-white"
              style={{ background: theme.secondary }}
            >
              {profile.dynasty.split(' ')[0]}
            </div>

            {/* 在线状态 */}
            <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-md animate-pulse"></div>
          </div>

          {/* 姓名区域 */}
          <div className="text-center">
            <h3 
              className="font-calligraphy text-4xl mb-1 transition-colors"
              style={{ color: theme.secondary }}
            >
              {profile.nameCN}
            </h3>
            <p className="font-serif-text text-sm text-gray-500 uppercase tracking-[0.3em] mb-2">
              {profile.nameEN}
            </p>
            
            {/* 称号标签 */}
            <div className="flex items-center justify-center gap-2">
              <span 
                className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-md"
                style={{ background: theme.primary }}
              >
                {profile.title}
              </span>
              <span 
                className="px-2 py-1 rounded-full text-xs border"
                style={{ 
                  borderColor: theme.primary,
                  color: theme.secondary,
                  background: `${theme.primary}20`
                }}
              >
                {profile.styleDescription}
              </span>
            </div>
          </div>

          {/* 快捷操作按钮 */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setShowQuickQuestions(!showQuickQuestions)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
              style={{ 
                background: `${theme.primary}20`,
                color: theme.secondary
              }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              快捷提问
            </button>
            
            <button
              onClick={onViewDetails}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              详细资料
            </button>
          </div>
        </div>
      </div>

      {/* 快捷问题面板 */}
      {showQuickQuestions && onQuickQuestion && (
        <div className="mb-6 -mt-2 animate-slide-down">
          <div 
            className="p-4 rounded-lg border shadow-lg"
            style={{ 
              background: `${theme.primary}10`,
              borderColor: `${theme.primary}30`
            }}
          >
            <h5 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">推荐问题</h5>
            <div className="space-y-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onQuickQuestion(question);
                    setShowQuickQuestions(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded text-sm transition-all hover:translate-x-1"
                  style={{ 
                    background: 'white',
                    color: theme.secondary,
                    borderLeft: `3px solid ${theme.primary}`
                  }}
                >
                  <span className="text-xs opacity-50 mr-2">0{index + 1}</span>
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 名句区域 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-chinese text-base flex items-center gap-2" style={{ color: theme.secondary }}>
            <span 
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
              style={{ background: theme.primary }}
            >
              诗
            </span>
            代表名句
          </h4>
          <button
            onClick={copyPoem}
            className="text-xs flex items-center gap-1 px-2 py-1 rounded transition-colors hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          >
            {copiedPoem ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                已复制
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                复制
              </>
            )}
          </button>
        </div>
        
        <div 
          className="relative p-5 rounded-lg border-l-4 bg-white shadow-md group cursor-pointer hover:shadow-lg transition-shadow"
          style={{ borderLeftColor: theme.primary }}
          onClick={copyPoem}
        >
          {/* 引号装饰 */}
          <span 
            className="absolute top-2 left-3 text-6xl opacity-10 font-serif leading-none"
            style={{ color: theme.primary }}
          >
            "
          </span>
          
          <p 
            className="relative font-calligraphy text-xl leading-relaxed text-center py-2"
            style={{ color: theme.secondary }}
          >
            {profile.representativePoem}
          </p>
          
          {/* 底部装饰 */}
          <div 
            className="absolute bottom-2 right-4 text-xs opacity-30"
            style={{ color: theme.primary }}
          >
            —— {profile.nameCN}
          </div>
        </div>
      </div>

      {/* 简介区域 */}
      <div className="mb-6">
        <h4 className="font-chinese text-base flex items-center gap-2 mb-3" style={{ color: theme.secondary }}>
          <span 
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
            style={{ background: theme.primary }}
          >
            传
          </span>
          生平简介
        </h4>
        
        <div className="relative">
          <p className={`
            text-sm leading-relaxed text-gray-600 text-justify
            ${isExpanded ? '' : 'line-clamp-4'}
          `}>
            {profile.bio}
          </p>
          
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-xs flex items-center gap-1 transition-colors hover:underline"
            style={{ color: theme.primary }}
          >
            {isExpanded ? '收起简介' : '展开简介'}
            <svg 
              className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 标签区域 */}
      <div className="mb-6">
        <h4 className="font-chinese text-base flex items-center gap-2 mb-3" style={{ color: theme.secondary }}>
          <span 
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
            style={{ background: theme.primary }}
          >
            标签
          </span>
          风格标签
        </h4>
        
        <div className="flex flex-wrap gap-2">
          {profile.tags.map((tag, index) => (
            <span 
              key={tag}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 cursor-default"
              style={{ 
                background: index === 0 ? `${theme.primary}20` : 'white',
                color: theme.secondary,
                border: `1px solid ${index === 0 ? theme.primary : '#e5e7eb'}`
              }}
            >
              {index === 0 && (
                <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5" style={{ background: theme.primary }}></span>
              )}
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* 词汇量统计（实用信息） */}
      <div className="p-4 rounded-lg bg-gradient-to-br from-gray-50 to-white border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">可用资源</span>
          <span className="text-xs text-gray-400">{profile.vocabulary.length} 词汇</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded bg-white shadow-sm">
            <div className="text-lg font-bold" style={{ color: theme.primary }}>{profile.vocabulary.length}</div>
            <div className="text-[10px] text-gray-400">核心词</div>
          </div>
          <div className="p-2 rounded bg-white shadow-sm">
            <div className="text-lg font-bold" style={{ color: theme.primary }}>{profile.sentencePatterns.length}</div>
            <div className="text-[10px] text-gray-400">句式</div>
          </div>
          <div className="p-2 rounded bg-white shadow-sm">
            <div className="text-lg font-bold" style={{ color: theme.primary }}>3</div>
            <div className="text-[10px] text-gray-400">难度级</div>
          </div>
        </div>
      </div>

      {/* 底部装饰 */}
      <div className="mt-6 pt-6 border-t border-gray-100 text-center">
        <p className="text-[10px] text-gray-400 tracking-widest">
          与 {profile.nameCN} 的跨时空对话
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="w-8 h-px bg-gray-200"></div>
          <div 
            className="w-1.5 h-1.5 rounded-full rotate-45"
            style={{ background: theme.primary }}
          ></div>
          <div className="w-8 h-px bg-gray-200"></div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};