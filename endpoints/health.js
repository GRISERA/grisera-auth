const express = require('express');
const router = express.Router();
  

router.get('/', async (req, res) => {
    res.status(200).send({msg: 'OK'})
});

module.exports = router;