﻿/**
 * 主要用于移动端
 * 引入前需引入Jquery  或 Zepto
 * Created by Leeeco on 2015/9/25.
 */
var domain = "";
//=================================扩展方法=================================
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};
//==============================jQ公用插件==========================================
/**********************************************************
 *     设置元素动画时间
 *********************************************************/
$.fn.setAnimationTime = function(time){
    if(this.length == 0) return ;
    return $.each(this,function(i,e){
        if(time == 0 || time == "none" || time == null){
            e.style.webkitTransition = "none";
            e.style.transition = "none";
        }else{
            e.style.webkitTransition = "all "+time+"s ease";
            e.style.transition = "all "+time+"s ease";
        }
    });
};
/**********************************************************
 * 当前设备浏览器监测
 * @type {{versions: {qq, uc, weibo, weixin, trident, presto, webKit, gecko, mobile, ios, android, iPhone, iPad, webApp}, isAndroid: $.brower.isAndroid, isIOS: $.brower.isIOS, isPC: $.brower.isPC, isWeixin: $.brower.isWeixin, isQQ: $.brower.isQQ, isWeibo: $.brower.isWeibo}}
 *********************************************************/
$.brower = {
    versions: function() {
        var u = navigator.userAgent,ua = u.toLowerCase(),app = navigator.appVersion;
        return {//移动终端浏览器版本信息
            qq:ua.indexOf('qq') > -1,  //QQ浏览器-mqqbrowser,  QQ空间-qq
            uc:ua.indexOf('ucbrowser') > -1,  //UC浏览器
            weibo:ua.indexOf('weibo') > -1,  //新浪微博中打开
            weixin: ua.indexOf('micromessenger') > -1, //微信
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
    }(),
    isAndroid:function(){
        return $.browser.versions.android;
    },
    isIOS:function(){
        return $.browser.versions.ios || $.browser.versions.iPhone || $.browser.versions.iPad;
    },
    isPC:function(){
        return /(WindowsNT)|(Windows NT)|(Macintosh)/i.test(navigator.userAgent);
    },
    isWeixin:function(){
        return $.browser.versions.weixin;
    },
    isQQ:function(){
        return $.browser.versions.qq;
    },
    isWeibo:function(){
        return $.browser.versions.weibo;
    }
};
/***************************************
 *  常用正则
 **************************************/
$.commmonReg = {
    phoneNumber: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/   //电话号码（包括手机号码）
};
/**========================================
 ********* 获取当前URL参数  **********
 =========================================*/
$.getUrlParam = function(name){
    //构造一个含有目标参数的正则表达式对象
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    //匹配目标参数
    var r = window.location.search.substr(1).match(reg);
    //返回参数值
    if (r != null) return unescape(r[2]);
    return null;
};
/***************************************
 * 输入框元素获得焦点
 ***************************************/
$.fn.domFocus = function () {
    var length;
    if ($.isIOS() && this.setSelectionRange) {
        length = this.value.length;
        this.setSelectionRange(length, length);
    } else {
        this.focus();
    }
};
/******************************************
 * 微信端分享弹层
 *****************************************/
$.wechatSharePage = function () {
    var winH = $(window).height(),
        html='';
    html+='<div id="sharewarp" style="position: fixed;top:0;left:0;z-index: 99999;height:100px;width: 100%;height:'+winH+'px;background: rgba(0,0,0,0.6);">';
    html+=   '<p style="padding: 15px 20px 20px; background:#fff;text-align:right;margin: 0;"><span style="display:inline-block;font-family:Microsoft Yahei;padding-right: 20px;font-size: 17px;color: #212121">点击右上角，分享到朋友圈</span><img src="/public/img/iconfont-jiantou.png" style="height: 60px;"> </p>';
    html+='</div>';
    $("body").css("overflow","hidden").append($(html));
    var $allPage = $("div[data-role='page']");
    $allPage.css({"overflow-y":"hidden","max-height":"100%"});

    $("#sharewarp").click(function () {
        $("body").css("overflow","auto");
        $allPage.css({"overflow-y":"auto","max-height":"auto"});
        $(this).remove();
    });
};
/**===========================================
 * ******  时间格式化一种  ***********
 =============================================*/
$.dateFormatStr = function(time){  //一种时间格式化
    time = parseFloat(time);
    var current = new Date();
    var duration = current.getTime() - time;
    if (duration > 0 && duration < 3 * 60 * 1000)
        return "刚刚";
    else if(duration >= 3 * 60 * 1000 && duration < 60 * 60 *1000)
        return parseInt(duration/(60*1000))+"分钟以前";
    else if(duration >= 60 * 60 * 1000 && duration < 24 * 60 * 60 *1000)
        return parseInt(duration/(60*60*1000))+"小时以前";
    else if(duration >= 24 * 60 * 60 * 1000 && duration < 48 * 60 * 60 *1000)
        return "昨天";
    else
        return new Date(time).format("yyyy-MM-dd");
}
/*******************************************
 *  对Cookie的操作
 *****************************************/
$.getsec = function (str) {
    var str1=str.substring(1,str.length)*1;
    var str2=str.substring(0,1);
    if (str2=="s")
    {
        return str1*1000;
    }
    else if(str2 == "m"){
        return str1*60*1000;
    }
    else if (str2=="h")
    {
        return str1*60*60*1000;
    }
    else if (str2=="d")
    {
        return str1*24*60*60*1000;
    }
};
$.getCookie = function(name){  //获取cookie
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
};
$.delCookie = function(name){  //删除cookie
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval= $.getCookie(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
};
$.setCookie = function(name,value,time){  //设置cookie
    var strsec = $.getsec(time);
    var exp = new Date();
    exp.setTime(exp.getTime() + strsec*1);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
};
/***************************************
 * 锁屏
 ***************************************/
$.lockScreen = function () {
    $("body").prepend('<div class="lock-screen animated fadeIn" id="lockScreen"></div>');
};
/*****************************************
 * 解除锁屏
 ******************************************/
$.unlockScreen = function () {
    var $ls = $("#lockScreen");
    $ls.removeClass("fadeIn").addClass("animated fadeOut");
    setTimeout(function () {
        $ls.remove();
    },600);
};
/*********************************************
 *  一个简单的Dialog弹窗插件
 **********************************************/
//弹窗关闭
$.simpleDialogClose = function () {
    $.unlockScreen();
    var $dialog = $(".simple-dialog");
    $dialog.find(".simple-dialog-outer").removeClass("zoomIn").addClass("zoomOut");
    $('body').css({overflow: 'auto'});
    setTimeout(function(){
        $dialog.remove();
    },600);
};
//弹窗Dialog
$.simpleDialog = function (args) {
    var def = {};

    if(typeof args == "string"){
        def.content=args;
        def.contentMiddle = true;
    }else{
        $.extend(def ,args);
    }

    var lock = typeof def.lock !== "undefined" ? def.lock : true,  //是否锁屏
        isDrag = typeof def.isDrag !== "undefined" ? def.isDrag : false,  //是否允许拖动
        zIndex = def.zIndex || 19899,  //z-index
        timeout = def.timeout;
        id = def.id || "simpleDialog",  //ID
        title = def.title || "提示",  //title
        content =def.content || "内容...",  //content
        dialogW = def.width?parseInt(args.width,10):"600",
        dialogT = def.top || null,
        contentMiddle = typeof def.contentMiddle !== "undefined" ? def.contentMiddle : false;  //内容是否以flex box布局居中
        bgClose = typeof def.bgClose !== 'undefined'?def.lock : false;
        bgCloseCallback = def.bgCloseCallback || function(){};
        btnArr = def.btn || [{name:"关闭"}]; //按钮

    //reset
    $.unlockScreen();
    $.simpleDialogClose();

    //button
    var htmlBtnArr = [];
    var btnIndex = 0;
    $.each(btnArr,function(i,e){
        btnIndex ++;  //按钮个数
        if(i == 0){
            htmlBtnArr[0] = '<a title="'+ e.name+'" index="'+i+'" style="'+(e.css || "")+'">'+ e.name+'</a>';
        }else{
            htmlBtnArr[1] = '<a title="'+ e.name+'" index="'+i+'" style="'+(e.css || '')+'">'+ e.name+'</a>';
        }
        //关闭窗口
        e.close = function(){
            $.simpleDialogClose();
        };
    });

    /*
     * 弹窗主体
     */
    var htmlArr = [];
    //锁屏
    if(lock){
        $.lockScreen();
    }
    //弹窗
    htmlArr.push('<div class="simple-dialog" id="'+id+'">');
    htmlArr.push('<div class="simple-dialog-outer animated zoomIn">');
    htmlArr.push('  <div class="simple-dialog-header">');
    htmlArr.push('      <div class="sdh-left">'+title+'</div>');
    htmlArr.push('      <div class="sdh-right"><a class="btn-close" title="关闭">&times;</a></div>');
    htmlArr.push('  </div>');
    htmlArr.push('  <div class="simple-dialog-body clearfix">'+content+'</div>');
    htmlArr.push('  <div class="simple-dialog-footer">');
    htmlArr.push('      <div class="sdf-btn">'+htmlBtnArr.join('')+'</div>');
    htmlArr.push('  </div>');
    htmlArr.push('</div>');
    htmlArr.push('</div>');
    $("body").prepend(htmlArr.join('')).css({overflow: 'hidden'});
    var $dialog = $("#"+id);

    $dialog.focus();

    var winH = $(window).height();
    var dH = $dialog.height();
    if(!dialogT){
        dialogT = (winH - dH)/2;
    }

    //设置弹出窗样式
    $dialog.css({zIndex:zIndex}).css({top:dialogT.toString().indexOf("%")>-1?dialogT:parseInt(dialogT,10)+"px"});
        // .find(".simple-dialog-outer").css({width:dialogW});
    if(contentMiddle) {
        $dialog.find(".simple-dialog-body").addClass("display-flex");
    }
    //按ESC键关闭弹窗
    $(window).off('keyup').on('keyup',function (e) {
        if(e.keyCode == 27){
            $.simpleDialogClose();
            bgCloseCallback();
        }
    });
    //点击关闭按钮
    $dialog.find('.btn-close').off('click').on('click',function () {
        $.simpleDialogClose();
        bgCloseCallback();
    });
    //按钮点击事件
    $dialog.find(".sdf-btn a").click(function(){
        var i = $(this).attr("index");
        if(btnArr[i].callback){
            var result = btnArr[i].callback();
            if(result === false)return false;
            btnArr[i].close.call(this);
        }else{
            $.simpleDialogClose();
            bgCloseCallback();
        }
    });
    //点击蒙版层，窗口页随之关闭
    if(lock && bgClose){
        $("#lockScreen").click(function () {
            $.simpleDialogClose();
            bgCloseCallback();
        });
    }
    //是否自动关闭
    if(timeout && parseInt(timeout) > 0){
        var timer = setTimeout(function () {
            $.simpleDialogClose();
            bgCloseCallback();
            timer = null;
        },parseInt(timeout));
    }

    //弹窗拖动
    if(isDrag){
        var disX = 0;
        var disY = 0;
        $dialog.find(".simple-dialog-header").css({cursor:"move"})
            .bind({
                mousedown:function(evt){
                    var e = evt || window.event, tag = e.target || e.srcElement, tagName = tag.tagName.toLowerCase();
                    if(tagName == "a"){  //防止鼠标在关闭按钮上按下，也可以拖动窗口BUG
                        return false;
                    }

                    disX = e.clientX - $dialog[0].offsetLeft;
                    disY = e.clientY - $dialog[0].offsetTop;

                    if ($dialog[0].setCapture) $dialog[0].setCapture(); //IE8以下版本有选中内容出现的bug  全局捕获

                    //事件加在oDiv上，会由拖动过快导致不跟随的bug
                    document.onmousemove = function(evt) {
                        var e = evt || window.event;
                        $dialog[0].style.left = e.clientX - disX + 'px';
                        $dialog[0].style.top = e.clientY - disY + 'px';
                    };

                    document.onmouseup = function() {
                        document.onmousemove = null;
                        document.onmouseup = null;

                        if ($dialog[0].releaseCapture) $dialog[0].releaseCapture(); //IE8以下版本有选中内容出现的bug  释放全局捕获
                    };

                    return false; //解决拖拽图片bug (阻止默认事件)
                },
                mouseover:function(){
                    this.style.cursor = "move";
                },
                mouseout:function(){
                    this.style.cursor = "default";
                }
        });
    }
};
/**====================================================
 *************** 图片懒加载  ***************************
 * 使用方式: img变迁使用data-url  添加class='lazy-loading'
 * 调用方式: $('lazy-loading').lazyLoading();
 ======================================================*/
+function () {
    'use strict';

    $.fn.lazyLoading = function (options) {
        var defaults = {attr: "data-url", container: $(window), callback: $.noop};
        var params = $.extend({}, defaults, options || {});
        params.cache = [];
        $(this).each(function () {
            var node = this.nodeName.toLowerCase(), url = $(this).attr(params["attr"]);
            var data = {obj: $(this), tag: node, url: url};
            params.cache.push(data)
        });
        var callback = function (call) {
            if ($.isFunction(params.callback)) {
                params.callback.call(call.get(0))
            }
        };
        var loading = function () {
            var contop;
            var contHeight = params.container.height();
            if (params.container.get(0) === window) {
                contop = $(window).scrollTop()
            } else {
                contop = params.container.offset().top
            }
            $.each(params.cache, function (i, data) {
                var o = data.obj, tag = data.tag, url = data.url, post, posb;
                if (o) {
                    post = o.parent().offset().top - contop;
                    posb = post + o.height();
                    if ((post >= 0 && post < contHeight) || (posb > 0 && posb <= contHeight)) {
                        if (url) {
                            if (tag === "img") {
                                callback(o.attr("src", url))
                            } else {
                                o.load(url, {}, function () {
                                    callback(o)
                                })
                            }
                        } else {
                            callback(o)
                        }
                        data.obj = null
                    }
                }
            })
        };
        loading();
        params.container.bind("scroll", loading)
    };

    //全局调用
    $(function () {$('.lazy-loading').lazyLoading()});
}();
/****************************************************************
 * 图片延迟加载 使用方法:元素上加 data-src=""  或  data-background=""
 ************************************************************/
+function () {
    "use strict";
    window.addEventListener('load',function () {
        var $delayImg = $('.delay-loading');
        $delayImg.each(function () {
            var src = this.dataset.src;
            if(typeof src != "undefined"){
                $(this).attr('src',src);
            }
            var bg = this.dataset.background;
            if(typeof bg != "undefined"){
                $(this).css("background-image",bg);
            }
        });
    },false);
}();
/**=========================================
 * @param btnID  上传控件ID不用带#   必填
 * @param type  类型  必填
 * @param maxSize  图片大小限制默认10M   非必填
 * @param showImg  上传成功后显示图片位置ID不用#号,   非必填
 ========================================================*/
$.imgUpload = function(btnID,type,maxSize,showImg,fn){
    //销毁已有实例
    var $btn = $("#"+btnID);
    var old_uploader = $btn.data("uploader");
    old_uploader && typeof old_uploader.destroy === "function" && old_uploader.destroy();

    fn = fn || function(){};
    maxSize = maxSize || "10mb";
    var ajaxErrorHandle = function(res){
        console.log(res);
    };

    var file_ext = "jpg,jpeg,gif,png";
    var uploader = new plupload.Uploader({
        runtimes : 'html5,html4,flash,silverlight',  //
        browse_button : btnID, //ID不用带#
        url : domain+'/v1/image/upload?type='+type,
        flash_swf_url : '../js/Moxie.swf',
        silverlight_xap_url : '../js/Moxie.xap',
        filters : {
            max_file_size : '100mb',
            mime_types: [
                {title : "Image files", extensions : file_ext}
            ]
        }
    });
    $btn.data("uploader",uploader);
    //初始化
    uploader.init();
    //添加文件
    uploader.bind("FilesAdded",function(up,files){
        plupload.each(files, function(file) {
            var _imgSize = parseFloat(maxSize);
            if(~maxSize.indexOf("mb")){
                _imgSize = parseFloat(maxSize)*1024*1024;
            }else if(~maxSize.indexOf("kb")){
                _imgSize = parseFloat(maxSize)*1024;
            }
            var flag = false;
            $.each(file_ext.split(','),function(){
                if(~(file.name.indexOf("."+this))){
                    flag = true;
                    return false;
                }
            });
            if(!flag){
                up.removeFile(file.id);
                Common.lhpShortMessage({msg:"上传图片格式有误",top:"45%"});
                return false;
            }
            if(file.size > _imgSize){
                up.removeFile(file.id);
                Common.lhpShortMessage({msg:"上传图片不能大于"+maxSize,top:"45%"});
                return false;
            }

            //开始上传
            uploader.start();
            $.showPreloader("上传中...0%");
        });
    });
    //上传进度事件
    uploader.bind("UploadProgress",function(up, file){
        var text = "上传中..."+file.percent+"%";
        var $preloader = $(".modal-no-buttons");
        if($.length > 0){
            $preloader.find(".modal-title").text(text);
        }else{
            $.showPreloader(text);
        }
    });
    //文件上传完成
    uploader.bind("FileUploaded",function(up,file,res){
        $.hidePreloader();
        var resp = JSON.parse(res.response);
        if(resp.code == "s_ok"){
            var r = resp.result;
            var uri = r.image_uris[0];
            var img_url='';
            if(r.image_domain && uri){
                img_url = r.image_domain+ uri;
                if(showImg){
                    $("#"+showImg).attr("src",img_url).attr("data-relsrc", uri);
                }
            }
            fn(uri,img_url);
        }else{
            ajaxErrorHandle(resp);
        }
    });
    //文件上传出错
    uploader.bind("Error",function(up, err){
        $.hidePreloader();
        alert(err.message);
    });
};
/**====================================================
 ***************  图片裁剪插件  ************************
 ======================================================*/
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory($);
    }
}(function ($) {
    var imageCrop = function(options, el){
        var el = el || $(options.imageBox),
            obj =
            {
                state : {},
                ratio : 1,
                options : options,
                imageBox : el,
                thumbBox : el.find(options.thumbBox),
                spinner : el.find(options.spinner),
                image : new Image(),
                getDataURL: function ()
                {
                    var width = this.thumbBox.width(),
                        height = this.thumbBox.height(),
                        canvas = document.createElement("canvas"),
                        dim = el.css('background-position').split(' '),
                        size = el.css('background-size').split(' '),
                        dx = parseInt(dim[0]) - el.width()/2 + width/2,
                        dy = parseInt(dim[1]) - el.height()/2 + height/2,
                        dw = parseInt(size[0]),
                        dh = parseInt(size[1]),
                        sh = parseInt(this.image.height),
                        sw = parseInt(this.image.width);

                    canvas.width = width;
                    canvas.height = height;
                    var context = canvas.getContext("2d");
                    context.drawImage(this.image, 0, 0, sw, sh, dx, dy, dw, dh);
                    var imageData = canvas.toDataURL('image/png');
                    return imageData;
                },
                getBlob: function()
                {
                    var imageData = this.getDataURL();
                    var b64 = imageData.replace('data:image/png;base64,','');
                    var binary = atob(b64);
                    var array = [];
                    for (var i = 0; i < binary.length; i++) {
                        array.push(binary.charCodeAt(i));
                    }
                    return  new Blob([new Uint8Array(array)], {type: 'image/png'});
                },
                zoomIn: function ()
                {
                    this.ratio*=1.1;
                    setBackground();
                },
                zoomOut: function ()
                {
                    this.ratio*=0.9;
                    setBackground();
                }
            },
            setBackground = function()
            {
                var w =  parseInt(obj.image.width)*obj.ratio;
                var h =  parseInt(obj.image.height)*obj.ratio;

                var pw = (el.width() - w) / 2;
                var ph = (el.height() - h) / 2;

                el.css({
                    'background-image': 'url(' + obj.image.src + ')',
                    'background-size': w +'px ' + h + 'px',
                    'background-position': pw + 'px ' + ph + 'px',
                    'background-repeat': 'no-repeat'});
            },
            imgMouseDown = function(e)
            {
                e.stopImmediatePropagation();

                obj.state.dragable = true;
                obj.state.mouseX = e.clientX;
                obj.state.mouseY = e.clientY;
            },
            imgMouseMove = function(e)
            {
                e.stopImmediatePropagation();

                if (obj.state.dragable)
                {
                    var x = e.clientX - obj.state.mouseX;
                    var y = e.clientY - obj.state.mouseY;

                    var bg = el.css('background-position').split(' ');

                    var bgX = x + parseInt(bg[0]);
                    var bgY = y + parseInt(bg[1]);

                    el.css('background-position', bgX +'px ' + bgY + 'px');

                    obj.state.mouseX = e.clientX;
                    obj.state.mouseY = e.clientY;
                }
            },
            imgMouseUp = function(e)
            {
                e.stopImmediatePropagation();
                obj.state.dragable = false;
            },
            zoomImage = function(e)
            {
                e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0 ? obj.ratio*=1.1 : obj.ratio*=0.9;
                setBackground();
            };

        obj.spinner.show();
        obj.image.onload = function() {
            obj.spinner.hide();
            setBackground();

            el.bind('mousedown', imgMouseDown);
            el.bind('mousemove', imgMouseMove);
            $(window).bind('mouseup', imgMouseUp);
            el.bind('mousewheel DOMMouseScroll', zoomImage);
        };
        obj.image.src = options.imgSrc;
        el.on('remove', function(){$(window).unbind('mouseup', imgMouseUp)});

        return obj;
    };

    $.fn.imageCrop = function(options){
        return new imageCrop(options, this);
    };

    /*=======================================*/
    var imageCropDialog = function (options,el) {
        var def_opt = {
            showPic:'#userPic',
            thumbBox: '.thumbBox',
            spinner: '.spinner',
            imgSrc: 'img/user_pic.png',
            btnCrop:'.btn-crop',
            btnZoomIn:'.btn-zoomIn',
            btnZoomOut:'.btn-zoomOut',
            preView:'.cropped',
            callback:function () {}
        };
        var cropper;
        options = $.extend(def_opt,options);
        el = el ||  $(options.imageBox)[0];
        var createDialog = function (callback) {
            var arr = [];
            arr.push('<div class="imageBox-container" id="imageBoxContainer">');
            arr.push('  <div class="imageBox">');
            arr.push('      <div class="thumbBox"></div>');
            arr.push('      <div class="spinner">Loading...</div>');
            arr.push('  </div>');
            arr.push('  <div class="action">');
            arr.push('      <input type="button" title="缩小" class="btn-zoomOut" value="-">');
            arr.push('      <input type="button" title="放大" class="btn-zoomIn" value="+">');
            arr.push('      <input type="button" title="预览" class="btn-crop" value="预览">');
            arr.push('  </div>');
            arr.push('  <div class="cropped"></div>');
            arr.push('</div>');

            //dialog
            $.simpleDialog({
                title:"编辑图像",
                content:arr.join(''),
                btn:[
                    {
                        name:'确定',
                        callback:function () {
                            var img = cropper.getDataURL();
                            $(options.showPic).attr('src',img);
                            options.callback();
                            $.simpleDialogClose();
                            var elID = $(el).attr('id');
                            $(el).replaceWith('<input id="'+elID+'" type="file">');
                            $('#'+elID).imageCropDialog(options);
                            return false;
                        }
                    }
                ]
            });

            typeof callback === "function" && callback();
        };
        //change
        var changeHandle = function () {
            var self = this;
            var readFile = function () {
                var $box = $("#imageBoxContainer");
                var reader = new FileReader();
                reader.onload = function(e) {
                    options.imgSrc = e.target.result;
                    cropper = $box.find('.imageBox').imageCrop(options);
                    //preview
                    setTimeout(function () {
                        $box.find(options.btnCrop).trigger('click');
                    },300);
                };
                reader.readAsDataURL(self.files[0]);
                // self.files = []

                //click  event
                $box.find(options.btnCrop).off('click').on('click', function(){
                    var img = cropper.getDataURL();
                    $box.find(options.preView).html('<div class="preview-text">预览</div><img src="'+img+'">');
                });
                $box.find(options.btnZoomIn).off('click').on('click', function(){
                    cropper.zoomIn();
                });
                $box.find(options.btnZoomOut).off('click').on('click', function(){
                    cropper.zoomOut();
                })

            };
            createDialog(readFile);
        };
        $(el).off('change').on('change',changeHandle);
    };
    $.fn.imageCropDialog = function (options) {
        return new imageCropDialog(options,this);
    }
}));
/**====================================================
 ***************  requestAnimationFrame  *********
 ======================================================*/
