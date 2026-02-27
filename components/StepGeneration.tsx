import React, { useState } from 'react';
import { SlideContent } from '../types';
import { Loader2, RefreshCw, Download, Maximize2, X } from 'lucide-react';
import jsPDF from 'jspdf';

interface StepGenerationProps {
  slides: SlideContent[];
  onRegenerate: (id: string, refinement?: string) => void;
}

const StepGeneration: React.FC<StepGenerationProps> = ({ slides, onRegenerate }) => {
  const [previewSlide, setPreviewSlide] = useState<SlideContent | null>(null);
  const [refinementText, setRefinementText] = useState('');

  const isAllDone = slides.every(s => !s.isGenerating);

  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1920, 1080] });
    
    slides.forEach((slide, index) => {
      if (index > 0) doc.addPage();
      
      // Background
      if (slide.generatedImageUrl) {
        doc.addImage(slide.generatedImageUrl, 'JPEG', 0, 0, 1920, 1080);
      } else {
        doc.setFillColor(240, 240, 240);
        doc.rect(0, 0, 1920, 1080, 'F');
      }

      // Overlay for readability if needed (simplified)
      // doc.setFillColor(0, 0, 0, 0.3);
      // doc.rect(0, 0, 1920, 1080, 'F');

      // Title
      doc.setFontSize(60);
      doc.setTextColor(255, 255, 255);
      // Note: jsPDF default font doesn't support Chinese well without custom font. 
      // This is a limitation of client-side PDF generation without font files.
      // For this demo, we assume English or basic support, or user accepts it.
      // In a real app, we'd load a font.
      doc.text(slide.title, 100, 200);

      // Bullets
      doc.setFontSize(30);
      slide.bulletPoints.forEach((point, i) => {
        doc.text(`• ${point}`, 100, 350 + (i * 50));
      });
    });

    doc.save('presentation.pdf');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">最终幻灯片生成</h2>
        <p className="text-slate-500">
          {isAllDone ? "制作完成。如不满意，可在下方输入修改要求重新生成。" : "正在按顺序生成高保真幻灯片..."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.map((slide, index) => (
          <div key={slide.id} className="group relative aspect-video bg-slate-100 rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all">
            {slide.generatedImageUrl ? (
              <img src={slide.generatedImageUrl} alt={slide.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                {slide.error ? (
                  <>
                    <span className="text-red-500 mb-2">生成失败</span>
                    <button onClick={() => onRegenerate(slide.id)} className="text-xs underline">重试</button>
                  </>
                ) : (
                  <>
                    <Loader2 className="w-8 h-8 animate-spin mb-2 text-blue-500" />
                    <span className="text-xs">
                      {`正在生成第 ${slide.pageNumber} 页`}
                      <br/>
                      Gemini 正在重绘视觉细节...
                    </span>
                  </>
                )}
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
              <button 
                onClick={() => setPreviewSlide(slide)}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors"
                title="预览"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => {
                  setPreviewSlide(slide);
                  // Open refinement UI in preview
                }}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors"
                title="修改"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white text-sm font-medium truncate">
              {index + 1}. {slide.title}
            </div>
          </div>
        ))}
      </div>

      {isAllDone && (
        <div className="flex justify-center pt-8 pb-12">
          <button
            onClick={handleExportPDF}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all active:scale-95 flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            导出 PDF
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {previewSlide && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <button 
            onClick={() => setPreviewSlide(null)}
            className="absolute top-4 right-4 text-white/50 hover:text-white p-2"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="w-full max-w-5xl space-y-4">
            <div className="aspect-video bg-black rounded-lg overflow-hidden relative shadow-2xl">
              {previewSlide.generatedImageUrl && (
                <img src={previewSlide.generatedImageUrl} alt={previewSlide.title} className="w-full h-full object-contain" />
              )}
              {/* Overlay Text for Preview context */}
              <div className="absolute bottom-8 left-8 right-8 text-white drop-shadow-lg">
                <h2 className="text-4xl font-bold mb-4">{previewSlide.title}</h2>
                <ul className="space-y-2 text-xl">
                  {previewSlide.bulletPoints.map((p, i) => (
                    <li key={i}>• {p}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 flex gap-4">
              <input 
                type="text" 
                placeholder="输入修改要求 (例如: '把背景换成蓝色科技感', '人物换成女性')" 
                className="flex-1 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={refinementText}
                onChange={(e) => setRefinementText(e.target.value)}
              />
              <button 
                onClick={() => {
                  onRegenerate(previewSlide.id, refinementText);
                  setRefinementText('');
                  setPreviewSlide(null);
                }}
                disabled={!refinementText.trim() || previewSlide.isGenerating}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                重新生成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepGeneration;
