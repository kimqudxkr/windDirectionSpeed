var express = require('express');
var router = express.Router();
const moment = require('moment');   
const connection = require('./connection');

/* GET home page. */
router.get('/', function(req, res, next) {
  const query = 'SELECT no, title, writer, date FROM btboard';

  connection.query(query, function(err, rows) {
    const query = `
      SELECT AVG(windDirection) AS windDirection, 
             ROUND(AVG(substr(windSpeed, 1, 3)), 2) AS windSpeed,   
             rgst_dt 
      FROM finedust_tb 
      GROUP BY SUBSTR(rgst_dt, 1, 13) 
      ORDER BY rgst_dt DESC LIMIT 10
    `;
  
    connection.query(query, (err, rows, fields) => {
      if (!err) {
        res.render('index', {'datas': rows.map(data => {
                                              return {
                                                windDirection: data.windDirection,
                                                windSpeed: data.windSpeed,
                                                rgst_dt: moment(data.rgst_dt).format('YYYY-MM-DD HH:MM:SS')
                                              }
                                            })
                                    });
      }
      else {
        console.log(err);
        res.render('index', err);
      }
    })
  });
});

module.exports = router;