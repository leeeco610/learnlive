/**
 * Created by lihaipeng on 16/3/16.
 */
var express = require('express');
var router = express.Router();


router.get('/',function(req,res){
    res.render('demo/index.html');
});


router.get(/^(\/)[\w|\W]+(.html)$/,function(req,res){
    res.render('mall'+req.url.split(".")[0]);
});

module.exports = router;