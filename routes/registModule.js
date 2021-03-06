const express = require('express');
const connection = require('./connection');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('registModule');
});

// 장치 등록 버튼 눌렀을 때
router.post('/api/regist', function(req, res, next) {
  console.log(req.body);
  const params = req.body;
  const query = `INSERT INTO modulelist(deviceId, deviceType, location) 
                 VALUES('${params.deviceId}', '${params.deviceType}', '${params.location}')`;

  connection.query(query,(err, rows, fields) => {
    if(!err) {
      res.send("Success");
    } else {
      res.send(err);
    }
  });
});

// 장치 등록에서 장치 이름이 중복되는지 검사
router.get('/api/checkId', function(req, res, next) {
  const params = req.query;
  const query = `SELECT * from moduleList WHERE deviceId='${params.deviceId}'`;

  connection.query(query,(err, rows, fields) => {
    if(!err) {
      // res.send() 파라미터에는 Object, String, Array, Buffer Object 만 사용 가능
      res.send(rows);
    } else {
      res.send(err);
    }
  });
});

module.exports = router;
