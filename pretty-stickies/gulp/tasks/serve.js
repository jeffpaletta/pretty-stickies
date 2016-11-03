var gulp        = require('gulp');
var config      = require('../config');
var browserSync = require('browser-sync').create();
var modRewrite = require('connect-modrewrite');
var runSequence = require('run-sequence');
var middleware = [
	modRewrite([
		'!\\.\\w+$ /index.html [L]'
	])
];

gulp
	.task('serve:debug', ['build:debug'], function(callback) {
		browserSync.init({
			server: {
				startPath: "index-dev.html",
				baseDir: [config.dist, config.src],
				middleware: middleware
			}
		});
		gulp.watch(config.scripts, ['compile:debug']).on('change', browserSync.reload);
		gulp.watch(config.templates, ['compile:debug']).on('change', browserSync.reload);
		gulp.watch(config.html, ['compile:debug']).on('change', browserSync.reload);
		gulp.watch(config.src + '/styles/**/*.scss', ['styles']).on('change', function(){
			setTimeout(browserSync.reload, 1000);
		});
		return callback();
	})
	.task('serve', ['build'], function(callback) {
		browserSync.init({
			server: {
				baseDir: [config.dist, config.src],
				middleware: middleware
			}
		});
		gulp.watch(config.scripts, ['compile']).on('change', browserSync.reload);
		gulp.watch(config.templates, ['compile']).on('change', browserSync.reload);
		gulp.watch(config.html, ['compile']).on('change', browserSync.reload);
		gulp.watch(config.styles, ['styles']).on('change', browserSync.reload);
		gulp.watch(config.assets, ['assets']).on('change', browserSync.reload);
		return callback();
	});