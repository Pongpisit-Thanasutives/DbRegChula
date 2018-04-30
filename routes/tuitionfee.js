const express = require('express');
const moment = require('moment');
const db = require('../db');
const { queryAsPromise } = require('../db-helper');
const { buildDataTableEndpoint } = require('./helper/data-table-helper');
const router = express.Router();
const pdf = require('html-pdf');

router.get('/', function(req, res){
  	// Get Faculty name + Department name
  	// Assume that now we are in 1/2018
  	var facultyCode = req.user.StudentID.slice(-2);
	var sql = 'SELECT * FROM FACULTY, CURRICULUM_STUDENT_INFO INNER JOIN REGISTER ON REGISTER.StudentIDl3 = CURRICULUM_STUDENT_INFO.StudentID4 WHERE FACULTY.FacultyCode = ' + facultyCode + ' AND CURRICULUM_STUDENT_INFO.StudentID4 = ' + req.user.StudentID + ' AND REGISTER.StudentIDl3 = ' + req.user.StudentID +'  order by AcademicYearl3 DESC, Terml3 DESC';
  console.log(sql);
	db.query(sql, function (err, result2) {
		if (err) {
			console.log(err);
		}
		var facultyName = result2[0].FacultyName;
		var departmentName = result2[0].CurriculumName4;
		var payStatus = result2[0].PaymentStatus;
		var paidAmount = 0;
		var academicYear = result2[0].AcademicYearl3;
		var term = result2[0].Terml3;

		// Get Payment amount
		var sql2 = "select * from CURRICULUM where CurriculumName = " + "'" + departmentName + "'" + ";";
		db.query(sql2, function (err, result) {
			if (err) {
        console.log(err);
			}
			var paymentAmount = result[0].PaymentAmount;
			var leftAmount = paymentAmount;
			var curriculumType = result[0].CurriculumType;
      var payInfo = [];
      for(let i=0;i<result2.length;i++){
        var str = "<pre><b>เทอม/ปี</b> "+result2[i].Terml3+"/"+result2[i].AcademicYearl3+" </br>";
        str += "<b>ทั้งหมด</b> " + paymentAmount +" </br>";
        if(result2[i].PaymentStatus == "PAID"){
          paidAmount = paymentAmount;
          leftAmount = 0;
        }
        str += "<b>ชำระแล้ว</b> "+paidAmount+" </br>";
        str += "<b>ค้างชำระ</b> "+leftAmount;
        if(result2[i].PaymentStatus == "PAID"){
          str += "</br><a href='./tuitionfee/receipt?name="+req.user.StudentFirstName+' '+req.user.StudentLastName
          +"&faculty="+facultyName+"&department="+departmentName+"&curriculum="+curriculumType
          +"&term="+result2[i].Terml3+"&year="+result2[i].AcademicYearl3+"&payamount="+paymentAmount+"'>"
          +"<button type='button' class='btn btn-primary' style='font-family: sans-serif;'> Receipt </button></a></pre>";
        }
        else{
          str += "</pre>";
        }
        payInfo.push(str);
      }
			// Render
			res.render('tuitionfee', {
				user: req.user,
				fullname: req.user.StudentFirstName + ' ' + req.user.StudentLastName,
				facultyname: facultyName,
				departmentname: departmentName,
				curriculuminfo: curriculumType + ' ' + facultyName + ' ' + departmentName,
				termandyear: term + '/' + academicYear,
				payamount: paymentAmount,
				paid: paidAmount,
				left: leftAmount,
        payInfo: payInfo
			});
		})
	})
});

router.get('/receipt', function(req, res){
  var str = "<!DOCTYPE html><html><body><h1>Receipt</h1>";
  str += "</body></html>";
});

module.exports = router;
