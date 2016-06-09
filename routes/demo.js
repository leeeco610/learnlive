/**
 * Created by lihaipeng on 16/3/16.
 */
var express = require('express');
var router = express.Router();


router.get('/',function(req,res){
    res.render('demo/index.html');
});


router.get('/upload',function(req,res){
    console.log(req.params);
});

module.exports = router;