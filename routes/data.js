var express = require('express');
var router = express.Router();
const moment = require('moment');   
const connection = require('./connection');

const selectOption = (params) => {
  switch (params.termSetting) {
    case "user":
      const start = `${params.startDay} ${params.startHour}:00:00`;
      const end = `${params.endDay} ${params.endHour}:00:00`;
      return `rgst_dt >= '${start}' AND rgst_dt <= '${end}'`;
    case "quater":
      return `quarter(rgst_dt) = ${params.quater}`;
    case "year":
      return `year(rgst_dt) = ${params.year}`;
    case "month":
      return `month(rgst_dt) = ${params.month}`;
    case "week":
      return `year(rgst_dt) = ${params.year} and month(rgst_dt) = ${params.month} and 
              (week(rgst_dt) - week('${params.year}-${params.month}-01') + 1 = ${params.week})`;
  }
}

/* GET databyday page. */
router.get('/', (req, res, next) => {  
  const query = `
    SELECT AVG(windDirection) AS windDirection, 
            ROUND(AVG(substr(windSpeed, 1, 3)), 2) AS windSpeed,
            rgst_dt AS rgstDt
    FROM finedust_tb 
    GROUP BY SUBSTR(rgst_dt, 1, 10) 
    ORDER BY rgst_dt DESC`;

  connection.query(query, (err, rows, fields) => {
    if (!err) {
      res.render('data', {'datas': rows.map(data => {
                                            return {
                                              windDirection: data.windDirection,
                                              windSpeed: data.windSpeed,
                                              rgstDt: moment(data.rgstDt).format('YYYY-MM-DD')
                                            }
                                          })
                          });
    } 
    else {
      res.render('data', err);
    }
  })
})

router.get('/api/search', (req, res, next) => {
  const params = req.query;
  const time = selectOption(params);

  const query = `
    SELECT AVG(windDirection) AS windDirection, 
            ROUND(AVG(substr(windSpeed, 1, 3)), 2) AS windSpeed, 
            rgst_dt AS rgstDt
    FROM finedust_tb WHERE ${time} 
    GROUP BY SUBSTR(rgst_dt, 1, 10) 
    ORDER BY rgst_dt DESC`;

  connection.query(query, (err, rows, fields) => {
    if (!err) {
      let result;
      const dateFormat = {'13': 'MM-DD:HH', '10': 'YYYY-MM-DD', '18': 'MM-DD HH:mm:ss'};

      if(JSON.stringify(rows)=='[]') {
        result = `
        <tr>
          <td colspan="3">No Data</td>
        </tr>`
      } 
      else {      
        rows.forEach(data => {
          const html = `
            <tr>
              <td>${moment(data.rgstDt).format(dateFormat['10'])}</td>
              <td>
                <img class="wind-direction-icon" src="images/Black_Arrow.png" alt="wind-direction" style="width: 40px; transform: rotate(${data.windDirection}deg);" />
              </td>
              <td>${data.windSpeed} (m/s)</td>
            </tr>
          `
          result += html;
        });
      } 
      res.send(result);
    } 
    else {
      res.send(err);
    }
  })
})

module.exports = router;