const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());

app.use(cors());

// Import and use API endpoints
const signupRouter = require('./api/signup');
const loginRouter = require('./api/login');
const createProjectRouter = require('./api/createProject');
const addTaskRouter = require('./api/addTask');
const markTaskCompletedRouter = require('./api/markTaskCompleted');
const deleteTaskRouter = require('./api/deleteTask');
const deleteProjectRouter = require('./api/deleteProject');
const retrieveDataRouter = require('./api/retrieveData');
const deleteAccountRouter = require('./api/deleteAccount');

app.use('/api/signup', signupRouter);
app.use('/api/login', loginRouter);
app.use('/api/createProject', createProjectRouter);
app.use('/api/addTask', addTaskRouter);
app.use('/api/markTaskCompleted', markTaskCompletedRouter);
app.use('/api/deleteTask', deleteTaskRouter);
app.use('/api/deleteProject', deleteProjectRouter);
app.use('/api/retrieveData', retrieveDataRouter);
app.use('/api/deleteAccount', deleteAccountRouter);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
