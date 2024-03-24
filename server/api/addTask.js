const express = require('express');
const pool = require('../db');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { taskDetails, loggedInUsername } = req.body;

        //console.log('Received loggedInUsername:', loggedInUsername);

        // Get the UserID of the logged-in user
        const user = await pool.query(
            'SELECT UserID FROM Users WHERE Username = $1',
            [loggedInUsername]
        );

        const userId = user.rows[0].userid; // Assuming 'userid' is the correct column name

        // Get the ProjectID of the specified project
        const project = await pool.query(
            'SELECT ProjectID FROM Projects WHERE UserID = $1 AND ProjectName = $2',
            [userId, taskDetails.project] // Assuming 'userid' and 'projectname' are the correct column names
        );

        const projectId = project.rows[0].projectid; // Assuming 'projectid' is the correct column name

        // Insert task into the database, associating it with the logged-in user and the specified project
        const newTask = await pool.query(
            'INSERT INTO Tasks (UserID, ProjectID, TaskName, Deadline, Completed, ExpectedTime) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [userId, projectId, taskDetails.taskname, taskDetails.deadline, taskDetails.completed, taskDetails.expectedTime]
        );

        // Respond with the newly created task
        res.json(newTask.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
