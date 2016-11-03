var gulp    = require('gulp');
var config  = require('../config');
var sass    = require('gulp-sass');
var cssPref = require('gulp-autoprefixer');

gulp
	.task('styles', function () {
		return gulp.src(config.styles)
			.pipe(sass())
			.pipe(cssPref({
				browsers: ['ie >= 8', 'chrome >= 28', 'safari >= 6'],
				remove: false
			}))
			.pipe(gulp.dest(config.src + '/styles'));
	});
