var gulp = require('gulp');
var markdown = require('gulp-markdown');
var markdownpdf = require('gulp-markdown-pdf');

gulp.task('readme:html', function () {
    return gulp.src('Readme.md')
        .pipe(markdown())
        .pipe(gulp.dest('docs'));
});

gulp.task('readme:pdf', function () {
    return gulp.src('Readme.md')
        .pipe(markdownpdf())
        .pipe(gulp.dest('docs'));
});

gulp.task('readme', ['readme:html', 'readme:pdf']);