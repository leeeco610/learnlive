/**
 * Created by zykj_09 on 2015/9/28.
 */
var DATA = {
    currentPage:null,
    imgUrl:{
        pic:"",  //用户上传的图像
        idCard:"",  //身份证
        groupPhoto:"", //人店合影
        workCard:"",  //工牌或公司证明
        cert:""  //相关资质证书
    },
    authType:1  //认证类型 1为师傅认证  2为服务人员认证
};
/*===============================================
 *****************登录页*******************
 =================================================*/
//忘记密码
function forgetPassword(){
    Common.sendPoint('WXSF_30-3');
    $.router.loadPage('#page-forget');
}

//登录
function login(){
    if(loginValid()){
        var $page = $("#page-login");
        var $m = $page.find(".mobile");
        var $p = $page.find(".password");
        var mobile = $.trim($m.val());
        var password = $.trim($p.val());

        Common.sendPoint('WXSF_30-1');
        $.showIndicator();
        $.ajax({
            type:"post",
            dataType:"json",
            data:{userName:mobile,pwd:password},
            url:domain+"/v1/user/login",
            success:function(res){
                $.hideIndicator();
                if(res.code == "s_ok"){
                    var url = Common.getUrlParam("url");  //有跳转
                    if(url){
                        window.location.href = url;
                    }else{
                        var r = res.result;
                        if(r.type == 2){ //已绑定，未进行认证，需要进行认证
                            $.router.loadPage("#page-auth-uncommitted");
                        }else if(r.type == 3){  //已绑定，并且认证，直接登录成功
                            urlRedirect("home.html");
                        }else if(r.type == 4){  //正在审核
                            $.router.loadPage("#page-auth-committed");
                        }else if(r.type == 5){
                            $.router.loadPage("#page-auth-committedfail");
                        }
                    }
                }else{
                    ajaxErrorHandle(res)
                }
            },
            error:function(){
                $.hideIndicator();
                Common.lhpShortMessage({msg:"网络异常",top:"45%"});
            }
        });
    }
}

//验证
function loginValid(){
    var $page = $("#page-login");
    var $m = $page.find(".mobile");
    var $p = $page.find(".password");
    var mobile = $.trim($m.val());
    var password = $.trim($p.val());
    if(mobile === ""){
        Common.lhpShortMessage({msg:"请输入手机号",top:"45%"});
        //$m.focus();
        return false;
    }
    if(password === ""){
        Common.lhpShortMessage({msg:"请输入密码",top:"45%"});
        //$p.focus();
        return false;
    }
    if(password.length < 6){
        Common.lhpShortMessage({msg:"密码输入错误",top:"45%"});
        //$p.focus();
        return false;
    }
    if(!mobile.match(Common.reg.phoneNumber)){
        Common.lhpShortMessage({msg:"请填写正确的手机号码",top:"45%"});
        //$m.focus();
        return false;
    }
    return true;
}
//跳转至注册页
function gotoRegister(){
    Common.sendPoint('WXSF_30-2');
    $.router.loadPage("#page-register");
}
/*===============================================
 *****************验证码获取  以及 公用验证*******************
 =================================================*/
function GetAuthCode($mobile,$page,type){
    this.$m = $mobile;
    this.$p = $page;
    this.type = type;
}
//发送获取验证码请求
GetAuthCode.prototype.sendAjax = function(obj){
    var self = this;
    this.mobile = $.trim(this.$m.val());
    $.ajax({
        type:"post",
        dataType:"json",
        data:{
            type: this.type,
            mobile:this.mobile
        },
        url:domain+"/v1/user/verifcode/take",
        success: function (res) {
            if(res.code == "s_ok"){
                //倒计时
                self.countdown(obj);
            }else{
                Common.lhpShortMessage({msg:res.msg,top:"45%"});
                $(obj).removeClass("on").clickEvent(function(){
                    self.sendAjax(obj);
                });
            }
        },
        error:function(){
            Common.lhpShortMessage({msg:"网络异常",top:"45%"});
        }
    });
    $(obj).addClass("on").removeClickEvent();
};
//按钮倒计时
var countdown = 60;
GetAuthCode.prototype.countdown = function(obj){
    var self = this;
    var _args = arguments;
    if (countdown == 0) {
        $(obj).removeClass("on");
        obj.removeAttribute("disabled");
        obj.value="验证码";
        countdown = 60;
        $(obj).clickEvent(function(){
            self.sendAjax(obj);
        });
    }else {
        obj.setAttribute("disabled", true);
        obj.value=countdown + "s";
        countdown--;
        setTimeout(function() {
            _args.callee.call(self,obj);
        },1000)
    }
};

