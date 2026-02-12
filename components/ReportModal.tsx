import React, { useState, useRef } from 'react';
import { ReportData, PoetProfile } from '../types';
import { POET_PROFILES } from '../constants';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, BorderStyle } from 'docx';

interface Props {
  data: ReportData | null;
  onClose: () => void;
}

// 导出格式选项
type ExportFormat = 'pdf' | 'word' | 'image';

// 报告模板配置
const REPORT_TEMPLATES = {
  classic: {
    name: '经典卷轴',
    bgColor: '#fdfbf7',
    borderColor: '#8c2a2a',
    accentColor: '#d4af37',
    font: 'traditional'
  },
  ink: {
    name: '水墨山水',
    bgColor: '#f5f5f0',
    borderColor: '#2c3e50',
    accentColor: '#34495e',
    font: 'ink'
  },
  gold: {
    name: '金榜题名',
    bgColor: '#fff8e1',
    borderColor: '#b8860b',
    accentColor: '#daa520',
    font: 'gold'
  }
};

export const ReportModal: React.FC<Props> = ({ data, onClose }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof REPORT_TEMPLATES>('classic');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  if (!data) return null;

  const template = REPORT_TEMPLATES[selectedTemplate];
  const poetProfile = POET_PROFILES[data.poetId];

  // ==================== 导出功能 ====================

  // 导出PDF
  const exportToPDF = async () => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      const element = reportRef.current;
      if (!element) return;

      // 生成高清Canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: template.bgColor,
        onclone: (clonedDoc) => {
          // 确保克隆的文档样式正确
          const clonedElement = clonedDoc.body.querySelector('[data-report-content]');
          if (clonedElement) {
            (clonedElement as HTMLElement).style.transform = 'none';
            (clonedElement as HTMLElement).style.maxHeight = 'none';
          }
        }
      });

      setExportProgress(50);

      // 创建PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      let imgY = 10;
      let scaledHeight = imgHeight * ratio;

      // 如果内容超过一页，分页处理
      let heightLeft = scaledHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - scaledHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
        heightLeft -= pdfHeight;
      }

      setExportProgress(80);

      // 添加元数据
      pdf.setProperties({
        title: `跨时空专访 - ${poetProfile.nameCN}`,
        subject: `与${poetProfile.nameCN}的英语对话记录`,
        author: '古今笔谈',
        keywords: '跨时空对话,英语专访,古诗词',
        creator: '古今笔谈 AI'
      });

      // 保存文件
      const dateStr = new Date().toISOString().split('T')[0];
      pdf.save(`专访实录_${poetProfile.nameCN}_${dateStr}.pdf`);

      setExportProgress(100);
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 500);

    } catch (error) {
      console.error('PDF导出失败:', error);
      alert('导出失败，请重试');
      setIsExporting(false);
    }
  };

  // 导出Word
  const exportToWord = async () => {
    setIsExporting(true);
    setExportProgress(30);

    try {
      // 构建对话内容
      const dialogueParagraphs = data.dialogueHistory.map((msg, index) => {
        const isUser = msg.sender === 'user';
        return new Paragraph({
          children: [
            new TextRun({
              text: isUser ? '【问】' : `【${poetProfile.nameCN}】`,
              bold: true,
              color: isUser ? '2c3e50' : '8c2a2a',
              size: 24,
              font: 'SimSun'
            }),
            new TextRun({
              text: msg.text,
              size: 24,
              font: 'SimSun'
            })
          ],
          spacing: { after: 200, line: 360 },
          border: isUser ? {
            left: {
              color: '2c3e50',
              space: 10,
              style: BorderStyle.SINGLE,
              size: 12
            }
          } : undefined
        });
      });

      setExportProgress(60);

      // 创建文档
      const doc = new Document({
        sections: [{
          properties: {
            page: {
              margin: {
                top: 1440, // 1 inch
                right: 1440,
                bottom: 1440,
                left: 1440
              }
            }
          },
          children: [
            // 标题
            new Paragraph({
              text: '跨时空专访实录',
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),
            
            // 诗人信息
            new Paragraph({
              children: [
                new TextRun({
                  text: `受访诗人：${poetProfile.nameCN}（${poetProfile.nameEN}）`,
                  bold: true,
                  size: 28,
                  font: 'SimSun'
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: `${poetProfile.dynasty} · ${poetProfile.title}`,
                  size: 24,
                  color: '666666',
                  font: 'SimSun'
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),

            // 分隔线
            new Paragraph({
              border: {
                bottom: {
                  color: '8c2a2a',
                  space: 1,
                  style: BorderStyle.SINGLE,
                  size: 12
                }
              },
              spacing: { after: 400 }
            }),

            // 评估信息
            new Paragraph({
              children: [
                new TextRun({
                  text: `文才评估：${data.starStats.total} 星`,
                  bold: true,
                  size: 24,
                  font: 'SimSun'
                })
              ],
              spacing: { after: 200 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `对话轮次：${data.dialogueHistory.length} 轮`,
                  size: 22,
                  font: 'SimSun'
                })
              ],
              spacing: { after: 400 }
            }),

            // 对话标题
            new Paragraph({
              text: '【对话实录】',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),

            // 对话内容
            ...dialogueParagraphs,

            // 分隔
            new Paragraph({ spacing: { before: 400 } }),

            // 历史知识点
            new Paragraph({
              text: '【历史知识点】',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),

            ...data.historicalFacts.map(fact => new Paragraph({
              children: [
                new TextRun({
                  text: '• ',
                  size: 24
                }),
                new TextRun({
                  text: fact,
                  size: 22,
                  font: 'SimSun'
                })
              ],
              spacing: { after: 120 }
            })),

            // 语法笔记
            new Paragraph({
              text: '【语法锦囊】',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),

            ...(data.englishNotes.length > 0 
              ? data.englishNotes.map(note => new Paragraph({
                  children: [
                    new TextRun({
                      text: '✒️ ',
                      size: 22
                    }),
                    new TextRun({
                      text: note,
                      size: 22,
                      font: 'SimSun'
                    })
                  ],
                  spacing: { after: 120 }
                }))
              : [new Paragraph({
                  children: [
                    new TextRun({
                      text: '暂无重点笔记记录',
                      italics: true,
                      color: '999999'
                    })
                  ]
                })]
            ),

            // 页脚
            new Paragraph({
              spacing: { before: 800 }
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: '—— 后昆之鉴，以此为记 ——',
                  italics: true,
                  color: '999999',
                  size: 20
                })
              ]
            })
          ]
        }]
      });

      setExportProgress(80);

      // 生成并下载
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const dateStr = new Date().toISOString().split('T')[0];
      link.download = `专访实录_${poetProfile.nameCN}_${dateStr}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportProgress(100);
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 500);

    } catch (error) {
      console.error('Word导出失败:', error);
      alert('导出失败，请重试');
      setIsExporting(false);
    }
  };

  // 导出图片
  const exportToImage = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      const element = reportRef.current;
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: template.bgColor
      });

      setExportProgress(70);

      const link = document.createElement('a');
      link.download = `专访实录_${poetProfile.nameCN}_${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();

      setExportProgress(100);
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 500);

    } catch (error) {
      console.error('图片导出失败:', error);
      alert('导出失败，请重试');
      setIsExporting(false);
    }
  };

  const handleExport = (format: ExportFormat) => {
    switch (format) {
      case 'pdf': exportToPDF(); break;
      case 'word': exportToWord(); break;
      case 'image': exportToImage(); break;
    }
  };

  // ==================== 渲染 ====================

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 backdrop-blur-2xl p-4 animate-fade-in">
      
      {/* 模板选择器 */}
      <div className="absolute top-6 left-6 flex gap-3">
        {Object.entries(REPORT_TEMPLATES).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setSelectedTemplate(key as keyof typeof REPORT_TEMPLATES)}
            className={`
              px-4 py-2 rounded-sm border-2 transition-all font-chinese text-sm
              ${selectedTemplate === key 
                ? 'bg-white/20 border-white text-white' 
                : 'bg-transparent border-white/30 text-white/60 hover:border-white/60'}
            `}
          >
            {config.name}
          </button>
        ))}
      </div>

      {/* 主报告容器 */}
      <div 
        ref={reportRef}
        data-report-content
        className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] flex flex-col border-x-[24px] rounded-sm"
        style={{ 
          backgroundColor: template.bgColor,
          borderColor: template.borderColor
        }}
      >
        {/* 装订线 */}
        <div className="absolute top-0 left-0 bottom-0 w-2 flex flex-col justify-between py-10 opacity-40 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-4 h-0.5 bg-black/40 -ml-1"></div>
          ))}
        </div>

        {/* 内容区 */}
        <div className="flex-1 p-12 md:p-16 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')]">
          
          {/* 头部 */}
          <div className="flex justify-between items-start border-b-4 border-double pb-8 mb-10" style={{ borderColor: template.borderColor + '60' }}>
            <div className="flex flex-col gap-2">
              <div className="inline-block border-2 px-6 py-2 bg-white/40 shadow-sm" style={{ borderColor: template.borderColor }}>
                <h1 className="font-calligraphy text-5xl tracking-[0.15em]" style={{ color: template.borderColor }}>
                  访谈实录
                </h1>
              </div>
              <div className="text-xs font-serif-text font-bold tracking-[0.4em] text-gray-400 mt-2 pl-2">
                ARCHIVE OF DIALOGUE
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className="px-3 py-1 bg-red-800 text-white rounded-sm font-chinese text-lg transform rotate-3 shadow-lg">
                {poetProfile.dynasty.replace(/[()]/g, '')}
              </div>
              <div className="font-chinese text-gray-500 text-xs opacity-60">
                卷：第 {String(data.dialogueHistory.length).padStart(2, '0')} 轮
              </div>
            </div>
          </div>

          {/* 诗人信息卡 */}
          <div className="flex gap-6 mb-10 p-6 bg-white/50 rounded-sm border border-black/5">
            <img 
              src={poetProfile.avatar} 
              alt={poetProfile.nameCN}
              className="w-24 h-24 rounded-full object-cover border-4 shadow-lg"
              style={{ borderColor: template.accentColor }}
            />
            <div className="flex-1">
              <h2 className="font-chinese text-3xl mb-1" style={{ color: template.borderColor }}>
                {poetProfile.nameCN}
              </h2>
              <p className="text-sm text-gray-500 mb-2">{poetProfile.nameEN} · {poetProfile.title}</p>
              <p className="text-sm text-gray-600 leading-relaxed font-serif-text">
                {poetProfile.bio}
              </p>
            </div>
          </div>

          {/* 统计网格 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* 评分 */}
            <div className="bg-white/80 p-6 border-2 rounded shadow-lg text-center relative overflow-hidden">
              <div className="absolute top-2 right-2 font-chinese text-4xl opacity-10" style={{ color: template.borderColor }}>
                优
              </div>
              <div className="text-5xl font-bold mb-2 font-calligraphy" style={{ color: template.accentColor }}>
                {data.starStats.total}
              </div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                文才评估
              </div>
              <div className="flex justify-center mt-3 gap-1">
                {Array.from({ length: Math.min(5, Math.ceil(data.starStats.average)) }).map((_, i) => (
                  <span key={i} className="text-xl">⭐</span>
                ))}
              </div>
            </div>

            {/* 对话统计 */}
            <div className="bg-white/80 p-6 border-2 rounded shadow-lg text-center">
              <div className="text-5xl font-bold mb-2 font-calligraphy text-gray-700">
                {data.dialogueHistory.length}
              </div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                对话轮次
              </div>
              <div className="mt-3 text-xs text-gray-500">
                {data.dialogueHistory.filter(m => m.sender === 'user').length} 问 · {data.dialogueHistory.filter(m => m.sender === 'poet').length} 答
              </div>
            </div>

            {/* 收藏佳句 */}
            <div className="bg-white/80 p-6 border-2 rounded shadow-lg text-center">
              <div className="text-5xl font-bold mb-2 font-calligraphy text-gray-700">
                {data.brilliantSentences.length}
              </div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                收藏佳句
              </div>
              <div className="mt-3 text-xs text-gray-500">
                文翰摘珠
              </div>
            </div>
          </div>

          {/* 对话实录 */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <h3 className="font-chinese text-2xl" style={{ color: template.borderColor }}>对话实录</h3>
              <div className="flex-1 h-px bg-black/10"></div>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {data.dialogueHistory.map((msg, index) => (
                <div 
                  key={msg.id}
                  className={`
                    p-4 rounded-sm border-l-4 bg-white/60
                    ${msg.sender === 'user' 
                      ? 'ml-8 border-gray-400' 
                      : 'mr-8 border-red-800'}
                  `}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`
                      text-xs font-bold px-2 py-0.5 rounded-sm
                      ${msg.sender === 'user' 
                        ? 'bg-gray-200 text-gray-700' 
                        : 'bg-red-100 text-red-800'}
                    `}>
                      {msg.sender === 'user' ? '访者' : poetProfile.nameCN}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(msg.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-gray-800 leading-relaxed font-serif-text">
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 知识点与笔记 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 历史知识点 */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <h3 className="font-chinese text-xl" style={{ color: template.borderColor }}>历史知识点</h3>
                <div className="flex-1 h-px bg-black/10"></div>
              </div>
              <div className="space-y-3">
                {data.historicalFacts.map((fact, i) => (
                  <div key={i} className="flex gap-3 text-sm bg-white/60 p-3 rounded-sm border-l-2 border-amber-600/30">
                    <span className="text-amber-600 font-bold">◆</span>
                    <span className="text-gray-700 leading-relaxed">{fact}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 语法笔记 */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <h3 className="font-chinese text-xl" style={{ color: template.borderColor }}>语法锦囊</h3>
                <div className="flex-1 h-px bg-black/10"></div>
              </div>
              <div className="bg-[#fdf2f2]/50 p-4 rounded-sm border border-red-900/10">
                {data.englishNotes.length > 0 ? (
                  <div className="space-y-3">
                    {data.englishNotes.map((note, i) => (
                      <div key={i} className="flex gap-2 text-sm text-gray-700">
                        <span className="text-red-800/60 font-bold text-lg">✒️</span>
                        <span className="leading-relaxed">{note}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic text-center py-4">暂无重点笔记记录</p>
                )}
              </div>
            </div>
          </div>

          {/* 底部印章 */}
          <div className="mt-12 flex flex-col items-center">
            <div 
              className="w-32 h-32 border-4 border-double rounded-full flex flex-col items-center justify-center transform rotate-[-5deg] shadow-xl bg-white/80"
              style={{ color: template.borderColor, borderColor: template.borderColor }}
            >
              <span className="font-calligraphy text-4xl font-bold tracking-widest mb-1">精进</span>
              <div className="h-px w-16 bg-current mb-1"></div>
              <span className="font-serif-text text-[8px] uppercase tracking-tighter font-bold">Imperial Certified</span>
            </div>
            <p className="font-chinese text-gray-400 text-sm mt-6 tracking-widest italic opacity-60">
              —— 后昆之鉴，以此为记 ——
            </p>
          </div>
        </div>

        {/* 页脚 */}
        <div className="h-16 flex items-center justify-center bg-black/5 border-t border-black/10 px-10">
          <div className="font-chinese text-xs text-gray-400 tracking-widest">
            第 零壹 卷 · 共 {Math.ceil(data.dialogueHistory.length / 10)} 页
          </div>
        </div>
      </div>

      {/* 导出控制面板 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black/60 backdrop-blur-md px-8 py-4 rounded-full border border-white/10">
        
        {/* 关闭按钮 */}
        <button 
          onClick={onClose}
          className="font-chinese text-white/60 hover:text-white transition-colors text-sm tracking-widest"
        >
          关闭
        </button>

        <div className="w-px h-6 bg-white/20"></div>

        {/* 导出选项 */}
        <div className="flex gap-3">
          <ExportButton 
            icon="📄" 
            label="PDF" 
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            color="#e74c3c"
          />
          <ExportButton 
            icon="📝" 
            label="Word" 
            onClick={() => handleExport('word')}
            disabled={isExporting}
            color="#2b579a"
          />
          <ExportButton 
            icon="🖼️" 
            label="图片" 
            onClick={() => handleExport('image')}
            disabled={isExporting}
            color="#27ae60"
          />
        </div>
      </div>

      {/* 导出进度遮罩 */}
      {isExporting && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-white/10 p-8 rounded-lg border border-white/20 text-center">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white font-chinese text-lg mb-2">正在装裱画卷...</p>
            <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-400 transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              ></div>
            </div>
            <p className="text-white/60 text-sm mt-2">{exportProgress}%</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.2);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

// 导出按钮组件
interface ExportButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
  disabled: boolean;
  color: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ icon, label, onClick, disabled, color }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      flex items-center gap-2 px-5 py-2.5 rounded-full transition-all
      ${disabled 
        ? 'opacity-50 cursor-not-allowed bg-white/10' 
        : 'hover:scale-105 active:scale-95 bg-white/10 hover:bg-white/20'}
    `}
    style={{ 
      boxShadow: disabled ? 'none' : `0 4px 15px ${color}40`,
      border: `1px solid ${color}60`
    }}
  >
    <span className="text-lg">{icon}</span>
    <span className="text-white font-chinese text-sm tracking-wider">导出{label}</span>
  </button>
);