+function () {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // name has changed in Webkit
            window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}();
/**====================================================
 ***************  输入框--宽度根据内容自适应 *********
 ======================================================*/
+function ($) {
    var inputHandle = function () {
        var val = $(this).val();
        if(!$.isNumeric(val)){
            $(this).val(function () {
                return (val+"").substring(0,(val+"").length-1);
            });
            return false;
        }
        var $ic = $(this).siblings('.input-content');
        $ic.text(val);
        var currentW = $ic.width();
        var $parent = $(this).parent();
        var $unit = $(this).siblings('.unit');
        var parentW = $parent.width();//内容宽度不计算border parseInt($parent.css('border-width'))*2;
        var unitW = $unit.width() + parseInt($unit.css('padding-left'))+parseInt($unit.css('padding-right'))+parseInt($unit.css('border-width'))*2;
        var maxW = parentW - unitW - parseInt($(this).css('padding-left')) - parseInt($(this).css('padding-right'));

        if(currentW > 30 && currentW < (maxW-15)){  //右侧预留15个像素
            $(this).width($ic.width());
        }
    };
    var focusHandle = function () {
        var $ic = $(this).siblings('.input-content');
        var $unit = $(this).siblings('.unit');
        var icW = $ic.width();
        if(icW < 50){
            $(this).width(30);
            $unit.css({display:'inline-block'});
        }
    };
    var blurHandle = function (e) {
        var val = $.trim($(this).val());
        var $unit = $(this).siblings('.unit');
        if(val === ""){
            $(this).css({width:'100%'}).val('');
            $unit.hide();
        }
    };
    var keydownHandle = function (e) {
        if(e.keyCode == 8){
            inputHandle.call(this);
        }
    };
    var keyupHandle = function (e) {
        if(e.keyCode == 8){
            var val = $(this).val();
            var $ic = $(this).siblings('.input-content');
            $ic.text(val);
        }
    };
    var input = typeof window.onpropertychange === "undefined" ? "input":"propertychange";
    $(document).on('focus','input[data-width="auto"]',focusHandle);
    $(document).on('blur','input[data-width="auto"]',blurHandle);
    $(document).on(input,'input[data-width="auto"]',inputHandle);
    $(document).on('keydown','input[data-width="auto"]',keydownHandle);
    $(document).on('keyup','input[data-width="auto"]',keyupHandle);
}($);
/**======================================================
 ************   Modals   ************
 ======================================================*/
