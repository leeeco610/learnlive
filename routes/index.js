var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/index.html',function(req,res,next){
  res.render('index');
});

router.get('/login.html',function(req,res,next){
  res.render('login');
});


module.exports = router;
