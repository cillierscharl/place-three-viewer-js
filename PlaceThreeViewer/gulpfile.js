var gulp = require('gulp');
var concat = require("gulp-concat");
var requirejsOptimize = require('gulp-requirejs-optimize');

gulp.task('build', function () {
    return gulp.src('App/*.js')
        .pipe(requirejsOptimize())
        .pipe(concat('built.js'))        
        .pipe(gulp.dest('../PlaceThreeServer/dist/'));
});

gulp.task('content', function () {
    return gulp.src('*.html')
        .pipe(gulp.src('./Content/Styles/*.min.css'))
        .pipe(gulp.dest('../PlaceThreeServer/dist/'));
});