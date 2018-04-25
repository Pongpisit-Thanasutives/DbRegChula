const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', function (req, res) {
  res.render('register', {
    user: req.user
  });
});

router.post('/', function(req, res){
	var sid = req.user.StudentID;
	console.log(req.body);
  var len = Object.keys(req.body).length;
  if(len === 0){
    res.render('register', {
      err_msg: "Empty input is sent"
    });
  }
  var vals = [];
  var promises = [];

  //===INSERT INTO request(StudentIDl1, CourseIDl1, AcademicYearl1, Terml1, SectionNumberl1, RequestStatus)
  //===VALUES(5831036921, 2302168, 2018, 1, 33, 'PENDING');

  for(let i=0;i<len/2;i++){
    promises.push(new Promise(function(resolve, reject){
      let info = [sid];
      let tmp = 'course_no'+(i+1);
      info.push(req.body[tmp]);
      info.push('2018');
      info.push('1');
      tmp = 'section'+(i+1);
      info.push(req.body[tmp]);
      info.push("PENDING");
      vals.push(info);
      resolve();
    }));
  }
  Promise.all(promises).then(function(){
    var sql = "INSERT INTO REQUEST(StudentIDl1, CourseIDl1, AcademicYearl1, Terml1, SectionNumberl1, RequestStatus) VALUES ?";
    db.query(sql, [vals], function(err, result){
      if(err){
        console.log(err);
        res.render('register', {
          err_msg: "INSERT data error"
        });
      }
      else{
        res.redirect('/student-info');
      }
    } );
  });
});

module.exports = router;
