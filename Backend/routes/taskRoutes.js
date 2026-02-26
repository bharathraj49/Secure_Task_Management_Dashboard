const express = require('express');
const router = express.Router();
const Task = require('../models/taskModel');

const authMiddleware = require('../middleware/auth');
const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask
} = require('../controller/taskController');  

router.post('/create', authMiddleware, createTask);


router.get('/all', authMiddleware, getAllTasks);


router.put('/update/:id', authMiddleware, updateTask);


router.delete('/delete/:id', authMiddleware, deleteTask);

module.exports = router;