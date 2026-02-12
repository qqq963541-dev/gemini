import React, { useState, useEffect } from 'react';
import { GameState, PoetId } from '../types';
import { POET_PROFILES } from '../constants';

interface Props {
  state: GameState;
  onToggleMode?: () => void;
  onShowHelp?: () => void;
}

// 时辰计算
const getChineseHour = () => {
  const hour = new Date().getHours();
  const hours = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  return hours[Math.floor((hour + 1) % 24 / 2)] + '时';
};

// 诗人徽章配置
const POET_BADGES: Record<PoetId, { character: string; bg: string; glow: string }> = {
  libai: { 
    character: '仙', 
    bg: 'from-amber-600 to-yellow-700',
    glow: 'shadow-amber-500/50'
  },
  dufu: { 
    character: '圣', 
    bg: 'from-slate-600 to-gray-700',
    glow: 'shadow-slate-500/50'
  },
  liqingzhao: { 
    character: '词', 
    bg: 'from-pink-600 to-rose-700',
    glow: 'shadow-pink-500/50'
  },
  // Fix: Added missing western poets to POET_BADGES
  shakespeare: { 
    character: '剧', 
    bg: 'from-stone-600 to-orange-800',
    glow: 'shadow-orange-500/50'
  },
  tolstoy: { 
    character: '哲', 
    bg: 'from-zinc-700 to-black',
    glow: 'shadow-zinc-500/50'
  },
  hugo: { 
    character: '雄', 
    bg: 'from-blue-800 to-indigo-950',
    glow: 'shadow-blue-500/50'
  }
};

