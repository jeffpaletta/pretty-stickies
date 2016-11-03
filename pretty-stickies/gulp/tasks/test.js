var gulp = require('gulp');
var Karma = require('karma').Server;
var configFile = '../../../karma.conf.js';

gulp
	.task('test:debug', function (done) {
		return new Karma({
			configFile: configFile,
			singleRun: false
		}, done).start();
	})
	.task('test', function (done) {
		return new Karma({
			configFile: configFile,
			singleRun: true,
			browsers: ['PhantomJS']
		}, done).start();
	});
