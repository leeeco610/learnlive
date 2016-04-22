/**
 * Created by zykj_09 on 2015/9/25.
 */
var DATA = {
    isAdmin:false,  //是否是管理员登录
    currentPage:null,
    setSleepTime_tip:'提示：选中指定的日期则为休息日，反选则取消休息',
    order_click_to_details:false,  //订单列表点击进入订单详情
    index_click_to_orderList:false  //首页点击进入订单列表
};

/* ===============================================================================
 ************   首页   ************
 =============================================================================== */
function Index(){
    this.init();
}
Index.prototype.init = function(){
    var _ = this;
    $.showIndicator();
    $.ajax({
        type:"post",
        dataType:"json",
        async:false,
        url:domain+"/v1/user/get",
        success:function(res){
            $.hideIndicator();
            if(res.code == "s_ok"){
                var r = res.result;
                var img_url = r.image_header;
                if(!~img_url.indexOf("http://")){
                    img_url = r.image_domain+ r.image_header;
                }
                $("#userName").text(r.user_name);
                $("#userPic").attr("src",img_url);

                sessionStorage.setItem("mobile", r.mobile);  //分享时会用到

                //用户类型 1师傅  3SA  4管理员
                if(r.is_manager == 1){
                    userType = "img/user_administrator_icon.png";
                    DATA.isAdmin = true;
                }else{
                    var userType;
                    if(r.type == 1){
                        userType = "img/user_master_icon.png";
                    }else if(r.type == 3){
                        userType = "img/user_sa_icon.png";
                    }
                }
                $("#userType").attr("src", userType);

                //用户是否开启服务预约 1开启 0没开启
                var $ser = $("#serviceAppoint");
                var $txt = $ser.find(".title-text");
                var $radio = $ser.find("input[type='checkbox']");
                if(r.reserve_status == 1){
                    $txt.text("关闭服务预约");
                    $radio[0].checked = true;
                }else{
                    $txt.text("开启服务预约");
                    $radio[0].checked = false;
                }

                weixinConfig();
                _.getStatInfo();
            }else{
                ajaxErrorHandle(res);
            }
        },
        error:function(res){
            $.hideIndicator();
            Common.lhpShortMessage({msg:"网络异常",top:"45%"});
        }
    });
};
Index.prototype.getStatInfo = function(){  //获取预约受理和回答统计信息
    this.orderStat();
    this.qaStat();
};
Index.prototype.orderStat = function(){
    $.ajax({
        type:"post",
        dataType:"json",
        async:false,
        url:domain+"/v1/maintenance/getTotalInfo",
        success:function(res){
            if(res.code == "s_ok"){
                var r = res.result;
                $("#total_apply").text(r.total_apply);
                $("#total_accept").text(r.total_accept);
                $("#total_finish").text(r.total_finish);
                $("#total_cancel").text(r.total_cancel);
            }else{
                ajaxErrorHandle(res);
            }
        },
        error:function(res){
            Common.lhpShortMessage({msg:"网络异常",top:"45%"});
        }
    });
};
Index.prototype.qaStat = function(){
    $.ajax({
        type:"post",
        dataType:"json",
        async:false,
        url:domain+"/v1/myanswer/getTotalInfo",
        success:function(res){
            if(res.code == "s_ok"){
                var r = res.result;
                $("#total_qa_ask").text(r.total_ask);
                $("#total_qa_unaccept").text(r.total_unaccept);
                $("#total_qa_accept").text(r.total_accept);
                $("#total_qa_answer").text(r.total_answer);

                //是否有新的追问
                var $tqa = $("#total_qa_ask");
                $tqa.find(".has-new").remove();
                if(r.has_new_ask == 1){
                    $tqa.closest("li").append('<i class="has-new"></i>');
                }
                //是否有待解决问题
                var $uq = $("#unanswerQuestion");
                $uq.find(".has-new").remove();
                if(r.has_unanswer == 1){
                    $uq.append('<i class="has-new"></i>');
                }
            }else{
                ajaxErrorHandle(res);
            }
        },
        error:function(res){
            Common.lhpShortMessage({msg:"网络异常",top:"45%"});
        }
    });
};
/* ===============================================================================
 ************   个人资料页   ************
 =============================================================================== */
function UserInfo(){
    this.init();  //init
    this.userPicUploadInit();  //初始化用户图像上传
}
/**
 *  初始化用户信息
 */
UserInfo.prototype.init = function(){
    $.showIndicator();
    $.ajax({
        type:"post",
        dataType:"json",
        url:domain+"/v1/shoper/getDetail",
        success:function(res){
            $.hideIndicator();
            if(res.code == "s_ok"){
                var r = res.result;
                var img_url = r.image_header;
                if(!~r.image_header.indexOf("http://")){
                    img_url = r.image_domain+ r.image_header;
                }
                $("#userPic_my").attr("src", img_url);  //用户图像
                $("#userName_my").text(r.user_name);  //师傅名称
                $("#companyName_my").text(r.shop_name);  //公司名称
                $("#workYear_my").text(r.work_life);  //工作年限
                $("#mobile_my").text(r.mobile);  //手机号码
                $("#userIntro_my").text(r.desc);  //个人简介
                //$("#userAuth_my").text(function(){
                //    return r.occupat_type == 1?"师傅认证":"服务人员认证";
                //});
            }else{
                ajaxErrorHandle(res);
            }
        },
        error:function(res){
            $.hideIndicator();
            Common.lhpShortMessage({msg:"网络异常",top:"45%"});
        }
    });
};
/**
 * 用户头像上传
 */
