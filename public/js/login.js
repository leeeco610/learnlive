/**
 * Created by lihaipeng on 15-10-21.
 */
$(function(){
    $.supersized({
        // Functionality
        slide_interval     : 6000,    // Length between transitions
        transition         : 1,    // 0-None, 1-Fade, 2-Slide Top, 3-Slide Right, 4-Slide Bottom, 5-Slide Left, 6-Carousel Right, 7-Carousel Left
        transition_speed   : 3000,    // Speed of transition
        performance        : 1,    // 0-Normal, 1-Hybrid speed/quality, 2-Optimizes image quality, 3-Optimizes transition speed // (Only works for Firefox/IE, not Webkit)

        // Size & Position
        min_width          : 0,    // Min width allowed (in pixels)
        min_height         : 0,    // Min height allowed (in pixels)
        vertical_center    : 1,    // Vertically center background
        horizontal_center  : 1,    // Horizontally center background
        fit_always         : 0,    // Image will never exceed browser width or height (Ignores min. dimensions)
        fit_portrait       : 1,    // Portrait images will not exceed browser height
        fit_landscape      : 0,    // Landscape images will not exceed browser width

        // Components
        slide_links        : 'blank',    // Individual links for each slide (Options: false, 'num', 'name', 'blank')
        slides             : [    // Slideshow Images
            {image : './img/1.jpg'},
            {image : './img/2.jpg'},
            {image : './img/3.jpg'}
        ]
    });

    //login
    var lg = new Login();
    $("#submit").on("click",function(){
        if(lg.valid()){
            lg.submit();
        }
    });
});

function Login(){
    this.$username = $("#username");
    this.$password = $('#password');
}
Login.prototype.valid = function(){  //验证
    var $u = this.$username;
    var $p = this.$password;

    var password = $.trim($p.val());
    var username = $.trim($u.val());
    if(username === ""){
        Common.alert("请输入用户名");
        return false;
    }
    if(password === ""){
        Common.alert("请输入密码");
        return false;
    }

    return true;
};
Login.prototype.submit = function(){
    var $u = this.$username;
    var $p = this.$password;

    var password = $.trim($p.val());
    var username = $.trim($u.val());
    $.post("/user/login",{
        username:username,
        password:password
    },function(res){
        if(res.status == "ok"){
            location.href = "index.html";
        }else{
            Common.ajaxFail(res);
        }
    },"json").fail(function(){
        Common.alert("网络异常，稍后重试");
    });
};

window.onload = function()
{
    $(".connect p").eq(0).animate({"left":"0%"}, 600);
    $(".connect p").eq(1).animate({"left":"0%"}, 400);
};

