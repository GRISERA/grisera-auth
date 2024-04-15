const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

router.use('/', authMiddleware);
  
router.get("/", async (req, res) => {
    try {
        let users = await User.find();

        users = users.map(user => ({ id: user._id, username: user.username }));

        res.json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;