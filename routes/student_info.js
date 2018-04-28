const express = require('express');
const moment = require('moment');
const db = require('../db');
const { queryAsPromise } = require('../db-helper');
const { buildDataTableEndpoint } = require('./helper/data-table-helper');

const router = express.Router();

router.get('/', function(req, res){
  var a = 12312031;
  res.render('student_info/main', {
    user: req.user.StudentID,
    name: req.user.StudentFirstName,
    lastname: req.user.StudentLastName,
    sex: req.user.Gender,
    nationalid: req.user.NationalID,
    studentid: req.user.StudentID,
    c: a
  });
});

module.exports = router;