UserInfo.prototype.userPicUploadInit = function(){
    $.imgUpload("userInfo",1,"10mb","userPic_my",function(img_uri,img_url){
        Common.sendPoint('WXSF_19-2');
        $.ajax({
            type:"post",
            dataType:"json",
            data:{logo:img_uri},
            url:domain+"/v1/shoper/updateLogo",
            success:function(res){
                if(res.code == "s_ok"){

                }else{
                    ajaxErrorHandle(res);
                }
            },
            error:function(res){
                Common.lhpShortMessage({msg:"网络异常",top:"45%"});
            }
        });
    });
};
/**
 * 用户修改个人简介
 */
UserInfo.prototype.modifyIntro = function(){
    Common.sendPoint('WXSF_19-3');
    var userIntro = $.trim($(this).find(".user-intro").text());
    var updateDesc = function(desc){
        $.ajax({
            type:"post",
            dataType:"json",
            data:{desc:desc},
            url:domain+"/v1/shoper/updateDesc",
            success:function(res){
                if(res.code == "s_ok"){
                    $("#userIntro_my").text(desc);
                    Common.lhpShortMessage({msg:"修改成功",top:"45%"});
                }else{
                    ajaxErrorHandle(res);
                }
            },
            error:function(res){
                Common.lhpShortMessage({msg:"网络异常",top:"45%"});
            }
        });
    };
    Common.lhpDialog({
        id:"modifyUserIntro",
        top:"25%",
        title:'个人简介',
        content:'<textarea id="userIntro">'+userIntro+'</textarea>',
        btn:[
            {
                name:'取消',
                callback:function(){
                    Common.sendPoint('WXSF_20-1');
                }
            },
            {
                name:'确认',
                css:'background-color:#0DADFB;border-color:#0DADFB;color:#FFFFFF',
                callback:function(){
                    Common.sendPoint('WXSF_20-2');
                    var userIntro_n = $.trim($("#userIntro").val());
                    if(userIntro !== userIntro_n){
                        updateDesc(userIntro_n);
                    }
                }
            }
        ]
    });
};
/* ===============================================================================
 ************   预约受理   ************
 =============================================================================== */
