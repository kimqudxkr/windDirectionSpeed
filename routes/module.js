var express = require('express');
const connection = require('./connection');
const moment = require('moment');   
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const query = 'SELECT * FROM moduleList ORDER BY rgstDt';
  
  connection.query(query,(err, rows, fields) => {
    if(!err) {
      res.render('module',{'moduleList':rows.map(result => {
                                                  return {
                                                    deviceId: result.deviceId,
                                                    deviceType: result.deviceType,
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

router.get('/api/delete', function(req, res, next) {
  const deviceId = req.query.deviceId;
  const query = `DELETE FROM modulelist WHERE deviceId = '${deviceId}'`;

  connection.query(query,(err, rows, fields) => {
    if(!err) {
      res.send("Success");
    } else {
      res.send(err);
    }
  });
});

module.exports = router;
