var gulp = require('gulp');
var concat = require("gulp-concat");
var requirejsOptimize = require('gulp-requirejs-optimize');
var rename = require('gulp-rename');

gulp.task('build', function () {
    return gulp.src('App/*.js')
        .pipe(requirejsOptimize())
        .pipe(concat('built.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('content', function () {
    return gulp.src(['index.html', 'Content/Styles/app.min.css'], { base: "." })
        .pipe(rename({ dirname: '' }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('libs', function () {
    return gulp.src(['node_modules/three/build/three.min.js', 'Scripts/trackballcontrols.js', 'node_modules/requirejs/require.js'], { base: "." })
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('go', ['build', 'content', 'libs']);