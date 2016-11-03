var gulp = require('gulp');
var del = require('del');
var config = require('../config');
var handleError = require('../util/handleErrors');

gulp
	.task('clean', function(callback) {
		del(config.dist).then(function () {
			callback();
		}, handleError.onError);
	});