/**
 * 手机号码及验证码必填验证
 * @returns {boolean}
 */
//手机号码验证
function mobileValid($page){
    var $m = $page.find(".mobile");
    var mobile = $.trim($m.val());
    if(mobile === ""){
        Common.lhpShortMessage({msg:"请输入手机号",top:"45%"});
        //$m.focus();
        return false;
    }
    if(!mobile.match(Common.reg.phoneNumber)){
        Common.lhpShortMessage({msg:"请填写正确的手机号码",top:"45%"});
        //$m.focus();
        return false;
    }
    return true;
}
//验证码验证
function authCodeValid($page){
    var $g = $page.find(".auth-code");
    var authCode = $.trim($g.val());
    if(authCode === ""){
        Common.lhpShortMessage({msg:"请输入验证码",top:"45%"});
        //$g.focus();
        return false;
    }
    if(authCode.length !== 6){
        Common.lhpShortMessage({msg:"验证码输入错误",top:"45%"});
        //$g.focus();
        return false;
    }
    return true;
}
/*===============================================
 *****************找回密码页*******************
 =================================================*/
//下一步
function forget_toNext(){
    var $page = $("#page-forget");
    if(mobileValid($page) && authCodeValid($page)){
        Common.sendPoint('WXSF_36-3');
        $.router.loadPage("#page-forget-2");
    }
}
/**
 * 设置新密码
 * @returns {boolean}
 */
function forget_setNewPsw(){
    var $page_pre = $("#page-forget");
    var $m = $page_pre.find(".mobile");
    var $g = $page_pre.find(".auth-code");
    var mobile = $.trim($m.val());
    var authCode = $.trim($g.val());
    //
    var $page = $("#page-forget-2");
    var $p = $page.find(".password");
    var $pc = $page.find(".password-confirm");
    var password = $.trim($p.val());
    var passwordConfirm = $.trim($pc.val());
    if(password === ""){
        Common.lhpShortMessage({msg:"请输入密码",top:"45%"});
        //$p.focus();
        return false;
    }
    if(password.length < 6){
        Common.lhpShortMessage({msg:"密码需大于6位",top:"45%"});
        //$p.focus();
        return false;
    }
    if(password !== passwordConfirm){
        Common.lhpShortMessage({msg:"两次输入的密码不一致",top:"45%"});
        //$pc.focus();
        return false;
    }
    Common.sendPoint('WXSF_37-2');
    $.showIndicator();
    $.ajax({
        type:"post",
        dataType:"json",
        data:{
            mobile:mobile,
            verif_code:authCode,
            pwd:password
        },
        url:domain+"/v1/user/fundpwd",
        success:function(res){
            $.hideIndicator();
            if(res.code == "s_ok"){
                $.router.loadPage("#page-login");
            }else{
                ajaxErrorHandle(res);
            }
        },
        error:function(){
            $.hideIndicator();
            Common.lhpShortMessage({msg:"网络异常",top:"45%"});
        }
    });
}

/*===============================================
 *****************注册页*******************
 =================================================*/
//下一步
function toNext(){
    var $page = $("#page-register");
    if(mobileValid($page) && authCodeValid($page)){
        Common.sendPoint('WXSF_31-3');
        $.router.loadPage("#page-register-2");
    }
}
/**
 * 设置新密码
 * @returns {boolean}
 */
