import React from 'react';
import { Calendar, Edit3, Trash2 } from "lucide-react";
import { format, isPast, isToday, parseISO } from "date-fns";
import StatusBadge from "./StatusBadge";

const TaskCard = ({ task, onEdit, onDelete }) => {
  const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate)) && task.status !== 'completed';
  
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 flex justify-between items-center group hover:border-indigo-200 hover:shadow-md hover:shadow-slate-200/50 transition-all duration-300">
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex flex-wrap items-center gap-3 mb-1.5">
          <h3 className={`font-bold tracking-tight truncate ${task.status === 'completed' ? 'line-through text-slate-300 italic' : 'text-slate-800'}`}>
            {task.title}
          </h3>
          
          <StatusBadge status={task.status} />

          {task.dueDate && (
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border flex items-center gap-1 shrink-0 ${isOverdue ? 'bg-red-50 text-red-500 border-red-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
              <Calendar size={10}/> {format(parseISO(task.dueDate), 'MMM d')}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-400 line-clamp-1">{task.description}</p>
      </div>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button onClick={onEdit} className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
          <Edit3 size={18}/>
        </button>
        <button onClick={onDelete} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
          <Trash2 size={18}/>
        </button>
      </div>
    </div>
  );
};

export default TaskCard;