function Order(type){
    this.$page = $("#page-orderList");
    this.type = type || sessionStorage.getItem("order_type") || 1;
    this.isLoading = false;
    this.pageNumber = 1;

    this.init();
}
Order.prototype.reset = function(){
    var p = this.$page;
    p.find(".buttons-tab a").removeClass("active");
    p.find(".tabs .tab").removeClass("active")
};
Order.prototype.init = function(){
    var _ = this,
        p = this.$page,
        t = this.type;

    this.reset();
    p.find(".buttons-tab a[data-type='"+parseInt(t)+"']").addClass("active");
    $("#tab"+t).addClass("active");

    //添加Tab点击事件，在点击时重新加载该tab下的数据
    function tabBtnHandle(){
        $(this).addClass("active").siblings().removeClass("active");
        var type = this.dataset.type;
        var pointid = this.dataset.pointid;
        Common.sendPoint(pointid);
        _.type = type;
        $("#tab"+type).addClass("active").siblings().removeClass("active");
        sessionStorage.setItem("order_type",type);
        //加载中...
        _.loadOrderData(_.type,1,10);
    }
    p.find(".buttons-tab a").each(function(){
        $(this).clickEvent(tabBtnHandle);
    });

    //数据加载
    _.loadOrderData(_.type,1,10);

    //下拉刷新
    $(document).off("refresh").on("refresh",".pull-to-refresh-content",function(){
        _.pageNumber = 1;
        _.loadOrderData(_.type,1,10,function(){
            //加载完毕重置
            $.pullToRefreshDone(".pull-to-refresh-content");
        });
    });
    //上拉加载更多
    $(document).off("infinite").on("infinite",'.infinite-scroll',function(){
        if(_.isLoading) return;

        //设置flag
        _.isLoading = true;
        _.loadOrderData(_.type,++_.pageNumber,10);
    });
};
Order.prototype.renderOrderData = function(data,pageNumber,callback){  //渲染数据
    var arr = [];
    var domain = data.image_domain;
    var $ul = $("#tab"+this.type).find("ul");
    if(pageNumber == 1 && data.maintance_list.length == 0){
        Common.lhpShortMessage({msg:"暂无数据",top:"45%"});
    }
    $.each(data.maintance_list,function(){
        var img_url = domain+this.image_brand_logo;
        if(~this.image_brand_logo.indexOf("http://")){
            img_url = this.image_brand_logo;
        }
        arr.push('<li>');
        arr.push('      <div class="item-content">');
        arr.push('        <div class="item-inner" data-orderid="'+this.maintance_id+'">');
        arr.push('              <div class="item-title-row">');
        arr.push('                  <div class="item-title"><span class="user-name">'+this.user_name+'</span><img class="car-type" src="'+img_url+'"><span class="time">'+this.maintance_time+'</span></div>');
        arr.push('              </div>');
        if(DATA.isAdmin){
            arr.push('              <div class="item-subtitle">服务人员：'+this.engineer_name+'</div>');
        }
        arr.push('              <div class="item-text">'+this.remark+'</div>');
        arr.push('          </div>');
        arr.push('          <div class="item-media">');
        arr.push('            <a href="javascript:void(0);" class="call-mobile" data-tel="'+this.user_mobile+'"><img src="img/order_call_icon.png"></a>');
        arr.push('          </div>');
        arr.push('      </div>');
        arr.push('</li>');
    });
    if(pageNumber == 1){
        $ul.empty();
    }
    $ul.append(arr.join(''));
    callback();  //回调

    //已经加载到最后一页
    if(pageNumber >= data.page_count){
        //所有数据加载完毕注销无限加载时间，以防不必要的加载
        $.detachInfiniteScroll($(".infinite-scroll"));
    }else{
        //添加无限加载
        $.attachInfiniteScroll($(".infinite-scroll"));
    }

    //刷新滚动条
    $.refreshScroller();

    //每个预约订单点击事件
    this.checkOrderDetailsEvent(this.type);
};
Order.prototype.loadOrderData = function(type,pageNumber,pageSize,callback){  //获取数据列表
    var _ = this;
    pageNumber = pageNumber || 1;
    pageSize = pageSize || 10;
    callback = callback || function(){};
    if(pageNumber == 1){
        $.showIndicator();
    }else{
        $('.infinite-scroll-preloader').show();
    }
    $.ajax({
        type:"post",
        dataType:"json",
        data:{
            status:type,
            page_no:pageNumber,
            page_size:pageSize
        },
        url:domain+"/v1/maintenance/list",
        success:function(res){
            if(pageNumber == 1){
                $.hideIndicator();
            }else{
                $('.infinite-scroll-preloader').hide();
            }
            if(res.code == "s_ok"){
                _.renderOrderData(res.result,pageNumber,callback);
            }else{
                ajaxErrorHandle(res);
            }
            _.isLoading = false;
        },
        error:function(res){
            if(pageNumber == 1){
                $.hideIndicator();
            }else{
                $('.infinite-scroll-preloader').hide();
            }
            Common.lhpShortMessage({msg:"网络异常",top:"45%"});
            _.isLoading = false;
            _.pageNumber --;
        }
    });
};
Order.prototype.checkOrderDetailsEvent = function(type){
    $("#tab"+type).find(".call-mobile").click(function(){
        var mobile = this.dataset.tel;
        if(type == 1){
            Common.sendPoint('WXSF_5-2');
        }else if(type == 2){
            Common.sendPoint('WXSF_6-2');
        }else if(type == 3){
            Common.sendPoint('WXSF_3-2');
        }else if(type == 5){
            Common.sendPoint('WXSF_4-2');
        }
        location.href = "tel:"+mobile;
        return false;
    });
    $("#tab"+type+" .item-inner").each(function(){
        var orderId = this.dataset.orderid;
        $(this).click(function(){
            sessionStorage.setItem("orderId",orderId);
            $.router.loadPage("#page-orderDetails");
            DATA.order_click_to_details = true;
            if(type == 1){
                Common.sendPoint('WXSF_5-1');
            }else if(type == 2){
                Common.sendPoint('WXSF_6-1');
            }else if(type == 3){
                Common.sendPoint('WXSF_3-1');
            }else if(type == 5){
                Common.sendPoint('WXSF_4-1');
            }
            new OrderDetails();
        });
    });
};
/* ===============================================================================
 ************   订单详情   ************
 =============================================================================== */
