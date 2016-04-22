/**
 * Created by lihaipeng on 15-10-30.
 */
var DATA = {
    hotTags:[
        {name:'HTML',url:''},
        {name:'CSS',url:''},
        {name:'HTML5',url:''},
        {name:'CSS3',url:''},
        {name:'less',url:''},
        {name:'sass',url:''},
        {name:'Bootstrap',url:''},
        {name:'Gulp',url:''},
        {name:'AngularJS',url:''},
        {name:'Node.js',url:''},
        {name:'Express',url:''},
        {name:'Apache',url:''},
        {name:'Nginx',url:''},
        {name:'nosql',url:''},
        {name:'Mongodb',url:''},
        {name:'ReactJS',url:''},
        {name:'Webpack',url:''},
        {name:'F.I.S',url:''},
        {name:'前端模块化',url:''},
        {name:'前端自动化',url:''}
    ]
};
//显示热门标签
var showTags = function(){
    var arr = [];
    $.each(DATA.hotTags,function(){
        arr.push('<a target="_blank" href="'+(this.url?this.url:"https://www.baidu.com/s?wd="+this.name)+'" style="color:'+Common.getRandomColor()+'">'+this.name+'</a>');
    });
    $("#tagCloud").html(arr.join(''));
    $(".tag-cloud").tagCloud();
};
//slider init
var sliderInit = function(){
    var cuteslider3 = new Cute.Slider();
    cuteslider3.setup("cuteslider_3", "cuteslider_3_wrapper", "/public/slider/css/slider-style.css");
    cuteslider3.api.addEventListener(Cute.SliderEvent.CHANGE_START, function (event) {
    });
    cuteslider3.api.addEventListener(Cute.SliderEvent.CHANGE_END, function (event) {
    });
    cuteslider3.api.addEventListener(Cute.SliderEvent.WATING, function (event) {
    });
    cuteslider3.api.addEventListener(Cute.SliderEvent.CHANGE_NEXT_SLIDE, function (event) {
    });
    cuteslider3.api.addEventListener(Cute.SliderEvent.WATING_FOR_NEXT, function (event) {
    });
};
$(function(){
    //
    showTags();
    //
    sliderInit();

    //window
    window.onload = function(){
        $.AMUI.progress.done();
    }
});