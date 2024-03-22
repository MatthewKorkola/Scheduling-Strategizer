const express = require('express');
const cors = require('cors');
const app = express();

// Middleware to handle JSON requests
app.use(express.json());

// Enable CORS if necessary
app.use(cors());

// Import and use API endpoints
const signupRouter = require('./api/signup');
const loginRouter = require('./api/login');
const createProjectRouter = require('./api/createProject');

app.use('/api/signup', signupRouter);
app.use('/api/login', loginRouter);
app.use('/api/createProject', createProjectRouter);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
