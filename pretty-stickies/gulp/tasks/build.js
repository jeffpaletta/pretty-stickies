var gulp        = require('gulp');
var config      = require('../config');
var runSequence = require('run-sequence');

gulp
	.task('build:debug', function(callback) {
		runSequence('clean', 'styles', 'compile:debug', function() {
			return callback();
		});
	})
	.task('build', function(callback) {
		runSequence('clean', 'styles', 'compile', 'assets', function(){
			return callback();
		});
	});