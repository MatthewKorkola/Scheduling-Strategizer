const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const pool = require('../db');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await pool.query('SELECT * FROM Users WHERE username = $1', [username]);

    if (!user.rows[0]) {
            return res.json({ success: false });
        }

    // Compare hashed password
    const hashedPassword = user.rows[0].password;
    const passwordMatch = bcrypt.compareSync(password, hashedPassword);

    if (passwordMatch) {
        return res.json({ success: true });
    } else {
        return res.json({ success: false });
    }

  } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
  }
});

module.exports = router;
