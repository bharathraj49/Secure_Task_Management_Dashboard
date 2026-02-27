import React from 'react';

const StatusBadge = ({ status }) => {
  const config = {
    pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100", dot: "bg-amber-400" },
    "in-progress": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-100", dot: "bg-blue-400" },
    completed: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100", dot: "bg-emerald-400" },
  };

  const { bg, text, border, dot } = config[status] || config.pending;

  return (
    <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold uppercase tracking-wider ${bg} ${text} ${border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
      {status.replace("-", " ")}
    </span>
  );
};

export default StatusBadge;