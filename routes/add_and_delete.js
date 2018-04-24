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

	// not working -> add section
	if(req.body['add_courses'] !== undefined){
		var num_delete_course = Object.keys(req.body).length;
		for(var prop in req.body){
			course_no = req.body[prop];
			// var sql = 'insert from study where StudentIDl2 = ' + sid + ' and CourseIDl2 = ' + course_no + ';';
		}
	}

	if(req.body['delete_courses'] !== undefined){
		// Delete
		var count = 0;
		var num_add_course = Object.keys(req.body).length;
		for(var prop in req.body){
			course_no = req.body[prop];
			var sql = 'delete from study where StudentIDl2 = ' + sid + ' and CourseIDl2 = ' + course_no + ';';
			
			db.query(sql, function (err, result) {
	    		if (err) {
	    			return next(err)
				}
				console.log('drop ' + course_no);
				count += 1;
			});
			
			if (count === num_add_course){
				console.log('DONE')
				res.end();
			}
		}
	}
});


module.exports = router;
