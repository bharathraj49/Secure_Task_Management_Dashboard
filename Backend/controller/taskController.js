const Task = require("../models/taskModel")
const createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;
    const newTask = new Task({
      title,
      description,
      status: status || "pending",
      dueDate: dueDate || null,
      assignedTo: req.user.userId,
    });
    await newTask.save();
    res.status(201).json({ message: "Task created", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


const getAllTasks = async (req, res) => {
 try {
    const tasks = await Task.find({ assignedTo: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


const updateTask = async (req, res) => {
 try {
    const { id } = req.params;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, assignedTo: req.user.userId },
      { $set: req.body },
      { 
        
        returnDocument: 'after', 
        runValidators: true 
      }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({ _id: req.params.id, assignedTo: req.user.userId });
    if (!deleted) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
};