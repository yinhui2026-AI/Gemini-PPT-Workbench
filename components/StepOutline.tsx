import React from 'react';
import { SlideContent } from '../types';
import { Loader2, CheckCircle2, ChevronRight, Edit3 } from 'lucide-react';

interface StepOutlineProps {
  slides: SlideContent[];
  onUpdateSlide: (id: string, updates: Partial<SlideContent>) => void;
  onNext: () => void;
  isLoading: boolean;
}

const StepOutline: React.FC<StepOutlineProps> = ({ slides, onUpdateSlide, onNext, isLoading }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">审核深度大纲</h2>
        <p className="text-slate-500">Gemini 3 Pro 已为您提取了核心论点和数据细节。</p>
      </div>

      <div className="space-y-4">
        {slides.map((slide, index) => (
          <div key={slide.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1 space-y-3">
                <input
                  value={slide.title}
                  onChange={(e) => onUpdateSlide(slide.id, { title: e.target.value })}
                  className="w-full font-bold text-lg text-slate-800 border-b border-transparent hover:border-slate-200 focus:border-blue-500 focus:outline-none bg-transparent transition-colors pb-1"
                  placeholder="幻灯片标题"
                />
                <div className="space-y-2">
                  {slide.bulletPoints.map((point, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0"></div>
                      <textarea
                        value={point}
                        onChange={(e) => {
                          const newPoints = [...slide.bulletPoints];
                          newPoints[i] = e.target.value;
                          onUpdateSlide(slide.id, { bulletPoints: newPoints });
                        }}
                        className="w-full text-slate-600 text-sm border border-transparent hover:border-slate-200 focus:border-blue-500 focus:outline-none bg-transparent rounded p-1 resize-none overflow-hidden"
                        rows={1}
                        style={{ minHeight: '1.5rem', height: 'auto' }}
                        onInput={(e) => {
                          e.currentTarget.style.height = 'auto';
                          e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="pt-2">
                   <div className="text-xs font-mono text-slate-400 bg-slate-50 p-2 rounded border border-slate-100">
                      <span className="font-semibold text-slate-500">Visual Prompt:</span> {slide.visualPrompt}
                   </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-4 pb-12">
        <button
          onClick={onNext}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              正在生成幻灯片...
            </>
          ) : (
            <>
              确认大纲并生成
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StepOutline;
