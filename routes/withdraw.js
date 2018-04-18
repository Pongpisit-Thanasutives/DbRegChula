const express = require('express');
const router = express.Router();
const db = require('../db');
const dbHelper = require('../db-helper');
const { queryAsPromise } = require('../db-helper');

router.get('/', function(req, res){
	res.render('withdraw', {
		user: req.user
	});
});

router.post('/', function(req, res){
	var course_no = req.body.course_no;
	var sid = req.user.StudentID;

	// console.log(sid);
	// console.log(course_no)

	var sql = 'delete from study where StudentIDl2 = ' + sid + ' and CourseIDl2 = ' + course_no + ';';

	db.query(sql, function (err, result) {
	    if (err) {
	    	return next(err)
		}
		console.log('Number of records deleted: ' + result.affectedRows);
		res.send('ถอนรายวิชา ' + course_no + ' แล้ว');
	});
});


module.exports = router;
