var express = require('express');
var router = express.Router();
const moment = require('moment');   
const { render } = require('pug');
const connection = require('./connection');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/api/updateData', (req, res, next) => {
  const query = `
    SELECT windDirection, windSpeed, rgst_dt AS rgstDt
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
      `;
      res.send(html);
    } 
    else {
      res.render('index',err);
    }
  });
})

router.get('/api/updateChart', (req, res, next) => {
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