+function ($) {
    "use strict";

    function __dealCssEvent(eventNameArr, callback) {
        var events = eventNameArr,
            i, dom = this;// jshint ignore:line

        function fireCallBack(e) {
            /*jshint validthis:true */
            if (e.target !== this) return;
            callback.call(this, e);
            for (i = 0; i < events.length; i++) {
                dom.off(events[i], fireCallBack);
            }
        }
        if (callback) {
            for (i = 0; i < events.length; i++) {
                dom.on(events[i], fireCallBack);
            }
        }
    }
    $.fn.animationEnd = function(callback) {
        __dealCssEvent.call(this, ['webkitAnimationEnd', 'animationend'], callback);
        return this;
    };
    $.fn.transitionEnd = function(callback) {
        __dealCssEvent.call(this, ['webkitTransitionEnd', 'transitionend'], callback);
        return this;
    };
    $.fn.transition = function(duration) {
        if (typeof duration !== 'string') {
            duration = duration + 'ms';
        }
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransitionDuration = elStyle.MozTransitionDuration = elStyle.transitionDuration = duration;
        }
        return this;
    };
    $.fn.transform = function(transform) {
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransform = elStyle.MozTransform = elStyle.transform = transform;
        }
        return this;
    };
    //===
    var _modalTemplateTempDiv = document.createElement('div');

    $.modalStack = [];

    $.modalStackClearQueue = function () {
        if ($.modalStack.length) {
            ($.modalStack.shift())();
        }
    };
    $.modal = function (params) {
        params = params || {};
        var modalHTML = '';
        var buttonsHTML = '';
        if (params.buttons && params.buttons.length > 0) {
            for (var i = 0; i < params.buttons.length; i++) {
                buttonsHTML += '<span class="modal-button' + (params.buttons[i].bold ? ' modal-button-bold' : '') + '">' + params.buttons[i].text + '</span>';
            }
        }
        var extraClass = params.extraClass || '';
        var titleHTML = params.title ? '<div class="modal-title">' + params.title + '</div>' : '';
        var textHTML = params.text ? '<div class="modal-text">' + params.text + '</div>' : '';
        var afterTextHTML = params.afterText ? params.afterText : '';
        var noButtons = !params.buttons || params.buttons.length === 0 ? 'modal-no-buttons' : '';
        var verticalButtons = params.verticalButtons ? 'modal-buttons-vertical' : '';
        modalHTML = '<div class="modal ' + extraClass + ' ' + noButtons + '"><div class="modal-inner">' + (titleHTML + textHTML + afterTextHTML) + '</div><div class="modal-buttons ' + verticalButtons + '">' + buttonsHTML + '</div></div>';

        _modalTemplateTempDiv.innerHTML = modalHTML;

        var modal = $(_modalTemplateTempDiv).children();

        $(defaults.modalContainer).append(modal[0]);

        // Add events on buttons
        modal.find('.modal-button').each(function (index, el) {
            $(el).on('click', function (e) {
                if (params.buttons[index].close !== false) $.closeModal(modal);
                if (params.buttons[index].onClick) params.buttons[index].onClick(modal, e);
                if (params.onClick) params.onClick(modal, index);
            });
        });
        $.openModal(modal);
        return modal[0];
    };
    $.alert = function (text, title, callbackOk) {
        if (typeof title === 'function') {
            callbackOk = arguments[1];
            title = undefined;
        }
        return $.modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            buttons: [ {text: defaults.modalButtonOk, bold: true, onClick: callbackOk} ]
        });
    };
    $.confirm = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
            callbackCancel = arguments[2];
            callbackOk = arguments[1];
            title = undefined;
        }
        return $.modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            buttons: [
                {text: defaults.modalButtonCancel, onClick: callbackCancel},
                {text: defaults.modalButtonOk, bold: true, onClick: callbackOk}
            ]
        });
    };
    $.prompt = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
            callbackCancel = arguments[2];
            callbackOk = arguments[1];
            title = undefined;
        }
        return $.modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            afterText: '<input type="text" class="modal-text-input">',
            buttons: [
                {
                    text: defaults.modalButtonCancel
                },
                {
                    text: defaults.modalButtonOk,
                    bold: true
                }
            ],
            onClick: function (modal, index) {
                if (index === 0 && callbackCancel) callbackCancel($(modal).find('.modal-text-input').val());
                if (index === 1 && callbackOk) callbackOk($(modal).find('.modal-text-input').val());
            }
        });
    };
    $.modalLogin = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
            callbackCancel = arguments[2];
            callbackOk = arguments[1];
            title = undefined;
        }
        return $.modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            afterText: '<input type="text" name="modal-username" placeholder="' + defaults.modalUsernamePlaceholder + '" class="modal-text-input modal-text-input-double"><input type="password" name="modal-password" placeholder="' + defaults.modalPasswordPlaceholder + '" class="modal-text-input modal-text-input-double">',
            buttons: [
                {
                    text: defaults.modalButtonCancel
                },
                {
                    text: defaults.modalButtonOk,
                    bold: true
                }
            ],
            onClick: function (modal, index) {
                var username = $(modal).find('.modal-text-input[name="modal-username"]').val();
                var password = $(modal).find('.modal-text-input[name="modal-password"]').val();
                if (index === 0 && callbackCancel) callbackCancel(username, password);
                if (index === 1 && callbackOk) callbackOk(username, password);
            }
        });
    };
    $.modalPassword = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
            callbackCancel = arguments[2];
            callbackOk = arguments[1];
            title = undefined;
        }
        return $.modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            afterText: '<input type="password" name="modal-password" placeholder="' + defaults.modalPasswordPlaceholder + '" class="modal-text-input">',
            buttons: [
                {
                    text: defaults.modalButtonCancel
                },
                {
                    text: defaults.modalButtonOk,
                    bold: true
                }
            ],
            onClick: function (modal, index) {
                var password = $(modal).find('.modal-text-input[name="modal-password"]').val();
                if (index === 0 && callbackCancel) callbackCancel(password);
                if (index === 1 && callbackOk) callbackOk(password);
            }
        });
    };
    $.showPreloader = function (title) {
        $.hidePreloader();
        $.showPreloader.preloaderModal = $.modal({
            title: title || defaults.modalPreloaderTitle,
            text: '<div class="preloader"></div>'
        });

        return $.showPreloader.preloaderModal;
    };
    $.hidePreloader = function () {
        $.showPreloader.preloaderModal && $.closeModal($.showPreloader.preloaderModal);
    };
    $.showIndicator = function () {
        if ($('.preloader-indicator-modal')[0]) return;
        $(defaults.modalContainer).append('<div class="preloader-indicator-overlay"></div><div class="preloader-indicator-modal"><span class="preloader preloader-white"></span></div>');
    };
    $.hideIndicator = function () {
        $('.preloader-indicator-overlay, .preloader-indicator-modal').remove();
    };
    // Action Sheet
    $.actions = function (params) {
        var modal, groupSelector, buttonSelector;
        params = params || [];

        if (params.length > 0 && !$.isArray(params[0])) {
            params = [params];
        }
        var modalHTML;
        var buttonsHTML = '';
        for (var i = 0; i < params.length; i++) {
            for (var j = 0; j < params[i].length; j++) {
                if (j === 0) buttonsHTML += '<div class="actions-modal-group">';
                var button = params[i][j];
                var buttonClass = button.label ? 'actions-modal-label' : 'actions-modal-button';
                if (button.bold) buttonClass += ' actions-modal-button-bold';
                if (button.color) buttonClass += ' color-' + button.color;
                if (button.bg) buttonClass += ' bg-' + button.bg;
                if (button.disabled) buttonClass += ' disabled';
                buttonsHTML += '<span class="' + buttonClass + '">' + button.text + '</span>';
                if (j === params[i].length - 1) buttonsHTML += '</div>';
            }
        }
        modalHTML = '<div class="actions-modal">' + buttonsHTML + '</div>';
        _modalTemplateTempDiv.innerHTML = modalHTML;
        modal = $(_modalTemplateTempDiv).children();
        $(defaults.modalContainer).append(modal[0]);
        groupSelector = '.actions-modal-group';
        buttonSelector = '.actions-modal-button';

        var groups = modal.find(groupSelector);
        groups.each(function (index, el) {
            var groupIndex = index;
            $(el).children().each(function (index, el) {
                var buttonIndex = index;
                var buttonParams = params[groupIndex][buttonIndex];
                var clickTarget;
                if ($(el).is(buttonSelector)) clickTarget = $(el);
                // if (toPopover && $(el).find(buttonSelector).length > 0) clickTarget = $(el).find(buttonSelector);

                if (clickTarget) {
                    clickTarget.on('click', function (e) {
                        if (buttonParams.close !== false) $.closeModal(modal);
                        if (buttonParams.onClick) buttonParams.onClick(modal, e);
                    });
                }
            });
        });
        $.openModal(modal);
        return modal[0];
    };
    $.popup = function (modal, removeOnClose) {
        if (typeof removeOnClose === 'undefined') removeOnClose = true;
        if (typeof modal === 'string' && modal.indexOf('<') >= 0) {
            var _modal = document.createElement('div');
            _modal.innerHTML = modal.trim();
            if (_modal.childNodes.length > 0) {
                modal = _modal.childNodes[0];
                if (removeOnClose) modal.classList.add('remove-on-close');
                $(defaults.modalContainer).append(modal);
            }
            else return false; //nothing found
        }
        modal = $(modal);
        if (modal.length === 0) return false;
        modal.show();
        modal.find(".content").scroller("refresh");
        if (modal.find('.' + defaults.viewClass).length > 0) {
            $.sizeNavbars(modal.find('.' + defaults.viewClass)[0]);
        }
        $.openModal(modal);

        return modal[0];
    };
    $.pickerModal = function (pickerModal, removeOnClose) {
        if (typeof removeOnClose === 'undefined') removeOnClose = true;
        if (typeof pickerModal === 'string' && pickerModal.indexOf('<') >= 0) {
            pickerModal = $(pickerModal);
            if (pickerModal.length > 0) {
                if (removeOnClose) pickerModal.addClass('remove-on-close');
                $(defaults.modalContainer).append(pickerModal[0]);
            }
            else return false; //nothing found
        }
        pickerModal = $(pickerModal);
        if (pickerModal.length === 0) return false;
        pickerModal.show();
        $.openModal(pickerModal);
        return pickerModal[0];
    };
    $.loginScreen = function (modal) {
        if (!modal) modal = '.login-screen';
        modal = $(modal);
        if (modal.length === 0) return false;
        modal.show();
        if (modal.find('.' + defaults.viewClass).length > 0) {
            $.sizeNavbars(modal.find('.' + defaults.viewClass)[0]);
        }
        $.openModal(modal);
        return modal[0];
    };
    //显示一个消息，会在3秒钟后自动消失
    $.showMsg = function(msg, duration, extraclass) {
        var $toast = $('<div class="ui-modal toast ' + (extraclass || '') + '">' + msg + '</div>').appendTo(document.body);
        $.openModal($toast, function(){
            setTimeout(function() {
                $.closeModal($toast);
            }, duration || 3000);
        });
    };
    $.openModal = function (modal, cb) {
        modal = $(modal);
        var isModal = modal.hasClass('ui-modal'),
            isNotToast = !modal.hasClass('toast');
        if ($('.ui-modal.modal-in:not(.modal-out)').length && defaults.modalStack && isModal && isNotToast) {
            $.modalStack.push(function () {
                $.openModal(modal, cb);
            });
            return;
        }
        var isPopup = modal.hasClass('popup');
        var isLoginScreen = modal.hasClass('login-screen');
        var isPickerModal = modal.hasClass('picker-modal');
        var isToast = modal.hasClass('toast');
        if (isModal) {
            modal.show();
            modal.css({
                marginTop: - Math.round(modal.outerHeight() / 2) + 'px'
            });
        }
        if (isToast) {
            modal.css({
                marginLeft: - Math.round(modal.outerWidth() / 2 / 1.185) + 'px' //1.185 是初始化时候的放大效果
            });
        }

        var overlay;
        if (!isLoginScreen && !isPickerModal && !isToast) {
            if ($('.modal-overlay').length === 0 && !isPopup) {
                $(defaults.modalContainer).append('<div class="modal-overlay"></div>');
            }
            if ($('.popup-overlay').length === 0 && isPopup) {
                $(defaults.modalContainer).append('<div class="popup-overlay"></div>');
            }
            overlay = isPopup ? $('.popup-overlay') : $('.modal-overlay');
        }

        //Make sure that styles are applied, trigger relayout;
        var clientLeft = modal[0].clientLeft;

        // Trugger open event
        modal.trigger('open');

        // Picker modal body class
        if (isPickerModal) {
            $(defaults.modalContainer).addClass('with-picker-modal');
        }

        // Classes for transition in
        if (!isLoginScreen && !isPickerModal && !isToast) overlay.addClass('modal-overlay-visible');
        modal.removeClass('modal-out').addClass('modal-in').transitionEnd(function (e) {
            if (modal.hasClass('modal-out')) modal.trigger('closed');
            else modal.trigger('opened');
        });
        // excute callback
        if (typeof cb === 'function') {
            cb.call(this);
        }
        return true;
    };
    $.closeModal = function (modal) {
        modal = $(modal || '.modal-in');
        if (typeof modal !== 'undefined' && modal.length === 0) {
            return;
        }
        var isModal = modal.hasClass('modal'),
            isPopup = modal.hasClass('popup'),
            isToast = modal.hasClass('toast'),
            isLoginScreen = modal.hasClass('login-screen'),
            isPickerModal = modal.hasClass('picker-modal'),
            removeOnClose = modal.hasClass('remove-on-close'),
            overlay = isPopup ? $('.popup-overlay') : $('.modal-overlay');
        if (isPopup){
            if (modal.length === $('.popup.modal-in').length) {
                overlay.removeClass('modal-overlay-visible');
            }
        }
        else if (!(isPickerModal || isToast)) {
            overlay.removeClass('modal-overlay-visible');
        }

        modal.trigger('close');

        // Picker modal body class
        if (isPickerModal) {
            $(defaults.modalContainer).removeClass('with-picker-modal');
            $(defaults.modalContainer).addClass('picker-modal-closing');
        }

        modal.removeClass('modal-in').addClass('modal-out').transitionEnd(function (e) {
            if (modal.hasClass('modal-out')) modal.trigger('closed');
            else modal.trigger('opened');

            if (isPickerModal) {
                $(defaults.modalContainer).removeClass('picker-modal-closing');
            }
            if (isPopup || isLoginScreen || isPickerModal) {
                modal.removeClass('modal-out').hide();
                if (removeOnClose && modal.length > 0) {
                    modal.remove();
                }
            }
            else {
                modal.remove();
            }
        });
        if (isModal &&  defaults.modalStack ) {
            $.modalStackClearQueue();
        }

        return true;
    };
    function handleClicks(e) {
        /*jshint validthis:true */
        var clicked = $(this);
        var url = clicked.attr('href');


        //Collect Clicked data- attributes
        var clickedData = clicked.dataset();

        // Popup
        var popup;
        if (clicked.hasClass('open-popup')) {
            if (clickedData.popup) {
                popup = clickedData.popup;
            }
            else popup = '.popup';
            $.popup(popup);
        }
        if (clicked.hasClass('close-popup')) {
            if (clickedData.popup) {
                popup = clickedData.popup;
            }
            else popup = '.popup.modal-in';
            $.closeModal(popup);
        }

        // Close Modal
        if (clicked.hasClass('modal-overlay')) {
            if ($('.modal.modal-in').length > 0 && defaults.modalCloseByOutside)
                $.closeModal('.modal.modal-in');
            if ($('.actions-modal.modal-in').length > 0 && defaults.actionsCloseByOutside)
                $.closeModal('.actions-modal.modal-in');

        }
        if (clicked.hasClass('popup-overlay')) {
            if ($('.popup.modal-in').length > 0 && defaults.popupCloseByOutside)
                $.closeModal('.popup.modal-in');
        }




    }
    $(document).on('click', ' .modal-overlay, .popup-overlay, .close-popup, .open-popup, .close-picker', handleClicks);
    var defaults =  $.modal.prototype.defaults  = {
        modalStack: true,
        modalButtonOk: '确定',
        modalButtonCancel: '取消',
        modalPreloaderTitle: '加载中',
        modalContainer : document.body
    };
}(jQuery || Zepto);
/*********************************************
 * ---  标签插件  ---
 **********************************************/
