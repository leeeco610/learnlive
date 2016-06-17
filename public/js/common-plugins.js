/**
 * 主要用于移动端
 * 引入前需引入Jquery  或 Zepto
 * Created by zykj_09 on 2015/9/25.
 */
var domain = "";
/**
 *设置元素动画时间
 */
$.fn.setAnimationTime = function(time){
    if(this.length == 0) return ;
    return $.each(this,function(i,e){
        if(time == 0 || time == "none"){
            e.style.webkitTransition = "none";
            e.style.transition = "none";
        }else{
            e.style.webkitTransition = "all "+time+"s ease";
            e.style.transition = "all "+time+"s ease";
        }
    });
};

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
$.domFocus = function (targetElement) {
    var length;
    if ($.isIOS() && targetElement.setSelectionRange) {
        length = targetElement.value.length;
        targetElement.setSelectionRange(length, length);
    } else {
        targetElement.focus();
    }
};
/******************************************
 * 微信端分享弹层
 *****************************************/
$.wechatSharePage = function () {
    var winH = $(window).height(),
        html='';
    html+='<div id="sharewarp" style="position: fixed;top:0;left:0;z-index: 99999;height:100px;width: 100%;height:'+winH+'px;background: rgba(0,0,0,0.6);">';
    html+=   '<p style="padding: 15px 20px 20px; background:#fff;text-align:right;margin: 0;"><span style="display:inline-block;font-family:Microsoft Yahei;padding-right: 20px;font-size: 17px;color: #212121">点击右上角，分享到朋友圈</span><img src="img/iconfont-jiantou.png" style="height: 60px;"> </p>';
    html+='</div>';
    $("body").css("overflow","hidden").append($(html));
    var $allPage = $("div[data-role='page']");
    $allPage.css({"overflow-y":"hidden","max-height":"100%"});
    new FastButton(document.querySelector("#sharewarp"),function(){
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
    $("body").prepend(htmlArr.join(''));
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
        var contHeight = params.container.height();
        if (params.container.get(0) === window) {
            contop = $(window).scrollTop()
        } else {
            contop = params.container.offset().top
        }
        $.each(params.cache, function (i, data) {
            var o = data.obj, tag = data.tag, url = data.url, post, posb;
            if (o) {
                post = o.parent().offset().top - contop, posb = post + o.height();
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
/**====================================================
 *************** 其它扩展方法  ***********************
 ======================================================*/
//点击事件  去重
$.fn.clickEvent = function(callback){
    if("ontouchstart" in window){
        var data_fb = this.data("fb");
        data_fb && typeof data_fb.destroy === "function" && data_fb.destroy();
        var fb = new FastButton(this[0],callback);
        this.data("fb",fb);
    }else{
        this.off("click");
        this.on("click",callback);
    }
};
$.fn.removeClickEvent = function(){
    if("ontouchstart" in window){
        var data_fb = this.data("fb");
        data_fb && typeof data_fb.destroy === "function" && data_fb.destroy();
    }else{
        this.off("click");
    }
};
/**============================================================
 ********************  图片裁剪  ********************
 ==============================================================*/
$.fn.imgClip = function(){
    var _ = this[0];
    //判断浏览器是否支持FileReader接口
    if(typeof FileReader == 'undefined'){
        alert("你的浏览器不支持FileReader接口！");
        //使选择控件不可操作
        _.setAttribute("disabled","disabled");
        return false;
    }
    this.on("change",function(){
        var file = _.files[0];
        if(!/image\/\w+/.test(file.type)){
            Common.simpleMessage({msg:"请选择图片类型文件！",top:"45%"});
            return false;
        }
        var reader = new FileReader();
        //将文件以Data URL形式读入页面
        reader.readAsDataURL(file);
        reader.onload=function(e){
            var arr = [];
            arr.push('<div class="popup popup-about" id="popup_imgClip">');
            arr.push('      <header class="bar bar-nav">');
            arr.push('          <a class="button button-link button-nav pull-left close-popup" href="#">');
            arr.push('              <span class="icon icon-left"></span>返回');
            arr.push('          </a>');
            arr.push('          <h1 class="title">裁剪</h1>');
            arr.push('          <button class="button pull-right btn-use">使用</button>');
            arr.push('      </header>');
            arr.push('      <div class="content">');
            arr.push('          <div class="list-block">');
            arr.push('              <iframe frameborder="0" width="100%" id="imgClipIframe" src="imgClip.html"></iframe>');
            arr.push('          </div>');
            arr.push('      </div>');
            arr.push('</div>');
            $.popup(arr.join(''));
            //css
            var $pop = $("#popup_imgClip");
            var contentH = $pop.find(".content").height();
            var $iframe = $("#imgClipIframe");
            $iframe.height(contentH);
            //显示图片
            var img = this.result;
            $iframe[0].onload=function(){
                this.contentWindow.init(img,contentH);
            };
            //event
            $pop.find(".btn-use").clickEvent(function(){
                $iframe[0].contentWindow.imgUse();
            })
        }
    });
};

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
        factory(jQuery);
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

    jQuery.fn.imageCrop = function(options){
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