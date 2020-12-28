const express = require('express');
const router = express.Router();
const moment = require('moment');   
const { render } = require('pug');
const connection = require('./connection');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// 실시간 자료 조회에서 실시간 자료 ajax를 조회하는 부분
router.get('/api/updateData', (req, res, next) => {
  // 데이터베이스에서 내림차순으로 첫번째 데이터 조회
  const query = `
    SELECT windDirection, windSpeed, rgst_dt AS rgstDt, deviceId
    FROM finedust_tb ORDER BY logIdx DESC LIMIT 1`;

  connection.query(query, (err, rows) => {
    if(!err) {
      const html = `
        <tr>
          <th>시간</th>
          <td>${moment(rows[0].rgstDt).format('YYYY-MM-DD HH:mm:SS')}</td>
        </tr>
        <tr>
          <th>풍향</th>
          <td><img class="wind-direction-icon" src="images/Black_Arrow.png" alt="wind-direction" style="height: '100px'; width: 100px; transform: rotate(${rows[0].windDirection}deg);" /></td>
        </tr>
        <tr>
          <th>풍속</th>
          <td>${rows[0].windSpeed}</td>
        </tr>
        <tr>
          <th>장치</th>
          <td>${rows[0].deviceId}</td>
        </tr>
      `;
      res.send(html);
    } 
    else {
      res.render('index',err);
    }
  });
})

// 실시간 자료 조회에서 최근 10시간 데이터 ajax를 조회하는 부분
router.get('/api/updateChart', (req, res, next) => {
  // 시간을 그룹으로 묶어 시간당 평균 데이터를 10개 조회
  const query = `
    SELECT AVG(windDirection) AS windDirection, 
          ROUND(AVG(substr(windSpeed, 1, 3)), 2) AS windSpeed,
          rgst_dt AS rgstDt
    FROM finedust_tb 
    GROUP BY SUBSTR(rgst_dt, 1, 13) 
    ORDER BY rgst_dt DESC LIMIT 10`;
    
  connection.query(query, (err, rows, fields) => {
    if (!err) {
      res.send({'result': rows.map(data => {
                                            return {
                                              windDirection: data.windDirection,
                                              windSpeed: data.windSpeed,
                                              rgstDt: moment(data.rgstDt).format('MM-DD HH')
                                            }
                                          })
              });
    } 
    else {
      res.render('index', err);
    }
  })
})

module.exports = router;