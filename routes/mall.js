/**
 * Created by lihaipeng on 15/12/21.
 */
var express = require('express');
var router = express.Router();


router.get('/',function(req,res){
    res.render('mall/index.html');
});

router.get(/^(\/)[\w|\W]+(.html)$/,function(req,res){
    res.render('mall'+req.url.split(".")[0]);
});

module.exports = router;