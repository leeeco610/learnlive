var gulp = require('gulp');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');  //静态资源MD5文件名
var htmlminify = require("gulp-html-minify");  //html压缩
var obfuscate = require('gulp-obfuscate');  //代码混淆
var filter = require('gulp-filter');  //过滤
var uglify = require('gulp-uglify');  //压缩JS
var minifycss = require('gulp-minify-css');  //压缩CSS
var concat = require('gulp-concat');  //合并资源
var del = require('del');  //删除模块



var cssFilter = filter(['*.css','!*.min.css'],{restore:true});
var jsFilter = filter(['*.js','!*.min.js'],{restore:true});
var projectName = "learnlive";
var PATH = {
    output:'_output/'+projectName,
    html:['*.html'],
    js:['js/**/*.js'],
    css:['css/**/*.css'],
    img:['img/*'],
    rev:'output/rev'
};

gulp.task('img', function() {
    return gulp.src(PATH.img)
        //.pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest(PATH.output+'/img'));
});

gulp.task('css', function () {
    del([PATH.output+'/css']).then(function(){
        return gulp.src(PATH.css)
            .pipe(minifycss())
            .pipe(rev())
            .pipe(gulp.dest(PATH.output+'/css'))
            .pipe( rev.manifest() )
            .pipe( gulp.dest( PATH.rev+'/css'));
    });
});

gulp.task('js', function () {
    del([PATH.output+'/js']).then(function(){
        return gulp.src(PATH.js)
            .pipe(uglify())
            .pipe(rev())
            .pipe(gulp.dest(PATH.output+'/js'))
            .pipe( rev.manifest() )
            .pipe( gulp.dest( PATH.rev+'/js'));
    });
});

gulp.task('html',['css','js'], function () {
    return gulp.src(['output/rev/**/*.json', '*.html'])
        .pipe( revCollector({}))
        .pipe(htmlminify())
        .pipe( gulp.dest(PATH.output) );
});

gulp.task('watch', function(){  // 监视文件的变化
    gulp.watch([PATH.js], ['js','html']);
    gulp.watch([PATH.css], ['css','html']);
});
gulp.task('default',['img','css','js','html','watch']);