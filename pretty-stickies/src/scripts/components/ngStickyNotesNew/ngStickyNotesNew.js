(function() {
    'use strict';

    angular
        .module('ngStickyNotes')
        .directive('ngStickyNotesNew', function () {
            return {
                scope: {
                    color: '@'
                },
                templateUrl: 'scripts/components/ngStickyNotesNew/ngStickyNotesNew.html',
                controller: function ($scope, sharedNotes, $rootScope) {
                    $scope.new = function (stickyItem) {
                        if($scope.color) {
                            stickyItem.color = $scope.color;
                        }
                        $rootScope.$broadcast('ngStickyNotes.New', stickyItem);
                    };
                }
            }
        });

})();