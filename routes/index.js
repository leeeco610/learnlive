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

//copy code
router.get('/copy.html', function(req, res, next) {
  res.redirect(301, '/copy');
});

//tools page
router.get('/tools.html',function(req,res,next){
  res.render('tools');
});

module.exports = router;
