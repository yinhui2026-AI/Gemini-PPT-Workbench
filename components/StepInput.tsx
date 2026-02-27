import React, { useState, useRef } from 'react';
import { GenerationConfig, SlideStyle } from '../types';
import { STYLES, MIN_SLIDES, MAX_SLIDES } from '../constants';
import { Upload, FileText, User, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
// import * as mammoth from 'mammoth'; // Temporarily disabled

interface StepInputProps {
  onNext: (config: GenerationConfig) => void;
  isLoading: boolean;
}

const StepInput: React.FC<StepInputProps> = ({ onNext, isLoading }) => {
  const [sourceText, setSourceText] = useState('');
  const [slideCount, setSlideCount] = useState(8);
  const [selectedStyle, setSelectedStyle] = useState<SlideStyle>(SlideStyle.PROFESSIONAL);
  const [userImage, setUserImage] = useState<string | undefined>(undefined);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'text/plain' || file.name.endsWith('.md')) {
      const text = await file.text();
      setSourceText(text);
    } else if (file.name.endsWith('.docx')) {
      alert("DOCX parsing is temporarily disabled.");
      /*
      try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setSourceText(result.value);
      } catch (error) {
        console.error("Failed to parse docx", error);
        alert("无法解析该文档，请尝试复制粘贴内容。");
      }
      */
    } else {
      alert("目前支持 .txt, .md 格式。");
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
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 md:p-6">
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 flex items-center justify-center gap-3">
          AI PPT 工作台
          <span className="text-xs bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full font-semibold tracking-wide">Portrait AI版</span>
        </h1>
        <p className="text-slate-500 text-base md:text-lg">支持上传照片，将您本人应用在专业幻灯片中。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
           {/* Text Material Card */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-[500px] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                 <label className="flex items-center gap-2 text-lg font-bold text-slate-800">
                    <FileText className="w-5 h-5" />
                    文字素材
                 </label>
                 <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors hover:bg-blue-50 px-3 py-1.5 rounded-lg"
                 >
                    <Upload className="w-4 h-4" />
                    上传素材
                 </button>
                 <input 
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.md,.docx"
                    className="hidden"
                    onChange={handleFileUpload}
                 />
              </div>
              <textarea
                className="w-full flex-1 p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-700 placeholder:text-slate-400 text-base leading-relaxed"
                placeholder="粘贴您的报告内容..."
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
              />
           </div>

           {/* Portrait Card */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <label className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4">
                 <User className="w-5 h-5" />
                 人像照片 (可选)
              </label>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                 <div 
                    onClick={() => imageInputRef.current?.click()}
                    className="w-32 h-32 flex-shrink-0 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all text-slate-400 hover:text-blue-500 relative overflow-hidden group"
                 >
                    {userImage ? (
                      <>
                        <img src={userImage} alt="User" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs">
                          更换照片
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 mb-2" />
                        <span className="text-xs">上传职业照</span>
                      </>
                    )}
                    <input 
                      ref={imageInputRef}
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload}
                    />
                 </div>
                 <p className="text-slate-500 text-sm leading-relaxed pt-2 max-w-md">
                    上传您的个人照片，AI 将根据幻灯片主题，将您的形象融合到 PPT 页面中（例如作为主讲人）。
                 </p>
              </div>
           </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col sticky top-6">
              {/* Slide Count */}
              <div className="mb-8">
                 <div className="flex justify-between items-center mb-4">
                   <label className="text-sm font-bold text-slate-700">
                      生成页数: {slideCount} 页
                   </label>
                 </div>
                 <input
                    type="range"
                    min={MIN_SLIDES}
                    max={MAX_SLIDES}
                    value={slideCount}
                    onChange={(e) => setSlideCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                 />
                 <div className="flex justify-between text-xs text-slate-400 mt-2">
                    <span>{MIN_SLIDES}</span>
                    <span>{MAX_SLIDES}</span>
                 </div>
              </div>

              {/* Styles */}
              <div className="flex-1 mb-8">
                 <label className="block text-sm font-bold text-slate-700 mb-4">
                    视觉风格
                 </label>
                 <div className="space-y-3">
                    {STYLES.map((style) => (
                      <div
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`
                          cursor-pointer rounded-xl p-3 border transition-all flex items-center gap-3
                          ${selectedStyle === style.id 
                            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}
                        `}
                      >
                        <div className={`w-8 h-8 rounded-full ${style.previewColor} flex-shrink-0 shadow-sm`}></div>
                        <span className={`text-sm font-medium ${selectedStyle === style.id ? 'text-blue-700' : 'text-slate-700'}`}>
                          {style.name}
                        </span>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Generate Button */}
              <div>
                 <button
                    onClick={handleSubmit}
                    disabled={!sourceText.trim() || isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-base"
                 >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        正在解析...
                      </>
                    ) : (
                      <>
                        生成 AI PPT
                      </>
                    )}
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StepInput;
