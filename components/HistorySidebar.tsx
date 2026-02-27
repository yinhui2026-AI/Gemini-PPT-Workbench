import React from 'react';
import { HistoryRecord } from '../types';
import { Clock, Trash2, ChevronRight } from 'lucide-react';

interface HistorySidebarProps {
  records: HistoryRecord[];
  onSelect: (record: HistoryRecord) => void;
  onDelete: (id: string) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ records, onSelect, onDelete }) => {
  if (records.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          最近记录 ({records.length})
        </h3>
      </div>
      <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
        {records.map((record) => (
          <div 
            key={record.id} 
            className="p-4 hover:bg-slate-50 transition-colors group cursor-pointer relative"
            onClick={() => onSelect(record)}
          >
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-medium text-slate-800 line-clamp-1 text-sm">
                {record.slides[0]?.title || "未命名幻灯片"}
              </h4>
              <span className="text-xs text-slate-400 flex-shrink-0 ml-2">
                {new Date(record.timestamp).toLocaleDateString()}
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2 mb-2">
              {record.config.sourceText || "无文字素材内容"}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                {record.slides.length} 页
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(record.id);
                }}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorySidebar;
