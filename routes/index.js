var express = require('express');
var router = express.Router();
const moment = require('moment');   
const connection = require('./connection');

const realTimeQuery = `SELECT windDirection, windSpeed, rgst_dt AS rgstDt
                       FROM finedust_tb ORDER BY logIdx DESC LIMIT 1`;
/* GET home page. */
router.get('/', function(req, res, next) {
  let latest;   //쿼리 결과를 저장하고 다음번 쿼리에서 함께 데이터를 보내기 위해 전역 선언

  connection.query(realTimeQuery, (err, rows) => {
    if(!err) {
      latest=rows;
    } 
    else {
      res.render('index',err);
    }
  });

  const query = `
    SELECT AVG(windDirection) AS windDirection, 
          ROUND(AVG(substr(windSpeed, 1, 3)), 2) AS windSpeed,
          rgst_dt AS rgstDt
    FROM finedust_tb 
    GROUP BY SUBSTR(rgst_dt, 1, 13) 
    ORDER BY rgst_dt DESC LIMIT 10`;
    
  connection.query(query, (err, rows, fields) => {
    if (!err) {
      res.render('index', {'datas': rows.map(data => {
                                            return {
                                              windDirection: data.windDirection,
                                              windSpeed: data.windSpeed,
                                              rgstDt: moment(data.rgstDt).format('MM-DD HH')
                                            }
                                          })
                                          ,'latest': latest.map(data => {
                                            return {
                                              windDirection: data.windDirection,
                                              windSpeed: data.windSpeed,
                                              rgstDt: moment(data.rgstDt).format('YYYY-MM-DD HH:mm:SS')
                                            }
                                          })
                          });
    } 
    else {
      res.render('index', err);
    }
  })
});

router.get('/api/updateData', (req, res, next) => {
  connection.query(realTimeQuery, (err, rows) => {
    if(!err) {
      const html = `
        <tr>
          <th>시간</th>
          <td>${rows[0].rgstDt}</td>
        </tr>
        <tr>
          <th>풍향</th>
          <td><img class="wind-direction-icon" src="images/Black_Arrow.png" alt="wind-direction" style="width: 40px; transform: rotate(${rows[0].windDirection}deg);" /></td>
        </tr>
        <tr>
          <th>풍속</th>
          <td>${rows[0].windSpeed}</td>
        </tr>
      `;
      res.send(html);
    } 
    else {
      res.render('index',err);
    }
  });
})

module.exports = router;