+function () {
    'use strict';

    //参数
    var options = {};

    //获取个性标签数据
    function getValues(id) {
        var pageSize = options[id].pageSize;
        if(pageSize == 0){
            return options[id].data;
        }
        var data = options[id].data;
        var pageNumber = options[id].pageNumber;

        if(pageSize*(pageNumber - 1) >= data.length){
            pageNumber = options[id].pageNumber = 1;
        }

        var returnArr = [];
        for(var i=pageSize*(pageNumber-1); i < pageSize*pageNumber && i< data.length; i++){
            returnArr.push(data[i]);
        }

        return returnArr;
    }
    //计算当前已选数目
    function getChooseNumber(id) {
        var $lis = $('#'+id).find('.checked-label-list li');
        if($lis.length > 0){
            return $lis.length;
        }
        return 0;
    }
    //计算当前选择的label项value
    function getCheckedLabel(id) {
        var $lis = $('#'+id).find('.checked-label-list li');
        var arr = [];
        if($lis.length > 0){
            $lis.each(function () {
                arr.push(this.dataset.text);
            });
        }
        return arr;
    }
    //计算当前默认值项中value
    function getDefaultCheckedValue(id) {
        var dv = options[id].defaultCheckedValues;
        var arr = [];
        $.each(dv,function () {
            arr.push(this[options[id]["value"]]);
        });
        return arr;
    }
    //当前选中label数量大于0时,改变按钮颜色
    function changeBtnColor(id) {
        var $btn = $('#'+id).find('.btn-confirm');
        if(getCheckedLabel(id) == 0){
            $btn.removeClass('hasChecked');
        }else{
            $btn.addClass('hasChecked');
        }
    }
    //关闭
    function close(id) {
        var $box = $('#'+id);
        $box.length > 0 && $box.removeClass("zoomIn").addClass("zoomOut");
        $.unlockScreen();
        var timer = setTimeout(function () {
            $box.parent().remove();
        }, 1111);
    }
    //换一换
    function changeLabel(data, id) {
        var $box = $('#'+id);
        options[id].pageNumber ++;
        var values = getValues(id) || [];
        var arr = [];
        var $list = $box.find('.label-list');
        var $checkedList = $box.find('.checked-label-list');
        if(values.length > 0){
            $.each(values, function () {
                var cls = ~getCheckedLabel(id).indexOf(this[options[id]["value"]])?'checked':'';
                arr.push('<li class="'+cls+'" data-value-id="'+this[options[id]["key"]]+'">'+this[options[id]["value"]]+'</li>');
            });
            $list.html(arr.join(''));
        }
        $list.find('li').on('click', function () {
            if($(this).hasClass('checked')){
                var text = $(this).text();
                $checkedList.find('li').each(function () {
                    if($(this).attr('data-text') == text){
                        $(this).remove();
                    }
                });
                $(this).removeClass('checked');
            }else{
                if(getChooseNumber(id) >= options[id].maxChoose){
                    options[id].showMessageFunc('最多只能选择'+options[id].maxChoose+'个');
                }else{
                    labelClickHandle.call(this, id);
                }
            }
        })
    }
    //确定
    function confirmHandle(id, required, cb) {
        var $box = $('#'+id);
        var $checkedList = $box.find('.checked-label-list');
        var list = [];
        $checkedList.find('li').each(function () {
            var obj = {};
            obj[options[id]["key"]] = $(this).attr('data-value-id');
            obj[options[id]["value"]] = $(this).attr('data-text');
            list.push(obj);
        });
        if(required && list.length === 0){
            options[id].showMessageFunc('至少选择一个标签');
            return false;
        }
        //回调
        cb(list);
        $(this).data('list',list);
        //关闭
        close(id);
    }
    //选择label
    function labelClickHandle(id) {
        var $box = $('#'+id);
        var $list = $box.find('.label-list');
        var $checkedList = $box.find('.checked-label-list');
        $(this).addClass('checked').attr('data-index',$(this).index()).attr('data-text', $(this).text());
        $checkedList.append($(this).clone().append('<a class="remove">&times;</a>'));

        var clickH = function () {
            var $li = $(this).closest('li');
            var vi = $li.attr('data-value-id');
            var $labelLi = $list.find('li[data-value-id="'+vi+'"]');
            if($labelLi.length != 0 && $labelLi.text() == $li.attr('data-text')){
                $labelLi.removeClass('checked');
            }
            //remove
            $li.remove();

            changeBtnColor(id);
        };
        $checkedList.find('li .remove').off('click').on('click', clickH);
    }
    //显示
    function showLabelBox(id){
        var self = this;
        options[id].pageNumber = 1;
        var defaultValues = getValues(id);

        var arr = [];
        arr.push('<div class="hp-label-wrapper">');
        arr.push('<div class="hp-label-box animated zoomIn" id="'+id+'">');
        arr.push('      <div class="hp-label">');
        arr.push('          <div class="hp-label-header">');
        arr.push('              <h3>'+options[id].title+'</h3>');
        arr.push('              <p>'+options[id].subtitle+'，最多选择'+options[id].maxChoose+'个</p>');
        arr.push('          </div>');
        arr.push('          <div class="hp-label-body">');
        arr.push('              <div class="hlb-top">');
        arr.push('                  <ul class="checked-label-list'+(!options[id].showChecked?' hidden':'')+'">');
        $.each(options[id].defaultCheckedValues, function () {
            arr.push('                  <li class="checked" data-value-id="'+this[options[id]["key"]]+'" data-text="'+this[options[id]["value"]]+'">'+this[options[id]["value"]]+'<a class="remove">&times;</a></li>');
        });
        arr.push('                  </ul>');
        arr.push('              </div>');
        arr.push('              <div class="hlb-bottom">');
        arr.push('                  <ul class="label-list">');
        $.each(defaultValues, function () {
            var cls = (~getCheckedLabel(id).indexOf(this[options[id]["value"]]) || ~getDefaultCheckedValue(id).indexOf(this[options[id]["value"]]))?'checked':'';
            arr.push('                  <li class="'+cls+'" data-value-id="'+this[options[id]["key"]]+'">'+this[options[id]["value"]]+'</li>');
        });
        arr.push('                  </ul>');
        arr.push('              </div>');
        arr.push('          </div>');
        arr.push('          <div class="hp-label-footer'+(!options[id].showChangeBtn?' hidden':'')+'">');
        arr.push('              <a class="btn-change">换一换</a>');
        arr.push('          </div>');
        arr.push('      </div>');
        arr.push('<a class="btn-confirm"></a>');
        arr.push('</div>');
        arr.push('</div>');

        $(options[id].parentDom).prepend(arr.join(''));
        
        //按钮颜色
        changeBtnColor(id);

        var $box = $('#'+id);
        var $list = $box.find('.label-list');
        var $checkedList = $box.find('.checked-label-list');
        //change btn
        $box.find('.btn-change').on('click', function () {
            changeLabel.call(null,options[id].data, id)
        });
        //confirm btn
        $box.find('.btn-confirm').on('click', function () {
            confirmHandle.call(self, id,options[id].required, options[id].callback);
        });
        //label click
        $box.find('.label-list li').on('click', function () {
            if($(this).hasClass('checked')){
                var text = $(this).text();
                $checkedList.find('li').each(function () {
                    if($(this).attr('data-text') == text){
                        $(this).remove();
                    }
                });
                $(this).removeClass('checked');
            }else{
                if(getChooseNumber(id) >= options[id].maxChoose){
                    options[id].showMessageFunc('最多只能选择'+options[id].maxChoose+'个');
                }else{
                    labelClickHandle.call(this,id);
                }
            }
            changeBtnColor(id);
        });
        //checked label remove btn click
        var clickH = function () {
            var $li = $(this).closest('li');
            var vi = $li.attr('data-value-id');
            var $labelLi = $list.find('li[data-value-id="'+vi+'"]');
            if($labelLi.length != 0 && $labelLi.text() == $li.attr('data-text')){
                $labelLi.removeClass('checked');
            }
            //remove
            $li.remove();
            
            changeBtnColor(id);
        };
        $checkedList.find('li .remove').off('click').on('click', clickH);

        //keydown 按键事件
        $(document).on('keydown', function (e) {
            if(e.keyCode == 13){
                var $box = $('#'+id);
                var $checkedList = $box.find('.checked-label-list');
                var list = [];
                $checkedList.find('li').each(function () {
                    list.push({
                        id: $(this).attr('data-value-id'),
                        text: $(this).attr('data-text')
                    });
                });
                if(options[id].required && list.length === 0){
                    options[id].showMessageFunc('至少选择一个标签');
                    return false;
                }
                options[id].callback(list);
                close(id);
                return false;
            }
        });
    }
    function label(opt) {
        if(typeof opt.id != "string"){
            throw new Error('Parameter ID is required');
        }

        $(this).attr('data-id',opt.id);
        options[opt.id] = $.extend({
            showMessageFunc:function (msg) {  //提示消息的方法
                alert(msg);
            },
            id:'hpLabelBox',
            defaultCheckedValues:[],
            showChangeBtn: false, //是否显示 换一换  按钮
            showChecked: true,  //是否在上方显示选中标签
            required:true, //是否必选
            title: '个性标签',
            subtitle:'选择您的标签',
            pageSize: 0,  //每次显示标签个数
            maxChoose: 3,  //最多选择标签数
            parentDom:'body',
            key:'attr_value_id',
            value:'title',
            data:[],
            callback:function () {}
        },opt || {});
        var self = this;

        var data = options[opt.id]['data'];
        if(typeof data == 'string'){
            $.getJSON(data, function (res) {
                options[opt.id]['data'] = res;
            });
        }

        $(this).off('click').on('click',function () {
            var list = $(this).data('list');
            if(list && list.length > 0){
                options[opt.id]['defaultCheckedValues'] = list;
            }
            var curId = $(this).attr('data-id');
            var $box = $('#'+curId);
            $.lockScreen();
            if($box.length > 0){
                $box.removeClass('zoomOut').addClass('zoomIn');
            }else {
                showLabelBox.call(self, curId)
            }
            return false;
        });
    }

    $.fn.label = label;
}();


