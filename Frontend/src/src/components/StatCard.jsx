import React from 'react';

const StatCard = ({ title, value, color, icon }) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow duration-300">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
          {title}
        </p>
        <p className="text-2xl font-bold text-slate-800">
          {value}
        </p>
      </div>
      <div className={`${color} p-2.5 rounded-xl text-white shadow-lg shadow-slate-100`}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;