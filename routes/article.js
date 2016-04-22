/**
 * Created by lihaipeng on 15-12-17.
 */
var express = require('express');
var router = express.Router();


router.get(/^(\/)[\w]+(.html)$/,function(req,res){
    res.render('article'+req.url.split(".")[0]);
});

module.exports = router;