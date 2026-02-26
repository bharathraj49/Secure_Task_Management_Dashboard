const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
require('dotenv').config();

const app = express();


app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5010;


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });