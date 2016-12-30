/**
 * Created by gao on 2016/12/30.
 */

var gulp = require('gulp'),
    less = require('gulp-less');

//定义一个testLess任务（自定义任务名称）
gulp.task('testLess', function () {
    gulp.src('less/*.less')
        .pipe(less())
        .pipe(gulp.dest('dest/'));
});

gulp.task('default',['testLess']);
