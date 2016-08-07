/**
 * Created by lihaipeng on 16/8/7.
 */
var express = require('express');
var router = express.Router();

var path = require('path');
var fs = require('fs');


router.get('/',function(req,res){
    var content = fs.readFileSync(path.join(__dirname, '../public/copy.txt'));
    res.render('copy', {content: content});
});


router.post('/save',function(req,res){
    var params = req.body;
    var content = params['content'];

    fs.writeFileSync(path.join(__dirname, '../public/copy.txt'), content);
    res.json({status: 1});
});



module.exports = router;