function OrderDetails(){
    this.orderId = sessionStorage.getItem("orderId");

    //orderId不存在则返回列表页
    this.orderId?this.init(): $.router.loadPage("#page-orderList");
}
OrderDetails.prototype.init = function(){
    var _ = this;

    var callback = function(){
        var $btnCancel = $("#btnCancel"),
            $btnAccept = $("#btnAccept"),
            $btnFinished = $("#btnFinished");
        if($btnCancel.length !== 0){
            $btnCancel.clickEvent(function(){
                Common.sendPoint('WXSF_21-2');
                _.cancelSubscribe.call(_);
            });
        }
        if($btnAccept.length !== 0){
            $btnAccept.clickEvent(function(){
                Common.sendPoint('WXSF_21-3');
                _.acceptSubscribe.call(_);
            });
        }
        if($btnFinished.length !== 0){
            $btnFinished.clickEvent(function(){
                Common.sendPoint('WXSF_21-4');
                _.finished.call(_);
            });
        }
    };
    //加载数据
    _.loadOrderDetails(callback);
};
OrderDetails.prototype.loadOrderDetails = function(callback){
    var _ = this;
    callback = callback || function(){};
    $.showIndicator();
    $.ajax({
        type:"post",
        dataType:"json",
        data:{
            maintance_id:this.orderId
        },
        url:domain+"/v1/maintenance/getDetail",
        success:function(res){
            $.hideIndicator();
            if(res.code == "s_ok"){
                _.renderOrderDetails(res.result,callback);
            }else{
                ajaxErrorHandle(res);
            }
        },
        error:function(res){
            $.hideIndicator();
            Common.lhpShortMessage({msg:"网络异常",top:"45%"});
        }
    });
};
OrderDetails.prototype.renderOrderDetails = function(data,callback){
    var img_url = data.image_car_brand;
    if(!~data.image_car_brand.indexOf("http://")){
        img_url = data.image_doamin+data.image_car_brand;
    }
    var arr = [];
    arr.push('<div class="content-header">');
    arr.push('      <div class="ch-per">');
    arr.push('          <img src="'+img_url+'">');
    arr.push('      </div>');
    arr.push('      <div class="ch-per">');
    arr.push('          <span class="user-car-type">'+data.car_brand_name+'</span>');
    arr.push('      </div>');
    arr.push('      <div class="ch-per">');
    arr.push('          <span class="car-name">'+data.car_brand_name+'-'+data.car_model_name+'</span>');
    arr.push('      </div>');
    arr.push('      <div class="ch-per">');
    arr.push('          <span class="mileage">行车里程'+data.car_mileage+'KM</span>');
    arr.push('      </div>');
    arr.push('</div>');
    arr.push('<div class="list-block">');
    arr.push('      <ul>');
    arr.push('          <li class="item-content">');
    arr.push('              <div class="item-inner">');
    arr.push('                  <div class="item-title">车牌</div>');
    arr.push('                  <div class="item-after">'+data.plate_no+'</div>');
    arr.push('              </div>');
    arr.push('          </li>');
    arr.push('          <li class="item-content">');
    arr.push('              <div class="item-inner">');
    arr.push('                  <div class="item-title">购车日期</div>');
    arr.push('                  <div class="item-after">'+data.purchase+'</div>');
    arr.push('              </div>');
    arr.push('          </li>');
    arr.push('          <li class="item-content">');
    arr.push('              <div class="item-inner">');
    arr.push('                  <div class="item-title">服务人员</div>');
    arr.push('                  <div class="item-after">'+data.master_name+'</div>');
    arr.push('              </div>');
    arr.push('          </li>');
    arr.push('          <li class="item-content">');
    arr.push('              <div class="item-inner">');
    arr.push('                  <div class="item-title">联系人</div>');
    arr.push('                  <div class="item-after">'+data.user_name+'</div>');
    arr.push('              </div>');
    arr.push('          </li>');
    arr.push('          <li class="item-content">');
    arr.push('              <div class="item-inner">');
    arr.push('                  <div class="item-title">手机</div>');
    arr.push('                  <div class="item-after user-mobile">'+data.user_mobile+'</div>');
    arr.push('              </div>');
    arr.push('          </li>');
    arr.push('          <li class="item-content">');
    arr.push('              <div class="item-inner">');
    arr.push('                  <div class="item-title">预约时间</div>');
    arr.push('                  <div class="item-after">'+data.maintance_time+'</div>');
    arr.push('              </div>');
    arr.push('          </li>');
    arr.push('          <li class="item-content">');
    arr.push('              <div class="item-inner">');
    arr.push('                  <div class="item-title">代金券</div>');
    if(data.coupon == 0){
        arr.push('                  <div class="item-after vouchers-after">无</div>');
    }else{
        arr.push('                  <div class="item-after vouchers-after">'+data.coupon+'元代金券</div>');
    }
    arr.push('              </div>');
    arr.push('          </li>');
    arr.push('          <li class="item-content">');
    arr.push('              <div class="item-inner">');
    arr.push('                  <div class="item-title">备注</div>');
    arr.push('                  <div class="item-after remark-after">'+data.remark+'</div>');
    arr.push('              </div>');
    arr.push('          </li>');
    if(data.status == 5){  //已取消
        arr.push('          <li class="item-content">');
        arr.push('              <div class="item-inner">');
        arr.push('                  <div class="item-title">取消原因</div>');
        arr.push('                  <div class="item-after remark-after">'+data.cancel_reason+'</div>');
        arr.push('              </div>');
        arr.push('          </li>');
    }
    arr.push('      </ul>');
    arr.push('</div>');
    arr.push('<div class="content-per btn-wrap" id="btnWrap">');
    if(data.status == 2){ //待完成
        arr.push('<div class="btn-outer"><a class="btn-finished" id="btnFinished">已完成</a></div>');
    }else if(data.status == 1){
        arr.push('<a class="btn-cancel" id="btnCancel">取消预约</a><a class="btn-accept" id="btnAccept">受理</a>');
    }
    arr.push('</div>');
    var $od = $("#orderDetails");
    $od.html(arr.join(''));

    //回调
    callback();
};
OrderDetails.prototype.cancelSubscribe = function(){  //取消预约
    var _ = this;
    Common.lhpDialog({
        id:"cancelDialog",
        top:"25%",
        title:'取消说明',
        content:'<textarea id="cancelExplain" placeholder="取消预约说明，此处限140字" maxlength="140"></textarea>',
        btn:[
            {
                name:'返回',
                callback:function(){
                    Common.sendPoint('WXSF_22-1');
                }
            },
            {
                name:'确认',
                css:'background-color:#0DADFB;border-color:#0DADFB;color:#FFFFFF',
                callback:function(){
                    Common.sendPoint('WXSF_22-2');
                    var reason = $.trim($("#cancelExplain").val());
                    _.cancelSubmit(reason);
                    return false;
                }
            }
        ]
    });
};
OrderDetails.prototype.cancelSubmit = function(reason){
    var orderId = sessionStorage.getItem("orderId");
    $.showIndicator();
    $.ajax({
        type:"post",
        dataType:"json",
        data:{
            maintance_id:orderId,
            reason:reason
        },
        url:domain+"/v1/maintenance/cancel",
        success:function(res){
            $.hideIndicator();
            if(res.code == "s_ok"){
                $("#cancelDialog").remove();
                $("#lockScreen").remove();
                $("#btnWrap").empty();
                Common.lhpShortMessage({msg:"预约已成功取消",top:"45%"});
                setTimeout(function(){
                    var $tip = $("#showShortMessage").closest(".win-wrap");
                    $tip.length > 0 && $tip.remove();
                    sessionStorage.setItem("order_type",1);
                    DATA.index_click_to_orderList = false; //会自动刷新tab下面数据
                    $.router.loadPage("#page-orderList");
                },2500);
            }else{
                ajaxErrorHandle(res);
            }
        },
        error:function(res){
            $.hideIndicator();
            Common.lhpShortMessage({msg:"网络异常",top:"45%"});
        }
    });
};
OrderDetails.prototype.acceptSubscribe = function(){  //受理预约
    var orderId = sessionStorage.getItem("orderId");
    $.showIndicator();
    $.ajax({
        type:"post",
        dataType:"json",
        data:{
            maintance_id:orderId
        },
        url:domain+"/v1/maintenance/accept",
        success:function(res){
            $.hideIndicator();
            if(res.code == "s_ok"){
                Common.lhpShortMessage({msg:"受理成功",top:"45%"});
                setTimeout(function(){
                    var $tip = $("#showShortMessage").closest(".win-wrap");
                    $tip.length > 0 && $tip.remove();
                    sessionStorage.setItem("order_type",1);
                    DATA.index_click_to_orderList = false; //会自动刷新tab下面数据
                    $.router.loadPage("#page-orderList");
                },2500);
            }else{
                ajaxErrorHandle(res);
            }
        },
        error:function(res){
            $.hideIndicator();
            Common.lhpShortMessage({msg:"网络异常",top:"45%"});
        }
    });
};
OrderDetails.prototype.finished = function(){  //已经完成
    var _ = this;
    $.showIndicator();
    $.ajax({
        type:"post",
        dataType:"json",
        url:domain+"/v1/car/part/list",
        success:function(res){
            $.hideIndicator();
            if(res.code == "s_ok"){
                _.chooseCarParts(res.result.part_list);
            }else{
                ajaxErrorHandle(res);
            }
        },
        error:function(res){
            $.hideIndicator();
            Common.lhpShortMessage({msg:"网络异常",top:"45%"});
        }
    });
};
OrderDetails.prototype.chooseCarParts = function(list){  //选择配件
    var $pop = $("#popup_carParts");
    $pop.length > 0 && $pop.remove();

    var _ = this;
    var arr = [];
    arr.push('<div class="popup popup-about" id="popup_carParts">');
    arr.push('      <header class="bar bar-nav">');
    arr.push('          <a class="button button-link button-nav pull-left close-popup" onclick="Common.sendPoint(\'WXSF_23-1\')" href="#">');
    arr.push('              <span class="icon icon-left"></span>');
    arr.push('          </a>');
    arr.push('          <h1 class="title">维修配件</h1>');
    arr.push('      </header>');
    arr.push('      <div class="content">');
    arr.push('          <div class="list-block">');
    arr.push('              <ul>');
    $.each(list || [],function(){
        arr.push('                  <li>');
        arr.push('                      <label class="label-checkbox item-content">');
        arr.push('                          <div class="item-inner">');
        arr.push('                              <div class="item-text">'+this.part_name+'</div>');
        arr.push('                          </div>');
        arr.push('                      <input type="checkbox" data-id="'+this.part_id+'">');
        arr.push('                          <div class="item-media"><i class="icon icon-form-checkbox"></i></div>');
        arr.push('                      </label>');
        arr.push('                  </li>');
    });
    arr.push('              </ul>');
    arr.push('          </div>');
    arr.push('      </div>');
    //===============提交按钮======================
    arr.push('      <div class="btn-wrap">');
    arr.push('          <a class="btn-cancel" id="btnCancel_carParts">取消</a>');
    arr.push('          <a class="btn-submit" id="btnSubmit_carParts">提交</a>');
    arr.push('      </div>');
    arr.push('</div>');
    $.popup(arr.join(''));

    $("#popup_carParts").on("change","input[type='checkbox']",function(){
        Common.sendPoint('WXSF_23-2');
    });
    //取消
    $("#btnCancel_carParts").clickEvent(function(){
        Common.sendPoint('WXSF_23-3');
        $.closeModal("#popup_carParts");
    });
    //提交
    $("#btnSubmit_carParts").clickEvent(function(){
        Common.sendPoint('WXSF_23-4');
        var $checkboxs = $("#popup_carParts").find("input[type='checkbox']");
        var ids = "";
        $.each($checkboxs,function(){
            if(this.checked){
                ids += $(this).attr("data-id")+",";
            }
        });
        if(ids != ""){
            ids = ids.substring(0,ids.length-1);
        }
        //
        _.finishedToSubmit(ids);
    });
};
OrderDetails.prototype.finishedToSubmit = function(ids){  //已完成提交
    var _ = this;
    var orderId = sessionStorage.getItem("orderId");
    $.showIndicator();
    $.ajax({
        type:"post",
        dataType:"json",
        data:{
            maintance_id:orderId,
            part_ids:ids
        },
        url:domain+"/v1/maintenance/finish",
        success:function(res){
            $.hideIndicator();
            if(res.code == "s_ok"){
                $.closeModal();
                _.callPhone();
            }else{
                ajaxErrorHandle(res);
            }
        },
        error:function(res){
            $.hideIndicator();
            Common.lhpShortMessage({msg:"网络异常",top:"45%"});
        }
    });
};
OrderDetails.prototype.callPhone = function(){
    var mobile = $("#orderDetails").find(".user-mobile").text();
    Common.lhpDialog({
        id:"finishedDialog",
        top:"30%",
        title:'',
        content:'<div style="text-align: center;font-size:15px;color: #212121;padding-bottom: 20px;"><div style="margin-bottom: 10px;"><img src="img/popup_success_icon.png" style="width:40px;vertical-align: middle;"></div>已完成，通知用户取车？</div>',
        btn:[
            {
                name:'返回首页',
                callback:function(){
                    Common.sendPoint('WXSF_25-1');
                    $.router.loadPage("#page-index");
                }
            },
            {
                name:'拨打电话',
                css:'background-color:#66BCA2;border-color:#66BCA2;color:#FFFFFF',
                callback:function(){
                    Common.sendPoint('WXSF_25-2');
                    location.href = "tel:"+mobile;
                    return false;
                }
            }
        ]
    });
};
/*===============================================
 *****************修改密码*******************
 =================================================*/
