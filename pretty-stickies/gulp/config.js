var ngModule = 'ngStickyNotes';
var src  = './src';
var dist = './dist';

module.exports = {
	src: src,
	dist: dist,
	assets: [
		src + '/fonts/**',
		src + '/images/**'
	],
	scripts: src + '/scripts/**/*.js',
	templates: src + '/scripts/**/*.html',
	templatesOptions: {
		module: ngModule,
		transformUrl: function (url) {
			return 'scripts/' + url;
		}
	},
	styles: src + '/styles/main.scss',
	html: src + '/*.html'
};