$.fn.initial_fileinputinit= function(options){
    var self = this;
    var uploaded_callback = options["uploaded_callback"] || function(){};
    var upload_status={status:"start"}
    var upload_all_complete = options["upload_all_complete"] || function(){};
    var upload_token_url = options['uptoken_url'];
    var upload_concurrent_max_files = options['concurrent_max_files'] || 100;
    var upload_concurrent_message=options['concurrent_message'] || "同时上传的图片不能超过"+upload_concurrent_max_files+"张";
    var wrapper_max_files=options['wrapper_max_files'] || 100;
    var upload_wrapper_message=options['wrapper_message'] || "上传的图片不能超过"+wrapper_max_files+"张";
    var wrapper_file_selector = options['wrapper_file_selector'] || '';
    var check_container_files = options['check_container_files'] || function(){};
    var system_option = {
        runtimes: 'html5,flash,html4',    		//上传模式,依次退化
        browse_button: $(self).attr("id"),       //上传选择的点选按钮，**必需**
        // uptoken_url: '<{link ctl="test:getUpToken"}>',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
        //uptoken : Home.ajaxRequest(options['upmaxtoken_url'],{},false), //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        // unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
        //save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
        domain: 'http://7xog72.com2.z0.glb.qiniucdn.com/',   //bucket 域名，下载资源时用到，**必需**
        container: $(self).parent().attr("id"),           //上传区域DOM ID，默认是browser_button的父元素，
        max_retries: 3,                   //上传失败最大重试次数
        dragdrop: true,                   //开启可拖曳上传
        drop_element: 'container',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb',                //分块上传时，每片的体积
        auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        //resize: {
        // width: 320,
        // height: 320,
        // crop: true,
        // enabled:true,
        // quality: 60,
        // preserve_headers: false
        // },
        filters: options['filters'] || {
            mime_types : [ //只允许上传图片和zip文件
                { title : "Image files", extensions : "jpg,gif,png,tif,bmp,jpeg"},
            ],
            max_file_size: '20mb',      //最大文件体积限制
            //prevent_duplicates : true //不允许选取重复文件
        },
        init: {
            'FilesAdded': function(up, files) {
                var clearUpFiles = function(strFinish_Message){
                    delUploadProgress(self);
                    up.stop();
                    //upload_concurrent_message
                    Home.loadedmessage({"finish_message":strFinish_Message,
                        "type":"result-warning",
                        "icon-class":"icon-exclamation-sign"});
                    //up.splice(0,-1);
                    plupload.each(files, function(file) {
                        up.removeFile(file);
                    });
                }
                //console.log(files.length);
                //console.log(upload_max_files);
                if(files.length>upload_concurrent_max_files)
                {
                    clearUpFiles(upload_concurrent_message);
                }
                else{
                    check_container_files(files,clearUpFiles);
                }
                //else if($(self).parents(".other-photo-edit").find(".space-photo").length>=wrapper_max_files ||
                //	$(self).parents(".other-photo-edit").find(".space-photo").length+files.length>wrapper_max_files) {


                //delUploadProgress(self);
                //up.stop();
                //Home.loadedmessage({
                //	"finish_message": upload_wrapper_message,
                //	"type": "result-warning", "icon-class": "icon-exclamation-sign"
                //});
                //
                //plupload.each(files, function (file) {
                //	up.removeFile(file);
                //});
                //}
                //}
                //plupload.each(files, function(file) {
                //	//文件添加进队列后,处理相关的事情
                //	//console.log($(self).parent().find(".progress"));
                //	//console.log($(self).parent().find(".progress").length<=0);
                //	if($(self).parents(".other-photo-edit").find(".space-photo").length>=wrapper_max_files){
                //		up.stop();
                //		Home.loadedmessage({"finish_message":"上传的空间图片不能超过三张"});
                //		delUploadProgress(self);
                //	}else
                //	{
                //		if($(self).parent().find(".progress").length<=0)
                //			generalUploadProgress(self);
                //	}
                //});
            },
            'FileFiltered': function(up, file) {
                //if($(self).parents(".other-photo-edit").find(".space-photo").length>=wrapper_max_files){
                //	up.stop();
                //	Home.loadedmessage({"finish_message":"上传的空间图片不能超过三张"});
                //	//delUploadProgress(self);
                //	up.removeFile(file);
                //}
                //if(up.files.length>upload_concurrent_max_files)
                //{
                //	delUploadProgress(self);
                //	up.stop();
                //	Home.loadedmessage({"finish_message":"同时上传的空间图片不能超过三张"});
                //}
                //console.log($(self).parents(".other-photo-edit").find(".space-photo").length);
                //if($(self).parents(".other-photo-edit").find(".space-photo").length>=wrapper_max_files){
                //	up.stop();
                //	Home.loadedmessage({"finish_message":"上传的空间图片不能超过三张"});
                //}
            },
            'BeforeUpload': function(up, file) {
                //if(up.files.length>upload_concurrent_max_files)
                //{
                //	delUploadProgress(self);
                //	up.stop();
                //	Home.loadedmessage({"finish_message":"同时上传的空间图片不能超过三张"});
                //}
                if(up.settings.runtimes=="html4"){
                }
                // 每个文件上传前,处理相关的事情
            },
            'UploadProgress': function(up, file) {
                if(file.percent>0){
                    if($(self).parent().find(".progress").length<=0)
                        generalUploadProgress(self);
                    setUploadProgress(self,file.percent,file.name);
                }
                // 每个文件上传时,处理相关的事情
            },
            'FileUploaded': function(up, file, info) {
                // 每个文件上传成功后,处理相关的事情
                // 其中 info 是文件上传成功后，服务端返回的json，形式如
                // {
                //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                //    "key": "gogopher.jpg"
                //  }
                // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
                var domain = up.getOption('domain');
                var res = $.parseJSON(info);
                var sourceLink = domain + res.key;
                //console.log($.extend(file,res,{"status":upload_status.status}));
                uploaded_callback($.extend(file,res,{"status":upload_status.status}));
            },
            'Error': function(up, err, errTip) {
                Home.loadedmessage({"finish_message":"图片大小不能超过20MB，请压缩后重新上传","type":"result-warning",
                    "icon-class":"icon-exclamation-sign"});
                //上传出错时,处理相关的事情
            },
            'UploadComplete': function(up,file) {
                //队列文件处理完毕后,处理相关的事情
                delUploadProgress(self);
                upload_status.status='finish';
                upload_all_complete($.extend(file,{"status":upload_status.status}));
            },
            'Key': function(up, file) {
                // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                // 该配置必须要在 unique_names: false , save_key: false 时才生效
                //var strdate = new Date().toLocaleDateString().split("/").join('');
                var strdate = new Date().getFullYear()+"/"+(new Date().getMonth()*1+1)+"/"+new Date().getDate();
                var microtime  = new Date().getTime();
                var key = strdate+"_"+microtime+$.md5(microtime+file.id+file.name);
                // do something with key here
                return key
            }
        }
    };
    var uploader = Qiniu.uploader($.extend(system_option,options));
    //generalUploadProgress(self);
    function generalUploadProgress(self){
        var progresshtml ='	<div class="progress file-upload"><div class="progress-bar" role="progressbar" ' +
            ' aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="min-width:0%"></div><div class="up-pro-val">0%</div></div>';
        $(progresshtml).insertBefore($(self));
        var pro = $(self).parent().find(".progress");
        pro.css("line-height",pro.height()+"px");
        //return progresshtml;
    }

    function setUploadProgress(self,current_width,current_name){
        $(self).parent().find(".progress .progress-bar").css("width",current_width+"%");
        $(self).parent().find(".up-pro-val").text(current_width+"%"+"."+current_name);
    }

    function delUploadProgress(self){
        $(self).parent().find(".progress").remove();
    }
}