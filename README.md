‘’‘js
gulp.src(globs[, options])
’‘’
src方法是指定需要处理的源文件的
1.2、globs：  需要处理的源文件匹配符路径。类型(必填)：String or StringArray；
通配符路径匹配示例：
“src/a.js”：指定具体文件；
“*”：匹配所有文件    例：src/*.js(包含src下的所有js文件)；
“**”：匹配0个或多个子文件夹    例：src/**/*.js(包含src的0个或多个子文件夹下的js文件)；
“{}”：匹配多个属性    例：src/{a,b}.js(包含a.js和b.js文件)  src/*.{jpg,png,gif}(src下的所有jpg/png/gif文件)；
“!”：排除文件    例：!src/a.js(不包含src下的a.js文件)；
```js
var gulp = require('gulp'),
less = require('gulp-less');

gulp.task('testLess', function () {
//gulp.src('less/test/style.less')
gulp.src(['less/**/*.less','!less/{extend,page}/*.less'])
.pipe(less())
.pipe(gulp.dest('./css'));
});
```
