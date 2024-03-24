const express = require('express');
const pool = require('../db');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { loggedInUsername, projectName, taskId } = req.body;

        // console.log('Received taskId:', taskId);
        // console.log('Received loggedInUsername:', loggedInUsername);
        // console.log('Received projectName:', projectName);

        // Mark the task as completed in the database
        const markCompletedQuery = `
            UPDATE Tasks
            SET completed = true
            WHERE TaskID = $1
            AND UserID = (SELECT UserID FROM Users WHERE Username = $2)
            AND ProjectID = (SELECT ProjectID FROM Projects WHERE ProjectName = $3)
            RETURNING *
        `;
        const markedTask = await pool.query(markCompletedQuery, [taskId, loggedInUsername, projectName]);

        // Respond with the marked task
        res.json(markedTask.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
