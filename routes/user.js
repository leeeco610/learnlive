var express = require('express');
var router = express.Router();

var User = require('../models/user').user;


//register
var register = function(req,res){
  var user = new User({
    username:req.body['username'],
    password:req.body['password']
  });
  user.save(function(err,user){
    if(!err){
      return res.redirect('/login.html');
    }
  });
};

//login
var login = function(req,res){
  User.find({
    username:req.body['username'],
    password:req.body['password']
  },function(err,users){
    if(err){
      res.status(500);
      res.render('error',{
        error:err
      });
    }else{
      if(users.length === 0){
        res.json({
          status:"fail",
          message:"用户名或密码错误",
          result:{}
        });
      }else{
        res.json({
          status:"ok",
          result:{}
        });
      }
    }
  });
};


router.post('/register',register);
router.post('/login', login);

module.exports = router;
