const express = require('express');

const router = express.Router();

router.get('/', function (req, res) {
  res.render('register', {
    user: req.user
  });
});	

router.post('/', function(req, res){
	var sid = req.user.StudentID;
	console.log(req.body);
});

// router.get('/mock-confirm', function(req, res){
//   res.render('confirm_register', {
//     user: req.user
//   });
// });

module.exports = router;
