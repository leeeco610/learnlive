/**
 * Created by lihaipeng on 15-10-17.
 */
var mongoose = require('mongoose');


var Schema = mongoose.Schema;  //创建模型
var userSchema = new Schema({
    userid:String,
    password:String
});  //定义了一个新的模型
exports.user = mongoose.model('user',userSchema);  //与users集合关联
