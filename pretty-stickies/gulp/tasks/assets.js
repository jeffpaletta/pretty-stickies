var gulp = require('gulp');
var config = require('../config');

function getSources() {
	return gulp.src(config.assets, {base: config.src});
}

gulp
	.task('assets', function(){
		return getSources()
			.pipe(gulp.dest(config.dist));
	});