function setNewPsw(){
    var $page_pre = $("#page-register");
    var $m = $page_pre.find(".mobile");
    var $g = $page_pre.find(".auth-code");
    var mobile = $.trim($m.val());
    var authCode = $.trim($g.val());
    //
    var $page = $("#page-register-2");
    var $p = $page.find(".password");
    var $pc = $page.find(".password-confirm");
    var password = $.trim($p.val());
    var passwordConfirm = $.trim($pc.val());
    if(password === ""){
        Common.lhpShortMessage({msg:"请输入密码",top:"45%"});
        //$p.focus();
        return false;
    }
    if(password.length < 6){
        Common.lhpShortMessage({msg:"密码需大于6位",top:"45%"});
        //$p.focus();
        return false;
    }
    if(password !== passwordConfirm){
        Common.lhpShortMessage({msg:"两次输入的密码不一致",top:"45%"});
        //$pc.focus();
        return false;
    }
    Common.sendPoint('WXSF_32-2');
    $.showIndicator();
    $.ajax({
        type:"post",
        dataType:"json",
        data:{
            mobile:mobile,
            verif_code:authCode,
            pwd:password
        },
        url:domain+"/v1/user/regist",
        success:function(res){
            $.hideIndicator();
            if(res.code == "s_ok"){
                $.router.loadPage("#page-auth-uncommitted");
            }else{
                ajaxErrorHandle(res);
            }
        },
        error:function(){
            $.hideIndicator();
            Common.lhpShortMessage({msg:"网络异常",top:"45%"});
        }
    });
}
/*===============================================
 *****************认证页--未提交认证信息***********
 =================================================*/
function gotoAuthPage(type){
    DATA.authType = type;
    $("#authTitle").text(function(){
        return type == 1?"师傅认证-基本信息":"服务人员认证-基本信息";
    });
    $("#authTitle_upload").text(function(){
        return type == 1?"师傅认证-上传资料":"服务人员认证-上传资料";
    });
    $.router.loadPage("#page-auth-type");
}
/*===============================================
 *****************认证页************************
 =================================================*/
function UserInfo(){
    this.$page = $("#page-auth-type");
    var p = this.$page;
    this.$name = p.find(".username");  //姓名
    this.$companyName = p.find(".company-name"); //公司名
    this.$workYear = p.find(".work-year"); //工作年限
    this.$refereesMobile = p.find(".referrer-mobile");  //推荐人手机号
    this.$myProfile = p.find(".my-profile");  //个人简介
}
UserInfo.prototype.uploadInit = function(){
    //用户图像上传
    $.imgUpload("userPic",1,"10mb","userPic",function(){
        Common.sendPoint('WXSF_33-3');
    });
};
UserInfo.prototype.uploadInit2 = function(){
    //身份证
    $.imgUpload("btnUploadSFZ",2,"10mb","imgSFZ",function(){
        Common.sendPoint('WXSF_34-2');
    });
    //人店合影
    $.imgUpload("btnUploadGP",2,"10mb","imgGP",function(){
        Common.sendPoint('WXSF_34-3');
    });
    //工牌
    $.imgUpload("btnUploadWorkCard",2,"10mb","imgWorkCard",function(){
        Common.sendPoint('WXSF_34-4');
    });
    //资质证书
    $.imgUpload("btnUploadCert",2,"10mb","imgCert",function(){
        Common.sendPoint('WXSF_34-5');
    });
};
UserInfo.prototype.valid_1 = function(){
    var name = $.trim(this.$name.val()),
        companyName = $.trim(this.$companyName.val()),
        workYear = $.trim(this.$workYear.val()),
        refereesMobile = $.trim(this.$refereesMobile.val()),
        myProfile = $.trim(this.$myProfile.val());
    DATA.imgUrl.pic = $("#userPic").attr("data-relsrc");
    if(name === ""){
        Common.lhpShortMessage({msg:"请填写姓名",top:"45%"});
        //this.$name.focus();
        return false;
    }
    if(companyName === ""){
        Common.lhpShortMessage({msg:"请填写公司名称",top:"45%"});
        //this.$companyName.focus();
        return false;
    }
    if(workYear === ""){
        Common.lhpShortMessage({msg:"请填写工作年限",top:"45%"});
        //this.$workYear.focus();
        return false;
    }
    if(refereesMobile != "" && !refereesMobile.match(Common.reg.phoneNumber)){
        Common.lhpShortMessage({msg:"请填写正确手机号",top:"45%"});
        //this.$refereesMobile.focus();
        return false;
    }
    if(myProfile == ""){
        Common.lhpShortMessage({msg:"请填写个人简介",top:"45%"});
        //this.$myProfile.focus();
        return false;
    }
    if(myProfile.length > 200){
        Common.lhpShortMessage({msg:"个人简介限200字",top:"45%"});
        //this.$myProfile.focus();
        return false;
    }
    if(!DATA.imgUrl.pic){
        Common.lhpShortMessage({msg:"请上传个人图像",top:"45%"});
        return false;
    }
    return true;
};

