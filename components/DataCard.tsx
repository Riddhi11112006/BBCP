
import React from 'react';

interface DataCardProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  weight: number;
}

const DataCard: React.FC<DataCardProps> = ({ title, icon, children, weight }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
            <i className={`fa-solid ${icon}`}></i>
          </div>
          <h3 className="font-semibold text-slate-800">{title}</h3>
        </div>
        <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">Weight: {weight}%</span>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
};

export default DataCard;