/**
 * 设置新密码
 * @returns {boolean}
 */
function modify_setNewPsw(){
    var $page_pre = $("#page-forget");
    var $m = $page_pre.find(".mobile");
    var $g = $page_pre.find(".auth-code");
    var mobile = $.trim($m.val());
    var authCode = $.trim($g.val());
    //
    var $page = $("#page-modifyPsw");
    var $p_old = $page.find(".password-old");
    var $p = $page.find(".password");
    var $pc = $page.find(".password-confirm");
    var password_old = $.trim($p_old.val());
    var password = $.trim($p.val());
    var passwordConfirm = $.trim($pc.val());
    if(password_old === ""){
        Common.lhpShortMessage({msg:"请输入旧密码",top:"45%"});
        $p_old.focus();
        return false;
    }
    if(password === ""){
        Common.lhpShortMessage({msg:"请输入新密码",top:"45%"});
        $p.focus();
        return false;
    }
    if(password.length < 6){
        Common.lhpShortMessage({msg:"密码需大于6位",top:"45%"});
        $p.focus();
        return false;
    }
    if(password !== passwordConfirm){
        Common.lhpShortMessage({msg:"两次输入的密码不一致",top:"45%"});
        $pc.focus();
        return false;
    }
    Common.sendPoint('WXSF_18-2');
    $.showIndicator();
    $.ajax({
        type:"post",
        dataType:"json",
        data:{
            old_pwd:password_old,
            new_pwd:password
        },
        url:domain+"/v1/user/changepwd",
        success:function(res){
            $.hideIndicator();
            if(res.code == "s_ok"){
                Common.lhpShortMessage({msg:"修改密码成功",top:"45%"});
                setTimeout(function(){
                    $.router.loadPage("#page-index");
                },999);
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
 *****************验证码获取  以及 公用验证*******************
 =================================================*/
function GetAuthCode($mobile,$page,type){
    this.$m = $mobile;
    this.$p = $page;
    this.type = type;
}
//发送获取验证码请求
GetAuthCode.prototype.sendAjax = function(obj){
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
            if(!res.msg) return ;
            Common.lhpShortMessage({msg:res.msg,top:"45%"});
        },
        error:function(){
            Common.lhpShortMessage({msg:"网络异常",top:"45%"});
        }
    });
    //倒计时
    this.countdown(obj);
    $(obj).removeClickEvent();
};
//按钮倒计时
var countdown = 60;
GetAuthCode.prototype.countdown = function(obj){
    var self = this;
    var _args = arguments;
    if (countdown == 0) {
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
        $m.focus();
        return false;
    }
    if(!mobile.match(Common.reg.phoneNumber)){
        Common.lhpShortMessage({msg:"请填写正确的手机号码",top:"45%"});
        $m.focus();
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
        $g.focus();
        return false;
    }
    if(authCode.length !== 6){
        Common.lhpShortMessage({msg:"验证码输入错误",top:"45%"});
        $g.focus();
        return false;
    }
    return true;
}
/* ===============================================================================
 ************   页面初始化函数   ************
 =============================================================================== */
function PageInit(){

}
PageInit.prototype.index = function(){  //首页
    //初始化首页数据
    new Index();
    //分享
    $("#masterShare").clickEvent(function(){
        Common.sendPoint('WXSF_1-12');
        Common.sharePage();
    });
    //设置休息时间
    $("#setSleepTime").clickEvent(function(){
        Common.sendPoint('WXSF_1-11');
        return $.router.loadPage("#page-setSleepTime");
    });
    //设置
    $("#setting").clickEvent(function(){
        Common.sendPoint('WXSF_1-13');
        return $.router.loadPage("#page-setting");
    });
    //待解决问题
    $("#unanswerQuestion").clickEvent(function(){
        Common.sendPoint('WXSF_1-10');
        location.href = "questions.html?type=tobesolved";
    });
    //===从首页进入 预约受理页面===
    $("#orderList li").each(function(){
        var type = this.dataset.type;
        var pointid = this.dataset.pointid;
        $(this).clickEvent(function(){
            $.router.loadPage("#page-orderList");
            sessionStorage.setItem("order_type",type);
            DATA.index_click_to_orderList = true;
            new Order(type);
            Common.sendPoint(pointid);
        });
    });
};
PageInit.prototype.setting = function(){
    var doServiceAppoint = function(reserveStatus){
        var $s = $("#serviceAppoint");
        var $r = $s.find("input[type='checkbox']");
        $.showIndicator();
        $.ajax({
            type:"post",
            dataType:"json",
            data:{reserveStatus:reserveStatus},
            url:domain+"/v1/shoper/updateReserveStatus",
            success:function(res){
                $.hideIndicator();
                if(res.code == "s_ok"){
                    var $st = $("#serviceAppoint").find(".title-text");
                    if($r[0].checked){
                        $r[0].checked = false;
                        $st.text("开启服务预约");
                        Common.lhpShortMessage({msg:"关闭成功",top:"45%"});
                        Common.sendPoint('WXSF_17-2');
                    }else{
                        $r[0].checked = true;
                        $st.text("关闭服务预约");
                        Common.lhpShortMessage({msg:"开启成功",top:"45%"});
                        Common.sendPoint('WXSF_17-3');
                    }
                }else{
                    ajaxErrorHandle(res);
                }
            },
            error:function(res){
                $.hideIndicator();
                Common.lhpShortMessage({msg:"网络异常",top:"45%"});
            }
        });
    };
    var serviceAppoint = function(){
        var $s = $("#serviceAppoint");
        var $r = $s.find("input[type='checkbox']");
        if($r[0].checked){
            Common.lhpDialog({
                id:"calcelBindDialog",
                top:"25%",
                title:'关闭服务预约？',
                content:'<div style="text-align: center;">关闭预约服务后，则无法进行预约接单<br>是否确认关闭？</div>',
                btn:[
                    {
                        name:'取消'
                    },
                    {
                        name:'确认',
                        callback:function(){
                            doServiceAppoint(0);
                        }
                    }
                ]
            });
        }else{
            doServiceAppoint(1);
        }
    };
    var doCancelBind = function(){
        $.showIndicator();
        $.ajax({
            type:"get",
            dataType:"json",
            url:domain+"/v1/wx/unbind",
            success:function(res){
                $.hideIndicator();
                if(res.code == "s_ok"){
                    Common.lhpShortMessage({msg:"解绑成功",top:"45%"});
                }else{
                    ajaxErrorHandle(res);
                }
            },
            error:function(res){
                $.hideIndicator();
                Common.lhpShortMessage({msg:"网络异常",top:"45%"});
            }
        });
    };
    var cancelBind = function(){
        Common.lhpDialog({
            id:"calcelBindDialog",
            top:"25%",
            title:'是否解除微信绑定？',
            content:'<div style="text-align: center;">解除绑定后无法使用微信接收通知、自动登录等功能，重新登录后自动开启绑定<br>是否确认解除绑定？</div>',
            btn:[
                {
                    name:'取消'
                },
                {
                    name:'确认',
                    callback:function(){
                        Common.sendPoint('WXSF_17-5');
                        doCancelBind();
                    }
                }
            ]
        });
    };
    //预约服务开启关闭
    $("#serviceAppoint").clickEvent(serviceAppoint);
    //取消微信绑定
    $("#btnCancelBind").clickEvent(cancelBind);
    //修改密码
    $("#modifyPassword").clickEvent(function(){
        Common.sendPoint('WXSF_17-4');
        return $.router.loadPage("#page-modifyPsw");
    });
};
PageInit.prototype.setSleepTime = function(){
    var $st = $("#sleepTime");
    var $picker = $("#page-setSleepTime .picker-modal");
    var pre_times = "";
    //保存设置休息日
    var save = function(times){
        Common.sendPoint('WXSF_16-2');
        $.showIndicator();
        $.ajax({
            type:"post",
            dataType:"json",
            data:{rest_times:times},
            url:domain+"/v1/shoper/setRestTime",
            success:function(res){
                $.hideIndicator();
                if(res.code == "s_ok"){
                    pre_times = times;
                    Common.lhpShortMessage({msg:res.msg,top:"45%"});
                }else{
                    ajaxErrorHandle(res);
                }
            },
            error:function(res){
                $.hideIndicator();
                Common.lhpShortMessage({msg:"网络异常",top:"45%"});
            }
        });
    };
    //显示日历
    var show = function(timeArr){
        timeArr = timeArr || [];
        //用户每次只能选取大于当前日期小于当月最后一天时间
        var date = new Date(),
            year = date.getFullYear(),
            month = (date.getMonth()+1),
            dataFormat = "yyyy-MM-dd";
        var _date = new Date(year,month,0);
        var maxDate = year+"-"+month+"-"+_date.getDate();
        pre_times = timeArr.join(',');  //上一次设置的时间
        var pre_date = date.getTime()-24*3600*1000;
        $st.calendar({
            container:"#page-setSleepTime",
            closeOnSelect:false,
            minDate:new Date(pre_date).format(dataFormat),
            maxDate:maxDate,
            dateFormat: dataFormat,
            multiple:true,
            value:timeArr,
            onChange: function(p, v, d) {
                var times = v.join(",");
                if(pre_times !== times){
                    save(times);
                }
                return false;
            }
        }).trigger("click");
        $("#page-setSleepTime").append('<p style="margin-top:70px;font-size:0.7rem;color: #AEAEAE;text-align: center" id="settingTip">'+DATA.setSleepTime_tip+'</p>');
    };
    //移除
    var remove = function(){
        $picker.length > 0 && $picker.remove();
        var $st = $("#settingTip");
        $st.length > 0 && $st.remove();
    };

    +function(){
        remove();
        //获取用户已经设置的当月休息日
        var date = new Date();
        $.showIndicator();
        $.ajax({
            type:"post",
            dataType:"json",
            async:false,
            data:{time:date.getFullYear()+"-"+(date.getMonth()+1)},
            url:domain+"/v1/shoper/getRestTimes",
            success:function(res){
                $.hideIndicator();
                if(res.code == "s_ok"){
                    var r = res.result;
                    show(r.rest_times);
                }else{
                    ajaxErrorHandle(res);
                }
            },
            error:function(res){
                $.hideIndicator();
                Common.lhpShortMessage({msg:"网络异常",top:"45%"});
            }
        });
    }();
};
PageInit.prototype.orderList = function(){
    if(!DATA.index_click_to_orderList){//默认加载第一个Tab数据
        new Order(sessionStorage.getItem("order_type") || 1);
    }
};
PageInit.prototype.orderDetails = function(){
    if(!DATA.order_click_to_details){  //页面刷新，默认加载
        new OrderDetails();
    }
};
PageInit.prototype.myInfo = function(){
    //初始化用户个人信息
    var ui = new UserInfo();
    //修改用户个人简介
    $("#btnModifyIntro").clickEvent(ui.modifyIntro);
};
PageInit.prototype.modifyPsw = function(){
    //获取验证码
    var $page = $("#page-modifyPsw");
    var gac = new GetAuthCode($("#mobile_forget"),$page,2);
    $("#forget_getAuthCode").clickEvent(function(){
        if(mobileValid($page)){
            var obj = $page.find(".get-auth-code")[0];
            gac.sendAjax(obj);
        }
    });

    //确认新密码
    $("#forget_btnConfirm").clickEvent(modify_setNewPsw);
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
    //加载日期
    $(document).on("pageInit", function() {
        var pi = new PageInit();
        DATA.currentPage = location.hash?location.hash.replace("#",""):"page-index";
        if(DATA.currentPage == "page-index"){
           pi.index();
        }else if(DATA.currentPage === "page-setSleepTime"){  //设置日期
            pi.setSleepTime();
        }else if(DATA.currentPage === "page-orderList"){  //订单详情
            pi.orderList();
        }else if(DATA.currentPage === "page-orderDetails"){  //订单详情
            pi.orderDetails();
        }else if(DATA.currentPage === "page-myInfo"){  //我的资料
            pi.myInfo();
        }else if(DATA.currentPage === "page-modifyPsw"){
            pi.modifyPsw();
        }else if(DATA.currentPage === "page-setting"){
            pi.setting();
        }
    });
    $.init();
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
    //分享到朋友圈
    wx.onMenuShareTimeline({
        title: '小白用车商户端', // 分享标题
        link: domain+"/h5_masterclient/index.html?mobile="+sessionStorage.getItem("mobile"), // 分享链接
        imgUrl:domain+'/h5_masterclient/img/login_logo_icon.png', // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    //分享给朋友
    wx.onMenuShareAppMessage({
        title: '小白用车商户端', // 分享标题
        desc: '小白用车商户端', // 分享描述
        link: domain+"/h5_masterclient/index.html?mobile="+sessionStorage.getItem("mobile"), // 分享链接
        imgUrl: domain+'/h5_masterclient/img/login_logo_icon.png', // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
});
/*********************************微信接口*************end***********************/
