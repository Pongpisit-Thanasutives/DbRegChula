const express = require('express');
const moment = require('moment');
const db = require('../db');
const { queryAsPromise } = require('../db-helper');
const { buildDataTableEndpoint } = require('./helper/data-table-helper');
const router = express.Router();

router.get('/', function(req, res){
  	// Get Faculty name + Department name
  	// Assume that now we are in 1/2018
  	var facultyCode = req.user.StudentID.slice(-2);
	var sql = 'select * from FACULTY, CURRICULUM_STUDENT_INFO inner join REGISTER on REGISTER.StudentIDl3 = CURRICULUM_STUDENT_INFO.StudentID4 where FACULTY.FacultyCode = ' + facultyCode + ' and CURRICULUM_STUDENT_INFO.StudentID4 = ' + req.user.StudentID + ' and REGISTER.StudentIDl3 = ' + req.user.StudentID + ' and REGISTER.AcademicYearl3 = 2018 and REGISTER.Terml3 = 1' + ';';
	db.query(sql, function (err, result) {
		if (err) {
			return next(err);
		}
		var facultyName = result[0].FacultyName;
		var departmentName = result[0].CurriculumName4;
		var payStatus = result[0].PaymentStatus;
		var paidAmount = 0;
		var academicYear = result[0].AcademicYearl3;
		var term = result[0].Terml3;

		// Get Payment amount
		var sql2 = "select * from CURRICULUM where CurriculumName = " + "'" + departmentName + "'" + ";";
		db.query(sql2, function (err, result) {	
			if (err) {
				return next(err);
			}
			var paymentAmount = result[0].PaymentAmount;
			var leftAmount = paymentAmount
			var curriculumType = result[0].CurriculumType;
			if (payStatus === 'PAID'){
				paidAmount = paymentAmount;
				leftAmount = 0;
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
				left: leftAmount
			});
		})
	})
});

module.exports = router;