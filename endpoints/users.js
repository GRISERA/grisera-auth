const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.use('/', authMiddleware);
  
router.get("/", async (req, res) => {
    try {
        // TODO: user list from keycloak
        users = []

        res.json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;