(function() {
	'use strict';

	angular
		.module('ngStickyNotes')
		.provider('colorsPaletteProvider', function colorsPaletteProvider() {

			var colorsPalette = ['#ffc', '#cfc', '#ccf'];

			this.setCustomColors = function (newColorsPalette) {
				colorsPalette = newColorsPalette;
			};
			this.$get = function () {
				var next = -1;
				return {
					nextColor: function () {
						next++;
						if(colorsPalette.length === next) {
							next = 0;
						}
						return colorsPalette[next];
					}
				};
			};
		});

})();