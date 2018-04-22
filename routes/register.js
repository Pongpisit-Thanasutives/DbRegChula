const express = require('express');

const router = express.Router();

router.get('/', function (req, res) {
  res.render('register', {
    user: req.user
  });
});

router.get('/mock-confirm', function(req, res){
  res.render('confirm_register', {
    user: req.user
  });
});

module.exports = router;
