(function() {
	'use strict';

	angular
		.module('ngStickyNotes')
		.directive('ngStickyNotesClean', function () {
			return {
				templateUrl: 'scripts/components/ngStickyNotesClean/ngStickyNotesClean.html',
				controller: function ($scope, sharedNotes, $rootScope) {
					$scope.removeAll = function () {
						$rootScope.$broadcast('ngStickyNotes.RemoveAll');
					};
				}
			}
		});

})();