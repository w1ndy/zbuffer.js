'use strict';

const gulp = require('gulp'),
      plugins = require('gulp-load-plugins')(),
      minifier = require('gulp-uglify/minifier'),
      uglifyjs = require('uglify-js'),
      runSequence = require('run-sequence');

const tsProject = plugins.typescript.createProject('tsconfig.json');

gulp.task('compile', () => {
    return gulp.src('src/**/*.ts')
        .pipe(tsProject()).js
        .pipe(gulp.dest('dist'));
});

gulp.task('bundle', ['compile'], () => {
    return plugins.systemjsBuilder('./', './system.config.js')
        .bundle('[./dist/**/*.js]')
        .pipe(minifier({}, uglifyjs))
        .pipe(plugins.rename('zbuffer.js'))
        .pipe(gulp.dest('./'))
});

gulp.task('server', () => {
    return plugins.connect.server({
        root: '.',
        livereload: true
    });
});

gulp.task('reload-script', ['bundle'], () => {
    return gulp.src('./*.js')
        .pipe(plugins.connect.reload());
});

gulp.task('reload-html', () => {
    return gulp.src('./*.html')
        .pipe(plugins.connect.reload());
});

gulp.task('watch', () => {
    gulp.watch('src/**/*', ['reload-script']);
    gulp.watch('*.html', ['reload-html']);
});

gulp.task('default', (done) => {
    runSequence('bundle', ['watch', 'server'], done);
});
