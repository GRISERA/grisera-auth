const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require('../models/User');
const Permission = require('../models/Permission');

router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({username: req.body.username});

    if (!user || !(await user.comparePassword(req.body.password))) {
      throw new Error("Invalid username or password");
    }

    const permissions = await Permission.find({ userId: user._id });

    const token = jwt.sign({
        userId: user._id,
        email: user.username,
        permissions: permissions,
      },
      process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

    res.send({token});
  } catch (error) {
    res.status(400).send({error: error.message});
  }
});

module.exports = router;