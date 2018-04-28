const express = require('express');

const router = express.Router();

router.get('/', function (req, res) {
  res.render('about', {
    user: req.user
  });
});

router.get('/testsync', function(req, res){
  for(let i=0;i<100;i++){
    console.log("i = "+i);
  }
  console.log("i'm outside");
});

module.exports = router;
