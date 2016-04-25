/**
 * Created by lihaipeng on 15/12/21.
 */
var express = require('express');
var router = express.Router();


router.get('/',function(req,res){
    res.render('mall/index.html');
});


router.get('/cookie.html',function(req,res){
    var paramArr = req.url.split('?');
    if(paramArr.length > 1 && paramArr[1]){
        try{
            var key = paramArr[1].split('=')[0];
            var val = paramArr[1].split('=')[1];
            if(key === 'JHome-TOKEN'){
                res.setHeader('Set-Cookie',[key+'='+val+';path=/;']);
            }
        }catch(e){
            //console.log(e);
        }
    }
    res.render('mall/cookie.html');
});

router.get(/^(\/)[\w|\W]+(.html)$/,function(req,res){
    res.render('mall'+req.url.split(".")[0]);
});

module.exports = router;