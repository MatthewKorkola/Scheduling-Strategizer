const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { username } = req.query; // Retrieve username from query parameters

        // Retrieve userId associated with the username
        const user = await pool.query('SELECT userid FROM Users WHERE username = $1', [username]);
        const userId = user.rows[0].userid;

        // Retrieve projects associated with the user
        const projects = await pool.query(
            'SELECT * FROM Projects WHERE UserID = $1',
            [userId]
        );

        // Retrieve tasks associated with the user's projects
        const tasks = await pool.query(
            'SELECT * FROM Tasks WHERE ProjectID IN (SELECT ProjectID FROM Projects WHERE UserID = $1)',
            [userId]
        );

        res.status(200).json({ projects: projects.rows, tasks: tasks.rows });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
