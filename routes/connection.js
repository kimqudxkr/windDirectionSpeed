const express = require('express');
const mysql = require("mysql");
const config = require('../config.json')

const connection = mysql.createConnection(config[express().get('env')]);

module.exports = connection;