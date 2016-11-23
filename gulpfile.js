'use strict';

const gulp = require('gulp'),
      plugins = require('gulp-load-plugins')(),
      minifier = require('gulp-uglify/minifier'),
      uglifyjs = require('uglify-js'),
      runSequence = require('run-sequence');

const tsProject = plugins.typescript.createProject('tsconfig.json');

gulp.task('compile', () => {
    return gulp.src('src/**/*.ts')
        .pipe(plugins.sourcemaps.init())
        .pipe(tsProject()).js
        .pipe(plugins.sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});

gulp.task('bundle', ['compile'], () => {
    return plugins.systemjsBuilder('./', './system.config.js')
        .bundle('[./dist/**/*.js]', 'zbuffer.js', { minify: true, sourceMaps: true, sourceMapContents: true })
        // .pipe(minifier({}, uglifyjs))
        .pipe(gulp.dest('./'));
});

gulp.task('server', () => {
    return plugins.connect.server({
        root: '.',
        livereload: true,
        host: '0.0.0.0'
    });
});

gulp.task('reload-script', ['bundle'], () => {
    return gulp.src('./zbuffer.js')
        .pipe(plugins.connect.reload());
});

gulp.task('reload-html', () => {
    return gulp.src(['*.html', 'templates/*.html'])
        .pipe(plugins.connect.reload());
});

gulp.task('reload-style', () => {
    return gulp.src('stylesheets/**/*.css')
        .pipe(plugins.connect.reload());
});

gulp.task('watch', () => {
    gulp.watch('src/**/*.ts', ['reload-script']);
    gulp.watch(['*.html', 'templates/*.html'], ['reload-html']);
    gulp.watch('stylesheets/**/*.css', ['reload-style']);
});

gulp.task('default', (done) => {
    runSequence('bundle', ['watch', 'server'], done);
});
