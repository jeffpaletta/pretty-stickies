var gulp            = require('gulp');
var config          = require('../config');
var inject          = require('gulp-inject');
var ngAnnotate      = require('gulp-ng-annotate');
var ngFileSort      = require('gulp-angular-filesort');
var ngTemplateCache = require('gulp-angular-templatecache');
var concat          = require('gulp-concat');
var uglify          = require('gulp-uglify');
var useref          = require('gulp-useref');
var gulpif          = require('gulp-if');
var minifyCss       = require('gulp-minify-css');
var minifyHTML      = require('gulp-minify-html');
var series          = require('stream-series');

function ngScripts() {
	return gulp.src(config.scripts)
		.pipe(ngFileSort());
}

function ngTemplates() {
	return gulp.src(config.templates)
		.pipe(ngTemplateCache(config.templatesOptions))
		.pipe(gulp.dest(config.src));
}

gulp
	.task('compile:debug', function() {
		return gulp.src(config.html)
			.pipe(
				inject(
					series(ngScripts()),
					{ignorePath: config.src.replace(/^(\.\/)/m, '')})
			)
			.pipe(gulp.dest(config.dist));
	})
	.task('compile', function() {
		return gulp.src(config.html)
			.pipe(
				inject(
					series(ngScripts(), ngTemplates()),
					{ignorePath: config.src.replace(/^(\.\/)/m, '')}
				)
			)
			.pipe(useref())
			.pipe(gulpif('scripts/**.js', ngAnnotate()))
			.pipe(gulpif('*.js', uglify()))
			.pipe(gulpif('*.css', minifyCss()))
			/*.pipe(gulpif('*.html', minifyHTML({
				empty: true,
				conditionals: true,
				spare: true
			})))*/
			.pipe(gulp.dest(config.dist));
	});
