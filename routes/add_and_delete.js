const express = require('express');
const db = require('../db');
const dbHelper = require('../db-helper');
const { queryAsPromise } = require('../db-helper');
const router = express.Router();

router.get('/', function (req, res) {
  res.render('addanddelete', {
    user: req.user
  });
});

router.post('/', function(req, res){
	var sid = req.user.StudentID;
	var num_add_course = 0;
	var num_delete_course = 0;
	console.log(req.body);
  var len = Object.keys(req.body).length;
  if(len === 0){
    res.render('addanddelete', {
      err_msg: "Empty input is sent"
    });
  }
	if(req.body['add_courses1'] !== undefined){
    var vals = [];
    var promises = [];
    for(let i=0;i<len/2;i++){
      promises.push(new Promise(function(resolve, reject){
        let info = [sid];
        let tmp = 'add_courses'+(i+1);
        info.push(req.body[tmp]);
        info.push('2018');
        info.push('1');
        tmp = 'sections'+(i+1);
        info.push(req.body[tmp]);
        vals.push(info);
        resolve();
      }));
    }
    Promise.all(promises).then(function(){
      var sql = "INSERT INTO STUDY(StudentIDl2, CourseIDl2, AcademicYearl2, Terml2, SectionNumberl2) VALUES ?";
      db.query(sql, [vals], function(err, result){
        if(err){
          res.render('addanddelete', {
            err_msg: "INSERT data error"
          });
        }
        else{
          res.redirect('/student-info');
        }
      } );
    });
	}
	if(req.body['delete_courses1'] !== undefined){
    var vals = [];
    var promises = [];
    for(let i=0;i<len;i++){
      promises.push(new Promise(function(resolve, reject){
        let info = [sid];
        let tmp = 'delete_courses'+(i+1);
        info.push(req.body[tmp]);
        info.push('2018');
        vals.push(info);
        resolve();
      }));
    }
    Promise.all(promises).then(function(){
      var sql = "DELETE FROM STUDY WHERE (StudentIDl2, CourseIDl2, AcademicYearl2) IN (?)";
      db.query(sql, [vals], function(err, result){
        if(err){
          res.render('addanddelete', {
            err_msg: "DELETE data error"
          });
        }
        else{
          res.redirect('/student-info');
        }
      } );
    });
	}
});


module.exports = router;
