var express = require('express');
var router = express.Router();
const connection = require('./connection');

/* GET home page. */
router.get('/', function(req, res, next) {
  const query = 'SELECT no, title, writer, date FROM btboard';

  connection.query(query, function(err, rows) {
    if(!err) {
      res.render('index',{result:rows});
    } else {
      console.log('query error : '+err);
      res.send(err);
    }
  })
});

module.exports = router;