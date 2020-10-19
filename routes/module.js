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

// 장치 삭제 버튼 눌렀을 때
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

// 검색 버튼 눌렀을 때
router.get('/api/moduleSearch', function(req, res, next) {
  const params = req.query;

  // 검색은 해당 글자를 포함하는 모든 데이터를 불러오기에 LIKE 사용(장치 이름, 위치, 일자 등)
  const query = `SELECT * FROM modulelist WHERE ${params.column} LIKE '%${params.matching}%' ORDER BY rgstDt`;

  connection.query(query,(err, rows, fields) => {
    if(!err) {
      let result;   //SQL 결과를 html구문으로 반복하기 위한 함수

      // 만약 데이터가 없다면 No Data로 표시
      if(JSON.stringify(rows)=='[]') {
        result = `
        <tr>
          <td colspan="6">No Data</td>
        </tr>`
      } 
      else {      
        rows.forEach(data => {
          const html = `
            <tr>
              <td>${data.deviceId}</td>
              <td>${data.deviceType}</td>
              <td>${data.location}</td>
              <td>${moment(data.rgstDt).format('YYYY-MM-DD')}</td>
              <td>
                <button class="btn btn-dark form-control" onclick="location.href='/modify/Module?deviceId=${data.deviceId}'">수정</button>
              </td>
              <td>
                <button class="btn btn-dark form-control" onclick="deleteModule('${data.deviceId}')">삭제</button>
              </td>
            </tr>
          `
          result += html;
        });
      } 
      res.send(result);
    } else {
      res.send(err);
    }
  });
});


module.exports = router;
