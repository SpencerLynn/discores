var gulp    = require('gulp'),
    jshint  = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    jasmine = require('gulp-jasmine');

gulp.task('jasmine', function(){
  gulp.src('spec/**/*.js')
      .pipe(jasmine());
});

gulp.task('jshint', function(){
  gulp.src(['app/**/*.js', "lib/**/*.js"])
      .pipe(jshint())
      .pipe(jshint.reporter(stylish));
});

gulp.task('default', function(){
  gulp.start('jshint', 'jasmine');
});
