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
	var sid = req.body.sid;

	var sql = 'delete from enrollment where sid = ' + sid + ' and course_no = ' + course_no + ';';

	db.query(sql, function (err, result) {
	    if (err) {
	    	return next(err)
		}
		console.log('Number of records deleted: ' + result.affectedRows);
		res.send('delete successfully')
	});
});


module.exports = router;
