import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/auth";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { 
  LogOut, 
  Plus, 
  CheckCircle, 
  Clock, 
  List, 
  Trash2, 
  Edit3,
  LayoutDashboard
} from "lucide-react"; // Using lucide-react for modern icons

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: "pending",
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks/all");
      setTasks(res.data.tasks);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setTaskData({ title: "", description: "", status: "pending" });
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setIsEditing(true);
    setEditId(task._id);
    setTaskData({
      title: task.title,
      description: task.description,
      status: task.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        const res = await api.put(`/tasks/update/${editId}`, taskData);
        setTasks(tasks.map((task) => (task._id === editId ? res.data.task : task)));
      } else {
        const res = await api.post("/tasks/create", taskData);
        setTasks([res.data.task, ...tasks]);
      }
      setShowModal(false);
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/delete/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <LayoutDashboard size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">Taskly</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button className="flex items-center gap-3 w-full p-3 bg-indigo-50 text-indigo-600 rounded-xl font-medium transition">
            <List size={18} /> Tasks
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl font-medium transition mt-auto"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-10 max-w-6xl mx-auto w-full">
        {/* TOP BAR */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.name || "User"}!</h1>
            <p className="text-slate-500 text-sm">Here's what is happening with your projects today.</p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            <Plus size={18} /> Create Task
          </button>
        </header>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard 
            title="Total Tasks" 
            value={tasks.length} 
            icon={<List className="text-indigo-600" />} 
          />
          <StatCard 
            title="Pending" 
            value={tasks.filter(t => t.status !== 'completed').length} 
            icon={<Clock className="text-amber-500" />} 
          />
          <StatCard 
            title="Completed" 
            value={tasks.filter(t => t.status === 'completed').length} 
            icon={<CheckCircle className="text-emerald-500" />} 
          />
        </div>

        {/* TASK LIST */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold mb-4">Current Tasks</h2>
          {tasks.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400">No tasks found. Start by creating one!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskItem 
                key={task._id} 
                task={task} 
                onEdit={() => openEditModal(task)} 
                onDelete={() => handleDelete(task._id)} 
              />
            ))
          )}
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold mb-6">{isEditing ? "Edit Task" : "New Task"}</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Title</label>
                <input
                  type="text"
                  className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  value={taskData.title}
                  onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Description</label>
                <textarea
                  className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition h-24"
                  value={taskData.description}
                  onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Status</label>
                <select
                  className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition appearance-none bg-white"
                  value={taskData.status}
                  onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition"
              >
                {isEditing ? "Save Changes" : "Create Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-3xl flex items-center gap-5 border border-slate-100 shadow-sm hover:shadow-md transition">
    <div className="p-4 bg-slate-50 rounded-2xl">{icon}</div>
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const TaskItem = ({ task, onEdit, onDelete }) => {
  const statusStyles = {
    completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    "in-progress": "bg-blue-50 text-blue-600 border-blue-100",
    pending: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <div className="group bg-white p-5 rounded-2xl border border-slate-100 flex justify-between items-center hover:border-indigo-200 transition">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="font-bold text-slate-800">{task.title}</h3>
          <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border ${statusStyles[task.status]}`}>
            {task.status}
          </span>
        </div>
        <p className="text-sm text-slate-500 line-clamp-1">{task.description}</p>
      </div>

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
          <Edit3 size={18} />
        </button>
        <button onClick={onDelete} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;