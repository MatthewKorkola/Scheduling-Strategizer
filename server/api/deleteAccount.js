const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
  try {
    const { username } = req.body;
    // Find the userid corresponding to the username
    const userIdQuery = 'SELECT userid FROM Users WHERE username = $1';
    const userIdResult = await pool.query(userIdQuery, [username]);
    const userId = userIdResult.rows[0].userid;

    // Delete all projects and tasks associated with the userid
    const deleteProjectsQuery = 'DELETE FROM Projects WHERE userid = $1';
    await pool.query(deleteProjectsQuery, [userId]);

    // Delete the user account
    const deleteUserQuery = 'DELETE FROM Users WHERE userid = $1';
    await pool.query(deleteUserQuery, [userId]);

    res.json({ success: true, message: 'User account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user account' });
  }
});

module.exports = router;
