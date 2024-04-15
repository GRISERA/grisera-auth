const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post("/", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        if(user) {
            return res.status(409).send({ error: 'User already exists' });
        }
        
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).send(newUser);
    } catch (error) {
        res.status(400).send({error: error.message});
    }
});

module.exports = router;