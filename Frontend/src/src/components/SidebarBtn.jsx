import React from 'react';

const SidebarBtn = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-3 w-full p-3.5 rounded-2xl font-semibold transition ${
      active ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
    }`}
  >
    {icon} {label}
  </button>
);

export default SidebarBtn;