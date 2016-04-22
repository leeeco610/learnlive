/**
 * 主要用于移动端
 * 引入前需引入Jquery  或 Zepto
 * 还需引入 google.fastbutton.js
 * Created by zykj_09 on 2015/9/25.
 */
var domain = "http://weixin.xiaobaicar.com";
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
    getRandomColor:function(){
        return '#' + (function(color) {
                //这个写法比较有意思,Math.floor(Math.random()*16);返回的是一个小于或等于16的数.然后作为0123456789abcdef的下标,这样每次就会得到一个这个字符串当中的一个字符
                return (color += '0123456789abcdef' [Math.floor(Math.random() * 16)])
                    //然后判断这个新字符串的长度是否到6,因为16进制的颜色是由6个字符组成的,如果到6了,就返回这6个字符拼成的字符串,如果没有就执行arguments.callee(color)也就是函数本身.
                && (color.length == 6) ? color: arguments.callee(color);
        })('');
    },
    alert:function(msg){ //弹窗提示
        var arr = [];
        arr.push('<div class="alert" id="alert">');
        arr.push('      <h2>提示</h2>');
        arr.push('      <div class="alert_con">');
        arr.push('          <p id="ts">'+msg+'</p>');
        arr.push('          <p style="line-height:70px"><a class="btn">确定</a></p>');
        arr.push('      </div>');
        arr.push('</div>');
        $('body').append(arr.join(''));
        var $alert = $("#alert");
        //open
        $alert.show().animate({"top":"45%"}, 300);

        //close
        var close = function(){
            $alert.animate({"top":"-40%"}, 300,function(){
                $alert.remove();
            });
        };

        $alert.on("click",".btn",close);
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
                htmlBtnArr[1] = '<a title="'+ e.name+'" index="'+i+'">'+ e.name+'</a>';
            }else{
                htmlBtnArr[0] = '<a title="'+ e.name+'" index="'+i+'">'+ e.name+'</a>';
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
        htmlArr.push('      <div class="sdf-btn"><i class="seg"></i>'+htmlBtnArr.join('')+'</div>');
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
    showUseRules:function(){
        var $wrap = $("#useRulesWrap");
        $wrap.length>0 ? $wrap.remove():"";
        /**
         * 用户使用规则弹出
         */
        var arr = [];
        arr.push('<div class="useRules-wrap animated zoomIn" id="useRulesWrap">');
        arr.push('      <div class="rules-header">');
        arr.push('          <div class="img-wrap act-rules-title">');
        arr.push('              <img src="img/act/activit_text_title.png">');
        arr.push('          </div>');
        arr.push('          <i class="close"></i>');
        arr.push('      </div>');
        arr.push('      <div class="rules-content">');
        arr.push('          <ul>');
        arr.push('              <li>');
        arr.push('                  <i class="num num_1"></i>');
        arr.push('                  <p>邀请好友帮你攒车品，攒满200，就可获得油卡。</p>');
        arr.push('              </li>');
        arr.push('              <li>');
        arr.push('                  <i class="num num_2"></i>');
        arr.push('                  <p>本次活动共1000张油卡，每张油卡200元，最先攒满200并填写资料的1000名用户可获得。</p>');
        arr.push('              </li>');
        arr.push('              <li>');
        arr.push('                  <i class="num num_3"></i>');
        arr.push('                  <p>每位好友只有一次机会帮你攒车品。</p>');
        arr.push('              </li>');
        arr.push('              <li>');
        arr.push('                  <i class="num num_4"></i>');
        arr.push('                  <p>本次活动会于2015年09月13日24时00分结束。</p>');
        arr.push('              </li>');
        arr.push('              <li>');
        arr.push('                  <i class="num num_5"></i>');
        arr.push('                  <p>油卡会于2015年09月26日起陆续发出。</p>');
        arr.push('              </li>');
        arr.push('              <li>');
        arr.push('                  <i class="num num_6"></i>');
        arr.push('                  <p>每人只有一次发起攒油卡活动的机会，且只可在微信端参加。积满200分时，记得填写正确的个人资料。</p>');
        arr.push('              </li>');
        arr.push('              <li>');
        arr.push('                  <i class="num num_7"></i>');
        arr.push('                  <p>活动最终解释权归掌驭科技有限公司所有。</p>');
        arr.push('              </li>');
        arr.push('          </ul>');
        arr.push('      </div>');
        arr.push('</div>');

        var $allPage = $("div[data-role='page']");
        $("body").css("overflow","hidden").append(arr.join(''));
        $allPage.css({"overflow-y":"hidden","max-height":"100%"});
        var winH = $(window).height();

        //event
        $wrap = $("#useRulesWrap");
        $wrap.height(winH).on("fastClick",".close",function(){
            $wrap.removeClass("zoomIn").addClass("zoomOut");
            setTimeout(function(){
                $("body").css("overflow","auto");
                $allPage.css({"overflow-y":"auto","max-height":"auto"});
                $wrap.remove();
            },600);
        });
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
    renderTopicType:function(){  //话题类型  标题字渲染
        $(".topic-type").each(function(){
            var type = $(this).attr("data-type");
            type = type ? parseInt(type) : 1;
            switch (type) {
                case 2:
                    $(this).addClass("color1").text("【分享】");
                    break;
                case 3:
                    $(this).addClass("color1").text("【试驾】");
                    break;
                case 4:
                    $(this).addClass("color1").text("【团购】");
                    break;
                case 5:
                    $(this).addClass("color13").text("【活动】");
                    break;
                case 6:
                    $(this).addClass("color12").text("【投票】");
                    break;
                default:
                    $(this).addClass("color1").text("【话题】");
            }
        });
    },
    escapeContent:function(ctx){
        if (ctx) {
            ctx = ctx.replace(/>/g, "&gt;");
            ctx = ctx.replace(/</g, "&lt;");
        }
        return ctx;
    },
    scrollLoadMore:function(callback){  //滑动到底部加载更多
        //滑动加载更多
        $(window).on("scroll",function(){
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(document).height();
            var windowHeight = $(this).height();
            if(scrollTop + windowHeight >= scrollHeight){
               callback();
            }
        });
    },
    scrollLoadMore2:function(box,doc,callback){
        $(box).on("scroll",function(){
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(doc).height();
            var windowHeight = $(this).height();
            if(scrollTop + windowHeight >= (scrollHeight-44)){  //减去头部高度
                callback();
            }
        });
    },
    bigImgShow:function(imgArr,title,currentIndex,callback){  //显示图片的大图  currentIndex当前显示第几张图片
        title = title?title:"";
        currentIndex = currentIndex?currentIndex:0;
        var arr = [];
        arr.push('<div class="show-big-img" id="showBigImg">');
        /* -------------标题---------------- */
        arr.push('<h3 class="title">'+title+'</h3>');
        arr.push('      <div class="sbi-sub">');
        /*swiper ------------begin----------------------*/
        arr.push('<div class="swiper-container swiper-container-horizontal">');
        //-- images --
        arr.push('  <div class="swiper-wrapper" id="swiperWrap">');
        $.each(imgArr,function(i,e){
            if(i == currentIndex){
                arr.push(' <div class="swiper-slide swiper-slide-active">');
            }else{
                arr.push(' <div class="swiper-slide">');
            }
            arr.push('  <img src="'+e+'" onerror="this.src=\''+Common.image_loading_failed+'\'">');
            arr.push(' </div>');
        });
        arr.push('  </div>');
        arr.push('</div>');
        /*swiper ----------------------end--------------------- */
        /* count -----------------begin-------------- */
        arr.push('<div class="count">');
        arr.push('      <b class="current">'+(currentIndex+1)+'</b>&nbsp;/');
        arr.push('      <b class="total">'+imgArr.length+'</b>');
        arr.push('</div>');
        /* count -----------------end-------------- */
        arr.push('      </div>');
        arr.push('</div>');

        $("body").prepend(arr.join(''));
        //css
        var winH = $(window).height(),
            winW = $(window).width(),
            $sbi = $("#showBigImg");
        $sbi.find(".sbi-sub").css({height:winH+"px",width:winW+"px"}).find(".swiper-slide").css({maxHeight:winH+"px"});
        $sbi.click(function(){
            Common.bigImgClose(callback);
        });

        //swiper
        var swiper = new Swiper('.swiper-container', {
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            pagination: '.swiper-pagination',
            paginationClickable: true,
            preloadImages: false,
            lazyLoading: true,
            // effect: 'fade',
            onSlideChangeStart:function(swiper){
                var $sw = $("#showBigImg"),
                    index = $sw.find(".swiper-slide-active").index();
                $sw.find(".current").text(parseInt(index)+1);
            }
        });
    },
    bigImgClose:function(callback){
        $("#showBigImg").remove();
        typeof callback == "function"?callback():function(){};
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
    	html+='<div id="sharewarp" style="position: fixed;top:0;left:0;z-index: 99999;width: 100%;height:'+winH+'px;background: rgba(0,0,0,0.6);">';
	    html+=   '<p style="width: 100%;padding-bottom: 20px; background:#ff9600;text-align:right;margin:0;"><img src="img/share_text.png" style="width:90%"> </p>';
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
            type: "GET",
            dataType: "json",
            domain: domain,
            url: '',
            data: null,
            handlerSuccess: null,//成功方法
            handlerError: null,//失败函数
            isShowLoad: false//是否显示加载中
        };
        var CFG = $.extend(cfg, option);
        if (CFG.isShowLoad) $(".front_load").show();
        //显示加载中
        $.ajax({
            type: CFG.type,
            url: CFG.domain + CFG.url,
            data: CFG.data,
            dataType: CFG.dataType,
            success: function (data) {
                CFG.handlerSuccess && CFG.handlerSuccess(data);
                if (CFG.isShowLoad) $(".front_load").hide();
            },
            error: function (e) {
                if (CFG.handlerError) CFG.handlerError(e);
                else Common.lhpShortMessage({msg: "请求错误", top: "45%"});
                if (CFG.isShowLoad) $(".front_load").hide();
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
    },
    ajaxFail:function(res){
        if(res.status == 'ok'){
            return false;
        }
        if(res.status == 100){ //重新登录
            location.href = "login.html";
        }else{
            Common.lhpShortMessage({msg:res.message,top:"45%"})
        }
    }
};

/**====================================================
 *************** 扩展方法  ***********************
 =======================================================*/
//标签云
$.fn.tagCloud = function(){
    var length = $(this).length;
    for(var i=0; i<length;i++){
        action($(this).get(i));
    }
    return $(this);
    function action(oDiv){
        var radius = 120;
        var dtr = Math.PI/180;
        var d=300;

        var mcList = [];
        var active = false;
        var lasta = 1;
        var lastb = 1;
        var distr = true;
        var tspeed=1;
        var size=250;

        var mouseX=0;
        var mouseY=0;

        var howElliptical=1;

        var aA=null;

        var i=0;
        var oTag=null;

        aA=oDiv.getElementsByTagName('a');

        for(i=0;i<aA.length;i++)
        {
            oTag={};

            oTag.offsetWidth=aA[i].offsetWidth;
            oTag.offsetHeight=aA[i].offsetHeight;

            mcList.push(oTag);
        }

        sineCosine( 0,0,0 );

        positionAll();

        oDiv.onmouseover=function ()
        {
            active=true;
        };

        oDiv.onmouseout=function ()
        {
            active=false;
        };

        oDiv.onmousemove=function (ev)
        {
            var oEvent=window.event || ev;

            mouseX=oEvent.clientX-(oDiv.offsetLeft+oDiv.offsetWidth/2);
            mouseY=oEvent.clientY-(oDiv.offsetTop+oDiv.offsetHeight/2);

            mouseX/=5;
            mouseY/=5;
        };

        setInterval(update, 100);


        function update()
        {
            var a;
            var b;

            if(active)
            {
                a = (-Math.min( Math.max( -mouseY, -size ), size ) / radius ) * tspeed;
                b = (Math.min( Math.max( -mouseX, -size ), size ) / radius ) * tspeed;
            }
            else
            {
                a = lasta * 0.98;
                b = lastb * 0.98;
            }

            lasta=a;
            lastb=b;

            if(Math.abs(a)<=0.01 && Math.abs(b)<=0.01)
            {
                return;
            }

            var c=0;
            sineCosine(a,b,c);
            for(var j=0;j<mcList.length;j++)
            {
                var rx1=mcList[j].cx;
                var ry1=mcList[j].cy*ca+mcList[j].cz*(-sa);
                var rz1=mcList[j].cy*sa+mcList[j].cz*ca;

                var rx2=rx1*cb+rz1*sb;
                var ry2=ry1;
                var rz2=rx1*(-sb)+rz1*cb;

                var rx3=rx2*cc+ry2*(-sc);
                var ry3=rx2*sc+ry2*cc;
                var rz3=rz2;

                mcList[j].cx=rx3;
                mcList[j].cy=ry3;
                mcList[j].cz=rz3;

                per=d/(d+rz3);

                mcList[j].x=(howElliptical*rx3*per)-(howElliptical*2);
                mcList[j].y=ry3*per;
                mcList[j].scale=per;
                mcList[j].alpha=per;

                mcList[j].alpha=(mcList[j].alpha-0.6)*(10/6);
            }

            doPosition();
            depthSort();
        }

        function depthSort()
        {
            var i=0;
            var aTmp=[];

            for(i=0;i<aA.length;i++)
            {
                aTmp.push(aA[i]);
            }

            aTmp.sort
            (
                function (vItem1, vItem2)
                {
                    if(vItem1.cz>vItem2.cz)
                    {
                        return -1;
                    }
                    else if(vItem1.cz<vItem2.cz)
                    {
                        return 1;
                    }
                    else
                    {
                        return 0;
                    }
                }
            );

            for(i=0;i<aTmp.length;i++)
            {
                aTmp[i].style.zIndex=i;
            }
        }

        function positionAll()
        {
            var phi=0;
            var theta=0;
            var max=mcList.length;
            var i=0;

            var aTmp=[];
            var oFragment=document.createDocumentFragment();

            //�������
            for(i=0;i<aA.length;i++)
            {
                aTmp.push(aA[i]);
            }

            aTmp.sort
            (
                function ()
                {
                    return Math.random()<0.5?1:-1;
                }
            );

            for(i=0;i<aTmp.length;i++)
            {
                oFragment.appendChild(aTmp[i]);
            }

            oDiv.appendChild(oFragment);

            for( var i=1; i<max+1; i++){
                if( distr )
                {
                    phi = Math.acos(-1+(2*i-1)/max);
                    theta = Math.sqrt(max*Math.PI)*phi;
                }
                else
                {
                    phi = Math.random()*(Math.PI);
                    theta = Math.random()*(2*Math.PI);
                }
                //���任
                mcList[i-1].cx = radius * Math.cos(theta)*Math.sin(phi);
                mcList[i-1].cy = radius * Math.sin(theta)*Math.sin(phi);
                mcList[i-1].cz = radius * Math.cos(phi);

                aA[i-1].style.left=mcList[i-1].cx+oDiv.offsetWidth/2-mcList[i-1].offsetWidth/2+'px';
                aA[i-1].style.top=mcList[i-1].cy+oDiv.offsetHeight/2-mcList[i-1].offsetHeight/2+'px';
            }
        }

        function doPosition()
        {
            var l=oDiv.offsetWidth/2;
            var t=oDiv.offsetHeight/2;
            for(var i=0;i<mcList.length;i++)
            {
                aA[i].style.left=mcList[i].cx+l-mcList[i].offsetWidth/2+'px';
                aA[i].style.top=mcList[i].cy+t-mcList[i].offsetHeight/2+'px';

                aA[i].style.fontSize=Math.ceil(12*mcList[i].scale/2)+8+'px';

                aA[i].style.filter="alpha(opacity="+100*mcList[i].alpha+")";
                aA[i].style.opacity=mcList[i].alpha;
            }
        }

        function sineCosine( a, b, c)
        {
            sa = Math.sin(a * dtr);
            ca = Math.cos(a * dtr);
            sb = Math.sin(b * dtr);
            cb = Math.cos(b * dtr);
            sc = Math.sin(c * dtr);
            cc = Math.cos(c * dtr);
        }
    }
};
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

    var uploader = new plupload.Uploader({
        runtimes : 'html5,html4,flash,silverlight',  //
        browse_button : btnID, //ID不用带#
        url : domain+'/v1/image/upload?type='+type,
        flash_swf_url : '../js/Moxie.swf',
        silverlight_xap_url : '../js/Moxie.xap',
        filters : {
            max_file_size : '100mb',
            mime_types: [
                {title : "Image files", extensions : "jpg,gif,png"}
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
            if(showImg){
                if(r.image_domain && uri){
                    var img_url = r.image_domain+ uri;
                    $("#"+showImg).attr("src",img_url).attr("data-relsrc", uri);
                }
            }
            fn(uri);
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
 * 页面音乐播放
 * @param audio
 * @constructor
 */
function Music(audio,mp3){
    this.audio = audio;
    this.mp3 = mp3 || "bg_music.mp3";
}
Music.prototype.init = function(){
    var self = this;
    var a = this.audio;
    var $a = $(a);
    var $control = $("#musicBox");
    a.src = this.mp3;
    $a.on("stalled",function(){
        a.load();
        a.play();
    }).on("canplaythrough",function(){
        a.play();
    }).on("canplay",function(){
        a.play();
    }).on("play",function(){
        $control.removeClass("off").find("a").addClass("music-control");
    }).on("pause",function(){
        $control.addClass("off").find("a").removeClass("music-control");
    });
    $control.on("fastClick",function(){
        return self.control();
    });
};
//控制音乐暂停与播放控制
Music.prototype.control = function(){
    var a = this.audio;
    if(a.paused){
        a.play();
    }else{
        a.pause();
    }
};
/**
 * 百度统计
 */
var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "//hm.baidu.com/hm.js?0aaca726e161d259cff4c1d77c6da26c";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();


