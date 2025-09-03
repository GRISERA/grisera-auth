const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const getUsers = require('../services/keycloakService');

router.use('/', authMiddleware);
  
router.get("/", async (req, res) => {
    try {
        const keycloakUsers = await getUsers();
        const users = keycloakUsers.map(user => ({ id: user.id, username: user.username }))
        res.json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;