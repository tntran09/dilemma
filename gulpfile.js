var gulp = require('gulp');
var concat = require('gulp-concat');
// gulp-sourcemaps

gulp.task('hello', function () {
    console.log('hello gulp!')
});

gulp.task('copy_scripts', function () {
    // jquery, angular, bootstrap scripts
    var scripts = [
        'node_modules/jquery/dist/jquery.js',
        'node_modules/angular/angular.js',
        'node_modules/angular-route/angular-route.js',
        'node_modules/bootstrap/dist/js/bootstrap.js',
        'node_modules/angular-ui-bootstrap/ui-bootstrap-tpls.js',
        'node_modules/bootstrap-slider/js/bootstrap-slider.js'
    ];
    // jquery, angular, bootstrap scripts, minified
    var minScripts = [
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/angular/angular.min.js',
        'node_modules/angular-route/angular-route.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
        'node_modules/angular-ui-bootstrap/ui-bootstrap-tpls.min.js',
        'node_modules/bootstrap-slider/dist/bootstrap-slider.min.js'
    ];

    gulp.src(scripts)
        .pipe(concat('third.js'))
        .pipe(gulp.dest('public/scripts'));
    gulp.src(minScripts)
        .pipe(concat('third.min.js'))
        .pipe(gulp.dest('public/scripts'));
});

gulp.task('copy_styles', function () {
    // bootstrap and theme stylesheets
    var styles = [
        'node_modules/bootstrap/dist/css/bootstrap.css',
        'node_modules/bootstrap/dist/css/bootstrap-theme.css'
    ];
    // bootstrap and theme stylesheets, minified
    var minStyles = [
        'node_modules/bootstrap/dist/css/bootstrap.min.css',
        'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
    ];

    gulp.src(styles)
        .pipe(concat('bootstrap.css'))
        .pipe(gulp.dest('public/styles'));
    gulp.src(minStyles)
        .pipe(concat('bootstrap.min.css'))
        .pipe(gulp.dest('public/styles'));
})

gulp.task('bootstrap-slider', function () {
    gulp.src('node_modules/bootstrap-slider/dist/css/bootstrap-slider.css ')
        .pipe(gulp.dest('public/styles'));

    gulp.src('node_modules/bootstrap-slider/dist/css/bootstrap-slider.min.css')
        .pipe(gulp.dest('public/styles'));
})

gulp.task('copy_fonts', function () {
    gulp.src('node_modules/bootstrap/dist/fonts/*')
        .pipe(gulp.dest('public/fonts'));
})

gulp.task('copy', ['copy_scripts', 'copy_styles', 'bootstrap-slider', 'copy_fonts']);
gulp.task('default', ['hello']);