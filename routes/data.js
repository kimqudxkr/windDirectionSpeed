var express = require('express');
var router = express.Router();
const moment = require('moment');   
const connection = require('./connection');

// 측정 자료 조회 페이지의 기간 설정 부분에서 선택한 설정에 따라 SQL 구문에서 조건을 주기 위한 함수
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
  // 데이터베이스에 존재하는 모든 데이터 조회
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

// 조회 버튼을 눌렀을 때 ajax 처리하는 부분
router.get('/api/search', (req, res, next) => {
  const params = req.query;
  const time = selectOption(params);

  // 조회 버튼을 눌러 넘어온 파라미터들을 기반으로 조건 설정하여 조회
  const query = `
    SELECT AVG(windDirection) AS windDirection, 
            ROUND(AVG(substr(windSpeed, 1, 3)), 2) AS windSpeed, 
            rgst_dt AS rgstDt
    FROM finedust_tb WHERE ${time} 
    GROUP BY SUBSTR(rgst_dt, 1, 10) 
    ORDER BY rgst_dt DESC`;

  connection.query(query, (err, rows, fields) => {
    if (!err) {
      let result;   //SQL 결과를 html구문으로 반복하기 위한 함수

      // 만약 데이터가 없다면 No Data로 표시
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
              <td>${moment(data.rgstDt).format('YYYY-MM-DD')}</td>
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