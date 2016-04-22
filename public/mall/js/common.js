/**
 * 主要用于移动端
 * 引入前需引入Jquery  或 Zepto
 * 还需引入 google.fastbutton.js
 * Created by zykj_09 on 2015/9/25.
 */
var domain = "http://192.168.2.17:8090";
//var domain = "http://weixin.xiaobaicar.com";
var initPage = 1;  //分页初始化当前页数
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

//扩展方法
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

var Common = {
    reg:{
        phoneNumber: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
    },
    ios:{
        bottomMenuShow:function(){
            document.location = "url:showMenu";
        },
        bottomMenuHide:function(){
            document.location = "url:hideMenu";
        }
    },
    loading:function(opacity){
        typeof opacity == "undefined" || isNaN(opacity)  ? opacity = 0.8:"";
        var $loadImg = $("#loadImg");
        if($loadImg.length > 0){
            $loadImg.show();
        }else{
            var winH = $(window).height(),
                headerH = $("header").height() || 0;
            var arr = [];
            arr.push('<div id="loadImg" style="position: fixed;z-index:9999;top:'+headerH+'px;left:0;width: 100%;height:'+(winH-headerH)+'px;background-color: rgba(255,255,255,'+opacity+');">');
            arr.push('      <img src="images/loading.gif" style="z-index: 9999;width:148px;position:absolute;top:50%;left:50%;margin:-30px 0 0 -74px;">');
            arr.push('</div>');
            $("body").append(arr.join(''));
        }
    },
    unLoading:function(){
        $("#loadImg").hide();
    },
    lhpDialog:function(args){  //简单的弹窗插件
        var def = {};

        if(typeof args == "string"){
            def.content=args;
            def.btn = [{name:"关闭"}];
        }else{
            $.extend(def ,args);
        }

        var lock = def.lock || true,
            isDrag = def.isDrag || false,
            zIndex = def.zIndex || 19899,
            id = def.id || "simpleDialog",  //ID
            title = def.title || "",  //title
            content =def.content || "内容...",  //content
            dialogW = def.width?parseInt(args.width,10):"90%",
            dialogH = def.height?parseInt(args.height,10):130,
            dialogT = def.top || "30%",
            btnArr = def.btn; //按钮

        if(id){
            $("#"+id).remove();
            $("#lockScreen").remove();
        }

        //按钮
        var htmlBtnArr = [];
        var btnIndex = 0;
        $.each(btnArr,function(i,e){
            if(i > 1){
                return false;
            }

            btnIndex ++;  //按钮个数
            if(i == 0){
                htmlBtnArr[0] = '<a title="'+ e.name+'" index="'+i+'" style="'+(e.css || "")+'">'+ e.name+'</a>';
            }else{
                htmlBtnArr[1] = '<a title="'+ e.name+'" index="'+i+'" style="'+(e.css || '')+'">'+ e.name+'</a>';
            }
            //关闭窗口
            e.close = function(){
                Common.lhpDialogClose(this);
            };
        });

        /*
         * 弹窗
         */
        var htmlArr = [];
        //锁屏
        if(lock){
            htmlArr.push('<div class="lock-screen" id="lockScreen"></div>');
        }
        //弹窗
        htmlArr.push('<div class="lhp-dialog" id="'+id+'">');
        htmlArr.push('<div class="simple-dialog-outer">');
        htmlArr.push('<div class="clearfix simple-dialog animated zoomIn">');
        htmlArr.push('  <div class="simple-dialog-header">');
        htmlArr.push('      <div class="sdh-left" title="'+title+'">'+title+'</div>');
        htmlArr.push('  </div>');
        htmlArr.push('  <div class="simple-dialog-body clearfix">'+content+'</div>');
        htmlArr.push('  <div class="simple-dialog-footer">');
        htmlArr.push('      <div class="sdf-btn">'+htmlBtnArr.join('')+'</div>');
        htmlArr.push('  </div>');
        htmlArr.push('</div>');

        htmlArr.push('</div>');
        htmlArr.push('</div>');
        $("body").prepend(htmlArr.join(''));
        var $dialog = $("#"+id);

        if(btnIndex == 1){
            var $btnWrap = $dialog.find(".sdf-btn");
            $btnWrap.find("a").css({width:"100%"}).end().find(".seg").remove();
        }

        //设置弹出窗宽高
        $dialog.css({zIndex:zIndex,top:dialogT.indexOf("%")>-1?dialogT:parseInt(dialogT,10)+"px"})
            .find(".simple-dialog").css({width:dialogW})
            .find(".simple-dialog-body").css({minHeight:(dialogH-64)+"px"});

        //按钮点击事件
        $dialog.find(".sdf-btn a").each(function(){
            new FastButton(this,function(){
                var i = $(this).attr("index");
                if(btnArr[i].callback){
                    var result = btnArr[i].callback();
                    if(result === false)return false;
                    btnArr[i].close.call(this);
                }else{
                    Common.lhpDialogClose(this);
                }
            });
        });

        //弹窗拖动
        if(isDrag){
            var disX = 0;
            var disY = 0;
            $dialog.find(".simple-dialog-header").bind({
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
    },
    lockScreen:function(){//锁屏
        $("body").prepend('<div class="lock-screen" id="lockScreen"></div>');
    },
    unlockScreen:function(){ //解除锁屏
        $("#lockScreen").remove();
    },
    lhpDialogClose:function(curDom){ //弹窗关闭
        curDom = curDom || "#simpleDialog";
        var $dialog = $(curDom).parents(".lhp-dialog");
        $("#lockScreen").remove();
        $dialog.find(".simple-dialog").removeClass("zoomIn").addClass("zoomOut");
        setTimeout(function(){$dialog.remove();},600);
    },
    lhpShortMessage:function(args){//显示简短提示
        var obj = {};
        var $showShortMessage = $("#showShortMessage");
        if($showShortMessage.length > 0)  $showShortMessage.parents(".win-wrap").remove();

        typeof args == "string"?obj.msg=args:obj=args;

        var defPos = "-26px";
        var d = {
            msg:"提示内容...",  //提示内容
            animate:false,    //是否动态向上移送
            bgColor:"rgba(0,0,0,.5)",   //背景色
            top:defPos,
            bottom:defPos,
            pos:"top", //位置默认是上面
            callback:null,  //显示完提示内容之后的回调函数 (预留)
            time:3500
        };

        $.extend(d,obj);

        var msg = d.msg,
            animate = d.animate,
            bgColor = d.bgColor,
            top = d.top,
            bottom = d.bottom,
            pos = d.pos,  //位置
            time = d.time;

        //动画队列
        var animationName = "messageAnimation",animationArr = [];
        var nextAnimation = function(){  //取出队列中的下一个动画并执行
            $(document).dequeue(animationName);
        };

        var exeAnimation = function(){
            animationArr.push(function(){
                $showShortMessage.animate({top:"2%"},1500,nextAnimation);
            });
            animationArr.push(function(){
                $showShortMessage.fadeOut(1500,nextAnimation);
            });
            animationArr.push(function(){
                $showShortMessage.remove();
            });
            $(document).queue(animationName,animationArr).dequeue(animationName);
        };
        //html
        var htmlArr = [];
        htmlArr.push('<div class="win-wrap animated">');
        htmlArr.push('      <div class="showShortMessage-wrap">');
        htmlArr.push('           <div class="show-short-message" id="showShortMessage">'+msg+'</div>');
        htmlArr.push('      </div>');
        htmlArr.push('</div>');

        $(document.body).prepend(htmlArr.join(''));
        $showShortMessage = $("#showShortMessage");
        //显示
        pos=="top"?$showShortMessage.parents(".win-wrap").css({top:top}):$showShortMessage.parents(".win-wrap").css({bottom:bottom});
        $showShortMessage.parents(".win-wrap").css({
            position:'fixed',
            zIndex:99999
        });
        $showShortMessage.parent().css({
            position:"relative"
        });
        $showShortMessage.css(
            {
                position:"relative",
                padding:"8px 15px",
                cursor:"default" ,
                backgroundColor:bgColor,
                textAlign:"center",
                lineHeight: "16px",
                fontSize: "14px",
                fontFamily:"Microsoft Yahei",
                letterSpacing:"1px",
                borderRadius:"10px",
                color: "#fff",
                visibility: "visible",
                zIndex: "99999"
            });
        var winW = $(window).width(),
            $wrap = $showShortMessage.closest(".win-wrap"),
            winWrapW = $wrap.width();
        $wrap.css({ left:(winW-winWrapW)/2+"px"});

        //显示
        if(top == defPos){
            pos=="top"?$wrap.animate({top:0},600):$wrap.animate({bottom:0},600);
        }else{
            $wrap.addClass("zoomIn");
            setTimeout(function(){
                $wrap.removeClass("zoomIn")
            },600);
        }
        //隐藏
        if(top == defPos){
            setTimeout(function(){pos=="top"?$showShortMessage.animate({top:defPos},800, function () {
                $showShortMessage.parents(".win-wrap").remove();
            }):$showShortMessage.animate({bottom:defPos},800,function(){
                $showShortMessage.parents(".win-wrap").remove();
            });},time);
        }else{
            animate ? setTimeout(exeAnimation,100):setTimeout(function(){
                $wrap.addClass("zoomOut");
                setTimeout(function(){
                    $wrap.remove();
                },600);
            },time);
        }
    },
    getCookie:function(name){
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    },
    delCookie:function(name){
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval= $.getCookie(name);
        if(cval!=null)
            document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    },
    setCookie:function(name,value,time){
        var strsec = $.getsec(time);
        var exp = new Date();
        exp.setTime(exp.getTime() + strsec*1);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    },
    getsec:function(str){
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
    },
    browser:{
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
        }()
    },
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
    },
    attentionXiaobaiCar:function(){
        return "http://mp.weixin.qq.com/s?__biz=MzA4MTk5OTUzMQ==&mid=208531306&idx=1&sn=264ead1160b31dbe9fa35118a3784b89&scene=1&srcid=LpnNZDdBCopVyKeCFxm6&from=groupmessage&isappinstalled=0#rd";
    },
    xiaobaiDownload:function(){
        return "http://www.xiaobaicar.com/app.html";
    },
    sendPoint:function(point){  //埋点
        $.get("http://m2.xiaobaicar.com/logAct.action?pointKey=" + point, function (data, status) {});
    },
    focus:function(targetElement){//用于input框  获取焦点
        var length;
        if ($.isIOS() && targetElement.setSelectionRange) {
            length = targetElement.value.length;
            targetElement.setSelectionRange(length, length);
        } else {
            targetElement.focus();
        }
    },
    closeLoadIframe:function(){
        var $box = $("#loadIframeWrap");
        $box.animate({marginLeft:"100%"},300);
        setTimeout(function(){
            $box.remove();
        },999);
    },
    getQrcode:function(text){
        var qrcode = "";
        $.ajax({
            type:"get",
            dataType:"json",
            async:false,
            url:domain+"/qrcode/get?text="+text,
            success:function(res){
                if(res.code == "s_ok"){
                    qrcode = res.result.pic_url;
                }else{
                    $.lhpShortMessage({msg:"系统繁忙，请稍后重试",top:"45%"});
                }
            },
            error:function(){
                $.lhpShortMessage({msg:"网络异常",top:"45%"});
            }
        });
        return qrcode;
    },
    numberFormat:function(num) {  //数字格式化， 10000 = 1万
        num = parseFloat(num);
        if (num > 10000)
            return (num / 10000).toFixed(1) + " 万";
        return num;
    },
    getUrlParam:function(name){  //获取url参数
        //构造一个含有目标参数的正则表达式对象
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        //匹配目标参数
        var r = window.location.search.substr(1).match(reg);
        //返回参数值
        if (r != null) return unescape(r[2]);
        return null;
    },
    getDateStr:function(time){  //时间格式化
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
    },
    escapeContent:function(ctx){
        if (ctx) {
            ctx = ctx.replace(/>/g, "&gt;");
            ctx = ctx.replace(/</g, "&lt;");
        }
        return ctx;
    },
    toTop:function(){
        $(document.body).append('<a class="to-top" id="backToTop"></a>');

        $(window).scroll(function(){
            if ($(window).scrollTop()>50){
                $("#backToTop").stop(true,true).fadeIn(300);
            }else{
                $("#backToTop").stop(true,true).fadeOut(300);
            }
        });

        //回到页面顶部位置
        $("#backToTop").click(function(){
            $('body,html').animate({scrollTop:0},300);
            return false;
        });
    },
    sharePage:function(){
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
    },
     ajax:function(option) {
        var cfg = {
            type: "POST",
            dataType: "json",
            domain: domain,
            url: '',
            data: null,
            handlerSuccess: null,//成功方法
            handlerError: null,//失败函数
            isShowLoad: false//是否显示加载中
        };
        var CFG = $.extend(cfg, option);
        //if (CFG.isShowLoad) $(".front_load").show();
        //显示加载中
         $.showIndicator();
        $.ajax({
            type: CFG.type,
            url: CFG.domain + CFG.url,
            data: CFG.data,
            dataType: CFG.dataType,
            success: function (data) {
                $.hideIndicator();
                CFG.handlerSuccess && CFG.handlerSuccess(data);
                //if (CFG.isShowLoad) $(".front_load").hide();
            },
            error: function (e) {
                $.hideIndicator();
                if (CFG.handlerError) CFG.handlerError(e);
                else Common.lhpShortMessage({msg: "请求错误", top: "45%"});
                //if (CFG.isShowLoad) $(".front_load").hide();
            }
        });
    },
    counvertImg:function(img){
    	if(!img){
    		return "img/icon_sleep.jpg";
    	}else if(img=='准车主'){
    		return "img/icon_sleep.jpg";
    	}else if(img.indexOf('http')>-1){
    		return img;
    	}else if(img.substring(0,1)=='/'){
    		return domain+img;
    	}else{
    		return domain+'/'+img;
    	}
    }
    
};

/**====================================================
 *************** 扩展方法  ***********************
 =======================================================*/
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
//图片裁剪
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
            Common.lhpShortMessage({msg:"请选择图片类型文件！",top:"45%"});
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

/**
 *
 * @param btnID  上传控件ID不用带#   必填
 * @param type  1:头像相关 2：认证相关 3：问答   必填
 * @param maxSize  图片大小限制默认10M   非必填
 * @param showImg  上传成功后显示图片位置ID不用#号,   非必填
 */
$.imgUpload = function(btnID,type,maxSize,showImg,fn){
    //销毁已有实例
    var $btn = $("#"+btnID);
    var old_uploader = $btn.data("uploader");
    old_uploader && typeof old_uploader.destroy === "function" && old_uploader.destroy();

    fn = fn || function(){};
    maxSize = maxSize || "10mb";
    var ajaxErrorHandle = function(res){
        if(res.code == "s_ok"){
            return ;
        }

        if(res.error_code == 110 || res.error_code == 130){  //重新登录
            urlRedirect("login.html");
        }else if(res.error_code == 120){
            urlRedirect("index.html");
        }else{
            Common.lhpShortMessage({msg:res.msg,top:"45%"});
        }
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

/**
 * 让IE兼容forEach
 */
//Array.forEach implementation for IE support..
//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(callback, thisArg) {
        var T, k;
        if (this == null) {
            throw new TypeError(" this is null or not defined");
        }
        var O = Object(this);
        var len = O.length >>> 0; // Hack to convert O.length to a UInt32
        if ({}.toString.call(callback) != "[object Function]") {
            throw new TypeError(callback + " is not a function");
        }
        if (thisArg) {
            T = thisArg;
        }
        k = 0;
        while (k < len) {
            var kValue;
            if (k in O) {
                kValue = O[k];
                callback.call(T, kValue, k, O);
            }
            k++;
        }
    };
}


/**
 * 百度统计

var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "//hm.baidu.com/hm.js?a2c15b4a5e90ebc8ec672659942afc79";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();
 */
