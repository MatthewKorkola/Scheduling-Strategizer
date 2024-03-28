const express = require('express');
const pool = require('../db');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { loggedInUsername, projectName } = req.body;

        // Get the UserID of the logged-in user
        const user = await pool.query(
            'SELECT UserID FROM Users WHERE Username = $1',
            [loggedInUsername]
        );
        const userId = user.rows[0].userid;

        // Delete tasks associated with the project
        await pool.query(
            'DELETE FROM Tasks WHERE ProjectID IN (SELECT ProjectID FROM Projects WHERE UserID = $1 AND ProjectName = $2)',
            [userId, projectName]
        );

        // Delete the project
        await pool.query(
            'DELETE FROM Projects WHERE UserID = $1 AND ProjectName = $2',
            [userId, projectName]
        );

        res.status(200).send('Project deleted successfully.');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
