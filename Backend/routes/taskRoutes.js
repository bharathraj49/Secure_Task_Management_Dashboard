const express = require('express');
const router = express.Router();
const Task = require('../models/taskModel');
const authMiddleware = require('../middleware/auth');


router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const newTask = new Task({
      title,
      description,
      status,
      assignedTo: req.user.userId
    });

    await newTask.save();

    res.status(201).json({
      message: 'Task created successfully',
      task: newTask
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/all', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.user.userId
    }).sort({ createdAt: -1 });

    res.status(200).json({ tasks });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/update/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, assignedTo: req.user.userId },
      req.body,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: 'Task not found or unauthorized'
      });
    }

    res.status(200).json({
      message: 'Task updated successfully',
      task: updatedTask
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      assignedTo: req.user.userId
    });

    if (!deletedTask) {
      return res.status(404).json({
        message: 'Task not found or unauthorized'
      });
    }

    res.status(200).json({
      message: 'Task deleted successfully'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;