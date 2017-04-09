var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
    if (req.accepts('application/json')) {
        return res.status(200).json('dqzdzqdqzd');
    }
});

module.exports = router;
