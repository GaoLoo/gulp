var gulp = require('gulp');
var connect = require('gulp-connect'); // 热更新
var removeEmptyLines = require('gulp-remove-empty-lines'); //清除空白行
var gulpRemoveHtml = require('gulp-remove-html'); //标签清除，
var rev = require('gulp-rev'); //对文件名加MD5后缀
var uglify = require('gulp-uglify'); //js文件压缩
var minifyCss = require('gulp-minify-css'); //压缩CSS为一行；
var autoprefixer = require('gulp-autoprefixer');
var htmlmin = require('gulp-htmlmin'); //html压缩组件
var clean = require('gulp-clean'); //清除文件插件，参考：https://github.com/teambition/gulp-clean
var buildBasePath = 'dist/'; //构建输出的目录
var replace = require('gulp-replace'); //文件名替换，参考：https://www.npmjs.com/package/gulp-replace
var imageMin = require('gulp-imagemin');// 图片压缩
var cssFormat = require('gulp-css-format');
var revCollector = require('gulp-rev-collector');
var moment = require('moment')
var gulpSequence = require('gulp-sequence');
const zip = require('gulp-zip'); // gizp
var jsSrc = 'js/*.js';
var htmlSrc = '*.html';

// dev
gulp.task('js', function () {
  gulp
    .src(jsSrc)
    .pipe(connect.reload())
});
// dev
gulp.task('html', function () {
  gulp
    .src(htmlSrc)
    .pipe(connect.reload());
});
// dev
gulp.task('connect', function () {
  connect.server({livereload: true});
});
// dev
gulp.task('watch', function () {
  gulp.watch('*.html', ['html']);
  gulp.watch('html/**/*.html', ['html']);
  gulp.watch('js/*.js', ['js']);
});

//删除dist文件
gulp.task('build:clean', function (cb) {
  return gulp
    .src('dist', {read: false})
    .pipe(clean());
});
// 压缩js
gulp.task('build:minifyjs', function () {
  return gulp
    .src('js/**/*.js')
    .pipe(uglify()) //压缩js到一行
    .pipe(rev()) //文件名加MD5后缀
    .pipe(gulp.dest(buildBasePath + 'js')) //输出到js目录
    .pipe(rev.manifest('rev-js-manifest.json')) ////生成一个rev-manifest.json
    .pipe(gulp.dest('rev')); //将 rev-manifest.json 保存到 rev 目录内
});

//css
gulp.task('build:minifycss', function () {
  return gulp
    .src('css/**/*.css')
    .pipe(autoprefixer()) // 添加浏览器前缀
    .pipe(cssFormat({indent: 0, hasSpace: false}))
    .pipe(minifyCss()) //压缩css到一样
    .pipe(rev()) //文件名加MD5后缀
    .pipe(gulp.dest(buildBasePath + 'css')) //输出到css目录
    .pipe(rev.manifest('rev-css-manifest.json')) //生成一个rev-manifest.json
    .pipe(gulp.dest('rev')); //将 rev-manifest.json 保存到 rev 目录内

});

gulp.task('build:minifyimg', function () {
  return gulp
    .src(['img/**/*.jpg', 'img/**/*.png', 'img/**/*.gif'])
    .pipe(imageMin({progressive: true}))
    .pipe(rev()) //文件名加MD5后缀
    .pipe(gulp.dest(buildBasePath + 'img')) //输出到css目录
    .pipe(rev.manifest('rev-img-manifest.json')) //生成一个rev-manifest.json
    .pipe(gulp.dest('rev')); //将 rev-manifest.json 保存到 rev 目录内
});

gulp.task('revHtmlCss', function () {
  return gulp
    .src([
    './rev/rev-css-manifest.json', buildBasePath + '*.html'
  ])
    .pipe(revCollector()) //替换html中对应的记录
    .pipe(gulp.dest(buildBasePath)); //输出到该文件夹中
});
gulp.task('revHtmlJs', function () {
  return gulp
    .src([
    './rev/rev-js-manifest.json', buildBasePath + '*.html'
  ])
    .pipe(revCollector()) //替换html中对应的记录
    .pipe(gulp.dest(buildBasePath)); //输出到该文件夹中
});
gulp.task('revHtmlImg', function () {
  return gulp
    .src([
    './rev/rev-img-manifest.json', buildBasePath + '*.html'
  ])
    .pipe(revCollector()) //替换html中对应的记录
    .pipe(gulp.dest(buildBasePath)); //输出到该文件夹中
});

// html
gulp.task('build:html', function () {
  var options = {
    removeComments: true, //清除HTML注释
    collapseWhitespace: false, //压缩HTML
    collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
    minifyJS: true, //压缩页面JS
    minifyCSS: true //压缩页面CSS
  };
  return gulp
    .src('*.html')
    .pipe(gulpRemoveHtml()) //清除特定标签
    .pipe(removeEmptyLines({removeComments: true})) //清除空白行
    .pipe(htmlmin(options))
    .pipe(gulp.dest(buildBasePath));
});
gulp.task('build:template', function () {
  var options = {
    removeComments: true, //清除HTML注释
    collapseWhitespace: false, //压缩HTML
    collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
    minifyJS: true, //压缩页面JS
    minifyCSS: true //压缩页面CSS
  };
  return gulp
    .src('template/*.html')
    .pipe(gulpRemoveHtml()) //清除特定标签
    .pipe(removeEmptyLines({removeComments: true})) //清除空白行
    .pipe(htmlmin(options))
    .pipe(gulp.dest(buildBasePath + 'template'));
});

gulp.task('gzip', () =>
    gulp.src(buildBasePath+'**/**')
        .pipe(zip('dist-'+moment().format('YYYYMMDDhhmmss')+'.zip'))
        .pipe(gulp.dest('./'))
);

gulp.task('default', ['js', 'html', 'watch', 'connect']);
gulp.task('build', function (cb) {
  gulpSequence('build:clean', 'build:html', 'build:template', 'build:minifycss', 'build:minifyjs','build:minifyimg', 'revHtmlCss','revHtmlJs','revHtmlImg','gzip','build:clean')(cb)
});
