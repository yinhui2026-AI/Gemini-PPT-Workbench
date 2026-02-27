import React, { useState, useRef } from 'react';
import { GenerationConfig, SlideStyle } from '../types';
import { STYLES, MIN_SLIDES, MAX_SLIDES } from '../constants';
import { Upload, FileText, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';

interface StepInputProps {
  onNext: (config: GenerationConfig) => void;
  isLoading: boolean;
}

const StepInput: React.FC<StepInputProps> = ({ onNext, isLoading }) => {
  const [sourceText, setSourceText] = useState('');
  const [slideCount, setSlideCount] = useState(8);
  const [selectedStyle, setSelectedStyle] = useState<SlideStyle>(SlideStyle.PROFESSIONAL);
  const [userImage, setUserImage] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!sourceText.trim()) return;
    onNext({
      sourceText,
      slideCount,
      style: selectedStyle,
      userImage
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">AI PPT 工作台 Portrait AI版</h1>
        <p className="text-slate-500">支持上传照片，将您本人应用在专业幻灯片中。</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <FileText className="w-4 h-4" />
            文字素材
          </label>
          <textarea
            className="w-full h-40 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-700 placeholder:text-slate-400"
            placeholder="请输入您的演讲内容、文章、报告或大纲..."
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              幻灯片页数: {slideCount}
            </label>
            <input
              type="range"
              min={MIN_SLIDES}
              max={MAX_SLIDES}
              value={slideCount}
              onChange={(e) => setSlideCount(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>{MIN_SLIDES}页</span>
              <span>{MAX_SLIDES}页</span>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <ImageIcon className="w-4 h-4" />
              演讲者/主角照片 (可选)
            </label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors h-[88px]"
            >
              {userImage ? (
                <div className="flex items-center gap-3">
                  <img src={userImage} alt="User" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                  <span className="text-sm text-slate-600">点击更换照片</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-slate-400">
                  <Upload className="w-5 h-5" />
                  <span className="text-xs">点击上传照片</span>
                </div>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            设计风格
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {STYLES.map((style) => (
              <div
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`
                  cursor-pointer rounded-xl p-3 border-2 transition-all
                  ${selectedStyle === style.id 
                    ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100 ring-offset-2' 
                    : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'}
                `}
              >
                <div className={`h-12 rounded-lg mb-2 ${style.previewColor} shadow-inner`}></div>
                <div className="font-medium text-sm text-slate-900">{style.name}</div>
                <div className="text-xs text-slate-500 line-clamp-2 mt-1">{style.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={handleSubmit}
            disabled={!sourceText.trim() || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.99] flex items-center justify-center gap-2 text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                正在解析内容...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                生成大纲
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepInput;
