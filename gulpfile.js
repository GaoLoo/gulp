var gulp = require('gulp'),
  connect = require('gulp-connect'),
  less = require('gulp-less');
 
gulp.task('connect', function() {
  connect.server({
    root: './',
    livereload: true
  });
});
 
gulp.task('html', function () { 
  gulp.src('*.html')
    .pipe(connect.reload());
});
gulp.task('watch', function () {
  gulp.watch(['*.html'], ['html']);
});
gulp.task('less',function(){
    gulp.src('./css/*.less')
        .pipe(less())
        .pipe(gulp.dest('css/'))
        .pipe(connect.reload());
        
})
gulp.task('watchLess',function(){
    gulp.watch(['./css/*.less'],['less'],['html']);
})
gulp.task('default', ['connect', 'watch','watchLess']);

