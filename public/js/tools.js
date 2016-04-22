/**
 * Created by lihaipeng on 16/2/19.
 */

/***********************************************************
 * 对JavaScript中已有对象的扩展
 *
 ************************************************************/
//日期格式化
Date.prototype.format = function(format){
    var o = {
        "M+":this.getMonth()+1,  //month
        "d+":this.getDate(),  //day
        "h+":this.getHours(),  //hour
        "m+":this.getMinutes(),  //minite
        "s+":this.getSeconds(),  //second
        "q+":Math.floor((this.getMonth()+3)/3),  //quarter
        "S" :this.getMilliseconds()  //millisecond
    };
    if(/(y+)/.test(format)){
        format = format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o){
        if(new RegExp("("+k+")").text(format)){
            format = format.replace(RegExp.$1,RegExp.$1.length ==1 ? o[k]:("00"+o[k]).substr((""+o[k]).length));
        }
    }
    return format;
};


$.LUI = {};


/***********************************************************
 * 全局常量
 *
 ************************************************************/
+function($){
    $.LUI.constant = {
        reg:{
            mobile:/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        }
    };
}(Zepto || jQuery);


/***********************************************************
 * 获取URL上参数
 *
 ************************************************************/
+function($){
    "user strict";

    $.LUI.getUrlParam = function(){
        var reg = new RegExp("(^|&)"+name+"=([^&]*(*|$))","i");
        var r = window.location.search.substr(1).match(reg);
        if(r != null) return unescape(r[2]);
        return null;
    };
}(Zepto || jQuery);


/***********************************************************
 * 动态的创建命名空间
 * 用来减少全局变量
 ************************************************************/
+function($){
    "user strict";

    $.LUI.namespace = function(name){
        var parts = name.split(".");
        var current =  $.LUI;
        for(var i in parts){
            if(!current[parts[i]]){
                current[parts[i]] = {};
            }
            current = current[parts[i]];
        }
    }
}(Zepto || jQuery);


/***********************************************************
 * 单例模式（通用）
 * 适用场景：页面中需要创建唯一的iframe、script标签 或者唯一的弹窗等
 * fn -- 创建对象的方法
 * 例如：
 * var createDialog = function(){
 *      var div = document.createElement('div');
 *      div.innerHTML = "弹窗示例";
 *      div.style.display = "none";
 *      document.body.appendChild(div);
 *      return div;
 * }
 * $.LUI.getSingle(createDialog);
 ************************************************************/
+function($){
    $.LUI.getSingle = function(fn){
        var result;
        return function(){
            return result || (result = fn.apply(this,arguments));
        }
    }
}(Zepto || jQuery);


/***********************************************************
 * 数据上报
 * 调用方式：$.LUI.report("http://www.xxx.com/setPointer");
 ************************************************************/
+function($){
    "use strict";
    /**
     * src -- http请求url参数
     *
     * 使用闭包方式，是为了防止http请求还没有发送方法调用结束，
     * 导致进行上报的请求丢失（部分低版本浏览器回丢失30%左右）
     */
    $.LUI.report = (function(src){
        var imgs = [];
        return function(){
            var img = new Image();
            imgs.push(img);
            img.src = src;
        }
    })();
}(Zepto || jQuery);


/***********************************************************
 * 表单校验（使用策略模式实现）
 * 调用方式：
 * var validFunc = function(){
 *      var valid = new $.LUI.Validator();
 *      valid.add(username,[{
 *          strategy:"isNotEmpty",
 *          errrorMsg:"用户名不能为空"
 *      }]);
 *      var errorMsg = valid.start();
 *      return errorMsg;
 * }
 * ************************************************************/
+function($){
    "user strict";

    var reg = $.LUI.constant.reg;  //全局正则对象
    //策略对象
    var strategies = {
        isNotEmpty:function(value,errorMsg){
            if(value === ''){
                return errorMsg;
            }
        },
        minLength:function(value,length,errorMsg){
            if(value.length < length){
                return errorMsg;
            }
        },
        maxLength:function(value,length,errorMsg){
            if(value.length > length){
                return errorMsg;
            }
        },
        isMobile:function(value,errorMsg){
            if(!reg.mobile.test(value)){
                return errorMsg;
            }
        }
    };
    //Validator  校验
    var Validator = function(){
        this.cache = [];
    };
    Validator.prototype.add = function(dom){
        var self = this;
        for(var i=0,rule;rule = rules[i++];){
            (function(rule){
                var strategyAry = rule.strategy.split(":");
                var errorMsg = rule.errorMsg;
                self.cache.push(function(){
                    var strategy = strategyAry.shift();
                    strategyAry.unshift(dom.value);
                    strategyAry.push(errorMsg);
                    return strategies[strategy].apply(dom,strategyAry);
                });
            })(rule);
        }
    };
    Validator.prototype.start = function(){
        for(var i=0,validatorFunc;validatorFunc = this.cache[i++];){
            var errorMsg = validatorFunc();
            if(errorMsg){
                return errorMsg;
            }
        }
    };
    $.LUI.Validator = Validator;
}(Zepto || jQuery);