UserInfo.prototype.valid_2 = function(){
    with (DATA.imgUrl){
        idCard = $("#imgSFZ").attr("data-relsrc");
        groupPhoto = $("#imgGP").attr("data-relsrc");
        workCard = $("#imgWorkCard").attr("data-relsrc");
        cert = $("#imgCert").attr("data-relsrc");
    }
    if(!DATA.imgUrl.idCard){
        Common.lhpShortMessage({msg:"请上传身份证图片",top:"45%"});
        return false;
    }
    if(!DATA.imgUrl.groupPhoto){
        Common.lhpShortMessage({msg:"请上传人店合影图片",top:"45%"});
        return false;
    }
    if(!DATA.imgUrl.workCard){
        Common.lhpShortMessage({msg:"请上传工牌或公司证明图片",top:"45%"});
        return false;
    }

    return true;
};
UserInfo.prototype.submit = function(){
    var name = $.trim(this.$name.val()),
        companyName = $.trim(this.$companyName.val()),
        workYear = $.trim(this.$workYear.val()),
        refereesMobile = $.trim(this.$refereesMobile.val()),
        myProfile = $.trim(this.$myProfile.val());

    $.showIndicator();
    $.ajax({
        type:"post",
        dataType:"json",
        data:{
            type:DATA.authType==1?1:3,
            user_name:name,
            shop_name:companyName,
            work_experience:workYear,
            recommend_mobile:refereesMobile,
            desc:myProfile,
            header_logo:DATA.imgUrl.pic,
            image_idcard:DATA.imgUrl.idCard,
            image_shop_self:DATA.imgUrl.groupPhoto,
            image_work_card:DATA.imgUrl.workCard,
            image_certificate:DATA.imgUrl.cert
        },
        url:domain+"/v1/shoper/auth",
        success:function(res){
            $.hideIndicator();
            if(res.code == "s_ok"){
                $.router.loadPage("#page-auth-committed");
            }else{
                ajaxErrorHandle(res);
            }
        },
        error:function(){
            $.hideIndicator();
            Common.lhpShortMessage({msg:"网络异常",top:"45%"});
        }
    });
};
/*===============================================
 *****************页面初始化***********
 =================================================*/
