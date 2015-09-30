var gulp = require('gulp');

gulp.task('log', function () {
    console.log('hello gulp!')
});

gulp.task('copy', function () {
    // copies the angular file into the scripts folder
    gulp.src('node_modules/angular/angular.js')
        .pipe(gulp.dest('public/scripts'));
    
})