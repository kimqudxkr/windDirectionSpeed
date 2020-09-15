var express = require('express');
var router = express.Router();
const connection = require('./connection');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('data');
});

module.exports = router;