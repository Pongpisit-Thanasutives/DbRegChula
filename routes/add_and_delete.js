const express = require('express');

const router = express.Router();

router.get('/', function (req, res) {
  res.render('addanddelete', {
    user: req.user
  });
});

router.post('/', function(req, res){
	var sid = req.user.StudentID;
	console.log(req.body);
	if(req.body['add_courses'] !== undefined){
		var num_add_course = Object.keys(req.body).length;
		for(var prop in req.body){
			course_no = req.body[prop];
			// var sql = 'insert from study where StudentIDl2 = ' + sid + ' and CourseIDl2 = ' + course_no + ';';
		}
		return;
	}
	if(req.body['delete_courses'] !== undefined){
		// Delete
		var num_add_course = Object.keys(req.body).length;
		for(var prop in req.body){
			course_no = req.body[prop];
			var sql = 'delete from study where StudentIDl2 = ' + sid + ' and CourseIDl2 = ' + course_no + ';';
			db.query(sql, function (err, result) {
	    		if (err) {
	    			return next(err)
				}
			});
		}
		console.log(add_courses)
		return;
	}
});


module.exports = router;
