import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/auth";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { 
  LogOut, Plus, List, LayoutDashboard, Search, 
  Clock, AlertCircle, CheckCircle, X 
} from "lucide-react";
import { isToday, parseISO, isAfter, startOfToday } from "date-fns";


import SidebarBtn from "../components/SidebarBtn";
import TaskCard from "../components/TaskCard";
import StatCard from "../components/StatCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
 
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); 
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [taskData, setTaskData] = useState({ 
    title: "", description: "", status: "pending", dueDate: "" 
  });

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks/all");
      setTasks(res.data.tasks || []);
    } catch (err) { 
      if (err.response?.status === 401) navigate("/login"); 
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && t.status === filter;
  });

  const handleSave = async () => {
    try {
      if (isEditing) {
        const res = await api.put(`/tasks/update/${editId}`, taskData);
        setTasks(tasks.map((t) => (t._id === editId ? res.data.task : t)));
      } else {
        const res = await api.post("/tasks/create", taskData);
        setTasks([res.data.task, ...tasks]);
      }
      setShowModal(false);
    } catch (err) { console.error("Error saving task:", err); }
  };

  
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      
      
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col p-6 fixed h-full shadow-sm">
        <div className="flex items-center gap-2 mb-10 text-indigo-600 font-bold text-xl uppercase tracking-tighter">
          <LayoutDashboard size={24} strokeWidth={3} /> Taskly
        </div>
        
        <nav className="flex-1 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Main</p>
          <SidebarBtn active={filter === 'all'} onClick={() => setFilter('all')} icon={<List size={18}/>} label="All Tasks" />
          
          <div className="my-6 border-t border-slate-100 pt-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Filters</p>
            <SidebarBtn active={filter === 'pending'} onClick={() => setFilter('pending')} icon={<Clock size={18} className="text-amber-500" />} label="Pending" />
            <SidebarBtn active={filter === 'in-progress'} onClick={() => setFilter('in-progress')} icon={<AlertCircle size={18} className="text-blue-500" />} label="In Progress" />
            <SidebarBtn active={filter === 'completed'} onClick={() => setFilter('completed')} icon={<CheckCircle size={18} className="text-emerald-500" />} label="Completed" />
          </div>
        </nav>

        <button onClick={() => { logout(); navigate("/login"); }} className="mt-auto p-3 text-slate-400 hover:text-red-600 flex items-center gap-3 transition font-medium group">
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Logout
        </button>
      </aside>

      
      <main className="flex-1 md:ml-64 p-6 md:p-10">
        <header className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold capitalize tracking-tight">{filter.replace("-", " ")} Tasks</h1>
            <p className="text-slate-400 text-sm font-medium">Welcome back, {user?.name}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group min-w-[260px]">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              </div>
              <input 
                className="block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                placeholder="Search tasks..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
            </div>
            
            <button 
              onClick={() => { 
                setIsEditing(false); 
                setTaskData({title:"", description:"", status:"pending", dueDate:""}); 
                setShowModal(true); 
              }} 
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center gap-2"
            >
              <Plus size={18}/> <span className="hidden sm:inline">Add Task</span>
            </button>
          </div>
        </header>

       
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard title="Total" value={stats.total} icon={<List size={16}/>} color="bg-indigo-600" />
          <StatCard title="Pending" value={stats.pending} icon={<Clock size={16}/>} color="bg-amber-500" />
          <StatCard title="Active" value={stats.inProgress} icon={<AlertCircle size={16}/>} color="bg-blue-500" />
          <StatCard title="Done" value={stats.completed} icon={<CheckCircle size={16}/>} color="bg-emerald-500" />
        </div>

        
        <div className="grid gap-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(t => (
              <TaskCard 
                key={t._id} 
                task={t} 
                onEdit={() => {
                  setIsEditing(true); setEditId(t._id);
                  setTaskData({ title: t.title, description: t.description, status: t.status, dueDate: t.dueDate?.split('T')[0] || "" });
                  setShowModal(true);
                }} 
                onDelete={async () => { 
                  if(window.confirm("Delete this task?")) { 
                    await api.delete(`/tasks/delete/${t._id}`); 
                    fetchTasks(); 
                  } 
                }} 
              />
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 font-medium italic">
              No tasks found in this category.
            </div>
          )}
        </div>
      </main>

      
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl relative animate-in zoom-in duration-200">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">{isEditing ? "Edit" : "Create"} Task</h2>
            <div className="space-y-4">
              <input className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition" placeholder="Title" value={taskData.title} onChange={e => setTaskData({...taskData, title: e.target.value})}/>
              <textarea className="w-full p-3 border border-slate-200 rounded-xl h-24 outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none" placeholder="Description" value={taskData.description} onChange={e => setTaskData({...taskData, description: e.target.value})}/>
              <div className="grid grid-cols-2 gap-4">
                <input type="date" className="p-3 border border-slate-200 rounded-xl outline-none text-slate-600" value={taskData.dueDate} onChange={e => setTaskData({...taskData, dueDate: e.target.value})}/>
                <select className="p-3 border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-500" value={taskData.status} onChange={e => setTaskData({...taskData, status: e.target.value})}>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">Save Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;