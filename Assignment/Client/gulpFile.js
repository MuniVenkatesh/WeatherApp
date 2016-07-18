var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');

gulp.task('browserify',function(){
    browserify('./src/js/main.js')
        .transform('reactify')
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('final/js')) //we don't need to create this folder gulp will auto create this
});

//Then we create copy task

gulp.task('copy',function(){
    gulp.src('src/*.html')
        .pipe(gulp.dest('final'));
    gulp.src('src/css/*.*')
        .pipe(gulp.dest('final/css'));
    gulp.src('src/js/vendors/*.*')
        .pipe(gulp.dest('final/js'));
});

gulp.task('default',['browserify','copy'],function(){
    return gulp.watch('src/**/*.*',['browserify','copy']);
});
