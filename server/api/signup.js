const express = require('express');
const pool = require('../db');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if username or password is empty
        if (!username || !password) {
            return res.status(400).send('Username or password cannot be empty');
        }

        // Insert user into the database
        const newUser = await pool.query('INSERT INTO Users (username, password) VALUES ($1, $2) RETURNING *', [username, password]);

        // Respond with the newly created user
        res.json(newUser.rows[0]);
    } catch (error) {
        // Handle unique constraint violation
        if (error.code === '23505') {
            return res.status(409).send('Username already exists');
        } else {
            console.error(error.message);
            return res.status(500).send('Server Error');
        }
    }
});

module.exports = router;
