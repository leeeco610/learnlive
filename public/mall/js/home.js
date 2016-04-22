/**
 * Created by lihaipeng on 15/12/22.
 */
/***************************
 *  加载数据
 **************************/
function LoadData(){
    this.$page = $("#page-index");
    this.loading = false;
    this.maxItems = 100;  //最多可以加载的条目数
    this.itemsFirstLoad = 30; //第一次加载的数据条数
    this.itemsPerLoad = 10;  //每次加载的条目数
    this.lastIndex = 0;  //上次加载序号

    this.init();
}
//初始化
LoadData.prototype.init = function(){
    this.addItem(this.itemsFirstLoad,this.lastIndex);

    var self = this;
    $("#topNav").remove();
    //滚动事件
    $("#pageIndexContent").on('scroll',function(){
        var top = $(this).scrollTop();
        var $topNav = $("#topNav");
        if(top >= 204){
            $topNav.length == 0 && self.$page.append(self.getNav());
        }else{
            $topNav.length > 0 && $topNav.remove();
        }
    });

    //无限滚动
    $('#pageIndexContent').on('infinite',function(event,arg2,arg3){debugger;
        if(self.loading) return;

        console.log("-------------");
        //加载中
        self.loading = true;

        setTimeout(function(){
            self.loading = false;
            if(self.lastIndex >= self.maxItems){
                $.detachInfiniteScroll($('.infinite-scroll'));
                $('.infinite-scroll-preloader').remove();
                return false;
            }

            //add
            self.addItem(self.itemsPerLoad,self.lastIndex);
            //更新加载后的序号
            self.lastIndex = $("#list li").length;
            //刷新滚动
            $.refreshScroller();
        },2000);

    });
};
//菜单生成
LoadData.prototype.getNav = function(){
    var arr = [];
    arr.push('<div class="top-nav" id="topNav">');
    arr.push('      <div class="nav-container">');
    arr.push('          <ul>');
    arr.push('                  <li class="on">护肤</li>');
    arr.push('                  <li>面膜</li>');
    arr.push('                  <li>精华</li>');
    arr.push('                  <li>补水</li>');
    arr.push('          </ul>');
    arr.push('          <ul>');
    arr.push('                  <li>眼唇</li>');
    arr.push('                  <li>保湿</li>');
    arr.push('                  <li>T区</li>');
    arr.push('                  <li>洁面</li>');
    arr.push('          </ul>');
    arr.push('      </div>');
    arr.push('</div>');

    return arr.join('');
};
//菜单移除
LoadData.prototype.removeNav = function(){

};
//添加
LoadData.prototype.addItem = function(number,lastIndex){
    var arr = [];
    var index = 1;
    for(var i=lastIndex+1;i <= lastIndex+number;i++){
        arr.push('<li>');
        arr.push('      <img src="img/test_1.jpg">');
        arr.push('      <div class="title">');
        arr.push('          <span class="txt">高姿晶莹透白护肤品套装 爽肤水乳液三件套 美白补水化妆品</span>');
        arr.push('      </div>');
        arr.push('      <div class="price-att">');
        arr.push('          <span class="price">¥119.00</span>');
        arr.push('          <span class="attention">31</span>');
        arr.push('      </div>');
        arr.push('</li>');
        //view
        var $list = $("#list");
        if(index == 5){
            $list.find(".list-l").append(arr.join(''));
            arr = [];
        }else if(index == 10){
            $list.find(".list-r").append(arr.join(''));
        }
        index ++;
    }

    //刷新滚动
    $.refreshScroller();
};


$(function(){
    //swiper
    var swiper = new Swiper('.swiper-container',{
        pagination:'.swiper-pagination',
        paginationClickable:true,
        spaceBetween:30,
        effect:'fade',
        autoplay:3000,
        autoplayDisableOnInteraction:false
    });
    //load data
    var loadData = new LoadData();
});