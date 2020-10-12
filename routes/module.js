var express = require('express');
const connection = require('./connection');
const moment = require('moment');   
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const query = 'SELECT * FROM moduleList';
  
  connection.query(query,(err, rows, fields) => {
    if(!err) {
      res.render('module',{'moduleList':rows.map(result => {
                                                  return {
                                                    deviceId: result.deviceId,
                                                    location: result.location,
                                                    rgstDt: moment(result.rgstDt).format('YYYY-MM-DD')
                                                  }
                                                })
                            });
    } else {
      res.render('module',err);
    }
  })
});

module.exports = router;
