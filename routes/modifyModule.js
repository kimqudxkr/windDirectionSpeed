const express = require('express');
const connection = require('./connection');
const moment = require('moment');   
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.query.deviceId) {
    const query = `SELECT * FROM modulelist WHERE deviceId = '${req.query.deviceId}'`;

    connection.query(query,(err, rows, fields) => {
      if(!err) {
        res.render('modifyModule', {'moduleInfo':rows.map(result => {
                                                            return {
                                                              deviceId: result.deviceId,
                                                              deviceType: result.deviceType,
                                                              location: result.location,
                                                              rgstDt: moment(result.rgstDt).format('YYYY-MM-DD')
                                                            }
                                                          })
                    });
      } else {
        res.send(err);
      }
    });
  }
});

// 수정 버튼을 눌렀을 때
router.post('/api/modify', function(req, res, next) {
  const params = req.body;
  const query = `UPDATE moduleList SET deviceType='${params.deviceType}', location='${params.location}'
                 WHERE deviceId = '${params.deviceId}'`;

  connection.query(query,(err, rows, fields) => {
    if(!err) {
      res.send("Success");
    } else {
      res.send(err);
    }
  });
});

// deviceId에 따른 타입을 반환
router.get('/api/findType', function(req, res, next) {
  const params = req.query;
  const query = `SELECT deviceType FROM moduleList WHERE deviceId = '${params.deviceId}' `;

  connection.query(query,(err, rows, fields) => {
    if(!err) {
      res.send(rows[0].deviceType);
    } else {
      res.send(err);
    }
  });
});

module.exports = router;