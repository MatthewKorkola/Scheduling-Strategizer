const express = require('express');
const pool = require('../db');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { projectDetails, loggedInUsername } = req.body;

        // Insert project into the database, associating it with the logged-in user
        const newProject = await pool.query(
            'INSERT INTO Projects (UserID, ProjectName) VALUES ((SELECT UserID FROM Users WHERE Username = $1), $2) RETURNING *',
            [loggedInUsername, projectDetails.name]
        );

        // Respond with the newly created project
        res.json(newProject.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
