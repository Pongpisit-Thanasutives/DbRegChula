const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
	res.render('tuitionfee', {
		user: req.user
	});
});

module.exports = router;