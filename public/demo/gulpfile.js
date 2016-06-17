/**
 * gulp config
 * @type {any|*}
 * gulp gulp-rev gulp-rev-collector gulp-html-minify gulp-uglify gulp-clean-css gulp-concat del
 */

const CONFIG = {
    env:'test'
    // env:'product'
};

//是否是开发或测试环境
function isDev() {
    return CONFIG.env === "test" || CONFIG.env === 'dev';
}

var gulp = require('gulp');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');  //静态资源MD5文件名
var htmlminify = require("gulp-html-minify");  //html压缩
// var obfuscate = require('gulp-obfuscate');  //代码混淆
// var filter = require('gulp-filter');  //过滤  不适用,filter会导致watch任务出错
var uglify = require('gulp-uglify');  //压缩JS
var cleanCss = require('gulp-clean-css');  //压缩CSS
var concat = require('gulp-concat');  //合并资源
var del = require('del');  //删除模块
// var Q = require('q');


const PATH = {
    output:'weizhi/release',
    html_input:'system/weizhi/html/*.html',
    html_output:'system/weizhi/view/',  //html输出
    html:['system/weizhi/html/*.html'],
    js:['weizhi/script/*.js'],
    css:['weizhi/style/*.css'],
    img:['img/*'],
    rev:'weizhi/release/rev'
};


gulp.task('img', function() {
    return gulp.src(PATH.img)
        //.pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest(PATH.output+'/img'));
});

gulp.task('css', function () {
    del.sync([PATH.output+'/style']);
    if(!isDev()){
        return gulp.src(PATH.css)
            .pipe(cleanCss())
            .pipe(rev())
            .pipe(gulp.dest(PATH.output+'/style'))
            .pipe( rev.manifest() )
            .pipe( gulp.dest( PATH.rev+'/css'));
    }
});

gulp.task('js', function () {
    del.sync([PATH.output+'/script']);
    if(!isDev()){
        return gulp.src(PATH.js)
            .pipe(uglify())
            .pipe(rev())
            .pipe(gulp.dest(PATH.output+'/script'))
            .pipe(rev.manifest() )
            .pipe(gulp.dest( PATH.rev+'/js'));
    }
});

gulp.task('html',['css','js'], function () {
    del.sync([PATH.html_output]);
    if(isDev()){
        return gulp.src([PATH.html_input])
            .pipe( gulp.dest(PATH.html_output))
    }else{
        return gulp.src([PATH.rev+'/**/*.json', PATH.html_input])
            .pipe(revCollector({
                replaceReved: true,  //在模板文件中能够替换已经替换了的链接,默认false
                dirReplacements: {
                    'style': 'release/style',
                    'script': 'release/script'
                }
            }))
            .pipe(htmlminify())
            .pipe( gulp.dest(PATH.html_output))
    }
});

/****************************************
 * *********** 以下是文件监控 *************
 ****************************************/
//css,js文件变动
gulp.task('css_js_change',['css','js','html']);
//html文件变动
gulp.task('html_change', function () {
    del.sync([PATH.html_output]);
    if(isDev()){
        gulp.src([PATH.html_input])
            .pipe( gulp.dest(PATH.html_output));
    }else{
        gulp.src([PATH.rev+'/**/*.json', PATH.html_input])
            .pipe(revCollector({
                replaceReved: true,  //在模板文件中能够替换已经替换了的链接,默认false
                dirReplacements: {
                    'style': 'release/style',
                    'script': 'release/script'
                }
            }))
            .pipe(htmlminify())
            .pipe(gulp.dest(PATH.html_output));
    }
});
gulp.task('watch',function () {
    // gulp.watch(PATH.css.concat(PATH.js),['css_js_change']);
    gulp.watch(PATH.html,['html_change']);
    gulp.watch(PATH.css.concat(PATH.js).concat(PATH.html), function(event) {
        console.log('File --> ' + event.path + ' was ' + event.type);
    });
});


if(isDev()){
    gulp.task('default',['css','js','html','watch']);
}else{
    gulp.task('default',['css','js','html']);
}
