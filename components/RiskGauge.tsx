
import React from 'react';

interface RiskGaugeProps {
  score: number;
  label: string;
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ score, label }) => {
  const getColor = (s: number) => {
    if (s >= 75) return 'text-emerald-500';
    if (s >= 45) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getBgColor = (s: number) => {
    if (s >= 75) return 'bg-emerald-500';
    if (s >= 45) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* SVG Gauge Background */}
        <svg className="absolute w-full h-full -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="12"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            className={getColor(score)}
            stroke="currentColor"
            strokeWidth="12"
            strokeDasharray={440}
            strokeDashoffset={440 - (440 * score) / 100}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="text-center z-10">
          <span className={`text-5xl font-bold ${getColor(score)}`}>{score}</span>
          <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Credits Score</p>
        </div>
      </div>
      <div className={`mt-4 px-4 py-1 rounded-full text-white text-sm font-bold uppercase ${getBgColor(score)}`}>
        {label} Risk
      </div>
    </div>
  );
};

export default RiskGauge;
