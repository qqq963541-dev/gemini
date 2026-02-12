import React, { useEffect, useState, useRef } from 'react';

interface Props {
  type: string | null;
  onComplete: () => void;
}

// 花瓣粒子类型
interface Petal {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
  speedY: number;
  speedX: number;
  rotationSpeed: number;
  color: string;
}

// 墨滴粒子类型
interface InkDrop {
  id: number;
  x: number;
  y: number;
  radius: number;
  opacity: number;
  spreadSpeed: number;
  color: string;
}

const AnimationOverlay: React.FC<Props> = ({ type, onComplete }) => {
  const [visible, setVisible] = useState(false);
  const [petals, setPetals] = useState<Petal[]>([]);
  const [inkDrops, setInkDrops] = useState<InkDrop[]>([]);
  const [mistOpacity, setMistOpacity] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Fix: Added null as initial value for animationRef to satisfy TypeScript's 1-argument requirement
  const animationRef = useRef<number | null>(null);

  // Move animation definitions above useEffect for cleaner scope
  
  // 花瓣动画循环
  const animatePetals = () => {
    setPetals(prev => prev.map(petal => ({
      ...petal,
      y: petal.y + petal.speedY,
      x: petal.x + petal.speedX + Math.sin(petal.y * 0.01) * 0.5,
      rotation: petal.rotation + petal.rotationSpeed,
      opacity: petal.y > window.innerHeight - 100 ? petal.opacity * 0.95 : petal.opacity
    })).filter(petal => petal.y < window.innerHeight + 50 && petal.opacity > 0.01));

    animationRef.current = requestAnimationFrame(animatePetals);
  };

  // 初始化花瓣雨（适用于点赞和胜利）
  const initPetalRain = () => {
    const newPetals: Petal[] = [];
    const colors = ['#ffb7c5', '#ffc0cb', '#dda0dd', '#f0e68c', '#fff0f5'];
    
    for (let i = 0; i < 30; i++) {
      newPetals.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -50 - Math.random() * 200,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.8,
        opacity: 0.6 + Math.random() * 0.4,
        speedY: 1 + Math.random() * 2,
        speedX: (Math.random() - 0.5) * 1.5,
        rotationSpeed: (Math.random() - 0.5) * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    setPetals(newPetals);
    animatePetals();
  };

  // 初始化水墨晕染（适用于关卡切换）
  const initInkSpread = () => {
    const newDrops: InkDrop[] = [];
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        newDrops.push({
          id: Date.now() + i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          radius: 0,
          opacity: 0.8,
          spreadSpeed: 2 + Math.random() * 3,
          color: `rgba(30, 30, 30, ${0.3 + Math.random() * 0.4})`
        });
      }, i * 200);
    }
    setInkDrops(newDrops);
  };

  // 初始化云雾效果
  // Removed unused parameter and updated call to match the call which expects 0 arguments
  const initMistEffect = () => {
    let opacity = 0;
    const fadeIn = setInterval(() => {
      opacity += 0.02;
      setMistOpacity(opacity);
      if (opacity >= 0.6) clearInterval(fadeIn);
    }, 50);
  };

  useEffect(() => {
    if (type) {
      setVisible(true);
      
      // 根据类型初始化不同动画
      if (type === 'thumbsup' || type === 'winner') {
        initPetalRain();
      }
      if (type.startsWith('checkpoint')) {
        initInkSpread();
        // Updated call to match new 0-argument signature
        initMistEffect();
      }

      const timer = setTimeout(() => {
        setVisible(false);
        setPetals([]);
        setInkDrops([]);
        setMistOpacity(0);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        onComplete();
      }, 3500); // 稍微延长以展示完整动画

      return () => {
        clearTimeout(timer);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [type, onComplete]);

  // Canvas水墨绘制
  useEffect(() => {
    if (!canvasRef.current || inkDrops.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animateInk = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      inkDrops.forEach(drop => {
        // 绘制水墨晕染效果
        const gradient = ctx.createRadialGradient(
          drop.x, drop.y, 0,
          drop.x, drop.y, drop.radius
        );
        gradient.addColorStop(0, drop.color.replace(/[\d.]+\)$/, '0.8)'));
        gradient.addColorStop(0.5, drop.color.replace(/[\d.]+\)$/, '0.3)'));
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // 添加不规则边缘
        ctx.beginPath();
        for (let angle = 0; angle < Math.PI * 2; angle += 0.5) {
          const r = drop.radius * (0.8 + Math.random() * 0.4);
          const x = drop.x + Math.cos(angle) * r;
          const y = drop.y + Math.sin(angle) * r;
          if (angle === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = drop.color.replace(/[\d.]+\)$/, '0.1)');
        ctx.fill();
      });

      // 更新墨滴大小
      setInkDrops(prev => prev.map(drop => ({
        ...drop,
        radius: drop.radius + drop.spreadSpeed,
        opacity: drop.opacity * 0.995
      })).filter(drop => drop.radius < 400 && drop.opacity > 0.01));

      if (inkDrops.length > 0) {
        animationRef.current = requestAnimationFrame(animateInk);
      }
    };

    animateInk();
  }, [inkDrops]);

  if (!type || !visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden">
      
      {/* 背景层 - 根据类型切换 */}
      <div className={`absolute inset-0 transition-all duration-1000 ${
        type === 'thumbsup' ? 'bg-gradient-to-br from-amber-50/90 via-orange-50/80 to-red-50/90' :
        type === 'winner' ? 'bg-gradient-to-br from-amber-900/90 via-orange-800/85 to-red-900/90' :
        'bg-gradient-to-br from-slate-800/95 via-gray-800/90 to-zinc-900/95'
      }`}>
        {/* 纹理叠加 */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-30"></div>
      </div>

      {/* Canvas水墨层 */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: 'multiply' }}
      />

      {/* 云雾层 */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{ 
          opacity: mistOpacity,
          background: 'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 50%, rgba(200,200,200,0.2) 0%, transparent 50%)'
        }}
      />

      {/* 花瓣层 */}
      {petals.map(petal => (
        <div
          key={petal.id}
          className="absolute pointer-events-none"
          style={{
            left: petal.x,
            top: petal.y,
            transform: `rotate(${petal.rotation}deg) scale(${petal.scale})`,
            opacity: petal.opacity,
            transition: 'none'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={petal.color}>
            <path d="M12 2C12 2 14 6 14 10C14 14 12 18 12 18C12 18 10 14 10 10C10 6 12 2 12 2Z" />
            <path d="M12 18C12 18 16 16 20 16C20 16 16 20 12 22C12 22 8 20 4 16C4 16 8 16 12 18Z" opacity="0.7" />
          </svg>
        </div>
      ))}

      {/* 主要内容层 */}
      <div className="relative animate-ink">
        
        {/* Type: ThumbsUp - 优化版"妙"字印章 */}
        {type === 'thumbsup' && (
          <div className="flex flex-col items-center animate-bounce-in">
            <div className="relative">
              {/* 外发光效果 */}
              <div className="absolute inset-0 w-40 h-40 bg-red-500/20 blur-3xl rounded-full animate-pulse"></div>
              
              {/* 印章主体 */}
              <div className="relative w-40 h-40 border-[8px] border-red-700 flex items-center justify-center transform rotate-[-8deg] bg-gradient-to-br from-white/95 to-red-50/90 shadow-[0_20px_60px_rgba(180,30,30,0.4)] overflow-hidden">
                {/* 纹理 */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-30"></div>
                
                {/* 边框装饰 */}
                <div className="absolute inset-2 border-2 border-red-600/30"></div>
                
                {/* "妙"字 */}
                <span className="font-calligraphy text-8xl text-red-700 drop-shadow-[0_4px_8px_rgba(180,30,30,0.3)] select-none relative z-10 animate-stamp">
                  妙
                </span>
                
                {/* 角落装饰 */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-red-600/40"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-red-600/40"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-red-600/40"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-red-600/40"></div>
              </div>
              
              {/* 飘落的墨点 */}
              <div className="absolute -top-6 -right-6 text-3xl animate-float-slow">✨</div>
              <div className="absolute -bottom-4 -left-4 text-4xl animate-float">🍶</div>
              <div className="absolute top-1/2 -right-8 text-2xl animate-float-delayed">🌸</div>
            </div>
            
            {/* 文案 */}
            <div className="mt-8 relative">
              <div className="bg-gradient-to-r from-black/80 via-black/70 to-black/80 text-amber-200 px-8 py-3 rounded-sm font-chinese text-2xl backdrop-blur-md shadow-2xl border border-amber-500/30 animate-fade-up">
                <span className="tracking-[0.5em]">锦绣文章，字字珠玑</span>
              </div>
              {/* 装饰线 */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"></div>
            </div>
          </div>
        )}

        {/* Winner - 功德圆满 */}
        {type === 'winner' && (
          <div className="flex flex-col items-center animate-scale-in">
            {/* 光环效果 */}
            <div className="absolute w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
            
            {/* 主图标容器 */}
            <div className="relative w-64 h-64 animate-float-gentle">
              {/* 外圈旋转 */}
              <div className="absolute inset-0 border-4 border-amber-400/30 rounded-full animate-spin-slow"></div>
              <div className="absolute inset-4 border-2 border-amber-300/20 rounded-full animate-spin-reverse"></div>
              
              {/* 中心内容 */}
              <div className="absolute inset-8 bg-gradient-to-br from-amber-100/95 to-orange-50/90 rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(251,191,36,0.5)] border-4 border-amber-500/30">
                <span className="text-9xl animate-bounce-gentle">🏮</span>
              </div>
              
              {/* 漂浮的装饰 */}
              <div className="absolute -top-4 left-1/2 text-3xl animate-float">📜</div>
              <div className="absolute -bottom-4 left-1/4 text-2xl animate-float-delayed">✨</div>
              <div className="absolute -bottom-4 right-1/4 text-2xl animate-float-slow">🎋</div>
            </div>
            
            {/* 标题 */}
            <h2 className="mt-12 font-calligraphy text-7xl text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] tracking-[0.3em] animate-fade-up">
              功德圆满
            </h2>
            
            {/* 副标题 */}
            <p className="mt-6 font-chinese text-2xl text-amber-200/90 tracking-widest animate-fade-up-delayed">
              访古之行，获益良多
            </p>
            
            {/* 底部装饰 */}
            <div className="mt-8 flex items-center gap-4 animate-fade-up-delayed">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-400/60"></div>
              <span className="text-amber-400/60 text-sm">◆</span>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-400/60"></div>
            </div>
          </div>
        )}

        {/* Checkpoint - 关卡切换 */}
        {type?.startsWith('checkpoint') && (
          <div className="flex flex-col items-center animate-fade-scale">
            {/* 水墨晕染背景 */}
            <div className="absolute inset-0 bg-gradient-radial from-slate-700/50 via-slate-800/30 to-transparent blur-2xl"></div>
            
            {/* 卷轴效果 */}
            <div className="relative">
              {/* 卷轴顶部 */}
              <div className="w-80 h-8 bg-gradient-to-b from-amber-700 to-amber-800 rounded-t-lg shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-50"></div>
                {/* 轴头 */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-10 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full shadow-md"></div>
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-10 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full shadow-md"></div>
              </div>
              
              {/* 卷轴内容 */}
              <div className="w-80 h-96 bg-gradient-to-b from-amber-50/95 to-amber-100/90 relative overflow-hidden shadow-2xl">
                {/* 纸张纹理 */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-40"></div>
                
                {/* 内容 */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
                  <div className="w-24 h-24 rounded-full bg-slate-700/10 flex items-center justify-center mb-6 animate-pulse-slow">
                    <span className="text-6xl">📜</span>
                  </div>
                  
                  <h2 className="font-calligraphy text-5xl text-slate-800 mb-4 tracking-widest">
                    登高远眺
                  </h2>
                  
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-400/50 to-transparent my-4"></div>
                  
                  <p className="font-chinese text-xl text-slate-600 text-center leading-relaxed">
                    欲穷千里目<br/>
                    <span className="text-slate-400">更上一层楼</span>
                  </p>
                  
                  {/* 印章 */}
                  <div className="mt-6 w-16 h-16 border-4 border-red-700/80 rounded-sm flex items-center justify-center transform rotate-12 opacity-80">
                    <span className="font-calligraphy text-2xl text-red-700">通关</span>
                  </div>
                </div>
                
                {/* 水墨装饰 */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-800/20 to-transparent"></div>
              </div>
              
              {/* 卷轴底部 */}
              <div className="w-80 h-8 bg-gradient-to-b from-amber-800 to-amber-700 rounded-b-lg shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-50"></div>
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-10 bg-gradient-to-b from-amber-800 to-amber-600 rounded-full shadow-md"></div>
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-10 bg-gradient-to-b from-amber-800 to-amber-600 rounded-full shadow-md"></div>
              </div>
            </div>
            
            {/* 进度提示 */}
            <div className="mt-8 text-slate-300/80 font-chinese text-lg tracking-widest animate-fade-up">
              {type === 'checkpoint-1' && '初入诗境 · 缘起'}
              {type === 'checkpoint-2' && '渐入佳境 · 探幽'}
              {type === 'checkpoint-3' && '登峰造极 · 悟道'}
              {type === 'checkpoint-4' && '返璞归真 · 圆满'}
            </div>
          </div>
        )}

      </div>

      {/* 全局CSS动画定义 */}
      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes stamp {
          0% { transform: scale(2); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fade-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fade-up-delayed {
          0% { transform: translateY(20px); opacity: 0; }
          30% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fade-scale {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        
        .animate-bounce-in { animation: bounce-in 0.6s ease-out; }
        .animate-stamp { animation: stamp 0.4s ease-out; }
        .animate-fade-up { animation: fade-up 0.8s ease-out; }
        .animate-fade-up-delayed { animation: fade-up-delayed 1s ease-out; }
        .animate-scale-in { animation: scale-in 0.5s ease-out; }
        .animate-fade-scale { animation: fade-scale 0.6s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 3.5s ease-in-out infinite 0.5s; }
        .animate-float-gentle { animation: float-gentle 4s ease-in-out infinite; }
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 15s linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default AnimationOverlay;