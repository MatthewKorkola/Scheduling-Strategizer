const express = require('express');
const pool = require('../db');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { loggedInUsername, projectName, taskId } = req.body;

        // Delete the task from the database
        const deleteTaskQuery = `
            DELETE FROM Tasks
            WHERE TaskID = $1
            AND UserID = (SELECT UserID FROM Users WHERE Username = $2)
            AND ProjectID = (SELECT ProjectID FROM Projects WHERE ProjectName = $3)
            RETURNING *
        `;
        const deletedTask = await pool.query(deleteTaskQuery, [taskId, loggedInUsername, projectName]);

        // Respond with the deleted task
        res.json(deletedTask.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