function PageInit(){}
PageInit.prototype.login = function(){
    //忘记密码
    $("#btnForgetPsw").clickEvent(forgetPassword);

    //登录
    $("#btnLogin").clickEvent(login);

    //注册
    $("#btnRegister").clickEvent(gotoRegister);
};
PageInit.prototype.forget = function(){
    //获取验证码
    var $page = $("#page-forget");
    var gac = new GetAuthCode($("#mobile_forget"),$page,2);
    $("#forget_getAuthCode").clickEvent(function(){
        if(mobileValid($page)){
            Common.sendPoint('WXSF_36-2');
            var obj = $page.find(".get-auth-code")[0];
            gac.sendAjax(obj);
        }
    });

    //下一步
    $("#forget_btnNext").clickEvent(forget_toNext);

    //确认新密码
    $("#forget_btnConfirm").clickEvent(forget_setNewPsw);
};
PageInit.prototype.register = function(){
    //获取验证码
    var $page = $("#page-register");
    var gac = new GetAuthCode($("#mobile_register"),$page,1);
    $("#getAuthCode").clickEvent(function(){
        if(mobileValid($page)){
            Common.sendPoint('WXSF_31-2');
            var obj = $page.find(".get-auth-code")[0];
            gac.sendAjax(obj);
        }
    });

    //下一步
    $("#btnNext").clickEvent(toNext);

    //确认新密码
    $("#btnConfirm").clickEvent(setNewPsw);
};
PageInit.prototype.authUncommitted = function(){
    //师傅认证
    $("#btnAuthMaster").clickEvent(function(){
        Common.sendPoint('WXSF_33-1');
        gotoAuthPage(1);
    });
    //服务人员认证
    $("#btnAuthServiceman").clickEvent(function(){
        Common.sendPoint('WXSF_33-2');
        gotoAuthPage(2);
    });
};
PageInit.prototype.authType = function(){
    //如果存在推荐人号码则自动填入
    var referrer_mobile = sessionStorage.getItem("referrer_mobile");
    if(referrer_mobile && referrer_mobile != "null" && referrer_mobile != "undefined"){
        $("#page-auth-type").find(".referrer-mobile").val(referrer_mobile);
    }

    var ui = new UserInfo();
    //初始化上传插件
    ui.uploadInit();
    $("#btnNextAuth").clickEvent(function(){
        if(ui.valid_1()){
            Common.sendPoint('WXSF_33-4');
            $.router.loadPage("#page-auth-upload");
        }
    });

    //初始化上传插件
    ui.uploadInit2();

    //提交审核
    $("#btnSubmit_userAuth").clickEvent(function(){
        if(ui.valid_1() && ui.valid_2()){
            Common.sendPoint('WXSF_34-6');
            ui.submit();
        }
    });
};
PageInit.prototype.authCommittedfail = function(){  //认证失败
    $("#btnReauth").clickEvent(function(){
        $.router.loadPage("#page-auth-uncommitted");
    });
};
/**
 * ajax请求返回eror统一调用规则
 * error code  110需要重新登录
 */
function ajaxErrorHandle(res){
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
}
$(function(){
    //
    weixinConfig();

    $(document).on("pageInit", function() {
        var pi = new PageInit();
        DATA.currentPage = location.hash?location.hash.replace("#",""):"page-login";
        if(DATA.currentPage == "page-login"){
            pi.login();
        }else if(DATA.currentPage == "page-forget"){
            pi.forget();
        }else if(DATA.currentPage == "page-register"){
            pi.register();
        }else if(DATA.currentPage == "page-auth-uncommitted"){
            pi.authUncommitted();
        }else if(DATA.currentPage == "page-auth-type"){
            pi.authType();
        }else if(DATA.currentPage == "page-auth-upload"){
            $.imgUpload("btnUploadSFZ",2,"10mb","imgSFZ",function(){
                Common.sendPoint('WXSF_34-2');
            });
            $.imgUpload("btnUploadGP",2,"10mb","imgGP",function(){
                Common.sendPoint('WXSF_34-3');
            });
            $.imgUpload("btnUploadWorkCard",2,"10mb","imgWorkCard",function(){
                Common.sendPoint('WXSF_34-4');
            });
            $.imgUpload("btnUploadCert",2,"10mb","imgCert",function(){
                Common.sendPoint('WXSF_34-5');
            });
        }else if(DATA.currentPage == "page-auth-committedfail"){
            pi.authCommittedfail();
        }
    });
    $.init();

    $(window).on("pageshow",function(){
        location.href = "#"+(location.href.split("#")[1]||"page-login");
    });
});

/*********************************微信接口*************start***********************/
function weixinConfig(){
    var url = location.href.split("#")[0];
    $.ajax({
        type:"get",
        dataType:"json",
        url:domain+"/v1/wx/getTicket?url="+encodeURIComponent(url),
        success:function(res){
            if(res.code == "s_ok"){
                var r = res.result;
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印
                    appId: 'wx0654571e2c32b878', // 必填，企业号的唯一标识，此处填写企业号corpid
                    timestamp: r.timestamp, // 必填，生成签名的时间戳
                    nonceStr: r.noncestr, // 必填，生成签名的随机串
                    signature: r.sign,// 必填，签名，见附录1
                    jsApiList: ["onMenuShareTimeline","onMenuShareAppMessage"] //必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
            }
        },
        error:function(res){
            Common.lhpShortMessage({msg:"网络异常",top:"45%"});
        }
    });
}
wx.ready(function(){
    //隐藏按钮
    wx.hideOptionMenu();
});
/*********************************微信接口*************end***********************/