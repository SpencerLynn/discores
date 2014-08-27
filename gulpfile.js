var gulp    = require('gulp'),
    jshint  = require('gulp-jshint'),
    stylish = require('jshint-stylish'); 

gulp.task('jshint', function(){
  gulp.src('app/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter(stylish));
});

gulp.task('default', function(){
  gulp.start('jshint');
});