export const StatusBar: React.FC<Props> = ({ state, onToggleMode, onShowHelp }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const poetBadge = POET_BADGES[state.currentPoet];
  const poetProfile = POET_PROFILES[state.currentPoet];
  
  // 格式化课时时间
  const formatClassTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 计算进度百分比
  const progressPercent = state.sessionMode === 'class' 
    ? (state.questionsCount / 8) * 100 
    : 0;

  // 时辰
  const chineseHour = getChineseHour();

  return (
    <>
      {/* 主状态栏 */}
      <div className="relative bg-gradient-to-r from-[#0d1b2a] via-[#102b4e] to-[#0d1b2a] text-[#f4e4bc] shadow-2xl z-50 sticky top-0 border-b border-amber-700/30">
        
        {/* 顶部装饰线 */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-600/50 to-transparent"></div>
        
        <div className="flex items-center justify-between px-4 py-3">
          
          {/* 左侧：品牌 + 诗人信息 */}
          <div className="flex items-center gap-4">
            {/* 品牌标志 */}
            <div className="flex items-center gap-3">
              <div className="relative group">
                {/* 外发光 */}
                <div className={`absolute inset-0 rounded-full blur-md opacity-60 transition-opacity group-hover:opacity-100 ${poetBadge.glow}`}></div>
                {/* 徽章 */}
                <div className={`
                  relative w-10 h-10 rounded-full flex items-center justify-center font-calligraphy text-xl text-white shadow-inner border-2 border-white/20
                  bg-gradient-to-br ${poetBadge.bg}
                `}>
                  {poetBadge.character}
                </div>
                {/* 在线指示 */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#102b4e] animate-pulse"></div>
              </div>
              
              <div className="hidden sm:block">
                <h1 className="text-sm font-chinese tracking-[0.3em] text-amber-50 flex items-center gap-2">
                  古今笔谈
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-900/50 rounded text-amber-300/80 border border-amber-700/30">
                    {state.sessionMode === 'class' ? '课堂' : '自由'}
                  </span>
                </h1>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider opacity-70 font-serif-text">
                  Conversation with the Past
                </p>
              </div>
            </div>

            {/* 分隔线 */}
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-amber-700/30 to-transparent hidden md:block"></div>

            {/* 诗人信息 */}
            <div className="hidden md:flex items-center gap-3 text-xs">
              <span className="font-chinese text-amber-200/90">{poetProfile.nameCN}</span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-400 font-serif-text">{poetProfile.dynasty}</span>
              <span className="text-gray-500">|</span>
              <span className="text-amber-600/80 text-[10px] px-2 py-0.5 bg-amber-900/20 rounded-full border border-amber-800/20">
                {poetProfile.styleDescription}
              </span>
            </div>
          </div>

          {/* 中间：课时进度（仅在课堂模式显示） */}
          {state.sessionMode === 'class' && (
            <div className="hidden lg:flex flex-col items-center gap-1 flex-1 max-w-md mx-8">
              <div className="flex items-center justify-between w-full text-[10px] text-amber-400/80 font-chinese tracking-wider">
                <span>访谈进度</span>
                <span>{state.questionsCount} / 8 问</span>
              </div>
              <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-amber-900/20">
                <div 
                  className="h-full bg-gradient-to-r from-amber-600 to-yellow-500 transition-all duration-500 relative"
                  style={{ width: `${Math.min(progressPercent, 100)}%` }}
                >
                  {/* 闪光效果 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
            </div>
          )}

          {/* 右侧：功能区域 */}
          <div className="flex items-center gap-2">
            
            {/* 计时器（课堂模式） */}
            {state.sessionMode === 'class' && (
              <div className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono
                ${state.classTimer < 300 
                  ? 'bg-red-950/50 border-red-700/50 text-red-400 animate-pulse' 
                  : 'bg-black/30 border-amber-700/30 text-amber-400'}
              `}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-bold tracking-wider">{formatClassTime(state.classTimer)}</span>
              </div>
            )}

            {/* 时辰显示 */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-black/20 rounded-full border border-white/10 text-xs">
              <span className="text-amber-600/80">⚲</span>
              <span className="font-chinese text-amber-200/80">{chineseHour}</span>
              <span className="text-gray-500 font-mono text-[10px]">
                {currentTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* 分隔线 */}
            <div className="h-6 w-px bg-amber-700/20 mx-1"></div>

            {/* 模式切换按钮 */}
            <button
              onClick={onToggleMode}
              onMouseEnter={() => setShowTooltip('mode')}
              onMouseLeave={() => setShowTooltip(null)}
              className="relative p-2 rounded-lg hover:bg-white/10 transition-colors group"
            >
              <svg className="w-5 h-5 text-amber-400/80 group-hover:text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {state.sessionMode === 'free' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
              
              {/* Tooltip */}
              {showTooltip === 'mode' && (
                <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-black/90 text-amber-200 text-xs rounded whitespace-nowrap font-chinese border border-amber-700/30 z-50">
                  切换{state.sessionMode === 'free' ? '课堂' : '自由'}模式
                </div>
              )}
            </button>

            {/* 帮助按钮 */}
            <button
              onClick={onShowHelp}
              onMouseEnter={() => setShowTooltip('help')}
              onMouseLeave={() => setShowTooltip(null)}
              className="relative p-2 rounded-lg hover:bg-white/10 transition-colors group"
            >
              <svg className="w-5 h-5 text-amber-400/80 group-hover:text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              
              {showTooltip === 'help' && (
                <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-black/90 text-amber-200 text-xs rounded whitespace-nowrap font-chinese border border-amber-700/30 z-50">
                  使用帮助
                </div>
              )}
            </button>

            {/* 展开更多按钮 */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors lg:hidden"
            >
              <svg 
                className={`w-5 h-5 text-amber-400/80 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* 展开面板（移动端） */}
        {isExpanded && (
          <div className="lg:hidden border-t border-amber-700/20 bg-black/20 p-4 animate-slide-down">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">当前诗人：</span>
                <span className="font-chinese text-amber-200">{poetProfile.nameCN}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">朝代：</span>
                <span className="text-amber-200/80">{poetProfile.dynasty}</span>
              </div>
              {state.sessionMode === 'class' && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">进度：</span>
                    <span className="text-amber-400">{state.questionsCount}/8 问</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">剩余：</span>
                    <span className={state.classTimer < 300 ? 'text-red-400' : 'text-amber-400'}>
                      {formatClassTime(state.classTimer)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 底部装饰阴影 */}
      <div className="h-1 bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </>
  );
};