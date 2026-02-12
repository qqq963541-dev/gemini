
import React, { useState, useEffect } from 'react';
import { PoetId, PoetProfile } from '../types';
import { POET_PROFILES } from '../constants';

interface Props {
  currentPoet: PoetId;
  onSelect: (id: PoetId) => void;
}

const POET_SEALS: Record<PoetId, { character: string; color: string }> = {
  libai: { character: '仙', color: '#d4af37' },
  dufu: { character: '圣', color: '#8b4513' },
  liqingzhao: { character: '词', color: '#c2185b' },
  shakespeare: { character: '剧', color: '#6d4c41' },
  tolstoy: { character: '哲', color: '#263238' },
  hugo: { character: '雄', color: '#1a237e' },
};

export const PoetSelector: React.FC<Props> = ({ currentPoet, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [regionFilter, setRegionFilter] = useState<'East' | 'West'>('East');
  const [showTransition, setShowTransition] = useState<PoetId | null>(null);

  const handleSelect = (id: PoetId) => {
    if (id === currentPoet) {
      setIsOpen(false);
      return;
    }
    setIsOpen(false);
    setShowTransition(id);
    setTimeout(() => {
      onSelect(id);
      setShowTransition(null);
    }, 3500);
  };

  const poets = Object.values(POET_PROFILES).filter(p => p.region === regionFilter);
  const currentSeal = POET_SEALS[currentPoet];

  return (
    <>
      <div className="fixed top-24 right-8 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="group relative w-24 h-24 transition-all duration-500 hover:scale-110"
        >
          <div className="absolute inset-0 rounded-sm blur-xl opacity-40" style={{ background: currentSeal.color }}></div>
          <div className="relative w-full h-full bg-[#1a0f0a] rounded-sm border-4 border-[#8d6e63] shadow-lg flex flex-col items-center justify-center">
            <span className="font-calligraphy text-4xl font-bold" style={{ color: currentSeal.color }}>
              {currentSeal.character}
            </span>
            <span className="text-[9px] text-[#8d6e63]/60 uppercase tracking-widest mt-1">文库</span>
          </div>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-gradient-to-b from-[#f5f0e8] via-[#e8e0d0] to-[#f5f0e8] w-[450px] p-8 shadow-2xl rounded-sm border-x-[16px] border-[#5d4037]">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-40"></div>
            
            {/* 分类切换 */}
            <div className="relative z-10 flex gap-4 mb-8 justify-center">
              <button 
                onClick={() => setRegionFilter('East')}
                className={`px-6 py-2 rounded-full font-chinese text-xl border-2 transition-all ${regionFilter === 'East' ? 'bg-amber-900 text-white border-amber-950 shadow-md' : 'bg-white/50 text-amber-900 border-amber-200'}`}
              >
                东方文豪
              </button>
              <button 
                onClick={() => setRegionFilter('West')}
                className={`px-6 py-2 rounded-full font-chinese text-xl border-2 transition-all ${regionFilter === 'West' ? 'bg-amber-900 text-white border-amber-950 shadow-md' : 'bg-white/50 text-amber-900 border-amber-200'}`}
              >
                西方巨匠
              </button>
            </div>

            <div className="relative z-10 space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {poets.map((poet) => (
                <button
                  key={poet.id}
                  onClick={() => handleSelect(poet.id)}
                  className={`relative w-full flex items-center gap-5 p-4 rounded-lg border-2 transition-all ${currentPoet === poet.id ? 'border-amber-600 bg-amber-50/50' : 'border-transparent hover:bg-black/5'}`}
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-700 shadow-md">
                    <img src={poet.avatar} alt={poet.nameCN} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-chinese text-2xl text-amber-900">{poet.nameCN}</h4>
                    <p className="text-xs text-gray-500 font-serif-text">{poet.dynasty} · {poet.styleDescription}</p>
                  </div>
                </button>
              ))}
            </div>

            <button onClick={() => setIsOpen(false)} className="absolute -top-12 right-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all">&times;</button>
          </div>
        </div>
      )}

      {showTransition && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0505] animate-fade-in">
           <div className="text-center">
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-amber-600 shadow-2xl mx-auto mb-8 animate-ink-bloom">
                <img src={POET_PROFILES[showTransition].avatar} className="w-full h-full object-cover" />
              </div>
              <h2 className="font-calligraphy text-7xl text-amber-200 tracking-widest animate-pulse">
                {POET_PROFILES[showTransition].nameCN}
              </h2>
              <p className="text-amber-100/40 text-2xl mt-4 italic">跨越时空的笔谈...</p>
           </div>
        </div>
      )}
    </>
  );
};
